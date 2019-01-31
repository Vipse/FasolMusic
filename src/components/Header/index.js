import React from 'react';
import PropTypes from 'prop-types'

import Button from '../Button'
import Icon from '../Icon'
import NotificationApp from '../NotificationApp'
import AutoComplete from '../AutoComplete'

import './style.css'
import '../../icon/style.css'
import TrialTrainModal from "../../components/TrialTrainModal";
import moment from "moment";


class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isTrialTrainingModalVisible: false
    };

    onSendDataTrialModal = (data) => {
        const {disciplinesList} = this.props;
        const {type} = data;
        // debugger

        const time0 = moment(Date.now()).startOf('week').format('X');
        const time1 = moment(Date.now()).endOf('week').format('X');
        this.props.onGetAvailableInterval(time0, time1, Object.keys(data.selectedDays), [disciplinesList[type].code]);
        this.props.onSetPushTrialTraining('trial');
        this.props.onChangeCurrDiscipline(disciplinesList[type]);

        this.props.onGoToSchedule();
        this.setState({isTrialTrainingModalVisible: false});
    };

    render() {
        const {notifications, isStudent, findName, authMode, searchData, onGoto, frozenTraining, trialTrainingForDisciplines} = this.props;
        return (
            <div className='header'>
                <div className='header-search'>
                    <AutoComplete
                        findName={findName}
                        authMode={authMode}
                        data={searchData}
                        onGoto={onGoto}
                    />
                </div>
                <div className="header-balance"><span>Баланс {frozenTraining}</span></div>
                <div className='header-train'>
                    {isStudent ?
                        <React.Fragment>
                            {Object.keys(trialTrainingForDisciplines).length !== 0 && <Button
                                btnText='ЗАПИСАТЬСЯ НА ПРОБНУЮ'
                                size='default'
                                type='border-pink'
                                className="header-btn"
                                onClick={() => this.setState({isTrialTrainingModalVisible: true})}
                            />}
                            <Button
                                btnText='ДОБАВИТЬ ТРЕНИРОВКУ'
                                size='default'
                                type='border-pink'
                                className="header-btn"
                                onClick={this.props.isPushBtnAdd}
                            />
                            <Button
                                btnText='ПЕРЕНЕСТИ ТРЕНИРОВКУ'
                                size='default'
                                type='border-pink'
                                className="header-btn header-btn-transfer"
                                onClick={this.props.isPushBtnTransfer}
                            />
                        </React.Fragment> : null
                    }
                </div>
                <div className='header-notification'>
                    <NotificationApp
                        data={notifications}
                        getNotifications={this.props.getNotifications}
                        getId={this.props.getNotifId}>
                        <Icon
                            svg
                            type='notification'
                            size={20}
                            title='Уведомления'
                        />
                    </NotificationApp>
                </div>
                <div className='header-exit'>
                    <Button
                        btnText=''
                        size='icon'
                        type='icon'
                        icon='exit'
                        iconSize={20}
                        svg
                        title='Выход'
                        onClick={this.props.logout}
                    />
                </div>
                <TrialTrainModal
                    title='Запишись на пробную тренировку'
                    width={770}
                    visible={this.state.isTrialTrainingModalVisible}
                    unauthorized={false}
                    closable={true}
                    onCancel={() => {this.setState({isTrialTrainingModalVisible: false})}}
                    onSave={this.onSendDataTrialModal}
                />
            </div>
        )
    }
}

Header.propTypes = {
    notifications: PropTypes.array,
    logout: PropTypes.func,
    isStudent: PropTypes.bool,
};

Header.defaultProps = {
    notifications: [],
    logout: () => {},
    isStudent: false,
};

export default Header
