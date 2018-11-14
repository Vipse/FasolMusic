import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const RecordCancelModal = (props) => {
    
    return (
        <Modal title="Отмена тренировки"
               width={400}
               visible={props.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )
    
}

RecordCancelModal.propTypes = {
    visible: PropTypes.bool,
    subjects: PropTypes.array,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

RecordCancelModal.defaultProps = {
    visible: false,
    subjects: [],
    onSave: () => {},
    onCancel: () => {},
};

export default RecordCancelModal;