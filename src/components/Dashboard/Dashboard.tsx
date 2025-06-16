import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Film, 
  Users, 
  BarChart3, 
  Send, 
  Eye, 
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Target,
  Calendar,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, type Project } from '../../lib/supabase';
import Layout from '../Layout/Layout';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pitch-ready': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'developing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'submitted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pitch-ready': return 'Pitch Ready';
      case 'developing': return 'In Development';
      case 'submitted': return 'Submitted';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Ready to Create Your First Pitch?
      </h2>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
        Transform your film or TV concept into a professional pitch deck with AI assistance. 
        Just provide a title and genre to get started.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
        {[
          { icon: Zap, title: "AI Generation", desc: "Professional loglines and synopses" },
          { icon: Target, title: "Industry Matching", desc: "Connect with relevant producers" },
          { icon: FileText, title: "Pitch Materials", desc: "Complete deck and show bible" }
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </div>
          );
        })}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/create')}
        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 mx-auto"
      >
        <Plus className="w-6 h-6" />
        <span>Create Your First Project</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

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
              Welcome, {user?.user_metadata?.name || 'Creator'}! 👋
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {projects.length > 0 
                ? "Continue working on your projects or start something new"
                : "Ready to pitch your next big story? Let's make it happen."
              }
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </motion.button>
        </motion.div>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Active Projects', 
                  value: projects.length.toString(), 
                  icon: Film, 
                  color: 'from-blue-500 to-indigo-600',
                  change: projects.length > 0 ? '+1 this week' : 'Start creating'
                },
                { 
                  label: 'Total Views', 
                  value: projects.reduce((sum, p) => sum + p.views, 0).toString(), 
                  icon: Eye, 
                  color: 'from-green-500 to-emerald-600',
                  change: 'Growing audience'
                },
                { 
                  label: 'Pitch Ready', 
                  value: projects.filter(p => p.status === 'pitch-ready').length.toString(), 
                  icon: Target, 
                  color: 'from-purple-500 to-violet-600',
                  change: 'Ready to send'
                },
                { 
                  label: 'In Development', 
                  value: projects.filter(p => p.status === 'developing').length.toString(), 
                  icon: TrendingUp, 
                  color: 'from-orange-500 to-red-600',
                  change: 'Making progress'
                },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                          {stat.change}
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

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Recent Projects
                  </h3>
                  <button
                    onClick={() => navigate('/projects')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {project.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {project.genre}
                        </p>
                        {project.logline && (
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            {project.logline}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                          <Eye className="w-4 h-4" />
                          <span>{project.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-700/50"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/create')}
                  className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200 text-left"
                >
                  <Plus className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    New Project
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Start with AI-powered pitch generation
                  </p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/outreach')}
                  className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200 text-left"
                >
                  <Send className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Find Producers
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Connect with industry professionals
                  </p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/templates')}
                  className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200 text-left"
                >
                  <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Browse Templates
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Professional pitch deck designs
                  </p>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;