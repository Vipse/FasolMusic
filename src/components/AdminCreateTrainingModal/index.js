import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const AdminCreateTrainingModal = (props) => {
    
    return (
        <Modal title='Быстрая регистрация'
               width={400}
               visible={props.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )
    
}

AdminCreateTrainingModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.number,
    patients: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

AdminCreateTrainingModal.defaultProps = {
    visible: false,
    date: null,
    patients: [],
    isChoosebleTime: false,
    onSave: () => {},
    onCancel: () => {},
};

export default AdminCreateTrainingModal;