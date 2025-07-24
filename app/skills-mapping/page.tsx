"use client";

import React from "react";
import { useSkillMatrices } from "../../hooks/useSkillMatrices";
import { useDepartments } from "../../hooks/useDepartments";
import DatabaseLoading from "../components/DatabaseLoading";
import DatabaseError from "../components/DatabaseError";

export default function SkillsMapping() {
  const { matrices, loading: matricesLoading, error: matricesError } = useSkillMatrices();
  const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments();

  // Loading state
  if (matricesLoading || departmentsLoading) {
    return <DatabaseLoading />;
  }

  // Error state
  if (matricesError || departmentsError) {
    return <DatabaseError error={matricesError || departmentsError || ""} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Skills Mapping
            </h1>
            <p className="text-gray-600 mb-8">
              View and manage your organization's skills matrices
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-800 mb-2">Skill Matrices</h3>
                <p className="text-3xl font-bold text-orange-600">{matrices.length}</p>
                <p className="text-orange-700">Total matrices available</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">Departments</h3>
                <p className="text-3xl font-bold text-blue-600">{departments.length}</p>
                <p className="text-blue-700">Active departments</p>
              </div>
            </div>

            {matrices.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Skills Matrices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matrices.map((matrix) => (
                    <div
                      key={matrix._id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">{matrix.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Department: {departments.find(d => d._id === matrix.department)?.name || matrix.department}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{matrix.employeeCount || 0} employees</span>
                        <span>{matrix.skillCount || 0} skills</span>
                      </div>
                      {matrix.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(matrix.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matrices.length === 0 && (
              <div className="mt-8 text-center">
                <p className="text-gray-500 mb-4">No skills matrices found.</p>
                <p className="text-sm text-gray-400">
                  Create your first skills matrix using the Skills Matrix Maker.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
