import { chat } from './api';

test('chat API exists', () => {
  expect(typeof chat).toBe('function');
});
