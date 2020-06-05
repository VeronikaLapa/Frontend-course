function debounce(originalFunction: Function, timeout: number): Function {
  let timeoutId: NodeJS.Timeout;

  return function(...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => originalFunction(...args), timeout);
  };
}
function throttle(originalFunction: Function, timeout: number): Function {
  let isCalled = false;
  let waitingTimeout: NodeJS.Timeout;

  return function(...args: any[]) {
    clearTimeout(waitingTimeout);
    if (!isCalled) {
      originalFunction(...args);
      isCalled = true;
      setTimeout(() => {
        isCalled = false;
      }, timeout);
    } else {
      waitingTimeout = setTimeout(() => originalFunction(...args), timeout);
    }
  };
}
export { throttle, debounce };
