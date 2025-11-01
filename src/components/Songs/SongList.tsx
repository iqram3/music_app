import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectFilteredSongs,
  selectUniqueSingers,
  selectUniqueGenres,
  selectCurrentSong,
  selectIsPlaying,
  selectFilters,
  selectSearchQuery,
} from "../../store/selectors";
import {
  loadSongs,
  deleteSong,
  setSearchQuery,
  setFilter,
  clearFilters,
  playSong,
  pauseSong,
} from "../../store/slices/songsSlice";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

// Memoized Song Card Component
const SongCard = React.memo(
  ({ song, isCurrentPlaying, onPlay, onEdit, onDelete }: any) => {
    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: isCurrentPlaying
            ? "action.selected"
            : "background.paper",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom noWrap>
            {song.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {song.singer}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" display="block">
            Album: {song.album}
          </Typography>
          <Typography variant="caption" display="block">
            Year: {song.year}
          </Typography>
          <Typography variant="caption" display="block">
            Genre: {song.genre}
          </Typography>
          <Typography variant="caption" display="block">
            Duration: {song.duration}
          </Typography>
        </CardContent>

        <CardActions>
          <IconButton
            size="small"
            color="primary"
            onClick={onPlay}
            aria-label={isCurrentPlaying ? "pause" : "play"}
          >
            {isCurrentPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={onEdit}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={onDelete}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
);

SongCard.displayName = "SongCard";

const SongList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // ✅ Use properly memoized selectors
  const filteredSongs = useAppSelector(selectFilteredSongs);
  const uniqueSingers = useAppSelector(selectUniqueSingers);
  const uniqueGenres = useAppSelector(selectUniqueGenres);
  const currentSong = useAppSelector(selectCurrentSong);
  const isPlaying = useAppSelector(selectIsPlaying);
  const filters = useAppSelector(selectFilters);
  const searchQuery = useAppSelector(selectSearchQuery);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);

  // ✅ Memoize alphabet array
  const alphabet = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), []);

  useEffect(() => {
    if (user) {
      dispatch(loadSongs(user.id));
    }
  }, [user, dispatch]);

  // ✅ Memoized callbacks
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch]
  );

  const handleSingerFilter = useCallback(
    (singer: string) => {
      dispatch(setFilter({ key: "singer", value: singer }));
    },
    [dispatch]
  );

  const handleAlphabetFilter = useCallback(
    (letter: string) => {
      dispatch(setFilter({ key: "alphabet", value: letter }));
    },
    [dispatch]
  );

  const handleGenreFilter = useCallback(
    (genre: string) => {
      dispatch(setFilter({ key: "genre", value: genre }));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handlePlay = useCallback(
    (song: any) => {
      if (currentSong?.id === song.id && isPlaying) {
        dispatch(pauseSong());
      } else {
        dispatch(playSong(song));
      }
    },
    [currentSong, isPlaying, dispatch]
  );

  const handleEdit = useCallback(
    (songId: string) => {
      navigate(`/songs/edit/${songId}`);
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((songId: string) => {
    setSongToDelete(songId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (songToDelete) {
      dispatch(deleteSong(songToDelete));
      setDeleteDialogOpen(false);
      setSongToDelete(null);
    }
  }, [songToDelete, dispatch]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setSongToDelete(null);
  }, []);

  const handleAddNewSong = useCallback(() => {
    navigate("/songs/add");
  }, [navigate]);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          My Songs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewSong}
        >
          Add New Song
        </Button>
      </Box>

      {/* Search and Filters Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <FilterListIcon sx={{ mr: 1 }} />
          Search & Filters
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by title, singer, or album..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Singer</InputLabel>
              <Select
                value={filters.singer}
                label="Filter by Singer"
                onChange={(e) => handleSingerFilter(e.target.value)}
              >
                <MenuItem value="">All Singers</MenuItem>
                {uniqueSingers.map((singer) => (
                  <MenuItem key={singer} value={singer}>
                    {singer}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Genre</InputLabel>
              <Select
                value={filters.genre}
                label="Filter by Genre"
                onChange={(e) => handleGenreFilter(e.target.value)}
              >
                <MenuItem value="">All Genres</MenuItem>
                {uniqueGenres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Alphabet Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Filter by First Letter:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {alphabet.map((letter) => (
              <Chip
                key={letter}
                label={letter}
                onClick={() => handleAlphabetFilter(letter)}
                color={filters.alphabet === letter ? "primary" : "default"}
                size="small"
              />
            ))}
          </Box>
        </Box>

        <Button
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          variant="outlined"
          size="small"
        >
          Clear All Filters
        </Button>
      </Paper>

      {/* Songs Grid */}
      {filteredSongs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No songs found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery || Object.values(filters).some((v) => v && v !== "")
              ? "Try adjusting your filters"
              : "Add your first song to get started"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredSongs.map((song) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={song.id}>
              <SongCard
                song={song}
                isCurrentPlaying={currentSong?.id === song.id && isPlaying}
                onPlay={() => handlePlay(song)}
                onEdit={() => handleEdit(song.id)}
                onDelete={() => handleDeleteClick(song.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this song? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default React.memo(SongList);
