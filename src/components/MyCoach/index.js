import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import MyCoachItem from "../MyCoachItem";
import { PropTypes } from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar'

class MyCoach extends React.Component {

    studentsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<MyCoachItem {...item}
                                    key={index}
                                    onGoto={this.props.onGoto}
                                    setChoosenTrainer={this.props.setChoosenTrainer}
                                    trainerList = {this.props.freeTrainers.freeTrainers}
            />)
        });
    };


    render() {
        const {freeTrainers} = this.props;

        console.log('freeTrainers :', freeTrainers);
        return (
            <div className='my-coach' id="my-coach-wrapper">
                <Card title="Выбери коуча">
                    
                    <PerfectScrollbar
                        className="auto__complete-results"
                    >
                        <div>
                            {freeTrainers.freeTrainers.length ?
                                this.studentsRender(freeTrainers.freeTrainers)
                                : <div className='noStudents'>Студентов нет</div>}
                        </div>
                    </PerfectScrollbar>       
                </Card>
            </div>
        )
    }
}

MyCoach.propTypes = {
    freeTrainers: PropTypes.array,
    setChoosenTrainer: PropTypes.func,
};

MyCoach.defaultProps = {
    freeTrainers: [],
    setChoosenTrainer: () => {}
};


export default MyCoach