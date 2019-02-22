import React from 'react';
import PropTypes from 'prop-types'
import NotificationCard from '../NotificationCard'
import Icon from '../Icon'
import { Popover } from 'antd';

import './style.css'

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
        for (let i = 0; i < this.props.data.length; i++){
            if (!this.props.data[i].watch) count++
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
        const {data} = this.props;

        let styleNotf = null;

        let notifCount = this.getDataLength() - this.state.inverseCount;

        // let notifCount = (Array.isArray(data) && data.length) ? data : 0
        // if(notifCount === 0)
        //     styleNotf = {'backgroundColor': 'transparent'};

            console.log('Popover', data)
            
        return (
            <div className="notific_component">
                <Popover
                    prefixCls='notific'
                    className="notific_popover"
                    content={this.state.visible &&
                    <NotificationCard
                        data={this.props.data}
                        getId = {(id) => {
                            this.props.getId(id);
                            this.setState({inverseCount: this.state.inverseCount+1})
                        }}
                    />}
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                    placement="bottomLeft"
                    overlayStyle={{position: "fixed"}}
                >

                    <div className="notific_container">
                        <Icon svg type='notification' size={25}/>
                        <div className="notific_number" style={styleNotf}>
                            <p className="count_notific">
                                {notifCount}
                            </p>
                        </div>
                    </div>

                </Popover>
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
