import React from 'react'
import Button from '../Button'

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import InputNew from "../InputNew";
import PayModal from "../PayModal";
import moment from 'moment';

import * as actions from '../../store/actions'
import {connect} from "react-redux";
import AbonementCard from "../AbonementCard";
import { currencyTexts, abonements } from "../../helpers/pricesData";
import Spinner from "../Spinner";

class StudentPayment extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            bankCard: {
                linked: true
            },
            yandexMoney: {
                linked: false
            },
            modalVisible: false,
            currency: ''
        };
    }

    componentDidMount() {
        if (this.props.country)
            this.setState({
                currency: this.props.country === 'BY' ? 'BYN' : 'RUB'
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.country !== this.props.country && this.props.country)
            this.setState({
              currency: this.props.country === 'BY' ? 'BYN' : 'RUB'
            });
    }

    handleLinkStatus = (e, method) => {
        e.preventDefault();
        this.setState({
            [method]: {
                linked: !this.state[method].linked
            }
        });
    };

    getMinimalPrice = () => {
        const {currency} = this.state;
        let minValue;
        if (abonements[currency] && abonements[currency].length)
            minValue = Math.min(...abonements[currency].map((item) => item.lessonCost));

        return minValue ? minValue : 0;
    };

    selectPlan = (count) => {
        // здесь должно быть typeSubscription


        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: count});
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

    render() {
        const { deadlinePay, studentBalance} = this.props;
        const {currency} = this.state;
        let daysToPay = null;

        if( deadlinePay) {
            let now = moment(new Date()); //todays date
            let end = moment(deadlinePay.datePay * 1000); // another date
            let duration = moment.duration(end.diff(now));
             daysToPay = Math.round(duration.asDays());
        }


        return (
            <div className="payment-student">
                <Card className="payment-student-trainingPlans" title="Стоимость тренировок">
                    {currency ? <React.Fragment>
                        <p className="info">Чем больше тренировок вы выбираете, тем меньше цена за одно занятие,
                            от {this.getMinimalPrice() + ' ' + currencyTexts[currency]}</p>
                        <div className="plansPlate">
                            {abonements[currency].map((item) =>
                                <AbonementCard
                                    key={item.id}
                                    id={item.id}
                                    amount={item.amount}
                                    amountTitle={item.amountTitle}
                                    lessonCost={item.lessonCost}
                                    price={item.price}
                                    currency={currencyTexts[currency]}
                                    showTrialModal={() => this.props.showTrialModal(item.amount, item.price, this.state.currency)}
                                />
                            )}
                        </div>
                    </React.Fragment> : <Spinner size='large'/>}
                </Card>
                <Card className="payment-student-paymentData" title="Промокод">
                    <div className="inputPlate">
                        <InputNew className="input" bubbleplaceholder="Введи промокод"/>
                        <Button className="applyBtn"
                                btnText='Принять'
                                onClick={this.applyPromo}
                                size='default'
                                type='light-green'
                        />
                    </div>
                </Card>
                <Card className="payment-student-stats">
                    <div className="payment-student-stats-plate">
                        <div className="payment-student-stats-plate-nextDate">
                            <div className="title">
                                <span className="date">{ (this.props.nextTrainingTime) ? moment(this.props.nextTrainingTime).format('D MMM') : '—'}
                                </span>
                                <p className="name">Следующая тренировка</p>
                            </div>
                            <p className="info">До следующей тренировки осталось еще время,
                                помните, результат будет намного лучше если вы закрепите все,
                                что было пройдено на прошлой трене, порадуйте своего коуча! 💪
                            </p>
                        </div>
                        <div className="payment-student-stats-plate-paid">
                            <div className="title">
                                <span className="count"> {studentBalance}
                                </span>
                                <p className="name">Оплачено тренировок</p>
                            </div>
                            <p className="info">Просыпаетесь посреди ночи в страхе,
                                что тренировки закончились?
                                Следите за своим балансом!
                                Чем больше у вас тренировок,
                                тем больше треков вы выучите!
                                Насобирайте песен для сольника! 😉
                            </p>
                        </div>
                        <div className="payment-student-stats-plate-daysBeforeNextPay">
                            <div className="title">
                                <span className="count">
                                {daysToPay ? daysToPay : '-'}
                                </span>
                                <p className="name">Дней до оплаты</p>
                            </div>
                            <p className="info">Если этот день настал, не расстраивайтесь,
                                ведь вам не нужно куда-то идти,
                                все оплаты можно проводить не выходя из дома,
                                прямо в личном кабинете! Правда удобно? 🙂
                            </p>
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

