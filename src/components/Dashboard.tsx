
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, FileText, Briefcase, Plus, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrentCounts, useRealtimeCounts } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { ClientModal } from '@/components/ClientModal';
import { CaseModal } from '@/components/CaseModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { clientCount, documentCount, isLoading } = useCurrentCounts();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  
  // Enable real-time updates for counts
  useRealtimeCounts();

  const stats = [
    {
      title: 'Total Clients',
      value: isLoading ? '...' : clientCount.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Documents',
      value: isLoading ? '...' : documentCount.toString(),
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Active Cases',
      value: '8',
      icon: Briefcase,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      title: 'Upcoming Events',
      value: '3',
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+2%',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Client',
      description: 'Register a new client',
      icon: Users,
      color: 'bg-blue-500',
      onClick: () => setIsClientModalOpen(true),
    },
    {
      title: 'Upload Document',
      description: 'Add client documents',
      icon: FileText,
      color: 'bg-green-500',
      onClick: () => navigate('/documents'),
    },
    {
      title: 'Add Cases',
      description: 'Create a new case',
      icon: Briefcase,
      color: 'bg-purple-500',
      onClick: () => setIsCaseModalOpen(true),
    },
    {
      title: 'Schedule Event',
      description: 'Add calendar event',
      icon: Calendar,
      color: 'bg-orange-500',
      onClick: () => navigate('/calendar'),
    },
  ];

  const recentActivities = [
    {
      title: 'New client John Doe added',
      time: '2 hours ago',
      type: 'client',
    },
    {
      title: 'Document uploaded for Case #123',
      time: '4 hours ago',
      type: 'document',
    },
    {
      title: 'Meeting scheduled with Jane Smith',
      time: '1 day ago',
      type: 'event',
    },
    {
      title: 'Case status updated to "In Progress"',
      time: '2 days ago',
      type: 'case',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your practice.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{stat.change}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-700"
                      onClick={action.onClick}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{action.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Events & Tasks */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Client Meeting</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Today at 2:00 PM</p>
                    </div>
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Court Hearing</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tomorrow at 10:00 AM</p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                    <span className="text-gray-900 dark:text-white">Review contract for John Doe</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                    <span className="text-gray-900 dark:text-white">Prepare documents for hearing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                    <span className="text-gray-900 dark:text-white">Follow up with client Smith</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />

      <CaseModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
