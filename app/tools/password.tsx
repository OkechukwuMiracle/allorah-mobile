import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { ResultDisplay } from '../../components/ui/ResultDisplay';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { generatePassword, rateStrength, PasswordOptions } from '../../utils/passwordGenerator';

export default function PasswordScreen() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState('');

  const generate = () => {
    setPassword(generatePassword(options));
  };

  const strength = password ? rateStrength(password) : null;

  const toggle = (key: keyof Omit<PasswordOptions, 'length'>) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const adjustLength = (delta: number) => {
    setOptions((prev) => ({
      ...prev,
      length: Math.min(64, Math.max(8, prev.length + delta)),
    }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Password Generator</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Length */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Password Length</Text>
          <View style={styles.lengthRow}>
            <TouchableOpacity onPress={() => adjustLength(-1)} style={styles.stepBtn}>
              <Ionicons name="remove" size={20} color={Colors.PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.lengthValue}>{options.length}</Text>
            <TouchableOpacity onPress={() => adjustLength(1)} style={styles.stepBtn}>
              <Ionicons name="add" size={20} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Character Sets</Text>
          {([
            { key: 'uppercase', label: 'Uppercase (A-Z)' },
            { key: 'lowercase', label: 'Lowercase (a-z)' },
            { key: 'numbers',   label: 'Numbers (0-9)' },
            { key: 'symbols',   label: 'Symbols (!@#$...)' },
          ] as { key: keyof Omit<PasswordOptions, 'length'>; label: string }[]).map(({ key, label }) => (
            <View key={key} style={styles.optionRow}>
              <Text style={styles.optionLabel}>{label}</Text>
              <Switch
                value={options[key]}
                onValueChange={() => toggle(key)}
                trackColor={{ true: Colors.PRIMARY, false: Colors.BORDER }}
                thumbColor={Colors.SURFACE}
              />
            </View>
          ))}
        </View>

        <Button title="Generate Password" onPress={generate} />

        {password !== '' && (
          <>
            <ResultDisplay label="Generated Password" value={password} copyable />
            {strength && (
              <View style={styles.strengthRow}>
                <Text style={styles.strengthLabel}>Strength:</Text>
                <Text style={[styles.strengthValue, { color: strength.color }]}>{strength.label}</Text>
                <View style={styles.strengthBar}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthSegment,
                        { backgroundColor: i < strength.score ? strength.color : Colors.BORDER },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
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
  card: {
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md, marginBottom: Theme.spacing.md, ...Theme.shadow.sm,
  },
  cardTitle: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semibold, color: Colors.TEXT_PRIMARY, marginBottom: Theme.spacing.sm },
  lengthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Theme.spacing.lg },
  stepBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center', justifyContent: 'center',
  },
  lengthValue: { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.bold, color: Colors.TEXT_PRIMARY, minWidth: 50, textAlign: 'center' },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  optionLabel: { fontSize: Theme.fontSize.md, color: Colors.TEXT_PRIMARY },
  strengthRow: { marginTop: Theme.spacing.md, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  strengthLabel: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY },
  strengthValue: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold },
  strengthBar: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthSegment: { flex: 1, height: 6, borderRadius: 3 },
});
