
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/intro')
def intro():
    return render_template("intro.html")

@app.route('/transition')
def transition():
    return render_template("transition.html")

# @app.route('/visual')
# def viral():
#     return render_template("visual.html")

@app.route('/viral')
def viral():
    return render_template("viral_search.html")
    
if __name__ == "__main__":
    app.run()
