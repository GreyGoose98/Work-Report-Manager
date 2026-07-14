import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ReportCreatePage } from '../pages/ReportCreatePage';
import { ReportDetailPage } from '../pages/ReportDetailPage';
import { ReportEditPage } from '../pages/ReportEditPage';
import { ReportListPage } from '../pages/ReportListPage';
import { SettingsPage } from '../pages/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="reports" element={<ReportListPage />} />
        <Route path="reports/new" element={<ReportCreatePage />} />
        <Route path="reports/:id" element={<ReportDetailPage />} />
        <Route path="reports/:id/edit" element={<ReportEditPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
