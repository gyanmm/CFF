from pydash.objects import pick
import datetime
from chalicelib.models import Form, serialize_model
from bson.objectid import ObjectId
from chalicelib.util.renameKey import renameKey

def form_edit(formId):
  from ..main import app, TABLES
  form = Form.objects.get({"_id":ObjectId(formId)})
  app.check_permissions(form, 'Forms_Edit')
  body = pick(app.current_request.json_body, ["schema", "uiSchema", "formOptions", "name"])
  for k, v in body.items():
    setattr(form, k, v)
  # Validate $ref properly.
  if form.schema:
    form.schema = renameKey(form.schema, "$ref", "__$ref")
  print(form.schema)
  form.save()
  return {
    "res": {
      "success": True,
      "updated_values": serialize_model(form)
    }
  }