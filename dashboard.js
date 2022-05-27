	const COLOR_RED = "#F03E3E";		// RGB(255,0,0)		#FF0000
	const COLOR_YELLOW = "#FFDD00";		// RGB(255,255,0)	#FFFF00
	const COLOR_GREEN = "#30B32D";		// RGB(0,255,0)		#00FF00
	
	//*** Summary ***********************************************************************************
	var txt_Summary = document.getElementById('txt_Summary '); // your canvas element
		
	//*** wellnessScore *****************************************************************************
	var opts_wellnessScore = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 0, max: 40},   
	     {strokeStyle: COLOR_YELLOW, min: 40, max: 80},   
	     {strokeStyle: COLOR_GREEN, min: 80, max: 100}   
	  ],
	  
	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_wellnessScore = document.getElementById('chart-wellnessScore'); // your canvas element
	var gauge_wellnessScore = new Gauge(target_wellnessScore).setOptions(opts_wellnessScore); // create sexy gauge!
	gauge_wellnessScore.maxValue = 100; // set max gauge value
	gauge_wellnessScore.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_wellnessScore.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_wellnessScore.set(0); // set actual value

	var textRenderer_wellnessScore = new TextRenderer(document.getElementById('value-wellnessScore'))
	textRenderer_wellnessScore.render = function(gauge_wellnessScore){
	   this.el.innerHTML = gauge_wellnessScore.displayedValue.toFixed(0);
	};
	gauge_wellnessScore.setTextField(textRenderer_wellnessScore);


	//*** BPM *********************************************************************************
	var opts_BPM = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 0, max: 30},     
	     {strokeStyle: COLOR_YELLOW, min: 30, max: 60}, 	
	     {strokeStyle: COLOR_GREEN, min: 60, max: 100}, 	
	     {strokeStyle: COLOR_YELLOW, min: 100, max: 140},  
	     {strokeStyle: COLOR_RED, min: 140, max: 180}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 20, 40, 60, 80, 100, 120, 140, 160, 180],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_BPM = document.getElementById('chart-BPM'); // your canvas element
	var gauge_BPM = new Gauge(target_BPM).setOptions(opts_BPM); // create sexy gauge!
	gauge_BPM.maxValue = 180; // set max gauge value
	gauge_BPM.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_BPM.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_BPM.set(0); // set actual value

	var textRenderer_BPM = new TextRenderer(document.getElementById('value-BPM'))
	textRenderer_BPM.render = function(gauge_BPM){
	   this.el.innerHTML = gauge_BPM.displayedValue.toFixed(0) + "bpm";
	};
	gauge_BPM.setTextField(textRenderer_BPM);


	//*** RPM *********************************************************************************
	var opts_RPM = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 0, max: 6},     
	     {strokeStyle: COLOR_YELLOW, min: 6, max: 12}, 	
	     {strokeStyle: COLOR_GREEN, min: 12, max: 20}, 	
	     {strokeStyle: COLOR_YELLOW, min: 20, max: 30},  
	     {strokeStyle: COLOR_RED, min: 30, max: 40}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 6, 12, 20, 25, 30, 35, 40],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_RPM = document.getElementById('chart-RPM'); // your canvas element
	var gauge_RPM = new Gauge(target_RPM).setOptions(opts_RPM); // create sexy gauge!
	gauge_RPM.maxValue = 40; // set max gauge value
	gauge_RPM.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_RPM.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_RPM.set(0); // set actual value

	var textRenderer_RPM = new TextRenderer(document.getElementById('value-RPM'))
	textRenderer_RPM.render = function(gauge_RPM){
	   this.el.innerHTML = gauge_RPM.displayedValue.toFixed(0) + "rpm";
	};
	gauge_RPM.setTextField(textRenderer_RPM);


	//*** BP-SYS *********************************************************************************
	var opts_BP_SYS = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 0, max: 70},     
	     {strokeStyle: COLOR_YELLOW, min: 70, max: 90}, 	
	     {strokeStyle: COLOR_GREEN, min: 90, max: 120}, 	
	     {strokeStyle: COLOR_YELLOW, min: 120, max: 140},  
	     {strokeStyle: COLOR_RED, min: 140, max: 210}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 40, 70, 90, 120, 140, 170, 210],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_BP_SYS = document.getElementById('chart-BP-SYS'); // your canvas element
	var gauge_BP_SYS = new Gauge(target_BP_SYS).setOptions(opts_BP_SYS); // create sexy gauge!
	gauge_BP_SYS.maxValue = 210; // set max gauge value
	gauge_BP_SYS.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_BP_SYS.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_BP_SYS.set(0); // set actual value

	var textRenderer_BP_SYS = new TextRenderer(document.getElementById('value-BP-SYS'))
	textRenderer_BP_SYS.render = function(gauge_BP_SYS){
	   this.el.innerHTML = gauge_BP_SYS.displayedValue.toFixed(0) + "mmHg";
	};
	gauge_BP_SYS.setTextField(textRenderer_BP_SYS);


	//*** BP-DIA *********************************************************************************
	var opts_BP_DIA = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 0, max: 40},     
	     {strokeStyle: COLOR_YELLOW, min: 40, max: 60}, 	
	     {strokeStyle: COLOR_GREEN, min: 60, max: 90}, 	
	     {strokeStyle: COLOR_YELLOW, min: 90, max: 110},  
	     {strokeStyle: COLOR_RED, min: 110, max: 150}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 20, 40, 60, 90, 110, 130, 150],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_BP_DIA = document.getElementById('chart-BP-DIA'); // your canvas element
	var gauge_BP_DIA = new Gauge(target_BP_DIA).setOptions(opts_BP_DIA); // create sexy gauge!
	gauge_BP_DIA.maxValue = 150; // set max gauge value
	gauge_BP_DIA.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_BP_DIA.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_BP_DIA.set(0); // set actual value

	var textRenderer_BP_DIA = new TextRenderer(document.getElementById('value-BP-DIA'))
	textRenderer_BP_DIA.render = function(gauge_BP_DIA){
	   this.el.innerHTML = gauge_BP_DIA.displayedValue.toFixed(0) + "mmHg";
	};
	gauge_BP_DIA.setTextField(textRenderer_BP_DIA);


	//*** HRV *********************************************************************************
	var opts_HRV = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 0, max: 20},   
	     {strokeStyle: COLOR_YELLOW, min: 20, max: 40},   
	     {strokeStyle: COLOR_GREEN, min: 40, max: 80},
	     {strokeStyle: COLOR_YELLOW, min: 80, max: 100}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_HRV = document.getElementById('chart-HRV'); // your canvas element
	var gauge_HRV = new Gauge(target_HRV).setOptions(opts_HRV); // create sexy gauge!
	gauge_HRV.maxValue = 100; // set max gauge value
	gauge_HRV.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_HRV.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_HRV.set(0); // set actual value

	var textRenderer_HRV = new TextRenderer(document.getElementById('value-HRV'))
	textRenderer_HRV.render = function(gauge_HRV){
	   this.el.innerHTML = gauge_HRV.displayedValue.toFixed(0) + "ms";
	};
	gauge_HRV.setTextField(textRenderer_HRV);


	//*** SPO2 *********************************************************************************
	var opts_SPO2 = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 80, max: 90},   
	     {strokeStyle: COLOR_YELLOW, min: 90, max: 95},   
	     {strokeStyle: COLOR_GREEN, min: 95, max: 100}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [80, 85, 90, 95, 100],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_SPO2 = document.getElementById('chart-SPO2'); // your canvas element
	var gauge_SPO2 = new Gauge(target_SPO2).setOptions(opts_SPO2); // create sexy gauge!
	gauge_SPO2.maxValue = 100; // set max gauge value
	gauge_SPO2.setMinValue(80);  // Prefer setter over gauge.minValue = 0
	gauge_SPO2.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_SPO2.set(80); // set actual value

	var textRenderer_SPO2 = new TextRenderer(document.getElementById('value-SPO2'))
	textRenderer_SPO2.render = function(gauge_SPO2){
	   this.el.innerHTML = gauge_SPO2.displayedValue.toFixed(0) + "%";
	};
	gauge_SPO2.setTextField(textRenderer_SPO2);


	//*** stressRisk *********************************************************************************
	var opts_stressRisk = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_GREEN, min: 0, max: 2},   
	     {strokeStyle: COLOR_YELLOW, min: 2, max: 3}, 	
	     {strokeStyle: COLOR_RED, min: 3, max: 5}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 1, 2, 3, 4, 5],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_stressRisk = document.getElementById('chart-stressRisk'); // your canvas element
	var gauge_stressRisk = new Gauge(target_stressRisk).setOptions(opts_stressRisk); // create sexy gauge!
	gauge_stressRisk.maxValue = 5; // set max gauge value
	gauge_stressRisk.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_stressRisk.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_stressRisk.set(0); // set actual value

	var textRenderer_stressRisk = new TextRenderer(document.getElementById('value-stressRisk'))
	textRenderer_stressRisk.render = function(gauge_stressRisk){
	   this.el.innerHTML = gauge_stressRisk.displayedValue.toFixed(0);
	};
	gauge_stressRisk.setTextField(textRenderer_stressRisk);


	//*** bodyMassIndex *********************************************************************************
	var opts_bodyMassIndex = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 0, max: 5},   
	     {strokeStyle: COLOR_YELLOW, min: 5, max: 18}, 	
	     {strokeStyle: COLOR_GREEN, min: 18, max: 25},  
	     {strokeStyle: COLOR_YELLOW, min: 25, max: 30}, 	
	     {strokeStyle: COLOR_RED, min: 30, max: 40}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 5, 10, 15, 20, 25, 30, 35, 40],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_bodyMassIndex = document.getElementById('chart-bodyMassIndex'); // your canvas element
	var gauge_bodyMassIndex = new Gauge(target_bodyMassIndex).setOptions(opts_bodyMassIndex); // create sexy gauge!
	gauge_bodyMassIndex.maxValue = 40; // set max gauge value
	gauge_bodyMassIndex.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_bodyMassIndex.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_bodyMassIndex.set(0); // set actual value

	var textRenderer_bodyMassIndex = new TextRenderer(document.getElementById('value-bodyMassIndex'))
	textRenderer_bodyMassIndex.render = function(gauge_bodyMassIndex){
	   this.el.innerHTML = gauge_bodyMassIndex.displayedValue.toFixed(0) + "kg/m2";
	};
	gauge_bodyMassIndex.setTextField(textRenderer_bodyMassIndex);


	//*** cardiacWorkload *********************************************************************************
	var opts_cardiacWorkload = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_RED, min: 0, max: 2},  
	     {strokeStyle: COLOR_YELLOW, min: 2, max: 4}, 	
	     {strokeStyle: COLOR_GREEN, min: 4, max: 6},
	     {strokeStyle: COLOR_YELLOW, min: 6, max: 8}, 	
	     {strokeStyle: COLOR_RED, min: 8, max: 10}   
	  ],

	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_cardiacWorkload = document.getElementById('chart-cardiacWorkload'); // your canvas element
	var gauge_cardiacWorkload = new Gauge(target_cardiacWorkload).setOptions(opts_cardiacWorkload); // create sexy gauge!
	gauge_cardiacWorkload.maxValue = 10; // set max gauge value
	gauge_cardiacWorkload.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_cardiacWorkload.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_cardiacWorkload.set(0); // set actual value

	var textRenderer_cardiacWorkload = new TextRenderer(document.getElementById('value-cardiacWorkload'))
	textRenderer_cardiacWorkload.render = function(gauge_cardiacWorkload){
	   this.el.innerHTML = gauge_cardiacWorkload.displayedValue.toFixed(1) + "L/min";
	};
	gauge_cardiacWorkload.setTextField(textRenderer_cardiacWorkload);
	
	
	//*** cardiacDiseaseRisk *********************************************************************************
	var opts_cardiacDiseaseRisk = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_GREEN, min: 0, max: 10},  
	     {strokeStyle: COLOR_YELLOW, min: 10, max: 15}, 	
	     {strokeStyle: COLOR_RED, min: 15, max: 30}   
	  ],
	  
	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 5, 10, 15, 20, 25, 30],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_cardiacDiseaseRisk = document.getElementById('chart-cardiacDiseaseRisk'); // your canvas element
	var gauge_cardiacDiseaseRisk = new Gauge(target_cardiacDiseaseRisk).setOptions(opts_cardiacDiseaseRisk); // create sexy gauge!
	gauge_cardiacDiseaseRisk.maxValue = 30; // set max gauge value
	gauge_cardiacDiseaseRisk.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_cardiacDiseaseRisk.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_cardiacDiseaseRisk.set(0); // set actual value

	var textRenderer_cardiacDiseaseRisk = new TextRenderer(document.getElementById('value-cardiacDiseaseRisk'))
	textRenderer_cardiacDiseaseRisk.render = function(gauge_cardiacDiseaseRisk){
	   this.el.innerHTML = gauge_cardiacDiseaseRisk.displayedValue.toFixed(0) + "%";
	};
	gauge_cardiacDiseaseRisk.setTextField(textRenderer_cardiacDiseaseRisk);
	
	
	//*** heartAttackRisk *********************************************************************************
	var opts_heartAttackRisk = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_GREEN, min: 0, max: 3},  
	     {strokeStyle: COLOR_YELLOW, min: 3, max: 4}, 	
	     {strokeStyle: COLOR_RED, min: 4, max: 7}   
	  ],
	  
	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 1, 2, 3, 4, 5, 6, 7],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_heartAttackRisk = document.getElementById('chart-heartAttackRisk'); // your canvas element
	var gauge_heartAttackRisk = new Gauge(target_heartAttackRisk).setOptions(opts_heartAttackRisk); // create sexy gauge!
	gauge_heartAttackRisk.maxValue = 7; // set max gauge value
	gauge_heartAttackRisk.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_heartAttackRisk.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_heartAttackRisk.set(0); // set actual value

	var textRenderer_heartAttackRisk = new TextRenderer(document.getElementById('value-heartAttackRisk'))
	textRenderer_heartAttackRisk.render = function(gauge_heartAttackRisk){
	   this.el.innerHTML = gauge_heartAttackRisk.displayedValue.toFixed(0) + "%";
	};
	gauge_heartAttackRisk.setTextField(textRenderer_heartAttackRisk);


	//*** strokeRisk *********************************************************************************
	var opts_strokeRisk = {																								
	  angle: -0.2, // The span of the gauge arc
	  lineWidth: 0.2, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  
	  staticZones: [
	     {strokeStyle: COLOR_GREEN, min: 0, max: 7},  
	     {strokeStyle: COLOR_YELLOW, min: 7, max: 10}, 	
	     {strokeStyle: COLOR_RED, min: 10, max: 15}   
	  ],
	  
	  staticLabels: {
	    font: "10px sans-serif",  // Specifies font
	    labels: [0, 2, 4, 7, 10, 13, 15],  // Print labels at these values
	    color: "#000000",  // Optional: Label text color
	    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	
	};

	var target_strokeRisk = document.getElementById('chart-strokeRisk'); // your canvas element
	var gauge_strokeRisk = new Gauge(target_strokeRisk).setOptions(opts_strokeRisk); // create sexy gauge!
	gauge_strokeRisk.maxValue = 15; // set max gauge value
	gauge_strokeRisk.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge_strokeRisk.animationSpeed = 10; // set animation speed (32 is default value)
	gauge_strokeRisk.set(0); // set actual value

	var textRenderer_strokeRisk = new TextRenderer(document.getElementById('value-strokeRisk'))
	textRenderer_strokeRisk.render = function(gauge_strokeRisk){
	   this.el.innerHTML = gauge_strokeRisk.displayedValue.toFixed(0) + "%";
	};
	gauge_strokeRisk.setTextField(textRenderer_strokeRisk);
