import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { useAppTheme } from '../../../hooks/useAppTheme';
import FormInput from '../../../components/FormInput';
import { loginSchema, LoginFormData } from '../schemas/loginSchema';

const LoginScreen: React.FC = () => {
  const theme = useAppTheme();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    clearError();

    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google Sign-In error:', err);
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <FormInput
              name="email"
              control={control}
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              editable={!isLoading}
              error={errors.email}
              accessibilityLabel="Email address"
              accessibilityHint="Enter your email address to sign in"
            />

            <FormInput
              name="password"
              control={control}
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              editable={!isLoading}
              error={errors.password}
              accessibilityLabel="Password"
              accessibilityHint="Enter your password to sign in"
            />

            {error ? (
              <View 
                style={styles.globalErrorContainer}
                accessibilityLiveRegion="assertive"
                accessibilityRole="alert"
              >
                <Text style={styles.globalErrorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                isLoading ? styles.buttonDisabled : null,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.7}
              accessibilityLabel="Sign in"
              accessibilityHint="Double tap to sign in with your email and password"
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isLoading ? (
                <ActivityIndicator 
                  color={theme.colors.text.inverse}
                  accessibilityLabel="Signing in"
                />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={[
                styles.googleButton,
                isLoading ? styles.buttonDisabled : null,
              ]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              activeOpacity={0.7}
              accessibilityLabel="Sign in with Google"
              accessibilityHint="Double tap to sign in using your Google account"
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.text.primary} />
              ) : (
                <>
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.xxl,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xxxl,
      ...theme.shadows.card,
    },
    title: {
      ...theme.typography.heading,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xxxl,
      textAlign: 'center',
    },
    globalErrorContainer: {
      backgroundColor: `${theme.colors.error}15`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    globalErrorText: {
      ...theme.typography.body,
      color: theme.colors.error,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      minHeight: 48,
      ...theme.shadows.card,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      ...theme.typography.subheading,
      color: theme.colors.text.inverse,
      fontWeight: '600',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.xl,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      marginHorizontal: theme.spacing.md,
    },
    googleButton: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      minHeight: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.card,
    },
    googleButtonText: {
      ...theme.typography.subheading,
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
  });

export default LoginScreen;
