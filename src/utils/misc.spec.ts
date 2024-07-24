import { delay } from './misc';

describe('Testing utilities file', () => {
  test('delay function should return an instance of a Promise', () => {
    expect(delay(100)).toBeInstanceOf(Promise);
  });
});
