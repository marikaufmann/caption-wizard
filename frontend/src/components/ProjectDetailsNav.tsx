import { ArrowLeft, LogOut, User2 } from "lucide-react";
import  { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../hooks/use-app-context";

const ProjectDetailsNav = ({ name }: { name: string }) => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const [userProfilePic, setUserProfilePic] = useState<string>("");

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
  useEffect(() => {
    if (currentUser) {
      setUserProfilePic(currentUser.picture as string);
    }
  }, [currentUser]);

  return (
    <div className="max-w-7xl py-3 sm:px-6 px-2 items-center mx-auto w-full flex  relative">
      <div className="flex md:items-center md:justify-center w-full tracking-wide">
        <div className="text-white/60 font-semibold ">
          <Link
            to="/projects"
            className="hover:text-white/80 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Projects
            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
          </Link>{" "}
        </div>
        {!name ? (
          <span className=" text-white/60 font-semibold">
           ...
          </span>
        ) : (
          <span className="md:max-w-sm sm:max-w-[20rem] max-w-[12rem] truncate overflow-hidden text-white/90 font-semibold">
            {name}
          </span>
        )}
      </div>
      <div className="text-white flex items-center absolute top-3 sm:right-6 right-2">
        {currentUser && currentUser?.picture ? (
          <div className="rounded-full sm:w-6 sm:h-6 w-4 h-4 mr-2  sm:mr-4">
            <img
              src={userProfilePic}
              alt="profile-pic"
              className="w-full h-full rounded-full"
            />
          </div>
        ) : (
          <div className="sm:w-5 sm:h-5 w-4 h-4 sm:mr-4 mr-2">
            <User2 className="w-full h-full rounded-full" />
          </div>
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
  );
};

export default ProjectDetailsNav;
