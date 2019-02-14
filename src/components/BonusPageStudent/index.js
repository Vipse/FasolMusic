import React from 'react';
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import InputNew from "../InputNew";
import inviteFriendsPic from "../../img/inviteFriendsPic.png";

class BonusPageStudent extends React.Component{

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
        return (
            <div className="bonus-student">
                <Card className="offers" title="Акции"> {/*title="Акты выполненных работ">*/}
                    <PerfectScrollbar>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">30 июл</div>
                                    <div className="year">2018</div>
                                </div>
                                <div className="title">
                                    Акция "Стойлето"
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">
                                    Акция продлится до 31 августа. При записи на бесплатную тренировку в
                                    музыкальную качалку Fasol - бонус: чем больше дней до конца лета осталось,
                                    тем больше скидка! И важно, не тянуть, поскольку каждый день скидка уменьшается!
                                    Акция действует только для новых студентов*
                                    И не забудь назвать промо-код #стойлето!!!
                                </div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">16 дек</div>
                                    <div className="year">2018</div>
                                </div>
                                <div className="title">
                                    НОВОГОДНИЙ FASOL BOX - порадуй своих близких!
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">
                                    Праздники не за горами! Все ещё думаешь, что подарить близким?
                                    Специально для тебя мы сделали FASOL BOX - подарок,
                                    который никого не оставит равнодушным!
                                    Выбирай дисциплину и исполняй мечту своих родных и близких!
                                    FASOL BOX - это:
                                    куча крутых стикеров
                                    значок-брошка с буквой "F"
                                    яркий спортивный браслет
                                    И самое главное, подарочный сертификат на любую из дисциплин:
                                    вокал, гитара и фортепиано.
                                    Спешите за подарками в качалку!
                                    FASOL BOX - порадуй своих близких!
                                </div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">8 фев</div>
                                    <div className="year">2019</div>
                                </div>
                                <div className="title">
                                    Лучший подарок к 14 Февраля
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">
                                    Друзья! Специально ко дню всех влюблённых мы сделали подарочные серификаты
                                    на любую дисциплину:
                                    вокал, гитара, фортепиано!
                                    А если успеете до вечера 14-го,
                                    то получите ЕЩЁ одну тренировку к сертификату БЕСПЛАТНО!
                                    А упаковали мы всю эту красоту в стильный FASOL BOX,
                                    в котором к тому же есть значок-брошка,
                                    спортивный браслет и куча крутых стикеров!
                                    Хватит дарить как все, дари с любовью! ❤️<br/>
                                    Fasol Box - порадуй своих близких!
                                </div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                    </PerfectScrollbar>
                </Card>
                <Card className="second-subscription" title="1+1">
                    <div className="second-subscription-container">
                        <p className="title">Купи абонемент на вторую дисциплину</p>
                        <p className="info">
                            Купи абонемент на вторую дисциплину и получи +1 тренировку на баланс!
                        </p>
                    </div>
                </Card>

                <Card className="referLink" title="Быстрая реакция">
                <div className="referLink-column">
                    <p className="title">Купи абонемент после пробной тренировки</p>
                    <p className="info">
                        Покупай абонемент сразу после пробной тренировки и получай +1 тренировку на баланс!
                    </p>
                </div>
            </Card>

                <Card className="invite" title="Совместная прокачка">
                    <img src={inviteFriendsPic}/>
                    <p className="title">Пригласи друга и получи бонус</p>
                    <p className="info">Не упусти возможность: пригласи друга и получи +1 тренировку себе
                        и +1 тренировку своему другу!
                    </p>
                </Card>
            </div>
        )
    }
}

BonusPageStudent.propTypes = {
    paymentData: PropTypes.object,
    onSubmit: PropTypes.func
};

BonusPageStudent.defaultProps = {
    paymentData: {},
    onSubmit: () => {}
};

export default BonusPageStudent
