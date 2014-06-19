﻿"use strict";

/* DrawingObjects.js
 *
 * Author: Dmitry Vikulov
 * Date:   13/08/2012
 */

if ( !window["Asc"] ) {		// Для вставки диаграмм в Word
    window["Asc"] = {};
}

function isObject(what) {
    return ( (what != null) && (typeof(what) == "object") );
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNullOrEmptyString(str) {
    return (str == undefined) || (str == null) || (str == "");
}

function convertFormula(formula, ws) {
    var range = null;

    if (formula && ws) {
        var result = parserHelp.parse3DRef(formula);
        if (null !== result) {
            var ws = ws.model.workbook.getWorksheetByName(result.sheet);
            if (ws)
                range = ws.getRange2(result.range);
        }
    }
    return range;
}

function DrawingBounds(minX, maxX, minY, maxY)
{
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
}

function convertFormula2(formula, ws) {
    var range = null;

    if (formula && ws) {
        var result = parserHelp.parse3DRef(formula);
        if (null !== result) {
            var ws = ws.model.workbook.getWorksheetByName(result.sheet);
            if (ws)
                range = {ws: ws, range: ws.getRange2(result.range)};
        }
    }
    return range;
}
function getFullImageSrc(src) {
    if ( 0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:") ) {
        var api = window["Asc"]["editor"];
        if ( 0 == src.indexOf(g_sResourceServiceLocalUrl + api.documentId) )
            return src;
        return g_sResourceServiceLocalUrl + api.documentId + "/media/" + src;
    }
    else
        return src;
}

function getCurrentTime() {
    var currDate = new Date();
    return currDate.getTime();
}

function roundPlus(x, n) { //x - число, n - количество знаков 
    if ( isNaN(x) || isNaN(n) ) return false;
    var m = Math.pow(10,n);
    return Math.round(x * m) / m;
}

// Класс для информации о ячейке для объектов ToDo возможно стоит поправить
function CCellObjectInfo () {
	this.col = 0;
	this.row = 0;
	this.colOff = 0;
	this.rowOff = 0;
	this.colOffPx = 0;
	this.rowOffPx = 0;
}


//{ ASC Classes

//-----------------------------------------------------------------------------------
// Chart style
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartStyle() {
    this.style = null;
    this.imageUrl = null;
}

asc_CChartStyle.prototype = {
    asc_getStyle: function() { return this.style; },
    asc_setStyle: function(style) { this.style = style; },

    asc_getImageUrl: function() { return this.imageUrl; },
    asc_setImageUrl: function(imageUrl) { this.imageUrl = imageUrl; }
};

//{ asc_CChartStyle export
window["Asc"].asc_CChartStyle = asc_CChartStyle;
window["Asc"]["asc_CChartStyle"] = asc_CChartStyle;
var prot = asc_CChartStyle.prototype;

prot["asc_getStyle"] = prot.asc_getStyle;
prot["asc_setStyle"] = prot.asc_setStyle;

prot["asc_getImageUrl"] = prot.asc_getImageUrl;
prot["asc_setImageUrl"] = prot.asc_setImageUrl;
//}

//-----------------------------------------------------------------------------------
// Chart translate
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartTranslate() {

    this.title = "Diagram Title";
    this.xAxis = "X Axis";
    this.yAxis = "Y Axis";
    this.series = "Series";
}

asc_CChartTranslate.prototype = {

    asc_getTitle: function() { return this.title; },
    asc_setTitle: function(val) { this.title = val; },

    asc_getXAxis: function() { return this.xAxis; },
    asc_setXAxis: function(val) { this.xAxis = val; },

    asc_getYAxis: function() { return this.yAxis; },
    asc_setYAxis: function(val) { this.yAxis = val; },

    asc_getSeries: function() { return this.series; },
    asc_setSeries: function(val) { this.series = val; }
};

//{ asc_CChartTranslate export
window["Asc"].asc_CChartTranslate = asc_CChartTranslate;
window["Asc"]["asc_CChartTranslate"] = asc_CChartTranslate;
prot = asc_CChartTranslate.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getXAxis"] = prot.asc_getXAxis;
prot["asc_setXAxis"] = prot.asc_setXAxis;

prot["asc_getYAxis"] = prot.asc_getYAxis;
prot["asc_setYAxis"] = prot.asc_setYAxis;

prot["asc_getSeries"] = prot.asc_getSeries;
prot["asc_setSeries"] = prot.asc_setSeries;
//}

//-----------------------------------------------------------------------------------
// Chart
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChart(object) {

    var bCopy = isObject(object);

    this.worksheet = bCopy ? object.worksheet : null;
    this.type = bCopy ? object.type : null;
    this.subType = bCopy ? object.subType : c_oAscChartSubType.normal;

    this.bChartEditor = bCopy ? object.bChartEditor : false;
    this.bShowValue = bCopy ? object.bShowValue : false;
    this.bShowCatName = bCopy ? object.bShowCatName : false;
    this.bShowBorder = bCopy ? object.bShowBorder : true;
    this.styleId = bCopy ? object.styleId : c_oAscChartStyle.Standart;

    this.header = bCopy ? new asc_CChartHeader(object.header) : new asc_CChartHeader();
    this.range = bCopy ? new asc_CChartRange(object.range) : new asc_CChartRange();

    this.xAxis = bCopy ? new asc_CChartAxisX(object.xAxis) : new asc_CChartAxisX();
    this.yAxis = bCopy ? new asc_CChartAxisY(object.yAxis) : new asc_CChartAxisY();

    this.legend = bCopy ? new asc_CChartLegend(object.legend) : new asc_CChartLegend();

    this.series = [];
    if ( bCopy && object.series ) {
        for (var i = 0; i < object.series.length; i++) {
            var ser = new asc_CChartSeria();

            ser.asc_setTitle(object.series[i].TxCache.Tx);
            ser.asc_setTitleFormula(object.series[i].TxCache.Formula);

            // Val
            if (object.series[i].Val) {
                ser.asc_setValFormula(object.series[i].Val.Formula);

                for (var j = 0; j < object.series[i].Val.NumCache.length; j++) {
                    var item = {};
                    item.numFormatStr = object.series[i].Val.NumCache[j].numFormatStr;
                    item.isDateTimeFormat = object.series[i].Val.NumCache[j].isDateTimeFormat;
                    item.val = object.series[i].Val.NumCache[j].val;
                    item.isHidden = object.series[i].Val.NumCache[j].isHidden;
                    ser.Val.NumCache.push(item);
                }
            }

            // xVal
            if (object.series[i].xVal) {
                ser.asc_setxValFormula(object.series[i].xVal.Formula);

                for (var j = 0; j < object.series[i].xVal.NumCache.length; j++) {
                    var item = {};
                    item.numFormatStr = object.series[i].xVal.NumCache[j].numFormatStr;
                    item.isDateTimeFormat = object.series[i].xVal.NumCache[j].isDateTimeFormat;
                    item.val = object.series[i].xVal.NumCache[j].val;
                    item.isHidden = object.series[i].xVal.NumCache[j].isHidden;
                    ser.xVal.NumCache.push(item);
                }
            }

            // Cat
            if (object.series[i].Cat) {
                ser.asc_setCatFormula(object.series[i].Cat.Formula);

                for (var j = 0; j < object.series[i].Cat.NumCache.length; j++) {
                    var item = {};
                    item.numFormatStr = object.series[i].Cat.NumCache[j].numFormatStr;
                    item.isDateTimeFormat = object.series[i].Cat.NumCache[j].isDateTimeFormat;
                    item.val = object.series[i].Cat.NumCache[j].val;
                    item.isHidden = object.series[i].Cat.NumCache[j].isHidden;
                    ser.Cat.NumCache.push(item);
                }
            }

            if (object.series[i].Marker) {
                ser.asc_setMarkerSize(object.series[i].Marker.Size);
                ser.asc_setMarkerSymbol(object.series[i].Marker.Symbol);
            }
            ser.asc_setOutlineColor(object.series[i].OutlineColor);
            ser.asc_setFormatCode(object.series[i].FormatCode);

            this.series.push(ser);
        }
    }

    this.themeColors = [];
    if ( bCopy && object.themeColors ) {
        for (var i = 0; i < object.themeColors.length; i++) {
            this.themeColors.push(object.themeColors[i]);
        }
    }

   // this.Id = g_oIdCounter.Get_NewId();
   // g_oTableId.Add(this, this.Id);
}

asc_CChart.prototype = {

    isEqual: function(chart) {
        return ( this.type == chart.type &&
            this.subType == chart.subType &&
            this.styleId == chart.styleId &&
            this.bShowValue == chart.bShowValue &&
            this.bShowBorder == chart.bShowBorder &&
            this.header.isEqual(chart.header) &&
            this.range.isEqual(chart.range) &&
            this.xAxis.isEqual(chart.xAxis) &&
            this.yAxis.isEqual(chart.yAxis) &&
            this.legend.isEqual(chart.legend) &&
            this.series.length == chart.series.length);
    },

    asc_getType: function() { return this.type; },
    asc_setType: function(type) { this.type = type; },

    asc_getSubType: function() { return this.subType; },
    asc_setSubType: function(subType) { this.subType = subType; },

    asc_getStyleId: function() { return this.styleId; },
    asc_setStyleId: function(styleId) { this.styleId = styleId; },

    asc_getShowValueFlag: function() { return this.bShowValue; },
    asc_setShowValueFlag: function(show) { this.bShowValue = show; },

    asc_getShowCatNameFlag: function() { return this.bShowCatName; },
    asc_setShowCatNameFlag: function(show) { this.bShowCatName = show; },

    asc_getShowBorderFlag: function() { return this.bShowBorder; },
    asc_setShowBorderFlag: function(show) { this.bShowBorder = show; },

    asc_getHeader: function() { return this.header; },
    asc_setHeader: function(headerObj) { this.header = headerObj; },

    asc_getRange: function() { return this.range; },
    asc_setRange: function(rangeObj) { this.range = rangeObj; },

    asc_getXAxis: function() { return this.xAxis; },
    asc_setXAxis: function(axisObj) { this.xAxis = axisObj; },

    asc_getYAxis: function() { return this.yAxis; },
    asc_setYAxis: function(axisObj) { this.yAxis = axisObj; },

    asc_getLegend: function() { return this.legend; },
    asc_setLegend: function(legendObj) { this.legend = legendObj; },

    asc_getSeria: function(index) { return (index < this.series.length) ? this.series[index] : null; },
    asc_setSeria: function(seriaObj) { if (seriaObj) this.series.push(seriaObj); },
    asc_removeSeries: function() { this.series = []; },

    _generateColorPart: function (val, percent) {
        // 	Negative outputs are shades, and positive outputs are tints.
        if ( percent >= 0 )
            return Math.min( 255, ((255 - val) * percent + val) >> 0 );
        else
            return Math.max( 0, (val * (1 + percent)) >> 0 );
    },

    _generateColor: function (oColor, percent) {
        return new CColor(this._generateColorPart(oColor.r, percent),
            this._generateColorPart(oColor.g, percent), this._generateColorPart(oColor.b, percent));
    },

    _generateColors: function (countColors, arrayBaseColors) {
        var arrayColors = [];
        var countBase = arrayBaseColors.length;
        var needCreate = parseInt(countColors / countBase) + 1;

        for (var i = 0; i < needCreate; i++) {
            for (var j = 0; j < countBase; j++) {
                // Для равномерного затухания: percent = i / needCreate
                var percent = (-70 + 140 * ( (i + 1) / (needCreate + 1) )) / 100.0;		// ECMA-376 Part 1
                var color = this._generateColor(arrayBaseColors[j], percent);

                arrayColors.push( color );
            }
        }
        arrayColors.splice(countColors, arrayColors.length - countColors);
        return arrayColors;
    },

    initDefault: function() {

        // Обновлены тестовые данные для новой диаграммы
        function createItem(value) {
            return { numFormatStr: "General", isDateTimeFormat: false, val: value, isHidden: false };
        }

        this.bChartEditor = true;
        this.header.title = "2012 Olympics Medal Standings";
        this.range.interval = "Sheet1!A1:D7";
        var Cat = { Formula: "Sheet1!A2:A7", NumCache: [createItem("USA"), createItem("CHN"), createItem("RUS"), createItem("GBR"), createItem("GER"), createItem("JPN")] };

        this.xAxis.title = "Countries";
        this.yAxis.title = "Medals";

        this.series = [];
        var uniColors = this.generateUniColors(3);

        var seria = new asc_CChartSeria();
        seria.Val.Formula = "Sheet1!B2:B7";
        seria.Val.NumCache = [ createItem(46), createItem(38), createItem(24), createItem(29), createItem(11), createItem(7) ];
        seria.OutlineColor = uniColors[0];
        seria.TxCache.Formula = "Sheet1!B1";
        seria.TxCache.Tx = "Gold";
        if ( this.type != c_oAscChartType.scatter )
            seria.Cat = Cat;
        else
            seria.xVal = Cat;
        this.series.push(seria);

        seria = new asc_CChartSeria();
        seria.Val.Formula = "Sheet1!C2:C7";
        seria.Val.NumCache = [ createItem(29), createItem(27), createItem(26), createItem(17), createItem(19), createItem(14) ];
        seria.OutlineColor = uniColors[1];
        seria.TxCache.Formula = "Sheet1!C1";
        seria.TxCache.Tx = "Silver";
        if ( this.type != c_oAscChartType.scatter )
            seria.Cat = Cat;
        else
            seria.xVal = Cat;
        this.series.push(seria);

        seria = new asc_CChartSeria();
        seria.Val.Formula = "Sheet1!D2:D7";
        seria.Val.NumCache = [ createItem(29), createItem(23), createItem(32), createItem(19), createItem(14), createItem(17) ];
        seria.OutlineColor = uniColors[2];
        seria.TxCache.Formula = "Sheet1!D1";
        seria.TxCache.Tx = "Bronze";
        if ( this.type != c_oAscChartType.scatter )
            seria.Cat = Cat;
        else
            seria.xVal = Cat;
        this.series.push(seria);
    },


    parseSeriesHeaders: function() {

        var cntLeft = 0, cntTop = 0;
        var headers = { bLeft: false, bTop: false };

        var _t = this;
        if(_t.range.intervalObject)
        {
            var bbox = _t.range.intervalObject.getBBox0();

            if ( bbox.c2 - bbox.c1 > 0 ) {
                for (var i = bbox.r1 + 1; i <= bbox.r2; i++)
                {
                    var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(i, bbox.c1, 0) );
                    var value = cell.getValue();
                    if ( !isNumber(value) && (value != "") )
                        cntLeft++;
                }
                if ( (cntLeft > 0) && (cntLeft >= bbox.r2 - bbox.r1) )
                    headers.bLeft = true;
            }

            if ( bbox.r2 - bbox.r1 > 0 ) {
                for (var i = bbox.c1 + 1; i <= bbox.c2; i++) {

                    var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(bbox.r1, i, 0) );
                    var value = cell.getValue();
                    if ( !isNumber(value) && (value != "") )
                        cntTop++;
                }
                if ( (cntTop > 0) && (cntTop >= bbox.c2 - bbox.c1) )
                    headers.bTop = true;
            }
        }
        else
        {
            var headers = { bLeft: true, bTop: true };

        }

        return headers;
    },

    rebuildSeries: function(isIgnoreColors) {
        var _t = this;
        var bbox = _t.range.intervalObject.getBBox0();
        var nameIndex = 1;
        var api = window["Asc"]["editor"];
		var ws = _t.range.intervalObject.worksheet;

        // Save old series colors
        var oldSeriaData = [];
        for ( var i = 0; !isIgnoreColors && (i < _t.series.length); i++ ) {
            if ( _t.series[i].OutlineColor && !_t.series[i].OutlineColor.isCustom )
                oldSeriaData[i] = _t.series[i].OutlineColor;
        }
        _t.series = [];

        function getNumCache(c1, c2, r1, r2) {

            // (c1 == c2) || (r1 == r2)
            var cache = [];

            if ( c1 == c2 ) {		// vertical cache
                for (var row = r1; row <= r2; row++) {
                    var cell = ws.getCell( new CellAddress(row, c1, 0) );

                    var item = {};
                    item.numFormatStr = cell.getNumFormatStr();
                    item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
                    item.val = cell.getValue();
                    item.isHidden = (ws._getCol(c1).hd === true) || (ws._getRow(row).hd === true);

                    cache.push(item);
                }
            }
            else /*r1 == r2*/ {		// horizontal cache
                for (var col = c1; col <= c2; col++) {
                    var cell = ws.getCell( new CellAddress(r1, col, 0) );

                    var item = {};
                    item.numFormatStr = cell.getNumFormatStr();
                    item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
                    item.val = cell.getValue();
                    item.isHidden = (ws._getCol(col).hd === true) || (ws._getRow(r1).hd === true);

                    cache.push(item);
                }
            }

            return cache;
        }

        var parsedHeaders = _t.parseSeriesHeaders();
        var data_bbox = {
            r1: parsedHeaders.bTop ? bbox.r1 + 1 : bbox.r1,
            r2: bbox.r2,
            c1: parsedHeaders.bLeft ? bbox.c1 + 1 : bbox.c1,
            c2: bbox.c2
        };

        var top_header_bbox, left_header_bbox;
        if ( _t.range.rows )
        {
            if(parsedHeaders.bTop)
            {
                top_header_bbox = {r1: bbox.r1, c1: data_bbox.c1, r2: bbox.r1, c2: data_bbox.c2};
            }
            else if(_t.range.catHeadersBBox && _t.range.catHeadersBBox.c1 === data_bbox.c1 && _t.range.catHeadersBBox.c2 === data_bbox.c2 && _t.range.catHeadersBBox.r1 === _t.range.catHeadersBBox.r2)
            {

                top_header_bbox = {r1: _t.range.catHeadersBBox.r1, c1: _t.range.catHeadersBBox.c1, r2: _t.range.catHeadersBBox.r1, c2: _t.range.catHeadersBBox.c2};
            }

            if(parsedHeaders.bLeft)
            {
                left_header_bbox = {r1: data_bbox.r1, r2: data_bbox.r2, c1: bbox.c1, c2: bbox.c1};
            }
            else if(_t.range.serHeadersBBox && _t.range.serHeadersBBox.c1 === _t.range.serHeadersBBox.c2 && _t.range.serHeadersBBox.r1 === data_bbox.r1 && _t.range.serHeadersBBox.r2 === data_bbox.r2)
            {
                left_header_bbox = {r1: _t.range.serHeadersBBox.r1, c1: _t.range.serHeadersBBox.c1, r2: _t.range.serHeadersBBox.r1, c2: _t.range.serHeadersBBox.c2};
            }

            for (var i = data_bbox.r1; i <= data_bbox.r2; i++)
            {
                var ser = new asc_CChartSeria();
                var startCell = new CellAddress(i, data_bbox.c1, 0);
                var endCell = new CellAddress(i, data_bbox.c2, 0);

                if (ws._getRow(i).hd === true)
                    ser.isHidden = true;

                // Val
                if (startCell && endCell) {
					ser.Val.Formula = parserHelp.get3DRef(ws.sName, startCell.getID() === endCell.getID() ?
						startCell.getID() : startCell.getID() + ':' + endCell.getID());
                }
                ser.Val.NumCache = getNumCache(data_bbox.c1, data_bbox.c2, i, i);

                if(left_header_bbox)
                {
                    var formulaCell = new CellAddress( i, left_header_bbox.c1, 0 );
					ser.TxCache.Formula = parserHelp.get3DRef(ws.sName, formulaCell.getID());
                }
                // xVal

                if(top_header_bbox)
                {
                    var start = new CellAddress(top_header_bbox.r1, top_header_bbox.c1, 0);
                    var end = new CellAddress(top_header_bbox.r1, top_header_bbox.c2, 0);

					var formula = parserHelp.get3DRef(ws.sName, start.getID() + ':' + end.getID());
                    var numCache = getNumCache(top_header_bbox.c1, top_header_bbox.c2, top_header_bbox.r1, top_header_bbox.r1 );

                    if ( _t.type == c_oAscChartType.scatter )
                    {
                        ser.xVal.Formula = formula;
                        ser.xVal.NumCache = numCache;
                    }
                    else
                    {
                        ser.Cat.Formula = formula;
                        ser.Cat.NumCache = numCache;
                    }
                }

                var seriaName = left_header_bbox ? (ws.getCell(new CellAddress(i, left_header_bbox.c1, 0)).getValue()) : (api.chartTranslate.series + " " + nameIndex);
                ser.TxCache.Tx = seriaName;
                _t.series.push(ser);
                nameIndex++;
            }
        }
        else
        {
            if(parsedHeaders.bTop)
            {
                top_header_bbox = {r1: bbox.r1, c1: data_bbox.c1, r2: bbox.r1, c2: data_bbox.c2};
            }
            else if(_t.range.serHeadersBBox && _t.range.serHeadersBBox.r1 === _t.range.serHeadersBBox.r2 && _t.range.serHeadersBBox.c1 === data_bbox.c1 && _t.range.serHeadersBBox.c2 === data_bbox.c2)
            {
                top_header_bbox = {r1: _t.range.serHeadersBBox.r1, c1: _t.range.serHeadersBBox.c1, r2: _t.range.serHeadersBBox.r2, c2: _t.range.serHeadersBBox.c2};
            }

            if(parsedHeaders.bLeft)
            {
                left_header_bbox = {r1: data_bbox.r1, c1: bbox.c1, r2: data_bbox.r2, c2: bbox.c1};
            }
            else if(_t.range.catHeadersBBox && _t.range.catHeadersBBox.c1 === _t.range.catHeadersBBox.c2 && _t.range.catHeadersBBox.r1 === data_bbox.r1 && _t.range.catHeadersBBox.r2 === data_bbox.r2)
            {
                left_header_bbox = {r1: _t.range.catHeadersBBox.r1, c1: _t.range.catHeadersBBox.c1, r2: _t.range.catHeadersBBox.r2, c2: _t.range.catHeadersBBox.c2};
            }


            for (var i = data_bbox.c1; i <= data_bbox.c2; i++) {

                var ser = new asc_CChartSeria();
                var startCell = new CellAddress(data_bbox.r1, i, 0);
                var endCell = new CellAddress(data_bbox.r2, i, 0);

                if (ws._getCol(i).hd === true)
                    ser.isHidden = true;

                // Val
                if (startCell && endCell) {
                    if (startCell.getID() == endCell.getID())
                        ser.Val.Formula = startCell.getID();
                    else
						ser.Val.Formula = parserHelp.get3DRef(ws.sName, startCell.getID() + ':' + endCell.getID());
                }
                ser.Val.NumCache = getNumCache(i, i, data_bbox.r1, bbox.r2);


                if ( left_header_bbox )
                {
                    var start = new CellAddress(left_header_bbox.r1, left_header_bbox.c1, 0);
                    var end = new CellAddress(left_header_bbox.r2, left_header_bbox.c1, 0);

                    var formula = parserHelp.get3DRef(ws.sName, start.getID() + ':' + end.getID());
                    var numCache = getNumCache( left_header_bbox.c1, left_header_bbox.c1, left_header_bbox.r1, left_header_bbox.r2 );

                    if ( _t.type == c_oAscChartType.scatter ) {
                        ser.xVal.Formula = formula;
                        ser.xVal.NumCache = numCache;
                    }
                    else {
                        ser.Cat.Formula = formula;
                        ser.Cat.NumCache = numCache;
                    }
                }

                if (top_header_bbox)
                {
                    var formulaCell = new CellAddress( top_header_bbox.r1, i, 0 );
                    ser.TxCache.Formula = parserHelp.get3DRef(ws.sName, formulaCell.getID());
                }

                var seriaName = top_header_bbox ? (ws.getCell(new CellAddress(top_header_bbox.r1, i, 0)).getValue()) : (api.chartTranslate.series + " " + nameIndex);
                ser.TxCache.Tx = seriaName;
                _t.series.push(ser);
                nameIndex++;
            }
        }
        // Colors
        var seriaUniColors = _t.generateUniColors(_t.series.length);

        if ( _t.type == c_oAscChartType.hbar )
            seriaUniColors = OfficeExcel.array_reverse(seriaUniColors);

        // Restore old series colors
        for ( var i = 0; i < _t.series.length; i++ ) {
            if ( oldSeriaData[i] )
                _t.series[i].OutlineColor = oldSeriaData[i];
            else
                _t.series[i].OutlineColor = seriaUniColors[i];
        }
    },

    getReverseSeries: function() {

        var _t = this;
        var revSeries = [];
        var serLen = _t.series.length;

        var aData = [];
        for (var j = 0; j < _t.series.length; j++) {
            aData.push(_t.series[j].Val.NumCache.length);
            aData.push(_t.series[j].xVal.NumCache.length);
            aData.push(_t.series[j].Cat.NumCache.length);
        }
        var maxDataLen = Math.max.apply(Math, aData);
        var emptyItem = { numFormatStr: "General", isDateTimeFormat: false, val: "", isHidden: false };

        for (var j = 0; j < _t.series.length; j++) {
            if ( _t.series[j].Val.NumCache.length ) {
                while ( _t.series[j].Val.NumCache.length < maxDataLen )
                    _t.series[j].Val.NumCache.push(emptyItem);
            }
            if ( _t.series[j].xVal.NumCache.length ) {
                while ( _t.series[j].xVal.NumCache.length < maxDataLen )
                    _t.series[j].xVal.NumCache.push(emptyItem);
            }
            if ( _t.series[j].Cat.NumCache.length ) {
                while ( _t.series[j].Cat.NumCache.length < maxDataLen )
                    _t.series[j].Cat.NumCache.push(emptyItem);
            }
        }

        if ( serLen ) {
            for (var i = 0; i < _t.series[0].Val.NumCache.length; i++) {

                var seria = new asc_CChartSeria();
                for (var j = 0; j < _t.series.length; j++) {
                    seria.Val.NumCache.push(_t.series[j].Val.NumCache[i]);

                    if ( _t.series[j].TxCache.Formula && _t.series[j].TxCache.Tx )
                        seria.Cat.NumCache.push( {val: _t.series[j].TxCache.Tx} );

                    if ( _t.series[j].Cat.Formula && _t.series[j].Cat.NumCache.length )
                        seria.TxCache.Tx = _t.series[j].Cat.NumCache[i].val;
                    else
                        seria.TxCache.Tx = (i + 1);
                }
                revSeries.push(seria);
            }
        }

        // Colors
        var seriaUniColors = _t.generateUniColors(revSeries.length);
        for (var i = 0; i < revSeries.length; i++) {
            revSeries[i].OutlineColor = seriaUniColors[i];
        }

        return revSeries;
    },

    generateUniColors: function(count) {
        var uniColors = [];
        var api_doc = window["editor"];
        var api_sheet = window["Asc"]["editor"];
        var api = api_sheet ? api_sheet : api_doc;

        if ( count > 0 ) {
            if ( !api.chartStyleManager.isReady() )
                api.chartStyleManager.init();

            var baseColors = api.chartStyleManager.getBaseColors( parseInt(this.styleId) );
            var colors = this._generateColors(count, baseColors);

            for ( var i = 0; i < colors.length; i++ ) {
                var uniColor = CreateUniColorRGB(colors[i].r, colors[i].g, colors[i].b);
                uniColor.isCustom = true;
                uniColors.push(uniColor);
            }
        }

        return uniColors;
    },

    getLegendInfo: function() {

        var aInfo = [];
        function legendInfo() { return { text: null, color: null, marker: null } }

        for ( var i = 0; i < this.series.length; i++ ) {

            var info = new legendInfo();
            info.text = this.series[i].asc_getTitle();
            info.color = this.series[i].asc_getOutlineColor();
            info.marker = c_oAscLegendMarkerType.Line;
            aInfo.push(info);
        }
        return aInfo;
    },

    Get_Id: function() {
        return this.Id;
    },

    getObjectType: function() {
        return CLASS_TYPE_CHART_DATA;
    },

    Write_ToBinary2: function(Writer) {
        var i, j;
        //Writer.WriteLong(CLASS_TYPE_CHART_DATA);
        Writer.WriteString2( this.Id );

        Writer.WriteString2( this.type );
        Writer.WriteString2( this.subType );
        Writer.WriteLong( this.styleId );

        Writer.WriteBool( this.bChartEditor );
        Writer.WriteBool( this.bShowValue );
        Writer.WriteBool( this.bShowCatName );
        Writer.WriteBool( this.bShowBorder );

        // Header
        Writer.WriteString2( this.header.title );
        Writer.WriteString2( this.header.subTitle );
        Writer.WriteBool( this.header.bDefaultTitle );

        // Range
        Writer.WriteString2( this.range.interval );
        Writer.WriteBool( this.range.rows );
        Writer.WriteBool( this.range.columns );

        // Axis X
        Writer.WriteString2( this.xAxis.title );
        Writer.WriteBool( this.xAxis.bDefaultTitle );
        Writer.WriteBool( this.xAxis.bShow );
        Writer.WriteBool( this.xAxis.bGrid );

        // Axis Y
        Writer.WriteString2( this.yAxis.title );
        Writer.WriteBool( this.yAxis.bDefaultTitle );
        Writer.WriteBool( this.yAxis.bShow );
        Writer.WriteBool( this.yAxis.bGrid );

        // Legend
        Writer.WriteString2( this.legend.position );
        Writer.WriteBool( this.legend.bShow );
        Writer.WriteBool( this.legend.bOverlay );

        // Series
        Writer.WriteLong( this.series.length );
        for (i = 0; i < this.series.length; i++) {

            Writer.WriteString2(this.series[i].Val.Formula);
            Writer.WriteLong(this.series[i].Val.NumCache.length);
            for (j = 0; j < this.series[i].Val.NumCache.length; j++) {
                Writer.WriteString2( (this.series[i].Val.NumCache[j].numFormatStr != undefined) ? this.series[i].Val.NumCache[j].numFormatStr : "General" );
                Writer.WriteBool( (this.series[i].Val.NumCache[j].isDateTimeFormat != undefined) ? this.series[i].Val.NumCache[j].isDateTimeFormat : false );
                Writer.WriteString2(this.series[i].Val.NumCache[j].val);
                Writer.WriteBool( (this.series[i].Val.NumCache[j].isHidden != undefined) ? this.series[i].Val.NumCache[j].isHidden : false );
            }

            Writer.WriteString2(this.series[i].xVal.Formula);
            Writer.WriteLong(this.series[i].xVal.NumCache.length);
            for (j = 0; j < this.series[i].xVal.NumCache.length; j++) {
                Writer.WriteString2( (this.series[i].xVal.NumCache[j].numFormatStr != undefined) ? this.series[i].xVal.NumCache[j].numFormatStr : "General" );
                Writer.WriteBool( (this.series[i].xVal.NumCache[j].isDateTimeFormat != undefined) ? this.series[i].xVal.NumCache[j].isDateTimeFormat : false );
                Writer.WriteString2(this.series[i].xVal.NumCache[j].val);
                Writer.WriteBool( (this.series[i].xVal.NumCache[j].isHidden != undefined) ? this.series[i].xVal.NumCache[j].isHidden : false );
            }

            Writer.WriteString2(this.series[i].Cat.Formula);
            Writer.WriteLong(this.series[i].Cat.NumCache.length);
            for (j = 0; j < this.series[i].Cat.NumCache.length; j++) {
                Writer.WriteString2( (this.series[i].Cat.NumCache[j].numFormatStr != undefined) ? this.series[i].Cat.NumCache[j].numFormatStr : "General" );
                Writer.WriteBool( (this.series[i].Cat.NumCache[j].isDateTimeFormat != undefined) ? this.series[i].Cat.NumCache[j].isDateTimeFormat : false );
                Writer.WriteString2(this.series[i].Cat.NumCache[j].val);
                Writer.WriteBool( (this.series[i].Cat.NumCache[j].isHidden != undefined) ? this.series[i].Cat.NumCache[j].isHidden : false );
            }

            Writer.WriteString2(this.series[i].TxCache.Tx);
            Writer.WriteString2(this.series[i].TxCache.Formula);

            Writer.WriteString2(this.series[i].Marker.Size);
            Writer.WriteString2(this.series[i].Marker.Symbol);

            Writer.WriteString2(this.series[i].FormatCode);
            Writer.WriteBool(this.series[i].isHidden);
            Writer.WriteBool(this.series[i].bShowValue);
        }

        // Theme Colors
        Writer.WriteLong( this.themeColors.length );
        for (i = 0; i < this.themeColors.length; i++) {
            this.themeColors[i].writeToBinaryLong(Writer);
        }
    },

    Read_FromBinary2: function(Reader, noReadId) {
        var i, j;
        Reader.GetLong();

        var Id = Reader.GetString2();
        if(!(noReadId === false))
            this.Id = Id;

        this.type = Reader.GetString2();
        this.subType = Reader.GetString2();
        this.styleId = Reader.GetLong();

        this.bChartEditor = Reader.GetBool();
        this.bShowValue = Reader.GetBool();
        this.bShowCatName = Reader.GetBool();
        this.bShowBorder = Reader.GetBool();

        // Header
        this.header.title = Reader.GetString2();
        this.header.subTitle = Reader.GetString2();
        this.header.bDefaultTitle = Reader.GetBool();

        // Range
        this.range.interval = Reader.GetString2();
        this.range.rows = Reader.GetBool();
        this.range.columns = Reader.GetBool();

        // Axis X
        this.xAxis.title = Reader.GetString2();
        this.xAxis.bDefaultTitle = Reader.GetBool();
        this.xAxis.bShow = Reader.GetBool();
        this.xAxis.bGrid = Reader.GetBool();

        // Axis Y
        this.yAxis.title = Reader.GetString2();
        this.yAxis.bDefaultTitle = Reader.GetBool();
        this.yAxis.bShow = Reader.GetBool();
        this.yAxis.bGrid = Reader.GetBool();

        // Legend
        this.legend.position = Reader.GetString2();
        this.legend.bShow = Reader.GetBool();
        this.legend.bOverlay = Reader.GetBool();

        // Series
        this.series = [];
        var seriesCount = Reader.GetLong();
        for (i = 0; i < seriesCount; i++) {

            var seria = new asc_CChartSeria();

            seria.Val.Formula = Reader.GetString2();
            var numCacheCount = Reader.GetLong();
            for (j = 0; j < numCacheCount; j++) {
                var item = {};
                item.numFormatStr = Reader.GetString2();
                item.isDateTimeFormat = Reader.GetBool();
                item.val = Reader.GetString2();
                item.isHidden = Reader.GetBool();
                seria.Val.NumCache.push(item);
            }

            seria.xVal.Formula = Reader.GetString2();
            numCacheCount = Reader.GetLong();
            for (j = 0; j < numCacheCount; j++) {
                var item = {};
                item.numFormatStr = Reader.GetString2();
                item.isDateTimeFormat = Reader.GetBool();
                item.val = Reader.GetString2();
                item.isHidden = Reader.GetBool();
                seria.xVal.NumCache.push(item);
            }

            seria.Cat.Formula = Reader.GetString2();
            numCacheCount = Reader.GetLong();
            for (j = 0; j < numCacheCount; j++) {
                var item = {};
                item.numFormatStr = Reader.GetString2();
                item.isDateTimeFormat = Reader.GetBool();
                item.val = Reader.GetString2();
                item.isHidden = Reader.GetBool();
                seria.Cat.NumCache.push(item);
            }

            seria.TxCache.Tx = Reader.GetString2();
            seria.TxCache.Formula = Reader.GetString2();

            seria.Marker.Size = Reader.GetString2();
            seria.Marker.Symbol = Reader.GetString2();

            seria.FormatCode = Reader.GetString2();
            seria.isHidden = Reader.GetBool();
            seria.bShowValue = Reader.GetBool();

            this.series.push(seria);
        }

        // Theme Colors
        var oColor;
        this.themeColors = [];
        var themeColorsCount = Reader.GetLong();
        for (i = 0; i < themeColorsCount; i++) {
            oColor = new CRGBColor();
            oColor.readFromBinaryLong(Reader);
            this.themeColors.push(oColor);
        }
    },

    Save_Changes: function(data, Writer) {
        this.Write_ToBinary2(Writer);
    },

    Load_Changes: function(Reader) {
        Reader.GetLong();	// CLASS_TYPE_CHART_DATA
        this.Read_FromBinary2(Reader);
    },

    Refresh_RecalcData: function(data) {
    },

    Undo: function(type, data) {

        var api = window["Asc"]["editor"];
        var ws = api.wb.getWorksheet();

        switch (type) {

            // type, subType, styleId
            case historyitem_Chart_Type:
                this.type = data.oldValue;
                break;

            case historyitem_Chart_SubType:
                this.subType = data.oldValue;
                break;

            case historyitem_Chart_Style:
                this.styleId = data.oldValue;
                break;

            // showValue, showBorder
            case historyitem_Chart_IsShowValue:
                this.bShowValue = data.oldValue;
                break;

            case historyitem_Chart_IsShowBorder:
                this.bShowBorder = data.oldValue;
                break;

            // range
            case historyitem_Chart_RangeInterval:
                this.range.interval = data.oldValue;
                if ( ws ) {
                    this.range.intervalObject = convertFormula( this.range.interval, ws );
                    this.rebuildSeries();
                }
                break;

            case historyitem_Chart_RangeRowColumns:
                this.range.rows = data.oldValue;
                this.range.columns = !data.oldValue;
                break;

            // header
            case historyitem_Chart_HeaderTitle:
                this.header.title = data.oldValue;
                break;

            case historyitem_Chart_HeaderSubTitle:
                this.header.subTitle = data.oldValue;
                break;

            case historyitem_Chart_IsDefaultHeaderTitle:
                this.header.bDefaultTitle = data.oldValue;
                break;

            // xAxis
            case historyitem_Chart_xAxisTitle:
                this.xAxis.title = data.oldValue;
                break;

            case historyitem_Chart_xAxisIsDefaultTitle:
                this.xAxis.bDefaultTitle = data.oldValue;
                break;

            case historyitem_Chart_xAxisIsShow:
                this.xAxis.bShow = data.oldValue;
                break;

            case historyitem_Chart_xAxisIsGrid:
                this.xAxis.bGrid = data.oldValue;
                break;

            // yAxis
            case historyitem_Chart_yAxisTitle:
                this.yAxis.title = data.oldValue;
                break;

            case historyitem_Chart_yAxisIsDefaultTitle:
                this.yAxis.bDefaultTitle = data.oldValue;
                break;

            case historyitem_Chart_yAxisIsShow:
                this.yAxis.bShow = data.oldValue;
                break;

            case historyitem_Chart_yAxisIsGrid:
                this.yAxis.bGrid = data.oldValue;
                break;

            // legend
            case historyitem_Chart_LegendPosition:
                this.legend.position = data.oldValue;
                break;

            case historyitem_Chart_LegendIsShow:
                this.legend.bShow = data.oldValue;
                break;

            case historyitem_Chart_LegendIsOverlay:
                this.legend.bOverlay = data.oldValue;
                break;

        }
        if ( ws )
            ws.objectRender.rebuildChartGraphicObjects();
    },

    Redo: function(type, data) {

        var api = window["Asc"]["editor"];
        var ws = api.wb.getWorksheet();

        // type, subType, styleId
        switch (type) {
            case historyitem_Chart_Type:
                this.type = data.newValue;
                break;

            case historyitem_Chart_SubType:
                this.subType = data.newValue;
                break;

            case historyitem_Chart_Style:
                this.styleId = data.newValue;
                break;

            // showValue, showBorder
            case historyitem_Chart_IsShowValue:
                this.bShowValue = data.newValue;
                break;

            case historyitem_Chart_IsShowBorder:
                this.bShowBorder = data.newValue;
                break;

            // range
            case historyitem_Chart_RangeInterval:
                this.range.interval = data.newValue;
                if ( ws ) {
                    this.range.intervalObject = convertFormula( this.range.interval, ws );
                    this.rebuildSeries();
                }
                break;

            case historyitem_Chart_RangeRowColumns:
                this.range.rows = data.newValue;
                this.range.columns = !data.newValue;
                break;

            // header
            case historyitem_Chart_HeaderTitle:
                this.header.title = data.newValue;
                break;

            case historyitem_Chart_HeaderSubTitle:
                this.header.subTitle = data.newValue;
                break;

            case historyitem_Chart_IsDefaultHeaderTitle:
                this.header.bDefaultTitle = data.newValue;
                break;

            // xAxis
            case historyitem_Chart_xAxisTitle:
                this.xAxis.title = data.newValue;
                break;

            case historyitem_Chart_xAxisIsDefaultTitle:
                this.xAxis.bDefaultTitle = data.newValue;
                break;

            case historyitem_Chart_xAxisIsShow:
                this.xAxis.bShow = data.newValue;
                break;

            case historyitem_Chart_xAxisIsGrid:
                this.xAxis.bGrid = data.newValue;
                break;

            // yAxis
            case historyitem_Chart_yAxisTitle:
                this.yAxis.title = data.newValue;
                break;

            case historyitem_Chart_yAxisIsDefaultTitle:
                this.yAxis.bDefaultTitle = data.newValue;
                break;

            case historyitem_Chart_yAxisIsShow:
                this.yAxis.bShow = data.newValue;
                break;

            case historyitem_Chart_yAxisIsGrid:
                this.yAxis.bGrid = data.newValue;
                break;

            // legend
            case historyitem_Chart_LegendPosition:
                this.legend.position = data.newValue;
                break;

            case historyitem_Chart_LegendIsShow:
                this.legend.bShow = data.newValue;
                break;

            case historyitem_Chart_LegendIsOverlay:
                this.legend.bOverlay = data.newValue;
                break;
        }
        if ( ws )
            ws.objectRender.rebuildChartGraphicObjects();
    }
};

