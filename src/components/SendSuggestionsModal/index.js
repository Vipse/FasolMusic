import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const SendSuggestionsModal = (props) => {
    
    return (
        <Modal title='Предложения по улучшению'
               width={450}
               visible={props.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )
    
};

SendSuggestionsModal.propTypes = {
    visible: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
};

SendSuggestionsModal.defaultProps = {
    visible: false,
    onSubmit: () => {},
    onCancel: () => {}
};

export default SendSuggestionsModal;