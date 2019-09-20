import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './style.css'

const NewTrialTrainingModal = (props) => {
    const {visible, onCancel, onSave} = props;

    return (
        <Modal title='Отлично! Ты назначил тренировку'
               width={600}
               visible={visible}
               onCancel={onCancel}
               onSave={onSave}
        >
            <Content {...props}/>
        </Modal>
    )

}

NewTrialTrainingModal.propTypes = {
    visible: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onExit: PropTypes.func,
};

NewTrialTrainingModal.defaultProps = {
    visible: false,
    onSave: () => {},
    onCancel: () => {},
};

export default NewTrialTrainingModal;