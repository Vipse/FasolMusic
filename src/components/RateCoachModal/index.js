import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const RateCoachModal = (props) => {
    const {visible, onCancel} = props;

    return (
        <Modal title='Оценить препода'
               width={400}
               visible={visible}
               onCancel={onCancel}
        >
            <Content {...props}/>
        </Modal>
    )

}

RateCoachModal.propTypes = {
    visible: PropTypes.bool,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
};

RateCoachModal.defaultProps = {
    visible: false,
    onComplete: () => {},
    onCancel: () => {},
};

export default RateCoachModal;