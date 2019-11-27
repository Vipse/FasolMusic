import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import FreeTrainers from '../../FreeTrainers'

import './style.css'

class AdditionalCalendarInfo extends React.Component {

    render() {
        const {fullInfoMasters, clickedTrainer, pushBtnUnfresh, pushBtnTrial} = this.props;


        return (
            <div className='rbc-smallcalendar-eventwrapper'>
                {fullInfoMasters.length && (pushBtnUnfresh || pushBtnTrial) && !clickedTrainer.id ?
                    <FreeTrainers />
                    :
                    <div className="table-footer wrapper-small-calendar">
                        <div className="type">
                            <div className='type-color-available' />
                            <div className='type-name'>Свободно</div>
                        </div>
                        <div className="type">
                            <div className='type-color-own' />
                            <div className='type-name'>Ваша тренировка</div>
                        </div>
                        <div className="type">
                            <div className='type-color-done' />
                            <div className='type-name'>Проведенная тренировка</div>
                        </div>
                        <div className="type">
                            <div className='type-color-error' />
                            <div className='type-name'>Перенеси тренировку</div>
                        </div>
                        <div className="type">
                            <div className='type-color-bron' />
                            <div className='type-name'>Забронированная тренировка</div>
                        </div>



                    </div>
                }


            </div>
        )
    }
}

const mapStateToProps = state => {
    const {
        pushBtnUnfresh,
        pushBtnTrial,
        clickedTrainer,
    } = state.scheduleIdParams;

    return {
        fullInfoMasters: state.scheduleIdParams.fullInfoMasters,
        clickedTrainer,

        pushBtnUnfresh,
        pushBtnTrial
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFreeAndBusyMasterListOnHour: date => dispatch(actions.getFreeAndBusyMasterListOnHour(date)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdditionalCalendarInfo);
