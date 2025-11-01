import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { Container, Box, Skeleton } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Loading skeleton for protected routes
const ProtectedPageSkeleton: React.FC = () => (
  <Container maxWidth="xl" sx={{ mt: 4 }}>
    <Skeleton
      variant="rectangular"
      height={60}
      sx={{ mb: 3, borderRadius: 1 }}
    />
    <Skeleton
      variant="rectangular"
      height={200}
      sx={{ mb: 2, borderRadius: 1 }}
    />
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 2,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Box key={item}>
          <Skeleton
            variant="rectangular"
            height={180}
            sx={{ borderRadius: 1, mb: 1 }}
          />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </Box>
      ))}
    </Box>
  </Container>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Small delay to show skeleton briefly for better UX
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);

      // Cleanup function - MUST return this
      return () => clearTimeout(timer);
    }

    // Return undefined for other code paths (or an empty cleanup function)
    return undefined;
  }, [isAuthenticated, loading]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show skeleton while authenticating or loading initial data
  if (loading || !showContent) {
    return <ProtectedPageSkeleton />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
