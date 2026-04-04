import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users,
  Map,
  Wallet,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TripRouteCard from "./tabs/TripRouteCard";
import ParticipantsCard from "./tabs/ParticipantsCard";
import ExpensesCard from "./tabs/ExpensesCard";
import ScheduleCard from "./tabs/SheduleCard";
import DocsCard from "./tabs/DocsCard";
import ChatCard from "./tabs/ChatCard";

const TripDetails = ({ trips }) => {
  const { t } = useTranslation();
  const { tripId } = useParams();
  const [activeTab, setActiveTab] = useState("route");
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const selectedTrip = trips.find((t) => t.id === tripId);
    setTrip(selectedTrip);
  }, [tripId, trips]);

  if (!trip) {
    return <div>{t("trips.loading")}</div>;
  }

  const tabs = [
    { id: "route", name: t("tabs.route"), icon: Map },
    { id: "participants", name: t("tabs.participants"), icon: Users },
    { id: "expenses", name: t("tabs.expenses"), icon: Wallet },
    { id: "schedule", name: t("tabs.schedule"), icon: Calendar },
    { id: "docs", name: t("tabs.docs"), icon: FileText },
    { id: "chat", name: t("tabs.chat"), icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{trip.name}</h1>
              <div className="mt-2 flex items-center text-gray-500">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{trip.dates_text}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                {t("trips.edit")}
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                {t("trips.share")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 border-b-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {activeTab === "route" && <TripRouteCard trip={trip} />}
            {activeTab === "participants" && <ParticipantsCard trip={trip} />}
            {activeTab === "expenses" && <ExpensesCard trip={trip} />}
            {activeTab === "schedule" && <ScheduleCard trip={trip} />}
            {activeTab === "docs" && <DocsCard trip={trip} />}
            {activeTab === "chat" && <ChatCard trip={trip} />}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("details.importantInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">{t("details.nextEvent")}</h4>
                    <p className="mt-1">{trip.importantInfo.nextEvent.title}</p>
                    <p className="text-sm text-gray-500">
                      {trip.importantInfo.nextEvent.date}, {trip.importantInfo.nextEvent.time}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">{t("details.weather")}</h4>
                    <p className="mt-1">
                      {trip.importantInfo.weather.location}: {trip.importantInfo.weather.temperature}°C, {trip.importantInfo.weather.condition}
                    </p>
                  </div>
                  {trip.importantInfo.alerts.map((alert, index) => (
                    <Alert key={index}>
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("details.documents")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trip.documents.slice(0, 3).map((doc, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      {doc.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveTab("docs")}
                    className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    {t("details.showMore")} →
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDetails;
