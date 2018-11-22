import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'
import Button from '../Button'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'


import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import SelectNew from "../SelectNew";
import facebookIcon from "../../img/facebookIcon.png";
import gplusIcon from "../../img/gplusIcon.png";
import avatarDefault from "../../img/avatarDefault.png";

import FacebookLogin from 'react-facebook-login';

const FormItem = Form.Item;

const mappedIconsToLinks = {
    facebook: facebookIcon,
    gplus: gplusIcon
};

class PersonalDataContact extends React.Component {
    constructor() {
        super();
        this.state = {
            avatar: {},
            facebookAuthorized: {show: false, link: ''},
            gplusAuthorized: {show: false, link: ''}
        }
    }

    handleChangeAvatar = (e, isReset) => {
        e.preventDefault();
        if (isReset === true) {
            this.setState({
                avatar: {}
            });
            e.target.files = [];
        } else {
            let file = e.target.files[0];
            if (file && file.type.indexOf("image/") !== -1) {
                const reader = new FileReader();
                reader.addEventListener('load', () => this.setState({
                    avatar: {thumbUrl: reader.result, name: file.name}
                }));
                reader.readAsDataURL(file);
            }
        }
    };

    responseFacebook = response => {
        console.log(response);

        this.setState({
            facebookAuthorized: {show: false, link: response.name}
        });
    };

    facebookAuthorization = () => {
        return (<FacebookLogin
            appId="2093206104069628"
            autoLoad={true}
            fields="name"
            onClick={this.componentClicked}
            callback={this.responseFacebook}
        />);
    };

    gplusAuthorization = () => {
        return null;
    };

    renderSocial = (name) => {
        return (<div key={name}>
            <div className={"social-row " + name}>
                <img src={mappedIconsToLinks[name]} className="social-row-icon"/>
                <span className="social-row-link">{this.state[name + "Authorized"].link}</span>
                {this.state[name + "Authorized"].link || this.state[name + "Authorized"].show ?
                    <Button className="social-row-btn-close"
                            icon='close'
                            size='small'
                            type='link'
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({[name + "Authorized"]: {show: false, link: ""}})
                            }}
                    />
                    : <Button className="social-row-btn-link"
                              btnText='Связать'
                              onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({[name + "Authorized"]: {show: true, link: ""}})
                              }}
                              size='small'
                              type='float'
                    />
                }
            </div>
            <div className="authPopup">
                {this.state[name + "Authorized"].show && this[name + "Authorization"]()}
            </div>
        </div>);
    };

    render() {
        const {getFieldDecorator} = this.props;
        const {name, phones, email, country} = this.props.profile;
        const rootClass = cn('coach-data-form');

        return (
            <div className='coach-data-block'>
                <div className='coach-data-avatar'>
                    <ProfileAvatar
                        img={this.state.avatar.thumbUrl ? this.state.avatar.thumbUrl : avatarDefault}
                        owner='coach'
                        size="large"
                        online={true}
                    />
                    <div className='coach-data-avatar-controls'>
                        <div className="file-upload">
                            <label className="file-upload-label">
                                <Icon type='retweet' size={16}/>
                            </label>
                            <input className="file-upload-input" type="file" name="photo-upload"
                                   onChange={this.handleChangeAvatar}/>
                        </div>
                        <Button
                            btnText=''
                            size='icon'
                            type='icon'
                            icon='close'
                            iconSize={13}
                            onClick={(e) => this.handleChangeAvatar(e, true)}
                        />
                    </div>
                </div>

                <div className='coach-data-info'>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('name', {
                            initialValue: name,
                            rules: [{
                                required: true,
                                message: 'Введите ФИО, пожалуйста'
                            }],
                        })(
                            <InputNew width="100%" bubbleplaceholder="ФИО"/>
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('phones', {
                            initialValue: phones,
                            rules: [{
                                required: true,
                                message: 'Введите телефоны, пожалуйста'
                            }],
                        })(
                            <InputNew width="100%" bubbleplaceholder="Телефон"/>
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('email', {
                            initialValue: email,
                            rules:
                                [{
                                    required: true,
                                    message: 'Введите email, пожалуйста'
                                },
                                    {
                                        type: "email",
                                        message: 'Неправильный формат'
                                    }],
                        })(
                            <InputNew width="100%" bubbleplaceholder="E-mail"/>
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('country', {
                            initialValue: country,
                            rules: [{
                                required: true,
                                message: 'Введите страну пребывания, пожалуйста'
                            }]
                        })(
                            <SelectNew
                                width="100%"
                                bubbleplaceholder="Страна пребывания"
                                data={["Беларусь", "Россия"]}/>
                        )}
                    </FormItem>
                </div>

                <div className="coach-data-social">
                    {this.renderSocial("facebook")}
                    {this.renderSocial("gplus")}
                </div>
            </div>
        )
    }
}

PersonalDataContact.propTypes = {
    profileCoach: PropTypes.object
};

PersonalDataContact.defaultProps = {
    profileCoach: {}
};

export default PersonalDataContact
