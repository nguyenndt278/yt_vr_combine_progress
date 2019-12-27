
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/intro')
def intro():
    return render_template("intro.html")

@app.route('/viral')
def viral():
    return render_template("viral_search.html")
    
if __name__ == "__main__":
    app.run()
