const BaseDAO = require('../../init/base_dao');
const AdminSchema = require('./index.js');

class UsersDAO extends BaseDAO {
    constructor() {
        super('admins', AdminSchema);
    }
}

module.exports = new UsersDAO();
