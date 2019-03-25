
Parse.Cloud.beforeSave("User", function(request, response) {
    var myObject = request.object;
    
    if (myObject.isNew()){  // only check new records, else its a update
        var query = new Parse.Query("User");
        query.equalTo("useremail",myObject.get("email"));
        query.count({
            success:function(number){ //record found, don't save
                //sResult = number;
                if (number > 0 ){
                    throw " error user dount dont save "
                }  
            
        })
      
    });