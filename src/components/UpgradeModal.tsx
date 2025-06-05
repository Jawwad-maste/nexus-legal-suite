
import React from 'react';
import { motion } from 'framer-motion';
import { X, Crown, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfile, useUserLimits, useCurrentCounts } from '@/hooks/useSubscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  reason: 'clients' | 'documents' | 'trial_expired';
}

const UpgradeModal = ({ isOpen, onClose, onUpgrade, reason }: UpgradeModalProps) => {
  const { data: profile } = useUserProfile();
  const { data: limits } = useUserLimits();
  const { clientCount, documentCount } = useCurrentCounts();

  if (!isOpen) return null;

  const getTitle = () => {
    switch (reason) {
      case 'clients':
        return 'Client Limit Reached';
      case 'documents':
        return 'Document Limit Reached';
      case 'trial_expired':
        return 'Trial Period Expired';
      default:
        return 'Upgrade Required';
    }
  };

  const getMessage = () => {
    switch (reason) {
      case 'clients':
        return `You've reached your limit of ${limits?.max_clients} clients. Upgrade to add more clients and grow your practice.`;
      case 'documents':
        return `You've reached your limit of ${limits?.max_documents} documents. Upgrade to store more documents securely.`;
      case 'trial_expired':
        return 'Your 7-day free trial has expired. Upgrade to continue using all features.';
      default:
        return 'Upgrade your plan to continue using this feature.';
    }
  };

  const plans = [
    {
      name: 'Pro',
      price: '$49',
      period: '/month',
      clients: '6 clients',
      documents: '10 documents',
      popular: true
    },
    {
      name: 'Pro Plus',
      price: '$99',
      period: '/month',
      clients: '9 clients',
      documents: '20 documents',
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl max-w-md w-full"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">{getMessage()}</p>

          {profile?.subscription_plan === 'free_trial' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Current Usage:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Clients
                  </span>
                  <span>{clientCount} / {limits?.max_clients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </span>
                  <span>{documentCount} / {limits?.max_documents}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-4 ${
                  plan.popular ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">
                      {plan.clients} • {plan.documents}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>
                {plan.popular && (
                  <span className="inline-block mt-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Choose Plan
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradeModal;
