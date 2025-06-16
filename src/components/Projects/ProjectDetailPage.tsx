import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Edit, 
  Send, 
  Eye, 
  Download, 
  Image, 
  Video, 
  FileText,
  Users,
  Calendar,
  Trophy,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, type Project } from '../../lib/supabase';
import Layout from '../Layout/Layout';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/project/${id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Project not found
          </h2>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Projects
          </button>
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
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {project.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {project.genre}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
            
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Logline
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.logline || 'No logline generated yet.'}
                </p>
              </div>

              {project.synopsis && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Synopsis
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {project.synopsis}
                  </p>
                </div>
              )}

              {project.concept && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    Original Concept
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {project.concept}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Progress */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Completion
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Views
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {project.views}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Created
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Pitch Materials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
            Pitch Materials
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: 'Pitch Deck', desc: 'Professional presentation', status: 'ready' },
              { icon: Image, title: 'Moodboard', desc: 'Visual style guide', status: 'ready' },
              { icon: Video, title: 'Trailer Concept', desc: 'Video pitch outline', status: 'premium' },
              { icon: Users, title: 'Character Bible', desc: 'Detailed character profiles', status: 'ready' },
              { icon: FileText, title: 'Episode Guide', desc: 'Season breakdown', status: 'ready' },
              { icon: Trophy, title: 'Festival Guide', desc: 'Submission recommendations', status: 'ready' }
            ].map((material, index) => {
              const Icon = material.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    {material.status === 'premium' && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-xs font-medium">
                        Premium
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {material.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {material.desc}
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-sm flex items-center justify-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm flex items-center justify-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>Export</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-4"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Send to Producers</span>
          </button>
          
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Submit to Festivals</span>
          </button>
        </motion.div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Share Project
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Public Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/share/project/${id}`}
                      readOnly
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                    />
                    <button
                      onClick={handleShare}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Anyone with this link can view your project pitch materials. 
                    Perfect for sharing with producers, agents, and collaborators.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Public View</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;