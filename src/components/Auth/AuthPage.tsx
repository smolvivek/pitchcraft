import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Film, Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testAccountCreated, setTestAccountCreated] = useState<{email: string, password: string} | null>(null);

  const { signUp, signIn } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (isSignUp && !formData.name) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.name);
        if (!result.error) {
          setSuccess('Account created successfully! You can now sign in with your credentials.');
          setIsSignUp(false);
          setFormData({ name: '', email: formData.email, password: '' });
        }
      } else {
        result = await signIn(formData.email, formData.password);
        if (!result.error) {
          navigate('/dashboard');
        }
      }

      if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Improved test account creation with better error handling
  const createTestAccount = async () => {
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';
    const testName = 'Test User';
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Always try to create the account first to ensure it exists
      console.log('Creating test account...');
      const signUpResult = await signUp(testEmail, testPassword, testName);
      
      if (!signUpResult.error) {
        // Account created successfully
        setTestAccountCreated({ email: testEmail, password: testPassword });
        setFormData({ name: '', email: testEmail, password: testPassword });
        setSuccess(`Test account created successfully! The credentials have been filled in below. Click "Sign In" to continue.`);
        setIsSignUp(false);
      } else if (signUpResult.error.includes('already registered') || 
                 signUpResult.error.includes('already exists')) {
        // Account already exists, that's fine - provide the credentials
        console.log('Test account already exists, providing credentials');
        setTestAccountCreated({ email: testEmail, password: testPassword });
        setFormData({ name: '', email: testEmail, password: testPassword });
        setSuccess(`Test account is ready! The credentials have been filled in below. Click "Sign In" to continue.`);
        setIsSignUp(false);
      } else if (signUpResult.error.includes('rate limit') || 
                 signUpResult.error.includes('over_email_send_rate_limit')) {
        // Rate limited, but account might exist - provide credentials anyway
        console.log('Rate limited, but providing test credentials');
        setTestAccountCreated({ email: testEmail, password: testPassword });
        setFormData({ name: '', email: testEmail, password: testPassword });
        setSuccess(`Test account credentials are ready (rate limit reached). The credentials have been filled in below. Try signing in.`);
        setIsSignUp(false);
      } else {
        // Other error during signup
        console.error('Test account creation failed:', signUpResult.error);
        setError(`Failed to create test account: ${signUpResult.error}`);
      }
    } catch (err) {
      console.error('Test account creation error:', err);
      setError('Failed to create test account. Please try creating a regular account instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </motion.button>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <Film className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PitchCraft
            </h1>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              {isSignUp 
                ? 'Start your creative journey with PitchCraft' 
                : 'Sign in to continue your creative projects'
              }
            </p>
          </div>

          {/* Development Helper */}
          {!isSignUp && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Development Mode
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                    Need a test account? Click below to create/get test credentials that will be automatically filled in.
                  </p>
                  <button
                    onClick={createTestAccount}
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs disabled:opacity-50"
                  >
                    {loading ? 'Setting up Test Account...' : 'Get Test Account'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Test Account Credentials Display */}
          {testAccountCreated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6"
            >
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                Test Account Ready ✓
              </h3>
              <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                <p><strong>Email:</strong> {testAccountCreated.email}</p>
                <p><strong>Password:</strong> {testAccountCreated.password}</p>
                <p className="mt-2 text-green-500">Credentials have been filled in the form below. Click "Sign In" to continue.</p>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-6 flex items-start space-x-3"
            >
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required={isSignUp}
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-red-600 dark:text-red-400 text-sm">
                  <p>{error}</p>
                  {error.includes('Invalid email or password') && (
                    <p className="mt-2 text-xs">
                      💡 <strong>Tip:</strong> If you need a test account, click "Get Test Account" above to create one automatically.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </motion.button>
          </form>

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-300">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                  setTestAccountCreated(null);
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                disabled={loading}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;