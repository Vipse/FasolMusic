export function getRandomTraining(wantIntervals, workTrainerTimes) {
    const time8_00 = 1540875600000,
            time23_00 = 1540929600000,
            timeStep = 3000000,
            maxWant = wantIntervals.length;

    let goodInterval = [];
    for(let t = time8_00; t < time23_00; t+= timeStep){
        wantIntervals.forEach((day) => {
            day.intervals.forEach((interval) => {
                    let date = new Date(t), // перебираемое время
                        startDate = new Date(interval.start), // start желаемого время
                        endDate = new Date(interval.end); // end желаемого время
                    
                        
                    if( startDate <= date && date <= endDate) {
                        goodInterval.push(date.getTime());
                    }
            })
        })
    }
      
//console.log('goodInterval :', goodInterval);
    // for(let i = 0; i < maxWant; i++){
    //     for(let j = 0; j < maxWork; j++){


    //     }
    // }
            
    // и проверка каждые 45 мин
    
}
