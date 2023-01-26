
from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
from flask_app.models.users_favorite import Users_favorite
import random

class Restaurant:
    db_name = "hangry_schema"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.google_id = data['google_id']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def add_restaurant(cls, data):
        query = """INSERT INTO restaurants (name, google_id, created_at, updated_at)
                VALUES (%(name)s, %(place_id)s, NOW(), NOW());"""
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
        if (restaurant['name'] == "" or
            restaurant['street_address'] == "" or
            restaurant['city'] == "" or
            restaurant['state'] == "" or
            restaurant['zip_code'] == ""):
            flash('All fields must be filled in', 'restaurant_entry_error')
            is_valid = False
        elif restaurant['place_id'] == '':
            flash('Enter a valid address.', 'restaurant_entry_error')
            is_valid = False
        if (is_valid == True):
            if restaurant['location_id'] == '':
                flash('Field "Location List" is required.', 'restaurant_entry_error')
                is_valid = False
            else:
                all_favorites_for_location = Restaurant.get_all_favorites_for_location({
                    'id': restaurant['location_id']
                })
                if all_favorites_for_location:
                    print("hit")
                    for one_favorite in all_favorites_for_location:
                        if one_favorite.google_id == restaurant['place_id']:
                            print("made it")
                            flash('This restaurant is already a favorite for this location. Enter a new restaurant.', 'restaurant_entry_error')
                            is_valid = False
        return is_valid

    @staticmethod
    def is_valid_one_time_restaurant_entry(restaurant):
        is_valid = True
        if (restaurant["name"] == "" or 
            restaurant["street_address"] == "" or 
            restaurant["city"] == "" or
            restaurant["state"] == "" or
            restaurant["zip_code"] == ""):
            flash('All fields must be filled in.', 'one_time_restaurant_entry_error')
            is_valid = False
        return is_valid