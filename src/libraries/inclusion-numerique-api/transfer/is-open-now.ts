import OpeningHours from 'opening_hours';

export const isOpenNow =
  (date: Date) =>
  (horairesOSM: string): boolean => {
    try {
      return new OpeningHours(horairesOSM).getState(date);
    } catch {
      return false;
    }
  };
