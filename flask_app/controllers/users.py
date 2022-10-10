
from crypt import methods
from flask_app import app
from flask import render_template, request, redirect, session, flash
from flask_app.models.user import User
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)

@app.route('/')
def disp_default():
    # default should be for all users
    # index.html should have an option for one-time uses
    # index.html should have links for how it works and about us
    # show login, sign up, and use 1 time
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('index.html')

@app.route('/login')
def disp_login():
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('login.html')

@app.route('/register')
def disp_sign_up():
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('sign_up.html')

@app.route('/one-time-user/location')
def disp_use_location_one_time_user():
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('use_location.html')

@app.route('/one-time-user/map')
def disp_one_time_user_map():
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

@app.route('/dashboard')
def disp_dashboard():
    if 'user_id' not in session:
        return redirect('/login')
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
    return redirect('/dashboard')

@app.route('/login/user', methods=['POST'])
def login_user():
    if not User.login_is_valid(request.form):
        return redirect('/login')
    user_in_db = User.get_user_by_email(request.form)
    session['user_id'] = user_in_db.id
    return redirect('/dashboard')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/one-time-user/process_user_location', methods=['POST'])
def process_user_location():
    session['lat'] = request.form['lat']
    session['lng'] = request.form['lng']
    return redirect("/one-time-user/map")