// Routes.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate  } from 'react-router-dom';
import App from './App.jsx';
import ClientsPage from './pages/Clients.jsx';
import ContactsPage from './pages/Contacts.jsx';
import ViewLog from './pages/ViewLog.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // layout shell with <Outlet />
    children: [
      {
        index: true, // this means the default child route (i.e., when path is exactly '/')
        element: <Navigate to="/clients" replace />
      },
      {
        path: 'clients',
        element: <ClientsPage />
      },
      {
        path: 'contacts',
        element: <ContactsPage />
      },
      {
        path: 'viewlog', 
        element: <ViewLog />
      }
    ]
  }
]);

const AppRoutes = () => <RouterProvider router={router} />;
export default AppRoutes;
