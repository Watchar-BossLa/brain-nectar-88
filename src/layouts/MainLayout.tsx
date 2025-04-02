
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const MainLayoutWrapper: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  return (
    <MainLayout>
      {children || <Outlet />}
    </MainLayout>
  );
};

export default MainLayoutWrapper;
