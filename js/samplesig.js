'use strict';


var docSigImg = null;
var docDate = null;

var signatureElements = null;
var signatureDateElements = null;


/*
 * Draw a triangular arrow in the context for the given direction.
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


/*
 * Create a canvas of the specified width and height
 */
function InitCanvas(width, height) {
    var myCanvas = document.createElement('canvas');
    
    myCanvas.setAttribute('width', width);
    myCanvas.setAttribute('height', height);
    
    return myCanvas;
}


/*
 * If arrow data is not stored in cookie, create it, else 
 * read cookie data and set that data as the image source.
 */
function CreateArrow(direction, width, height, color) {
    var dataURL = readCookie(direction + '-arrow');
    
    if (dataURL === null) {
        var canvas = InitCanvas(width, height);
        var context = canvas.getContext("2d");
        
        DrawArrow(context, direction, color);
        dataURL = canvas.toDataURL();
        createCookie(direction + '-arrow', dataURL, 1);
    }
    
    return dataURL;
}


/*
 * Create dynamic images for arrows
 */
function CreateNavImages() {
    var urlList = new Array();
    urlList.push({data: CreateArrow('left', 20, 20, "#DC432C"), element_name: 'left-arrow'});
    urlList.push({data: CreateArrow('up', 12, 12, "black"), element_name: 'up-arrow'});
    urlList.push({data: CreateArrow('down', 12, 12, "black"), element_name: 'dn-arrow'});
    
    urlList.forEach(function(elem) {
        var elemList = document.getElementsByName(elem.element_name);
        
        for( let i = 0; i < elemList.length; i++ ) {
            let img = document.createElement('img');
            img.src = elem.data;
            elemList[i].appendChild(img);
        }
    });
}


/* 
 * Read through all elements and set unique ids for each based on the enumeration number
 */
function EnumerateElementIds(nodeList, prefix) {
    for( let i = 0; i < nodeList.length; i++ ) {
        nodeList[i].setAttribute('id', prefix + '-' + i.toString());
    }
}


/*
 * Initialization of app page
 */
function InitApp() {
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


/*
 * Event handler for initializing the canvas for signature drawing.
 * If the signature has been recorded, then set a copy of the image in the signing area.
 */
function InitSigAction(e) {
    var elem = document.getElementById(e.targetId);
    
}


