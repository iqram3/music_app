import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  User,
  LoginCredentials,
  SignUpCredentials,
} from "../../types";

// Load initial state from localStorage
const loadUserFromStorage = (): User | null => {
  try {
    const userJson = localStorage.getItem("currentUser");
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;

      // Persist to localStorage
      localStorage.setItem("currentUser", JSON.stringify(action.payload));

      // Store user in users list
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push({
        ...action.payload,
        password: "", // Don't store password in production
      });
      localStorage.setItem("users", JSON.stringify(users));
    },
    signUpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;

      // Persist to localStorage
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("currentUser");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  signUpStart,
  signUpSuccess,
  signUpFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = authSlice.actions;

// Thunk actions
export const signUp = (
  credentials: SignUpCredentials & { password: string }
) => {
  return (dispatch: any) => {
    dispatch(signUpStart());

    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(
        (u: any) => u.email === credentials.email
      );

      if (existingUser) {
        dispatch(signUpFailure("User with this email already exists"));
        return;
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        username: credentials.username,
        createdAt: new Date().toISOString(),
      };

      dispatch(signUpSuccess(newUser));
    } catch (error) {
      dispatch(signUpFailure("Sign up failed. Please try again."));
    }
  };
};

export const login = (credentials: LoginCredentials) => {
  return (dispatch: any) => {
    dispatch(loginStart());

    try {
      // Find user in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === credentials.email);

      if (!user) {
        dispatch(loginFailure("Invalid email or password"));
        return;
      }

      // In production, verify password hash
      // For demo, we'll just login
      const { password, ...userWithoutPassword } = user;
      dispatch(loginSuccess(userWithoutPassword));
    } catch (error) {
      dispatch(loginFailure("Login failed. Please try again."));
    }
  };
};

export default authSlice.reducer;
