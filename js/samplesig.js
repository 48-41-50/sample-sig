'use strict';


var docSigImg = null;
var docDate = null;

var signatureElements = null;
var signatureDateElements = null;


/*
 * Taken from http://jsfiddle.net/briguy37/2mvfd/
 * Thanks, guys!
 */
function GenerateUUIDv4() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    
    return uuid;
};


function GenerateCode39Objects(code39) {
    var sizeMap = {'B': '4px',
                   'b': '2px',
                   'S': '4px',
                   's': '2px'};
    var code39Objs = [];
    var myObj = null;
    
    for( let i = 0; i < code39.length; i++ ) {
        let code = code39[i];
        
        if ( (i == 0) || ((i % 2) != 0) ) {
            if ( myObj !== null ) {
                code39Objs.push(myObj);
            }
            
            myObj = document.createElement('span');
            myObj.style.borderLeftColor = 'black';
            myObj.style.borderLeftStyle = 'solid';
            myObj.style.borderRightWidth = '0px';
            myObj.style.borderTopWidth = '0px';
            myObj.style.borderBottomWidth = '0px';
            myObj.style.height = '.5in';
            myObj.style.width = '0px';
        }
        
        if ( code.toUpperCase() == 'B' ) {
            myObj.style.borderLeftWidth = sizeMap[code];
        } else {
            myObj.style.width = sizeMap[code];
        }
    }
    
    if( myObj !== null ) {
        code39Objs.push(myObj)
    }
    
    return code39Objs
}


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
    
    return encoded.join(code39Map[sep]);
}


function GenerateCode39(data) {
    var barcodeContainer = document.createElement('div');
    barcodeContainer.class = "barcode-container";
    var barcode = document.createElement('div');
    barcode.class = "barcode-code";
    var label = document.createElement('div');
    label.class = "barcode-label"
    var barcodeObjs = GenerateCode39Objects(Encode39(data.toUpperCase()));
    
    barcodeObjs.forEach(barcode.appendChild);
    label.innerHTML = "* " + data + " *";
    barcodeContainer.appendChild(barcode);
    barcodeContainer.appendChild(label);
    
    return barcodeContainer;
}


/*
 * SetDateMaxValue: Set date input controls to not allow a future date
 */
function SetDateMaxValue()
{
    function Pad(v)
    {
        if ( v < 10 ) {
            v = '0' + v.toString();
        } else {
            v = v.toString();
        }
        
        return v;
    }
    
    
    let today = new Date();
    let maxDate = today.getFullYear().toString() + '-' + Pad(today.getMonth() + 1) + '-' + Pad(today.getDate());
    
    let dates = document.getElementsByName("signdate");
    
    for( let i = 0; i < dates.length; i++ ) {
        dates[i].max = maxDate;
    }
}


/*
 * direction is 'up', 'down', 'left', 'right'
 *                2
 *               / \
 *              1---3
 */
function DrawArrow(context, direction, color) {
    var left = 0;
    var right = context.canvas.width - 1;
    var top = 0;
    var bottom = context.canvas.height - 1;
              /* x  y */
    var path = new Array();
    
    /*context.globalAlpha = 1;*/
    context.lineJoin = "round";
    context.lineWidth = 2;
    
    if (direction == 'up') {
        path.push({x: left, y: bottom});
        path.push({x: Math.ceil((right - left) / 2), y: top});
        path.push({x: right, y: bottom});
        path.push({x: left, y: bottom});
    } else if (direction == 'down') {
        path.push({x: left, y: top});
        path.push({x: Math.ceil((right - left) / 2), y: bottom});
        path.push({x: right, y: top});
        path.push({x: left, y: top});
    } else if (direction == 'left') {
        path.push({x: left, y: top});
        path.push({x: right, y: Math.ceil((bottom - top) / 2)});
        path.push({x: left, y: bottom});
        path.push({x: left, y: top});
    } else if (direction == 'right') {
        path.push({x: right, y: top});
        path.push({x: left, y: Math.ceil((bottom - top) / 2)});
        path.push({x: right, y: bottom});
        path.push({x: right, y: top});
    }
    
    context.beginPath();
    for( let i = 0; i < path.length; i++) {
        let point = path[i];
        if( i == 0 ) {
            context.moveTo(point.x, point.y);
        } else {
            context.lineTo(point.x, point.y);
        }
    }
    context.closePath();
    
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
}


function InitCanvas(width, height) {
    var myCanvas = document.createElement('canvas');
    
    myCanvas.setAttribute('width', width);
    myCanvas.setAttribute('height', height);
    
    return myCanvas;
}


function CreateArrow(direction, width, height, color) {
    var canvas = InitCanvas(width, height);
    var context = canvas.getContext("2d");
    var img = document.createElement('img');
    
    DrawArrow(context, direction, color);
    
    img.src = canvas.toDataURL()
    
    return img;
}


function CreateNavImages() {
    var imageList = new Array();
    imageList.push({img: CreateArrow('left', 20, 20, "#DC432C"), element_name: 'left-arrow'});
    imageList.push({img: CreateArrow('up', 12, 12, "black"), element_name: 'up-arrow'});
    imageList.push({img: CreateArrow('down', 12, 12, "black"), element_name: 'dn-arrow'});
    var elemList = null;
    
    imageList.forEach(function(elem) {
        var elemList = document.getElementsByName(elem.element_name);
        for( let i = 0; i < elemList.length; i++ ) {
            elemList[i].appendChild(elem.img);
        }
    });
}


function EnumerateElementIds(nodeList, prefix) {
    for( let i = 0; i < nodeList.length; i++ ) {
        myElements[i].setAttribute('id', prefix + '-' + i.toString());
    }
}


function InitSigAction(e) {
    var elem = document.getElementById(e.targetId);
    
}


/*
 * Initialization
 */
function InitApp() {
    SetDateMaxValue();
    CreateNavImages();
    
    signatureElements = document.getElementsByName("signature");
    EnumerateElementIds(signatureElements, "signature");
    signatureDateElements = document.getElementsByName("signdate");
    EnumerateElementIds(signatureDateElements, "signdate");
}


/* 
 * Create a canvas to record the signature
 */
function CreateCanvas(container) {
    return null;
}


/*
 * Destroy the canvas
 */
function DestroyCanvas(container) {
    return null;
}


