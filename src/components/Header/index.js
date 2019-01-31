import React from 'react';
import PropTypes from 'prop-types'

import Button from '../Button'
import Icon from '../Icon'
import NotificationApp from '../NotificationApp'
import AutoComplete from '../AutoComplete'

import './style.css'
import '../../icon/style.css'


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {notifications, isStudent, findName, authMode, searchData, onGoto, frozenTraining} = this.props;
        return (
            <div className='header'>
                <div className='header-search'>
                    <AutoComplete
                        findName={findName}
                        authMode={authMode}
                        data={searchData}
                        onGoto={onGoto}
                    />
                </div>
                {isStudent ? <div className="header-balance"><span>Баланс {frozenTraining}</span></div> : null }
                <div className='header-train'>
                    {isStudent ?
                        <React.Fragment>
                            <Button
                                btnText='ДОБАВИТЬ ТРЕНИРОВКУ'
                                size='default'
                                type='border-pink'
                                className="header-btn"
                                onClick={this.props.isPushBtnAdd}
                            />
                            <Button
                                btnText='ПЕРЕНЕСТИ ТРЕНИРОВКУ'
                                size='default'
                                type='border-pink'
                                className="header-btn header-btn-transfer"
                                onClick={this.props.isPushBtnTransfer}
                            />
                        </React.Fragment> : null
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
    isStudent: PropTypes.bool,
};

Header.defaultProps = {
    notifications: [],
    logout: () => {},
    isStudent: false,
};

export default Header
