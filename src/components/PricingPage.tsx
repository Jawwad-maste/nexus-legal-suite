
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Scale, ArrowLeft } from 'lucide-react';

const PricingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = (plan: string) => {
    navigate('/auth', { state: { plan } });
  };

  const handleBack = () => {
    navigate('/');
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: '7-day free trial',
      features: [
        'Up to 5 clients',
        'Basic document storage (1GB)',
        'Calendar integration',
        'Email support',
        'Mobile app access'
      ],
      limitations: true,
      buttonText: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/month',
      description: 'For growing practices',
      features: [
        'Unlimited clients',
        'Advanced document storage (50GB)',
        'Priority support',
        'Advanced reporting',
        'Custom integrations',
        'Team collaboration tools'
      ],
      limitations: false,
      buttonText: 'Get Started',
      popular: true
    },
    {
      name: 'Pro Plus',
      price: '$99',
      period: '/month',
      description: 'Unlimited database',
      features: [
        'Everything in Pro',
        'Unlimited document storage',
        'White-label options',
        'API access',
        'Advanced security features',
        'Dedicated account manager',
        'Custom workflows'
      ],
      limitations: false,
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={handleBack}
                className="mr-4 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LegalTech Pro</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Choose Your Plan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Select the perfect plan for your legal practice. Start with our free trial 
              and upgrade as you grow.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-xl shadow-lg border-2 ${
                  plan.popular ? 'border-blue-600' : 'border-gray-200'
                } p-8`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleGetStarted(plan.name.toLowerCase())}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {plan.buttonText}
                </button>

                {plan.limitations && (
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Limited features during trial period
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Need a custom solution? We're here to help.
            </p>
            <button 
              onClick={() => handleGetStarted('enterprise')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact our sales team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
