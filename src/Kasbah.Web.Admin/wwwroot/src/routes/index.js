import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CoreLayout from 'layouts/CoreLayout';

import HomeView from 'views/HomeView';
import ContentView from 'views/ContentView';
import AnalyticsView from 'views/AnalyticsView';
import UserView from 'views/UserView';
import MediaView from 'views/MediaView';

export default (
    <Route path='/' component={CoreLayout}>
        <IndexRoute component={HomeView} />
        <Route path='/content' component={ContentView} />
        <Route path='/analytics' component={AnalyticsView} />
        <Route path='/users' component={UserView} />
        <Route path='/media' component={MediaView} />
    </Route>
);
