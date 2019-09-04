import { createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import studentsReducer from './reducers/students'
import authReducer from './reducers/auth'
import infoCoachReducer from './reducers/coachData'
import infoStudentReducer from './reducers/studentData'
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
    students: studentsReducer,
    auth: authReducer,
    profileCoach: infoCoachReducer,
    profileStudent: infoStudentReducer,
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
