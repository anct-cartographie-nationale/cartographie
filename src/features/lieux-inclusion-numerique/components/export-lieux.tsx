'use client';

import toast from 'react-hot-toast';
import { RiCloseCircleLine, RiDownloadFill } from 'react-icons/ri';
import { ExportButton } from '@/libraries/ui/blocks/export-button';

type ExportLieuxProps = {
  href: string;
  lieuxCount: number;
};

export const ExportLieux = ({ href, lieuxCount }: ExportLieuxProps) => (
  <ExportButton
    color='btn-primary'
    kind='btn-outline'
    className='border-base-200'
    href={href}
    onExportStart={() =>
      toast.success(
        `Export de ${lieuxCount} lieux en cours…${lieuxCount > 2000 ? ' Cela peut prendre un peu de temps.' : ''}`,
        { icon: <RiDownloadFill size='1.25rem' />, duration: 6000 }
      )
    }
    onExportError={async (response: Response) => {
      const message = await response.text();
      const parts = message.split('. ');

      return toast.error(
        <div>
          {parts.map((line, i) => (
            <span key={line}>
              {line}
              {i < parts.length - 1 && (
                <>
                  .<br />
                </>
              )}
            </span>
          ))}
        </div>,
        {
          icon: <RiCloseCircleLine size='1.25rem' />,
          duration: 10000
        }
      );
    }}
  >
    Exporter
    <RiDownloadFill />
  </ExportButton>
);
