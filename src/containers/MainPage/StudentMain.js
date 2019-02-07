import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";
import {message} from 'antd';
import TopPanel from "../../components/TopPanel";
import Reviews from "../../components/Reviews";
import NearTrainings from "../../components/NearTrainings";
import Icon from "../../components/Icon";

import Hoc from '../../hoc'
import LastTrainings from "../../components/LastTrainings";
import moment from 'moment'
import MyCoach from '../../components/MyCoach';

class StudentMain extends React.Component{
	constructor(props) {
		super(props);
    }

    state = {
        nearTrainings: [],
        lastTrainings: [],
        myCoaches: []
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectors !== this.props.selectors && this.props.selectors.discipline)
            this.TrialTrainingAvailabilityAlert();

        if (prevProps.nearTraining !== this.props.nearTraining)
            this.setState({nearTrainings: this.prepareNearTrainings()});
        if (prevProps.lastTrainings !== this.props.lastTrainings)
            this.setState({lastTrainings: this.prepareLastTrainings()});
        if (prevProps.myCoaches !== this.props.myCoaches)
            this.setState({myCoaches: this.prepareMyCoaches()});
    }

    TrialTrainingAvailabilityAlert = () => {
        const {id, selectors: {discipline}} = this.props;

        discipline.forEach((item) =>
            this.props.onGetTrainingTrialStatusByDiscipline(item.id, id)
            .then(res => {
                if (res) !res.isTrialTraining ?
                    message.info('Запишитесь на пробную тренировку по дисциплине ' + item.nameRus, 5)
                    : null})
            .catch(err => console.log(err)))
    };

    prepareNearTrainings = () => {
	    const {nearTraining, selectors} = this.props;

        if (selectors.discipline) {
            return nearTraining.map((item) => {
                return {
                    name: item.fioMaster,
                    start: +item.start * 1000,
                    end: +item.start * 1000 + 3600000,
                    discipline: item.disciplineSubscription.length ?
                        selectors.discipline.find(discipline => discipline.id === +item.disciplineSubscription[0]).nameRus : null,
                    idProfile: item.idMaster,
                    idTraining: item.id
                }
            });
        }
    };

    prepareLastTrainings = () => {
        const {lastTrainings, selectors} = this.props;

        if (selectors.discipline) {
            return lastTrainings.map((item) => {
                return {
                    name: item.fioMaster,
                    date: +item.start * 1000,
                    discipline: item.disciplineMaster.length ? selectors.discipline.find(discipline => discipline.id === +item.disciplineMaster[0]).nameRus : null,
                    avatar: item.avatarMaster,
                    homework: item.homework,
                    idProfile: item.idMaster
                };
            }).reverse();
        }
    };

    prepareMyCoaches = () => {
        const {myCoaches, selectors} = this.props;

        if (selectors.discipline) {
            return myCoaches.map((item) => {
                return {
                    id: item.idMaster,
                    profileAvatar: item.avatar,
                    online: true,
                    disciplines: item.disciplines,
                    name: item.name,
                    lastMessage: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the printing"+
                        " and typesetting industry. Lorem Ipsum has been the industry's "
                };
            });
        }
    };

    gotoHandler = (id) => {
        this.props.onSelectPatient(id);
        this.props.history.push('/app/coach'+id);
    };

    render(){
        const {nearTrainings, lastTrainings, myCoaches} = this.state;
        const {goToChat} = this.props;

        return (
            <Hoc>
                        <Row>
                            <Col span={24} className='section'>
                                <TopPanel  
                                    {...this.props.docTodayInfo}
                                    nextTrainingTime = {this.props.nextTrainingTime}
                                    myCoachOrStudents = {this.props.myCoachOrStudents}
                                    isStudent={true}
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
                                    isStudent={true}
                                />
                            </Col>

                            <Col xs={14} xxl={9} className='section'>
                                <MyCoach
                                    goToChat = {goToChat}
                                    onGoto={(val) => this.gotoHandler(val)}
                                    data = {myCoaches}
                                />
                            </Col>
                        </Row>

                    </Hoc>
        )
    }
}

export default StudentMain;
