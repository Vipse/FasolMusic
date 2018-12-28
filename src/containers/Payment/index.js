import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPayment from "../../components/CoachPayment";
import StudentPayment from "../../components/StudentPayment";

import {Redirect} from 'react-router-dom'
import TrialTrainModal from './../../components/TrialTrainModal/index';
import moment from 'moment'


class Payment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visibleTrialModal: false,
            redirectToSchedule: false,
            countTraining: 0
        }
    }

    componentDidMount() {

        this.props.onGetDeadlinePay(this.props.id);	
    }
    onSendDataModal = (data) => {

        let array = [];

        let time0 = +data.time[0].format('x')
        let time1 = +data.time[1].format('x')

        for(let i = 0; i < 7; i++){
           
            let time2 = moment(+data.time[0].format('x'))
            let time3 =  moment(+data.time[1].format('x'))

            let time4 = moment(+data.time[0].format('x'))
            let time5 =  moment(+data.time[1].format('x'))


                if(data.selectedDays.hasOwnProperty(i)){
                    array.push(
                        {
                            day: i, 
                            intervals : [{
                                start: +data.time[0].weekday(i+1).format('X'),
                                end: +data.time[1].weekday(i+1).format('X')
                            }
                            // ,
                            // {
                            //     start: +((time2.weekday(i+1)).add(7, 'd').format('X')),
                            //     end: +((time3.weekday(i+1)).add(7, 'd').format('X')),
                            // },
                            // {
                            //     start: +((time4.weekday(i+1)).add(14, 'd').format('X')),
                            //     end: +((time5.weekday(i+1)).add(14, 'd').format('X')),
                            // }
                        ]
                        }
                    )
                        console.log('1 - array :', array);
                    // console.log('WeekDay0" :',data.time[0].weekday(i+1));
                    // let time =  (data.time[0].weekday(i+1)).add(7, 'd')
                    // console.log('WeekDay1" :',time);

                    //console.log("7", data.time[0].day(7));
                } 
                else{
                    array.push(
                        {
                            day: i, 
                            intervals : []
                        }
                    );   
                }
                   
        }
console.log('QQQ array :', array);

        this.setState({visibleTrialModal: true, redirectToSchedule: true});
        this.props.onSetFreeIntervals(array,  data.type);
        //this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: 0});
    }
    showTrialModal = (count) => {
        this.setState({visibleTrialModal: true, countTraining: count})
        this.props.onSetNeedSaveIntervals({visibleTrialModal: true, countTraining: count});
    }
    hideTrialModal = () => {
        this.setState({visibleTrialModal: false})
    }

    render() {
        let {deadlinePay} = this.props;
        let isStudent = this.props.auth.mode === "student";

        return (
            <Hoc>
                {isStudent ? (
                    <StudentPayment
                        showTrialModal = {this.showTrialModal}
                        deadlinePay = {deadlinePay}
                    />)
                    : (<CoachPayment/>)}

                <TrialTrainModal
                    title='Запишись на тренировку'
                    width={770}
                    visible={this.state.visibleTrialModal}
                    onCancel={this.hideTrialModal} 
                    onSave={this.onSendDataModal}
                />

                { this.state.redirectToSchedule ? <Redirect to="/app/schedule"/> : null }
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        profileDoctor: state.profileDoctor,
        profilePatient: state.profilePatient,
        auth: state.auth,
        id: state.auth.id,
		deadlinePay: state.student.deadlinePay,

    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetFreeIntervals: (freeIntervals, type) => dispatch(actions.setFreeIntervals(freeIntervals,type)),
        onSetNeedSaveIntervals: (obj) => dispatch(actions.setNeedSaveIntervals(obj)),
        onGetDeadlinePay: (idStudent) => dispatch(actions.getDeadlinePay(idStudent)),
        
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
/*

export default Payment;*/
