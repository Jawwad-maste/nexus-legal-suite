
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useSubscription';
import LandingPage from './LandingPage';
import PlanSelectionModal from './PlanSelectionModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-lg text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }
  
  // If no user, show landing page
  if (!user) {
    return <LandingPage />;
  }
  
  // If user exists but no profile or no subscription plan, show plan selection
  if (!userProfile || !userProfile.subscription_plan || userProfile.subscription_plan === null) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <PlanSelectionModal 
          isOpen={true} 
          onClose={() => {}} 
          onPlanSelected={() => window.location.reload()} 
        />
      </div>
    );
  }
  
  // If user has expired trial and no active subscription
  if (userProfile.subscription_plan === 'free_trial' && 
      userProfile.trial_end_date && 
      new Date(userProfile.trial_end_date) < new Date()) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <PlanSelectionModal 
          isOpen={true} 
          onClose={() => {}} 
          onPlanSelected={() => window.location.reload()} 
        />
      </div>
    );
  }
  
  // User has valid subscription, show protected content
  return <>{children}</>;
};

export default ProtectedRoute;
