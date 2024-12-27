# Pasta and Sweets Website Server

## Setup and Running

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:
```bash
python server.py
```

3. For production, use Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 server:app
```

## Keeping the Server Running

### Windows Options:
1. **Task Scheduler**: Create a task to start the server on system boot
2. **NSSM (Non-Sucking Service Manager)**: Create a Windows service
3. **PM2 for Windows**: Process manager for keeping the server alive

### Linux/Mac Options:
1. **systemd service**
2. **Supervisor**
3. **PM2 process manager**

## Deployment Notes
- Use a production WSGI server like Gunicorn
- Consider using Nginx as a reverse proxy
- Set `debug=False` in production
