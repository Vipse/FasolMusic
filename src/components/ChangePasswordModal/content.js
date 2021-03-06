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
        const {id} = this.props.profile;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loadingPass: true});

                this.props.onSubmit(id, values.newPassword)
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

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.handleSubmitPassword} className="ChangePasswordModal">
                <div className='password-column'>
                    <div className='password-column-input'>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('newPassword', {
                                rules: [{
                                    required: true,
                                    message: 'Введите новый пароль, пожалуйста'
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
