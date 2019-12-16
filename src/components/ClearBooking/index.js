import React from 'react';
import PropTypes from 'prop-types'

import Card from '../Card'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import {connect} from 'react-redux';
import { message } from "antd";
import { Modal } from "antd";

class ClearBooking extends React.Component {


    handleModalClear = (e, id) => {
        e.preventDefault();

        const { startDate, endDate } = this.props
        Modal.warning({
            title: 'Внимание',
            width: '500px',
            className: 'quick-modal',
            content: 'Вы действительно хотите удалить ВСЕ брони студента?',
            maskClosable: true,
            okText: 'Удалить',
            onOk: () => {
                this.props.clearAllBookingTrainings(id)
                    .then(() => message.success('Брони удалены. Перезагрузите страницу'))
                    .then(() => this.props.getSchedule(startDate, endDate))
            }
        });
    }

    render() {

        let { id } = this.props;

        return (
            <Card title="Удаление броней ">
                <div className="profile-card-clearBooking">
                    <Button onClick={e => { this.handleModalClear(e, id) }}
                        btnText='Удалить все брони'
                        size='default'
                        type='light-blue'
                    />
                </div>
            </Card>
        )
    }
}

const mapStateToProps = state => {

    return {

        startDate: state.training.startDate,
        endDate: state.training.endDate,
    }
}
const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ClearBooking)
