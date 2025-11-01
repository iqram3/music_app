// User types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  username: string;
  confirmPassword: string;
}

// Song types
export interface Song {
  id: string;
  userId: string;
  title: string;
  singer: string;
  album: string;
  year: number;
  genre: string;
  duration: string;
  audioUrl?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SongsState {
  songs: Song[];
  filteredSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  filters: SongFilters;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

export interface SongFilters {
  singer: string;
  alphabet: string;
  genre: string;
}

export interface SongFormData {
  title: string;
  singer: string;
  album: string;
  year: number;
  genre: string;
  duration: string;
  audioUrl?: string;
  coverImage?: string;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
