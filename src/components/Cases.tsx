
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Eye, Edit, Trash2, Calendar, User, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Case {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'pending' | 'closed' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  dateCreated: string;
  lastUpdated: string;
  description: string;
  tags: string[];
}

interface CaseFormData {
  name: string;
  client: string;
  status: Case['status'];
  priority: Case['priority'];
  description: string;
  tags: string[];
}

const Cases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [showCaseDetail, setShowCaseDetail] = useState<Case | null>(null);

  const [newCaseForm, setNewCaseForm] = useState<CaseFormData>({
    name: '',
    client: '',
    status: 'active',
    priority: 'medium',
    description: '',
    tags: []
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
    'on-hold': 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  // Mock data
  const mockCases: Case[] = [
    {
      id: '1',
      name: 'Johnson vs. ABC Corp',
      client: 'Michael Johnson',
      status: 'active',
      priority: 'high',
      dateCreated: '2024-01-15',
      lastUpdated: '2024-01-20',
      description: 'Employment discrimination lawsuit against ABC Corporation.',
      tags: ['employment', 'discrimination', 'corporate']
    },
    {
      id: '2',
      name: 'Smith Family Trust',
      client: 'Sarah Smith',
      status: 'pending',
      priority: 'medium',
      dateCreated: '2024-01-10',
      lastUpdated: '2024-01-18',
      description: 'Estate planning and trust setup for the Smith family.',
      tags: ['estate', 'trust', 'family']
    },
    {
      id: '3',
      name: 'Wilson Contract Dispute',
      client: 'David Wilson',
      status: 'active',
      priority: 'low',
      dateCreated: '2024-01-05',
      lastUpdated: '2024-01-19',
      description: 'Commercial contract dispute resolution.',
      tags: ['contract', 'commercial', 'dispute']
    }
  ];

  useEffect(() => {
    const loadCases = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCases(mockCases);
        setFilteredCases(mockCases);
        setIsLoading(false);
      }, 1000);
    };

    loadCases();
  }, []);

  useEffect(() => {
    let filtered = cases;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (case_) =>
          case_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          case_.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((case_) => case_.status === statusFilter);
    }

    setFilteredCases(filtered);
  }, [cases, searchTerm, statusFilter]);

  const handleCreateCase = () => {
    if (!newCaseForm.name || !newCaseForm.client) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newCase: Case = {
      id: Date.now().toString(),
      ...newCaseForm,
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setCases([newCase, ...cases]);
    setNewCaseForm({
      name: '',
      client: '',
      status: 'active',
      priority: 'medium',
      description: '',
      tags: []
    });
    setShowNewCaseModal(false);
    toast.success('Case created successfully');
  };

  const handleEditCase = (updatedCase: Case) => {
    setCases(cases.map(c => c.id === updatedCase.id ? { ...updatedCase, lastUpdated: new Date().toISOString().split('T')[0] } : c));
    setEditingCase(null);
    toast.success('Case updated successfully');
  };

  const handleDeleteCase = (caseId: string) => {
    setCases(cases.filter(c => c.id !== caseId));
    toast.success('Case deleted successfully');
  };

  const CaseModal = ({ case: caseData, onSave, onClose }: {
    case?: Case;
    onSave: (caseData: Case | CaseFormData) => void;
    onClose: () => void;
  }) => {
    const [formData, setFormData] = useState<CaseFormData>(
      caseData ? {
        name: caseData.name,
        client: caseData.client,
        status: caseData.status,
        priority: caseData.priority,
        description: caseData.description,
        tags: caseData.tags
      } : newCaseForm
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (caseData) {
        onSave({ ...caseData, ...formData });
      } else {
        onSave(formData);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-100">
              {caseData ? 'Edit Case' : 'New Case'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-100 mb-1">
                  Case Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-bg-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-100 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3 py-2 border border-bg-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-100 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Case['status'] })}
                  className="w-full px-3 py-2 border border-bg-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="on-hold">On Hold</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-100 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Case['priority'] })}
                  className="w-full px-3 py-2 border border-bg-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-100 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-bg-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent-100 hover:bg-accent-200 text-primary-100">
                {caseData ? 'Update Case' : 'Create Case'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-100 mb-2">Cases</h1>
            <p className="text-text-200">Manage and track all your legal cases</p>
          </div>
          
          <Button
            onClick={() => setShowNewCaseModal(true)}
            className="bg-accent-100 hover:bg-accent-200 text-primary-100 mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-200 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cases or clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-bg-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-text-200" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-bg-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-100"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="on-hold">On Hold</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border-b">
                    <div className="w-8 h-8 bg-bg-200 rounded animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-bg-200 rounded animate-pulse w-1/4"></div>
                      <div className="h-3 bg-bg-200 rounded animate-pulse w-1/6"></div>
                    </div>
                    <div className="w-20 h-6 bg-bg-200 rounded animate-pulse"></div>
                    <div className="w-24 h-8 bg-bg-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-text-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-100 mb-2">No cases found</h3>
                <p className="text-text-200">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-bg-200">
                      <th className="text-left py-3 px-4 font-medium text-text-100">Case</th>
                      <th className="text-left py-3 px-4 font-medium text-text-100">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-text-100">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-text-100">Priority</th>
                      <th className="text-left py-3 px-4 font-medium text-text-100">Updated</th>
                      <th className="text-left py-3 px-4 font-medium text-text-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((case_) => (
                      <motion.tr
                        key={case_.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-bg-100 hover:bg-bg-100 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-text-100">{case_.name}</div>
                            <div className="text-sm text-text-200 truncate max-w-xs">
                              {case_.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-text-200 mr-2" />
                            <span className="text-text-100">{case_.client}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[case_.status]}`}>
                            {case_.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[case_.priority]}`}>
                            {case_.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-text-200">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(case_.lastUpdated).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowCaseDetail(case_)}
                              className="h-8 w-8"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingCase(case_)}
                              className="h-8 w-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCase(case_.id)}
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewCaseModal && (
          <CaseModal
            onSave={handleCreateCase}
            onClose={() => setShowNewCaseModal(false)}
          />
        )}
        
        {editingCase && (
          <CaseModal
            case={editingCase}
            onSave={(updatedCase) => handleEditCase(updatedCase as Case)}
            onClose={() => setEditingCase(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cases;
