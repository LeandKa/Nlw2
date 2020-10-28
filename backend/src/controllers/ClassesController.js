const db = require('../database/connection');
const convertHourToMinutes = require('../util/convertHourToMinutes');

module.exports ={

    async index(request,response){

        const filters = request.query;

        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error:'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHourToMinutes.convertHourToMinutes(filters.time);

        const classes = await db('classes')
        .whereExists(function(){
            this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(filters.week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject', '=', filters.subject)
        .join('users','classes.user_id','=','users.id')
        .select(['classes.*','users.*'])
        
        return response.json(classes);
    },
    async create(request,response){
        const{
            name,avatar,whatsapp,bio,subject,cost,schedule
        } = request.body;
    
       const insertedUserIds =  await db('users').insert({
            name,
            avatar,
            whatsapp,
            bio
        });
    
        const user_id = insertedUserIds[0];
    
        const trx =await db.transaction();
    
    
       try {
        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id
        })
    
    
        const class_id = insertedClassesIds[0];
    
        const classSchedule = schedule.map(scheduleItem=>{
    
            return {
               class_id,
               week_day:scheduleItem.week_day,
               from:convertHourToMinutes.convertHourToMinutes(scheduleItem.from),
               to:convertHourToMinutes.convertHourToMinutes(scheduleItem.to)
            };
        })
    
        await trx('class_schedule').insert(classSchedule);
    
    
        await trx.commit();
    
        return response.status(201).send()
       } catch (err) {
    
        await trx.rollback();
    
           return response.status(400).json({
               error:'Unexpected error while creating new class'
           })
       }
    
    }
}