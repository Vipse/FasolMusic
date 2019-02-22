import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {Redirect} from 'react-router'


import LoginPage from '../LoginPage'
import App from '../App'

class Root extends React.Component{

    render(){
        console.log('window.location.search', window.location.search)
        return (
        window.location.search ?
            <Redirect to={`/app/${window.location.search.split("?path=")[1]}`}/>
        :
        
        <Switch>
            <Route path="/signin" component={LoginPage}/>
            <Route path="/registration" component={LoginPage}/>
            <Route path="/registration-trainer" component={LoginPage}/>
            <Route path="/trial-training" component={LoginPage}/>
            <Route path="/app" component={App} />
            <Route exact path="/" render={() => <Redirect to="/app"/> }/>
        </Switch>)
    }
};

export default Root
