import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { dateFormatter } from "@/lib/utils";

const event_typt_dict = {
  transport: "Транспорт",
  accommodation: "Проживання",
  sightseeing: "Огляд",
  food: "Їжа",
  culture: "Культура",
  leisure: "Відпочинок",
  entertainment: "Розваги",
  shopping: "Покупки",
  activity: "Активності",
};

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
          {trip.schedule.days.map((day) => (
            <div key={day.id}>
              <h3 className="text-lg font-semibold mb-4">
                День {day.id} - {dateFormatter(day.date)} - {day.location}
              </h3>
              <div className="space-y-4">
                {day.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-20 text-sm text-gray-600">
                      {event.time}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {event.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`px-2 py-1 ${
                            {
                              transport: "bg-blue-100 text-blue-700",
                              accommodation: "bg-green-100 text-green-700",
                              sightseeing: "bg-purple-100 text-purple-700",
                              food: "bg-yellow-100 text-yellow-700",
                              culture: "bg-red-100 text-red-700",
                              leisure: "bg-indigo-100 text-indigo-700",
                              entertainment: "bg-pink-100 text-pink-700",
                              shopping: "bg-orange-100 text-orange-700",
                            }[event.type] || "bg-gray-100 text-gray-700"
                          } text-xs rounded-full`}
                        >
                          {event_typt_dict[event.type] || event.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {event.duration}
                        </span>
                        <span className="text-sm text-gray-500">
                          • {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button className="w-full px-4 py-2 mt-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700">
            + Додати новий день
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
