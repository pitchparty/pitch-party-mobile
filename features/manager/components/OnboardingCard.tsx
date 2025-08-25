import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import AnimatedContainer from './atoms/AnimatedContainer';
import ManagerProgressBar from './atoms/ManagerProgressBar';
import ManagerButton from './atoms/ManagerButton';
import ManagerCard from './atoms/ManagerCard';

import { ManagerProgressInterface } from '@/types/supabase-types';
import { router } from 'expo-router';
import { useVenueByManager } from '@/features/venues/hooks';
import { useAuthStore } from '@/features/authentication/store';
import { useAddVenueForm } from '@/features/venues/hooks/useAddVenueForm';
import { useAddVenueStore } from '@/features/venues/store/useAddVenueStore';
import { Venue, VenueDetailsWithManager } from '@/features/venues/types';

const OnboardingCard = () => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id as string;
  const userName = user?.first_name as string;
  const progressData = user?.progress as ManagerProgressInterface;

  const { methods } = useAddVenueForm();
  const { setVenueData } = useAddVenueStore();
  const { data, isPending } = useVenueByManager(userId);

  const calculateProgress = (data: ManagerProgressInterface): number => {
    const total = Object.keys(data).length;
    const completed = Object.values(data).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const getStatus = (data: ManagerProgressInterface): string => {
    if (!data.personal_info) return 'incomplete-registration';
    if (!data.venue_info) return 'missing-venue';
    const hasVenue = data.venue_info && !data.submitted_for_review;
    const isMissingDocs = !data.documents_uploaded || !data.photos_uploaded;
    if (hasVenue && isMissingDocs) return 'missing-docs';
    if (data.submitted_for_review) return 'complete';
    return 'in-progress';
  };

  const status = getStatus(progressData);
  const progress = calculateProgress(progressData);

  const passVenueData = async() => {
    const venue = data?.[0] as VenueDetailsWithManager;
  
    const capacity = venue?.capacity;
    const pricing = venue?.pricing;
    const redemptionOption = venue.redemption_option;

    // Ensure value is exactly one of the two expected enums or fallback
    const validRedemptionOption =
      redemptionOption === 'redeemable' || redemptionOption === 'non-redeemable'
        ? redemptionOption
        : 'redeemable'; // default or handle accordingly

    const transformedVenue = {
      name: venue.name,
      address: venue.address,
      longitude: venue.longitude,
      latitude: venue.latitude,
      amenities: venue.amenities,
      capacity: capacity?.toString() || '',
      pricing: pricing?.toString() || '',
      redemption_option: validRedemptionOption,
      contact_phone: venue.contact_phone,
      contact_email: venue.contact_email,
      manager_id: userId,
    };

    // @ts-ignore
    await methods.reset(transformedVenue);
    // @ts-ignore
    await setVenueData(transformedVenue);
    return router.push("/venues/add/upload-documents");
  };

  const getStatusContent = () => {
    switch (status) {
      case 'incomplete-registration':
        return {
          headline: "Finish Setting Up Your Account to Start Earning",
          buttonText: "Complete Registration",
          navigateTo: () => router.push("/venues/add/new-shop"),
        };
      case 'missing-venue':
        return {
          headline: "Let's Add Your First Venue",
          buttonText: "Register Venue",
          navigateTo: () => router.push("/venues/add/new-shop"),
        };
      case 'missing-docs':
        return {
          headline: "Upload Your Venue's Documents & Photos",
          buttonText: "Upload Documents",
          navigateTo: () => passVenueData(),
        };
      case 'complete':
        return {
          headline: `Welcome Back, ${userName || 'Manager'}!`,
          buttonText: "View Dashboard",
          navigateTo: () => {},
        };
      case 'in-progress':
      default:
        return {
          headline: "Complete Your Setup",
          buttonText: "Continue",
          navigateTo: () => router.push("/venues/add/new-shop"),
        };
    }
  };

  const { headline, buttonText, navigateTo } = getStatusContent();

  const getIllustration = () => {
    return require('@/assets/images/blue_logo.png');
  };

  return (
    <ManagerCard className="border border-gray-100">
      <View className="flex-row justify-between items-start mb-6">
        <Text className="text-2xl font-bold text-gray-800 flex-1 mr-4">
          {headline}
        </Text>

        <AnimatedContainer delay={300} className="w-24 h-24">
          <Image
            source={getIllustration()}
            style={{ width: 50, height: 50, flex: 1 }}
            resizeMode="contain"
          />
        </AnimatedContainer>
      </View>

      <View className="mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-600">Onboarding Progress</Text>
          <Text className="text-sm font-medium text-gray-800">{progress}%</Text>
        </View>
        <ManagerProgressBar progress={progress} />
      </View>

      {!isPending && (
        <ManagerButton
          title={buttonText}
          onPress={navigateTo}
          variant="primary"
          fullWidth
        />
      )}
    </ManagerCard>
  );
};

export default OnboardingCard;
