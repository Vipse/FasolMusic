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
import SocialAuth from "../SocialAuth";
import {getNamesFromObjArr} from "../../helpers/getSelectorsCustomData";

const FormItem = Form.Item;

class PersonalDataContact extends React.Component {

    handleChangeAvatar = (e, isReset) => {
        e.preventDefault();
        if (isReset) {
            this.props.onChangeAvatar({name: "default"});
            e.target.files = [];
        } else {
            let file = e.target.files[0];
            if (file && file.type.indexOf("image/") !== -1)
                this.props.onChangeAvatar(file)
        }
    };

    render() {
        const {getFieldDecorator} = this.props;
        const {countriesList, onChangeSocial, showChangePasswordModal, showSendSuggestionsModal, avatarLink} = this.props;
        const {name, phones, email, country, facebooklink, googlelink, id} = this.props.profile;
        const rootClass = cn('coach-data-block');

        return (
            <div className={rootClass}>
                <div className='coach-data-avatar'>
                    <ProfileAvatar
                        img={avatarLink}
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
                            initialValue: getNamesFromObjArr(country),
                            rules: [{
                                required: true,
                                message: 'Введите страну пребывания, пожалуйста'
                            }]
                        })(
                            <SelectNew
                                width="100%"
                                bubbleplaceholder="*Страна пребывания"
                                data={countriesList}/>
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
                    <Button
                        className='coach-data-toggles-modalBtn'
                        onClick={showSendSuggestionsModal}
                        size='icon'
                        icon='bulb'
                        type='light-blue'
                    />
                    <div className='coach-data-id'>id профиля: {id}</div>
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
