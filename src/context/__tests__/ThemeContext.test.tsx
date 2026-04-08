import { getTheme, lightColors, darkColors } from '../../theme';

describe('ThemeContext Integration', () => {
  describe('Theme switching', () => {
    it('should return light theme colors when dark mode is false', () => {
      const theme = getTheme(false);
      expect(theme.colors).toEqual(lightColors);
      expect(theme.colors.background).toBe('#FFFFFF');
      expect(theme.colors.text.primary).toBe('#1A1A2E');
    });

    it('should return dark theme colors when dark mode is true', () => {
      const theme = getTheme(true);
      expect(theme.colors).toEqual(darkColors);
      expect(theme.colors.background).toBe('#0F0F1E');
      expect(theme.colors.text.primary).toBe('#FFFFFF');
    });

    it('should have consistent theme structure regardless of mode', () => {
      const lightTheme = getTheme(false);
      const darkTheme = getTheme(true);

      expect(Object.keys(lightTheme)).toEqual(Object.keys(darkTheme));
      expect(lightTheme).toHaveProperty('colors');
      expect(lightTheme).toHaveProperty('spacing');
      expect(lightTheme).toHaveProperty('typography');
      expect(lightTheme).toHaveProperty('borderRadius');
      expect(lightTheme).toHaveProperty('shadows');
    });

    it('should update typography colors based on theme mode', () => {
      const lightTheme = getTheme(false);
      const darkTheme = getTheme(true);

      expect(lightTheme.typography.heading.color).toBe(lightColors.text.primary);
      expect(darkTheme.typography.heading.color).toBe(darkColors.text.primary);
      expect(lightTheme.typography.heading.color).not.toBe(darkTheme.typography.heading.color);
    });
  });

  describe('Theme persistence', () => {
    it('should maintain spacing values across themes', () => {
      const lightTheme = getTheme(false);
      const darkTheme = getTheme(true);

      expect(lightTheme.spacing).toEqual(darkTheme.spacing);
    });

    it('should maintain border radius values across themes', () => {
      const lightTheme = getTheme(false);
      const darkTheme = getTheme(true);

      expect(lightTheme.borderRadius).toEqual(darkTheme.borderRadius);
    });

    it('should maintain shadow values across themes', () => {
      const lightTheme = getTheme(false);
      const darkTheme = getTheme(true);

      expect(lightTheme.shadows).toEqual(darkTheme.shadows);
    });
  });
});
