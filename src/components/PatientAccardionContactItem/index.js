import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import { Form, message } from 'antd'

import ProfileAvatar from '../ProfileAvatar'
import Button from '../Button'
import Icon from '../Icon'

import './style.css'
import '../../icon/style.css'
import InputNew from "../InputNew";
import Spinner from "../Spinner";
const FormItem = Form.Item;

class PatientAccardionContactItemForm extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            passwordsRequired: false,
            avatar: {}
        }
    }

    handleSubmitInfo = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loadingInfo:true});
                if(this.state.avatar) {
                    values.avatar = {...this.state.avatar}
                }
                this.props.onSubmit(values)
                    .then((res) => {
                        this.setState({loadingInfo: false});
                        if (res.data.code === 200) {
                            message.success("Изменения сохранены")
                        } else {
                            message.error("Произошла ошибка, попробуйте ещё раз")
                        }
                    })
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
                            message.success("Изменения сохранены")
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
        const { contactFio, contactPhone, contactEmail, contactAddress, contactAvatar} = this.props;
        const rootClass = cn('patient-contacts');
        
        return (
            <Form className={rootClass} >
                <div className='patient-contacts-title'>контактные данные</div>
                <div className='patient-contacts-block'>
                    <div className='patient-contacts-avatar'>
                        <ProfileAvatar
                            img={this.state.avatar.thumbUrl ? this.state.avatar.thumbUrl : contactAvatar}
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
                            <Button
                                btnText=''
                                size='icon'
                                type='icon'
                                icon='close'
                                iconSize={13}
                                onClick={(event) => this.handleChangeAvatar(event, true)}
                            />
                        </div>

                    </div>
                    <div className='patient-contacts-info'>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('fioField', {
                                initialValue: contactFio,
                                rules: [{ required: true,
                                    message: 'Введите ФИО, пожалуйста'
                                }],
                            })(
                                <InputNew width ="100%" bubbleplaceholder="ФИО"/>
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('phoneField', {
                                initialValue: contactPhone,
                                rules: [{ required: true,
                                    message: 'Введите телефон, пожалуйста'
                                }],
                            })(
                                <InputNew width ="100%" bubbleplaceholder="Телефон"/>
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('emailField', {
                                initialValue: contactEmail,
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
                        <FormItem className="input-form-item">
                            {getFieldDecorator('addressField', {
                                initialValue: contactAddress,
                                rules: [{ required: true,
                                    message: 'Введите адрес, пожалуйста'
                                }],
                            })(
                                <InputNew width ="100%" bubbleplaceholder="Адрес"/>
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

PatientAccardionContactItemForm.propTypes = {
    contactFio: PropTypes.string,
    contactPhone: PropTypes.string,
    contactEmail: PropTypes.string,
    contactAdress: PropTypes.string,
    contactAvatar: PropTypes.string
};

PatientAccardionContactItemForm.defaultProps = {
    contactFio: '',
    contactPhone: '',
    contactEmail: '',
    contactAdress: '',
    contactAvatar: ''
};

const PatientAccardionContactItem  = Form.create()(PatientAccardionContactItemForm);

export default PatientAccardionContactItem