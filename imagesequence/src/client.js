import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import MainPage from './components/main-page';

const app = (
    <Provider store={store}>
        <Router>
            <Route path="/" component={MainPage}>
            </Route>
        </Router>
    </Provider>
);

ReactDOM.render(
    app,
    document.body
);

//document.write('welcome to my app');

//console.log('app loaded');
