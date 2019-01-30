import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const CompletionTrainingModal = (props) => {
    const {visible, onCancel} = props;

    return (
        <Modal title='Завершение тренировки'
               visible={visible}
               onCancel={onCancel}
        >
            <Content {...props}/>
        </Modal>
    )

}

CompletionTrainingModal.propTypes = {
    visible: PropTypes.bool,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
};

CompletionTrainingModal.defaultProps = {
    visible: false,
    onComplete: () => {},
    onCancel: () => {},
};

export default CompletionTrainingModal;