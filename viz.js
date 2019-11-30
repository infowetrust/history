//  tweet me @infowetrust | www.infowetrust.com
//    __ _  __ ____  _    _   __ ___   _____ ___  _ __  ___ _____
//   / // |/ // __/,' \  ///7/ // _/  /_  _// o |/// /,' _//_  _/
//  / // || // _/ / o | | V V // _/    / / /  ,'/ U /_\ `.  / /  
// /_//_/|_//_/   |_,'  |_n_,'/___/   /_/ /_/`_\\_,'/___,' /_/   
//            
// Copyright 2017, RJ Andrews, All rights reserved.

//loads side panels based on hash url's 
//based on https://stackoverflow.com/questions/6076576
$(window).on('load',function(){
    var hash = (window.location.hash).replace('#', '');
    if (hash.length != 0) {
        $("#"+hash).click();
    }
});

//resize container to fit whole viz in client screen 
//method based on https://stackoverflow.com/questions/14444510/
var containerW;
var containerH;
var containerRatio;

function resizeContainer() {
    var clientW;
    var clientH;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        clientW = window.innerWidth,
        clientH = window.innerHeight
    }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        clientW = document.documentElement.clientWidth,
        clientHeight = document.documentElement.clientHeight
    }
    // older versions of IE
    else {
        clientW = document.getElementsByTagName('body')[0].clientWidth,
        clientH = document.getElementsByTagName('body')[0].clientHeight
    };
    
    clientHH = clientH * 1.5;

    if (clientW > clientHH){
        containerH = clientH;
        containerW = clientH * 1.5;

        /*update Font sizes*/
        containerRatio = containerW / clientW;
        var fontA = containerRatio+"vw";
        var fontB = 1.2*containerRatio+"vw";
        var fontC = 3*containerRatio+"vw";
        var fontD = 3.7*containerRatio+"vw";
        var fontE = 4.5*containerRatio+"vw";
        var fontF = 1.5*containerRatio+"vw";
        var fontG = 1.5*containerRatio+"vw";
        var fontH = 1.25*containerRatio+"vw";
        $(".georgiaS").css("fontSize",fontA);
        $(".palatinoS, .palatinoBI").css("fontSize",fontB);
        $(".garamondS").css("fontSize",fontC);
        $(".garamondL").css("fontSize",fontD);
        $(".garamondXL").css("fontSize",fontE);
        $(".realText").css("fontSize",fontF);
        $(".tagText").css("fontSize",fontG);
        $(".shareText").css("fontSize",fontH);
    }
    else {
        containerH = clientW * 0.667;
        containerW = clientW;
    };
    var div = $('.container');
    div.css('height', containerH+"px");
    div.css('width', containerW+"px");
}

//used to launch side windows
function openSideR() {
    var left = 0.6 * containerW;
    var width = 0.4 * containerW;
    var height = containerH;
    $(".sideR").css("width", width).css("left", left).css("height", height).css("zIndex","8");
}

function openSideL() {
    var width = 0.4 * containerW;
    var height = containerH;
	$(".sideL").css("width", width).css("height", height).css("zIndex","8");
}

var inputData;
var cartoonMetadata;
//loads data
d3.csv("originalWorks.csv", function(csv) {
    console.log('csv from sideText', csv);
    inputData = [].concat(csv);
});

