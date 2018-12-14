import React from 'react'
import Button from '../Button'

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import InputNew from "../InputNew";
import cardIcon from "../../img/card.png"
import yandexMoneyIcon from "../../img/yandexMoney.png"
import PayModal from "../PayModal";
import moment from 'moment';

import * as actions from '../../store/actions'
import {connect} from "react-redux";

class StudentPayment extends React.Component{

    constructor() {
        super();
        this.state = {
            bankCard: {
                linked: true
            },
            yandexMoney: {
                linked: false
            },
            modalVisible: false
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

    selectPlan = (count) => {
        // здесь должно быть typeSubscription
       
        this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: count});
    }

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

    render() {
        let { deadlinePay} = this.props;
        let daysToPay = null;

        if( deadlinePay) {
            let now = moment(new Date()); //todays date
            let end = moment(deadlinePay.datePay * 1000); // another date
            let duration = moment.duration(end.diff(now));
             daysToPay = Math.round(duration.asDays());
        }
        
        
        return (
            <div className="payment-student">
                <Card className="payment-student-trainingPlans" title="Планы тренировок">
                    <p className="info">Разовые тренировки у нас от 20 руб!</p>
                    <div className="plansPlate">
                        <div className="plan">
                            <div className="plan-title">
                                <div className="plan-title-number">1</div>
                                <div className="plan-title-text">Тренировка</div>
                            </div>
                            <div className="plan-lessonCost">
                                <p className="plan-lessonCost-number">28 р.</p>
                                <p className="plan-lessonCost-text">за тренировку</p>
                            </div>
                            <div className="plan-select">
                                <div className="plan-select-totalPrice">28 р.</div>
                                <Button className="plan-select-selectBtn"
                                        btnText='Выбрать'
                                        onClick={() => { this.props.showTrialModal(); this.selectPlan(1) }}
                                        size='small'
                                        type='black'
                                />
                            </div>
                        </div>
                        <div className="plan">
                            <div className="plan-title">
                                <div className="plan-title-number">4</div>
                                <div className="plan-title-text">Тренировки</div>
                            </div>
                            <div className="plan-lessonCost">
                                <p className="plan-lessonCost-number">26 р.</p>
                                <p className="plan-lessonCost-text">за тренировку</p>
                            </div>
                            <div className="plan-select">
                                <div className="plan-select-totalPrice">107 р.</div>
                                <Button className="plan-select-selectBtn"
                                        btnText='Выбрать'
                                        onClick={() => { this.props.showTrialModal(4); this.selectPlan(4) }}
                                        size='small'
                                        type='black'
                                />
                            </div>
                        </div>
                        <div className="plan">
                            <div className="plan-title">
                                <div className="plan-title-number">8</div>
                                <div className="plan-title-text">Тренировок</div>
                            </div>
                            <div className="plan-lessonCost">
                                <p className="plan-lessonCost-number">23 р.</p>
                                <p className="plan-lessonCost-text">за тренировку</p>
                            </div>
                            <div className="plan-select">
                                <div className="plan-select-totalPrice">184 р.</div>
                                <Button className="plan-select-selectBtn"
                                        btnText='Выбрать'
                                        onClick={() => { this.props.showTrialModal(); this.selectPlan(8) }}
                                        size='small'
                                        type='black'
                                />
                            </div>
                        </div>
                        <div className="plan">
                            <div className="plan-title">
                                <div className="plan-title-number">12</div>
                                <div className="plan-title-text">Тренировок</div>
                            </div>
                            <div className="plan-lessonCost">
                                <p className="plan-lessonCost-number">23 р.</p>
                                <p className="plan-lessonCost-text">за тренировку</p>
                            </div>
                            <div className="plan-select">
                                <div className="plan-select-totalPrice">279 р.</div>
                                <Button className="plan-select-selectBtn"
                                        btnText='Выбрать'
                                        onClick={() => { this.props.showTrialModal(); this.selectPlan(12) }}
                                        size='small'
                                        type='black'
                                />
                            </div>
                        </div>
                        <div className="plan">
                            <div className="plan-title">
                                <div className="plan-title-number">24</div>
                                <div className="plan-title-text">Тренировки</div>
                            </div>
                            <div className="plan-lessonCost">
                                <p className="plan-lessonCost-number">20 р.</p>
                                <p className="plan-lessonCost-text">за тренировку</p>
                            </div>
                            <div className="plan-select">
                                <div className="plan-select-totalPrice">488 р.</div>
                                <Button className="plan-select-selectBtn"
                                        btnText='Выбрать'
                                        onClick={() => { this.props.showTrialModal(); this.selectPlan(24) }}
                                        size='small'
                                        type='black'
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="payment-student-paymentData" title="Варианты оплаты">
                    <div className="inputPlate">
                        <InputNew className="input" bubbleplaceholder="Введи промокод"/>
                        <Button className="applyBtn"
                                btnText='Принять'
                                onClick={this.applyPromo}
                                size='default'
                                type='light-green'
                        />
                    </div>
                    <div className="paymentBlock">
                        <span className="title">Выбери способ оплаты</span>
                        <div className='paymentTypePlate'>
                            <div className="payment-method">
                                <div className="payment-method-view" onClick={() => this.setState({modalVisible: true})}>
                                    <img src={cardIcon} className="payment-method-icon"/>
                                    <span className="payment-method-name">Карта</span>
                                </div>
                            </div>
                            <div className="payment-method">
                                <div className="payment-method-view" onClick={() => this.setState({modalVisible: true})}>
                                    <img src={yandexMoneyIcon} className="payment-method-icon"/>
                                    <span className="payment-method-name">Яндекс.Деньги</span>
                                </div>
                            </div>
                        </div>
                        <p className="info">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                            eligendi
                        </p>
                    </div>
                </Card>
                <Card className="payment-student-stats">
                    <div className="payment-student-stats-plate">
                        <div className="payment-student-stats-plate-nextDate">
                            <div className="title"><span className="date">24 дек</span><p className="name">Следующая тренировка</p></div>
                            <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation</p>
                        </div>
                        <div className="payment-student-stats-plate-paid">
                            <div className="title"><span className="count">3</span><p className="name">Оплачено тренировок</p></div>
                            <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation</p>
                        </div>
                        <div className="payment-student-stats-plate-daysBeforeNextPay">
                            <div className="title">
                                <span className="count">
                                {daysToPay ? daysToPay : '-'}
                                </span>

                                <p className="name">Дней до оплаты</p>
                            </div>
                            <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation</p>
                        </div>
                    </div>
                </Card>
                <PayModal
                    visible={this.state.modalVisible}
                    onSave = {() => {}}
                    onCancel={() => this.setState({modalVisible: false})}/>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        //freeIntervals: state.patients.freeIntervals,
        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetFreeIntervals: (freeIntervals) => dispatch(actions.setFreeIntervals(freeIntervals)),
        onSetNeedSaveIntervals: (count) => dispatch(actions.setNeedSaveIntervals(count)),
        
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentPayment);

