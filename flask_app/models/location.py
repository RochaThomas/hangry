
from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash

class Location:
    db_name = "hangry_schema"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.street = data['street']
        self.city = data['city']
        self.zipcode = data['zipcode']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.user_id = data['user_id']

    @classmethod
    def add_location(cls, data):
        query = """INSERT INTO locations (name, street, city, zipcode, created_at, updated_at, user_id)
                VALUES (%(name)s, %(street)s, %(city)s, %(zipcode)s, NOW(), NOW(), %(user_id)s);"""
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
        if len(location['name']) < 1:
            flash('Name must be at least one character.', 'location_entry_error')
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