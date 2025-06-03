
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, FileText, Clock, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Active Cases', value: '24', change: '+3', icon: FileText, color: 'text-blue-500' },
    { title: 'Total Clients', value: '156', change: '+12', icon: Users, color: 'text-green-500' },
    { title: 'Upcoming Hearings', value: '8', change: '+2', icon: Calendar, color: 'text-orange-500' },
    { title: 'Billable Hours', value: '180.5', change: '+15.2', icon: Clock, color: 'text-purple-500' },
    { title: 'Revenue This Month', value: '$45,200', change: '+8.3%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Success Rate', value: '94%', change: '+2%', icon: TrendingUp, color: 'text-blue-600' }
  ];

  const recentCases = [
    { id: 1, client: 'Johnson Corp', type: 'Contract Dispute', status: 'Active', priority: 'High', lastUpdate: '2 hours ago' },
    { id: 2, client: 'Smith Holdings', type: 'Employment Law', status: 'Pending', priority: 'Medium', lastUpdate: '1 day ago' },
    { id: 3, client: 'Tech Innovations', type: 'IP Protection', status: 'Completed', priority: 'Low', lastUpdate: '3 days ago' },
    { id: 4, client: 'Green Energy LLC', type: 'Regulatory Compliance', status: 'Active', priority: 'High', lastUpdate: '5 hours ago' }
  ];

  const caseData = [
    { month: 'Jan', cases: 12 },
    { month: 'Feb', cases: 19 },
    { month: 'Mar', cases: 15 },
    { month: 'Apr', cases: 22 },
    { month: 'May', cases: 28 },
    { month: 'Jun', cases: 24 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 38000 },
    { month: 'Mar', revenue: 35000 },
    { month: 'Apr', revenue: 42000 },
    { month: 'May', revenue: 48000 },
    { month: 'Jun', revenue: 45200 }
  ];

  const caseTypeData = [
    { name: 'Corporate Law', value: 35, color: '#2C3E50' },
    { name: 'Employment', value: 25, color: '#57687c' },
    { name: 'IP & Technology', value: 20, color: '#b4c7dd' },
    { name: 'Litigation', value: 20, color: '#F7CAC9' }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-bg-100 pt-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-text-100 mb-2">Dashboard</h1>
          <p className="text-text-200">Welcome back! Here's what's happening with your practice today.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-xl p-6 shadow-sm border border-bg-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-200 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-text-100 mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cases Over Time */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-bg-200"
          >
            <h3 className="text-lg font-semibold text-text-100 mb-4">Cases Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={caseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis dataKey="month" stroke="#5c5c5c" />
                <YAxis stroke="#5c5c5c" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="cases" fill="#2C3E50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue Trend */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-bg-200"
          >
            <h3 className="text-lg font-semibold text-text-100 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis dataKey="month" stroke="#5c5c5c" />
                <YAxis stroke="#5c5c5c" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F7CAC9" 
                  strokeWidth={3}
                  dot={{ fill: '#F7CAC9', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Cases */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-bg-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-100">Recent Cases</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-primary-100 hover:text-primary-200 text-sm font-medium"
              >
                View All
              </motion.button>
            </div>
            <div className="space-y-4">
              {recentCases.map((case_item) => (
                <motion.div
                  key={case_item.id}
                  whileHover={{ backgroundColor: "#fafafa" }}
                  className="flex items-center justify-between p-4 rounded-lg border border-bg-200 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-text-100">{case_item.client}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_item.status)}`}>
                        {case_item.status}
                      </span>
                    </div>
                    <p className="text-text-200 text-sm mt-1">{case_item.type}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center ${getPriorityColor(case_item.priority)}`}>
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{case_item.priority}</span>
                    </div>
                    <p className="text-text-200 text-xs mt-1">{case_item.lastUpdate}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Case Distribution */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-bg-200"
          >
            <h3 className="text-lg font-semibold text-text-100 mb-4">Case Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={caseTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {caseTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
