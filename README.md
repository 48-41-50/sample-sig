This is a sample project written in HTML5 and JavaScript to capture a signature drawn by a user.

NOTE:

    It renders correctly in chrome 43. I did not try cross-browser compatibility. I know it looks terrible on Firefox.

The purpose of this project is an exercise in JavaScript and CSS using a canvas to capture mouse 
events to act as a user drawing area. The context is to capture a signature.

This is a pure HTML5 and JavaScript implementation, however the style sheet base code is in SCSS format 
and was transformed into CSS using koala.

    SASS: http://sass-lang.com/
    Koala: http://koala-app.com/

This was an interesting excercise and I learned a lot. Maybe this can help someone else as well.

This project also includes a version of the barcode-code39.js script as well. 
See: https://github.com/48-41-50/js-barcode

This is provided without warranty of any kind.

Contents:

    samplesig.html       : Sample html file filled to the gills with lorem ipsum and defines 
                           some of the base elements for the sample app.
    httpserver.py        : VERY SIMPLE SERVER here only to leverage the GET requests for the css and js resources.
                           It runs under python 2.7.x. You will need to convert it to run under python3.
    css/samplesig.css    : Actual CSS code used by the browser.
    css/samplesig.scss   : SCSS base code. 
    js/samplesig.js      : JavaScript code for the sample app.
    js/barcode-code39.js : JavaScript code specifically for generating Code 39 barcodes.
    cookies.js           : JavaScript code for managing cookie data. (Found the examples on various web pages)
