import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import * as styles from './index.scss';

const container = document.createElement('DIV');
container.className = styles.app;

document.body.appendChild(container);

ReactDOM.render(
  <App />,
  container
);
