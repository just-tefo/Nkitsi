import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompanyDetails = ({ route, navigation }) => {
  const { company } = route.params || {};
  const [sharedDocs, setSharedDocs] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: company?.name || 'Company' });
    loadShared();
  }, []);

  const loadShared = async () => {
    try {
      const key = 'nkitsi:documents';
      const stored = await AsyncStorage.getItem(key);
      const list = stored ? JSON.parse(stored) : [];
      // For demo: treat all stored docs as shared with every company.
      // Add mock shared metadata (sharedAt, expiryDate) and a computed status
      const withMock = (list || []).map((doc) => {
        const uploadedAt = doc.uploadedAt ? new Date(doc.uploadedAt) : new Date();

        // If document doesn't have an expiryDate, create a mock one
        let expiry = doc.expiryDate ? new Date(doc.expiryDate) : null;
        if (!expiry) {
          // Create a mock expiry between -10 and +40 days from upload
          const daysOffset = Math.floor(Math.random() * 51) - 10; // -10..40
          expiry = new Date(uploadedAt);
          expiry.setDate(expiry.getDate() + daysOffset);
        }

        // SharedAt: use uploadedAt or a recent date (mock)
        const sharedAt = doc.sharedAt ? new Date(doc.sharedAt) : uploadedAt;

        // Compute status based on expiry
        const now = new Date();
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.ceil((expiry - now) / msPerDay);
        let status = 'valid';
        if (diffDays < 0) status = 'expired';
        else if (diffDays <= 7) status = 'expiring soon';

        return {
          ...doc,
          expiryDate: expiry.toISOString(),
          sharedAt: sharedAt.toISOString(),
          shareStatus: status,
        };
      });

      // If there are no stored documents, provide a small set of hard-coded mock shares
      if ((!withMock || withMock.length === 0) && company) {
        const now = new Date();
        const make = (name, daysToExpiry) => ({
          id: `mock-${name.replace(/\s+/g, '_')}`,
          name,
          type: 'Mock Document',
          uploadedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          expiryDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * daysToExpiry).toISOString(),
          s3: { url: null },
          sharedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        });

        const mockList = [
          make(`${company.name} - Passport Copy`, 400),
          make(`${company.name} - Driver License`, 6),
          make(`${company.name} - Insurance`, -3),
        ].map((d) => ({ ...d, shareStatus: (() => {
          const now2 = new Date();
          const exp = new Date(d.expiryDate);
          const diff = Math.ceil((exp - now2) / (1000 * 60 * 60 * 24));
          if (diff < 0) return 'expired';
          if (diff <= 7) return 'expiring soon';
          return 'valid';
        })() }));

        setSharedDocs(mockList);
      } else {
        setSharedDocs(withMock);
      }
    } catch (e) {
      console.warn('Error loading shared docs', e);
    }
  };

  const openDoc = async (doc) => {
    if (doc.s3 && doc.s3.url) {
      const ok = await Linking.openURL(doc.s3.url).catch((e) => {
        Alert.alert('Unable to open', 'Could not open document URL');
      });
    } else {
      Alert.alert('No URL', 'This document has no public URL');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.docRow} onPress={() => openDoc(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.docName}>{item.name || item.s3?.key || 'Document'}</Text>
        <Text style={styles.docMeta}>Shared: {item.sharedAt ? new Date(item.sharedAt).toLocaleString() : item.uploadedAt ? new Date(item.uploadedAt).toLocaleString() : 'Unknown'}</Text>
        <Text style={styles.docMeta}>Expiry: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '—'}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <View style={[styles.statusBadge, styles[`status_${item.shareStatus.replace(/\s/g, '_')}`]]}>
          <Text style={styles.statusText}>{item.shareStatus}</Text>
        </View>
        <Text style={[styles.action, { marginTop: 8 }]}>Open</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>{company?.name || 'Company'}</Text>
        <Text style={styles.subtitle}>Documents shared with this company</Text>

        {sharedDocs.length === 0 ? (
          <Text style={styles.empty}>No documents have been shared with this company yet.</Text>
        ) : (
          <FlatList data={sharedDocs} keyExtractor={(i) => `${i.id}`} renderItem={renderItem} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#333' },
  subtitle: { color: '#666', marginTop: 6, marginBottom: 12 },
  empty: { color: '#999', marginTop: 20 },
  docRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  docName: { fontSize: 16, fontWeight: '600', color: '#333' },
  docMeta: { color: '#888', marginTop: 4 },
  action: { color: '#009688', fontWeight: '700' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 110,
    alignItems: 'center',
  },
  statusText: { color: '#fff', fontWeight: '700', textTransform: 'capitalize' },
  status_valid: { backgroundColor: '#009688' },
  status_expiring_soon: { backgroundColor: '#FF9800' },
  status_expired: { backgroundColor: '#F44336' },
});

export default CompanyDetails;
