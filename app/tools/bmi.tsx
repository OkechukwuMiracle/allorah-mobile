import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { calculateBMI, lbsToKg, ftInToM } from '../../utils/bmiCalculator';

type Unit = 'metric' | 'imperial';

export default function BMIScreen() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [weight, setWeight] = useState('');
  const [heightM, setHeightM] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    let wKg: number, hM: number;
    if (unit === 'metric') {
      wKg = parseFloat(weight);
      hM = parseFloat(heightM) / 100;
    } else {
      wKg = lbsToKg(parseFloat(weight));
      hM = ftInToM(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0);
    }
    if (!wKg || !hM || hM <= 0) return;
    setResult(calculateBMI(wKg, hM));
  };

  const reset = () => { setWeight(''); setHeightM(''); setHeightFt(''); setHeightIn(''); setResult(null); };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>BMI Calculator</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Unit toggle */}
        <View style={styles.toggle}>
          {(['metric', 'imperial'] as Unit[]).map((u) => (
            <TouchableOpacity
              key={u}
              style={[styles.toggleBtn, unit === u && styles.toggleBtnActive]}
              onPress={() => { setUnit(u); setResult(null); }}
            >
              <Text style={[styles.toggleText, unit === u && styles.toggleTextActive]}>
                {u === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lb/ft)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label={unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="e.g. 70"
        />

        {unit === 'metric' ? (
          <Input
            label="Height (cm)"
            value={heightM}
            onChangeText={setHeightM}
            keyboardType="numeric"
            placeholder="e.g. 175"
          />
        ) : (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="Height (ft)" value={heightFt} onChangeText={setHeightFt} keyboardType="numeric" placeholder="5" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Height (in)" value={heightIn} onChangeText={setHeightIn} keyboardType="numeric" placeholder="9" />
            </View>
          </View>
        )}

        <Button title="Calculate BMI" onPress={calculate} style={{ marginTop: 8 }} />

        {result && (
          <View style={[styles.resultCard, { borderLeftColor: result.color }]}>
            <Text style={[styles.bmiValue, { color: result.color }]}>{result.bmi}</Text>
            <Text style={[styles.category, { color: result.color }]}>{result.category}</Text>

            <View style={styles.scale}>
              {[
                { label: 'Underweight', range: '< 18.5', color: Colors.SECONDARY },
                { label: 'Normal', range: '18.5–24.9', color: Colors.SUCCESS },
                { label: 'Overweight', range: '25–29.9', color: '#F59E0B' },
                { label: 'Obese', range: '≥ 30', color: '#EF4444' },
              ].map((row) => (
                <View key={row.label} style={styles.scaleRow}>
                  <View style={[styles.dot, { backgroundColor: row.color }]} />
                  <Text style={styles.scaleLabel}>{row.label}</Text>
                  <Text style={styles.scaleRange}>{row.range}</Text>
                </View>
              ))}
            </View>

            <Button title="Reset" onPress={reset} variant="outline" style={{ marginTop: 16 }} />
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
  toggle: { flexDirection: 'row', backgroundColor: Colors.BORDER, borderRadius: Theme.borderRadius.md, padding: 3, marginBottom: Theme.spacing.lg },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Theme.borderRadius.sm },
  toggleBtnActive: { backgroundColor: Colors.SURFACE, ...Theme.shadow.sm },
  toggleText: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY, fontWeight: Theme.fontWeight.medium },
  toggleTextActive: { color: Colors.PRIMARY, fontWeight: Theme.fontWeight.semibold },
  row: { flexDirection: 'row', gap: Theme.spacing.sm },
  resultCard: {
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg, marginTop: Theme.spacing.lg,
    borderLeftWidth: 4, ...Theme.shadow.sm,
  },
  bmiValue: { fontSize: Theme.fontSize.hero, fontWeight: Theme.fontWeight.bold, textAlign: 'center' },
  category: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.semibold, textAlign: 'center', marginTop: 4, marginBottom: Theme.spacing.lg },
  scale: { gap: 8 },
  scaleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  scaleLabel: { flex: 1, fontSize: Theme.fontSize.sm, color: Colors.TEXT_PRIMARY },
  scaleRange: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY },
});
