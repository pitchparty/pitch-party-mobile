import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Modal, ActivityIndicator, ProgressBarAndroid, Platform } from 'react-native';

interface UploadProgressModalProps {
  visible: boolean;
  progress: number; // 0 to 100
}

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({ visible, progress }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.text}>Uploading your documents...</Text>
          <Text style={styles.progressText}>{progress}% completed</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    marginTop: 10,
    color: '#666',
  },
});

export default UploadProgressModal;
