import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

import NearTrainingsItem from '../NearTrainingsItem'
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import Spinner from "../Spinner";

class ChatTrainingsList extends React.Component {

    state = {
        loading: true
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data)
            this.setState({loading: false});
    }

    scheduleRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<NearTrainingsItem {...item}
                                       key={index}
                                       onGoto={this.props.onGoto}
                                       goToChat = {this.props.goToChat}
            />)
        });
    };

    render() {
        const {data} = this.props;
        const {loading} = this.state;
        const rootClass = cn('chat-list');

        return (
            <div className={rootClass}>
                <Card title="Ближайшие тренировки"
                      extra={<a className="chat-list-link" onClick={this.props.openNearTrains}><Icon
                          type="circle_arrow_right"/><span>Все</span></a>}>
                    {loading ? <Spinner size='large'/> :
                        <PerfectScrollbar className="chat-list-scroll">
                            {data && data.length ? this.scheduleRender(data) :
                                <div className='entry-list no-trainings'>Тренировок нет</div>}
                        </PerfectScrollbar>}
                </Card>
            </div>
        )
    }
}

ChatTrainingsList.propTypes = {};

ChatTrainingsList.defaultProps = {};


export default ChatTrainingsList;