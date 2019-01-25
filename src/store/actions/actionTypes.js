export const GET_ALL_INTERVALS = 'GET_ALL_INTERVALS',
    CLEAR_INTERVALS = 'CLEAR_INTERVALS',
    CLEAR_VISITS = 'CLEAR_VISITS',
    GET_ALL_VISITS = 'GET_ALL_VISITS',
    GET_ALL_USER_VISITS = 'GET_ALL_USER_VISITS',
    GET_COUNT_NEAR_VISITS = 'GET_COUNT_NEAR_VISITS',
    SELECT_EVENT = 'SELECT_EVENT',
    DELETE_EVENT = 'DELETE_EVENT',
    OPEN_CANCEL_MODAL = 'OPEN_CANCEL_MODAL',
    CLOSE_CANCEL_MODAL = 'CLOSE_CANCEL_MODAL';

export const GET_ALL_REVIEWS = 'GET_ALL_REVIEWS',
    GET_ALL_REVIEWS_ERROR = 'GET_ALL_REVIEWS_ERROR',
    PUT_COMMENT_ANSWER = 'PUT_COMMENT_ANSWER',
    PUT_COMMENT_ANSWER_ERROR = 'PUT_COMMENT_ANSWER_ERROR',
    GET_ALL_REVIEWS_BY_PATIENT = 'GET_ALL_REVIEWS_BY_PATIENT';

export const AUTH_FAIL = 'AUTH_FAIL',
    AUTH_SUCCESS = 'AUTH_SUCCESS',
    AUTH_START = 'AUTH_START',
    REG_DOCTOR_START = 'REG_DOCTOR_START',
    REG_DOCTOR_EXIST = 'REG_DOCTOR_EXIST',
    REG_DOCTOR_SUCCESS = 'REG_DOCTOR_SUCCESS',
    REG_PATIENT_START = 'REG_PATIENT_START',
    REG_PATIENT_EXIST = 'REG_PATIENT_EXIST',
    REG_PATIENT_SUCCESS = 'REG_PATIENT_SUCCESS',
    RESET_REG_STATUS = 'RESET_REG_STATUS';

export const GET_DOCTORS_PATIENTS = 'GET_DOCTORS_PATIENTS',
    GET_PATIENT_DOCTORS = 'GET_PATIENT_DOCTORS',
    GET_PATIENT_DOCTORS_SHORT = 'GET_PATIENT_DOCTORS_SHORT',
    GET_PATIENT_DOCTORS_LOADING = 'GET_PATIENT_DOCTORS_LOADING',
    GET_NOT_DOCTORS_PATIENTS = 'GET_NOT_DOCTORS_PATIENTS',
    GET_NOT_PATIENT_DOCTORS = 'GET_NOT_PATIENT_DOCTORS',
    GET_SELECTED_PATIENT_INFO = 'GET_SELECTED_PATIENT_INFO',
    SELECT_PATIENT = 'SELECT_PATIENT',
    UNSELECT_PATIENT = 'UNSELECT_PATIENT',
    GET_DATE_INTERVAL = 'GET_DATE_INTERVAL',
    GET_DATE_INTERVAL_WITHOUT_MAKING_APP = 'GET_DATE_INTERVAL_WITHOUT_MAKING_APP',
    SET_RECEPTION = "SET_RECEPTION",
    SET_RECEPTION_BY_PATIENT = "SET_RECEPTION_BY_PATIENT",
    GET_RESULTS_HEADER_SEARCH= 'GET_RESULTS_HEADER_SEARCH',
    CLEAR_CALLBACK = 'CLEAR_CALLBACK';

export const GET_ALL_TREATMENTS = 'GET_ALL_TREATMENTS',
    GET_TREATMENTS = 'GET_TREATMENTS',
    GET_ACTUAL_TREATMENTS = 'GET_ACTUAL_TREATMENTS',
    GET_COMPLETED_TREATMENTS = 'GET_COMPLETED_TREATMENTS',
    GET_COMPLETED_APPS = 'GET_COMPLETED_APPS',
    APPS_BETWEEN_DOC_USER = 'APPS_BETWEEN_DOC_USER',
    SELECT_VISIT = "SELECT_VISIT",
    SELECT_TREATMENT = 'SELECT_TREATMENT',
    CLEAR_VISIT_AND_TREAT = 'CLEAR_VISIT_AND_TREAT',
    GET_TREATMENT_FILES = 'GET_TREATMENT_FILES';

export const INFO_PATIENT = 'INFO_PATIENT',
    GET_USER_INFO_SHORT = 'GET_USER_INFO_SHORT',
    SEND_USER_POLE_VALUE = 'SEND_USER_POLE_VALUE';

export const GET_DOCTOR_TODAY_INFO = 'GET_DOCTOR_TODAY_INFO',
    GET_DOCTOR_SHORT_INFO = 'GET_DOCTOR_SHORT_INFO',
    SET_EX_INTERVAL_INFO = 'SET_EX_INTERVAL_INFO',
    SWITCH_EX_INTERVAL = 'SWITCH_EX_INTERVAL',
    GET_EMERGENCY_AVAILABILITY = 'GET_EMERGENCY_AVAILABILITY';

