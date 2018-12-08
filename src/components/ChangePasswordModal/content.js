import React from 'react';
import {Form, message} from 'antd';
import Button from '../Button'
import Spinner from "../Spinner";
import InputNew from "../InputNew";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        loadingPass: false
    };

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
                            this.props.onCancel();
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

        return (
            <Form onSubmit={this.handleSubmitPassword} className="ChangePasswordModal">
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
                        size='default'
                        type='light-blue'
                        disable={this.state.loadingPass}
                        style={{marginRight: "20px"}}
                    />
                    {this.state.loadingPass && <Spinner isInline={true} size="small"/>}
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
