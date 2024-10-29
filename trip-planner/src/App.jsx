import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/shared/Header";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";
import TripList from "./pages/trips/TripList";
import CreateTripModal from "./components/CreateTripModal";
import TripDetails from "./pages/trips/TripDetails";
import { trips_data } from "@/data/trips";
import { datePeriodFormatter } from "@/lib/utils";

let data_trips = trips_data.map((trip) => {
  trip.totalExpenses = trip.expenses.total;
  trip.allLocations = trip.locations.map((location) => location.name);
  trip.totalParticipants = trip.participants.length;
  trip.dates_text = datePeriodFormatter(
    trip.dates.startDate,
    trip.dates.endDate,
  );
  if (trip.chat && trip.chat.messages) {
    trip.chat.messages = trip.chat.messages.map((message) => ({
      ...message,
      user: trip.participants.find(
        (participant) => participant.id === message.userId,
      ),
    }));
  }

  return trip;
});

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

  // Якщо користувач не авторизований, показуємо сторінку входу або реєстрації
  if (!user) {
    if (isRegistering) {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onNavigateToLogin={() => setIsRegistering(false)}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToRegister={() => setIsRegistering(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={handleLogout}
        onProfileClick={() => {
          setShowProfile(true);
          setSelectedTrip(null);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showProfile ? (
          <ProfilePage user={user} onUpdateProfile={handleUpdateProfile} />
        ) : !selectedTrip ? (
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
        ) : (
          <TripDetails
            trip={selectedTrip}
            onBack={() => setSelectedTrip(null)}
            onUpdate={(updatedTrip) => {
              setTrips(
                trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)),
              );
              setSelectedTrip(updatedTrip);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;
