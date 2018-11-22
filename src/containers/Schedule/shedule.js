// покупаем абонемент - выбираем желаемое время - редирект в расписание и 
import { apiPatients } from './mock-data';
import { moment } from 'moment';
// нажатие на кнопку сохранить
// заполняем выбранную неделю и дозаполняем будующие

export function fillTrainingWeek(amount, discipline = "Вокал") {
    console.log("SAVE", apiPatients);

    //if(Array.isArray(apiPatients) && apiPatients.length) return null;  
    //  isArray не прохоидт если брать из mock-data
    
    //  начало абонемента ~ первая тренировка
    const begin = apiPatients.reduce((min, el) => {
            return el.start.getTime() < min ? el.start.getTime() : min;
        }, Infinity);

    const abonement = {
            idStudent : "1234", // id student
            dateStart :  Math.floor( +begin / 1000),
            amount: 8,//amount,
            discipline : discipline,
            trainingtime: { }       
    }
    
    console.log('apiPatients :', apiPatients);
    apiPatients.forEach((el) => {

        let week = el.start.getDay(); // тк воскр-0 ,а надо понедел-0
        if(!Array.isArray(abonement.trainingtime[week])) abonement.trainingtime[week] = [];

        abonement.trainingtime[week].push( 
            {
                id: el.idMaster,
                start: Math.floor(+el.start.getTime() / 1000) 
            }     
        );
        console.log('abonementEACH :', abonement);
    })

    return abonement;

}