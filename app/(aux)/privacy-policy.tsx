import { useNavigation } from 'expo-router';
import React, { ReactNode } from 'react';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect'

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Text className="text-lg font-bold text-gray-800 mb-2">
    {children}
  </Text>
);

const Subtitle = ({ children }: { children: ReactNode }) => (
  <Text className="text-base font-semibold text-gray-700 mb-1">
    {children}
  </Text>
);

const Content = ({ children }: { children: ReactNode }) => (
  <Text className="text-gray-600 mb-4 leading-6">
    {children}
  </Text>
);

const bulletCharacter = `\u2022 `;

const PrivacyPolicyScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Privacy Policy"
    })
  }, [navigation])

  return (
    <ScrollView className={`flex-1 bg-gray-100 pt-[${insets.top}px] px-4`}>
      <Text className="text-2xl font-bold text-gray-900 mb-2 mt-4">Privacy Policy</Text>
      <Text className="text-gray-500 mb-6">
          Effective Date: 
        </Text>
        <SectionTitle>Information Collection:</SectionTitle> 
        <Content>
          <Subtitle>Personal Information: {" "}</Subtitle>
          <Content>
            We collect personal information that you voluntarily provide to us when you 
          </Content>
        </Content>
    </ScrollView>
  );
};

export default PrivacyPolicyScreen;