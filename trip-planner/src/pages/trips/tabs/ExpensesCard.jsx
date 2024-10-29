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
                {trip.expenses.total.toLocaleString()} грн
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Додати витрату
            </button>
          </div>

          <div className="divide-y">
            {trip.expenses.categories.map((category) => (
              <div key={category.id} className="py-4">
                <h4 className="font-medium mb-2">{category.name}</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.amount.toLocaleString()} грн
                        </div>
                        <div className="text-sm text-gray-500">
                          Сплатив: {item.user.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-4">Розподіл витрат</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {trip.expenses.participants_cost.map((participant) => (
                <div
                  key={participant.id}
                  className="flex justify-between items-center"
                >
                  <span>{participant.user?.name}</span>
                  <div className="text-right">
                    <span className="font-medium">
                      {participant.total_paid.toLocaleString()} грн
                    </span>
                    <div
                      className={`text-sm ${participant.balance > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {participant.balance > 0 ? "+" : ""}
                      {participant.balance.toLocaleString()} грн
                    </div>
                  </div>
                </div>
              ))}

              {trip.expenses.transfers &&
                trip.expenses.transfers.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="font-medium mb-2">Необхідні перекази:</h5>
                    {trip.expenses.transfers.map((transfer) => (
                      <div
                        key={transfer.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>
                          {transfer.from?.name} → {transfer.to?.name}
                        </span>
                        <span className="font-medium">
                          {transfer.amount.toLocaleString()} грн
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesCard;
