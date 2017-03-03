import 'react-native';
import React from 'react';

var sum = function(a, b) {
  return a + b;
}

test('adds 1 + 2 to get 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// import Index from '../index.android.js';

// // Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   const tree = renderer.create(
//     <Index />
//   );
// });
