import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import BonusPageStudent from "../../components/BonusPageStudent";
import BonusPageCoach from '../../components/BonusPageCoach';

class Bonus extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    render() {
        let isStudent = this.props.auth.mode === "student";
        return (
            <Hoc>
                {isStudent ? <BonusPageStudent/> : <BonusPageCoach/>}
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
