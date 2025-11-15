import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import DocumentCard from '../components/documentCard';

const DocumentsScreen = () => {
  const isFocused = useIsFocused();
  const [savedDocs, setSavedDocs] = useState([]);

  const defaultDocuments = [
    { id: 1, name: 'Passport', expiryDate: '2026-03-15', type: 'Government ID' },
    { id: 2, name: 'Driver License', expiryDate: '2025-12-01', type: 'License' },
    { id: 3, name: 'Health Insurance', expiryDate: '2024-09-30', type: 'Insurance' },
    { id: 4, name: 'University ID', expiryDate: '2027-06-10', type: 'Student ID' },
  ];

  const loadSaved = async () => {
    try {
      const key = 'nkitsi:documents';
      const stored = await AsyncStorage.getItem(key);
      const list = stored ? JSON.parse(stored) : [];
      setSavedDocs(list);
    } catch (e) {
      console.warn('Failed to load saved docs', e);
    }
  };

  useEffect(() => {
    if (isFocused) loadSaved();
  }, [isFocused]);

  const allDocs = [...savedDocs, ...defaultDocuments];

  const handleOpen = (document) => Alert.alert('Open Document', document.name || (document.s3 && document.s3.key) || 'Document');
  const handleUpdate = (document) => Alert.alert('Update Document', document.name || 'Document');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>My Documents</Text>
      <Text style={styles.subtitle}>Your personal documents and uploads</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {allDocs.map((doc, idx) => (
          <DocumentCard
            key={doc.id || idx}
            document={doc}
            onOpen={() => handleOpen(doc)}
            onUpdate={() => handleUpdate(doc)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: '#f2f7f6',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: { textAlign: 'center', color: '#666', marginTop: -12, marginBottom: 10 },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default DocumentsScreen;