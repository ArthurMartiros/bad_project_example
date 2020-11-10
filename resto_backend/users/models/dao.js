const BaseDAO = require('../../init/base_dao');
const UsersSchema = require('./index.js');

class UsersDAO extends BaseDAO {
    constructor() {
        super('users', UsersSchema);
    }
}

module.exports = new UsersDAO();
