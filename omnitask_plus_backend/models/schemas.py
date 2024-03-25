
from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3))
    firstname = fields.Str(required=True)
    lastname = fields.Str(required=True)
    email = fields.Email(required=True)
    contact = fields.Str(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    is_active = fields.Boolean(required=True)

class TaskSchema(Schema):
    pass

class StudySessionSchema(Schema):
    pass
