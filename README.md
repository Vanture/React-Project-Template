# My React Project Template

[![Travis](https://img.shields.io/travis/hugmanrique/React-Project-Template.svg)](https://travis-ci.org/hugmanrique/React-Project-Template)
[![License](https://img.shields.io/github/license/hugmanrique/React-Project-Template.svg)](LICENSE)

This is my personal project template for React apps, which I often use as a base for further configuration. The stack includes:

- [Webpack](https://webpack.js.org/) 4 to create highly efficient (and fast) bundles.
- [Babel](https://babeljs.io/) 7 to transpile [ES2015+](https://github.com/tc39/proposals/blob/master/finished-proposals.md) code to ES5.
- [SASS](http://sass-lang.com/) to add power and elegance to CSS modules.
- [Jest](https://facebook.github.io/jest/) to fastly test all your code.
- Of course, [React](https://reactjs.org/).

The template comes with a few common scripts I use, which I run with `npm run`.

- `build` to create a production optimized and minified build
- `watch` to run the watch script
- `dev` to start [`webpack-serve`](https://github.com/webpack-contrib/webpack-serve)
- `test` to run all the tests in the `tests` directory with [Jest](https://facebook.github.io/jest/).

## Babel

The transpiled ES5 code adds the necessary polyfills needed to be compatible with these [browserslist](https://github.com/browserslist/browserslist) queries:

| **Query**         | **Explanation**                                    |
| ----------------- | -------------------------------------------------- |
| `>0.25%`          | Support browsers with more than 0.25% global usage |
| `not ie 11`       | We don't support Internet Explorer <= 11           |
| `not op_mini all` | We don't support any Opera Mini browser version    |

This template also supports object destructuring and static class props.

## SASS

The styles file structure is highly opinionated so feel free to delete it entirely. Here's an explanation of each dir and file:

- `foundation/` includes all the config values.
- `base/` contains functions that depends on the foundation config values.
- `fonts/` stores `.woff2`, `.woff` and `.ttf` files used by the `generate-font-face` mixin.
- `app.scss` is the CSS entrypoint. Any rule set on this file will be exported as a global.

Most of the time, the foundation files should be loaded before the base functions, but if you need to access a function you can load the base before the config in the `foundation.scss` file.

## Testing

TODO

## License

[MIT](LICENSE) &copy; [Hugo Manrique](https://hugmanrique.me)