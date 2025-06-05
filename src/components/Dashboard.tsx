
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, Plus, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientModal } from '@/components/ClientModal';
import { useUserProfile, useCurrentCounts } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { clientCount, documentCount, isLoading } = useCurrentCounts();

  const stats = [
    { 
      title: 'Total Clients', 
      value: isLoading ? '...' : clientCount.toString(), 
      icon: Users, 
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900'
    },
    { 
      title: 'Documents', 
      value: isLoading ? '...' : documentCount.toString(), 
      icon: FileText, 
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900'
    },
    { 
      title: 'Plan', 
      value: userProfile?.subscription_plan?.replace('_', ' ').toUpperCase() || 'Loading...', 
      icon: TrendingUp, 
      color: 'text-purple-500 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900'
    },
    { 
      title: 'Quick Actions', 
      value: '', 
      icon: Plus, 
      color: 'text-orange-500 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New client added', client: 'John Doe', time: '2 hours ago', type: 'client' },
    { id: 2, action: 'Document uploaded', client: 'Jane Smith', time: '4 hours ago', type: 'document' },
    { id: 3, action: 'Meeting scheduled', client: 'Mike Johnson', time: '1 day ago', type: 'meeting' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client': return Users;
      case 'document': return FileText;
      case 'meeting': return Calendar;
      default: return AlertCircle;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
        <motion.div variants={itemVariants} className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.email}! Here's your practice overview.
            </p>
          </div>
          <Button 
            onClick={() => setIsClientModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                  {stat.value && (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsClientModalOpen(true)}
                className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200 flex items-center space-x-3"
              >
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white">Add New Client</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition-colors duration-200 flex items-center space-x-3"
              >
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-gray-900 dark:text-white">Upload Document</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full text-left px-4 py-3 bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg transition-colors duration-200 flex items-center space-x-3"
              >
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-900 dark:text-white">Schedule Meeting</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                View All
              </motion.button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    className="flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.client}</p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {activity.time}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Subscription Info */}
        {userProfile && (
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {userProfile.subscription_plan.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {userProfile.subscription_status}
                </p>
              </div>
              {userProfile.subscription_plan === 'free_trial' && userProfile.trial_end_date && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Trial Ends</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(userProfile.trial_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
