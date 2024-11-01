import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Map, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TripList = ({ trips, onCreateClick }) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Заголовок з кнопкою створення */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Мої подорожі</h1>
        <Button
          onClick={onCreateClick}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Створити подорож
        </Button>
      </div>

      {/* Список подорожей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {trips.map((trip) => (
          <Card
            key={trip.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            <CardContent className="p-6 mt-6">
              <h2 className="text-xl font-semibold mb-2">{trip.name}</h2>
              <p className="text-gray-500 mb-4">{trip.dates_text}</p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{trip.totalParticipants} учасників</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Map className="w-5 h-5 mr-2" />
                  <span>{trip.allLocations.join(", ")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Wallet className="w-5 h-5 mr-2" />
                  <span>{trip.totalExpenses.toLocaleString()} грн</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TripList;
