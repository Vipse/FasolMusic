import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'
import Button from '../Button'
import Icon from '../Icon'

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import InputNew from "../InputNew";
import SelectNew from "../SelectNew";
//import avatarDefault from "../../img/avatarDefault.png";
import SocialAuth from "../SocialAuth";

const FormItem = Form.Item;

class PersonalDataContact extends React.Component {
    constructor() {
        super();
        this.state = {
            avatar: ""
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.profile.avatar !== this.props.profile.avatar)
            this.setState({avatar: ""});
    }

    handleChangeAvatar = (e, isReset) => {
        e.preventDefault();
        if (isReset) {
            this.setState({avatar: "default"});
            this.props.onChangeAvatar("");
            e.target.files = [];
        } else {
            let file = e.target.files[0];
            if (file && file.type.indexOf("image/") !== -1) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    this.setState({avatar: reader.result});
                    this.props.onChangeAvatar(reader.result);
                });
                reader.readAsDataURL(file);
            }
        }
    };

    render() {
        const {getFieldDecorator, isStudent} = this.props;
        const {onChangeSocial, showChangePasswordModal, showSendSuggestionsModal} = this.props;
        const {name, phones, email, country, avatar, facebooklink, googlelink} = this.props.profile;
        const rootClass = cn('coach-data-block');

        return (
            <div className={rootClass}>
                <div className='coach-data-avatar'>
                    <ProfileAvatar
                        img={this.state.avatar ? this.state.avatar : avatar}
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
                            <InputNew width="100%" bubbleplaceholder="*ФИО"/>
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
                            <InputNew width="100%" bubbleplaceholder="*Телефоны"/>
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
                            <InputNew width="100%" bubbleplaceholder="*E-mail"/>
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
                                bubbleplaceholder="*Страна пребывания"
                                data={["Беларусь", "Россия"]}/>
                        )}
                    </FormItem>
                </div>

                <div className='coach-data-toggles'>
                    <SocialAuth
                        facebookLink={facebooklink}
                        googleLink={googlelink}
                        onChange={onChangeSocial}
                    />
                    <Button
                        className='coach-data-toggles-modalBtn'
                        onClick={showChangePasswordModal}
                        btnText='Изменить пароль'
                        size='default'
                        type='light-blue'
                    />
                    {!isStudent && <Button
                        className='coach-data-toggles-modalBtn'
                        onClick={showSendSuggestionsModal}
                        size='icon'
                        icon='bulb'
                        type='light-blue'
                    />}
                </div>
            </div>
        )
    }
}

PersonalDataContact.propTypes = {
    profile: PropTypes.object
};

PersonalDataContact.defaultProps = {
    profile: {}
};

export default PersonalDataContact
