import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { registerLogoutCallback } from '../services/api';

type UserData = {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  statusAssinatura?: string;
  [key: string]: any;
};

type AuthContextData = {
  user: UserData | null;
  isLoading: boolean;
  signIn: (token: string, userData: UserData) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<UserData>) => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  useEffect(() => {
    registerLogoutCallback(signOut);
  });

  async function loadStorageData() {
    try {
      const [token, userData] = await AsyncStorage.multiGet([
        'userToken',
        'userData',
      ]);

      if (token[1] && userData[1]) {
        setUser(JSON.parse(userData[1]));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = useCallback(async (token: string, userData: UserData) => {
    try {
      await AsyncStorage.multiSet([
        ['userToken', token],
        ['userData', JSON.stringify(userData)],
      ]);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao salvar dados de login:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  }, []);

  const updateUser = useCallback(async (newUserData: Partial<UserData>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...newUserData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signOut,
      updateUser,
    }),
    [user, isLoading, signIn, signOut, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
