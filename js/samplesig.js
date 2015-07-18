'use strict';


var docSigImg = null;
var docSigDate = null;

var paintActive = false;
var signActive = false;
var activeCanvas = null;
var activeContext = null;
var dirty = false;

var signatureElements = null;
var signatureDateElements = null;


function ToArray(theList) {
    var myArray = new Array()
    
    for (let i = 0; i < theList.length; i++) {
        myArray.push(theList[i]);
    }
    
    return myArray;
}


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
        var point = path[i];
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
            var element = elemList[i];
            var anchor = document.createElement('a');
            var img = document.createElement('img');
            
            anchor.setAttribute('name', elem.element_name + '-anchor');
            if (elem.element_name.indexOf('up-') == 0) {
                anchor.setAttribute('title', "Navigate to previous signature.");
            } else if (elem.element_name.indexOf('dn-') == 0) {
                anchor.setAttribute('title', "Navigate to next signature.");
            }
            img.src = elem.data;
            anchor.appendChild(img);
            element.appendChild(anchor);
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
 * Read through all elements and set unique names for each based on the enumeration number
 */
function EnumerateElementNames(nodeList, prefix) {
    for( let i = 0; i < nodeList.length; i++ ) {
        nodeList[i].setAttribute('name', prefix + '-' + i.toString());
    }
}


function SetNavAnchor(anchor, elNum, direction, target) {
    var nextElNum = -1;
    
    if (direction === 'up') {
        nextElNum = ((elNum === 0) ? signatureElements.length - 1 : elNum - 1);
    } else {
        nextElNum = ((elNum === (signatureElements.length - 1) ? 0 : elNum + 1));
    }
    
    anchor.setAttribute('name', anchor.name + '-' + elNum.toString());
    anchor.setAttribute('id', anchor.name);
    anchor.setAttribute('href', "#" + target + "-" + nextElNum.toString());
    anchor.setAttribute('href_save', "#" + target + "-" + nextElNum.toString());
}


function SetNavigation() {
    var uparrows = ToArray(document.getElementsByName('up-arrow-anchor'));
    var downarrows = ToArray(document.getElementsByName('dn-arrow-anchor'));
    
    for (let i = 0; i < uparrows.length; i++) {
        SetNavAnchor(uparrows[i], i, 'up', 'signblock-anchor');
    }
    
    for (let i = 0; i < downarrows.length; i++) {
        SetNavAnchor(downarrows[i], i, 'dn', 'signblock-anchor');
    }
}


function SetSignature(containerNum) {
    var container = document.getElementById('signature-' + containerNum.toString());
    
    var elem = document.createElement('img');
    elem.src = docSigImg;
    container.appendChild(elem);
    
    container = document.getElementById('signdate-' + containerNum.toString());
    elem = document.createElement('div');
    elem.classList.add('accepted-date');
    elem.innerText = docSigDate.toLocaleDateString();
    container.appendChild(elem);
}


function StopNav(idNum) {
    var navElem = document.getElementById('up-arrow-anchor-' + idNum.toString());
    navElem.removeAttribute('href');
    navElem = document.getElementById('dn-arrow-anchor-' + idNum.toString());
    navElem.removeAttribute('href');
}


function StartNav(idNum) {
    var navElem = document.getElementById('up-arrow-anchor-' + idNum.toString());
    navElem.setAttribute('href', navElem.getAttribute("href_save"));
    navElem = document.getElementById('dn-arrow-anchor-' + idNum.toString());
    navElem.setAttribute('href', navElem.getAttribute("href_save"));
}


function AcceptSignature() {
    if (signActive && activeCanvas) {
        var myCanvas = activeCanvas;
        var myContainer = myCanvas.parentElement;
        var myContainerNum = myContainer.id.split('-');
        myContainerNum = Number(myContainerNum[myContainerNum.length - 1]);
        var myMsg = document.getElementById('rec-sig-msg-' + myContainerNum.toString());
        
        activeCanvas = null;
        activeContext = null;
        paintActive = false;
        signActive = false;
        
        docSigImg = myCanvas.toDataURL();
        docSigDate = new Date();
        
        createCookie("document-signature", docSigImg, 1);
        createCookie("document-signed-date", docSigDate.toUTCString(), 1);
        
        myContainer.removeChild(myCanvas);
        myMsg.classList.add('hide');
        
        SetSignature(myContainerNum);
        
        ClearModal();
        StartNav(myContainerNum);
    }
}


