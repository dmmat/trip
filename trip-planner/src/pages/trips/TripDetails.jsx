import React, { useState } from "react";
import {
  Users,
  Map,
  Wallet,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Виправлений імпорт

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
                <span>{trip.dates}</span>
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
            {activeTab === "route" && (
              <Card>
                <CardHeader>
                  <CardTitle>Маршрут подорожі</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trip.locations.map((location, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{location}</h3>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Запланований час: 3 години</span>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              Додати фото
                            </button>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              Додати нотатки
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="w-full px-4 py-2 mt-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700">
                      + Додати нову локацію
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "participants" && (
              <Card>
                <CardHeader>
                  <CardTitle>Учасники подорожі</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        Список учасників ({trip.participants})
                      </h3>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Запросити учасника
                      </button>
                    </div>
                    <div className="divide-y">
                      {[...Array(trip.participants)].map((_, index) => (
                        <div
                          key={index}
                          className="py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div>
                              <p className="font-medium">Учасник {index + 1}</p>
                              <p className="text-sm text-gray-500">
                                user{index + 1}@example.com
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {index === 0 ? "Організатор" : "Учасник"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "expenses" && (
              <Card>
                <CardHeader>
                  <CardTitle>Витрати</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Загальні витрати</h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {trip.totalExpenses.toLocaleString()} грн
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Додати витрату
                      </button>
                    </div>

                    <div className="divide-y">
                      <div className="py-4">
                        <h4 className="font-medium mb-2">Транспорт</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>Авіаквитки</span>
                            <span className="font-medium">15000 грн</span>
                          </div>
                        </div>
                      </div>
                      <div className="py-4">
                        <h4 className="font-medium mb-2">Проживання</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>Готель</span>
                            <span className="font-medium">25000 грн</span>
                          </div>
                        </div>
                      </div>
                      <div className="py-4">
                        <h4 className="font-medium mb-2">Інше</h4>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Харчування</span>
                            <span className="font-medium">8000 грн</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Розваги</span>
                            <span className="font-medium">5000 грн</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-4">Розподіл витрат</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        {[...Array(trip.participants)].map((_, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span>Учасник {index + 1}</span>
                            <span className="font-medium">
                              {Math.round(
                                trip.totalExpenses / trip.participants,
                              ).toLocaleString()}{" "}
                              грн
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "schedule" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Розклад подорожі</span>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Додати подію
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* День 1 */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        День 1 - {trip.locations[0]}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-20 text-sm text-gray-600">
                            09:00
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Виліт з Києва</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Термінал D, реєстрація починається о 7:00
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Транспорт
                              </span>
                              <span className="text-sm text-gray-500">
                                2 год
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-20 text-sm text-gray-600">
                            12:00
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Заселення в готель</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Grand Hotel Paris, реєстрація та відпочинок
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Проживання
                              </span>
                              <span className="text-sm text-gray-500">
                                1 год
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-20 text-sm text-gray-600">
                            15:00
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Оглядова екскурсія</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Знайомство з містом, основні пам'ятки
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                Екскурсія
                              </span>
                              <span className="text-sm text-gray-500">
                                3 год
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* День 2 */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        День 2 - {trip.locations[0]}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-20 text-sm text-gray-600">
                            10:00
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              Сніданок у місцевому кафе
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Le Petit Café, традиційний французький сніданок
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                Харчування
                              </span>
                              <span className="text-sm text-gray-500">
                                1.5 год
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 mt-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700">
                      + Додати новий день
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "docs" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Документи та файли</span>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Завантажити файл
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Проїзд */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Проїзд</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Авіаквитки.pdf</p>
                              <p className="text-sm text-gray-500">
                                245 KB • Додано вчора
                              </p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            Завантажити
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Проживання */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">
                        Проживання
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Бронювання готелю.pdf
                              </p>
                              <p className="text-sm text-gray-500">
                                180 KB • Додано 2 дні тому
                              </p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            Завантажити
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Інші документи */}
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">
                        Інші документи
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Страховий поліс.pdf</p>
                              <p className="text-sm text-gray-500">
                                156 KB • Додано сьогодні
                              </p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            Завантажити
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <FileText className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">Список речей.docx</p>
                              <p className="text-sm text-gray-500">
                                78 KB • Додано 3 дні тому
                              </p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            Завантажити
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "chat" && (
              <Card>
                <CardHeader>
                  <CardTitle>Обговорення</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col h-[600px]">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {/* День 1 */}
                      <div className="text-center">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          15 липня
                        </span>
                      </div>

                      <div className="flex items-start space-x-3">
                        <img
                          src="https://i.pravatar.cc/300?u=mary"
                          alt="Марія"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-medium">Марія</span>
                            <span className="text-sm text-gray-500">10:30</span>
                          </div>
                          <div className="mt-1 p-3 bg-blue-50 text-gray-700 rounded-lg">
                            Всім привіт! Я знайшла чудовий ресторан біля нашого
                            готелю, рейтинг 4.8 та прийнятні ціни. Як щодо
                            забронювати столик на перший вечір?
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <img
                          src="https://i.pravatar.cc/300?u=9"
                          alt="Петро"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-medium">Петро</span>
                            <span className="text-sm text-gray-500">10:35</span>
                          </div>
                          <div className="mt-1 p-3 bg-blue-50 text-gray-700 rounded-lg">
                            Чудова ідея! Можеш скинути посилання на ресторан?
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <img
                          src="https://i.pravatar.cc/300?u=mary"
                          alt="Марія"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-medium">Марія</span>
                            <span className="text-sm text-gray-500">10:38</span>
                          </div>
                          <div className="mt-1 p-3 bg-blue-50 text-gray-700 rounded-lg">
                            Звісно! Ось посилання на ресторан: [лінк].
                            Подивіться меню, якщо всім підходить, я забронюю
                            столик на 19:00.
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          Сьогодні
                        </span>
                      </div>

                      <div className="flex items-start space-x-3">
                        <img
                          src="https://i.pravatar.cc/300?u=anna"
                          alt="Анна"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-medium">Анна</span>
                            <span className="text-sm text-gray-500">14:15</span>
                          </div>
                          <div className="mt-1 p-3 bg-blue-50 text-gray-700 rounded-lg">
                            Друзі, я знайшла екскурсію на другий день, можемо
                            подивитись основні пам'ятки з місцевим гідом. Ціна
                            30€ з людини, тривалість 3 години.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Форма відправки повідомлення */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                          <PlusCircle className="w-5 h-5" />
                        </button>
                        <input
                          type="text"
                          placeholder="Написати повідомлення..."
                          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="p-2 text-blue-600 hover:text-blue-700">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
