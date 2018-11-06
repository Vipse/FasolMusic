import MainPage from '../containers/MainPage'
import Schedule from '../containers/Schedule'
import Homework from '../containers/Homework'
import Patients from '../containers/Patients'
import PatientsPage from '../containers/PatientsPage'
import PersonalInfo from '../containers/PersonalInfo'
import Payment from '../containers/Payment'
import Bonus from '../containers/Bonus'
import Reviews from '../containers/Reviews'
import MyDoctors from '../containers/MyDoctors'

import Chat from '../containers/Chat'
import DoctorPage from "../containers/DoctorPage";

export const docRoutes = [
    {
        path: '/app',
        component: MainPage,
        exact: true,
    },
    {
        path: '/app/schedule',
        component: Schedule,
        exact: true,
    },
    {
        path: '/app/homework',
        component: Homework,
        exact: true,
    },
    {
        path: '/app/patients',
        component: Patients,
        exact: true,
    },
    {
        path: '/app/patient:id',
        component: PatientsPage,
        exact: true,
    },
    {
        path: '/app/personal-info',
        component: PersonalInfo,
        exact: true,
    },
    {
        path: '/app/payment',
        component: Payment,
        exact: true,
    },
    {
        path: '/app/chat',
        component: Chat,
        exact: true,
    },
    {
        path: '/app/reviews',
        component: Reviews,
        exact: true,
    },
    {
        path: '/app/bonus',
        component: Bonus,
        exact: true,
    },

];

export const patientRoutes = [
    {
        path: '/app',
        component: MainPage,
        exact: true,
    },
    {
        path: '/app/calendar',
        component: Schedule,
        exact: true,
    },
    {
        path: '/app/homework',
        component: Homework,
        exact: true,
    },
    {
        path: '/app/students',
        component: MyDoctors,
        exact: true,
    },
    {
        path: '/app/doctor:id',
        component: DoctorPage,
        exact: true,
    },
    {
        path: '/app/personal-info',
        component: PersonalInfo,
        exact: true,
    },
    {
        path: '/app/chat',
        component: Chat,
        exact: true,
    },
    {
        path: '/app/reviews',
        component: Reviews,
        exact: true,
    },
];

export const menuDoc =[
    {name: 'app', title: 'Главная', iconType: 'dashboard', svg: true},
    {name: 'app/schedule', title: 'График работы', iconType: 'calendar', svg: true},
    {name: 'app/homework', title: 'Домашние задания', iconType: 'order-form', svg: true},
    //{name: 'app/patients', title: 'Мои пациенты', iconType: 'user',},
    {name: 'app/personal-info', title: 'Личные данные', iconType: 'setting_edit', svg: true},
    {name: 'app/payment', title: 'Оплата', iconType: 'credit-card', svg: true},
    {name: 'app/bonus', title: 'Бонусы', iconType: 'bonus', svg: true},
];

export const menuPatient =[
    {name: 'app', title: 'Главная', iconType: 'dashboard', svg: true},
    {name: 'app/calendar', title: 'Календарь', iconType: 'calendar', svg: true},
    {name: 'app/treatment', title: 'Обращения', iconType: 'order-form', svg: true},
    {name: 'app/doctors', title: 'Мои врачи', iconType: 'user',},
    {name: 'app/personal-info', title: 'Личные данные', iconType: 'setting_edit', svg: true},
    {name: 'app/reviews', title: 'Мои отзывы', iconType: 'chat', svg: true},
];


