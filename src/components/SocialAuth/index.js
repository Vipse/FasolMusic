import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'

import './style.css'
import '../../icon/style.css'
import {Form, message} from "antd";
import Spinner from "../Spinner";
import moment from "moment";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from 'react-google-login';
import Icon from "../Icon";

class SocialAuth extends React.Component {

    constructor() {
        super();
        this.state = {
            facebookAuth: {},
            googleAuth: {},
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            facebookAuth: nextProps.facebookAuth,
            googleAuth: nextProps.googleAuth
        })
    }

    onChange = (objValue) => {
        this.props.onChange(objValue);
    };

    facebookAuth = () => {
        const responseFacebook = response => {
            const {userID, name, email, picture} = response;
            this.onChange({facebookAuth: {link: userID, name, email, picture}});
        };

        const componentClicked = () => {
            //TODO: loadingCheck
        };

        return (<FacebookLogin
            appId="2093206104069628"
            autoLoad={false}
            fields={"name,email,picture"}
            onClick={componentClicked}
            callback={responseFacebook}
            size="small"
            textButton="Связать"
            language="ru_RU"
            cssClass="social-row-btn btn btn-size-small btn-type-light-blue"
        />);
    };

    googleAuth = () => {
        const responseGoogle = (response) => {
            if (!response.error) {
                const {googleId, givenName, familyName, email, imageUrl} = response.profileObj;
                this.onChange({googleAuth: {link: googleId, name: givenName + ' ' + familyName, email, picture: imageUrl}});
            }
        };

        const componentClicked = () => {
            //TODO: loadingCheck
        };

        return (<GoogleLogin
                clientId="511983507919-slo4jbeaoft55uc4r5vhfgirb4oiuq0h.apps.googleusercontent.com"
                render={renderProps => (
                    <Button className='social-row-btn'
                            btnText='Связать'
                            onClick={() => {
                                renderProps.onClick();
                                componentClicked()
                            }}
                            size='small'
                            type='light-blue'
                    />
                )}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
        />);
    };

    renderSocial = (name) => {
        return (<div key={name}>
            <div className={"social-row" + (this.state[name + "Auth"].link ? "-active " : " ") + name}>
                <Icon type={name} size={33} svg/>
                <span className="social-row-link">{this.state[name + "Auth"].link}</span>
                {this.state[name + "Auth"].link ?
                    <Button className='social-row-btn'
                            btnText='Отвязать'
                            onClick={(e) => {
                                e.preventDefault();
                                this.onChange({[name + "Auth"]: {link: "", name: "", email: "", picture: ""}})
                            }}
                            size='small'
                            type='light-blue'
                    />
                    : <div className="social-row-btn">
                        {this[name + "Auth"]()}
                    </div>
                }
            </div>
        </div>);
    };

    render() {
        const rootClass = cn('social');
        return (
            <div className={rootClass}>
                {this.renderSocial("facebook")}
                {this.renderSocial("google")}
            </div>
        )
    }
}

SocialAuth.propTypes = {
    facebookAuth: PropTypes.object,
    googleAuth: PropTypes.object,
    onChange: PropTypes.func
};

SocialAuth.defaultProps = {
    facebookAuth: "",
    googleAuth: "",
    onChange: () => {}
};

export default SocialAuth
