import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProfilePage = ({ user, onUpdateProfile }) => {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    avatar: user.avatar || null,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError(t("profile.fillRequired"));
      return;
    }
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageChange = (locale) => {
    i18n.changeLanguage(locale);
    localStorage.setItem("language", locale);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{t("profile.title")}</span>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                {t("profile.edit")}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <div className="text-center">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("profile.nameRequired")}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("profile.emailRequired")}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("profile.phone")}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("profile.city")}</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("profile.language")}</label>
                  <select
                    value={i18n.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm bg-white"
                  >
                    <option value="uk">Українська</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          location: user.location || "",
                          avatar: user.avatar || null,
                        });
                      }}
                    >
                      {t("profile.cancel")}
                    </Button>
                    <Button type="submit">{t("profile.save")}</Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
