import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, TrendingUp, Eye, Send, Users, Calendar, Film, Target, Star, Crown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import PremiumGate from '../PremiumGate';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();

  const pitchPerformanceData = [
    { name: 'Mon', views: 12, outreach: 3 },
    { name: 'Tue', views: 19, outreach: 5 },
    { name: 'Wed', views: 8, outreach: 2 },
    { name: 'Thu', views: 25, outreach: 8 },
    { name: 'Fri', views: 22, outreach: 6 },
    { name: 'Sat', views: 15, outreach: 4 },
    { name: 'Sun', views: 9, outreach: 1 },
  ];

  const genrePerformance = [
    { name: 'Thriller', value: 35, color: '#3B82F6' },
    { name: 'Drama', value: 28, color: '#10B981' },
    { name: 'Sci-Fi', value: 20, color: '#8B5CF6' },
    { name: 'Comedy', value: 17, color: '#F59E0B' },
  ];

  const industryTrends = [
    { month: 'Jan', streaming: 75, theatrical: 45, festivals: 30 },
    { month: 'Feb', streaming: 82, theatrical: 48, festivals: 35 },
    { month: 'Mar', streaming: 78, theatrical: 42, festivals: 38 },
    { month: 'Apr', streaming: 85, theatrical: 50, festivals: 42 },
    { month: 'May', streaming: 90, theatrical: 55, festivals: 45 },
    { month: 'Jun', streaming: 87, theatrical: 52, festivals: 48 },
  ];

  const AnalyticsContent = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Total Pitch Views', value: '1,247', change: '+23%', icon: Eye, color: 'text-blue-600' },
          { name: 'Outreach Sent', value: '89', change: '+15%', icon: Send, color: 'text-green-600' },
          { name: 'Producer Matches', value: '24', change: '+8%', icon: Users, color: 'text-purple-600' },
          { name: 'Response Rate', value: '12.5%', change: '+3.2%', icon: Target, color: 'text-orange-600' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <p className={`text-sm mt-1 ${metric.color}`}>{metric.change} from last month</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pitch Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Pitch Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pitchPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#3B82F6" name="Views" />
              <Bar dataKey="outreach" fill="#10B981" name="Outreach" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Genre Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genrePerformance}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {genrePerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Industry Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Acquisition Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={industryTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="streaming" stroke="#8B5CF6" strokeWidth={2} name="Streaming Platforms" />
            <Line type="monotone" dataKey="theatrical" stroke="#10B981" strokeWidth={2} name="Theatrical" />
            <Line type="monotone" dataKey="festivals" stroke="#F59E0B" strokeWidth={2} name="Film Festivals" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Project Performance */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Projects</h3>
        <div className="space-y-4">
          {[
            { title: 'Midnight in Tokyo', genre: 'Neo-noir Thriller', views: 127, responses: 8, score: 92 },
            { title: 'The Last Lighthouse', genre: 'Drama Series', views: 89, responses: 5, score: 87 },
            { title: 'Quantum Hearts', genre: 'Sci-Fi Romance', views: 64, responses: 3, score: 78 },
          ].map((project, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Film className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600">{project.genre}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{project.views}</p>
                  <p className="text-gray-500">Views</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{project.responses}</p>
                  <p className="text-gray-500">Responses</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">{project.score}</p>
                  <p className="text-gray-500">AI Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Market Insights</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Genre Opportunity</p>
              <p className="text-sm text-gray-600">Neo-noir thrillers are seeing 40% higher acquisition rates this quarter. Consider developing more projects in this genre.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Pitch Optimization</p>
              <p className="text-sm text-gray-600">Your response rate is 25% above industry average. Focus on streaming platforms for maximum success.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 rounded-full p-2">
              <Star className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Timing Recommendation</p>
              <p className="text-sm text-gray-600">Best time to send pitches: Tuesday-Thursday, 10-11 AM EST for 35% higher open rates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Track your pitch performance and discover market opportunities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      <PremiumGate feature="Advanced Analytics & Market Insights">
        <AnalyticsContent />
      </PremiumGate>
    </div>
  );
};

export default AnalyticsPage;