//{ asc_CChart export
window["Asc"].asc_CChart = asc_CChart;
window["Asc"]["asc_CChart"] = asc_CChart;
prot = asc_CChart.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_setType"] = prot.asc_setType;

prot["asc_getSubType"] = prot.asc_getSubType;
prot["asc_setSubType"] = prot.asc_setSubType;

prot["asc_getStyleId"] = prot.asc_getStyleId;
prot["asc_setStyleId"] = prot.asc_setStyleId;

prot["asc_getShowValueFlag"] = prot.asc_getShowValueFlag;
prot["asc_setShowValueFlag"] = prot.asc_setShowValueFlag;

prot["asc_getShowCatNameFlag"] = prot.asc_getShowCatNameFlag;
prot["asc_setShowCatNameFlag"] = prot.asc_setShowCatNameFlag;

prot["asc_getShowBorderFlag"] = prot.asc_getShowBorderFlag;
prot["asc_setShowBorderFlag"] = prot.asc_setShowBorderFlag;

prot["asc_getHeader"] = prot.asc_getHeader;
prot["asc_setHeader"] = prot.asc_setHeader;

prot["asc_getRange"] = prot.asc_getRange;
prot["asc_setRange"] = prot.asc_setRange;

prot["asc_getXAxis"] = prot.asc_getXAxis;
prot["asc_setXAxis"] = prot.asc_setXAxis;

prot["asc_getYAxis"] = prot.asc_getYAxis;
prot["asc_setYAxis"] = prot.asc_setYAxis;

prot["asc_getLegend"] = prot.asc_getLegend;
prot["asc_setLegend"] = prot.asc_setLegend;

prot["asc_getSeria"] = prot.asc_getSeria;
prot["asc_setSeria"] = prot.asc_setSeria;
prot["asc_removeSeries"] = prot.asc_removeSeries;
//}

//-----------------------------------------------------------------------------------
// Chart binary
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartBinary(chart) {

    this["binary"] = null;
    if (chart && chart.getObjectType() === historyitem_type_ChartSpace)
    {
        var writer = new BinaryChartWriter(new CMemory(false));
        writer.WriteCT_ChartSpace(chart);
        this["binary"] = writer.memory.pos + ";" + writer.memory.GetBase64Memory();
        if(chart.theme)
        {
            var pptx_writer = new CBinaryFileWriter();
            pptx_writer.WriteTheme(chart.theme);
            this["themeBinary"] = pptx_writer.pos + ";" + pptx_writer.GetBase64Memory();
        }
    }
}

asc_CChartBinary.prototype = {

    asc_getBinary: function() { return this["binary"]; },
    asc_setBinary: function(val) { this["binary"] = val; },
    asc_getThemeBinary: function() { return this["themeBinary"]; },
    asc_setThemeBinary: function(val) { this["themeBinary"] = val; },
    getChartSpace: function(workSheet)
    {
        var binary = this["binary"];
        var stream = CreateBinaryReader(this["binary"], 0, this["binary"].length);
        var oNewChartSpace = new CChartSpace();
        var oBinaryChartReader = new BinaryChartReader(stream);
        oBinaryChartReader.ExternalReadCT_ChartSpace(stream.size , oNewChartSpace, workSheet);
        return oNewChartSpace;
    },

    getTheme: function()
    {
        var binary = this["themeBinary"];
        if(binary)
        {
            var stream = CreateBinaryReader(binary, 0, binary.length);
            var oBinaryReader = new BinaryPPTYLoader();

            oBinaryReader.stream = new FileStream();
            oBinaryReader.stream.obj    = stream.obj;
            oBinaryReader.stream.data   = stream.data;
            oBinaryReader.stream.size   = stream.size;
            oBinaryReader.stream.pos    = stream.pos;
            oBinaryReader.stream.cur    = stream.cur;
            return oBinaryReader.ReadTheme();
        }
        return null;
    }

};

//{ asc_CChartBinary export
window["Asc"].asc_CChartBinary = asc_CChartBinary;
window["Asc"]["asc_CChartBinary"] = asc_CChartBinary;
prot = asc_CChartBinary.prototype;

prot["asc_getBinary"] = prot.asc_getBinary;
prot["asc_setBinary"] = prot.asc_setBinary;
prot["asc_getThemeBinary"] = prot.asc_getThemeBinary;
prot["asc_setThemeBinary"] = prot.asc_setThemeBinary;
//}

//-----------------------------------------------------------------------------------
// Chart range
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartRange(object) {

    var bCopy = isObject(object);

    this.interval = bCopy ? object.interval : "";
    this.intervalObject = bCopy ? object.intervalObject : null;
    this.rows = bCopy ? object.rows : false;
    this.columns = bCopy ? object.columns : true;
    this.catHeadersBBox = null;
    this.serHeadersBBox = null;
}

asc_CChartRange.prototype = {

    isEqual: function(object) {
        return ( (this.interval == object.interval) && (this.rows == object.rows) && (this.columns == object.columns) );
    },

    asc_getInterval: function() { return this.interval; },
    asc_setInterval: function(interval) { this.interval = interval; },

    asc_getRowsFlag: function() { return this.rows; },
    asc_setRowsFlag: function(value) {
        this.rows = value;
        this.columns = !value;
    },

    asc_getColumnsFlag: function() { return this.columns; },
    asc_setColumnsFlag: function(value) {
        this.rows = !value;
        this.columns = value;
    }
};

//{ asc_CChartRange export
window["Asc"].asc_CChartRange = asc_CChartRange;
window["Asc"]["asc_CChartRange"] = asc_CChartRange;
prot = asc_CChartRange.prototype;

prot["asc_getInterval"] = prot.asc_getInterval;
prot["asc_setInterval"] = prot.asc_setInterval;

prot["asc_getRowsFlag"] = prot.asc_getRowsFlag;
prot["asc_setRowsFlag"] = prot.asc_setRowsFlag;

prot["asc_getColumnsFlag"] = prot.asc_getColumnsFlag;
prot["asc_setColumnsFlag"] = prot.asc_setColumnsFlag;
//}

//-----------------------------------------------------------------------------------
// Chart title
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartHeader(object) {

    var bCopy = isObject(object);

    this.title = bCopy ? object.title : "";
    this.subTitle = bCopy ? object.subTitle : "";
    this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
}

asc_CChartHeader.prototype = {

    isEqual: function(object) {
        return ( (this.title == object.title) && (this.subTitle == object.subTitle) && (this.bDefaultTitle == object.bDefaultTitle) );
    },

    asc_getTitle: function() { return this.title; },
    asc_setTitle: function(title) { this.title = title; },

    asc_getSubTitle: function() { return this.subTitle; },
    asc_setSubTitle: function(subTitle) { this.subTitle = subTitle; },

    asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
    asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; }
};

//{ asc_CChartHeader export
window["Asc"].asc_CChartHeader = asc_CChartHeader;
window["Asc"]["asc_CChartHeader"] = asc_CChartHeader;
prot = asc_CChartHeader.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getSubTitle"] = prot.asc_getSubTitle;
prot["asc_setSubTitle"] = prot.asc_setSubTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;
//}

//-----------------------------------------------------------------------------------
// Chart axis X
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartAxisX(object) {

    var bCopy = isObject(object);

    this.title = bCopy ? object.title : "";
    this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
    this.bShow = bCopy ? object.bShow : true;
    this.bGrid = bCopy ? object.bGrid : true;
}

asc_CChartAxisX.prototype = {

    isEqual: function(object) {
        return ( (this.title == object.title) && (this.bDefaultTitle == object.bDefaultTitle) && (this.bShow == object.bShow) && (this.bGrid == object.bGrid) );
    },

    asc_getTitle: function() { return this.title; },
    asc_setTitle: function(title) { this.title = title; },

    asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
    asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },

    asc_getShowFlag: function() { return this.bShow; },
    asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

    asc_getGridFlag: function() { return this.bGrid; },
    asc_setGridFlag: function(gridFlag) { this.bGrid = gridFlag; }
};

//{ asc_CChartAxisX export
window["Asc"].asc_CChartAxisX = asc_CChartAxisX;
window["Asc"]["asc_CChartAxisX"] = asc_CChartAxisX;
prot = asc_CChartAxisX.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getGridFlag"] = prot.asc_getGridFlag;
prot["asc_setGridFlag"] = prot.asc_setGridFlag;
//}

//-----------------------------------------------------------------------------------
// Chart axis Y
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartAxisY(object) {

    var bCopy = isObject(object);

    this.title = bCopy ? object.title : "";
    this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
    this.bShow = bCopy ? object.bShow : true;
    this.bGrid = bCopy ? object.bGrid : true;
}

asc_CChartAxisY.prototype = {

    isEqual: function(object) {
        return ( (this.title == object.title) && (this.bDefaultTitle == object.bDefaultTitle) && (this.bShow == object.bShow) && (this.bGrid == object.bGrid) );
    },

    asc_getTitle: function() { return this.title; },
    asc_setTitle: function(title) { this.title = title; },

    asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
    asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },

    asc_getShowFlag: function() { return this.bShow; },
    asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

    asc_getGridFlag: function() { return this.bGrid; },
    asc_setGridFlag: function(gridFlag) { this.bGrid = gridFlag; }
};

//{ asc_CChartAxisY export
window["Asc"].asc_CChartAxisY = asc_CChartAxisY;
window["Asc"]["asc_CChartAxisY"] = asc_CChartAxisY;
prot = asc_CChartAxisY.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getGridFlag"] = prot.asc_getGridFlag;
prot["asc_setGridFlag"] = prot.asc_setGridFlag;
//}

//-----------------------------------------------------------------------------------
// Chart legend
//-----------------------------------------------------------------------------------	
/** @constructor */
function asc_CChartLegend(object) {

    var bCopy = isObject(object);

    this.position = bCopy ? object.position : c_oAscChartLegend.right;
    this.bShow = bCopy ? object.bShow : true;
    this.bOverlay = bCopy ? object.bOverlay : false;
}

asc_CChartLegend.prototype = {

    isEqual: function(object) {
        return ( (this.position == object.position) && (this.bShow == object.bShow) && (this.bOverlay == object.bOverlay) );
    },

    asc_getPosition: function() { return this.position; },
    asc_setPosition: function(pos) { this.position = pos; },

    asc_getShowFlag: function() { return this.bShow; },
    asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

    asc_getOverlayFlag: function() { return this.bOverlay; },
    asc_setOverlayFlag: function(overlayFlag) { this.bOverlay = overlayFlag; }
};

//{ asc_CChartLegend export
window["Asc"].asc_CChartLegend = asc_CChartLegend;
window["Asc"]["asc_CChartLegend"] = asc_CChartLegend;
prot = asc_CChartLegend.prototype;

prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_setPosition"] = prot.asc_setPosition;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getOverlayFlag"] = prot.asc_getOverlayFlag;
prot["asc_setOverlayFlag"] = prot.asc_setOverlayFlag;
//}

//-----------------------------------------------------------------------------------
// Chart font
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartFont(object) {

    var bCopy = isObject(object);

    this.name = bCopy ? object.name : "Calibri";
    this.size = bCopy ? object.size : 10;
    this.color = bCopy ? object.color : new CColor(0, 0, 0);

    this.bold = bCopy ? object.bold : 0;
    this.italic = bCopy ? object.italic : 0;
    this.underline = bCopy ? object.underline : 0;

    this.Properties = {
        name: 0,
        size: 1,
        color: 2,
        bold: 3,
        italic: 4,
        underline: 5
    }
}

asc_CChartFont.prototype = {
    asc_getName: function() { return this.name; },
    asc_setName: function(val) { this.name = val; },

    asc_getSize: function() { return this.size; },
    asc_setSize: function(val) { this.size = val; },

    asc_getColor: function() { return this.color; },
    asc_setColor: function(val) { this.color = val; },

    asc_getBold: function() { return this.bold; },
    asc_setBold: function(val) { this.bold = val; },

    asc_getItalic: function() { return this.italic; },
    asc_setItalic: function(val) { this.italic = val; },

    asc_getUnderline: function() { return this.underline; },
    asc_setUnderline: function(val) { this.underline = val; },

    //	For collaborative editing
    getType: function() {
        return UndoRedoDataTypes.ChartFont;
    },

    getProperties: function() {
        return this.Properties;
    },

    getProperty: function(nType) {
        switch (nType) {
            case this.Properties.name: return this.name; break;
            case this.Properties.size: return this.size; break;
            case this.Properties.color: return this.color; break;

            case this.Properties.bold: return this.bold; break;
            case this.Properties.italic: return this.italic; break;
            case this.Properties.underline: return this.underline; break;
        }
    },

    setProperty: function(nType, value) {
        switch (nType) {
            case this.Properties.name: this.name = value; break;
            case this.Properties.size: this.size = value; break;
            case this.Properties.color: this.color = value; break;

            case this.Properties.bold: this.bold = value; break;
            case this.Properties.italic: this.italic = value; break;
            case this.Properties.underline: this.underline = value; break;
        }
    }
};

