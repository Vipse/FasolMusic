import React from 'react';
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
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
import DownloadLink from "../DownloadLink";

class CoachPayment extends React.Component{

    filesList = [
        {
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        },{
            name: "Заключение.doc",
        },{
            name: "Прикрепленный файл с длинным названием.doc",
        },{
            name: "Данные 525462.pdf",
        }
    ];

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

    renderFilesList = () => {
        return this.filesList.map((file, i) => {
            return <div className="file">
                <DownloadLink {...file}
                              key={file.id + '' + i}
                              size="default"
                              type="link"
                              svg
                              icon="file"
                              iconSize={14}
                              download
                              btnText={file.name}
                />
            </div>;
        });
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
        const {completedAmount} = this.props;
        return (
            <div className="payment-coach">
                <Card className="payment-coach-record" title="Акты выполненных работ">
                    <PerfectScrollbar className="payment-coach-record-overlay">
                        {this.renderFilesList()}
                    </PerfectScrollbar>
                </Card>
                <Card className="payment-coach-stats">
                    <div className="payment-coach-stats-plate">
                        <div className="payment-coach-stats-plate-completed">
                            <div className="title"><span className="count">{completedAmount}</span>
                                <p className="name">Проведено тренировок</p>
                            </div>
                            <p className="info">Дальше - больше! Чем больше у вас проведено тренировок,
                                тем больше у вас опыта в обучении, следите за своим ростом!</p>
                        </div>
                    </div>
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
    filesList: PropTypes.arrayOf(PropTypes.object),
    completedAmount: PropTypes.number,
    onSubmit: PropTypes.func
};

CoachPayment.defaultProps = {
    paymentData: {},
    filesList: [],
    completedAmount: 0,
    onSubmit: () => {}
};

export default CoachPayment
