declare const process: {
  env: Record<string, string | undefined>;
};

declare module '*.css' {
  const content: string;
  export default content;
}
