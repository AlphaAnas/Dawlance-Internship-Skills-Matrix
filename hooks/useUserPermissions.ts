import { useState, useEffect } from 'react';

interface UserSession {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: 'admin' | 'manager' | 'user';
  department?: string;
  loginTime: string;
}

export const useUserPermissions = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session with backend
  const validateSession = async (session: UserSession) => {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.id,
          role: session.role
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        console.warn('Session validation failed:', data.message);
        localStorage.removeItem('userSession');
        setUserSession(null);
        return false;
      }

      // Update session with latest data from backend
      const updatedSession = {
        ...session,
        name: data.user.name,
        email: data.user.email,
        department: data.user.department
      };
      
      console.log('Updated session:', updatedSession); // Debug log
      localStorage.setItem('userSession', JSON.stringify(updatedSession));
      setUserSession(updatedSession);
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      // Don't remove session on network errors, just use cached data
      console.log('Using cached session:', session); // Debug log
      setUserSession(session);
      return true;
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      const session = localStorage.getItem('userSession');
      if (session) {
        try {
          const parsedSession = JSON.parse(session);
          await validateSession(parsedSession);
        } catch (error) {
          console.error('Error parsing user session:', error);
          localStorage.removeItem('userSession');
        }
      }
      setIsLoading(false);
    };

    initializeSession();
  }, []);

  const permissions = {
    // Manager permissions - can add but not edit/delete skills and employees
    canAddEmployee: userSession?.role === 'manager' || userSession?.role === 'admin',
    canEditEmployee: userSession?.role === 'admin', // Only admin can edit employees
    canDeleteEmployee: userSession?.role === 'admin', // Only admin can delete employees
    
    canAddSkill: userSession?.role === 'manager' || userSession?.role === 'admin',
    canEditSkill: userSession?.role === 'admin', // Only admin can edit skills
    canDeleteSkill: userSession?.role === 'admin', // Only admin can delete skills
    
    // Skills matrix permissions
    canCreateSkillsMatrix: userSession?.role === 'manager' || userSession?.role === 'admin',
    canEditSkillsMatrix: userSession?.role === 'manager' || userSession?.role === 'admin',
    canDeleteSkillsMatrix: userSession?.role === 'admin',
    
    // Skill level editing - managers can edit skill levels in matrix
    canEditSkillLevels: userSession?.role === 'manager' || userSession?.role === 'admin',
    
    // Admin permissions
    canResetPassword: userSession?.role === 'admin',
    canManageUsers: userSession?.role === 'admin',
    
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
    userName: userSession?.name || '',
    userEmployeeId: userSession?.employeeId || '',
    userDepartment: userSession?.department || '',
  };
};

export default useUserPermissions;
