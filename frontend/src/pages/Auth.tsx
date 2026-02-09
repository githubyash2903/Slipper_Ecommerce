import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { loginUser, registerUser } from '@/api/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      const backendResponse = response.data;
      const data = backendResponse.data || backendResponse;

      const token = data.token;
      const role = data.role || data.user?.role;

            localStorage.setItem('token', token);
      if (role) localStorage.setItem('role', role);
      toast({
        title: "Welcome back!",
        description: "Login successful."
      });

      const userRole = role ? role.toUpperCase() : "";
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast({
        variant: "destructive",
        title: "Login Error",
        description: errorMessage,
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast({
        title: "Account created!",
        description: "Please log in with your new credentials."
      });
      setIsLogin(true);
      setFormData({ name: '', email: '', password: '', phoneNumber: '' });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  });

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password
      });
    } else {
      registerMutation.mutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneCountryCode: "+91",
        phoneNumber: formData.phoneNumber,
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Join us for exclusive deals and faster checkout'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-12 h-12 rounded-xl"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Phone Number (e.g. 9876543210)"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="pl-12 h-12 rounded-xl"
                    required={!isLogin}
                    disabled={isLoading}
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-12 h-12 rounded-xl"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12 pr-12 h-12 rounded-xl"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', password: '', phoneNumber: '' });
                }}
                className="ml-2 text-primary font-semibold hover:underline"
                disabled={isLoading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-secondary text-center">
            <p className="font-semibold text-foreground mb-2">
              Are you a business?
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Register for wholesale access and get exclusive pricing.
            </p>
            <Link to="/wholesale">
              <Button variant="outline" size="sm">
                Apply for Wholesale
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}