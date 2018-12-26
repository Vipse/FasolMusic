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

class CoachPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            selectorsValues: {}
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

        this.props.onGetInfoDoctor(this.props.match.params.id);
        this.props.onGetMasterSchedule(this.props.match.params.id, moment().format('X'), moment().add(1, 'weeks').endOf('week').format('X'));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({
                loading: true
            });
            this.props.onGetInfoDoctor(nextProps.match.params.id);
            this.props.onGetMasterSchedule(nextProps.match.params.id, moment().format('X'), moment().add(1, 'weeks').endOf('week').format('X'));
        }
        else {
            this.setState({
                loading: false
            });
        }
    }

    getDisciplinesList = () => {
        const {disciplines} = this.props.profileCoach;
        if (disciplines.length)
            return disciplines.map(item => getNameFromObjArr(item.discipline))
    };

    getSpecializationsList = () => {
        const {disciplines} = this.props.profileCoach;
        if (disciplines.length)
            return disciplines.map(item => getNameFromObjArr(item.specialization))
    };

    prepareAvailableIntervals = () => {
        const {masterSchedule} = this.props;
        let intervalsArr = [];
        for (let key in masterSchedule)
            intervalsArr.push({
                from: key,
                to: masterSchedule[key][0][0].end
            });
        return intervalsArr;
    };

    render() {
        const { avatar, name, aboutme } = this.props.profileCoach;
        const { bestsex, bestage, bestishomework, bestqualities, bestcomment } = this.props.profileCoach;
        if (this.state.loading === true) {
            return <Spinner tip="Загрузка" size="large"/>;
        } else if (!this.props.profileCoach.name) {
            return (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                    <h3>Страница не найдена</h3>
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
                                    img={avatar}
                                    name={name}
                                    discipline={this.getDisciplinesList()}
                                    specialization={this.getSpecializationsList()}
                                    aboutMe={aboutme}
                                    rate={5}
                                    ratingsCount={19}
                                />
                            </Col>
                            <Col span={13} offset={32}>
                                <RecordTrainCarousel
                                    intervals={this.prepareAvailableIntervals()}
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
                    </div>
                </Hoc>
            )
        }
    }
}



const mapStateToProps = state => {
    return {
        profileCoach: state.profileDoctor,
        masterSchedule: state.profileDoctor.masterSchedule,
        //info: state.patients.selectedPatientInfo,
        intervals: state.patients.intervals,
        availableIntervals: state.profileDoctor.workIntervals,
        appsBetween: state.treatments.appsBetween,
        appsBetweenCount: state.treatments.appsBetweenCount
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
        onGetMasterSchedule: (id, dateStart, dateEnd) => dispatch(actions.getMasterSchedule(id, dateStart, dateEnd)),
        getSelectors: (name) => dispatch(actions.getSelectors(name)),
        //getPatientInfo: (id) => dispatch(actions.getSelectedPatientInfo(id)),
        onAddFiles: (file, id) => dispatch(actions.addFileToApp(file, id)),
        addPatient: (id) => dispatch(actions.addPatient(id, '', true)),
        onGetIntervalForDate: (beginDay, endDay) => dispatch(actions.getDateIntervalWithoutMakingApp(beginDay, endDay)),
        onGetAllDocIntervals: (id) => dispatch(actions.getAllDocIntervals(id)),
        onSaveReception: (reception) => dispatch(actions.setReception(reception)),
        onGetAppointments: (obj) => dispatch(actions.getAppsBetweenDocAndUser(obj)),
        onSelectTretment: (id) => dispatch(actions.selectTreatment(id)),
        addConclusion:(id_zap, file) => dispatch(actions.uploadConclusion(id_zap, file)),
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CoachPage);
