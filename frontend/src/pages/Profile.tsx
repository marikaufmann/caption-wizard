import { useAppContext } from "../hooks/use-app-context";
import * as apiClient from "../api-client";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { User2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { UserProfileData } from "../types";
import Loader from "../components/Loader";

const Profile = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const [userProfilePic, setUserProfilePic] = useState<string>("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
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
  const { mutate: deleteAccount, isLoading: isDeleting } = useMutation(
    apiClient.deleteAccount,
    {
      onError: (err: Error) => {
        showToast({ message: err.message, type: "ERROR" });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries("validateToken");
      },
    }
  );
  const { mutate: editUserData, isLoading: isSavingChanges } = useMutation(
    apiClient.editUserData,
    {
      onError: (err: Error) => {
        showToast({ message: err.message, type: "ERROR" });
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("fetchCurrentUser");
        showToast({ message: "Changes saved.", type: "SUCCESS" });
      },
    }
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileData>({
    defaultValues: {
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      email: currentUser?.email,
    },
  });
  const onSubmit = handleSubmit((data: UserProfileData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    editUserData({ formData: formData, userId: currentUser?._id as string });
  });
  useEffect(() => {
    if (currentUser) {
      setUserProfilePic(currentUser.picture as string);
    }
  }, [currentUser]);
  return (
    <div className="bg-background">
      {isDeleteOpen && (
        <div className="inset-0 fixed bg-black/50 w-full flex items-center justify-center">
          <div className="relative max-w-md w-full  mx-auto bg-darkGray px-10  py-5 rounded-2xl flex flex-col gap-6 tracking-wider">
            <button
              className="absolute top-2 right-3"
              onClick={() => setIsDeleteOpen(false)}
              aria-label="close"
            >
              <X className="text-white/50  hover:text-white/80" />
            </button>
            <div className="flex flex-col text-center gap-12 font-semibold">
              <h1 className="text-white/90  text-xl">Delete your Account?</h1>
              <p className="text-white/80">
                <span className="text-red-700">
                  Warning: Account Deletion is Permanent.
                </span>
                <p>
                  If you delete your account, it cannot be restored. All your
                  projects and credits will be permanently lost.
                </p>
              </p>
              <div className="flex justify-between items-center gap-4">
                <button
                  className="py-3 flex-1 flex items-center justify-center text-gray-500 border border-gray-500 rounded-lg hover:bg-[#4b4c54] hover:text-white/90"
                  onClick={() => setIsDeleteOpen(false)}
                  aria-label="cancel"
                >
                  Cancel
                </button>
                <button
                  className="bg-[#FFE8E6] hover:bg-[#FFE8E6]/70 hover:text-red-700 text-red-500 py-3 flex-1 rounded-lg flex items-center justify-center "
                  onClick={() => {
                    deleteAccount(currentUser?._id || "");
                  }}
                  aria-label="delete video"
                >
                  {isDeleting ? (
                    <div className="flex gap-2 items-center">
                      Deleting
                      <Loader />
                    </div>
                  ) : (
                    <>Delete</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className=" min-h-screen w-full border-y border-gray-600/30 text-white flex flex-col  h-full md:px-8 sm:px-6 px-2 pt-12 max-w-7xl mx-auto gap-6 text-justify tracking-wider">
        <div className="">
          <h1 className="font-semibold text-2xl text-[#DEE1E5]">Profile</h1>
          <p className="text-[#9DA0A8]">Manage your account settings</p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-[800px]">
          <div className="w-[100px] h-[100px] overflow-hidden rounded-full border-primary border-4 mb-4">
            {currentUser && currentUser?.picture ? (
              <img
                src={userProfilePic}
                alt="profile-pic"
                className="w-full h-full rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full">
                <User2 className=" w-full h-full" />
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <label htmlFor="profile_firstName">
              <input
                {...register("firstName", {
                  required: "First name is required.",
                })}
                id="profile_firstName"
                type="text"
                aria-label="first name"
                placeholder={currentUser?.firstName}
                className="rounded-md p-2 bg-darkGray w-full"
              />
            </label>
            {errors.firstName && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.firstName?.message}
              </span>
            )}
            <label htmlFor="profile_lastName">
              <input
                placeholder={currentUser?.lastName}
                {...register("lastName", {
                  required: "Last name is required.",
                })}
                id="profile_lastName"
                type="text"
                aria-label="last name"
                className="rounded-md p-2 bg-darkGray w-full"
              />
            </label>
            {errors.lastName && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.lastName?.message}
              </span>
            )}
            <label htmlFor="profile_email">
              <input
                placeholder={currentUser?.email}
                {...register("email", {
                  required: "Email is required.",
                })}
                id="profile_email"
                type="email"
                aria-label="email"
                className="rounded-md p-2 bg-darkGray w-full"
              />
            </label>
            {errors.email && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.email?.message}
              </span>
            )}

            <button
              disabled={isSavingChanges}
              type="submit"
              className="mt-2 text-white/90 text-lg   py-3  rounded-lg shadow-2xl  font-semibold w-full bg-primary shadow-primary/20 hover:bg-primary/80"
            >
              {isSavingChanges ? (
                <div className="flex gap-2 items-center justify-center">
                  <p>Saving changes...</p>
                  <Loader styles="w-5 h-5" />
                </div>
              ) : (
                "Save changes"
              )}
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-4 text-[#DEE1E5] mb-10">
          <h2 className="font-semibold text-xl text-[#DEE1E5]">
            Transaction History
          </h2>
          <div className="flex w-full font-semibold tracking-wider">
            <div className="w-[60px]"></div>
            <div className="w-[200px] text-[#DEE1E5]">Credits</div>
            <div className="w-[200px] text-[#DEE1E5]">Total $</div>
            <div className="w-[200px] text-[#DEE1E5]">Status</div>
            <div className="flex-1 text-[#DEE1E5]">Date</div>
          </div>
          <div className="h-[200px] overflow-x-scroll overflow-y-scroll flex flex-col gap-2 w-full">
            {currentUser && currentUser?.payments.length > 0 ? (
              <>
                {currentUser?.payments.map((payment, i) => (
                  <div className="flex tracking-wider w-full " key={i}>
                    <div className="w-[60px] text-white/50">{i + 1}</div>
                    <div className="w-[200px] text-white/80">
                      {payment.creditsAmount}
                    </div>
                    <div className="w-[200px] text-white/80">
                      ${payment.total}
                    </div>
                    <div className="w-[200px] text-white/80">
                      {payment.status}
                    </div>
                    <div className="flex-1 text-white/80">
                      {new Date(payment.createdAt).toLocaleDateString("en")}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center pt-12 text-[#9DA0A8] max-w-[800px]">
                No transactions yet
              </div>
            )}
          </div>
          <button
            onClick={() => logOut()}
            className="p-3 border-white/50 border rounded-lg hover:bg-darkGray hover:text-white max-w-[800px]"
          >
            Log out
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="p-3 text-red-700 border-white/50 border rounded-lg hover:bg-darkGray hover:text-red-600 max-w-[800px]"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
