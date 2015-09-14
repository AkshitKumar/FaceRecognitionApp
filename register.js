(function() {
	var width = 320;
	var height = 0;

	var streaming = false;

	var video = null;
	var canvas = null;
	var photo = null;
	var startbutton = null;
	var register = null;
	var photoname = Math.floor((Math.random()*1000000)+1).toString();

	function startup(){
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		photo = document.getElementById('photo');
		startbutton = document.getElementById('startbutton');
		register = document.getElementById('register');
		navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

		navigator.getMedia(
		{
			video : true,
			audio : false
		},
		function(stream){
			if(navigator.moxGetUserMedia){
				video.mozSrcObject = stream;
			} else{
				var vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL.createObjectURL(stream);
			}
			video.play();
		},
		function(err){
			console.log("An error occured! "+ err);
		});

		video.addEventListener('canplay',function(ev){
			if(!streaming){
				height = video.videoHeight/(video.videoWidth/width);
				if(isNaN(height)){
					height = width / (4/3);
				}
				video.setAttribute('width',width);
				video.setAttribute('height',height);
				canvas.setAttribute('width',width);
				canvas.setAttribute('height',height);
				streaming = true;
			}
		},false);

		startbutton.addEventListener('click', function(ev){
      		takepicture();
      		ev.preventDefault();
    	}, false);

    	register.addEventListener('click',function(ev){
    		registerPhoto();
    	},false);

		clearphoto();
	}

	function clearphoto(){
		var context = canvas.getContext('2d');
		context.fillStyle = '#AAA';
		context.fillRect(0,0,canvas.width,canvas.height);

		var imgdata = canvas.toDataURL('image/png');
		photo.setAttribute('src',imgdata);
	}

	function takepicture(){
		var context = canvas.getContext('2d');
		if(width && height){
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video,0,0,width,height);

			var imgdata = canvas.toDataURL('image/png');
			photo.setAttribute('src',imgdata);
			var data = {
				name : photoname,
				image : imgdata
			};
			$.post('upload.php',data,function(resp,status){
				alert("The picture is uploaded");
			});
		} else{
			clearphoto();
		}
	}
/*
	function checkPhoto(){
		var name = $('#name').val();
		var photoname = $('#photoname').val();
		var apiurl = 'http://api.skybiometry.com/fc/faces/recognize.json?api_key=9109e9f3a40f4d339417af307836d885&api_secret=8107096aba4a427f986804dbbf029f05&urls=http://souryav.5gbfree.com/facerecog/images/' + photoname + '.png&uids=' + name +'@photobooth';
		$.getJSON(apiurl,function(json){
			if(json.status === "success"){
			if(typeof json.photos[0].tags[0].uids[0] == 'undefined'){
				document.getElementById('output').innerHTML = 'Photo does match with name';
				document.getElementById('access').innerHTML = 'ACCESS DENIED';
			}
			else if(json.photos[0].tags[0].uids[0].confidence >= 60){
				document.getElementById('output').innerHTML = json.photos[0].tags[0].uids[0].uid.replace("95@photobooth","");
				document.getElementById('access').innerHTML = 'ACCESS GRANTED';
			}
		}
		else if(json.status === "failure"){
			document.getElementById('output').innerHTML = 'Failure Occured. Try again by refreshing the window and wait some time before checking';
			document.getElementById('access').innerHTML = 'ACCESS DENIED';
		}
		});
	}
*/
	function registerPhoto(){
		var name = $('#name').val();
		// var photoname = $('#photoname').val();
		var detecturl = 'http://api.skybiometry.com/fc/faces/detect.json?api_key=9109e9f3a40f4d339417af307836d885&api_secret=8107096aba4a427f986804dbbf029f05&urls=http://souryav.5gbfree.com/facerecog/images/'+ photoname + '.png';
		$.getJSON(detecturl,function(json){
			console.log(json.photos[0].tags[0].tid);
			var tid = json.photos[0].tags[0].tid;
			var tagsave = 'http://api.skybiometry.com/fc/tags/save.json?api_key=9109e9f3a40f4d339417af307836d885&api_secret=8107096aba4a427f986804dbbf029f05&uid='+name+'@photobooth&tids=' + tid;
			$.getJSON(tagsave,function(json){
				var detectedtid = json.saved_tags[0].detected_tid;
				console.log(detectedtid);
				console.log(json.message);
				var trainurl = 'http://api.skybiometry.com/fc/faces/train.json?api_key=9109e9f3a40f4d339417af307836d885&api_secret=8107096aba4a427f986804dbbf029f05&&uids='+name+'@photobooth';
				$.getJSON(trainurl,function(json){
					console.log(json.status);
					console.log(json);
					if((json.status)=="success"){
						document.getElementById('output').innerHTML = 'Successfully Registered';
					}
					else{
						document.getElementById('output').innerHTML = 'Registration failed.Please try again';
					}
				});
			});
		});
	}

	window.addEventListener('load',startup,false);
})();