import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

import NearTrainingsItem from '../NearTrainingsItem'
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'

class NearTrainings extends React.Component {
    scheduleRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<NearTrainingsItem {...item}
                                       key={index}
                                       onGoto={this.props.onGoto}
            />)
        });
    };

    render() {
        const rootClass = cn('schedule-all');
        const {data} = this.props;
        return (
            <div className={rootClass}>
                <Card title="Ближайшие тренировки"
                      extra={<a className="schedule-all-link"><Icon type="circle_arrow_right"/> <span>Все</span></a>}>
                    {data.length ?
                        this.scheduleRender(data)
                        : <div className='entry-list no-trainings'>Тренировок нет</div>}
                </Card>
            </div>
        )
    }
}

NearTrainings.propTypes = {};

NearTrainings.defaultProps = {};


export default NearTrainings