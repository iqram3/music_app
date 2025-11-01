import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addSong } from "../../store/slices/songsSlice";
import { validateSongForm } from "../../utils/validation";
import { SongFormData } from "../../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const genres = [
  "Pop",
  "Rock",
  "Hip Hop",
  "R&B",
  "Jazz",
  "Classical",
  "Country",
  "Electronic",
  "Indie",
  "Folk",
  "Blues",
  "Metal",
  "Reggae",
  "Other",
];

const AddSong: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<SongFormData>({
    title: "",
    singer: "",
    album: "",
    year: new Date().getFullYear(),
    genre: "",
    duration: "",
    audioUrl: "",
    coverImage: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) || 0 : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSongForm(formData);

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    if (user) {
      dispatch(addSong({ userId: user.id, songData: formData }));
      setSuccessMessage("Song added successfully!");

      // Reset form
      setTimeout(() => {
        navigate("/songs");
      }, 1500);
    }
  };

  const handleCancel = () => {
    navigate("/songs");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          Back to Songs
        </Button>
        <Typography variant="h4" component="h1">
          Add New Song
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                label="Song Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="singer"
                label="Singer/Artist"
                name="singer"
                value={formData.singer}
                onChange={handleChange}
                error={!!formErrors.singer}
                helperText={formErrors.singer}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="album"
                label="Album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                error={!!formErrors.album}
                helperText={formErrors.album}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                id="year"
                label="Release Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                error={!!formErrors.year}
                helperText={formErrors.year}
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                select
                id="genre"
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                error={!!formErrors.genre}
                helperText={formErrors.genre}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                id="duration"
                label="Duration (MM:SS)"
                name="duration"
                placeholder="3:45"
                value={formData.duration}
                onChange={handleChange}
                error={!!formErrors.duration}
                helperText={formErrors.duration || "Format: MM:SS (e.g., 3:45)"}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="audioUrl"
                label="Audio URL (Optional)"
                name="audioUrl"
                value={formData.audioUrl}
                onChange={handleChange}
                helperText="Link to audio file or streaming service"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="coverImage"
                label="Cover Image URL (Optional)"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                helperText="Link to album cover or song artwork"
              />
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
              Add Song
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddSong;
