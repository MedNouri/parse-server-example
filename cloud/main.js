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
 Parse.Cloud.beforeSave(Parse.User, (request) => {
 	var err;
 	if (!validateEmail(request.object.get("email"))) {
 		err += "email invalide";
 	}
 	if (request.object.get("firstName").length == 0) {
 		err += "and name was null"

 	}
 	if (request.object.get("company") == null) {
 		err += "and company was null"

 	}
 	if (err.length != null)
 		throw err;

 });


 function validateEmail(email) {
 	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 	return re.test(String(email).toLowerCase());
 }