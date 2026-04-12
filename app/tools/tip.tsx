import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { calculateTip } from '../../utils/tipCalculator';

const QUICK_TIPS = [10, 15, 18, 20, 25];

export default function TipScreen() {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState('15');
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<{ tipAmount: number; totalAmount: number; perPerson: number; tipPerPerson: number } | null>(null);

  const calculate = () => {
    const b = parseFloat(bill);
    const t = parseFloat(tip);
    const p = parseInt(people, 10);
    if (!b || !t || !p || p < 1) return;
    setResult(calculateTip(b, t, p));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Tip Calculator</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label="Bill Amount ($)" value={bill} onChangeText={setBill} keyboardType="decimal-pad" placeholder="0.00" />

        <Text style={styles.label}>Tip Percentage</Text>
        <View style={styles.pills}>
          {QUICK_TIPS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.pill, tip === String(t) && styles.pillActive]}
              onPress={() => setTip(String(t))}
            >
              <Text style={[styles.pillText, tip === String(t) && styles.pillTextActive]}>{t}%</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Input value={tip} onChangeText={setTip} keyboardType="numeric" placeholder="Custom %" style={{ marginTop: -8 }} />

        <Input label="Number of People" value={people} onChangeText={setPeople} keyboardType="numeric" placeholder="1" />

        <Button title="Calculate" onPress={calculate} />

        {result && (
          <View style={styles.resultCard}>
            {[
              { label: 'Tip Amount', value: `$${result.tipAmount}` },
              { label: 'Total Amount', value: `$${result.totalAmount}` },
              { label: 'Per Person', value: `$${result.perPerson}`, highlight: true },
              { label: 'Tip Per Person', value: `$${result.tipPerPerson}` },
            ].map((row) => (
              <View key={row.label} style={styles.resultRow}>
                <Text style={styles.resultLabel}>{row.label}</Text>
                <Text style={[styles.resultValue, row.highlight && styles.resultHighlight]}>{row.value}</Text>
              </View>
            ))}
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
  label: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.medium, color: Colors.TEXT_PRIMARY, marginBottom: Theme.spacing.xs },
  pills: { flexDirection: 'row', gap: 8, marginBottom: Theme.spacing.sm },
  pill: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.SURFACE, borderWidth: 1.5, borderColor: Colors.BORDER,
  },
  pillActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  pillText: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY, fontWeight: Theme.fontWeight.medium },
  pillTextActive: { color: Colors.SURFACE },
  resultCard: {
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg, marginTop: Theme.spacing.lg, gap: 12, ...Theme.shadow.sm,
  },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  resultLabel: { fontSize: Theme.fontSize.md, color: Colors.TEXT_SECONDARY },
  resultValue: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semibold, color: Colors.TEXT_PRIMARY },
  resultHighlight: { fontSize: Theme.fontSize.xl, color: Colors.PRIMARY, fontWeight: Theme.fontWeight.bold },
});
