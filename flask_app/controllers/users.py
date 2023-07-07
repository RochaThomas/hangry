
from crypt import methods
from flask_app import app
from flask import render_template, request, redirect, session, flash
from flask_app.models.user import User
from flask_app.models.restaurant import Restaurant
from flask_app.models.location import Location
from flask_app.models.users_favorite import Users_favorite
from flask_bcrypt import Bcrypt
import random
bcrypt = Bcrypt(app)

@app.route('/')
def disp_default():
    # default should be for all users
    # index.html should have an option for one-time uses
    # index.html should have links for how it works and about us
    # show login, sign up, and use 1 time
    print("session: ", session)
    if 'user_id' in session:
        return redirect('/dashboard')
    else:
        session.clear()
    return render_template('index.html')

@app.route('/login')
def disp_login():
    print("session: ", session)
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('login.html')

@app.route('/register')
def disp_sign_up():
    print("session: ", session)
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('sign_up.html')

@app.route('/one-time-randomization')
def disp_one_time_randomization_location():
    if 'user_id' not in session:
        return redirect('/')
    
    # resetting session on external link click
    temp = session['user_id']
    session.clear()
    session['user_id'] = temp
    print('session: ', session)

    return render_template('use_one_time_location.html')

@app.route('/one-time-randomization/manual_location_entry')
def disp_manual_entry_form_one_time_randomization():
    if 'user_id' not in session:
        return redirect('/')
    return render_template('one_time_randomization_location_manual_entry.html')

@app.route('/one-time-user/location')
def disp_use_location_one_time_user():
    print("session: ", session)
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('use_location.html')

@app.route('/one-time-user/manual_location_entry')
def disp_manual_entry_form_one_time_user():
    print("session: ", session)
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('user_manual_entry.html')

@app.route('/one-time-randomization/map')
def disp_one_time_randomization_map():
    print("session: ", session)
    if 'user_id' not in session:
        return redirect('/')
    if 'lat' in session and 'lng' in session:
        lat = float(session['lat'])
        lng = float(session['lng'])
    else:
        # change this location later
        lat = 37.3387
        lng = -121.8853
    return render_template("one_randomization_map.html", lat=lat, lng=lng)

@app.route('/one-time-user/map')
def disp_one_time_user_map():
    print("session: ", session)
    if 'user_id' in session:
        return redirect('/dashboard')
    if 'lat' in session and 'lng' in session:
        lat = float(session['lat'])
        lng = float(session['lng'])
    else:
        # change this location later
        lat = 37.3387
        lng = -121.8853
    return render_template("one_use_map.html", lat=lat, lng=lng)

@app.route('/one-time-randomization/manual_restaurant_add')
def disp_manual_restaurant_add_one_time_randomization():
    print('session: ', session)
    if 'user_id' not in session:
        return redirect('/')
    return render_template('one_time_randomization_manual_restaurant_add.html', restaurants = session['restaurants'])

@app.route('/one-time-user/manual_restaurant_add')
def disp_manual_restaurant_add():
    print("session: ", session)
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('manual_restaurant_add.html', restaurants = session['restaurants'])

@app.route('/one-time-randomization/result')
def disp_one_time_randomization_result():
    if 'user_id' not in session:
        return redirect('/')
    
    print('session: ', session)
    
    def randomize(restaurants):
        idx = random.randint(0, (len(restaurants) - 1))
        print("num restaurants:", len(restaurants) - 1)
        print("idx:", idx)
        return restaurants[idx]

    newResult = randomize(session['restaurants'])
    if 'result' in session and len(session['restaurants']) > 1:
        while newResult['placeId'] == session['result']['placeId']:
            newResult = randomize(session['restaurants'])
    
    session['result'] = newResult
    return render_template('one_time_randomization_result.html', result=session['result']['name'], resultId = session['result']['placeId'], lat=session['lat'], lng=session['lng'])

@app.route('/one-time-user/result')
def disp_one_time_result():
    if 'user_id' in session:
        return redirect('/dashboard')
    
    def randomize(restaurants):
        idx = random.randint(0, (len(restaurants) - 1))
        print("num restaurants:", len(restaurants) - 1)
        print("idx:", idx)
        return restaurants[idx]

    newResult = randomize(session['restaurants'])
    if 'result' in session and len(session['restaurants']) > 1:
        while newResult['placeId'] == session['result']['placeId']:
            newResult = randomize(session['restaurants'])
    
    session['result'] = newResult
    print("session: ", session)
    return render_template('one_time_result.html', result=session['result']['name'], resultId = session['result']['placeId'], lat=session['lat'], lng=session['lng'])

@app.route('/one-time-randomization/quick-add')
def disp_quick_add():
    if 'user_id' not in session:
        return redirect('/')
    session.pop('result', False)
    print('session: ', session)
    return render_template('quick_add.html')

@app.route('/one-time-user/quick-sign-up')
def disp_quick_sign_up():
    if 'user_id' in session:
        return redirect('/dashboard')
    if 'restaurants' not in session or 'lat' not in session or 'lng' not in session:
        session.clear()
        return redirect('/register')
    session.pop('result', False)
    print("session: ", session)
    
    return render_template('quick_sign_up.html')

@app.route('/dashboard')
def disp_dashboard():
    if 'user_id' not in session:
        return redirect('/')
    
    # resetting session on external link click
    temp = session['user_id']
    session.clear()
    session['user_id'] = temp
    print('session: ', session)

    data = {
        'id': session['user_id']
    }
    
    user = User.get_user_by_id(data)
    return render_template('dashboard.html', user=user)