//{ asc_CChartFont export
window["Asc"].asc_CChartFont = asc_CChartFont;
window["Asc"]["asc_CChartFont"] = asc_CChartFont;
prot = asc_CChartFont.prototype;

prot["asc_getName"] = prot.asc_getName;
prot["asc_setName"] = prot.asc_setName;

prot["asc_getSize"] = prot.asc_getSize;
prot["asc_setSize"] = prot.asc_setSize;

prot["asc_getColor"] = prot.asc_getColor;
prot["asc_setColor"] = prot.asc_setColor;

prot["asc_getBold"] = prot.asc_getBold;
prot["asc_setBold"] = prot.asc_setBold;

prot["asc_getItalic"] = prot.asc_getItalic;
prot["asc_setItalic"] = prot.asc_setItalic;

prot["asc_getUnderline"] = prot.asc_getUnderline;
prot["asc_setUnderline"] = prot.asc_setUnderline;
//}

//-----------------------------------------------------------------------------------
// Chart series
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CChartSeria() {
    this.Val = { Formula: "", NumCache: [] };
    this.xVal = { Formula: "", NumCache: [] };
    this.Cat = { Formula: "", NumCache: [] };
    this.TxCache = { Formula: "", Tx: "" };
    this.Marker = { Size: 0, Symbol: "" };
    this.OutlineColor = null;
    this.FormatCode = "";
    this.isHidden = false;
    this.bShowValue = false;
}

asc_CChartSeria.prototype = {

    asc_getValFormula: function() { return this.Val.Formula; },
    asc_setValFormula: function(formula) { this.Val.Formula = formula; },

    asc_getxValFormula: function() { return this.xVal.Formula; },
    asc_setxValFormula: function(formula) { this.xVal.Formula = formula; },

    asc_getCatFormula: function() { return this.Cat.Formula; },
    asc_setCatFormula: function(formula) { this.Cat.Formula = formula; },

    asc_getTitle: function() { return this.TxCache.Tx; },
    asc_setTitle: function(title) { this.TxCache.Tx = title; },

    asc_getTitleFormula: function() { return this.TxCache.Formula; },
    asc_setTitleFormula: function(val) { this.TxCache.Formula = val; },

    asc_getMarkerSize: function() { return this.Marker.Size; },
    asc_setMarkerSize: function(size) { this.Marker.Size = size; },

    asc_getMarkerSymbol: function() { return this.Marker.Symbol; },
    asc_setMarkerSymbol: function(symbol) { this.Marker.Symbol = symbol; },

    asc_getOutlineColor: function() { return this.OutlineColor; },
    asc_setOutlineColor: function(color) {
        if ( color instanceof CUniColor ) {
            this.OutlineColor = color.createDuplicate();
            this.OutlineColor.isCustom = color.isCustom;
        }
    },

    asc_getFormatCode: function() { return this.FormatCode; },
    asc_setFormatCode: function(format) { this.FormatCode = format; }
};

//{ asc_CChartSeria export
window["Asc"].asc_CChartSeria = asc_CChartSeria;
window["Asc"]["asc_CChartSeria"] = asc_CChartSeria;
prot = asc_CChartSeria.prototype;

prot["asc_getValFormula"] = prot.asc_getValFormula;
prot["asc_setValFormula"] = prot.asc_setValFormula;

prot["asc_getxValFormula"] = prot.asc_getxValFormula;
prot["asc_setxValFormula"] = prot.asc_setxValFormula;

prot["asc_getCatFormula"] = prot.asc_getCatFormula;
prot["asc_setCatFormula"] = prot.asc_setCatFormula;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getTitleFormula"] = prot.asc_getTitleFormula;
prot["asc_setTitleFormula"] = prot.asc_setTitleFormula;

prot["asc_getMarkerSize"] = prot.asc_getMarkerSize;
prot["asc_setMarkerSize"] = prot.asc_setMarkerSize;

prot["asc_getMarkerSymbol"] = prot.asc_getMarkerSymbol;
prot["asc_setMarkerSymbol"] = prot.asc_setMarkerSymbol;

prot["asc_getOutlineColor"] = prot.asc_getOutlineColor;
prot["asc_setOutlineColor"] = prot.asc_setOutlineColor;

prot["asc_getFormatCode"] = prot.asc_getFormatCode;
prot["asc_setFormatCode"] = prot.asc_setFormatCode;
//}


//-----------------------------------------------------------------------------------
// Selected graphic object(properties)
//-----------------------------------------------------------------------------------	
/** @constructor */
function asc_CSelectedObject( type, val ) {
    this.Type = (undefined != type) ? type : null;
    this.Value = (undefined != val) ? val : null;
}

asc_CSelectedObject.prototype = {
    asc_getObjectType: function() { return this.Type; },
    asc_getObjectValue: function() { return this.Value; }
};

//{ asc_CSelectedObject export
window["Asc"].asc_CSelectedObject = asc_CSelectedObject;
window["Asc"]["asc_CSelectedObject"] = asc_CSelectedObject;
prot = asc_CSelectedObject.prototype;

prot["asc_getObjectType"] = prot.asc_getObjectType;
prot["asc_getObjectValue"] = prot.asc_getObjectValue;
//}

//-----------------------------------------------------------------------------------
// CImgProperty
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CImgProperty( obj ) {

    if( obj ) {
        this.CanBeFlow = (undefined != obj.CanBeFlow) ? obj.CanBeFlow : true;

        this.Width         = (undefined != obj.Width        ) ? obj.Width                          : undefined;
        this.Height        = (undefined != obj.Height       ) ? obj.Height                         : undefined;
        this.WrappingStyle = (undefined != obj.WrappingStyle) ? obj.WrappingStyle                  : undefined;
        this.Paddings      = (undefined != obj.Paddings     ) ? new CPaddings (obj.Paddings)       : undefined;
        this.Position      = (undefined != obj.Position     ) ? new CPosition (obj.Position)       : undefined;
        this.AllowOverlap  = (undefined != obj.AllowOverlap ) ? obj.AllowOverlap                   : undefined;
        this.PositionH     = (undefined != obj.PositionH    ) ? new CImagePositionH(obj.PositionH) : undefined;
        this.PositionV     = (undefined != obj.PositionV    ) ? new CImagePositionV(obj.PositionV) : undefined;

        this.Internal_Position = (undefined != obj.Internal_Position) ? obj.Internal_Position : null;

        this.ImageUrl = (undefined != obj.ImageUrl) ? obj.ImageUrl : null;
        this.Locked   = (undefined != obj.Locked) ? obj.Locked : false;


        this.ChartProperties = (undefined != obj.ChartProperties) ? obj.ChartProperties : null;
        this.ShapeProperties = (undefined != obj.ShapeProperties) ? /*CreateAscShapePropFromProp*/(obj.ShapeProperties) : null;

        this.ChangeLevel = (undefined != obj.ChangeLevel) ? obj.ChangeLevel : null;
        this.Group = (obj.Group != undefined) ? obj.Group : null;

        this.fromGroup = obj.fromGroup != undefined ? obj.fromGroup : null;
        this.severalCharts = obj.severalCharts != undefined ? obj.severalCharts : false;
        this.severalChartTypes = obj.severalChartTypes != undefined ? obj.severalChartTypes : undefined;
        this.severalChartStyles = obj.severalChartStyles != undefined ? obj.severalChartStyles : undefined;
        this.verticalTextAlign = obj.verticalTextAlign != undefined ? obj.verticalTextAlign : undefined;
    }
    else {
        this.CanBeFlow = true;
        this.Width         = undefined;
        this.Height        = undefined;
        this.WrappingStyle = undefined;
        this.Paddings      = undefined;
        this.Position      = undefined;
        this.PositionH     = undefined;
        this.PositionV     = undefined;
        this.Internal_Position = null;
        this.ImageUrl = null;
        this.Locked   = false;

        this.ChartProperties = null;
        this.ShapeProperties = null;
        this.ImageProperties = null;

        this.ChangeLevel = null;
        this.Group = null;
        this.fromGroup = null;
        this.severalCharts = false;
        this.severalChartTypes = undefined;
        this.severalChartStyles = undefined;
        this.verticalTextAlign = undefined;
    }
}

asc_CImgProperty.prototype = {

    asc_getChangeLevel: function() { return this.ChangeLevel; },
    asc_putChangeLevel: function(v) { this.ChangeLevel = v; },

    asc_getCanBeFlow: function() { return this.CanBeFlow; },
    asc_getWidth: function() { return this.Width; },
    asc_putWidth: function(v) { this.Width = v; },
    asc_getHeight: function() { return this.Height; },
    asc_putHeight: function(v) { this.Height = v; },
    asc_getWrappingStyle: function() { return this.WrappingStyle; },
    asc_putWrappingStyle: function(v) { this.WrappingStyle = v; },

    // Возвращается объект класса CPaddings
    asc_getPaddings: function() { return this.Paddings; },
    // Аргумент объект класса CPaddings
    asc_putPaddings: function(v) { this.Paddings = v; },
    asc_getAllowOverlap: function() {return this.AllowOverlap;},
    asc_putAllowOverlap: function(v) {this.AllowOverlap = v;},
    // Возвращается объект класса CPosition
    asc_getPosition: function() { return this.Position; },
    // Аргумент объект класса CPosition
    asc_putPosition: function(v) { this.Position = v; },
    asc_getPositionH: function()  { return this.PositionH; },
    asc_putPositionH: function(v) { this.PositionH = v; },
    asc_getPositionV: function()  { return this.PositionV; },
    asc_putPositionV: function(v) { this.PositionV = v; },
    asc_getValue_X: function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_X_Value(RelativeFrom);  return 0; },
    asc_getValue_Y: function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);  return 0; },

    asc_getImageUrl: function() { return this.ImageUrl; },
    asc_putImageUrl: function(v) { this.ImageUrl = v; },
    asc_getGroup: function() { return this.Group; },
    asc_putGroup: function(v) { this.Group = v; },
    asc_getFromGroup: function() { return this.fromGroup; },
    asc_putFromGroup: function(v) { this.fromGroup = v; },

    asc_getisChartProps: function() { return this.isChartProps; },
    asc_putisChartPross: function(v) { this.isChartProps = v; },

    asc_getSeveralCharts: function() { return this.severalCharts; },
    asc_putSeveralCharts: function(v) { this.severalCharts = v; },
    asc_getSeveralChartTypes: function() { return this.severalChartTypes; },
    asc_putSeveralChartTypes: function(v) { this.severalChartTypes = v; },

    asc_getSeveralChartStyles: function() { return this.severalChartStyles; },
    asc_putSeveralChartStyles: function(v) { this.severalChartStyles = v; },

    asc_getVerticalTextAlign: function() { return this.verticalTextAlign; },
    asc_putVerticalTextAlign: function(v) { this.verticalTextAlign = v; },

    asc_getLocked: function() { return this.Locked; },
    asc_getChartProperties: function() { return this.ChartProperties; },
    asc_putChartProperties: function(v) { this.ChartProperties = v; },
    asc_getShapeProperties: function() { return this.ShapeProperties; },
    asc_putShapeProperties: function(v) { this.ShapeProperties = v; }
};

//{ asc_CImgProperty export
window["Asc"].asc_CImgProperty = asc_CImgProperty;
window["Asc"]["asc_CImgProperty"] = asc_CImgProperty;
prot = asc_CImgProperty.prototype;

prot["asc_getChangeLevel"] = prot.asc_getChangeLevel;
prot["asc_putChangeLevel"] = prot.asc_putChangeLevel;

prot["asc_getCanBeFlow"] = prot.asc_getCanBeFlow;
prot["asc_getWidth"] = prot.asc_getWidth;
prot["asc_putWidth"] = prot.asc_putWidth;
prot["asc_getHeight"] = prot.asc_getHeight;
prot["asc_putHeight"] = prot.asc_putHeight;
prot["asc_getWrappingStyle"] = prot.asc_getWrappingStyle;
prot["asc_putWrappingStyle"] = prot.asc_putWrappingStyle;

prot["asc_getPaddings"] = prot.asc_getPaddings;
prot["asc_putPaddings"] = prot.asc_putPaddings;
prot["asc_getAllowOverlap"] = prot.asc_getAllowOverlap;
prot["asc_putAllowOverlap"] = prot.asc_putAllowOverlap;
prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_putPosition"] = prot.asc_putPosition;
prot["asc_getPositionH"] = prot.asc_getPositionH;
prot["asc_putPositionH"] = prot.asc_putPositionH;
prot["asc_getPositionV"] = prot.asc_getPositionV;
prot["asc_putPositionV"] = prot.asc_putPositionV;
prot["asc_getValue_X"] = prot.asc_getValue_X;
prot["asc_getValue_Y"] = prot.asc_getValue_Y;

prot["asc_getImageUrl"] = prot.asc_getImageUrl;
prot["asc_putImageUrl"] = prot.asc_putImageUrl;
prot["asc_getGroup"] = prot.asc_getGroup;
prot["asc_putGroup"] = prot.asc_putGroup;
prot["asc_getFromGroup"] = prot.asc_getFromGroup;
prot["asc_putFromGroup"] = prot.asc_putFromGroup;
prot["asc_getisChartProps"] = prot.asc_getisChartProps;
prot["asc_putisChartPross"] = prot.asc_putisChartPross;

prot["asc_getSeveralCharts"] = prot.asc_getSeveralCharts;
prot["asc_putSeveralCharts"] = prot.asc_putSeveralCharts;
prot["asc_getSeveralChartTypes"] = prot.asc_getSeveralChartTypes;
prot["asc_putSeveralChartTypes"] = prot.asc_putSeveralChartTypes;
prot["asc_getSeveralChartStyles"] = prot.asc_getSeveralChartStyles;
prot["asc_putSeveralChartStyles"] = prot.asc_putSeveralChartStyles;
prot["asc_getVerticalTextAlign"] = prot.asc_getVerticalTextAlign;
prot["asc_putVerticalTextAlign"] = prot.asc_putVerticalTextAlign;
prot["asc_getLocked"] = prot.asc_getLocked;
prot["asc_getChartProperties"] = prot.asc_getChartProperties;
prot["asc_putChartProperties"] = prot.asc_putChartProperties;
prot["asc_getShapeProperties"] = prot.asc_getShapeProperties;
prot["asc_putShapeProperties"] = prot.asc_putShapeProperties;
//}

//-----------------------------------------------------------------------------------
// CShapeProperty
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CShapeProperty() {
    this.type = null; // custom
    this.fill = null;
    this.stroke = null;
    this.paddings = null;
    this.canFill = true;
    this.canChangeArrows = false;
    this.bFromChart = false;
}

asc_CShapeProperty.prototype = {

    asc_getType: function() { return this.type; },
    asc_putType: function(v) { this.type = v; },
    asc_getFill: function() { return this.fill; },
    asc_putFill: function(v) { this.fill = v; },
    asc_getStroke: function() { return this.stroke; },
    asc_putStroke: function(v) { this.stroke = v; },
    asc_getPaddings: function() { return this.paddings; },
    asc_putPaddings: function(v) { this.paddings = v; },
    asc_getCanFill: function() { return this.canFill; },
    asc_putCanFill: function(v) { this.canFill = v; },
    asc_getCanChangeArrows: function() { return this.canChangeArrows; },
    asc_setCanChangeArrows: function(v) { this.canChangeArrows = v; },
    asc_getFromChart: function() { return this.bFromChart; },
    asc_setFromChart: function(v) { this.bFromChart = v; }
};

//{ asc_CShapeProperty export
window["Asc"].asc_CShapeProperty = asc_CShapeProperty;
window["Asc"]["asc_CShapeProperty"] = asc_CShapeProperty;
prot = asc_CShapeProperty.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getFill"] = prot.asc_getFill;
prot["asc_putFill"] = prot.asc_putFill;
prot["asc_getStroke"] = prot.asc_getStroke;
prot["asc_putStroke"] = prot.asc_putStroke;
prot["asc_getPaddings"] = prot.asc_getPaddings;
prot["asc_putPaddings"] = prot.asc_putPaddings;
prot["asc_getCanFill"] = prot.asc_getCanFill;
prot["asc_putCanFill"] = prot.asc_putCanFill;
prot["asc_getCanChangeArrows"] = prot.asc_getCanChangeArrows;
prot["asc_setCanChangeArrows"] = prot.asc_setCanChangeArrows;
prot["asc_getFromChart"] = prot.asc_getFromChart;
prot["asc_setFromChart"] = prot.asc_setFromChart;
//}

//-----------------------------------------------------------------------------------
// CPaddings
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CPaddings(obj) {

    if ( obj ) {
        this.Left = (undefined == obj.Left) ? null : obj.Left;
        this.Top = (undefined == obj.Top) ? null : obj.Top;
        this.Bottom = (undefined == obj.Bottom) ? null : obj.Bottom;
        this.Right = (undefined == obj.Right) ? null : obj.Right;
    }
    else {
        this.Left = null;
        this.Top = null;
        this.Bottom = null;
        this.Right = null;
    }
}

asc_CPaddings.prototype = {
    asc_getLeft: function() { return this.Left; },
    asc_putLeft: function(v) { this.Left = v; },
    asc_getTop: function() { return this.Top; },
    asc_putTop: function(v) { this.Top = v; },
    asc_getBottom: function() { return this.Bottom; },
    asc_putBottom: function(v) { this.Bottom = v; },
    asc_getRight: function() { return this.Right; },
    asc_putRight: function(v) { this.Right = v; }
};

//{ asc_CPaddings export
window["Asc"].asc_CPaddings = asc_CPaddings;
window["Asc"]["asc_CPaddings"] = asc_CPaddings;
prot = asc_CPaddings.prototype;

prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getTop"] = prot.asc_getTop;
prot["asc_putTop"] = prot.asc_putTop;
prot["asc_getBottom"] = prot.asc_getBottom;
prot["asc_putBottom"] = prot.asc_putBottom;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
//}

//-----------------------------------------------------------------------------------
// CImageSize
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CImageSize( width, height, isCorrect ) {
    this.Width = (undefined == width) ? 0.0 : width;
    this.Height = (undefined == height) ? 0.0 : height;
    this.IsCorrect = isCorrect;
}

asc_CImageSize.prototype = {

    asc_getImageWidth: function() { return this.Width; },
    asc_getImageHeight: function() { return this.Height; },
    asc_getIsCorrect: function() { return this.IsCorrect; }
};

//{ asc_CImageSize export
window["Asc"].asc_CImageSize = asc_CImageSize;
window["Asc"]["asc_CImageSize"] = asc_CImageSize;
prot = asc_CImageSize.prototype;

prot["asc_getImageWidth"] = prot.asc_getImageWidth;
prot["asc_getImageHeight"] = prot.asc_getImageHeight;
prot["asc_getIsCorrect"] = prot.asc_getIsCorrect;
//}

//-----------------------------------------------------------------------------------
// CTexture
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CTexture() {
    this.Id = 0;
    this.Image = "";
}

asc_CTexture.prototype = {
    asc_getId: function() { return this.Id; },
    asc_getImage: function() { return this.Image; }
};

//{ asc_CTexture export
window["Asc"].asc_CTexture = asc_CTexture;
window["Asc"]["asc_CTexture"] = asc_CTexture;
prot = asc_CTexture.prototype;

prot["asc_getId"] = prot.asc_getId;
prot["asc_getImage"] = prot.asc_getImage;
//}

//-----------------------------------------------------------------------------------
// CParagraphProperty
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CParagraphProperty(obj) {

    if (obj) {
        this.ContextualSpacing = (undefined != obj.ContextualSpacing)              ? obj.ContextualSpacing : null;
        this.Ind               = (undefined != obj.Ind     && null != obj.Ind)     ? new asc_CParagraphInd (obj.Ind) : null;
        this.KeepLines         = (undefined != obj.KeepLines)                      ? obj.KeepLines : null;
        this.KeepNext          = (undefined != obj.KeepNext)                       ? obj.KeepNext  : undefined;
        this.WidowControl      = (undefined != obj.WidowControl                    ? obj.WidowControl : undefined );
        this.PageBreakBefore   = (undefined != obj.PageBreakBefore)                ? obj.PageBreakBefore : null;
        this.Spacing           = (undefined != obj.Spacing && null != obj.Spacing) ? new asc_CParagraphSpacing (obj.Spacing) : null;
        this.Brd               = (undefined != obj.Brd     && null != obj.Brd)     ? new asc_CParagraphBorders (obj.Brd) : null;
        this.Shd               = (undefined != obj.Shd     && null != obj.Shd)     ? new asc_CParagraphShd (obj.Shd) : null;
        this.Tabs              = (undefined != obj.Tabs)                           ? new asc_CParagraphTabs(obj.Tabs) : undefined;
        this.DefaultTab        = Default_Tab_Stop;
        this.Locked            = (undefined != obj.Locked  && null != obj.Locked ) ? obj.Locked : false;
        this.CanAddTable       = (undefined != obj.CanAddTable )                   ? obj.CanAddTable : true;

        this.Subscript         = (undefined != obj.Subscript)                      ? obj.Subscript : undefined;
        this.Superscript       = (undefined != obj.Superscript)                    ? obj.Superscript : undefined;
        this.SmallCaps         = (undefined != obj.SmallCaps)                      ? obj.SmallCaps : undefined;
        this.AllCaps           = (undefined != obj.AllCaps)                        ? obj.AllCaps : undefined;
        this.Strikeout         = (undefined != obj.Strikeout)                      ? obj.Strikeout : undefined;
        this.DStrikeout        = (undefined != obj.DStrikeout)                     ? obj.DStrikeout : undefined;
        this.TextSpacing       = (undefined != obj.TextSpacing)                    ? obj.TextSpacing : undefined;
        this.Position          = (undefined != obj.Position)                       ? obj.Position : undefined;
    }
    else {
        //ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
        //
        //    Ind :
        //    {
        //        Left      : 0,                    // Левый отступ
        //        Right     : 0,                    // Правый отступ
        //        FirstLine : 0                     // Первая строка
        //    },
        //
        //    Jc : align_Left,                      // Прилегание параграфа
        //
        //    KeepLines : false,                    // переносить параграф на новую страницу,
        //                                          // если на текущей он целиком не убирается
        //    KeepNext  : false,                    // переносить параграф вместе со следующим параграфом
        //
        //    PageBreakBefore : false,              // начинать параграф с новой страницы

        this.ContextualSpacing = undefined;
        this.Ind               = new asc_CParagraphInd();
        this.KeepLines         = undefined;
        this.KeepNext          = undefined;
        this.WidowControl      = undefined;
        this.PageBreakBefore   = undefined;
        this.Spacing           = new asc_CParagraphSpacing();
        this.Brd               = undefined;
        this.Shd               = undefined;
        this.Locked            = false;
        this.CanAddTable       = true;
        this.Tabs              = undefined;

        this.Subscript         = undefined;
        this.Superscript       = undefined;
        this.SmallCaps         = undefined;
        this.AllCaps           = undefined;
        this.Strikeout         = undefined;
        this.DStrikeout        = undefined;
        this.TextSpacing       = undefined;
        this.Position          = undefined;
    }
}

asc_CParagraphProperty.prototype = {

    asc_getContextualSpacing: function () { return this.ContextualSpacing; },
    asc_putContextualSpacing: function (v) { this.ContextualSpacing = v; },
    asc_getInd: function () { return this.Ind; },
    asc_putInd: function (v) { this.Ind = v; },
    asc_getKeepLines: function () { return this.KeepLines; },
    asc_putKeepLines: function (v) { this.KeepLines = v; },
    asc_getKeepNext: function () { return this.KeepNext; },
    asc_putKeepNext: function (v) { this.KeepNext = v; },
    asc_getPageBreakBefore: function (){ return this.PageBreakBefore; },
    asc_putPageBreakBefore: function (v){ this.PageBreakBefore = v; },
    asc_getWidowControl: function (){ return this.WidowControl; },
    asc_putWidowControl: function (v){ this.WidowControl = v; },
    asc_getSpacing: function () { return this.Spacing; },
    asc_putSpacing: function (v) { this.Spacing = v; },
    asc_getBorders: function () { return this.Brd; },
    asc_putBorders: function (v) { this.Brd = v; },
    asc_getShade: function () { return this.Shd; },
    asc_putShade: function (v) { this.Shd = v; },
    asc_getLocked: function() { return this.Locked; },
    asc_getCanAddTable: function() { return this.CanAddTable; },
    asc_getSubscript: function () { return this.Subscript; },
    asc_putSubscript: function (v) { this.Subscript = v; },
    asc_getSuperscript: function () { return this.Superscript; },
    asc_putSuperscript: function (v) { this.Superscript = v; },
    asc_getSmallCaps: function () { return this.SmallCaps; },
    asc_putSmallCaps: function (v) { this.SmallCaps = v; },
    asc_getAllCaps: function () { return this.AllCaps; },
    asc_putAllCaps: function (v) { this.AllCaps = v; },
    asc_getStrikeout: function () { return this.Strikeout; },
    asc_putStrikeout: function (v) { this.Strikeout = v; },
    asc_getDStrikeout: function () { return this.DStrikeout; },
    asc_putDStrikeout: function (v) { this.DStrikeout = v; },
    asc_getTextSpacing: function () { return this.TextSpacing; },
    asc_putTextSpacing: function (v) { this.TextSpacing = v; },
    asc_getPosition: function () { return this.Position; },
    asc_putPosition: function (v) { this.Position = v; },
    asc_getTabs: function () { return this.Tabs; },
    asc_putTabs: function (v) { this.Tabs = v; },
    asc_getDefaultTab: function () { return this.DefaultTab; },
    asc_putDefaultTab: function (v) { this.DefaultTab = v; }
};

//{ asc_CParagraphProperty export
window["Asc"].asc_CParagraphProperty = asc_CParagraphProperty;
window["Asc"]["asc_CParagraphProperty"] = asc_CParagraphProperty;
prot = asc_CParagraphProperty.prototype;

