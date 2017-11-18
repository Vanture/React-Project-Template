import { Component } from 'react';

import * as styles from './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  render() {
    const { loaded } = this.state;

    return (
      <div className={styles.container}>
        Hello world!
        <p>Loaded: {loaded ? 'yes' : 'no'}</p>
      </div>
    );
  }

  componentDidMount() {
    this.setState({ loaded: true });
  }
}
