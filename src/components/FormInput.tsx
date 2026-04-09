import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { useAppTheme } from '../hooks/useAppTheme';

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: FieldError;
  containerStyle?: ViewStyle;
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  error,
  containerStyle,
  ...textInputProps
}: FormInputProps<T>) => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.xl,
    },
    label: {
      ...theme.typography.label,
      marginBottom: theme.spacing.sm,
    },
    input: {
      ...theme.typography.body,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      color: theme.colors.text.primary,
      minHeight: 48,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              error ? styles.inputError : null,
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor={theme.colors.text.secondary}
            {...textInputProps}
          />
        )}
      />
      {error && (
        <Text 
          style={styles.errorText}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error.message}
        </Text>
      )}
    </View>
  );
};

export default FormInput;
