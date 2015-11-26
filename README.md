# html-boilerplate
Mobile friendly HTML5 framework for building web apps.

> This project is still unstable.

## Current features

* HTML boilerplate building _(state: stable)_
* CSS postprocessing with [PostCSS](https://github.com/postcss) _(state: stable)_
  * Autoprefixing
  * Minifying
  * Includes Normalize.css at the top of your CSS.
* Pack your Bower components into your bundle.js and main.css. _(state: experimental)_
  * The framework will copy your components' images into the dist  folder (`dist/images/<component-name>/`) and it will fix the urls inside their stylesheets.

## Coming features

* CSS framework based on [ArinSass](https://github.com/dmarchena/arin-sass)
* Configuration wizard

## Usage

1. Clone the git repo
  ```
  git clone https://github.com/dmarchena/html-boilerplate.git
  ```
2. Install the dependencies
  ```
  npm install
  ```

3. Build the sample project with gulp and take a look at the `dist` folder
  ```
  gulp
  ```
4. Or just build and launch a local server with
  ```
  gulp serve
  ```
  and check the resulting boilerplate at
  ```
  http://localhost:8080/
  ```

More documentation soon...

## License

This code is available under the [MIT license](https://github.com/dmarchena/html-boilerplate/blob/master/LICENSE)
