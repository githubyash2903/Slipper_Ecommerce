import { createBrowserRouter, Outlet } from "react-router-dom";
import AppProvider from "@/provider/AppProvider";

// Pages
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import MenProducts from "../pages/MenProducts";
import WomenProducts from "../pages/WomenProducts";
import KidsProducts from "../pages/kidsProducts";
import Cart from "../pages/Cart";
import Login from "../pages/Auth";
import Wholesale from "../pages/Wholesale";
import Wishlist from "../pages/Wishlist";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import Index from "@/pages/Index";
import NotFound from "../pages/NotFound";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOders";
import AdminCustomers from "../pages/admin/AdminCustomer";

// Components & Guards
import { RequireAuth } from "./guards/RequireAuth";
import { RequireRole } from "./guards/RequireRole";
import { BlockAuthPages } from "./guards/BlockAuthPages";
import { Layout } from "@/components/layout/Layout";

// 1. Create a Root wrapper to ensure AppProvider wraps EVERYTHING
const RootWrapper = () => {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootWrapper />,
    children: [
      /* -------------------------------------------------------------------------- */
      /* MAIN WEBSITE LAYOUT ROUTES                          */
      /* -------------------------------------------------------------------------- */
      {
        element: <Layout />,
        children: [
          // Public Routes
          { path: "/", element: <Index /> },
          { path: "/products", element: <Products /> },
          { path: "/products/:id", element: <ProductDetail /> },
          { path: "/men", element: <MenProducts /> },
          { path: "/women", element: <WomenProducts /> },
          { path: "/kids", element: <KidsProducts /> },
          { path: "/cart", element: <Cart /> },
          { path: "/wholesale", element: <Wholesale /> },
          { path: "/wishlist", element: <Wishlist /> },

          // Auth Routes (Only accessible if NOT logged in)
          {
            path: "/auth",
            element: <BlockAuthPages />,
            children: [{ index: true, element: <Login /> }],
          },

          // User Protected Routes (Needs Login + "user" role)
          // Nesting them HERE ensures they get the Header/Footer from <Layout />
          {
            element: <RequireAuth />,
            children: [
              {
                element: <RequireRole allowed={["user"]} />,
                children: [
                  { path: "/profile", element: <Profile /> },
                  { path: "/checkout", element: <Checkout /> },
                ],
              },
            ],
          },
        ],
      },

      /* -------------------------------------------------------------------------- */
      /* ADMIN ROUTES                                */
      /* -------------------------------------------------------------------------- */
      {
        path: "/admin",
        element: <RequireAuth />,
        children: [
          {
            element: <RequireRole allowed={["admin"]} />,
            children: [
              // You might want to wrap these in an <AdminLayout> if you have one
              { index: true, element: <AdminDashboard /> },
              { path: "products", element: <AdminProducts /> },
              { path: "orders", element: <AdminOrders /> },
              { path: "customers", element: <AdminCustomers /> },
            ],
          },
        ],
      },

      /* -------------------------------------------------------------------------- */
      /* FALLBACK                                   */
      /* -------------------------------------------------------------------------- */
      { path: "*", element: <NotFound /> },
    ],
  },
]);