"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.models import User

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from flask_bcrypt import Bcrypt

#from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

#JWT
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)

#Bcrypt
bcrypt = Bcrypt(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response

@app.route('/register', methods=['POST'])
def register():
    body =  request.get_json(force=True)
    if body is None:
         raise APIException("Debes enviar informacion en el body", status_code=404)
    if "name" not in body:
        raise APIException("Debes enviar el campo nombre", status_code=404)
    if "last_name" not in body:
        raise APIException("Debes enviar el campo apellido", status_code=404)
    if "email" not in body:
        raise APIException("Debes enviar el campo email", status_code=404)
    if "password" not in body:
        raise APIException("Debes enviar tu contraseña", status_code=404)
    
    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user = User(name = body['name'], last_name = body['last_name'], email = body['email'], password = pw_hash)
    
    new_user.save()
    
    response_body = {
        "msg" : "ok",
        "user_status": "user created"
    }

    return jsonify(response_body),201

@app.route('/login', methods=['POST'])
def login():
    body =  request.get_json(silent=True)
    if body is None:
         raise APIException("Debes enviar informacion en el body", status_code=400)
    if "email" not in body:
        raise APIException("Debes enviar el campo email", status_code=400)
    if "password" not in body:
        raise APIException("Debes enviar tu contraseña", status_code=400)
    user_data = User.query.filter_by(email = body['email']).first()
    if user_data is None:
        raise APIException("El usuario no existe", status_code=400)
    if bcrypt.check_password_hash(user_data.password, body['password']) is False:
        raise APIException("El usuario o la contraseña son inválidas", status_code=400)

    access_token = create_access_token(identity=body['email'])
    return jsonify(access_token=access_token), 200


@app.route('/private', methods=['GET'])
@jwt_required()  # Requiere un token válido
def private():
    # Obtén la identidad (correo electrónico) del token
    identity = get_jwt_identity()

    # Consulta la base de datos para buscar el usuario con el correo electrónico
    user = User.query.filter_by(email=identity).first()
    if user is None:
        return jsonify({"message": "Usuario no encontrado"}), 404

    # Si el usuario existe, puedes redirigirlo a la página deseada en el frontend
    # En lugar de redirigir directamente desde el backend, puedes enviar una respuesta
    # JSON que indique la URL a la que debe redirigirse el frontend
    return jsonify({"user": user.serialize()}), 200

@app.route('/get_info', methods=['GET'])
@jwt_required()
def get_info():
    identity = get_jwt_identity()
    return jsonify({"hola": "el token funciono", "identidad del usuario": identity}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({"hola": "hola"})

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)