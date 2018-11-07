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
import TextArea from "../TextArea";
import WarningModal from "../WarningModal";
import ScrollArea from "react-scrollbar";
import inviteFriendsPic from "../../img/inviteFriendsPic.png"
import cardIcon from "../../img/card.png"
import yandexMoneyIcon from "../../img/yandexMoney.png"
import DatePickerNew from "../DatePickerNew";
import InputWithTT from "../InputWithTT";
import Content from "../NewVisitByPatientModal/content";
import Modal from "../Modal";
import PaymentEditModal from "../PaymentEditModal";
import NewVisitByPatientModal from "../NewVisitByPatientModal";

class CoachPayment extends React.Component{

    constructor() {
        super();
        this.state = {
            bankCard: {
                linked: true
            },
            yandexMoney: {
                linked: false
            },
            modalVisible: false,
            refLink: ""
        };
    }

    handleLinkStatus = (e, method) => {
        e.preventDefault();
        this.setState({
            [method]: {
                linked: !this.state[method].linked
            }
        });
    };

    renderInput = (type) => {
      return (
          <div className="payment-method-field">
              <InputNew className="payment-method-field-input" bubbleplaceholder="Номер карты"/>
              <div className="payment-method-field-btnPlate">
                  <Button className="payment-method-field-btnPlate-remove"
                          icon="close"
                          onClick={(e) => this.handleLinkStatus(e, type)}
                          size='small'
                          type='link'
                  />
                  <Button className="payment-method-field-btnPlate-edit"
                          icon="setting_edit"
                          onClick={() => this.setState({modalVisible: true})}
                          size='small'
                          type='link'
                  />
              </div>
          </div>);
    };

    copyLink = (e) => {
        const textField = document.createElement('textarea');
        if (this.state.refLink) {
            textField.innerText = this.state.refLink;
            document.body.appendChild(textField);
            textField.select();
            document.execCommand('copy');
            textField.remove();
        }
    };

    render() {
        const payment = this.props.paymentData;
        return (
            <div className="payment-coach">
                <Card className="payment-coach-record" title="Акты выполненных работ">
                    <ScrollArea
                        speed={1}
                        className="payment-coach-record-overlay"
                        contentClassName="content"
                        horizontal={false}
                    >
                        <div className="file file-active"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Заключение.doc</p></div>
                        <div className="file file-active"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Прикрепленный файл с длинным названием.doc</p></div>
                        <div className="file file-active"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Данные 525462.pdf</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Заключение.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Прикрепленный файл с длинным названием.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Данные 525462.pdf</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Заключение.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Прикрепленный файл с длинным названием.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Данные 525462.pdf</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Заключение.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Прикрепленный файл с длинным названием.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Данные 525462.pdf</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Заключение.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Прикрепленный файл с длинным названием.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Данные 525462.pdf</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Заключение.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Прикрепленный файл с длинным названием.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Данные 525462.pdf</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Заключение.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Прикрепленный файл с длинным названием.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Данные 525462.pdf</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Заключение.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Прикрепленный файл с длинным названием.doc</p></div>
                        <div className="file"><Icon className="file-icon" svg type="document" size={16}/><p className="file-name">Данные 525462.pdf</p></div>
                    </ScrollArea>
                </Card>
                <Card className="payment-coach-paymentData" title="Данные для получения оплаты">
                    <p className="info">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                        eligendi harum hic neque porro recusandae
                    </p>
                    <div className='paymentPlate'>
                        <div className="payment-method">
                            <div className="payment-method-view">
                                <img src={cardIcon} className="payment-method-icon"/>
                                <span className="payment-method-name">Карта</span>
                            </div>
                            {this.state.bankCard.linked ? this.renderInput("bankCard")
                                : <Button className="payment-method-linkBtn"
                                    btnText='Привязать'
                                    onClick={(e) => this.handleLinkStatus(e, "bankCard")}
                                    size='small'
                                    type='dark-blue'
                            />}
                        </div>
                        <div className="payment-method">
                            <div className="payment-method-view">
                                <img src={yandexMoneyIcon} className="payment-method-icon"/>
                                <span className="payment-method-name">Яндекс.Деньги</span>
                            </div>
                            {this.state.yandexMoney.linked ? this.renderInput("yandexMoney")
                                : <Button className="payment-method-linkBtn"
                                    btnText='Привязать'
                                    onClick={(e) => this.handleLinkStatus(e, "yandexMoney")}
                                    size='small'
                                    type='dark-blue'
                            />}
                        </div>
                    </div>
                </Card>
                <Card className="payment-coach-referLink" title="Реферальная ссылка">
                    <div className="payment-coach-referLink-column">
                        <p className="title">Скинуть ссылку потенциальному новому клиенту</p>
                        <p className="info">
                            Тот получит 1 бесплатное занятие если оплатят, а препод получит денежное вознаграждение
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                            eligendi harum hic neque porro recusandae.
                        </p>
                        <InputNew className="input" bubbleplaceholder="Ссылка" onChange={(e) => this.setState({refLink: e.target.value})}/>
                        <Button className="copyBtn"
                            btnText='Скопировать'
                            onClick={this.copyLink}
                            size='default'
                            type='light-pink'
                        />
                    </div>
                </Card>
                <Card className="payment-coach-stats">
                    <div className="payment-coach-stats-plate">
                        <div className="payment-coach-stats-plate-completed">
                            <div className="title"><span className="count">3</span><p className="name">Проведено тренировок</p></div>
                            <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation</p>
                        </div>
                        <div className="payment-coach-stats-plate-earned">
                            <div className="title"><span className="count">184р.</span><p className="name">Заработано с тренировок</p></div>
                            <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation</p>
                        </div>
                    </div>
                </Card>
                <Card className="payment-coach-invite" title="Пригласи друзей">
                    <img src={inviteFriendsPic}/>
                    <p className="title">Пригласи друга и получи бонус</p>
                    <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation</p>
                </Card>
                <PaymentEditModal
                    visible={this.state.modalVisible}
                    onSave = {() => {}}
                    onCancel={() => this.setState({modalVisible: false})}/>
            </div>
        )
    }
}

CoachPayment.propTypes = {
    paymentData: PropTypes.object,
    onSubmit: PropTypes.func
};

CoachPayment.defaultProps = {
    paymentData: {},
    onSubmit: () => {}
};

export default CoachPayment
