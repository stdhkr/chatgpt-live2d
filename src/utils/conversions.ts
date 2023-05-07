export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): (...args: Parameters<F>) => ReturnType<F> | void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): ReturnType<F> | void {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
