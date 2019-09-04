import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './style.css'

class AdminEvent extends React.Component{

    showTransferEvent = () => {
        this.props.showTransferEvent(this.props.event.id);
    }

    showModalMasterList = () => {
        // const { freetrainers = [], busytrainers = []} = this.props.event;
        // this.props.showMasterList(freetrainers, busytrainers)
    }

    render() {
        const {event} = this.props;
        let backgroundColor = '#21bedd';

        return (
            <div className="list-slot" style={{ backgroundColor }} onClick={this.showModalMasterList}>
                <div>
                    <p className="list-slot-text" >
                        (с){event.freetrainers ? event.freetrainers.length : ''}
                        {event.busytrainers ? '-(з)' + event.busytrainers.length : ''}
                    </p>
                </div>
            </div>
        )
    }
}

AdminEvent.propTypes = {
};

AdminEvent.defaultProps = {
};

export default AdminEvent;
