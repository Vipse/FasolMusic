import React from 'react'
import {connect} from 'react-redux';

import Row from "../../components/Row";
import Col from "../../components/Col";
import HomeworkList from "../../components/HomeworkList";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css'

class Homework extends React.Component{
    state = {
        cancelModal: false,
        addModal: false,
        isNewFreeVisitVisible: false,
    };


    gotoHandler = (id) => {
		let link = this.props.mode === "student" ? "/app/coach" : "/app/student";
		this.props.history.push(link + id);
	};

    componentDidMount() {
        this.props.onGetAbonements2(this.props.id);
        this.props.onGetMasterList();
    }

    render(){
        console.log(this.props);

        let arrAbonement = [];
        const {trainerList} = this.props;

        if(this.props.allAbonements2){
            let {subscriptions} = this.props.allAbonements2;
            let max = subscriptions.length;
            for(let i = 0; i < max; i++){
                for(let j = 0; j < subscriptions[i].training.length; j++){

                    for(let a = 0; trainerList && a < trainerList.length; a++){

                        if(String(trainerList[a].idMaster) === String(subscriptions[i].training[j].idMaster)){

                            arrAbonement.push({
                                date: subscriptions[i].training[j].start,
                                name: trainerList[a].name,
                                discipline: subscriptions[i].discipline,
                                trainingRecord: "http://vk.com",
                                homework: subscriptions[i].training[j].homework,
                                files: [],
                                idMaster: subscriptions[i].training[j].idMaster,
                                idTraining: subscriptions[i].training[j].id
                            });
                            a = Infinity;
                        }
                    }

                }
            }
        }

        return (
            <Hoc>
            	<Row>
            		<Col span={24} className='section'>
                        <HomeworkList
                            onGoto={this.gotoHandler}
                            isStudent={this.props.mode === "student"}
                            onAddFiles = {this.props.onAddFiles}
                            makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
                            trainings={arrAbonement}
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
        allAbonements2: state.abonement.allAbonements2, // и интервалы
        mode: state.auth.mode,
        id: state.auth.id,
        trainerList: state.trainer.trainerList,
	}
};

const mapDispatchToProps = dispatch => {
	return {
        onGetTreatments: (obj) => dispatch(actions.getPaginationTreatments(obj)),
        onAddFiles: (file, id) => dispatch(actions.addFileToApp(file, id)),
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files)),

        onGetAbonements2: (idStudent) => dispatch(actions.getAbonements2(idStudent)),
        onGetMasterList: (discipline) => dispatch(actions.getMasterList(discipline)),

        onSetHomeworkEdit: (idTraining, homework) => dispatch(actions.setHomeworkEdit(idTraining, homework))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Homework);
