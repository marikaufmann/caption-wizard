import axios, { AxiosError } from "axios";
import { RegisterFormData, SignInFormData } from "./types";
import {
  CaptionsType,
  UserType,
  VideoType,
} from "../../backend/src/shared/types";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
const GOOGLE_OAUTH_REDIRECT_URL =
  process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL || "";

export const register = async (formData: RegisterFormData) => {
  try {
    const data = await axios.post(`${API_BASE_URL}/api/users`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 403 || err.response?.status === 409) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};

export const fetchCurrentUser = async () => {
  try {
    const promise = await axios.get(`${API_BASE_URL}/api/users/me`, {
      withCredentials: true,
    });
    return promise.data as UserType;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};
export const logIn = async (formData: SignInFormData) => {
  try {
    const data = await axios.post(`${API_BASE_URL}/api/sessions`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};
export const getGoogleOAuthURL = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URL as string,
    client_id: GOOGLE_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const query = new URLSearchParams(options);
  return `${rootUrl}?${query.toString()}`;
};

export const logOut = async () => {
  try {
    const data = await axios.delete(`${API_BASE_URL}/api/sessions`, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    throw new Error("Something went wrong, please try again.");
  }
};
export const deleteAccount = async (userId: string) => {
  try {
    const data = await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};

export const editUserData = async ({
  formData,
  userId,
}: {
  formData: FormData;
  userId: string;
}) => {
  try {
    const data = await axios.put(
      `${API_BASE_URL}/api/users/${userId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};

export const validateToken = async () => {
  try {
    const data = await axios.get(
      `${API_BASE_URL}/api/sessions/validate-session`,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};

export const uploadVideo = async (formData: FormData) => {
  try {
    const data = await axios.post(`${API_BASE_URL}/api/videos`, formData, {
      withCredentials: true,
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 400) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};

export const fetchUsersVideos = async (): Promise<VideoType[]> => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/videos`, {
      withCredentials: true,
    });
    return data as unknown as VideoType[];
  } catch (err) {
    throw new Error("Something went wrong, please try again.");
  }
};

export const fetchProject = async (projectId: string): Promise<VideoType> => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/api/videos/${projectId}`,
      {
        withCredentials: true,
      }
    );
    return data as unknown as VideoType;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 404) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};

export const deleteVideo = async (id: string) => {
  try {
    const data = await axios.delete(`${API_BASE_URL}/api/videos/${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 404) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};

export const updateVideo = async ({
  projectId,
  newCaptions,
}: {
  projectId: string;
  newCaptions: CaptionsType;
}) => {
  try {
    const data = await axios.put(
      `${API_BASE_URL}/api/videos/${projectId}`,
      { newCaptions },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 404) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};
export const addCaptions = async ({
  projectId,
  formData,
}: {
  projectId: string;
  formData: FormData;
}) => {
  try {
    const data = await axios.post(
      `${API_BASE_URL}/api/videos/${projectId}/add-captions`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 404) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};

export const createPaymentIntent = async ({
  creditsAmount,
}: {
  creditsAmount: number;
}) => {
  try {
    const data = await axios.post(
      `${API_BASE_URL}/api/credits/payment-intent`,
      { creditsAmount },
      {
        withCredentials: true,
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    return data.data.checkoutUrl;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 400) {
        throw new Error(err.response.data.message);
      }
    }
    throw new Error("Something went wrong, please try again.");
  }
};
