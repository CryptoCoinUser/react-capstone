import React from 'react';
//import ReactDOM from 'react-dom';
import {BasicExample} from '../src/components/basic-example';
//import {Navigation} from '../src/components/navigation';




/*
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BasicExample />, div);
});
*/

/*
https://facebook.github.io/react/docs/shallow-renderer.html
*/
import ShallowRenderer from 'react-test-renderer/shallow';

const renderer = new ShallowRenderer();
renderer.render(<BasicExample />);
const result = renderer.getRenderOutput();
expect(result.type).toBe('div');
//expect(result.props.children).length.toEqual(4);



