
from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
from flask_app.models.users_favorite import Users_favorite
import random

class Restaurant:
    db_name = "hangry_schema"
    def __init__(self, data):
        self.id = data[0]
        self.name = data[1]
        self.lat = data[2]
        self.lng = data[3]
        self.google_id = data[4]
        self.created_at = None
        self.updated_at = None

    @classmethod
    def add_restaurant(cls, data):
        query  = """SELECT * FROM restaurants WHERE google_id = :place_id;"""
        res = connectToMySQL(cls.db_name).query_db(query, data)
        print('add find result: ', res)
        if res: return res[0][0]
        query = """INSERT INTO restaurants (name, lat, lng, google_id, created_at, updated_at)
                VALUES (:name, :lat, :lng, :place_id, NOW(), NOW());"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @classmethod
    def get_one_restaurant(cls, data):
        query = "SELECT * FROM restaurants WHERE id = :id;"
        results = connectToMySQL(cls.db_name).query_db(query, data)
        if results:
            restaurant = cls( results[0] )
        return restaurant
    
    @classmethod
    def get_all_favorites_for_location(cls, data):
        query = """SELECT restaurants.* FROM locations
                LEFT JOIN users_favorites ON locations.id = users_favorites.location_id
                LEFT JOIN restaurants ON users_favorites.restaurant_id = restaurants.id
                WHERE locations.id = :id;"""
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
        if restaurant['location_id'] == '':
            flash('Choosing a Location is required.', 'restaurant_entry_error')
            is_valid = False
        if (restaurant['name'] == "" or
            restaurant['street_address'] == "" or
            restaurant['city'] == "" or
            restaurant['state'] == "" or
            restaurant['zip_code'] == ""):
            flash('All fields must be filled in.', 'restaurant_entry_error')
            is_valid = False
        elif restaurant['place_id'] == '' or restaurant['lat'] == '' or restaurant['lng'] == '':
            flash('Enter a valid address.', 'restaurant_entry_error')
            is_valid = False
        if (is_valid == True):
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