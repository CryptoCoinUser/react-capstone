require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';

import App from './components/app';
import './index.css';

ReactDOM.render(
<Provider store={store}>
	<div className="index">
	   	<App />
  	</div>
 </Provider>,
  document.getElementById('root')
);
