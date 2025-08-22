from flask import Flask, render_template
import threading
import webview

app = Flask(__name__, template_folder='templates')

@app.route('/')
def animation1():
    return render_template('animation1.html')

@app.route('/animation2')
def animation2():
    return render_template('animation2.html')

def start_flask():
    app.run(port=5000, threaded=True)

if __name__ == '__main__':
    threading.Thread(target=start_flask, daemon=True).start()

    window = webview.create_window(
        'Animated App',
        'http://127.0.0.1:5000/',
        resizable=True,
        width=900,
        height=700
    )
    webview.start()
