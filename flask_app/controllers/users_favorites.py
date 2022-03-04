
from flask_app import app
from flask import render_template, redirect, request, session, flash
from flask_app.models.users_favorite import Users_favorite
from flask_app.models.location import Location
from flask_app.models.restaurant import Restaurant

@app.route('/favorites/randomize')
def disp_randomize_form():
    if 'user_id' not in session:
        return redirect('/login')
    data = {
        'id': session['user_id']
    }
    if 'location_id' not in session:
        session['location_id'] = -1
    if session['location_id'] == -1:
        favorites = Users_favorite.get_all_favorites_for_user(data)
    else:
        data_ll_id = {
            'id': session['location_id']
        }
        favorites = Restaurant.get_all_favorites_for_location(data_ll_id)
    ll_id = int(session['location_id'])
    locations = Location.get_all_locations(data)
    
    return render_template('randomize_favorites.html', locations=locations, favorites=favorites, ll_id=ll_id)

@app.route('/favorites/randomize/result')
def disp_result():
    if 'user_id' not in session:
        return redirect('/login')
    data = {
        'id': session['result']
    }
    return render_template('result.html', restaurant=Restaurant.get_one_restaurant(data))

@app.route('/favorites/randomize/location_list', methods=['POST'])
def disp_narrowed_options():
    if 'user_id' not in session:
        return redirect('/login')
    session['location_id'] = request.form['location_id']
    return redirect('/favorites/randomize')

@app.route('/favorites/randomize/selections', methods=['POST'])
def randomize_selections():
    if not Users_favorite.is_valid_selection(request.form):
        return redirect('/favorites/randomize')
    session.pop('location_id')
    random_favorite = Restaurant.get_one_random(request.form)
    session['result'] = random_favorite
    return redirect('/favorites/randomize/result')