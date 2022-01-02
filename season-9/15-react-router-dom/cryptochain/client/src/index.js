import React from 'react';
import {render} from 'react-dom';
import App from './components/app';
import ConductTransaction from './components/conductTransaction';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import './style.css';

render(<BrowserRouter>
  <Switch>
    <Route path='/transact' component={ConductTransaction} />
    <Route path='/' component={App} />
  </Switch>
</BrowserRouter>, document.getElementById('root'));