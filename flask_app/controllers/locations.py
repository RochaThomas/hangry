
from flask_app import app
from flask import render_template, redirect, request, session, flash
from flask_app.models.location import Location
from flask_app.models.user import User

@app.route('/location/add')
def disp_add_location():
    if 'user_id' not in session:
        return redirect('/login')
    data = {
        'id': session['user_id']
    }
    user = User.get_user_by_id(data)
    locations = Location.get_all_locations(data)
    return render_template('add_location.html', user=user, locations=locations)

@app.route('/location/add/process', methods=['POST'])
def add_location():
    if not Location.is_valid_location_entry(request.form):
        return redirect('/location/add')
    Location.add_location(request.form)
    return redirect('/location/add')