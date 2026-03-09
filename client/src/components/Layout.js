import React from 'react';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
