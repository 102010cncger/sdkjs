/*
 *
 * (c) Copyright Ascensio System Limited 2010-2016
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7  3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7  3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/

var editor = undefined;
var window = {};
var navigator = {};
navigator.userAgent = "chrome";
window.navigator = navigator;
window.location = {};

window.location.protocol = "";
window.location.host = "";
window.location.href = "";

window.NATIVE_EDITOR_ENJINE = true;
window.NATIVE_EDITOR_ENJINE_SYNC_RECALC = true;
window.IS_NATIVE_EDITOR = true;

var document = {};
window.document = document;

var History = {};

//-------------------------------------------------------------------------------------------------
aStandartNumFormats = [];
aStandartNumFormats[0] = "General";
aStandartNumFormats[1] = "0";
aStandartNumFormats[2] = "0.00";
aStandartNumFormats[3] = "#,##0";
aStandartNumFormats[4] = "#,##0.00";
aStandartNumFormats[9] = "0%";
aStandartNumFormats[10] = "0.00%";
aStandartNumFormats[11] = "0.00E+00";
aStandartNumFormats[12] = "# ?/?";
aStandartNumFormats[13] = "# ??/??";
aStandartNumFormats[14] = "m/d/yyyy";
aStandartNumFormats[15] = "d-mmm-yy";
aStandartNumFormats[16] = "d-mmm";
aStandartNumFormats[17] = "mmm-yy";
aStandartNumFormats[18] = "h:mm AM/PM";
aStandartNumFormats[19] = "h:mm:ss AM/PM";
aStandartNumFormats[20] = "h:mm";
aStandartNumFormats[21] = "h:mm:ss";
aStandartNumFormats[22] = "m/d/yyyy h:mm";
aStandartNumFormats[37] = "#,##0_);(#,##0)";
aStandartNumFormats[38] = "#,##0_);[Red](#,##0)";
aStandartNumFormats[39] = "#,##0.00_);(#,##0.00)";
aStandartNumFormats[40] = "#,##0.00_);[Red](#,##0.00)";
aStandartNumFormats[45] = "mm:ss";
aStandartNumFormats[46] = "[h]:mm:ss";
aStandartNumFormats[47] = "mm:ss.0";
aStandartNumFormats[48] = "##0.0E+0";
aStandartNumFormats[49] = "@";
aStandartNumFormatsId = {};
for(var i in aStandartNumFormats) {
    aStandartNumFormatsId[aStandartNumFormats[i]] = i - 0;
}
//-------------------------------------------------------------------------------------------------

function ConvertJSC_Array(_array) {
    var _len = _array.length;
    var ret = new Uint8Array(_len);
    for (var i = 0; i < _len; i++)
        ret[i] = _array.getAt(i);
    return ret;
}
function Image() {
    this.src = "";
    this.onload = function()
    {
    }
    this.onerror = function()
    {
    }
}
function _image_data() {
    this.data = null;
    this.length = 0;
}

function native_pattern_fill() {
}
native_pattern_fill.prototype = {
    setTransform : function(transform) {}
};

function native_gradient_fill() {
}
native_gradient_fill.prototype = {
    addColorStop : function(offset,color) {}
};

function native_context2d(parent) {
    this.canvas = parent;

    this.globalAlpha = 0;
    this.globalCompositeOperation = "";
    this.fillStyle = "";
    this.strokeStyle = "";

    this.lineWidth = 0;
    this.lineCap = 0;
    this.lineJoin = 0;
    this.miterLimit = 0;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.shadowBlur = 0;
    this.shadowColor = 0;
    this.font = "";
    this.textAlign = 0;
    this.textBaseline = 0;
}
native_context2d.prototype = {
    save : function() {},
    restore : function() {},

    scale : function(x,y) {},
    rotate : function(angle) {},
    translate : function(x,y) {},
    transform : function(m11,m12,m21,m22,dx,dy) {},
    setTransform : function(m11,m12,m21,m22,dx,dy) {},

    createLinearGradient : function(x0,y0,x1,y1) { return new native_gradient_fill(); },
    createRadialGradient : function(x0,y0,r0,x1,y1,r1) { return null; },
    createPattern : function(image,repetition) { return new native_pattern_fill(); },

    clearRect : function(x,y,w,h) {},
    fillRect : function(x,y,w,h) {},
    strokeRect : function(x,y,w,h) {},

    beginPath : function() {},
    closePath : function() {},
    moveTo : function(x,y) {},
    lineTo : function(x,y) {},
    quadraticCurveTo : function(cpx,cpy,x,y) {},
    bezierCurveTo : function(cp1x,cp1y,cp2x,cp2y,x,y) {},
    arcTo : function(x1,y1,x2,y2,radius) {},
    rect : function(x,y,w,h) {},
    arc : function(x,y,radius,startAngle,endAngle,anticlockwise) {},

    fill : function() {},
    stroke : function() {},
    clip : function() {},
    isPointInPath : function(x,y) {},
    drawFocusRing : function(element,xCaret,yCaret,canDrawCustom) {},

    fillText : function(text,x,y,maxWidth) {},
    strokeText : function(text,x,y,maxWidth) {},
    measureText : function(text) {},

    drawImage : function(img_elem,dx_or_sx,dy_or_sy,dw_or_sw,dh_or_sh,dx,dy,dw,dh) {},

    createImageData : function(imagedata_or_sw,sh)
    {
        var _data = new _image_data();
        _data.length = imagedata_or_sw * sh * 4;
        _data.data = (typeof(Uint8Array) != 'undefined') ? new Uint8Array(_data.length) : new Array(_data.length);
        return _data;
    },
    getImageData : function(sx,sy,sw,sh) {},
    putImageData : function(image_data,dx,dy,dirtyX,dirtyY,dirtyWidth,dirtyHeight) {}
};

function native_canvas()
{
    this.id = "";
    this.width = 300;
    this.height = 150;

    this.nodeType = 1;
}
native_canvas.prototype =
{
    getContext : function(type)
    {
        if (type == "2d")
            return new native_context2d(this);
        return null;
    },

    toDataUrl : function(type)
    {
        return "";
    },

    addEventListener : function()
    {
    },

    attr : function()
    {
    }
};

window["Asc"] = {};

var _null_object = {};
_null_object.length = 0;
_null_object.nodeType = 1;
_null_object.offsetWidth = 1;
_null_object.offsetHeight = 1;
_null_object.clientWidth = 1;
_null_object.clientHeight = 1;
_null_object.scrollWidth = 1;
_null_object.scrollHeight = 1;
_null_object.style = {};
_null_object.documentElement = _null_object;
_null_object.body = _null_object;
_null_object.ownerDocument = _null_object;
_null_object.defaultView = _null_object;

_null_object.addEventListener = function(){};
_null_object.setAttribute = function(){};
_null_object.getElementsByTagName = function() { return []; };
_null_object.appendChild = function() {};
_null_object.removeChild = function() {};
_null_object.insertBefore = function() {};
_null_object.childNodes = [];
_null_object.parent = _null_object;
_null_object.parentNode = _null_object;
_null_object.find = function() { return this; };
_null_object.appendTo = function() { return this; };
_null_object.css = function() { return this; };
_null_object.width = function() { return 1; };
_null_object.height = function() { return 1; };
_null_object.attr = function() { return this; };
_null_object.prop = function() { return this; };
_null_object.val = function() { return this; };
_null_object.remove = function() {};
_null_object.getComputedStyle = function() { return null; };
_null_object.getContext = function(type) {
    if (type == "2d")
        return new native_context2d(this);
    return null;
};

window._null_object = _null_object;

document.createElement = function(type) {
    if (type && type.toLowerCase)
    {
        if (type.toLowerCase() == "canvas")
            return new native_canvas();
    }

    return _null_object;
};

function _return_empty_html_element() { return _null_object; }

document.createDocumentFragment = _return_empty_html_element;
document.getElementsByTagName = function(tag) {
    var ret = [];
    if ("head" == tag)
        ret.push(_null_object);
    return ret;
};
document.insertBefore = function() {};
document.appendChild = function() {};
document.removeChild = function() {};
document.getElementById = function() { return _null_object; };
document.createComment = function() { return undefined; };

document.documentElement = _null_object;
document.body = _null_object;

var native = CreateNativeEngine();
window.native = native;
window["native"] = native;

function GetNativeEngine() {
    return window.native;
}

var native_renderer = null;
var _api = null;
var Asc = window["Asc"];

function NativeOpenFileData(data, version) {
    window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();

    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["asc_docs_api"]("");
        _api.asc_nativeOpenFile(data, version);
    }
    else
    {
        _api = new window["Asc"]["spreadsheet_api"]();
        _api.asc_nativeOpenFile(data, version);
    }
}
function NativeOpenFile(arguments) {
    window["CreateMainTextMeasurerWrapper"]();

    var doc_bin = window.native.GetFileString(window.native.GetFilePath());
    window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();

    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["asc_docs_api"]("");
        _api.asc_nativeOpenFile(doc_bin);
    }
    else
    {
        _api = new window["Asc"]["spreadsheet_api"]();
        _api.asc_nativeOpenFile(doc_bin);
    }
}
function NativeOpenFile2(_params) {
    window["CreateMainTextMeasurerWrapper"]();

    window.g_file_path = "native_open_file";
    window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();
    var doc_bin = window.native.GetFileString(window.g_file_path);
    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api = new window["asc_docs_api"]("");

        if (undefined !== _api.Native_Editor_Initialize_Settings)
        {
            _api.Native_Editor_Initialize_Settings(_params);
        }

        _api.asc_nativeOpenFile(doc_bin);

        if (_api.NativeAfterLoad)
            _api.NativeAfterLoad();
    }
    else
    {
        _api = new window["Asc"]["spreadsheet_api"]();
        _api.asc_nativeOpenFile(doc_bin);
    }
}
function NativeCalculateFile() {
    _api.asc_nativeCalculateFile();
}
function NativeApplyChangesData(data, isFull) {
    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        _api.asc_nativeApplyChanges2(data, isFull);
    }
    else
    {
        _api.asc_nativeApplyChanges2(data, isFull);
    }
}
function NativeApplyChanges() {
    if (window.NATIVE_DOCUMENT_TYPE == "presentation" || window.NATIVE_DOCUMENT_TYPE == "document")
    {
        var __changes = [];
        var _count_main = window.native.GetCountChanges();
        for (var i = 0; i < _count_main; i++)
        {
            var _changes_file = window.native.GetChangesFile(i);
            var _changes = JSON.parse(window.native.GetFileString(_changes_file));

            for (var j = 0; j < _changes.length; j++)
            {
                __changes.push(_changes[j]);
            }
        }
        _api.asc_nativeApplyChanges(__changes);
    }
    else
    {
        var __changes = [];
        var _count_main = window.native.GetCountChanges();
        for (var i = 0; i < _count_main; i++)
        {
            var _changes_file = window.native.GetChangesFile(i);
            var _changes = JSON.parse(window.native.GetFileString(_changes_file));

            for (var j = 0; j < _changes.length; j++)
            {
                __changes.push(_changes[j]);
            }
        }

        _api.asc_nativeApplyChanges(__changes);
    }
}
function NativeGetFileString() {
    return _api.asc_nativeGetFile();
}
function NativeGetFileData() {
    return _api.asc_nativeGetFileData();
}
function GetNativeCountPages() {
    return _api.asc_nativePrintPagesCount();
}

window.memory1 = null;
window.memory2 = null;

function GetNativePageBase64(pageIndex) {
    if (null == window.memory1)
        window.memory1 = CreateNativeMemoryStream();
    else
        window.memory1.ClearNoAttack();

    if (null == window.memory2)
        window.memory2 = CreateNativeMemoryStream();
    else
        window.memory2.ClearNoAttack();

    if (native_renderer == null)
    {
        native_renderer = _api.asc_nativeCheckPdfRenderer(window.memory1, window.memory2);
    }
    else
    {
        window.memory1.ClearNoAttack();
        window.memory2.ClearNoAttack();
    }

    _api.asc_nativePrint(native_renderer, pageIndex);
    return window.memory1;
}
function GetNativePageMeta(pageIndex) {
    return _api.GetNativePageMeta(pageIndex);
}
function GetNativeId() {
    return window.native.GetFileId();
}

// для работы с таймерами
window.NativeSupportTimeouts = false;
window.NativeTimeoutObject = {};

function clearTimeout(_id) {
    if (!window.NativeSupportTimeouts)
        return;

    window.NativeTimeoutObject["" + _id] = undefined;
    window.native["ClearTimeout"](_id);
}
function setTimeout(func, interval) {
    if (!window.NativeSupportTimeouts)
        return;

    var _id = window.native["GenerateTimeoutId"](interval);
    window.NativeTimeoutObject["" + _id] = func;
    return _id;
}
function offline_timeoutFire(_id) {
    if (!window.NativeSupportTimeouts)
        return;

    var _prop = "" + _id;
    var _func = window.NativeTimeoutObject[_prop];
    window.NativeTimeoutObject[_prop] = undefined;

    if (!_func)
        return;

    _func.call(null);
    _func = null;
}
function clearInterval(_id) {
    if (!window.NativeSupportTimeouts)
        return;

    window.NativeTimeoutObject["" + _id] = undefined;
    window.native["ClearTimeout"](_id);
}
function setInterval(func, interval) {
    if (!window.NativeSupportTimeouts)
        return;

    var _intervalFunc = function()
    {
        func.call(null);
        setTimeout(func, interval);
    };

    var _id = window.native["GenerateTimeoutId"](interval);
    window.NativeTimeoutObject["" + _id] = _intervalFunc;
    return _id;
}

window.clearTimeout = clearTimeout;
window.setTimeout = setTimeout;
window.clearInterval = clearInterval;
window.setInterval = setInterval;

var console = {
    log : function(param) { window.native.consoleLog(param); }
};

window["NativeCorrectImageUrlOnPaste"] = function(url) {
    return window["native"]["CorrectImageUrlOnPaste"](url);
};
window["NativeCorrectImageUrlOnCopy"] = function(url) {
    return window["native"]["CorrectImageUrlOnCopy"](url);
};

// FT_Common
function _FT_Common() {
    this.UintToInt = function(v)
    {
        return (v>2147483647)?v-4294967296:v;
    };
    this.UShort_To_Short = function(v)
    {
        return (v>32767)?v-65536:v;
    };
    this.IntToUInt = function(v)
    {
        return (v<0)?v+4294967296:v;
    };
    this.Short_To_UShort = function(v)
    {
        return (v<0)?v+65536:v;
    };
    this.memset = function(d,v,s)
    {
        for (var i=0;i<s;i++)
            d[i]=v;
    };
    this.memcpy = function(d,s,l)
    {
        for (var i=0;i<l;i++)
            d[i]=s[i];
    };
    this.memset_p = function(d,v,s)
    {
        var _d = d.data;
        var _e = d.pos+s;
        for (var i=d.pos;i<_e;i++)
            _d[i]=v;
    };
    this.memcpy_p = function(d,s,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _d2=s.data;
        var _p2=s.pos;
        for (var i=0;i<l;i++)
            _d1[_p1++]=_d2[_p2++];
    };
    this.memcpy_p2 = function(d,s,p,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _p2=p;
        for (var i=0;i<l;i++)
            _d1[_p1++]=s[_p2++];
    };
    this.realloc = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = memory.Alloc(new_count);
        }
        else
        {
            var block2 = memory.Alloc(new_count);
            FT_Common.memcpy_p(block2, pointer, cur_count);
            ret.block = block2;
        }
        return ret;
    };

    this.realloc_long = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = CreateIntArray(new_count);
        }
        else
        {
            var block2 = CreateIntArray(new_count);
            for (var i = 0; i < cur_count; i++)
                block2[i] = pointer[i];

            ret.block = block2;
        }
        return ret;
    };
}

//--------------------------------------------------------------------------------
// font engine
//--------------------------------------------------------------------------------
var FONT_ITALIC_ANGLE = 0.3090169943749;
var FT_ENCODING_UNICODE = 1970170211;
var FT_ENCODING_NONE = 0;
var FT_ENCODING_MS_SYMBOL = 1937337698;
var FT_ENCODING_APPLE_ROMAN = 1634889070;

var LOAD_MODE = 40970;
var REND_MODE = 0;

var FontStyle = {
    FontStyleRegular:    0,
    FontStyleBold:       1,
    FontStyleItalic:     2,
    FontStyleBoldItalic: 3,
    FontStyleUnderline:  4,
    FontStyleStrikeout:  8
};
var EGlyphState = {
    glyphstateNormal:   0,
    glyphstateDeafault: 1,
    glyphstateMiss:     2
};

function CPoint1() {
    this.fX = 0;
    this.fY = 0;
    this.fWidth = 0;
    this.fHeight = 0;
}
function CPoint2() {
    this.fLeft = 0;
    this.fTop = 0;
    this.fRight = 0;
    this.fBottom = 0;
}
function CPosition( obj ) {
    if (obj)
    {
        this.X = (undefined == obj.X) ? null : obj.X;
        this.Y = (undefined == obj.Y) ? null : obj.Y;
    }
    else
    {
        this.X = null;
        this.Y = null;
    }
}
CPosition.prototype.get_X = function() { return this.X; };
CPosition.prototype.put_X = function(v) { this.X = v; };
CPosition.prototype.get_Y = function() { return this.Y; };
CPosition.prototype.put_Y = function(v) { this.Y = v; };
function CFontManager() {
    this.m_oLibrary = {};
    this.Initialize = function(){};
    this.ClearFontsRasterCache = function(){};
}

window["use_native_fonts_only"] = true;
window["ftm"] = FT_Memory;

// FT_Common
function _FT_Common() {
    this.UintToInt = function(v)
    {
        return (v>2147483647)?v-4294967296:v;
    };
    this.UShort_To_Short = function(v)
    {
        return (v>32767)?v-65536:v;
    };
    this.IntToUInt = function(v)
    {
        return (v<0)?v+4294967296:v;
    };
    this.Short_To_UShort = function(v)
    {
        return (v<0)?v+65536:v;
    };
    this.memset = function(d,v,s)
    {
        for (var i=0;i<s;i++)
            d[i]=v;
    };
    this.memcpy = function(d,s,l)
    {
        for (var i=0;i<l;i++)
            d[i]=s[i];
    };
    this.memset_p = function(d,v,s)
    {
        var _d = d.data;
        var _e = d.pos+s;
        for (var i=d.pos;i<_e;i++)
            _d[i]=v;
    };
    this.memcpy_p = function(d,s,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _d2=s.data;
        var _p2=s.pos;
        for (var i=0;i<l;i++)
            _d1[_p1++]=_d2[_p2++];
    };
    this.memcpy_p2 = function(d,s,p,l)
    {
        var _d1=d.data;
        var _p1=d.pos;
        var _p2=p;
        for (var i=0;i<l;i++)
            _d1[_p1++]=s[_p2++];
    };
    this.realloc = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = memory.Alloc(new_count);
        }
        else
        {
            var block2 = memory.Alloc(new_count);
            FT_Common.memcpy_p(block2, pointer, cur_count);
            ret.block = block2;
        }
        return ret;
    };

    this.realloc_long = function(memory, pointer, cur_count, new_count)
    {
        var ret = { block: null, err : 0, size : new_count};
        if (cur_count < 0 || new_count < 0)
        {
            /* may help catch/prevent nasty security issues */
            ret.err = 6;
        }
        else if (new_count == 0)
        {
            ret.block = null;
        }
        else if (cur_count == 0)
        {
            ret.block = CreateIntArray(new_count);
        }
        else
        {
            var block2 = CreateIntArray(new_count);
            for (var i = 0; i < cur_count; i++)
                block2[i] = pointer[i];

            ret.block = block2;
        }
        return ret;
    };
}
var FT_Common = new _FT_Common();

var global_memory_stream_menu = CreateNativeMemoryStream();

