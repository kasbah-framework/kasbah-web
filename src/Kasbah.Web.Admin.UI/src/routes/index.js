import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CoreLayout from 'layouts/CoreLayout';

import HomeView from 'views/HomeView';
import ContentView from 'views/ContentView';
import AnalyticsView from 'views/AnalyticsView';
import UserView from 'views/UserView';
import MediaView from 'views/MediaView';
import LoginView from 'views/LoginView';

export default (
    <Route path='/' component={CoreLayout}>
        <IndexRoute component={HomeView} onEnter={this.checkAuth.bind(this)} />
        <Route path='/content' component={ContentView} onEnter={this.checkAuth.bind(this)} />
        <Route path='/analytics' component={AnalyticsView} onEnter={this.checkAuth.bind(this)} />
        <Route path='/users' component={UserView} onEnter={this.checkAuth.bind(this)} />
        <Route path='/media' component={MediaView} onEnter={this.checkAuth.bind(this)} />

        <Route path='/login' component={LoginView} />
    </Route>
);
