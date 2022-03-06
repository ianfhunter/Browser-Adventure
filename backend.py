from flask import Flask
from flask import render_template
import xmltodict, json

app = Flask(
    __name__, 
    static_url_path='',
    static_folder="web/static",
    template_folder="web/templates"
)

@app.route("/")
def index():
    f = open("modules/goblin_thief.xml")
    module = f.read().replace("\n","")
    return render_template('index.html', module=module)

@app.route("/module/<module_name>")
def module(module_name):
    print(module_name)
    return

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r