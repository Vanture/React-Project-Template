import ReactDOM from 'react-dom';
import App from './components/App';

import './sass/app.scss';

const container = document.createElement('div');
container.className = 'root';

document.body.appendChild(container);

ReactDOM.render(<App />, container);
