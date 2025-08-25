import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface AmenitiesBottomSheetProps {
  onAmenitiesChange: (amenities: string[]) => void;
  selectedAmenities: string[];
}

const availableAmenities = [
  'Free Wi-Fi',
  'Parking',
  'Swimming Pool',
  'Gym',
  'Restaurant',
  'Bar',
  'Spa',
  'Conference Rooms',
  // Add more amenities as needed
];

const AmenitiesBottomSheet: React.FC<AmenitiesBottomSheetProps> = ({ onAmenitiesChange, selectedAmenities }) => {
  const [localSelectedAmenities, setLocalSelectedAmenities] = useState<string[]>(selectedAmenities);

  useEffect(() => {
    onAmenitiesChange(localSelectedAmenities);
  }, [localSelectedAmenities, onAmenitiesChange]);

  const toggleAmenity = (amenity: string) => {
    if (localSelectedAmenities.includes(amenity)) {
      setLocalSelectedAmenities(localSelectedAmenities.filter((a) => a !== amenity));
    } else {
      setLocalSelectedAmenities([...localSelectedAmenities, amenity]);
    }
  };

  return (
    <ScrollView>
      <Text className="text-xl font-semibold mb-4">Select Amenities</Text>
      {availableAmenities.map((amenity) => (
        <TouchableOpacity
          key={amenity}
          className={`py-3 px-4 rounded-lg mb-2 ${localSelectedAmenities.includes(amenity) ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100 border border-gray-300'}`}
          onPress={() => toggleAmenity(amenity)}
        >
          <Text className={`font-medium ${localSelectedAmenities.includes(amenity) ? 'text-blue-700' : 'text-gray-700'}`}>
            {amenity}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default AmenitiesBottomSheet;