
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (caseData: { 
      title: string; 
      description: string; 
      status: 'Active' | 'Pending Review' | 'Discovery' | 'Investigation' | 'Completed';
      priority: 'High' | 'Medium' | 'Low';
      client_name: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('cases')
        .insert([{
          ...caseData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create case');
    },
  });
};

export const useUpdateCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string;
      title?: string; 
      description?: string; 
      status?: 'Active' | 'Pending Review' | 'Discovery' | 'Investigation' | 'Completed';
      priority?: 'High' | 'Medium' | 'Low';
      client_name?: string;
    }) => {
      const { data, error } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update case');
    },
  });
};

export const useDeleteCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseId: string) => {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', caseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete case');
    },
  });
};

export const useCaseOperations = () => {
  const createCase = useCreateCase();
  const updateCase = useUpdateCase();
  const deleteCase = useDeleteCase();

  return {
    createCase,
    updateCase,
    deleteCase,
  };
};