prot["asc_getContextualSpacing"] = prot.asc_getContextualSpacing;
prot["asc_putContextualSpacing"] = prot.asc_putContextualSpacing;
prot["asc_getInd"] = prot.asc_getInd;
prot["asc_putInd"] = prot.asc_putInd;
prot["asc_getKeepLines"] = prot.asc_getKeepLines;
prot["asc_putKeepLines"] = prot.asc_putKeepLines;
prot["asc_getKeepNext"] = prot.asc_getKeepNext;
prot["asc_putKeepNext"] = prot.asc_putKeepNext;
prot["asc_getPageBreakBefore"] = prot.asc_getPageBreakBefore;
prot["asc_putPageBreakBefore"] = prot.asc_putPageBreakBefore;
prot["asc_getWidowControl"] = prot.asc_getWidowControl;
prot["asc_putWidowControl"] = prot.asc_putWidowControl;
prot["asc_getSpacing"] = prot.asc_getSpacing;
prot["asc_putSpacing"] = prot.asc_putSpacing;
prot["asc_getBorders"] = prot.asc_getBorders;
prot["asc_putBorders"] = prot.asc_putBorders;
prot["asc_getShade"] = prot.asc_getShade;
prot["asc_putShade"] = prot.asc_putShade;
prot["asc_getLocked"] = prot.asc_getLocked;
prot["asc_getCanAddTable"] = prot.asc_getCanAddTable;
prot["asc_getSubscript"] = prot.asc_getSubscript;
prot["asc_putSubscript"] = prot.asc_putSubscript;
prot["asc_getSuperscript"] = prot.asc_getSuperscript;
prot["asc_putSuperscript"] = prot.asc_putSuperscript;
prot["asc_getSmallCaps"] = prot.asc_getSmallCaps;
prot["asc_putSmallCaps"] = prot.asc_putSmallCaps;
prot["asc_getAllCaps"] = prot.asc_getAllCaps;
prot["asc_putAllCaps"] = prot.asc_putAllCaps;
prot["asc_getStrikeout"] = prot.asc_getStrikeout;
prot["asc_putStrikeout"] = prot.asc_putStrikeout;
prot["asc_getDStrikeout"] = prot.asc_getDStrikeout;
prot["asc_putDStrikeout"] = prot.asc_putDStrikeout;
prot["asc_getTextSpacing"] = prot.asc_getTextSpacing;
prot["asc_putTextSpacing"] = prot.asc_putTextSpacing;
prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_putPosition"] = prot.asc_putPosition;
prot["asc_getTabs"] = prot.asc_getTabs;
prot["asc_putTabs"] = prot.asc_putTabs;
prot["asc_getDefaultTab"] = prot.asc_getDefaultTab;
prot["asc_putDefaultTab"] = prot.asc_putDefaultTab;
//}

//-----------------------------------------------------------------------------------
// CParagraphInd
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CParagraphInd(obj) {
    if (obj) {
        this.Left      = (undefined != obj.Left     ) ? obj.Left      : null; // Левый отступ
        this.Right     = (undefined != obj.Right    ) ? obj.Right     : null; // Правый отступ
        this.FirstLine = (undefined != obj.FirstLine) ? obj.FirstLine : null; // Первая строка
    }
    else {
        this.Left      = undefined; // Левый отступ
        this.Right     = undefined; // Правый отступ
        this.FirstLine = undefined; // Первая строка
    }
}

asc_CParagraphInd.prototype = {
    asc_getLeft: function () { return this.Left; },
    asc_putLeft: function (v) { this.Left = v; },
    asc_getRight: function () { return this.Right; },
    asc_putRight: function (v) { this.Right = v; },
    asc_getFirstLine: function () { return this.FirstLine; },
    asc_putFirstLine: function (v) { this.FirstLine = v; }
};

//{ asc_CParagraphInd export
window["Asc"].asc_CParagraphInd = asc_CParagraphInd;
window["Asc"]["asc_CParagraphInd"] = asc_CParagraphInd;
prot = asc_CParagraphInd.prototype;

prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
prot["asc_getFirstLine"] = prot.asc_getFirstLine;
prot["asc_getFirstLine"] = prot.asc_getFirstLine;
//}

//-----------------------------------------------------------------------------------
// CParagraphSpacing
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CParagraphSpacing(obj) {

    if (obj) {
        this.Line     = (undefined != obj.Line    ) ? obj.Line     : null; // Расстояние между строками внутри абзаца
        this.LineRule = (undefined != obj.LineRule) ? obj.LineRule : null; // Тип расстрояния между строками
        this.Before   = (undefined != obj.Before  ) ? obj.Before   : null; // Дополнительное расстояние до абзаца
        this.After    = (undefined != obj.After   ) ? obj.After    : null; // Дополнительное расстояние после абзаца
    }
    else {
        this.Line     = undefined; // Расстояние между строками внутри абзаца
        this.LineRule = undefined; // Тип расстрояния между строками
        this.Before   = undefined; // Дополнительное расстояние до абзаца
        this.After    = undefined; // Дополнительное расстояние после абзаца
    }
}

asc_CParagraphSpacing.prototype = {
    asc_getLine: function () { return this.Line; },
    asc_getLineRule: function () { return this.LineRule; },
    asc_getBefore: function () { return this.Before; },
    asc_getAfter: function () { return this.After; }
};

//{ asc_CParagraphSpacing export
window["Asc"].asc_CParagraphSpacing = asc_CParagraphSpacing;
window["Asc"]["asc_CParagraphSpacing"] = asc_CParagraphSpacing;
prot = asc_CParagraphSpacing.prototype;

prot["asc_getLine"] = prot.asc_getLine;
prot["asc_getLineRule"] = prot.asc_getLineRule;
prot["asc_getBefore"] = prot.asc_getBefore;
prot["asc_getAfter"] = prot.asc_getAfter;
//}

//-----------------------------------------------------------------------------------
// CParagraphShd
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CParagraphShd(obj) {

    if (obj) {
        this.Value = (undefined != obj.Value) ? obj.Value : null;
        this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom( obj.Color.r, obj.Color.g, obj.Color.b ) : null;
    }
    else {
        this.Value = shd_Nil;
        this.Color = CreateAscColorCustom(255, 255, 255);
    }
}

asc_CParagraphShd.prototype = {
    asc_getValue: function (){ return this.Value; },
    asc_putValue: function (v){ this.Value = v; },
    asc_getColor: function (){ return this.Color; },
    asc_putColor: function (v){ this.Color = (v) ? v : null; }
};

//{ asc_CParagraphShd export
window["Asc"].asc_CParagraphShd = asc_CParagraphShd;
window["Asc"]["asc_CParagraphShd"] = asc_CParagraphShd;
prot = asc_CParagraphShd.prototype;

prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
//}

//-----------------------------------------------------------------------------------
// CParagraphTab
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CParagraphTab(Pos, Value) {
    this.Pos   = Pos;
    this.Value = Value;
}

asc_CParagraphTab.prototype = {
    asc_getValue: function (){ return this.Value; },
    asc_putValue: function (v){ this.Value = v; },
    asc_getPos: function (){ return this.Pos; },
    asc_putPos: function (v){ this.Pos = v; }
};

//{ asc_CParagraphTab export
window["Asc"].asc_CParagraphTab = asc_CParagraphTab;
window["Asc"]["asc_CParagraphTab"] = asc_CParagraphTab;
prot = asc_CParagraphTab.prototype;

prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getPos"] = prot.asc_getPos;
prot["asc_putPos"] = prot.asc_putPos;
//}

//-----------------------------------------------------------------------------------
// CParagraphTabs
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CParagraphTabs(obj) {
    this.Tabs = [];

    if ( undefined != obj ) {
        var Count = obj.Tabs.length;
        for (var Index = 0; Index < Count; Index++)
        {
            this.Tabs.push( new asc_CParagraphTab(obj.Tabs[Index].Pos, obj.Tabs[Index].Value) );
        }
    }
}

asc_CParagraphTabs.prototype = {
    asc_getCount: function (){ return this.Tabs.length; },
    asc_getTab: function (Index){ return this.Tabs[Index]; },
    asc_addTab: function (Tab){ this.Tabs.push(Tab) },
    asc_clear: function (){ this.Tabs.length = 0; },
    add_Tab: function (Tab){ this.Tabs.push(Tab) }
};

//{ asc_CParagraphTabs export
window["Asc"].asc_CParagraphTabs = asc_CParagraphTabs;
window["Asc"]["asc_CParagraphTabs"] = asc_CParagraphTabs;
prot = asc_CParagraphTabs.prototype;

prot["asc_getCount"] = prot.asc_getCount;
prot["asc_getTab"] = prot.asc_getTab;
prot["asc_addTab"] = prot.asc_addTab;
prot["asc_clear"] = prot.asc_clear;
prot["add_Tab"] = prot.add_Tab;

//}

//-----------------------------------------------------------------------------------
// CParagraphBorders
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CParagraphBorders(obj) {

    if (obj) {
        this.Left = (undefined != obj.Left && null != obj.Left) ? new asc_CTextBorder (obj.Left) : null;
        this.Top = (undefined != obj.Top && null != obj.Top) ? new asc_CTextBorder (obj.Top) : null;
        this.Right = (undefined != obj.Right && null != obj.Right) ? new asc_CTextBorder (obj.Right) : null;
        this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new asc_CTextBorder (obj.Bottom) : null;
        this.Between = (undefined != obj.Between && null != obj.Between) ? new asc_CTextBorder (obj.Between) : null;
    }
    else {
        this.Left = null;
        this.Top = null;
        this.Right = null;
        this.Bottom = null;
        this.Between = null;
    }
}

asc_CParagraphBorders.prototype = {
    asc_getLeft: function(){return this.Left; },
    asc_putLeft: function(v){this.Left = (v) ? new asc_CTextBorder (v) : null;},
    asc_getTop: function(){return this.Top; },
    asc_putTop: function(v){this.Top = (v) ? new asc_CTextBorder (v) : null;},
    asc_getRight: function(){return this.Right; },
    asc_putRight: function(v){this.Right = (v) ? new asc_CTextBorder (v) : null;},
    asc_getBottom: function(){return this.Bottom; },
    asc_putBottom: function(v){this.Bottom = (v) ? new asc_CTextBorder (v) : null;},
    asc_getBetween: function(){return this.Between; },
    asc_putBetween: function(v){this.Between = (v) ? new asc_CTextBorder (v) : null;}
};

//{ asc_CParagraphBorders export
window["Asc"].asc_CParagraphBorders = asc_CParagraphBorders;
window["Asc"]["asc_CParagraphBorders"] = asc_CParagraphBorders;
prot = asc_CParagraphBorders.prototype;

prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getTop"] = prot.asc_getTop;
prot["asc_putTop"] = prot.asc_putTop;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
prot["asc_getBottom"] = prot.asc_getBottom;
prot["asc_putBottom"] = prot.asc_putBottom;
prot["asc_getBetween"] = prot.asc_getBetween;
prot["asc_putBetween"] = prot.asc_putBetween;
//}

//-----------------------------------------------------------------------------------
// CBorder
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CTextBorder(obj) {

    if (obj) {
        this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustomEx(obj.Color.r, obj.Color.g, obj.Color.b) : null;
        this.Size = (undefined != obj.Size) ? obj.Size : null;
        this.Value = (undefined != obj.Value) ? obj.Value : null;
        this.Space = (undefined != obj.Space) ? obj.Space : null;
    }
    else {
        this.Color = CreateAscColorCustomEx(0,0,0);
        this.Size  = 0.5 * g_dKoef_pt_to_mm;
        this.Value = border_Single;
        this.Space = 0;
    }
}

asc_CTextBorder.prototype = {
    asc_getColor: function(){return this.Color; },
    asc_putColor: function(v){this.Color = v;},
    asc_getSize: function(){return this.Size; },
    asc_putSize: function(v){this.Size = v;},
    asc_getValue: function(){return this.Value; },
    asc_putValue: function(v){this.Value = v;},
    asc_getSpace: function(){return this.Space; },
    asc_putSpace: function(v){this.Space = v;},
    asc_getForSelectedCells: function(){return this.ForSelectedCells; },
    asc_putForSelectedCells: function(v){this.ForSelectedCells = v;}
};

//{ asc_CTextBorder export
window["Asc"].asc_CTextBorder = asc_CTextBorder;
window["Asc"]["asc_CTextBorder"] = asc_CTextBorder;
prot = asc_CTextBorder.prototype;

prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
prot["asc_getSize"] = prot.asc_getSize;
prot["asc_putSize"] = prot.asc_putSize;
prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getSpace"] = prot.asc_getSpace;
prot["asc_putSpace"] = prot.asc_putSpace;
prot["asc_getForSelectedCells"] = prot.asc_getForSelectedCells;
prot["asc_putForSelectedCells"] = prot.asc_putForSelectedCells;
//}

//-----------------------------------------------------------------------------------
// CListType
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CListType(obj) {

    if (obj) {
        this.Type = (undefined == obj.Type) ? null : obj.Type;
        this.SubType = (undefined == obj.Type) ? null : obj.SubType;
    }
    else {
        this.Type = null;
        this.SubType = null;
    }
}

asc_CListType.prototype = {
    asc_getListType: function() { return this.Type; },
    asc_getListSubType: function() { return this.SubType; }
};

//{ asc_CListType export
window["Asc"].asc_CListType = asc_CListType;
window["Asc"]["asc_CListType"] = asc_CListType;
prot = asc_CListType.prototype;

prot["asc_getListType"] = prot.asc_getListType;
prot["asc_getListSubType"] = prot.asc_getListSubType;
//}

//-----------------------------------------------------------------------------------
// CTextFontFamily
//-----------------------------------------------------------------------------------
/** @constructor */
function asc_CTextFontFamily(obj) {

    if (obj) {
        this.Name = (undefined != obj.Name) ? obj.Name : null; 		// "Times New Roman"
        this.Index = (undefined != obj.Index) ? obj.Index : null;	// -1
    }
    else {
        this.Name = "Times New Roman";
        this.Index = -1;
    }
}

asc_CTextFontFamily.prototype = {
    asc_getName: function () { return this.Name; },
    asc_getIndex: function () { return this.Index; }
};

//{ asc_CTextFontFamily export
window["Asc"].asc_CTextFontFamily = asc_CTextFontFamily;
window["Asc"]["asc_CTextFontFamily"] = asc_CTextFontFamily;
prot = asc_CTextFontFamily.prototype;

prot["asc_getName"] = prot.asc_getName;
prot["asc_getIndex"] = prot.asc_getIndex;
//}

//}

//-----------------------------------------------------------------------------------
// Manager
//-----------------------------------------------------------------------------------


function CChangeTableData(changedRange, added, hided, removed)
{
    this.changedRange = changedRange;
    this.added = added;
    this.hided = hided;
    this.removed = removed;
}

function GraphicOption(ws, type, range, aId) {
    var _this = this;

    var asc = window["Asc"];
    var asc_Range = asc.Range;

    _this.ws = ws;
    _this.type = type;
    _this.range = range;
    _this.aId = [];
    if ( aId && Array.isArray(aId) )
        _this.aId = aId.concat();

    function checkCol(col) {
        while ( (col > 0) && !_this.ws.cols[col] )
            _this.ws.expandColsOnScroll(true);
    }

    function checkRow(row) {
        while ( (row > 0) && !_this.ws.rows[row] )
            _this.ws.expandRowsOnScroll(true);
    }

    _this.isScrollType = function() {
        return ( (_this.type === c_oAscGraphicOption.ScrollVertical) || (_this.type === c_oAscGraphicOption.ScrollHorizontal) );
    };

    _this.getUpdatedRange = function() {

        var vr = new asc_Range(_this.ws.getFirstVisibleCol(true), _this.ws.getFirstVisibleRow(true), _this.ws.visibleRange.c2, _this.ws.visibleRange.r2);

        //var vr = _this.ws.visibleRange.clone();
        if ( _this.isScrollType() && !range )
            return vr;

        switch (_this.type) {
            case c_oAscGraphicOption.ScrollVertical:
            case c_oAscGraphicOption.ScrollHorizontal: {
                vr = range.clone();
                checkCol(++vr.c2);
                checkRow(++vr.r2);
            }
                break;

            case c_oAscGraphicOption.AddText: {
                if ( _this.ws ) {
                    var controller = _this.ws.objectRender.controller;
                    var selectedObjects = controller.selectedObjects;

                    if ( selectedObjects.length === 1 ) {
                        if ( selectedObjects[0].isGroup() ) {
                            var groupSelectedObjects = selectedObjects[0].selectedObjects;
                            if ( groupSelectedObjects.length === 1 ) {
                                var checker = _this.ws.objectRender.getBoundsChecker(groupSelectedObjects[0]);
                                var coords = _this.ws.objectRender.getBoundsCheckerCoords(checker);
                                if ( coords ) {
                                    vr.c1 = Math.max(coords.from.col, vr.c1);
                                    vr.r1 = Math.max(coords.from.row, vr.r1);

                                    checkCol(coords.to.col + 1);
                                    vr.c2 = Math.min(coords.to.col + 1, vr.c2);

                                    checkRow(coords.to.row + 1);
                                    vr.r2 = Math.min(coords.to.row + 1, vr.r2);
                                }
                            }
                        }
                        else {
                            var drawingObject = selectedObjects[0].drawingBase;
                            var checker = _this.ws.objectRender.getBoundsChecker(drawingObject.graphicObject);
                            var coords = _this.ws.objectRender.getBoundsCheckerCoords(checker);
                            if ( coords ) {
                                vr.c1 = Math.max(coords.from.col, vr.c1);
                                vr.r1 = Math.max(coords.from.row, vr.r1);

                                checkCol(coords.to.col + 1);
                                vr.c2 = Math.min(coords.to.col + 1, vr.c2);

                                checkRow(coords.to.row + 1);
                                vr.r2 = Math.min(coords.to.row + 1, vr.r2);
                            }
                        }
                    }
                }
            }
                break;
        }
        return vr;
    }
}

function Exception(error) {
    var err = error;
}

