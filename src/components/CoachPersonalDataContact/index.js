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
import VK, {Auth} from "react-vk";
import vkIcon from "../../img/vkIcon.png";
import facebookIcon from "../../img/facebookIcon.png";
import twitterIcon from "../../img/twitterIcon.png";
import gplusIcon from "../../img/gplusIcon.png";
import avatarDefault from "../../img/avatarDefault.png";

const FormItem = Form.Item;

const mappedIconsToLinks = {
    vk: vkIcon,
    facebook: facebookIcon,
    twitter: twitterIcon,
    gplus: gplusIcon
};

class CoachPersonalDataContactForm extends React.Component{
    constructor() {
        super();
        this.state  = {
            avatar: {},
            vkAuthorized: {show: false, link: ''},
            facebookAuthorized: {show: false, link: ''},
            twitterAuthorized: {show: false, link: ''},
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
        }
        else {
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

    vkAuthorization = () => {
        return (<VK apiId={6695055}>
            <Auth options={{
                onAuth: user => {
                    this.setState({
                        vkAuthorized: {show: false, link: "vk.com/id" + user.uid}
                    });
                },
            }}/>
        </VK>);
    };

    facebookAuthorization = () => {
        return null;
    };

    twitterAuthorization = () => {
        return null;
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

    render(){
        const { getFieldDecorator } = this.props.form;
        const { fio, phone, email, country} = this.props.profileCoach;
        const rootClass = cn('coach-data-form');

        return (
            <Form className={rootClass}>
                <div className='coach-data-title'>Контактные данные</div>
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
                            {getFieldDecorator('fio', {
                                initialValue: fio,
                                rules: [{ required: true,
                                    message: 'Введите ФИО, пожалуйста'
                                }],
                            })(
                                <InputNew width ="100%" bubbleplaceholder="ФИО"/>
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('phone', {
                                initialValue: phone,
                                rules: [{ required: true,
                                    message: 'Введите телефон, пожалуйста'
                                }],
                            })(
                                <InputNew width ="100%" bubbleplaceholder="Телефон"/>
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
                                <InputNew width ="100%" bubbleplaceholder="E-mail"/>
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
                                    width ="100%"
                                    bubbleplaceholder="Страна пребывания"
                                    data={["Беларусь", "Россия"]}/>
                            )}
                        </FormItem>
                    </div>

                    <div className="coach-data-social">
                        {this.renderSocial("vk")}
                        {this.renderSocial("facebook")}
                        {this.renderSocial("twitter")}
                        {this.renderSocial("gplus")}
                    </div>
                </div>

            </Form>
        )
    }
}

const CoachPersonalDataContact  = Form.create()(CoachPersonalDataContactForm);

CoachPersonalDataContact.propTypes = {
    profileCoach: PropTypes.object
};

CoachPersonalDataContact.defaultProps = {
    profileCoach: {}
};

export default CoachPersonalDataContact
