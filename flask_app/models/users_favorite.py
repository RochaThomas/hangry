
from flask import flash
from flask_app.config.mysqlconnection import connectToMySQL

class Users_favorite:
    db_name = "hangry_schema"
    def __init__(self, data):
        self.id = data('id')
        self.user_id = data('user_id')
        self.restaurant_id = data('restaurant_id')
        self.location_id = data['location_id']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def add_users_favorite(cls, data):
        query = """INSERT INTO users_favorites (user_id, restaurant_id, location_id, created_at, updated_at)
                VALUES (%(user_id)s, %(restaurant_id)s, %(location_id)s, NOW(), NOW());"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @classmethod
    def get_all_favorites_for_user(cls, data):
        query = """SELECT restaurants.*, users_favorites.location_id as location_id FROM users
                LEFT JOIN users_favorites ON users.id = users_favorites.user_id
                LEFT JOIN restaurants ON users_favorites.restaurant_id = restaurants.id
                WHERE users.id = %(id)s;"""
        results = connectToMySQL(cls.db_name).query_db(query, data)
        users_favorites = []
        if results:
            for row in results:
                users_favorites.append(row)
        return users_favorites

    @staticmethod
    def is_valid_selection(users_favorites):
        is_valid = True
        if len(users_favorites) < 2:
            flash("At least 2 must be selected.", 'selection_error')
            is_valid = False
        return is_valid