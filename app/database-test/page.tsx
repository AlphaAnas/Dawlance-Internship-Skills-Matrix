"use client"

import { useState } from 'react';
import Button from '../components/Button';

export default function DatabaseTestPage() {
  const [loading, setLoading] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const seedDatabase = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/seed-database', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSeedResult(result.data);
      } else {
        setError(result.message || 'Failed to seed database');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error:', err);
    }
    
    setLoading(false);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/employees');
      const result = await response.json();
      
      if (result.success) {
        setEmployees(result.data);
      } else {
        setError(result.message || 'Failed to fetch employees');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error:', err);
    }
    
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-4xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">MongoDB Database Test</h1>
        <p className="text-lg text-gray-600">
          Test MongoDB connection and seed the fridge manufacturing database
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <span>❌ {error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            🗄️ Seed Database
          </h2>
          <p className="text-gray-600 mb-4">
            Populate the database with sample fridge manufacturing data
          </p>
          
          <Button 
            onClick={seedDatabase} 
            disabled={loading}
            className="w-full mb-4"
          >
            {loading ? 'Seeding Database...' : 'Seed Database'}
          </Button>

          {seedResult && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <span className="font-medium">✅ Database seeded successfully!</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Departments: <span className="font-semibold">{seedResult.departments}</span></div>
                <div>Managers: <span className="font-semibold">{seedResult.managers}</span></div>
                <div>Employees: <span className="font-semibold">{seedResult.employees}</span></div>
                <div>Skills: <span className="font-semibold">{seedResult.skills}</span></div>
                <div>Machines: <span className="font-semibold">{seedResult.machines}</span></div>
                <div>Employee Skills: <span className="font-semibold">{seedResult.employeeSkills}</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            👥 Test Data Retrieval
          </h2>
          <p className="text-gray-600 mb-4">
            Fetch employees from the database to verify connection
          </p>
          
          <Button 
            onClick={fetchEmployees} 
            disabled={loading}
            variant="outline"
            className="w-full mb-4"
          >
            {loading ? 'Fetching Data...' : 'Fetch Employees'}
          </Button>

          {employees.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <span className="font-medium">✅ Found {employees.length} employees</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {employees.slice(0, 10).map((employee, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded flex justify-between">
                    <span>{employee.name}</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {employee.department}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {employee.skillLevel}
                      </span>
                    </div>
                  </div>
                ))}
                {employees.length > 10 && (
                  <div className="text-sm text-gray-500 text-center py-2">
                    ... and {employees.length - 10} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Database Schema Information</h2>
        <p className="text-gray-600 mb-4">
          Overview of the fridge manufacturing database structure
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Collections Created:</h4>
            <ul className="text-sm space-y-1">
              <li>• departments</li>
              <li>• managers</li>
              <li>• employees</li>
              <li>• skills</li>
              <li>• machines</li>
              <li>• employee_skills</li>
              <li>• employee_work_history</li>
              <li>• skill_matrices</li>
              <li>• export_logs</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Departments:</h4>
            <ul className="text-sm space-y-1">
              <li>• Sheet Metal</li>
              <li>• Assembly Line</li>
              <li>• Cooling Systems</li>
              <li>• Quality Control</li>
              <li>• Painting</li>
              <li>• Packaging</li>
              <li>• Blow Molding</li>
              <li>• Maintenance</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="text-sm space-y-1">
              <li>• Soft delete support</li>
              <li>• Automatic timestamps</li>
              <li>• Indexed queries</li>
              <li>• Relational data</li>
              <li>• Skill level tracking</li>
              <li>• Work history logging</li>
              <li>• Export tracking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Getting Started:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Make sure MongoDB is running on your system (mongodb://localhost:27017)</li>
          <li>2. Click "Seed Database" to populate with sample data</li>
          <li>3. Click "Fetch Employees" to verify the data was inserted correctly</li>
          <li>4. The data includes realistic fridge manufacturing departments, employees, skills, and work history</li>
        </ol>
      </div>
    </div>
  );
}
