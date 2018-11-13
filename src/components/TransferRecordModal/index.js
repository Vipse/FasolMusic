import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const TransferRecordModal = (props) => {
    
    return (
        <Modal title="Перенос тренировки"
               width={400}
               visible={props.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )
    
}

TransferRecordModal.propTypes = {
    visible: PropTypes.bool,
    subjects: PropTypes.array,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

TransferRecordModal.defaultProps = {
    visible: false,
    subjects: [],
    onSave: () => {},
    onCancel: () => {},
};

export default TransferRecordModal;