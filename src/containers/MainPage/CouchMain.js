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
        lastTrainings: [],
        myStudents: []
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.futureTraining !== this.props.futureTraining)
            this.setState({nearTrainings: this.prepareNearTrainings()});
        if (prevProps.postTraining !== this.props.postTraining)
            this.setState({lastTrainings: this.prepareLastTrainings()});
        if (prevProps.myStudents !== this.props.myStudents)
            this.setState({myStudents: this.prepareMyStudents()});
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
                    let train = futureTraining[dayItem][trainItem].allInfo;
                    arrData.push({
                        name: train.fio,
                        avatar: train.avatar,
                        start: +train.date * 1000,
                        end: +train.date * 1000 + 3600000,
                        discipline: train.disciplines.length ?
                            selectors.discipline.find(discipline => discipline.id === +train.disciplines[0]).nameRus : null,
                        idProfile: train.idStudent,
                        idTraining: train.idTraining,
                        isComplete: train.isComplete
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
                    let train = postTraining[dayItem][trainItem].allInfo;
                    arrData.push({
                        name: train.fio,
                        date: +train.date * 1000,
                        discipline: train.disciplines.length ?
                            selectors.discipline.find(discipline => discipline.id === +train.disciplines[0]).nameRus : null,
                        avatar: train.avatar,
                        homework: train.homework,
                        idProfile: train.idStudent,
                        idTraining: train.idTraining
                    });
                }

            return arrData.reverse();
        }
    };

    prepareMyStudents = () => {
        const {myStudents, selectors} = this.props;

        if (selectors.discipline) {
            return myStudents.map((item) => {
                return {
                    id: item.idStudent,
                    profileAvatar: item.avatar,
                    disciplines: item.disciplines,
                    name: item.name,
                    lastMessage: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the printing"+
                        " and typesetting industry. Lorem Ipsum has been the industry's "
                };
            });
        }
    };

    render() {
        const {nearTrainings, lastTrainings, myStudents} = this.state;
        const {goToChat} = this.props;

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
                    <Col xs={14} xxl={8} md={12} sm={8} className='section'>
                        <NearTrainings
                            onGoto={(val) => this.gotoHandler(val)}
                            goToChat = {goToChat}
                            openNearTrains={() => this.props.history.push('/app/schedule')}
                            data={nearTrainings}
                        />
                    </Col>
                    <Col xs={14} xxl={8} md={12} sm={8} className='section'>
                        <LastTrainings
                            onGoto={(val) => this.gotoHandler(val)}
                            openLastTrains={() => this.props.history.push('/app/homework')}
                            data={lastTrainings}
                            onSetHomeworkEdit={this.props.onSetHomeworkEdit}
                        />
                    </Col>
                    <Col xs={14} xxl={8} md={12} sm={8} className='section'>
                        <MyStudents
                            goToChat={goToChat}
                            onGoto={(val) => this.gotoHandler(val)}
                            openMyStudents={() => this.props.history.push('/app/homework')}
                            data={myStudents}
                        />
                    </Col>
                </Row>

            </Hoc>
        )
    }
}

export default CouchMain;
