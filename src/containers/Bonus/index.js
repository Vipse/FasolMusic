import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import BonusPage from "../../components/BonusPage";

class Bonus extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    render() {
        let isUser = this.props.auth.mode === "user";
        return (
            <Hoc>
                {isUser ? (<p>Unavailable</p>)
                    : (<BonusPage/>)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Bonus);
/*

export default Payment;*/
