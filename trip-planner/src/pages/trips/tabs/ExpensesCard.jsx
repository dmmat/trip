import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ExpensesCard = ({ trip }) => {
  return (
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
                <div key={index} className="flex justify-between items-center">
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
  );
};

export default ExpensesCard;
