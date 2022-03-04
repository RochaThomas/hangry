
from flask_app import app
from flask_app.controllers.users import User
from flask_app.controllers.locations import Location
from flask_app.controllers.restaurants import Restaurant
from flask_app.controllers.users_favorites import Users_favorite

if __name__ == '__main__':
    app.run(debug=True)