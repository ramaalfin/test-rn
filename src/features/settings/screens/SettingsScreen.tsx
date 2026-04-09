import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import useSettingsStore from '../../../stores/useSettingStore';
import useAppTheme from '../../../hooks/useAppTheme';
import useAuth from '../../auth/hooks/useAuth';

const APP_VERSION = '0.0.1';

const SettingsScreen: React.FC = () => {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const {isDarkMode, toggleDarkMode, loadSettings} =
    useSettingsStore();
  const {logout, user} = useAuth();
  const [localDarkMode, setLocalDarkMode] = useState(isDarkMode);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setLocalDarkMode(isDarkMode);
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setLocalDarkMode(!localDarkMode);
    toggleDarkMode();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              queryClient.clear();
            } catch {
              Alert.alert(
                'Logout Failed',
                'An error occurred while logging out. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.label,
      fontWeight: '600',
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.card,
      minHeight: 44,
    },
    settingInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingLabel: {
      ...theme.typography.body,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    settingDescription: {
      ...theme.typography.caption,
    },
    languageOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.card,
    },
    languageOptionActive: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.secondary,
    },
    languageText: {
      ...theme.typography.body,
      fontWeight: '500',
    },
    languageTextActive: {
      color: theme.colors.secondary,
      fontWeight: '600',
    },
    checkmark: {
      ...theme.typography.subheading,
      color: theme.colors.secondary,
      fontWeight: '700',
    },
    dangerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.error,
      ...theme.shadows.card,
    },
    dangerButtonText: {
      ...theme.typography.body,
      color: theme.colors.error,
      fontWeight: '600',
    },
    countBadge: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      minWidth: 24,
      alignItems: 'center',
    },
    countText: {
      ...theme.typography.caption,
      color: theme.colors.text.inverse,
      fontWeight: '700',
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.card,
    },
    infoLabel: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
    },
    infoValue: {
      ...theme.typography.body,
      fontWeight: '600',
    },
    logoutButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.error,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.card,
      minHeight: 44,
    },
    logoutButtonText: {
      ...theme.typography.body,
      color: theme.colors.text.inverse,
      fontWeight: '600',
    },
    userInfo: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.card,
    },
    userEmail: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView 
      style={styles.container}
      accessibilityLabel="Settings screen"
      accessibilityRole="none"
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Enable dark theme
            </Text>
          </View>
          <Switch
            value={localDarkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.secondary,
            }}
            thumbColor={theme.colors.card}
            accessibilityLabel="Dark mode toggle"
            accessibilityHint={`Dark mode is currently ${localDarkMode ? 'enabled' : 'disabled'}. Double tap to ${localDarkMode ? 'disable' : 'enable'} dark mode`}
            accessibilityRole="switch"
            accessibilityState={{ checked: localDarkMode }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>{APP_VERSION}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>API</Text>
          <Text style={styles.infoValue}>JSONPlaceholder</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityLabel="Logout"
          accessibilityHint="Double tap to sign out of your account"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
