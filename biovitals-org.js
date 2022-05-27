	//---------------------------------------------------------------------------------------
	// EZ-VISION
	//---------------------------------------------------------------------------------------
	// version: 1.5
	// updated: 2020-10-12
	// comment: added statistical indexes like Anura (Nuralogix)
	//---------------------------------------------------------------------------------------
	// version: 1.4
	// updated: 2020-09-15
	// comment: added data object (params) for INPUT data
	//---------------------------------------------------------------------------------------
	// version: 1.3
	// updated: 2020-09-14
	// comment: added GLU analysis
	// comment: average functions
	//---------------------------------------------------------------------------------------
	// version: 1.2
	// updated: 2020-09-11
	// comment: added data object (params) for OUTPUT results
	// comment: mean & median functions
	//---------------------------------------------------------------------------------------
	// version: 1.1
	// updated: 2020-08-28
	// comment: added faceROI
	//---------------------------------------------------------------------------------------
 
	const VERSION = "v1.3";
	
	const OPENCV_URI = "https://docs.opencv.org/master/opencv.js";
	const HAARCASCADE_URI = "haarcascade_frontalface_alt.xml";
	const APIKEY_URI = "apikey.dat"

	const RESCAN_INTERVAL = 1000;
	const DEFAULT_FPS = 30;
	const LOW_BPM = 42;
	const HIGH_BPM = 240;
	const REL_MIN_FACE_SIZE = 0.4;
	const SEC_PER_MIN = 60;
	const MSEC_PER_SEC = 1000;
	const MAX_CORNERS = 10;
	const MIN_CORNERS = 5;
	const QUALITY_LEVEL = 0.01;
	const MIN_DISTANCE = 10;
	
	const LOG2 = 0.6931471805599453;	// LogN (2)
	
	const RPM_MIN_HZ = 0.2;
	const RPM_MAX_HZ = 0.3;
	
	const BPM_MIN_HZ = 1.0;
	const BPM_MAX_HZ = 1.5;
	
	const PROFILE_GENDER = "M";
	const PROFILE_AGE = 50;
	const PROFILE_WEIGHT = 75;
	const PROFILE_HEIGHT = 170;
	const PROFILE_POSITION = "UP";
	
	const VIDEO_WIDTH = 640;
	const VIDEO_HEIGHT = 480;

	const VW8 = VIDEO_WIDTH / 8;
	const VH8 = VIDEO_HEIGHT / 8;

	const FACTOR_AGE = 2;
	const FACTOR_BPM = 2;
	const FACTOR_RPM = 2;
	const FACTOR_SYS = 2;
	const FACTOR_DIA = 2;
	const FACTOR_HRV = 2;
	const FACTOR_SPO2 = 2;
	const FACTOR_BMI = 2;


	const BPM_MIN = 60;
	const BPM_MAX = 110;
	const BPM_TACHY = 140;
	
	const RPM_MIN = 12;
	const RPM_MAX = 25;

	const SYS_MIN = 90;
	const SYS_MAX = 120;
	const SYS_EXTRA = 160;

	const DIA_MIN = 60;
	const DIA_MAX = 90;
	
	const HRV_MIN = 40;
	const HRV_MAX = 80;
	
	const BMI_MIN = 18;
	const BMI_MAX = 25;
	const BMI_EXTRA = 30;

	const SPO2_MIN = 95;
	const SPO2_RISK = 90;
