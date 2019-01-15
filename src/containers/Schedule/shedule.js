// покупаем абонемент - выбираем желаемое время - редирект в расписание и 
import { moment } from 'moment';
// нажатие на кнопку сохранить
// заполняем выбранную неделю и дозаполняем будующие

export function fillTrainingWeek(idStudent, amount, discipline, apiPatients) {
 
    console.log('amount :', amount);
    //if(Array.isArray(apiPatients) && apiPatients.length) return null;  
    //  isArray не прохоидт если брать из mock-data
    
    //  начало абонемента ~ первая тренировка
    const begin = apiPatients.reduce((min, el) => {
            return el.start.getTime() < min ? el.start.getTime() : min;
        }, Infinity);

    const abonement = {
            idStudent : idStudent,
            dateStart :  Math.floor( +begin / 1000),
            amount: amount,
            discipline : discipline,
            trainingtime: { }       
    }
    
  
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