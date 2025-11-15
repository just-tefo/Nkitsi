import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const colorForStatus = (status) => {
  if (!status) return '#009688';
  const s = status.toLowerCase();
  if (s.includes('expired')) return '#F44336';
  if (s.includes('expiring')) return '#FF9800';
  return '#009688';
};

const computeStatusFromExpiry = (expiryIso) => {
  if (!expiryIso) return 'valid';
  const now = new Date();
  const expiry = new Date(expiryIso);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((expiry - now) / msPerDay);
  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'expiring soon';
  return 'valid';
};

const DocumentCard = ({ document, onOpen, onUpdate }) => {
  const name = document.name || document.s3?.key || 'Document';
  const expiry = document.expiryDate;
  const status = document.shareStatus || computeStatusFromExpiry(expiry);
  const badgeColor = colorForStatus(status);

  // determine thumbnail
  const thumbUri = document.thumbnailUri || document.s3?.url || null;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={onOpen}>
      <View style={styles.leftAccent} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            {thumbUri ? (
              <Image source={{ uri: thumbUri }} style={styles.thumb} />
            ) : (
              <View style={styles.iconWrap}>
                <MaterialIcons name="description" size={22} color="#fff" />
              </View>
            )}
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}> 
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Type: {document.type || '—'}</Text>
          <Text style={styles.metaText}>Expiry: {expiry ? new Date(expiry).toLocaleDateString() : '—'}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.openBtn} onPress={onOpen} activeOpacity={0.8}>
            <Text style={styles.openText}>Open</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.updateBtn} onPress={onUpdate} activeOpacity={0.8}>
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  leftAccent: {
    width: 6,
    backgroundColor: '#E0F2F1',
  },
  content: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  thumb: { width: 48, height: 48, borderRadius: 8, marginRight: 12, backgroundColor: '#f2f2f2' },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#009688',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: { fontSize: 17, fontWeight: '700', color: '#222', flexShrink: 1 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  statusText: { color: '#fff', fontWeight: '700', textTransform: 'capitalize' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  metaText: { color: '#666', fontSize: 13 },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 },
  openBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#E0F2F1',
  },
  openText: { color: '#00796B', fontWeight: '700' },
  updateBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#009688',
    marginLeft: 8,
  },
  updateText: { color: '#fff', fontWeight: '700' },
});

export default DocumentCard;