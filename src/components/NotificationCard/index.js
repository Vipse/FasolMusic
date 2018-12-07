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
                    getId={ () => item.id }
               />)
        });
        return notificationArr;
    };

    render() {
        return (

            <div className='notification-card'>
                    <Card title="Уведомления" >
                        <PerfectScrollbar
                            speed={1}
                            className="scroll"
                            contentClassName="content"
                            horizontal={false}
                            verticalScrollbarStyle = {{
                              background: "#fdc401",
                            }}
                            verticalContainerStyle = {{
                                right: 5
                            }}
                        >
                            {this.notificationRender(this.props.data)}
                        </PerfectScrollbar>
                    </Card>

            </div>

        );
    }


}

NotificationCard.propTypes ={
    data: PropTypes.arrayOf(PropTypes.object),
    getId: PropTypes.func,
};

NotificationCard.defaultProps = {
    data: [],
    getId: () => {},
};

export default NotificationCard
