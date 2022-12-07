
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
                VALUES (%(location_name)s, %(lat)s, %(lng)s, %(user_id)s, NOW(), NOW());"""
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
                LEFT JOIN users ON locations.user_id = users.id
                WHERE user_id = %(id)s AND name = %(name)s;"""
        result = connectToMySQL(cls.db_name).query_db(query, data)
        print(result)
        location = None
        if result:
            location = cls(result[0])
        return location

    @staticmethod
    def is_valid_location_entry(location):
        is_valid = True
        if (not location['location_name'] and not location['lat'] and not location['lng']):
            flash('All fields must be filled out.', 'location_entry_error')
            is_valid = False
        elif len(location['location_name']) < 1:
            flash('Name must be at least one character.', 'location_entry_error')
            is_valid = False
        elif (not location['lat'] or not location['lng']):
            flash('Please enter a valid address.', 'location_entry_error')
            is_valid = False
        data = {
            'id': location['user_id'],
            'name': location['location_name']
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