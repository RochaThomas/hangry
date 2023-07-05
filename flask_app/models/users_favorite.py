
from flask import flash
from flask_app.config.mysqlconnection import connectToMySQL

class Users_favorite:
    db_name = "hangry_schema"
    def __init__(self, data):
        self.id = data[0]
        self.user_id = data[1]
        self.restaurant_id = data[2]
        self.location_id = data[3]
        self.created_at = data[4]
        self.updated_at = data[5]

    @classmethod
    def add_users_favorite(cls, data):
        query = """INSERT INTO users_favorites (user_id, restaurant_id, location_id, created_at, updated_at)
                VALUES (:user_id, :restaurant_id, :location_id, NOW(), NOW());"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @classmethod
    def get_all_favorites_for_user(cls, data):
        query = """SELECT restaurants.*, users_favorites.location_id as location_id FROM users
                LEFT JOIN users_favorites ON users.id = users_favorites.user_id
                LEFT JOIN restaurants ON users_favorites.restaurant_id = restaurants.id
                WHERE users.id = :id;"""
        results = connectToMySQL(cls.db_name).query_db(query, data)
        users_favorites = []
        if results:
            for row in results:
                users_favorites.append(row)
        return users_favorites

    @classmethod
    def delete(cls, data):
        query = """DELETE FROM users_favorites
                WHERE user_id = :user_id 
                AND restaurant_id = :restaurant_id
                AND location_id = :location_id;"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @classmethod
    def delete_all_for_location(cls, data):
        query = """DELETE FROM users_favorites
                WHERE user_id = :user_id 
                AND location_id = :delete_location_id;"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @staticmethod
    def is_valid_selection(users_favorites):
        is_valid = True
        if len(users_favorites) < 2:
            flash("At least 2 must be selected.", 'selection_error')
            is_valid = False
        return is_valid