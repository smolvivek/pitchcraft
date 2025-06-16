import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Film, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Image,
  Video,
  Palette,
  Wand2,
  Brain,
  Zap
} from 'lucide-react';
import { supabase, generatePitchMaterials } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../Layout/Layout';

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    concept: '',
    screenplay: null as File | null,
    moodboard: null as File | null,
    trailer: null as File | null,
    targetAudience: '',
    tone: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');

  const { getRootProps: getScreenplayProps, getInputProps: getScreenplayInputs, isDragActive: isScreenplayDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData(prev => ({ ...prev, screenplay: acceptedFiles[0] }));
      }
    }
  });

  const { getRootProps: getMoodboardProps, getInputProps: getMoodboardInputs, isDragActive: isMoodboardDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData(prev => ({ ...prev, moodboard: acceptedFiles[0] }));
      }
    }
  });

  const { getRootProps: getTrailerProps, getInputProps: getTrailerInputs, isDragActive: isTrailerDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData(prev => ({ ...prev, trailer: acceptedFiles[0] }));
      }
    }
  });

  const genres = [
    'Thriller', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance', 
    'Action', 'Documentary', 'Animation', 'Fantasy', 'Mystery', 'Western'
  ];

  const tones = [
    'Dark & Gritty', 'Light & Comedic', 'Suspenseful', 'Emotional', 
    'Action-Packed', 'Mysterious', 'Romantic', 'Satirical'
  ];

  const targetAudiences = [
    'Young Adult (18-25)', 'Adult (25-45)', 'Mature (45+)', 
    'Family Friendly', 'Niche/Art House', 'Mainstream'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const simulateAIGeneration = async () => {
    const steps = [
      { step: 'Analyzing your concept...', duration: 1000 },
      { step: 'Generating professional logline...', duration: 1500 },
      { step: 'Creating compelling synopsis...', duration: 2000 },
      { step: 'Developing character profiles...', duration: 1500 },
      { step: 'Building episode guide...', duration: 1000 },
      { step: 'Finalizing pitch materials...', duration: 1000 }
    ];

    let progress = 0;
    const totalSteps = steps.length;

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i].step);
      setGenerationProgress(Math.round((i / totalSteps) * 100));
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    setGenerationProgress(100);
    setGenerationStep('Complete! Redirecting...');
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleGenerate = async () => {
    if (!user) {
      alert('Please sign in to create a project');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation process
      await simulateAIGeneration();

      // Generate AI content using our FREE local function
      const aiContent = await generatePitchMaterials(formData);

      // Use the actual Supabase user ID - this is a real UUID
      const userId = user.id;

      console.log('Creating project with user ID:', userId);

      // Create the project in the database
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: userId, // This is the real UUID from Supabase auth
            title: formData.title,
            genre: formData.genre,
            concept: formData.concept,
            logline: aiContent.logline,
            synopsis: aiContent.synopsis,
            status: 'developing',
            progress: 60,
            tags: [
              formData.genre.toLowerCase(), 
              ...(formData.tone ? [formData.tone.toLowerCase().split(' ')[0]] : []),
              ...(formData.targetAudience ? [formData.targetAudience.toLowerCase().split(' ')[0]] : [])
            ]
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to save project: ${error.message}`);
      }

      console.log('Project created successfully:', data);
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.genre;
      case 2:
        return true; // Optional step
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Create New Project
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Transform your idea into a professional pitch with AI assistance
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                stepNumber <= step 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {stepNumber < step ? <CheckCircle className="w-5 h-5" /> : stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                  stepNumber < step 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                    : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Film className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Project Basics
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Start with a title and genre - our AI will do the rest
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., 'The Last Detective'"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Genre *
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tone
                    </label>
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select tone</option>
                      {tones.map(tone => (
                        <option key={tone} value={tone}>{tone}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Target Audience
                    </label>
                    <select
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select audience</option>
                      {targetAudiences.map(audience => (
                        <option key={audience} value={audience}>{audience}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Brief Concept (Optional)
                  </label>
                  <textarea
                    name="concept"
                    value={formData.concept}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Share your initial idea or inspiration - AI will expand on this..."
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Upload className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Upload Materials
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Add your existing materials to enhance the pitch
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Screenplay Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Screenplay (Optional)
                  </label>
                  <div
                    {...getScreenplayProps()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      isScreenplayDragActive 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <input {...getScreenplayInputs()} />
                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    {formData.screenplay ? (
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formData.screenplay.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(formData.screenplay.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Drop screenplay here
                        </p>
                        <p className="text-xs text-slate-500">
                          PDF, DOC, DOCX, TXT
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Moodboard Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Moodboard Images
                  </label>
                  <div
                    {...getMoodboardProps()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      isMoodboardDragActive 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <input {...getMoodboardInputs()} />
                    <Image className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    {formData.moodboard ? (
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formData.moodboard.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(formData.moodboard.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Drop images here
                        </p>
                        <p className="text-xs text-slate-500">
                          JPG, PNG, GIF, WEBP
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trailer Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Trailer/Teaser
                  </label>
                  <div
                    {...getTrailerProps()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      isTrailerDragActive 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <input {...getTrailerInputs()} />
                    <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    {formData.trailer ? (
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formData.trailer.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(formData.trailer.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Drop video here
                        </p>
                        <p className="text-xs text-slate-500">
                          MP4, MOV, AVI, MKV
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Cost-Effective Approach
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Upload your own materials to avoid AI generation costs. Our system will organize and present them professionally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Brain className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  AI Generation
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Review your project details and let AI create your pitch materials
                </p>
              </div>

              {!isGenerating ? (
                <>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Project Summary</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Title:</span> {formData.title}</p>
                        <p><span className="font-medium">Genre:</span> {formData.genre}</p>
                        {formData.tone && <p><span className="font-medium">Tone:</span> {formData.tone}</p>}
                        {formData.targetAudience && <p><span className="font-medium">Audience:</span> {formData.targetAudience}</p>}
                        {formData.concept && (
                          <p><span className="font-medium">Concept:</span> {formData.concept}</p>
                        )}
                        {formData.screenplay && (
                          <p><span className="font-medium">Screenplay:</span> {formData.screenplay.name}</p>
                        )}
                        {formData.moodboard && (
                          <p><span className="font-medium">Moodboard:</span> {formData.moodboard.name}</p>
                        )}
                        {formData.trailer && (
                          <p><span className="font-medium">Trailer:</span> {formData.trailer.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      FREE AI will generate:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'Professional logline',
                        'Compelling synopsis',
                        'Character profiles',
                        'Episode guide (if series)',
                        'Pitch deck template',
                        'Industry formatting'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {generationProgress}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {generationStep}
                    </p>
                    
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400">
                      Using our cost-effective AI system - no external API costs!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={step === 1 ? () => navigate('/projects') : handleBack}
            disabled={isGenerating}
            className="px-6 py-3 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-xl font-medium border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{step === 1 ? 'Back to Projects' : 'Back'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={step === 3 ? handleGenerate : handleNext}
            disabled={!canProceed() || isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{step === 3 ? 'Generate Pitch' : 'Continue'}</span>
            {step < 3 && <ArrowRight className="w-5 h-5" />}
            {step === 3 && <Sparkles className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProjectPage;