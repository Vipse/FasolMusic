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
import {Modal, message} from "antd";


class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isTrialTrainingModalVisible: false,
        isUnfreshTrainingModal: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isTrialTrainingsAvailable !== this.props.isTrialTrainingsAvailable &&
            this.props.isTrialTrainingsAvailable && this.props.isOnMainPage)
            this.setState({isTrialTrainingModalVisible: true});
    }

    onUnfreshTraining = () => {
        this.setState({isUnfreshTrainingModal: true});
    }

    onCreateUnfreshAbonement = (data) => {

        const {disciplinesList, discCommunication, useFrozenTraining, subsForDisc, abonementIntervals, id} = this.props;
        let array = [];
        const time0 = moment(Date.now()).format('X');
        const time1 = moment(Date.now()).add(1,'weeks').format('X');
        const codeDisc = disciplinesList[data.type].code;
        this.props.showSpinner();
      
        this.props.onSetNeedSaveIntervals({visibleCreateTrainModal: true, countTraining: +useFrozenTraining});
        
        this.props.onChangeCurrDiscipline(disciplinesList[data.type]);
        this.props.onSetFreeIntervals(array, data.type);

        if(discCommunication && discCommunication.hasOwnProperty(codeDisc) && subsForDisc.hasOwnProperty(codeDisc) && discCommunication[codeDisc].idMaster){
                  
            this.props.onAddAmountTraining(subsForDisc[codeDisc], useFrozenTraining);
            this.props.onEditUseFrozenTraining(id, useFrozenTraining);
            this.props.onSetNeedSaveIntervals({visibleTrialModal: false, countTraining: 0})

            message.success('Количество добавленных тренировок '+ useFrozenTraining);    
        }
        else if (discCommunication && discCommunication.hasOwnProperty(codeDisc) && discCommunication[codeDisc].idMaster) {

            this.props.onSetPushTrialTraining('select_master');
            this.props.onSetMasterTheDisicipline(discCommunication[codeDisc].idMaster);
            this.props.onGetTheMasterInterval(time0, time1, discCommunication[codeDisc].idMaster, [0, 1, 2, 3, 4, 5, 6])
                .then(() => setTimeout(() => this.props.hideSpinner(), 1000))
                
        } else {

            this.props.onSetPushTrialTraining(null);
            this.props.onSetMasterTheDisicipline(null);
            this.props.onGetAvailableInterval(time0, time1, [0, 1, 2, 3, 4, 5, 6], [codeDisc])
                .then(() => setTimeout(() => this.props.hideSpinner(), 1000))
                
        }

        this.props.onGetAbonementsFilter(id,disciplinesList[data.type])
             

        this.props.onIsPushBtnUnfresh();
        this.props.onGoToSchedule();
        this.setState({isUnfreshTrainingModal: false});
    }


    onSendDataTrialModal = (data) => {
        
        const {disciplinesList, id} = this.props;
        const {type} = data;

        const time0 = moment(Date.now()).format('X');
        const time1 = moment(Date.now()).add(3,'d').format('X');

        this.props.showSpinner();
        
        this.props.onGetAvailableInterval(time0, time1, Object.keys(data.selectedDays), [disciplinesList[type].code]);
        this.props.onSetPushTrialTraining('trial');
    
        this.props.onChangeCurrDiscipline(disciplinesList[type]);

        this.props.onGetAbonementsFilter(id,disciplinesList[type])
            .then(() => setTimeout(() => this.props.hideSpinner(), 1000))
        this.props.onGoToSchedule();
        this.setState({isTrialTrainingModalVisible: false});
    };

    handleTransfer = () => {
        this.props.isPushBtnTransfer();

        this.props.isTransferTrainPopupActive && Modal.info({
            title: 'Перенос тренировки',
            width: '500px',
            className: 'fast-modal',
            content: 'Зеленым цветом в календаре подсветилось доступное время у коуча, ' +
                'перетяни тренировку которую хочешь перенести на любое доступное время и помни, ' +
                'одну тренировку можно перенести только один раз и не позднее 24 часов до начала тренировки!',
            onOk: () => {this.props.onTransferTrainPopupClose()}
        });
    };

    render() {
        const {
            notifications,
            isStudent,
            findName,
            authMode,
            searchData,
            onGoto,
            studentBalance,
            trialTrainingForDisciplines,
            isTrialTrainingsAvailable,
            disciplinesList,
            useFrozenTraining
        } = this.props;

        let showTrialModal = false;
        for(let el in trialTrainingForDisciplines){
            if(trialTrainingForDisciplines[el] === false) showTrialModal = true
        }

        console.log('this.props', this.props)
        debugger
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
                            {isTrialTrainingsAvailable && showTrialModal && <Button
                                btnText='ПРОБНАЯ ТРЕНИРОВКА'
                                size='default'
                                type='border-pink'
                                className="header-btn"
                                onClick={() => this.setState({isTrialTrainingModalVisible: true})}
                            />}
                            {useFrozenTraining ? <Button
                                btnText={'Разморозить тренировку(' + useFrozenTraining + ')'}
                                size='default'
                                type='border-pink'
                                className="header-btn"
                                onClick={this.onUnfreshTraining}
                            /> : null}
                            <Button
                                btnText='ПЕРЕНЕСТИ ТРЕНИРОВКУ'
                                size='default'
                                type='border-pink'
                                className="header-btn"
                                onClick={this.handleTransfer}
                            />
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
                        onClick={this.props.logout}
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
    logout: () => {
    },
    isStudent: false,
};

export default Header
