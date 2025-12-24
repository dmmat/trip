import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useTrips } from "./hooks/useTrips";
import Header from "./components/shared/Header";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";
import TripList from "./pages/trips/TripList";
import CreateTripModal from "./components/CreateTripModal";
import TripDetails from "./pages/trips/TripDetails";

const App = () => {
  const { user, login, register, logout, updateUser } = useAuth();
  const { trips, loading, createTrip, updateTrip, deleteTrip } = useTrips();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogin = async (credentials, remember) => {
    const result = await login(credentials, remember);
    return result;
  };

  const handleRegister = async (userData) => {
    const result = await register(userData);
    return result;
  };

  const handleLogout = () => {
    logout();
    setSelectedTrip(null);
    setShowProfile(false);
  };

  const handleUpdateProfile = async (userData) => {
    const result = await updateUser(userData);
    return result;
  };

  const handleCreateTrip = async (tripData) => {
    const result = await createTrip(tripData);
    if (result.success) {
      setShowCreateModal(false);
    }
    return result;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user ? (
          <Header
            user={user}
            onLogout={handleLogout}
            onProfileClick={() => {
              setShowProfile(true);
              setSelectedTrip(null);
            }}
          />
        ) : null}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {!user ? (
              <>
                <Route
                  path="/login"
                  element={
                    <LoginPage
                      onLogin={handleLogin}
                      onNavigateToRegister={() => setIsRegistering(true)}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <RegisterPage
                      onRegister={handleRegister}
                      onNavigateToLogin={() => setIsRegistering(false)}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route
                  path="/profile"
                  element={
                    <ProfilePage user={user} onUpdateProfile={handleUpdateProfile} />
                  }
                />
                <Route
                  path="/trips"
                  element={
                    <>
                      {loading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="text-gray-600">Завантаження...</div>
                        </div>
                      ) : (
                        <TripList
                          trips={trips}
                          onCreateClick={() => setShowCreateModal(true)}
                          onTripSelect={setSelectedTrip}
                        />
                      )}
                      {showCreateModal && (
                        <CreateTripModal
                          onClose={() => setShowCreateModal(false)}
                          onCreateTrip={handleCreateTrip}
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
                        updateTrip(updatedTrip.id, updatedTrip);
                        setSelectedTrip(updatedTrip);
                      }}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/trips" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
