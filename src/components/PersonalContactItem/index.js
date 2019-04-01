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

const FormItem = Form.Item;

class PersonalContactItemForm extends React.Component{
    constructor() {
        super();
        this.state  = {
            avatar: ''
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

    handleSubmitPassword = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loadingPass:true});

                this.props.onSubmitPassword(values.oldPassField, values.newPassField)
                    .then((res) => {
                        this.setState({loadingPass: false});
                        if (res.data.code === 200) {
                            message.success("Изменения сохранены");
                            this.props.form.resetFields();
                        } else if(res.data.code===601){
                            message.error("Старый пароль введён неверно")
                        }
                        else{
                            message.error("Произошла ошибка, попробуйте ещё раз")
                        }
                    })
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
        const { fio, phone, email, oldPassword, newPassword, avatar} = this.props.profileCoach;
        const rootClass = cn('personal-contact');

        return (
            <Form className={rootClass} >
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


                <div className='patient-contacts-title'>изменить пароль</div>
                <div className='patient-contacts-block'>
                    <div className='patient-contacts-password'>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('oldPassField', {
                                rules: [{ required: this.state.passwordsRequired,
                                    message: 'Введите пароль, пожалуйста'
                                }],
                            })(
                                <InputNew type="password" width ="100%" bubbleplaceholder="Старый пароль" onChange={this.handleChange}/>
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('newPassField', {
                                rules: [{ required: this.state.passwordsRequired,
                                    message: 'Введите пароль, пожалуйста'
                                }],
                            })(
                                <InputNew type="password" width ="100%" bubbleplaceholder="Новый пароль" onChange={this.handleChange}/>
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('repeatPassField', {
                                rules: [{ required: this.state.passwordsRequired,
                                    message: 'Введите пароль, пожалуйста'
                                },
                                    {
                                        validator: this.compareToFirstPassword,
                                    }],
                            })(
                                <InputNew type="password" width ="100%" bubbleplaceholder="Повторите пароль" onChange={this.handleChange}/>
                            )}
                        </FormItem>


                    </div>
                </div>

                <Button
                    btnText='Сохранить изменения'
                    onClick={this.handleSubmitPassword}
                    size='default'
                    type='float'
                    style={{marginRight: "20px"}}
                />
                {this.state.loadingPass && <Spinner isInline={true} size="small" />}

            </Form>
        )
    }
}

const PersonalContactItem  = Form.create()(PersonalContactItemForm);

PersonalContactItem.propTypes = {
    profileCoach: PropTypes.object
};

PersonalContactItem.defaultProps = {
    profileCoach: {}
};

export default PersonalContactItem
