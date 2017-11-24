import React from 'react';
import { Route, IndexRoute, DefaultRoute } from 'react-router';
import Root from './component/Root';
import Home from './component/Home';

export default (
  <Route path="/" component={Root}>
    <IndexRoute component={Home} />
    <Route path="*" component={Home} />
  </Route>
);
