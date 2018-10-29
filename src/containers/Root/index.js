import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {Redirect} from 'react-router'


import LoginPage from '../LoginPage'
import App from '../App'
import CreateProfile from './../../components/CreateProfile/index';

class Root extends React.Component{

    render(){
        return (
        <Switch>

            <Route path="/login" component={LoginPage}/>
            <Route path="/registration" component={CreateProfile}/>
            <Route path="/patient-registration" component={LoginPage}/>

            {/*1 && <Redirect to='login'/>*/}
            <Route path="/app" component={App} />
            {/*REDIRECT TO APP NEED TO DELETE THEN*/}
            {/*<Route render={() => <Redirect to="/app"/>}/>*/}
            <Route exact path="/" render={() => <Redirect to="/app"/> }/>
        </Switch>)
    }
};

export default Root
