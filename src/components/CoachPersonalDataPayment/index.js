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
import ProfileAvatar from "../ProfileAvatar";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import SelectNew from "../SelectNew";
import TextArea from "../TextArea";
import DatePickerNew from "../DatePickerNew";
import cardIcon from "../../img/card.png"
import yandexMoneyIcon from "../../img/yandexMoney.png"
import InputWithTT from "../InputWithTT";

const FormItem = Form.Item;

class CoachPersonalDataPaymentForm extends React.Component{
    constructor() {
        super();
        this.state = {
            bankCard: {
                linked: true
            },
            yandexMoney: {
                linked: false
            }
        }
    }

    handleLinkStatus = (e, method) => {
        e.preventDefault();
        this.setState({
            [method]: {
                linked: !this.state[method].linked
            }
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const { payments } = this.props.profileCoach;
        const rootClass = cn('coach-data-form');

        return (
            <Form className={rootClass}>
                <div className='coach-data-title'>Платежные данные</div>
                <div className='coach-data-block'>
                    <div className='coach-data-payment'>
                        <div className="payment-method">
                            <div className="payment-method-view">
                                <img src={cardIcon} className="payment-method-icon"/>
                                <span className="payment-method-name">Карта</span>
                            </div>
                            <Button className="payment-method-linkBtn"
                                btnText={this.state.bankCard.linked ? 'Отвязать' : 'Привязать'}
                                onClick={(e) => this.handleLinkStatus(e, "bankCard")}
                                size='small'
                                type={this.state.bankCard.linked ? 'dark-blue' : 'float'}
                            />
                            {this.state.bankCard.linked &&
                            <div className="payment-method-fields">
                                <FormItem className="input-form-item">
                                    {getFieldDecorator('number', {
                                        initialValue: "1234 5678 1234 5678",
                                        rules: [{ required: true,
                                            message: 'Введите номер карты, пожалуйста'
                                        }],
                                    })(
                                        <InputNew width ="100%" bubbleplaceholder="Номер карты"/>
                                    )}
                                </FormItem>
                                <FormItem className="input-form-item">
                                    {getFieldDecorator('dateExpire', {
                                        initialValue: "",
                                        rules: [{ required: true,
                                            message: 'Введите срок действия, пожалуйста'
                                        }],
                                    })(
                                        <DatePickerNew width ="100%"
                                                       bubbleplaceholder="Срок действия"
                                        />
                                    )}
                                </FormItem>
                                <FormItem className="input-form-item">
                                    {getFieldDecorator('ownerName', {
                                        initialValue: "",
                                        rules: [{ required: true,
                                            message: 'Введите имя держателя карты, пожалуйста'
                                        }],
                                    })(
                                        <InputWithTT
                                            width ="100%"
                                            bubbleplaceholder="Имя держателя карты"
                                            tooltip="Имя держателя карты Tooltip"
                                        />
                                    )}
                                </FormItem>
                                <FormItem className="input-form-item">
                                    {getFieldDecorator('CVC', {
                                        initialValue: "",
                                        rules: [{ required: true,
                                            message: 'Введите CVC-код, пожалуйста'
                                        }],
                                    })(
                                        <InputWithTT
                                            width ="100%"
                                            bubbleplaceholder="CVC"
                                            tooltip="CVC Tooltip"
                                        />
                                    )}
                                </FormItem>
                            </div>}
                        </div>
                        <div className="payment-method">
                            <div className="payment-method-view">
                                <img src={yandexMoneyIcon} className="payment-method-icon"/>
                                <span className="payment-method-name">Яндекс.Деньги</span>
                            </div>
                            <Button className="payment-method-linkBtn"
                                btnText={this.state.yandexMoney.linked ? 'Отвязать' : 'Привязать'}
                                    onClick={(e) => this.handleLinkStatus(e, "yandexMoney")}
                                size='small'
                                type={this.state.yandexMoney.linked ? 'dark-blue' : 'float'}
                            />
                            {this.state.yandexMoney.linked &&
                            <div className="payment-method-fields">
                                <FormItem className="input-form-item">
                                    {getFieldDecorator('number', {
                                        initialValue: "1234 5678 1234 5678",
                                        rules: [{ required: true,
                                            message: 'Введите номер карты, пожалуйста'
                                        }],
                                    })(
                                        <InputNew width ="100%" bubbleplaceholder="Номер карты"/>
                                    )}
                                </FormItem>
                                <FormItem className="input-form-item">
                                    {getFieldDecorator('dateExpire', {
                                        initialValue: "",
                                        rules: [{ required: true,
                                            message: 'Введите срок действия, пожалуйста'
                                        }],
                                    })(
                                        <DatePickerNew width ="100%"
                                                       bubbleplaceholder="Срок действия"
                                        />
                                    )}
                                </FormItem>
                                <FormItem className="input-form-item">
                                    {getFieldDecorator('ownerName', {
                                        initialValue: "",
                                        rules: [{ required: true,
                                            message: 'Введите имя держателя карты, пожалуйста'
                                        }],
                                    })(
                                        <InputWithTT
                                            width ="100%"
                                            bubbleplaceholder="Имя держателя карты"
                                            tooltip="Имя держателя карты Tooltip"
                                        />
                                    )}
                                </FormItem>
                                <FormItem className="input-form-item">
                                    {getFieldDecorator('CVC', {
                                        initialValue: "",
                                        rules: [{ required: true,
                                            message: 'Введите CVC-код, пожалуйста'
                                        }],
                                    })(
                                        <InputWithTT
                                            width ="100%"
                                            bubbleplaceholder="CVC"
                                            tooltip="CVC Tooltip"
                                        />
                                    )}
                                </FormItem>
                            </div>}
                        </div>

                    </div>
                </div>
            </Form>
        )
    }
}

const CoachPersonalDataPayment  = Form.create()(CoachPersonalDataPaymentForm);

CoachPersonalDataPayment.propTypes = {
    profileCoach: PropTypes.object
};

CoachPersonalDataPayment.defaultProps = {
    profileCoach: {}
};

export default CoachPersonalDataPayment
