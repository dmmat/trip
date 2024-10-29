import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const TripRouteCard = ({ trip }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Маршрут подорожі</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trip.locations.map((location, index) => (
            <div
              key={location.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{location.name}</h3>
                <p className="text-sm text-gray-500">{location.country}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Запланований час: {location.duration}</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Додати фото{" "}
                    {location.photos.length > 0 &&
                      `(${location.photos.length})`}
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Додати нотатки {location.notes && "✓"}
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
  );
};

export default TripRouteCard;
