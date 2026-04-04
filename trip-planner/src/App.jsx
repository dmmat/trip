import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Header from "./components/shared/Header";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OAuthCallback from "./pages/auth/OAuthCallback";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/profile/ProfilePage";
import TripList from "./pages/trips/TripList";
import CreateTripModal from "./components/CreateTripModal";
import TripDetails from "./pages/trips/TripDetails";
import { trips_data } from "@/data/trips";
import { TripMapper } from "@/lib/mappers";

let data_trips = TripMapper(trips_data);

const AppContent = () => {
  const { user, loading, logout, updateUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [trips, setTrips] = useState(data_trips);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <Header user={user} onLogout={logout} /> : null}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route
                path="/profile"
                element={<ProfilePage user={user} onUpdateProfile={updateUser} />}
              />
              <Route
                path="/trips"
                element={
                  <>
                    <TripList
                      trips={trips}
                      onCreateClick={() => setShowCreateModal(true)}
                      onTripSelect={setSelectedTrip}
                    />
                    {showCreateModal && (
                      <CreateTripModal
                        onClose={() => setShowCreateModal(false)}
                        onCreateTrip={(tripData) => {
                          const newTrip = {
                            id: trips.length + 1,
                            ...tripData,
                            participants: 1,
                            totalExpenses: 0,
                          };
                          setTrips([...trips, newTrip]);
                          setShowCreateModal(false);
                        }}
                      />
                    )}
                  </>
                }
              />
              <Route
                path="/trips/:tripId"
                element={
                  <TripDetails
                    trips={trips}
                    onBack={() => setSelectedTrip(null)}
                    onUpdate={(updatedTrip) => {
                      setTrips(
                        trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)),
                      );
                      setSelectedTrip(updatedTrip);
                    }}
                  />
                }
              />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="*" element={<Navigate to="/trips" />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
