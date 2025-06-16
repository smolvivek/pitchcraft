import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  Filter,
  Search,
  Plus,
  ExternalLink,
  Target,
  Award,
  Film,
  Users,
  TrendingUp
} from 'lucide-react';
import Layout from '../Layout/Layout';
import { searchFestivals, getFestivalRecommendations, type Festival, type FestivalFilters } from '../../lib/filmfreeway';

const FestivalTrackerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [filterDeadline, setFilterDeadline] = useState<'soon' | 'later' | 'all'>('all');
  const [filterFee, setFilterFee] = useState<'free' | 'low' | 'high' | 'all'>('all');
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFestivals();
  }, [filterGenre, filterDeadline, filterFee]);

  const loadFestivals = async () => {
    setLoading(true);
    try {
      const filters: FestivalFilters = {
        genre: filterGenre === 'all' ? undefined : filterGenre,
        deadline: filterDeadline,
        fee: filterFee
      };
      
      const results = await searchFestivals(filters);
      setFestivals(results);
    } catch (error) {
      console.error('Error loading festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const mySubmissions = [
    {
      festival: 'Sundance Film Festival',
      project: 'My First Project',
      status: 'Under Review',
      submittedDate: '2024-08-20',
      notificationDate: '2024-11-15',
      fee: '$65'
    }
  ];

  const getPrestigeColor = (prestige: string) => {
    switch (prestige) {
      case 'A-List': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Major': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Genre': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Under Review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredFestivals = festivals.filter(festival => {
    const matchesSearch = festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         festival.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Festival Tracker
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Discover and submit to film festivals worldwide with FilmFreeway integration
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Submissions', value: mySubmissions.length.toString(), icon: Film, color: 'from-blue-500 to-indigo-600' },
            { label: 'Festivals Available', value: festivals.length.toString(), icon: Trophy, color: 'from-yellow-500 to-orange-600' },
            { label: 'Match Score Avg', value: '85%', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
            { label: 'Submission Budget', value: '$200', icon: DollarSign, color: 'from-purple-500 to-violet-600' },
          ].map((stat, index) => {
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search festivals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Genres</option>
                <option value="drama">Drama</option>
                <option value="comedy">Comedy</option>
                <option value="horror">Horror</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="documentary">Documentary</option>
              </select>
              
              <select
                value={filterDeadline}
                onChange={(e) => setFilterDeadline(e.target.value as 'soon' | 'later' | 'all')}
                className="px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Deadlines</option>
                <option value="soon">Due Soon (30 days)</option>
                <option value="later">Due Later</option>
              </select>
              
              <select
                value={filterFee}
                onChange={(e) => setFilterFee(e.target.value as 'free' | 'low' | 'high' | 'all')}
                className="px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Fees</option>
                <option value="free">Free</option>
                <option value="low">Low ($0-50)</option>
                <option value="high">High ($50+)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Festivals Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredFestivals.map((festival, index) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 4) }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {festival.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrestigeColor(festival.prestige)}`}>
                        {festival.prestige}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{festival.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(festival.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{festival.fee}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 dark:text-slate-300 mb-4">
                      {festival.description}
                    </p>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="flex items-center space-x-1 mb-2">
                      <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {festival.matchScore || 85}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Match Score
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {festival.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 rounded-full text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Acceptance Rate</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{festival.acceptanceRate}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Avg. Entries</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{festival.averageEntries}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {getDaysUntilDeadline(festival.deadline)} days left
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                      
                      <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center space-x-1">
                        <Plus className="w-3 h-3" />
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredFestivals.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No festivals found
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default FestivalTrackerPage;