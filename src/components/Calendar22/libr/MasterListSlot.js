import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Icon from './../../Icon/index';



class MasterListSlot extends Component {
    constructor(props) {
        super(props);
    };

    showTransferEvent = () => {
        this.props.showTransferEvent(this.props.event.id);
    }

    showModalMasterList = () => {
        const { freetrainers, busytrainers, value } = this.props;
        this.props.showMasterList(freetrainers, busytrainers, value)
    }

    render() {
        const {
            freetrainers,
            busytrainers,
            value,
        } = this.props;

        let backgroundColor = '#21bedd';  // бронированные тренировки


        
        let children = '';
        if(Array.isArray(freetrainers) && Array.isArray(busytrainers)){
            children += freetrainers.length ? '(с) '+ freetrainers.length + ' - ': '(с) 0 - ';
            children += busytrainers.length ? '(з) '+ busytrainers.length : '(з) 0';
        }

        return (
            <div key = {value} className="list-slot" style={{backgroundColor}} onClick={this.showModalMasterList}>
                    <div>
                        <p className="list-slot-text" >
                            {children}
                        </p>
                    </div>
            </div>
        )
        
    }
}



MasterListSlot.propTypes = {
    masterList : PropTypes.object,
     showTransferEvent : PropTypes.func,
     freeTrainers: PropTypes.object,
     idEvent: PropTypes.number,
  }
  
  MasterListSlot.defaultProps = {
      freeTrainers: null,
      showTransferEvent: () => {},
  }

  export default MasterListSlot