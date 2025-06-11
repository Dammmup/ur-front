import React, { type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
  requiresAccess?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, requiresAccess }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // Показываем спиннер, пока идет загрузка информации о пользователе
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Если пользователь не авторизован, отправляем на страницу логина
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Админы и учителя всегда имеют доступ
  const isPrivilegedUser = user.role && ['admin', 'teacher'].includes(user.role);

  if (!isPrivilegedUser && requiresAccess) {
    // Для страниц, требующих access, проверяем и верификацию, и наличие оплаты
    if (!user.emailVerified || !user.access) {
      return <Navigate to="/pricing" replace />;
    }
  }

  // Ограничиваем доступ по ролям, если передан список allowedRoles
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