function asc_menu_ReadColor(_params, _cursor) {
    var _color = new asc_CColor();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _color.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _color.r = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _color.g = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _color.b = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _color.a = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _color.Auto = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _color.value = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _color.ColorSchemeId = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                var _count = _params[_cursor.pos++];
                for (var i = 0; i < _count; i++)
                {
                    var _mod = new CColorMod();
                    _mod.name = _params[_cursor.pos++];
                    _mod.val = _params[_cursor.pos++];
                    _color.Mods.push(_mod);
                }
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _color;
}
function asc_menu_WriteColor(_type, _color, _stream) {
    if (!_color)
        return;

    _stream["WriteByte"](_type);

    if (_color.type !== undefined && _color.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_color.type);
    }
    if (_color.r !== undefined && _color.r !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteByte"](_color.r);
    }
    if (_color.g !== undefined && _color.g !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteByte"](_color.g);
    }
    if (_color.b !== undefined && _color.b !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteByte"](_color.b);
    }
    if (_color.a !== undefined && _color.a !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteByte"](_color.a);
    }
    if (_color.Auto !== undefined && _color.Auto !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_color.Auto);
    }
    if (_color.value !== undefined && _color.value !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteLong"](_color.value);
    }
    if (_color.ColorSchemeId !== undefined && _color.ColorSchemeId !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](_color.ColorSchemeId);
    }
    if (_color.Mods !== undefined && _color.Mods !== null)
    {
        _stream["WriteByte"](8);

        var _len = _color.Mods.length;
        _stream["WriteLong"](_len);

        for (var i = 0; i < _len; i++)
        {
            _stream["WriteString1"](_color.Mods[i].name);
            _stream["WriteLong"](_color.Mods[i].val);
        }
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadFontFamily(_params, _cursor){
    var _fontfamily = { Name : undefined, Index : -1 };
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fontfamily.Name = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fontfamily.Index = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _fontfamily;
}
function asc_menu_WriteFontFamily(_type, _family, _stream) {
    if (!_family)
        return;

    _stream["WriteByte"](_type);

    if (_family.Name !== undefined && _family.Name !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteString2"](_family.Name);
    }
    if (_family.Index !== undefined && _family.Index !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_family.Index);
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadAscFill_solid(_params, _cursor){
    var _fill = new asc_CFillSolid();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.color = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _fill;
}
function asc_menu_WriteAscFill_solid(_type, _fill, _stream){
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    asc_menu_WriteColor(0, _fill.color, _stream);

    _stream["WriteByte"](255);
}
function asc_menu_ReadAscFill_patt(_params, _cursor){
    var _fill = new asc_CFillHatch();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.PatternType = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fill.bgClr = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 2:
            {
                _fill.fgClr = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _fill;
}
function asc_menu_WriteAscFill_patt(_type, _fill, _stream){
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    if (_fill.PatternType !== undefined && _fill.PatternType !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_fill.PatternType);
    }

    asc_menu_WriteColor(1, _fill.bgClr, _stream);
    asc_menu_WriteColor(2, _fill.fgClr, _stream);

    _stream["WriteByte"](255);
}
function asc_menu_ReadAscFill_grad(_params, _cursor){
    var _fill = new asc_CFillGrad();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.GradType = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fill.LinearAngle = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _fill.LinearScale = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _fill.PathType = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                var _count = _params[_cursor.pos++];

                if (_count > 0)
                {
                    _fill.Colors = [];
                    _fill.Positions = [];
                }
                for (var i = 0; i < _count; i++)
                {
                    _fill.Colors[i] = null;
                    _fill.Positions[i] = null;

                    var _continue2 = true;
                    while (_continue2)
                    {
                        var _attr2 = _params[_cursor.pos++];
                        switch (_attr2)
                        {
                            case 0:
                            {
                                _fill.Colors[i] = asc_menu_ReadColor(_params, _cursor);
                                break;
                            }
                            case 1:
                            {
                                _fill.Positions[i] = _params[_cursor.pos++];
                                break;
                            }
                            case 255:
                            default:
                            {
                                _continue2 = false;
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _fill;
}
function asc_menu_WriteAscFill_grad(_type, _fill, _stream){
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    if (_fill.GradType !== undefined && _fill.GradType !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_fill.GradType);
    }

    if (_fill.LinearAngle !== undefined && _fill.LinearAngle !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_fill.LinearAngle);
    }

    if (_fill.LinearScale !== undefined && _fill.LinearScale !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteBool"](_fill.LinearScale);
    }

    if (_fill.PathType !== undefined && _fill.PathType !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_fill.PathType);
    }

    if (_fill.Colors !== null && _fill.Colors !== undefined && _fill.Positions !== null && _fill.Positions !== undefined)
    {
        if (_fill.Colors.length == _fill.Positions.length)
        {
            var _count = _fill.Colors.length;
            _stream["WriteByte"](4);
            _stream["WriteLong"](_count);

            for (var i = 0; i < _count; i++)
            {
                asc_menu_WriteColor(0, _fill.Colors[i], _stream);

                if (_fill.Positions[i] !== undefined && _fill.Positions[i] !== null)
                {
                    _stream["WriteByte"](1);
                    _stream["WriteDouble2"](_fill.Positions[i]);
                }

                _stream["WriteByte"](255);
            }
        }
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadAscFill_blip(_params, _cursor){
    var _fill = new asc_CFillBlip();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _fill.url = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _fill.texture_id = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _fill;
}
function asc_menu_WriteAscFill_blip(_type, _fill, _stream){
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    if (_fill.type !== undefined && _fill.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_fill.type);
    }

    if (_fill.url !== undefined && _fill.url !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteString2"](_fill.url);
    }

    if (_fill.texture_id !== undefined && _fill.texture_id !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_fill.texture_id);
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadAscFill(_params, _cursor){
    var _fill = new asc_CShapeFill();

    //_fill.type = c_oAscFill.FILL_TYPE_NOFILL;
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _fill.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                switch (_fill.type)
                {
                    case c_oAscFill.FILL_TYPE_SOLID:
                    {
                        _fill.fill = asc_menu_ReadAscFill_solid(_params, _cursor);
                        break;
                    }
                    case c_oAscFill.FILL_TYPE_PATT:
                    {
                        _fill.fill = asc_menu_ReadAscFill_patt(_params, _cursor);
                        break;
                    }
                    case c_oAscFill.FILL_TYPE_GRAD:
                    {
                        _fill.fill = asc_menu_ReadAscFill_grad(_params, _cursor);
                        break;
                    }
                    case c_oAscFill.FILL_TYPE_BLIP:
                    {
                        _fill.fill = asc_menu_ReadAscFill_blip(_params, _cursor);
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case 2:
            {
                _fill.transparent = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _fill;

}
function asc_menu_WriteAscFill(_type, _fill, _stream){
    if (!_fill)
        return;

    _stream["WriteByte"](_type);

    if (_fill.type !== undefined && _fill.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_fill.type);
    }

    if (_fill.fill !== undefined && _fill.fill !== null)
    {
        switch (_fill.type)
        {
            case c_oAscFill.FILL_TYPE_SOLID:
            {
                _fill.fill = asc_menu_WriteAscFill_solid(1, _fill.fill, _stream);
                break;
            }
            case c_oAscFill.FILL_TYPE_PATT:
            {
                _fill.fill = asc_menu_ReadAscFill_patt(1, _fill.fill, _stream);
                break;
            }
            case c_oAscFill.FILL_TYPE_GRAD:
            {
                _fill.fill = asc_menu_ReadAscFill_grad(1, _fill.fill, _stream);
                break;
            }
            case c_oAscFill.FILL_TYPE_BLIP:
            {
                _fill.fill = asc_menu_ReadAscFill_blip(1, _fill.fill, _stream);
                break;
            }
            default:
                break;
        }
    }

    if (_fill.transparent !== undefined && _fill.transparent !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_fill.transparent);
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadAscStroke(_params, _cursor){
    var _stroke = new asc_CStroke();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _stroke.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _stroke.width = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _stroke.color = asc_menu_ReadColor(_params, _cursor);
                break;
            }
            case 3:
            {
                _stroke.LineJoin = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _stroke.LineCap = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _stroke.LineBeginStyle = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _stroke.LineBeginSize = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _stroke.LineEndStyle = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                _stroke.LineEndSize = _params[_cursor.pos++];
                break;
            }
            case 9:
            {
                _stroke.canChangeArrows = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _stroke;
}
function asc_menu_WriteAscStroke(_type, _stroke, _stream){
    if (!_stroke)
        return;

    _stream["WriteByte"](_type);

    if (_stroke.type !== undefined && _stroke.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_stroke.type);
    }
    if (_stroke.width !== undefined && _stroke.width !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_stroke.width);
    }

    asc_menu_WriteColor(2, _stroke.color, _stream);

    if (_stroke.LineJoin !== undefined && _stroke.LineJoin !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteByte"](_stroke.LineJoin);
    }
    if (_stroke.LineCap !== undefined && _stroke.LineCap !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteByte"](_stroke.LineCap);
    }
    if (_stroke.LineBeginStyle !== undefined && _stroke.LineBeginStyle !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteByte"](_stroke.LineBeginStyle);
    }
    if (_stroke.LineBeginSize !== undefined && _stroke.LineBeginSize !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteByte"](_stroke.LineBeginSize);
    }
    if (_stroke.LineEndStyle !== undefined && _stroke.LineEndStyle !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteByte"](_stroke.LineEndStyle);
    }
    if (_stroke.LineEndSize !== undefined && _stroke.LineEndSize !== null)
    {
        _stream["WriteByte"](8);
        _stream["WriteByte"](_stroke.LineEndSize);
    }

    if (_stroke.canChangeArrows !== undefined && _stroke.canChangeArrows !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteBool"](_stroke.canChangeArrows);
    }

    _stream["WriteByte"](255);

}
function asc_menu_ReadPaddings(_params, _cursor){
    var _paddings = new asc_CPaddings();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _paddings.Left = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _paddings.Top = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _paddings.Right = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _paddings.Bottom = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _paddings;
}
function asc_menu_WritePaddings(_type, _paddings, _stream){
    if (!_paddings)
        return;

    _stream["WriteByte"](_type);

    if (_paddings.Left !== undefined && _paddings.Left !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteDouble2"](_paddings.Left);
    }
    if (_paddings.Top !== undefined && _paddings.Top !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_paddings.Top);
    }
    if (_paddings.Right !== undefined && _paddings.Right !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_paddings.Right);
    }
    if (_paddings.Bottom !== undefined && _paddings.Bottom !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteDouble2"](_paddings.Bottom);
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadPosition(_params, _cursor){
    var _position = new CPosition();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _position.X = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _position.Y = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _position;
}
function asc_menu_WritePosition(_type, _position, _stream){
    if (!_position)
        return;

    _stream["WriteByte"](_type);

    if (_position.X !== undefined && _position.X !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteDouble2"](_position.X);
    }
    if (_position.Y !== undefined && _position.Y !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_position.Y);
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadImagePosition(_params, _cursor){
    var _position = new CPosition();
    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _position.RelativeFrom = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _position.UseAlign = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _position.Align = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _position.Value = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }
    return _position;
}
function asc_menu_WriteImagePosition(_type, _position, _stream){
    if (!_position)
        return;

    _stream["WriteByte"](_type);

    if (_position.RelativeFrom !== undefined && _position.RelativeFrom !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_position.RelativeFrom);
    }
    if (_position.UseAlign !== undefined && _position.UseAlign !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteBool"](_position.UseAlign);
    }
    if (_position.Align !== undefined && _position.Align !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_position.Align);
    }
    if (_position.Value !== undefined && _position.Value !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_position.Value);
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadAscValAxisSettings(_params, _cursor){
    var _settings = new asc_ValAxisSettings();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.minValRule = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _settings.minVal = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _settings.maxValRule = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _settings.maxVal = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _settings.invertValOrder = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _settings.logScale = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _settings.logBase = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _settings.dispUnitsRule = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                _settings.units = _params[_cursor.pos++];
                break;
            }
            case 9:
            {
                _settings.showUnitsOnChart = _params[_cursor.pos++];
                break;
            }
            case 10:
            {
                _settings.majorTickMark = _params[_cursor.pos++];
                break;
            }
            case 11:
            {
                _settings.minorTickMark = _params[_cursor.pos++];
                break;
            }
            case 12:
            {
                _settings.tickLabelsPos = _params[_cursor.pos++];
                break;
            }
            case 13:
            {
                _settings.crossesRule = _params[_cursor.pos++];
                break;
            }
            case 14:
            {
                _settings.crosses = _params[_cursor.pos++];
                break;
            }
            case 15:
            {
                _settings.axisType = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _settings;
}
function asc_menu_WriteAscValAxisSettings(_type, _settings, _stream){
    if (!_settings)
        return;

    _stream["WriteByte"](_type);

    if (_settings.minValRule !== undefined && _settings.minValRule !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_settings.minValRule);
    }
    if (_settings.minVal !== undefined && _settings.minVal !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_settings.minVal);
    }
    if (_settings.maxValRule !== undefined && _settings.maxValRule !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_settings.maxValRule);
    }
    if (_settings.maxVal !== undefined && _settings.maxVal !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_settings.maxVal);
    }
    if (_settings.invertValOrder !== undefined && _settings.invertValOrder !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteBool"](_settings.invertValOrder);
    }
    if (_settings.logScale !== undefined && _settings.logScale !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_settings.logScale);
    }
    if (_settings.logBase !== undefined && _settings.logBase !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteLong"](_settings.logBase);
    }
    if (_settings.dispUnitsRule !== undefined && _settings.dispUnitsRule !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](_settings.dispUnitsRule);
    }
    if (_settings.units !== undefined && _settings.units !== null)
    {
        _stream["WriteByte"](8);
        _stream["WriteLong"](_settings.units);
    }
    if (_settings.showUnitsOnChart !== undefined && _settings.showUnitsOnChart !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteBool"](_settings.showUnitsOnChart);
    }
    if (_settings.majorTickMark !== undefined && _settings.majorTickMark !== null)
    {
        _stream["WriteByte"](10);
        _stream["WriteLong"](_settings.majorTickMark);
    }
    if (_settings.minorTickMark !== undefined && _settings.minorTickMark !== null)
    {
        _stream["WriteByte"](11);
        _stream["WriteLong"](_settings.minorTickMark);
    }
    if (_settings.tickLabelsPos !== undefined && _settings.tickLabelsPos !== null)
    {
        _stream["WriteByte"](12);
        _stream["WriteLong"](_settings.tickLabelsPos);
    }
    if (_settings.crossesRule !== undefined && _settings.crossesRule !== null)
    {
        _stream["WriteByte"](13);
        _stream["WriteLong"](_settings.crossesRule);
    }
    if (_settings.crosses !== undefined && _settings.crosses !== null)
    {
        _stream["WriteByte"](14);
        _stream["WriteLong"](_settings.crosses);
    }
    if (_settings.axisType !== undefined && _settings.axisType !== null)
    {
        _stream["WriteByte"](15);
        _stream["WriteLong"](_settings.axisType);
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadChartPr(_params, _cursor){
    var _settings = new asc_ChartSettings();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.style = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _settings.title = _params[_cursor.pos++];
                break;
            }
            case 2:
            {
                _settings.rowCols = _params[_cursor.pos++];
                break;
            }
            case 3:
            {
                _settings.horAxisLabel = _params[_cursor.pos++];
                break;
            }
            case 4:
            {
                _settings.vertAxisLabel = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _settings.legendPos = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _settings.dataLabelsPos = _params[_cursor.pos++];
                break;
            }
            case 7:
            {
                _settings.horAx = _params[_cursor.pos++];
                break;
            }
            case 8:
            {
                _settings.vertAx = _params[_cursor.pos++];
                break;
            }
            case 9:
            {
                _settings.horGridLines = _params[_cursor.pos++];
                break;
            }
            case 10:
            {
                _settings.vertGridLines = _params[_cursor.pos++];
                break;
            }
            case 11:
            {
                _settings.type = _params[_cursor.pos++];
                break;
            }
            case 12:
            {
                _settings.showSerName = _params[_cursor.pos++];
                break;
            }
            case 13:
            {
                _settings.showCatName = _params[_cursor.pos++];
                break;
            }
            case 14:
            {
                _settings.showVal = _params[_cursor.pos++];
                break;
            }
            case 15:
            {
                _settings.separator = _params[_cursor.pos++];
                break;
            }
            case 16:
            {
                _settings.horAxisProps = asc_menu_ReadAscValAxisSettings(_params, _cursor);
                break;
            }
            case 17:
            {
                _settings.vertAxisProps = asc_menu_ReadAscValAxisSettings(_params, _cursor);
                break;
            }
            case 18:
            {
                _settings.range = _params[_cursor.pos++];
                break;
            }
            case 19:
            {
                _settings.inColumns = _params[_cursor.pos++];
                break;
            }
            case 20:
            {
                _settings.showMarker = _params[_cursor.pos++];
                break;
            }
            case 21:
            {
                _settings.bLine = _params[_cursor.pos++];
                break;
            }
            case 22:
            {
                _settings.smooth = _params[_cursor.pos++];
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _settings;
}
function asc_menu_WriteChartPr(_type, _chartPr, _stream){
    if (!_chartPr)
        return;

    _stream["WriteByte"](_type);

    if (_chartPr.style !== undefined && _chartPr.style !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteLong"](_chartPr.style);
    }
    if (_chartPr.title !== undefined && _chartPr.title !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteLong"](_chartPr.title);
    }
    if (_chartPr.rowCols !== undefined && _chartPr.rowCols !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteLong"](_chartPr.rowCols);
    }
    if (_chartPr.horAxisLabel !== undefined && _chartPr.horAxisLabel !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_chartPr.horAxisLabel);
    }
    if (_chartPr.vertAxisLabel !== undefined && _chartPr.vertAxisLabel !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteLong"](_chartPr.vertAxisLabel);
    }
    if (_chartPr.legendPos !== undefined && _chartPr.legendPos !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteLong"](_chartPr.legendPos);
    }
    if (_chartPr.dataLabelsPos !== undefined && _chartPr.dataLabelsPos !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteLong"](_chartPr.dataLabelsPos);
    }
    if (_chartPr.horAx !== undefined && _chartPr.horAx !== null)
    {
        _stream["WriteByte"](7);
        _stream["WriteLong"](_chartPr.horAx);
    }
    if (_chartPr.vertAx !== undefined && _chartPr.vertAx !== null)
    {
        _stream["WriteByte"](8);
        _stream["WriteLong"](_chartPr.vertAx);
    }
    if (_chartPr.horGridLines !== undefined && _chartPr.horGridLines !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteLong"](_chartPr.horGridLines);
    }
    if (_chartPr.vertGridLines !== undefined && _chartPr.vertGridLines !== null)
    {
        _stream["WriteByte"](10);
        _stream["WriteLong"](_chartPr.vertGridLines);
    }
    if (_chartPr.type !== undefined && _chartPr.type !== null)
    {
        _stream["WriteByte"](11);
        _stream["WriteLong"](_chartPr.type);
    }

    if (_chartPr.showSerName !== undefined && _chartPr.showSerName !== null)
    {
        _stream["WriteByte"](12);
        _stream["WriteBool"](_chartPr.showSerName);
    }
    if (_chartPr.showCatName !== undefined && _chartPr.showCatName !== null)
    {
        _stream["WriteByte"](13);
        _stream["WriteBool"](_chartPr.showCatName);
    }
    if (_chartPr.showVal !== undefined && _chartPr.showVal !== null)
    {
        _stream["WriteByte"](14);
        _stream["WriteBool"](_chartPr.showVal);
    }

    if (_chartPr.separator !== undefined && _chartPr.separator !== null)
    {
        _stream["WriteByte"](15);
        _stream["WriteString2"](_chartPr.separator);
    }

    asc_menu_WriteAscValAxisSettings(16, _chartPr.horAxisProps, _stream);
    asc_menu_WriteAscValAxisSettings(17, _chartPr.vertAxisProps, _stream);

    if (_chartPr.range !== undefined && _chartPr.range !== null)
    {
        _stream["WriteByte"](18);
        _stream["WriteString2"](_chartPr.range);
    }

    if (_chartPr.inColumns !== undefined && _chartPr.inColumns !== null)
    {
        _stream["WriteByte"](19);
        _stream["WriteBool"](_chartPr.inColumns);
    }
    if (_chartPr.showMarker !== undefined && _chartPr.showMarker !== null)
    {
        _stream["WriteByte"](20);
        _stream["WriteBool"](_chartPr.showMarker);
    }
    if (_chartPr.bLine !== undefined && _chartPr.bLine !== null)
    {
        _stream["WriteByte"](21);
        _stream["WriteBool"](_chartPr.bLine);
    }
    if (_chartPr.smooth !== undefined && _chartPr.smooth !== null)
    {
        _stream["WriteByte"](22);
        _stream["WriteBool"](_chartPr.showVal);
    }

    _stream["WriteByte"](255);
}
function asc_menu_ReadShapePr(_params, _cursor){
    var _settings = new asc_CShapeProperty();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.type = _params[_cursor.pos++];
                break;
            }
            case 1:
            {
                _settings.fill = asc_menu_ReadAscFill(_params, _cursor);
                break;
            }
            case 2:
            {
                _settings.stroke = asc_menu_ReadAscStroke(_params, _cursor);
                break;
            }
            case 3:
            {
                _settings.paddings = asc_menu_ReadPaddings(_params, _cursor);
                break;
            }
            case 4:
            {
                _settings.canFill = _params[_cursor.pos++];
                break;
            }
            case 5:
            {
                _settings.bFromChart = _params[_cursor.pos++];
                break;
            }
            case 6:
            {
                _settings.InsertPageNum = _params[_cursor.pos++];
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _settings;
}
function asc_menu_WriteShapePr(_type, _shapePr, _stream){
    if (!_shapePr)
        return;

    _stream["WriteByte"](_type);

    if (_shapePr.type !== undefined && _shapePr.type !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteString2"](_shapePr.type);
    }

    asc_menu_WriteAscFill(1, _shapePr.fill, _stream);
    asc_menu_WriteAscStroke(2, _shapePr.stroke, _stream);
    asc_menu_WritePaddings(3, _shapePr.paddings, _stream);

    if (_shapePr.canFill !== undefined && _shapePr.canFill !== null)
    {
        _stream["WriteByte"](4);
        _stream["WriteBool"](_shapePr.canFill);
    }
    if (_shapePr.bFromChart !== undefined && _shapePr.bFromChart !== null)
    {
        _stream["WriteByte"](5);
        _stream["WriteBool"](_shapePr.bFromChart);
    }

    _stream["WriteByte"](255);
}
function asc_menu_WriteImagePr(_imagePr, _stream){
    if (_imagePr.CanBeFlow !== undefined && _imagePr.CanBeFlow !== null)
    {
        _stream["WriteByte"](0);
        _stream["WriteBool"](_imagePr.CanBeFlow);
    }
    if (_imagePr.Width !== undefined && _imagePr.Width !== null)
    {
        _stream["WriteByte"](1);
        _stream["WriteDouble2"](_imagePr.Width);
    }
    if (_imagePr.Height !== undefined && _imagePr.Height !== null)
    {
        _stream["WriteByte"](2);
        _stream["WriteDouble2"](_imagePr.Height);
    }
    if (_imagePr.WrappingStyle !== undefined && _imagePr.WrappingStyle !== null)
    {
        _stream["WriteByte"](3);
        _stream["WriteLong"](_imagePr.WrappingStyle);
    }

    asc_menu_WritePaddings(4, _imagePr.Paddings, _stream);
    asc_menu_WritePosition(5, _imagePr.Position, _stream);

    if (_imagePr.AllowOverlap !== undefined && _imagePr.AllowOverlap !== null)
    {
        _stream["WriteByte"](6);
        _stream["WriteBool"](_imagePr.AllowOverlap);
    }

    asc_menu_WriteImagePosition(7, _imagePr.PositionH, _stream);
    asc_menu_WriteImagePosition(8, _imagePr.PositionV, _stream);

    if (_imagePr.Internal_Position !== undefined && _imagePr.Internal_Position !== null)
    {
        _stream["WriteByte"](9);
        _stream["WriteLong"](_imagePr.Internal_Position);
    }

    if (_imagePr.ImageUrl !== undefined && _imagePr.ImageUrl !== null)
    {
        _stream["WriteByte"](10);
        _stream["WriteString2"](_imagePr.ImageUrl);
    }

    if (_imagePr.Locked !== undefined && _imagePr.Locked !== null)
    {
        _stream["WriteByte"](11);
        _stream["WriteBool"](_imagePr.Locked);
    }

    asc_menu_WriteChartPr(12, _imagePr.ChartProperties, _stream);
    asc_menu_WriteShapePr(13, _imagePr.ShapeProperties, _stream);

    if (_imagePr.ChangeLevel !== undefined && _imagePr.ChangeLevel !== null)
    {
        _stream["WriteByte"](14);
        _stream["WriteLong"](_imagePr.ChangeLevel);
    }

    if (_imagePr.Group !== undefined && _imagePr.Group !== null)
    {
        _stream["WriteByte"](15);
        _stream["WriteLong"](_imagePr.Group);
    }

    if (_imagePr.fromGroup !== undefined && _imagePr.fromGroup !== null)
    {
        _stream["WriteByte"](16);
        _stream["WriteBool"](_imagePr.fromGroup);
    }
    if (_imagePr.severalCharts !== undefined && _imagePr.severalCharts !== null)
    {
        _stream["WriteByte"](17);
        _stream["WriteBool"](_imagePr.severalCharts);
    }

    if (_imagePr.severalChartTypes !== undefined && _imagePr.severalChartTypes !== null)
    {
        _stream["WriteByte"](18);
        _stream["WriteLong"](_imagePr.severalChartTypes);
    }
    if (_imagePr.severalChartStyles !== undefined && _imagePr.severalChartStyles !== null)
    {
        _stream["WriteByte"](19);
        _stream["WriteLong"](_imagePr.severalChartStyles);
    }
    if (_imagePr.verticalTextAlign !== undefined && _imagePr.verticalTextAlign !== null)
    {
        _stream["WriteByte"](20);
        _stream["WriteLong"](_imagePr.verticalTextAlign);
    }

    _stream["WriteByte"](255);
}

