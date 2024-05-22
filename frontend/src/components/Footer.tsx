import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  return (
    <div className={`w-full ${location.pathname !== "/" && "bg-background"}`}>
      <div className="text-white pt-28 pb-14 md:px-8 px-4 max-w-7xl  mx-auto w-full flex flex-col gap-10">
        <div className="flex justify-between">
          <div className="md:h-[28px] h-[22px] w-fit">
            <Link to="/">
              <img src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/logo-text.png`} alt="logo" className="h-full" />
            </Link>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col gap-10 sm:items-center justify-between">
          <h3 className=" text-white/80  font-semibold tracking-wider">
            @{new Date().getFullYear()} Caption Wizard
          </h3>
          <div className="flex gap-10  sm:pl-24">
            <Link
              to="/terms-of-service"
              className="text-white/90 hover:text-white tracking-wider"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy-policy"
              className="text-white/90 hover:text-white tracking-wider"
            >
              Privacy Policy
            </Link>
            <Link
              to="/refund"
              className="text-white/90 hover:text-white tracking-wider"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
