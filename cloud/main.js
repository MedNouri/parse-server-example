
Parse.Cloud.define("hello", function (request, response) {
	response.success('3asslema startdevellopement :) ');
});

Parse.Cloud.define("SendSMS", function (request, response) {

	// Requiring the values to send
	var
		getMessage = "Votre  code de vérification est :  \n " + request.params.verificationNumber,
		getPhoneTo = request.params.to,
		getPhoneFrom = "My Apero",
		accountSid = 'AC0a67d9debb9c5ca750213338a64d9519',
		authToken = '059232582a2a35eb37854f6bca2982a6';


	//require the Twilio module and create a REST client
	var client = require('twilio')(accountSid, authToken);

	client.messages
		.create({
			body: getMessage, // Any number Twilio can deliver to
			from: getPhoneFrom, // A number you bought from Twilio and can use for outbound communication
			to: getPhoneTo // body of the SMS message
		})
		.then(function (results) {
			response.success(results.sid);
		})
		.catch(function (error) {
			response.error(error);
		})
});


Parse.Cloud.define('sendPush', function (request, response) {
	var params = request.params;
	var customData = params.customData;
	var goTo = params.goTo;
	var message = params.message;
	var id = params.id;

	if (!customData) {
		response.error("Missing customData!")
	}

	//var sender = JSON.parse(customData).sender;
	var query = new Parse.Query(Parse.Installation);
	query.equalTo("installationId", customData);

	Parse.Push.send({
		where: query,
		// Parse.Push requires a dictionary, not a string.
		data: { "alert": message, "goTo": goTo, "id": id },
	}, {
			success: function () {
				console.log("#### PUSH OK");
			}, error: function (error) {
				console.log("#### PUSH ERROR" + error.message);
			}, useMasterKey: true
		});

	//	response.json('success');
});

Parse.Cloud.define("averageStars", async (request) => {
	const query = new Parse.Query("Reviews");
	query.equalTo("targetIdemail", request.params.email);
	const results = await query.find();
	let sum = 0;
let account = results.length ;
	for (let i = 0; i < account; ++i) {
		sum += results[i].get("ratingValue");

	}
	return ({ "sum": sum / account , "count":account });
});
