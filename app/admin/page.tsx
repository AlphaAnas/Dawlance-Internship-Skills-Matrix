"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Settings, Users, Database, Eye, Edit, Trash2, UserPlus, Key, LogOut } from 'lucide-react';
import Button from '../components/Button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  lastLogin: string;
  status: 'active' | 'inactive';
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', email: 'admin@dawlance.com', name: 'System Admin', role: 'admin', lastLogin: '2024-01-15', status: 'active' },
    { id: '2', email: 'manager@dawlance.com', name: 'John Manager', role: 'manager', lastLogin: '2024-01-14', status: 'active' },
    { id: '3', email: 'user@dawlance.com', name: 'Jane User', role: 'user', lastLogin: '2024-01-13', status: 'active' },
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    window.location.href = '/login';
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      lastLogin: 'Never',
      status: 'active',
      role: newUser.role as 'admin' | 'manager' | 'user'
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'user' });
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-white/60" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <Shield className="w-8 h-8 text-white/60" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Managers</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'manager').length}</p>
              </div>
              <User className="w-8 h-8 text-white/60" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <Database className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </motion.div>

        {/* User Management Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">User Management</h2>
              <Button
                onClick={() => setShowAddUser(true)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-white/90 font-medium">Name</th>
                  <th className="text-left p-4 text-white/90 font-medium">Email</th>
                  <th className="text-left p-4 text-white/90 font-medium">Role</th>
                  <th className="text-left p-4 text-white/90 font-medium">Last Login</th>
                  <th className="text-left p-4 text-white/90 font-medium">Status</th>
                  <th className="text-left p-4 text-white/90 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4 text-white">{user.name}</td>
                    <td className="p-4 text-white/80">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">{user.lastLogin}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowResetPassword(true);
                          }}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-white/70 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Label className="text-white/90 text-sm">Name</Label>
                <Input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                  className="mt-1 bg-white/10 border border-white/30 text-white placeholder:text-white/60"
                  required
                />
              </div>
              
              <div>
                <Label className="text-white/90 text-sm">Email</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                  className="mt-1 bg-white/10 border border-white/30 text-white placeholder:text-white/60"
                  required
                />
              </div>
              
              <div>
                <Label className="text-white/90 text-sm">Role</Label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium transition-all duration-200 shadow-lg"
                >
                  Add User
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Reset Password</h3>
              <button
                onClick={() => setShowResetPassword(false)}
                className="text-white/70 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-white/80">
                Reset password for <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-white/60 text-sm">
                A new temporary password will be sent to {selectedUser.email}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetPassword(false)}
                  className="flex-1 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Password reset email sent to ${selectedUser.email}`);
                    setShowResetPassword(false);
                  }}
                  className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200 shadow-lg"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
