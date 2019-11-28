import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../../Modal'
import Content from './content'
import {connect} from 'react-redux';
import * as actions from '../../../store/actions'

import './styles.css'

const TransferOrFreezeModal = (props) => {
    const {visible, hideTransferOrFreezeModal} = props;

    const params = {onCancel: hideTransferOrFreezeModal};

    return (
        <Modal width={450}
               centered
               title='Сообщение'
               visible={visible}
               onCancel={hideTransferOrFreezeModal}
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
        crossCurrentIdTraining, 
        crossCurrendIdSubscription
    } = state.scheduleIdParams;

    return {
        visible: state.modal.visible_TransferOrFreezeModal,
        isAdmin:  state.auth.mode === "admin",

        startDate: state.training.startDate,
        endDate: state.training.endDate,
        currDiscipline: state.abonement.currDiscipline,

        currentIdUser,
        crossCurrentIdTraining,
        crossCurrendIdSubscription,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideTransferOrFreezeModal: () => dispatch(actions.hideTransferOrFreezeModal()),
        
        transferTraininingToEnd: (training, isCallAdmin) => dispatch(actions.transferTraininingToEnd(training, isCallAdmin)),
        getStudentsSchedule: (id, start, end, disc) => dispatch(actions.getStudentsSchedule(id, start, end, disc)),
    
        freezeAbonement: (id) => dispatch(actions.freezeAbonement(id)),
        getUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),
        getDisciplineCommunication: (idStudent) => dispatch(actions.getDisciplineCommunication(idStudent)),
        getSubscriptionsByStudentId: (idStudent) => dispatch(actions.getSubscriptionsByStudentId(idStudent)),
        getCountTrainingByDiscipline: (currentIdUser, codeDisc) => dispatch(actions.getCountTrainingByDiscipline(currentIdUser, codeDisc)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferOrFreezeModal);