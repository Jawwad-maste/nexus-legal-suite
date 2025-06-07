
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useSubscription';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import PlanSelectionModal from './PlanSelectionModal';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userProfile) {
      // If user has a valid subscription, redirect to dashboard
      if (userProfile.subscription_plan && 
          userProfile.subscription_plan !== null &&
          userProfile.subscription_status === 'active') {
        navigate('/');
      } else {
        // New user or expired trial - show plan selection
        setShowPlanModal(true);
      }
    }
  }, [user, userProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Successfully signed in!');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully! Please check your email for verification.');
        }
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelected = (plan: string) => {
    setShowPlanModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Scale className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to LegalTech Pro
            </h1>
            <p className="text-gray-300">
              Choose your plan and get started with professional legal practice management
            </p>
          </div>

          {/* Auth Form */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Plan Selection Modal */}
      <PlanSelectionModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelected={handlePlanSelected}
      />
    </div>
  );
};

export default AuthPage;
