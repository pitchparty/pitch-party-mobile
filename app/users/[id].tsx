import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';

import { useUserProfile } from '@/features/profiles/admins/hooks';
import UserHeader from '@/features/profiles/components/UserHeader';
import UserSocialLinks from '@/features/profiles/components/UserSocialLinks';
import UserDetailSection from '@/features/profiles/components/UserDetailSection';
import StatusStateView from '@/components/ui/StatusStateView';
import { useNavigation } from '@react-navigation/native';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

const UserDetailScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "User Profile",
    });
  }, [navigation]);

  const { data: user, isLoading, error } = useUserProfile(id);

  if (isLoading) return <StatusStateView status='pending' message='Loading user profile...' />;
  if (error) return <StatusStateView status='error' message='Something went wrong' error={error} />;
  if (!user) return <StatusStateView status='empty' message='User not found' />;

  return (
      <ScrollView className="flex-1 bg-blue-50 dark:bg-gray-900 p-4">
        <UserHeader user={user} />
        
   
          <UserDetailSection 
            title="Personal Information"
            details={[
              { label: 'Username', value: user.username },
              { label: 'Full Name', value: `${user.first_name} ${user.last_name}` },
              { label: 'Email', value: user.phone_number },
              { label: 'Date of Birth', value: user.date_of_birth },
              { label: 'Role', value: user.role }
            ]}
          />

            <UserDetailSection 
              title="Bio" 
              details={[{ label: '', value: user.bio }]} 
            />

            <UserDetailSection 
              title="Address"
              details={[
                { label: 'Street', value: user?.address?.street },
                { label: 'City', value: user?.address?.city },
                { label: 'State', value: user?.address?.state },
                { label: 'Country', value: user?.address?.country },
                { label: 'Postal Code', value: user?.address?.postalCode }
              ]}
            />
    

          {/* <UserSocialLinks socialLinks={user.social_links} /> */}
  
      </ScrollView>
  );
}

export default UserDetailScreen;