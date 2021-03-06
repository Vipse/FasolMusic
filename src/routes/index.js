import MainPage from '../containers/MainPage'
import Schedule from '../containers/Schedule'
import Homework from '../containers/Homework'
import StudentPage from '../containers/StudentPage'
import CoachPage from "../containers/CoachPage"
import PersonalInfo from '../containers/PersonalInfo'
import Payment from '../containers/Payment'
import Bonus from '../containers/Bonus'
import Reviews from '../containers/Reviews'

import Chat from '../containers/Chat'

export const coachRoutes = [
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
        path: '/app/student:id',
        component: StudentPage,
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

export const studentRoutes = [
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
        path: '/app/coach:id',
        component: CoachPage,
        exact: true,
    },
    {
        path: '/app/coach/:id',
        component: CoachPage,
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


export const adminRoutes = [
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
        path: '/app/coach:id',
        component: CoachPage,
        exact: true,
    },
    {
        path: '/app/student:id',
        component: StudentPage,
        exact: true,
    },
    {
        path: '/app/schedule:id',
        component: Schedule,
        exact: true,
    }
]

export const menuCoach =[
    {name: 'app', title: 'Главная', iconType: 'dashboard', svg: true},
    {name: 'app/schedule', title: 'График работы', iconType: 'calendar', svg: true},
    {name: 'app/homework', title: 'Домашние задания', iconType: 'order-form', svg: true},
    {name: 'app/personal-info', title: 'Мой профиль', iconType: 'setting_edit', svg: true},
    {name: 'app/payment', title: 'Оплата', iconType: 'credit-card', svg: true},
    {name: 'app/bonus', title: 'Получить бонусы', iconType: 'bonus', svg: true},
    {name: 'app/chat', title: 'Чат', iconType: 'order-form', svg: true}
];

export const menuStudent =[
    {name: 'app', title: 'Главная', iconType: 'dashboard', svg: true},
    {name: 'app/schedule', title: 'Календарь', iconType: 'calendar', svg: true},
    {name: 'app/homework', title: 'Домашние задания', iconType: 'order-form', svg: true},
    {name: 'app/personal-info', title: 'Мой профиль', iconType: 'setting_edit', svg: true},
    {name: 'app/payment', title: 'Оплата', iconType: 'credit-card', svg: true},
    {name: 'app/bonus', title: 'Бонусы', iconType: 'bonus', svg: true},
    {name: 'app/chat', title: 'Чат', iconType: 'order-form', svg: true}
];

export const menuAdmin =[
    {name: 'app', title: 'Главная', iconType: 'dashboard', svg: true},
    {name: 'app/schedule', title: 'График работы', iconType: 'calendar', svg: true}
];
