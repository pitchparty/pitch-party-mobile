import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import ProgressBar from './ProgressBar';

export type Document = {
  uri: string;
  name: string;
  type: string;
  size: number;
};

interface DocumentItemProps {
  title: string;
  description?: string;
  documents: Document[];
  onPickDocument: () => void;
  onRemoveDocument: (index: number) => void;
  isLoading?: boolean;
  error?: string | null;
  multiple?: boolean;
  documentKey: string; // Add documentKey to track compression
  isCompressingDocument: string | null; // Pass the compressing document key
}

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return "document-text";
  if (type.includes('image')) return "image";
  return "document";
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentItem: React.FC<DocumentItemProps> = ({
  title,
  description,
  documents,
  onPickDocument,
  onRemoveDocument,
  isLoading = false,
  error = null,
  multiple = false,
  documentKey,
  isCompressingDocument,
}) => {
  const hasFiles = documents.length > 0;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPickDocument}
        disabled={isLoading}
        style={[
          styles.documentContainer,
          hasFiles ? styles.documentContainerWithFiles : styles.documentContainerEmpty
        ]}
      >
        <View style={[
          styles.innerContainer,
          hasFiles ? styles.innerContainerWithFiles : styles.innerContainerEmpty
        ]}>
          <View style={styles.rowContainer}>
            <View style={[
              styles.iconContainer,
              hasFiles ? styles.iconContainerWithFiles : styles.iconContainerEmpty
            ]}>
              <Ionicons
                name={hasFiles ? "checkmark-circle" : "cloud-upload-outline"}
                size={24}
                color={hasFiles ? "#3B82F6" : "#6B7280"}
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.titleText}>{title}</Text>
              {!hasFiles && (
                <Text style={styles.descriptionText}>{description || "Tap to browse files"}</Text>
              )}
              {hasFiles && (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.fileInfoContainer}>
                  <View style={styles.singleFileRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileNameText} numberOfLines={1} ellipsizeMode="middle">
                        {documents.length === 1 ? documents[0].name : `${documents.length} files selected`}
                      </Text>
                      <Text style={styles.sizeText}>
                        {documents.length === 1
                          ? formatFileSize(documents[0].size)
                          : formatFileSize(totalSize) + ' total'}
                      </Text>
                    </View>
                    {documents.length === 1 && (
                      <TouchableOpacity
                        onPress={() => onRemoveDocument(0)}
                        style={styles.removeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="trash" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </Animated.View>
              )}

{isLoading && documentKey === isCompressingDocument && (<ProgressBar visible={true} label="Compressing your document..." />)}
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {multiple && documents.length > 1 && (
        <Animated.View entering={FadeIn} style={styles.documentListContainer}>
          {documents.map((doc, index) => (
            <View key={`${doc.uri}-${index}`} style={styles.documentListItem}>
              <View style={styles.documentItemContent}>
                <Ionicons
                  name={getFileIcon(doc.type)}
                  size={16}
                  color="#6B7280"
                />
                <Text
                  style={styles.documentItemName}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {doc.name}
                </Text>
                <Text style={styles.documentItemSize}>
                  {formatFileSize(doc.size)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onRemoveDocument(index)}
                style={styles.removeButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="trash" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>
      )}

      {error && (
        <Animated.Text entering={FadeIn} style={styles.errorText}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  documentContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  documentContainerEmpty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  documentContainerWithFiles: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  innerContainer: {
    padding: 16,
  },
  innerContainerEmpty: {
    backgroundColor: '#F9FAFB',
  },
  innerContainerWithFiles: {
    backgroundColor: '#EFF6FF',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerEmpty: {
    backgroundColor: '#F3F4F6',
  },
  iconContainerWithFiles: {
    backgroundColor: '#DBEAFE',
  },
  contentContainer: {
    marginLeft: 12,
    flex: 1,
  },
  titleText: {
    color: '#1F2937',
    fontWeight: '500',
    fontSize: 16,
  },
  descriptionText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  fileInfoContainer: {
    marginTop: 4,
  },
  fileNameText: {
    color: '#2563EB',
    fontWeight: '500',
  },
  sizeText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  singleFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentListContainer: {
    marginTop: 8,
    marginLeft: 48,
  },
  documentListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  documentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentItemName: {
    color: '#4B5563',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  documentItemSize: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 4,
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
    paddingLeft: 8,
  }
});

export default DocumentItem;