function DrawingObjects() {

    //-----------------------------------------------------------------------------------
    // Scroll offset
    //-----------------------------------------------------------------------------------

    var ScrollOffset = function() {

        this.getX = function() {
            return -ptToPx((worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft)) + worksheet.getCellLeft(0, 0);
        };

        this.getY = function() {
            return -ptToPx((worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop)) + worksheet.getCellTop(0, 0);
        }
    };

    //-----------------------------------------------------------------------------------
    // Private
    //-----------------------------------------------------------------------------------

    var _this = this;
    var asc = window["Asc"];
    var api = asc["editor"];
    var worksheet = null;
    var asc_Range = asc.Range;
    var asc_applyFunction = asc.applyFunction;

    var chartRender = null;
    if ( typeof ChartRender !== "undefined" )
        chartRender = new ChartRender();

    var isInit = false;
    var drawingCtx = null;
    var overlayCtx = null;
    var shapeCtx = null;
    var shapeOverlayCtx = null;

    var trackOverlay = null;
    var autoShapeTrack = null;
    var scrollOffset = new ScrollOffset();

    var aObjects = null;
    var aImagesSync = null;
    var aObjectsSync = null;
    var aBoundsCheckers = [];

    var userId = null;
    var documentId = null;

    _this.zoom = { last: 1, current: 1 };
    _this.isViewerMode = null;
    _this.objectLocker = null;
    _this.drawingArea = null;
    _this.coordsManager = null;
    _this.drawingDocument = null;
    _this.asyncImageEndLoaded = null;
    _this.asyncImagesDocumentEndLoaded = null;

    var wsCellCache = { cols: null, rows: null, isInit: false };

    // Task timer
    var aDrawTasks = [];
    var drawTaskTimerId = null;

    function drawTaskFunction() {

        // При скролах нужно выполнить все задачи

        var taskLen = aDrawTasks.length;
        if ( taskLen ) {
            var lastTask = aDrawTasks[taskLen - 1];
            _this.showDrawingObjectsEx(lastTask.params.clearCanvas, lastTask.params.graphicOption, lastTask.params.printOptions);
            aDrawTasks.splice(0, (taskLen - 1 > 0) ? taskLen - 1 : 1);
        }
    }

    //-----------------------------------------------------------------------------------
    // Create drawing
    //-----------------------------------------------------------------------------------

    function DrawingBase(ws) {

        var _t = this;
        _t.worksheet = ws;

        _t.imageUrl = "";
        _t.Type = c_oAscCellAnchorType.cellanchorTwoCell;
        _t.Pos = { X: 0, Y: 0 };

        _t.from = new CCellObjectInfo();
        _t.to = new CCellObjectInfo();
        _t.ext = { cx: 0, cy: 0 };
        _t.size = { width: 0, height: 0 };

        _t.graphicObject = null; // CImage, CShape, GroupShape or CChartAsGroup

        _t.flags = {
            anchorUpdated: false,
            lockState: c_oAscLockTypes.kLockTypeNone
        };
    }

    //{ prototype
    DrawingBase.prototype.getAllFonts = function(AllFonts) {
        var _t = this;
        _t.graphicObject && _t.graphicObject.documentGetAllFontNames && _t.graphicObject.documentGetAllFontNames(AllFonts);
    };

    DrawingBase.prototype.isImage = function() {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isImage() : false;
    };

    DrawingBase.prototype.isShape = function() {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isShape() : false;
    };

    DrawingBase.prototype.isGroup = function() {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isGroup() : false;
    };

    DrawingBase.prototype.isChart = function() {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isChart() : false;
    };

    DrawingBase.prototype.isGraphicObject = function() {
        var _t = this;
        return _t.graphicObject != null;
    };

    DrawingBase.prototype.isLocked = function() {
        var _t = this;
        return ( (_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeNone) && (_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeMine) )
    };

    DrawingBase.prototype.getWorkbook = function() {
        var _t = this;
        return (_t.worksheet ? _t.worksheet.model.workbook : null);
    };

    DrawingBase.prototype.getCanvasContext = function() {
        return _this.drawingDocument.CanvasHitContext;
    };

    // GraphicObject: x, y, extX, extY
    DrawingBase.prototype.getGraphicObjectMetrics = function() {
        var _t = this;
        var metrics = { x: 0, y: 0, extX: 0, extY: 0 };

        var coordsFrom = _this.coordsManager.calculateCoords(_t.from);
        metrics.x = pxToMm( coordsFrom.x );
        metrics.y = pxToMm( coordsFrom.y );

        var coordsTo = _this.coordsManager.calculateCoords(_t.to);
        metrics.extX = pxToMm( coordsTo.x - coordsFrom.x );
        metrics.extY = pxToMm( coordsTo.y - coordsFrom.y );

        return metrics;
    };

    // Считаем From/To исходя из graphicObject
    DrawingBase.prototype.setGraphicObjectCoords = function() {
        var _t = this;

       /* var leftTop = worksheet.getCellsOffset(1), _x, _y, col, row, offsets;
        _x = mmToPt(_t.graphicObject.x) + leftTop.left;
        _y = mmToPt(_t.graphicObject.y) + leftTop.top;
        offsets = _this.drawingArea.getOffsets(ptToPx(_x), ptToPx(_y));
        col = _t.getColUnderCursor(_x - pxToPt(offsets.x) + leftTop.left);
        row = _t.getRowUnderCursor(_y - pxToPt(offsets.y) + leftTop.top);
        _t.from.col = col.col;
        _t.from.colOff = ptToMm(_x - col.left);
        _t.from.row = row.row;
        _t.from.rowOff = ptToMm(_y - row.top);

        _x = mmToPt(_t.graphicObject.x + _t.graphicObject.extX) + leftTop.left;
        _y = mmToPt(_t.graphicObject.y + _t.graphicObject.extY) + leftTop.top;
        offsets = _this.drawingArea.getOffsets(ptToPx(_x), ptToPx(_y));
        col = _t.getColUnderCursor(_x - pxToPt(offsets.x) + leftTop.left);
        row = _t.getRowUnderCursor(_y - pxToPt(offsets.y) + leftTop.top);
        _t.to.col = col.col;
        _t.to.colOff = ptToMm(_x - col.left);
        _t.to.row = row.row;
        _t.to.rowOff = ptToMm(_y - row.top);
        return;        */
        if ( _t.isGraphicObject() ) {

            if ( (_t.graphicObject.x < 0) || (_t.graphicObject.y < 0) || (_t.graphicObject.extX <= 0) || (_t.graphicObject.extY <= 0) )
                return;

        //////var fromCell = _this.coordsManager.calculateCell( mmToPx(_t.graphicObject.x), mmToPx(_t.graphicObject.y) );
        //////var toCell = _this.coordsManager.calculateCell( mmToPx(_t.graphicObject.x + _t.graphicObject.extX), mmToPx(_t.graphicObject.y + _t.graphicObject.extY) );
        //var leftTop = _t.worksheet.getCellsOffset(0);
        //var fromCell = _this.drawingArea.calculateCell(leftTop.left +  mmToPx(_t.graphicObject.x),leftTop.top +  mmToPx(_t.graphicObject.y) );
        //var toCell = _this.drawingArea.calculateCell(leftTop.left +  mmToPx(_t.graphicObject.x + _t.graphicObject.extX), leftTop.top + mmToPx(_t.graphicObject.y + _t.graphicObject.extY) );
        //
        //ar _x = mmToPt(_t.graphicObject.x) + leftTop.left;
        //ar _y = mmToPt(_t.graphicObject.y) + leftTop.top;
        //ar offsets = _this.drawingArea.getOffsets(ptToPx(_x), ptToPx(_y));
        //ar col = _t.getColUnderCursor(_x - pxToPt(offsets.x) + leftTop.left);
        //ar row = _t.getRowUnderCursor(_y - pxToPt(offsets.y) + leftTop.top);
        //_t.from.col = col.col;
        //_t.from.colOff = ptToMm(_x - col.left);
        //_t.from.row = row.row;
        //_t.from.rowOff = ptToMm(_y - row.top);
        //
        //_t.from.col = fromCell.col;
        //_t.from.colOff = fromCell.colOff;
        //_t.from.row = fromCell.row;
        //_t.from.rowOff = fromCell.rowOff;
        //
        //_t.to.col = toCell.col;
        //_t.to.colOff = toCell.colOff;
        //_t.to.row = toCell.row;
        //_t.to.rowOff = toCell.rowOff;

            var fromCell = worksheet. findCellByXY(mmToPt(_t.graphicObject.x), mmToPt(_t.graphicObject.y));//_this.drawingArea.calculateCell( mmToPx(_t.graphicObject.x), mmToPx(_t.graphicObject.y) );
            var toCell =   worksheet. findCellByXY(mmToPt(_t.graphicObject.x + _t.graphicObject.extX), mmToPt(_t.graphicObject.y + _t.graphicObject.extY));

            _t.from.col = fromCell.col;
            _t.from.colOff = ptToMm(fromCell.colOff);
            _t.from.row = fromCell.row;
            _t.from.rowOff = ptToMm(fromCell.rowOff);

            _t.to.col = toCell.col;
            _t.to.colOff = ptToMm(toCell.colOff);
            _t.to.row = toCell.row;
            _t.to.rowOff = ptToMm(toCell.rowOff);
        }
    };

    // Проверяет выход за границы
    DrawingBase.prototype.inVisibleArea = function(scrollType) {
        var _t = this;
        var result = true;
        var fvc, fvr, lvc, lvr;

        var checker = _this.getBoundsChecker(_t.graphicObject);
        var coords = _this.getBoundsCheckerCoords(checker);
        if ( coords ) {
            if ( scrollType ) {
                var updatedRange = scrollType.getUpdatedRange();
                fvc = updatedRange.c1;
                fvr = updatedRange.r1;
                lvc = updatedRange.c2;
                lvr = updatedRange.r2;
            }
            else {
                fvc = _t.worksheet.getFirstVisibleCol(true);
                fvr = _t.worksheet.getFirstVisibleRow(true);
                lvc = _t.worksheet.getLastVisibleCol();
                lvr = _t.worksheet.getLastVisibleRow();

            }
            if ( (fvr >= coords.to.row + 1) || (lvr <= coords.from.row - 1) || (fvc >= coords.to.col + 1) || (lvc <= coords.from.col - 1) )
                result = false;
        }

        return result;
    };

    DrawingBase.prototype.calculateCell = function(x, y)//pix
    {

    };

    DrawingBase.prototype.getColUnderCursor = function(x)
    {
        var col = worksheet._findColUnderCursor(x, true);
        while(!col)
        {
            if ( worksheet.cols.length >= gc_nMaxCol ) {
               return null;
            }
            worksheet.expandColsOnScroll(true);
            col = worksheet._findColUnderCursor(x, true);
        }
        return col;
    };


    DrawingBase.prototype.getRowUnderCursor = function(y)
    {
        var row = worksheet._findRowUnderCursor(y, true);
        while(!row)
        {
            if ( worksheet.rows.length >= gc_nMaxRow ) {
                return null;
            }
            worksheet.expandRowsOnScroll(true);
            row = worksheet._findRowUnderCursor(y, true);
        }
        return row;
    };

    DrawingBase.prototype.updateAnchorPosition = function() {
        var _t = this;

        var leftTop = worksheet.getCellsOffset(1), _x, _y, col, row, offsets;
        switch(_t.Type)
        {
            case c_oAscCellAnchorType.cellanchorOneCell:
            {
                _x = mmToPt(_t.graphicObject.x + _t.graphicObject.extX) + leftTop.left;
                _y = mmToPt(_t.graphicObject.y + _t.graphicObject.extY) + leftTop.top;
                offsets = _this.drawingArea.getOffsets(ptToPx(_x), ptToPx(_y));
                col = _t.getColUnderCursor(_x - pxToPt(offsets.x)+ leftTop.left);
                row = _t.getRowUnderCursor(_y - pxToPt(offsets.y)+ leftTop.top);
                _t.to.col = col.col;
                _t.to.colOff = ptToMm(_x - col.left);
                _t.to.row = row.row;
                _t.to.rowOff = ptToMm(_y - row.top);
                break;
            }

            case c_oAscCellAnchorType.cellanchorAbsolute:
            {
                _t.Pos.X = _t.graphicObject.x;
                _t.Pos.Y = _t.graphicObject.y;
                break;
            }
            case c_oAscCellAnchorType.cellanchorTwoCell:
            {
                _x = mmToPt(_t.graphicObject.x) + leftTop.left;
                _y = mmToPt(_t.graphicObject.y) + leftTop.top;
                offsets = _this.drawingArea.getOffsets(ptToPx(_x), ptToPx(_y));
                col = _t.getColUnderCursor(_x - pxToPt(offsets.x) + leftTop.left);
                row = _t.getRowUnderCursor(_y - pxToPt(offsets.y) + leftTop.top);
                _t.from.col = col.col;
                _t.from.colOff = ptToMm(_x - col.left);
                _t.from.row = row.row;
                _t.from.rowOff = ptToMm(_y - row.top);

                _x = mmToPt(_t.graphicObject.x + _t.graphicObject.extX) + leftTop.left;
                _y = mmToPt(_t.graphicObject.y + _t.graphicObject.extY) + leftTop.top;
                offsets = _this.drawingArea.getOffsets(ptToPx(_x), ptToPx(_y));
                col = _t.getColUnderCursor(_x - pxToPt(offsets.x) + leftTop.left);
                row = _t.getRowUnderCursor(_y - pxToPt(offsets.y) + leftTop.top);
                _t.to.col = col.col;
                _t.to.colOff = ptToMm(_x - col.left);
                _t.to.row = row.row;
                _t.to.rowOff = ptToMm(_y - row.top);
                break;
            }
        }
        _t.flags.anchorUpdated = true;
    };

    // Реальное смещение по высоте
    DrawingBase.prototype.getRealTopOffset = function() {
        var _t = this;
        var val = _t.worksheet.getCellTop(_t.from.row, 0) + mmToPx(_t.from.rowOff);
        return asc.round(val);
    };

    // Реальное смещение по ширине
    DrawingBase.prototype.getRealLeftOffset = function() {
        var _t = this;
        var val = _t.worksheet.getCellLeft(_t.from.col, 0) + mmToPx(_t.from.colOff);
        return asc.round(val);
    };

    // Ширина по координатам
    DrawingBase.prototype.getWidthFromTo = function() {
        var _t = this;
        var val = _t.worksheet.getCellLeft(_t.to.col, 0) + mmToPx(_t.to.colOff) - _t.worksheet.getCellLeft(_t.from.col, 0) - mmToPx(_t.from.colOff);
        return val;
    };

    // Высота по координатам
    DrawingBase.prototype.getHeightFromTo = function() {
        var _t = this;
        var val = _t.worksheet.getCellTop(_t.to.row, 0) + mmToPx(_t.to.rowOff) - _t.worksheet.getCellTop(_t.from.row, 0) - mmToPx(_t.from.rowOff);
        return val;
    };

    // Видимое смещение объекта от первой видимой строки
    DrawingBase.prototype.getVisibleTopOffset = function(withHeader) {
        var _t = this;
        var headerRowOff = _t.worksheet.getCellTop(0, 0);
        var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(true), 0);
        var off = _t.getRealTopOffset() - fvr;
        var off = (off > 0) ? off : 0;
        return withHeader ? headerRowOff + off : off;
    };

    // Видимое смещение объекта от первой видимой колонки
    DrawingBase.prototype.getVisibleLeftOffset = function(withHeader) {
        var _t = this;
        var headerColOff = _t.worksheet.getCellLeft(0, 0);
        var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(true), 0);
        var off = _t.getRealLeftOffset() - fvc;
        var off = (off > 0) ? off : 0;
        return withHeader ? headerColOff + off : off;
    };

    // смещение по высоте внутри объекта
    DrawingBase.prototype.getInnerOffsetTop = function() {
        var _t = this;
        var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(true), 0);
        var off = _t.getRealTopOffset() - fvr;
        return (off > 0) ? 0 : asc.round( Math.abs(off) );
    };

    // смещение по ширине внутри объекта
    DrawingBase.prototype.getInnerOffsetLeft = function() {
        var _t = this;
        var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(true), 0);
        var off = _t.getRealLeftOffset() - fvc;
        return (off > 0) ? 0 : asc.round( Math.abs(off) );
    };

    DrawingBase.prototype.getDrawingObjects = function() {
        return _this;
    };

    //}

    //-----------------------------------------------------------------------------------
    // Constructor
    //-----------------------------------------------------------------------------------

    _this.createDrawingObject = function() {
        return new DrawingBase(worksheet);
    };

    _this.cloneDrawingObject = function(object) {

        var copyObject = _this.createDrawingObject();

        copyObject.Type = object.Type;
        copyObject.Pos.X = object.Pos.X;
        copyObject.Pos.Y = object.Pos.Y;
        copyObject.ext.cx = object.ext.cx;
        copyObject.ext.cy = object.ext.cy;

        copyObject.from.col = object.from.col;
        copyObject.from.colOff = object.from.colOff;
        copyObject.from.row = object.from.row;
        copyObject.from.rowOff = object.from.rowOff;

        copyObject.to.col = object.to.col;
        copyObject.to.colOff = object.to.colOff;
        copyObject.to.row = object.to.row;
        copyObject.to.rowOff = object.to.rowOff;

        copyObject.graphicObject = object.graphicObject;
        return copyObject;
    };

    //-----------------------------------------------------------------------------------
    // Public methods
    //-----------------------------------------------------------------------------------

    _this.init = function(currentSheet) {

        var taskTimerId = setInterval(drawTaskFunction, 5);

        var api = window["Asc"]["editor"];
        userId = api.User.asc_getId();
        documentId = api.documentId;
        worksheet = currentSheet;

        drawingCtx = currentSheet.drawingGraphicCtx;
        overlayCtx = currentSheet.overlayGraphicCtx;
        shapeCtx = currentSheet.shapeCtx;
        shapeOverlayCtx = currentSheet.shapeOverlayCtx;

        trackOverlay = new COverlay();
        trackOverlay.init( shapeOverlayCtx.m_oContext, "ws-canvas-graphic-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );

        autoShapeTrack = new CAutoshapeTrack();
        autoShapeTrack.init( trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
        shapeCtx.m_oAutoShapesTrack = autoShapeTrack;


        _this.objectLocker = new ObjectLocker(worksheet);
        _this.drawingArea = currentSheet.drawingArea;
        _this.drawingArea.init();
        _this.coordsManager = new CoordsManager(worksheet, true);
        _this.drawingDocument = currentSheet.model.DrawingDocument ? currentSheet.model.DrawingDocument : new CDrawingDocument(this);
        _this.drawingDocument.drawingObjects = this;
        _this.drawingDocument.AutoShapesTrack = autoShapeTrack;
        _this.drawingDocument.TargetHtmlElement = document.getElementById('id_target_cursor');
        _this.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
        _this.controller = new DrawingObjectsController(_this);

        _this.isViewerMode = function() { return worksheet.handlers.trigger("getViewerMode"); };

        aObjects = [];
        aImagesSync = [];
        aObjectsSync = [];

        isInit = false;
        var theme = api.wbModel.theme;
        aObjects = currentSheet.model.Drawings;
        for (var i = 0; currentSheet.model.Drawings && (i < currentSheet.model.Drawings.length); i++)
        {
            aObjects[i] = _this.cloneDrawingObject(aObjects[i]);
            var drawingObject = aObjects[i];
            // Check drawing area
            drawingObject.drawingArea = _this.drawingArea;
            drawingObject.worksheet = currentSheet;
            if ( !worksheet.cols[drawingObject.to.col] ) {
                while ( !worksheet.cols[drawingObject.to.col] ) {
                    worksheet.expandColsOnScroll(true);
                }
                worksheet.expandColsOnScroll(true); 	// для colOff
            }
            if ( !worksheet.rows[drawingObject.to.row] ) {
                while ( !worksheet.rows[drawingObject.to.row] ) {
                    worksheet.expandRowsOnScroll(true);
                }
                worksheet.expandRowsOnScroll(true); 	// для rowOff
            }
            var metrics = drawingObject.getGraphicObjectMetrics();
            CheckSpPrXfrm(drawingObject.graphicObject);
            drawingObject.graphicObject.spPr.xfrm.setOffX(metrics.x);
            drawingObject.graphicObject.spPr.xfrm.setOffY(metrics.y);
            if(drawingObject.graphicObject.getObjectType() !== historyitem_type_GroupShape)
            {
                drawingObject.graphicObject.spPr.xfrm.setExtX(metrics.extX);
                drawingObject.graphicObject.spPr.xfrm.setExtY(metrics.extY);
                //drawingObject.graphicObject.spPr.xfrm.setChOffX(0);
                //drawingObject.graphicObject.spPr.xfrm.setChOffY(0);
                //drawingObject.graphicObject.spPr.xfrm.setChExtX(metrics.extX);
                //drawingObject.graphicObject.spPr.xfrm.setChExtY(metrics.extY);
            }

            drawingObject.graphicObject.drawingBase = aObjects[i];
            drawingObject.graphicObject.drawingObjects = _this;
            drawingObject.graphicObject.getAllRasterImages(aImagesSync);
        }
        this.recalculate(true);
        for(i = 0; i < aImagesSync.length; ++i)
        {
            aImagesSync[i] = getFullImageSrc(aImagesSync[i]);
        }

        for (var i = 0; i < currentSheet.model.Drawings.length; ++i)
        {
            var boundsChecker = _this.getBoundsChecker(drawingObject.graphicObject);
            aBoundsCheckers.push(boundsChecker);
        }

        // Загружаем все картинки листа
        _this.asyncImagesDocumentEndLoaded = function() {
            _this.showDrawingObjects(true);
        };

        if(aImagesSync.length > 0)
            api.ImageLoader.LoadDocumentImages(aImagesSync, null, _this.asyncImagesDocumentEndLoaded);

        // Upload event
        if (window.addEventListener) {
            window.addEventListener("message", _this._uploadMessage, false);
        }

        _this.shiftMap = {};
        worksheet.model.Drawings = aObjects;
        isInit = true;
    };

    _this.recalculate =  function(all)
    {
        _this.controller.recalculate(all);
    };

    _this.preCopy = function() {
        _this.shiftMap = {};
        var selected_objects = _this.controller.selectedObjects;
        if(selected_objects.length > 0)
        {
            var min_x, min_y;
            min_x = selected_objects[0].x;
            min_y = selected_objects[0].y;
            for(var i = 1; i < selected_objects.length; ++i)
            {
                if(selected_objects[i].x < min_x)
                    min_x = selected_objects[i].x;

                if(selected_objects[i].y < min_y)
                    min_y = selected_objects[i].y;
            }
            for(var i = 0; i < selected_objects.length; ++i)
            {
                _this.shiftMap[selected_objects[i].Get_Id()] = {x: selected_objects[i].x - min_x, y: selected_objects[i].y - min_y};
            }
        }

    };

    _this.getAllFonts = function(AllFonts) {

    };

    _this.getChartRender = function() {
        return chartRender;
    };

    _this.getOverlay = function() {
        return trackOverlay;
    };

    _this.OnUpdateOverlay = function() {
        _this.drawingArea.drawSelection(_this.drawingDocument);
    };

    _this.changeZoom = function(factor) {

        _this.zoom.last = _this.zoom.current;
        _this.zoom.current = factor;

        _this.resizeCanvas();
        _this.setScrollOffset();
        _this.rebuildChartGraphicObjects();
    };

    _this.resizeCanvas = function() {
		_this.drawingArea.init();

        shapeCtx.init( drawingCtx.ctx, drawingCtx.getWidth(0), drawingCtx.getHeight(0), drawingCtx.getWidth(3), drawingCtx.getHeight(3) );
        shapeCtx.CalculateFullTransform();

        shapeOverlayCtx.init( overlayCtx.ctx, overlayCtx.getWidth(0), overlayCtx.getHeight(0), overlayCtx.getWidth(3), overlayCtx.getHeight(3) );
        shapeOverlayCtx.CalculateFullTransform();

        trackOverlay.init( shapeOverlayCtx.m_oContext, "ws-canvas-graphic-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
        autoShapeTrack.init( trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
        autoShapeTrack.Graphics.CalculateFullTransform();
    };

    _this.getWorkbook = function() {
        return (worksheet ? worksheet.model.workbook : null);
    };

    _this.getCanvasContext = function() {
        return _this.drawingDocument.CanvasHitContext;
    };

    _this.getDrawingObjects = function() {
        return aObjects;
    };

    _this.getWorksheet = function() {
        return worksheet;
    };

	_this.getContextWidth = function () {
		return drawingCtx.getWidth();
	};
	_this.getContextHeight = function () {
		return drawingCtx.getHeight();
	};

    _this.getWorksheetModel = function() {
        return worksheet.model;
    };

    _this._uploadMessage = function(event) {
        if ( null != event && null != event.data ) {
            try {
                var data = JSON.parse(event.data);
                if ((null != data) && (null != data["type"]))
                {
                    if (PostMessageType.UploadImage == data["type"]) {
                        if (c_oAscServerError.NoError == data["error"]) {
                            var sheetId = null;
                            if (null != data["input"])
                                sheetId = data["input"]["sheetId"];
                            var urls = data["urls"];

                            if (urls && urls.length > 0 && sheetId == worksheet.model.getId()) {
                                var url = urls[0];
                                if ( api.isImageChangeUrl || api.isShapeImageChangeUrl )
                                    _this.editImageDrawingObject(url);
                                else
                                    _this.addImageDrawingObject(url, null);
                            }
                            else
                                worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                        }
                        else {
                            worksheet.model.workbook.handlers.trigger("asc_onError", api.asc_mapAscServerErrorToAscError(data["error"]), c_oAscError.Level.NoCritical);
                            worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                        }
                    }
                }
            }
            catch(e) {
                var msg = e.message;
            }
        }
    };

    _this.callTrigger = function(triggerName, param) {
        if ( triggerName )
            worksheet.model.workbook.handlers.trigger(triggerName, param);
    };

    _this.getBoundsChecker = function(graphicObject) {
        if ( graphicObject ) {
            // Коррекция для селекта при блокировке
            var delta = 4;
            var boundsChecker = new  CSlideBoundsChecker();
            boundsChecker.objectId = graphicObject.Id;

            if ( graphicObject.bounds ) {
                boundsChecker.Bounds.min_x = Math.max(1, graphicObject.bounds.x - delta);
                boundsChecker.Bounds.min_y = Math.max(1, graphicObject.bounds.y - delta);
                boundsChecker.Bounds.max_x = graphicObject.bounds.x + graphicObject.bounds.w + delta;
                boundsChecker.Bounds.max_y = graphicObject.bounds.y + graphicObject.bounds.h + delta;
            }
            else {
                boundsChecker.init(1, 1, 1, 1);
                boundsChecker.transform3(graphicObject.transform);
                boundsChecker.rect(0,0, graphicObject.extX, graphicObject.extY);
                graphicObject.draw(boundsChecker);
                boundsChecker.CorrectBounds();
                boundsChecker.Bounds.min_x = Math.max(1, boundsChecker.Bounds.min_x - delta);
                boundsChecker.Bounds.min_y = Math.max(1, boundsChecker.Bounds.min_y - delta);
                boundsChecker.Bounds.max_x += delta;
                boundsChecker.Bounds.max_y += delta;
            }

            return boundsChecker;
        }
        return null;
    };

    _this.getBoundsCheckerCoords = function(checker) {

        if ( checker ) {
            var coords = { from: null, to: null };

            //coords.from = _this.coordsManager.calculateCell( mmToPx(checker.Bounds.min_x), mmToPx(checker.Bounds.min_y) );
            //coords.to = _this.coordsManager.calculateCell( mmToPx(checker.Bounds.max_x), mmToPx(checker.Bounds.max_y) );

            coords.from = _this.drawingArea.calculateCell( mmToPx(checker.Bounds.min_x), mmToPx(checker.Bounds.min_y) );
            coords.to = _this.drawingArea.calculateCell( mmToPx(checker.Bounds.max_x), mmToPx(checker.Bounds.max_y) );

            return coords;
        }
        return null;
    };

    _this.clearDrawingObjects = function(graphicOption) {

        // Чистим предыдущие области
        for (var i = 0; i < aBoundsCheckers.length; i++) {

            var bSkip = false;
            if ( graphicOption && (graphicOption.type === c_oAscGraphicOption.ChangePosition) && graphicOption.aId.length ) {
                if ( graphicOption.aId.indexOf(aBoundsCheckers[i].objectId) === -1 )
                    bSkip = true;
            }
            if ( !bSkip )
                _this.restoreSheetArea(aBoundsCheckers[i]);
        }
        aBoundsCheckers = [];

        // Сохраняем текущие области
        for ( var i = 0; i < aObjects.length; i++ ) {
            if ( !aObjects[i].inVisibleArea() )
                continue;
            var boundsChecker = _this.getBoundsChecker(aObjects[i].graphicObject);
            aBoundsCheckers.push(boundsChecker);
        }
    };

    _this.restoreSheetArea = function(checker) {

        var coords = _this.getBoundsCheckerCoords(checker);
        if ( coords ) {

            var range = asc_Range( coords.from.col, coords.from.row, coords.to.col, coords.to.row );
            var r_ = range.intersection(worksheet.visibleRange);

            if ( r_ ) {
                var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
                var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;

                while ( !worksheet.cols[r_.c2 + 1] ) {
                    worksheet.expandColsOnScroll(true);
                }
                while ( !worksheet.rows[r_.r2 + 1] ) {
                    worksheet.expandRowsOnScroll(true);
                }

                var x1 = worksheet.cols[r_.c1].left - offsetX;
                var y1 = worksheet.rows[r_.r1].top - offsetY;
                var x2 = worksheet.cols[r_.c2 + 1].left - offsetX;
                var y2 = worksheet.rows[r_.r2 + 1].top - offsetY;
                var w = x2 - x1;
                var h = y2 - y1;

                drawingCtx.clearRect( x1, y1, w, h );
                drawingCtx.setFillStyle(worksheet.settings.cells.defaultState.background).fillRect(x1, y1, w, h);
                worksheet._drawGrid(/*drawingCtx*/undefined, r_);
                worksheet._drawCells(/*drawingCtx*/undefined, r_);
                worksheet._drawCellsBorders(/*drawingCtx*/undefined, r_);
            }
        }
    };

    _this.getDrawingObjectsBounds = function()
    {
        var arr_x = [], arr_y = [], bounds;
        for(var i = 0; i < aObjects.length; ++i)
        {
            bounds = aObjects[i].graphicObject.bounds;
            arr_x.push(bounds.l);
            arr_x.push(bounds.r);
            arr_y.push(bounds.t);
            arr_y.push(bounds.b);
        }
        return new DrawingBounds(Math.min.apply(Math, arr_x), Math.max.apply(Math, arr_x), Math.min.apply(Math, arr_y), Math.max.apply(Math, arr_y));
    };

    //-----------------------------------------------------------------------------------
    // Drawing objects
    //-----------------------------------------------------------------------------------

    _this.showDrawingObjects = function(clearCanvas, graphicOption, printOptions) {

        var currTime = getCurrentTime();
        if ( aDrawTasks.length ) {

            var lastTask = aDrawTasks[aDrawTasks.length - 1];

            if ( lastTask.params.graphicOption && lastTask.params.graphicOption.isScrollType() && graphicOption && (lastTask.params.graphicOption.type === graphicOption.type) ) {
                lastTask.params.graphicOption.range.c1 = Math.min(lastTask.params.graphicOption.range.c1, graphicOption.range.c1);
                lastTask.params.graphicOption.range.r1 = Math.min(lastTask.params.graphicOption.range.r1, graphicOption.range.r1);
                lastTask.params.graphicOption.range.c2 = Math.max(lastTask.params.graphicOption.range.c2, graphicOption.range.c2);
                lastTask.params.graphicOption.range.r2 = Math.max(lastTask.params.graphicOption.range.r2, graphicOption.range.r2);
                return;
            }
            if ( (currTime - lastTask.time < 40) )
                return;
        }
        aDrawTasks.push({ time: currTime, params: { clearCanvas: clearCanvas, graphicOption: graphicOption, printOptions: printOptions} });
    };

    _this.showDrawingObjectsEx = function(clearCanvas, graphicOption, printOptions) {

        /*********** Print Options ***************
         printOptions : {
			ctx,
			printPagesData
		}
         *****************************************/

        // Undo/Redo
        if ( (worksheet.model.index != api.wb.model.getActive()) && !printOptions )
            return;

        if ( drawingCtx ) {
            if ( clearCanvas ) {
                _this.drawingArea.clear();
            }

            if ( aObjects.length ) {
                if (graphicOption) {
                    // Выставляем нужный диапазон для отрисовки
                    var updatedRect = { x: 0, y: 0, w: 0, h: 0 };
                    var updatedRange = graphicOption.getUpdatedRange();

                    //	var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
                    //	var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;

                    var x1 = worksheet.getCellLeft(updatedRange.c1, 1);// - offsetX;
                    var y1 = worksheet.getCellTop(updatedRange.r1, 1) ;//- offsetY;
                    var x2 = worksheet.getCellLeft(updatedRange.c2, 1);// - offsetX;
                    var y2 = worksheet.getCellTop(updatedRange.r2, 1);//- offsetY;
                    var w = x2 - x1;
                    var h = y2 - y1;
					var offset = worksheet.getCellsOffset(1);

                    updatedRect.x = ptToMm(x1 - offset.left);//ptToMm(x1);
                    updatedRect.y = ptToMm(y1 - offset.top);//ptToMm(y1);
                    updatedRect.w = ptToMm(w);
                    updatedRect.h = ptToMm(h);


					var offsetX = worksheet.getCellLeft(worksheet.getFirstVisibleCol(true), 1);
					var offsetY = worksheet.getCellTop(worksheet.getFirstVisibleRow(true), 1);
					shapeCtx.m_oContext.save();
					shapeCtx.m_oContext.beginPath();
					shapeCtx.m_oContext.rect(ptToPx(offset.left + x1 - offsetX), ptToPx(offset.top + y1 - offsetY), ptToPx(w), ptToPx(h));
					shapeCtx.m_oContext.clip();


                    //coords.y = worksheet.getCellTop(cell.row, 0) + worksheet.objectRender.convertMetric(cell.rowOff, 3, 0) - worksheet.getCellTop(0, 0);
                    //coords.x = worksheet.getCellLeft(cell.col, 0) + worksheet.objectRender.convertMetric(cell.colOff, 3, 0) - worksheet.getCellLeft(0, 0);

                    shapeCtx.updatedRect = updatedRect;
                } else
                    shapeCtx.updatedRect = null;

                // Area for update
                /*if ( graphicOption ) {
                 var updatedRect = { x: 0, y: 0, w: 0, h: 0 };
                 var updatedRange = graphicOption.getUpdatedRange();

                 var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
                 var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;

                 var x1 = worksheet.cols[updatedRange.c1].left - offsetX;
                 var y1 = worksheet.rows[updatedRange.r1].top - offsetY;
                 var x2 = worksheet.cols[updatedRange.c2].left - offsetX;
                 var y2 = worksheet.rows[updatedRange.r2].top - offsetY;
                 var w = x2 - x1;
                 var h = y2 - y1;

                 updatedRect.x = ptToMm(x1) - pxToMm(scrollOffset.getX());
                 updatedRect.y = ptToMm(y1) - pxToMm(scrollOffset.getY());
                 updatedRect.w = ptToMm(w);
                 updatedRect.h = ptToMm(h);

                 shapeCtx.m_oContext.beginPath();
                 shapeCtx.m_oContext.strokeStyle = "#FF0000";
                 shapeCtx.m_oContext.rect(mmToPx(updatedRect.x) + scrollOffset.getX(), mmToPx(updatedRect.y) + scrollOffset.getY(), mmToPx(updatedRect.w), mmToPx(updatedRect.h));
                 shapeCtx.m_oContext.stroke();

                 shapeCtx.updatedRect = updatedRect;

                 if ( graphicOption.type === c_oAscGraphicOption.AddText ) {
                 drawingCtx.clearRect( x1, y1, w, h );
                 drawingCtx.setFillStyle(worksheet.settings.cells.defaultState.background).fillRect(x1, y1, w, h);
                 worksheet._drawGrid(undefined, updatedRange);
                 worksheet._drawCells(undefined, updatedRange);
                 worksheet._drawCellsBorders(undefined, updatedRange);
                 }
                 }
                 else
                 shapeCtx.updatedRect = null;*/
                for (var i = 0; i < aObjects.length; i++) {
                    var drawingObject = aObjects[i];

                    if ( !drawingObject.flags.anchorUpdated )
                        drawingObject.updateAnchorPosition();

                    // Shape render (drawForPrint)
                    if ( drawingObject.isGraphicObject() ) {
                        if ( printOptions ) {

                            var range = printOptions.printPagesData.pageRange;
                            var printPagesData = printOptions.printPagesData;
                            var offsetCols = printPagesData.startOffsetPt;

                            var left = worksheet.getCellLeft(range.c1, 3) - worksheet.getCellLeft(0, 3) - ptToMm(printPagesData.leftFieldInPt);
                            var top = worksheet.getCellTop(range.r1, 3) - worksheet.getCellTop(0, 3) - ptToMm(printPagesData.topFieldInPt);

                            _this.printGraphicObject(drawingObject.graphicObject, printOptions.ctx.DocumentRenderer, top, left);

                            if ( printPagesData.pageHeadings ) {
                                worksheet._drawColumnHeaders(printOptions.ctx, range.c1, range.c2, /*style*/ undefined, worksheet.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, printPagesData.topFieldInPt - worksheet.cellsTop);
                                worksheet._drawRowHeaders(printOptions.ctx, range.r1, range.r2, /*style*/ undefined, printPagesData.leftFieldInPt - worksheet.cellsLeft, worksheet.rows[range.r1].top - printPagesData.topFieldInPt);
                            }
                        }
                        else {
                            _this.drawingArea.drawObject(drawingObject);
                        }
                    }
                }

				if (graphicOption)
					shapeCtx.m_oContext.restore();
            }
            worksheet.model.Drawings = aObjects;
        }

        if ( !printOptions ) {
            if ( aObjects.length ) {
                if ( _this.controller.selectedObjects.length )
                    _this.OnUpdateOverlay();
            }
        }
    };

    _this.printGraphicObject = function(graphicObject, ctx, top, left) {

        if ( graphicObject && ctx ) {
            // Image
            if ( graphicObject instanceof CImageShape )
                printImage(graphicObject, ctx, top, left);
            // Shape
            else if ( graphicObject instanceof CShape )
                printShape(graphicObject, ctx, top, left);
            // Chart
            else if (typeof CChartAsGroup != "undefined" &&  graphicObject instanceof CChartAsGroup )
                printChart(graphicObject, ctx, top, left);
            // Group
            else if ( graphicObject instanceof CGroupShape )
                printGroup(graphicObject, ctx, top, left);
        }

        // Print functions
        function printImage(graphicObject, ctx, top, left) {

            if ( (graphicObject instanceof CImageShape) && graphicObject && ctx ) {
                // Save
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;
                // Print
                graphicObject.draw( ctx );
                // Restore
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
            }
        }

        function printShape(graphicObject, ctx, top, left) {

            if ( (graphicObject instanceof CShape) && graphicObject && ctx ) {
                // Save
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;
                var txTxt, tyTxt;
                if ( graphicObject.txBody && graphicObject.transformText ) {
                    txTxt = graphicObject.transformText.tx;
                    tyTxt = graphicObject.transformText.ty;
                    graphicObject.transformText.tx -= left;
                    graphicObject.transformText.ty -= top;
                }
                // Print
                graphicObject.draw( ctx );
                // Restore
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
                if ( graphicObject.txBody && graphicObject.transformText ) {
                    graphicObject.transformText.tx = txTxt;
                    graphicObject.transformText.ty = tyTxt;
                }
            }
        }

        function printChart(graphicObject, ctx, top, left) {

            if ( typeof CChartAsGroup != "undefined" && (graphicObject instanceof CChartAsGroup) && graphicObject && ctx ) {

                // Save
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;

                var chartTxtAreas = [], aTxtTransform = [];
                // Title
                if ( graphicObject.chartTitle && graphicObject.chartTitle.txBody && graphicObject.chartTitle.transformText )
                    chartTxtAreas.push(graphicObject.chartTitle);
                // Axis Y
                if ( graphicObject.vAxisTitle && graphicObject.vAxisTitle.txBody && graphicObject.vAxisTitle.transformText )
                    chartTxtAreas.push(graphicObject.vAxisTitle);
                // Axis X
                if ( graphicObject.hAxisTitle && graphicObject.hAxisTitle.txBody && graphicObject.hAxisTitle.transformText )
                    chartTxtAreas.push(graphicObject.hAxisTitle);

                for ( var i = 0; i < chartTxtAreas.length; i++ ) {
                    var item = chartTxtAreas[i];
                    aTxtTransform.push( { tx: item.transformText.tx, ty: item.transformText.ty } );
                    item.transformText.tx -= left;
                    item.transformText.ty -= top;
                }
                // Print
                graphicObject.draw( ctx );
                // Restore
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;

                for ( var i = 0; i < chartTxtAreas.length; i++ ) {
                    var item = chartTxtAreas[i];
                    item.transformText.tx = aTxtTransform[i].tx;
                    item.transformText.ty = aTxtTransform[i].ty;
                }
            }
        }

        function printGroup(graphicObject, ctx, top, left) {

            if ( (graphicObject instanceof CGroupShape) && graphicObject && ctx ) {
                for ( var i = 0; i < graphicObject.arrGraphicObjects.length; i++ ) {
                    var graphicItem = graphicObject.arrGraphicObjects[i];

                    if ( graphicItem instanceof CImageShape )
                        printImage(graphicItem, ctx, top, left);

                    else if ( graphicItem instanceof CShape )
                        printShape(graphicItem, ctx, top, left);

                    else if ( typeof CChartAsGroup != "undefined" && graphicItem instanceof CChartAsGroup )
                        printChart(graphicItem, ctx, top, left);
                }
            }
        }
    };

    _this.getDrawingAreaMetrics = function() {

        /*
         *	Объект, определяющий max колонку и строчку для отрисовки объектов листа
         */

        var metrics = {
            maxCol: 0,
            maxRow: 0
        };

        for (var i = 0; aObjects && (i < aObjects.length); i++) {

            var drawingObject = aObjects[i];
            if ( drawingObject.to.col >= metrics.maxCol )
                metrics.maxCol = drawingObject.to.col + 1; // учитываем colOff
            if ( drawingObject.to.row >= metrics.maxRow )
                metrics.maxRow = drawingObject.to.row + 1; // учитываем rowOff
        }
        return metrics;
    };

    _this.clipGraphicsCanvas = function(canvas, graphicOption) {
        if ( canvas instanceof CGraphics ) {

            var x, y, w, h;

            if ( graphicOption ) {
                var updatedRange = graphicOption.getUpdatedRange();

                var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
                var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;

                var vr = worksheet.visibleRange;
                var borderOffsetX = (updatedRange.c1 <= vr.c1) ? 0 : 3;
                var borderOffsetY = (updatedRange.r1 <= vr.r1) ? 0 : 3;

                x = ptToPx(worksheet.getCellLeft(updatedRange.c1, 1) - offsetX) - borderOffsetX;
                y = ptToPx(worksheet.getCellTop(updatedRange.r1, 1) - offsetY) - borderOffsetY;
                w = worksheet.getCellLeft(updatedRange.c2, 0) - worksheet.getCellLeft(updatedRange.c1, 0) + 3;
                h = worksheet.getCellTop(updatedRange.r2, 0) - worksheet.getCellTop(updatedRange.r1, 0) + 3;

                /*canvas.m_oContext.beginPath();
                 canvas.m_oContext.strokeStyle = "#FF0000";
                 canvas.m_oContext.rect(x + 0.5, y + 0.5, w, h);
                 canvas.m_oContext.stroke();*/
            }
            else {
                x = worksheet.getCellLeft(0, 0);
                y = worksheet.getCellTop(0, 0);
                w = shapeCtx.m_lWidthPix - x;
                h = shapeCtx.m_lHeightPix - y;
            }

            canvas.m_oContext.save();
            canvas.m_oContext.beginPath();
            canvas.m_oContext.rect(x, y, w, h);
            canvas.m_oContext.clip();

            // этот сэйв нужен для восстановления сложных вложенных клипов
            canvas.m_oContext.save();
        }
    };

    _this.restoreGraphicsCanvas = function(canvas) {
        if ( canvas instanceof CGraphics ) {
            canvas.m_oContext.restore();

            // этот рестор нужен для восстановления сложных вложенных клипов
            canvas.m_oContext.restore();
        }
    };

    _this._drawWorksheetLayer = function (range, offsetLeft, offsetTop) {
        worksheet._drawGrid(/*drawingCtx*/undefined, range, offsetLeft, offsetTop);
        worksheet._drawCells(/*drawingCtx*/undefined, range, offsetLeft, offsetTop);
        worksheet._drawCellsBorders(/*drawingCtx*/undefined, range, offsetLeft, offsetTop);
    };

    _this.drawWorksheetLayer = function (range) {
        var c1, c2, r1, r2, tmpRange;
        var vr = worksheet.getVisibleRange();
        var oFrozenCell = worksheet.getFrozenCell();
        if (null !== oFrozenCell) {
            // Отрисовка диапазона, входящего в фиксированную область
            var cFrozen = oFrozenCell.getCol0();
            var rFrozen = oFrozenCell.getRow0();

            var offsetX, offsetY;

            if (range.c1 < cFrozen && range.r1 < rFrozen) {
                // Левый угол
                offsetX = worksheet.cols[0].left - worksheet.cellsLeft;
                offsetY = worksheet.rows[0].top - worksheet.cellsTop;
                c1 = Math.max(0, range.c1);
                c2 = Math.min(cFrozen - 1, range.c2);
                r1 = Math.max(0, range.r1);
                r2 = Math.min(rFrozen - 1, range.r2);
                tmpRange = asc_Range(c1, r1, c2, r2);
                _this._drawWorksheetLayer(tmpRange, offsetX, offsetY);
            }
            if (range.c1 < cFrozen && range.r2 > vr.r1) {
                offsetX = worksheet.cols[0].left - worksheet.cellsLeft;
                offsetY = undefined;
                c1 = Math.max(0, range.c1);
                c2 = Math.min(cFrozen - 1, range.c2);
                r1 = Math.max(range.r1, vr.r1);
                r2 = Math.min(range.r2, vr.r2);
                tmpRange = asc_Range(c1, r1, c2, r2);
                _this._drawWorksheetLayer(tmpRange, offsetX, offsetY);
            }
            if (range.r1 < rFrozen && range.c2 > vr.c1) {
                offsetX = undefined;
                offsetY = worksheet.rows[0].top - worksheet.cellsTop;
                c1 = Math.max(range.c1, vr.c1);
                c2 = Math.min(range.c2, vr.c2);
                r1 = Math.max(0, range.r1);
                r2 = Math.min(rFrozen - 1, range.r2);
                tmpRange = asc_Range(c1, r1, c2, r2);
                _this._drawWorksheetLayer(tmpRange, offsetX, offsetY);
            }
        }

        c1 = Math.max(range.c1, vr.c1);
        c2 = Math.min(range.c2, vr.c2);
        r1 = Math.max(range.r1, vr.r1);
        r2 = Math.min(range.r2, vr.r2);
        if (c1 <= c2 && r1 <= r2) {
            tmpRange = asc_Range(c1, r1, c2, r2);
            _this._drawWorksheetLayer(tmpRange);
        }

        worksheet._drawFrozenPaneLines();
    };

    //-----------------------------------------------------------------------------------
    // For object type
    //-----------------------------------------------------------------------------------

    _this.addImageDrawingObject = function(imageUrl, options) {

        _this.controller.resetSelection();
        if ( imageUrl && !_this.isViewerMode() ) {

            var _image = api.ImageLoader.LoadImage(imageUrl, 1);
            var isOption = options && options.cell;

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

                //var cellTo = _this.coordsManager.calculateCell(realLeftOffset + width, realTopOffset + height);
                var cellTo = _this.drawingArea.calculateCell(realLeftOffset + width, realTopOffset + height);
                object.to.col = cellTo.col;
                object.to.colOff = cellTo.colOff;
                object.to.row = cellTo.row;
                object.to.rowOff = cellTo.rowOff;

                worksheet.handlers.trigger("reinitializeScroll");
            };

            var addImageObject = function (_image) {

                if ( !_image.Image ) {
                    worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
                }
                else {

                    var drawingObject = _this.createDrawingObject();
                    drawingObject.worksheet = worksheet;

                    drawingObject.from.col = isOption ? options.cell.col : worksheet.getSelectedColumnIndex();
                    drawingObject.from.row = isOption ? options.cell.row : worksheet.getSelectedRowIndex();

                    // Проверяем начальные координаты при вставке
                    while ( !worksheet.cols[drawingObject.from.col] ) {
                        worksheet.expandColsOnScroll(true);
                    }
                    worksheet.expandColsOnScroll(true); 	// для colOff

                    while ( !worksheet.rows[drawingObject.from.row] ) {
                        worksheet.expandRowsOnScroll(true);
                    }
                    worksheet.expandRowsOnScroll(true); 	// для rowOff

                    calculateObjectMetrics(drawingObject, isOption ? options.width : _image.Image.width, isOption ? options.height : _image.Image.height);

                    var coordsFrom = _this.coordsManager.calculateCoords(drawingObject.from);
                    var coordsTo = _this.coordsManager.calculateCoords(drawingObject.to);


                    // CImage
                    _this.controller.addImageFromParams(_image.src, pxToMm(coordsFrom.x), pxToMm(coordsFrom.y), pxToMm(coordsTo.x - coordsFrom.x), pxToMm(coordsTo.y - coordsFrom.y));
                }

                worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                worksheet.setSelectionShape(true);
            };

            if (null != _image) {
                addImageObject(_image);
            }
            else {
                _this.asyncImageEndLoaded = function(_image) {
                    addImageObject(_image);
                    _this.asyncImageEndLoaded = null;
                }
            }
        }
    };

    _this.editImageDrawingObject = function(imageUrl) {

        if ( imageUrl ) {
            var _image = api.ImageLoader.LoadImage(imageUrl, 1);

            var addImageObject = function (_image) {

                if ( !_image.Image ) {
                    worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
                }
                else {
                    if ( api.isImageChangeUrl ) {
                        var imageProp = new asc_CImgProperty();
                        imageProp.ImageUrl = _image.src;
                        _this.setGraphicObjectProps(imageProp);
                        api.isImageChangeUrl = false;
                    }
                    else if ( api.isShapeImageChangeUrl ) {
                        var imgProps = new asc_CImgProperty();
                        var shapeProp = new asc_CShapeProperty();
                        imgProps.ShapeProperties = shapeProp;
                        shapeProp.fill = new asc_CShapeFill();
                        shapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
                        shapeProp.fill.fill = new asc_CFillBlip();
                        shapeProp.fill.fill.asc_putUrl(_image.src);
                        _this.setGraphicObjectProps(imgProps);
                        api.isShapeImageChangeUrl = false;
                    }

                    _this.showDrawingObjects(true);
                }
                worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
            };

            if (null != _image) {
                addImageObject(_image);
            }
            else {
                _this.asyncImageEndLoaded = function(_image) {
                    addImageObject(_image);
                    _this.asyncImageEndLoaded = null;
                }
            }
        }
    };

    _this.addChartDrawingObject = function(chart, options) {

        if ( _this.isViewerMode() )
            return;

        worksheet.setSelectionShape(true);

        if ( chart instanceof asc_ChartSettings )
        {
            if(api.isChartEditor)
            {
                this.controller.selectObject(aObjects[0].graphicObject, 0);
                this.controller.editChartDrawingObjects(chart);
                return;
            }
            var asc_chart = new asc_CChart();
            var rangeWs = convertFormula2(chart.range, worksheet);
            asc_chart.range.intervalObject = rangeWs.range;
            asc_chart.worksheet = rangeWs.ws;
            var in_columns = chart.getInColumns();
            if(in_columns)
            {
                asc_chart.range.rows = false;
                asc_chart.range.cols = true;
            }
            else
            {
                asc_chart.range.rows = true;
                asc_chart.range.cols = false;
            }
            ExecuteNoHistory(function()
            {
                asc_chart.rebuildSeries(true);
            }, this, []);

            return _this.controller.addChartDrawingObject(asc_chart, chart);
        }
        else if(chart instanceof asc_CChart)
        {
            var _range = convertFormula(chart.range.interval, worksheet);
            if ( _range )
                chart.range.intervalObject = _range;

            ExecuteNoHistory(function()
            {
                chart.rebuildSeries();
                chart.worksheet = worksheet; 	// Для формул серий
            }, this, []);

            return _this.controller.addChartDrawingObject(chart, options);
        }
        else if ( isObject(chart) && chart["binary"] )
        {
            History.TurnOff();
            var listRange = new Range(worksheet.model, 0, 0, worksheet.nRowsCount - 1, worksheet.nColsCount - 1);
            listRange.cleanAll();
            if ( worksheet.isChartAreaEditMode ) {
                worksheet.isChartAreaEditMode = false;
                worksheet.arrActiveChartsRanges = [];
            }
            var asc_chart_binary = new Asc.asc_CChartBinary();
            asc_chart_binary.asc_setBinary(chart["binary"]);
            asc_chart_binary.asc_setThemeBinary(chart["themeBinary"]);
            var oNewChartSpace = asc_chart_binary.getChartSpace(worksheet.model);
            var theme = asc_chart_binary.getTheme();
            if(theme)
            {
                worksheet.model.workbook.theme = theme;
            }
            var font_map = {};
            oNewChartSpace.documentGetAllFontNames(font_map);
            checkThemeFonts(font_map, worksheet.model.workbook.theme.themeElements.fontScheme);
            window["Asc"]["editor"]._loadFonts(font_map,
                function()
                {
                    oNewChartSpace.getAllRasterImages(aImagesSync);
                    oNewChartSpace.setBDeleted(false);
                    oNewChartSpace.setWorksheet(worksheet.model);
                    oNewChartSpace.addToDrawingObjects();
                    oNewChartSpace.recalculate();
                    CheckSpPrXfrm(oNewChartSpace);
                    oNewChartSpace.spPr.xfrm.setOffX(50);
                    oNewChartSpace.spPr.xfrm.setOffY(36);
                    oNewChartSpace.recalculate();

                    var min_r = 0, max_r = 0, min_c = 0, max_c = 0;

                    var series = oNewChartSpace.chart.plotArea.charts[0].series, ser;
                    var worksheet_model = worksheet.model.workbook.aWorksheets[0];
                    function fillTableFromRef(ref)
                    {
                        var cache = ref.numCache ? ref.numCache : (ref.strCache ? ref.strCache : null);
                        if(cache)
                        {
                            var f1 = ref.f.replace(/\(|\)/g,"");
                            var arr_f = f1.split(",");
                            var pt_index = 0, i, j, cell, pt;
                            for(i = 0; i < arr_f.length; ++i)
                            {
                                var parsed_ref = parserHelp.parse3DRef(arr_f[i]);
                                if(parsed_ref)
                                {
                                    var source_worksheet = worksheet.model.workbook.getWorksheetByName(parsed_ref.sheet);
                                    if(source_worksheet === worksheet.model)
                                    {
                                        var range1 = source_worksheet.getRange2(parsed_ref.range);
                                        if(range1)
                                        {
                                            var range = range1.bbox;
                                            while ( worksheet.cols.length < range.c2 ) {
                                                worksheet.expandColsOnScroll(true);
                                            }
                                            while ( worksheet.rows.length < range.r2 ) {
                                                worksheet.expandRowsOnScroll(true);
                                            }

                                            if(range.r1 > max_r)
                                                max_r = range.r1;
                                            if(range.r2 > max_r)
                                                max_r = range.r2;
                                            if(range.r1 < min_r)
                                                min_r = range.r1;
                                            if(range.r2 < min_r)
                                                min_r = range.r2;

                                            if(range.c1 > max_c)
                                                max_c = range.c1;
                                            if(range.c2 > max_c)
                                                max_c = range.c2;
                                            if(range.c1 < min_c)
                                                min_c = range.c1;
                                            if(range.c2 < min_c)
                                                min_c = range.c2;

                                            if(range.r1 === range.r2)
                                            {
                                                for(j = range.c1;  j <= range.c2; ++j)
                                                {

                                                    cell = source_worksheet.getCell( new CellAddress(range.r1, j, 0) );
                                                    pt = cache.getPtByIndex(pt_index);
                                                    if(pt)
                                                    {
                                                        cell.setNumFormat(typeof pt.formatCode === "string" && pt.formatCode.length > 0 ? pt.formatCode : "General");
                                                        cell.setValue(pt.val + "");
                                                    }
                                                    ++pt_index;
                                                }
                                            }
                                            else
                                            {
                                                for(j = range.r1; j <= range.r2; ++j)
                                                {
                                                    cell = source_worksheet.getCell( new CellAddress(j, range.c1, 0) );
                                                    pt = cache.getPtByIndex(pt_index);
                                                    if(pt)
                                                    {
                                                        cell.setNumFormat(typeof pt.formatCode === "string" && pt.formatCode.length > 0 ? pt.formatCode : "General");
                                                        cell.setValue(pt.val + "");
                                                    }
                                                    ++pt_index;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                    }

                    var first_num_ref;
                    if(series[0])
                    {
                        if(series[0].val)
                            first_num_ref = series[0].val.numRef;
                        else if(series[0].yVal)
                            first_num_ref = series[0].yVal.numRef;
                    }
                    if(first_num_ref)
                    {
                        var resultRef = parserHelp.parse3DRef(first_num_ref.f);
                        if(resultRef)
                        {
                            worksheet.model.workbook.aWorksheets[0].sName = resultRef.sheet;
                            if(series[0] && series[0].xVal && series[0].xVal.numRef)
                            {
                                fillTableFromRef(series[0].xVal.numRef);
                            }
                            if(series[0].cat && series[0].cat.strRef)
                            {
                                fillTableFromRef(series[0].cat.strRef);
                            }
                            for(var i = 0; i < series.length; ++i)
                            {
                                ser = series[i];
                                if(ser.val && ser.val.numRef)
                                {
                                    fillTableFromRef(ser.val.numRef);
                                }
                                if(ser.yVal && ser.yVal.numRef)
                                {
                                    fillTableFromRef(ser.yVal.numRef);
                                }
                                if(ser.cat && ser.cat.numRef)
                                {
                                    fillTableFromRef(ser.cat.numRef);
                                }
                                if(ser.cat && ser.cat.strRef)
                                {
                                    fillTableFromRef(ser.cat.strRef);
                                }
                                if(ser.tx && ser.tx.strRef)
                                {
                                    fillTableFromRef(ser.tx.strRef);
                                }
                            }
                        }
                    }
                    worksheet._updateCellsRange({r1: 0, r2: Math.max(worksheet.nRowsCount - 1, max_r), c1: 0, c2: Math.max(worksheet.nColsCount - 1, max_c)});
                    _this.showDrawingObjects(false);
                    History.TurnOn();
                    window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null, function(){_this.showDrawingObjects(true)});
                });


        }
    };

    _this.editChartDrawingObject = function(chart)
    {
        if ( chart )
        {
            if(api.isChartEditor)
            {
                this.controller.selectObject(aObjects[0].graphicObject, 0);
            }
            _this.controller.editChartDrawingObjects(chart);
            _this.showDrawingObjects(false);
        }
    };

    _this.rebuildChartGraphicObjects = function(data)
    {
        var wsViews = Asc["editor"].wb.wsViews;
        for(var i = 0; i < wsViews.length; ++i)
        {
            if(wsViews[i])
            {
                wsViews[i].objectRender.rebuildCharts(data);
            }
        }

    };

    _this.pushToAObjects = function(aDrawing)
    {
        aObjects = [];
        for(var i = 0; i < aDrawing.length; ++i)
        {
            aObjects.push(aDrawing[i]);
        }
    };

    _this.rebuildCharts = function(data)
    {
        for(var i = 0; i < aObjects.length; ++i)
        {
            if(aObjects[i].graphicObject.getObjectType() === historyitem_type_ChartSpace)
            {
                aObjects[i].graphicObject.rebuildSeries();
            }
        }
    };

    _this.updateDrawingObject = function(bInsert, operType, updateRange) {

        var changedRange = null;
        var metrics = null;

        for (var i = 0; i < aObjects.length; i++) {

            var obj = aObjects[i];
            if ( !obj.isLocked() ) {

                var bbox = obj.isChart() ? obj.graphicObject.chart.range.intervalObject.getBBox0() : null;

                if ( obj.isChart() || obj.isImage() || obj.isShape() ) {

                    metrics = { from: {}, to: {} };
                    metrics.from.col = obj.from.col; metrics.to.col = obj.to.col;
                    metrics.from.colOff = obj.from.colOff; metrics.to.colOff = obj.to.colOff;
                    metrics.from.row = obj.from.row; metrics.to.row = obj.to.row;
                    metrics.from.rowOff = obj.from.rowOff; metrics.to.rowOff = obj.to.rowOff;

                    if (bInsert) {		// Insert
                        switch (operType) {
                            case c_oAscInsertOptions.InsertColumns:
                            {
                                var count = updateRange.c2 - updateRange.c1 + 1;

                                // Position
                                if (updateRange.c1 <= obj.from.col) {
                                    metrics.from.col += count;
                                    metrics.to.col += count;
                                }
                                else if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {
                                    metrics.to.col += count;
                                }
                                else
                                    metrics = null;

                                // Range
                                if (obj.isChart()) {
                                    if (updateRange.c1 <= bbox.c1)
                                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 + count, bbox.r2, bbox.c2 + count);

                                    else if (updateRange.c1 <= bbox.c2)
                                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 , bbox.r2, bbox.c2 + count);
                                }
                            }
                                break;
                            case c_oAscInsertOptions.InsertCellsAndShiftRight:
                                // Range
                                if (obj.isChart()) {
                                    if ( (updateRange.r1 <= bbox.r1) && (updateRange.r2 >= bbox.r2) && (updateRange.c2 < bbox.c1) ) {
                                        var count = updateRange.c2 - updateRange.c1 + 1;
                                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 + count, bbox.r2, bbox.c2 + count);
                                    }
                                }
                                break;

                            case c_oAscInsertOptions.InsertRows:
                            {
                                // Position
                                var count = updateRange.r2 - updateRange.r1 + 1;

                                if (updateRange.r1 <= obj.from.row) {
                                    metrics.from.row += count;
                                    metrics.to.row += count;
                                }
                                else if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {
                                    metrics.to.row += count;
                                }
                                else
                                    metrics = null;

                                // Range
                                if (obj.isChart()) {
                                    if (updateRange.r1 <= bbox.r1)
                                        changedRange = new Range(worksheet.model, bbox.r1 + count, bbox.c1, bbox.r2 + count, bbox.c2);

                                    else if (updateRange.r1 <= bbox.r2)
                                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2 + count, bbox.c2);
                                }
                            }
                                break;
                            case c_oAscInsertOptions.InsertCellsAndShiftDown:
                                // Range
                                if (obj.isChart()) {
                                    if ( (updateRange.c1 <= bbox.c1) && (updateRange.c2 >= bbox.c2) && (updateRange.r2 < bbox.r1) ) {
                                        var count = updateRange.r2 - updateRange.r1 + 1;
                                        changedRange = new Range(worksheet.model, bbox.r1 + count, bbox.c1, bbox.r2 + count, bbox.c2);
                                    }
                                }
                                break;
                        }
                    }
                    else {				// Delete
                        switch (operType) {
                            case c_oAscDeleteOptions.DeleteColumns:
                            {

                                // Position
                                var count = updateRange.c2 - updateRange.c1 + 1;

                                if (updateRange.c1 <= obj.from.col) {

                                    // outside
                                    if (updateRange.c2 < obj.from.col) {
                                        metrics.from.col -= count;
                                        metrics.to.col -= count;
                                    }
                                    // inside
                                    else {
                                        metrics.from.col = updateRange.c1;
                                        metrics.from.colOff = 0;

                                        var offset = 0;
                                        if (obj.to.col - updateRange.c2 - 1 > 0)
                                            offset = obj.to.col - updateRange.c2 - 1;
                                        else {
                                            offset = 1;
                                            metrics.to.colOff = 0;
                                        }
                                        metrics.to.col = metrics.from.col + offset;
                                    }
                                }

                                else if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {

                                    // outside
                                    if (updateRange.c2 >= obj.to.col) {
                                        metrics.to.col = updateRange.c1;
                                        metrics.to.colOff = 0;
                                    }
                                    else
                                        metrics.to.col -= count;
                                }
                                else
                                    metrics = null;

                                // Range
                                if (obj.isChart()) {
                                    var count = updateRange.c2 - updateRange.c1 + 1;

                                    if (updateRange.c1 < bbox.c1) {

                                        if (updateRange.c2 < bbox.c1)
                                            changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 - count , bbox.r2, bbox.c2 - count );
                                        else {

                                            // outside
                                            if (updateRange.c2 > bbox.c2)
                                                changedRange = new Range(worksheet.model, bbox.r1, updateRange.c1, bbox.r2, updateRange.c1);

                                            // inside
                                            else {
                                                var offset = bbox.c2 - updateRange.c2;
                                                changedRange = new Range(worksheet.model, bbox.r1, updateRange.c1, bbox.r2, updateRange.c1 + offset - 1);
                                            }
                                        }
                                    }

                                    else if ((updateRange.c1 >= bbox.c1) && (updateRange.c1 <= bbox.c2)) {

                                        // outside
                                        if (updateRange.c2 > bbox.c2) {
                                            var offset = (bbox.c1 + 1 > updateRange.c1) ? 1 : 0;
                                            changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, updateRange.c1 + offset - 1);
                                        }

                                        // inside
                                        else {
                                            var offset = bbox.c2 + 1 - bbox.c1 - count;
                                            if (offset <= 0)
                                                offset = 1;
                                            changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, bbox.c1 + offset - 1);
                                        }
                                    }
                                }
                            }
                                break;
                            case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
                                // Range
                                if (obj.isChart()) {
                                    if ( (updateRange.r1 <= bbox.r1) && (updateRange.r2 >= bbox.r2) && (updateRange.c2 < bbox.c1) ) {
                                        var count = updateRange.c2 - updateRange.c1 + 1;
                                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 - count, bbox.r2, bbox.c2 - count);
                                    }
                                }
                                break;

                            case c_oAscDeleteOptions.DeleteRows:
                            {

                                // Position
                                var count = updateRange.r2 - updateRange.r1 + 1;

                                if (updateRange.r1 <= obj.from.row) {

                                    // outside
                                    if (updateRange.r2 < obj.from.row) {
                                        metrics.from.row -= count;
                                        metrics.to.row -= count;
                                    }
                                    // inside
                                    else {
                                        metrics.from.row = updateRange.r1;
                                        metrics.from.colOff = 0;

                                        var offset = 0;
                                        if (obj.to.row - updateRange.r2 - 1 > 0)
                                            offset = obj.to.row - updateRange.r2 - 1;
                                        else {
                                            offset = 1;
                                            metrics.to.colOff = 0;
                                        }
                                        metrics.to.row = metrics.from.row + offset;
                                    }
                                }

                                else if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {

                                    // outside
                                    if (updateRange.r2 >= obj.to.row) {
                                        metrics.to.row = updateRange.r1;
                                        metrics.to.colOff = 0;
                                    }
                                    else
                                        metrics.to.row -= count;
                                }
                                else
                                    metrics = null;

                                // range
                                if (obj.isChart()) {
                                    var count = updateRange.r2 - updateRange.r1 + 1;

                                    if (updateRange.r1 < bbox.r1) {

                                        if (updateRange.r2 < bbox.r1)
                                            changedRange = new Range(worksheet.model, bbox.r1 - count, bbox.c1 , bbox.r2 - count , bbox.c2 );
                                        else {

                                            // outside
                                            if (updateRange.r2 >= bbox.r2)
                                                changedRange = new Range(worksheet.model, updateRange.r1 , bbox.c1 , updateRange.r1 , bbox.c2);

                                            // inside
                                            else {
                                                var offset = bbox.r1 + 1 - updateRange.r2;
                                                changedRange = new Range(worksheet.model, updateRange.r1 , bbox.c1 , updateRange.r1 + offset, bbox.c2);
                                            }
                                        }
                                    }

                                    else if ((updateRange.r1 >= bbox.r1) && (updateRange.r1 <= bbox.r2)) {

                                        // outside
                                        if (updateRange.r2 > bbox.r2) {
                                            var offset = (bbox.r1 + 1 > updateRange.r1) ? 1 : 0;
                                            changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , updateRange.r1 + offset - 1, bbox.c2 );
                                        }

                                        // inside
                                        else {
                                            var offset = bbox.r2 + 1 - bbox.r1 - count;
                                            if (offset <= 0) offset = 1;
                                            changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r1 + offset - 1, bbox.c2 );
                                        }
                                    }
                                }
                            }
                                break;
                            case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
                                // Range
                                if (obj.isChart()) {
                                    if ( (updateRange.c1 <= bbox.c1) && (updateRange.c2 >= bbox.c2) && (updateRange.r2 < bbox.r1) ) {
                                        var count = updateRange.r2 - updateRange.r1 + 1;
                                        changedRange = new Range(worksheet.model, bbox.r1 - count, bbox.c1, bbox.r2 - count, bbox.c2);
                                    }
                                }
                                break;
                        }
                    }

                    // Normalize position
                    if (metrics) {
                        if (metrics.from.col < 0) {
                            metrics.from.col = 0;
                            metrics.from.colOff = 0;
                        }

                        if (metrics.to.col <= 0) {
                            metrics.to.col = 1;
                            metrics.to.colOff = 0;
                        }

                        if (metrics.from.row < 0) {
                            metrics.from.row = 0;
                            metrics.from.rowOff = 0;
                        }

                        if (metrics.to.row <= 0) {
                            metrics.to.row = 1;
                            metrics.to.rowOff = 0;
                        }

                        if (metrics.from.col == metrics.to.col) {
                            metrics.to.col++;
                            metrics.to.colOff = 0;
                        }
                        if (metrics.from.row == metrics.to.row) {
                            metrics.to.row++;
                            metrics.to.rowOff = 0;
                        }
                    }

                    // Normalize range
                    if (changedRange) {
                        var bbox = changedRange.getBBox0();

                        var tmp;
                        if (bbox.c1 > bbox.c2) {
                            tmp = bbox.c1;
                            bbox.c1 = bbox.c2;
                            bbox.c2 = tmp;
                        }
                        if (bbox.r1 > bbox.r2) {
                            tmp = bbox.r1;
                            bbox.r1 = bbox.r2;
                            bbox.r2 = tmp;
                        }
                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, bbox.c2);
                    }

                    if ( changedRange || metrics ) {

                        if ( obj.isChart() && changedRange ) {
                            obj.graphicObject.chart.range.intervalObject = changedRange;
                            _this.calcChartInterval(obj.graphicObject.chart);
                            obj.graphicObject.chart.rebuildSeries();
                            obj.graphicObject.recalculate();
                        }
                        if (metrics) {
                            obj.from.col = metrics.from.col;
                            obj.from.colOff = metrics.from.colOff;
                            obj.from.row = metrics.from.row;
                            obj.from.rowOff = metrics.from.rowOff;

                            obj.to.col = metrics.to.col;
                            obj.to.colOff = metrics.to.colOff;
                            obj.to.row = metrics.to.row;
                            obj.to.rowOff = metrics.to.rowOff;
                        }

                        // Update graphic object
                        History.TurnOff();
                        var coords = _this.coordsManager.calculateCoords(obj.from);
                        obj.graphicObject.setPosition( pxToMm(coords.x), pxToMm(coords.y) );
                        obj.graphicObject.recalculateTransform();
                        obj.graphicObject.calculateTransformTextMatrix();
                        History.TurnOn();
                        _this.showDrawingObjects(true);
                    }
                }
            }
        }
    };

    _this.moveRangeDrawingObject = function(oBBoxFrom, oBBoxTo, bResize) {

        if ( oBBoxFrom && oBBoxTo )
        {
            var selected_objects = this.controller.selection.groupSelection ? this.controller.selection.groupSelection.selectedObjects : this.controller.selectedObjects;
            var chart;
            if(selected_objects.length === 1 && selected_objects[0].getObjectType() === historyitem_type_ChartSpace)
            {
                chart = selected_objects[0];
            }
            if(chart && !(!chart.bbox || !chart.bbox.seriesBBox || oBBoxTo.isEqual(chart.bbox.seriesBBox)))
            {
                var editChart = function (drawingObject)
                {
                    var asc_chart = new asc_CChart();
                    var final_bbox = oBBoxTo.clone();
                    if(chart.bbox.seriesBBox.bVert)
                    {

                        asc_chart.range.rows = true;
                        asc_chart.range.cols = false;

                        if(chart.bbox.catBBox && chart.bbox.catBBox.r1 === chart.bbox.catBBox.r2 && oBBoxTo.r1 > chart.bbox.catBBox.r1)
                        {
                            asc_chart.range.catHeadersBBox = {
                                r1: chart.bbox.catBBox.r1,
                                r2: chart.bbox.catBBox.r1,
                                c1: oBBoxTo.c1,
                                c2: oBBoxTo.c2
                            };
                        }


                        if(chart.bbox.serBBox && chart.bbox.serBBox && chart.bbox.serBBox.c1 === chart.bbox.serBBox.c2 && chart.bbox.serBBox.c1 < oBBoxTo.c1)
                        {
                            asc_chart.range.serHeadersBBox = {
                                r1: oBBoxTo.r1,
                                r2: oBBoxTo.r2,
                                c1: chart.bbox.serBBox.c1,
                                c2: chart.bbox.serBBox.c2
                            };
                        }
                      //
                      //  if(chart.bbox.catBBox && oBBoxTo.r1 === chart.bbox.seriesBBox.r1)
                      //  {
                      //      --final_bbox.r1;
                      //  }
                      //  if(chart.bbox.serBBox && oBBoxTo.c1 === chart.bbox.seriesBBox.c1)
                      //  {
                      //      --final_bbox.c1;
                      //  }
                    }
                    else
                    {
                        asc_chart.range.rows = false;
                        asc_chart.range.cols = true;

                        if(chart.bbox.catBBox && chart.bbox.catBBox.c1 === chart.bbox.catBBox.c2 && oBBoxTo.c1 > chart.bbox.catBBox.c1)
                        {
                            asc_chart.range.catHeadersBBox = {
                                r1: oBBoxTo.r1,
                                r2: oBBoxTo.r2,
                                c1: chart.bbox.catBBox.c1,
                                c2: chart.bbox.catBBox.c2
                            };
                        }


                        if(chart.bbox.serBBox && chart.bbox.serBBox && chart.bbox.serBBox.r1 === chart.bbox.serBBox.r2 && chart.bbox.serBBox.r1 < oBBoxTo.r1)
                        {
                            asc_chart.range.serHeadersBBox = {
                                r1: chart.bbox.serBBox.r1,
                                r2: chart.bbox.serBBox.r2,
                                c1: oBBoxTo.c1,
                                c2: oBBoxTo.c2
                            };
                        }


                        //if(chart.bbox.catBBox && oBBoxTo.c1 === chart.bbox.seriesBBox.c1)
                        //{
                        //    --final_bbox.c1;
                        //}
                        //if(chart.bbox.serBBox && oBBoxTo.r1 === chart.bbox.seriesBBox.r1)
                        //{
                        //    --final_bbox.r1;
                        //}
                    }
                    var startCell = new CellAddress(final_bbox.r1, final_bbox.c1, 0);
                    var endCell = new CellAddress(final_bbox.r2, final_bbox.c2, 0);

                    if (startCell && endCell)
                    {
						asc_chart.range.interval = parserHelp.get3DRef(worksheet.model.sName,
								startCell.getID() === endCell.getID() ? startCell.getID() :
									startCell.getID() + ':' + endCell.getID());
                    }
                    asc_chart.worksheet = worksheet;
                    _this.intervalToIntervalObject(asc_chart);
                    asc_chart.rebuildSeries();
                    drawingObject.rebuildSeriesFromAsc(asc_chart);
                    _this.controller.startRecalculate();
                };
                var callbackCheck = function (result) {
                    if(result)
                    {
                        History.Create_NewPoint();
                        editChart(chart);
                        _this.showDrawingObjects(true);
                    }
                };
                _this.objectLocker.reset();
                _this.objectLocker.addObjectId(chart.Get_Id());
                _this.objectLocker.checkObjects(callbackCheck);
            }
        }
    };

    //-----------------------------------------------------------------------------------
    // Chart
    //-----------------------------------------------------------------------------------

    _this.checkChartInterval = function(type, interval, isRows) {
        var result = false;
        if (interval && worksheet) {
            var _range = convertFormula(interval, worksheet);
            if (_range && checkDataRange(TYPE_SUBTYPE_BY_TYPE[type].type, _range, isRows, worksheet))
                result = true;
        }
        return result;
    };

    _this.calcChartInterval = function(chart) {
        if (chart.range.intervalObject)
        {
            chart.range.interval = this.bboxToInterval(chart.range.intervalObject.getBBox0(), chart.range.intervalObject.worksheet.sName);
        }
    };

    _this.bboxToInterval = function(box, wsName)
    {
        var startCell = new CellAddress(box.r1, box.c1, 0);
        var endCell = new CellAddress(box.r2, box.c2, 0);

        if (startCell && endCell)
			return startCell.getID() === endCell.getID() ? startCell.getID() :
				parserHelp.get3DRef(wsName, startCell.getID() + ':' + endCell.getID());
        return "";
    };

    _this.intervalToIntervalObject = function(chart) {
        if (chart.range.interval && worksheet) {
            var _range = convertFormula(chart.range.interval, worksheet);
            if (_range)
                chart.range.intervalObject = _range;
        }
    };

    _this.updateChartReferences = function(oldWorksheet, newWorksheet)
    {
        ExecuteNoHistory(function(){
            for (var i = 0; i < aObjects.length; i++) {
                var graphicObject = aObjects[i].graphicObject;
                if ( graphicObject.getObjectType() === historyitem_type_ChartSpace )
                {
                    graphicObject.updateChartReferences(oldWorksheet, newWorksheet);
                }
            }
            if(this.controller)
                this.controller.startRecalculate();
        }, this, []);

    };

    //-----------------------------------------------------------------------------------
    // Graphic object
    //-----------------------------------------------------------------------------------

    _this.addGraphicObject = function(graphic, position, lockByDefault) {

        worksheet.cleanSelection();
        var drawingObject = _this.createDrawingObject();
        drawingObject.graphicObject = graphic;
        graphic.setDrawingBase(drawingObject);

        var ret;
        if (isRealNumber(position)) {
            aObjects.splice(position, 0, drawingObject);
            ret = position;
        }
        else {
            ret = aObjects.length;
            aObjects.push(drawingObject);
        }

        /*if ( isInit ) {
         _this.showDrawingObjects(false);
         _this.sendGraphicObjectProps();
         worksheet.model.workbook.handlers.trigger("asc_onEndAddShape");
         }*/

        if ( lockByDefault ) {
            _this.objectLocker.reset();
            _this.objectLocker.addObjectId(drawingObject.graphicObject.Id);
            _this.objectLocker.checkObjects( function(result) {} );
        }
        worksheet.setSelectionShape(true);

        /*var boundsChecker = _this.getBoundsChecker(drawingObject.graphicObject);
         aBoundsCheckers.push(boundsChecker);*/

        return ret;
    };

    _this.groupGraphicObjects = function() {

        if ( _this.controller.canGroup() ) {
            _this.controller.createGroup(null);
            worksheet.setSelectionShape(true);
        }
    };

    _this.unGroupGraphicObjects = function() {

        if ( _this.controller.canUnGroup() ) {
            _this.controller.unGroup();
            worksheet.setSelectionShape(true);
            api.isStartAddShape = false;
        }
    };

    _this.insertUngroupedObjects = function(idGroup, aGraphics) {

        if ( idGroup && aGraphics.length ) {

            var aSingleObjects = [];
            for (var i = 0; i < aGraphics.length; i++) {

                var obj = _this.createDrawingObject();
                obj.graphicObject = aGraphics[i];
                aGraphics[i].setDrawingBase(obj);
                obj.graphicObject.select(_this.controller);
                obj.setGraphicObjectCoords();
                aSingleObjects.push(obj);
            }

            for (var i = 0; i < aObjects.length; i++) {

                if ( idGroup == aObjects[i].graphicObject.Id ) {

                    aObjects.splice(i, 1);

                    for (var j = aSingleObjects.length - 1; j > -1; j--) {
                        aObjects.splice(i, 0, aSingleObjects[j]);
                    }
                    _this.showDrawingObjects(true);
                    break;
                }
            }
        }
    };

    _this.getDrawingBase = function(graphicId) {
        for (var i = 0; i < aObjects.length; i++) {
            if ( aObjects[i].graphicObject.Id == graphicId )
                return aObjects[i];
        }
        return null;
    };

    _this.deleteDrawingBase = function(graphicId) {

        var position = null;
        var bRedraw = false;
        for (var i = 0; i < aObjects.length; i++) {
            if ( aObjects[i].graphicObject.Id == graphicId ) {
                aObjects[i].graphicObject.deselect(_this.controller);
                if ( aObjects[i].isChart() )
                    worksheet.arrActiveChartsRanges = [];
                aObjects.splice(i, 1);
                bRedraw = true;
                position = i;
                break;
            }
        }

        /*if ( bRedraw ) {
         worksheet._checkSelectionShape();
         _this.sendGraphicObjectProps();
         _this.showDrawingObjects(true);
         }*/

        return position;
    };

    _this.checkGraphicObjectPosition = function(x, y, w, h) {

        /*	Принцип:
         true - если перемещение в области или требуется увеличить лист вправо/вниз
         false - наезд на хидеры
         */

        var response = { result: true, x: 0, y: 0 };

        var bottom = worksheet.getCellTop(worksheet.rows.length - 1, 3);
        var right = worksheet.getCellLeft(worksheet.cols.length - 1, 3);

        // выход за границу слева или сверху
        if ( y < 0 ) {
            response.result = false;
            response.y = Math.abs(y);
        }
        if ( x < 0 ) {
            response.result = false;
            response.x = Math.abs(x);
        }

        /* Проверки на максимум в листе */
        function isMaxCol() {
            var result = false;
            if ( worksheet.cols.length >= gc_nMaxCol ) {
                var lastCol = worksheet.cols[gc_nMaxCol - 1];
                if ( mmToPt(x + w) + scrollX > lastCol.left ) {
                    response.result = false;
                    response.x = ptToMm( lastCol.left - (mmToPt(x + w) + scrollX) );
                    result = true;
                }
            }
            return result;
        }

        function isMaxRow() {
            var result = false;
            if ( worksheet.rows.length >= gc_nMaxRow ) {
                var lastRow = worksheet.rows[gc_nMaxRow - 1];
                if ( mmToPt(y + h) + scrollY > lastRow.top ) {
                    response.result = false;
                    response.y = ptToMm( lastRow.top - (mmToPt(y + h) + scrollY) );
                    result = true;
                }
            }
            return result;
        }
        //

        // выход за границу справа
        if ( x + w > right ) {
            var scrollX = scrollOffset.getX();
            var foundCol = worksheet._findColUnderCursor(mmToPt(x + w) + scrollX, true);
            while ( foundCol == null ) {
                if ( isMaxCol() )
                    break;
                worksheet.expandColsOnScroll(true);
                worksheet.handlers.trigger("reinitializeScrollX");
                foundCol = worksheet._findColUnderCursor(mmToPt(x + w) + scrollX, true);
            }
        }
        // выход за границу снизу
        if ( y + h > bottom ) {
            var scrollY = scrollOffset.getY();
            var foundRow = worksheet._findRowUnderCursor(mmToPt(y + h) + scrollY, true);
            while ( foundRow == null ) {
                if ( isMaxRow() )
                    break;
                worksheet.expandRowsOnScroll(true);
                worksheet.handlers.trigger("reinitializeScrollY");
                foundRow = worksheet._findRowUnderCursor(mmToPt(y + h) + scrollY, true);
            }
        }

        return response;
    };

    _this.setGraphicObjectLockState = function(id, state) {

        for (var i = 0; i < aObjects.length; i++) {
            if ( id == aObjects[i].graphicObject.Id ) {
                aObjects[i].graphicObject.lockType = state;
                break;
            }
        }
    };

    _this.resetLockedGraphicObjects = function() {

        for (var i = 0; i < aObjects.length; i++) {
            aObjects[i].graphicObject.lockType = c_oAscLockTypes.kLockTypeNone;
        }
    };

    _this.tryResetLockedGraphicObject = function(id) {

        var bObjectFound = false;
        for (var i = 0; i < aObjects.length; i++) {
            if ( aObjects[i].graphicObject.Id == id ) {
                aObjects[i].graphicObject.lockType = c_oAscLockTypes.kLockTypeNone;
                bObjectFound = true;
                break;
            }
        }
        return bObjectFound;
    };

    _this.setScrollOffset = function() {
        /*if ( shapeCtx && shapeOverlayCtx && autoShapeTrack ) {
         for (var i = 0; i < _this.drawingArea.frozenPlaces.length; i++) {
         _this.drawingArea.frozenPlaces[i].setTransform(shapeCtx, shapeOverlayCtx, autoShapeTrack);
         }
         }*/
    };

    _this.getDrawingCanvas = function() {
        return { shapeCtx: shapeCtx, shapeOverlayCtx: shapeOverlayCtx, autoShapeTrack: autoShapeTrack, trackOverlay: trackOverlay };
    };

    _this.convertMetric = function(val, from, to) {
        /* Параметры конвертирования (from/to)
         0 - px, 1 - pt, 2 - in, 3 - mm
         */
        return val * ascCvtRatio(from, to);
    };

    _this.getSelectedGraphicObjects = function() {
        return _this.controller.selectedObjects;
    };

    _this.selectedGraphicObjectsExists = function() {
        return _this.controller.selectedObjects.length > 0;
    };

    _this.loadImageRedraw = function(imageUrl) {

        var _image = api.ImageLoader.LoadImage(imageUrl, 1);

        if (null != _image) {
            imageLoaded(_image);
        }
        else {
            _this.asyncImageEndLoaded = function(_image) {
                imageLoaded(_image);
                _this.asyncImageEndLoaded = null;
            }
        }

        function imageLoaded(_image) {
            if ( !_image.Image ) {
                worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
            }
            else
                _this.showDrawingObjects(true);
        }
    };

    _this.getOriginalImageSize = function() {

        var selectedObjects = _this.controller.selectedObjects;
        if ( (selectedObjects.length == 1) && selectedObjects[0].isImage() ) {

            var imageUrl = selectedObjects[0].getImageUrl();

            var _image = api.ImageLoader.map_image_index[getFullImageSrc(imageUrl)];
            if (_image != undefined && _image.Image != null && _image.Status == ImageLoadStatus.Complete) {

                var _w = 1, _h = 1;
                var bIsCorrect = false;
                if (_image.Image != null) {

                    bIsCorrect = true;
                    _w = Math.max( pxToMm(_image.Image.width), 1 );
                    _h = Math.max( pxToMm(_image.Image.height), 1 );
                }

                return new asc_CImageSize( _w, _h, bIsCorrect);
            }
        }
        return new asc_CImageSize( 50, 50, false );
    };

    _this.sendGraphicObjectProps = function() {
        if ( worksheet )
            worksheet.handlers.trigger("selectionChanged", worksheet.getSelectionInfo());
    };

    _this.setGraphicObjectProps = function(props) {

        var objectProperties = props;

        if ( !isNullOrEmptyString(objectProperties.ImageUrl) ) {
            var _img = api.ImageLoader.LoadImage(objectProperties.ImageUrl, 1)

            if (null != _img) {
                _this.controller.setGraphicObjectProps( objectProperties );
            }
            else {
                _this.asyncImageEndLoaded = function(_image) {
                    _this.controller.setGraphicObjectProps( objectProperties );
                    _this.asyncImageEndLoaded = null;
                }
            }
        }
        else if ( objectProperties.ShapeProperties && objectProperties.ShapeProperties.fill && objectProperties.ShapeProperties.fill.fill &&
            !isNullOrEmptyString(objectProperties.ShapeProperties.fill.fill.url) ) {

            var _img = api.ImageLoader.LoadImage(objectProperties.ShapeProperties.fill.fill.url, 1);
            if ( null != _img ) {
                _this.controller.setGraphicObjectProps( objectProperties );
            }
            else {
                _this.asyncImageEndLoaded = function(_image) {
                    _this.controller.setGraphicObjectProps( objectProperties );
                    _this.asyncImageEndLoaded = null;
                }
            }
        }
        else {
            objectProperties.ImageUrl = null;
            _this.controller.setGraphicObjectProps( objectProperties );
        }

        _this.sendGraphicObjectProps();
    };

    _this.showChartSettings = function() {
        api.wb.handlers.trigger("asc_onShowChartDialog", true);
    };

    _this.setDrawImagePlaceParagraph = function(element_id, props) {
        _this.drawingDocument.InitGuiCanvasTextProps(element_id);
        _this.drawingDocument.DrawGuiCanvasTextProps(props);
    };

    //-----------------------------------------------------------------------------------
    // Graphic object mouse & keyboard events
    //-----------------------------------------------------------------------------------

    _this.graphicObjectMouseDown = function(e, x, y) {
        var offsets = _this.drawingArea.getOffsets(x, y);
        if ( offsets )
            _this.controller.onMouseDown( e, pxToMm(x - offsets.x), pxToMm(y - offsets.y) );
    };

    _this.graphicObjectMouseMove = function(e, x, y) {
        e.IsLocked = e.isLocked;

        var offsets = _this.drawingArea.getOffsets(x, y);
        if ( offsets )
            _this.controller.onMouseMove( e, pxToMm(x - offsets.x), pxToMm(y - offsets.y) );
    };

    _this.graphicObjectMouseUp = function(e, x, y) {
        var offsets = _this.drawingArea.getOffsets(x, y);
        if ( offsets )
            _this.controller.onMouseUp( e, pxToMm(x - offsets.x), pxToMm(y - offsets.y) );
    };

    // keyboard

    _this.graphicObjectKeyDown = function(e) {
        return _this.controller.onKeyDown( e );
    };

    _this.graphicObjectKeyPress = function(e) {

        e.KeyCode = e.keyCode;
        e.CtrlKey = e.metaKey || e.ctrlKey;
        e.AltKey = e.altKey;
        e.ShiftKey = e.shiftKey;
        e.Which = e.which;
        return _this.controller.onKeyPress( e );
    };

    //-----------------------------------------------------------------------------------
    // Asc
    //-----------------------------------------------------------------------------------

    _this.cleanWorksheet = function() {

        // Восстанавливаем ячейки
        if ( wsCellCache.isInit ) {
            for (var i = 0; i < wsCellCache.cols.length; i++) {
                worksheet.model.setColWidth( wsCellCache.cols[i], i, i );		// Default
            }
            for (var i = 0; i < wsCellCache.rows.length; i++) {
                worksheet.model.setRowHeight( wsCellCache.rows[i], i, i );		// Default
            }
            //worksheet._initCellsArea(true);
            worksheet.changeWorksheet("update");
        }
        for (var i = 0; i < aObjects.length; i++) {
            aObjects[i].graphicObject.deleteDrawingBase();
        }
        aBoundsCheckers = [];

        worksheet._clean();
        var listRange = new Range(worksheet.model, 0, 0, worksheet.nRowsCount - 1, worksheet.nColsCount - 1);
        listRange.cleanAll();

        _this.controller.resetSelection();
        shapeCtx.m_oContext.clearRect(0, 0, shapeCtx.m_lWidthPix, shapeCtx.m_lHeightPix);
        shapeOverlayCtx.m_oContext.clearRect(0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix);
        _this.OnUpdateOverlay();
        History.Clear();
    };

    _this.getWordChartObject = function() {
        for (var i = 0; i < aObjects.length; i++) {
            var drawingObject = aObjects[i];

            if ( drawingObject.isChart() ) {
                var chart = new asc_CChartBinary(drawingObject.graphicObject);
                _this.cleanWorksheet();
                return chart;
            }
        }
        return null;
    };

    _this.getAscChartObject = function() {

      //  if ( !api.chartStyleManager.isReady() || !api.chartPreviewManager.isReady() ) {
      //      api.chartStyleManager.init();
      //      api.chartPreviewManager.init();
      //      _this.callTrigger("asc_onUpdateChartStyles");
      //  }

      // if ( api.isChartEditor ) {
      //     if ( aObjects.length && aObjects[0].isChart() ) {
      //         aObjects[0].graphicObject.syncAscChart();
      //         return new asc_CChart(aObjects[0].graphicObject.chart);
      //     }
      // }

        /*if($("#chartPropsMenuDiv").length > 0) //TODO: убрать как будет всё готово в меню
        {
            var chart = _this.controller.getAscChartObject();
            if ( !chart ) {

                History.Create_NewPoint();
                chart = new asc_CChart();
                chart.header.title = api.chartTranslate.title;
                chart.xAxis.title = api.chartTranslate.xAxis;
                chart.yAxis.title = api.chartTranslate.yAxis;

                chart.range.interval = function() {
                    var result = "";
                    if (worksheet) {
                        var selectedRange = worksheet.getSelectedRange();
                        if (selectedRange) {
                            var box = selectedRange.getBBox0();

                            // Rows/Columns
                            if ( box.r2 - box.r1 < box.c2 - box.c1 ) {
                                chart.range.rows = true;
                                chart.range.columns = false;
                            }
                            else {
                                chart.range.rows = false;
                                chart.range.columns = true;
                            }

                            var startCell = new CellAddress(box.r1, box.c1, 0);
                            var endCell = new CellAddress(box.r2, box.c2, 0);

                            if (startCell && endCell) {
		 						result = parserHelp.get3DRef(worksheet.model.sName, startCell.getID() === endCell.getID() ?
		 							startCell.getID() : startCell.getID() + ':' + endCell.getID());
                            }
                        }
                    }
                    return result;
                }();
                chart.range.intervalObject = function() {
                    return worksheet ? worksheet.getSelectedRange() : null;
                }();
            }
            return chart;
        }   */




        var settings;
        if(api.isChartEditor)
        {
            return this.controller.getPropsFromChart(aObjects[0].graphicObject);
        }
        settings = _this.controller.getChartProps();
        if ( !settings )
        {
            settings = new asc_ChartSettings();
            var range = null;
            var selectedRange = worksheet.getSelectedRange();
            if (selectedRange)
            {
                var box = selectedRange.getBBox0();
                settings.putInColumns(!(box.r2 - box.r1 < box.c2 - box.c1));
                var startCell = new CellAddress(box.r1, box.c1, 0);
                var endCell = new CellAddress(box.r2, box.c2, 0);
                if (startCell && endCell)
                {
					range = parserHelp.get3DRef(worksheet.model.sName, startCell.getID() === endCell.getID() ?
						startCell.getID() : startCell.getID() + ':' + endCell.getID());
                }
            }
            settings.putRange(range);
            settings.putStyle(2);
            settings.putType(c_oAscChartTypeSettings.lineNormal);
            settings.putTitle(c_oAscChartTitleShowSettings.none);
            settings.putLegendPos(c_oAscChartLegendShowSettings.right);
            settings.putHorAxisLabel(c_oAscChartHorAxisLabelShowSettings.none);
            settings.putVertAxisLabel(c_oAscChartVertAxisLabelShowSettings.none);
            settings.putDataLabelsPos(c_oAscChartDataLabelsPos.none);
            settings.putHorGridLines(c_oAscGridLinesSettings.major);
            settings.putVertGridLines(c_oAscGridLinesSettings.none);
            settings.putInColumns(false);
            settings.putSeparator(",");

            var vert_axis_settings = new asc_ValAxisSettings();
            settings.putVertAxisProps(vert_axis_settings);
            vert_axis_settings.setDefault();

            var hor_axis_settings = new asc_CatAxisSettings();
            settings.putHorAxisProps(hor_axis_settings);
            hor_axis_settings.setDefault();
        }
        return settings;
    };

    //-----------------------------------------------------------------------------------
    // Selection
    //-----------------------------------------------------------------------------------

    _this.selectDrawingObjectRange = function(drawing) {

        worksheet.arrActiveChartsRanges = [];

        if(!drawing.bbox || drawing.bbox.worksheet !== worksheet.model)
            return;

        var stroke_color, fill_color;
        if(drawing.bbox.serBBox)
        {

            stroke_color = fill_color = new CColor(0, 128, 0);
            worksheet._drawElements(worksheet, worksheet._drawSelectionElement,
                asc.Range(drawing.bbox.serBBox.c1, drawing.bbox.serBBox.r1, drawing.bbox.serBBox.c2, drawing.bbox.serBBox.r2, true),
                false, 1,
                stroke_color, fill_color);
        }
        if(drawing.bbox.catBBox)
        {
            stroke_color = fill_color = new CColor(153, 0, 204);
            worksheet._drawElements(worksheet, worksheet._drawSelectionElement,
                asc.Range(drawing.bbox.catBBox.c1, drawing.bbox.catBBox.r1, drawing.bbox.catBBox.c2, drawing.bbox.catBBox.r2, true),
                false, 1,
                stroke_color, fill_color);
        }
        var BB = drawing.bbox.seriesBBox;
        var range = asc.Range(BB.c1, BB.r1, BB.c2, BB.r2, true);
        worksheet.arrActiveChartsRanges.push(range);
        worksheet.isChartAreaEditMode = true;
        worksheet._drawFormulaRanges(worksheet.arrActiveChartsRanges);
    };

    _this.unselectDrawingObjects = function() {

        if ( worksheet.isChartAreaEditMode ) {
            worksheet.isChartAreaEditMode = false;
            worksheet.arrActiveChartsRanges = [];
        }
        _this.controller.resetSelectionState();
        _this.OnUpdateOverlay();
    };

    _this.getDrawingObject = function(id) {

        for (var i = 0; i < aObjects.length; i++) {
            if (aObjects[i].graphicObject.Id == id)
                return aObjects[i];
        }
        return null;
    };

    _this.getGraphicSelectionType = function(id) {

        for ( var i = 0; i < aObjects.length; i++ ) {
            var obj = aObjects[i];
            if ( obj.graphicObject.Id == id ) {
                if ( obj.isChart() ) {
                    if ( _this.controller.selection.chartSelection && _this.controller.selection.chartSelection.textSelection)
                        return c_oAscSelectionType.RangeChartText;
                    return c_oAscSelectionType.RangeChart;
                }

                if ( obj.graphicObject.isImage() )
                    return c_oAscSelectionType.RangeImage;

                if ( obj.graphicObject.isShape() || obj.graphicObject.isGroup() ) {
                    if ( _this.controller.selection.textSelection )
                        return c_oAscSelectionType.RangeShapeText;
                    return c_oAscSelectionType.RangeShape;
                }
            }
        }
        return undefined;
    };

    //-----------------------------------------------------------------------------------
    // Position
    //-----------------------------------------------------------------------------------

    _this.setGraphicObjectLayer = function(layerType) {
        _this.controller.setGraphicObjectLayer(layerType);
    };

    _this.saveSizeDrawingObjects = function() {

        for (var i = 0; i < aObjects.length; i++) {
            var obj = aObjects[i];

            obj.size.width = obj.getWidthFromTo();
            obj.size.height = obj.getHeightFromTo();
        }
    };

    _this.updateSizeDrawingObjects = function() {

        for (var i = 0; i < aObjects.length; i++) {
            var drawingObject = aObjects[i];

            var coords = _this.coordsManager.calculateCoords(drawingObject.from);
            //var cellTo = _this.coordsManager.calculateCell(coords.x + drawingObject.size.width, coords.y + drawingObject.size.height);
            var cellTo = _this.drawingArea.calculateCell(coords.x + drawingObject.size.width, coords.y + drawingObject.size.height);
            drawingObject.to.col = cellTo.col;
            drawingObject.to.colOff = cellTo.colOff;
            drawingObject.to.row = cellTo.row;
            drawingObject.to.rowOff = cellTo.rowOff;

            // Update graphic object
            CheckSpPrXfrm(drawingObject.graphicObject);
            drawingObject.graphicObject.spPr.xfrm.setOffX( pxToMm(coords.x));
            drawingObject.graphicObject.spPr.xfrm.setOffY( pxToMm(coords.y) );
            _this.controller.recalculate();
        }
        _this.showDrawingObjects(true);
    };

    _this.checkCursorDrawingObject = function(x, y) {

        var offsets = _this.drawingArea.getOffsets(x, y);
        if ( offsets ) {
            var objectInfo = { cursor: null, id: null, object: null };
            var graphicObjectInfo = _this.controller.isPointInDrawingObjects( pxToMm(x - offsets.x), pxToMm(y - offsets.y) );

            if ( graphicObjectInfo && graphicObjectInfo.objectId ) {
                objectInfo.id = graphicObjectInfo.objectId;
                objectInfo.object = _this.getDrawingBase(graphicObjectInfo.objectId);
                objectInfo.cursor = graphicObjectInfo.cursorType;
                objectInfo.hyperlink = graphicObjectInfo.hyperlink;

                return objectInfo;
            }
        }
        return null;
    };

    _this.getPositionInfo = function(x, y) {

        var info = new CCellObjectInfo();

        var tmp = worksheet._findColUnderCursor(pxToPt(x), true);
        if (tmp) {
            info.col = tmp.col;
            info.colOff = pxToMm(x - worksheet.getCellLeft(info.col, 0));
        }
        tmp = worksheet._findRowUnderCursor(pxToPt(y), true);
        if (tmp) {
            info.row = tmp.row;
            info.rowOff = pxToMm(y - worksheet.getCellTop(info.row, 0));
        }

        return info;
    };

    //-----------------------------------------------------------------------------------
    // File Dialog
    //-----------------------------------------------------------------------------------

    _this.showImageFileDialog = function(documentId, documentFormat) {

        if ( _this.isViewerMode() )
            return;

        var frameWindow = GetUploadIFrame();
        var content = '<html><head></head><body><form action="' + g_sUploadServiceLocalUrl + '?sheetId=' + worksheet.model.getId() + '&key=' + documentId + '" method="POST" enctype="multipart/form-data"><input id="apiiuFile" name="apiiuFile" type="file" accept="image/*" size="1"><input id="apiiuSubmit" name="apiiuSubmit" type="submit" style="display:none;"></form></body></html>';
        frameWindow.document.open();
        frameWindow.document.write(content);
        frameWindow.document.close();

        var fileName = frameWindow.document.getElementById("apiiuFile");
        var fileSubmit = frameWindow.document.getElementById("apiiuSubmit");

        fileName.onchange = function(e) {
            var bNeedSubmit = true;
            if(e && e.target && e.target.files)
            {
                var nError = ValidateUploadImage(e.target.files);
                if(c_oAscServerError.NoError != nError)
                {
                    bNeedSubmit = false;
                    worksheet.model.workbook.handlers.trigger("asc_onError", api.asc_mapAscServerErrorToAscError(nError), c_oAscError.Level.NoCritical);
                }
            }
            if(bNeedSubmit)
            {
                worksheet.model.workbook.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                fileSubmit.click();
            }
        };

        if (window.opera != undefined)
            setTimeout(function() { fileName.click(); }, 0);
        else
            fileName.click();
    };

    //-----------------------------------------------------------------------------------
    // Shapes controller
    //-----------------------------------------------------------------------------------


    //-----------------------------------------------------------------------------------
    // Private Misc Methods
    //-----------------------------------------------------------------------------------

    function guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    function ascCvtRatio(fromUnits, toUnits) {
        return asc.getCvtRatio( fromUnits, toUnits, drawingCtx.getPPIX() );
    }

    function setCanvasZIndex(canvas, value) {
        if (canvas && (value >= 0) && (value <= 1))
            canvas.globalAlpha = value;
    }

    function emuToPx(emu) {
        var tmp = emu * 20 * 96 / 2.54 / 72 / 100 / 1000;
        return tmp;
    }

    function pxToEmu(px) {
        var tmp = px * 2.54 * 72 * 100 * 1000 / 20 / 96;
        return tmp;
    }

    function pxToPt(val) {
        var tmp = val * ascCvtRatio(0, 1);
        return tmp;
    }

    function ptToPx(val) {
        var tmp = val * ascCvtRatio(1, 0);
        return tmp;
    }

    function ptToMm(val) {
        var tmp = val * ascCvtRatio(1, 3);
        return tmp;
    }

    function mmToPx(val) {
        var tmp = val * ascCvtRatio(3, 0);
        return tmp;
    }

    function mmToPt(val) {
        var tmp = val * ascCvtRatio(3, 1);
        return tmp;
    }

    function pxToMm(val) {
        var tmp = val * ascCvtRatio(0, 3);
        return tmp;
    }
}

