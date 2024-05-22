import { Outlet, useLocation, useMatch } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
const Layout = () => {
  const location = useLocation();
  const match = useMatch("/projects/:projectId");
  return (
    <div className="min-h-screen w-full bg-[#2c3531] flex flex-col overflow-hidden tracking-wide">
      {location.pathname === "/" && <Header />}
      {location.pathname !== "/" &&
        !match &&
        location.pathname !== "/sign-in" &&
        location.pathname !== "/register" && <Navbar />}
      <Outlet />
      {location.pathname !== "/sign-in" &&
        location.pathname !== "/register" && <Footer />}
    </div>
  );
};

export default Layout;
