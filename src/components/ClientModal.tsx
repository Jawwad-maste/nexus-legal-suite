
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateClient } from '@/hooks/useClientOperations';
import { useUserLimits, useCurrentCounts } from '@/hooks/useSubscription';
import UpgradeModal from './UpgradeModal';
import PlanSelectionModal from './PlanSelectionModal';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientModal = ({ isOpen, onClose }: ClientModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    case_title: '',
    photo_url: ''
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const createClient = useCreateClient();
  const { data: limits } = useUserLimits();
  const { clientCount } = useCurrentCounts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check limits
    if (limits && clientCount >= limits.max_clients) {
      setShowUpgradeModal(true);
      return;
    }

    if (limits?.is_trial_expired) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      await createClient.mutateAsync({
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        case_title: formData.case_title || undefined,
        photo_url: formData.photo_url || undefined,
      });
      setFormData({ name: '', age: '', case_title: '', photo_url: '' });
      onClose();
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    setShowPlanModal(true);
  };

  const handlePlanSelected = () => {
    setShowPlanModal(false);
    // User should now be able to create clients
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Client</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Title
              </label>
              <input
                type="text"
                value={formData.case_title}
                onChange={(e) => setFormData({ ...formData, case_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createClient.isPending || !formData.name.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {createClient.isPending ? 'Creating...' : 'Add Client'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        reason={limits?.is_trial_expired ? 'trial_expired' : 'clients'}
      />

      <PlanSelectionModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelected={handlePlanSelected}
      />
    </>
  );
};
