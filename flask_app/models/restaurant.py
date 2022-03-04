
from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
from flask_app.models.users_favorite import Users_favorite
import random

class Restaurant:
    db_name = "hangry_schema"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.street = data['street']
        self.city = data['city']
        self.zipcode = data['zipcode']
        self.min_away = data['min_away']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def add_restaurant(cls, data):
        query = """INSERT INTO restaurants (name, street, city, zipcode, min_away, created_at, updated_at)
                VALUES (%(name)s, %(street)s, %(city)s, %(zipcode)s, %(min_away)s, NOW(), NOW());"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @classmethod
    def get_one_restaurant(cls, data):
        query = "SELECT * FROM restaurants WHERE id = %(id)s;"
        results = connectToMySQL(cls.db_name).query_db(query, data)
        if results:
            restaurant = cls( results[0] )
        return restaurant
    
    @classmethod
    def get_all_favorites_for_location(cls, data):
        query = """SELECT restaurants.* FROM locations
                LEFT JOIN users_favorites ON locations.id = users_favorites.location_id
                LEFT JOIN restaurants ON users_favorites.restaurant_id = restaurants.id
                WHERE locations.id = %(id)s;"""
        results = connectToMySQL(cls.db_name).query_db(query, data)
        favorites_for_location = []
        if results:
            for row in results:
                favorites_for_location.append( cls(row) )
        return favorites_for_location

    @classmethod
    def get_one_random(cls, data):
        restaurant_ids = [];
        for key in data:
            restaurant_ids.append(int(data[key]))
        random_id = restaurant_ids[random.randint(0,(len(restaurant_ids)-1))]
        return random_id

    @staticmethod
    def is_valid_restaurant_entry(restaurant):
        is_valid = True
        if len(restaurant['name']) < 2:
            flash('Name must be at least two characters.', 'restaurant_entry_error')
            is_valid = False
        data = {
            'id': restaurant['location_id']
        }
        if restaurant['location_id'] == '':
            flash('Field "Location List" is required.', 'restaurant_entry_error')
            is_valid = False
        else:
            all_favorites_for_location = Restaurant.get_all_favorites_for_location(data)
            if all_favorites_for_location:
                for one_favorite in all_favorites_for_location:
                    if one_favorite.name == restaurant['name']:
                        flash('You already have a favorite with that name for this location. Restaurant names must be unique.', 'location_entry_error')
                        is_valid = False
        if restaurant['min_away'] == '':
            flash('Field "How Far Away It Is" is required.', 'restaurant_entry_error')
            is_valid = False
        return is_valid