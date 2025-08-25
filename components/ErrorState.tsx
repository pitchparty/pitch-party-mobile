import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Define the types of states available
export type StateType = 'error' | 'warning' | 'info';

// Props interface for the component
interface StateMessageProps {
  type: StateType;
  message: string;
  details?: string;
  onDismiss?: () => void;
  actionText?: string;
  onAction?: () => void;
}

// Configuration for each state type
const stateConfig = {
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    textColor: 'text-red-700',
    icon: 'close-circle',
    iconColor: 'text-red-400',
    actionColor: 'bg-red-50 text-red-700 border-red-400 hover:bg-red-100',
  },
  warning: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-700',
    icon: 'alert-circle',
    iconColor: 'text-yellow-400',
    actionColor: 'bg-yellow-50 text-yellow-700 border-yellow-400 hover:bg-yellow-100',
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-700',
    icon: 'alert-circle',
    iconColor: 'text-blue-400',
    actionColor: 'bg-blue-50 text-blue-700 border-blue-400 hover:bg-blue-100',
  },
};

export const StateMessage: React.FC<StateMessageProps> = ({
  type,
  message,
  details,
  onDismiss,
  actionText,
  onAction,
}) => {
  const config = stateConfig[type];

  return (
    <View 
      className={`p-4 mb-4 rounded-md border ${config.bgColor} ${config.borderColor}`}
    >
      <View className="flex-row items-start">
        <Ionicons icon={config.icon} className={`w-5 h-5 ${config.iconColor} mr-2`} size={20} />
        
        <View className="flex-1">
          <Text className={`text-sm font-medium ${config.textColor}`}>
            {message}
          </Text>
          
          {details && (
            <Text className={`mt-2 text-sm ${config.textColor}`}>
              {details}
            </Text>
          )}
          
          {actionText && onAction && (
            <TouchableOpacity
              onPress={onAction}
              className={`mt-3 py-2 px-3 rounded-md border ${config.borderColor}`}
            >
              <Text className={`text-sm font-medium ${config.textColor}`}>
                {actionText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} className="ml-auto">
            <Ionicons name={'close-circle'} size={20} className={config.iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Hook to manage error/warning state
export const useStateMessage = (initialState?: {
  type: StateType;
  message: string;
  details?: string;
}) => {
  const [state, setState] = React.useState<{
    visible: boolean;
    type: StateType;
    message: string;
    details?: string;
  }>({
    visible: initialState ? true : false,
    type: initialState?.type || 'info',
    message: initialState?.message || '',
    details: initialState?.details,
  });

  const showMessage = (type: StateType, message: string, details?: string) => {
    setState({
      visible: true,
      type,
      message,
      details,
    });
  };

  const showError = (message: string, details?: string) => {
    showMessage('error', message, details);
  };

  const showWarning = (message: string, details?: string) => {
    showMessage('warning', message, details);
  };

  const showInfo = (message: string, details?: string) => {
    showMessage('info', message, details);
  };

  const hideMessage = () => {
    setState(prev => ({
      ...prev,
      visible: false,
    }));
  };

  return {
    state,
    showMessage,
    showError,
    showWarning,
    showInfo,
    hideMessage,
  };
};