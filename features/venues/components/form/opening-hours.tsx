// components/OpeningHours.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { TimePicker } from '@/components/TimePicker';

interface Schedule {
  open: string;
  close: string;
  closed: boolean;
}

interface OpeningHoursProps {
  form: UseFormReturn<any>;
}

const HOURS_GROUPS = {
  weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  weekend: ['saturday', 'sunday']
};

export const OpeningHours: React.FC<OpeningHoursProps> = ({ form }) => {
  const { control, setValue, watch } = form;
  const [useGroupedHours, setUseGroupedHours] = useState({
    weekdays: true,
    weekend: true
  });

  const applyGroupHours = (group: 'weekdays' | 'weekend', schedule: Schedule) => {
    HOURS_GROUPS[group].forEach(day => {
      setValue(`opening_hours.${day}`, schedule);
    });
  };

  const renderTimeGroup = (title: string, days: string[], groupKey: 'weekdays' | 'weekend') => {
    const firstDay = days[0];
    const groupValue = watch(`opening_hours.${firstDay}`);
    const isGrouped = useGroupedHours[groupKey];

    return (
      <View className="mb-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-semibold">{title}</Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600 mr-2">Use same hours</Text>
            <Switch
              value={isGrouped}
              onValueChange={(value) => setUseGroupedHours(prev => ({
                ...prev,
                [groupKey]: value
              }))}
            />
          </View>
        </View>

        {isGrouped ? (
          <View className="">
            <View className="flex-row items-center">
              <Controller
                control={control}
                name={`opening_hours.${firstDay}`}
                render={({ field: { value, onChange } }) => (
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <TimePicker
                        value={value?.open}
                        onChange={(time) => {
                          const newSchedule = { ...value, open: time };
                          onChange(newSchedule);
                          applyGroupHours(groupKey, newSchedule);
                        }}
                        placeholder="Opening Time"
                      />
                      <Text className="mx-2">to</Text>
                      <TimePicker
                        value={value?.close}
                        onChange={(time) => {
                          const newSchedule = { ...value, close: time };
                          onChange(newSchedule);
                          applyGroupHours(groupKey, newSchedule);
                        }}
                        placeholder="Closing Time"
                      />
                      <TouchableOpacity 
                        className="ml-2 p-2 items-center"
                        onPress={() => {
                          const newSchedule = { ...value, closed: !value?.closed };
                          onChange(newSchedule);
                          applyGroupHours(groupKey, newSchedule);
                        }}
                      >
                        <Ionicons 
                          name={value?.closed ? "close-circle" : "checkmark-circle"} 
                          size={24} 
                          color={value?.closed ? "#ef4444" : "#22c55e"} 
                        />
                        {value?.closed ? (
                          <Text className="text-red-500 text-sm mt-1">Closed</Text>
                        ) : (
                          <Text className="text-green-500 text-sm mt-1">Opened</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    
                  </View>
                )}
              />
            </View>
          </View>
        ) : (
          days.map(day => (
            <View key={day} className="">
              <Text className="text-sm font-medium mb-2 capitalize">{day}</Text>
              <Controller
                control={control}
                name={`opening_hours.${day}`}
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row items-center">
                    <TimePicker
                      value={value?.open}
                      onChange={(time) => onChange({ ...value, open: time })}
                      placeholder="Opening Time"
                    />
                    <Text className="mx-2">to</Text>
                    <TimePicker
                      value={value?.close}
                      onChange={(time) => onChange({ ...value, close: time })}
                      placeholder="Closing Time"
                    />
                    <TouchableOpacity 
                      className="ml-2 p-1 items-center"
                      onPress={() => onChange({ ...value, closed: !value?.closed })}
                    >
                      <Ionicons 
                        name={value?.closed ? "close-circle" : "checkmark-circle"} 
                        size={24} 
                        color={value?.closed ? "#ef4444" : "#22c55e"} 
                      />
                      {value?.closed ? (
                          <Text className="text-red-500 text-sm mt-1">Closed</Text>
                        ) : (
                          <Text className="text-green-500 text-sm mt-1">Opened</Text>
                        )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <View>
      <Text className="text-base font-bold">Opening Hours</Text>
      {renderTimeGroup('Weekdays', HOURS_GROUPS.weekdays, 'weekdays')}
      {renderTimeGroup('Weekend', HOURS_GROUPS.weekend, 'weekend')}
    </View>
  );
};