function asc_ReadCBorder(s, p) {
    var color = null;
    var style = null;
    var _continue = true;
    while (_continue)
    {
        var _attr = s[p.pos++];
        switch (_attr)
        {
            case 0:
            {
                style = s[p.pos++];
                break;
            }
            case 1:
            {
                color = asc_menu_ReadColor(s, p);
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    if (color && style) {
        return new Asc.asc_CBorder(style, color);
    }

    return null;
}
function asc_ReadAdjustPrint(s, p) {
    var adjustPrint = new asc.asc_CAdjustPrint();

    var next = true;
    while (next)
    {
        var _attr = s[p.pos++];
        switch (_attr)
        {
            case 0:
            {
                adjustPrint.asc_setPrintType(s[p.pos++]);
                break;
            }
            case 1:
            {
                adjustPrint.asc_setLayoutPageType(s[p.pos++]);
                break;
            }
            case 255:
            default:
            {
                next = false;
                break;
            }
        }
    }

    return adjustPrint;
}
function asc_ReadCPageMargins(s, p) {
    var pageMargins = new Asc.asc_CPageMargins();

    var next = true;
    while (next)
    {
        var _attr = s[p.pos++];
        switch (_attr)
        {
            case 0:
            {
                pageMargins.asc_setLeft(s[p.pos++]);
                break;
            }
            case 1:
            {
                pageMargins.asc_setRight(s[p.pos++]);
                break;
            }
            case 2:
            {
                pageMargins.asc_setTop(s[p.pos++]);
                break;
            }
            case 3:
            {
                pageMargins.asc_setBottom(s[p.pos++]);
                break;
            }

            case 255:
            default:
            {
                next = false;
                break;
            }
        }
    }

    return pageMargins;
}
function asc_ReadCPageSetup(s, p) {
    var pageSetup = new Asc.asc_CPageSetup();

    var next = true;
    while (next)
    {
        var _attr = s[p.pos++];
        switch (_attr)
        {
            case 0:
            {
                pageSetup.asc_setOrientation(s[p.pos++]);
                break;
            }
            case 1:
            {
                pageSetup.asc_setWidth(s[p.pos++]);
                break;
            }
            case 2:
            {
                pageSetup.asc_setHeight(s[p.pos++]);
                break;
            }

            case 255:
            default:
            {
                next = false;
                break;
            }
        }
    }

    return pageSetup;
}
function asc_ReadPageOptions(s, p) {
    var pageOptions = new Asc.asc_CPageOptions();

    var next = true;
    while (next)
    {
        var _attr = s[p.pos++];
        switch (_attr)
        {
            case 0:
            {
                pageOptions.pageIndex = s[p.pos++];
                break;
            }
            case 1:
            {
                pageOptions.asc_setPageMargins(asc_ReadCPageMargins(s,p));
                break;
            }
            case 2:
            {
                pageOptions.asc_setPageSetup(asc_ReadCPageSetup(s,p));
                break;
            }
            case 3:
            {
                pageOptions.asc_setGridLines(s[p.pos++]);
                break;
            }
            case 4:
            {
                pageOptions.asc_setHeadings(s[p.pos++]);
                break;
            }
            case 255:
            default:
            {
                next = false;
                break;
            }
        }
    }

    return pageOptions;
}
function asc_ReadCHyperLink(_params, _cursor) {
    var _settings = new Asc.asc_CHyperlink();

    var _continue = true;
    while (_continue)
    {
        var _attr = _params[_cursor.pos++];
        switch (_attr)
        {
            case 0:
            {
                _settings.asc_setType(_params[_cursor.pos++]);
                break;
            }
            case 1:
            {
                _settings.asc_setHyperlinkUrl(_params[_cursor.pos++]);
                break;
            }
            case 2:
            {
                _settings.asc_setTooltip(_params[_cursor.pos++]);
                break;
            }
            case 3:
            {
                _settings.asc_setLocation(_params[_cursor.pos++]);
                break;
            }
            case 4:
            {
                _settings.asc_setSheet(_params[_cursor.pos++]);
                break;
            }
            case 5:
            {
                _settings.asc_setRange(_params[_cursor.pos++]);
                break;
            }
            case 6:
            {
                _settings.asc_setText(_params[_cursor.pos++]);
                break;
            }
            case 255:
            default:
            {
                _continue = false;
                break;
            }
        }
    }

    return _settings;
}
function asc_ReadAddFormatTableOptions(s, p) {
    var format = new asc.AddFormatTableOptions();

    var next = true;
    while (next)
    {
        var _attr = s[p.pos++];
        switch (_attr)
        {
            case 0:
            {
                format.asc_setRange(s[p.pos++]);
                break;
            }
            case 1:
            {
                format.asc_setIsTitle(s[p.pos++]);
                break;
            }
            case 255:
            default:
            {
                next = false;
                break;
            }
        }
    }

    return format;
}
function asc_ReadAutoFilter(s, p) {
    var filter = {};

    var next = true;
    while (next)
    {
        var _attr = s[p.pos++];
        switch (_attr)
        {
            case 0:
            {
                filter.styleName = s[p.pos++];
                break;
            }
            case 1:
            {
                filter.format = asc_ReadAddFormatTableOptions(s, p);
                break;
            }
            case 2:
            {
                filter.tableName = s[p.pos++];
                break;
            }
            case 3:
            {
                filter.optionType = s[p.pos++];
                break;
            }
            case 255:
            default:
            {
                next = false;
                break;
            }
        }
    }

    return filter;
}

function asc_WriteCBorder(i, c, s) {
    if (!c) return;

    s['WriteByte'](i);

    if (c.asc_getStyle()) {
        s['WriteByte'](0);
        s['WriteString2'](c.asc_getStyle());
    }

    if (c.asc_getColor()) {
        s['WriteByte'](1);
        s['WriteLong'](c.asc_getColor());
    }

    s['WriteByte'](255);
}
function asc_WriteCHyperLink(i, c, s) {
    if (!c) return;

    s['WriteByte'](i);

    s['WriteByte'](0);
    s['WriteLong'](c.asc_getType());

    if (c.asc_getHyperlinkUrl()) {
        s['WriteByte'](1);
        s['WriteString2'](c.asc_getHyperlinkUrl());
    }

    if (c.asc_getTooltip()) {
        s['WriteByte'](2);
        s['WriteString2'](c.asc_getTooltip());
    }

    if (c.asc_getLocation()) {
        s['WriteByte'](3);
        s['WriteString2'](c.asc_getLocation());
    }

    if (c.asc_getSheet()) {
        s['WriteByte'](4);
        s['WriteString2'](c.asc_getSheet());
    }

    if (c.asc_getRange()) {
        s['WriteByte'](5);
        s['WriteString2'](c.asc_getRange());
    }

    if (c.asc_getText()) {
        s['WriteByte'](6);
        s['WriteString2'](c.asc_getText());
    }

    s['WriteByte'](255);
}
function asc_WriteCFont(i, c, s) {
    if (!c) return;

    if (i !== -1) s['WriteByte'](i);

    s['WriteByte'](0);
    s['WriteString2'](c.asc_getName());
    s['WriteDouble2'](c.asc_getSize());
    s['WriteBool'](c.asc_getBold());
    s['WriteBool'](c.asc_getItalic());
    s['WriteBool'](c.asc_getUnderline());
    s['WriteBool'](c.asc_getStrikeout());
    s['WriteBool'](c.asc_getSubscript());
    s['WriteBool'](c.asc_getSuperscript());

    if (c.asc_getColor()) {
        asc_menu_WriteColor(1, c.asc_getColor(), s);
    }

    s['WriteByte'](255);
}
function asc_WriteCBorders(i, c, s) {
    if (!c) return;

    s['WriteByte'](i);

    if (c.asc_getLeft()) asc_WriteCBorder(0, c.asc_getLeft(), s);
    if (c.asc_getTop()) asc_WriteCBorder(0, c.asc_getTop(), s);
    if (c.asc_getRight()) asc_WriteCBorder(0, c.asc_getRight(), s);
    if (c.asc_getBottom()) asc_WriteCBorder(0, c.asc_getBottom(), s);
    if (c.asc_getDiagDown()) asc_WriteCBorder(0, c.asc_getDiagDown(), s);
    if (c.asc_getDiagUp()) asc_WriteCBorder(0, c.asc_getDiagUp(), s);

    s['WriteByte'](255);
}
function asc_WriteAutoFilterInfo(i, c, s) {
    if (!c) return;

    if (i !== -1) s['WriteByte'](i);

    if (c.asc_getTableStyleName()) {
        s['WriteByte'](0);
        s['WriteString2'](c.asc_getTableStyleName());
    }

    if (c.asc_getTableName()) {
        s['WriteByte'](1);
        s['WriteString2'](c.asc_getTableName());
    }
    if (null !== c.asc_getIsAutoFilter()) {
        s['WriteByte'](2);
        s['WriteBool'](c.asc_getIsAutoFilter());
    }

    if (null !== c.asc_getIsApplyAutoFilter()) {
        s['WriteByte'](3);
        s['WriteString2'](c.asc_getIsApplyAutoFilter());
    }

    s['WriteByte'](255);
}
function asc_WriteCCelInfo(c, s) {
    if (!c) return;

    if (null !== c.asc_getName()) {
        s['WriteByte'](0);
        s['WriteString2'](c.asc_getName());
    }

    if (null != c.asc_getFormula()) {
        s['WriteByte'](1);
        s['WriteString2'](c.asc_getFormula());
    }

    if (null !== c.asc_getText()) {
        s['WriteByte'](2);
        s['WriteString2'](c.asc_getText());
    }

    if (null !== c.asc_getHorAlign()) {
        s['WriteByte'](3);
        s['WriteString2'](c.asc_getHorAlign());
    }

    if (null !== c.asc_getVertAlign()) {
        s['WriteByte'](4);
        s['WriteString2'](c.asc_getVertAlign());
    }

    if (null !== c.asc_getFlags()) {
        s['WriteByte'](5);
        s['WriteBool'](c.asc_getFlags().asc_getMerge());
        s['WriteBool'](c.asc_getFlags().asc_getShrinkToFit());
        s['WriteBool'](c.asc_getFlags().asc_getWrapText());
        s['WriteLong'](c.asc_getFlags().asc_getSelectionType());
        s['WriteBool'](c.asc_getFlags().asc_getLockText());
    }

    asc_WriteCFont(6, c.asc_getFont(), s);
    asc_menu_WriteColor(8, c.asc_getFill().asc_getColor(), s);
    asc_WriteCBorders(9, c.asc_getBorders(), s);

    if (null !== c.asc_getInnerText()) {
        s['WriteByte'](15);
        s['WriteString2'](c.asc_getInnerText());
    }

    if (null !== c.asc_getNumFormat()) {
        s['WriteByte'](16);
        s['WriteString2'](c.asc_getNumFormat());
    }

    asc_WriteCHyperLink(17, c.asc_getHyperlink(), s);

    s['WriteByte'](18);
    s['WriteBool'](c.asc_getLocked());

    if (null != c.asc_getStyleName()) {
        s['WriteByte'](21);
        s['WriteString2'](c.asc_getStyleName());
    }

    if (null != c.asc_getNumFormatType()) {
        s['WriteByte'](22);
        s['WriteLong'](c.asc_getNumFormatType());
    }
    if (null != c.asc_getAngle()) {
        s['WriteByte'](23);
        s['WriteDouble2'](c.asc_getAngle());
    }

    asc_WriteAutoFilterInfo(30, c.asc_getAutoFilterInfo(), s);

    s['WriteByte'](255);
}
function asc_WriteColorSchemes(schemas, s) {

    s["WriteLong"](schemas.length);

    for (var i = 0; i < schemas.length; ++i) {
        s["WriteString2"](schemas[i].get_name());

        var colors = schemas[i].get_colors();
        s["WriteLong"](colors.length);

        for (var j = 0; j < colors.length; ++j) {
            asc_menu_WriteColor(0, colors[j], s);
        }
    }
}
function asc_WriteAddFormatTableOptions(c, s) {
    if (!c) return;

    if (c.asc_getRange()) {
        s['WriteByte'](0);
        s['WriteString2'](c.asc_getRange());
    }

    if (c.asc_getIsTitle()) {
        s['WriteByte'](1);
        s['WriteBool'](c.asc_getIsTitle());
    }

    s['WriteByte'](255);
}

//--------------------------------------------------------------------------------
// defines
//--------------------------------------------------------------------------------

var PageType = {
    PageDefaultType: 0,
    PageTopType: 1,
    PageLeftType: 2,
    PageCornerType: 3
};

var deviceScale = 1;

//--------------------------------------------------------------------------------
// OfflineEditor
//--------------------------------------------------------------------------------

function OfflineEditor () {

    this.zoom = 1.0;
    this.textSelection = 0;
    this.selection = [];
    this.cellPin = 0;
    this.col0 = 0;
    this.row0 = 0;
    this.translate = null;

    // main

    this.beforeOpen  = function() {
        DrawingArea.prototype.drawSelection = function(drawingDocument) {

            var canvas = this.worksheet.objectRender.getDrawingCanvas();
            var shapeCtx = canvas.shapeCtx;
            var shapeOverlayCtx = canvas.shapeOverlayCtx;
            var autoShapeTrack = canvas.autoShapeTrack;
            var trackOverlay = canvas.trackOverlay;

            var ctx = trackOverlay.m_oContext;
            trackOverlay.Clear();
            drawingDocument.Overlay = trackOverlay;

            this.worksheet.overlayCtx.clear();
            this.worksheet.overlayGraphicCtx.clear();
            this.worksheet._drawCollaborativeElements();

            if ( !this.worksheet.objectRender.controller.selectedObjects.length && !this.api.isStartAddShape )
                this.worksheet._drawSelection();

            var chart;
            var controller = this.worksheet.objectRender.controller;
            var selected_objects = controller.selection.groupSelection ? controller.selection.groupSelection.selectedObjects : controller.selectedObjects;
            if(selected_objects.length === 1 && selected_objects[0].getObjectType() === historyitem_type_ChartSpace)
            {
                chart = selected_objects[0];
                this.worksheet.objectRender.selectDrawingObjectRange(chart);
                //shapeOverlayCtx.ClearMode = true;
                ////selected_objects[0].draw(shapeOverlayCtx);
                //shapeOverlayCtx.ClearMode = false;
            }
            for ( var i = 0; i < this.frozenPlaces.length; i++ ) {

                this.frozenPlaces[i].setTransform(shapeCtx, shapeOverlayCtx, autoShapeTrack);

                // Clip
                this.frozenPlaces[i].clip(shapeOverlayCtx);

                if (null == drawingDocument.m_oDocumentRenderer) {
                    if (drawingDocument.m_bIsSelection) {
                        if (drawingDocument.m_bIsSelection) {
                            trackOverlay.m_oControl.HtmlElement.style.display = "block";

                            if (null == trackOverlay.m_oContext)
                                trackOverlay.m_oContext = trackOverlay.m_oControl.HtmlElement.getContext('2d');
                        }
                        drawingDocument.private_StartDrawSelection(trackOverlay);
                        this.worksheet.objectRender.controller.drawTextSelection();
                        drawingDocument.private_EndDrawSelection();
                    }

                    ctx.globalAlpha = 1.0;

                    this.worksheet.objectRender.controller.drawSelection(drawingDocument);

                    if ( this.worksheet.objectRender.controller.needUpdateOverlay() ) {
                        trackOverlay.Show();
                        shapeOverlayCtx.put_GlobalAlpha(true, 0.5);
                        this.worksheet.objectRender.controller.drawTracks(shapeOverlayCtx);
                        shapeOverlayCtx.put_GlobalAlpha(true, 1);
                    }
                }
                else {
                    ctx.fillStyle = "rgba(51,102,204,255)";
                    ctx.beginPath();

                    for (var j = drawingDocument.m_lDrawingFirst; j <= drawingDocument.m_lDrawingEnd; j++) {
                        var drawPage = drawingDocument.m_arrPages[j].drawingPage;
                        drawingDocument.m_oDocumentRenderer.DrawSelection(j, trackOverlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
                    }

                    ctx.globalAlpha = 0.2;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.globalAlpha = 1.0;
                }

                // Restore
                this.frozenPlaces[i].restore(shapeOverlayCtx);
            }
		};
		
		DrawingObjectsController.prototype.onMouseDown = function(e, x, y) {
			var ret = this.curState.onMouseDown(e, x, y, 0);
			if(e.ClickCount < 2)
			{
				//this.updateOverlay();
				//this.updateSelectionState();
			}
			return ret;
		};
   
		Path.prototype.drawSmart = function(shape_drawer) {
			
        var _graphics   = shape_drawer.Graphics;
        var _full_trans = _graphics.m_oFullTransform;

        if (!_graphics || !_full_trans || undefined == _graphics.m_bIntegerGrid || true === shape_drawer.bIsNoSmartAttack)
            return this.draw(shape_drawer);

        var bIsTransformed = (_full_trans.shx == 0 && _full_trans.shy == 0) ? false : true;

        if (bIsTransformed)
            return this.draw(shape_drawer);

        var isLine = this.isSmartLine();
        var isRect = false;
        if (!isLine)
            isRect = this.isSmartRect();

        //if (!isLine && !isRect)   // IOS убрать
            return this.draw(shape_drawer);

        var _old_int = _graphics.m_bIntegerGrid;

        if (false == _old_int)
            _graphics.SetIntegerGrid(true);

        var dKoefMMToPx = Math.max(_graphics.m_oCoordTransform.sx, 0.001);

        var _ctx = _graphics.m_oContext;
        var bIsStroke = (shape_drawer.bIsNoStrokeAttack || (this.stroke !== true)) ? false : true;
        var bIsEven = false;
        if (bIsStroke)
        {
            var _lineWidth = Math.max((shape_drawer.StrokeWidth * dKoefMMToPx + 0.5) >> 0, 1);
            _ctx.lineWidth = _lineWidth;

            if (_lineWidth & 0x01 == 0x01)
                bIsEven = true;
        }

        var bIsDrawLast = false;
        var path = this.ArrPathCommand;
        shape_drawer._s();

        if (!isRect)
        {
            for(var j = 0, l = path.length; j < l; ++j)
            {
                var cmd=path[j];
                switch(cmd.id)
                {
                    case moveTo:
                    {
                        bIsDrawLast = true;

                        var _x = (_full_trans.TransformPointX(cmd.X, cmd.Y)) >> 0;
                        var _y = (_full_trans.TransformPointY(cmd.X, cmd.Y)) >> 0;
                        if (bIsEven)
                        {
                            _x -= 0.5;
                            _y -= 0.5;
                        }
                        _ctx.moveTo(_x, _y);
                        break;
                    }
                    case lineTo:
                    {
                        bIsDrawLast = true;

                        var _x = (_full_trans.TransformPointX(cmd.X, cmd.Y)) >> 0;
                        var _y = (_full_trans.TransformPointY(cmd.X, cmd.Y)) >> 0;
                        if (bIsEven)
                        {
                            _x -= 0.5;
                            _y -= 0.5;
                        }
                        _ctx.lineTo(_x, _y);
                        break;
                    }
                    case close:
                    {
                        _ctx.closePath();
                        break;
                    }
                }
            }
        }
        else
        {
            var minX = 100000;
            var minY = 100000;
            var maxX = -100000;
            var maxY = -100000;
            bIsDrawLast = true;
            for(var j = 0, l = path.length; j < l; ++j)
            {
                var cmd=path[j];
                switch(cmd.id)
                {
                    case moveTo:
                    case lineTo:
                    {
                        if (minX > cmd.X)
                            minX = cmd.X;
                        if (minY > cmd.Y)
                            minY = cmd.Y;

                        if (maxX < cmd.X)
                            maxX = cmd.X;
                        if (maxY < cmd.Y)
                            maxY = cmd.Y;

                        break;
                    }
                    default:
                        break;
                }
            }

            var _x1 = (_full_trans.TransformPointX(minX, minY)) >> 0;
            var _y1 = (_full_trans.TransformPointY(minX, minY)) >> 0;
            var _x2 = (_full_trans.TransformPointX(maxX, maxY)) >> 0;
            var _y2 = (_full_trans.TransformPointY(maxX, maxY)) >> 0;

            if (bIsEven)
                _ctx.rect(_x1 + 0.5, _y1 + 0.5, _x2 - _x1, _y2 - _y1);
            else
                _ctx.rect(_x1, _y1, _x2 - _x1, _y2 - _y1);
        }

        if (bIsDrawLast)
        {
            shape_drawer.drawFillStroke(true, this.fill, bIsStroke);
        }

        shape_drawer._e();

        if (false == _old_int)
            _graphics.SetIntegerGrid(false);
    };
	};

    this.openFile = function (isViewer) {

        this.beforeOpen();

        window["CreateMainTextMeasurerWrapper"]();

        deviceScale = window.native["GetDeviceScale"]();

        window.g_file_path = "native_open_file";
        window.NATIVE_DOCUMENT_TYPE = window.native.GetEditorType();
        _api = new window["Asc"]["spreadsheet_api"]();

        var userInfo = new Asc.asc_CUserInfo();
        userInfo.asc_putId('ios');
        userInfo.asc_putFullName('ios');
        userInfo.asc_getLastName('ios');

        var docInfo =  new Asc.asc_CDocInfo();
        docInfo.put_Id('ios');
        docInfo.put_UserInfo(userInfo);

        this.offline_beforeInit();

        this.registerEventsHandlers();

        _api.asc_setDocInfo(docInfo);
        _api.asc_nativeOpenFile(window.native["GetFileString"]());

        this.asc_WriteAllWorksheets(true);

        _api.asc_SendThemeColorScheme();
        _api.asc_ApplyColorScheme(false);

        //_api.asc_SendThemeColorScheme();

        //this.offline_generateStyle();

        window["NativeSupportTimeouts"] = true;

        var ws = _api.wb.getWorksheet();

        _api.wb.showWorksheet(undefined, false, true);
        ws._fixSelectionOfMergedCells();

        if (ws.topLeftFrozenCell) {
            this.row0 = ws.topLeftFrozenCell.getRow0();
            this.col0 = ws.topLeftFrozenCell.getCol0();
        }

        // TODO: сделать закрепленные области

//        ws.topLeftFrozenCel = null;
//        ws.topLeftFrozenCell = ws.model.sheetViews[0].pane = null;
//        ws.visibleRange.c1 = 0;
//        ws.visibleRange.r1 = 0;
//        ws.visibleRange.r2 = 0;
//        ws.visibleRange.c2 = 0;
//
//        ws.objectRender.drawingArea.init();

        // _api.asc_getTextArtPreviews();

        this.offline_afteInit();
    };
    this.registerEventsHandlers = function () {

        var t = this;

        _api.asc_registerCallback('asc_onCanUndoChanged', function (bCanUndo) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            stream["WriteBool"](bCanUndo);
            window["native"]["OnCallMenuEvent"](60, stream); // ASC_MENU_EVENT_TYPE_CAN_UNDO
        });
        _api.asc_registerCallback('asc_onCanRedoChanged', function (bCanRedo) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            stream["WriteBool"](bCanRedo);
            window["native"]["OnCallMenuEvent"](61, stream); // ASC_MENU_EVENT_TYPE_CAN_REDO
        });
        _api.asc_registerCallback('asc_onDocumentModifiedChanged', function(change) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            stream["WriteBool"](change);
            window["native"]["OnCallMenuEvent"](66, stream); // ASC_MENU_EVENT_TYPE_DOCUMETN_MODIFITY
        });
        _api.asc_registerCallback("asc_onActiveSheetChanged", function(index) {
            t.asc_WriteAllWorksheets(true, true);
        });
        _api.asc_registerCallback('asc_onRenameCellTextEnd', function(found, replaced) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            stream["WriteLong"](found);
            stream["WriteLong"](replaced);
            window["native"]["OnCallMenuEvent"](63, stream); // ASC_MENU_EVENT_TYPE_SEARCH_REPLACETEXT
        });
        _api.asc_registerCallback('asc_onSelectionChanged', function(cellInfo) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            asc_WriteCCelInfo(cellInfo, stream);
            window["native"]["OnCallMenuEvent"](2402, stream); // ASC_SPREADSHEETS_EVENT_TYPE_SELECTION_CHANGED
            t.onSelectionChanged(cellInfo);
        });
        _api.asc_registerCallback('asc_onSelectionNameChanged', function(name) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            stream['WriteString2'](name);
            window["native"]["OnCallMenuEvent"](2310, stream); // ASC_SPREADSHEETS_EVENT_TYPE_EDITOR_SELECTION_NAME_CHANGED
        });
        _api.asc_registerCallback('asc_onEditorSelectionChanged', function(font) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            asc_WriteCFont(-1, font, stream);
            window["native"]["OnCallMenuEvent"](2403, stream); // ASC_SPREADSHEETS_EVENT_TYPE_EDITOR_SELECTION_CHANGED
        });
        _api.asc_registerCallback('asc_onSendThemeColorSchemes', function(schemes) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            asc_WriteColorSchemes(schemes, stream);
            window["native"]["OnCallMenuEvent"](2404, stream); // ASC_SPREADSHEETS_EVENT_TYPE_COLOR_SCHEMES
        });
        _api.asc_registerCallback('asc_onInitTablePictures',   function () {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            window["native"]["OnCallMenuEvent"](12, stream); // ASC_MENU_EVENT_TYPE_TABLE_STYLES
        });
        _api.asc_registerCallback('asc_onInitEditorStyles', function () {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            window["native"]["OnCallMenuEvent"](2405, stream); // ASC_SPREADSHEETS_EVENT_TYPE_TABLE_STYLES
        });
        _api.asc_registerCallback('asc_onError', function(id, level, errData) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            stream['WriteLong'](id);
            stream['WriteLong'](level);
            window["native"]["OnCallMenuEvent"](500, stream); // ASC_MENU_EVENT_TYPE_ON_ERROR
        });
        _api.asc_registerCallback('asc_onEditCell', function(state) {
            var stream = global_memory_stream_menu;
            stream["ClearNoAttack"]();
            stream['WriteLong'](state);
            window["native"]["OnCallMenuEvent"](2600, stream); // ASC_SPREADSHEETS_EVENT_TYPE_ON_EDIT_CELL
        });
    };
    this.updateFrozen = function () {
        var ws = _api.wb.getWorksheet();
        if (ws.topLeftFrozenCell) {
            _s.row0 = ws.topLeftFrozenCell.getRow0();
            _s.col0 = ws.topLeftFrozenCell.getCol0();
        }
        else
        {
            _s.row0 = 0;
            _s.col0 = 0;
        }
    };

    // prop

    this.getMaxBounds = function () {
        var worksheet = _api.wb.getWorksheet();
        var left = worksheet.cols[worksheet.cols.length - 1].left;
        var top =  worksheet.rows[worksheet.rows.length - 1].top;

        left += (gc_nMaxCol - worksheet.cols.length) * worksheet.defaultColWidth;
        top += (gc_nMaxRow - worksheet.rows.length) * worksheet.defaultRowHeight;

        return [left, top];
    };
    this.getSelection = function(x, y, width, height, autocorrection) {

        _null_object.width = width;
        _null_object.height = height;

        var worksheet = _api.wb.getWorksheet();
        var region = null;
        var range = worksheet.activeRange.intersection(worksheet.visibleRange);

        if (autocorrection) {
            this._resizeWorkRegion(worksheet, worksheet.activeRange.c2, worksheet.activeRange.r2);
            region = {columnBeg:0, columnEnd:worksheet.cols.length - 1,columnOff:0, rowBeg:0, rowEnd:worksheet.rows.length - 1, rowOff:0};
        } else {
            region = this._updateRegion(worksheet, x, y, width, height);
        }

        this.selection = _api.wb.getWorksheet().__selection(region.columnBeg, region.rowBeg, region.columnEnd, region.rowEnd);

        return this.selection;
    };
    this.getNearCellCoord = function(x, y) {

        //TODO: оптимизировать поиск ячейки по координатам ( bin2_search )

        var cell = [],
            worksheet = _api.wb.getWorksheet(),
            count = 0,
            i = 0;

        count = worksheet.cols.length;
        if (count) {
            if (worksheet.cols[0].left > x) {
                cell.push(0);
            } else {
                for (i = 0; i < count; ++i) {
                    if (worksheet.cols[i].left - worksheet.cols[0].left <= x &&
                        x < worksheet.cols[i].left + worksheet.cols[i].width - worksheet.cols[0].left) {

                        if (x - worksheet.cols[i].left - worksheet.cols[0].left > worksheet.cols[i].width * 0.5) {
                            cell.push(worksheet.cols[i + 1].left- worksheet.cols[0].left);
                        }
                        else {
                            cell.push(worksheet.cols[i].left - worksheet.cols[0].left);
                        }

                        break;
                    }
                }
            }
        }

        count = worksheet.rows.length;
        if (count) {
            if (worksheet.rows[0].top > y) {
                cell.push(0);
            } else {
                for (i = 0; i < count; ++i) {
                    if (worksheet.rows[i].top - worksheet.rows[0].top <= y &&
                        y < worksheet.rows[i].top + worksheet.rows[i].height - worksheet.rows[0].top) {
                        if (y - worksheet.rows[i].top - worksheet.rows[0].top > worksheet.rows[i].height * 0.5)
                            cell.push(worksheet.rows[i + 1].top - worksheet.rows[0].top);
                        else
                            cell.push(worksheet.rows[i].top - worksheet.rows[0].top);

                        break;
                    }
                }
            }
        }

        return cell;
    };

    // serialize

    this.asc_WriteAllWorksheets = function (callEvent, isSheetChange) {

        var _stream = global_memory_stream_menu;
        _stream["ClearNoAttack"]();

        _stream["WriteByte"](0);
        _stream['WriteString2'](_api.asc_getActiveWorksheetId(i));

        for (var i = 0; i < _api.asc_getWorksheetsCount(); ++i) {

            var viewSettings = _api.wb.getWorksheet(i).getSheetViewSettings();

            if (_api.asc_getWorksheetTabColor(i)) {
                _stream["WriteByte"](1);
            } else {
                _stream["WriteByte"](2);
            }
            _stream["WriteLong"](i);
            _stream['WriteString2'](_api.asc_getWorksheetId(i));
            _stream["WriteString2"](_api.asc_getWorksheetName(i));
            _stream['WriteBool'](_api.asc_isWorksheetHidden(i));
            _stream['WriteBool'](_api.asc_isWorkbookLocked(i));
            _stream['WriteBool'](_api.asc_isWorksheetLockedOrDeleted(i));
            _stream['WriteBool'](viewSettings.asc_getShowGridLines());
            _stream['WriteBool'](viewSettings.asc_getShowRowColHeaders());
            _stream['WriteBool'](viewSettings.asc_getIsFreezePane());

            if (_api.asc_getWorksheetTabColor(i))
                asc_menu_WriteColor(0, _api.asc_getWorksheetTabColor(i), _stream);
        }

        _stream["WriteByte"](255);

        if (callEvent) {
            window["native"]["OnCallMenuEvent"](isSheetChange ? 2300 : 2130, global_memory_stream_menu); // ASC_SPREADSHEETS_EVENT_TYPE_WORKSHEETS
        }
    };
    this.asc_writeWorksheet = function(i) {

        var viewSettings = _api.wb.getWorksheet(i).getSheetViewSettings();

        var _stream = global_memory_stream_menu;
        _stream["ClearNoAttack"]();

        if (_api.asc_getWorksheetTabColor(i)) {
            _stream["WriteByte"](1);
        } else {
            _stream["WriteByte"](2);
        }
        _stream["WriteLong"](i);
        _stream['WriteString2'](_api.asc_getWorksheetId(i));
        _stream["WriteString2"](_api.asc_getWorksheetName(i));
        _stream['WriteBool'](_api.asc_isWorksheetHidden(i));
        _stream['WriteBool'](_api.asc_isWorkbookLocked(i));
        _stream['WriteBool'](_api.asc_isWorksheetLockedOrDeleted(i));
        _stream['WriteBool'](viewSettings.asc_getShowGridLines());
        _stream['WriteBool'](viewSettings.asc_getShowRowColHeaders());
        _stream['WriteBool'](viewSettings.asc_getIsFreezePane());

        if (_api.asc_getWorksheetTabColor(i)) {
            asc_menu_WriteColor(0, _api.asc_getWorksheetTabColor(i), _stream);
        }

        _stream["WriteByte"](255);
    };

    // render

    this.drawSheet = function (x, y, width, height, ratio) {
        _null_object.width = width * ratio;
        _null_object.height = height * ratio;

        var worksheet = _api.wb.getWorksheet();
        var region = this._updateRegion(worksheet, x, y, width * ratio, height * ratio);
        var colRowHeaders = _api.asc_getSheetViewSettings();

        if (colRowHeaders.asc_getShowGridLines()) {
            worksheet.__drawGrid(undefined,
                region.columnBeg, region.rowBeg, region.columnEnd, region.rowEnd,
                worksheet.cols[region.columnBeg].left + region.columnOff, worksheet.rows[region.rowBeg].top + region.rowOff,
                width + region.columnOff, height + region.rowOff);
        }

        worksheet.__drawCellsAndBorders(undefined,
            region.columnBeg, region.rowBeg, region.columnEnd, region.rowEnd,
            worksheet.cols[region.columnBeg].left + region.columnOff, worksheet.rows[region.rowBeg].top + region.rowOff);
    };
    this.drawHeader = function (x, y, width, height, type, ratio) {

        _null_object.width = width * ratio;
        _null_object.height = height * ratio;

        var worksheet = _api.wb.getWorksheet();
        var region = this._updateRegion(worksheet, x, y, width * ratio, height * ratio);

        var isColumn = type == PageType.PageTopType || type == PageType.PageCornerType;
        var isRow = type == PageType.PageLeftType || type == PageType.PageCornerType;

        if (!isColumn && isRow)
            worksheet.__drawRowHeaders(undefined, region.rowBeg, region.rowEnd, undefined, 0, region.rowOff);
        else if (isColumn && !isRow)
            worksheet.__drawColumnHeaders(undefined, region.columnBeg, region.columnEnd, undefined, region.columnOff, 0);
        else if (isColumn && isRow)
            worksheet._drawCorner();
    };

    // internal

    this._updateRegion = function (worksheet, x, y, width, height) {

        var i = 0;
        var nativeToEditor = 1.0 / deviceScale * (72.0 / 96.0);

        // координаты в СО редактора

        var logicX = x * nativeToEditor + worksheet.headersWidth;
        var logicY = y * nativeToEditor + worksheet.headersHeight;
        var logicToX = ( x + width ) * nativeToEditor + worksheet.headersWidth;
        var logicToY = ( y + height ) * nativeToEditor + worksheet.headersHeight;

        var columnBeg = -1;
        var columnEnd = -1;
        var columnOff = 0;
        var rowBeg = -1;
        var rowEnd = -1;
        var rowOff = 0;
        var count = 0;

        // добавляем отсутствующие колонки ( с небольшим зазором )

        var logicToXMAX = logicToX;//10000 * (1 + Math.floor(logicToX / 10000));

        if (logicToXMAX >= worksheet.cols[worksheet.cols.length - 1].left) {

            do {
                worksheet.nColsCount = worksheet.cols.length + 1;
                worksheet._calcWidthColumns(2); // fullRecalc

                if (logicToXMAX < worksheet.cols[worksheet.cols.length - 1].left) {
                    break
                }
            } while (1);
        }


        if (logicX < worksheet.cols[worksheet.cols.length - 1].left) {
            count = worksheet.cols.length;
            for (i = 0; i < count; ++i) {
                if (-1 === columnBeg) {
                    if (worksheet.cols[i].left <= logicX && logicX < worksheet.cols[i].left + worksheet.cols[i].width) {
                        columnBeg = i;
                        columnOff = logicX - worksheet.cols[i].left;
                    }
                }

                if (worksheet.cols[i].left <= logicToX && logicToX < worksheet.cols[i].left + worksheet.cols[i].width) {
                    columnEnd = i;
                    break;
                }
            }
        }

        // добавляем отсутствующие строки ( с небольшим зазором )

        var logicToYMAX = logicToY;//10000 * (1 + Math.floor(logicToY / 10000));

        if (logicToYMAX >= worksheet.rows[worksheet.rows.length - 1].top) {

            do {
                worksheet.nRowsCount = worksheet.rows.length + 1;
                worksheet._calcHeightRows(2); // fullRecalc

                if (logicToYMAX < worksheet.rows[worksheet.rows.length - 1].top) {
                    break
                }
            } while (1);
        }


        if (logicY < worksheet.rows[worksheet.rows.length - 1].top) {
            count = worksheet.rows.length;
            for (i = 0; i < count; ++i) {
                if (-1 === rowBeg) {
                    if (worksheet.rows[i].top <= logicY && logicY < worksheet.rows[i].top + worksheet.rows[i].height) {
                        rowBeg = i;
                        rowOff = logicY - worksheet.rows[i].top;
                    }
                }

                if (worksheet.rows[i].top <= logicToY && logicToY < worksheet.rows[i].top + worksheet.rows[i].height) {
                    rowEnd = i;
                    break;
                }
            }
        }

        return {
            columnBeg: columnBeg,
            columnEnd: columnEnd,
            columnOff: columnOff,
            rowBeg: rowBeg,
            rowEnd: rowEnd,
            rowOff: rowOff
        };
    };
    this._resizeWorkRegion = function (worksheet, col, row, isCoords) {

        if (undefined !== isCoords) {

            if (col >= worksheet.cols[worksheet.cols.length - 1].left) {

                do {
                    worksheet.nColsCount = worksheet.cols.length + 1;
                    worksheet._calcWidthColumns(2); // fullRecalc

                    if (col < worksheet.cols[worksheet.cols.length - 1].left) {
                        break
                    }
                } while (1);
            }

            if (row >= worksheet.rows[worksheet.rows.length - 1].top) {

                do {
                    worksheet.nRowsCount = worksheet.rows.length + 1;
                    worksheet._calcHeightRows(2); // fullRecalc

                    if (row < worksheet.rows[worksheet.rows.length - 1].top) {
                        break
                    }
                } while (1);
            }
        }
        else
        {
            if (col >= worksheet.cols.length) {
                do {
                    worksheet.nColsCount = worksheet.cols.length + 1;
                    worksheet._calcWidthColumns(2); // fullRecalc

                    if (col < worksheet.cols.length)
                        break
                } while (1);
            }

            if (row >= worksheet.rows.length) {
                do {
                    worksheet.nRowsCount = worksheet.rows.length + 1;
                    worksheet._calcHeightRows(2); // fullRecalc

                    if (row < worksheet.rows.length)
                        break
                } while (1);
            }
        }
    };

    this.offline_showWorksheet = function(index) {
        var me = this;
        var t = _api;
        var ws = _api.wbModel.getWorksheet(index);
        var isHidden = ws.getHidden();
        var showWorksheetCallback = function (res) {
            if (res) {
                t.wbModel.getWorksheet(index).setHidden(false);
                t.wb.showWorksheet(index);
                if (isHidden) {
                    // Посылаем callback об изменении списка листов
                    t.sheetsChanged();
                }

                me.updateFrozen();
            }
        };
        if (_api.isHidden) {
            var sheetId = _api.wbModel.getWorksheet(index).getId();
            var lockInfo = _api.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Sheet, /*subType*/null, sheetId, sheetId);
            _api._getIsLockObjectSheet(lockInfo, showWorksheetCallback);
        }
        else
        {
            showWorksheetCallback(true);
        }
    };
    this.offline_print = function(s, p) {
        var adjustPrint = asc_ReadAdjustPrint(s, p);
        var pagesData   = _api.wb.calcPagesPrint(adjustPrint);
        var pdfWriter   = new CPdfPrinter();
        var isEndPrint  = _api.wb.printSheet(pdfWriter, pagesData);
        return pdfWriter.DocumentRenderer.Memory.GetBase64Memory();
    };

    this.onSelectionChanged = function(info) {
        var stream = global_memory_stream_menu;
        stream["ClearNoAttack"]();

        var SelectedObjects = [], selectType = info.asc_getFlags().asc_getSelectionType();
        if (selectType == c_oAscSelectionType.RangeImage || selectType == c_oAscSelectionType.RangeShape ||
            selectType == c_oAscSelectionType.RangeChart || selectType == c_oAscSelectionType.RangeChartText ||
            selectType == c_oAscSelectionType.RangeShapeText)
        {
            SelectedObjects = _api.asc_getGraphicObjectProps();

            var count = SelectedObjects.length;
            var naturalCount = count;

            stream["WriteLong"](naturalCount);

            for (var i = 0; i < count; i++)
            {
                switch (SelectedObjects[i].asc_getObjectType())
                {
                    case c_oAscTypeSelectElement.Image:
                    {
                        stream["WriteLong"](c_oAscTypeSelectElement.Image);
                        asc_menu_WriteImagePr(SelectedObjects[i].Value, stream);
                        break;
                    }
                    case c_oAscTypeSelectElement.Hyperlink:
                    {
                        stream["WriteLong"](c_oAscTypeSelectElement.Hyperlink);
                        asc_menu_WriteHyperPr(SelectedObjects[i].Value, stream);
                        break;
                    }
                    case c_oAscTypeSelectElement.SpellCheck:
                    default:
                    {
                        // none
                        break;
                    }
                }
            }

            if (count)
            {
                window["native"]["OnCallMenuEvent"](6, stream);
            }
        }
    };

    this.offline_addImageDrawingObject = function(options) {
        var worksheet = _api.wb.getWorksheet();
        var objectRender = worksheet.objectRender;
        var _this = objectRender;
        var objectId = null;
        var imageUrl = options[0];

        function ascCvtRatio(fromUnits, toUnits) {
            return asc.getCvtRatio(fromUnits, toUnits, objectRender.getContext().getPPIX());
        }
        function ptToMm(val) {
            return val * ascCvtRatio(1, 3);
        }
        function pxToPt(val) {
            return val * ascCvtRatio(0, 1);
        }
        function pxToMm(val) {
            return val * ascCvtRatio(0, 3);
        }

        if (imageUrl && !objectRender.isViewerMode()) {

            var _image = _api.ImageLoader.LoadImage(imageUrl, 1);
            var isOption = true;//options && options.cell;

            var calculateObjectMetrics = function (object, width, height) {
                // Обработка картинок большого разрешения
                var metricCoeff = 1;

                var coordsFrom = _this.coordsManager.calculateCoords(object.from);
                var realTopOffset = coordsFrom.y;
                var realLeftOffset = coordsFrom.x;

                var areaWidth = worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) - worksheet.getCellLeft(worksheet.getFirstVisibleCol(true), 0); 	// по ширине
                if (areaWidth < width) {
                    metricCoeff = width / areaWidth;

                    width = areaWidth;
                    height /= metricCoeff;
                }

                var areaHeight = worksheet.getCellTop(worksheet.getLastVisibleRow(), 0) - worksheet.getCellTop(worksheet.getFirstVisibleRow(true), 0); 	// по высоте
                if (areaHeight < height) {
                    metricCoeff = height / areaHeight;

                    height = areaHeight;
                    width /= metricCoeff;
                }

                var findVal = pxToPt(realLeftOffset + width);
                var toCell = worksheet.findCellByXY(findVal, 0, true, false, true);
                while (toCell.col === null && worksheet.cols.length < gc_nMaxCol) {
                    worksheet.expandColsOnScroll(true);
                    toCell = worksheet.findCellByXY(findVal, 0, true, false, true);
                }
                object.to.col = toCell.col;
                object.to.colOff = ptToMm(toCell.colOff);

                findVal = pxToPt(realTopOffset + height);
                toCell = worksheet.findCellByXY(0, findVal, true, true, false);
                while (toCell.row === null && worksheet.rows.length < gc_nMaxRow) {
                    worksheet.expandRowsOnScroll(true);
                    toCell = worksheet.findCellByXY(0, findVal, true, true, false);
                }
                object.to.row = toCell.row;
                object.to.rowOff = ptToMm(toCell.rowOff);

                // worksheet.handlers.trigger("reinitializeScroll");
            };

            var addImageObject = function (_image) {

                //if (!_image.Image) {
                //    worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
                //} else {

                var drawingObject = _this.createDrawingObject();
                drawingObject.worksheet = worksheet;

                drawingObject.from.col = //isOption ? options.cell.col :
                    worksheet.getSelectedColumnIndex();
                drawingObject.from.row = //isOption ? options.cell.row :
                    worksheet.getSelectedRowIndex();

                // Проверяем начальные координаты при вставке
                while (!worksheet.cols[drawingObject.from.col]) {
                    worksheet.expandColsOnScroll(true);
                }
                worksheet.expandColsOnScroll(true); 	// для colOff

                while (!worksheet.rows[drawingObject.from.row]) {
                    worksheet.expandRowsOnScroll(true);
                }
                worksheet.expandRowsOnScroll(true); 	// для rowOff

                //calculateObjectMetrics(drawingObject, isOption ? options.width : _image.Image.width, isOption ? options.height : _image.Image.height);

                calculateObjectMetrics(drawingObject, options[1], options[2]);

                var coordsFrom = _this.coordsManager.calculateCoords(drawingObject.from);
                var coordsTo = _this.coordsManager.calculateCoords(drawingObject.to);

                // CImage
                _this.objectLocker.reset();
                _this.objectLocker.addObjectId(g_oIdCounter.Get_NewId());
                _this.objectLocker.checkObjects(function (bLock) {
                    if (bLock !== true)
                        return;
                    _this.controller.resetSelection();
                    _this.controller.addImageFromParams(imageUrl,
                        // _image.src,
                        pxToMm(coordsFrom.x) + MOVE_DELTA, pxToMm(coordsFrom.y) + MOVE_DELTA, pxToMm(coordsTo.x - coordsFrom.x), pxToMm(coordsTo.y - coordsFrom.y));
                });
                //}

                worksheet.setSelectionShape(true);

                if (_this.controller.selectedObjects.length) {
                    objectId = _this.controller.selectedObjects[0].Id;
                }
            };

            addImageObject(new Image());
        }

        return objectId;
    };
    this.offline_addShapeDrawingObject = function(params) {
        var ws = _api.wb.getWorksheet();
        var objectRender = ws.objectRender;
        var objectId = null;
        var current = {pos: 0};
        var shapeProp = asc_menu_ReadShapePr(params[0], current);
        var left = params[1];
        var top = params[2];
        var right = params[3];
        var bottom  = params[4];

        function ascCvtRatio(fromUnits, toUnits) {
            return asc.getCvtRatio(fromUnits, toUnits, objectRender.getContext().getPPIX());
        }
        function ptToMm(val) {
            return val * ascCvtRatio(1, 3);
        }
        function pxToPt(val) {
            return val * ascCvtRatio(0, 1);
        }
        function pxToMm(val) {
            return val * ascCvtRatio(0, 3);
        }

        _api.asc_startAddShape(shapeProp.type);

        objectRender.controller.OnMouseDown({}, pxToMm(left), pxToMm(top), 0);
        objectRender.controller.OnMouseMove({IsLocked: true}, pxToMm(right), pxToMm(bottom), 0);
        objectRender.controller.OnMouseUp({}, pxToMm(left), pxToMm(bottom), 0);

        _api.asc_endAddShape();

        if (objectRender.controller.selectedObjects.length) {
            objectId = objectRender.controller.selectedObjects[0].Id;
        }

        ws.setSelectionShape(true);

        return objectId;
    };
    this.offline_addChartDrawingObject = function(params) {
        var ws = _api.wb.getWorksheet();
        var objectRender = ws.objectRender;
        var objectId = null;
        var current = {pos: 0};
        var settings = asc_menu_ReadChartPr(params[0], current);
        var left = params[1];
        var top = params[2];
        var right = params[3];
        var bottom = params[4];

        var selectedRange = ws.getSelectedRange();
        if (selectedRange)
        {
            var box = selectedRange.getBBox0();
            settings.putInColumns(!(box.r2 - box.r1 < box.c2 - box.c1));
        }
        settings.putRange(ws.getSelectionRangeValue());
        //settings.putShowHorAxis(true);
        //settings.putShowVerAxis(true);
        var series = getChartSeries(ws.model, settings);
        if(series && series.series.length > 1)
        {
            settings.putLegendPos(c_oAscChartLegendShowSettings.right);
        }
        else
        {
            settings.putLegendPos(c_oAscChartLegendShowSettings.none);
        }
        // settings.putHorAxisLabel(c_oAscChartHorAxisLabelShowSettings.none);
        // settings.putVertAxisLabel(c_oAscChartVertAxisLabelShowSettings.none);
        // settings.putDataLabelsPos(c_oAscChartDataLabelsPos.none);
        // settings.putHorGridLines(c_oAscGridLinesSettings.major);
        // settings.putVertGridLines(c_oAscGridLinesSettings.none);

        var vert_axis_settings = new asc_ValAxisSettings();
        settings.putVertAxisProps(vert_axis_settings);
        vert_axis_settings.setDefault();

        var hor_axis_settings = new asc_CatAxisSettings();
        settings.putHorAxisProps(hor_axis_settings);
        hor_axis_settings.setDefault();

        settings.left = left;
        settings.top = top;
        settings.width = right - left;
        settings.height = bottom - top;

        _api.asc_addChartDrawingObject(settings);

        if (objectRender.controller.selectedObjects.length) {
            objectId = objectRender.controller.selectedObjects[0].Id;
        }

        return objectId;
    };

    this.offline_generateStyle = function() {
        // Отправка стилей ячеек
        var guiStyles = _api.wb.getCellStyles();
        //bResult = this.handlers.trigger("asc_onInitEditorStyles", guiStyles);
        // this.guiStyles = (false === bResult) ? guiStyles : null;
    };

    this.offline_beforeInit = function () {

        // STYLE MANAGER

        asc.asc_CStylesPainter.prototype.generateStylesAll = function (cellStylesAll, fmgrGraphics, oFont, stringRenderer) {

            var pxTomm = 1.0; // 72.0 / 96.0;

            this.styleThumbnailWidth = 92;// * pxTomm;
            this.styleThumbnailHeight = 48;// * pxTomm;

            this.styleThumbnailWidthPt = Math.floor(this.styleThumbnailWidth * pxTomm);
            this.styleThumbnailHeightPt = Math.floor(this.styleThumbnailHeight * pxTomm);

            this.styleThumbnailWidthWithRetina	= this.styleThumbnailWidth;
            this.styleThumbnailHeightWithRetina	= this.styleThumbnailHeight;


            window['native'].SetStylesType(0);

            this.generateDefaultStyles(cellStylesAll, fmgrGraphics, oFont, stringRenderer);
            this.generateDocumentStyles(cellStylesAll, fmgrGraphics, oFont, stringRenderer);
        };
        asc.asc_CStylesPainter.prototype.generateDefaultStyles = function (cellStylesAll, fmgrGraphics, oFont, stringRenderer) {
            var cellStyles = cellStylesAll.DefaultStyles;
            var oGraphics = new asc.DrawingContext({canvas: null, units: 0/*pt*/, fmgrGraphics: fmgrGraphics, font: oFont});

            var oStyle, oCustomStyle; var styleIndex = 0;
            for (var i = 0; i < cellStyles.length; ++i) {
                oStyle = cellStyles[i];
                if (oStyle.Hidden) {
                    continue;
                }

                // ToDo Возможно стоит переписать немного, чтобы не пробегать каждый раз по массиву custom-стилей (нужно генерировать AllStyles)
                oCustomStyle = cellStylesAll.getCustomStyleByBuiltinId(oStyle.BuiltinId);

                window['native'].BeginDrawDefaultStyle(oStyle.Name, styleIndex);
                this.drawStyle(oGraphics, stringRenderer, oCustomStyle || oStyle, oStyle.Name, styleIndex);
                window['native'].EndDrawStyle();
                ++styleIndex;
            }
        };
        asc.asc_CStylesPainter.prototype.generateDocumentStyles = function (cellStylesAll, fmgrGraphics, oFont, stringRenderer) {
            var cellStyles = cellStylesAll.CustomStyles;
            var oGraphics = new asc.DrawingContext({canvas: null, units: 0/*pt*/, fmgrGraphics: fmgrGraphics, font: oFont});

            var oStyle; var styleIndex = 10000;
            for (var i = 0; i < cellStyles.length; ++i) {
                oStyle = cellStyles[i];
                if (oStyle.Hidden || null != oStyle.BuiltinId) {
                    continue;
                }

                window['native'].BeginDrawDocumentStyle(oStyle.Name, styleIndex);
                this.drawStyle(oGraphics, stringRenderer, oStyle, oStyle.Name, styleIndex);
                window['native'].EndDrawStyle();
                ++styleIndex;
            }
        };
        asc.asc_CStylesPainter.prototype.drawStyle = function (oGraphics, stringRenderer, oStyle, sStyleName, nIndex) {

            var oColor = oStyle.getFill();
            if (null !== oColor) {
                oGraphics.setFillStyle(oColor);
                oGraphics.fillRect(0, 0, this.styleThumbnailWidthPt, this.styleThumbnailHeightPt);
            }

            var drawBorder = function (b, x1, y1, x2, y2) {
                if (null != b && c_oAscBorderStyles.None !== b.s) {
                    oGraphics.setStrokeStyle(b.c);
                    oGraphics.setLineWidth(b.w).beginPath();

                    window["native"]["PD_PathMoveTo"](x1, y1);
                    window["native"]["PD_PathLineTo"](x2, y2);

                    oGraphics.stroke();
                }
            };

            var oBorders = oStyle.getBorder();
            drawBorder(oBorders.l, 0, 0, 0, this.styleThumbnailHeightPt); // left
            drawBorder(oBorders.r, this.styleThumbnailWidthPt - 0.25, 0, this.styleThumbnailWidthPt - 0.25, this.styleThumbnailHeightPt);     // right
            drawBorder(oBorders.t, 0, 0, this.styleThumbnailWidthPt, 0); // up
            drawBorder(oBorders.b, 0, this.styleThumbnailHeightPt - 0.25, this.styleThumbnailWidthPt,  this.styleThumbnailHeightPt - 0.25);   // down

            // Draw text
            var fc = oStyle.getFontColor();
            var oFontColor = fc !== null ? fc : new CColor(0, 0, 0);
            var format = oStyle.getFont();
            // Для размера шрифта делаем ограничение для превью в 16pt (у Excel 18pt, но и высота превью больше 22px)
            var oFont = new asc.FontProperties(format.fn, (16 < format.fs) ? 16 : format.fs, format.b, format.i, format.u, format.s);

            var width_padding = 3; // 4 * 72 / 96

            var tm = stringRenderer.measureString(sStyleName);
            // Текст будем рисовать по центру (в Excel чуть по другому реализовано, у них постоянный отступ снизу)
            var textY = 0.5 * (this.styleThumbnailHeightPt - tm.height);
            oGraphics.setFont(oFont);
            oGraphics.setFillStyle(oFontColor);
            oGraphics.fillText(sStyleName, width_padding, textY + tm.baseline);
        };

        // AUTOFILTERS

        var pxToMM = 1;

        var styleThumbnailWidth  = Math.floor(92.0 * pxToMM);
        var styleThumbnailHeight = Math.floor(48.0 * pxToMM);

        asc.AutoFilters.prototype = Object.create (asc.AutoFilters.prototype);
        asc.AutoFilters.prototype.constructor = asc.AutoFilters;

        asc.AutoFilters.prototype.getTablePictures =  function(wb, fmgrGraphics, oFont) {

            window['native'].SetStylesType(1);

            if (AscBrowser.isRetina) {
                styleThumbnailWidth <<= 1;
                styleThumbnailHeight <<= 1;
            }

            var canvas = document.createElement('canvas');
            canvas.width = styleThumbnailWidth;
            canvas.height = styleThumbnailHeight;
            var customStyles = wb.TableStyles.CustomStyles;
            var result  = [];
            var options;
            var n = 0;
            if(customStyles)
            {
                for(var i in customStyles)
                {
                    if(customStyles[i].table)
                    {
                        window['native'].BeginDrawDocumentStyle(customStyles[i].name, n);
                        this._drawSmallIconTable(canvas, customStyles[i], fmgrGraphics, oFont);

//                        options =
//                        {
//                            name: i,
//                            displayName: customStyles[i].displayName,
//                            type: 'custom',
//                            image: this._drawSmallIconTable(canvas, customStyles[i], fmgrGraphics, oFont)
//                        };

                        // result[n] = new formatTablePictures(options);
                        n++;

                        window['native'].EndDrawStyle();
                    }
                }
            }
            var defaultStyles = wb.TableStyles.DefaultStyles;
            if(defaultStyles)
            {
                for(var i in defaultStyles)
                {
                    if(defaultStyles[i].table)
                    {
                        window['native'].BeginDrawDefaultStyle(defaultStyles[i].name, n);
                        this._drawSmallIconTable(canvas, defaultStyles[i], fmgrGraphics, oFont);

//                        options =
//                        {
//                            name: i,
//                            displayName: defaultStyles[i].displayName,
//                            type: 'default',
//                            image: this._drawSmallIconTable(canvas, defaultStyles[i], fmgrGraphics, oFont)
//                        };
                        //result[n] = new formatTablePictures(options);
                        n++;

                        window['native'].EndDrawStyle();
                    }
                }
            }
            return result;
        };
        asc.AutoFilters.prototype._drawSmallIconTable = function(canvas, style, fmgrGraphics, oFont) {

            var ctx = new Asc.DrawingContext({canvas: canvas, units: 0/*pt*/, fmgrGraphics: fmgrGraphics, font: oFont});
            var styleOptions = style;
            //по умолчанию ставим строку заголовка и чередующиеся строки, позже нужно будет получать параметр
            var styleInfo = false;

            var nativeRender = window["native"];

            if(!styleInfo)
            {
                styleInfo = {
                    ShowColumnStripes: false,
                    ShowFirstColumn: false,
                    ShowLastColumn: false,
                    ShowRowStripes: true,
                    TotalsRowCount: 0
                }
            }

            var xSize = styleThumbnailWidth  * pxToMM;       //61 * pxToMM;
            var ySize = styleThumbnailHeight * pxToMM;      //45 * pxToMM;

            var stepY = (ySize)/5;
            var stepX = (styleThumbnailWidth * pxToMM)/5;   //(60 * pxToMM)/5;
            var whiteColor = new CColor(255, 255, 255);
            var blackColor = new CColor(0, 0, 0);

            //**draw background**
            var defaultColorBackground;
            if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill)
                defaultColorBackground = styleOptions.wholeTable.dxf.fill.bg;
            else
                defaultColorBackground = whiteColor;

            var color;
            if(styleOptions != undefined)
            {
                if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
                {
                    ctx.setFillStyle(styleOptions.wholeTable.dxf.fill.bg);
                    ctx.fillRect(0,0,xSize,ySize);
                }
                else
                {
                    ctx.setFillStyle(whiteColor);
                    ctx.fillRect(0,0,xSize,ySize);
                }
                if(styleInfo.ShowColumnStripes)//column stripes
                {
                    for(k = 0; k < 6; k++)
                    {
                        color = defaultColorBackground;
                        if((k)%2 == 0)
                        {
                            if(styleOptions.firstColumnStripe && styleOptions.firstColumnStripe.dxf.fill && null != styleOptions.firstColumnStripe.dxf.fill.bg)
                                color =  styleOptions.firstColumnStripe.dxf.fill.bg;
                            else if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
                                color =  styleOptions.wholeTable.dxf.fill.bg;
                        }
                        else
                        {
                            if(styleOptions.secondColumnStripe && styleOptions.secondColumnStripe.dxf.fill && null != styleOptions.secondColumnStripe.dxf.fill.bg)
                                color = styleOptions.secondColumnStripe.dxf.fill.bg;
                            else if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
                                color =  styleOptions.wholeTable.dxf.fill.bg;
                        }
                        ctx.setFillStyle(color);
                        ctx.fillRect(k*stepX,0,stepX,ySize);
                    }
                }

                if(styleInfo.ShowRowStripes)//row stripes
                {
                    for(k = 0; k < 6; k++)
                    {
                        color = null;
                        if(styleOptions)//styleOptions.headerRow
                        {
                            if(k ==0)
                                k++;
                            if((k)%2 != 0)
                            {
                                if(styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill && null != styleOptions.firstRowStripe.dxf.fill.bg)
                                    color = styleOptions.firstRowStripe.dxf.fill.bg;
                            }
                            else
                            {
                                if(styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill && null != styleOptions.secondRowStripe.dxf.fill.bg)
                                    color = styleOptions.secondRowStripe.dxf.fill.bg;
                                else if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
                                    color = styleOptions.wholeTable.dxf.fill.bg;

                            }
                            if(color != null)
                            {
                                ctx.setFillStyle(color);
                                if(k == 1)
                                    ctx.fillRect(0, k*stepY, xSize, stepY);
                                else if(k == 3)
                                    ctx.fillRect(0, k*stepY, xSize,stepY);
                                else
                                    ctx.fillRect(0, k*stepY, xSize, stepY);
                                //else
                                //ctx.fillRect(0,k*stepY,xSize,stepY);
                            }

                        }
                        else
                        {
                            color = null;
                            if((k+1)%2 != 0)
                            {
                                if(styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill && null != styleOptions.firstRowStripe.dxf.fill.bg)
                                    color =  styleOptions.firstRowStripe.dxf.fill.bg;
                            }
                            else
                            {
                                if(styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill && null != styleOptions.secondRowStripe.dxf.fill.bg)
                                    color =  styleOptions.secondRowStripe.dxf.fill.bg;
                                else if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg)
                                    color =  styleOptions.wholeTable.dxf.fill.bg;
                            }

                            if(color != null)
                            {
                                ctx.setFillStyle(color);
                                ctx.fillRect(0, k*stepY, xSize, stepY);
                            }
                        }

                    }

                }
                if(styleInfo.ShowFirstColumn && styleOptions.firstColumn)//first column
                {
                    if(styleOptions.firstColumn && styleOptions.firstColumn.dxf.fill && null != styleOptions.firstColumn.dxf.fill.bg)
                        ctx.setFillStyle(styleOptions.firstColumn.dxf.fill.bg);
                    else
                        ctx.setFillStyle(defaultColorBackground);
                    ctx.fillRect(0,0,stepX,ySize);
                }
                if(styleInfo.ShowLastColumn)//last column
                {
                    color = null;
                    if(styleOptions.lastColumn && styleOptions.lastColumn.dxf.fill && null != styleOptions.lastColumn.dxf.fill.bg)
                        color =styleOptions.lastColumn.dxf.fill.bg;

                    if(color != null)
                    {
                        ctx.setFillStyle(color);
                        ctx.fillRect(4*stepX,0,stepX,ySize);
                    }

                }
                if(styleOptions)//header row
                {
                    if(styleOptions.headerRow && styleOptions.headerRow.dxf.fill && null != styleOptions.headerRow.dxf.fill.bg)
                    {
                        ctx.setFillStyle(styleOptions.headerRow.dxf.fill.bg);
                    }
                    else
                    {
                        ctx.setFillStyle(defaultColorBackground);
                    }
                    ctx.fillRect(0, 0, xSize, stepY);

                }
                if(styleInfo.TotalsRowCount)//total row
                {
                    color = null;
                    if(styleOptions.totalRow && styleOptions.totalRow.dxf.fill && null != styleOptions.totalRow.dxf.fill.bg)
                        color = styleOptions.totalRow.dxf.fill.bg;
                    else
                        color = defaultColorBackground;
                    ctx.setFillStyle(color);
                    ctx.fillRect(0, stepY*4, xSize, stepY);
                }


                //первая ячейка
                if(styleOptions.firstHeaderCell && styleInfo.ShowFirstColumn)
                {
                    if(styleOptions.firstHeaderCell && styleOptions.firstHeaderCell.dxf.fill && null != styleOptions.firstHeaderCell.dxf.fill.bg)
                        ctx.setFillStyle(styleOptions.firstHeaderCell.dxf.fill.bg);
                    else
                        ctx.setFillStyle(defaultColorBackground);
                    ctx.fillRect(0,0,stepX,stepY);
                }
                //последняя в первой строке
                if(styleOptions.lastHeaderCell && styleInfo.ShowLastColumn)
                {
                    if(styleOptions.lastHeaderCell && styleOptions.lastHeaderCell.dxf.fill && null != styleOptions.lastHeaderCell.dxf.fill.bg)
                        ctx.setFillStyle(styleOptions.lastHeaderCell.dxf.fill.bg);
                    else
                        ctx.setFillStyle(defaultColorBackground);
                    ctx.fillRect(4*stepX,0,stepX,stepY);
                }
                //первая в последней строке
                if(styleOptions.firstTotalCell  && styleInfo.TotalsRowCount && styleInfo.ShowFirstColumn)
                {
                    if(styleOptions.firstTotalCell && styleOptions.firstTotalCell.dxf.fill && null != styleOptions.firstTotalCell.dxf.fill.bg)
                        ctx.setFillStyle(styleOptions.firstTotalCell.dxf.fill.bg);
                    else
                        ctx.setFillStyle(defaultColorBackground);
                    ctx.fillRect(0,4*stepY,stepX,stepY);
                }
                //последняя ячейка
                if(styleOptions.lastTotalCell  && styleInfo.TotalsRowCount && styleInfo.ShowLastColumn)
                {
                    if(styleOptions.lastTotalCell && styleOptions.lastTotalCell.dxf.fill && null != styleOptions.lastTotalCell.dxf.fill.bg)
                        ctx.setFillStyle(styleOptions.lastTotalCell.dxf.fill.bg);
                    else
                        ctx.setFillStyle(defaultColorBackground);
                    ctx.fillRect(4*stepX,4*stepY,stepX,ySize);
                }

            }
            else
            {
                ctx.setFillStyle(whiteColor);
                ctx.fillRect(0,0,xSize,ySize);
            }

            //**draw vertical and horizontal lines**
            if(styleOptions != undefined)
            {
                ctx.setLineWidth(1);
                ctx.beginPath();
                if(styleOptions.wholeTable && styleOptions.wholeTable.dxf.border)
                {
                    var borders = styleOptions.wholeTable.dxf.border;
                    if(borders.t.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(borders.t.c);
                        ctx.lineHor(0, 0, xSize);
                    }
                    if(borders.b.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(borders.b.c);
                        // ctx.lineHor(0, ySize-0.5, xSize);

                        nativeRender["PD_PathMoveTo"](0, ySize-0.5);
                        nativeRender["PD_PathLineTo"](xSize, ySize-0.5);
                    }
                    if(borders.l.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(borders.l.c);
                        ctx.lineVer(0, 0, ySize);
                    }
                    if(borders.r.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(borders.r.c);
                        //ctx.lineVer(xSize-0.5, 0, ySize);

                        nativeRender["PD_PathMoveTo"](xSize-0.5, 0);
                        nativeRender["PD_PathLineTo"](xSize-0.5, ySize);
                    }
                    if(borders.ih.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(borders.ih.c);
                        for(var n = 1; n < 5; n++)
                        {
                            ctx.lineHor(0, stepY*n, xSize);
                        }
                        ctx.stroke();
                    }
                    if(borders.iv.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(borders.iv.c);
                        for(var n = 1; n < 5; n++)
                        {
                            ctx.lineVer(stepX*n, 0, ySize);
                        }
                        ctx.stroke();
                    }

                }

                var border;
                if(styleInfo.ShowRowStripes)
                {
                    if(styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.border)
                        border = styleOptions.firstRowStripe.dxf.border;
                    else if(styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.border)
                        border = styleOptions.secondRowStripe.dxf.border;

                    if(border)
                    {
                        for(n = 1; n < 5; n++)
                        {
                            ctx.lineHor(0, stepY*n, xSize);
                        }
                        ctx.stroke();
                    }
                }
                if(styleOptions.totalRow && styleInfo.TotalsRowCount && styleOptions.totalRow.dxf.border)
                {
                    border = styleOptions.totalRow.dxf.border;
                    if(border.t.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(border.t.c);
                        ctx.lineVer(0, xSize, ySize);
                    }
                }
                if(styleOptions.headerRow && styleOptions.headerRow.dxf.border)//header row
                {
                    border = styleOptions.headerRow.dxf.border;
                    if(border.t.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(border.t.c);
                        ctx.lineHor(0, 0, xSize);
                    }
                    if(border.b.s !== c_oAscBorderStyles.None)
                    {
                        ctx.setStrokeStyle(border.b.c);
                        ctx.lineHor(0, stepY, xSize);
                    }
                    ctx.stroke();
                }
                ctx.closePath();
            }

            //**draw marks line**
            var defaultColor;
            if(!styleOptions || !styleOptions.wholeTable || !styleOptions.wholeTable.dxf.font)
                defaultColor = blackColor;
            else
                defaultColor = styleOptions.wholeTable.dxf.font.c;

            for(var n = 1; n < 6; n++)
            {
                ctx.beginPath();
                color = null;
                if(n == 1 && styleOptions && styleOptions.headerRow && styleOptions.headerRow.dxf.font)
                    color = styleOptions.headerRow.dxf.font.c;
                else if(n == 5 && styleOptions && styleOptions.totalRow && styleOptions.totalRow.dxf.font)
                    color = styleOptions.totalRow.dxf.font.c;
                else if(styleOptions && styleOptions.headerRow && styleInfo.ShowRowStripes)
                {
                    if((n == 2 || (n == 5 && !styleOptions.totalRow)) &&  styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.font)
                        color  = styleOptions.firstRowStripe.dxf.font.c;
                    else if(n == 3 && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font)
                        color  = styleOptions.secondRowStripe.dxf.font.c;
                    else
                        color = defaultColor
                }
                else if(styleOptions && !styleOptions.headerRow && styleInfo.ShowRowStripes)
                {
                    if((n == 1 || n == 3 || (n == 5 && !styleOptions.totalRow)) && styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.font)
                        color  = styleOptions.firstRowStripe.dxf.font.c;
                    else if((n == 2 || n == 4) && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font)
                        color  = styleOptions.secondRowStripe.dxf.font.c;
                    else
                        color = defaultColor
                }
                else
                    color = defaultColor;
                ctx.setStrokeStyle(color);
                var k = 0;
                var strY = n*stepY - stepY/2;
                while(k < 6)
                {
                    //ctx.lineHor(k*stepX + 3 * pxToMM, strY, (k + 1)*stepX - 2 * pxToMM);

                    nativeRender["PD_PathMoveTo"](k*stepX + stepX * 0.25, strY);
                    nativeRender["PD_PathLineTo"]((k + 1)*stepX - stepX * 0.25, strY);
                    k++;
                }
                ctx.stroke();
                ctx.closePath();
            }
        };

        // chat styles
        ChartPreviewManager.prototype.clearPreviews = function() {
            window["native"]["ClearCacheChartStyles"]();
        };
        ChartPreviewManager.prototype.createChartPreview = function(_graphics, type, styleIndex) {
            return ExecuteNoHistory(function(){
                if(!this.chartsByTypes[type])
                    this.chartsByTypes[type] = this.getChartByType(type);
                var chart_space = this.chartsByTypes[type];
                if(chart_space.style !== styleIndex)
                {
                    chart_space.style = styleIndex;
                    chart_space.recalculateMarkers();
                    chart_space.recalculateSeriesColors();
                    chart_space.recalculatePlotAreaChartBrush();
                    chart_space.recalculatePlotAreaChartPen();
                    chart_space.recalculateChartBrush();
                    chart_space.recalculateChartPen();
                    chart_space.recalculateUpDownBars();
                }
                chart_space.recalculatePenBrush();

                var _width_px = this.CHART_PREVIEW_WIDTH_PIX;
                var _height_px = this.CHART_PREVIEW_WIDTH_PIX;
                if (AscBrowser.isRetina)
                {
                    _width_px <<= 1;
                    _height_px <<= 1;
                }

                window['native'].BeginDrawDefaultStyle(type + '', styleIndex);

                //window["native"]["DD_StartNativeDraw"](_width_px, _height_px, 50, 50);

                var dKoefToMM = g_dKoef_pix_to_mm;
                if (this.IsRetinaEnabled)
                    dKoefToMM /= 2;

                chart_space.draw(_graphics);
                _graphics.ClearParams();

                window['native'].EndDrawStyle();

//               var _stream = global_memory_stream_menu;
//               _stream["ClearNoAttack"]();
//               _stream["WriteByte"](4);
//               _stream["WriteLong"](type);
//               _stream["WriteLong"](styleIndex);
//                window["native"]["DD_EndNativeDraw"](_stream);

            }, this, []);

        };
        ChartPreviewManager.prototype.getChartPreviews = function(chartType) {
            // console.log('NATIVE getChartPreviews : ' + chartType);

            if (isRealNumber(chartType))
            {
                var bIsCached = window["native"]["IsCachedChartStyles"](chartType);
                if (!bIsCached)
                {
                    // window["native"]["DD_PrepareNativeDraw"]();

                    window['native'].SetStylesType(2);

                    var _graphics = new CDrawingStream();

                    for (var i = 1; i < 49; ++i) {
                        this.createChartPreview(_graphics, chartType, i);
                    }

                    // var _stream = global_memory_stream_menu;
                    // _stream["ClearNoAttack"]();
                    // _stream["WriteByte"](5);
                    // _api.WordControl.m_oDrawingDocument.Native["DD_EndNativeDraw"](_stream);
                }
            }
        };

        if (this.translate) {
            var t = JSON.parse(this.translate);
            if (t) {
                var translateChart = new Asc.asc_CChartTranslate();
                if (t['diagrammtitle']) translateChart.asc_setTitle(t['diagrammtitle']);
                if (t['xaxis']) translateChart.asc_setXAxis(t['xaxis']);
                if (t['yaxis']) translateChart.asc_setYAxis(t['yaxis']);
                if (t['series']) translateChart.asc_setSeries(t['series']);
                _api.asc_setChartTranslate(translateChart);

                var translateArt = new Asc.asc_TextArtTranslate();
                if (t['art'])translateArt.asc_setDefaultText(t['art']);
                _api.asc_setTextArtTranslate(translateArt);
            }
        }
    };
    this.offline_afteInit = function () {
        window.AscAlwaysSaveAspectOnResizeTrack = true;
    };
}
var _s = new OfflineEditor();

