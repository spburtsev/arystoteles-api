const compose = (...fns: AnyFn[]) => (...args: any[]) =>
  fns.reduceRight((res, fn) => [fn(...res)], args)[0];
export default compose;
