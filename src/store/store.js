import { createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import patientsReducer from './reducers/patients'
import authReducer from './reducers/auth'
import infoDoctorReducer from './reducers/doctorData'
import infoPatientReducer from './reducers/patientData'
import chatWSReducer from './reducers/chatWS'
import loadingReducer from './reducers/loading'
import studentReducer from './reducers/student'
import trainerReducer from './reducers/trainer'
import trainingReducer from './reducers/training'
import adminReducer from './reducers/admin'
import abonementReducer from './reducers/abonement'
import acquiringReducer from './reducers/acquiring'
import homeworkReducer from './reducers/homework'


const rootReducer = combineReducers({
    patients: patientsReducer,
    auth: authReducer,
    profileDoctor: infoDoctorReducer,
    profilePatient: infoPatientReducer,
    chatWS: chatWSReducer,
    loading: loadingReducer,
    abonement: abonementReducer,
    student: studentReducer,
    trainer: trainerReducer,
    training: trainingReducer,
    admin: adminReducer,
    acquiring: acquiringReducer,
    homework: homeworkReducer
});

export default function configureStore() {
    return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
}
