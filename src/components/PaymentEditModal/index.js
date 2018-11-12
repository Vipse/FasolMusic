import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const PaymentEditModal = (props) => {
    
    return (
        <Modal title='Данные карты'
               visible={props.visible}
               onCancel={props.onCancel}
                >
             <Content {...props}/>
        </Modal>
        )
    
}

PaymentEditModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.number,
    patients: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

PaymentEditModal.defaultProps = {
    visible: false,
    date: null,
    patients: [],
    isChoosebleTime: false,
    onSave: () => {},
    onCancel: () => {},
};

export default PaymentEditModal;