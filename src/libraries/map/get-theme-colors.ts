/**
 * Extrait les couleurs du thème à partir des variables CSS.
 * Utilisé pour le styling des couches MapLibre.
 */
export const getThemeColors = () => ({
  primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
  background: getComputedStyle(document.documentElement).getPropertyValue('--color-base-100').trim()
});
