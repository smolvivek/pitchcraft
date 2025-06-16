import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Crown, Settings, Home, Film, BarChart3, Users, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/tasks', icon: Film },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, premium: true },
    { name: 'Collaborate', href: '/team', icon: Users, premium: true },
  ];

  const handleNavigation = (href: string, isPremium: boolean) => {
    if (isPremium && !user?.isPremium) {
      navigate('/pricing');
    } else {
      navigate(href);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">PitchCraft</h1>
          </div>
          {user?.isPremium && (
            <Crown className="h-5 w-5 text-yellow-500" />
          )}
        </div>
        
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isPremiumFeature = item.premium && !user?.isPremium;
            const isActive = location.pathname === item.href;
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, item.premium || false)}
                className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : isPremiumFeature
                    ? 'text-gray-400 hover:text-gray-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.premium && !user?.isPremium && (
                  <Crown className="ml-auto h-4 w-4 text-yellow-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade CTA for free users */}
        {!user?.isPremium && (
          <div className="mx-3 mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Unlock AI pitch builder, producer matching, and advanced analytics</p>
            <button 
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs py-2 px-3 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              View Plans
            </button>
          </div>
        )}

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  {user?.isPremium ? (
                    <>
                      <Crown className="h-3 w-3 text-yellow-500 mr-1" />
                      Premium
                    </>
                  ) : (
                    'Free Plan'
                  )}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate('/settings')}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6 px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;