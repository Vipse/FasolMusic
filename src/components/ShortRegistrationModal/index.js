import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const ShortRegistrationModal = (props) => {

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

ShortRegistrationModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.number,
    students: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

ShortRegistrationModal.defaultProps = {
    visible: false,
    date: null,
    students: [],
    isChoosebleTime: false,
    onSave: () => {},
    onCancel: () => {},
};

export default ShortRegistrationModal;
