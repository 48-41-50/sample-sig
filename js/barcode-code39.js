'use strict';


/*
 * Create the spans representing the code 39 values
 */
function GenerateCode39Elements(code39, settings) {
    var sizeMap = settings.sizeMap;
    var colorMap = settings.colorMap;
    var code39Objs = [];
    var myObj = null;
    
    for( let i = 0; i < code39.length; i++ ) {
        let code = code39[i];
        
        myObj = document.createElement('span');
        myObj.style.borderLeftStyle = 'solid';
        myObj.style.borderRightWidth = '0px';
        myObj.style.borderTopWidth = '0px';
        myObj.style.borderBottomWidth = '0px';
        myObj.style.height = settings.barcodeHeight.toString() + 'px';
        myObj.style.display = 'inline-block';
        
        myObj.style.borderLeftColor = colorMap[code];
        myObj.style.borderLeftWidth = sizeMap[code].toString() + 'px';
        
        code39Objs.push(myObj)
    }
    
    return code39Objs
}


/*
 * Encode the data string as the representable code 39 symbols and characters.
 * Non-codable characters are translated into spaces.
 */
function Encode39(data) {
    var encoded = [];
    var sep = 's';
    var code39Map = {'A': 'BsbsbSbsB',
                     'B': 'bsBsbSbsB',
                     'C': 'BsBsbSbsb',
                     'D': 'bsbsBSbsB',
                     'E': 'BsbsBSbsb',
                     'F': 'bsBsBSbsb',
                     'G': 'bsbsbSBsB',
                     'H': 'BsbsbSBsb',
                     'I': 'bsBsbSBsb',
                     'J': 'bsbsBSBsb',
                     'K': 'BsbsbsbSB',
                     'L': 'bsBsbsbSB',
                     'M': 'BsBsbsbSb',
                     'N': 'bsbsBsbSB',
                     'O': 'BsbsBsbSB',
                     'P': 'bsBsBsbSb',
                     'Q': 'bsbsbsBSB',
                     'R': 'BsbsbsBSb',
                     'S': 'bsBsbsBSb',
                     'T': 'bsbsBsBSb',
                     'U': 'BSbsbsbsB',
                     'V': 'bSBsbsbsB',
                     'W': 'BSBsbsbsb',
                     'X': 'bSbsBsbsB',
                     'Y': 'BSbsBsbsb',
                     'Z': 'bSBsBsbsb',
                     '0': 'bsbSBsBsb',
                     '1': 'BsbSbsbsB',
                     '2': 'bsBSbsbsB',
                     '3': 'BsBSbsbsb',
                     '4': 'bsbSBsbsB',
                     '5': 'BsbSBsbsb',
                     '6': 'bsBSBsbsb',
                     '7': 'bsbSbsBsB',
                     '8': 'BsbSbsBsb',
                     '9': 'bsBSbsBsb',
                     '*': 'bSbsBsBsb',
                     ' ': 'bSBsbsBsb',
                     '-': 'bSbsbsBsB',
                     '$': 'bSbSbSbsb',
                     '%': 'bsbSbSbSb',
                     '.': 'BSbsbsBsb',
                     '/': 'bSbSbsbSb',
                     '+': 'bSbsbSbSb'
                     };
    var scrubData = data.replace(/[^A-Z0-9 -+%\/\.\$]/, ' ');
    
    encoded.push(code39Map['*'])
    
    for( let i = 0; i < scrubData.length; i++ ) {
        encoded.push(code39Map[scrubData[i]]);
    }

    encoded.push(code39Map['*'])
    
    return encoded.join(sep);
}


/*
 * Create the div to contain the spans for code 39 based on settings 
 * and call the function to create those spans.
 */
function GenerateCode39Spans(data, settings) {
    var barcodeObjs = GenerateCode39Elements(data, settings);
    var barcodeContainer = document.createElement('div');
    barcodeContainer.setAttribute('class', 'barcode-code39-container');
    
    barcodeObjs.forEach(function (elem) {
        barcodeContainer.appendChild(elem);
    });
    
    return barcodeContainer
}


