const BaseDAO = require('../../init/base_dao');
const PhotosSchema = require('./index.js');

class PhotosDAO extends BaseDAO {
    constructor() {
        super('photos', PhotosSchema);
    }
}

module.exports = new PhotosDAO();
