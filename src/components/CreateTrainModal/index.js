import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import * as actions from '../../store/actions'

import Modal from '../Modal'
import Content from './content'


import './styles.css'

const CreateTrainModal = (props) => {
    const {
        visible_CreateTrainModal_Unfreeze,
        visible_CreateTrainModal_Trial,
        hideCreateTrainModal_clickUnfreeze,
        hideCreateTrainModal_clickTrial} = props;

    let visible = false;
    let type = null;
    let onCancel = () => {}

    if(visible_CreateTrainModal_Unfreeze || visible_CreateTrainModal_Trial){
            visible = true;
    }
    if(visible_CreateTrainModal_Unfreeze) {
        type = 'unfreeze';
        onCancel = hideCreateTrainModal_clickUnfreeze
    }
    else if(visible_CreateTrainModal_Trial) {
        type = 'trial';
        onCancel = hideCreateTrainModal_clickTrial;
    }




    return (
        <Modal title={props.title}
               width={770}
               visible={props.visible}
               onCancel={props.onCancel}
               closable={props.closable}
               //visible={visible}
               //onCancel={onCancel}
        >
             <Content {...props}/>
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

    return {
        visible_CreateTrainModal_Unfreeze: state.modal.visible_CreateTrainModal_Unfreeze,
        visible_CreateTrainModal_Trial: state.modal.visible_CreateTrainModal_Trial,
    
        trialTrainingForDisciplines: state.student.trialTrainingForDisciplines,
        listDisciplines: state.abonement.listDisciplines,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideCreateTrainModal_clickUnfreeze: () => dispatch(actions.hideCreateTrainModal_clickUnfreeze()),
        hideCreateTrainModal_clickTrial: () => dispatch(actions.hideCreateTrainModal_clickTrial()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateTrainModal);
