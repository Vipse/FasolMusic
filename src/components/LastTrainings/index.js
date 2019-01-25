import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import LastTrainingsItem from "../LastTrainingsItem";
import PerfectScrollbar from 'react-perfect-scrollbar'
import Spinner from "../Spinner";

class LastTrainings extends React.Component {

    state = {
        loading: true
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data)
            this.setState({loading: false});
    }

    studentsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<LastTrainingsItem {...item}
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
        const {data, openLastTrains, disciplineSelectors} = this.props;
        const {loading} = this.state;

        let arrData = [];
        for (let dayItem in data) {
            arrData.push(...this.compareTrainsByTime(data[dayItem].map(item => {
                return {
                    name: item.allInfo.fio,
                    date: +item.allInfo.date * 1000,
                    discipline: item.allInfo.disciplines.length ?
                        disciplineSelectors.find(discipline => discipline.id === +item.allInfo.disciplines[0]).nameRus : null,
                    avatar: item.allInfo.avatar,
                    homework: item.allInfo.homework,
                    idStudent: item.allInfo.idStudent
                };
            })));
        }

        return (
            <div className='lastTrainings'>
                <Card title="Последние тренировки"
                      extra={<a className="lastTrainings-link" onClick={openLastTrains}><Icon type="circle_arrow_right"/>
                          <span>Весь список</span></a>}>
                    {loading ? <Spinner size='large'/> : <PerfectScrollbar className="lastTrainings-scroll">
                    {arrData.length ?
                        this.studentsRender(arrData)
                        : <div className='noTrainings'>Тренировок ещё не было</div>}
                    </PerfectScrollbar>}
                </Card>
            </div>
        )
    }
}

LastTrainings.propTypes = {};

LastTrainings.defaultProps = {
    data: []
};


export default LastTrainings