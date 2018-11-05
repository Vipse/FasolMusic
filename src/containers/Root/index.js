import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {Redirect} from 'react-router'


import LoginPage from '../LoginPage'
import App from '../App'

class Root extends React.Component{

    render(){
        return (
        <Switch>
            <Route path="/login" component={LoginPage}/>
            <Route path="/registration" component={LoginPage}/>
            <Route path="/patient-registration" component={LoginPage}/>
            <Route path="/app" component={App} />
            <Route exact path="/" render={() => <Redirect to="/app"/> }/>
        </Switch>)
    }
};

export default Root
