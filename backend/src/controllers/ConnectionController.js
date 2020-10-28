const { index, create } = require("./ClassesController");
const db = require('../database/connection');

module.exports = {

    async index(request,response){
     const totalConnections = await db('connections').count('* as total');

     const { total } = totalConnections[0];

     return response.json({total})

    },


    async create(request,response){
        const { user_id} = request.body;


        await db('connections').insert({
            user_id,
        });

        return response.status(201).send();

    }

}