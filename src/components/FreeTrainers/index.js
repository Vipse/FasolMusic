import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import FreeTrainersItem from "../FreeTrainersItem";
import { PropTypes } from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar'

class FreeTrainers extends React.Component {

    studentsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<FreeTrainersItem {...item}
                                    key={index}
                                    onGoto={this.props.onGoto}
                                    setChoosenTrainer={this.props.setChoosenTrainer}
            />)
        });
    };


    render() {
        const {freeTrainers} = this.props;

        console.log('freeTrainers :', this.props);
        return (
            <div className='my-coach' id="my-coach-wrapper">
                <Card title="Выбери коуча">
                    
                    <PerfectScrollbar
                        className="auto__complete-results"
                    >
                        <div>
                            {Array.isArray(freeTrainers) && freeTrainers.length ?
                                this.studentsRender(freeTrainers)
                                : <div className='noStudents'>Коучей нет</div>}
                        </div>
                    </PerfectScrollbar>       
                </Card>
            </div>
        )
    }
}

FreeTrainers.propTypes = {
    freeTrainers: PropTypes.array,
    setChoosenTrainer: PropTypes.func,
};

FreeTrainers.defaultProps = {
    freeTrainers: [],
    setChoosenTrainer: () => {}
};


export default FreeTrainers