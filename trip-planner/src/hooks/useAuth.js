import { useState, useEffect } from "react";
import pb from "@/lib/pocketbase";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // При завантаженні перевіряємо наявність авторизованого користувача в PocketBase
    if (pb.authStore.isValid && pb.authStore.model) {
      setUser({
        id: pb.authStore.model.id,
        name: pb.authStore.model.name || pb.authStore.model.username,
        email: pb.authStore.model.email,
        username: pb.authStore.model.username,
        avatar: pb.authStore.model.avatar,
      });
    }

    // Підписуємося на зміни авторизації
    const unsubscribe = pb.authStore.onChange(() => {
      if (pb.authStore.isValid && pb.authStore.model) {
        setUser({
          id: pb.authStore.model.id,
          name: pb.authStore.model.name || pb.authStore.model.username,
          email: pb.authStore.model.email,
          username: pb.authStore.model.username,
          avatar: pb.authStore.model.avatar,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (credentials, remember = false) => {
    try {
      const authData = await pb.collection('users').authWithPassword(
        credentials.email,
        credentials.password
      );
      
      setUser({
        id: authData.record.id,
        name: authData.record.name || authData.record.username,
        email: authData.record.email,
        username: authData.record.username,
        avatar: authData.record.avatar,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Невірний email або пароль' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = {
        username: userData.email.split('@')[0] + '_' + Date.now(),
        email: userData.email,
        emailVisibility: true,
        password: userData.password,
        passwordConfirm: userData.password,
        name: userData.name,
      };

      const record = await pb.collection('users').create(data);
      
      // Автоматично входимо після реєстрації
      await pb.collection('users').authWithPassword(
        userData.email,
        userData.password
      );
      
      setUser({
        id: record.id,
        name: record.name || record.username,
        email: record.email,
        username: record.username,
        avatar: record.avatar,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Помилка реєстрації' 
      };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const updateUser = async (userData) => {
    try {
      const formData = new FormData();
      
      if (userData.name) formData.append('name', userData.name);
      if (userData.email) formData.append('email', userData.email);
      if (userData.avatar instanceof File) {
        formData.append('avatar', userData.avatar);
      }
      
      const updatedRecord = await pb.collection('users').update(user.id, formData);
      
      setUser({
        id: updatedRecord.id,
        name: updatedRecord.name || updatedRecord.username,
        email: updatedRecord.email,
        username: updatedRecord.username,
        avatar: updatedRecord.avatar,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { 
        success: false, 
        error: error.message || 'Помилка оновлення профілю' 
      };
    }
  };

  return { user, login, register, logout, updateUser };
};
