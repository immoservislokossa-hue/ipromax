declare module 'minimatch' {
  export = minimatch;
  function minimatch(path: string, pattern: string, options?: any): boolean;
}
