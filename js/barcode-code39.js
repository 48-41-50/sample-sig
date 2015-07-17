'use strict';


function GenerateCode39Objects(code39) {
    var sizeMap = {'B': '4px',
                   'b': '2px',
                   'S': '4px',
                   's': '2px'};
    var code39Objs = [];
    var myObj = null;
    
    for( let i = 0; i < code39.length; i++ ) {
        let code = code39[i];
        
        myObj = document.createElement('span');
        myObj.style.borderLeftStyle = 'solid';
        myObj.style.borderRightWidth = '0px';
        myObj.style.borderTopWidth = '0px';
        myObj.style.borderBottomWidth = '0px';
        myObj.style.height = '.5in';
        myObj.style.display = 'inline-block';
        
        myObj.style.borderLeftColor = ( code.toUpperCase() == 'B' ) ? 'black' : 'white';
        myObj.style.borderLeftWidth = sizeMap[code];
        
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
    barcodeContainer.setAttribute('class', 'barcode-container');
    var barcode = document.createElement('div');
    barcode.class = "barcode-code";
    var label = document.createElement('div');
    label.class = "barcode-label"
    var labelText = document.createElement('span');
    labelText.setAttribute('class', 'barcode-label-text');
    var barcodeObjs = GenerateCode39Objects(Encode39(data.toUpperCase()));
    
    barcodeObjs.forEach(function (elem) {
        barcode.appendChild(elem);
    });
    
    labelText.innerHTML = "* " + data + " *";
    label.appendChild(labelText);
    barcodeContainer.appendChild(barcode);
    barcodeContainer.appendChild(label);
    
    return barcodeContainer;
}


