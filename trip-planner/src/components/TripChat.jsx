import React, { useState } from "react";
import { Image, PlusCircle, Send, Smile } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TripChat = () => {
  const [message, setMessage] = useState("");

  const messages = [
    {
      id: 1,
      author: "Марія",
      content: "Всім привіт! Я знайшла чудовий ресторан біля нашого готелю",
      timestamp: "14:30",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 2,
      author: "Петро",
      content: "Супер! Можеш скинути посилання?",
      timestamp: "14:32",
      avatar: "https://avatar.iran.liara.run/public/34",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Логіка відправки повідомлення
    setMessage("");
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Обговорення</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Список повідомлень */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <img
                src={msg.avatar}
                alt={msg.author}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium">{msg.author}</span>
                  <span className="text-sm text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="text-gray-700 mt-1">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Форма відправки повідомлення */}
        <form onSubmit={handleSendMessage} className="mt-auto">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Image className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Написати повідомлення..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-2 text-blue-600 hover:text-blue-700"
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripChat;