//-----------------------------------------------------------------------------------
// Universal object locker/checker
//-----------------------------------------------------------------------------------

function ObjectLocker(ws) {
    var asc = window["Asc"];
    var asc_applyFunction = asc.applyFunction;

    var _t = this;
    _t.bLock = true;
    var aObjectId = [];
    var worksheet = ws;

    _t.reset = function() {
        _t.bLock = true;
        aObjectId = [];
    };

    _t.addObjectId = function(id) {
        aObjectId.push(id);
    };

    // For array of objects -=Use reset before use=-
    _t.checkObjects = function(callback) {

        function callbackEx(result) {
            //if ( worksheet )
            //	worksheet._drawCollaborativeElements(true);
            if ( callback )
                callback(result);
        }

        if ( !aObjectId.length || (false === worksheet.collaborativeEditing.isCoAuthoringExcellEnable()) ) {
            // Запрещено совместное редактирование
            asc_applyFunction(callbackEx, true);
            return;
        }

        var sheetId = worksheet.model.getId();
        worksheet.collaborativeEditing.onStartCheckLock();
        for ( var i = 0; i < aObjectId.length; i++ ) {

            var lockInfo = worksheet.collaborativeEditing.getLockInfo( c_oAscLockTypeElem.Object, /*subType*/null, sheetId, aObjectId[i] );

            if ( false === worksheet.collaborativeEditing.getCollaborativeEditing() ) {
                // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
                asc_applyFunction(callbackEx, true);
                callback = undefined;
            }
            if ( false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine) ) {
                // Редактируем сами, проверяем дальше
                continue;
            }
            else if ( false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther) ) {
                // Уже ячейку кто-то редактирует
                asc_applyFunction(callbackEx, false);
                return;
            }
            if ( _t.bLock )
                worksheet.collaborativeEditing.addCheckLock(lockInfo);
        }
        if ( _t.bLock )
            worksheet.collaborativeEditing.onEndCheckLock(callbackEx);
        else
            asc_applyFunction(callbackEx, true);
    }
}

