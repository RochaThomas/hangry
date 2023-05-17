
from flask_app import app
from flask import render_template, redirect, request, session, flash
from flask_app.models.users_favorite import Users_favorite
from flask_app.models.location import Location
from flask_app.models.restaurant import Restaurant

@app.route('/favorites/randomize')
def disp_randomize_form():
    print('session: ', session)
    if 'user_id' not in session:
        return redirect('/')
    data = {
        'id': session['user_id']
    }
    if 'location_id' not in session:
        session['location_id'] = -1
    if session['location_id'] == -1:
        favorites = []
        session['hidden'] = True
    else:
        data_ll_id = {
            'id': session['location_id']
        }
        favorites = Restaurant.get_all_favorites_for_location(data_ll_id)
        session['hidden'] = False
    ll_id = int(session['location_id'])
    locations = Location.get_all_locations(data)

    # set session hidden to hide restaurant list module until location is specified
    if session.get('hidden') == True:
        session['hidden'] = True
    
    return render_template('randomize_favorites.html', locations=locations, favorites=favorites, ll_id=ll_id)

@app.route('/favorites/randomize/result')
def disp_result():
    print('session: ', session)
    if 'user_id' not in session:
        return redirect('/login')
    data = {
        'id': session['result']
    }
    location_data = {
        'id': session['user_id'],
        'location_id': session['location_id'],
    }
    location_info = Location.get_location_by_id(location_data)
    lat = location_info.lat
    lng = location_info.lng
    print(location_info)
    return render_template('result.html', restaurant=Restaurant.get_one_restaurant(data), lat=lat, lng=lng)

@app.route('/favorites/first_location/next_steps')
def process_restaurants_disp_next_steps():
    if 'user_id' not in session:
        return redirect('/login')

    if 'restaurants' in session:
        for restaurant in session['restaurants']:
            restaurant_id = Restaurant.add_restaurant({
                'name': restaurant['name'],
                'lat': restaurant['lat'],
                'lng': restaurant['lng'],
                'place_id': restaurant['placeId'],
            })
            Users_favorite.add_users_favorite({
                'user_id': session['user_id'],
                'restaurant_id': restaurant_id,
                'location_id': session['location_id'],
            })
    
    # resetting session on external link click
    temp = session['user_id']
    session.clear()
    session['user_id'] = temp
    print('session: ', session)

    return render_template('next_steps.html')

@app.route('/favorites/first_location/manual_entry')
def disp_first_location_favorites_manual_entry():
    print('session: ', session)
    if 'user_id' not in session:
        return redirect('/dashboard')
    return render_template('first_location_favorites_manual_entry.html', restaurants = session['restaurants'])

@app.route('/favorites/remove', methods=['POST'])
def remove_favorite():
    data = {
        'user_id': session['user_id'],
        'restaurant_id': request.form['restaurant_id'],
        'location_id': request.form['location_id'],
    }
    Users_favorite.delete(data)
    return redirect("/restaurant/add_favorite")

@app.route('/favorites/first_location/process_manual_entry', methods=['POST'])
def first_location_process_manual_entry():
    if not Restaurant.is_valid_one_time_restaurant_entry(request.form):
        return redirect("/favorites/first_location/manual_entry")
    restaurants = session['restaurants']
    # make sure the restaurant they are trying to add isn't already on the list
    dup = False
    print(restaurants)
    for restaurant in restaurants:
        if restaurant['placeId'] == request.form['place_id']:
            dup = True
            break
    if dup == False:
        restaurants.append({
            'name': request.form['name'],
            'placeId': request.form['place_id'],
            'lat': request.form['lat'],
            'lng': request.form['lng']
        })
    session['restaurants'] = restaurants

    return redirect("/favorites/first_location/manual_entry")

@app.route('/favorites/first_location/process_map', methods=['POST'])
def add_favorites_from_map():
    restaurants = []

    for key in request.form:
        info = request.form[key].split(',;;,')
        restaurants.append({
            'name': info[0],
            'lat': info[1],
            'lng': info[2],
            'placeId': key,
        })
    
    session['restaurants'] = restaurants
    return redirect('/favorites/first_location/manual_entry')

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
    random_favorite = Restaurant.get_one_random(request.form)
    session['result'] = random_favorite
    return redirect('/favorites/randomize/result')