import { useState, useEffect } from 'react';

interface UserSession {
  email: string;
  role: 'admin' | 'manager' | 'user';
  loginTime: string;
}

export const useUserPermissions = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        setUserSession(JSON.parse(session));
      } catch (error) {
        console.error('Error parsing user session:', error);
        localStorage.removeItem('userSession');
      }
    }
    setIsLoading(false);
  }, []);

  const permissions = {
    // Manager permissions
    canAddEmployee: userSession?.role === 'manager' || userSession?.role === 'admin',
    canCreateSkillsMatrix: userSession?.role === 'manager' || userSession?.role === 'admin',
    canEditEmployee: userSession?.role === 'manager' || userSession?.role === 'admin',
    
    // Admin permissions
    canResetPassword: userSession?.role === 'admin',
    canManageUsers: userSession?.role === 'admin',
    canDeleteEmployee: userSession?.role === 'admin',
    
    // View permissions (all users can view)
    canViewDashboard: true,
    canViewEmployees: true,
    canViewSkillsMatrix: true,
  };

  const logout = () => {
    localStorage.removeItem('userSession');
    setUserSession(null);
    window.location.href = '/login';
  };

  return {
    userSession,
    permissions,
    isLoading,
    logout,
    isLoggedIn: !!userSession,
    userRole: userSession?.role || 'user',
    userEmail: userSession?.email || '',
  };
};

export default useUserPermissions;
