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
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>
                        <div className="offers-item">
                            <div className='offers-item-header'>
                                <div className="date">
                                    <div className="day">24 дек</div>
                                    <div className="year">2017</div>
                                </div>
                                <div className="title">
                                    Заголовок статьи
                                </div>
                            </div>
                            <div className="offers-item-body">
                                <div className="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consectetur est facilis laudantium necessitatibus odio porro quaerat suscipit. Adipisci, mollitia.</div>
                                <div className="link">Подробнее</div>
                            </div>
                        </div>

                    </PerfectScrollbar>
                </Card>
                <Card className="second-subscription" title="Заголовок карточки">
                    <div className="second-subscription-container">
                        <p className="title">Купи абонемент на вторую дисциплину</p>
                        <p className="info">
                            Тот получит 1 бесплатное занятие если оплатят, а препод получит денежное вознаграждение
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                            eligendi harum hic neque porro recusandae.
                        </p>
                    </div>
                </Card>

                <Card className="referLink" title="Заголовок карточки">
                <div className="referLink-column">
                    <p className="title">Купи абонемент на вторую дисциплину</p>
                    <p className="info">
                        Тот получит 1 бесплатное занятие если оплатят, а препод получит денежное вознаграждение
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                        eligendi harum hic neque porro recusandae.
                    </p>
                </div>
            </Card>

                <Card className="invite" title="Пригласи друзей">
                    <img src={inviteFriendsPic}/>
                    <p className="title">Пригласи друга и получи бонус</p>
                    <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation</p>
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
