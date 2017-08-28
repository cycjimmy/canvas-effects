// global style
import './theme/main.scss';


import webInitialize from './webInitialize.afunc';

if (DEVELOPMENT) {
  console.log('Development Mode');
}
if (PRODUCTION) {
  console.log('Production Mode');
}

// contextMenu preventDefault
document.addEventListener('contextmenu', e => {
  window.event.returnValue = false;
  e.preventDefault();
  return false;
});

// web page init
document.addEventListener('DOMContentLoaded', () => {

  // web init
  webInitialize();
}, false);
