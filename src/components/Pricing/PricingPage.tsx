import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Star, ArrowRight, Shield, Users, BarChart3, Headphones } from 'lucide-react';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = {
    free: [
      'Up to 50 tasks per month',
      'Basic task management',
      'Simple dashboard',
      'Email support',
      'Mobile app access'
    ],
    premium: [
      'Unlimited tasks',
      'Advanced analytics & insights',
      'Team collaboration tools',
      'Priority support',
      'Custom integrations',
      'Advanced automation',
      'Export & backup',
      'Custom branding'
    ]
  };

  const handleUpgrade = () => {
    // In a real app, this would integrate with Stripe or another payment processor
    alert('Upgrade functionality would be implemented here with Stripe integration');
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">PitchCraft</h1>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Productivity</span> Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock your full potential with our premium features designed to supercharge your productivity and team collaboration.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative">
            <div className="text-center mb-8">
              <div className="bg-gray-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started with productivity management</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleGetStarted}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 relative text-white transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="bg-white/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-blue-100">/month</span>
              </div>
              <p className="text-blue-100">Everything you need for maximum productivity</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Crown className="h-4 w-4" />
              <span>Upgrade to Premium</span>
            </button>

            <p className="text-center text-blue-100 text-sm mt-4">
              14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Premium?</h3>
          <p className="text-xl text-gray-600">Unlock advanced features that transform how you work</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h4>
            <p className="text-gray-600">Get deep insights into your productivity patterns with AI-powered recommendations</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h4>
            <p className="text-gray-600">Work seamlessly with your team using advanced collaboration tools and real-time updates</p>
          </div>

          <div className="text-center p-6">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Headphones className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Priority Support</h4>
            <p className="text-gray-600">Get priority customer support with faster response times and dedicated assistance</p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Thousands</h3>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-600">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-600">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-600">10k+ Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Boost Your Productivity?</h3>
          <p className="text-xl text-blue-100 mb-8">Join thousands of professionals who have transformed their workflow with PitchCraft</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleUpgrade}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Crown className="h-5 w-5" />
              <span>Start Free Trial</span>
            </button>
            <button
              onClick={handleGetStarted}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Try Free Version
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;