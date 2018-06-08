import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as styles from './styles.scss';

export default class App extends React.Component {
  static propTypes = {
    dark: PropTypes.bool
  };

  static defaultProps = {
    dark: false
  };

  constructor(props) {
    super(props);

    this.state = {
      dark: props.dark
    };

    this.toggleLights = this.toggleLights.bind(this);
  }

  toggleLights() {
    this.setState(prevState => ({ dark: !prevState.dark }));
  }

  render() {
    const { dark } = this.state;
    const appClass = classNames(styles.container, { [styles.dark]: dark });

    return (
      <div className={appClass}>
        Hello world!
        <button onClick={this.toggleLights}>Toggle lights</button>
      </div>
    );
  }
}
