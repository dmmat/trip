import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CreateTripModal = ({ onClose, onCreateTrip }) => {
  const { t } = useTranslation();
  const [tripData, setTripData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    locations: [],
  });
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tripData.name || !tripData.startDate || !tripData.endDate) {
      setError(t("auth.fillAllFields"));
      return;
    }

    const formatDate = (date) => {
      const d = new Date(date);
      const months = [
        "січ", "лют", "бер", "кві", "тра", "чер",
        "лип", "сер", "вер", "жов", "лис", "гру",
      ];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    };

    const formattedTrip = {
      ...tripData,
      dates: `${formatDate(tripData.startDate)} - ${formatDate(tripData.endDate)}, ${new Date(tripData.startDate).getFullYear()}`,
    };

    onCreateTrip(formattedTrip);
  };

  const addLocation = () => {
    if (location.trim()) {
      setTripData((prev) => ({
        ...prev,
        locations: [...prev.locations, location.trim()],
      }));
      setLocation("");
    }
  };

  const removeLocation = (index) => {
    setTripData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t("trips.createTitle")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("trips.name")} *
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={tripData.name}
                onChange={(e) => setTripData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={t("trips.namePlaceholder")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("trips.startDate")} *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full p-2 pl-9 border rounded-lg"
                    value={tripData.startDate}
                    onChange={(e) => setTripData((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("trips.endDate")} *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full p-2 pl-9 border rounded-lg"
                    value={tripData.endDate}
                    onChange={(e) => setTripData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t("trips.description")}</label>
              <textarea
                className="w-full p-2 border rounded-lg"
                rows="3"
                value={tripData.description}
                onChange={(e) => setTripData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={t("trips.descriptionPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t("trips.locations")}</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-lg"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("trips.locationPlaceholder")}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLocation();
                    }
                  }}
                />
                <Button type="button" onClick={addLocation} variant="secondary">
                  {t("trips.addLocation")}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tripData.locations.map((loc, index) => (
                  <span key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                    <MapPin className="w-4 h-4" />
                    {loc}
                    <button type="button" onClick={() => removeLocation(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" onClick={onClose} variant="outline">
                {t("trips.cancel")}
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                {t("trips.create")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTripModal;
