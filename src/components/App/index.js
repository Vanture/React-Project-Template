import { Component } from 'react';

import * as styles from './styles.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  render() {
    const { loaded } = this.state;

    return <div className={styles.container}>Hello World!</div>;
  }
}
