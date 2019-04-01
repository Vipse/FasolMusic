// You don't need to specify field 'svg'. There is special check

export const menuItems =[
    {name: '', title: 'Главная', iconType: 'dashboard', svg: true, onClick: () => {console.log('main')}},
    {name: 'schedule', title: 'График работы', iconType: 'calendar', svg: true},
    {name: 'treatment', title: 'Домашние задания', iconType: 'order-form', svg: true},
    {name: 'students', title: 'Мои пациенты', iconType: 'user',},
    {name: 'personal-info', title: 'Личные данные', iconType: 'setting_edit', svg: true},
    {name: 'reviews', title: 'Отзывы пациентов', iconType: 'chat', svg: true},
]

export const menuItemsUser =[
    {name: '', title: 'Главная', iconType: 'dashboard', svg: true, onClick: () => {console.log('main')}},
    {name: 'schedule', title: 'Календарь', iconType: 'calendar', svg: true},
    { name: 'treatment', title: 'Домашние задания', iconType: 'order-form', svg: true},
    {name: 'students', title: 'Мои врачи', iconType: 'user',},
    {name: 'personal-info', title: 'Личные данные', iconType: 'setting_edit', svg: true},
    {name: 'reviews', title: 'Мои отзывы', iconType: 'chat', svg: true},
]
