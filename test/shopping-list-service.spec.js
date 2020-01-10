const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping List Service Object', () => {
    let db;

    let testItems = [
        {
          id: 1,
          name: 'First test item!',
          date_added: new Date('2029-01-22T16:28:32.615Z'),
          price: '12.00',
          category: 'Main',
          checked: false
        },
        {
          id: 2,
          name: 'Second test item!',
          date_added: new Date('2100-05-22T16:28:32.615Z'),
          price: '21.00',
          category: 'Snack',
          checked: false
        },
        {
          id: 3,
          name: 'Third test item!',
          date_added: new Date('1919-12-22T16:28:32.615Z'),
          price: '3.00',
          category: 'Lunch',
          checked: false
        },
        {
          id: 4,
          name: 'Third test item!',
          date_added: new Date('1919-12-22T16:28:32.615Z'),
          price: '0.99',
          category: 'Breakfast',
          checked: false
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    before(() => db('shopping_list').truncate());

    afterEach(() => db('shopping_list').truncate());

    after(() => db.destroy());

    context('Given shopping_list has data', () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems);
        });

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                });
        });

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3;
            const thirdTestItem = testItems[thirdId - 1];
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        date_added: thirdTestItem.date_added,
                        price: thirdTestItem.price,
                        category: thirdTestItem.category,
                        checked: thirdTestItem.checked
                    });
                });
        });

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3;
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems.filter(item => item.id !== itemId);
                    expect(allItems).to.eql(expected);
                });
        });

        it(`updateItem() updates an item from 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
                name: 'updated title',
                price: '99.99',
                date_added: new Date(),
                checked: true,
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData,
                        category: 'Lunch'
                    });
                });
        });
    });

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                });
        });

        it(`addItem() adds a new item and resolves the new item with an 'id`, () => {
            const newItem = {
                name: 'Test new name name',
                price: '5.05',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Lunch',
            };
            return ShoppingListService.addItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: new Date(newItem.date_added),
                        checked: newItem.checked,
                        category: newItem.category,
                    });
                });        
        })
    });
})