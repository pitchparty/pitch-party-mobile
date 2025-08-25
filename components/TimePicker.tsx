import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parse } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select time'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Initialize tempTime with current value if it exists, otherwise current time
  const [tempTime, setTempTime] = useState(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date;
    }
    return new Date();
  });

  const formatDisplayTime = (timeString?: string) => {
    if (!timeString) return placeholder;
    const date = parse(timeString, 'HH:mm', new Date());
    return format(date, 'h:mm a'); // Displays time in 12-hour format with AM/PM
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const currentDate = selectedTime || tempTime;
    setTempTime(currentDate);
    
    if (Platform.OS === 'android') {
      setIsVisible(false);
      if (event.type === 'set') {
        onChange(format(currentDate, 'HH:mm'));
      }
    }
  };

  const handleDone = () => {
    onChange(format(tempTime, 'HH:mm'));
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="flex-1 h-12 px-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-300  flex-row items-center justify-between"
      >
        <Text className={`${value ? 'text-black' : 'text-gray-500'}`}>
          {formatDisplayTime(value)}
        </Text>
        <Ionicons name="time-outline" size={20} color="#6B7280" />
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          transparent
          animationType="slide"
          visible={isVisible}
          onRequestClose={handleCancel}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={handleCancel}
            className="flex-1 justify-end bg-black/50"
          >
            <TouchableOpacity 
              activeOpacity={1}
              className="bg-white rounded-t-xl"
            >
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <TouchableOpacity onPress={handleCancel}>
                  <Text className="text-blue-500 text-base">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Select Time</Text>
                <TouchableOpacity onPress={handleDone}>
                  <Text className="text-blue-500 text-base">Done</Text>
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                textColor="black"
                style={{ height: 200 }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      ) : (
        isVisible && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}
    </>
  );
};