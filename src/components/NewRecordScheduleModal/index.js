import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const NewRecordScheduleModal = (props) => {
    
    return (
        <Modal title='Записаться на тренировку'
               width={400}
               visible={props.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )
    
}

NewRecordScheduleModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.number,
    patients: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

NewRecordScheduleModal.defaultProps = {
    visible: false,
    date: null,
    patients: [],
    isChoosebleTime: false,
    onSave: () => {},
    onCancel: () => {},
};

export default NewRecordScheduleModal;