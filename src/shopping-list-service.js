const ShoppingListService = {
    getAllItems(knex) {
        return knex.select('*').from('shopping_list');
    },
    addItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    getById(knex, id) {
        return knex.select('*').from('shopping_list').where('id', id).first();
    },
    deleteItem(knex, id) {
        return knex('shopping_list').delete().where({ id });
    },
    updateItem(knex, id, info) {
        return knex('shopping_list').where({ id }).update(info);
    }

};

module.exports = ShoppingListService;