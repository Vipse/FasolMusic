import React from 'react';
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { Form } from 'antd';
import { NavLink } from 'react-router-dom'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Input from '../Input'


import './style.css'
import '../../icon/style.css'

const FormItem = Form.Item;

class RegistrationTrainerForm extends React.Component{

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    };

    render(){
        const {errorCode, urlForget, urlRegistrationStudent} = this.props;

        const { getFieldDecorator } = this.props.form;

        let error = [];

        switch(errorCode){
            case 400:
                error = [{
                    validateStatus: 'error',
                    help: "Неверное имя или пароль",
                },{
                    validateStatus: 'error',
                }];
                break;
            case 500:
                error = [{
                    validateStatus: 'error',
                    help: "Такого пользователя не существует",
                },{
                    validateStatus: 'error',
                }];
                break;
            case 200:
            default:
                error = [];
        }

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <div className="login-title">Регистрация</div>
                <div className="login-notification">* Поля, обязательные для заполнения</div>
                <FormItem {...error[0]}>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Введите ваш e-mail, пожалуйста' }],
                    })(
                        <Input placeholder='* E-mail'
                               className='login-form-item'/>
                    )}
                </FormItem>
                <FormItem {...error[1]}>
                    {getFieldDecorator('name', {
                        rules: [{ required: false, message: 'Введите ваше ФИО, пожалуйста' }],
                    })(
                        <Input placeholder='* ФИО'
                               className='login-form-item'/>
                    )}
                </FormItem>
                <div className="login-form-control">
                    <Button htmlType="submit"
                            btnText='Подтвердить'
                            size='large'
                            type='yellow-black'/>
                    
                </div>
            </Form>
        )
    }
}

const RegistrationTrainer = Form.create()(RegistrationTrainerForm);

RegistrationTrainer.propTypes = {
    errorCode: PropTypes.oneOf([0,200, 400, 500]),
    urlForget: PropTypes.string,
    urlRegistration: PropTypes.string,
    onSubmit: PropTypes.func,
};

RegistrationTrainer.defaultProps = {
    errorCode: 0,
    urlForget: '',
    urlRegistration: '',
    onSubmit: () => {},
};

export default RegistrationTrainer