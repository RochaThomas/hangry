
from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash

class Location:
    db_name = "hangry_schema"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.lat = data['lat']
        self.lng = data['lng']
        self.user_id = data['user_id']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def add_location(cls, data):
        query = """INSERT INTO locations (name, lat, lng, user_id, created_at, updated_at)
                VALUES (%(name)s, %(lat)s, %(lng)s, %(user_id)s, NOW(), NOW());"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @classmethod
    def get_all_locations(cls, data):
        query = """SELECT * FROM locations
                LEFT JOIN users ON locations.user_id = users.id
                WHERE user_id = %(id)s;"""
        results = connectToMySQL(cls.db_name).query_db(query, data)
        locations = []
        if results:
            for row in results:
                locations.append( cls(row) )
        return locations

    @classmethod
    def get_location_by_name(cls, data):
        query = """SELECT * FROM locations
                WHERE user_id = %(id)s AND name = %(name)s;"""
        result = connectToMySQL(cls.db_name).query_db(query, data)
        print(result)
        location = None
        if result:
            location = cls(result[0])
        return location

    @classmethod
    def get_location_by_id(cls, data):
        query = """SELECT * FROM locations
                WHERE user_id = %(id)s AND locations.id = %(location_id)s;"""
        result = connectToMySQL(cls.db_name).query_db(query, data)
        print(result)
        location = None
        if result:
            location = cls(result[0])
        return location

    @classmethod
    def delete(cls, data):
        query = """DELETE FROM locations
                WHERE user_id = %(user_id)s
                AND id = %(delete_location_id)s;"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @staticmethod
    def is_valid_location_entry(location):
        is_valid = True
        if len(location['name']) < 1:
            flash('A name is required.', 'location_entry_error')
            is_valid = False
        elif (location['street_address'] == "" or
            location['city'] == "" or
            location['state'] == "" or
            location['zip_code'] == ""):
            flash('All fields are required.', 'location_entry_error')
            is_valid = False
        elif (not location['lat'] or not location['lng']):
            flash('Please enter a valid address.', 'location_entry_error')
            is_valid = False
        data = {
            'id': location['user_id'],
            'name': location['name']
        }
        check = Location.get_location_by_name(data)
        if check:
            flash('You already have a location with that name. Location names must be unique.', 'location_entry_error')
            is_valid = False
        return is_valid

    @staticmethod
    def is_valid_one_time_location_entry(location):
        is_valid = True
        if (location['street_address'] == "" or
            location['city'] == "" or
            location['state'] == "" or
            location['zip_code'] == ""):
            flash('All fields must be filled in.', 'one_time_location_entry_error')
            is_valid = False
        return is_valid

    @staticmethod
    def is_valid_location_entry_quick_sign_up(location):
        is_valid = True
        if len(location['name']) < 1:
            flash('A location name is required.', 'location_entry_quick_sign_up_error')
            is_valid = False
        if (location['lat'] == "" or
            location['lng'] == ""):
            flash('Location Invalid: Are you a user coming from a one-time use? If not use the regular sign up above.', 'location_entry_quick_sign_up_error')
            is_valid = False
        return is_valid