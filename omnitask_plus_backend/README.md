# Omnitask Plus Student Edition Backend

Welcome to the backend of Omnitask Plus Student Edition, a specialized task management system designed to help students organize their academic and personal tasks efficiently. This document provides a comprehensive overview of the backend architecture, setup instructions, and API endpoints to interact with the system effectively.

## Overview

The backend is developed using Flask, a lightweight and flexible WSGI web application framework. It is structured to facilitate ease of use and scalability, catering to both straightforward and complex application needs. The system incorporates SQLAlchemy for object-relational mapping, bypassing Flask-SQLAlchemy for more direct control and flexibility with the database interactions. Flask-Migrate is used for database migrations, Flask-JWT-Extended for secure authentication, and Flask-SocketIO for real-time communication capabilities.

## Setup

To initiate the Omnitask Plus Student Edition backend, follow the steps below:

1. Ensure Python 3.8 or a more recent version is installed on your system.
2. Clone the repository to your local environment.
3. Navigate to the `omnitask_plus_backend` directory within the cloned repository.
4. Install the necessary dependencies by executing `pip install -r requirements.txt`.
5. Run the server using the command `python app.py`.

## API Endpoints

### User Management

- **Create a User**: `POST /users/`
  - Allows the creation of a new user, requiring fields such as username, firstname, lastname, email, contact, and password.
- **Get All Users**: `GET /users/`
  - Retrieves a list of all registered users.
- **Get a Single User**: `GET /users/<user_id>`
  - Fetches details of a specific user identified by their ID.
- **Update a User**: `PUT /users/<user_id>`
  - Enables updating the details of a user.
- **Delete a User**: `DELETE /users/<user_id>`
  - Permits the deletion of a user.

### Task Management

- **Create a Task**: `POST /tasks/`
  - Creates a new task, necessitating fields such as user_id, title, description, deadline, priority, and status.
- **Get All Tasks**: `GET /tasks/`
  - Retrieves a list of all tasks.
- **Get a Single Task**: `GET /tasks/<task_id>`
  - Fetches details of a specific task by its ID.
- **Update a Task**: `PUT /tasks/<task_id>`
  - Allows for the updating of task details.
- **Delete a Task**: `DELETE /tasks/<task_id>`
  - Enables the deletion of a task.

## Contributing

We welcome contributions to the Omnitask Plus Student Edition backend. Please adhere to the established coding standards and include tests for new functionalities.

## Contact

For inquiries or further information, please contact us at:

- Email: [support@leotech.digital.com](mailto:leotech.digital@gmail.com)
- GitHub: [omnitask_plus_student_edition_backend](https://github.com/ProvLeon/omnitask_plus_student_edition/omnitask_plus_backend)

## License

Omnitask Plus Student Edition is open-sourced software licensed under the MIT license.
