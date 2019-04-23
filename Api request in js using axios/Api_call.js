// API request using axios,it is a popular promise based HTTP Client that supports an easy-to-use API and can be used in both node js and browser

var axios = require("axios")
// To include the File System module we import fs,
var fs =require("fs")


var readLine=require("readline-sync")

if(fs.existsSync(__dirname+'/courses.json') ){
	console.log("\n\n**************   WELCOME TO SARAL  *************\n\n")
	var open= fs.readFileSync("courses.json")
	var data=JSON.parse(open)
	//callig a function
	courses_list(data)

	
}
else{

var URL="http://saral.navgurukul.org/api/courses"
// .then() is a method in proimise and is a mechanism for code synchronization.
axios.get(URL).then(function(response){
	//handle success
	const saral_api =response.data;
	// json.stringify() converts our object data in json string.
	const json =JSON.stringify(saral_api,null,4)
	fs.writeFileSync("courses.json",json)

	// simplest way to read a file in NOde js  to use is fs.readFileSync() method
	var readfile=fs.readFileSync("courses.json");
	//converts strings into javascript objects
	var saral_data=JSON.parse(readfile)
	courses_list(saral_data)

	


})
// .catch() methods returns a promise and deals with rejected cases
.catch(function(error){
	//handle error
	console.log(error)
})
}

// creating a function in order to list all the courses
function courses_list(object){
	const available_course = object["availableCourses"]
	for(var index=0;index<available_course.length;index++){
		course_name=available_course[index]["name"]
		course_id=available_course[index]["id"]
		console.log(index+1,"course_id:", course_id,course_name)
	}
	var id=readLine.question("\nEnter the any Course ID to see the sub Courses  :-")
	for(var i in available_course){
		if(id==available_course[i]["id"]){
			console.log("\nname of the course is:-  "+available_course[i]["name"]+"   with course id :--",id,"\n")

			var URL= "http://saral.navgurukul.org/api/courses/"+id+"/exercises"
	

			axios.get(URL).then(function(response){
			var data=response.data
			var json=JSON.stringify(data,null,4)
			fs.writeFileSync("exerices_id"+id+".json",json)

			var read=fs.readFileSync("exerices_id"+id+".json")
			var  course=JSON.parse(read)


			var sub_course_list=course["data"]
			console.log("The sub course are:- \n")
			// for printing sub courses
			for(var i=0 ;i<sub_course_list.length;i++){
				console.log("\n",i+1,"course_id:- "+sub_course_list[i]["id"]  ,sub_course_list[i]["name"],"     with slug:- ",sub_course_list[i]["slug"])
				//for printing exercises
				for(var b=0;b<sub_course_list[i]["childExercises"].length;b++){
					var course_id=sub_course_list[i]["childExercises"][b]["id"]
					var course_name=sub_course_list[i]["childExercises"][b]["name"]
					var slug=sub_course_list[i]["childExercises"][b]["slug"]
					
					console.log("  ",b+1,"   course_id :-  "+course_id,course_name,"  with slug:-    "+slug)
					
				}


			}
			//for printing content 
			var num=readLine.question("\n\n enter the  course number whose content you want to  read  ")
			for(var data=0;data<sub_course_list.length;data++){
				if (num==data+1){
					slug=sub_course_list[data]["slug"]
					URL="http://saral.navgurukul.org/api/courses/"+id+"/exercise/getBySlug?slug="+slug
					axios.get(URL).then(function(response){
						var data=response.data
						const content=data["content"]
						console.log("\n",content)


					if(sub_course_list[num-1]["childExercises"].length>0){
						// for printing content of sub_courses
					var sub_content=readLine.question("\n  Enter "+sub_course_list[num-1]["name"]+"'s' sub-course number to  see it's content "+"\n")

					for(var b=0;b<sub_course_list[num-1]["childExercises"].length;b++){
					if(sub_content==b+1){
						slug=sub_course_list[num-1]["childExercises"][b]["slug"]
						URL="http://saral.navgurukul.org/api/courses/"+id+"/exercise/getBySlug?slug="+slug

						axios.get(URL).then(function(response){
							var  data=response.data
							console.log("\n"+data["content"])
						}).catch(function(error){
							console.log(error)
						})
				}
			}
		}
					}).catch(function(error){
						console.log(error)
					})
					
				}
			}

		
			
		}).catch(function(error){
			console.log(error)
		})
		
		}
	
	}
	
}

