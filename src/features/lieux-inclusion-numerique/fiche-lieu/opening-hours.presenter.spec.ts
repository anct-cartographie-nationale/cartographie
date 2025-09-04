import { beforeEach, describe, expect, it } from 'vitest';
import {
  dateTimeFor,
  dayOfTheWeek,
  firstDayOfTheWeek,
  getComment,
  isOpenNow,
  isOpenOn,
  lastDayOfTheWeek,
  type OpeningState,
  openingState,
  parseWeekOsmOpeningHours,
  type Time,
  WeekDay
} from './opening-hours.presenter';

describe('horaires presenter', (): void => {
  beforeEach(() => {
    process.env.TZ = 'UTC';
  });

  it('should get time table opening hours from osm opening hours, open every working day', (): void => {
    const openingHours: string = 'Mo-Fr 09:00-12:00,14:00-18:30';
    const date: Date = new Date('2022-07-22T09:00:00.000Z');

    const timeTableOpeningHours = parseWeekOsmOpeningHours(date)(openingHours);

    expect(timeTableOpeningHours).toStrictEqual({
      [WeekDay.Monday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Tuesday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Wednesday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Thursday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Friday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Saturday]: [],
      [WeekDay.Sunday]: []
    });
  });

  it('should get time table opening hours from osm opening hours, open every day', (): void => {
    const openingHours: string = 'Mo-Su 09:00-12:00,14:00-18:30';
    const date: Date = new Date('2022-07-22T09:00:00.000Z');

    const timeTableOpeningHours = parseWeekOsmOpeningHours(date)(openingHours);

    expect(timeTableOpeningHours).toStrictEqual({
      [WeekDay.Monday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Tuesday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Wednesday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Thursday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Friday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Saturday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ],
      [WeekDay.Sunday]: [
        { start: '09:00', end: '12:00', startAM: true },
        { start: '14:00', end: '18:30', startAM: false }
      ]
    });
  });

  it('should not get time table opening hours from osm opening hours when osm opening hours is not formatted properly', (): void => {
    const openingHours: string = 'Mo-AM 09:00-12:00,14:00-18:30';
    const date: Date = new Date('2022-07-22T09:00:00.000Z');

    const timeTableOpeningHours = parseWeekOsmOpeningHours(date)(openingHours);

    expect(timeTableOpeningHours).toStrictEqual(undefined);
  });

  it('should get horaires for odd week', (): void => {
    const openingHours: string = 'week 1-53/2 Mo 09:30-12:30,13:30-15:30; PH off';
    const date: Date = new Date('2022-07-22T09:00:00.000Z');

    const timeTableOpeningHours = parseWeekOsmOpeningHours(date)(openingHours);

    expect(timeTableOpeningHours).toStrictEqual({
      [WeekDay.Monday]: [
        { start: '09:30', end: '12:30', startAM: true },
        { start: '13:30', end: '15:30', startAM: false }
      ],
      [WeekDay.Tuesday]: [],
      [WeekDay.Wednesday]: [],
      [WeekDay.Thursday]: [],
      [WeekDay.Friday]: [],
      [WeekDay.Saturday]: [],
      [WeekDay.Sunday]: []
    });
  });

  it('should get horaires full closed if we are in even week', (): void => {
    const openingHours: string = 'week 1-53/2 Mo 09:30-12:30,13:30-15:30; PH off';
    const date: Date = new Date('2022-07-29T09:00:00.000Z');

    const timeTableOpeningHours = parseWeekOsmOpeningHours(date)(openingHours);

    expect(timeTableOpeningHours).toStrictEqual({
      [WeekDay.Monday]: [],
      [WeekDay.Tuesday]: [],
      [WeekDay.Wednesday]: [],
      [WeekDay.Thursday]: [],
      [WeekDay.Friday]: [],
      [WeekDay.Saturday]: [],
      [WeekDay.Sunday]: []
    });
  });

  it('should get open state', (): void => {
    const openingHours: string = 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00';
    const date: Date = new Date('2022-07-22T09:00:00.000Z');

    const status: OpeningState | undefined = openingState(date)(openingHours);

    expect(status).toStrictEqual({
      isOpen: true,
      time: new Date('2022-07-22T12:00:00.000Z')
    });
  });

  it('should get closed state, open today', (): void => {
    const openingHours: string = 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00';
    const date: Date = new Date('2022-07-22T06:00:00.000Z');

    const status: OpeningState | undefined = openingState(date)(openingHours);

    expect(status).toStrictEqual({
      day: 5,
      isOpen: false,
      time: new Date('2022-07-22T09:00:00.000Z')
    });
  });

  it('should get closed state, open monday', (): void => {
    const openingHours: string = 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00';
    const date: Date = new Date('2022-07-24T01:00:00.000Z');

    const status: OpeningState | undefined = openingState(date)(openingHours);

    expect(status).toStrictEqual({
      isOpen: false,
      day: 1,
      time: new Date('2022-07-25T09:00:00.000Z')
    });
  });

  it('should get undefined state one opening hours parse error', (): void => {
    const openingHours: string = 'Mo-AM 09:00-12:00,14:00-18:30; Sa 08:30-12:00';
    const date: Date = new Date('2022-07-22T11:30:00.000Z');

    const status: OpeningState | undefined = openingState(date)(openingHours);

    expect(status).toBeUndefined();
  });

  it('should get is open state for date and time', (): void => {
    const isOpenResult: boolean = isOpenNow(new Date('2022-07-22T09:00:00.000Z'))(
      'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00'
    );

    expect(isOpenResult).toStrictEqual(true);
  });

  it('should get first day of the week', (): void => {
    const date: Date = new Date('2023-03-03T17:02:08.686Z');

    const mondayDate: Date = firstDayOfTheWeek(date);

    expect(mondayDate).toStrictEqual(new Date('2023-02-27T17:02:08.686Z'));
  });

  it('should get last day of the week', (): void => {
    const date: Date = new Date('2023-03-03T17:02:08.686Z');

    const mondayDate: Date = lastDayOfTheWeek(date);

    expect(mondayDate).toStrictEqual(new Date('2023-03-05T17:02:08.686Z'));
  });

  it('should get specified day of the week', (): void => {
    const date: Date = new Date('2023-03-03T17:02:08.686Z');

    const mondayDate: Date = dayOfTheWeek(date, WeekDay.Wednesday);

    expect(mondayDate).toStrictEqual(new Date('2023-03-01T17:02:08.686Z'));
  });

  it('should be open on wednesday between 18:00 and 18:30', (): void => {
    const date: Date = new Date('2023-02-27T14:45:18.276Z');
    const horairesOSM: string = 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00';
    const startTime: Time = '18:00';
    const endTime: Time = '18:30';

    const isOpenResult: boolean = isOpenOn(date)(horairesOSM, WeekDay.Wednesday, startTime, endTime);

    expect(isOpenResult).toBe(true);
  });

  it('should not be open on wednesday between 12:30 and 13:30', (): void => {
    const date: Date = new Date('2023-03-07T17:02:08.686Z');
    const horairesOSM: string = 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00';
    const startTime: Time = '12:30';
    const endTime: Time = '13:30';

    const isOpenResult: boolean = isOpenOn(date)(horairesOSM, WeekDay.Wednesday, startTime, endTime);

    expect(isOpenResult).toBe(false);
  });

  it('should not be open on sunday', (): void => {
    const date: Date = new Date('2023-03-07T17:02:08.686Z');
    const horairesOSM: string = 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00';

    const isOpenResult: boolean = isOpenOn(date)(horairesOSM, WeekDay.Sunday);

    expect(isOpenResult).toBe(false);
  });

  it('should be open on tuesday', (): void => {
    const date: Date = new Date('2023-03-07T17:02:08.686Z');
    const horairesOSM: string = 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00';

    const isOpenResult: boolean = isOpenOn(date)(horairesOSM, WeekDay.Tuesday);

    expect(isOpenResult).toBe(true);
  });

  it('should get date time for specified day at 12:30', (): void => {
    const date: Date = new Date('2023-03-07T17:02:08.686Z');
    const time: Time = '12:30';

    const dateTime: Date = dateTimeFor(date)(WeekDay.Wednesday, time);

    expect(dateTime.getTime()).toBe(1678278600000 + date.getTimezoneOffset() * 60 * 1000);
  });

  it('should not get any opening hours comment', () => {
    const openingHours: string = 'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00';

    const comment: string | undefined = getComment(openingHours);

    expect(comment).toBeUndefined();
  });

  it('should get opening hours comment', () => {
    const openingHours: string =
      'Mo-Fr 09:00-12:00,14:00-18:30; Sa 08:30-12:00; "Opening hours are available under reservation only"';

    const comment: string | undefined = getComment(openingHours);

    expect(comment).toStrictEqual('Opening hours are available under reservation only');
  });
});