/*
	const median0 = arr => {
		const mid = Math.floor(arr.length / 2),
			nums = [...arr].sort((a, b) => a - b);
		return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
	};
	
	//console.log(median([5, 6, 50, 1, -5]));
	//console.log(median([1, 2, 3, 4, 5]));
*/
	
	//---------------------------------------------------------------------------------------
	// Simple rPPG implementation in JavaScript
	//---------------------------------------------------------------------------------------
	// - Code could be improved given better documentation available for opencv.js
	class BioVitals {
	  constructor(params) {

	  	var p = params || {};
		console.log(p);
		
		this.webcamId = p.webcamId || "";
		this.canvasId = p.canvasId || "";
		this.classifierPath = p.classifierPath || HAARCASCADE_URI;
		this.targetFps = p.targetFps || 30;
		this.windowSize = p.windowSize || 6;
		this.rppgInterval = p.rppgInterval || 250;
		this.apikey = p.apikey;
		this.license = p.license;
		this.showVitals = p.showVitals || true;
		this.showResults = p.showResults || true;
		this.durationTime = p.durationTime || 30; 
		this.btnStop = p.btnStop || null;

		this.userid = "DEMO";

		this.streaming = false;
		this.faceValid = false;
		
		this.gender = PROFILE_GENDER;
		this.age = PROFILE_AGE;
		this.weight = PROFILE_WEIGHT;
		this.height = PROFILE_HEIGHT;
		this.position = PROFILE_POSITION;
	  }
	  

	  //-------------------------------------------------------------------------------------
	  // 
	  //-------------------------------------------------------------------------------------
	  version() {
		return VERSION;
	  }
	  
	  //-------------------------------------------------------------------------------------
	  // Start the video stream
	  //-------------------------------------------------------------------------------------
	  initGetUserMedia() {
	    navigator.mediaDevices = navigator.mediaDevices || {}
	    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || function(constraints) {
	  	let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	  	if (!getUserMedia) {
	  	  return Promise.reject(new Error('getUserMedia not supported by this browser'));
	  	} else {
	  	  return new Promise((resolve, reject) => {
	  		getUserMedia.call(navigator, constraints, resolve, reject);
	  	  });
	  	}
	    }
	  }

/*
	  if (!navigator.mediaDevices) {
	    console.log("Sorry, getUserMedia is not supported");
	    return;
	  }
	  
	  navigator.mediaDevices.getUserMedia(constraints)
	  .then(stream => permissiongiven = 1)
	  .catch(error => console.log(error));
*/

/*
	  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	    navigator.mediaDevices.getUserMedia({ audio: false, video:  cameraOrientation })
	  	.then(function(stream) {
	  	  if ("srcObject" in video) {
	  		  video.srcObject = stream;
	  		} else {
	  		  video.src = window.URL.createObjectURL(stream);
	  		}
	  		video.onloadedmetadata = function(e) {
	  		  video.play();
	  		};
	  	});
	  };
*/

	  async startStreaming() {
		this.webcamVideoElement.setAttribute('autoplay', '');
		this.webcamVideoElement.setAttribute('muted', '');
		this.webcamVideoElement.setAttribute('playsinline', '');
	
		try {
		  this.stream = await navigator.mediaDevices.getUserMedia({
			video: {
			  facingMode: 'user',
			  width: {exact: this.webcamVideoElement.width},
			  height: {exact: this.webcamVideoElement.height}
			},
			audio: false
		  });
		} catch (e) {
		  console.log(e);
		}
		
		//console.log(this.webcamVideoElement.width);		// 640
		//console.log(this.webcamVideoElement.height);	// 480
		
		if (!this.stream) {
		  throw new Error('Could not obtain video from webcam.');
		}
		
		// Set srcObject to the obtained stream
		this.webcamVideoElement.srcObject = this.stream;
		
		// Start the webcam video stream
		this.webcamVideoElement.play();
		this.streaming = true;
		
		return new Promise(resolve => {
		  // Add event listener to make sure the webcam has been fully initialized.
		  this.webcamVideoElement.oncanplay = () => {
			resolve();
		  };
		});
	  }
	  
	  //-------------------------------------------------------------------------------------
	  // Create file from url
	  //-------------------------------------------------------------------------------------
	  async createFileFromUrl(path, url) {
		let request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.send();
		
		return new Promise(resolve => {
		  request.onload = () => {
			if (request.readyState === 4) {
			  if (request.status === 200) {
				let data = new Uint8Array(request.response);
				cv.FS_createDataFile('/', path, data, true, false, false);
				resolve();
			  } else {
				console.log('Failed to load ' + url + ' status: ' + request.status);
			  }
			}
		  };
		});
	  }
	  
	  //-------------------------------------------------------------------------------------
	  // load APIKEY file
	  //-------------------------------------------------------------------------------------
	  async loadApiKey(apikey, path) {
	    return new Promise(function(resolve, reject) {
		  console.log("loading API keys");
	      var user = "???";
	      var xhr = new XMLHttpRequest();
	      
	      xhr.open("GET", path);
	      xhr.responseType = "json";
	      xhr.send();
	      
	      xhr.onload = function() 
	      {
	        //var users = JSON.parse(xhr.responseText); // older browsers
	  	    var users = xhr.response;
	        //console.log(users);
		    
		    Object.keys(users).forEach(function(key){
		      var item = users[key]
		  
		  	for (var i=0; i < item.length; i++) {
		  	  if (item[i].apikey == apikey) {
		  	    user = item[i].name;
		  		break;
		  	  }
		  	}
		    });
		    
		    console.log("user_loaded=" + user);
		    resolve(user);		
		  }
	    });
	  }

  
	  // DOCS (Digital Ocean Cloud Server)
	  async loadApiKeyDOCS(apikey, license) {
	    return new Promise(function(resolve, reject) {
		  console.log("checking apikey / license");
	      var user = "???";

	      if (license == '' || license == null) {
	  	    alert('LICENÇA inválida!');
	  	    return
	      }
		  
	      //console.log(license)
		  var server = "http://206.189.196.226";
	      var url2call = (server+'/license/'+license+'/');
	      
	      fetch(url2call)
	      .then(response => response.json())
	      .then(data => {
	  	  //console.log(data)
	  	  
	  	    if (data !== null) {
	  	      console.log("apikey:"+data.apikey);
	  	      console.log("customer:"+data.name);
	  	      console.log("product:"+data.description);
		    
	  	      apikey = data.apikey;
	  	      tag = data.tag;
	  	      endpoint = data.lnk_endpoint;
		  	
		  	  user = data.name;
	  	    }
	  	    else {
	  	      //alert('LICENÇA inválida!');
		  	  user = "XXX";
	  	    }
	      })
	      .catch(error => console.error(error))
		  
		  console.log("getLicense:"+user);
		  
		  resolve(user);
	    });
	  }
  
  
	  //-------------------------------------------------------------------------------------
	  // Initialise the demo
	  //-------------------------------------------------------------------------------------
	  async init(person) {
	  	var p = person || {};
		console.log(p);
	  
		let gender = p.gender || "M";
		let age = p.age || 50;
		let weight = p.weight || 75;
		let height = p.height || 170;
		let position = p.position || "UP";

	  	//let userid = await this.loadApiKey(this.apikey, APIKEY_URI);
	  	//let userid = await this.loadApiKeyDOCS(this.apikey, this.license);
		let userid = "BIOZ4LIFE EVALUATION MODE"
		if (userid == "???") {
		  alert("Parâmetro '?apikey=XXXXXXXX' ou '?license=XXXXXXXX' inválido(s)!");
		  throw new Error("invalid user!");
		}
		else {		  
			this.webcamVideoElement = document.getElementById(this.webcamId);
			
			try {
			  this.userid = userid;
			  await this.startStreaming();
			  this.webcamVideoElement.width = this.webcamVideoElement.videoWidth;
			  this.webcamVideoElement.height = this.webcamVideoElement.videoHeight;
			  this.frameRGB = new cv.Mat(this.webcamVideoElement.height, this.webcamVideoElement.width, cv.CV_8UC4);
			  this.outputRGB = new cv.Mat(this.webcamVideoElement.height, this.webcamVideoElement.width, cv.CV_8UC4);
			  this.lastFrameGray = new cv.Mat(this.webcamVideoElement.height, this.webcamVideoElement.width, cv.CV_8UC1);
			  this.frameGray = new cv.Mat(this.webcamVideoElement.height, this.webcamVideoElement.width, cv.CV_8UC1);
			  this.overlayMask = new cv.Mat(this.webcamVideoElement.height, this.webcamVideoElement.width, cv.CV_8UC1);
			  this.cap = new cv.VideoCapture(this.webcamVideoElement);
			  
			  // Set variables
			  this.signal = []; // 120 x 3 raw rgb values
			  this.timestamps = []; // 120 x 1 timestamps
			  this.rescan = []; // 120 x 1 rescan bool
			  this.face = new cv.Rect();  // Position of the face
			  this.elapsedTime = 0;
			  this.startedTime = Date.now();
			  
			  this.gender = gender;
			  this.age = age;
			  this.weight = weight;
			  this.height = height;
			  this.position = position;
	   
			  // Median values
			  this.medBPM = [];
			  this.medRPM = [];
			  this.medSPO2 = [];
			  this.medSYS = [];
			  this.medDIA = [];
			  this.BPM2RR = [];
			  this.medGLU = [];
			  
			  // Last values
			  this.lastBPM = 0;
			  this.lastRPM = 0;
			  this.lastSPO2 = 0;
			  this.lastSYS = 0;
			  this.lastDIA = 0;
			  
			  // Summary of statistical analysis
			  this.summary = "";
			  
			  // Load face detector
			  this.classifier = new cv.CascadeClassifier();
			  let faceCascadeFile = HAARCASCADE_URI	// "haarcascade_frontalface_alt.xml";
			  if (!this.classifier.load(faceCascadeFile)) {
				await this.createFileFromUrl(faceCascadeFile, this.classifierPath);
				this.classifier.load(faceCascadeFile)
			  }
			  
			  this.scanTimer = setInterval(this.processFrame.bind(this),
				MSEC_PER_SEC/this.targetFps);
			  this.rppgTimer = setInterval(this.rppg.bind(this), this.rppgInterval);
			} catch (e) {
			  console.log(e);
			}			
		}		
	}
	  
	  //-------------------------------------------------------------------------------------
	  // Add one frame to raw signal
	  //-------------------------------------------------------------------------------------
	  processFrame() {
		try {
		  if (!this.frameGray.empty()) {
			this.frameGray.copyTo(this.lastFrameGray); // Save last frame
		  }
		  this.cap.read(this.frameRGB); // Save current frame
		  let time = Date.now()
		  let rescanFlag = false;
		  cv.cvtColor(this.frameRGB, this.frameGray, cv.COLOR_RGBA2GRAY);

		  // face ROI
/*
		  cv.rectangle(this.frameRGB, new cv.Point(VW8*2, VH8*1),
			new cv.Point(VW8*6, VH8*6),
			[255, 128, 0, 255], 1);	// orange
*/		  
  		  this.elapsedTime = (time - this.startedTime) / RESCAN_INTERVAL;
		  
		  // Need to find the face
		  if (!this.faceValid) {
			this.lastScanTime = time;
			this.detectFace(this.frameGray);
		  }
		  
		  // Scheduled face rescan
		  else if (time - this.lastScanTime >= RESCAN_INTERVAL) {
			this.lastScanTime = time;
			this.detectFace(this.frameGray);
			rescanFlag = true;
		  }
		  
		  // Track face
		  else {
			// Disable for now,
			//this.trackFace(this.lastFrameGray, this.frameGray);
		  }
		  
		  
		  // output with overlay
		  this.frameRGB.copyTo(this.outputRGB);
		  
		  // Text for results

		  //----------------------------------
		  // Draw UserID
		  //----------------------------------
		  //console.log("userID: " + this.userid);

		  cv.rectangle(this.frameRGB, new cv.Point(5, 55),
			new cv.Point(255, 105),
			[255, 128, 0, 255], -1);	// orange

		  cv.putText(this.frameRGB, this.userid,
		    new cv.Point(15, 85), cv.FONT_HERSHEY_PLAIN, 1.0, [0, 0, 0, 255], 2);

		  //----------------------------------
		  // Draw elapsedTime
		  //----------------------------------
		  //console.log("elapsedTime: " + this.elapsedTime);
/*
		  cv.rectangle(this.frameRGB, new cv.Point(560, 5),
			new cv.Point(635, 55),
			[0, 0, 255, 255], -1);	// blue

		  cv.putText(this.frameRGB, this.elapsedTime.toFixed(0).toString() + 's',
		    new cv.Point(575, 35), cv.FONT_HERSHEY_PLAIN, 1.0, [255, 255, 0, 255], 1);	// yellow
*/
		  //----------------------------------
		  // Draw progressBar
		  //----------------------------------
		  //console.log("PBAR");
		  var pBar = Math.ceil((this.elapsedTime * 100) / this.durationTime);	// max 30s = 100%
		  if (pBar > 100) { 
			pBar = 100; 
			this.btnStop.click();
			return;			
		  } // STOP !!!
		  
		  if (pBar % 2) {
			cv.circle(this.frameRGB, new cv.Point(35, 35), 10, [255, 0, 0, 255], -1);
		  }
			
		  if (pBar > 3) {
		    var w = this.webcamVideoElement.width;
		    var xBar = Math.ceil((this.elapsedTime * (w-25)) / this.durationTime);
		    cv.rectangle(this.frameRGB, new cv.Point(5, 5),
			  new cv.Point(15+xBar, 55),
			  [57, 163, 212, 255], -1);	// blueZ

			cv.putText(this.frameRGB, pBar.toFixed(0).toString() + '%',
			new cv.Point(xBar-25, 35), cv.FONT_HERSHEY_PLAIN, 1.0, [255, 255, 255, 255], 1);	// white
		  }
		  
		  //----------------------------------
		  // display results (BPM)
		  //----------------------------------
		  //console.log("BPM");
		  cv.circle(this.frameRGB, new cv.Point(VW8*1, VH8*7),
			50, [57, 163, 212, 255], -1);

		  cv.putText(this.frameRGB, 'BPM',
		    new cv.Point(VW8*1-15, VH8*7-25), cv.FONT_HERSHEY_PLAIN, 0.85, [255, 255, 255, 255], 1);	// blue
		  
		  cv.putText(this.frameRGB, this.lastBPM.toString() + 'bpm',
		    new cv.Point(VW8*1-30, VH8*7+15), cv.FONT_HERSHEY_PLAIN, 1.30, [255, 255, 255, 255], 1);	// blue
		
		  //----------------------------------
		  // display results (RPM)
		  //----------------------------------
		  //console.log("RPM");
		  cv.circle(this.frameRGB, new cv.Point(VW8*3, VH8*7),
			50, [57, 163, 212, 255], -1);
		
		  cv.putText(this.frameRGB, 'RPM',
		    new cv.Point(VW8*3-15, VH8*7-25), cv.FONT_HERSHEY_PLAIN, 0.85, [255, 255, 255, 255], 1);	// blue

		  cv.putText(this.frameRGB, this.lastRPM.toString() + 'rpm',
		    new cv.Point(VW8*3-30, VH8*7+15), cv.FONT_HERSHEY_PLAIN, 1.30, [255, 255, 255, 255], 1);	// blue
		  
		  //----------------------------------
		  // display results (SPO2)
		  //----------------------------------
		  //console.log("SPO2");
		  cv.circle(this.frameRGB, new cv.Point(VW8*5, VH8*7),
			50, [57, 163, 212, 255], -1);
		
		  cv.putText(this.frameRGB, 'SpO2',
		    new cv.Point(VW8*5-15, VH8*7-25), cv.FONT_HERSHEY_PLAIN, 0.85, [255, 255, 255, 255], 1);	// blue

		  cv.putText(this.frameRGB, this.lastSPO2.toString() + '%',
		    new cv.Point(VW8*5-20, VH8*7+15), cv.FONT_HERSHEY_PLAIN, 1.30, [255, 255, 255, 255], 1);	// blue
		  
		  //----------------------------------
		  // display results (BP SYS/DIA)
		  //----------------------------------
		  //console.log("BP");
		  cv.circle(this.frameRGB, new cv.Point(VW8*7, VH8*7),
			50, [57, 163, 212, 255], -1);
		
		  cv.putText(this.frameRGB, 'P.A.',
		    new cv.Point(VW8*7-15, VH8*7-25), cv.FONT_HERSHEY_PLAIN, 0.85, [255, 255, 255, 255], 1);	// blue

		  cv.putText(this.frameRGB, this.lastSYS.toString() + '/' + this.lastDIA.toString(),
		    new cv.Point(VW8*7-40, VH8*7+15), cv.FONT_HERSHEY_PLAIN, 1.30, [255, 255, 255, 255], 1);	// blue
		  
		  //----------------------------------
		  // text inside display (BPM)
		  //----------------------------------
		  //console.log("Vitals?:"+this.showVitals);
/*
		  if (this.showResults == true) {
		    //cv.putText(this.frameRGB, medRPM.toString() + 'rpm [' + medSPO2.toString() + '%]',
		    //  new cv.Point(this.face.x, this.face.y + this.face.height + 30),
		    //  cv.FONT_HERSHEY_PLAIN, 1.5, [255, 128, 0, 255], 2);
		    
		    //cv.putText(this.frameRGB, medBPM.toString() + 'bpm [' + medSYS.toString()+ '/' + medDIA.toString() +']',
		    //  new cv.Point(this.face.x, this.face.y + this.face.height + 80),
		    //  cv.FONT_HERSHEY_PLAIN, 1.5, [255, 128, 0, 255], 2);
		    
		    cv.putText(this.frameRGB, medBPM.toString() + 'bpm',
		      new cv.Point(15, VIDEO_HEIGHT / 2),
		      cv.FONT_HERSHEY_PLAIN, 1.5, [255, 128, 0, 255], 2);
		    
		    cv.putText(this.frameRGB, medRPM.toString() + 'rpm',
		      new cv.Point(15, (VIDEO_HEIGHT / 2) + 50),
		      cv.FONT_HERSHEY_PLAIN, 1.5, [255, 128, 0, 255], 2);
		    
		    cv.putText(this.frameRGB, medSPO2.toString() + '%',
		      new cv.Point(15, (VIDEO_HEIGHT / 2) + 100),
		      cv.FONT_HERSHEY_PLAIN, 1.5, [255, 128, 0, 255], 2);
		    
		    cv.putText(this.frameRGB, medSYS.toString()+ '/' + medDIA.toString(),
		      new cv.Point(15, (VIDEO_HEIGHT / 2) + 150),
		      cv.FONT_HERSHEY_PLAIN, 1.5, [255, 128, 0, 255], 2);
		  }
		  
	      cv.imshow(this.canvasId, this.frameRGB);
*/	
		  //console.log("this.faceValid:" + this.faceValid.toString());

		  // Update the signal
		  if (this.faceValid) {
			// Shift signal buffer
			while (this.signal.length > this.targetFps * this.windowSize) {
			  this.signal.shift();
			  this.timestamps.shift();
			  this.rescan.shift();
			}
			
			// Get mask
			let mask = new cv.Mat();
			mask = this.makeMask(this.frameRGB, this.frameGray, this.face);
			
			// New values
			let means = cv.mean(this.frameRGB, mask);
			mask.delete();
			
			// Add new values to raw signal buffer
			this.signal.push(means.slice(0, 3));
			this.timestamps.push(time);
			this.rescan.push(rescanFlag);
		  }
		  
		  // Draw face
		  cv.rectangle(this.frameRGB, new cv.Point(this.face.x, this.face.y),
			new cv.Point(this.face.x+this.face.width, this.face.y+this.face.height),
			[0, 255, 0, 255], 1);	// green
		  
		  //--- CCM v1.1 ---
		  // Draw faceROI
		  //let wROI = Math.ceil(this.face.width / 8);;
		  //let hROI = Math.ceil(this.face.height / 6);
		  //let xROI = this.face.x + wROI;
		  //let yROI = this.face.y + hROI;

		  //cv.rectangle(this.frameRGB, new cv.Point(xROI, yROI),
		  //  new cv.Point(xROI+6*wROI, yROI+4*hROI),
		  //  [255, 0, 0, 255], 1);	// red

		  //let ksize = new cv.Size(5, 5);
		  //cv.GaussianBlur(???, this.frameRGB, ksize, 0, 0, cv.BORDER_DEFAULT);
		  //--- CCM v1.1 ---
		  
		  // Apply overlayMask
		  this.frameRGB.setTo([255, 0, 0, 255], this.overlayMask);
		  
		  var alpha = 0.5;
		  cv.addWeighted(this.frameRGB, alpha, this.outputRGB, 1 - alpha, 0, this.outputRGB)
		  
		  cv.imshow(this.canvasId, this.outputRGB);
		} catch (e) {
		  console.log("Error capturing frame:");
		  console.log(e);
		}
	  }
	  
	  //-------------------------------------------------------------------------------------
	  // Run face classifier
	  //-------------------------------------------------------------------------------------
	  detectFace(gray) {
		let faces = new cv.RectVector();
		this.classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
		if (faces.size() > 0) {
		  this.face = faces.get(0);
		  //console.log(this.face);
		/*
		  //--- CCM v1.1 ---
		  let wROI = Math.ceil(this.face.width / 8);;
		  let hROI = Math.ceil(this.face.height / 6);
		  let xROI = this.face.x + wROI;
		  let yROI = this.face.y + hROI;
		  let faceROI = new cv.Rect(xROI, yROI, 6*wROI, 4*hROI);
		  this.face = faceROI;
		  //console.log(this.face);
		*/
		  //--- CCM v1.1 ---
		  this.faceValid = true;
		} else {
		  console.log("No faces");
  		  //this.elapsedTime = 0;
		  this.startedTime = Date.now();
		  this.invalidateFace();
		}
		faces.delete();
	  }
	  
	  //-------------------------------------------------------------------------------------
	  // Make ROI mask from face
	  //-------------------------------------------------------------------------------------
	  makeMask(frameRGB, frameGray, face) {
		let result = cv.Mat.zeros(frameGray.rows, frameGray.cols, cv.CV_8UC1);
		let white = new cv.Scalar(255, 255, 255, 255);
		
		let pt1 = new cv.Point(Math.round(face.x + 0.3 * face.width),
		  Math.round(face.y + 0.1 * face.height));
		let pt2 = new cv.Point(Math.round(face.x + 0.7 * face.width),
		  Math.round(face.y + 0.25 * face.height));
		
		let pt3 = new cv.Point(Math.round(face.x + 0.15 * face.width),
		  Math.round(face.y + 0.5 * face.height));
		let pt4 = new cv.Point(Math.round(face.x + 0.35 * face.width),
		  Math.round(face.y + 0.7 * face.height));
		
		let pt5 = new cv.Point(Math.round(face.x + 0.65 * face.width),
		  Math.round(face.y + 0.5 * face.height));
		let pt6 = new cv.Point(Math.round(face.x + 0.85 * face.width),
		  Math.round(face.y + 0.7 * face.height));
		
		cv.rectangle(result, pt1, pt2, white, -1);
		cv.rectangle(result, pt3, pt4, white, -1);
		cv.rectangle(result, pt5, pt6, white, -1);
		
		//cv.rectangle(frameRGB, pt1, pt2, [0, 0, 255, 255], 1);	// blue 
		//cv.rectangle(frameRGB, pt3, pt4, [0, 0, 255, 255], 1);	// blue 
		//cv.rectangle(frameRGB, pt5, pt6, [0, 0, 255, 255], 1);	// blue 
		
		return result;
	  }
	  
	  //-------------------------------------------------------------------------------------
	  // Invalidate the face
	  //-------------------------------------------------------------------------------------
	  invalidateFace() {
		this.signal = [];
		this.timestamps = [];
		this.rescan = [];
		this.overlayMask.setTo([0, 0, 0, 0]);
		this.face = new cv.Rect();
		this.faceValid = false;
		this.corners = [];

		this.medBPM = [];
		this.medRPM = [];
		this.medSPO2 = [];
		this.medSYS = [];
		this.medDIA = [];
	    this.BPM2RR = [];
		this.medGLU = [];
	  }
	  
	  //-------------------------------------------------------------------------------------
	  // Track the face
	  //-------------------------------------------------------------------------------------
	  trackFace(lastFrameGray, frameGray) {
		// If not available, detect some good corners to track within face
		let trackingMask = cv.Mat.zeros(frameGray.rows, frameGray.cols, cv.CV_8UC1);
		let squarePointData = new Uint8Array([
		  this.face.x + 0.22 * this.face.width, this.face.y + 0.21 * this.face.height,
		  this.face.x + 0.78 * this.face.width, this.face.y + 0.21 * this.face.height,
		  this.face.x + 0.70 * this.face.width, this.face.y + 0.65 * this.face.height,
		  this.face.x + 0.30 * this.face.width, this.face.y + 0.65 * this.face.height]);
		let squarePoints = cv.matFromArray(4, 1, cv.CV_32SC2, squarePointData);
		let pts = new cv.MatVector();
		let corners = new cv.Mat();
		pts.push_back(squarePoints);
		cv.fillPoly(trackingMask, pts, [255, 255, 255, 255]);
		cv.goodFeaturesToTrack(lastFrameGray, corners, MAX_CORNERS,
		  QUALITY_LEVEL, MIN_DISTANCE, trackingMask, 3);
		trackingMask.delete(); squarePoints.delete(); pts.delete();

		// Calculate optical flow
		let corners_1 = new cv.Mat();
		let st = new cv.Mat();
		let err = new cv.Mat();
		let winSize = new cv.Size(15, 15);
		let maxLevel = 2;
		let criteria = new cv.TermCriteria(
		  cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 0.03);
		cv.calcOpticalFlowPyrLK(lastFrameGray, frameGray, corners, corners_1,
		  st, err, winSize, maxLevel, criteria);

		// Backtrack once
		let corners_0 = new cv.Mat();
		cv.calcOpticalFlowPyrLK(frameGray, lastFrameGray, corners_1, corners_0,
		  st, err, winSize, maxLevel, criteria);
		
		// TODO exclude unmatched corners

		// Clean up
		st.delete(); err.delete();

		if (corners_1.rows >= MIN_CORNERS) {
		  // Estimate affine transform
		  const [s, tx, ty] = this.estimateAffineTransform(corners_0, corners_1);
	  
	  // Apply affine transform
		  this.face = new cv.Rect(
			this.face.x * s + tx, this.face.y * s + ty,
			this.face.width * s, this.face.height * s);
		} else {
		  this.invalidateFace();
		}

		corners.delete(); corners_1.delete(); corners_0.delete();
	  }
	  
	  //-------------------------------------------------------------------------------------
	  // For some reason this is not available in opencv.js, so implemented it
	  //-------------------------------------------------------------------------------------
	  estimateAffineTransform(corners_0, corners_1) {
		// Construct X and Y matrix
		let t_x = cv.matFromArray(corners_0.rows*2, 1, cv.CV_32FC1,
		  Array.from(corners_0.data32F));
		let y = cv.matFromArray(corners_1.rows*2, 1, cv.CV_32FC1,
		  Array.from(corners_1.data32F));
		let x = new cv.Mat(corners_0.rows*2, 3, cv.CV_32FC1);
		let t_10 = new cv.Mat(); let t_01 = new cv.Mat();
		cv.repeat(cv.matFromArray(2, 1, cv.CV_32FC1, [1, 0]), corners_0.rows, 1, t_10);
		cv.repeat(cv.matFromArray(2, 1, cv.CV_32FC1, [0, 1]), corners_0.rows, 1, t_01);
		t_x.copyTo(x.col(0));
		t_10.copyTo(x.col(1));
		t_01.copyTo(x.col(2));

		// Solve
		let res = cv.Mat.zeros(3, 1, cv.CV_32FC1);
		cv.solve(x, y, res, cv.DECOMP_SVD);

		// Clean up
		t_01.delete(); t_10.delete(); x.delete(); t_x.delete(); y.delete();

		return [res.data32F[0], res.data32F[1], res.data32F[2]];
	  }

	  //-------------------------------------------------------------------------------------
	  // Compute rppg signal and estimate HR
	  //-------------------------------------------------------------------------------------
	  rppg() {
		// Update fps
		let fps = this.getFps(this.timestamps);
		//console.log('fps:' + fps.toString());
		
		// If valid signal is large enough: estimate
		if (this.signal.length >= this.targetFps * this.windowSize) {
		  // Work with cv.Mat from here
		  let signal = cv.matFromArray(this.signal.length, 1, cv.CV_32FC3,
			[].concat.apply([], this.signal));

		  // Filtering
		  this.denoise(signal, this.rescan);
		  this.standardize(signal);
		  this.detrend(signal, fps);
		  this.movingAverage(signal, 3, Math.max(Math.floor(fps/6), 2));

		  //-----------------------------------------------
		  // RGB channels
		  /*
		  let rgbPlanes = new cv.MatVector();
		  cv.split(signal, rgbPlanes);
		  let rgb = {
			R: rgbPlanes.get(0);
			G: rgbPlanes.get(1);
			B: rgbPlanes.get(2);
		  };
		  use => rgb.G;
		  */
		  
		  let rgb = new cv.MatVector();
		  cv.split(signal, rgb);

		  let signalR = rgb.get(0);
		  let signalG = rgb.get(1);
		  let signalB = rgb.get(2);
	
		  // R (red)
		  let vmeanR = new cv.Mat();
		  let vstdR = new cv.Mat();
		  cv.meanStdDev(signalR, vmeanR, vstdR);
		  let meanR = vmeanR.data64F[0];
		  let stdR = vstdR.data64F[0];
		  let varR = Math.sqrt(stdR);
		  
		  // B (blue)
		  let vmeanB = new cv.Mat();
		  let vstdB = new cv.Mat();
		  cv.meanStdDev(signalB, vmeanB, vstdB);
		  let meanB = vmeanB.data64F[0];
		  let stdB = vstdB.data64F[0];
		  let varB = Math.sqrt(stdB);
		  
		  //calculating ratio between the two means and two variances
		  let R = (varR / meanR) / (varB / meanB);
		  
		  //estimating SPO2
		  let o2 = Math.ceil(100 - 5 * (R));
  		  o2 = (o2 < 0) ? 100 : o2;
  		  let spo2 = (o2 > 100) ? 100 : o2;
		  this.lastSPO2 = spo2;
		  //console.log("spO2:", spo2);
		  
		  rgb.delete();
		  signalR.delete();
		  signalG.delete();
		  signalB.delete();
		  //-----------------------------------------------

		  // HR estimation based on G (green)
		  signal = this.selectGreen(signal);
		  //signal = this.selectColor(signal, 1);
		  
		  // Draw time domain signal
		  this.overlayMask.setTo([0, 0, 0, 0]);
		  //this.drawTime(signal);
		  
		  this.timeToFrequency(signal, true);

		  // FFT power2
		  let pwr2 = Math.pow(2, Math.ceil(Math.log(signal.rows) / LOG2));		  
		/*
		  // Calculate band spectrum limits
		  let low = Math.floor(signal.rows * LOW_BPM / SEC_PER_MIN / fps);
		  let high = Math.ceil(signal.rows * HIGH_BPM / SEC_PER_MIN / fps);
		  console.log("*** [rows] low, high: [" + signal.rows + "] "+ low + "," + high);
		*/
		
		  if (!signal.empty()) {
			// Calculate band spectrum limits for RPM & BPM
			let bpm_idx_from = Math.ceil(BPM_MIN_HZ * signal.rows / fps);
			let bpm_idx_to = Math.ceil(BPM_MAX_HZ * signal.rows / fps);
			//console.log("*** BPM [rows] idx from:to [" + signal.rows + "] "+ bpm_idx_from + ":" + bpm_idx_to);

			let rpm_idx_from = Math.ceil(RPM_MIN_HZ * signal.rows / fps);
			let rpm_idx_to = Math.ceil(RPM_MAX_HZ * signal.rows / fps);
			//console.log("*** RPM [rows] idx from:to [" + signal.rows + "] "+ rpm_idx_from + ":" + rpm_idx_to);
			
		/*
			// Mask for infeasible frequencies
			let bandMask = cv.matFromArray(signal.rows, 1, cv.CV_8U,
			  new Array(signal.rows).fill(0).fill(1, low, high+1));
			this.drawFrequency(signal, low, high, bandMask);

			// Identify feasible frequency with maximum magnitude
			let result = cv.minMaxLoc(signal, bandMask);
			bandMask.delete();

			// Infer BPM
			let bpm = result.maxLoc.y * fps / signal.rows * SEC_PER_MIN;
			console.log(result.maxLoc.y+"|"+fps+"|"+signal.rows+"|"+SEC_PER_MIN);
			console.log("bpm:" + bpm);
		*/
			
			let tmp = 0;
			let idx = 0;
			let freqHz = 0;
			
			// Infer BPM
			tmp = -1;
			idx = -1;
			for (var i = bpm_idx_from; i < bpm_idx_to; i++) {
				let value = signal.data[i];
				if (value > tmp) {
					tmp = value;
					idx = i;
				}
			}
			freqHz = idx * fps / signal.rows;
			let bpm = Math.ceil(freqHz * SEC_PER_MIN);
			this.lastBPM = bpm;
			//console.log("bpm[" + idx + "]=" + bpm);
			
			// Infer RPM
			tmp = -1;
			idx = -1;
			for (var i = rpm_idx_from; i < rpm_idx_to; i++) {
				let value = signal.data[i];
				if (value > tmp) {
					tmp = value;
					idx = i;
				}
			}
			freqHz = idx * fps / signal.rows;
			let rpm = Math.ceil(freqHz * SEC_PER_MIN);
			this.lastRPM = rpm;
			//console.log("rpm[" + idx + "]=" + rpm);
			
			// Draw BPM
			this.drawBPM(bpm, Math.abs(rpm), spo2);
		  }
		  signal.delete();
		} else {
		  console.log("signal too small");
  		  //this.elapsedTime = 0;
		  this.startedTime = Date.now();
		}
	  }

	  //-------------------------------------------------------------------------------------
	  // Calculate fps from timestamps
	  //-------------------------------------------------------------------------------------
	  getFps(timestamps, timeBase=1000) {
		if (Array.isArray(timestamps) && timestamps.length) {
		  if (timestamps.length == 1) {
			return DEFAULT_FPS;
		  } else {
			let diff = timestamps[timestamps.length-1] - timestamps[0];
			return timestamps.length/diff*timeBase;
		  }
		} else {
		  return DEFAULT_FPS;
		}
	  }

	  //-------------------------------------------------------------------------------------
	  // Remove noise from face rescanning
	  //-------------------------------------------------------------------------------------
	  /*
		var b = new Array(8).fill(0).fill(1,2,6);
 		console.log(b); //[0,0,1,1,1,1,0,0]
	  */
	  
	  denoise(signal, rescan) {
		let diff = new cv.Mat();
		cv.subtract(signal.rowRange(1, signal.rows), signal.rowRange(0, signal.rows-1), diff);
		for (var i = 1; i < signal.rows; i++) {
		  if (rescan[i] == true) {
			let adjV = new cv.MatVector();
			let adjR = cv.matFromArray(signal.rows, 1, cv.CV_32FC1,
			  new Array(signal.rows).fill(0).fill(diff.data32F[(i-1)*3], i, signal.rows));
			let adjG = cv.matFromArray(signal.rows, 1, cv.CV_32FC1,
			  new Array(signal.rows).fill(0).fill(diff.data32F[(i-1)*3+1], i, signal.rows));
			let adjB = cv.matFromArray(signal.rows, 1, cv.CV_32FC1,
			  new Array(signal.rows).fill(0).fill(diff.data32F[(i-1)*3+2], i, signal.rows));
			adjV.push_back(adjR); adjV.push_back(adjG); adjV.push_back(adjB);
			let adj = new cv.Mat();
			cv.merge(adjV, adj);
			cv.subtract(signal, adj, signal);
			adjV.delete(); adjR.delete(); adjG.delete(); adjB.delete();
			adj.delete();
		  }
		}
		diff.delete();
	  }

	  //-------------------------------------------------------------------------------------
	  // Standardize signal
	  //-------------------------------------------------------------------------------------
	  standardize(signal) {
		let mean = new cv.Mat();
		let stdDev = new cv.Mat();
		let t1 = new cv.Mat();
		cv.meanStdDev(signal, mean, stdDev, t1);
		let means_c3 = cv.matFromArray(1, 1, cv.CV_32FC3, [mean.data64F[0], mean.data64F[1], mean.data64F[2]]);
		let stdDev_c3 = cv.matFromArray(1, 1, cv.CV_32FC3, [stdDev.data64F[0], stdDev.data64F[1], stdDev.data64F[2]]);
		let means = new cv.Mat(signal.rows, 1, cv.CV_32FC3);
		let stdDevs = new cv.Mat(signal.rows, 1, cv.CV_32FC3);
		cv.repeat(means_c3, signal.rows, 1, means);
		cv.repeat(stdDev_c3, signal.rows, 1, stdDevs);
		cv.subtract(signal, means, signal, t1, -1);
		cv.divide(signal, stdDevs, signal, 1, -1);
		mean.delete(); stdDev.delete(); t1.delete();
		means_c3.delete(); stdDev_c3.delete();
		means.delete(); stdDevs.delete();
	  }

	  //-------------------------------------------------------------------------------------
	  // Remove trend in signal
	  //-------------------------------------------------------------------------------------
	  detrend(signal, lambda) {
		let h = cv.Mat.zeros(signal.rows-2, signal.rows, cv.CV_32FC1);
		let i = cv.Mat.eye(signal.rows, signal.rows, cv.CV_32FC1);
		let t1 = cv.Mat.ones(signal.rows-2, 1, cv.CV_32FC1)
		let t2 = cv.matFromArray(signal.rows-2, 1, cv.CV_32FC1,
		  new Array(signal.rows-2).fill(-2));
		let t3 = new cv.Mat();
		t1.copyTo(h.diag(0)); t2.copyTo(h.diag(1)); t1.copyTo(h.diag(2));
		cv.gemm(h, h, lambda*lambda, t3, 0, h, cv.GEMM_1_T);
		cv.add(i, h, h, t3, -1);
		cv.invert(h, h, cv.DECOMP_LU);
		cv.subtract(i, h, h, t3, -1);
		let s = new cv.MatVector();
		cv.split(signal, s);
		cv.gemm(h, s.get(0), 1, t3, 0, s.get(0), 0);
		cv.gemm(h, s.get(1), 1, t3, 0, s.get(1), 0);
		cv.gemm(h, s.get(2), 1, t3, 0, s.get(2), 0);
		cv.merge(s, signal);
		h.delete(); i.delete();
		t1.delete(); t2.delete(); t3.delete();
		s.delete();
	  }

	  //-------------------------------------------------------------------------------------
	  // Moving average on signal
	  //-------------------------------------------------------------------------------------
	  movingAverage(signal, n, kernelSize) {
		for (var i = 0; i < n; i++) {
		  cv.blur(signal, signal, {height: kernelSize, width: 1});
		}
	  }

	  //-------------------------------------------------------------------------------------
	  // TODO solve this more elegantly
	  //-------------------------------------------------------------------------------------
	  selectGreen(signal) {
		let rgb = new cv.MatVector();
		cv.split(signal, rgb);

		// TODO possible memory leak, delete rgb?
		let result = rgb.get(1);
		rgb.delete();
		return result;
	  }

	  selectColor(signal, channel) {
		let rgb = new cv.MatVector();
		cv.split(signal, rgb);

		// TODO possible memory leak, delete rgb?
		let result = rgb.get(channel);
		rgb.delete();
		return result;
	  }

	  //-------------------------------------------------------------------------------------
	  // Convert from time to frequency domain
	  //-------------------------------------------------------------------------------------
	  timeToFrequency(signal, magnitude) {
		// Prepare planes
		let planes = new cv.MatVector();
		planes.push_back(signal);
		planes.push_back(new cv.Mat.zeros(signal.rows, 1, cv.CV_32F))
		let powerSpectrum = new cv.Mat();
		cv.merge(planes, signal);

		// Fourier transform
		cv.dft(signal, signal, cv.DFT_COMPLEX_OUTPUT);
		if (magnitude) {
		  cv.split(signal, planes);	// planes[0] = Re(DFT(I), planes[1] = Im(DFT(I))
		  cv.magnitude(planes.get(0), planes.get(1), signal); // signal = magnitude
		}
	  }

	  //-------------------------------------------------------------------------------------
	  // Draw time domain signal to overlayMask
	  //-------------------------------------------------------------------------------------
	  drawTime(signal) {
		// Display size
		let displayHeight = this.face.height/2.0;
		let displayWidth = this.face.width*0.8;

		// Signal
		let result = cv.minMaxLoc(signal);
		let heightMult = displayHeight/(result.maxVal-result.minVal);
		let widthMult = displayWidth/(signal.rows-1);
		let drawAreaTlX = this.face.x + this.face.width + 10;
		let drawAreaTlY =  this.face.y
		
		let start = new cv.Point(drawAreaTlX,
		  drawAreaTlY+(result.maxVal-signal.data32F[0])*heightMult);
		
		//console.log("signal.rows", signal.rows);
		for (var i = 1; i < signal.rows; i++) {
		  let end = new cv.Point(drawAreaTlX+i*widthMult,
			drawAreaTlY+(result.maxVal-signal.data32F[i])*heightMult);
			//console.log(signal.data32F[i]);
		  cv.line(this.overlayMask, start, end, [255, 255, 255, 255], 1, cv.LINE_4, 0);
		  start = end;
		  
		  //--- CCM v1.3 ---
		  //this.medGLU.push(signal.data32F[i]);
		}
	  }

	  //-------------------------------------------------------------------------------------
	  // Draw frequency domain signal to overlayMask
	  //-------------------------------------------------------------------------------------
	  drawFrequency(signal, low, high, bandMask) {
		// Display size
		let displayHeight = this.face.height/2.0;
		let displayWidth = this.face.width*0.8;

		// Signal
		let result = cv.minMaxLoc(signal, bandMask);
		let heightMult = displayHeight/(result.maxVal-result.minVal);
		let widthMult = displayWidth/(high-low);
		let drawAreaTlX = this.face.x + this.face.width + 10;
		let drawAreaTlY = this.face.y + this.face.height/2.0;
		
		let start = new cv.Point(drawAreaTlX,
		  drawAreaTlY+(result.maxVal-signal.data32F[low])*heightMult);
		
		for (var i = low + 1; i <= high; i++) {
		  let end = new cv.Point(drawAreaTlX+(i-low)*widthMult,
			drawAreaTlY+(result.maxVal-signal.data32F[i])*heightMult);
		  cv.line(this.overlayMask, start, end, [255, 0, 0, 255], 2, cv.LINE_4, 0);
		  start = end;
		}
	  }

	  //-------------------------------------------------------------------------------------
	  // Draw tracking corners
	  //-------------------------------------------------------------------------------------
	  drawCorners(corners) {
		for (var i = 0; i < corners.rows; i++) {
		  cv.circle(this.frameRGB, new cv.Point(
			corners.data32F[i*2], corners.data32F[i*2+1]),
			5, [0, 255, 0, 255], -1);
		  //circle(frameRGB, corners[i], r, WHITE, -1, 8, 0);
		  //line(frameRGB, Point(corners[i].x-5,corners[i].y), Point(corners[i].x+5,corners[i].y), GREEN, 1);
		  //line(frameRGB, Point(corners[i].x,corners[i].y-5), Point(corners[i].x,corners[i].y+5), GREEN, 1);
		}
	  }

	  //-------------------------------------------------------------------------------------
	  // Draw bpm string to overlayMask
	  //-------------------------------------------------------------------------------------
	  drawBPM(bpm, rpm, spo2) {
		// estimations for the blood pressure
		
		// SVA = -6.6 + (0.25 x ET) + (40.4 x BSA) - (0.51 x Age) - (0.62 x HR)
		// where SVA equals stroke volume in ml/beat, ET is ejection time in msec, 
		// BSA is body surface area in square meters, Age is the age of the subject, 
		// and HR is heart rate (beats per minute) . Cardiac output is determined by 
		// multiplying SVA times the heart rate HR. 
		
		// BSA (m2) = 0.0072 X weight ^0.425 X height ^0.725 
		// where weight is in kilograms and height is in centimeters.
		
		// The mean arterial pressure (MAP) can be calculated by the following:
		// (2/3) x (diastolic blood pressure) + (1/3) x (systolic blood pressure)
		// or
		// Diastolic + 1/3(Systolic-Diastolic)
		
		// SV = end-diastolic volume (EDV) − end-systolic volume (ESV)
		// EF = SV / EDV = (EDV - ESV) / EDV
		
		var Q = (this.gender == "M") ? 5 : 4.5;	//Liters (M/F)
		var ROB = 18.5;	// standard for BP 120/80
		
		//var ET = (this.position == "DOWN") ? (364.5 - (1.23 * bpm)) : (376 - (1.64 * bpm));
		var ET = (this.gender == "M") ? 392 - (1.539 * bpm) + (0.156 * this.age) : 370 - (1.494 * bpm) + (0.276 * this.age);
		
		//var BSA = 0.007184 * (Math.pow(this.weight, 0.425)) * (Math.pow(this.height, 0.725));
		var BSA = Math.sqrt(this.weight * this.height) / 60;
		
		var SV = (-6.6 + (0.25 * (ET - 35)) - (0.62 * bpm) + (40.4 * BSA) - (0.51 * this.age));	// ET => +/- 35ms
		
		var PP = SV / ((0.013 * this.weight) - (0.007 * this.age) - (0.004 * bpm) + 1.307);
		
		var MPP = Q * ROB;

		//var adjustSYS = (this.gender == "M") ? 0.962 : 0.847;	//M = (1 - 0.038); F = (1 - 0.153)
		//var adjustDIA = (this.gender == "M") ? 0.962 : 0.847;	//M = (1 - 0.038); F = (1 - 0.153)

		var adjustSYS = 0.847;
		var adjustDIA = 0.962;

		var valSYS = (MPP + (3 / 2 * PP)) * adjustSYS;
		var valDIA = (MPP - (PP / 3)) * adjustDIA;
		
		var SP = Math.ceil(valSYS);
		this.lastSYS = SP;

		var DP = Math.ceil(valDIA);
		this.lastDIA = DP;

		this.medBPM.push(bpm);
		this.medRPM.push(rpm);
		this.medSPO2.push(spo2);
		this.medSYS.push(SP);
		this.medDIA.push(DP);
		
		var bpm2RR = Math.ceil(60000 / bpm);
		this.BPM2RR.push(bpm2RR);
	  }

	  //-------------------------------------------------------------------------------------
	  // Clean up resources
	  //-------------------------------------------------------------------------------------
	  stop() {
		clearInterval(this.rppgTimer);
		clearInterval(this.scanTimer);

		// average every 3 values
		var avgBPM = [];
		var avgRPM = [];
		var avgSPO2 = [];
		var avgSYS = [];
		var avgDIA = [];
		var avgGLU = [];

		if (this.medBPM.length > 0) {
		  avgBPM = this.groupAverage(this.medBPM, 3);
		  avgRPM = this.groupAverage(this.medRPM, 3);
		  avgSPO2 = this.groupAverage(this.medSPO2, 3);
		  avgSYS = this.groupAverage(this.medSYS, 3);
		  avgDIA = this.groupAverage(this.medDIA, 3);
		  avgGLU = this.groupAverage(this.medGLU, 3);
		}

		// median
		var medBPM = 0;
		var medRPM = 0;
		var medSPO2 = 0;
		var medSYS = 0;
		var medDIA = 0;
		var medGLU = 0;
		
		if (this.medBPM.length > 0) {
		  medBPM = Math.floor(this.median2(avgBPM));
		  medRPM = Math.floor(this.median2(avgRPM));
		  medSPO2 = Math.floor(this.median2(avgSPO2));
		  medSYS = Math.floor(this.median2(avgSYS));
		  medDIA = Math.floor(this.median2(avgDIA));
		  medGLU = Math.floor(this.median2(avgGLU));
		}
		
		//*** debugging ***
		//console.log("arrBPM="+this.medBPM);
		//console.log("avgBPM="+avgBPM);
		//console.log("medBPM="+medBPM);
		//
		//console.log("arrRPM="+this.medRPM);
		//console.log("avgRPM="+avgRPM);
		//console.log("medRPM="+medRPM);
		//
		//console.log("arrSPO2="+this.medSPO2);
		//console.log("avgSPO2="+avgSPO2);
		//console.log("medSPO2="+medSPO2);
		//
		//console.log("arrSYS="+this.medSYS);
		//console.log("avgSYS="+avgSYS);
		//console.log("medSYS="+medSYS);
		//
		//console.log("arrDIA="+this.medDIA);
		//console.log("avgDIA="+avgDIA);
		//console.log("medDIA="+medDIA);
		//
		//console.log("arrGLU="+this.medGLU);
		//console.log("avgGLU="+avgGLU);
		//console.log("medGLU="+medGLU);
		

		// HRV statistics
	    var rmssd = 0;
	    var pnn50 = 0;
	    var sdnn = 0;
		var bodyMassIndex = 0;
		var stressRisk = 0;
		var cardiacWorkload = 0;
		var cardiacDiseaseRisk = 0;
		var heartAttackRisk = 0;
		var strokeRisk = 0;
		var wellnessScore = 0;
		
		if (this.medBPM.length > 0) {
	      rmssd = this.rmssd();
	      pnn50 = this.pnn50();
	      sdnn = this.sdnn();
		  
		  //console.log("rmssd=" + rmssd);
		  //console.log("pnn50=" + pnn50 + "%");
		  //console.log("sdnn=" + sdnn + "ms");
					
		  stressRisk = this.stressRisk(sdnn);
		  bodyMassIndex = this.bodyMassIndex();
		  cardiacWorkload = this.cardiacWorkload(medBPM, medSYS, medDIA);
		  
		  cardiacDiseaseRisk = this.cardiacDiseaseRisk(medBPM, medRPM, medSYS, medDIA, sdnn, medSPO2, bodyMassIndex);
		  heartAttackRisk = this.heartAttackRisk(cardiacDiseaseRisk);
		  strokeRisk = this.strokeRisk(cardiacDiseaseRisk);
		  
		  wellnessScore = this.wellnessScore(cardiacDiseaseRisk, heartAttackRisk, strokeRisk);
		}
		
		// camera
		if (this.webcam) {
		  this.webcamVideoElement.pause();
		  //this.webcamVideoElement.currentTime = 0;
		  this.webcamVideoElement.srcObject = null;
		  //this.webcamVideoElement.removeAttribute('src'); // empty source
		  //this.webcamVideoElement.load();
		}
		if (this.stream) {
		  this.stream.getVideoTracks()[0].stop();
		  
		  //this.stream.getVideoTracks().forEach(track => {
		  //	track.stop()
		  //	video.srcObject.removeTrack(track);
		  //});
		}
		
		this.invalidateFace();
		this.streaming = false;
		this.frameRGB.delete();
		this.lastFrameGray.delete();
		this.frameGray.delete();
		this.overlayMask.delete();
		
	    //--- CCM v1.1 ---
		let results = {
		  "BPM"  : medBPM, 
		  "RPM"  : medRPM, 
		  "SPO2" : medSPO2,
		  "SYS"  : medSYS,
		  "DIA"  : medDIA, 
		  "GLU"  : medGLU, 
		  "rmssd": rmssd,
		  "pnn50": pnn50,
		  "sdnn" : sdnn,
		  "stressRisk"			: stressRisk,
		  "bodyMassIndex"		: bodyMassIndex,
		  "cardiacWorkload"		: cardiacWorkload,
		  "cardiacDiseaseRisk"	: cardiacDiseaseRisk,
		  "heartAttackRisk"		: heartAttackRisk,
		  "strokeRisk"			: strokeRisk,
		  "wellnessScore"		: wellnessScore,
		  "summary"				: this.summary
		}
		
		//console.log(results);
		
		return results;
	  }

	  
	  //-------------------------------------------------------------------------------------
	  // round function
	  //-------------------------------------------------------------------------------------
	  roundTo(n, digits) {
	  	var negative = false;
	  	if (digits === undefined) {
	  		digits = 0;
	  	}
	  	if (n < 0) {
	  		negative = true;
	  		n = n * -1;
	  	}
	  	var multiplicator = Math.pow(10, digits);
	  	n = parseFloat((n * multiplicator).toFixed(11));
	  	n = (Math.round(n) / multiplicator).toFixed(digits);
	  	if (negative) {
	  		n = (n * -1).toFixed(digits);
	  	}
	  	return n;
	  }
	  
	  round2(value, decimals) {
		return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	  }

	  
	  //-------------------------------------------------------------------------------------
	  // average & mean & median functions
	  //-------------------------------------------------------------------------------------
	  median(values) {
	    if(values.length ===0) return 0;
	  
	    values.sort(function(a,b){return a-b;});
	    var half = Math.floor(values.length / 2);
	    if (values.length % 2)
		  return values[half];
		else
	      return (values[half - 1] + values[half]) / 2.0;
	  }

	  median2(arr) {
	  	arr = [...arr].sort((a, b) => a - b);
	  	return (arr[arr.length - 1 >> 1] + arr[arr.length >> 1]) / 2;
	  }

	  
	  groupAverage(arr, n) {
	    var result = [];
	    for (var i = 0; i < arr.length;) {
	  	 var sum = 0;
	  	 for(var j = 0; j< n; j++){
	  	   // Check if value is numeric. If not use default value as 0
	  	   sum += +arr[i++] || 0
	  	 }
	  	 result.push(sum/n);
	    }
	    return result;
	  }
	  

	  numAverage(arr){
	  	var total = 0;
	  	for(var i = 0;i < arr.length; i++) { 
	  		total+=arr[i];
	  	}
	  	return total/arr.length;
	  }
	  


	  //-------------------------------------------------------------------------------------
	  // peaks (max) & valleys (min)
	  //-------------------------------------------------------------------------------------
	  //var array = [102,112,115,120,119,102,101,100,103,105,110,109,105,100];
	  //console.log(findPeaksAndValleys(array));
	  
	  findPeaksAndValleys(array) {
	    var start = 1;                        // Starting index to search
	    var end = array.length - 2;           // Last index to search
	    var obj = { peaks: [], valleys: [] }; // Object to store the indexs of peaks/valleys
	    
	    for(var i = start; i<=end; i++) {
	  	  var current = array[i];
	  	  var last = array[i-1];
	  	  var next = array[i+1];
	  	  
	  	  if(current > next && current > last) 
	  	  	obj.peaks.push(i);
	  	  else if(current < next && current < last) 
	  	  	obj.valleys.push(i);
	    }
	    
		return obj;
	  }

	  
	  detectPeaks(data, windowWidth, threshold) {
		// https://codepen.io/akx/pen/QowEQq
	    const peaks = [];
	  
		for (let i = 0; i < data.length; i++) {
	  	  const start = Math.max(0, i - windowWidth);
	  	  const end = Math.min(data.length, i + windowWidth);
	  	  let deltaAcc = 0;
	  	  
		  for (let a = start; a < end; a++) {
	  	    deltaAcc += Math.abs(data[a - 1] - data[a]);
	  	  }
	  	  
		  if (deltaAcc > threshold) {
	  	    peaks.push(i);
	  	  }
	    }
	    return peaks;
	  }


	  //-------------------------------------------------------------------------------------
	  // javascript port of: https://stackoverflow.com/questions/22583391/peak-signal-detection-in-realtime-timeseries-data/48895639#48895639
	  //-------------------------------------------------------------------------------------
	  fsum(a) {
	  	return a.reduce((acc, val) => acc + val)
	  }
	  
	  fmean(a) {
	  	return fsum(a) / a.length
	  }
	  
	  fstddev(arr) {
	  	const arr_mean = mean(arr)
	  	const r = function(acc, val) {
	  		return acc + ((val - arr_mean) * (val - arr_mean))
	  	}
	  	
		return Math.sqrt(arr.reduce(r, 0.0) / arr.length)
	  }
	  
	  smoothed_z_score(y, params) {
	  	var p = params || {}
	  	
		// init cooefficients
	  	const lag = p.lag || 5
	  	const threshold = p.threshold || 3.5
	  	const influence = p.influece || 0.5
	  
	  	if (y === undefined || y.length < lag + 2) {
	  		throw "## y data array to short(${y.length}) for given lag of ${lag}"
	  	}
	  	//console.log("lag, threshold, influence: ${lag}, ${threshold}, ${influence}")
	  
	  	// init variables
	  	var signals = Array(y.length).fill(0)
	  	var filteredY = y.slice(0)
	  	const lead_in = y.slice(0, lag)
	  	//console.log("1: " + lead_in.toString())
	  
	  	var avgFilter = []
	  	avgFilter[lag - 1] = fmean(lead_in)
	  	var stdFilter = []
	  	stdFilter[lag - 1] = fstddev(lead_in)
	  	//console.log("2: " + stdFilter.toString())
	  
	  	for (var i = lag; i < y.length; i++) {
	  		//console.log(`${y[i]}, ${avgFilter[i-1]}, ${threshold}, ${stdFilter[i-1]}`)
	  		if (Math.abs(y[i] - avgFilter[i - 1]) > (threshold * stdFilter[i - 1])) {
	  			if (y[i] > avgFilter[i - 1]) {
	  				signals[i] = +1 // positive signal
	  			} else {
	  				signals[i] = -1 // negative signal
	  			}
	  			// make influence lower
	  			filteredY[i] = influence * y[i] + (1 - influence) * filteredY[i - 1]
	  		} else {
	  			signals[i] = 0 // no signal
	  			filteredY[i] = y[i]
	  		}
	  
	  		// adjust the filters
	  		const y_lag = filteredY.slice(i - lag, i)
	  		avgFilter[i] = fmean(y_lag)
	  		stdFilter[i] = fstddev(y_lag)
	  	}
	  
	  	return signals;
	  }


	  //-------------------------------------------------------------------------------------
	  // statistical results
	  //-------------------------------------------------------------------------------------
	  // returns root mean square of successive RR interval differences
	  rmssd() {
	    let rmssdLog = 0;
		let rmssdTotal = 0;
	    this.BPM2RR.map((interval, index) => {
	      if (index !== this.BPM2RR.length - 1) {
		    rmssdTotal += Math.abs(interval - this.BPM2RR[index + 1]);
		  }	
	    })
	    
		if (rmssdTotal != 0) {
		  let rmssd = Math.sqrt(rmssdTotal / this.BPM2RR.length);
		  let rmssdLog = Math.log(rmssd);
		}
	    
		return Math.ceil(rmssdLog * 20); 	// rmssdFactor: 20
	  }
	  
	  
	  // returns percentage of successive intervals that differ more than 50ms
	  pnn50() {
		let nnLargerThan50 = 0;
		this.BPM2RR.map((interval, index) => {
	      if ((index !== this.BPM2RR.length - 1) && 
		      (Math.abs(interval - this.BPM2RR[index + 1]) > 50)) {
		    nnLargerThan50++;
		  }	
	    })
	    
		return Math.ceil(nnLargerThan50 / this.BPM2RR.length * 100);
	  }
	  
	  
	  // returns standard deviation of RR intervals
	  sdnn() {
	    let rrTotal = 0;
		this.BPM2RR.map((interval, index) => {
	      rrTotal += interval;
	    })
	    
		let meanRR = rrTotal / this.BPM2RR.length;
	    
		let sdnnTotal = 0;
	    this.BPM2RR.map((interval, index) => {
	      sdnnTotal += Math.pow(interval - meanRR, 2);
	    })
	    
		return Math.ceil(Math.sqrt(sdnnTotal / this.BPM2RR.length));
	  }
	  
	  
	  // general wellness score (several indicators)
	  bodyMassIndex() {
		var height = this.height / 100;
		var BMI = (this.weight / (height * height));
		//console.log("bodyMassIndex:"+BMI);

		return this.round2(BMI, 1);
	  }

	  
	  stressRisk(sdnn) {
		// HRV 40-60ms[green] 10-20[red] 20-30[yellow]
		// stressRisk	1-2[green] 3[yellow] 4-5[red]
		var SR = 1;

		if (sdnn < 60) { SR = 2; }
		if (sdnn < 40) { SR = 3; }
		if (sdnn < 30) { SR = 4; }
		if (sdnn < 20) { SR = 5; }
		//console.log("StressRisk sdnn:"+sdnn+" idx:"+SR);
		
		return SR;
	  }

	  
	  cardiacWorkload(bpm, bpsys, bpdia) {
		var SV = (bpsys - bpdia);		// stroke volume (ml)
		var CO = bpm * SV * 2;			// cardiac output (L/min)
		
		var BSA = Math.sqrt(this.weight * this.height) / 60;	// body surface area (m2)
		var SVI = Math.ceil(CO / BSA);
		
		var CW = (SVI / 1000);	// ml to L
		//console.log("cardiacWorkload:"+CW);
		
		return this.round2(CW, 2);	
	  }

	  
	  cardiacDiseaseRisk(bpm, rpm, bpsys, bpdia, sdnn, spo2, bmi) {
		var CDR = 0;

		var title = "Risco(s) Cardiovascular(es):";	// bold => <b>text</b>; new line => <br>
		
		var str = "<pre>";
		str += title.bold();
		str += "\n\n";

		var append = false;
		
		if (this.gender == "M") {
		  // max 10 points
		  if (this.age > 45) { CDR += FACTOR_AGE; }
		  if (this.age > 55) { CDR += FACTOR_AGE; }
		  if (this.age > 65) { CDR += FACTOR_AGE; }
		  if (this.age > 75) { CDR += FACTOR_AGE; }
		  if (this.age > 85) { CDR += FACTOR_AGE; }
		  append = true;
		}
		
		if (this.gender == "F") {
		  // max 8 points
		  if (this.age > 55) { CDR += FACTOR_AGE; }
		  if (this.age > 65) { CDR += FACTOR_AGE; }
		  if (this.age > 75) { CDR += FACTOR_AGE; }
		  if (this.age > 85) { CDR += FACTOR_AGE; }
		  append = true;
		}

		if (append == true) { str += "-> idade a partir de 45a (Masc) e 55a(Fem)\n"; }
		
		// max 4 points
		var append = false;
		if ((bpm < BPM_MIN) || (bpm > BPM_MAX)) { CDR += FACTOR_BPM; append = true;}
		if (bpm > BPM_TACHY) { CDR += FACTOR_BPM; append = true;}
		if (append == true) { str += "-> batimentos abaixo de "+BPM_MIN+"bpm ou acima de "+BPM_MAX+"bpm\n"; }
		
		// max 2 points
		var append = false;
		if ((rpm < RPM_MIN) || (rpm > RPM_MAX)) { CDR += FACTOR_RPM; append = true;}
		if (append == true) { str += "-> respiração abaixo de "+RPM_MIN+"rpm ou acima de "+RPM_MAX+"rpm\n"; }
		
		// max 4 points
		var append = false;
		if ((bpsys < SYS_MIN) || (bpsys > SYS_MAX)) { CDR += FACTOR_SYS; append = true;}
		if (bpsys > SYS_EXTRA) { CDR += FACTOR_SYS; append = true;}
		if (append == true) { str += "-> P.A. sistólica abaixo de "+SYS_MIN+"mmHg ou acima de "+SYS_MAX+"mmHg ou especialmente acima de "+SYS_EXTRA+""+"mmHg\n"; }

		// max 2 points
		var append = false;
		if ((bpdia < DIA_MIN) || (bpdia > DIA_MAX)) { CDR += FACTOR_DIA; append = true;}
		if (append == true) { str += "-> P.A. diastólica abaixo de "+DIA_MIN+"mmHg ou acima de "+DIA_MAX+"mmHg\n"; }

		// max 2 points
		var append = false;
		if ((sdnn < HRV_MIN) || (sdnn > HRV_MAX)) { CDR += FACTOR_HRV; append = true;}
		if (append == true) { str += "-> variabilidade (HRV) abaixo de "+HRV_MIN+"ms ou acima de "+HRV_MAX+"ms\n"; }
		
		// max 4 points
		var append = false;
		if (spo2 < SPO2_MIN) { CDR += FACTOR_SPO2; append = true;}
		if (spo2 < SPO2_RISK) { CDR += FACTOR_SPO2; append = true;}
		if (append == true) { str += "-> saturação de oxigêncio (SpO2) abaixo de "+SPO2_MIN+"% ou especialmente abaixo de "+SPO2_RISK+"%\n"; }

		// max 4 points
		var append = false;
		if ((bmi < BMI_MIN) || (bmi > BMI_MAX)) { CDR += FACTOR_BMI; append = true;}
		if (bmi > BMI_EXTRA) { CDR += FACTOR_BMI; append = true;}
		if (append == true) { str += "-> massa corporal (IMC) abaixo de "+BMI_MIN+"kg/m2 ou acima de "+BMI_MAX+"kg/m2 ou especialmente acima de "+BMI_EXTRA+"kg/m2\n"; }
		
		str += "</pre>"
		
		// total max points: 10+4+2+4+2+2+4+4=32
		//console.log("cardiacDiseaseRisk:"+CDR);
		//console.log("summary:"+str);
		
		this.summary = str;
		
		return Math.ceil(CDR);
	  }

	  
	  heartAttackRisk(cardiacDiseaseRisk) {
		var HAR = (cardiacDiseaseRisk / 4);
		//console.log("heartAttackRisk:"+HAR);
		
		return Math.ceil(HAR);
	  }

	  
	  strokeRisk(cardiacDiseaseRisk) {
		var SR = (cardiacDiseaseRisk / 2);
		//console.log("strokeRisk:"+SR);
		
		return Math.ceil(SR);
	  }

	  
	  wellnessScore(CDRisk, HARisk, SRisk) {
		var WS = 100 - ((CDRisk + HARisk + SRisk) * 2);	// bad indexes / behaviours should be doubled ;)
		//console.log("wellnessScore:"+WS);
		
		return Math.ceil(WS);
	  }

    } // end class

	

	//---------------------------------------------------------------------------------------
	// Load opencv when needed
	//---------------------------------------------------------------------------------------
	async function loadOpenCv() {
	  return new Promise(function(resolve, reject) {
		console.log("starting to load opencv");
		var tag = document.createElement('script');
		tag.src = OPENCV_URI;
		tag.async = true;
		tag.type = 'text/javascript'
		tag.onload = () => {
		  cv['onRuntimeInitialized'] = () => {
			console.log("opencv ready");
			resolve();
		  }
		};
		tag.onerror = () => {
		  throw new URIError("opencv didn't load correctly.");
		};
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	  });
	}


