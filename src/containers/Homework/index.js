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
		this.props.onSelectPatient(id);
		let link = this.props.mode==="user"?"/app/doctor":"/app/patient";
		this.props.history.push(link+id);
	};



    render(){
        return (
            <Hoc>
            	<Row>
            		<Col span={24} className='section'>
                        <HomeworkList

                            onGoto={this.gotoHandler}
                            isUser={this.props.mode === "user"}
                            onAddFiles = {this.props.onAddFiles}
                            makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
                            trainings={[
                                {
                                date: 1234,
                                name: "Василий петрович евгений",
                                discipline: "вокал",
                                trainingRecord: "http://vk.com",
                                homework: "сделать кучу вещей, сыграть на гитарке",
                                files: [],
                                },
                                {
                                    date: 1541410275,
                                    name: "Василий asd евгений",
                                    discipline: "гитара",
                                    trainingRecord: "http://vk.com",
                                    homework: "сделать кучу вещей, сыграть на гитарке",
                                    files: [],
                                },
                                {
                                    date: 1234,
                                    name: "Василий gasfr евгений",
                                    discipline: "вокал",
                                    trainingRecord: "http://vk.com",
                                    homework: "",
                                    files: [],
                                },
                                {
                                    date: 1234,
                                    name: "Василий петрович hhhhhhh",
                                    discipline: "гитара",
                                    trainingRecord: "",
                                    homework: "сделать кучу вещей, сыграть на гитарке",
                                    files: [],
                                },
                                {
                                    date: 1234,
                                    name: "Василий петрович евгений",
                                    discipline: "вокал",
                                    trainingRecord: "http://vk.com",
                                    homework: "сделать кучу вещей, сыграть на гитарке",
                                    files: [],
                                },
                                {
                                    date: 1234,
                                    name: "Василий петрович евгений",
                                    discipline: "вокал",
                                    trainingRecord: "",
                                    homework: "",
                                    files: [],
                                },
                            ]}
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
	}
};

const mapDispatchToProps = dispatch => {
	return {
        onGetTreatments: (obj) => dispatch(actions.getPaginationTreatments(obj)),
        onAddFiles: (file, id) => dispatch(actions.addFileToApp(file, id)),
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Homework);
