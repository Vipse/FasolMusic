import React from 'react'
import PropTypes from 'prop-types'

import {Modal} from 'antd'
import Content from './content'
import {connect} from 'react-redux';
import * as actions from '../../../store/actions'

import './styles.css'

const RemoveTrialTrainingModal = (props) => {
    const {visible, hideRemoveTrialTrainingModal} = props;
    const params = {
        onCancel: hideRemoveTrialTrainingModal
    }

    return (
        <Modal title='Сообщение'
               visible={visible}
               onCancel={hideRemoveTrialTrainingModal}
               width={360}
               centered
               footer={null}
        >
            <Content 
                {...params}
                {...props}
               
            />
        </Modal>
    )
};

const mapStateToProps = state => {
    const {
        currentIdUser,
        crossCurrentIdTrialTraining
    } = state.scheduleIdParams;

    return {
        currentIdUser,
        isAdmin:  state.auth.mode === "admin",
        visible: state.modal.visible_RemoveTrialTrainingModal,
        currDiscipline: state.abonement.currDiscipline,

        startDate: state.training.startDate,
        endDate: state.training.endDate,

        crossCurrentIdTrialTraining
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getStudentsSchedule: (id, start, end, disc) => dispatch(actions.getStudentsSchedule(id, start, end, disc)),
        removeTrialTraining: (idTraining, isAdmin) => dispatch(actions.removeTrialTraining(idTraining, isAdmin)),

        getTrainingsTrialStatus: (idStudent) => dispatch(actions.getTrainingsTrialStatus(idStudent)),
        getTrainingTrialStatusByDiscipline: (discipline, idStudent) => dispatch(actions.getTrainingTrialStatusByDiscipline(discipline, idStudent)),

        getCountTrainingByDiscipline: (currentIdUser, codeDisc) => dispatch(actions.getCountTrainingByDiscipline(currentIdUser, codeDisc)),

        hideRemoveTrialTrainingModal: () => dispatch(actions.hideRemoveTrialTrainingModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoveTrialTrainingModal);