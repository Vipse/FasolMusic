
import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import BonusPage from "../../components/BonusPage";

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
                {isStudent ?
                    (<BonusPage/>) :
                    (<h3 style={{textAlign: "center"}}>В разработке</h3>)}
            </Hoc>
        )
        // return (
        //     <Hoc>
        //         {isStudent ?
        //             (<BonusPage/>) :
        //             (<h3 style={{textAlign: "center"}}>В разработке</h3>)}
        //     </Hoc>
        // )
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
