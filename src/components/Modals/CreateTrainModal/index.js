import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import * as actions from '../../../store/actions'

//import Modal from '../../Modal'
import Content from './content'
import {Modal} from 'antd'


import './styles.css'

const CreateTrainModal = (props) => {
    const {
        visible_CreateTrainModal_Unfreeze,
        visible_CreateTrainModal_Trial,
        hideCreateTrainModal_clickUnfreeze,
        hideCreateTrainModal_clickTrial} = props;

    let visible = false;
    let title = null;
    let onCancel = () => {}

    if(visible_CreateTrainModal_Unfreeze || visible_CreateTrainModal_Trial){
            visible = true;
    }
    if(visible_CreateTrainModal_Unfreeze) {
        title = 'Создание абонемента (разморозка)';
        onCancel = hideCreateTrainModal_clickUnfreeze
    }
    else if(visible_CreateTrainModal_Trial) {
        title = 'Запишись на пробную тренировку';
        onCancel = hideCreateTrainModal_clickTrial;
    }

    const params = {closeModal: onCancel};


    return (
        <Modal title={title}
               width={770}
               centered
               footer={null}
               visible={visible}
               onCancel={onCancel}
        >
            <Content 
                {...params}
                {...props}
            />
        </Modal>
    )
}

CreateTrainModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.number,
    students: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    unauthorized: PropTypes.bool,
    closable: PropTypes.bool,
    trial: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

CreateTrainModal.defaultProps = {
    visible: false,
    date: null,
    students: [],
    isChoosebleTime: false,
    unauthorized: false,
    closable: true,
    trial: false,
    onSave: () => {},
    onCancel: () => {},
};

const mapStateToProps = state => {
    const {
        currentIdUser
    } = state.scheduleIdParams;

    return {
        currentIdUser,
        isAdmin:  state.auth.mode === "admin",
        visible_CreateTrainModal_Unfreeze: state.modal.visible_CreateTrainModal_Unfreeze,
        visible_CreateTrainModal_Trial: state.modal.visible_CreateTrainModal_Trial,
    
        isPushBtnUnfresh: state.student.isPushBtnUnfresh,
        isPushBtnTrialTraining: state.student.isPushBtnTrialTraining,

        
        listDisciplines: state.abonement.listDisciplines,
        startDate: state.training.startDate,
        endDate: state.training.endDate,

        useFrozenTraining: state.student.useFrozenTraining,
        discCommunication: state.student.discCommunication,
        subsForDisc : state.abonement.subsForDisc,

        // to format available discipline
        trialTrainingForDisciplines: state.student.trialTrainingForDisciplines,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getStudentsSchedule: (id, start, end, disc) => dispatch(actions.getStudentsSchedule(id, start, end, disc)),
        getCountTrainingByDiscipline: (id, disc) => dispatch(actions.getCountTrainingByDiscipline(id, disc)),
        
        addAmountTraining: (idSubscription, addAmount) => dispatch(actions.addAmountTraining(idSubscription, addAmount)),
        editUseFrozenTraining: (idStudent, amount) => dispatch(actions.editUseFrozenTraining(idStudent, amount)),
        
        setParamsId: (params) => dispatch(actions.setParamsId(params)),
        getAvailableInterval: (start, end, discipline, isAdmin)=>dispatch(actions.getAvailableInterval(start, end,discipline,isAdmin)),

        hideCreateTrainModal_clickUnfreeze: () => dispatch(actions.hideCreateTrainModal_clickUnfreeze()),
        hideCreateTrainModal_clickTrial: () => dispatch(actions.hideCreateTrainModal_clickTrial()),
    
        changeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateTrainModal);
