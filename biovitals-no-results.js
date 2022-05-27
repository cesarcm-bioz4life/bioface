	//---------------------------------------------------------------------------------------
	// EZ-VISION
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
	
	const PROFILE_GENDER = "M";
	const PROFILE_AGE = 50;
	const PROFILE_WEIGHT = 75;
	const PROFILE_HEIGHT = 170;
	const PROFILE_POSITION = "UP";
	
	const VIDEO_WIDTH = 640;
	const VIDEO_HEIGHT = 480;

	//---------------------------------------------------------------------------------------
	// Simple implementation in JavaScript
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
		
		//console.log(this.webcamVideoElement.width);	// 640
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
		  this.face = new cv.Rect();  // Position of the face
		  this.elapsedTime = 0;
		  this.startedTime = Date.now();
		  
		  this.gender = gender;
		  this.age = age;
		  this.weight = weight;
		  this.height = height;
		  this.position = position;
   
		  // Load face detector
		  this.classifier = new cv.CascadeClassifier();
		  let faceCascadeFile = HAARCASCADE_URI	// "haarcascade_frontalface_alt.xml";
		  if (!this.classifier.load(faceCascadeFile)) {
			await this.createFileFromUrl(faceCascadeFile, this.classifierPath);
			this.classifier.load(faceCascadeFile);
			console.log("this.classifier.load(faceCascadeFile)");
		  }
		  
		  var interval = MSEC_PER_SEC / this.targetFps;
		  print("set interval: " + interval.toString());
		  this.scanTimer = setInterval(this.processFrame.bind(this), interval);
		} catch (e) {
		  console.log(e);
		}			
	}
	  

	  //-------------------------------------------------------------------------------------
	  // Add one frame to raw signal
	  //-------------------------------------------------------------------------------------
	  processFrame() {
		//console.log("processFrame...");
		
		try {
		  if (!this.frameGray.empty()) {
			this.frameGray.copyTo(this.lastFrameGray); // Save last frame
		  }
		  this.cap.read(this.frameRGB); // Save current frame
		  let time = Date.now()
		  let rescanFlag = false;
		  cv.cvtColor(this.frameRGB, this.frameGray, cv.COLOR_RGBA2GRAY);

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

		  // output with overlay
		  this.frameRGB.copyTo(this.outputRGB);
		  
		  //----------------------------------
		  // Draw UserID
		  //----------------------------------
		  cv.rectangle(this.frameRGB, new cv.Point(5, 55),
			new cv.Point(255, 105),
			[255, 128, 0, 255], -1);	// orange

		  cv.putText(this.frameRGB, this.userid,
		    new cv.Point(15, 85), cv.FONT_HERSHEY_PLAIN, 1.0, [0, 0, 0, 255], 2);

		  console.log("elapsedTime: " + this.elapsedTime);
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
		  
		  // Draw face
		  cv.rectangle(this.frameRGB, new cv.Point(this.face.x, this.face.y),
			new cv.Point(this.face.x+this.face.width, this.face.y+this.face.height),
			[0, 255, 0, 255], 1);	// green
		  
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
	  }
	  

	  //-------------------------------------------------------------------------------------
	  // Clean up resources
	  //-------------------------------------------------------------------------------------
	  stop() {
		clearInterval(this.scanTimer);

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
		  "BPM"  : 0, 
		  "RPM"  : 0, 
		  "SPO2" : 0,
		  "SYS"  : 0,
		  "DIA"  : 0, 
		  "GLU"  : 0, 
		  "rmssd": 0,
		  "pnn50": 0,
		  "sdnn" : 0,
		  "stressRisk"			: 0,
		  "bodyMassIndex"		: 0,
		  "cardiacWorkload"		: 0,
		  "cardiacDiseaseRisk"	: 0,
		  "heartAttackRisk"		: 0,
		  "strokeRisk"			: 0,
		  "wellnessScore"		: 0,
		  "summary"				: ""
		}
		
		//console.log(results);
		
		return results;
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