function RejectSignature() {
    if (signActive && activeCanvas) {
        var myCanvas = activeCanvas;
        var myContainer = myCanvas.parentElement;
        var myContainerNum = myContainer.id.split('-');
        myContainerNum = Number(myContainerNum[myContainerNum.length - 1]);
        var myMsg = document.getElementById('rec-sig-msg-' + myContainerNum.toString());
        
        activeCanvas = null;
        activeContext = null;
        paintActive = false;
        signActive = false;
        
        docSigImg = null;
        docSigDate = null;
        
        eraseCookie('document-signature');
        eraseCookie('document-signed-date');
        
        myContainer.removeChild(myCanvas);
        myMsg.classList.add('hide');
        
        ClearModal();
        StartNav(myContainerNum);
    }
}


/*
 * Key listener for accept or cancel
 */
function KeyListener(e) {
    if (! e.defaultPrevented) {
        if (signActive) {
            e.preventDefault();
            
            switch(e.key || e.keyCode) {
                case "Enter":
                case 13:
                    if (dirty) {
                        AcceptSignature();
                    }
                    break;
                    
                case "Escape":
                case 27:
                    RejectSignature();
                    break;
                
                default:
                    break;
            }
        }
    }
    
    return;
}


/* 
 * Create a canvas to record the signature
 */
function CreateCanvas(container) {
    activeCanvas = document.createElement('canvas');
    activeCanvas.setAttribute('height', container.clientHeight);
    activeCanvas.setAttribute('width', container.clientWidth);
    activeCanvas.classList.add('signcanvas');
    activeContext = activeCanvas.getContext('2d');
    activeContext.beginPath();
    activeContext.lineWidth = 2;
    activeContext.lineJoin = 'round';
    activeContext.strokeStyle = 'black';
    
    var TraceDrag = function (e) {
        if (paintActive) {
            activeContext.lineTo(e.offsetX, e.offsetY);
            activeContext.stroke();
            dirty = true;
            
            if (e.type == "mouseleave") {
                paintActive = false;
            }
        }
    };
    
    activeCanvas.onmousedown = function (e) {
        if (e.button === 0) {
            paintActive = true;
            activeContext.moveTo(e.offsetX, e.offsetY);
        }
    };
    
    activeCanvas.onmouseup = function (e) {
        if (e.button === 0) {
            if (paintActive) {
                activeContext.lineTo(e.offsetX, e.offsetY);
                activeContext.stroke();
                dirty = true;
                
                paintActive = false;
            }
        }
    };
    
    activeCanvas.onmousemove = TraceDrag;
    activeCanvas.onmouseleave = TraceDrag;
    
    container.appendChild(activeCanvas);
}


function SetModal() {
    var body = document.getElementById('body');
    var modal = document.createElement('div');
    body.classList.add('no-scroll');
    modal.classList.add('modal-background');
    modal.setAttribute('id', 'modal-background');
    body.appendChild(modal);
}


function ClearModal() {
    var body = document.getElementById('body');
    var modal = document.getElementById('modal-background');
    body.removeChild(modal);
    body.classList.remove('no-scroll');
}


/*
 * Event handler for initializing the canvas for signature drawing.
 * If the signature has been recorded, then set a copy of the image in the signing area.
 */
function InitSigAction(anchor) {
    var idNum = anchor.id.split('-');
    idNum = Number(idNum[idNum.length - 1]);
    var myMsg = document.getElementById('rec-sig-msg-' + idNum.toString());
    
    if (docSigImg !== null) {
        SetSignature(idNum);
    } else {
        SetModal();
        StopNav(idNum);
        
        var sigDiv = document.getElementById('signature-' + idNum.toString());
        myMsg.classList.remove('hide');
        CreateCanvas(sigDiv);
        signActive = true;
    }
}


/*
 * Initialization of app page
 */
function InitApp() {
    var cookie = null;
    cookie = readCookie('document-signature');
    if (cookie !== null) {
        docSigImg = cookie;
    }
    cookie = readCookie('document-signed-date');
    if (cookie !== null) {
        docSigDate = new Date(cookie);
    }
    
    var signLabelElements = ToArray(document.getElementsByName("signblock-anchor"));
    EnumerateElementIds(signLabelElements, 'signblock-anchor');
    EnumerateElementNames(signLabelElements, 'signblock-anchor');
    
    signatureElements = ToArray(document.getElementsByName("signature"));
    EnumerateElementIds(signatureElements, "signature");
    EnumerateElementNames(signatureElements, "signature");
    
    signatureDateElements = ToArray(document.getElementsByName("signdate"));
    EnumerateElementIds(signatureDateElements, "signdate");
    EnumerateElementNames(signatureDateElements, "signdate");
    
    EnumerateElementIds(document.getElementsByName('rec-sig-msg'), 'rec-sig-msg');
    EnumerateElementIds(document.getElementsByName("labeltag-anchor"), 'labeltag-anchor');
    
    CreateNavImages();
    SetNavigation();
    
    window.addEventListener('keydown', KeyListener, true);
}


