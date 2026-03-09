import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Users, 
  BarChart3, 
  LogOut,
  Github
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/projects', icon: FolderGit2, label: 'Projects' },
    { path: '/matching', icon: Users, label: 'Find Collaborators' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
          SkillTrust AI
        </h1>
        <p className="text-xs text-gray-400 mt-1">Skill Intelligence Platform</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        {user?.githubUsername && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-gray-400">
            <Github className="w-3 h-3" />
            <span>{user.githubUsername}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
