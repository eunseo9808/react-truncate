import React from 'react';
import * as ReactDOM from 'react-dom';
import TruncateText from '../src/TruncateText';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TruncateText>Hello World</TruncateText>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
