import React from 'react';
import PropTypes from 'prop-types'

import Card from '../Card'
import Button from '../Button'
import './style.css'
import '../../icon/style.css'
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import {message} from "antd";
import {Modal} from "antd";

class ClearBooking extends React.Component {


    handleModalClear = (e,id) => {
       
        e.preventDefault();
         Modal.warning({
            title: 'Внимание',
            width: '500px',
            className: 'quick-modal',
            content: 'Вы действительно хотите удалить ВСЕ брони студента?',
            maskClosable: true,
            okText: 'Удалить',
            onOk: () => this.props.clearAllBookingTrainings(id)
        }); 
    }

    render() {

        let {id} = this.props;
        
        return (
            <Card title="Удаление броней ">
                    <div className="profile-card-clearBooking">
                        <Button onClick={e =>{this.handleModalClear(e,id)}}
                        btnText='Удалить все брони'
                        size='default'
                        type='light-blue'
                        />
                    </div>
            </Card>
        )
    }
}


export default ClearBooking
