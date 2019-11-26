import moment from 'moment'

export function fillTrainingWeek(idStudent, amount, isNoTrial, discipline, apiPatients) {
 
    const begin = apiPatients.reduce((min, el) => {
            return el.start.getTime() < min ? el.start.getTime() : min;
        }, Infinity);

    const abonement = {
            idStudent,
            dateStart:  Math.floor( +begin / 1000),
            amount,
            discipline,
            trainingtime: {},
            isNoTrial      
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
    })

    return abonement;
}


export function getNewTrainingTime(trainingTime, time, event) {
    let newTrainingTime = { ...trainingTime }
    let weekDay = moment(+time * 1000).weekday() + 1; //+1, но надо было пн=0 ... воскр=6

    if (!newTrainingTime.hasOwnProperty(weekDay)) {
      newTrainingTime[weekDay] = []
    }

    newTrainingTime[weekDay].push({
      id: event.idMaster,
      start: time
    })

    return newTrainingTime
  }