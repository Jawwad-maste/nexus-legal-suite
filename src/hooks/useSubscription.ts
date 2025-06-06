
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useEffect } from 'react';

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
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const newProfile = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email || '',
            subscription_plan: 'free_trial' as const,
            subscription_status: 'active' as const,
            trial_start_date: new Date().toISOString(),
            trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();
            
          if (createError) throw createError;
          return createdProfile as UserProfile;
        }
        throw error;
      }
      return data as UserProfile;
    },
    enabled: !!user && !authLoading,
  });
};

export const useUserLimits = () => {
  const { user, loading: authLoading } = useAuth();
  
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
    enabled: !!user && !authLoading,
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      plan 
    }: { 
      plan: 'free_trial' | 'pro' | 'pro_plus';
    }) => {
      if (!user) {
        throw new Error('You must be logged in to update your subscription');
      }
      
      console.log('Updating subscription for user:', user.id, 'to plan:', plan);
      
      const updateData: any = {
        subscription_plan: plan,
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      if (plan === 'free_trial') {
        updateData.trial_start_date = new Date().toISOString();
        updateData.trial_end_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      } else {
        // For paid plans, set subscription end date to 1 month from now
        updateData.subscription_end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }
      
      // First, try to update existing profile
      let { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
      
      // If profile doesn't exist, create it
      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || '',
          ...updateData,
        };
        
        const { data: createdData, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
          
        if (createError) throw createError;
        data = createdData;
      } else if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userLimits'] });
      toast.success('Subscription updated successfully!');
    },
    onError: (error: any) => {
      console.error('Subscription update error:', error);
      toast.error('Failed to update subscription: ' + error.message);
    },
  });
};

export const useCurrentCounts = () => {
  const { user, loading: authLoading } = useAuth();
  
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
    enabled: !!user && !authLoading,
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
    enabled: !!user && !authLoading,
  });
  
  return {
    clientCount: clientsQuery.data || 0,
    documentCount: documentsQuery.data || 0,
    isLoading: clientsQuery.isLoading || documentsQuery.isLoading,
  };
};

// Add real-time subscription for counts
export const useRealtimeCounts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['clientCount'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['documentCount'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
};
