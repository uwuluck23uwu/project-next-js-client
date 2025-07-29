import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

const getLocal = (key: string): string | null =>
  isBrowser ? localStorage.getItem(key) : null;

const setLocal = (key: string, value: string) => {
  if (isBrowser) localStorage.setItem(key, value);
};

const removeLocal = (key: string) => {
  if (isBrowser) localStorage.removeItem(key);
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  user_id: string | null;
  branch_id: string | null;
  username: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
}

const initialState: AuthState = {
  accessToken: getLocal("accessToken"),
  refreshToken: getLocal("refreshToken"),
  role: getLocal("role"),
  user_id: getLocal("user_id"),
  branch_id: getLocal("branch_id"),
  username: getLocal("username"),
  image_url: getLocal("image_url"),
  email: getLocal("email"),
  phone: getLocal("phone"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        role: string;
        user_id?: string;
        branch_id?: string;
        username?: string;
        image_url?: string;
        email?: string;
        phone?: string;
      }>
    ) => {
      const {
        accessToken,
        refreshToken,
        role,
        user_id,
        branch_id,
        username,
        image_url,
        email,
        phone,
      } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.role = role;
      state.user_id = user_id || null;
      state.branch_id = branch_id || null;
      state.username = username || null;
      state.image_url = image_url || null;
      state.email = email || null;
      state.phone = phone || null;

      setLocal("accessToken", accessToken);
      setLocal("refreshToken", refreshToken);
      setLocal("role", role);

      if (user_id) setLocal("user_id", user_id);
      if (branch_id) setLocal("branch_id", branch_id);
      if (username) setLocal("username", username);
      if (image_url) setLocal("image_url", image_url);
      if (email) setLocal("email", email);
      if (phone) setLocal("phone", phone);
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.user_id = null;
      state.branch_id = null;
      state.username = null;
      state.image_url = null;
      state.email = null;
      state.phone = null;

      removeLocal("accessToken");
      removeLocal("refreshToken");
      removeLocal("role");
      removeLocal("user_id");
      removeLocal("branch_id");
      removeLocal("username");
      removeLocal("image_url");
      removeLocal("email");
      removeLocal("phone");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
