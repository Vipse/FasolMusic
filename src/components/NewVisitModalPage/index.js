import React from 'react'

import Modal from '../Modal'
import Content from './content'
import './styles.css'
import { PropTypes } from 'prop-types';

const NewVisitModalPage = (props) => {
        const {visible, onCancel} = props;
        return (
            <Modal title='Запись на прием'
                   visible={visible}
                   onCancel={onCancel}
            >
                <Content {...props}/>
            </Modal>
        )

};

NewVisitModalPage.propTypes = {
    visible: PropTypes.bool,
    students: PropTypes.array,
    intervals: PropTypes.array,
    userName: PropTypes.string,
    availableIntervals: PropTypes.array,
    submitSuccess: PropTypes.bool,

    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onChangeDate: PropTypes.func,
};

NewVisitModalPage.defaultProps = {
    visible: false,
    students: [],
    intervals: [],
    userName: '',
    availableIntervals: [],
    submitSuccess: true,

    onSave: () => {},
    onCancel: () => {},
    onChangeDate: () => {},
};

export default NewVisitModalPage;
