import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'
import moment from "moment";

const AdminCreateTrainingModal = (props) => {

    return (
        <Modal title={props.params.item ? moment(props.params.item.timestamp * 1000).format('HH:mm DD.MM.YYYY') : ''}
               width={500}
               visible={props.params.visible}
               onCancel={props.onCancel}
        >
             <Content {...props}/>
        </Modal>
        )

}

AdminCreateTrainingModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.number,
    students: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

AdminCreateTrainingModal.defaultProps = {
    visible: false,
    date: null,
    students: [],
    isChoosebleTime: false,
    onSave: () => {},
    onCancel: () => {},
};

export default AdminCreateTrainingModal;