function ClickCounter() {

    var _this = this;
    _this.x = 0;
    _this.y = 0;
    _this.button = 0;
    _this.time = 0;
    _this.clickCount = 0;
    _this.log = false;

    _this.mouseDownEvent = function(x, y, button) {

        var currTime = getCurrentTime();
        if ( (_this.button === button) && (_this.x === x) && (_this.y === y) && (currTime - _this.time < 500) ) {
            _this.clickCount = _this.clickCount + 1;
            _this.clickCount = Math.min(_this.clickCount, 3);
        }
        else
            _this.clickCount = 1;

        if ( _this.log ) {
            console.log("-----");
            console.log("x-> " + _this.x + " : " + x);
            console.log("y-> " + _this.y + " : " + y);
            console.log("Time: " + (currTime - _this.time));
            console.log("Count: " + _this.clickCount);
            console.log("");
        }
        _this.time = currTime;
    };

    _this.mouseMoveEvent = function(x, y) {
        if ( (_this.x != x) || (_this.y != y) ) {
            _this.x = x;
            _this.y = y;
            _this.clickCount = 0;

            if ( _this.log )
                console.log("Reset counter");
        }
    };

    _this.getClickCount = function() {
        return _this.clickCount;
    }
}

function CoordsManager(ws, bLog) {

    var _t = this;
    var log = bLog;
    var worksheet = ws;

    _t.calculateCell = function(x, y) {

        var cell = new CCellObjectInfo();

        var _x = x + worksheet.getCellLeft(0, 0);
        var _y = y + worksheet.getCellTop(0, 0);

        var xPt = worksheet.objectRender.convertMetric(_x, 0, 1);
        var yPt = worksheet.objectRender.convertMetric(_y, 0, 1);

        var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
        var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;

        /* Проверки на максимум в листе */
        function isMaxCol() {
            var result = false;
            if ( worksheet.cols.length >= gc_nMaxCol )
                result = true;
            return result;
        }

        function isMaxRow() {
            var result = false;
            if ( worksheet.rows.length >= gc_nMaxRow )
                result = true;
            return result;
        }
        //

        var delta = 0;
        var what = roundPlus(xPt - offsetX, 3);
        var col = worksheet._findColUnderCursor( what, true );
        while (col == null) {
            if ( isMaxCol() ) {
                col = worksheet._findColUnderCursor( worksheet.cols[gc_nMaxCol - 1].left - 1, true );
                break;
            }
            worksheet.expandColsOnScroll(true);
            worksheet.handlers.trigger("reinitializeScrollX");
            col = worksheet._findColUnderCursor( what + delta, true );
            if ( what < 0 )
                delta++;
        }
        cell.col = col.col;
        cell.colOffPx = Math.max(0, _x - worksheet.getCellLeft(cell.col, 0));
        cell.colOff = worksheet.objectRender.convertMetric(cell.colOffPx, 0, 3);

        delta = 0;
        what = roundPlus(yPt - offsetY, 3);
        var row = worksheet._findRowUnderCursor( what, true );
        while (row == null) {
            if ( isMaxRow() ) {
                row = worksheet._findRowUnderCursor( worksheet.rows[gc_nMaxRow - 1].top - 1, true );
                break;
            }
            worksheet.expandRowsOnScroll(true);
            worksheet.handlers.trigger("reinitializeScrollY");
            row = worksheet._findRowUnderCursor( what + delta, true );
            if ( what < 0 )
                delta++;
        }
        cell.row = row.row;
        cell.rowOffPx = Math.max(0, _y - worksheet.getCellTop(cell.row, 0));
        cell.rowOff = worksheet.objectRender.convertMetric(cell.rowOffPx, 0, 3);

        return cell;
    };

    _t.calculateCoords = function(cell) {

        var coords = { x: 0, y: 0 };

        if ( cell ) {
            coords.y = worksheet.getCellTop(cell.row, 0) + worksheet.objectRender.convertMetric(cell.rowOff, 3, 0) - worksheet.getCellTop(0, 0);
            coords.x = worksheet.getCellLeft(cell.col, 0) + worksheet.objectRender.convertMetric(cell.colOff, 3, 0) - worksheet.getCellLeft(0, 0);
        }
        return coords;
    }
}