function offline_of() {_s.openFile();}
function offline_stz(v) {_s.zoom = v; _api.asc_setZoom(v);}
function offline_ds(x, y, width, height, ratio) {_s.drawSheet(x, y, width, height, ratio);}
function offline_dh(x, y, width, height, type, ratio) {_s.drawHeader(x, y, width, height, type, ratio);}

function offline_mouse_down(x, y, pin, isViewerMode, isFormulaEditMode, isRangeResize, isChartRange, indexRange, resizeRange, targetCol, targetRow) {
    _s.isShapeAction = false;

    var ws = _api.wb.getWorksheet();
    var wb = _api.wb;

    _s._resizeWorkRegion(ws, x, y, true);

    var range =  ws.visibleRange.clone();
    range.c1 = _s.col0;
    range.r1 = _s.row0;
    ws.visibleRange = range;

    ws.objectRender.drawingArea.reinitRanges();
    var graphicsInfo = wb._onGetGraphicsInfo(x, y);
    if (graphicsInfo) {
        var e = {isLocked: true, Button: 0, ClickCount: 1, shiftKey: false, metaKey: false, ctrlKey: false};

        ws.arrActiveChartsRanges = [];

        wb._onGraphicObjectMouseDown(e, x, y);
        wb._onUpdateSelectionShape(true);

        _s.isShapeAction = true;
        ws.visibleRange = range;

        if (!graphicsInfo.object.graphicObject instanceof CChartSpace) {
            ws.isChartAreaEditMode = false;
        }

        return {
            id:graphicsInfo.id//,
            //ischart: graphicsInfo.object.graphicObject instanceof CChartSpace
        };
    }

    _s.cellPin = pin;
    _s.isFormulaEditMode = isFormulaEditMode;

    if (isRangeResize) {

        if (!isViewerMode) {

            var ct = ws.getCursorTypeFromXY(x, y, isViewerMode);

            //console.log(JSON.stringify(ct));

            ws.startCellMoveResizeRange = null;

            var rangeChange = new asc.Range(resizeRange[0], resizeRange[1], resizeRange[2], resizeRange[3]);
            var target = {
                formulaRange: rangeChange,
                row: ct.row, //isChartRange ? ct.row : targetRow,
                col: ct.col, //isChartRange ? ct.col : targetCol,
                target: ct.target,
                targetArr: isChartRange ? -1 : 0,
                cursor: "se-resize",
                indexFormulaRange: indexRange
            };
            ws.changeSelectionMoveResizeRangeHandle(x, y, target, wb.cellEditor);
        }

    } else {

        if (0 != _s.cellPin) {
            ws.leftTopRange = ws.activeRange.clone();
        } else {

            var ret = false;
            if (isFormulaEditMode) {
                ret = wb.cellEditor.canEnterCellRange();
                ret ? wb.cellEditor.activateCellRange() : true;
            }

            if (isFormulaEditMode && !ret) {
                _s.isFormulaEditMode = false;
                return {'action':'closeCellEditor'};
            }

            ws.changeSelectionStartPoint(x, y, true, true);

            if (isFormulaEditMode) {
                if (ret) {
                    ws.enterCellRange(wb.cellEditor);
                }
            }
        }
    }

    ws.visibleRange = range;

    return null;
}
function offline_mouse_move(x, y, isViewerMode, isRangeResize, isChartRange, indexRange, resizeRange, targetCol, targetRow) {
    var ws = _api.wb.getWorksheet();
    var wb = _api.wb;

    var range =  ws.visibleRange.clone();
    range.c1 = _s.col0;
    range.r1 = _s.row0;
    ws.visibleRange = range;

    if (isRangeResize) {
        if (!isViewerMode) {
            var ct = ws.getCursorTypeFromXY(x, y, isViewerMode);

            var rangeChange = new asc.Range(resizeRange[0], resizeRange[1], resizeRange[2], resizeRange[3]);
            var target = {
                //formulaRange: rangeChange,
                row: isChartRange ? ct.row : targetRow,
                col: isChartRange ? ct.col : targetCol,
                target: ct.target,
                targetArr: isChartRange ? -1 : 0,
                cursor: "se-resize",
                indexFormulaRange: indexRange
            };
            ws.changeSelectionMoveResizeRangeHandle(x, y, target, wb.cellEditor);
        }
    } else {

        if (_s.isShapeAction) {
            if (!isViewerMode) {

                var e = {isLocked: true, Button: 0, ClickCount: 1, shiftKey: false, metaKey: false, ctrlKey: false};
                ws.objectRender.graphicObjectMouseMove(e, x, y);
            }
        } else {
            if (_s.isFormulaEditMode) {

                var ret = false;
                ret = wb.cellEditor.canEnterCellRange();
                ret ? wb.cellEditor.activateCellRange() : true;

                if (!ret) {
                    _s.isFormulaEditMode = false;
                    ws.visibleRange = range;
                    return {'action':'closeCellEditor'};
                }

                ws.changeSelectionEndPoint(x, y, true, true);
                ws.enterCellRange(wb.cellEditor);
            } else {
                if (-1 == _s.cellPin)
                    ws.__changeSelectionTopLeft(x, y, true, true, true);
                else if (1 === _s.cellPin)
                    ws.__changeSelectionTopLeft(x, y, true, true, false);
                else {
                    ws.changeSelectionEndPoint(x, y, true, true);
                }
            }
        }
    }

    ws.visibleRange = range;

    return null;
}
function offline_mouse_up(x, y, isViewerMode, isRangeResize, isChartRange, indexRange, resizeRange, targetCol, targetRow) {
    var ret = null;
    var ws = _api.wb.getWorksheet();
    var wb = _api.wb;

    var range =  ws.visibleRange.clone();
    range.c1 = _s.col0;
    range.r1 = _s.row0;
    ws.visibleRange = range;

    if (_s.isShapeAction) {
        var e = {isLocked: true, Button: 0, ClickCount: 1, shiftKey: false, metaKey: false, ctrlKey: false};
        wb._onGraphicObjectMouseUp(e, x, y);
        wb._onChangeSelectionDone(x, y);
        _s.isShapeAction = false;

        ret = {'isShapeAction': true};

    } else {

        if (isRangeResize) {
            if (!isViewerMode) {
                // var ct = ws.getCursorTypeFromXY(x, y, isViewerMode);
                var target = {
                    //row: isChartRange ? ct.row : targetRow,
                    //col: isChartRange ? ct.col : targetCol,
                    target: 5,
                    targetArr: isChartRange ? -1 : 0,
                    cursor: "se-resize",
                    indexFormulaRange: indexRange
                };

                if (ws.moveRangeDrawingObjectTo) {
                    ws.moveRangeDrawingObjectTo.c1 = Math.max(0, ws.moveRangeDrawingObjectTo.c1);
                    ws.moveRangeDrawingObjectTo.c2 = Math.max(0, ws.moveRangeDrawingObjectTo.c2);
                    ws.moveRangeDrawingObjectTo.r1 = Math.max(0, ws.moveRangeDrawingObjectTo.r1);
                    ws.moveRangeDrawingObjectTo.r2 = Math.max(0, ws.moveRangeDrawingObjectTo.r2);
                }

                ws.applyMoveResizeRangeHandle(target);
            }
        } else {

            wb._onChangeSelectionDone(-1, -1);
            _s.cellPin = 0;
            wb.getWorksheet().leftTopRange = undefined;
        }
    }

    ws.visibleRange = range;

    return ret;
}

