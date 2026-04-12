import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { calculateAge, calculateDateDiff } from '../../utils/ageCalculator';
import { format } from 'date-fns';

type Mode = 'age' | 'diff';

export default function AgeScreen() {
  const [mode, setMode] = useState<Mode>('age');
  const [birthDateStr, setBirthDateStr] = useState('');
  const [fromDateStr, setFromDateStr] = useState('');
  const [toDateStr, setToDateStr] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [ageResult, setAgeResult] = useState<ReturnType<typeof calculateAge> | null>(null);
  const [diffResult, setDiffResult] = useState<ReturnType<typeof calculateDateDiff> | null>(null);
  const [error, setError] = useState('');

  const parseDate = (str: string): Date | null => {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const calculateAgeHandler = () => {
    setError('');
    const d = parseDate(birthDateStr);
    if (!d) { setError('Enter a valid date (YYYY-MM-DD)'); return; }
    if (d > new Date()) { setError('Birth date cannot be in the future'); return; }
    setAgeResult(calculateAge(d));
  };

  const calculateDiffHandler = () => {
    setError('');
    const from = parseDate(fromDateStr);
    const to = parseDate(toDateStr);
    if (!from || !to) { setError('Enter valid dates (YYYY-MM-DD)'); return; }
    setDiffResult(calculateDateDiff(from, to));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Age Calculator</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toggle}>
          {(['age', 'diff'] as Mode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.toggleBtn, mode === m && styles.toggleBtnActive]}
              onPress={() => { setMode(m); setAgeResult(null); setDiffResult(null); setError(''); }}
            >
              <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>
                {m === 'age' ? 'Age Calculator' : 'Date Difference'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'age' ? (
          <>
            <Input
              label="Date of Birth (YYYY-MM-DD)"
              value={birthDateStr}
              onChangeText={setBirthDateStr}
              placeholder="e.g. 1995-06-15"
              error={error}
            />
            <Button title="Calculate Age" onPress={calculateAgeHandler} />

            {ageResult && (
              <View style={styles.resultCard}>
                <Text style={styles.resultBig}>{ageResult.years} years</Text>
                <Text style={styles.resultSub}>
                  {ageResult.months} months, {ageResult.days} days
                </Text>
                <Text style={styles.resultSub}>{ageResult.totalDays.toLocaleString()} total days</Text>
                <View style={styles.divider} />
                <Text style={styles.nextLabel}>Next Birthday</Text>
                <Text style={styles.nextValue}>{ageResult.nextBirthday}</Text>
                <Text style={styles.resultSub}>in {ageResult.nextBirthdayIn} days</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Input label="From Date (YYYY-MM-DD)" value={fromDateStr} onChangeText={setFromDateStr} placeholder="e.g. 2020-01-01" error={error} />
            <Input label="To Date (YYYY-MM-DD)" value={toDateStr} onChangeText={setToDateStr} placeholder="e.g. 2025-01-01" />
            <Button title="Calculate Difference" onPress={calculateDiffHandler} />

            {diffResult && (
              <View style={styles.resultCard}>
                <Text style={styles.resultBig}>{diffResult.totalDays.toLocaleString()} days</Text>
                {[
                  { label: 'Years', value: diffResult.years },
                  { label: 'Months (rem.)', value: diffResult.months },
                  { label: 'Weeks', value: diffResult.weeks },
                  { label: 'Days (rem.)', value: diffResult.days },
                ].map((row) => (
                  <View key={row.label} style={styles.row}>
                    <Text style={styles.rowLabel}>{row.label}</Text>
                    <Text style={styles.rowValue}>{row.value.toLocaleString()}</Text>
                  </View>
                ))}
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
  toggle: { flexDirection: 'row', backgroundColor: Colors.BORDER, borderRadius: Theme.borderRadius.md, padding: 3, marginBottom: Theme.spacing.lg },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Theme.borderRadius.sm },
  toggleBtnActive: { backgroundColor: Colors.SURFACE, ...Theme.shadow.sm },
  toggleText: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY, fontWeight: Theme.fontWeight.medium },
  toggleTextActive: { color: Colors.PRIMARY, fontWeight: Theme.fontWeight.semibold },
  resultCard: {
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg, marginTop: Theme.spacing.lg, ...Theme.shadow.sm,
  },
  resultBig: { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.bold, color: Colors.PRIMARY, textAlign: 'center', marginBottom: 4 },
  resultSub: { fontSize: Theme.fontSize.md, color: Colors.TEXT_SECONDARY, textAlign: 'center', marginBottom: 4 },
  divider: { height: 1, backgroundColor: Colors.BORDER, marginVertical: Theme.spacing.md },
  nextLabel: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY, textAlign: 'center', fontWeight: Theme.fontWeight.medium },
  nextValue: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.TEXT_PRIMARY, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.BORDER },
  rowLabel: { fontSize: Theme.fontSize.md, color: Colors.TEXT_SECONDARY },
  rowValue: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semibold, color: Colors.TEXT_PRIMARY },
});
