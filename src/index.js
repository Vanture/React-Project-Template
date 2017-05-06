import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import './index.scss';

const container = document.createElement('DIV');
container.id = 'root';

document.body.appendChild(container);

ReactDOM.render(
  <App />,
  container
);
