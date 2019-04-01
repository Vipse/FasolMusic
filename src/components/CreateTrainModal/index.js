import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const CreateTrainModal = (props) => {

    return (
        <Modal title={props.title}
               width={770}
               visible={props.visible}
               onCancel={props.onCancel}
               closable={props.closable}
        >
             <Content {...props}/>
        </Modal>
        )

}

CreateTrainModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.number,
    students: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    unauthorized: PropTypes.bool,
    closable: PropTypes.bool,
    trial: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

CreateTrainModal.defaultProps = {
    visible: false,
    date: null,
    students: [],
    isChoosebleTime: false,
    unauthorized: false,
    closable: true,
    trial: false,
    onSave: () => {},
    onCancel: () => {},
};

export default CreateTrainModal;
