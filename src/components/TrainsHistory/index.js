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

    componentDidMount() {
        const { id } = this.props;

        this.props.onChangeRequestMaxAmount(2);
        this.props.onGetTrainingHistoryList(id);
    }

    componentWillUnmount() {
        this.props.onResetTrainingHistoryList();
    }

    loadMoreTrainingsHandler = (search) => {
        const { id } = this.props;

        this.props.onGetTrainingHistoryList(id, search);
    };

    prepareTrainingsArr = () => {
        const {id, mode, selectors, trainings} = this.props;
        const isStudent = mode === 'student';
        let trainingsArr = [];

        if (selectors.disciplineList) {
            trainingsArr = trainings.filter(train => +train.idMaster !== +id).map((train) => {
                return {
                    date: train.date,
                    name: isStudent ? train.nameMaster : train.nameStudent,
                    avatar: isStudent ? train.avatarMaster : train.avatarStudent,
                    discipline: train.disciplineSubscription.length ? selectors.disciplineList.find(discipline => discipline.id === +train.disciplineSubscription[0]).nameRus : null,
                    trainingRecord: train.videofile,
                    homework: train.homework,
                    idProfile: train.idMaster,
                    idTraining: train.idTraining,
                    isTrial: train.trial
                };
            });
        }

        return trainingsArr;
    };

    render() {
        const { mode, loading, isRequestFailed, endAchieved } = this.props;

        return (
            <div className='receptions-personal-page'>
                <Hoc>
                    <Row>
                        <Col span={24} className='section'>
                            <HomeworkList
                                loadMoreTrainings={this.loadMoreTrainingsHandler}
                                goToProfile={this.props.goToProfile}
                                onGoToChat={this.props.onGotoChat}
                                isStudent={mode === "student"}
                                trainings={this.prepareTrainingsArr()}
                                loading={loading}
                                isRequestFailed={isRequestFailed}
                                endAchieved={endAchieved}
                                onSetHomeworkEdit={this.props.onSetHomeworkEdit}
                                onStudentPage={true}
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
