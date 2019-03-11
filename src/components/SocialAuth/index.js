import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'

import './style.css'
import '../../icon/style.css'

import {message} from "antd";
import Spinner from "../Spinner";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from 'react-google-login';
import Icon from "../Icon";

class SocialAuth extends React.Component {

    constructor() {
        super();
        this.state = {
            facebookLoading: false,
            googleLoading: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.facebookLink !== this.props.facebookLink)
            this.setState({facebookLoading: false});
        if (prevProps.googleLink !== this.props.googleLink)
            this.setState({googleLoading: false});
    }

    facebookAuth = () => {
        const { isLogin } = this.props;

        const responseFacebook = response => {
            const {userID, name, email, picture} = response;
            if (!userID) {
                this.setState({facebookLoading: false});
                message.error('Ошибка Facebook');
            }
            else this.props.onChange('facebook', {link: userID, name, email, avatar: picture.data.url})
                .then((res) => {
                    if (res && !res.data.error) {
                        if (!isLogin) {
                            message.success("Аккаунт Facebook успешно привязан");
                            this.setState({facebookLoading: false});
                        }
                    }
                    else {
                        this.setState({facebookLoading: false});
                        if (res && res.data.error && res.data.error.code === 400)
                            message.error("Этот аккаунт Facebook уже привязан к другому профилю");
                        else if (isLogin && res && res.data.error && res.data.error.code === 404)
                            message.error("Этот аккаунт не был привязан к какому-либо профилю");
                        else message.error("Произошла ошибка, попробуйте ещё раз");
                    }
                })
                .catch((err) => console.log(err));
        };

        const componentClicked = () => {
            this.setState({facebookLoading: true})
        };

        return (<FacebookLogin
            appId="2093206104069628"
            autoLoad={false}
            fields={"name,email,picture"}
            onClick={componentClicked}
            callback={responseFacebook}
            size="small"
            textButton={isLogin ? "Войти" : "Связать"}
            language="ru_RU"
            cssClass="social-row-btn btn btn-size-small btn-type-light-blue"
        />);
    };

    googleAuth = () => {
        const { isLogin } = this.props;

        const responseGoogle = (response) => {
            if (!response.error) {
                const {googleId, givenName, familyName, email, imageUrl} = response.profileObj;
                this.props.onChange('google', {link: googleId, name: givenName + ' ' + familyName, email, avatar: imageUrl})
                    .then((res) => {
                        if (res && !res.data.error) {
                            if (!isLogin) {
                                message.success("Аккаунт Google успешно привязан");
                                this.setState({googleLoading: false});
                            }
                        }
                        else {
                            this.setState({googleLoading: false});
                            if (res && res.data.error && res.data.error.code === 400)
                                message.error("Этот аккаунт Google уже привязан к другому профилю");
                            else if (isLogin && res && res.data.error && res.data.error.code === 404)
                                message.error("Этот аккаунт не был привязан к какому-либо профилю");
                            else message.error("Произошла ошибка, попробуйте ещё раз");
                        }
                    })
                    .catch((err) => console.log(err));
            }
            else {
                this.setState({googleLoading: false});
                message.error('Ошибка Google');
                console.log(response.error);
            }
        };

        const componentClicked = () => {
            this.setState({googleLoading: true})
        };

        return (<GoogleLogin
                clientId="511983507919-slo4jbeaoft55uc4r5vhfgirb4oiuq0h.apps.googleusercontent.com"
                render={renderProps => (
                    <Button className='social-row-btn'
                            btnText={isLogin ? "Войти" : "Связать"}
                            onClick={(e) => {
                                e.preventDefault();
                                renderProps.onClick();
                                componentClicked();
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
        const { isLogin } = this.props;

        return (<div key={name}>
            <div className={"social-row" + ((this.props[name + "Link"] || isLogin) ? "-active " : " ") + name}>
                <Icon type={name} size={33} svg/>
                {this.state[name + "Loading"] ? <Spinner/> : this.props[name + "Link"] ?
                    <Button className='social-row-btn'
                            btnText='Отвязать'
                            htmlType='button'
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({[name + 'Loading']: true});
                                this.props.onChange(name, {link: "", name: "", email: "", avatar: ""})
                                    .then((res) => {
                                        if (res && !res.data.error)
                                            message.success("Аккаунт " + name.charAt(0).toUpperCase() + name.slice(1) + " успешно отвязан");
                                        else {
                                            this.setState({[name + 'Loading']: false});
                                            message.error("Произошла ошибка при сохранении данных, попробуйте ещё раз");
                                        }
                                    })
                                    .catch((err) => console.log(err));
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
    onChange: PropTypes.func
};

SocialAuth.defaultProps = {
    onChange: () => {}
};

export default SocialAuth
