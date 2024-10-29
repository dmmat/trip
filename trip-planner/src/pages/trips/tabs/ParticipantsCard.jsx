import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
const ParticipantsCard = ({ trip }) => {
  return (
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
  );
};

export default ParticipantsCard;
