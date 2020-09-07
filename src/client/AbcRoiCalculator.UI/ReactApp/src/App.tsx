import * as React from 'react';
import Layout from './components/Layout';
import { Route } from 'react-router';
import RoiCalculator  from './components/RoiCalculator'
import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={RoiCalculator} />
    </Layout>
);
