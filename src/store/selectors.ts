import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Base selector - direct state access
const selectSongsState = (state: RootState) => state.songs;

// Properly memoized selectors with transformation logic

export const selectFilteredSongs = createSelector(
  [selectSongsState],
  (songsState) => songsState.filteredSongs
);

export const selectUniqueSingers = createSelector(
  [selectSongsState],
  (songsState) => {
    // Transform: extract filteredSongs and compute unique singers
    const songs = songsState.filteredSongs;
    if (songs.length === 0) return [];

    const singersSet = new Set<string>();
    for (let i = 0; i < songs.length; i++) {
      singersSet.add(songs[i].singer);
    }

    return Array.from(singersSet).sort();
  }
);

export const selectUniqueGenres = createSelector(
  [selectSongsState],
  (songsState) => {
    // Transform: extract filteredSongs and compute unique genres
    const songs = songsState.filteredSongs;
    if (songs.length === 0) return [];

    const genresSet = new Set<string>();
    for (let i = 0; i < songs.length; i++) {
      genresSet.add(songs[i].genre);
    }

    return Array.from(genresSet).sort();
  }
);

export const selectCurrentSong = createSelector(
  [selectSongsState],
  (songsState) => songsState.currentSong
);

export const selectIsPlaying = createSelector(
  [selectSongsState],
  (songsState) => songsState.isPlaying
);

export const selectFilters = createSelector(
  [selectSongsState],
  (songsState) => songsState.filters
);

export const selectSearchQuery = createSelector(
  [selectSongsState],
  (songsState) => songsState.searchQuery
);

// Additional computed selectors
export const selectSongCount = createSelector(
  [selectFilteredSongs],
  (songs) => songs.length
);

export const selectHasActiveFilters = createSelector(
  [selectFilters, selectSearchQuery],
  (filters, searchQuery) => {
    return !!(
      searchQuery ||
      filters.singer ||
      filters.alphabet ||
      filters.genre 
    );
  }
);

export const selectAllSongs = createSelector(
  [selectSongsState],
  (songsState) => songsState.songs
);
