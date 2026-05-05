import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import DocumentsPage from '../pages/DocumentsPage'
import EditorPage from '../pages/EditorPage'
import LoginPage from '../pages/LoginPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/documents" replace />,
      },
      {
        path: 'documents',
        element: <DocumentsPage />,
      },
      {
        path: 'documents/:id',
        element: <EditorPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/documents" replace />,
  },
])
