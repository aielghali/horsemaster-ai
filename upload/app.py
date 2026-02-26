from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Demo predictions
    races = [
        {"track":"Meydan (UAE)","race":"Race 1","horse":"Desert Star","confidence":"78%"},
        {"track":"Ascot (UK)","race":"Race 3","horse":"Royal Thunder","confidence":"72%"},
        {"track":"Flemington (AU)","race":"Race 5","horse":"Southern Wind","confidence":"69%"},
        {"track":"Belmont Park (US)","race":"Race 2","horse":"Atlantic King","confidence":"74%"},
        {"track":"Longchamp (FR)","race":"Race 4","horse":"Paris Glory","confidence":"71%"},
    ]
    return render_template('index.html', races=races)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
