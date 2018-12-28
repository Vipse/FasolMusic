import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import LastTrainingsItem from "../LastTrainingsItem";
import PerfectScrollbar from 'react-perfect-scrollbar'

class LastTrainings extends React.Component {
    studentsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<LastTrainingsItem {...item}
                                       key={index}
                                       onGoto={this.props.onGoto}
            />)
        });
    };

    render() {
        const {data, openLastTrains} = this.props;
        return (
            <div className='lastTrainings'>
                <Card title="Последние тренировки"
                      extra={<a className="lastTrainings-link" onClick={openLastTrains}><Icon type="circle_arrow_right"/>
                          <span>Весь список</span></a>}>
                    <PerfectScrollbar className="lastTrainings-scroll">
                    {data.length ?
                        this.studentsRender(data)
                        : <div className='noTrainings'>Тренировок ещё не было</div>}
                    </PerfectScrollbar>
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