 

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
		data: { "alert": message },
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
