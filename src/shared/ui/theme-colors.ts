export const getThemeColors = () => ({
  primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
  background: getComputedStyle(document.documentElement).getPropertyValue('--color-base-100').trim()
});
