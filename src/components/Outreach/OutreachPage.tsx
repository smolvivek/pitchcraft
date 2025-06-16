import React from 'react';
import { motion } from 'framer-motion';
import { Send, Users, Target, TrendingUp, Mail, Phone, Globe, Star } from 'lucide-react';
import Layout from '../Layout/Layout';

const OutreachPage: React.FC = () => {
  const stats = [
    { label: 'Matches Found', value: '24', icon: Target, color: 'from-blue-500 to-indigo-600' },
    { label: 'Emails Sent', value: '18', icon: Send, color: 'from-green-500 to-emerald-600' },
    { label: 'Responses', value: '5', icon: Mail, color: 'from-purple-500 to-violet-600' },
    { label: 'Success Rate', value: '28%', icon: TrendingUp, color: 'from-orange-500 to-red-600' },
  ];

  const matches = [
    {
      id: 1,
      name: 'Sarah Chen',
      company: 'Netflix Original Series',
      role: 'Development Executive',
      match: 92,
      genres: ['Thriller', 'Drama'],
      location: 'Los Angeles, CA',
      projects: 'Looking for neo-noir content',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      company: 'A24 Films',
      role: 'Producer',
      match: 87,
      genres: ['Indie', 'Drama'],
      location: 'New York, NY',
      projects: 'Character-driven narratives',
      status: 'Contacted'
    },
    {
      id: 3,
      name: 'Emily Watson',
      company: 'HBO Max',
      role: 'Content Acquisitions',
      match: 84,
      genres: ['Sci-Fi', 'Thriller'],
      location: 'Los Angeles, CA',
      projects: 'High-concept series',
      status: 'Responded'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Contacted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Responded': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Smart Outreach
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            AI-powered matching with producers, platforms, and festivals
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Producer Matches
              </h3>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
                Find More Matches
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {match.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {match.name}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {match.role} at {match.company}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {match.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {match.match}% match
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-slate-700 dark:text-slate-300 mb-2">
                    {match.projects}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Genres:</span>
                    {match.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Pitch</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>View Profile</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-700/50"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Outreach Insights
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                Best Time to Send
              </h4>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                Tuesday-Thursday, 10-11 AM EST
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                35% higher open rates during these times
              </p>
            </div>
            
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                Response Rate Optimization
              </h4>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                Your response rate is 25% above average
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Focus on streaming platforms for maximum success
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OutreachPage;