function offline_get_selection(x, y, width, height, autocorrection) {
    return _s.getSelection(x, y, width, height, autocorrection);
}
function offline_get_charts_ranges() {

    return {'ranges': _api.wb.getWorksheet().__chartsRanges()};
}
function offline_get_worksheet_bounds() {
    return _s.getMaxBounds();
}
function offline_complete_cell(x, y) {
    return _s.getNearCellCoord(x, y);
}
function offline_keyboard_down(keys) {
    var wb = _api.wb;
    var ws = _api.wb.getWorksheet();

    var isFormulaEditMode = ws.isFormulaEditMode;
    ws.isFormulaEditMode = false;

    for (var i = 0; i < keys.length; ++i) {
        if (37 === keys[i][2])          // LEFT
            wb._onChangeSelection(true, -1, 0, false, false, undefined);
        else if (39 === keys[i][2])     // RIGHT
            wb._onChangeSelection(true, 1, 0, false, false, undefined);
        if (38 === keys[i][2])          // UP
            wb._onChangeSelection(true, 0, -1, false, false, undefined);
        else if (40 === keys[i][2])     // DOWN
            wb._onChangeSelection(true, 0, 1, false, false, undefined);
        else if (9 === keys[i][2])     // TAB
            wb._onChangeSelection(true, -1, 0, false, false, undefined);
        else if (13 === keys[i][2])     // ENTER
            wb._onChangeSelection(true, 0, 1, false, false, undefined);
    }

    ws.isFormulaEditMode = isFormulaEditMode;
}

