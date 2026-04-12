import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

const TOOLS = [
  {
    id: 'bmi',
    title: 'BMI Calculator',
    subtitle: 'Body mass index & classification',
    icon: 'body' as const,
    iconColor: Colors.SUCCESS,
    route: '/tools/bmi',
  },
  {
    id: 'age',
    title: 'Age Calculator',
    subtitle: 'Age & date difference',
    icon: 'calendar' as const,
    iconColor: Colors.SECONDARY,
    route: '/tools/age',
  },
  {
    id: 'tip',
    title: 'Tip Calculator',
    subtitle: 'Split bills with tip',
    icon: 'restaurant' as const,
    iconColor: Colors.PRIMARY,
    route: '/tools/tip',
  },
  {
    id: 'password',
    title: 'Password Generator',
    subtitle: 'Strong & customizable passwords',
    icon: 'lock-closed' as const,
    iconColor: Colors.WARNING,
    route: '/tools/password',
  },
  {
    id: 'qr',
    title: 'QR Code Generator',
    subtitle: 'Turn text into QR codes',
    icon: 'qr-code' as const,
    iconColor: Colors.SUCCESS,
    route: '/tools/qr',
  },
];

export default function ToolsTab() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Tools</Text>
        <Text style={styles.subheading}>Everyday utilities at your fingertips</Text>

        <View style={styles.grid}>
          {TOOLS.map((item) => (
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
