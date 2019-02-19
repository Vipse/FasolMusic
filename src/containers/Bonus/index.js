import React from 'react'

import Hoc from '../../hoc'
import {connect} from "react-redux";
import * as actions from '../../store/actions';

import BonusPageStudent from "../../components/BonusPageStudent";
import BonusPageCoach from '../../components/BonusPageCoach';

class Bonus extends React.Component{
    render() {
        const {promoList} = this.props;
        let isStudent = this.props.auth.mode === "student";
        return (
            <Hoc>
                {isStudent ?
                    <BonusPageStudent
                        onGetPromoList={() => this.props.onGetPromoList(1003)}
                        promoList={promoList}
                    />
                    : <BonusPageCoach
                        onGetPromoList={() => this.props.onGetPromoList(1002)}
                        promoList={promoList}
                    />}
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        promoList: state.loading.promoList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetPromoList: (id) => dispatch(actions.getPromoList(id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Bonus);
