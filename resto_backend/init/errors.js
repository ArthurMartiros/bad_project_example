const errors = {
    USER_NOT_FOUND: 'user_not_found',
    USER_EXISTS: 'user_exists',
    USER_UPDATE_FAILED: 'user_update_failed',
    PERMISSION_DENIED: 'permission_denied',
    INTERNAL_ERROR: 'internal_error',
    INVALID_EMAIL: 'invalid_email',
    INVALID_PASSWORD: 'invalid_password',
    INVALID_PHONE: 'invalid_phone',
    FILE_NOT_PROVIDED: 'file_not_provided',
    THIRD_PARTY_ERROR: 'third_party_error',
    UPLOAD_ERROR: 'upload_error',
    ORDER_FETCH_ERROR: 'order_fetch_error',
    INVALID_ORDER_NUMBER: 'invalid_order_number',
    INVALID_INPUT_DATA: 'invalid_input_data',
    MISSING_REQUIRED_PARAMETER: 'missing_required_parameter',
    EMPTY_PARAMETER: 'empty_parameter',
    FAILED_TO_CREATE_UNKNOWN_USER: 'failed_to_create_unknown_user',
    FAILED_TO_CREATE_USER: 'failed_to_create_user',
    RESTO_NOT_FOUND: 'resto_not_found',
    RESTO_CREATE_FAILED: 'resto_create_failed',
    RESTO_UPDATE_FAILED: 'resto_update_failed',
    RESTO_DELETE_FAILED: 'resto_delete_failed',
    TABLE_CREATION_FAILED: 'table_creation_failed',
    TABLE_UPDATE_FAILED: 'table_update_failed',
    TABLE_NOT_FOUND: 'table_not_found',
    QR_FAILED: 'qr_failed',
    UNKNOWN_ERROR: 'unknown_error',
    FAILED_REGISTER: 'failed_register',
    MENU_CREATION_FAILED: 'failed_create_menu',
    CATEGORIES_CREATION_FAILED: 'failed_create_categories',
    CATEGORIES_UPDATE_FAILED: 'failed_update_categories'

};

const err_objects = new Map();
err_objects.set(errors.USER_NOT_FOUND, {error: errors.USER_NOT_FOUND, message: 'User Not Found.'});
err_objects.set(errors.USER_EXISTS, {error: errors.USER_EXISTS, message: 'User Already Exists.'});
err_objects.set(errors.USER_UPDATE_FAILED, {error: errors.USER_UPDATE_FAILED, message: 'Failed to update user data.'});
err_objects.set(errors.PERMISSION_DENIED, {error: errors.PERMISSION_DENIED, message: 'Permission Denied.'});
err_objects.set(errors.INTERNAL_ERROR, {error: errors.INTERNAL_ERROR, message: 'Internal Error.'});
err_objects.set(errors.INVALID_EMAIL, {error: errors.INVALID_EMAIL, message: 'Invalid e-mail.'});
err_objects.set(errors.INVALID_PASSWORD, {error: errors.INVALID_PASSWORD, message: 'Invalid password.'});
err_objects.set(errors.UNKNOWN_ERROR, {error: errors.UNKNOWN_ERROR, message: 'Unknown Error.'});
err_objects.set(errors.THIRD_PARTY_ERROR, {error: errors.THIRD_PARTY_ERROR, message: 'Third Party Library Error.'});
err_objects.set(errors.FILE_NOT_PROVIDED, {error: errors.FILE_NOT_PROVIDED, message: 'File not provided.'});
err_objects.set(errors.UPLOAD_ERROR, {error: errors.UPLOAD_ERROR, message: 'Upload error.'});
err_objects.set(errors.ORDER_FETCH_ERROR, {error: errors.ORDER_FETCH_ERROR, message: 'Order fetch error.'});
err_objects.set(errors.INVALID_ORDER_NUMBER, {error: errors.INVALID_ORDER_NUMBER, message: 'Invalid order number.'});
err_objects.set(errors.INVALID_INPUT_DATA, {error: errors.INVALID_INPUT_DATA, message: 'Invalid input data.'});
err_objects.set(errors.MISSING_REQUIRED_PARAMETER, {error: errors.MISSING_REQUIRED_PARAMETER, message: 'Missing required parameter.'});
err_objects.set(errors.FAILED_TO_CREATE_UNKNOWN_USER, {error: errors.FAILED_TO_CREATE_UNKNOWN_USER, message: 'Failed to create an unknown user.'});
err_objects.set(errors.FAILED_TO_CREATE_USER, {error: errors.FAILED_TO_CREATE_USER, message: 'Failed to create an user.'});
err_objects.set(errors.RESTO_NOT_FOUND, {error: errors.RESTO_NOT_FOUND, message: 'Restaurant not found.'});
err_objects.set(errors.RESTO_UPDATE_FAILED, {error: errors.RESTO_UPDATE_FAILED, message: 'Failed to update restaurant data.'});
err_objects.set(errors.TABLE_CREATION_FAILED, {error: errors.TABLE_CREATION_FAILED, message: 'Failed to create restaurant table.'});
err_objects.set(errors.TABLE_UPDATE_FAILED, {error: errors.TABLE_UPDATE_FAILED, message: 'Failed to update restaurant table data.'});
err_objects.set(errors.TABLE_NOT_FOUND, {error: errors.TABLE_NOT_FOUND, message: 'Table not found.'});
err_objects.set(errors.QR_FAILED, {error: errors.QR_FAILED, message: 'QR creation/fetch failed.'});

const err_statuses = new Map();
err_statuses.set(errors.USER_NOT_FOUND, 404);
err_statuses.set(errors.USER_EXISTS, 400);
err_statuses.set(errors.USER_UPDATE_FAILED, 500);
err_statuses.set(errors.PERMISSION_DENIED, 401);
err_statuses.set(errors.INTERNAL_ERROR, 500);
err_statuses.set(errors.INVALID_EMAIL, 400);
err_statuses.set(errors.INVALID_PASSWORD, 400);
err_statuses.set(errors.UNKNOWN_ERROR, 500);
err_statuses.set(errors.THIRD_PARTY_ERROR, 500);
err_statuses.set(errors.FILE_NOT_PROVIDED, 400);
err_statuses.set(errors.UPLOAD_ERROR, 500);
err_statuses.set(errors.ORDER_FETCH_ERROR, 500);
err_statuses.set(errors.INVALID_ORDER_NUMBER, 400);
err_statuses.set(errors.INVALID_INPUT_DATA, 400);
err_statuses.set(errors.MISSING_REQUIRED_PARAMETER, 400);
err_statuses.set(errors.FAILED_TO_CREATE_UNKNOWN_USER, 500);
err_statuses.set(errors.FAILED_TO_CREATE_USER, 500);
err_statuses.set(errors.RESTO_NOT_FOUND, 404);
err_statuses.set(errors.RESTO_UPDATE_FAILED, 500);
err_statuses.set(errors.TABLE_UPDATE_FAILED, 500);
err_statuses.set(errors.TABLE_CREATION_FAILED, 500);
err_statuses.set(errors.TABLE_NOT_FOUND, 404);
err_statuses.set(errors.QR_FAILED, 500);

function stringify(code) {
    if (!err_objects.has(code)) {
        return err_objects.get(errors.UNKNOWN_ERROR);
    }
    return err_objects.get(code);
}

function status(code) {
    if (!err_statuses.has(code)) {
        return err_statuses.get(errors.UNKNOW_ERROR);
    }
    return err_statuses.get(code);
}

module.exports = errors;
module.exports.stringify = stringify;
module.exports.status = status;
