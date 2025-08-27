import OpeningHours from 'opening_hours';

type Digit = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

export type Time = `${0 | 1 | 2}${Digit}:${0 | 1 | 2 | 3 | 4 | 5}${Digit}`;

export enum WeekDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export type WeekOpeingHours = {
  [day in WeekDay]: { start: Time; end: Time; startAM: boolean }[];
};

const MINUTE_TO_MILLISECONDS: number = 60 * 1000;
const HOUR_TO_MILLISECONDS: number = 60 * MINUTE_TO_MILLISECONDS;
const DAY_TO_MILLISECONDS: number = 24 * HOUR_TO_MILLISECONDS;

export const dayOfTheWeek = (date: Date, weekDay: WeekDay): Date =>
  new Date(date.getTime() + ((weekDay === 0 ? 7 : weekDay) - date.getDay()) * DAY_TO_MILLISECONDS);

const timeToMilliseconds = (time: Time): number => {
  const [hours, minutes]: number[] = time.split(':').map(Number);
  return (hours ?? 0) * HOUR_TO_MILLISECONDS + (minutes ?? 0) * MINUTE_TO_MILLISECONDS;
};

const firstTimeOfTheDay = (date: Date): Date => {
  const dateWithoutTime = new Date(date);
  dateWithoutTime.setHours(0, 0, 0, 0);
  return dateWithoutTime;
};

const lastTimeOfTheDay = (date: Date): Date => {
  const dateWithoutTime = new Date(date);
  dateWithoutTime.setHours(23, 59, 59, 999);
  return dateWithoutTime;
};

export const dateTimeFor =
  (date: Date) =>
  (weekDay: WeekDay, time: Time): Date =>
    new Date(dayOfTheWeek(firstTimeOfTheDay(date), weekDay).getTime() + timeToMilliseconds(time));

const formatHour = (date: Date): Time =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}` as Time;

const appendTimeTableInterval = (
  timeTableOpeningHours: WeekOpeingHours,
  intervalStart: Date,
  intervalEnd: Date,
  weekDay: WeekDay
) => ({
  ...timeTableOpeningHours,
  [weekDay]: [
    ...timeTableOpeningHours[weekDay],
    {
      start: formatHour(intervalStart),
      end: formatHour(intervalEnd),
      startAM: intervalStart.getHours() < 12
    }
  ]
});

export const firstDayOfTheWeek = (date: Date): Date => dayOfTheWeek(date, WeekDay.Monday);

export const lastDayOfTheWeek = (date: Date): Date => dayOfTheWeek(date, WeekDay.Sunday);

const initialTimeTableOpeningHours: WeekOpeingHours = {
  [WeekDay.Monday]: [],
  [WeekDay.Tuesday]: [],
  [WeekDay.Wednesday]: [],
  [WeekDay.Thursday]: [],
  [WeekDay.Friday]: [],
  [WeekDay.Saturday]: [],
  [WeekDay.Sunday]: []
};

export const parseWeekOsmOpeningHours =
  (date: Date) =>
  (horairesOSM?: string): WeekOpeingHours | undefined => {
    try {
      return horairesOSM
        ? new OpeningHours(horairesOSM, null)
            .getOpenIntervals(firstTimeOfTheDay(firstDayOfTheWeek(date)), lastTimeOfTheDay(lastDayOfTheWeek(date)))
            .reduce(
              (
                timeTableOpeningHours: WeekOpeingHours,
                [intervalStart, intervalEnd]: [Date, Date, boolean, string | undefined]
              ): WeekOpeingHours =>
                appendTimeTableInterval(timeTableOpeningHours, intervalStart, intervalEnd, intervalStart.getDay() as WeekDay),
              initialTimeTableOpeningHours
            )
        : undefined;
    } catch {
      return;
    }
  };

type OpenState = {
  isOpen: true;
  time: Date | undefined;
};

type CloseState = {
  isOpen: false;
  day: number;
  time: Date | undefined;
};

export type OpeningState = OpenState | CloseState;

const openingHoursState = (openingHours: OpeningHours, date: Date): boolean => openingHours.getIterator(date).getState();

const nextOpeningDay = (openingHours: OpeningHours, date: Date) =>
  ((nextChange?: Date): number =>
    date.toDateString() === nextChange?.toDateString()
      ? date.getDay()
      : ((nextChange?.getDay() as WeekDay | undefined) ?? WeekDay.Sunday))(openingHours.getNextChange(date));

const closeState = (openingHours: OpeningHours, date: Date): CloseState => ({
  isOpen: false,
  day: nextOpeningDay(openingHours, date),
  time: openingHours.getNextChange(date)
});

const openState = (openingHours: OpeningHours, date: Date): OpenState => ({
  isOpen: true,
  time: openingHours.getNextChange(date)
});

export const openingState =
  (date: Date) =>
  (horairesOSM?: string): OpeningState | undefined => {
    if (!horairesOSM) return;

    try {
      const openingHours = new OpeningHours(horairesOSM);
      return openingHoursState(openingHours, date) ? openState(openingHours, date) : closeState(openingHours, date);
    } catch {
      return;
    }
  };

export const isOpenNow =
  (date: Date) =>
  (horairesOSM: string): boolean => {
    try {
      return new OpeningHours(horairesOSM).getState(date);
    } catch {
      return false;
    }
  };

export const isOpenOn =
  (date: Date) =>
  (horairesOSM: string, day: WeekDay, start: Time = '00:00', end: Time = '23:59'): boolean => {
    try {
      return (
        new OpeningHours(horairesOSM).getOpenIntervals(dateTimeFor(date)(day, start), dateTimeFor(date)(day, end)).length > 0
      );
    } catch {
      return false;
    }
  };

export const getComment = (horairesOSM: string): string | undefined => {
  try {
    return horairesOSM ? new OpeningHours(horairesOSM).getComment() : undefined;
  } catch {
    return;
  }
};
