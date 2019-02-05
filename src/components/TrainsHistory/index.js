import React from 'react';
import PropTypes from 'prop-types'

import Card from '../Card'
import Button from '../Button'
import PerfectScrollbar from "react-perfect-scrollbar";

import './style.css'
import '../../icon/style.css'
import HistoryReceptionsItems from "../HistoryReceptionsItems";
import Spinner from "../Spinner";
import ReviewsModal from "../ReviewsModal";
import HomeworkListItem from "../HomeworkListItem";
import Hoc from "../Hoc";
import Input from "../Input";
import Row from "../Row";
import Col from "../Col";
import HomeworkList from "../HomeworkList";
import {apiTrainers} from "../../containers/Schedule/mock-data";

class TrainsHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filt_name: '',
            max: 7,
            old: 0,
            data: [],
            loading: false
        };
        this.timer = null;
    }

    render() {
        const {masterTrainings, selectors} = this.props;
        let trainingsArr = [];

        if (selectors.disciplineList)
            for (let day in masterTrainings)
                if (typeof masterTrainings[day] === 'object') {
                    for (let train in masterTrainings[day]) {
                        let train = masterTrainings[day][train].allInfo;
                        trainingsArr.push({
                            date: train.date,
                            discipline: train.disciplines.length ? selectors.disciplineList.find(discipline => discipline.id === +train.disciplines[0]).nameRus : null,
                            trainingRecord: train.videofile,
                            homework: train.homework,
                            files: train.attachments,
                            idTraining: train.idTraining
                        });
                    }
                }

        return (
            <div className='receptions-personal-page'>
                <Hoc>
                    <Row>
                        <Col span={24} className='section'>
                            <HomeworkList
                                onGoto={this.gotoHandler}
                                onStudentPage={true}
                                onAddFiles={this.props.onAddFiles}
                                makeArchiveOfFiles={this.props.makeArchiveOfFiles}
                                trainings={trainingsArr.reverse()}
                                onSetHomeworkEdit={this.props.onSetHomeworkEdit}
                            />
                        </Col>
                    </Row>
                </Hoc>
            </div>
        )
    }
}

TrainsHistory.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    limit: PropTypes.number,
    onGotoChat: PropTypes.func,
};

TrainsHistory.defaultProps = {
    data: [],
    limit: 7,
    onGotoChat: () => {},
};

export default TrainsHistory
