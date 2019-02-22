import React from 'react';
import PropTypes from 'prop-types'
import Card from '../Card'
import NotificationItem from '../Notification'

import './style.css'
import PerfectScrollbar from "react-perfect-scrollbar";

class NotificationCard extends React.Component{
    constructor(props) {
        super(props);
    }

    notificationRender = (dataArr) => {
        let notificationArr = [];
        
        dataArr.map((item, index) => {
            
            notificationArr.push(
                <NotificationItem  
                    key={index}
                    {...item}
                    getId={ this.props.getId}
                    
               />)
        });
        return notificationArr;
    };

    render() {
        
        return (

            <div className='notification-card'>
                    <Card title="Уведомления" >
                        <PerfectScrollbar
                            className="notification-card-scroll"
                            contentClassName="content"
                        >
                            {this.notificationRender(this.props.data)}
                        </PerfectScrollbar>
                    </Card>

            </div>

        );
    }


}

NotificationCard.propTypes ={
    getId: PropTypes.func,
};

NotificationCard.defaultProps = {
    data: [],
    getId: () => {},
};

export default NotificationCard
