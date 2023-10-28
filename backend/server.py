from flask import Flask
import datetime

x = datetime.datetime.now()

app = Flask(__name__)

@app.route('/data')
def get_time():
    return {
        'Name':"geek",
        "Age":"22",
        "Date":x,
        "programming":"python"
    }

@app.route('/<id>')
def user(id):
    return f"Hello {id}"

# @app.route('login')
# def login():
#     quickstart.main()

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)