function offline_cell_editor_draw(width, height, ratio) {
    _null_object.width = width * ratio;
    _null_object.height = height * ratio;

    var wb = _api.wb;
    var cellEditor = _api.wb.cellEditor;
    cellEditor._draw();

    return [wb.cellEditor.left, wb.cellEditor.top, wb.cellEditor.right, wb.cellEditor.bottom,
        wb.cellEditor.curLeft, wb.cellEditor.curTop, wb.cellEditor.curHeight,
        cellEditor.textRender.chars.length];
}
function offline_cell_editor_open(x, y, width, height, ratio, isSelectAll, isFormulaInsertMode, c1, r1, c2, r2)  {
    _null_object.width = width * ratio;
    _null_object.height = height * ratio;

    var wb = _api.wb;
    var ws = _api.wb.getWorksheet();

    var range =  ws.visibleRange.clone();
    ws.visibleRange.c1 = c1;
    ws.visibleRange.r1 = r1;
    ws.visibleRange.c2 = c2;
    ws.visibleRange.r2 = r2;

    wb.cellEditor.isSelectAll = isSelectAll;
    if (! isFormulaInsertMode) {
        wb._onEditCell(x, y, true, undefined, undefined, true, false);
    } else {
        // wb.cellEditor._draw();
    }

    ws.visibleRange = range;
}

