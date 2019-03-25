Parse.Cloud.define('sendPush', function (request, response) {

	var id = request.object.get("customData");
	var message = params.message;

	if (id == null) {
		response.error("Missing customData!")
	}

	//var sender = JSON.parse(customData).sender;
	var query = new Parse.Query(Parse.Installation);
	query.equalTo("user", id);

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

Parse.Cloud.beforeSave("Conversion", async (request, response) => {
	/* 	var Conversion = Parse.Object.extend("Conversion");
		let c = new Conversion()
	 */
	if (!isNaN(request.object.get("receiverUser") && !isNaN(request.object.get("senderUser")))) {
		let receiverUser = request.object.get("receiverUser");
		let senderUser = request.object.get("senderUser");
		const query = new Parse.Query("Conversion");
		const query2 = new Parse.Query("Conversion");

		query.equalTo("receiverUser", receiverUser);
		query.equalTo("senderUser", senderUser);

		query2.equalTo("senderUser", receiverUser);
		query2.equalTo("receiverUser", senderUser);

		var query3 = Parse.Query.or(query, query2);
		let result = await query3.first()
		if (result != null)
			throw ("dddd")

	}
})
/* Parse.Cloud.define("alreadychatted", async (request) => {
	const queryUser = new Parse.Query("User");

	let receiverUser = queryUser.get(request.params.get("idreceiver").id);
	let senderUser = queryUser.get(request.params.get("idsender").id);
	const query = new Parse.Query("Conversion");
	const query2 = new Parse.Query("Conversion");

	query.equalTo("receiverUser", receiverUser);
	query.equalTo("senderUser", senderUser);

	query2.equalTo("senderUser", receiverUser);
	query2.equalTo("receiverUser", senderUser);

	var query3 = Parse.Query.or(query, query2);
	let result = await query3.first()
	if (result != null)
		return true
	return false



}); */
Parse.Cloud.define("alreadychatted", async (request) => {
	const queryUser = new Parse.Query("User");

	let receiverUser = queryUser.get(request.params.idreceiver).id;
	let senderUser = queryUser.get(request.params.idsender).id;
	const query = new Parse.Query("Conversion");
	const query2 = new Parse.Query("Conversion");

	query.equalTo("receiverUser", receiverUser);
	query.equalTo("senderUser", senderUser);

	query2.equalTo("senderUser", receiverUser);
	query2.equalTo("receiverUser", senderUser);

	var query3 = Parse.Query.or(query, query2);
	 
	 
	return  await query3.count()>0?true:false



});


Parse.Cloud.afterSave("Demande", async (request) => {
	let user = await request.user.fetch();
	user.increment("totalDemande")
	return user.save(null, { useMasterKey: true });
})
Parse.Cloud.beforeSave("Review", (request) => {

	if (request.object.get("ratedByUser") == null) {
		throw "Can't Creat Review if ratedByUser is empty .";
	}

	if (request.object.get("comment") == null) {
		throw "Can't Creat Review if comment is empty .";
	} else if (request.object.get("comment").length > 140) {
		request.object.set("comment", request.object.get("comment").substring(0, 137) + "...");
	}

	if (request.object.get("ratedUser") == null) {
		throw "Can't Creat Review if ratedUser is empty .";
	}
	if (request.object.get("stars") == null) {
		throw "Can't Creat Review if stars is empty .";
	} else if (request.object.get("stars") > 5 || request.object.get("stars") < 0)
		throw "Can't Creat Review if stars is invalid .";
})
// chek user if is valid
Parse.Cloud.beforeSave(Parse.User, (request) => {
	if ((request.object.get("email") == null)) throw "Can't Creat user if email is empty .";
	else
		if (!validateEmail(request.object.get("email"))) {
			throw "Can't Creat user if email is invalid .";
		}
	if (request.object.get("name") == null) {
		throw "Can't Creat user if name is empty .";
	}

	if (request.object.get("phone") == null) {
		throw "Can't Creat user if phone is empty .";
	}
	if (request.object.get("userimage") == null) {
		throw "Can't Creat user if userImage is empty .";
	}
	if (request.object.get("username") == null) {
		throw "Can't Creat user if userName is empty .";
	}


	if (request.object.get("userForm") == null) {
		throw "Can't Creat user if userForm is empty .";
	}
	if (request.object.get("userNumSiret") == null) {
		throw "Can't Creat user if userNumSiret is empty .";
	}


	if (request.object.get("friendlylocation") == null) {
		throw "Can't Creat user if friendlylocation is empty .";
	}

	if (request.object.get("userLocation") == null) {
		throw "Can't Creat user if userLocation is empty .";
	}


	if (request.object.get("usertype") == null) {
		throw "Can't Creat user if usertype is empty .";
	}
});



Parse.Cloud.afterSave("Review", async (request) => {
	const query = new Parse.Query("User");
	let user = await query.get(request.object.get("ratedUser").id)

	const queryR = new Parse.Query("Review");
	queryR.equalTo("ratedUser", user);
	const results = await queryR.find();
	let sum = 0;
	for (let i = 0; i < results.length; ++i) {
		sum += results[i].get("stars");
	}
	let rate = sum / results.length;
	console.log('raaaate' + rate)
	console.log('userrrrrrrrr' + JSON.stringify(user));
	var queryPush = new Parse.Query(Parse.Installation);
	queryPush.equalTo("user", user);
	var message = "your have new  Review and got " + request.object.get("stars") + " stars"
	console.log(message);

	Parse.Push.send(await {
		where: queryPush,
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




	user.set("ratedValue", Math.round(rate * 2) / 2)





	await user.increment("totalreviews")

	return user.save(null, { useMasterKey: true });


});

Parse.Cloud.afterSave("Proposal", async (request) => {


	let query = new Parse.Query(Parse.Installation);
	if (request.object.get("accepted") != null) {
		query.equalTo("user", request.object.get("propsedby"));

		var message = request.object.get("accepted") == true ? "your propose was accepted" : "sorry , your propose was refused"
		if (request.object.get("accepted") == true) {
			let demande = request.object.get("demande")

			demande.set("ended", true)
			demande.save(null, { useMasterKey: true })
		}
		Parse.Push.send({
			where: query,
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


	} else {
		const query2 = new Parse.Query("User");
		let demande = await query2.get(request.object.get("demande").id)

		let user = await query.get(demande.get("creator").id);

		query.equalTo("user", user);

		var message = "your have new propose"
		Parse.Push.send({
			where: query,
			data: {
				"alert": message
			},
		}, {
				success: function () {
					request.object.set("accepted", false)
					request.save(null, { useMasterKey: true })
					console.log("#### PUSH OK");
				},
				error: function (error) {
					console.log("#### PUSH ERROR" + error.message);
				},
				useMasterKey: true
			});



	}


});

Parse.Cloud.define("averageStars", async (request) => {
	const query = new Parse.Query("Review");

	query.equalTo("ratedUser", request.user);
	const results = await query.find();

	let sum = 0;
	for (let i = 0; i < results.length; ++i) {
		sum += results[i].get("stars");
	}
	return sum / results.length;


});

Parse.Cloud.define("LastMessageForConversation", async (request) => {

	const query = new Parse.Query("Conversion");
	const conversionID = request.params.objectId;
	query.equalTo("objectId", conversionID);
	query.include("post");
	let results = await query.first()
	var messages = results.relation("messages");

	let messageQ = messages.query()
	messageQ.descending("createdAt")
	let message = await messageQ.first();
	return (message.get("text"));

	// console.log(JSON.stringify(messages));





});



Parse.Cloud.define("IsAlreadySubmitted", async (request) => {

	const query = new Parse.Query("Demande");
	const demandeID = request.params.demandeobjectid;
	query.equalTo("objectId", demandeID);
	const demandeFound = await query.first();
	let proposals = await demandeFound.relation("proposals")

	let querryPropsal = proposals.query()

	querryPropsal.equalTo("propsedby", request.user);
	var result = await querryPropsal.first()


	if (result != null) {
		return true;
	}
	else {
		return false;
	}
});


Parse.Cloud.define("averageStarsWithId", async (request) => {
	const query = new Parse.Query("User");
	query.equalTo("objectId", request.params.userid);
	const userFound = await query.first();

	if (userFound != null) {
		const queryR = new Parse.Query("Review");

		queryR.equalTo("ratedUser", userFound);
		const results = await queryR.find();
		let sum = 0;
		results.forEach(review => {

			sum += review.get("stars");

		});

		let rate = sum / results.length
		return rate;

	} else {
		return "Not Found ";
	}
});


// call after Review





function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}




Parse.Cloud.job("myJob", async(request) =>  {
    const query = new Parse.Query("Service");
    query.equalTo("ended", false)
    const results =  await query.find();
	console.log("queery")
    for (let  i = 0; i < results.length; ++i) {
        var Serviceskill = results[i].get("skills");
		var createdBy = results[i].get("creator");
		console.log("for")
        lookForDemandes(Serviceskill, createdBy)

    }
})
 

function intersect_arrays(Skills1, Skills2) {

    var ret = [];
    Skills1.sort();
    Skills2.sort();
    for (var i = 0; i < Skills1.length; i += 1) {
	
        if (Skills2.indexOf(Skills1[i]) > -1) {
			console.log("found")

            ret.push(this[i]);
        }
	}
    return ret;


}


async function lookForDemandes(Serviceskill, createdBy){


    const query = new Parse.Query("Demande");
    query.equalTo("ended", false)
    const results = await  query.find();
    let sum = 0;
    for (let i = 0; i < results.length; ++i) {
		console.log("run")
        // we have All the skills we are looking For 
        var Demandeskill = results[i].get("skills");
        var ConcernedUsers = results[i].get("concernedUsers");
        // now We are looking which Service have this Skills 

        if (intersect_arrays(Serviceskill, Demandeskill).length > 0 ){

			ConcernedUsers.add(createdBy);
			await results[i].save()
			console.log("okkk")
            // add the Curent to the Concerned USers 


        }


    }
}