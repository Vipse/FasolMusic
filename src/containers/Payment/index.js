import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import CoachPayment from "../../components/CoachPayment";
import StudentPayment from "../../components/StudentPayment";

class Payment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    render() {
        let isUser = this.props.auth.mode === "user";

        // убрать
        isUser = true;
        return (
            <Hoc>
                {isUser ? (<StudentPayment/>)
                    : (<CoachPayment/>)}
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