export const INFO_DOCTOR = 'INFO_DOCTOR',
    TRAINER_TRAININGS = 'TRAINER_TRAININGS',
    SEND_NEW_INFO_DOCTOR = 'SEND_NEW_INFO_DOCTOR',
    GET_ALL_DOC_INTERVALS = 'GET_ALL_DOC_INTERVALS',
    GET_INTERVALS_FOR_FREE_VISITS = 'GET_INTERVALS_FOR_FREE_VISITS',
    DOC_INTERVALS_WITH_APPS_ALL = 'DOC_INTERVALS_WITH_APPS_ALL';

export const LOADING_START = 'LOADING_START',
    LOADING_END = 'LOADING_END',
    DOC_EMERGANCY_REQUEST_SENT = 'DOC_EMERGANCY_REQUEST_SENT',
    DOC_EMERGANCY_RECEIVED_MARK = 'DOC_EMERGANCY_RECEIVED_MARK',
    DOC_EMERGANCY_REQUEST_RECEIVED = 'DOC_EMERGANCY_REQUEST_RECEIVED';

export const SET_RECEPTION_ISSTART = 'SET_RECEPTION_ISSTART',
    SET_RECEPTION_ISCALLING = 'SET_RECEPTION_ISCALLING',
    SET_CHAT_FROM_ID = 'SET_CHAT_FROM_ID',
    SET_CHAT_TO_ID = 'SET_CHAT_TO_ID',
    SET_CHAT_STORY = 'SET_CHAT_STORY',
    SET_NEW_TIMER = 'SET_NEW_TIMER';


export const SET_FREE_INTERVALS = 'SET_FREE_INTERVALS', // abonement
    SET_NEED_SAVE_INTERVALS = 'SET_NEED_SAVE_INTERVALS';    

export const CREATE_ABONEMENT = 'CREATE_ABONEMENT',
    GET_ABONEMENTS = 'GET_ABONEMENTS',
    CHANGE_CURRENT_DISCIPLINE = 'CHANGE_CURRENT_DISCIPLINE',
    SET_WEEK_INTERVAL = 'SET_WEEK_INTERVAL',
    SET_CHOOSE_THE_MASTER_BY_STUDENT = 'SET_CHOOSE_THE_MASTER_BY_STUDENT',
    GET_ABONEMENTS2 = 'GET_ABONEMENTS2';  

export const  // student
    GET_DEADLINE_PAY = 'GET_DEADLINE_PAY',
    GET_FULL_INFO_MASTERS = 'GET_FULL_INFO_MASTERS',
    GET_THE_MASTER_INTERVAL = 'GET_THE_MASTER_INTERVAL',
    
    SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS = 'SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS',

    GET_AVAILABLE_INTERVAL = 'GET_AVAILABLE_INTERVAL',
    MASTER_SCHEDULE = 'MASTER_SCHEDULE',
    SET_IS_PUSH_BTN_TRANSFER = 'SET_IS_PUSH_BTN_TRANSFER',
    SET_IS_PUSH_BTN_ADD = 'SET_IS_PUSH_BTN_ADD',
    SET_IS_PUSH_TRIAL_TRAINING = 'SET_IS_PUSH_TRIAL_TRAINING',
    GET_USER_INFO = 'GET_USER_INFO';

export const GET_MASTER_LIST = 'GET_MASTER_LIST',
    REG_TRAINER = 'REG_TRAINER',
    SET_CHOOSE_MASTER = 'SET_CHOOSE_MASTER',
    GET_POST_TRAINER_TRAINING = 'GET_POST_TRAINER_TRAINING',
    GET_FUTURE_TRAINER_TRAINING = 'GET_FUTURE_TRAINER_TRAINING',
    GET_TODAY_TRAINER_TRAINING = 'GET_TODAY_TRAINER_TRAINING',
    GET_TRAINER_TRAINING_BY_TRAINER = 'GET_TRAINER_TRAINING_BY_TRAINER',
    GET_TRAINER_TRAINING = 'GET_TRAINER_TRAINING'; // coach


export const GET_NEXT_TRAINING = 'GET_NEXT_TRAINING',
    GET_MY_MASTERS_OR_STUDENTS = 'GET_MY_MASTERS_OR_STUDENTS',
    UNAUTHORIZED_TRIAL_DATA = 'UNAUTHORIZED_TRIAL_DATA',
    GET_TRAINING_NOT_FINISHED = 'GET_TRAINING_NOT_FINISHED'; //training

export const GET_FREE_AND_BUSY_MASTER_LIST = 'GET_FREE_AND_BUSY_MASTER_LIST', //admin
    GET_ALL_ADMIN_INFO_MASTERS_BUSY = 'GET_ALL_ADMIN_INFO_MASTERS_BUSY',
    GET_ALL_ADMIN_INFO_MASTERS_FREE = 'GET_ALL_ADMIN_INFO_MASTERS_FREE';

