import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, MessageSquare, Edit, Crown } from 'lucide-react';
import Layout from '../Layout/Layout';

const CollaboratorsPage: React.FC = () => {
  const collaborators = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Co-Writer',
      email: 'sarah@example.com',
      avatar: 'SC',
      status: 'online',
      projects: 3,
      lastActive: 'Active now'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Producer',
      email: 'marcus@example.com',
      avatar: 'MR',
      status: 'away',
      projects: 2,
      lastActive: '2 hours ago'
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Script Editor',
      email: 'emily@example.com',
      avatar: 'EW',
      status: 'online',
      projects: 4,
      lastActive: 'Active now'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'producer': return Crown;
      case 'co-writer': return Edit;
      case 'script editor': return MessageSquare;
      default: return Users;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Collaborators
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Work together with writers, producers, and industry professionals
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Invite Collaborator</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Active Collaborators
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {collaborators.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Shared Projects
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  5
                </p>
              </div>
              <Edit className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Online Now
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {collaborators.filter(c => c.status === 'online').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Collaborators List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Your Team
            </h3>
          </div>

          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {collaborators.map((collaborator, index) => {
              const RoleIcon = getRoleIcon(collaborator.role);
              return (
                <motion.div
                  key={collaborator.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {collaborator.avatar}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${getStatusColor(collaborator.status)}`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {collaborator.name}
                          </h4>
                          <RoleIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          {collaborator.email}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                          {collaborator.role} • {collaborator.lastActive}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {collaborator.projects}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Projects
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Collaboration Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-700/50"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Collaboration Features
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <MessageSquare className="w-8 h-8 text-indigo-600 mb-4" />
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Real-time Comments
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                Leave feedback and suggestions directly on pitch materials with threaded discussions
              </p>
            </div>
            
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <Edit className="w-8 h-8 text-green-600 mb-4" />
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Version Control
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                Track changes and maintain version history with automatic backups
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CollaboratorsPage;