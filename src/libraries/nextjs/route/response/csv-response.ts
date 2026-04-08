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

export const csvStreamResponse = (lines: Iterable<string>, { filename, withDate = true }: CsvResponseOptions): Response => {
  const dateSuffix = withDate ? `-${new Date().toISOString().split('T')[0]}` : '';
  const encoder = new TextEncoder();
  const iterator = lines[Symbol.iterator]();

  const stream = new ReadableStream({
    pull(controller) {
      const { value, done } = iterator.next();
      if (done) controller.close();
      else controller.enqueue(encoder.encode(value));
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}${dateSuffix}.csv"`,
      'Transfer-Encoding': 'chunked'
    }
  });
};
