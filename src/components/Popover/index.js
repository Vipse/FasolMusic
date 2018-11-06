import React from 'react';
import PropTypes from 'prop-types'
import PopoverBody from '../PopoverBody'

import {Popover} from 'antd';

import './style.css'
import PatientCalendarPopover from "../PatientCalendarPopover";

class PopoverApp extends React.Component {

    state = {
        visible: false,
    };

    handleVisibleChange = (visible) => {
        this.setState({visible});
    };

    handleClose = () => {
        this.props.onClose();
        this.setState({visible: false})
    };

    handleEmail = () => {
        this.props.onEmail();
        this.setState({visible: false})
    };

    render() {
        //console.log(...this.props.data)
        //console.log(this.props.data)

        return (

            <Popover
                content={this.props.isUser ?
                    <PatientCalendarPopover
                        calendarItem={this.props.events}
                        cancelAppByPatient = {this.props.cancelAppByPatient}
                    />
                    :
                    <PopoverBody
                        {...this.props.data}
                        onClose={this.handleClose}
                        onEmail={this.handleEmail}
                        onGoto={this.props.onGoto}
                    />}
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                placement="rightTop"
            >
                {this.props.children}
            </Popover>
        );
    }
}


PopoverApp.propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func,
    onEmail: PropTypes.func,
    onPhone: PropTypes.func,
};

PopoverApp.defaultProps = {
    data: {},
    onClose: () => {
    },
    onEmail: () => {
    },
    onPhone: () => {
    },
};

export default PopoverApp
