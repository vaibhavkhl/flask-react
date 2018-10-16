from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os
import time

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/flask_react' #+os.path.join(basedir, 'crud.sqlite')
db = SQLAlchemy(app)
ma = Marshmallow(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    email = db.Column(db.String(120))

    def __init__(self, username, email):
        self.username = username
        self.email = email


class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('username', 'email')


user_schema = UserSchema()
users_schema = UserSchema(many=True)


# endpoint to create new user
@app.route("/user", methods=["POST"])
def add_user():
    print (request.json)
    t0 = time.time()
    username = request.json['username']
    email = request.json['email']
    useSql = request.json['useSql']
    n = int(request.json['n'])
    print ('n', n)

    if useSql:
        # for 10000 records 0.42 sec
        # 100000 4.49
        db.engine.execute(
            User.__table__.insert(),
            [{"username": username + str(i), "email": email} for i in range(n)]
        )
    else:
        # for 10000 records 5.81 sec
        for i in range(n):
            new_user = User(username + str(i), email)
            db.session.add(new_user)
            if i % 1000 == 0:
                db.session.flush()
        db.session.commit()

    #print ("SqlAlchemy: Total time for " + str(n) + " records " + str(time.time() - t0) + " secs")
    return jsonify({'time': str(time.time() - t0)})


# endpoint to show all users
@app.route("/user", methods=["GET"])
def get_user():
    t0 = time.time()
    all_users = User.query.all()
    result = users_schema.dump(all_users)
    return jsonify({'result': result.data,'time': str(time.time() - t0)})


# endpoint to get user detail by id
@app.route("/user/<id>", methods=["GET"])
def user_detail(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)


# endpoint to update user
@app.route("/user/<id>", methods=["PUT"])
def user_update(id):
    user = User.query.get(id)
    username = request.json['username']
    email = request.json['email']

    user.email = email
    user.username = username

    db.session.commit()
    return user_schema.jsonify(user)


# endpoint to delete user
@app.route("/user/<id>", methods=["DELETE"])
def user_delete(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)

@app.route("/user", methods=["DELETE"])
def users_delete():
    t0 = time.time()
    db.engine.execute(
        'DELETE FROM user'
    )

    return jsonify({'time': str(time.time() - t0)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
