import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux';
import {message, Modal as PopupModal} from 'antd';


import Button from "../../components/Button";
import Calendar from "../../components/Calendar22";

import Modal from './../../components/Modal/index';
import * as actions from '../../store/actions'
import Card from './../../components/Card/index';

import './styles.css'
import ListTrainersModal from '../../components/Modals/ListTrainersModal';
import TransferOrFreezeModal from '../../components/Modals/TransferOrFreezeModal';
import TransferOrNewScheduleModal from '../../components/Modals/TransferOrNewScheduleModal';
import RemoveTrialTrainingModal from '../../components/Modals/RemoveTrialTrainingModal';
import ConfirmCreateModal from '../../components/Modals/ConfirmCreateModal';

class Schedule extends React.Component {
    
    constructor(props) {
        super(props);

        const m = moment().startOf('week');
        this.min = moment([m.get('year'), m.get('month'), m.get('date'), 8]).format('X')
        this.max = moment([m.get('year'), m.get('month'), m.get('date'),23]).format('X')    
    };

    componentDidUpdate(nextProps, nextState) {
        const {currentIdUser, setParamsId} = this.props;

        this.id = this.getCurrentId()
        if(currentIdUser !== this.id){
            setParamsId({currentIdUser: this.id})
        }   
    }

    getCurrentId = () => { 
        const {id, match} = this.props;
        return (Object.keys(match.params).length && match.params.id) ? match.params.id : id
    }

    isStudentSchedule = () => { 
        const {match} = this.props;
        return (Object.keys(match.params).length && match.params.id) ? true : false
    }

    componentDidMount() {
        const {startDate, endDate, setParamsId} = this.props;

        //
        const {currDiscipline, isAdmin, mode} = this.props;
        const id = this.getCurrentId() 
        setParamsId({currentIdUser: id})

        const start =  moment(Date.now()).startOf('week').format('X');
        const end = moment(Date.now()).endOf('week').format('X');
        this.props.onSetWeekInterval({start, end});


        if(mode === 'student' || (isAdmin && this.isStudentSchedule())){
            this.props.onGetDisciplineCommunication(id);

            !isAdmin && this.props.onCheckToken(id)
                .then(checkToken => {
                    if(checkToken && checkToken.length){
                        PopupModal.info({
                            title: 'Отлично! Теперь ты в нашей команде!',
                            width: '500px',
                            className: 'quick-modal',
                            content: 'Пробежимся по правилам: Каждую тренировку можно переносить 1 раз; ' +
                                'Перенос тренировки возможен за 24 часа до ее начала, ' +
                                'если осталось меньше 24 часов до начала, перенос тренировки невозможен, ' +
                                'если вы не сможете присутствовать, она будет считаться проведенной; ' +
                                'Заморозка занятий действует 3 месяца. ' +
                                'Вот и все, вперед покорять музыку вместе с Fasol музыкальная качалка.',
                            zIndex: 1010
                        });
                    }
                })

            this.props.onGetStudentsSchedule(id, startDate, endDate, currDiscipline.code);
        }
        else if(isAdmin) {
            this.props.onGetFreeAndBusyMasterList(start, end)
        }
        else if(mode === 'master'){
            this.props.getTrainerTraining(id, start, end, currDiscipline.code)
        }
    }



    dateChange = (action) => {
        const {isAdmin, mode} = this.props;

        const getNewDate = (property) => {
            if (action == 'NEXT'){
                return moment(+this.props[property] * 1000).add(1, 'week').format('X')
            }
            else if(action == 'PREV'){
                return moment(+this.props[property] * 1000).subtract(1, 'week').format('X')
            } 
            else if(action == 'TODAY'){
                if(property == 'startDate') 
                    return moment().startOf('week').format('X')
                else 
                    return moment().endOf('week').format('X')        
            }
        }

        const newStart = getNewDate('startDate')
        const newEnd = getNewDate('endDate') 
        
        const m = moment(+newStart * 1000)
        
        this.min = moment([m.get('year'), m.get('month'), m.get('date'), 8])
        this.max = moment([m.get('year'), m.get('month'), m.get('date'), 23])
        console.log("this.min", this.min)
        this.min = this.min.format('X')
        this.max = this.max.format('X')
    
        this.props.handleChangeTime(newStart, newEnd);
        this.setState({ 
            scheduleSpinner: true
        })


        if(isAdmin && !this.isStudentSchedule()){
            this.fetchAdminDateChange(newStart, newEnd)
        } 
        else if(mode === 'student' || this.isStudentSchedule()){
            this.fetchDateChange(newStart, newEnd)
        }
        else if(mode === 'master'){
            this.fetchTrainerDateChange(newStart, newEnd)
        }
    }

