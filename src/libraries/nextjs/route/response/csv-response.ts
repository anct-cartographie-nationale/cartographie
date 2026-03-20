type CsvResponseOptions = {
  filename: string;
  withDate?: boolean;
};

export const csvResponse = (content: string, { filename, withDate = true }: CsvResponseOptions): Response => {
  const dateSuffix = withDate ? `-${new Date().toISOString().split('T')[0]}` : '';
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}${dateSuffix}.csv"`
    }
  });
};
