from flask import Blueprint, request, jsonify
from stream_chat import StreamChat

stream_chat_bp = Blueprint('stream_chat', __name__)

# Initialize Stream Chat client
stream_chat_client = StreamChat(api_key='nnkbnhae7pns', api_secret='9aemahbzmrq5v3xvqefumt8zu72r9swdpyvmmvbmh4qv9tevdsj56p577ed35zzu')


@stream_chat_bp.route('/initiate_private_chat', methods=['POST'])
def initiate_private_chat():
    try:
        data = request.json
        user_id = data.get('user_id')
        friend_id = data.get('friend_id')
        if not user_id or not friend_id:
            return jsonify({"error": "Missing user ID or friend ID"}), 400

        # Create or get a channel between two users
        channel = stream_chat_client.channel('messaging', members=[user_id, friend_id])
        channel.create(user_id)
        return jsonify({"message": "Private chat initiated successfully", "channel_id": channel.id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@stream_chat_bp.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = request.json
        channel_id = data.get('channel_id')
        user_id = data.get('user_id')
        message = data.get('message')
        if not channel_id or not user_id or not message:
            return jsonify({"error": "Missing channel ID, user ID, or message"}), 400

        channel = stream_chat_client.channel('messaging', channel=channel_id)
        channel.send_message(message, user_id)
        return jsonify({"message": "Message sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@stream_chat_bp.route('/list_messages', methods=['GET'])
def list_messages():
    try:
        channel_id = request.args.get('channel_id')
        if not channel_id:
            return jsonify({"error": "Missing channel ID"}), 400

        channel = stream_chat_client.channel('messaging', channel=channel_id)
        messages = channel.get_messages()
        return jsonify({"messages": messages}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@stream_chat_bp.route('/create_channel', methods=['POST'])
def create_channel():
    try:
        data = request.json
        channel_type = data.get('type', 'messaging')
        channel_id = data.get('id')
        user_id = data.get('user_id')
        if not channel_id or not user_id:
            return jsonify({"error": "Missing channel ID or user ID"}), 400

        channel = stream_chat_client.channel(channel_type, channel_id)
        channel.create(user_id)
        return jsonify({"message": "Channel created successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@stream_chat_bp.route('/delete_channel', methods=['POST'])
def delete_channel():
    try:
        data = request.json
        channel_type = data.get('type', 'messaging')
        channel_id = data.get('id')
        if not channel_id:
            return jsonify({"error": "Missing channel ID"}), 400

        channel = stream_chat_client.channel(channel_type, channel_id)
        channel.delete()
        return jsonify({"message": "Channel deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@stream_chat_bp.route('/add_member', methods=['POST'])
def add_member():
    try:
        data = request.json
        channel_type = data.get('type', 'messaging')
        channel_id = data.get('id')
        user_id = data.get('user_id')
        if not channel_id or not user_id:
            return jsonify({"error": "Missing channel ID or user ID"}), 400

        channel = stream_chat_client.channel(channel_type, channel_id)
        channel.add_members([user_id])
        return jsonify({"message": "Member added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