function offline_cell_editor_process_input_commands(commands, width, height, ratio) {
    _null_object.width = width * ratio;
    _null_object.height = height * ratio;

    var wb = _api.wb;
    var cellEditor =  _api.wb.cellEditor;
    var operationCode, left,right, position, value, value2;

    for (var i = 0; i < commands.length; ++i) {
        operationCode = commands[i][0];
        value = commands[i][1];
        value2 = commands[i][2];

        var event = {which:value,metaKey:undefined,ctrlKey:undefined};

        switch (operationCode) {

            // KEY_DOWN
            case 0: {
                cellEditor._onWindowKeyDown(event);
                break;
            }

            // KEY_PRESS
            case 1: {
                cellEditor._onWindowKeyPress(event);
                break;
            }

            // MOVE
            case 2: {
                position = value;
                if (position < 0) {
                    cellEditor._moveCursor(position); // var kEndOfText = -4;
                } else {
                    cellEditor._moveCursor(-11, position);
                }
                break;
            }

            // SELECT
            case 3: {

                left = value;
                right = value2;

                cellEditor.cursorPos = left;
                cellEditor.selectionBegin = left;
                cellEditor.selectionEnd = right;

                break;
            }

            // PASTE
            case 4: {
                cellEditor.pasteText(commands[i][3]);
                break;
            }

            // 5 - REFRESH - noop command

            // SELECT_ALL
            case 6: {
                cellEditor._moveCursor(-2);    // var kBeginOfText = -2;
                cellEditor._selectChars(-4);   // var kEndOfText = -4;
                break;
            }

            // SELECT_WORD
            case 7: {

                cellEditor.isSelectMode = c_oAscCellEditorSelectState.word;
                // Окончание слова
                var endWord = cellEditor.textRender.getNextWord(cellEditor.cursorPos);
                // Начало слова (ищем по окончанию, т.к. могли попасть в пробел)
                var startWord = cellEditor.textRender.getPrevWord(endWord);

                cellEditor._moveCursor(-11, startWord);  // var kPosition = -11;
                cellEditor._selectChars(-11, endWord);

                break;
            }

            // DELETE_TEXT
            case 8: {
                cellEditor._removeChars(-8);  // var kPrevChar = -8;
                break;
            }
        }
    }

    cellEditor._draw();

    return [cellEditor.left, cellEditor.top, cellEditor.right, cellEditor.bottom,
        cellEditor.curLeft, cellEditor.curTop, cellEditor.curHeight,
        cellEditor.textRender.chars.length];
}

function offline_cell_editor_mouse_event(events) {

    var left, right;
    var cellEditor =  _api.wb.cellEditor;

    for (var i = 0; i < events.length; ++i) {
        var event = {
            pageX:events[i][1],
            pageY:events[i][2],
            which: 1,
            shiftKey:events[i][3],
            button:0
        };

        if (events[i][3]) {
            if (-1 == events[i][4]) {
                left = Math.min(cellEditor.selectionBegin, cellEditor.selectionEnd);
                right = Math.max(cellEditor.selectionBegin, cellEditor.selectionEnd);
                cellEditor.cursorPos = left;
                cellEditor.selectionBegin = right;
                cellEditor.selectionEnd = left;

                _s.textSelection = -1;
            }

            if (1 == events[i][4]) {
                left = Math.min(cellEditor.selectionBegin, cellEditor.selectionEnd);
                right = Math.max(cellEditor.selectionBegin, cellEditor.selectionEnd);
                cellEditor.cursorPos = right;
                cellEditor.selectionBegin = left;
                cellEditor.selectionEnd = right;

                _s.textSelection = 1;
            }
        }

        if (0 === events[i][0]) {
            var pos = cellEditor.cursorPos;
            left = cellEditor.selectionBegin;
            right = cellEditor.selectionEnd;

            cellEditor.clickCounter.clickCount = 1;

            cellEditor._onMouseDown(event);

            if (-1 === _s.textSelection) {
                cellEditor.cursorPos = Math.min(left - 1, cellEditor.cursorPos);
                cellEditor.selectionBegin = left;
                cellEditor.selectionEnd = Math.min(left - 1, cellEditor.selectionEnd);
            }
            else if (1 === _s.textSelection) {
                cellEditor.cursorPos = Math.max(left + 1, cellEditor.cursorPos);
                cellEditor.selectionBegin = left;
                cellEditor.selectionEnd = Math.max(left + 1, cellEditor.selectionEnd);
            }

        } else if (1 === events[i][0]) {
            cellEditor._onMouseUp(event);
            _s.textSelection = 0;
        } else if (2 == events[i][0]) {

            cellEditor._onMouseMove(event);

        } else if (3 == events[i][0]) {
            cellEditor.clickCounter.clickCount = 2;
            cellEditor._onMouseDown(event);
            cellEditor._onMouseUp(event);
            cellEditor.clickCounter.clickCount = 0;

            _s.textSelection = 0;
        }
    }

    return [cellEditor.left, cellEditor.top, cellEditor.right, cellEditor.bottom,
        cellEditor.curLeft, cellEditor.curTop, cellEditor.curHeight,
        cellEditor.textRender.chars.length];
}
function offline_cell_editor_close(x, y, width, height, ratio) {
    var e = {which: 13, shiftKey: false, metaKey: false, ctrlKey: false};
    var cellEditor =  _api.wb.cellEditor;

    // TODO: SHOW POPUP

    var length = cellEditor.undoList.length;

    if (cellEditor.close(true)) {
        _api.wb.getWorksheet().handlers.trigger('applyCloseEvent', e);
    } else {
        cellEditor.close();
        length = 0;
    }

    _api.wb._onWSSelectionChanged(null);

    return {'undo': length};
}
function offline_cell_editor_selection() {
    return _api.wb.cellEditor._drawSelection();
}
function offline_cell_editor_move_select(position) {
    var cellEditor =  _api.wb.cellEditor;

    cellEditor._moveCursor(-11, Math.min(position,cellEditor.textRender.chars.length));

//    cellEditor.cursorPos = position;
//    cellEditor.selectionBegin = position;
//    cellEditor.selectionEnd = position;
}
function offline_cell_editor_select_range(from, to) {
    var cellEditor =  _api.wb.cellEditor;

    cellEditor.cursorPos = from;
    cellEditor.selectionBegin = from;
    cellEditor.selectionEnd = to;
}

function offline_get_cell_in_coord (x, y) {
    var worksheet = _api.wb.getWorksheet(),
        activeCell = worksheet.getActiveCell(x, y, true);

    return [
        activeCell.c1,
        activeCell.r1,
        activeCell.c2,
        activeCell.r2,
        worksheet.cols[activeCell.c1].left,
        worksheet.rows[activeCell.r1].top,
        worksheet.cols[activeCell.c1].width,
        worksheet.rows[activeCell.r1].height];
}
function offline_get_cell_coord (c, r) {
    var worksheet = _api.wb.getWorksheet();

    return [
        worksheet.cols[c].left,
        worksheet.rows[r].top,
        worksheet.cols[c].width,
        worksheet.rows[r].height];
}
function offline_get_header_sizes() {
    var worksheet = _api.wb.getWorksheet();
    return [worksheet.headersWidth, worksheet.headersHeight];
}
function offline_get_graphics_object(x, y) {
    var ws = _api.wb.getWorksheet();
    ws.objectRender.drawingArea.reinitRanges();

    var drawingInfo = ws.objectRender.checkCursorDrawingObject(x, y);
    if (drawingInfo) {
        return drawingInfo.id;
    }

    return null;
}
function offline_get_selected_object() {
    var ws = _api.wb.getWorksheet();
    var selectedImages = ws.objectRender.getSelectedGraphicObjects();
    if(selectedImages && selectedImages.length)
    {
        return selectedImages[0].Get_Id();
    }

    return null;
}
function offline_can_enter_cell_range() {
    var wb = _api.wb;
    return wb.cellEditor.canEnterCellRange();
}
function offline_insertFormula(functionName, autoComplete, isDefName) {
    var ws = _api.wb.getWorksheet();
    var wb = _api.wb;
    var t = ws, cursorPos;

    var cellRange = null;
    // Если нужно сделать автозаполнение формулы, то ищем ячейки)
    if (autoComplete) {
        cellRange = ws.autoCompleteFormula(functionName);
    }

    if (isDefName) {
        functionName = "=" + functionName;
    } else{
        if (cellRange) {
            if (cellRange.notEditCell) {
                // Мы уже ввели все что нужно, редактор открывать не нужно
                return null;
            }
            // Меняем значение ячейки
            functionName = "=" + functionName + "(" + cellRange.text + ")";
        } else {
            // Меняем значение ячейки
            functionName = "=" + functionName + "()";
        }
        // Вычисляем позицию курсора (он должен быть в функции)
        cursorPos = functionName.length - 1;
    }

    var arn = ws.activeRange.clone(true);

    var openEditor = function (res) {
        if (res) {
            // Выставляем переменные, что мы редактируем
            // t.controller.setCellEditMode(true);
            ws.setCellEditMode(true);

            ws.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editStart);
            if (isDefName)
                ws.skipHelpSelector = true;
            // Открываем, с выставлением позиции курсора
            if (!ws.openCellEditorWithText(wb.cellEditor, functionName, cursorPos, /*isFocus*/false,
                /*activeRange*/arn)) {
                ws.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editEnd);
                // t.controller.setCellEditMode(false);
                // t.controller.setStrictClose(false);
                // t.controller.setFormulaEditMode(false);
                ws.setCellEditMode(false);
                ws.setFormulaEditMode(false);
            }
            if (isDefName)
                ws.skipHelpSelector = false;

            return  [wb.cellEditor.left, wb.cellEditor.top, wb.cellEditor.right, wb.cellEditor.bottom,
                wb.cellEditor.curLeft, wb.cellEditor.curTop, wb.cellEditor.curHeight];

        } else {
            //t.controller.setCellEditMode(false);
            //t.controller.setStrictClose(false);
            //t.controller.setFormulaEditMode(false);
            ws.setCellEditMode(false);
            ws.setFormulaEditMode(false);
        }
    };

    return openEditor(true);
}

function offline_copy() {

    var worksheet = _api.wb.getWorksheet();
    var sBase64 = {};

    if (_api.wb.cellEditor.isOpened) {
        var v = _api.wb.cellEditor.copySelection();
        if (v) {
            sBase64.text = _api.wb.cellEditor._getFragmentsText(v);
            sBase64.sBase64 = '';
            sBase64.drawingUrls = null;
        }
    }
    else {
        sBase64 = _api.wb.clipboard.getSelectedBinary(false);
    }

    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    // TODO: для картинок и текста
    if (!sBase64)
    {
        _stream["WriteByte"](255);
        return _stream;
    }

    _stream["WriteByte"](0);
    _stream["WriteString2"](sBase64.text);

    // image
    if (null != sBase64.drawingUrls && sBase64.drawingUrls.length > 0)
    {
        _stream["WriteByte"](1);
        _stream["WriteStringA"](sBase64.drawingUrls[0]);
    }
    // else
    //{
    // owner format
    _stream["WriteByte"](2);
    _stream["WriteStringA"](sBase64.sBase64);
    // }

    // _stream["WriteByte"](3);
    // _stream["WriteString2"](sBase64.html);

    _stream["WriteByte"](255);

    return _stream;
}
function offline_paste(params) {
    var type = params[0];
    var worksheet = _api.wb.getWorksheet();

    if (0 == type)
    {
        _api.wb.clipboard._pasteTextOnSheet(params[1],worksheet);
    }
    else if (1 == type)
    {
        _s.offline_addImageDrawingObject(params[1], {width: params[2], height: params[3]});
    }
    else if (2 == type)
    {
        _api.wb.clipboard._pasteFromBinaryExcel(worksheet, params[1]);
    }
}
function offline_cut() {
    var worksheet = _api.wb.getWorksheet();
    var sBase64 = {};

    if (_api.wb.cellEditor.isOpened) {
        var v = _api.wb.cellEditor.copySelection();
        if (v) {
            sBase64.text = _api.wb.cellEditor._getFragmentsText(v);
            sBase64.sBase64 = '';
            sBase64.drawingUrls = null;

            _api.wb.cellEditor.cutSelection();
        }
    }
    else {
        sBase64 =  _api.wb.clipboard.getSelectedBinary(true);
        worksheet.emptySelection(c_oAscCleanOptions.All);
    }

    var _stream = global_memory_stream_menu;
    _stream["ClearNoAttack"]();

    // TODO: для картинок и текста
    if (!sBase64)
    {
        _stream["WriteByte"](255);
        return _stream;
    }

    // text format
    _stream["WriteByte"](0);
    _stream["WriteString2"](sBase64.text);

    // image
    if (null != sBase64.drawingUrls && sBase64.drawingUrls.length > 0)
    {
        _stream["WriteByte"](1);
        _stream["WriteStringA"](sBase64.drawingUrls[0]);
    }

    _stream["WriteByte"](2);
    _stream["WriteStringA"](sBase64.sBase64);

    _stream["WriteByte"](255);

    return _stream;
}
function offline_delete() {
    var e = {altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 0,
        ctrlKey: false,
        defaultPrevented: false,
        detail: 0,
        eventPhase: 3,
        keyCode: 46,
        type: 'keydown',
        which: 46,
        preventDefault: function() {}
    };

    var stream = global_memory_stream_menu;
    stream["ClearNoAttack"]();

    var ws = _api.wb.getWorksheet();
    var graphicObjects = ws.objectRender.getSelectedGraphicObjects();
    if (graphicObjects.length) {
        if (ws.objectRender.graphicObjectKeyDown(e)) {
            stream["WriteLong"](1);    // SHAPE
            return stream;
        }
    }

    stream["WriteString"](0);

    var worksheet = _api.wb.getWorksheet();
    worksheet.emptySelection(c_oAscCleanOptions.Text);

    return stream;
}
function offline_calculate_range(x, y, w, h) {

    var ws = _api.wb.getWorksheet();
    var range = _s._updateRegion(ws, x, y, w, h);

    range.c1 = range.columnBeg < 0 ? 0 : range.columnBeg;
    range.r1 = range.rowBeg < 0 ? 0 : range.rowBeg;
    range.c2 = range.columnEnd < 0 ? 0 : range.columnEnd;
    range.r2 = range.rowEnd < 0 ? 0 : range.rowEnd;

    return [1, range.c1, range.c2, range.r1, range.r2,
        ws.cols[range.c1].left,
        ws.rows[range.r1].top,
        ws.cols[range.c2].left + ws.cols[range.c2].width,
        ws.rows[range.r2].top  + ws.rows[range.r1].height];
}
function offline_calculate_complete_range(x, y, w, h) {

    var ws = _api.wb.getWorksheet();
    var range = _s._updateRegion(ws, x, y, w, h);

    range.c1 = range.columnBeg < 0 ? 0 : range.columnBeg;
    range.r1 = range.rowBeg < 0 ? 0 : range.rowBeg;
    range.c2 = range.columnEnd < 0 ? 0 : range.columnEnd;
    range.r2 = range.rowEnd < 0 ? 0 : range.rowEnd;

    var nativeToEditor = 1.0 / deviceScale * (72.0 / 96.0);
    w = ( x + w ) * nativeToEditor + ws.headersWidth;
    h = ( y + h ) * nativeToEditor + ws.headersHeight;
    x = x * nativeToEditor + ws.headersWidth;
    y = y * nativeToEditor + ws.headersHeight;

    if (ws.cols[range.c2].left + ws.cols[range.c2].width > w) {
        range.c2--;
    }

    if (ws.rows[range.r2].top  + ws.rows[range.r1].height > h) {
        range.r2--;
    }

    return [1, range.c1, range.c2, range.r1, range.r2,
        ws.cols[range.c1].left,
        ws.rows[range.r1].top,
        ws.cols[range.c2].left + ws.cols[range.c2].width,
        ws.rows[range.r2].top  + ws.rows[range.r1].height];
}

function offline_set_translate(translate) {
   _s.translate = translate;
}

