
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, MoreHorizontal, User, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientModal } from '@/components/ClientModal';
import { ClientEditModal } from '@/components/ClientEditModal';
import { useClients } from '@/hooks/useClients';
import { useClientOperations } from '@/hooks/useClientOperations';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  const { data: clients = [], isLoading } = useClients();
  const { deleteClient } = useClientOperations();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.case_title && client.case_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient.mutate(clientId);
    }
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Clients</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your client relationships</p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Client</span>
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients by name or case..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Clients Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="text-lg text-gray-900 dark:text-white">Loading clients...</div>
              </div>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {client.photo_url ? (
                        <img
                          src={client.photo_url}
                          alt={client.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                        {client.age && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">Age: {client.age}</p>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(selectedClient === client.id ? null : client.id);
                        }}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      {selectedClient === client.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingClient(client);
                              setSelectedClient(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClient(client.id);
                              setSelectedClient(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {client.case_title && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Case</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{client.case_title}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Added {new Date(client.created_at).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <User className="w-12 h-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No clients found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding your first client</p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Add Client
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <ClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingClient && (
        <ClientEditModal
          client={editingClient}
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
        />
      )}
    </div>
  );
};

export default Clients;
