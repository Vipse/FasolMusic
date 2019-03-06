import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../Modal'
import './styles.css'
import Button from '../Button';

class NewModalSaveSchedule extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return (

            <Modal
                title='Запись на тренировку'
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                width={360}
                className="schedule-message-modal-wrapper"
            >
                    <div className="schedule-message-modal">
                            <div className="schedule-message-btn">
                                <Button btnText='Сохранить и закончить'
                                    onClick= {this.props.save}
                                    type='yellow'/>
                                    
                            </div>
                            <div className="schedule-message-btn">
                                <Button btnText='Продолжить'
                                    onClick= {this.props.onCancel}
                                    type='yellow'/>
                                    
                            </div>
                    </div>
            </Modal>
            )
    }

}

NewModalSaveSchedule.propTypes = {
    //visible: PropTypes.bool,
};

NewModalSaveSchedule.defaultProps = {
    //visible: false,
};

export default NewModalSaveSchedule;