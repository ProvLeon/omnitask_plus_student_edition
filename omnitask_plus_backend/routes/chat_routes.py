from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, emit
from database import session
from models.user import User
from models.chat import Chat

chat_bp = Blueprint('chat', __name__)
socketio = SocketIO(cors_allowed_origins="*", logger=True, engineio_logger=True, async_mode='eventlet')

users = {}

def addUser(userId, socketId):
    if userId not in users:
        users[userId] = socketId

def removeUser(socketId):
    users_to_remove = [key for key, value in users.items() if value == socketId]
    for user in users_to_remove:
        del users[user]

def getUser(userId):
    return users.get(userId, None)

@socketio.on('connect')
def handle_connect():
    print('User connected:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('User disconnected:', request.sid)
    removeUser(request.sid)
    for userId in list(users.keys()):
        emit('getUsers', users, room=users[userId])

@socketio.on('addUser')
def handle_addUser(userId):
    addUser(userId, request.sid)
    for userId in list(users.keys()):
        emit('getUsers', users, room=users[userId])

@socketio.on('sendMessage')
def handle_sendMessage(data):
    senderId = data['senderId']
    receiverId = data['receiverId']
    text = data['text']
    receiver_socket_id = getUser(receiverId)
    if receiver_socket_id:
        emit('getMessage', {'senderId': senderId, 'text': text}, room=receiver_socket_id)
    # Save message to database regardless of receiver being online
    message = {'sender_id': senderId, 'receiver_id': receiverId, 'text': text}
    new_message = Chat(**message)  # Changed from Message to Chat
    session.add(new_message)
    session.commit()
    # Emit message to both sender and receiver for real-time update
    if senderId in users:
        emit('newMessage', {'senderId': senderId, 'receiverId': receiverId, 'text': text}, room=users[senderId])

@socketio.on('getUsers')
def handle_getUsers():
    active_users = session.query(User.id, User.username).filter(User.id.in_(users.keys())).all()
    active_users_info = {user.id: user.username for user in active_users}
    for userId in list(users.keys()):
        emit('activeUsers', active_users_info, room=users[userId])

@chat_bp.route('/messages/<receiver_id>', methods=['GET'])
def get_messages(receiver_id):
    messages = session.query(Chat).filter((Chat.sender_id == receiver_id) | (Chat.receiver_id == receiver_id)).all()  # Changed from Message to Chat
    messages_data = [{'sender_id': message.sender_id, 'receiver_id': message.receiver_id, 'text': message.text, 'timestamp': message.timestamp} for message in messages]
    return jsonify(messages_data)

@chat_bp.route('/messages', methods=['GET'])
def get_all_messages():
    messages = session.query(Chat).all()
    print('messages', messages)
    messages_data = [{'sender_id': message.sender_id, 'receiver_id': message.receiver_id, 'text': message.text, 'timestamp': message.timestamp} for message in messages]
    return jsonify(messages_data)

def init_socketio(app):
    socketio.init_app(app, cors_allowed_origins="*", logger=True, engineio_logger=True, async_mode='eventlet')

    with app.app_context():
        socketio.run(app, debug=True)
