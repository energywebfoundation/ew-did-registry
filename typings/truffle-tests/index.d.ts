declare function contract(title: string, cb: () => Promise<any>): void;
declare namespace artifacts {
  function require(s: string): any;
}
