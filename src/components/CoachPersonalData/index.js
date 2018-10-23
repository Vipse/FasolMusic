import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import CoachPersonalContactItem from '../CoachPersonalContactItem'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import {message} from "antd";

class CoachPersonalData extends React.Component{

    render(){
        const rootClass = cn('personal-data');
        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <CoachPersonalContactItem
                        profileDoctor={this.props.profileDoctor}
                        onSubmit={this.props.onSubmit}
                        onSubmitPassword={this.props.onSubmitPassword}
                        onDeleteAvatar={this.props.onDeleteAvatar}
                    />
                </Card>
            </div>
        )
    }
}

CoachPersonalData.propTypes = {
    profileDoctor: PropTypes.object,
    onSubmit: PropTypes.func
};

CoachPersonalData.defaultProps = {
    profileDoctor: {},
    onSubmit: () => {}
};

export default CoachPersonalData
