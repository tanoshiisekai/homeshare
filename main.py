from flask import Flask
from flask import render_template
from flask import Markup
from flask import request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/homeshare.db'
db = SQLAlchemy(app)


class Info(db.Model):
    infoid = db.Column(db.Integer, primary_key=True)
    infocontent = db.Column(db.String(300))
    infotype = db.Column(db.Integer)

    def __init__(self, infocontent, infotype):
        self.infocontent = infocontent
        self.infotype = infotype


@app.route('/addinfo', methods=['POST'])
def addinfo():
    infocontent = request.form["infocontent"]
    print(infocontent)
    if "://" in infocontent:
        infotype = 1
    else:
        infotype = 0
    i = Info(infocontent, infotype)
    db.session.add(i)
    db.session.commit()
    return "ok"


@app.route('/deleteinfo')
def deleteinfo():
    infoid = request.args.get("infoid")
    info = Info.query.filter_by(infoid=infoid).first()
    db.session.delete(info)
    db.session.commit()
    return str(infoid)


@app.route('/')
def index():
    infos = Info.query.order_by(db.desc(Info.infoid)).all()
    infos = [(x.infoid, x.infocontent, x.infotype) for x in infos]
    newlist = []
    for info in infos:
        if info[2] == 1:
            newlist.append(
                (info[0], Markup("<a class='infolink' target='_blank' href=" + info[1] + ">" + info[1] + "</a>"), info[2]))
        else:
            newlist.append((info[0], info[1], info[2]))
    return render_template("index.html", infos=newlist)


if __name__ == '__main__':
    db.create_all()
    app.run(host="192.168.2.110", port=10001, debug=True)
