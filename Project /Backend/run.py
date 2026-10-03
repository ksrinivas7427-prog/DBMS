import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.health import health_bp
from app.routes_auth import auth_bp
from app.routes_campaigns import campaigns_bp
from app.routes_donations import donations_bp
from app.routes_admin import admin_bp
from app.mongodb import init_mongo_indexes, check_mongo_connection
from app.db import check_db_connection

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize MongoDB indexes (graceful if Mongo is starting)
    init_mongo_indexes()

    # Configure CORS to allow all origins and prevent Network Errors on any local port
    CORS(app, resources={r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }})

    # Register Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(campaigns_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(admin_bp)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "Endpoint not found."}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "message": "Internal server error occurred."}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    port = Config.PORT
    mysql_ok, mysql_msg = check_db_connection()
    mongo_ok, mongo_msg = check_mongo_connection()
    print(f"============================================================")
    print(f" CrowdConnect Backend API running on http://localhost:{port}")
    print(f" MySQL (Relational): {'CONNECTED' if mysql_ok else 'FAILED'} -> {Config.DB_NAME} on {Config.DB_HOST}:{Config.DB_PORT}")
    print(f" MongoDB (Documents): {'CONNECTED' if mongo_ok else 'FAILED'} -> URI: {Config.MONGODB_URI}")
    print(f" Dual-Database Architecture Ready for Review-3 Evaluation")
    print(f"============================================================")
    app.run(host='0.0.0.0', port=port, debug=True)

