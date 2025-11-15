import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { confirmSignup as confirmSignupController } from '../controllers/authControllers';

const ConfirmSignup = ({ route, navigation }) => {
  const { email: prefilledEmail } = route.params || {};
  const [email, setEmail] = useState(prefilledEmail || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!email || !code) {
      Alert.alert('Missing data', 'Please provide both email and confirmation code');
      return;
    }
    try {
      setLoading(true);
      await confirmSignupController(email, code);
      Alert.alert('Confirmed', 'Your account has been verified. You can now log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      console.error('Confirm signup error', err);
      Alert.alert('Confirmation failed', err.message || 'Unable to confirm signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Confirm Your Account</Text>
        <Text style={styles.subtitle}>Enter the verification code sent to your email.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmation Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Confirming...' : 'Confirm'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20, marginTop: 80 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#666', marginBottom: 20 },
  input: { height: 48, borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  button: { backgroundColor: '#009688', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});

export default ConfirmSignup;
