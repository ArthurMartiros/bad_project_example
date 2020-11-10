const BaseDAO = require('../../init/base_dao');
const MenuSchema = require('./index.js');

class MenuDAO extends BaseDAO {
    constructor() {
        super('menus', MenuSchema);
    }
}

module.exports = new MenuDAO();
