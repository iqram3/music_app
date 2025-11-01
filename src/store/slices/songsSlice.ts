import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SongsState, Song, SongFilters, SongFormData } from "../../types";

const initialFilters: SongFilters = {
  singer: "",
  alphabet: "",
  genre: "",
};

const initialState: SongsState = {
  songs: [],
  filteredSongs: [],
  currentSong: null,
  isPlaying: false,
  filters: initialFilters,
  searchQuery: "",
  loading: false,
  error: null,
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    loadSongs: (state, action: PayloadAction<string>) => {
      // Load songs for specific user
      const userId = action.payload;
      try {
        const allSongs = JSON.parse(localStorage.getItem("songs") || "[]");
        const userSongs = allSongs.filter(
          (song: Song) => song.userId === userId
        );
        state.songs = userSongs;
        state.filteredSongs = userSongs;
        state.error = null;
      } catch (error) {
        state.error = "Failed to load songs";
      }
    },
    addSong: (
      state,
      action: PayloadAction<{ userId: string; songData: SongFormData }>
    ) => {
      const { userId, songData } = action.payload;
      const newSong: Song = {
        id: `song_${Date.now()}`,
        userId,
        ...songData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.songs.push(newSong);

      // Save to localStorage
      const allSongs = JSON.parse(localStorage.getItem("songs") || "[]");
      allSongs.push(newSong);
      localStorage.setItem("songs", JSON.stringify(allSongs));

      // Re-apply filters
      songsSlice.caseReducers.applyFilters(state);
    },
    updateSong: (
      state,
      action: PayloadAction<{ songId: string; songData: SongFormData }>
    ) => {
      const { songId, songData } = action.payload;
      const index = state.songs.findIndex((song) => song.id === songId);

      if (index !== -1) {
        state.songs[index] = {
          ...state.songs[index],
          ...songData,
          updatedAt: new Date().toISOString(),
        };

        // Update in localStorage
        const allSongs = JSON.parse(localStorage.getItem("songs") || "[]");
        const globalIndex = allSongs.findIndex(
          (song: Song) => song.id === songId
        );
        if (globalIndex !== -1) {
          allSongs[globalIndex] = state.songs[index];
          localStorage.setItem("songs", JSON.stringify(allSongs));
        }

        // Re-apply filters
        songsSlice.caseReducers.applyFilters(state);
      }
    },
    deleteSong: (state, action: PayloadAction<string>) => {
      const songId = action.payload;
      state.songs = state.songs.filter((song) => song.id !== songId);

      // Remove from localStorage
      const allSongs = JSON.parse(localStorage.getItem("songs") || "[]");
      const updatedSongs = allSongs.filter((song: Song) => song.id !== songId);
      localStorage.setItem("songs", JSON.stringify(updatedSongs));

      // Re-apply filters
      songsSlice.caseReducers.applyFilters(state);

      // Stop playing if current song is deleted
      if (state.currentSong?.id === songId) {
        state.currentSong = null;
        state.isPlaying = false;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      songsSlice.caseReducers.applyFilters(state);
    },
    setFilter: (
      state,
      action: PayloadAction<{ key: keyof SongFilters; value: any }>
    ) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
      songsSlice.caseReducers.applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = initialFilters;
      state.searchQuery = "";
      state.filteredSongs = state.songs;
    },
    applyFilters: (state) => {
      let filtered = [...state.songs];

      // Apply search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (song) =>
            song.title.toLowerCase().includes(query) ||
            song.singer.toLowerCase().includes(query) ||
            song.album.toLowerCase().includes(query)
        );
      }

      // Apply singer filter
      if (state.filters.singer) {
        filtered = filtered.filter(
          (song) => song.singer === state.filters.singer
        );
      }

      // Apply alphabet filter
      if (state.filters.alphabet) {
        filtered = filtered.filter((song) =>
          song.title
            .toLowerCase()
            .startsWith(state.filters.alphabet.toLowerCase())
        );
      }

      // Apply genre filter
      if (state.filters.genre) {
        filtered = filtered.filter(
          (song) => song.genre === state.filters.genre
        );
      }

      state.filteredSongs = filtered;
    },
    playSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    pauseSong: (state) => {
      state.isPlaying = false;
    },
    resumeSong: (state) => {
      state.isPlaying = true;
    },
    stopSong: (state) => {
      state.currentSong = null;
      state.isPlaying = false;
    },
  },
});

export const {
  loadSongs,
  addSong,
  updateSong,
  deleteSong,
  setSearchQuery,
  setFilter,
  clearFilters,
  applyFilters,
  playSong,
  pauseSong,
  resumeSong,
  stopSong,
} = songsSlice.actions;

export default songsSlice.reducer;
