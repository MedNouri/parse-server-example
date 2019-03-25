 
	  Parse.Cloud.job("myJob", (request) =>  {
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