import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {Redirect} from 'react-router'

import LoginPage from '../LoginPage'
import App from '../App'

class Root extends React.Component{

    render(){

        if(!sessionStorage.getItem('landing')){
            let params = window.location.search.replace('?','').split('&').reduce( function(p,e){
                let a = e.split('=');
                p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },{});
            if(params['landing']) sessionStorage.setItem('landing', params['landing'])
        }
       

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
