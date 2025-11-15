import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import MyNetwork from '../components/network';
import { navigate } from '../services/navigationService';

// Simple mock companies. In a real app you'd fetch these from an API.
const MOCK_COMPANIES = [
  { id: 'c1', name: 'Acme Corp', logoUrl: null, lastShared: '2025-10-10' },
  { id: 'c2', name: 'Global Bank', logoUrl: null, lastShared: '2025-09-02' },
  { id: 'c3', name: 'Telecom Ltd', logoUrl: null, lastShared: '2025-08-20' },
];

const NetworkScreen = ({ navigation }) => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // For now use static data — replace with API call if available
    setCompanies(MOCK_COMPANIES);
  }, []);

  const handleSelectCompany = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      // navigate to details screen
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('CompanyDetails', { company });
      } else {
        navigate('CompanyDetails', { company });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>My Network</Text>
        <MyNetwork companies={companies} onSelectCompany={handleSelectCompany} />
        <Text style={styles.hint}>Tap a company to view documents that were shared with them.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  inner: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#333' },
  hint: { marginTop: 12, color: '#666', fontSize: 13 },
});

export default NetworkScreen;
