import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import CoachPersonalContactItem from '../CoachPersonalContactItem'
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

class CoachPersonalChangePasswordForm extends React.Component{

    constructor() {
        super();
        this.state  = {};
    }

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

    render() {
        const {getFieldDecorator} = this.props.form;
        const rootClass = cn('personal-password');
        return (
            <Form className={rootClass}>
                <Card title="Сменить пароль">
                    <div className='password-column'>
                        <div className='password-column-input'>
                            <FormItem className="input-form-item">
                                {getFieldDecorator('oldPassField', {
                                    rules: [{
                                        required: true,
                                        message: 'Введите старый пароль, пожалуйста'
                                    }],
                                })(
                                    <InputNew type="password" bubbleplaceholder="Старый пароль"/>
                                )}
                            </FormItem>
                            <FormItem className="input-form-item">
                                {getFieldDecorator('newPassField', {
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
                            onClick={this.handleSubmitPassword}
                            size='default'
                            type='float'
                            style={{marginRight: "20px"}}
                        />
                        {this.state.loadingPass && <Spinner isInline={true} size="small"/>}
                    </div>
                </Card>
            </Form>
        )
    }
}

const CoachPersonalChangePassword  = Form.create()(CoachPersonalChangePasswordForm);

CoachPersonalChangePassword.propTypes = {
    profileDoctor: PropTypes.object,
    onSubmit: PropTypes.func
};

CoachPersonalChangePassword.defaultProps = {
    profileDoctor: {},
    onSubmit: () => {}
};

export default CoachPersonalChangePassword
