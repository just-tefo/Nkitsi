import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../services/navigationService';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddDocumentScreen = ({ navigation }) => {
  // --- State ---
  const [status, setStatus] = useState(null);
  const [docType, setDocType] = useState(null);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- Dropdown options ---
  const options = [
    { key: 'id', label: 'National ID' },
    { key: 'passport', label: 'Passport' },
    { key: 'license', label: 'Driver’s License' },
    { key: 'permit', label: 'Work/Residence Permit' },
  ];

  // --- File picker ---
  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const fileInfo = result.assets[0];
      const isImage = fileInfo.mimeType?.startsWith('image/');
      setFile({
        uri: fileInfo.uri,
        name: fileInfo.name,
        type: fileInfo.mimeType,
        isImage,
      });
    } catch (error) {
      console.warn('File selection failed:', error);
      Alert.alert('Error', 'Failed to pick a file.');
    }
  };

  // --- Submit logic ---
  const handleSubmit = async () => {
    if (!docType) {
      Alert.alert('Please choose a document type');
      return;
    }

    const uploadAndFinish = async () => {
      try {
        if (file && file.uri) {
          setIsUploading(true);
          setUploadProgress(0);

          const form = new FormData();
          const fileType = file.isImage
            ? 'image/jpeg'
            : file.type || 'application/octet-stream';
          const fileName = file.name || `upload.${fileType.split('/').pop()}`;
          form.append('file', { uri: file.uri, name: fileName, type: fileType });

          const baseUrl =
            Platform.OS === 'android'
              ? 'http://10.0.2.2:5000'
              : 'http://localhost:5000';
          const url = `${baseUrl}/api/upload`;

          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);

            xhr.onload = () => {
              setIsUploading(false);
              setUploadProgress(1);
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
              } else {
                reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
              }
            };

            xhr.onerror = () => {
              setIsUploading(false);
              reject(new Error('Network error'));
            };

            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) setUploadProgress(e.loaded / e.total);
            };

            xhr.send(form);
          })
            .then(async (respText) => {
              const json = JSON.parse(respText);
              const key = 'nkitsi:documents';
              const stored = await AsyncStorage.getItem(key);
              const list = stored ? JSON.parse(stored) : [];

              const newDoc = {
                id: Date.now(),
                name: fileName,
                type: docType.key,
                uploadedAt: new Date().toISOString(),
                s3: json,
              };

              list.unshift(newDoc);
              await AsyncStorage.setItem(key, JSON.stringify(list));
              Alert.alert('Uploaded', 'Document uploaded successfully.');
            })
            .catch((err) => {
              console.warn('Upload error', err);
              Alert.alert('Upload failed', err.message || 'Unknown error');
            })
            .finally(() => setIsUploading(false));

          setTimeout(() => {
            if (navigation && navigation.goBack) navigation.goBack();
            else navigate('Documents');
          }, 700);
        } else {
          Alert.alert('Document added', `Type: ${docType.label}\nStatus: ${status}`);
          if (navigation && navigation.goBack) navigation.goBack();
          else navigate('Documents');
        }
      } catch (err) {
        console.warn('Upload error', err);
        Alert.alert('Upload failed', err.message || 'Unknown error');
        setIsUploading(false);
      }
    };

    uploadAndFinish();
  };

  // --- Render dropdown option ---
  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        setDocType(item);
        setDropdownOpen(false);
      }}
    >
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  // --- UI ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Add Document</Text>

        <Text style={styles.label}>Are you a citizen or an expat?</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, status === 'citizen' && styles.toggleBtnActive]}
            onPress={() => setStatus('citizen')}
          >
            <Text
              style={[
                styles.toggleText,
                status === 'citizen' && styles.toggleTextActive,
              ]}
            >
              Citizen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, status === 'expat' && styles.toggleBtnActive]}
            onPress={() => setStatus('expat')}
          >
            <Text
              style={[
                styles.toggleText,
                status === 'expat' && styles.toggleTextActive,
              ]}
            >
              Expat
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Document type</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownOpen(true)}
        >
          <Text style={styles.dropdownText}>
            {docType ? docType.label : 'Select document type'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Add notes about this document"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity style={styles.fileBtn} onPress={handleChooseFile}>
          <Ionicons name="cloud-upload-outline" size={20} color="#009688" />
          <Text style={styles.fileBtnText}>Choose file</Text>
        </TouchableOpacity>

        {file && (
          <View style={{ marginTop: 12 }}>
            {file.isImage ? (
              <Image
                source={{ uri: file.uri }}
                style={{ width: 120, height: 80, borderRadius: 6 }}
              />
            ) : (
              <Text style={{ color: '#333' }}>{file.name}</Text>
            )}
          </View>
        )}

        {isUploading && (
          <View
            style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <ActivityIndicator size="small" color="#009688" />
            <Text>{Math.round((uploadProgress || 0) * 100)}% uploading...</Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isUploading}
          >
            <Text style={styles.submitText}>Add Document</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={dropdownOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList data={options} renderItem={renderOption} keyExtractor={(i) => i.key} />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 16, flex: 1 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12, color: '#333' },
  label: { marginTop: 12, marginBottom: 6, color: '#666', fontWeight: '600' },
  toggleRow: { flexDirection: 'row', gap: 12 },
  toggleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#E0F2F1',
    borderWidth: 1,
    borderColor: '#009688',
  },
  toggleText: { color: '#333', fontWeight: '600' },
  toggleTextActive: { color: '#009688' },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  dropdownText: { color: '#333' },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  fileBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  fileBtnText: { color: '#009688', marginLeft: 8, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  cancelBtn: { padding: 12 },
  cancelText: { color: '#666', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#009688',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitText: { color: '#fff', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff',
    maxHeight: '50%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
  },
  option: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  optionText: { color: '#333' },
});

export default AddDocumentScreen;