import moment from 'moment';

export const profileCoach = {
    /*personalContact*/
            secondname  : "Иванова",
            firstname   : "Иван",
            patronymic  : "Иванович",
            phone       : "+375 29 111 11 11",
            email       : "test@test.com",
            oldPassword : "",  // пользователь сам вводит старый пароль ( как например в vk )
            newPassword : "",
    /*personEducation*/
            arrayMainInstitution   : [
                {
                    id: 0,
                    mainInstitution: " Инстутит1",
                    mainDateStart: moment(946674000000),
                    mainDateEnd: moment(946864000000),
                    mainSpecialty : " Специал1"
                },
                {
                    id: 1,
                    mainInstitution: " Инстутит1",
                    mainDateStart: moment(946674000000),
                    mainDateEnd: moment(946864000000),
                    mainSpecialty : " Специал1"
                }
            ],
            arraySecondInstitution   : [
                {
                    id: 0,
                    secondInstitution: "БГУ",
                    dateStart: moment(946674000000),
                    dateEnd: moment(946864000000),
                    secondSpecialty : " Специал2"
                },
                {
                    id: 1,
                    secondInstitution: "БГУ",
                    dateStart: moment(946674000000),
                    dateEnd: moment(946864000000),
                    secondSpecialty : " Специал2"
                }
            ],
            degree: {
                name: "Пункт 1"
            },
    /*personExperience*/
            expWork      : "10",
            arrayExpWork : [

            ],
            category : "1-ая категория",
    /*personInformation */
            langData  : ["Английский", "Русский"],
            priceData : '50 - 100 руб',
            consultChildren : true,
            freeConsult : true
};
