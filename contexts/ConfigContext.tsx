"use client";
import React, { createContext, useContext, ReactNode } from 'react';

interface AppConfig {
  API_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  MAX_BOOKS_PER_USER: number;
  LOAN_PERIOD_DAYS: number;
  MAX_RENEWALS: number;
  MAX_FILE_SIZE: number;
  ITEMS_PER_PAGE: number;
  SEARCH_DEBOUNCE_MS: number;
  NOTIFICATION_DURATION: number;
  ENABLE_NOTIFICATIONS: boolean;
  ENABLE_EMAIL_NOTIFICATIONS: boolean;
  ENABLE_REVIEWS: boolean;
  ENABLE_STATISTICS: boolean;
  UPLOAD_DIR: string;
  BOOKS_UPLOAD_DIR: string;
  USERS_UPLOAD_DIR: string;
  DEBUG: boolean;
}

const defaultConfig: AppConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'YORI',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  MAX_BOOKS_PER_USER: parseInt(process.env.NEXT_PUBLIC_MAX_BOOKS_PER_USER || '5'),
  LOAN_PERIOD_DAYS: parseInt(process.env.NEXT_PUBLIC_LOAN_PERIOD_DAYS || '14'),
  MAX_RENEWALS: parseInt(process.env.NEXT_PUBLIC_MAX_RENEWALS || '2'),
  MAX_FILE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'),
  ITEMS_PER_PAGE: parseInt(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || '10'),
  SEARCH_DEBOUNCE_MS: parseInt(process.env.NEXT_PUBLIC_SEARCH_DEBOUNCE_MS || '300'),
  NOTIFICATION_DURATION: parseInt(process.env.NEXT_PUBLIC_NOTIFICATION_DURATION || '5000'),
  ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  ENABLE_EMAIL_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS === 'true',
  ENABLE_REVIEWS: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',
  ENABLE_STATISTICS: process.env.NEXT_PUBLIC_ENABLE_STATISTICS === 'true',
  UPLOAD_DIR: process.env.NEXT_PUBLIC_UPLOAD_DIR || '/uploads',
  BOOKS_UPLOAD_DIR: process.env.NEXT_PUBLIC_BOOKS_UPLOAD_DIR || '/uploads/books',
  USERS_UPLOAD_DIR: process.env.NEXT_PUBLIC_USERS_UPLOAD_DIR || '/uploads/users',
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true',
};

const ConfigContext = createContext<AppConfig>(defaultConfig);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigContext.Provider value={defaultConfig}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  return context;
};
