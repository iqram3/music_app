import React, { useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const handleHomeClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleLoginClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleSignUpClick = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={handleHomeClick}
          aria-label="home"
        >
          <MusicNoteIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Music Manager
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">Welcome, {user?.username}</Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={handleLoginClick}>
              Login
            </Button>
            <Button color="inherit" onClick={handleSignUpClick}>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Navbar);
