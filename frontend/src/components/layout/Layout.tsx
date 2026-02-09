import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { ReactNode } from "react";

// 1. Add the '?' to make children optional
interface LayoutProps {
  children?: ReactNode; 
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        {children ? children : <Outlet />}
      </main>
      <Footer />
    </div>
  );
}