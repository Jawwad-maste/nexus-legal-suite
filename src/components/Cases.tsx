
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Calendar, User, FileText, MoreHorizontal, AlertCircle } from 'lucide-react';

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const cases = [
    {
      id: 1,
      caseNumber: 'CASE-2024-001',
      client: 'Johnson Corporation',
      title: 'Contract Dispute Resolution',
      type: 'Corporate Law',
      status: 'Active',
      priority: 'High',
      assignedTo: 'Sarah Wilson',
      nextHearing: '2024-01-15',
      lastUpdate: '2 hours ago',
      description: 'Dispute over breach of contract terms in software licensing agreement.',
      progress: 65
    },
    {
      id: 2,
      caseNumber: 'CASE-2024-002',
      client: 'Smith Holdings',
      title: 'Employment Discrimination Case',
      type: 'Employment Law',
      status: 'Pending Review',
      priority: 'Medium',
      assignedTo: 'Michael Chen',
      nextHearing: '2024-01-22',
      lastUpdate: '1 day ago',
      description: 'Allegations of workplace discrimination and wrongful termination.',
      progress: 40
    },
    {
      id: 3,
      caseNumber: 'CASE-2024-003',
      client: 'Tech Innovations Ltd',
      title: 'Patent Infringement Defense',
      type: 'Intellectual Property',
      status: 'Discovery',
      priority: 'High',
      assignedTo: 'Emily Rodriguez',
      nextHearing: '2024-01-18',
      lastUpdate: '3 hours ago',
      description: 'Defense against patent infringement claims on AI technology.',
      progress: 75
    },
    {
      id: 4,
      caseNumber: 'CASE-2024-004',
      client: 'Green Energy Solutions',
      title: 'Regulatory Compliance Review',
      type: 'Environmental Law',
      status: 'Completed',
      priority: 'Low',
      assignedTo: 'David Park',
      nextHearing: 'N/A',
      lastUpdate: '1 week ago',
      description: 'Environmental compliance audit and regulatory filings.',
      progress: 100
    },
    {
      id: 5,
      caseNumber: 'CASE-2024-005',
      client: 'Metropolitan Bank',
      title: 'Financial Fraud Investigation',
      type: 'Criminal Defense',
      status: 'Investigation',
      priority: 'High',
      assignedTo: 'Lisa Thompson',
      nextHearing: '2024-01-20',
      lastUpdate: '6 hours ago',
      description: 'Investigation of alleged financial fraud and money laundering.',
      progress: 30
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Discovery': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Investigation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const filteredCases = cases.filter(case_item => {
    const matchesSearch = case_item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || case_item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
    <div className="min-h-screen bg-bg-100 pt-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-100 mb-2">Cases</h1>
              <p className="text-text-200">Manage and track all your legal cases</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(247, 202, 201, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 sm:mt-0 bg-accent-100 text-primary-100 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>New Case</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-bg-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-200 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cases by client, title, or case number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-bg-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-bg-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100 focus:border-transparent transition-all duration-200"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Discovery">Discovery</option>
                <option value="Investigation">Investigation</option>
                <option value="Completed">Completed</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 border border-bg-200 rounded-lg hover:bg-bg-100 transition-colors duration-200"
              >
                <Filter className="w-5 h-5 text-text-200" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Cases Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {filteredCases.map((case_item) => (
              <motion.div
                key={case_item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-xl p-6 shadow-sm border border-bg-200 cursor-pointer transition-all duration-200"
                onClick={() => setSelectedCase(selectedCase === case_item.id ? null : case_item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-text-100">{case_item.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(case_item.status)}`}>
                        {case_item.status}
                      </span>
                      <div className={`flex items-center ${getPriorityColor(case_item.priority)}`}>
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{case_item.priority}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-text-200" />
                        <span className="text-sm text-text-200">Client:</span>
                        <span className="text-sm font-medium text-text-100">{case_item.client}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-text-200" />
                        <span className="text-sm text-text-200">Case #:</span>
                        <span className="text-sm font-medium text-text-100">{case_item.caseNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-text-200" />
                        <span className="text-sm text-text-200">Next Hearing:</span>
                        <span className="text-sm font-medium text-text-100">{case_item.nextHearing}</span>
                      </div>
                    </div>

                    <p className="text-text-200 mb-4">{case_item.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-100">Progress</span>
                        <span className="text-sm text-text-200">{case_item.progress}%</span>
                      </div>
                      <div className="w-full bg-bg-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${case_item.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-accent-100 h-2 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-text-200">
                      <span>Assigned to: <span className="font-medium text-text-100">{case_item.assignedTo}</span></span>
                      <span>Updated {case_item.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-bg-100 rounded-lg transition-colors duration-200"
                  >
                    <MoreHorizontal className="w-5 h-5 text-text-200" />
                  </motion.button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedCase === case_item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-bg-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-text-100 mb-2">Case Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-200">Type:</span>
                              <span className="text-text-100">{case_item.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-200">Priority:</span>
                              <span className={getPriorityColor(case_item.priority)}>{case_item.priority}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-200">Status:</span>
                              <span className="text-text-100">{case_item.status}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-text-100 mb-2">Quick Actions</h4>
                          <div className="space-y-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              className="w-full text-left px-3 py-2 text-sm bg-bg-100 hover:bg-bg-200 rounded-lg transition-colors duration-200"
                            >
                              View Documents
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              className="w-full text-left px-3 py-2 text-sm bg-bg-100 hover:bg-bg-200 rounded-lg transition-colors duration-200"
                            >
                              Schedule Meeting
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              className="w-full text-left px-3 py-2 text-sm bg-bg-100 hover:bg-bg-200 rounded-lg transition-colors duration-200"
                            >
                              Update Status
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <FileText className="w-12 h-12 text-text-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-100 mb-2">No cases found</h3>
            <p className="text-text-200 mb-6">Try adjusting your search or filter criteria</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-accent-100 text-primary-100 px-6 py-3 rounded-lg font-semibold"
            >
              Create New Case
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Cases;
