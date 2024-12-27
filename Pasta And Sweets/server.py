from flask import Flask, send_from_directory, request, jsonify
import os
import json
import threading
from datetime import datetime

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(BASE_DIR, 'data', 'users.json')
ORDERS_FILE = os.path.join(BASE_DIR, 'data', 'orders.json')
MESSAGES_FILE = os.path.join(BASE_DIR, 'data', 'messages.json')
file_lock = threading.Lock()

# Ensure the data directory exists
if not os.path.exists(os.path.join(BASE_DIR, 'data')):
    os.makedirs(os.path.join(BASE_DIR, 'data'))

# Create users.json if it doesn't exist
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump({"users": []}, f, ensure_ascii=False, indent=4)

# Create orders.json if it doesn't exist
if not os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
        json.dump({"orders": []}, f, ensure_ascii=False, indent=4)

# Create messages.json if it doesn't exist
if not os.path.exists(MESSAGES_FILE):
    with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump({"messages": []}, f, ensure_ascii=False, indent=4)

def get_users():
    with file_lock:
        try:
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading users file: {e}")
            return {"users": []}

def save_users(users_data):
    with file_lock:
        try:
            with open(USERS_FILE, 'w', encoding='utf-8') as f:
                json.dump(users_data, f, ensure_ascii=False, indent=4)
            return True
        except Exception as e:
            print(f"Error saving users file: {e}")
            return False

def get_orders():
    with file_lock:
        try:
            with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading orders file: {e}")
            return {"orders": []}

def save_orders(orders_data):
    with file_lock:
        try:
            with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
                json.dump(orders_data, f, ensure_ascii=False, indent=4)
            return True
        except Exception as e:
            print(f"Error saving orders file: {e}")
            return False

def get_messages():
    with file_lock:
        try:
            with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading messages file: {e}")
            return {"messages": []}

def save_messages(messages_data):
    with file_lock:
        try:
            with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
                json.dump(messages_data, f, ensure_ascii=False, indent=4)
            return True
        except Exception as e:
            print(f"Error saving messages file: {e}")
            return False

@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory(BASE_DIR, filename)

@app.route('/api/users', methods=['GET'])
def get_all_users():
    users_data = get_users()
    # Remove sensitive information before sending
    for user in users_data['users']:
        user.pop('password', None)
    return jsonify(users_data)

@app.route('/api/users/register', methods=['POST'])
def register_user():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "يرجى ملء جميع الحقول المطلوبة"}), 400
    
    users_data = get_users()
    
    # Check if user already exists
    if any(user['email'] == data['email'] for user in users_data['users']):
        return jsonify({"error": "البريد الإلكتروني مسجل مسبقاً"}), 400
    
    # Add new user
    new_user = {
        "id": len(users_data['users']) + 1,
        "name": data['name'],
        "email": data['email'],
        "password": data['password'],  # In a real app, this should be hashed
        "createdAt": str(datetime.now())
    }
    
    users_data['users'].append(new_user)
    if save_users(users_data):
        # Remove password before sending response
        user_response = dict(new_user)
        user_response.pop('password', None)
        return jsonify({"message": "تم التسجيل بنجاح", "user": user_response}), 201
    else:
        return jsonify({"error": "حدث خطأ أثناء التسجيل"}), 500

@app.route('/api/users/login', methods=['POST'])
def login_user():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "يرجى إدخال البريد الإلكتروني وكلمة المرور"}), 400
    
    users_data = get_users()
    
    # Find user
    user = next((user for user in users_data['users'] 
                 if user['email'] == data['email'] and user['password'] == data['password']), None)
    
    if user:
        # Remove password before sending response
        user_response = dict(user)
        user_response.pop('password', None)
        return jsonify({
            "message": "تم تسجيل الدخول بنجاح",
            "user": user_response
        })
    
    return jsonify({"error": "البريد الإلكتروني أو كلمة المرور غير صحيحة"}), 401

@app.route('/api/orders', methods=['GET'])
def get_all_orders():
    orders_data = get_orders()
    return jsonify(orders_data)

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    
    if not data or not all(key in data for key in ['items', 'total', 'customerName', 'phone', 'address']):
        return jsonify({"error": "بيانات الطلب غير مكتملة"}), 400
    
    orders_data = get_orders()
    
    # Create new order
    new_order = {
        "id": len(orders_data['orders']) + 1,
        "items": data['items'],
        "total": data['total'],
        "customerName": data['customerName'],
        "phone": data['phone'],
        "address": data['address'],
        "paymentMethod": data.get('paymentMethod', 'cash'),
        "status": "pending",
        "orderDate": data.get('orderDate', str(datetime.now()))
    }
    
    if data.get('cardDetails'):
        # In a real app, you would process the payment here
        new_order['cardDetails'] = {
            "lastFour": data['cardDetails']['cardNumber'][-4:],
            "expiryDate": data['cardDetails']['expiryDate']
        }
    
    orders_data['orders'].append(new_order)
    if save_orders(orders_data):
        return jsonify({"message": "تم تقديم الطلب بنجاح", "order": new_order}), 201
    else:
        return jsonify({"error": "حدث خطأ أثناء حفظ الطلب"}), 500

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json()
    
    if not data or 'status' not in data:
        return jsonify({"error": "حالة الطلب مطلوبة"}), 400
    
    orders_data = get_orders()
    
    # Find and update order
    order = next((order for order in orders_data['orders'] if order['id'] == order_id), None)
    if not order:
        return jsonify({"error": "الطلب غير موجود"}), 404
    
    order['status'] = data['status']
    if save_orders(orders_data):
        return jsonify({"message": "تم تحديث حالة الطلب بنجاح", "order": order})
    else:
        return jsonify({"error": "حدث خطأ أثناء تحديث حالة الطلب"}), 500

@app.route('/api/messages', methods=['GET'])
def get_all_messages():
    messages_data = get_messages()
    return jsonify(messages_data)

@app.route('/api/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    
    if not data or not all(key in data for key in ['name', 'email', 'message']):
        return jsonify({"error": "جميع الحقول مطلوبة"}), 400
    
    messages_data = get_messages()
    
    # Create new message
    new_message = {
        "id": len(messages_data['messages']) + 1,
        "name": data['name'],
        "email": data['email'],
        "message": data['message'],
        "status": "unread",
        "createdAt": str(datetime.now())
    }
    
    messages_data['messages'].append(new_message)
    if save_messages(messages_data):
        return jsonify({"message": "تم إرسال رسالتك بنجاح", "data": new_message}), 201
    else:
        return jsonify({"error": "حدث خطأ أثناء إرسال الرسالة"}), 500

@app.route('/api/messages/<int:message_id>/status', methods=['PUT'])
def update_message_status(message_id):
    data = request.get_json()
    
    if not data or 'status' not in data:
        return jsonify({"error": "حالة الرسالة مطلوبة"}), 400
    
    messages_data = get_messages()
    
    # Find and update message
    message = next((msg for msg in messages_data['messages'] if msg['id'] == message_id), None)
    if not message:
        return jsonify({"error": "الرسالة غير موجودة"}), 404
    
    message['status'] = data['status']
    if save_messages(messages_data):
        return jsonify({"message": "تم تحديث حالة الرسالة بنجاح", "data": message})
    else:
        return jsonify({"error": "حدث خطأ أثناء تحديث حالة الرسالة"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
