﻿"use strict";

var AscBrowser = {
    userAgent : "",
    isIE : false,
    isMacOs : false,
    isSafariMacOs : false,
    isAppleDevices : false,
    isAndroid : false,
    isMobile : false,
	isMobileVersion : false,
    isGecko : false,
    isChrome : false,
    isOpera : false,
    isWebkit : false,
    isSafari : false,
    isArm : false,
    isMozilla : false,
	isRetina : false
};

// user agent lower case
AscBrowser.userAgent = navigator.userAgent.toLowerCase();

// ie detect
AscBrowser.isIE =  (AscBrowser.userAgent.indexOf("msie") > -1 ||
                    AscBrowser.userAgent.indexOf("trident") > -1);

// macOs detect
AscBrowser.isMacOs = (AscBrowser.userAgent.indexOf('mac') > -1);

// chrome detect
AscBrowser.isChrome = (AscBrowser.userAgent.indexOf("chrome") > -1);

// safari detect
AscBrowser.isSafari = !AscBrowser.isChrome && (AscBrowser.userAgent.indexOf("safari") > -1);

// macOs safari detect
AscBrowser.isSafariMacOs = (AscBrowser.isSafari && AscBrowser.isMacOs);

// apple devices detect
AscBrowser.isAppleDevices = (AscBrowser.userAgent.indexOf("ipad") > -1 ||
                             AscBrowser.userAgent.indexOf("iphone") > -1 ||
                             AscBrowser.userAgent.indexOf("ipod") > -1);

// android devices detect
AscBrowser.isAndroid = (AscBrowser.userAgent.indexOf("android") > -1);

// mobile detect
AscBrowser.isMobile = /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent || navigator.vendor || window.opera);

// gecko detect
AscBrowser.isGecko = (AscBrowser.userAgent.indexOf("gecko/") > -1);

// opera detect
AscBrowser.isOpera = !!window.opera;

// webkit detect
AscBrowser.isWebkit = (AscBrowser.userAgent.indexOf("webkit") > -1);

// arm detect
AscBrowser.isArm = (AscBrowser.userAgent.indexOf("arm") > -1);

AscBrowser.isMozilla = !AscBrowser.isIE && (AscBrowser.userAgent.indexOf("firefox") > -1);

// detect retina (http://habrahabr.ru/post/159419/)
AscBrowser.isRetina = 2 === window.devicePixelRatio;