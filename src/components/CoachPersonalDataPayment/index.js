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

class CoachPersonalDataPayment extends React.Component {
    constructor() {
        super();
        this.state = {
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

    render() {
        const {getFieldDecorator} = this.props;
        const {payments} = this.props.profileCoach;
        const rootClass = cn('coach-data-form');

        return (
            <div className='coach-data-block'>
                <div className='coach-data-payment'>
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
                                    initialValue: "123456",
                                    rules: [{
                                        required: true,
                                        message: 'Введите номер кошелька, пожалуйста'
                                    }],
                                })(
                                    <InputNew width="100%" bubbleplaceholder="Номер кошелька"/>
                                )}
                            </FormItem>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}

CoachPersonalDataPayment.propTypes = {
    profileCoach: PropTypes.object
};

CoachPersonalDataPayment.defaultProps = {
    profileCoach: {}
};

export default CoachPersonalDataPayment
