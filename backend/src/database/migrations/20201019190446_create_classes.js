
exports.up = function(knex) {
    return knex.schema.createTable('classes',function(table){
        table.increments('id').primary;
        table.string('subject').notNullable();
        table.decimal('cost').notNullable();
       
        table.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('classes')
};
