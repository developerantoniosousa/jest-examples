import React from 'react';
import renderer from 'react-test-renderer';
import Video from 'react-native-video';

jest.mock('react-native-video', () => 'Video');

test('renders correctly', () => {
  const tree = renderer.create(<Video />);
  expect(tree).toMatchSnapshot();
});
