
from flask_app import app
from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
import re
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

class User:
    db_name = 'hangry_schema'
    def __init__(self, data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def save(cls, data):
        query = """INSERT INTO users (first_name, last_name, email, password, created_at, updated_at)
                VALUES (%(first_name)s, %(last_name)s, %(email)s, %(password)s, NOW(), NOW());"""
        return connectToMySQL(cls.db_name).query_db(query, data)

    @classmethod
    def get_user_by_email(cls, data):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        results = connectToMySQL(cls.db_name).query_db(query, data)
        if not results:
            return False
        return cls( results[0] )

    @classmethod
    def get_user_by_id(cls, data):
        query = "SELECT * FROM users WHERE id = %(id)s;"
        results = connectToMySQL(cls.db_name).query_db(query, data)
        if not results:
            return False
        return cls( results[0] )

    @staticmethod
    def registration_is_valid(user):
        is_valid = True
        if len(user['first_name']) < 2:
            flash('First name must be at least 2 characters long.', 'registration_error')
            is_valid = False
        if not user['first_name'].isalpha():
            flash('First name must contain only letters.', 'registration_error')
            is_valid = False
        if len(user['last_name']) < 2:
            flash('Last name must be at least 2 characters long.', 'registration_error')
            is_valid = False
        if not user['last_name'].isalpha():
            flash('Last name must contain only letters.', 'registration_error')
            is_valid = False
        results = User.get_user_by_email(user)
        if results:
            flash('Email is already in use.', 'registration_error')
            is_valid = False
        if not EMAIL_REGEX.match(user['email']):
            flash('Invalid email address.', 'registration_error')
            is_valid = False
        if len(user['password']) < 8:
            flash('Password must be at least 8 characters long.', 'registration_error')
            is_valid = False
        # look into password regex (not required)
        if user['password'].islower():
            flash('Password must contain an uppercase letter.', 'registration_error')
            is_valid = False
        # password regex would handle next logic portion
        num_of_nums = 0
        for char in user['password']:
            if char.isdigit():
                num_of_nums += 1
        if num_of_nums < 1:
            flash('Password must contain at least 1 number.', 'registration_error')
            is_valid = False
        if user['confirm_password'] != user['password']:
            flash('Password and password confirmation do not match.', 'registration_error')
            is_valid = False
        return is_valid

    @staticmethod
    def login_is_valid(user):
        is_valid = True
        user_info = User.get_user_by_email(user)
        if not user_info:
            flash('Invalid email and/or password.', 'login_error')
            is_valid = False
        elif not bcrypt.check_password_hash(user_info.password, user['password']):
            flash('Invalid email and/or password.', 'login_error')
            is_valid = False
        return is_valid