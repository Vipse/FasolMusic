import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPayment from "../../components/CoachPayment";
import StudentPayment from "../../components/StudentPayment";

import TrialTrainModal from './../../components/TrialTrainModal/index';

class Payment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visibleTrialModal: false
        }
    }

    onSendDataModal = (data) => {
        let array = [];
        for(let i = 0; i < 7; i++){
            
            if(data.selectedDays.hasOwnProperty(i)){
                array.push(
                    {
                        day: i, 
                        intervals : [{
                            start: +data.time[0].format('x'),
                            end: +data.time[1].format('x')
                        }]
                    }
                );   
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
        console.log('array :', array);
    }
    showTrialModal = () => {
        this.setState({visibleTrialModal: true})
    }
    hideTrialModal = () => {
        this.setState({visibleTrialModal: false})
    }

    render() {
        let isUser = this.props.auth.mode === "user";

        // убрать
        isUser = true;
        return (
            <Hoc>
                {isUser ? (
                    <StudentPayment
                        showTrialModal = {this.showTrialModal}
                    />)
                    : (<CoachPayment/>)}

                <TrialTrainModal  
                    title='Запишись на пробную тренировку'
                    width={770}
                    visible={this.state.visibleTrialModal}
                    onCancel={this.hideTrialModal} 
                    onSave={this.onSendDataModal}
                />
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        profileDoctor: state.profileDoctor,
        profilePatient: state.profilePatient,
        auth: state.auth,
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
/*

export default Payment;*/
