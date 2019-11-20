import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as actions from '../../../store/actions'

import './style.css'

class AdminEvent extends React.Component{

    render() {
        const {event, date, getFreeAndBusyMasterListOnHour} = this.props;
        const {busytrainers, freetrainers} = event;

        const backgroundColor = '#21bedd';

        return (
            <div className="list-slot" style={{ backgroundColor }} onClick={() => getFreeAndBusyMasterListOnHour(date)}>
                <div>
                    <p className="list-slot-text" >
                        {freetrainers ? `с-${freetrainers}` : null}
                        {busytrainers ? ` з-${busytrainers}` : null}
                    </p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFreeAndBusyMasterListOnHour: date => dispatch(actions.getFreeAndBusyMasterListOnHour(date)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminEvent);
