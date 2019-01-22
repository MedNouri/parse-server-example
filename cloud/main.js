Parse.Cloud.define('sendPush', function (request, response) {
	var params = request.params;
	var customData = params.customData;
	var message = params.message;

	if (!customData) {
		response.error("Missing customData!")
	}

	//var sender = JSON.parse(customData).sender;
	var query = new Parse.Query(Parse.Installation);
	query.equalTo("installationId", customData);

	Parse.Push.send({
		where: query,
		// Parse.Push requires a dictionary, not a string.
		data: {
			"alert": message
		},
	}, {
		success: function () {
			console.log("#### PUSH OK");
		},
		error: function (error) {
			console.log("#### PUSH ERROR" + error.message);
		},
		useMasterKey: true
	});

	//	response.json('success');
});

// chek user if is valid
Parse.Cloud.beforeSave(Parse.User, (request) => {
	if (!validateEmail(request.object.get("email"))) {
		throw "Can't Creat user if email is invalid .";
	}
	if (request.object.get("firstName") == null) {
		throw "Can't Creat user if name is empty .";
	}
	if (request.object.get("lastName") == null) {
		throw "Can't Creat user if lastName is empty .";
	}
	if (request.object.get("phone") == null) {
		throw "Can't Creat user if phone is empty .";
	}
	if (request.object.get("userImage") == null) {
		throw "Can't Creat user if userImage is empty .";
	}
	if (request.object.get("userName") == null) {
		throw "Can't Creat user if userName is empty .";
	}
	if (request.object.get("password") == null) {
		throw "Can't Creat user if password is empty .";
	}
});

Parse.Cloud.beforeSave("Company", (request) => {
	var companyType = ["Installateur / Fabriquant", "exposant"]

	if (request.object.get("companyForm") == null) {
		throw "Can't Creat company if companyForm is empty .";
	}
	if (request.object.get("companyNumSiret") == null) {
		throw "Can't Creat company if companyNumSiret is empty .";
	}
	if (request.object.get("companyName") == null) {
		throw "Can't Creat company if companyName is empty .";
	}

 
	if (request.object.get("companyCity") == null) {
		throw "Can't Creat company if companyCity is empty .";
	}
	 if (request.object.get("companyLogo") == null) {
		throw "Can't Creat company if companyLogo is empty .";
	}
	if (request.object.get("companyAddress") == null) {
		throw "Can't Creat company if companyAddress is empty .";
	}


	if (request.object.get("companytype") == null) {
		throw "Can't Creat company if companytype is empty .";
	} else {

		if (companyType.indexOf(request.object.get("companytype")) == -1)
			throw "Can't Creat company if companyName was invalid .";

	}

});





function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}