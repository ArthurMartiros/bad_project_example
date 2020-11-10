module.exports = {
    users:{

        name_min_length: 1,
        name_max_length: 24,
        email_maxlength: 255,
        password_minlength: 4,
        password_maxlength: 50,
        phone_maxlength: 12,
        phone_minlength: 5,
        reserved_usernames: ['ninja', 'www', 'etc', 'code', 'vrdo', 'vardanator', 'vahe', 'vahik', 'service',
            'serviz', 'servizio', 'serviceio', 'servizioo', 'resto', 'rest', 'restoran', 'restaaurant'],
        default_avatar_url: 'https://cdn21.picsart.com/145116821005201.png',
        default_cover_url: 'https://cdn102.picsart.com/201968254000201.jpg',
        check_name_lenght: function(name){
            return name.length >= this.name_min_legth && name.length <= this.name_max_length;
        }
    },
    resto: {
        name_minlength: 2,
        name_maxlength: 200
    },
    table: {
        chairs_minlength: 1,
        chairs_maxlength: 100
    },
    general: {
        url_maxlength: 2084,
        city_maxlength: 100,
        country_maxlength: 100,
        country_code_maxlength: 3,
        currency_maxlength: 10,
        currency_symbol_maxlength: 1,
        street_maxlength: 120,
        zip_maxlength: 8
    },
    query: {
        offset_min: 0,
        offset_max: 999999999,
        limit_min: 0,
        limit_max: 60,
        users: {
            offset_min: 0,
            offset_max: 999999999,
            limit_min: 0,
            limit_max: 60
        }
    },
   
    
}