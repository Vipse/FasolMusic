
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