//filters data when cartoon is selected
//method from from https://stackoverflow.com/questions/10615290
function sideText(e){	
	var slugo = $(e).attr('id'); //slugo is the cartoon slug ID
	var filters = {'slug': [slugo],};
    var filteredData = inputData.filter(function(row) {
        // run through all the filters, returning a boolean
        return ['slug' , 'side' , 'original' , 'name' , 'work' , 'workDate' , 'subtitle' , 'paragraph' , 'link','priorSlug','nextSlug','spotTop','spotLeft','tag'].reduce(function(pass, column) {
            return pass && (
                // pass if no filter is set
                !filters[column] ||
                    // pass if the row's value is equal to the filter
                    // (i.e. the filter is set to a string)
                    row[column] === filters[column] ||
                    // pass if the row's value is in an array of filter values
                    filters[column].indexOf(row[column]) >= 0
	                );
	        }, true);
	    })
    //captures filtered data
    cartoonMetadata = filteredData[0];	
    //grabs side panel templates from html id
    var textTemplate = $('#textTemplate').html();
    var tagTemplate = $('#tagTemplate').html();
    var shareTemplate = $('#shareTemplate').html();
    //populates templates with filtered data
	var textInfo = Mustache.to_html(textTemplate, cartoonMetadata);
    	var tagInfo = Mustache.to_html(tagTemplate, cartoonMetadata);
    	var shareInfo = Mustache.to_html(shareTemplate, cartoonMetadata);
    //passes populated template to side panels
	var sideLR = cartoonMetadata["side"];
	$("#sidePanelText"+sideLR).html(textInfo);
    	$("#sidePanelTag"+sideLR).html(tagInfo);
    	$("#sidePanelShare"+sideLR).html(shareInfo);
    //transition spotlight to new cartoon using precalculated coordinates
	var spotTop = cartoonMetadata["spotTop"];
	var spotLeft = cartoonMetadata["spotLeft"];
	$("#spotlight").css("zIndex","5").css("top",spotTop).css("left",spotLeft);
};

//show a different cartoon side panel using nav buttons https://api.jquery.com/click/          
$( ".nextBtn" ).click(function() {
    var next = cartoonMetadata["nextSlug"];
    var sideLR = cartoonMetadata["side"];
    if (next == "close") {
        $(".sideL, .sideR, #spotlight").css("zIndex", "-1");
    } else if (next == "prichard") {
        $(".sideR").css("zIndex", "-1");
        $("#"+next).click();
    } else {
        $("#"+next).click();
    };
});

$( ".priorBtn" ).click(function() {
    var prior = cartoonMetadata["priorSlug"];
    var sideLR = cartoonMetadata["side"];
    if (prior == "close") {
        $(".sideL, .sideR,#spotlight").css("zIndex", "-1");
    } else if (prior == "darwin") {
        $(".sideL").css("zIndex", "-1");
        $("#"+prior).click();
    } else {
        $("#"+prior).click();
    };
});

//link nav buttons to keyboard arrows
//right = next
$(document).keydown(function(e) {
    if (e.keyCode ==39){
        var next = cartoonMetadata["nextSlug"];
        var sideLR = cartoonMetadata["side"];
        $("#sidePanels"+sideLR).css("zIndex", "-1");
        if (next == "close") {
            $(".sideL, .sideR, #spotlight").css("zIndex", "-1");
        } else if (next == "prichard") {
            $(".sideR").css("zIndex", "-1");
            $("#"+next).click();
        } else {
            $("#"+next).click();
        };
    };
});
//left = prior
$(document).keydown(function(e) {
    if (e.keyCode == 37) {
        var prior = cartoonMetadata["priorSlug"];
        var sideLR = cartoonMetadata["side"];
        if (prior == "close") {
            $(".sideL, .sideR,#spotlight").css("zIndex", "-1");
        } else if (prior == "darwin") {
            $(".sideL").css("zIndex", "-1");
            $("#"+prior).click();
        } else {
            $("#"+prior).click();
        };
    };
});

//hides side panels & spotlight when close button or spotlight is clicked
$(document).ready(function(){
    $(".closeBtn, #spotlight").click(function(){
        $(".sideL, .sideR, #spotlight").css("zIndex", "-1");
    });
});

//hides side panel & fog when ESC or 'X' is clicked
$(document).keydown(function(e) {
    if (e.keyCode == 27 || e.keyCode == 88) {
    $(".sideL, .sideR, #spotlight").css("zIndex", "-1");
    }
});


//resizes side panels
$(window).ready(updateHeightF);
$(window).resize(updateHeightF);
function updateHeightF(){
    var div = $('#spotlight');
    var heightF = div.width();    
    div.css('height', heightF);
};

$(window).ready(updateHeightL);
$(window).resize(updateHeightL);
function updateHeightL(){
    var width = 0.4 * containerW;
    var height = containerH; 
    $(".sideL").css("width", width).css("height", height);
};

$(window).ready(updateHeightR);
$(window).resize(updateHeightR);
function updateHeightR()
{
    var left = 0.6 * containerW;
    var width = 0.4 * containerW;
    var height = containerH; 
    $(".sideR").css("width", width).css("left", left).css("height", height);
};