/*
 * Determine the width of the canvas based on the width settings
 */
function GetCode39Width(data, settings) {
    var sizeMap = settings.sizeMap;
    var totalWidth = 0;
    
    for (let i = 0; i < data.length; i++) {
        let chr = data[i]
        totalWidth += sizeMap[chr];
    }
    
    return totalWidth;
}


/*
 * Create the canvas and draw the code 39 barcode
 */
function GenerateCode39Canvas(data, settings) {
    var canvasWidth = GetCode39Width(data, settings);
    var canvasHeight = settings.barcodeHeight;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    
    var context = canvas.getContext('2d');
    var sizeMap = settings.sizeMap;
    var colorMap = settings.colorMap;
    var curX = 0;
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    
    for (let i = 0; i < data.length; i++) {
        var code = data[i];
        var width = sizeMap[code];
        var color = colorMap[code];
        
        context.fillStyle = color;
        context.fillRect(curX, 0, width, canvasHeight);
        
        curX += width;
    }
    
    return canvas;
}


/*
 * GenerateCode39 : Generate a code 39 barcode
 * Inputs:
 *     data : Should be something that is representable as a string. 
 *            Code 39 is limited and big, so don't make the data argument too long.
 *     useCanvas : true  = Draw the code 39 barcode in a 2d canvas context.
 *                 false = Return a dynamically created div containing synamically created spans
 *                         representing the barcode.
 *                 Default: true
 *     returnImg : true =  Convert the canvas into a data URL and 
 *                         make that the src of a dynamically created img element.
 *                         Return the dynamically created img element.
 *                 false = Return the dynamically created canvas element.
 *                 Default: true if useCanvas == true, else false
 *     settings : object
 *                {
 *                  widtBarWidth     : positive integer pixels  (default = 4)
 *                  narrowBarWidth   : positive integer pixels  (default = 2)
 *                  wideSpaceWidth   : positive integer pixels  (default = 4)
 *                  narrowSpaceWidth : positive integer pixels  (default = 2)
 *                  barcodeHeight    : positive integer pixels  (default = 36)
 *                }
 * Outputs:
 *     canvas element or img element or div element on success based on inputs
 *     null on no data
 */
function GenerateCode39(data, useCanvas, returnImg, settings) {
    var mySettings = {};
    var elem = null;
    
    if (settings === undefined || settings === null) settings = {};
    if (useCanvas === undefined || useCanvas === null) useCanvas = true;
    if (returnImg === undefined || returnImg === null) returnImg = true;
    if (data === undefined || data === null) return null;
    
    if (useCanvas === false) returnImg = false;
    
    mySettings.wideBarWidth = settings.hasOwnProperty('wideBarWidth') ? settings.wideBarWidth : 4;
    mySettings.narrowBarWidth = settings.hasOwnProperty('narrowBarWidth') ? settings.narrowBarWidth : 2;
    mySettings.wideSpaceWidth = settings.hasOwnProperty('wideSpaceWidth') ? settings.wideSpaceWidth : 4;
    mySettings.narrowSpaceWidth = settings.hasOwnProperty('narrowSpaceWidth') ? settings.narrowSpaceWidth : 2;
    mySettings.barcodeHeight = settings.hasOwnProperty('barcodeHeight') ? settings.barcodeHeight : 36;
    
    /* set the sizemap */
    mySettings.sizeMap = {B: mySettings.wideBarWidth,
                          b: mySettings.narrowBarWidth,
                          S: mySettings.wideSpaceWidth,
                          s: mySettings.narrowSpaceWidth};
    /* set colormap */
    mySettings.colorMap = {B: 'black',
                           b: 'black',
                           S: 'white',
                           s: 'white'};
    
    var myData = Encode39(data.toString().toUpperCase());
    
    if (useCanvas) {
        let myCanvas = GenerateCode39Canvas(myData, mySettings);
        if (returnImg) {
            elem = document.createElement('img');
            elem.src = myCanvas.toDataURL();
        } else {
            elem = myCanvas;
        }
    } else {
        elem = GenerateCode39Spans(myData, mySettings);
    }
    
    return elem;
}


