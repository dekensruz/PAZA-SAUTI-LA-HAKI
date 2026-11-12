import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAdmin } from './auth';
import AdminLayout from './AdminLayout';
import LoginPage from './LoginPage';
import ArticlesPage from './ArticlesPage';
import ArticleEditorPage from './ArticleEditorPage';
import CalendarPage from './calendar/CalendarPage';
import GalleryAdminPage from './GalleryAdminPage';
import MessagesPage from './MessagesPage';

const AdminApp: React.FC = () => {
  useEffect(() => {
    document.title = 'Administration · Paza Sauti La Haki';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<ArticlesPage />} />
          <Route path="articles/new" element={<ArticleEditorPage key="new" />} />
          <Route path="articles/:id" element={<ArticleEditorPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="gallery" element={<GalleryAdminPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default AdminApp;
