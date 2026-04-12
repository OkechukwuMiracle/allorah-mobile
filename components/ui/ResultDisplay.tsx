import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface ResultDisplayProps {
  label?: string;
  value: string;
  copyable?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  label,
  value,
  copyable = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.box}>
        <Text style={styles.value} numberOfLines={3} adjustsFontSizeToFit>
          {value}
        </Text>
        {copyable && (
          <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={20}
              color={copied ? Colors.SUCCESS : Colors.PRIMARY}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Theme.spacing.xs,
    fontWeight: Theme.fontWeight.medium,
  },
  box: {
    backgroundColor: Colors.SURFACE_2,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.PRIMARY,
    flex: 1,
  },
  copyBtn: {
    padding: Theme.spacing.xs,
    marginLeft: Theme.spacing.sm,
  },
});
