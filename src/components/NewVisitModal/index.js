import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import Content from './content'
import './styles.css'

const NewVisitModal = (props) => {

    return (
        <Modal title='Запись на прием'
               visible={props.visible}
               onCancel={props.onCancel}
                >
             <Content {...props}/>
        </Modal>
        )

}

NewVisitModal.propTypes = {
    visible: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
    students: PropTypes.array,
    isChoosebleTime: PropTypes.bool,
    intervals: PropTypes.array,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
};

NewVisitModal.defaultProps = {
    visible: false,
    date: null,
    students: [],
    isChoosebleTime: false,
    intervals: [],
    onSave: () => {},
    onCancel: () => {},
};

export default NewVisitModal;
