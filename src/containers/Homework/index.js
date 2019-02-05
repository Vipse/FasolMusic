import React from 'react'
import {connect} from 'react-redux';

import Row from "../../components/Row";
import Col from "../../components/Col";
import HomeworkList from "../../components/HomeworkList";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css'
import moment from "moment";

class Homework extends React.Component {
    state = {
        loadingData: true
    };

    componentDidMount() {
        this.props.getSelectors('discipline');
        const {mode, id} = this.props;
        const start = null;
        const end = moment().format('X');

        if (mode === "student")
            this.props.onGetAllTrainingStudent(id, start, end);
        else if (mode === "master")
            this.props.onGetPostTrainerTraining(id, start, end);
    }

    gotoHandler = (id) => {
        let link = this.props.mode === "student" ? "/app/coach" : "/app/student";
        this.props.history.push(link + id);
    };

    render(){
        const {mode, selectors, masterTrainings, studentTrainings} = this.props;
        let trainingsArr = [];

        if (selectors.discipline) {
            if (mode === 'student') {
                trainingsArr = studentTrainings.map((train) => {
                    return {
                        date: train.start,
                        name: train.fioMaster,
                        discipline: train.disciplineMaster.length ? selectors.discipline.find(discipline => discipline.id === +train.disciplineMaster[0]).nameRus : null,
                        trainingRecord: train.videofile,
                        homework: train.homework,
                        files: train.attachments,
                        idProfile: train.idMaster,
                        idTraining: train.id
                    };
                });
            }
            else {
                for (let day in masterTrainings)
                    for (let train in masterTrainings[day]) {
                        let train = masterTrainings[day][train].allInfo;
                        trainingsArr.push({
                            date: train.date,
                            name: train.fio,
                            discipline: train.disciplines.length ? selectors.discipline.find(discipline => discipline.id === +train.disciplines[0]).nameRus : null,
                            trainingRecord: train.videofile,
                            homework: train.homework,
                            files: train.attachments,
                            idProfile: train.idStudent,
                            idTraining: train.idTraining
                        });
                    }
            }
        }

        return (
            <Hoc>
            	<Row>
            		<Col span={24} className='section'>
                        <HomeworkList
                            onGoto={this.gotoHandler}
                            isStudent={mode === "student"}
                            onAddFiles = {this.props.onAddFiles}
                            makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
                            trainings={trainingsArr.reverse()}
                            onSetHomeworkEdit={this.props.onSetHomeworkEdit}
                        />
            		</Col>
            	</Row>
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
	return {
        mode: state.auth.mode,
        id: state.auth.id,
        selectors: state.loading.selectors,
        masterTrainings: state.trainer.postTraining,
        studentTrainings: state.training.studentTrainings
	}
};

const mapDispatchToProps = dispatch => {
	return {
        onAddFiles: (file, id) => dispatch(actions.addFileToApp(file, id)),
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files)),

        onGetPostTrainerTraining: (idMaster, dateMin, dateMax) => dispatch(actions.getPostTrainerTraining(idMaster, dateMin, dateMax)),
        onGetAllTrainingStudent: (idMaster, dateMin, dateMax) => dispatch(actions.getAllTrainingStudent(idMaster, dateMin, dateMax)),
        onSetHomeworkEdit: (idTraining, homework) => dispatch(actions.setHomeworkEdit(idTraining, homework)),
        getSelectors: (name) => dispatch(actions.getSelectors(name))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Homework);
