import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppShell, LoadingOverlay } from "@mantine/core";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RegisterOperatorPage from "./pages/auth/RegisterOperatorPage";
import OAuthCallback from "./pages/auth/OAuthCallback";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Landing
import LandingPage from "./pages/landing/LandingPage";
import OperatorLandingPage from "./pages/landing/OperatorLandingPage";

// User pages
import AppHeader from "./components/shared/AppHeader";
import ProfilePage from "./pages/profile/ProfilePage";
import TripList from "./pages/trips/TripList";
import TripDetails from "./pages/trips/TripDetails";
import JoinTripPage from "./pages/trips/JoinTripPage";

// Operator pages
import OperatorDashboard from "./pages/operator/OperatorDashboard";
import OperatorTourCreate from "./pages/operator/OperatorTourCreate";
import OperatorTourDetails from "./pages/operator/OperatorTourDetails";

const AppContent = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <LoadingOverlay visible />;
  }

  // Public routes
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/for-operators" element={<OperatorLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/operator" element={<RegisterOperatorPage />} />
        <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/join/:inviteCode" element={<JoinTripPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  const isOperator = user.role === 'operator';

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <AppHeader user={user} onLogout={logout} />
      </AppShell.Header>
      <AppShell.Main>
        <Routes>
          {/* Shared */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/join/:inviteCode" element={<JoinTripPage />} />

          {/* User routes */}
          <Route path="/trips" element={<TripList />} />
          <Route path="/trips/:tripId" element={<TripDetails />} />

          {/* Operator routes */}
          {isOperator && (
            <>
              <Route path="/operator" element={<OperatorDashboard />} />
              <Route path="/operator/tours/new" element={<OperatorTourCreate />} />
              <Route path="/operator/tours/:tourId" element={<OperatorTourDetails />} />
            </>
          )}

          <Route path="*" element={<Navigate to={isOperator ? "/operator" : "/trips"} />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
