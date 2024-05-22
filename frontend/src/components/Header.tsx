import { Link } from "react-router-dom";
import { useAppContext } from "../hooks/use-app-context";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="w-full   z-10">
      <div className="w-full flex justify-between max-w-7xl py-6 md:px-8 px-4 items-center mx-auto">
        <Link to="/" className="md:h-[28px] h-[22px] w-fit">
          <img src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/logo-no-background.png`} alt="logo" className="h-full" />
        </Link>
        <Link
          to={`${isLoggedIn ? "/projects" : "/sign-in"}`}
          className="bg-primary text-white shadow-primary/40 tracking-wider font-semibold flex min-w-[100px] items-center justify-center md:py-3 md:px-10 py-2 px-8 rounded-lg shadow-2xl hover:bg-primary/80"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Header;
