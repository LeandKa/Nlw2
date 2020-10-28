
module.exports ={

     convertHourToMinutes (time) {
      const [hour,minutes] =  time.split(':')
       const hora =  parseInt(hour)
       const minuto = parseInt(minutes)
       const timesInMinutes = (hora * 60)+minuto;
       return timesInMinutes
    }
}