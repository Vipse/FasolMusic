import { createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import patientsReducer from './reducers/patients'
import reviewsReducer from './reducers/reviews'
import schedulesReducer from './reducers/schedules'
import treatmentsReducer from './reducers/treatment'
import authReducer from './reducers/auth'
import doctorReducer from './reducers/doctor'
import infoDoctorReducer from './reducers/doctorData'
import infoPatientReducer from './reducers/patientData'
import chatWSReducer from './reducers/chatWS'
import loadingReducer from './reducers/loading'
import studentReducer from './reducers/student'
import trainerReducer from './reducers/trainer'
import trainingReducer from './reducers/training'
import adminReducer from './reducers/admin'
import abonementReducer from './reducers/abonement'


const rootReducer = combineReducers({
    patients: patientsReducer,
    reviews: reviewsReducer,
    schedules: schedulesReducer,
    treatments: treatmentsReducer,
    auth: authReducer,
    doctor: doctorReducer,
    profileDoctor: infoDoctorReducer,
    profilePatient: infoPatientReducer,
    chatWS: chatWSReducer,
    loading: loadingReducer,
    abonement: abonementReducer,
    student: studentReducer,
    trainer: trainerReducer,
    training: trainingReducer,
    admin: adminReducer,
});

export default function configureStore() {
    return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
}