//{ Common

function writeToBinaryDocContent(docContent, w)
{
    w.WriteBool(docContent.TurnOffInnerWrap);
    w.WriteBool(docContent.Split);
    var Count = docContent.Content.length;
    w.WriteLong(Count);
    for ( var Index = 0; Index < Count; Index++ )
        writeToBinaryParagraph(docContent.Content[Index], w);
}

function readFromBinaryDocContent(docContent, r)
{
    docContent.TurnOffInnerWrap   = r.GetBool();
    docContent.Split              = r.GetBool();
    var Count = r.GetLong();
    docContent.Content = [];
    for ( var Index = 0; Index < Count; Index++ )
    {
        var p = new Paragraph(docContent.DrawingDocument, docContent, 0, 0, 0, 0, 0);
        readFromBinaryParagraph(p, r);
        docContent.Content.push(p);
    }
}

function writeToBinaryParagraph(p, w)
{
    p.Pr.Write_ToBinary( w );

    //p.TextPr.writeToBinary(w);

    var StartPos = w.GetCurPosition();
    w.Skip( 4 );

    var Len = p.Content.length;
    var Count  = 0;
    for ( var Index = 0; Index < Len; Index++ )
    {
        var Item = p.Content[Index];
        if ( true === Item.Is_RealContent())
        {
            writeToBinaryParagraphContent(Item, w);
            w.WriteLong(Index);
            Count++;
        }
    }

    var EndPos = w.GetCurPosition();
    w.Seek( StartPos );
    w.WriteLong( Count );
    w.Seek( EndPos );
}

function readFromBinaryParagraph(p, r)
{
    p.Pr = new CParaPr();
    p.Pr.Read_FromBinary( r );

    p.TextPr = new ParaTextPr();
    //p.TextPr.readFromBinary(r);

    p.Content = [];
    var Count = r.GetLong();
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Element = readFromBinaryParagraphContent(r);
        var index_test = r.GetLong();
        if ( null != Element )
            p.Content.push( Element );
    }
}

function writeToBinaryParagraphContent(Element, w)
{
    var ElementType = Element.Type;
    // w.WriteLong(ElementType);
    switch ( ElementType )
    {
        case para_TextPr            :
            // case para_HyperlinkStart    :
        {
            w.WriteLong(ElementType);
            Element.Value.Write_ToBinary(w);
            break;
        }
        case para_HyperlinkStart:
        {
            w.WriteLong( Element.Type );
            w.WriteString2( Element.Id );
            w.WriteString2( Element.Value );
            w.WriteString2( Element.ToolTip );
            break;
        }
        case para_Text                  :
        case para_Space                 :
        case para_End                   :
        case para_NewLine               :
        case para_NewLineRendered       :
        case para_InlineBreak           :
        case para_PageBreakRendered     :
        case para_Empty                 :
        case para_Numbering             :
        case para_Tab                   :
        case para_PageNum               :
        case para_FlowObjectAnchor      :
        case para_HyperlinkEnd          :
        case para_CommentStart          :
        case para_CommentEnd            :
        case para_PresentationNumbering :
            Element.Write_ToBinary(w);
            break;
    }
    return Element;
}

function readFromBinaryParagraphContent(r)
{
    var ElementType = r.GetLong();

    var Element = null;
    switch ( ElementType )
    {
        case para_TextPr            :
            // case para_Drawing           :
            // case para_HyperlinkStart    :
        {
            Element = new ParaTextPr();
            Element.Value = new CTextPr();
            Element.Value.Read_FromBinary(r);
            return Element;
        }
        case para_HyperlinkStart:
        {
            Element = new ParaHyperlinkStart();
            Element.Id  = r.GetString2();
            Element.Value =  r.GetString2();
            Element.ToolTip = r.GetString2();
            return Element;
        }
        case para_Text              : Element = new ParaText();              break;
        case para_Space             : Element = new ParaSpace();             break;
        case para_End               : Element = new ParaEnd();               break;
        case para_NewLine           : Element = new ParaNewLine();           break;
        case para_NewLineRendered   : Element = new ParaNewLineRendered();   break;
        case para_InlineBreak       : Element = new ParaInlineBreak();       break;
        case para_PageBreakRendered : Element = new ParaPageBreakRenderer(); break;
        case para_Empty             : Element = new ParaEmpty();             break;
        case para_Numbering         : Element = new ParaNumbering();         break;
        case para_Tab               : Element = new ParaTab();               break;
        case para_PageNum           : Element = new ParaPageNum();           break;
        case para_FlowObjectAnchor  : Element = new ParaFlowObjectAnchor();  break;
        case para_HyperlinkEnd      : Element = new ParaHyperlinkEnd();      break;
        case para_CommentStart      : Element = new ParaCommentStart();      break;
        case para_CommentEnd        : Element = new ParaCommentEnd();        break;
        case para_PresentationNumbering : Element = new ParaPresentationNumbering(); break;
    }

    if ( null != Element )
        Element.Read_FromBinary(r);

    return Element;
}


var CARD_DIRECTION_N = 0;
var CARD_DIRECTION_NE = 1;
var CARD_DIRECTION_E = 2;
var CARD_DIRECTION_SE = 3;
var CARD_DIRECTION_S = 4;
var CARD_DIRECTION_SW = 5;
var CARD_DIRECTION_W = 6;
var CARD_DIRECTION_NW = 7;

var CURSOR_TYPES_BY_CARD_DIRECTION = [];
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_N]  = "n-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NE] = "ne-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_E]  = "e-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SE] = "se-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_S]  = "s-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SW] = "sw-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_W]  = "w-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NW] = "nw-resize";

function CreateParagraphContent(s)
{
    if(s != " ")
        return new ParaText(s);
    return new ParaSpace(1);
}

function getTextString(docContent)
{
    var ret = "";
    for(var i = 0; i < docContent.Content.length; ++i)
    {
        for(var j = 0; j < docContent.Content[i].Content.length; ++j)
        {
            if(docContent.Content[i].Content[j].Type === para_Text)
                ret += docContent.Content[i].Content[j].Value;
            if(docContent.Content[i].Content[j].Type === para_Space)
                ret += " ";
        }
    }
    return ret;
}
//}