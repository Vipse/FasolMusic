import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../../Modal'
import Content from './content'
import {connect} from 'react-redux';
import * as actions from '../../../store/actions'

import './styles.css'

const TransferOrNewScheduleModal = (props) => {
    const {visible, hideTransferOrNewScheduleModal} = props;

    const params = {onCancel: hideTransferOrNewScheduleModal};

    return (
        <Modal width={450}
               centered
               title='Сообщение'
               visible={visible}
               onCancel={hideTransferOrNewScheduleModal}
        >
            <Content 
                {...props}
                {...params}
            />
        </Modal>
    )
};

const mapStateToProps = state => {
    const {
        currentIdUser,
        clickedIdEvent,
        timeClickFreeEvent
    } = state.scheduleIdParams;

    return {
        currentIdUser,
        visible: state.modal.visible_TransferOrNewScheduleModal,
        isAdmin:  state.auth.mode === "admin",

        currDiscipline: state.abonement.currDiscipline,
        discCommunication: state.student.discCommunication,
        timeClickFreeEvent,
        clickedIdEvent,

        startDate: state.training.startDate,
        endDate: state.training.endDate,



       

        
        // currDiscipline: state.abonement.currDiscipline,

        // currentIdUser,
        // crossCurrentIdTraining,
        // crossCurrendIdSubscription,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideTransferOrNewScheduleModal: () => dispatch(actions.hideTransferOrNewScheduleModal()),
        transferTrainining: ({idTraining, idMaster, dateStart}, isCallAdmin) => 
            dispatch(actions.transferTrainining({idTraining, idMaster, dateStart}, isCallAdmin)),
        
        getStudentsSchedule: (id, start, end, disc) => dispatch(actions.getStudentsSchedule(id, start, end, disc)),
    




        // freezeAbonement: (id) => dispatch(actions.freezeAbonement(id)),
        // getUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),
        // getDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
        // getSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferOrNewScheduleModal);