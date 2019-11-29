import React from 'react';
import PropTypes from 'prop-types'

import moment from "moment";
import {Modal, message, Tooltip} from "antd";
import {connect} from 'react-redux';
import * as actions from '../../store/actions'

import Button from '../Button'
import Icon from '../Icon'
import NotificationApp from '../NotificationApp'
import AutoComplete from '../AutoComplete'
import CreateTrainModal from "../../components/Modals/CreateTrainModal";

import './style.css'
import '../../icon/style.css'
import history from '../../store/history';



class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isTrialTrainingModalVisible: false,
        isUnfreshTrainingModal: false,
        showBtnBack: false,
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isTrialTrainingsAvailableCount !== this.props.isTrialTrainingsAvailableCount &&
            this.props.isTrialTrainingsAvailableCount > 1 && this.props.isOnMainPage)
            this.setState({isTrialTrainingModalVisible: true});
    }

    logout = () => {
        localStorage.removeItem('landing');
        history.push('/signin')
        this.props.logout();
    }

    onSubmitBtnTrialTraining = () => {
        this.props.setParamsId({pushBtnTrial: true})
        this.props.showCreateTrainModal_clickTrial()
    }

    onUnfreshTraining = () => {
        this.props.setParamsId({pushBtnUnfresh: true})
        this.props.showCreateTrainModal_clickUnfreeze();
    }

    handleTransfer = () => {
        const {isAdmin, currDiscipline} = this.props;

        if(currDiscipline.code){
            this.props.isTransferTrainPopupActive && Modal.info({
                title: 'Перенос тренировки',
                width: '500px',
                className: 'quick-modal',
                content: 'Зеленым цветом в календаре подсветилось доступное время у коуча, ' +
                    'перетяни тренировку которую хочешь перенести на любое доступное время и помни, ' +
                    'одну тренировку можно перенести только один раз и не позднее 24 часов до начала тренировки!',
                onOk: () => {this.props.onTransferTrainPopupClose()}
            });
    
            this.props.showTransferInterval();
            this.props.setParamsId({pushBtnTransfer: true})
        }
        else {
            message.info('Выберите дисциплину в расписании')
        }
       
        if(!isAdmin){
            history.push('/app/schedule')
        }
        
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
            isTrialTrainingsAvailableCount,
            useFrozenTraining,
            countTrainingDiscipline,
            isStudentSchedule
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
                {isStudent || isStudentSchedule ?
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

                <CreateTrainModal /> 

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

const mapStateToProps = state => {

    return {
        isAdmin:  state.auth.mode === "admin",
        isStudent: state.auth.mode === 'student',
        
        currDiscipline: state.abonement.currDiscipline,

        //UX
        useFrozenTraining: state.student.useFrozenTraining,
        studentBalance: state.abonement.studentBalance,
        countTrainingDiscipline: state.training.countTrainingDiscipline,

        isTrialTrainingsAvailableCount: state.student.isTrialTrainingsAvailableCount,
        trialTrainingForDisciplines: state.student.trialTrainingForDisciplines,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        showCreateTrainModal_clickUnfreeze:() => dispatch(actions.showCreateTrainModal_clickUnfreeze()),
        showCreateTrainModal_clickTrial:() => dispatch(actions.showCreateTrainModal_clickTrial()),
    
        setParamsStatusPush:(params) => dispatch(actions.setParamsStatusPush(params)),
        setParamsId:(params) => dispatch(actions.setParamsId(params)),
        //
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
