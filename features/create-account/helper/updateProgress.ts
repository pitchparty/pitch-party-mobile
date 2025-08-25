import { supabase } from "@/lib/supabase";

type Progress = {
    personal_info: boolean;
    venue_info: boolean;
    documents_uploaded: boolean;
    photos_uploaded: boolean;
    submitted_for_review: boolean;
  };
  
  type ManagerProfile = {
    id: string;
    progress: Progress;
  };
  
 export const updateProgress = async (
    userId: string,
    stage: keyof Progress,
    value: boolean
  ) => {
    try {
      // Step 1: Fetch existing progress
      const { data: existingData, error: fetchError } = await supabase
        .from('profiles')
        .select('progress')
        .eq('id', userId)
        .single<ManagerProfile>();
  
      if (fetchError) {
        console.error('Failed to fetch progress:', fetchError);
        return;
      }
  
      const updatedProgress: Progress = {
        ...existingData.progress,
        [stage]: value,
      };
  
      // Step 2: Update the progress
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ progress: updatedProgress })
        .eq('id', userId);
  
      if (updateError) {
        console.error('Error updating progress:', updateError);
      } else {
        console.log('Progress updated successfully');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  