import React from 'react';
import { Crown, Lock, Zap, Star, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ children, feature }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.isPremium) {
    return <>{children}</>;
  }

  const getFeatureIcon = () => {
    if (feature.includes('Analytics')) return BarChart3;
    if (feature.includes('Team') || feature.includes('Collaboration')) return Users;
    return Star;
  };

  const FeatureIcon = getFeatureIcon();

  const premiumFeatures = [
    'AI-powered pitch optimization',
    'Producer & platform matching',
    'Advanced market analytics',
    'Real-time collaboration tools',
    'Custom pitch page templates',
    'Priority support'
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/95 to-purple-50/95 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Unlock Premium Features</h3>
          <p className="text-gray-600 mb-6">
            Get access to {feature.toLowerCase()} and transform how you pitch your stories to the industry.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 gap-2 text-sm">
              {premiumFeatures.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
            >
              <Crown className="h-5 w-5" />
              <span>Upgrade to Premium</span>
            </button>
            <p className="text-xs text-gray-500">14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </div>
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>
    </div>
  );
};

export default PremiumGate;