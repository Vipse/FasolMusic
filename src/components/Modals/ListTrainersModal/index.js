import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import Modal from '../../Modal'
import Content from './content'
import {connect} from 'react-redux';
import * as actions from '../../../store/actions'

import './styles.css'

const ListTrainersModal = (props) => {
    const {visible, hideListTrainersModal, timeClickInAdminSchedule} = props;

    const dateEvent = moment(+timeClickInAdminSchedule * 1000).format('L H:mm'); 

    return (
        <Modal title={`Список коучей - ${dateEvent}`}
               visible={visible}
               onCancel={hideListTrainersModal}
               width={720}
        >
            <Content {...props}/>
        </Modal>
    )
};

const mapStateToProps = state => {
    const {timeClickInAdminSchedule} = state.scheduleIdParams;

    return {
        visible: state.modal.visible_ListTrainersModal,

        freetrainers_listModal: state.admin.freetrainers_listModal,
        busytrainers_listModal: state.admin.busytrainers_listModal,

        timeClickInAdminSchedule
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideListTrainersModal: () => dispatch(actions.hideListTrainersModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTrainersModal);