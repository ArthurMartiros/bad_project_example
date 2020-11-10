const BaseDAO = require('../../init/base_dao');
const TableSchema = require('./index.js');

class TablesDAO extends BaseDAO {
    constructor() {
        super('tables', TableSchema);
    }
}

module.exports = new TablesDAO();
