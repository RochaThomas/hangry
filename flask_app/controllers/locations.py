
from flask_app import app
from flask import render_template, redirect, request, session, flash
from flask_app.models.location import Location
from flask_app.models.users_favorite import Users_favorite
from flask_app.models.user import User

@app.route('/location/add')
def disp_add_location():
    if 'user_id' not in session:
        return redirect('/login')
    data = {
        'id': session['user_id']
    }

    # saving id of location to be deleted to temp variable if its in session
    temp_delete_id = session['delete_location_id'] if 'delete_location_id' in session else False

    # resetting session on external link click
    temp = session['user_id']
    processed = session['process_delete'] if 'process_delete' in session else True
    session.clear()
    session['user_id'] = temp
    # readd the delete location id into session
    if temp_delete_id:
        session['delete_location_id'] = temp_delete_id
    print('session: ', session)

    user = User.get_user_by_id(data)
    locations = Location.get_all_locations(data)
    session['num_of_locations'] = len(locations)
    return render_template('add_location.html', user=user, locations=locations, processed=processed)

@app.route('/location/first_location')
def disp_first_location():
    print("session: ", session)
    if 'user_id' not in session:
        return redirect('/')
    return render_template('first_location.html', user_id=session['user_id'])

@app.route('/location/first_location/map')
def disp_first_location_map():
    if 'user_id' not in session:
        return redirect('/login')
    if 'lat' in session and 'lng' in session:
        lat = float(session['lat'])
        lng = float(session['lng'])
    else:
        # change this location later
        lat = 37.3387
        lng = -121.8853
    print('session: ', session)
    return render_template('first_location_map.html', lat=lat, lng=lng)

@app.route('/location/delete/confirm')
def confirm_deletion():
    if 'user_id' not in session:
        redirect('/login')
    data = {
        'user_id': session['user_id'],
        'delete_location_id': session['delete_location_id'],
    }
    Users_favorite.delete_all_for_location(data)
    Location.delete(data)
    session.pop('process_delete', False)
    session.pop('delete_location_id', False)
    return redirect('/location/add')

@app.route('/location/delete/cancel')
def cancel_deletion():
    if 'user_id' not in session:
        redirect('/login')
    if 'process_delete' in session: session.pop('process_delete') 
    if 'delete_location_id' in session: session.pop('delete_location_id')
    return redirect('/location/add')

@app.route('/location/delete', methods=['POST'])
def delete_location():
    # if length of locations is only 1
        # alert user, they cannot delete
    if session['num_of_locations'] <= 1:
        session['process_delete'] = False
        flash("You cannot delete a location if you only have 1", "remove_location_error")
        return redirect('/location/add')
    # set a session variable called delete_location_id
    session['delete_location_id'] = request.form['location_id']
    # set a session variable called process_delete = False
    session['process_delete'] = False
    # use a modal that reacts to process_delete
        # if false, elif true, elif none
    return redirect('/location/add')


@app.route('/location/first_location/process', methods=['POST'])
def add_first_location():
    if not Location.is_valid_location_entry(request.form):
        return redirect('/location/first_location')
    session['location_id'] = Location.add_location(request.form)
    # change the redirect to a page with map similar to one time user map
    session['lat'] = request.form['lat']
    session['lng'] = request.form['lng']
    return redirect("/location/first_location/map")

@app.route('/location/add/process', methods=['POST'])
def add_location():
    if not Location.is_valid_location_entry(request.form):
        return redirect('/location/add')
    Location.add_location(request.form)
    return redirect('/location/add')