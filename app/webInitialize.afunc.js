/**
 *  web init
 */

// component
import DemoComponent from './demo/Demo.component';

export default () => {
  return Promise.all([
    // load main
    new DemoComponent().load(),
  ])
};
