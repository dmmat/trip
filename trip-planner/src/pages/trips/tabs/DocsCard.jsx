import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const DocsCard = ({ trip }) => {
  return (
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
              {trip.documents
                .filter((doc) => doc.category === "transport")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.size} • {doc.addedDate}
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      Завантажити
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Проживання */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Проживання</h3>
            <div className="space-y-2">
              {trip.documents
                .filter((doc) => doc.category === "accommodation")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.size} • {doc.addedDate}
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      Завантажити
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Страхування */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Страхування</h3>
            <div className="space-y-2">
              {trip.documents
                .filter((doc) => doc.category === "insurance")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.size} • {doc.addedDate}
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      Завантажити
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Інші документи */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Інші документи</h3>
            <div className="space-y-2">
              {trip.documents
                .filter((doc) => doc.category === "other")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.size} • {doc.addedDate}
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      Завантажити
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocsCard;