    fetchAdminDateChange = (newStart, newEnd) => {
        this.props.onGetFreeAndBusyMasterList(newStart, newEnd)
    }

    
    fetchDateChange = (newStart, newEnd) => {
        const { currentIdUser: id, isAdmin, 
            currDiscipline, 
            pushBtnTransfer,
            pushBtnTrial,
            pushBtnUnfresh,
            discCommunication
        } = this.props;
        const week = [0,1,2,3,4,5,6]

        this.props.onGetStudentsSchedule(id, newStart, newEnd, currDiscipline.code)
           
        if (pushBtnTransfer && discCommunication.hasOwnProperty(currDiscipline.code)) {       
            this.props.onGetTheMasterInterval(newStart, newEnd, discCommunication[currDiscipline.code].idMaster, week, isAdmin)
        }
        if(pushBtnUnfresh || pushBtnTrial){
            this.props.getAvailableInterval(newStart, newEnd, currDiscipline.code,isAdmin)
        }
    }

    fetchTrainerDateChange = (newStart, newEnd) => {
        const { currentIdUser: id, isAdmin, 
            currDiscipline, 
            pushBtnTransfer,
            pushBtnTrial,
            pushBtnUnfresh,
            discCommunication
        } = this.props;
        const week = [0,1,2,3,4,5,6]

        this.props.getTrainerTraining(id, newStart, newEnd, currDiscipline.code)

    }



    render() {
        const {startDate, endDate} = this.props;
        const {
            masterList,
            profileStudent,
            isAdmin} = this.props;

        const id = this.getCurrentId();
        let calendar;

        if (isAdmin && !this.isStudentSchedule()) {


            calendar = (<Calendar
                masterList={masterList}
                isAdmin={isAdmin}
                dateChange={this.dateChange}
                currentDate={moment().format('x')}
                startDate={startDate * 1000}
                endDate={endDate * 1000}
                min={this.min * 1000}
                max={this.max * 1000}
            />)
        }
        else { // student
            
            calendar = (<Calendar
                                
                dateChange={this.dateChange}
                currentDate={moment().format('x')}
                startDate={startDate * 1000}
                endDate={endDate * 1000}
                min={this.min * 1000}
                max={this.max * 1000}

                                  
                                  mode = {this.props.mode}
                                                   
                                  currDiscipline = {this.props.currDiscipline}

            />)
        }

        
        let cardTitle = (this.isStudentSchedule() && profileStudent.name) ? "Расписание - "+profileStudent.name : 'Расписание тренировок'

        return (
            <React.Fragment>
                <Card className='card-calendar' title={cardTitle}>
                        {calendar}
                </Card>                

                <ConfirmCreateModal />

                <RemoveTrialTrainingModal />

                <TransferOrFreezeModal />

                <TransferOrNewScheduleModal />
                
                <ListTrainersModal />

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    const {
        currentIdUser,
        pushBtnUnfresh,
        pushBtnTrial,
        pushBtnTransfer
      } = state.scheduleIdParams;

    return {
        currentIdUser,
        //
        masterList: state.admin.masterList,
        startDate: state.training.startDate,
        endDate: state.training.endDate,

        //
        id: state.auth.id,

        pushBtnUnfresh,
        pushBtnTrial,
        pushBtnTransfer,

        profileStudent: state.profileStudent,
        currDiscipline: state.abonement.currDiscipline,

        isAdmin:  state.auth.mode === "admin",
        theMasterInterval: state.student.theMasterInterval,
        mode: state.auth.mode,


        discCommunication: state.student.discCommunication,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //
        onGetStudentsSchedule: (id, start, end, disc) => dispatch(actions.getStudentsSchedule(id, start, end, disc)),
        handleChangeTime: (startDate, endDate) => dispatch(actions.handleChangeTime(startDate, endDate)),
        
        setParamsId: (params) => dispatch(actions.setParamsId(params)),
        
//
        onSetWeekInterval: (interval) => dispatch(actions.setWeekInterval(interval)),
        getAvailableInterval: (start, end, discipline,isAdmin)=>dispatch(actions.getAvailableInterval(start,end,discipline,isAdmin)),

        getTrainerTraining: (id, dateMin, dateMax, codeDisc) => dispatch(actions.getTrainerTraining(id, dateMin, dateMax, codeDisc)),

        onGetDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),

       
        onCheckToken: (idUser) => dispatch(actions.checkToken(idUser)),
       
        onGetFreeAndBusyMasterList: (start, end) => dispatch(actions.getFreeAndBusyMasterList(start, end)),
        onGetTheMasterInterval: (dateStart, dateEnd, idMaster, weekdays, isCallAdmin) => dispatch(actions.getTheMasterInterval(dateStart, dateEnd, idMaster, weekdays, isCallAdmin)),
        
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
