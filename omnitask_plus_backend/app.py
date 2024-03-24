from flask import Flask
from database import init_db
from routes import user_routes, task_routes, study_session_routes

app = Flask(__name__)

@app.before_first_request
def initialize_database():
    init_db()

app.register_blueprint(user_routes.bp)
app.register_blueprint(task_routes.bp)
app.register_blueprint(study_session_routes.bp)

if __name__ == '__main__':
    app.run(debug=True)
