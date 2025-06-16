import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Eye, Download, Star } from 'lucide-react';
import Layout from '../Layout/Layout';

const TemplatesPage: React.FC = () => {
  const templates = [
    {
      id: 1,
      name: 'Cinematic Dark',
      category: 'Film',
      preview: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      downloads: 1200,
      description: 'Perfect for thrillers and noir films'
    },
    {
      id: 2,
      name: 'Bright & Modern',
      category: 'TV Series',
      preview: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      downloads: 980,
      description: 'Clean design for contemporary series'
    },
    {
      id: 3,
      name: 'Vintage Film',
      category: 'Film',
      preview: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      downloads: 756,
      description: 'Classic Hollywood aesthetic'
    },
    {
      id: 4,
      name: 'Sci-Fi Future',
      category: 'Film',
      preview: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      downloads: 1450,
      description: 'Futuristic design for sci-fi projects'
    },
    {
      id: 5,
      name: 'Documentary Style',
      category: 'Documentary',
      preview: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      downloads: 623,
      description: 'Professional look for documentaries'
    },
    {
      id: 6,
      name: 'Comedy Bright',
      category: 'TV Series',
      preview: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      downloads: 890,
      description: 'Vibrant colors for comedy series'
    }
  ];

  const categories = ['All', 'Film', 'TV Series', 'Documentary'];

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
            <Palette className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Pitch Templates
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Choose from professionally designed templates to make your pitch stand out
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center space-x-4"
        >
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 font-medium text-slate-700 dark:text-slate-300"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium">
                    {template.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 bg-white/90 text-slate-900 rounded-lg font-medium hover:bg-white transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Use</span>
                    </motion.button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {template.rating}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {template.downloads} downloads
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Template CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-700/50 text-center"
        >
          <Palette className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Need a Custom Template?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Our AI can create a personalized template based on your project's genre, tone, and target audience. 
            Get a unique design that perfectly matches your vision.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Create Custom Template
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TemplatesPage;