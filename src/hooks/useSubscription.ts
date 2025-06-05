
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserLimits {
  max_clients: number;
  max_documents: number;
  is_trial_expired: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  subscription_plan: 'free_trial' | 'pro' | 'pro_plus';
  subscription_status: 'active' | 'expired' | 'cancelled';
  trial_start_date: string;
  trial_end_date: string;
  subscription_start_date: string;
  subscription_end_date: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user,
  });
};

export const useUserLimits = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userLimits', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase.rpc('get_user_limits', {
        user_id: user.id
      });
      
      if (error) throw error;
      return data[0] as UserLimits;
    },
    enabled: !!user,
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      plan, 
      selectedPlan 
    }: { 
      plan: 'free_trial' | 'pro' | 'pro_plus';
      selectedPlan: string;
    }) => {
      if (!user) throw new Error('No user');
      
      const updateData: any = {
        subscription_plan: plan,
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
      };
      
      if (plan === 'free_trial') {
        updateData.trial_start_date = new Date().toISOString();
        updateData.trial_end_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userLimits'] });
    },
  });
};

export const useCurrentCounts = () => {
  const { user } = useAuth();
  
  const clientsQuery = useQuery({
    queryKey: ['clientCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });
  
  const documentsQuery = useQuery({
    queryKey: ['documentCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      // Get client IDs first, then count documents
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id);
      
      if (clientsError) throw clientsError;
      
      if (!clients || clients.length === 0) return 0;
      
      const clientIds = clients.map(client => client.id);
      
      const { count, error } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .in('client_id', clientIds);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });
  
  return {
    clientCount: clientsQuery.data || 0,
    documentCount: documentsQuery.data || 0,
    isLoading: clientsQuery.isLoading || documentsQuery.isLoading,
  };
};
