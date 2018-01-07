let defaultSchema = {
    "_id": {
        "$oid": "59dbf12b734d1d18c95dbd21"
    },
    "schemaId": {
        "$oid": "59dbf12b752e1d18c95dbd21"
    },
    "version": 1,
    "value": {
        "definitions": {
            "name": {
                "title": "",
                "type": "object",
                "properties": {
                    "first": {
                        "type": "string",
                        "title": "First Name",
                        "classNames": "flex"
                    },
                    "last": {
                        "type": "string",
                        "title": "Last Name",
                        "classNames": "flex"
                    }
                }
            }
        },
        "properties": {
            "email": {
                "type": "string",
                "format": "email",
                "required": true
            },
            "address": {
                "type": "object",
                "properties": {
                    "line1": {
                        "type": "string",
                        "title": "Address Line 1",
                        "required": true
                    },
                    "line2": {
                        "type": "string",
                        "title": "Address Line 2"
                    },
                    "city": {
                        "type": "string",
                        "classNames": "flex",
                        "required": true
                    },
                    "state": {
                        "type": "string",
                        "classNames": "flex",
                        "required": true
                    },
                    "zipcode": {
                        "type": "string",
                        "classNames": "flex",
                        "required": true
                    }
                }
            },
            "participants": {
                "title": "Participants",
                "ui:options": {
                    "addable": true,
                    "orderable": false
                },
                "type": "array",
                "minItems": 1,
                "uniqueItems": true,
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "\\u0024ref": "#/definitions/name"
                        },
                        "age": {
                            "type": "number",
                            "classNames": "half"
                        },
                        "race": {
                            "type": "string",
                            "classNames": "full"
                        }
                    }
                }
            },
            "acceptTerms": {
                "type": "boolean",
                "title": "Terms and Conditions",
                "required": true,
                "ui:widget": "tc"
            }
        },
        "type": "object",
        "description": "<b>Walkathon<\/b> registration training form.",
        "title": "Walkathon Registration Training Form"
    }
};
let defaultSchemaModifier = {
    "_id": {
        "$oid": "59f3a9be6fd1dd1a98ac48e3"
    },
    "schemaModiferId": {
        "$oid": "59dbf12b734d5d28c12dbd21"
    },
    "version": 1,
    "last_modified": "",
    "date_created": "",
    "title": "",
    "value": {
        "description": "<b>IMPORTANT NOTE:<\/b><br>This is Registration for Training only.<br>For Full Marathon, please register with Napa Valley Marathon.<br>For Half Marathon, 10K and 5K, OmRun Registration will begin in February/March.<br><br>Registration Amount: $25",
        "address": true,
        "participants": {
            "items": {
                "race": {
                    "enum": [
                        "Full Marathon",
                        "Half Marathon",
                        "10K",
                        "5K"
                    ],
                    "required": true,
                    "title": "Select the race you would like to train for:",
                    "description": "Note: Full Marathon training has already begun. Training for Half Marathon, 10K and 5K will begin on January 27, 2018."
                }
            }
        },
        "acceptTerms": {
            "description": "I agree to the <a target=_blank href=https://goo.gl/DXGqy8>Terms and Conditions.</a>"
        },
        "email": true,
        "title": "2018 Om Run Training Registration"
    },
    "paymentInfo": {
        "currency": "USD",
        "total": "25"
    },
    "paymentMethods": {
        "paypal": {
            "env": "sandbox",
            "client": {
                "sandbox": "AQnuMqn24Q8xTChC8uSgCOnmDjeMXZ1O7ZNS0uCHIsOmcoHqA6g2acYhTa_Qv-euJJ8UVFh4zmhJAWQR"
            }
        },
        "ccavenue": true
    },
    "confirmationEmailInfo": {
        "from": "omrun@cmsj.org",
        "cc": "",
        "toField": "email",
        "subject": "2018 Om Run Training Registration Confirmation",
        "message": "Thank you for your registration. You are registering for Training and Not for OmRun; OmRun registration will open in the first quarter of 2018.",
        "showResponse": true,
        "showModifyLink": true
    }
};
let responsesList = [
    {
        "value": {
            "a": "b"
        }
    }
];
let MockData = {
    formRender: {
        "data": {
            "res": [
                {
                    schema: defaultSchema,
                    schemaModifier: defaultSchemaModifier
                }
            ]
        }
    },
    formList: {
        "data": {
            "res": [
                {"_id": {"$oid": "59dbf12b734d1d18c05ebd21"}, "name": "2018 OM RUN FORM (MOCK DATA)"},
                {"_id": {"$oid": "59dbf12b734d1d18c05ebd21"}, "name": "2017 OM RUN FORM (MOCK DATA)"},
                {"_id": {"$oid": "59dbf12b734d1d18c05ebd21"}, "name": "2016 OM RUN FORM (MOCK DATA)"}
            ]
        }
        
    },
    formResponses: {
        "data": {
            "res": [
                {
                    "responses": responsesList
                }
            ]
        }
    }
}
export default MockData;