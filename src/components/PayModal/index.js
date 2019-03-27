import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const PayModal = (props) => {

    return (
        <Modal title='Оплата'
               visible={props.visible}
               onCancel={props.onCancel}
                >
             <Content {...props}/>
        </Modal>
        )

}

PayModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.number,
    students: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

PayModal.defaultProps = {
    visible: false,
    date: null,
    students: [],
    isChoosebleTime: false,
    onSave: () => {},
    onCancel: () => {},
};

export default PayModal;
