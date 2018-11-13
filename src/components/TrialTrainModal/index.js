import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const TrialTrainModal = (props) => {
    
    return (
        <Modal title='Запишись на пробную тренировку'
               width={770}
               visible={props.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )
    
}

TrialTrainModal.propTypes = {
    visible: PropTypes.bool,
    subjects: PropTypes.array,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

TrialTrainModal.defaultProps = {
    visible: false,
    subjects: [],
    onSave: () => {},
    onCancel: () => {},
};

export default TrialTrainModal;