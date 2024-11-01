import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/shared/Header";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";
import TripList from "./pages/trips/TripList";
import CreateTripModal from "./components/CreateTripModal";
import TripDetails from "./pages/trips/TripDetails";
import { trips_data } from "@/data/trips";
import { TripMapper } from "@/lib/mappers";

let data_trips = TripMapper(trips_data);

const App = () => {
  const { user, login, logout, updateUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [trips, setTrips] = useState(data_trips);

  const handleLogin = (credentials, remember) => {
    login(
      {
        name: "Тестовий користувач",
        email: credentials.email,
      },
      remember,
    );
  };

  const handleRegister = (userData) => {
    login(
      {
        name: userData.name,
        email: userData.email,
      },
      true,
    );
  };

  const handleLogout = () => {
    logout();
    setSelectedTrip(null);
    setShowProfile(false);
  };

  const handleUpdateProfile = (userData) => {
    updateUser(userData);
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
                      trips={trips} // Pass trips prop here
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
