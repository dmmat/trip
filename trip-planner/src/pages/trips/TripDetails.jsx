import React, { useState } from "react";
import {
  Users,
  Map,
  Wallet,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Виправлений імпорт
import TripRouteCard from "./tabs/TripRouteCard";
import ParticipantsCard from "./tabs/ParticipantsCard";
import ExpensesCard from "./tabs/ExpensesCard";
import ScheduleCard from "./tabs/SheduleCard";
import DocsCard from "./tabs/DocsCard";
import ChatCard from "./tabs/ChatCard";

const TripDetails = ({ trip }) => {
  const [activeTab, setActiveTab] = useState("route");

  const tabs = [
    { id: "route", name: "Маршрут", icon: Map },
    { id: "participants", name: "Учасники", icon: Users },
    { id: "expenses", name: "Витрати", icon: Wallet },
    { id: "schedule", name: "Розклад", icon: Calendar },
    { id: "docs", name: "Документи", icon: FileText },
    { id: "chat", name: "Обговорення", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок подорожі */}
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
                Редагувати
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                Поділитися
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Навігація */}
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

      {/* Основний контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Основний контент */}
          <div className="col-span-2">
            {activeTab === "route" && <TripRouteCard trip={trip} />}
            {activeTab === "participants" && <ParticipantsCard trip={trip} />}
            {activeTab === "expenses" && <ExpensesCard trip={trip} />}
            {activeTab === "schedule" && <ScheduleCard trip={trip} />}
            {activeTab === "docs" && <DocsCard trip={trip} />}
            {activeTab === "chat" && <ChatCard trip={trip} />}
          </div>

          {/* Бічна панель */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Важлива інформація</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Найближча подія
                    </h4>
                    <p className="mt-1">Виліт з Києва</p>
                    <p className="text-sm text-gray-500">15 липня, 10:00</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Погода
                    </h4>
                    <p className="mt-1">Париж: +25°C, сонячно</p>
                  </div>
                  <Alert>
                    <AlertDescription>
                      Не забудьте перевірити термін дії паспорта
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Документи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    📄 Авіаквитки.pdf
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    📄 Бронювання готелю.pdf
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    + Завантажити документ
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
