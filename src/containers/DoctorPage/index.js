import React from 'react'
import {connect} from 'react-redux';
import Row from "../../components/Row";
import Col from "../../components/Col";
import HistoryReceptions from "../../components/HistoryReceptions";
import moment from "moment"

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css';
import PatientProfileDoctorItem from "../../components/PatientProfileDoctorItem";
import DoctorPageNewVisit from "../../components/DoctorPageNewVisit";
import ReviewsTree from "../../components/ReviewsTree";

class PatientsPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
        this.onMakeNewApp = this.onMakeNewApp.bind(this)
    }

    componentWillMount(){
        this.props.onGetAllReviews(0, 7, null, null, this.props.match.params.id);
        this.props.onGetInfoDoctor(this.props.match.params.id);
        this.props.onGetDocSchedule(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.id !== this.props.match.params.id) {
            this.props.onGetAllReviews(0, 7, null, null, nextProps.match.params.id);
            this.props.onGetInfoDoctor(nextProps.match.params.id);
            this.props.onGetDocSchedule(nextProps.match.params.id);
        }
    }

    getDoctorSpecialityStr = () => {
        let specialityStr = "";

        if (this.props.profileDoctor.works) {
            this.props.profileDoctor.educationsgroup1.forEach((item, i, arr) => {
                specialityStr += item.speciality;
                if (i < arr.length - 1) specialityStr += ", ";
            });
        }

        return specialityStr;
    };

    getDoctorLanguagesArr = () => {
        let languagesArr = [];

        if (typeof this.props.profileDoctor.language === "string") {
            languagesArr = this.props.profileDoctor.language.split(' ');
        }

        return languagesArr.map((item) => {
            return {language: item};
        });
    };

    getDoctorMapsArr = () => {
        let mapsArr = [];

        if (this.props.profileDoctor.works) {
            mapsArr = this.props.profileDoctor.works.map((item) => {
                return {map: (item.worknow + " - " + item.adress)};
            });
        }

        return mapsArr;
    };

    getDoctorExperienceArr = () => {
        let experienceArr = [];

        if (this.props.profileDoctor.educationsgroup1) {
            this.props.profileDoctor.educationsgroup1.map((item) => {
                experienceArr.push({
                    experience: (item.education
                        + ", специальность - " + item.speciality
                        + ", " + item.finishucationyear + " г.")
                });
            });

            this.props.profileDoctor.educationsgroup2.map((item) => {
                experienceArr.push({
                    experience: (item.education
                        + ", специальность - " + item.ciklname
                        + ", " + moment(item.ucationyears[1] * 1000)._d.getFullYear() + " г.")});
            });
        }

        return experienceArr;
    };
    // onMakeNewApp = (obj) => {
    //     obj.id_doc = this.props.match.params.id;
    //     this.props.onMakeNewAppointment(obj).then(
    //         console.log("APPOINTMENT COMPLYAT")
    //     );
    // };

    async onMakeNewApp(obj) {
        obj.id_doc=this.props.match.params.id;
        try {
            await this.props.setReceptionByPatientAsAw(obj);
        } catch(err) {
            console.error(err);
        } finally {
            console.log("APPOINTMENT WAS MADE");
        }
    }
    render(){
        const { fio, academicdegree, academicstatus, category, experience, consultationPrice, isChildConsult, avatar} = this.props.profileDoctor;
        const reviewsLoadCount = 7;
        if(!this.props.profileDoctor.fio) {
            return(
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <h3>Страница не найдена</h3>
                    <p>Проверьте введённый адрес</p>
                </div>
            )
        } else {
        return (
            <Hoc>
                <div>
                    <Row>
                        <Col span={24}>
                            <h1 className='page-title'>Профиль врача</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} xxl={15} className='section'>
                          <PatientProfileDoctorItem
                              doctorRate={this.props.ratingAll}
                              doctorReviews={this.props.commentCount}
                              doctorFavorite={true}
                              doctorAvatar={avatar}
                              doctorName={fio}
                              doctorSpeciality={this.getDoctorSpecialityStr()}
                              doctorCategory={academicdegree + '. ' + academicstatus + '. ' + category + '.'}
                              doctorExp={experience}
                              doctorPrice={consultationPrice}
                              doctorLanguages={this.getDoctorLanguagesArr()}
                              doctorChild={isChildConsult}
                              doctorMaps={this.getDoctorMapsArr()}
                              doctorExperience={this.getDoctorExperienceArr()}
                          />
                        </Col>
                        <Col xs={24} xxl={9} className='section'>
                            <DoctorPageNewVisit
                            onMakeNewAppointment = {this.onMakeNewApp}
                            docIntervalsWithAppsAll={this.props.docIntervalsWithAppsAll}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <HistoryReceptions data={this.props.appsBetween}
                                               getApps = {this.props.onGetAppointments}
                                               onGotoChat={(id) => this.props.history.push('/chat')}
                                               id_doc={this.props.match.params.id}
                        />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className='reviews-section'>
                            <ReviewsTree key={this.props.match.params.id}
                                         data={this.props.reviews}
                                         limit={reviewsLoadCount}
                                         onGoto={(val) => this.gotoHandler(val)}
                                         isOnDoctorPage={true}
                                         numberOfReviews={this.props.commentCount}
                                         onShowMore={(numberOfRequest, reviewsLoadCount, dateStart, dateEnd) =>
                                             this.props.onGetAllReviews(numberOfRequest, reviewsLoadCount, dateStart, dateEnd, this.props.match.params.id)}
                            />
                        </Col>
                    </Row>
                </div>
            </Hoc>
        )}
    }
}



const mapStateToProps = state => {
    return {
        appsBetween: state.treatments.appsBetween,
        reviews: state.reviews.reviews,
        ratingAll: state.reviews.ratingAll,
        commentCount: state.reviews.commentCount,
        profileDoctor: state.profileDoctor,
        docIntervalsWithAppsAll: state.profileDoctor.docIntervalsWithAppsAll
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addPatient: (id) => dispatch(actions.addPatient(id, '', true)),
        onMakeNewAppointment: (obj) => dispatch(actions.setReceptionByPatient(obj)),
        setReceptionByPatientAsAw: (obj) => dispatch(actions.setReceptionByPatientAsAw(obj)),
        onGetAllReviews: (numberOfRequest, reviewsLoadCount, dateStart, dateEnd, doc_id) =>
            dispatch(actions.getAllReviews(numberOfRequest, reviewsLoadCount, dateStart, dateEnd, doc_id)),
        onGetInfoDoctor: (doc_id) => dispatch(actions.getInfoDoctor(doc_id)),
        onGetDocSchedule: (doc_id) => dispatch(actions.getDateWorkIntervalWithoutMakingAppAll(doc_id)),
        onGetAppointments: (obj) => dispatch(actions.getAppsBetweenDocAndUser(obj))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientsPage);