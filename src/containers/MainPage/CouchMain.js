import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";
import TopPanel from "../../components/TopPanel";
import Reviews from "../../components/Reviews";
import NearTrainings from "../../components/NearTrainings";

import Hoc from '../../hoc'
import LastTrainings from "../../components/LastTrainings";
import MyStudents from './../../components/MyStudents/index';

class CouchMain extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        nearTrainings: [],
        lastTrainings: []
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.futureTraining !== this.props.futureTraining)
            this.setState({nearTrainings: this.prepareNearTrainings()});
        if (prevProps.postTraining !== this.props.postTraining)
            this.setState({lastTrainings: this.prepareLastTrainings()});
    }

    gotoHandler = (id) => {
        this.props.onSelectPatient(id);
        this.props.history.push('/app/student' + id);
    };

    prepareNearTrainings = () => {
        const {futureTraining, selectors} = this.props;
        let arrData = [];

        if (selectors.discipline) {
            for (let dayItem in futureTraining)
                for (let trainItem in futureTraining[dayItem]) {
                    let train = futureTraining[dayItem][trainItem];
                    arrData.push({
                        name: train.allInfo.fio,
                        start: +train.allInfo.date * 1000,
                        end: +train.allInfo.date * 1000 + 3600000,
                        discipline: train.allInfo.disciplines.length ?
                            selectors.discipline.find(discipline => discipline.id === +train.allInfo.disciplines[0]).nameRus : null,
                        idProfile: train.allInfo.idStudent,
                        idTraining: train.allInfo.idTraining
                    });
                }

            return arrData;
        }
    };

    prepareLastTrainings = () => {
        const {postTraining, selectors} = this.props;
        let arrData = [];

        if (selectors.discipline) {
            for (let dayItem in postTraining)
                for (let trainItem in postTraining[dayItem]) {
                    let train = postTraining[dayItem][trainItem];
                    arrData.push({
                        name: train.allInfo.fio,
                        date: +train.allInfo.date * 1000,
                        discipline: train.allInfo.disciplines.length ?
                            selectors.discipline.find(discipline => discipline.id === +train.allInfo.disciplines[0]).nameRus : null,
                        avatar: train.allInfo.avatar,
                        homework: train.allInfo.homework,
                        idProfile: train.allInfo.idStudent
                    });
                }

            return arrData;
        }
    };

    render() {
        const {nearTrainings, lastTrainings} = this.state;
        const {allAbonements, myCoachOrStudents, goToChat} = this.props;

        let myStudents = [];
        for (let i = 0; i < myCoachOrStudents.length; i++) {
            if (myCoachOrStudents[i]) {
                myStudents.push(myCoachOrStudents[i])
            }
        }

        return (
            <Hoc>
                <Row>
                    <Col span={24} className='section'>
                        <TopPanel
                            {...this.props.docTodayInfo}
                            nextTrainingTime={this.props.nextTrainingTime}
                            myCoachOrStudents={this.props.myCoachOrStudents}
                            todayTraining={this.props.todayTraining}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col xs={14} xxl={7} className='section'>
                        <NearTrainings
                            onGoto={(val) => this.gotoHandler(val)}
                            goToChat = {goToChat}
                            openNearTrains={() => this.props.history.push('/app/schedule')}
                            data={nearTrainings}
                        />
                    </Col>
                    <Col xs={14} xxl={8} className='section'>
                        <LastTrainings
                            onGoto={(val) => this.gotoHandler(val)}
                            openLastTrains={() => this.props.history.push('/app/homework')}
                            data={lastTrainings}
                            onSetHomeworkEdit = {this.props.onSetHomeworkEdit}
                        />
                    </Col>
                    <Col xs={14} xxl={9} className='section'>
                        <MyStudents
                            goToChat={goToChat}
                            onGoto={(val) => this.gotoHandler(val)}
                            data={(Array.isArray(myStudents)) ? myStudents.map((el) => {
                                if (el)
                                    return {
                                        id: el.idMaster,
                                        profileAvatar: el.avatar,
                                        online: true,
                                        disciplines: el.disciplines,
                                        name: el.name,
                                        lastMessage: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the printing" +
                                            " and typesetting industry. Lorem Ipsum has been the industry's "
                                    }
                            }) : []}
                        />
                    </Col>
                </Row>

            </Hoc>
        )
    }
}

export default CouchMain;
