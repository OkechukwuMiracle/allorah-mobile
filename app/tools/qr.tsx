import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

export default function QRScreen() {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>QR Code Generator</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Text or URL"
          value={text}
          onChangeText={setText}
          placeholder="Enter text or URL to encode"
          multiline
          numberOfLines={3}
        />

        {text.trim().length > 0 ? (
          <View style={styles.qrContainer}>
            <QRCode
              value={text.trim()}
              size={220}
              color={Colors.TEXT_PRIMARY}
              backgroundColor={Colors.SURFACE_2}
            />
            <Text style={styles.qrHint}>Scan with any QR reader</Text>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="qr-code-outline" size={80} color={Colors.BORDER} />
            <Text style={styles.placeholderText}>Your QR code will appear here</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg, paddingVertical: Theme.spacing.md,
    backgroundColor: Colors.SURFACE, borderBottomWidth: 1, borderBottomColor: Colors.BORDER,
  },
  title: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.TEXT_PRIMARY },
  content: { padding: Theme.spacing.lg, paddingBottom: 40 },
  qrContainer: {
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl, alignItems: 'center', marginTop: Theme.spacing.lg, ...Theme.shadow.md,
  },
  qrHint: { marginTop: Theme.spacing.md, fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY },
  placeholder: {
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl, alignItems: 'center', marginTop: Theme.spacing.lg,
    borderWidth: 2, borderColor: Colors.BORDER, borderStyle: 'dashed',
  },
  placeholderText: { marginTop: Theme.spacing.md, fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY },
});
