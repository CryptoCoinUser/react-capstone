require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';

//import App from './components/app';
import BasicExample from './components/basic-example';
import './index.css';

ReactDOM.render(
<Provider store={store}>
   	<BasicExample />
 </Provider>,
  document.getElementById('root')
);
