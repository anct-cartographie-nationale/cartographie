'use client';

import { useState } from 'react';
import { LoadingButton, type LoadingButtonProps } from '../primitives/loading-button';

type ExportButtonProps = {
  href: string;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (response: Response) => void;
} & Omit<LoadingButtonProps, 'isLoading'>;

const MIME_EXTENSION_MAP: Record<string, string> = {
  'text/csv': 'csv',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/json': 'json',
  'application/xml': 'xml',
  'text/xml': 'xml',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
  'application/x-tar': 'tar',
  'application/gzip': 'gz',
  'text/plain': 'txt',
  'text/html': 'html',
  'text/markdown': 'md',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/svg+xml': 'svg'
};

const defaultFileName = (res: Response) => {
  const contentType = res.headers.get('Content-Type') ?? '';
  const mime = Object.keys(MIME_EXTENSION_MAP).find((type) => contentType.includes(type));
  const extension = mime ? MIME_EXTENSION_MAP[mime] : 'dat';
  return `export.${extension}`;
};

const triggerDownload = async (res: Response) => {
  const url = window.URL.createObjectURL(await res.blob());
  const disposition = res.headers.get('Content-Disposition');

  const anchorElement = document.createElement('a');
  anchorElement.href = url;
  anchorElement.download = disposition?.match(/filename="(.+?)"/)?.[1] ?? defaultFileName(res);
  anchorElement.click();
  window.URL.revokeObjectURL(url);
};

export const ExportButton = ({ href, onExportStart, onExportComplete, onExportError, ...props }: ExportButtonProps) => {
  const [isLoading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    onExportStart?.();

    try {
      const res = await fetch(href);

      if (!res.ok) {
        onExportError?.(res);
        return;
      }

      await triggerDownload(res);
    } finally {
      setLoading(false);
      onExportComplete?.();
    }
  };

  return <LoadingButton onClick={handleExport} isLoading={isLoading} {...props} />;
};
