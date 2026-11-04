const METERS_IN_KILOMETER = 1000;
const MINIMAL_PRECISION_KM = 0.01;

export const distanceLabel = (distanceKm: string): string => {
  const distance = Number(distanceKm);

  if (distance < MINIMAL_PRECISION_KM) return 'à moins de 10 m';
  if (distance < 1) return `à ${Math.round(distance * METERS_IN_KILOMETER)} m`;
  return `à ${distance.toFixed(1).replace('.', ',')} km`;
};
