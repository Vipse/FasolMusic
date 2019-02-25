import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";
import CoachProfile from "../../components/CoachProfile";
import RecordTrainCarousel from "../../components/RecordTrainCarousel";
import CoachPagePerfectStudent from "../../components/CoachPagePerfectStudent";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css';
import Spinner from "../../components/Spinner";
import {getNameFromObjArr, getNamesFromObjArr} from "../../helpers/getSelectorsCustomData";
import moment from "moment";
import {message, Modal} from "antd";
import AdminCreateTrainingModal from "../../components/AdminCreateTrainingModal";

class CoachPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            selectorsValues: {},
            trainModal: {visible: false}
        }
    }

    componentDidMount(){
        const {getSelectors} = this.props;
        const selectorsNames = ['interests', 'goal', 'discipline', 'qualities', 'styles', 'professions', 'day'];

        selectorsNames.forEach((name) => {
            getSelectors(name)
                .then(res => this.setState({
                    selectorsValues: {
                        ...this.state.selectorsValues,
                        [name + "List"]: res.data
                    }}))
                .catch(err => console.log(err))
        });

        this.props.onGetInfoDoctor(this.props.match.params.id)
            .then(res => this.setState({loading: false}));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({loading: true});
            this.props.onGetInfoDoctor(nextProps.match.params.id)
                .then(res => this.setState({loading: false}));
        }
    }

    getDisciplinesList = () => {
        const {disciplines} = this.props.profileCoach;
        if (disciplines && disciplines.length)
            return disciplines.map(item => getNameFromObjArr(item.discipline));
        else return [];
    };

    getSpecializationsList = () => {
        const {disciplines} = this.props.profileCoach;
        if (disciplines && disciplines.length)
            return disciplines.map(item => getNameFromObjArr(item.specialization));
        else return [];
    };

    getIntervals = (dateStart, dateEnd) => {
        const id = this.props.match.params.id;
        this.props.onGetMasterSchedule(id, dateStart, dateEnd);
        this.props.onGetOwnTrainings(id, dateStart, dateEnd);
    };

    onCreateAbonement = (timestamp, studentID) => {
        const {profileCoach, auth} = this.props;
        let submitObj = {
            amount: 1,
            dateStart: +timestamp,
            discipline: profileCoach.disciplines[0].discipline[0].value,
            idStudent: studentID ? studentID : auth.id,
            trainingtime: {
                [moment(timestamp * 1000).day()]: [{id: +profileCoach.id, start: +timestamp}]
            }
        };

        console.log("onCreateAbonement", submitObj);

        this.props.onCreateAbonement(submitObj)
            .then(res => {
            if (res && res.data && res.data.result)
                message.success("Абонемент успешно создан");
            else message.error("Произошла ошибка, попробуйте ещё раз");
                this.handleCloseModal();
        });
    };

    onTailAbonement = (idTraining) => {
        let obj = {idTraining};

        console.log("onTailAbonement", obj);
        this.props.onTransferTraininingToEnd(obj)
            .then(res => {
                if (res && res.data && res.data.result)
                    message.success("Тренировка успешно перенесены в конец");
                else message.error("Произошла ошибка, попробуйте ещё раз");
                this.handleCloseModal();
            });
    };

    onFreezeAbonement = (idSubscription) => {
        console.log("onFreezeAbonement", idSubscription);
        this.props.onFreezeAbonement(idSubscription)
            .then(res => {
                if (res && res.data && res.data.process)
                    message.success("Абонемент успешно заморожен");
                else message.error("Произошла ошибка, попробуйте ещё раз");
                this.handleCloseModal();
            });
    };

    handleTrainModal = (e, item, isDelete, isAdmin) => {
        e.preventDefault();
        /*this.setState({
            trainModal: {
                visible: true,
                item: item,
                isDelete: isDelete ? isDelete : false,
                isAdmin: isAdmin ? isAdmin : false
            }
        });*/
        Modal.warning({
            title: 'Изменение расписания',
            width: '500px',
            className: 'fast-modal',
            content: 'Вы находитесь в профиле коуча! Изменения вашего расписания осуществляется в разделе “Календарь”.',
            maskClosable: true,
            okText: 'Перейти в календарь',
            onOk: () => this.props.history.push('/app/schedule')
        });
    };

    handleCloseModal = () => {
        const {timestamp} = this.state.trainModal.item;
        this.getIntervals(moment(+timestamp * 1000).startOf('week').format('X'),
            moment(+timestamp * 1000).startOf('week').add(1, 'weeks').format('X'));

        this.setState({trainModal: {...this.state.trainModal, visible: false}})
    };

    handleRateMaster = (rate, feedback) => {
        const {auth, profileCoach: {id}} = this.props;

        return this.props.onRateMaster(auth.id, id, rate, feedback);
    };

    render() {
        const { id, avatar, name, aboutme, promovideo, email, phones } = this.props.profileCoach;
        const { bestsex, bestage, bestishomework, bestqualities, bestcomment } = this.props.profileCoach;
        const {masterSchedule, trainerTrainings, auth} = this.props;
        const isAdmin = this.props.auth.mode === 'admin';

        if (this.state.loading === true) {
            return <Spinner tip="Загрузка" size="large"/>;
        } else if (id !== this.props.match.params.id) {
            return (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                    <h3>Страница коуча не найдена</h3>
                    <p>Проверьте введённый адрес</p>
                </div>
            )
        } else {
            return (
                <Hoc>
                    <div className="coach-page">
                        <Row type="flex" gutter={32}>
                            <Col span={11}>
                                <CoachProfile
                                    email={email}
                                    img={avatar}
                                    name={name}
                                    phones={phones}
                                    discipline={this.getDisciplinesList()}
                                    specialization={this.getSpecializationsList()}
                                    aboutMe={aboutme}
                                    promoLink={promovideo}
                                    rate={5}
                                    ratingsCount={19}
                                    onRateMaster={this.handleRateMaster}
                                />
                            </Col>
                            <Col span={13} offset={32}>
                                <RecordTrainCarousel
                                    onGetIntervals={this.getIntervals}
                                    intervals={masterSchedule}
                                    trainerTrainings={trainerTrainings}
                                    handleTrainModal={this.handleTrainModal}
                                    studentID={auth.id}
                                    isAdmin={isAdmin}
                                />
                                <CoachPagePerfectStudent
                                    sex={bestsex}
                                    age={bestage}
                                    homework={bestishomework}
                                    qualities={getNamesFromObjArr(bestqualities)}
                                    comment={bestcomment}
                                />
                            </Col>
                        </Row>
                        <AdminCreateTrainingModal
                            width={770}
                            params={this.state.trainModal}
                            onCancel={this.handleCloseModal}
                            onSaveAbonement={this.onCreateAbonement}
                            onTailAbonement={this.onTailAbonement}
                            onFreezeAbonement={this.onFreezeAbonement}
                            discipline={this.getDisciplinesList()}
                        />
                    </div>
                </Hoc>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        profileCoach: state.profileDoctor,
        masterSchedule: state.student.masterSchedule,
        trainerTrainings: state.profileDoctor.trainerTrainings
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        onGetMasterSchedule: (id, dateStart, dateEnd) => dispatch(actions.getMasterSchedule(id, dateStart, dateEnd)),
        onGetOwnTrainings: (id, weekStart, weekEnd) => dispatch(actions.getTrainerTrainings(id, weekStart, weekEnd)),
        onOrderTrain: (obj) => dispatch(actions.createTraining(obj)),
        onCreateAbonement: (data) => dispatch(actions.createAbonement(data)),
        onTransferTraininingToEnd: (value) => dispatch(actions.transferTraininingToEnd(value)),
        onFreezeAbonement: (idSubscription) => dispatch(actions.freezeAbonement(idSubscription)),
        onRateMaster: (idStudent, idMaster, rate, feedback) => dispatch(actions.rateMaster(idStudent, idMaster, rate, feedback)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CoachPage);
