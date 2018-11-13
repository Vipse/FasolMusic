import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const RecordCompleteModal = (props) => {
    
    return (
        <Modal title='Спасибо!'
               width={400}
               visible={props.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )
    
}

RecordCompleteModal.propTypes = {
    visible: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

RecordCompleteModal.defaultProps = {
    visible: false,
    onSave: () => {},
    onCancel: () => {},
};

export default RecordCompleteModal;