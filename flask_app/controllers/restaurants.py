
import re
from flask_app import app
from flask import render_template, redirect, request, session, flash
from flask_app.models.restaurant import Restaurant
from flask_app.models.location import Location
from flask_app.models.users_favorite import Users_favorite
from flask_app.models.user import User

@app.route('/restaurant/add_favorite')
def disp_add_favorite():
    if 'user_id' not in session:
        return redirect('/login')
    data = {
        'id': session['user_id']
    }
    
    # reset randomization selection when external link is clicked
    # resets 'hidden' and 'location_id' in session
    if session.get('location_id') or session.get('hidden'):
        session.pop('location_id')
        session.pop('hidden')

    locations = Location.get_all_locations(data)
    users_favorites = Users_favorite.get_all_favorites_for_user(data)
    return render_template('add_favorite.html', locations=locations, users_favorites=users_favorites)

@app.route('/restaurant/add_favorite/process', methods=['POST'])
def add_favorite():
    print(request.form)
    if not Restaurant.is_valid_restaurant_entry(request.form):
        return redirect('/restaurant/add_favorite')
    restaurant_id = Restaurant.add_restaurant(request.form)
    data = {
        'user_id': session['user_id'],
        'restaurant_id': restaurant_id,
        'location_id': request.form['location_id']
    }
    Users_favorite.add_users_favorite(data)
    return redirect('/restaurant/add_favorite')