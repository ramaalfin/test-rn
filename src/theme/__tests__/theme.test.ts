import { getTheme, lightColors, darkColors } from '../index';

describe('Theme System', () => {
    describe('getTheme', () => {
        it('should return light theme when isDarkMode is false', () => {
            const theme = getTheme(false);
            expect(theme.colors).toEqual(lightColors);
        });

        it('should return dark theme when isDarkMode is true', () => {
            const theme = getTheme(true);
            expect(theme.colors).toEqual(darkColors);
        });

        it('should include all theme properties', () => {
            const theme = getTheme(false);
            expect(theme).toHaveProperty('colors');
            expect(theme).toHaveProperty('spacing');
            expect(theme).toHaveProperty('typography');
            expect(theme).toHaveProperty('borderRadius');
            expect(theme).toHaveProperty('shadows');
        });
    });

    describe('Color Palettes', () => {
        it('should have matching structure between light and dark colors', () => {
            const lightKeys = Object.keys(lightColors).sort();
            const darkKeys = Object.keys(darkColors).sort();
            expect(lightKeys).toEqual(darkKeys);
        });

        it('should have different background colors for light and dark modes', () => {
            expect(lightColors.background).not.toEqual(darkColors.background);
        });

        it('should have different text colors for light and dark modes', () => {
            expect(lightColors.text.primary).not.toEqual(darkColors.text.primary);
        });
    });

    describe('Typography', () => {
        it('should use theme colors in typography', () => {
            const lightTheme = getTheme(false);
            const darkTheme = getTheme(true);

            expect(lightTheme.typography.heading.color).toEqual(lightColors.text.primary);
            expect(darkTheme.typography.heading.color).toEqual(darkColors.text.primary);
        });
    });
});
