import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'

import TopPanelItem from '../TopPanelItem';
import './style.css'
import '../../icon/style.css'
import Button from '../Button';

class TopPanel extends React.Component{
    state = {
        time: moment(),
    };

    componentDidMount(){
        this.tick();
        this.timeout = setTimeout(this.firstTick,(60-moment().second())*1000);
    }

    componentWillUnmount(){
        clearTimeout(this.timeout);
        clearInterval(this.timer);
    }
    
    firstTick = () => {
        this.tick();
        this.timer = setInterval(this.tick, 60000);
    };

    tick = () => {
        this.setState({time: moment()});
    };

    render(){
        const {time} = this.state;
        const {myCoachOrStudents, nextTrainingTime, todayTraining, isStudent} = this.props;

        let lenghtToday = 0;
        for (let el in todayTraining) {
            if(todayTraining.hasOwnProperty(el) && Array.isArray(todayTraining[el]) ) {
                lenghtToday += todayTraining[el].length;
            } 
        }

        return (
            <div className='top-panel'>
                <div className='top-panel-description'>
                    <h3 className='top-panel-description-title'>Пока ждешь начала тренировки,
                        можешь посмотреть наше новое видео
                    </h3>
                    <p className='top-panel-description-body'>Проводи свободное время с пользой, разминайся и оттачивай
                        пройденные упражнения на нашем канале на YouTube на котором уже более 28.000 подписчиков,
                        здесь ты найдешь много полезного и интересного!
                    </p>
                    <a className='top-panel-description-link' target='_blank' href='https://www.youtube.com/channel/UC2CeLJuTUSqjQUrxctjttdg'>
                        <Button
                            btnText='Перейти к видео'
                            size='large'
                            type='yellow-unfilled'
                        />
                    </a>
                </div>
                <div className="top-panel-items">
                    <TopPanelItem
                        panelTitle="Следующая тренировка"
                        panelText={ (nextTrainingTime) ? moment(nextTrainingTime).format('D MMM') : '-'}
                    />
                    <TopPanelItem
                        panelTitle="Тренировок на сегодня"
                        panelText={lenghtToday}
                    />
                    <TopPanelItem
                        panelTitle={isStudent ? "Мои коучи" : 'Мои студенты'}
                        panelText={Array.isArray(myCoachOrStudents) ? myCoachOrStudents.filter((el) => (el) ? true : false).length : '-'} // в массиве бывают null
                    />
                </div>
            </div>
        )
    }
}

TopPanel.propTypes = {
    receptionsToday: PropTypes.number,
    receptionsActual: PropTypes.number,
    patients: PropTypes.number,
    nextTraining: PropTypes.number,
    nextTrainingTime: PropTypes.number,
};

TopPanel.defaultProps = {
    receptionsToday: 0,
    receptionsActual: 0,
    patients: 0,
    nextTraining: 0,
};


export default TopPanel