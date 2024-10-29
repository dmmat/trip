import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Send, PlusCircle } from "lucide-react";

const ChatCard = ({ trip }) => {
  return (
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
                  Всім привіт! Я знайшла чудовий ресторан біля нашого готелю,
                  рейтинг 4.8 та прийнятні ціни. Як щодо забронювати столик на
                  перший вечір?
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
                  Звісно! Ось посилання на ресторан: [лінк]. Подивіться меню,
                  якщо всім підходить, я забронюю столик на 19:00.
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
                  Друзі, я знайшла екскурсію на другий день, можемо подивитись
                  основні пам'ятки з місцевим гідом. Ціна 30€ з людини,
                  тривалість 3 години.
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
  );
};

export default ChatCard;
