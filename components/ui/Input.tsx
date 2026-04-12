import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...rest }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...rest}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
        placeholderTextColor={Colors.TEXT_SECONDARY}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    backgroundColor: Colors.SURFACE,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm + 4,
    fontSize: Theme.fontSize.md,
    color: Colors.TEXT_PRIMARY,
  },
  inputFocused: {
    borderColor: Colors.PRIMARY,
  },
  inputError: {
    borderColor: Colors.ERROR,
  },
  error: {
    fontSize: Theme.fontSize.xs,
    color: Colors.ERROR,
    marginTop: 4,
  },
});
