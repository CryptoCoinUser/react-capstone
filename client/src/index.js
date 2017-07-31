require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/app';
import './index.css';

ReactDOM.render(
  <div className="index">
	  <h1> client / src / components / index.js</h1>
	  <App />
  </div>,
  document.getElementById('root')
);
