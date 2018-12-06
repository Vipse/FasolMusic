import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import {Form, message} from "antd";

const FormItem = Form.Item;

class PersonalChangePasswordForm extends React.Component{

    constructor() {
        super();
        this.state  = {
            loadingPass: false
        };
    }

    handleSubmitPassword = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loadingPass:true});

                const dataObj = {
                    id: this.props.profile.id,
                    password: values.newPassword
                };

                this.props.onSubmit(dataObj)
                    .then((res) => {
                        this.setState({loadingPass: false});
                        if (res && !res.data.error) {
                            message.success("Пароль изменен");
                        } else
                            message.error("Произошла ошибка, попробуйте ещё раз");
                        this.props.form.resetFields();
                    })
            } else {
                console.log(err);
            }
        });
    };

    compareToOldPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value === form.getFieldValue('oldPassword')) {
            callback('Новый пароль совпадает со старым');
        } else {
            callback();
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const rootClass = cn('personal-password');
        return (
            <Form className={rootClass}>
                <Card title="Сменить пароль">
                    <div className='password-column'>
                        <div className='password-column-input'>
                            <FormItem className="input-form-item">
                                {getFieldDecorator('oldPassword', {
                                    rules: [{
                                        required: true,
                                        message: 'Введите старый пароль, пожалуйста'
                                    }],
                                })(
                                    <InputNew type="password" bubbleplaceholder="Старый пароль"/>
                                )}
                            </FormItem>
                            <FormItem className="input-form-item">
                                {getFieldDecorator('newPassword', {
                                    rules: [{
                                        required: true,
                                        message: 'Введите новый пароль, пожалуйста'
                                    },
                                        {
                                            validator: this.compareToOldPassword,
                                        }],
                                })(
                                    <InputNew type="password" bubbleplaceholder="Новый пароль"/>
                                )}
                            </FormItem>
                        </div>

                        <Button
                            btnText='Сохранить изменения'
                            onClick={this.handleSubmitPassword}
                            size='default'
                            type='light-blue'
                            disable={this.state.loadingPass}
                            style={{marginRight: "20px"}}
                        />
                        {this.state.loadingPass && <Spinner isInline={true} size="small"/>}
                    </div>
                </Card>
            </Form>
        )
    }
}

const PersonalChangePassword  = Form.create()(PersonalChangePasswordForm);

PersonalChangePassword.propTypes = {
    profile: PropTypes.object,
    onSubmit: PropTypes.func
};

PersonalChangePassword.defaultProps = {
    profile: {},
    onSubmit: () => {}
};

export default PersonalChangePassword
