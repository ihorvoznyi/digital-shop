type FuncType = (...args: any[]) => void;

export const useDebounce = (func: FuncType, delay?: number) => {
  let timeout: any;

  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, delay || 500);
  }
}