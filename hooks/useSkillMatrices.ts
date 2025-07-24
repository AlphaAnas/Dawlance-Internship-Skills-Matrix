"use client"

import { useState, useEffect } from 'react';

interface SkillMatrix {
  id: string;
  name: string;
  description: string;
  department: string;
  departmentId: string;
  matrixData: {
    employees: any[];
    skills: string[];
    skillLevels: { [key: string]: string };
    employeeCount: number;
    skillCount: number;
  };
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseSkillMatricesReturn {
  matrices: SkillMatrix[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  saveMatrix: (matrixData: any) => Promise<boolean>;
  updateMatrix: (id: string, matrixData: any) => Promise<boolean>;
  deleteMatrix: (id: string) => Promise<boolean>;
  getMatrixById: (id: string) => Promise<SkillMatrix | null>;
}

export const useSkillMatrices = (departmentId?: string): UseSkillMatricesReturn => {
  const [matrices, setMatrices] = useState<SkillMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = departmentId && departmentId !== 'all' 
        ? `/api/skill-matrices?departmentId=${departmentId}`
        : '/api/skill-matrices';
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setMatrices(result.data);
      } else {
        setError(result.message || 'Failed to fetch skill matrices');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching skill matrices:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveMatrix = async (matrixData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/skill-matrices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matrixData),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchMatrices(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to save skill matrix');
        return false;
      }
    } catch (err) {
      setError('Network error occurred while saving');
      console.error('Error saving skill matrix:', err);
      return false;
    }
  };

  const updateMatrix = async (id: string, matrixData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/skill-matrices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...matrixData }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchMatrices(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to update skill matrix');
        return false;
      }
    } catch (err) {
      setError('Network error occurred while updating');
      console.error('Error updating skill matrix:', err);
      return false;
    }
  };

  const deleteMatrix = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/skill-matrices/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchMatrices(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to delete skill matrix');
        return false;
      }
    } catch (err) {
      setError('Network error occurred while deleting');
      console.error('Error deleting skill matrix:', err);
      return false;
    }
  };

  const getMatrixById = async (id: string): Promise<SkillMatrix | null> => {
    try {
      const response = await fetch(`/api/skill-matrices/${id}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to fetch skill matrix');
        return null;
      }
    } catch (err) {
      setError('Network error occurred while fetching matrix');
      console.error('Error fetching skill matrix:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchMatrices();
  }, [departmentId]);

  const refetch = async () => {
    await fetchMatrices();
  };

  return {
    matrices,
    loading,
    error,
    refetch,
    saveMatrix,
    updateMatrix,
    deleteMatrix,
    getMatrixById
  };
};
