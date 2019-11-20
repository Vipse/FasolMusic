import React from 'react';
import PropTypes from 'prop-types'


import './style.css'
import '../../icon/style.css'

;
import Row from "../Row";
import Col from "../Col";
import HomeworkList from "../HomeworkList";

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
                <React.Fragment>
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
                </React.Fragment>
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
