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

class NearTrainings extends React.Component {

    state = {
        loading: true,
        disciplineValues: []
    };

    componentDidMount() {
        this.props.getSelectors('discipline')
                .then(res => this.setState({disciplineValues: res.data}))
                .catch(err => console.log(err));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data)
            this.setState({loading: false});
    }

    scheduleRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<NearTrainingsItem {...item}
                                       key={index}
                                       onGoto={this.props.onGoto}
            />)
        });
    };

    compareTrainsByTime = (trainsArr) => {
        return trainsArr.sort(function compare(a, b) {
            return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
        });
    };

    render() {
        const {data} = this.props;
        const {loading, disciplineValues} = this.state;
        const rootClass = cn('schedule-future');

        let arrData = [];
        for (let dayItem in data) {
            arrData.push(...this.compareTrainsByTime(data[dayItem].map(item => {
                return {
                    name: item.allInfo.fio,
                    start: +item.allInfo.date * 1000,
                    end: +item.allInfo.date * 1000 + 3600000,
                    discipline: item.allInfo.disciplines.length ?
                        disciplineValues.find(discipline => discipline.id === +item.allInfo.disciplines[0]).nameRus : null
                };
            })));
        }

        return (
            <div className={rootClass}>
                <Card title="Ближайшие тренировки"
                      extra={<a className="schedule-future-link" onClick={this.props.openNearTrains}><Icon
                          type="circle_arrow_right"/><span>Все</span></a>}>
                    {loading ? <Spinner size='large'/> :
                        <PerfectScrollbar className="futureTrainings-scroll">
                            {arrData.length ? this.scheduleRender(arrData) :
                                <div className='entry-list no-trainings'>Тренировок нет</div>}
                        </PerfectScrollbar>}
                </Card>
            </div>
        )
    }
}

NearTrainings.propTypes = {};

NearTrainings.defaultProps = {};


export default NearTrainings