import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const ChangePasswordModal = (props) => {
    
    return (
        <Modal title='Сменить пароль'
               width={450}
               visible={props.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )
    
};

ChangePasswordModal.propTypes = {
    visible: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
};

ChangePasswordModal.defaultProps = {
    visible: false,
    onSubmit: () => {},
    onCancel: () => {}
};

export default ChangePasswordModal;