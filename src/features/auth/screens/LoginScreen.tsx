import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../services/authService';
import { useAppTheme } from '../../../hooks/useAppTheme';

const LoginScreen: React.FC = () => {
  const theme = useAppTheme();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Validation error state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Refs for input focus management
  const passwordInputRef = React.useRef<TextInput>(null);

  /**
   * Validate form fields
   * @returns true if all fields are valid
   */
  const validateForm = (): boolean => {
    let isValid = true;

    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    clearError();

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await login(email, password);
      // Navigation to app stack is handled by RootNavigator
    } catch (err) {
      // Error is already set in the auth store
      console.error('Login error:', err);
    }
  };

  /**
   * Handle Google Sign-In button press
   */
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      // Navigation to app stack is handled by RootNavigator
    } catch (err) {
      // Error is already set in the auth store
      console.error('Google Sign-In error:', err);
    }
  };

  /**
   * Handle email input change
   */
  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear email error when user starts typing
    if (emailError) {
      setEmailError('');
    }
    if (error) {
      clearError();
    }
  };

  /**
   * Handle password input change
   */
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear password error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
    if (error) {
      clearError();
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
          {/* Login Card */}
          <View style={styles.card}>
            {/* Title */}
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  emailError ? styles.inputError : null,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                editable={!isLoading}
                accessibilityLabel="Email address"
                accessibilityHint="Enter your email address to sign in"
                accessibilityRole="none"
              />
              {emailError ? (
                <Text 
                  style={styles.errorText}
                  accessibilityLiveRegion="polite"
                  accessibilityRole="alert"
                >
                  {emailError}
                </Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                ref={passwordInputRef}
                style={[
                  styles.input,
                  passwordError ? styles.inputError : null,
                ]}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.text.secondary}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!isLoading}
                accessibilityLabel="Password"
                accessibilityHint="Enter your password to sign in"
                accessibilityRole="none"
              />
              {passwordError ? (
                <Text 
                  style={styles.errorText}
                  accessibilityLiveRegion="polite"
                  accessibilityRole="alert"
                >
                  {passwordError}
                </Text>
              ) : null}
            </View>

            {/* Global Error Message */}
            {error ? (
              <View 
                style={styles.globalErrorContainer}
                accessibilityLiveRegion="assertive"
                accessibilityRole="alert"
              >
                <Text style={styles.globalErrorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login Button - Requirement 11.8: Touchable feedback */}
            <TouchableOpacity
              style={[
                styles.button,
                isLoading ? styles.buttonDisabled : null,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.7} // Visual feedback on press (Requirement 11.8)
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

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Sign-In Button */}
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

/**
 * Create styles based on theme
 * 
 * Implements modern UI design with:
 * - 8pt spacing system (Requirement 11.1)
 * - Rounded corners (8px/12px) (Requirement 11.2)
 * - Soft shadows for card elevation (Requirement 11.3)
 * - Clear typography hierarchy (Requirement 11.4)
 * - Centered form with card-based layout (Requirement 11.5)
 */
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.xxl, // 24px spacing (Requirement 11.1)
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg, // 12px rounded corners (Requirement 11.2)
      padding: theme.spacing.xxxl, // 32px internal spacing (Requirement 11.1)
      ...theme.shadows.card, // Soft shadow for elevation (Requirement 11.3)
    },
    title: {
      ...theme.typography.heading, // Typography hierarchy (Requirement 11.4)
      marginBottom: theme.spacing.sm, // 8px spacing (Requirement 11.1)
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body, // Typography hierarchy (Requirement 11.4)
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xxxl, // 32px spacing (Requirement 11.1)
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: theme.spacing.xl, // 20px spacing (Requirement 11.1)
    },
    label: {
      ...theme.typography.label, // Typography hierarchy (Requirement 11.4)
      marginBottom: theme.spacing.sm, // 8px spacing (Requirement 11.1)
    },
    input: {
      ...theme.typography.body, // Typography hierarchy (Requirement 11.4)
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md, // 8px rounded corners (Requirement 11.2)
      padding: theme.spacing.md, // 12px internal spacing (Requirement 11.1)
      color: theme.colors.text.primary,
      minHeight: 48, // Minimum touch target size for accessibility
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      ...theme.typography.caption, // Typography hierarchy (Requirement 11.4)
      color: theme.colors.error,
      marginTop: theme.spacing.xs, // 4px spacing (Requirement 11.1)
    },
    globalErrorContainer: {
      backgroundColor: `${theme.colors.error}15`,
      borderRadius: theme.borderRadius.md, // 8px rounded corners (Requirement 11.2)
      padding: theme.spacing.md, // 12px spacing (Requirement 11.1)
      marginBottom: theme.spacing.lg, // 16px spacing (Requirement 11.1)
    },
    globalErrorText: {
      ...theme.typography.body, // Typography hierarchy (Requirement 11.4)
      color: theme.colors.error,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md, // 8px rounded corners (Requirement 11.2)
      padding: theme.spacing.lg, // 16px spacing (Requirement 11.1)
      alignItems: 'center',
      marginTop: theme.spacing.lg, // 16px spacing (Requirement 11.1)
      minHeight: 48, // Minimum touch target size for accessibility
      ...theme.shadows.card, // Soft shadow for button elevation (Requirement 11.3)
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      ...theme.typography.subheading, // Typography hierarchy (Requirement 11.4)
      color: theme.colors.text.inverse,
      fontWeight: '600',
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.xl, // 20px spacing
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      marginHorizontal: theme.spacing.md, // 12px spacing
    },
    googleButton: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md, // 8px rounded corners
      padding: theme.spacing.lg, // 16px spacing
      alignItems: 'center',
      minHeight: 48, // Minimum touch target size
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
