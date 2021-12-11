import json

from flask import Flask, request, jsonify, render_template
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

application = Flask(__name__)
CORS(application)


@application.route('/')
def index():
    return render_template('app.html')


@application.route('/students', methods=['POST', 'GET', 'PUT', 'DELETE'])
def students():
    result = {"success": False}

    if request.method == 'POST':
        try:
            data = json.loads(request.data)
            new_student = StudentsModel(name=data['name'], contact_number=data['contactNumber'], email_id=data['emailId'])
            db.session.add(new_student)
            db.session.commit()
            result = {"success": True}
        except Exception as e:
            print(e)
            result = {"success": False}
        finally:
            return jsonify(result)
    elif request.method == 'GET':
        try:
            students = StudentsModel.query.all()
            results = [
                {
                    "name": student.name,
                    "contactNumber": student.contactNumber,
                    "emailId": student.emailId,
                    "id": student.id
                } for student in students]
        except Exception as e:
            print(e)
        return jsonify({"students": results})

    elif request.method == 'PUT':
        try:
            data = json.loads(request.data)
            student = StudentsModel.query.get_or_404(data['id'])
            if data['name'] and student.name != data['name']:
                student.name = data['name']
            if data['contactNumber'] and student.contactNumber != data['contactNumber']:
                student.contactNumber = data['contactNumber']
            if data['emailId'] and student.emailId != data['emailId']:
                student.emailId = data['emailId']

            db.session.add(student)
            db.session.commit()
            result = {"success": True}
        except Exception as e:
            print(e)
            result = {"success": False}
        finally:
            return jsonify(result)

    elif request.method == 'DELETE':
        try:
            data = json.loads(request.data)
            student = StudentsModel.query.get_or_404(data['id'])
            db.session.delete(student)
            db.session.commit()
            result = {"success": True}
        except Exception as e:
            print(e)
            result = {"success": False}
        finally:
            return jsonify(result)

application.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://python:python123@database-1.ckrojnpkqucm.us-east-1.rds.amazonaws.com:5432/student"
db = SQLAlchemy(application)
migrate = Migrate(application, db)


class StudentsModel(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    contactNumber = db.Column(db.Integer())
    emailId = db.Column(db.String())

    def __init__(self, name, contact_number, email_id):
        self.name = name
        self.contactNumber = contact_number
        self.emailId = email_id

    def __repr__(self):
        return f"<Student {self.name}>"


if __name__ == '__main__':
    application.run(host='0.0.0.0', port=7000, debug=True)
