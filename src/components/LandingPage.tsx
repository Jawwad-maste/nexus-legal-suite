
import React from 'react';
import { motion } from 'framer-motion';
import { Scale, CheckCircle, Users, FileText, Calendar, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: 'Client Management',
      description: 'Comprehensive client database with contact information, case history, and communication tracking.'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Secure document storage, version control, and easy sharing with clients and team members.'
    },
    {
      icon: Calendar,
      title: 'Calendar Integration',
      description: 'Schedule appointments, court dates, and deadlines with automated reminders and notifications.'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Bank-level security with end-to-end encryption and compliance with legal industry standards.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Partner at Johnson & Associates',
      content: 'LegalTech Pro has transformed how we manage our practice. The efficiency gains are remarkable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Solo Practitioner',
      content: 'As a solo lawyer, this platform gives me the tools I need to compete with larger firms.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Legal Operations Manager',
      content: 'The document management and client tracking features have streamlined our entire workflow.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">LegalTech Pro</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Modern Legal Practice{' '}
            <span className="text-blue-400">Management</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Streamline your legal practice with our comprehensive client management, 
            document organization, and case tracking platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-gray-400 text-white hover:bg-gray-800 px-8 py-3">
                View Pricing
              </Button>
            </Link>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 mt-4"
          >
            No credit card required • Start with free trial
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to manage your practice
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful tools designed specifically for legal professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 transition-colors h-full">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            About LegalTech Pro
          </h2>
          <div className="text-lg text-gray-300 space-y-6">
            <p>
              LegalTech Pro was founded by legal professionals who understand the unique challenges 
              facing modern law practices. We've experienced firsthand the frustration of juggling 
              multiple systems, losing track of important documents, and struggling to maintain 
              client relationships.
            </p>
            <p>
              Our platform brings together all the essential tools you need in one secure, 
              easy-to-use interface. From solo practitioners to mid-sized firms, we're helping 
              legal professionals streamline their operations and focus on what they do best - 
              practicing law.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Legal Professionals
            </h2>
            <p className="text-xl text-gray-300">
              See what our clients have to say about their experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-700/50 border-gray-600 h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <CheckCircle key={i} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your practice?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of legal professionals who trust LegalTech Pro
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 LegalTech Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
