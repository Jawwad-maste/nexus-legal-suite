
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/database';

export const useDocuments = (clientId?: string) => {
  return useQuery({
    queryKey: ['documents', clientId],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select(`
          *,
          client:clients(*)
        `)
        .order('uploaded_at', { ascending: false });
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Document[];
    },
    enabled: !!clientId || clientId === undefined
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, clientId }: { file: File; clientId: string }) => {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${clientId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('client-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('client-files')
        .getPublicUrl(filePath);

      // Save document record
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          client_id: clientId,
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', clientId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });
};
