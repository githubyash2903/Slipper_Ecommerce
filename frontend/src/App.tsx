
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import MenProducts from "./pages/MenProducts";
import WomenProducts from "./pages/WomenProducts";
import KidsProducts from "./pages/kidsProducts";
import Cart from "./pages/Cart";
import Wholesale from "./pages/Wholesale";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import AdminOrders from "./pages/admin/AdminOders";
import AdminCustomers from "./pages/admin/AdminCustomer";
import AppProvider from "./provider/AppProvider";
import Auth from "./pages/Auth";
import AdminEmployees from "./pages/admin/AdminEmployee";
import AdminStockAssignment from "./pages/admin/AdminAssingmentStock";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { useEffect } from "react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/men" element={<MenProducts />} />
        <Route path="/women" element={<WomenProducts />} />
        <Route path="/kids" element={<KidsProducts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wholesale" element={<Wholesale />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/admin/stock-assigment" element={<AdminStockAssignment />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/contact" element= {<Contact />}/>
        <Route path ="/terms" element= {<Terms />}/>
        <Route path = "/faq" element= {<FAQ />}/>
        <Route path = "/returns" element= {<Returns />}/>
        <Route path = "/shipping" element= {<Shipping />}/>
        <Route path = "/privacy" element= {<PrivacyPolicy />}/>

      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;
