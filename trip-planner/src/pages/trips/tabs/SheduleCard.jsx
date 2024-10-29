import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ScheduleCard = ({ trip }) => {
  return (
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
                <div className="w-20 text-sm text-gray-600">09:00</div>
                <div className="flex-1">
                  <h4 className="font-medium">Виліт з Києва</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Термінал D, реєстрація починається о 7:00
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Транспорт
                    </span>
                    <span className="text-sm text-gray-500">2 год</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-20 text-sm text-gray-600">12:00</div>
                <div className="flex-1">
                  <h4 className="font-medium">Заселення в готель</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Grand Hotel Paris, реєстрація та відпочинок
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Проживання
                    </span>
                    <span className="text-sm text-gray-500">1 год</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-20 text-sm text-gray-600">15:00</div>
                <div className="flex-1">
                  <h4 className="font-medium">Оглядова екскурсія</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Знайомство з містом, основні пам'ятки
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Екскурсія
                    </span>
                    <span className="text-sm text-gray-500">3 год</span>
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
                <div className="w-20 text-sm text-gray-600">10:00</div>
                <div className="flex-1">
                  <h4 className="font-medium">Сніданок у місцевому кафе</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Le Petit Café, традиційний французький сніданок
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      Харчування
                    </span>
                    <span className="text-sm text-gray-500">1.5 год</span>
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
  );
};

export default ScheduleCard;
