import React from 'react';
import PropTypes from 'prop-types'
import NotificationCard from '../NotificationCard'
import Icon from '../Icon'
import { Popover } from 'antd';

import './style.css'
import { notificationArr } from './stories/mock-data'

class NotificationApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            inverseCount: 0,
        };
    };

    getDataLength = () => {
        let count = 0;
        for (let i = 0; i < notificationArr.length; i++){
            if (!notificationArr[i].watch) count++
        }
        return count;
    };


	handleVisibleChange = (visible) => {
       this.setState({visible});
       (visible == false) && (this.state.inverseCount != 0) && this.props.getNotifications();
    };
    
    componentWillReceiveProps(nexProps){
        this.setState({inverseCount: 0})
    }

    render() {
        let styleNotf = null;
        let notifCount = this.getDataLength() - this.state.inverseCount;
        if(notifCount === 0)
            styleNotf = { 'backgroundColor': 'transparent'};


        return (
        <div className="notific_component">
            <div >
                <Popover
                    className="notific_popover"
                    content={this.state.visible && <NotificationCard
                        data={notificationArr} 
                        top={this.props.top} 
                        getId={(id) => {
                            this.props.getId(id);
                            this.setState(prevState => {return {...prevState, inverseCount: prevState.inverseCount + 1}})
                        }}/>}
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                    placement="bottomLeft"
                    overlayStyle = {{position: "fixed"}}
                >
                   
                        <div className="notific_container" >
                            <Icon svg type='notification' size={25} />
                            <div className="notific_number" style={styleNotf}>
                                <p className="count_notific">
                                    {notifCount}
                                </p>
                            </div>
                        </div>
                  
                </Popover>
            </div>
        </div>

    );
  }
}

NotificationApp.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
};

NotificationApp.defaultProps = {
    data: [],
};

export default NotificationApp
