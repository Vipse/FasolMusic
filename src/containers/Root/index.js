import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {Redirect} from 'react-router'

import LoginPage from '../LoginPage'
import App from '../App'

class Root extends React.Component{

    render(){

    //     let m = window.location.search.split("?path=")[1]
    //    if(m) 
    //         window.location.href = "http://localhost:3000/app/coach?path=140032"

        if(!sessionStorage.getItem('landing')){
            let params = window.location.search.replace('?','').split('&').reduce( function(p,e){
                let a = e.split('=');
                p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },{});
            if(params['landing']) sessionStorage.setItem('landing', params['landing'])
        }
       
        // window.addEventListener("beforeunload", function (event) {
        //     // Cancel the event as stated by the standard.
        //     event.preventDefault();
        //     let href = window.location.href;
        //     href.replace('coach', 'coach/?path=')
        //     window.location.reload(href)
        //     console.log("replace")
        //   });
 
        //   console.log('window :', window);

        return (       
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
