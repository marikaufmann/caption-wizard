import { ArrowLeft, LogOut, Repeat, User2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAppContext } from "../hooks/use-app-context";
import * as apiClient from "../api-client";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const { showToast } = useAppContext();

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  const { mutate: logOut } = useMutation(apiClient.logOut, {
    onError: (err: Error) => {
      showToast({ message: err.message, type: "ERROR" });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
    },
  });
  const [userProfilePic, setUserProfilePic] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      setUserProfilePic(currentUser.picture as string);
    }
  }, [currentUser]);

  return (
    <div className="bg-background">
      <div className="max-w-7xl  justify-between py-3 sm:px-6 px-2 items-center mx-auto w-full flex gap-4 sm:gap-10 relative">
        <div className="flex   w-full tracking-wide">
          {location.pathname !== "/projects" && (
            <div className="text-white/60 font-semibold ">
              <Link
                to="/projects"
                className="hover:text-white/80 flex gap-2 items-center"
              >
                <ArrowLeft className="w-4 h-4" />
                Projects
              </Link>{" "}
            </div>
          )}
        </div>

        <div className="flex sm:gap-4 gap-2 items-center ">
          <button aria-label="refresh credits">
            <Repeat className="text-white/80 hover:text-white w-4 h-4" />
          </button>
          <p className="text-white/80  max-sm:text-sm tracking-wide   min-w-[90px]">
            10 credits left
          </p>
          <Link
            to="/subscription"
            className="bg-lightGray min-w-[100px] text-center  shadow-lg py-1 px-3 rounded-lg text-white/80 hover:text-white hover:bg-[#50555b] max-sm:text-sm tracking-wide"
          >
            buy credits
          </Link>
        </div>
        <div className="flex">
          {currentUser && currentUser?.picture ? (
            <Link
              to="/profile/account"
              className="rounded-full sm:w-6 sm:h-6 w-4 h-4 mr-2  sm:mr-4"
            >
              <img
                src={userProfilePic}
                alt="profile-pic"
                className="w-full h-full rounded-full"
              />
            </Link>
          ) : (
            <Link
              to="/profile/account"
              className="sm:w-5 sm:h-5 w-4 h-4 sm:mr-4 mr-2"
            >
              <User2 className="w-full h-full rounded-full" />
            </Link>
          )}
          <button
            onClick={() => logOut()}
            className="flex items-center gap-2 text-white/80 hover:text-white max-sm:text-sm tracking-wide"
            aria-label='logout'
          >
            Logout
            <LogOut className="sm:w-4 sm:h-4 w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
