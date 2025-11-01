import {
  ValidationResult,
  SignUpCredentials,
  LoginCredentials,
  SongFormData,
} from "../types";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 6 characters, one uppercase, one lowercase, one number
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20;
};

export const validateSignUp = (
  credentials: SignUpCredentials
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!credentials.username) {
    errors.username = "Username is required";
  } else if (!validateUsername(credentials.username)) {
    errors.username = "Username must be between 3 and 20 characters";
  }

  if (!credentials.email) {
    errors.email = "Email is required";
  } else if (!validateEmail(credentials.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!credentials.password) {
    errors.password = "Password is required";
  } else if (!validatePassword(credentials.password)) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!credentials.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (credentials.password !== credentials.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLogin = (
  credentials: LoginCredentials
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!credentials.email) {
    errors.email = "Email is required";
  } else if (!validateEmail(credentials.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!credentials.password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSongForm = (songData: SongFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!songData.title || songData.title.trim().length === 0) {
    errors.title = "Song title is required";
  }

  if (!songData.singer || songData.singer.trim().length === 0) {
    errors.singer = "Singer name is required";
  }

  if (!songData.album || songData.album.trim().length === 0) {
    errors.album = "Album name is required";
  }

  if (!songData.year) {
    errors.year = "Release year is required";
  } else if (
    songData.year < 1900 ||
    songData.year > new Date().getFullYear() + 1
  ) {
    errors.year = `Year must be between 1900 and ${
      new Date().getFullYear() + 1
    }`;
  }

  if (!songData.genre || songData.genre.trim().length === 0) {
    errors.genre = "Genre is required";
  }

  if (!songData.duration || songData.duration.trim().length === 0) {
    errors.duration = "Duration is required";
  } else if (!/^\d{1,2}:\d{2}$/.test(songData.duration)) {
    errors.duration = "Duration must be in format MM:SS (e.g., 3:45)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
