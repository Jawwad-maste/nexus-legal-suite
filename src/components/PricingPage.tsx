
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Scale, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import PlanSelectionModal from './PlanSelectionModal';

const PricingPage = () => {
  const { user } = useAuth();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for solo practitioners just getting started',
      features: [
        'Up to 50 clients',
        '100 documents storage',
        'Basic calendar integration',
        'Email support',
        'Mobile app access'
      ],
      popular: false,
      planId: 'starter'
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Ideal for growing practices and small law firms',
      features: [
        'Up to 500 clients',
        'Unlimited documents',
        'Advanced calendar & scheduling',
        'Priority support',
        'Team collaboration',
        'Custom templates',
        'Advanced reporting'
      ],
      popular: true,
      planId: 'professional'
    },
    {
      name: 'Enterprise',
      price: '$149',
      period: '/month',
      description: 'Comprehensive solution for large law firms',
      features: [
        'Unlimited clients',
        'Unlimited everything',
        'Advanced security features',
        '24/7 dedicated support',
        'Custom integrations',
        'Advanced analytics',
        'White-label options',
        'API access'
      ],
      popular: false,
      planId: 'enterprise'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    if (!user) {
      // Redirect to auth page if not logged in
      window.location.href = '/auth';
      return;
    }
    
    setSelectedPlan(planId);
    setShowPlanModal(true);
  };

  const handlePlanSelected = (plan: string) => {
    setShowPlanModal(false);
    // Handle plan selection logic here
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">LegalTech Pro</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {!user && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Please{' '}
                  <Link to="/auth" className="text-blue-600 hover:text-blue-500 underline">
                    log in first
                  </Link>
                  {' '}to select a plan
                </div>
              )}
              {user && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>Logged in</span>
                </div>
              )}
              <Link to="/">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Choose Your Perfect Plan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Scale your legal practice with our flexible pricing plans. Start with a 14-day free trial on any plan.
          </motion.p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-slate-700 rounded-2xl border-2 p-8 ${
                  plan.popular 
                    ? 'border-blue-500 shadow-xl scale-105' 
                    : 'border-gray-200 dark:border-slate-600 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan.planId)}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 text-gray-900 dark:text-white'
                  }`}
                >
                  {user ? 'Select Plan' : 'Login to Select'}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Need a custom solution? <a href="#" className="text-blue-600 hover:text-blue-500">Contact our sales team</a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the billing.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely. We use bank-level encryption and comply with all major security standards including SOC 2 Type II and GDPR.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer discounts for annual billing?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer a 20% discount when you pay annually. Contact our sales team for more details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Selection Modal */}
      <PlanSelectionModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelected={handlePlanSelected}
      />
    </div>
  );
};

export default PricingPage;
