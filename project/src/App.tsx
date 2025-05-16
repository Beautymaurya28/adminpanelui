import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </ThemeProvider>
  );
}

export default App;