@app.route('/register/user', methods=['POST'])
def register_new_user():
    if not User.registration_is_valid(request.form):
        return redirect('/register')
    hashed_pw = bcrypt.generate_password_hash(request.form['password'])
    data = {
        'first_name': request.form['first_name'],
        'last_name': request.form['last_name'],
        'email': request.form['email'],
        'password': hashed_pw
    }
    user_id = User.save(data)
    session['user_id'] = user_id
    return redirect('/location/first_location')

@app.route('/one-time-randomization/process-quick-add', methods=['POST'])
def process_quick_add():
    location_data = {
        'name': request.form['location_name'],
        'lat': session['lat'],
        'lng': session['lng'],
        'user_id': session['user_id'],
    }
    valid_location = Location.is_valid_location_entry_quick_add(location_data)
    if not valid_location:
        return redirect('/one-time-randomization/quick-add')
    location_id = Location.add_location(location_data)

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
            'location_id': location_id,
        })
    return redirect('/restaurant/add_favorite')

@app.route('/register/user/quick-sign-up', methods=['POST'])
def register_new_user_quick_sign_up():
    location_data = {
        'name': request.form['location_name'],
        'lat': session['lat'],
        'lng': session['lng'],
    }
    valid_user =  User.registration_is_valid(request.form)
    valid_location = Location.is_valid_location_entry_quick_sign_up(location_data)
    if not valid_user or not valid_location:
        return redirect('/one-time-user/quick-sign-up')
    hashed_pw = bcrypt.generate_password_hash(request.form['password'])
    data = {
        'first_name': request.form['first_name'],
        'last_name': request.form['last_name'],
        'email': request.form['email'],
        'password': hashed_pw
    }
    user_id = User.save(data)
    location_data['user_id'] = user_id
    location_id = Location.add_location(location_data)

    for restaurant in session['restaurants']:
        restaurant_id = Restaurant.add_restaurant({
            'name': restaurant['name'],
            'lat': restaurant['lat'],
            'lng': restaurant['lng'],
            'place_id': restaurant['placeId'],
        })
        Users_favorite.add_users_favorite({
            'user_id': user_id,
            'restaurant_id': restaurant_id,
            'location_id': location_id,
        })
    
    print("session before clear: ", session)
    session.clear()

    session['user_id'] = user_id
    print("session after clear: ", session)
    return redirect('/dashboard')

@app.route('/login/user', methods=['POST'])
def login_user():
    if not User.login_is_valid(request.form):
        return redirect('/login')
    user_in_db = User.get_user_by_email(request.form)
    session['user_id'] = user_in_db.id

    # if there are no locations for this user... send to first location
    if not Location.get_all_locations({'id': session['user_id']}):
        return redirect('/location/first_location')
    return redirect('/dashboard')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/one-time-randomization/process_user_location', methods=['POST'])
def process_user_location_one_time_randomization():
    if not Location.is_valid_one_time_location_entry(request.form):
        return redirect("/one-time-randomization/manual_location_entry")
    session['lat'] = request.form['lat']
    session['lng'] = request.form['lng']
    return redirect("/one-time-randomization/map")

@app.route('/one-time-user/process_user_location', methods=['POST'])
def process_user_location():
    if not Location.is_valid_one_time_location_entry(request.form):
        return redirect("/one-time-user/manual_location_entry")
    session['lat'] = request.form['lat']
    session['lng'] = request.form['lng']
    return redirect("/one-time-user/map")

@app.route('/one-time-randomization/auto_process_user_location', methods=['POST'])
def auto_process_user_location_one_time_randomization():
    if 'user_id' not in session:
        return redirect('/')
    session['lat'] = request.form['lat']
    session['lng'] = request.form['lng']
    return redirect("/one-time-randomization/map")

@app.route('/one-time-user/auto_process_user_location', methods=['POST'])
def auto_process_user_location():
    if 'user_id' in session:
        return redirect("/dashboard")
    session['lat'] = request.form['lat']
    session['lng'] = request.form['lng']
    return redirect("/one-time-user/map")

@app.route('/one-time-randomization/process_one_time_map', methods=['POST'])
def process_one_randomization_map():
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
    return redirect("/one-time-randomization/manual_restaurant_add")

@app.route('/one-time-user/process_one_time_map', methods=['POST'])
def process_one_time_map():
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
    return redirect("/one-time-user/manual_restaurant_add")

@app.route('/one-time-randomization/process_manual_restaurant_add', methods=['POST'])
def process_manual_restaurant_add_one_time_randomization():
    if not Restaurant.is_valid_one_time_restaurant_entry(request.form):
        return redirect("/one-time-user/manual_restaurant_add")
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
            'lng': request.form['lng'],
        })
    session['restaurants'] = restaurants

    return redirect("/one-time-randomization/manual_restaurant_add")

@app.route('/one-time-user/process_manual_restaurant_add', methods=['POST'])
def process_manual_restaurant_add():
    if not Restaurant.is_valid_one_time_restaurant_entry(request.form):
        return redirect("/one-time-user/manual_restaurant_add")
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
            'lng': request.form['lng'],
        })
    session['restaurants'] = restaurants

    return redirect("/one-time-user/manual_restaurant_add")