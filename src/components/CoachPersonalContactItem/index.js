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
import PersonalEducation from "../PersonalEducation";
import ProfileAvatar from "../ProfileAvatar";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import SelectNew from "../SelectNew";
import VK, {Auth} from "react-vk";
import vkIcon from "../../img/vkIcon.png";
import facebookIcon from "../../img/facebookIcon.png";
import twitterIcon from "../../img/twitterIcon.png";
import gplusIcon from "../../img/gplusIcon.png";

const FormItem = Form.Item;

const mappedIconsToLinks = {
    vk: vkIcon,
    facebook: facebookIcon,
    twitter: twitterIcon,
    gplus: gplusIcon
};

class CoachPersonalContactItemForm extends React.Component{
    constructor() {
        super();
        this.state  = {
            avatar: '',
            vkAuthorized: {show: false, link: ''},
            facebookAuthorized: {show: false, link: ''},
            twitterAuthorized: {show: false, link: ''},
            gplusAuthorized: {show: false, link: ''}
        }
    }

    handleSubmitInfo = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // this.setState({loadingInfo:true});
                if(this.state.avatar) {
                    values.avatar = {...this.state.avatar}
                }
                this.props.onSubmit(values)
                    // .then((res) => {
                    //     this.setState({loadingInfo: false});
                    //     if (res.data.code === 200) {
                    //         message.success("Изменения сохранены")
                    //     } else {
                    //         message.error("Произошла ошибка, попробуйте ещё раз")
                    //     }
                    // })
            } else {
                console.log(err);
            }
        });
    };

    handleChange = (e) => {
        e.preventDefault();
        if(e.target.value && !this.state.passwordsRequired) {
            this.setState({passwordsRequired: true}, () => {
                this.props.form.validateFields(['oldPassField', 'newPassField', 'repeatPassField'], { force: true })});
        } else if(!e.target.value){
            this.setState({passwordsRequired: false}, () => {
                this.props.form.validateFields(['oldPassField', 'newPassField', 'repeatPassField'], { force: true })});
        }
    };

    handleChangeAvatar = (event, isReset) => {
        if (isReset === true) {
            this.props.onDeleteAvatar();
            this.setState({
                avatar: ""
            });
            event.target.files = [];
        }
        else {
            let file = event.target.files[0];
            if (file && file.type.indexOf("image/") !== -1) {
                const reader = new FileReader();
                reader.addEventListener('load', () => this.setState({
                    avatar: ({thumbUrl: reader.result, name: file.name})
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
                              size='default'
                              type='float'
                              style={{marginRight: "20px"}}
                    />
                }
            </div>
            <div className="authPopup">
                {this.state[name + "Authorized"].show && this[name + "Authorization"]()}
            </div>
        </div>);
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassField')) {
            callback('Пароли не совпадают');
        } else {
            callback();
        }
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const { fio, phone, email, country, avatar} = this.props.profileDoctor;
        const rootClass = cn('personal-contact');

        return (
            <Form className={rootClass}>
                <div className='patient-contacts-title'>контактные данные</div>
                <div className='patient-contacts-block'>
                    <div className='patient-contacts-avatar'>
                        <ProfileAvatar
                            img={this.state.avatar.thumbUrl ? this.state.avatar.thumbUrl : avatar}
                            owner='patient'
                            size="large"
                            online={true}
                        />
                        <div className='patient-contacts-controls'>
                            <div className="file-upload">
                                <label className="file-upload-label">
                                    <Icon type='retweet' size={16}/>
                                </label>
                                <input className="file-upload-input" type="file" name="photo-upload"
                                       onChange={this.handleChangeAvatar}/>
                            </div>
                        </div>

                    </div>
                    <div className='patient-contacts-info'>
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
                        {this.renderSocial("vk")}
                        {this.renderSocial("facebook")}
                        {this.renderSocial("twitter")}
                        {this.renderSocial("gplus")}
                    </div>
                </div>

                <Button
                    className="patient-contacts-saveBtn"
                    onClick={this.handleSubmitInfo}
                    btnText='Сохранить изменения'
                    size='default'
                    disable={this.state.loadingInfo}
                    type='float'
                    style={{marginRight: "20px"}}
                />

                {this.state.loadingInfo && <Spinner isInline={true} size="small" />}

            </Form>
        )
    }
}

const CoachPersonalContactItem  = Form.create()(CoachPersonalContactItemForm);

CoachPersonalContactItem.propTypes = {
    profileDoctor: PropTypes.object
};

CoachPersonalContactItem.defaultProps = {
    profileDoctor: {}
};

export default CoachPersonalContactItem
