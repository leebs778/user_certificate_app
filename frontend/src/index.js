import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ListSelect from './Components/ListSelect';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <div id="AppContainer">
    <ListSelect />
  </div>,
  document.getElementById('root')
);

registerServiceWorker();