function offline_apply_event(type,params) {
    var _stream = null;
    var _return = undefined;
    var _current = {pos: 0};
    var _continue = true;
    var _attr, _ret;

    switch (type) {

        // document interface

        case 3: // ASC_MENU_EVENT_TYPE_UNDO
        {
            _api.asc_Undo();
            _s.asc_WriteAllWorksheets(true);
            break;
        }
        case 4: // ASC_MENU_EVENT_TYPE_REDO
        {
            _api.asc_Redo();
            _s.asc_WriteAllWorksheets(true);
            break;
        }

        case 9 : // ASC_MENU_EVENT_TYPE_IMAGE
        {
            var ws = _api.wb.getWorksheet();
            if (ws && ws.objectRender && ws.objectRender.controller) {
                var selectedImageProp =  ws.objectRender.controller.getGraphicObjectProps();

                var _imagePr =  new asc_CImgProperty();
                while (_continue)
                {
                    _attr = params[_current.pos++];
                    switch (_attr)
                    {
                        case 0:
                        {
                            _imagePr.CanBeFlow = params[_current.pos++];
                            break;
                        }
                        case 1:
                        {
                            _imagePr.Width = params[_current.pos++];
                            break;
                        }
                        case 2:
                        {
                            _imagePr.Height = params[_current.pos++];
                            break;
                        }
                        case 3:
                        {
                            _imagePr.WrappingStyle = params[_current.pos++];
                            break;
                        }
                        case 4:
                        {
                            _imagePr.Paddings = asc_menu_ReadPaddings(params, _current);
                            break;
                        }
                        case 5:
                        {
                            _imagePr.Position = asc_menu_ReadPosition(params, _current);
                            break;
                        }
                        case 6:
                        {
                            _imagePr.AllowOverlap = params[_current.pos++];
                            break;
                        }
                        case 7:
                        {
                            _imagePr.PositionH = asc_menu_ReadImagePosition(params, _current);
                            break;
                        }
                        case 8:
                        {
                            _imagePr.PositionV = asc_menu_ReadImagePosition(params, _current);
                            break;
                        }
                        case 9:
                        {
                            _imagePr.Internal_Position = params[_current.pos++];
                            break;
                        }
                        case 10:
                        {
                            _imagePr.ImageUrl = params[_current.pos++];
                            break;
                        }
                        case 11:
                        {
                            _imagePr.Locked = params[_current.pos++];
                            break;
                        }
                        case 12:
                        {
                            _imagePr.ChartProperties = asc_menu_ReadChartPr(params, _current);
                            break;
                        }
                        case 13:
                        {
                            _imagePr.ShapeProperties = asc_menu_ReadShapePr(params, _current);
                            break;
                        }
                        case 14:
                        {
                            {
                                var layer = params[_current.pos++];
                                _api.asc_setSelectedDrawingObjectLayer(layer);
                                return _return;
                            }
                            break;
                        }
                        case 15:
                        {
                            _imagePr.Group = params[_current.pos++];
                            break;
                        }
                        case 16:
                        {
                            _imagePr.fromGroup = params[_current.pos++];
                            break;
                        }
                        case 17:
                        {
                            _imagePr.severalCharts = params[_current.pos++];
                            break;
                        }
                        case 18:
                        {
                            _imagePr.severalChartTypes = params[_current.pos++];
                            break;
                        }
                        case 19:
                        {
                            _imagePr.severalChartStyles = params[_current.pos++];
                            break;
                        }
                        case 20:
                        {
                            _imagePr.verticalTextAlign = params[_current.pos++];
                            break;
                        }
                        case 21:
                        {
                            var urlSource = selectedImageProp[0].Value.ImageUrl;
                            if (urlSource) {
                                var bIsNeed = params[_current.pos++];
                                if (bIsNeed)
                                {
                                    var _originSize = window["native"]["GetOriginalImageSize"](urlSource);
                                    var _w = _originSize[0] * 25.4 / 96.0 / window.native["GetDeviceScale"]();
                                    var _h = _originSize[1] * 25.4 / 96.0 / window.native["GetDeviceScale"]();

                                    _imagePr.ImageUrl = undefined;

//                            var Page_Width     = 210;
//                            var Page_Height    = 297;
//
//                            var X_Left_Margin   = 30;  // 3   cm
//                            var X_Right_Margin  = 15;  // 1.5 cm
//                            var Y_Bottom_Margin = 20;  // 2   cm
//                            var Y_Top_Margin    = 20;  // 2   cm
//
//                            //var _section_select = this.WordControl.m_oLogicDocument.Get_PageSizesByDrawingObjects();
//                            var _page_width = Page_Width;
//                            var _page_height = Page_Height;
//                            var _page_x_left_margin = X_Left_Margin;
//                            var _page_y_top_margin = Y_Top_Margin;
//                            var _page_x_right_margin = X_Right_Margin;
//                            var _page_y_bottom_margin = Y_Bottom_Margin;

//                            if (_section_select)
//                            {
//                                if (_section_select.W)
//                                    _page_width = _section_select.W;
//
//                                if (_section_select.H)
//                                    _page_height = _section_select.H;
//                            }

//                            var __w = Math.max(1, _page_width - (_page_x_left_margin + _page_x_right_margin));
//                            var __h = Math.max(1, _page_height - (_page_y_top_margin + _page_y_bottom_margin));
//
                                    // var wI = (undefined !== _w) ? Math.max(_w * 25.4 / 96.0, 1) : 1;
                                    //var hI = (undefined !== _h) ? Math.max(_h * 25.4 / 96.0, 1) : 1;

                                    // wI = Math.max(5, Math.min(wI, _w));
                                    //hI = Math.max(5, Math.min(hI, _h));

                                    _imagePr.Width = _w;
                                    _imagePr.Height = _h;
                                }
                            }

                            break;
                        }
                        case 255:
                        default:
                        {
                            _continue = false;
                            break;
                        }
                    }
                }

                ws.objectRender.controller.setGraphicObjectProps(_imagePr);
            }
            break;
        }

        case 52: // ASC_MENU_EVENT_TYPE_INSERT_HYPERLINK
        {
            var props = asc_ReadCHyperLink(params, _current);
            _api.asc_insertHyperlink(props);
            break;
        }
        case 59: // ASC_MENU_EVENT_TYPE_REMOVE_HYPERLINK
        {
            _api.asc_removeHyperlink();
            break;
        }

        case 62: // ASC_MENU_EVENT_TYPE_SEARCH_FINDTEXT
        {
            var findOptions = new Asc.asc_CFindOptions();

            if (7 === params.length) {
                findOptions.asc_setFindWhat(params[0]);
                findOptions.asc_setScanForward(params[1]);
                findOptions.asc_setIsMatchCase(params[2]);
                findOptions.asc_setIsWholeCell(params[3]);
                findOptions.asc_setScanOnOnlySheet(params[4]);
                findOptions.asc_setScanByRows(params[5]);
                findOptions.asc_setLookIn(params[6]);

                _ret = _api.asc_findText(findOptions);
                _stream = global_memory_stream_menu;
                _stream["ClearNoAttack"]();
                if (_ret) {
                    _stream["WriteBool"](true);
                    _stream["WriteDouble2"](_ret[0]);
                    _stream["WriteDouble2"](_ret[1]);
                } else {
                    _stream["WriteBool"](false);
                    _stream["WriteDouble2"](0);
                    _stream["WriteDouble2"](0);
                }

                _return = _stream;
            }

            break;
        }
        case 63: // ASC_MENU_EVENT_TYPE_SEARCH_REPLACETEXT
        {
            var replaceOptions = new Asc.asc_CFindOptions();
            if (8 === params.length) {
                replaceOptions.asc_setFindWhat(params[0]);
                replaceOptions.asc_setReplaceWith(params[1]);
                replaceOptions.asc_setIsMatchCase(params[2]);
                replaceOptions.asc_setIsWholeCell(params[3]);
                replaceOptions.asc_setScanOnOnlySheet(params[4]);
                replaceOptions.asc_setScanByRows(params[5]);
                replaceOptions.asc_setLookIn(params[6]);
                replaceOptions.asc_setIsReplaceAll(params[7]);

                _api.asc_replaceText(replaceOptions);
            }
            break;
        }

        case 200: // ASC_MENU_EVENT_TYPE_DOCUMENT_BASE64
        {
            _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteStringA"](_api.asc_nativeGetFile());
            _return = _stream;
            break;
        }
        case 201: // ASC_MENU_EVENT_TYPE_DOCUMENT_CHARTSTYLES
        {
            _api.chartPreviewManager.getChartPreviews(parseInt(params));
            _return = global_memory_stream_menu;
            break;
        }
        case 202: // ASC_MENU_EVENT_TYPE_DOCUMENT_PDFBASE64
        {
            _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteStringA"](_s.offline_print(params,_current));
            _return = _stream;
            break;
        }

        case 110: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_COPY
        {
            _return = offline_copy();
            break;
        }
        case 111 : // ASC_MENU_EVENT_TYPE_CONTEXTMENU_CUT
        {
            _return = this.offline_cut();
            break;
        }
        case 112: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_PASTE
        {
            offline_paste(params);
            break;
        }
        case 113: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_DELETE
        {
            _return = offline_delete();
            break;
        }
        case 114: // ASC_MENU_EVENT_TYPE_CONTEXTMENU_SELECT
        {
            //this.Call_Menu_Context_Select();
            break;
        }

        // add objects

        case 50:  // ASC_MENU_EVENT_TYPE_INSERT_IMAGE
        {
            _return = _s.offline_addImageDrawingObject(params);
            break;
        }
        case 53:  // ASC_MENU_EVENT_TYPE_INSERT_SHAPE
        {
            _return = _s.offline_addShapeDrawingObject(params);
            break;
        }
        case 400: // ASC_MENU_EVENT_TYPE_INSERT_CHART
        {
            _return = _s.offline_addChartDrawingObject(params);
            break;
        }

        // Cell interface

        case 2000: // ASC_SPREADSHEETS_EVENT_TYPE_SET_CELL_INFO
        {
            var borders = null;
            var border = null;
            var filterInfo = null;

            while (_continue) {
                _attr = params[_current.pos++];
                switch (_attr) {
                    case 0:
                    {
                        _api.asc_setCellAlign(params[_current.pos++]);
                        break;
                    }
                    case 1:
                    {
                        _api.asc_setCellVertAlign(params[_current.pos++]);
                        break;
                    }
                    case 2:
                    {
                        _api.asc_setCellFontName(params[_current.pos++]);
                        break;
                    }
                    case 3:
                    {
                        _api.asc_setCellFontSize(params[_current.pos++]);
                        break;
                    }
                    case 4:
                    {
                        _api.asc_setCellBold(params[_current.pos++]);
                        break;
                    }
                    case 5:
                    {
                        _api.asc_setCellItalic(params[_current.pos++]);
                        break;
                    }
                    case 6:
                    {
                        _api.asc_setCellUnderline(params[_current.pos++]);
                        break;
                    }
                    case 7:
                    {
                        _api.asc_setCellStrikeout(params[_current.pos++]);
                        break;
                    }
                    case 8:
                    {
                        _api.asc_setCellSubscript(params[_current.pos++]);
                        break;
                    }
                    case 9:
                    {
                        _api.asc_setCellSuperscript(params[_current.pos++]);
                        break;
                    }
                    case 10:
                    {
                        _api.asc_setCellTextColor(asc_menu_ReadColor(params, _current));
                        break;
                    }
                    case 11:
                    {
                        _api.asc_setCellTextWrap(params[_current.pos++]);
                        break;
                    }
                    case 12:
                    {
                        _api.asc_setCellTextShrink(params[_current.pos++]);
                        break;
                    }
                    case 13:
                    {
                        _api.asc_setCellBackgroundColor(asc_menu_ReadColor(params, _current));
                        break;
                    }
                    case 14:
                    {
                        _api.asc_setCellFormat(params[_current.pos++]);
                        break;
                    }
                    case 15:
                    {
                        _api.asc_setCellAngle(parseFloat(params[_current.pos++]));
                        break;
                    }
                    case 16:
                    {
                        _api.asc_setCellStyle(params[_current.pos++]);
                        break;
                    }

                    case 20:
                    {
                        if (!borders) borders = [];
                        border = asc_ReadCBorder(params, _current);
                        if (border) {
                            borders[c_oAscBorderOptions.Left] = border;
                        }
                        break;
                    }

                    case 21:
                    {
                        if (!borders) borders = [];
                        border = asc_ReadCBorder(params, _current);
                        if (border && borders) {
                            borders[c_oAscBorderOptions.Top] = border;
                        }
                        break;
                    }

                    case 22:
                    {
                        if (!borders) borders = [];
                        border = asc_ReadCBorder(params, _current);
                        if (border && borders) {
                            borders[c_oAscBorderOptions.Right] = border;
                        }
                        break;
                    }

                    case 23:
                    {
                        if (!borders) borders = [];
                        border = asc_ReadCBorder(params, _current);
                        if (border && borders) {
                            borders[c_oAscBorderOptions.Bottom] = border;
                        }
                        break;
                    }

                    case 24:
                    {
                        if (!borders) borders = [];
                        border = asc_ReadCBorder(params, _current);
                        if (border && borders) {
                            borders[c_oAscBorderOptions.DiagD] = border;
                        }
                        break;
                    }

                    case 25:
                    {
                        if (!borders) borders = [];
                        border = asc_ReadCBorder(params, _current);
                        if (border && borders) {
                            borders[c_oAscBorderOptions.DiagU] = border;
                        }
                        break;
                    }

                    case 26:
                    {
                        if (!borders) borders = [];
                        border = asc_ReadCBorder(params, _current);
                        if (border && borders) {
                            borders[c_oAscBorderOptions.InnerV] = border;
                        }
                        break;
                    }

                    case 27:
                    {
                        if (!borders) borders = [];
                        border = asc_ReadCBorder(params, _current);
                        if (border && borders) {
                            borders[c_oAscBorderOptions.InnerH] = border;
                        }
                        break;
                    }

                    case 28:
                    {
                        _api.asc_setCellBorders([]);
                        break;
                    }

                    case 255:
                    default:
                    {
                        _continue = false;
                        break;
                    }
                }
            }

            if (borders) {
                _api.asc_setCellBorders(borders);
            }

            break;
        }
        case 2010: // ASC_SPREADSHEETS_EVENT_TYPE_CELLS_MERGE_TEST
        {
            _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();

            var merged = _api.asc_getCellInfo().asc_getFlags().asc_getMerge();

            if (!merged && _api.asc_mergeCellsDataLost(params)) {
                _stream["WriteBool"](true);
            } else {
                _stream["WriteBool"](false);
            }

            _return = _stream;
            break;
        }
        case 2020: // ASC_SPREADSHEETS_EVENT_TYPE_CELLS_MERGE
        {
            _api.asc_mergeCells(params);
            break;
        }
        case 2030: // ASC_SPREADSHEETS_EVENT_TYPE_CELLS_FORMAT
        {
            _api.asc_setCellFormat(params);
            break;
        }
        case 2031: // ASC_SPREADSHEETS_EVENT_TYPE_CELLS_DECREASE_DIGIT_NUMBERS
        {
            _api.asc_decreaseCellDigitNumbers();
            break;
        }
        case 2032: // ASC_SPREADSHEETS_EVENT_TYPE_CELLS_ICREASE_DIGIT_NUMBERS
        {
            _api.asc_increaseCellDigitNumbers();
            break;
        }
        case 2040: // ASC_SPREADSHEETS_EVENT_TYPE_COLUMN_SORT_FILTER
        {
            if (params.length) {
                var typeF = params[0], cellId ='';
                if (2===params.length)
                    cellId = params[1];
                _api.asc_sortColFilter(typeF, cellId);
            }
            break;
        }
        case 2050: // ASC_SPREADSHEETS_EVENT_TYPE_CLEAR_STYLE
        {
            _api.asc_emptyCells(params);
            break;
        }

        // Workbook interface

        case 2100: // ASC_SPREADSHEETS_EVENT_TYPE_WORKSHEETS_COUNT
        {
            _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteLong"](_api.asc_getWorksheetsCount());
            _return = _stream;
            break;
        }
        case 2110: // ASC_SPREADSHEETS_EVENT_TYPE_GET_WORKSHEET
        {
            _stream = global_memory_stream_menu;
            _s.asc_writeWorksheet(params);
            _return = _stream;
            break
        }
        case 2120: // ASC_SPREADSHEETS_EVENT_TYPE_SET_WORKSHEET
        {
            var index = -1;
            while (_continue) {
                _attr = params[_current.pos++];
                switch (_attr) {
                    case 0: // index
                    {
                        index = (params[_current.pos++]);
                        break;
                    }
                    case 1: // name
                    {
                        var name = (params[_current.pos++]);
                        _api.asc_renameWorksheet(name);
                        _s.asc_WriteAllWorksheets(true);
                        break;
                    }
                    case 2: // color
                    {
                        var tabColor = asc_menu_ReadColor(params, _current);
                        _api.asc_setWorksheetTabColor(tabColor);
                        _s.asc_WriteAllWorksheets(true);
                        break;
                    }
                    case 4: // hidden
                    {
                        _api.asc_hideWorksheet();
                        _s.asc_WriteAllWorksheets(true);
                        break;
                    }

                    case 5: // show gridlines
                    {
                        var isLines = _api.asc_getSheetViewSettings();
                        isLines.asc_setShowGridLines(params[_current.pos++]);
                        _api.asc_setSheetViewSettings(isLines);
                        _s.asc_WriteAllWorksheets(true);
                        break;
                    }

                    case 6: // row col headers
                    {
                        var isHeaders = _api.asc_getSheetViewSettings();
                        isHeaders.asc_setShowRowColHeaders(params[_current.pos++]);
                        _api.asc_setSheetViewSettings(isHeaders);
                        _s.asc_WriteAllWorksheets(true);
                        break;
                    }

                    case 255:
                    default:
                    {
                        _continue = false;
                        break;
                    }
                }
            }
            break;
        }
        case 2130: // ASC_SPREADSHEETS_EVENT_TYPE_WORKSHEETS
        {
            _stream = global_memory_stream_menu;
            _s.asc_WriteAllWorksheets();
            _return = _stream;
            break;
        }
        case 2140: // ASC_SPREADSHEETS_EVENT_TYPE_ADD_WORKSHEET
        {
            _api.asc_addWorksheet(params);
            _s.asc_WriteAllWorksheets(true);
            break;
        }
        case 2150: // ASC_SPREADSHEETS_EVENT_TYPE_INSERT_WORKSHEET
        {
            _api.asc_insertWorksheet(params);
            _s.asc_WriteAllWorksheets(true);
            break;
        }
        case 2160: // ASC_SPREADSHEETS_EVENT_TYPE_DELETE_WORKSHEET
        {
            _api.asc_deleteWorksheet(params);
            _s.asc_WriteAllWorksheets(true);
            break;
        }
        case 2170: // ASC_SPREADSHEETS_EVENT_TYPE_COPY_WORKSHEET
        {
            if (params.length) {
                _api.asc_copyWorksheet(params[0], params[1]);  // where, newName
                _s.asc_WriteAllWorksheets(true);
            }

            break;
        }
        case 2180: // ASC_SPREADSHEETS_EVENT_TYPE_MOVE_WORKSHEET
        {
            _api.asc_moveWorksheet(params);
            _s.asc_WriteAllWorksheets(true);
            break;
        }
        case 2200: // ASC_SPREADSHEETS_EVENT_TYPE_SHOW_WORKSHEET
        {
            _s.offline_showWorksheet(params);
            break;
        }
        case 2201: // ASC_SPREADSHEETS_EVENT_TYPE_UNHIDE_WORKSHEET
        {
            _s.offline_showWorksheet(params);
            _s.asc_WriteAllWorksheets(true);
            break;
        }
        case 2205: // ASC_SPREADSHEETS_EVENT_TYPE_WORKSHEET_SHOW_LINES
        {
            var gridLines = _api.asc_getSheetViewSettings();
            gridLines.asc_setShowGridLines(params > 0);
            _api.asc_setSheetViewSettings(gridLines);
            break;
        }
        case 2210: // ASC_SPREADSHEETS_EVENT_TYPE_WORKSHEET_SHOW_HEADINGS
        {
            var colRowHeaders = _api.asc_getSheetViewSettings();
            colRowHeaders.asc_setShowRowColHeaders(params > 0);
            _api.asc_setSheetViewSettings(colRowHeaders);
            break;
        }
        case 2215: // ASC_SPREADSHEETS_EVENT_TYPE_SET_PAGE_OPTIONS
        {
            var pageOptions = asc_ReadPageOptions(params, _current);
            _api.asc_setPageOptions(pageOptions, pageOptions.pageIndex);
            break;
        }

        case 2400: // ASC_SPREADSHEETS_EVENT_TYPE_COMPLETE_SEARCH
        {
            _api.asc_endFindText();
            break;
        }

        case 2415: // ASC_SPREADSHEETS_EVENT_TYPE_CHANGE_COLOR_SCHEME
        {
            if (undefined !== params) {
                var indexScheme = parseInt(params);
                _api.asc_ChangeColorScheme(indexScheme);
            }
            break;
        }

        case 3000: // ASC_SPREADSHEETS_EVENT_TYPE_FILTER_ADD_AUTO
        {
            var filter = asc_ReadAutoFilter(params, _current);
            _api.asc_addAutoFilter(filter.styleName, filter.format);
            _api.wb.getWorksheet().handlers.trigger('selectionChanged', _api.wb.getWorksheet().getSelectionInfo());
            break;
        }

        case 3010: // ASC_SPREADSHEETS_EVENT_TYPE_FILTER_CHANGE_AUTO
        {
            var changeFilter = asc_ReadAutoFilter(params, _current);
            _api.asc_changeAutoFilter(changeFilter.tableName, changeFilter.optionType, changeFilter.styleName);
            _api.wb.getWorksheet().handlers.trigger('selectionChanged', _api.wb.getWorksheet().getSelectionInfo());
            break;
        }

        case 3040: // ASC_SPREADSHEETS_EVENT_TYPE_FILTER_FORMAT_TABLE_OPTIONS
        {
            var formatOptions = _api.asc_getAddFormatTableOptions(params);
            _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            asc_WriteAddFormatTableOptions(formatOptions, _stream);
            _return = _stream;
            break;
        }

        case 3050: // ASC_SPREADSHEETS_EVENT_TYPE_FILTER_CLEAR
        {
            _api.asc_clearFilter();
            break;
        }

        case 4010: // ASC_SPREADSHEETS_EVENT_TYPE_INSERT_FORMULA
        {
            if (params && params.length && params[0]) {
                _return = offline_insertFormula(params[0], params[1] ? true : undefined, params[2] ? true : undefined);
            }
            break;
        }

        case 4020: // ASC_SPREADSHEETS_EVENT_TYPE_GET_FORMULAS
        {
            _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();

            var info = _api.asc_getFormulasInfo();
            if (info) {
                _stream["WriteLong"](info.length);

                for (var i = 0; i < info.length; ++i) {
                    _stream["WriteString2"](info[i].asc_getGroupName());

                    var ascFunctions = info[i].asc_getFormulasArray();
                    _stream["WriteLong"](ascFunctions.length);

                    for (var j = 0; j < ascFunctions.length; ++j) {
                        _stream["WriteString2"](ascFunctions[j].asc_getName());
                        _stream["WriteString2"](ascFunctions[j].asc_getArguments());
                    }
                }
            } else {
                _stream["WriteLong"](0);
            }

            if (undefined !== params) {
                var localizeData = JSON.parse(params);
                _api.asc_setLocalization(localizeData);
            }

            _return = _stream;

            break;
        }

        case 5000: // ASC_SPREADSHEETS_EVENT_TYPE_GO_LINK_TYPE_INTERNAL_DATA_RANGE
        {
            var cellX = params[0];
            var cellY = params[1];
            var isViewerMode = false;
            var ws = _api.wb.getWorksheet();
            var ct = ws.getCursorTypeFromXY(cellX, cellY, isViewerMode);

            var curIndex = _api.asc_getActiveWorksheetIndex();

            if (c_oTargetType.Hyperlink === ct.target) {
                _api._asc_setWorksheetRange(ct.hyperlink);
            }

            _stream = global_memory_stream_menu;

            _stream["ClearNoAttack"]();
            _stream["WriteBool"](!(curIndex === _api.asc_getActiveWorksheetIndex()));

            _return = _stream;
            break;
        }

        case 6000: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_CLEAR_ALL:
        {
            _api.asc_emptyCells(c_oAscCleanOptions.All);
            break;
        }

        case 6010: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_CLEAR_TEXT
        {
            _api.asc_emptyCells(c_oAscCleanOptions.Text);
            break;
        }

        case 6020: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_CLEAR_FORMAT
        {
            _api.asc_emptyCells(c_oAscCleanOptions.Format);
            break;
        }

        case 6030: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_CLEAR_COMMENTS
        {
            _api.asc_emptyCells(c_oAscCleanOptions.Comments);
            break;
        }

        case 6040: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_CLEAR_HYPERLINKS
        {
            _api.asc_emptyCells(c_oAscCleanOptions.Hyperlinks);
            break;
        }

        case 6050: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_INSERT_LEFT
        {
            _api.asc_insertCells(c_oAscInsertOptions.InsertColumns);
            break;
        }

        case 6060: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_INSERT_TOP
        {
            _api.asc_insertCells(c_oAscInsertOptions.InsertRows);
            break;
        }

        case 6070: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_DELETE_COLUMNES
        {
            _api.asc_deleteCells(c_oAscDeleteOptions.DeleteColumns);
            break;
        }

        case 6080: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_DELETE_ROWS
        {
            _api.asc_deleteCells(c_oAscDeleteOptions.DeleteRows);
            break;
        }

        case 6090: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_SHOW_COLUMNES
        {
            (0 != params) ? _api.asc_showColumns() : _api.asc_hideColumns();
            break;
        }

        case 6100: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_SHOW_ROWS
        {
            (0 != params) ? _api.asc_showRows() : _api.asc_hideRows();
            break;
        }

        case 6190: // ASC_SPREADSHEETS_EVENT_TYPE_CONTEXTMENU_FREEZE_PANES
        {

            break;
        }

        case 7000: // ASC_SPREADSHEETS_EVENT_TYPE_CHECK_DATA_RANGE
        {
            var isValid = _api.asc_checkDataRange(c_oAscSelectionDialogType.Chart, params, false);

            _stream = global_memory_stream_menu;
            _stream["ClearNoAttack"]();
            _stream["WriteLong"](isValid);
            _return = _stream;
            break;
        }

        case 7010: // ASC_SPREADSHEETS_EVENT_TYPE_SET_COLUMN_WIDTH
        {
            var width = params[0];
            var fromColumn = params[1];
            var toColumn = params[2];

            var ws = _api.wb.getWorksheet();
            ws.changeColumnWidth(toColumn, width, 0);
            break;
        }

        case 7020: // ASC_SPREADSHEETS_EVENT_TYPE_SET_ROW_HEIGHT
        {
            var height = params[0];
            var fromRow = params[1];
            var toRow = params[2];

            var ws = _api.wb.getWorksheet();
            ws.changeRowHeight(toRow, height, 0);
            break;
        }

        default:
            break;
    }

    return _return;
}