require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

//Get all items that contain text
function searchAllItems(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(res => {
            console.log(res)
        });
}

//searchAllItems('sal');

function itemsByPage(page) {
    const offset = 6 * (page - 1);
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(6)
        .offset(offset)
        .then(res => {
            console.log(res)
        });
}

//itemsByPage(3);

function itemsAfterDate(daysAgo) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(res => {
            console.log(res)
        });
}

//itemsAfterDate(4);

function sumAllTheThings() {
    knexInstance
        .select('category')
        .from('shopping_list')
        .groupBy('category')
        .sum('price')
        .then(res => {
            console.log(res)
        });
}

sumAllTheThings();