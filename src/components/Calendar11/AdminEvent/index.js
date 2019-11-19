import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as actions from '../../../store/actions'

import './style.css'

class AdminEvent extends React.Component{

    showTransferEvent = () => {
        this.props.showTransferEvent(this.props.event.id);
    }

    render() {
        const {event, showListTrainersModal} = this.props;
        const {busytrainers, freetrainers} = event;
        const backgroundColor = '#21bedd';

        return (
            <div className="list-slot" style={{ backgroundColor }} onClick={showListTrainersModal}>
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
        showListTrainersModal: () => dispatch(actions.showListTrainersModal())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminEvent);
