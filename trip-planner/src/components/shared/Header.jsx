import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, LogOut, User, ChevronDown } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-blue-600">
              <Link to="/">TripPlanner</Link>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            <button className="p-2 text-gray-400 hover:text-gray-500" title={t("nav.notifications")}>
              <Bell className="w-6 h-6" />
            </button>

            {user && (
              <div className="relative">
                <button
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="text-sm text-left hidden sm:block">
                    <div className="font-medium text-gray-700">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 block"
                    >
                      {t("nav.profile")}
                    </Link>
                    <hr className="my-1" />
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      onClick={onLogout}
                    >
                      {t("auth.logout")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
