import { debounce, throttle } from './example';

function fn(i: number): void {
  console.log(i);
}
const throttlingFoo = throttle(fn, 1000);

throttlingFoo(1);
throttlingFoo(2);
throttlingFoo(3);
throttlingFoo(4);
throttlingFoo(5);

const debounceFoo = debounce(fn, 200);
debounceFoo(11);
debounceFoo(21);
debounceFoo(31);
debounceFoo(41);
debounceFoo(51);
