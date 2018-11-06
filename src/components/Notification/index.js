import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import Button from '../Button'
import Icon from '../Icon'
import DownloadLink from '../DownloadLink'
import Hoc from '../Hoc'

import './style.css'
import {notificationArr} from './stories/mock-data'

class NotificationItem extends React.Component{
    state = {
        watchInverse: false,
    }

    renderLinks = () =>{
        
        return (
            <div className='notification-links'
                onClick = {e => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
            >
                {this.props.file.map((el,i) => {
                    return (<DownloadLink
                        key={i}
                        btnText={el.btnText ? el.btnText : "undefined name"}
                        href = {el.href ? el.href : ""}
                        size="default"
                        type="link"
                        download
                    />)
                })}
                <Button
                    size='file'
                    type='file'
                    icon='download'
                    iconSize={20}
                    svg
                    title='Скачать всё'
                />
            </div>
        );
    };

    render() { 
       
        const {id, title, desc, time, thisTime, status, watch, getId} = this.props;
        let iconType = 'notification';
        let links;

        switch (status) {
            case 'research':
                iconType = 'order-form';
                break;
            // case 'cancel':
            //     links = this.renderLinks();
            //     break;
        }
    //false   false
        let flag = this.state.watchInverse ? watch : !watch;
        let rootClass = (flag) ? cn( `notification-item` ,`notification-${status}`) : cn( `notification-item` ,`notification-watch`);
        let madeDate = new Date((+thisTime)*1000),
            now = new Date();
        return (
                    <div className={rootClass}
                        onClick={(flag) ? (() => {
                            getId(id);
                            this.setState({watchInverse: true});
                        }) : undefined}
                    >
                        <div className='notification-icon'>
                            <Icon svg type={iconType} size={20} />
                        </div>
                        <div className='notification-row'>
                            <div className='notification-title'>
                                {title}
                                {(status != 'negative' && status != 'research' && time)
                                    ? `- ${moment((+time)*1000).format('HH:mm')}` : ''}
                                </div>
                            {<div className='notification-time'>
                                {(madeDate.getDate() === now.getDate() && madeDate.getMonth() === now.getMonth())
                                    ? moment((+thisTime)*1000).format('HH:mm')
                                    : moment((+thisTime)*1000).format('DD.MM.YY HH:mm')
                                }
                            </div>}
                        </div>
                        <div className='notification-info'>{desc} {moment((+time)*1000).format('DD.MM.YYYY HH:mm')}</div>
                        {links}
                    </div>
        );
    }
}

NotificationItem.propTypes ={
	status: PropTypes.oneOf(['new', 'cancel','research','five','tomorrow', 'negative', 'call','default']),
    title: PropTypes.string,
    time: PropTypes.string,
    thisTime: PropTypes.string,
    desc: PropTypes.string,
    watch: PropTypes.bool, // просмотрена запись - да(true)
    file: PropTypes.array,
    getId: PropTypes.func,
}

NotificationItem.defaultProps = {
    id: 0,
    title: '',
    time: '',
    status: 'default',
    thisTime: '',
    desc: '',
    watch: false,
    file: [],
    getId: () => {},
}

export default NotificationItem
