import React from 'react';
import PropTypes from 'prop-types'

import Button from '../Button'
import Icon from '../Icon'
import NotificationApp from '../NotificationApp'
import AutoComplete from '../AutoComplete'

import './style.css'
import '../../icon/style.css'
import CreateTrainModal from "../../components/CreateTrainModal";
import moment from "moment";
import {Modal, message, Tooltip} from "antd";
import  ReactTooltip  from 'react-tooltip';
import {findDOMNode} from 'react-dom'
import Schedule from './../../containers/Schedule/index';


class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isTrialTrainingModalVisible: false,
        isUnfreshTrainingModal: false,
        showBtnBack: false,
    };

    componentWillReceiveProps(nextProps) {
        if(this.props.statusBtnBack === false && this.props.statusBtnBack !== this.state.showBtnBack){
            this.setState({showBtnBack: false})
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isTrialTrainingsAvailableCount !== this.props.isTrialTrainingsAvailableCount &&
            this.props.isTrialTrainingsAvailableCount > 1 && this.props.isOnMainPage)
            this.setState({isTrialTrainingModalVisible: true});
    }

    logout = () => {
        localStorage.removeItem('landing');
        this.props.logout();
    }

    resetAllEvent = () => {
        this.props.onSetPushTrialTraining(null)
        this.props.onUnsetPushBtnTransferTraining();
        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0});
    }

    resetAllActionApp = () => {
        const {statusBtnBack} = this.props;

        this.props.onSetPushTrialTraining(null)
        this.props.onUnsetPushBtnTransferTraining();
        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0});
        this.props.onChangeBtnBack(!statusBtnBack)
        this.setState({showBtnBack: false})
    }

    onSubmitBtnTrialTraining = () => {
        const {statusBtnBack} = this.props;

        this.resetAllActionApp();
        this.props.onChangeBtnBack(!statusBtnBack)
        this.setState({isTrialTrainingModalVisible: true, showBtnBack: true});
        this.setState({actionTrialTraining: true})
    }

    onUnfreshTraining = () => {
        const {statusBtnBack} = this.props;

        this.resetAllActionApp();
        this.props.onChangeBtnBack(!statusBtnBack)
        this.setState({isUnfreshTrainingModal: true, showBtnBack: true});
    }

    onCreateUnfreshAbonement = (data) => {

        const {disciplinesList, discCommunication, useFrozenTraining, subsForDisc, weekInterval, id} = this.props;
        let array = [];
        let time0 = null;
        let time1 = null;
        if(!weekInterval){
            time0 = moment(Date.now()).startOf('week').format('X');
            time1 = moment(Date.now()).endOf('week').format('X');
        }
        else{
            time0 = weekInterval.start;
            time1 = weekInterval.end;
        }

        const codeDisc = disciplinesList[data.type].code;
        this.props.showSpinner();

        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: +useFrozenTraining});

        this.props.onChangeCurrDiscipline(disciplinesList[data.type]);
        this.props.onSetFreeIntervals(array, data.type);

        if(discCommunication && discCommunication.hasOwnProperty(codeDisc) && subsForDisc.hasOwnProperty(codeDisc) && discCommunication[codeDisc].idMaster){

            this.props.onEditUseFrozenTraining(id, useFrozenTraining);
            this.props.onSetNeedSaveIntervals({visibleTrialModal: false, countTraining: 0})
            this.props.onAddAmountTraining(subsForDisc[codeDisc], useFrozenTraining)
                .then(() => setTimeout(() => this.props.hideSpinner(), 1000))

            message.success('Количество добавленных тренировок '+ useFrozenTraining);
        }
        else {

            this.props.onSetPushTrialTraining(null);
            this.props.onSetMasterTheDisicipline(null);
            this.props.onGetAvailableInterval(time0, time1, [0, 1, 2, 3, 4, 5, 6], [codeDisc])
                .then(() => setTimeout(() => this.props.hideSpinner(), 1000))

        }

        this.props.onGetAbonementsFilter(id,disciplinesList[data.type])

        this.props.onChangePushBtnUnfresh(true);
        this.props.onGoToSchedule();
        this.setState({isUnfreshTrainingModal: false});
    }


    onSendDataTrialModal = (data) => {

        const {disciplinesList, id, weekInterval} = this.props;
        const {type} = data;

        let time0 = null;
        let time1 = null;
        if(!weekInterval){
            time0 = moment(Date.now()).startOf('week').format('X');
            time1 = moment(Date.now()).endOf('week').format('X');
        }
        else{
            time0 = weekInterval.start;
            time1 = weekInterval.end;
        }

        this.props.showSpinner();

        this.props.onGetAvailableInterval(time0, time1, [0,1,2,3,4,5,6], [disciplinesList[type].code]);
        this.props.onSetPushTrialTraining('trial');
        this.props.onChangeCurrDiscipline(disciplinesList[type]);

        this.props.onGetAbonementsFilter(id,disciplinesList[type])
            .then(() => setTimeout(() => this.props.hideSpinner(), 1000))
        this.props.onGoToSchedule();
        this.props.onUnsetPushBtnTransferTraining();
        this.setState({isTrialTrainingModalVisible: false});
    };

    handleTransfer = () => {
        const {statusBtnBack} = this.props;

        this.props.isTransferTrainPopupActive && Modal.info({
            title: 'Перенос тренировки',
            width: '500px',
            className: 'fast-modal',
            content: 'Зеленым цветом в календаре подсветилось доступное время у коуча, ' +
                'перетяни тренировку которую хочешь перенести на любое доступное время и помни, ' +
                'одну тренировку можно перенести только один раз и не позднее 24 часов до начала тренировки!',
            onOk: () => {this.props.onTransferTrainPopupClose()}
        });

        //this.props.onChangePushBtnUnfresh(true); // app func
        this.props.showTransferInterval();
        this.props.onChangeBtnTransfer(true)
        this.props.onSetPushTrialTraining(null);
        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: false, countTraining: 0});
        this.props.onChangeBtnBack(!statusBtnBack)

        this.setState({showBtnBack: true})
    };

    render() {
        const {
            isStudent,
            findName,
            authMode,
            searchData,
            onGoto,
            studentBalance,
            trialTrainingForDisciplines,
            disciplinesList,
            isTrialTrainingsAvailableCount,
            useFrozenTraining,
            countTrainingDiscipline
        } = this.props;

        let showTrialModal = false;
        for(let el in trialTrainingForDisciplines){
            if(trialTrainingForDisciplines[el] === false) showTrialModal = true
        }

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
                {isStudent ?
                    <React.Fragment>
                        <div className="header-balance"><span>Баланс {studentBalance}</span></div>
                        <div className='header-train'>
                            {(isTrialTrainingsAvailableCount && showTrialModal) ? <Button
                                btnText='ПРОБНАЯ ТРЕНИРОВКА'
                                size='default'
                                type='border-pink'
                                className="header-btn"
                                onClick={this.onSubmitBtnTrialTraining}
                            /> : null}
                            {useFrozenTraining ? <Button
                                btnText={'Разморозить тренировку(' + useFrozenTraining + ')'}
                                size='default'
                                type='border-pink'
                                className="header-btn"
                                onClick={this.onUnfreshTraining}
                            /> : null}


                            {countTrainingDiscipline ?
                                <Button
                                    btnText='ПЕРЕНЕСТИ ТРЕНИРОВКУ'
                                    size='default'
                                    type='border-pink'
                                    className="header-btn"
                                    onClick={this.handleTransfer}
                                /> :
                                <Tooltip placement="bottom" title={'Нет тренировок для переноса'} text>
                                    <Button
                                        btnText='ПЕРЕНЕСТИ ТРЕНИРОВКУ'
                                        size='default'
                                        type='border-pink'
                                        className="header-btn"
                                    />
                                </Tooltip>}
                        </div>
                    </React.Fragment> : null}
                <div className='header-notification'>
                    <NotificationApp
                        data={this.props.notifications}
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
                        onClick={this.logout}
                    />
                </div>
                <CreateTrainModal
                    title='Запишись на пробную тренировку'
                    width={770}
                    visible={this.state.isTrialTrainingModalVisible}
                    availableDisciplines={trialTrainingForDisciplines}
                    disciplinesList={disciplinesList}
                    unauthorized={false}
                    closable={true}
                    trial={true}
                    onCancel={() => {
                        this.setState({isTrialTrainingModalVisible: false})
                    }}
                    onSave={this.onSendDataTrialModal}
                />

                <CreateTrainModal
                    title='Создание абонемента (разморозка)'
                    width={770}
                    visible={this.state.isUnfreshTrainingModal}
                    availableDisciplines={disciplinesList}
                    disciplinesList={disciplinesList}
                    closable={true}
                    onCancel={() => {
                        this.setState({isUnfreshTrainingModal: false})
                    }}
                    onSave={this.onCreateUnfreshAbonement}
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
