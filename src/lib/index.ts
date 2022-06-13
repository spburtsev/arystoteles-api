namespace Functional {
  export const compose = (...fns: AnyFn[]) => (...args: any[]) =>
    fns.reduceRight((res, fn) => [fn(...res)], args)[0];

  export const pipe = (...fns: AnyFn[]) => (x: any) =>
    fns.reduce((y, f) => f(y), x);
}
export default Functional;
