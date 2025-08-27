import { Fragment } from 'react';
import { getComment, parseWeekOsmOpeningHours, type WeekDay, type WeekOpeingHours } from './opening-hours.presenter';

type TimeTableProps = {
  osmOpeningHours: string;
  daysOfWeek: Record<string, WeekDay>;
};

export const TimeTable = ({ osmOpeningHours, daysOfWeek }: TimeTableProps) => {
  const weekOpeningHours: WeekOpeingHours | undefined = parseWeekOsmOpeningHours(new Date())(osmOpeningHours);
  const comment: string | undefined = getComment(osmOpeningHours);

  return (
    weekOpeningHours != null && (
      <>
        <table className='my-2'>
          <tbody className='flex flex-col gap-2'>
            {Object.entries(daysOfWeek).map(([dayLabel, dayIndex]) => (
              <tr key={dayLabel} className='flex'>
                <td className='font-bold w-24'>{dayLabel}</td>
                {weekOpeningHours[dayIndex].length === 0 && (
                  <>
                    <td className='text-muted'>Fermé</td>
                    <td className='px-4'>/</td>
                    <td className='text-muted'>Fermé</td>
                  </>
                )}
                {weekOpeningHours[dayIndex].length === 1 && weekOpeningHours[dayIndex][0] != null && (
                  <>
                    {weekOpeningHours[dayIndex][0].startAM ? (
                      <td>
                        {weekOpeningHours[dayIndex][0].start.replace(':', 'h')} –{' '}
                        {weekOpeningHours[dayIndex][0].end.replace(':', 'h')}
                      </td>
                    ) : (
                      <td className='text-muted'>Fermé</td>
                    )}
                    <td className='px-4'>/</td>
                    {weekOpeningHours[dayIndex][0].startAM ? (
                      <td className='text-muted'>Fermé</td>
                    ) : (
                      <td>
                        {weekOpeningHours[dayIndex][0].start.replace(':', 'h')} –{' '}
                        {weekOpeningHours[dayIndex][0].end.replace(':', 'h')}
                      </td>
                    )}
                  </>
                )}
                {weekOpeningHours[dayIndex].length > 1 &&
                  weekOpeningHours[dayIndex].map((period, index) => (
                    <Fragment key={`${period.start}-${period.end}`}>
                      {index > 0 && <td className='px-4'>/</td>}
                      <td className='flex gap-1'>
                        {period.start.replace(':', 'h')} – {period.end.replace(':', 'h')}
                      </td>
                    </Fragment>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
        {comment && <p className='text-xs text-muted'>{comment}</p>}
      </>
    )
  );
};
