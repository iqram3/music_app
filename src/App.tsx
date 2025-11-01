import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Navbar from "./components/Common/Navbar";
import ProtectedRoute from "./components/Common/ProtectedRoute";

// Lazy load components for code splitting
const SignUp = lazy(() => import("./components/Auth/SignUp"));
const Login = lazy(() => import("./components/Auth/Login"));
const SongList = lazy(() => import("./components/Songs/SongList"));
const AddSong = lazy(() => import("./components/Songs/AddSong"));
const EditSong = lazy(() => import("./components/Songs/EditSong"));

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Navbar />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Navigate to="/songs" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/songs"
              element={
                <ProtectedRoute>
                  <SongList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/songs/add"
              element={
                <ProtectedRoute>
                  <AddSong />
                </ProtectedRoute>
              }
            />
            <Route
              path="/songs/edit/:id"
              element={
                <ProtectedRoute>
                  <EditSong />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/songs" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default React.memo(App);
