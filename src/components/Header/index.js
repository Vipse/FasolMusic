import React from 'react';
import PropTypes from 'prop-types'

import Button from '../Button'
import Icon from '../Icon'
import NotificationApp from '../NotificationApp'
import AutoComplete from '../AutoComplete'

import './style.css'
import '../../icon/style.css'


class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }

render() {
    const {notifications, isUser} = this.props;
        return (
            <div className='header'>
                <div className='header-search'>
                    <AutoComplete
                        onAdd = {this.props.onAdd}
                        onDelete = {this.props.onDelete}
                        onGoto = {this.props.onGoto}
                        findName= {this.props.findName}
                        data={this.props.data}
                        isUser = {isUser}
                    />
                </div>
                <div className='header-train'>
                    {isUser ?
                        <React.Fragment>
                            <Button btnText='ЭКСТРЕННЫЙ ВЫЗОВ'
                                size='small'
                                type='emergensy'
                                icon='emergency-call'
                                onClick = {() => this.setState({emergencyVisit: true})}/>
                            <Button btnText='ЗАПИСАТЬСЯ НА ПРИЕМ'
                                onClick={this.handleClick}
                                size='small'
                                type='float'
                                icon='form'/>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Button
                                btnText='ДОБАВИТЬ ТРЕНИРОВКУ'
                                size='default'
                                type='border-pink'
                                className="header-btn"
                            />
                            <Button
                                btnText='ПЕРЕНЕСТИ ТРЕНИРОВКУ'
                                size='default'
                                type='border-pink'
                                className="header-btn header-btn-transfer"
                            />
                        </React.Fragment>
                    }
                </div>
                <div className='header-notification'>
                    <NotificationApp
                        data={notifications}
                        getNotifications={this.props.getNotifications}
                        getId={this.props.getNotifId}>
                         <Icon
                            svg
                            type='notification'
                            size={20}
                            title='Уведомления'
                        />
                    </NotificationApp>
                </div>
                <div className='header-exit'>
                    <Button
                        btnText=''
                        size='icon'
                        type='icon'
                        icon='exit'
                        iconSize={20}
                        svg
                        title='Выход'
                        onClick={this.props.logout}
                    />
                </div>
            </div>
        )
    }
}

Header.propTypes = {
    notifications: PropTypes.array,
    logout: PropTypes.func,
    isUser: PropTypes.bool,

};

Header.defaultProps = {
    notifications: [],
    logout: () => {},
    isUser: false,
};

export default Header
