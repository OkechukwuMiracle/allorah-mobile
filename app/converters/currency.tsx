import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Input } from '../../components/ui/Input';
import { ResultDisplay } from '../../components/ui/ResultDisplay';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { useCurrencyRates } from '../../hooks/useCurrencyRates';
import { formatDistanceToNow } from 'date-fns';

const POPULAR = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'MXN', 'NGN', 'ZAR'];

export default function CurrencyScreen() {
  const { data, loading, error, fetchRates } = useCurrencyRates();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1');

  useEffect(() => { fetchRates('USD'); }, []);

  const allCurrencies = data ? Object.keys(data.rates).sort() : POPULAR;

  const convert = () => {
    if (!data || !amount) return '';
    const base = parseFloat(amount);
    if (isNaN(base)) return '';
    const fromRate = fromCurrency === data.base ? 1 : data.rates[fromCurrency];
    const toRate = data.rates[toCurrency];
    if (!fromRate || !toRate) return '';
    const result = (base / fromRate) * toRate;
    return result.toFixed(4);
  };

  const result = convert();
  const rate = data ? (() => {
    const fromRate = fromCurrency === data.base ? 1 : data.rates[fromCurrency];
    const toRate = data.rates[toCurrency];
    if (!fromRate || !toRate) return null;
    return (toRate / fromRate).toFixed(6);
  })() : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Currency Converter</Text>
        <TouchableOpacity onPress={() => fetchRates(fromCurrency)}>
          <Ionicons name="refresh" size={22} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={16} color={Colors.ERROR} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {data && (
          <Text style={styles.updated}>
            Rates updated {formatDistanceToNow(new Date(data.fetchedAt))} ago
          </Text>
        )}

        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="1"
        />

        <View style={styles.row}>
          <View style={styles.pickerBox}>
            <Text style={styles.label}>From</Text>
            <View style={styles.picker}>
              <Picker selectedValue={fromCurrency} onValueChange={setFromCurrency} style={styles.pickerInner}>
                {allCurrencies.map((c) => <Picker.Item key={c} label={c} value={c} />)}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.swapBtn}
            onPress={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }}
          >
            <Ionicons name="swap-horizontal" size={22} color={Colors.PRIMARY} />
          </TouchableOpacity>

          <View style={styles.pickerBox}>
            <Text style={styles.label}>To</Text>
            <View style={styles.picker}>
              <Picker selectedValue={toCurrency} onValueChange={setToCurrency} style={styles.pickerInner}>
                {allCurrencies.map((c) => <Picker.Item key={c} label={c} value={c} />)}
              </Picker>
            </View>
          </View>
        </View>

        {loading && <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 20 }} />}

        {result !== '' && !loading && (
          <>
            <ResultDisplay label={`${amount} ${fromCurrency} =`} value={`${result} ${toCurrency}`} copyable />
            {rate && (
              <Text style={styles.rateHint}>
                1 {fromCurrency} = {rate} {toCurrency}
              </Text>
            )}
          </>
        )}

        {!data && !loading && !error && (
          <Button title="Load Rates" onPress={() => fetchRates('USD')} style={{ marginTop: 20 }} />
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
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.SURFACE_2, borderRadius: Theme.borderRadius.sm,
    padding: Theme.spacing.sm, marginBottom: Theme.spacing.md,
    borderWidth: 1, borderColor: Colors.ERROR,
  },
  errorText: { fontSize: Theme.fontSize.sm, color: Colors.ERROR, flex: 1 },
  updated: { fontSize: Theme.fontSize.xs, color: Colors.TEXT_SECONDARY, marginBottom: Theme.spacing.md },
  label: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.medium, color: Colors.TEXT_PRIMARY, marginBottom: Theme.spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm, marginBottom: Theme.spacing.md },
  pickerBox: { flex: 1 },
  picker: { borderWidth: 1.5, borderColor: Colors.BORDER, borderRadius: Theme.borderRadius.md, backgroundColor: Colors.SURFACE, overflow: 'hidden' },
  pickerInner: { height: 50 },
  swapBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
  },
  rateHint: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY, textAlign: 'center', marginTop: 8 },
});
