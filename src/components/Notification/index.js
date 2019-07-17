import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import Button from '../Button'
import Icon from '../Icon'
import DownloadLink from '../DownloadLink'

import './style.css'

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
                }) }
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
       
        const {id, title, desc, time, thisTime, status, watch, idTo, nameTo} = this.props;
        let iconType = 'notification';
        let links;

        switch (status) {
            case 'newtsubscription':
                iconType = 'notification-email';
                break;
            case 'newtraining':
                iconType = 'notification-email';
                break;
            case 'next':
                iconType = 'notification-calendar';
                break;
            case 'nextpay':
                iconType = 'notification-payment';
                break;
            case 'canceltraining':
                iconType = 'notification-calendar_canceled';
                break;
            case 'newmessage':
                iconType = 'notification-email';
                break;
            case 'transfertraining':
                iconType = 'notification-calendar';       
                break;
            case 'scheduleChanged':
                iconType = 'notification-calendar';       
                break;
        }

        let flag = this.state.watchInverse ? watch : !watch;
        let rootClass = (flag) ? cn( `notification-item` ,`notification-${status}`) : cn( `notification-item` ,`notification-watch`);
        let madeDate = new Date((+thisTime)*1000);
        let now = new Date();


        return (
                    <div className={rootClass}
                        onClick={(flag) ? (() => {
                            this.props.getId(id);
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
                                    ? ` — ${moment((+time)*1000).format('HH:mm')}` : ''}
                            </div>


                            {<div className='notification-time'>
                                {(madeDate.getDate() === now.getDate() && madeDate.getMonth() === now.getMonth())
                                    ? moment((+thisTime)*1000).format('HH:mm')
                                    : moment((+thisTime)*1000).format('DD.MM.YY HH:mm')
                                }
                            </div>}
                        </div>
                        <div className='notification-info'>{desc} {moment((+time)*1000).format('DD.MM.YYYY HH:mm')}</div>
                        { nameTo && <div className='notification-info-nameTo'>{nameTo}</div>}
                        {links}
                    </div>
        );
    }
}

NotificationItem.propTypes ={
    title: PropTypes.string,
    time: PropTypes.string,
    thisTime: PropTypes.string,
    desc: PropTypes.string,
    watch: PropTypes.bool, // просмотрена запись - да(true)
    file: PropTypes.array,
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
}

export default NotificationItem
