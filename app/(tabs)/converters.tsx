import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

const CONVERTERS = [
  {
    id: 'unit',
    title: 'Unit Converter',
    subtitle: 'Length, Weight, Temp, Volume',
    icon: 'resize' as const,
    iconColor: Colors.PRIMARY,
    route: '/converters/unit',
  },
  {
    id: 'currency',
    title: 'Currency Converter',
    subtitle: 'Live exchange rates',
    icon: 'cash' as const,
    iconColor: Colors.SECONDARY,
    route: '/converters/currency',
  },
];

export default function ConvertersTab() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Converters</Text>
        <Text style={styles.subheading}>Pick a converter to get started</Text>

        <View style={styles.grid}>
          {CONVERTERS.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              iconColor={item.iconColor}
              onPress={() => router.push(item.route as any)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  container: { flex: 1 },
  content: { padding: Theme.spacing.lg, paddingBottom: Theme.spacing.xl },
  heading: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subheading: {
    fontSize: Theme.fontSize.sm,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Theme.spacing.lg,
  },
  grid: {
    gap: Theme.spacing.md,
  },
});
