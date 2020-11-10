const BaseDAO = require('../../init/base_dao');
const RestoSchema = require('./index.js');

class RestosDAO extends BaseDAO {
    constructor() {
        super('restos', RestoSchema);
    }
}

module.exports = new RestosDAO();
