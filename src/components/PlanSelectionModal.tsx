
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpdateSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelected: (plan: string) => void;
}

const PlanSelectionModal = ({ isOpen, onClose, onPlanSelected }: PlanSelectionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const updateSubscription = useUpdateSubscription();

  const plans = [
    {
      id: 'free_trial',
      name: 'Free Trial',
      price: '$0',
      period: '/7 days',
      description: '7-day free trial',
      features: [
        'Up to 3 clients',
        'Basic document storage (3 documents)',
        'Calendar integration',
        'Email support',
      ],
      buttonText: 'Start Free Trial',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49',
      period: '/month',
      description: 'For growing practices',
      features: [
        'Up to 6 clients',
        'Document storage (10 documents)',
        'Priority support',
        'Advanced reporting',
        'Custom integrations',
      ],
      buttonText: 'Choose Pro',
      popular: true
    },
    {
      id: 'pro_plus',
      name: 'Pro Plus',
      price: '$99',
      period: '/month',
      description: 'For larger practices',
      features: [
        'Up to 9 clients',
        'Document storage (20 documents)',
        'White-label options',
        'API access',
        'Advanced security features',
        'Dedicated account manager',
      ],
      buttonText: 'Choose Pro Plus',
      popular: false
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free_trial') {
      try {
        await updateSubscription.mutateAsync({ 
          plan: 'free_trial',
          selectedPlan: planId 
        });
        toast.success('Free trial started successfully!');
        onPlanSelected(planId);
        onClose();
      } catch (error) {
        toast.error('Failed to start free trial');
      }
    } else {
      setShowPayment(true);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) return;
    
    try {
      await updateSubscription.mutateAsync({ 
        plan: selectedPlan as 'pro' | 'pro_plus',
        selectedPlan 
      });
      toast.success('Subscription activated successfully!');
      onPlanSelected(selectedPlan);
      onClose();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!showPayment ? (
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-xl border-2 p-6 ${
                    plan.popular ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={updateSubscription.isPending}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                    }`}
                  >
                    {updateSubscription.isPending && selectedPlan === plan.id
                      ? 'Processing...'
                      : plan.buttonText
                    }
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Payment Details
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Complete your subscription to{' '}
                {plans.find(p => p.id === selectedPlan)?.name}
              </p>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPayment(false)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateSubscription.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {updateSubscription.isPending ? 'Processing...' : 'Complete Payment'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PlanSelectionModal;
