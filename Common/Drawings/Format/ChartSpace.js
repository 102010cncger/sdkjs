"use strict";

var EFFECT_NONE = 0;
var EFFECT_SUBTLE = 1;
var EFFECT_MODERATE = 2;
var EFFECT_INTENSE = 3;

var CHART_STYLE_MANAGER = null;

function BBoxInfo(worksheet, bbox)
{
    this.worksheet = worksheet;
    if(window["Asc"] && typeof window["Asc"].Range === "function")
    {
        this.bbox = window["Asc"].Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2, false);
    }
    else
    {
        this.bbox = bbox;
    }
}

BBoxInfo.prototype =
{
    checkIntersection: function(bboxInfo)
    {
        if(this.worksheet !== bboxInfo.worksheet)
        {
            return false;
        }
        return this.bbox.isIntersect(bboxInfo.bbox);
    }
};

function CreateUnifillSolidFillSchemeColorByIndex(index)
{
    var ret =  new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(new CUniColor());
    ret.fill.color.setColor(new CSchemeColor());
    ret.fill.color.color.setId(index);
    return ret;
}

function CChartStyleManager()
{
    this.styles = [];
    ExecuteNoHistory(
        function()
        {
            var DefaultDataPointPerDataPoint =
                [
                    [
                        CreateUniFillSchemeColorWidthTint(8, 0.885),
                        CreateUniFillSchemeColorWidthTint(8, 0.55),
                        CreateUniFillSchemeColorWidthTint(8, 0.78),
                        CreateUniFillSchemeColorWidthTint(8, 0.925),
                        CreateUniFillSchemeColorWidthTint(8, 0.7),
                        CreateUniFillSchemeColorWidthTint(8, 0.3)
                    ],
                    [
                        CreateUniFillSchemeColorWidthTint(0, 0),
                        CreateUniFillSchemeColorWidthTint(1, 0),
                        CreateUniFillSchemeColorWidthTint(2, 0),
                        CreateUniFillSchemeColorWidthTint(3, 0),
                        CreateUniFillSchemeColorWidthTint(4, 0),
                        CreateUniFillSchemeColorWidthTint(5, 0)
                    ],
                    [
                        CreateUniFillSchemeColorWidthTint(0, -0.5),
                        CreateUniFillSchemeColorWidthTint(1, -0.5),
                        CreateUniFillSchemeColorWidthTint(2, -0.5),
                        CreateUniFillSchemeColorWidthTint(3, -0.5),
                        CreateUniFillSchemeColorWidthTint(4, -0.5),
                        CreateUniFillSchemeColorWidthTint(5, -0.5)
                    ],
                    [
                        CreateUniFillSchemeColorWidthTint(8, 0.05),
                        CreateUniFillSchemeColorWidthTint(8, 0.55),
                        CreateUniFillSchemeColorWidthTint(8, 0.78),
                        CreateUniFillSchemeColorWidthTint(8, 0.15),
                        CreateUniFillSchemeColorWidthTint(8, 0.7),
                        CreateUniFillSchemeColorWidthTint(8, 0.3)
                    ]
                ];
            var s = DefaultDataPointPerDataPoint;
            var f = CreateUniFillSchemeColorWidthTint;
            this.styles[0] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_NONE, [], 3, s[0], 7);
            this.styles[1] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_NONE, [], 3, s[1], 7);
            for(var i = 2; i < 8; ++i)
            {
                this.styles[i] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, [f(i - 2,0)], EFFECT_SUBTLE, EFFECT_NONE, [], 3, [f(i - 2,0)], 7);
            }
            this.styles[8] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, s[0], 9);
            this.styles[9] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, s[1], 9);
            for(i = 10; i < 16; ++i)
            {
                this.styles[i] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, [f(i-10,0)], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, [f(i-10,0)], 9);
            }
            this.styles[16] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[0], EFFECT_SUBTLE, EFFECT_NONE,  [], 5, s[0], 9);
            this.styles[17] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[1], EFFECT_INTENSE, EFFECT_NONE,  [], 5, s[1], 9);
            for(i = 18; i < 24; ++i)
            {
                this.styles[i] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, [f(i-18,0)], EFFECT_SUBTLE, EFFECT_NONE,  [], 5, [f(i-18,0)], 9);
            }
            this.styles[24] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[0], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, s[0], 13);
            this.styles[25] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[1], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, s[1], 13);
            for(i = 26; i < 32; ++i)
            {
                this.styles[i] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, [f(i-26,0)], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, s[1], 13);
            }
            this.styles[32] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(8, -0.5)], 5, s[0], 9);
            this.styles[33] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_SUBTLE,  s[2], 5, s[1], 9);
            for(i = 34; i < 40; ++i)
            {
                this.styles[i] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, [f(i - 34, 0)], EFFECT_SUBTLE, EFFECT_SUBTLE, [f(i-34, -0.5)], 5, [f(i-34, 0)], 9);
            }
            this.styles[40] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[3], EFFECT_SUBTLE, EFFECT_NONE, [], 5, s[3], 9);
            this.styles[41] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[1], EFFECT_INTENSE, EFFECT_NONE, [], 5, s[1], 9);
            for(i = 42; i < 48; ++i)
            {
                this.styles[i] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, [f(i-42, 0)], EFFECT_SUBTLE, EFFECT_NONE, [], 5, [f(i-42, 0)], 9);
            }

            this.defaultLineStyles = [];
            this.defaultLineStyles[0] = new ChartLineStyle(f(15, 0), f(15, 0.5), f(15, 0.75), f(15, 0), EFFECT_SUBTLE);
            for(i = 0; i < 32; ++i)
            {
                this.defaultLineStyles[i] = this.defaultLineStyles[0];
            }
            this.defaultLineStyles[32] = new ChartLineStyle(f(8, 0), f(15, 0.5), f(8, 0.75), f(8, 0), EFFECT_SUBTLE);
            this.defaultLineStyles[33] = this.defaultLineStyles[32];
            this.defaultLineStyles[34] = new ChartLineStyle(f(8, 0), f(15, 0.5), f(8, 0.75), f(8, -0.25), EFFECT_SUBTLE);
            for(i = 35; i < 40; ++i)
            {
                this.defaultLineStyles[i] = this.defaultLineStyles[34];
            }
            this.defaultLineStyles[40] = new ChartLineStyle(f(8, 0), f(15, 0.9), f(12, 0), f(12, 0), EFFECT_NONE);
            for(i = 41; i < 48; ++i)
            {
                this.defaultLineStyles[i] = this.defaultLineStyles[40];
            }
        },
        this, []);
}

CChartStyleManager.prototype =
{
    getStyleByIndex: function(index)
    {
        if(isRealNumber(index))
        {
            return this.styles[(index - 1) % 48];
        }
        return this.styles[1];
    },

    getDefaultLineStyleByIndex: function(index)
    {
        if(isRealNumber(index))
        {
            return this.defaultLineStyles[(index - 1) % 48];
        }
        return this.defaultLineStyles[2];
    }
};

function ChartLineStyle(axisAndMajorGridLines, minorGridlines, chartArea, otherLines, floorChartArea)
{
    this.axisAndMajorGridLines = axisAndMajorGridLines;
    this.minorGridlines = minorGridlines;
    this.chartArea = chartArea;
    this.otherLines = otherLines;
    this.floorChartArea = floorChartArea;
}

function CChartStyle(effect, fill1, fill2, fill3, line1, line2, line3, line4, markerSize)
{
    this.effect = effect;
    this.fill1 = fill1;
    this.fill2 = fill2;
    this.fill3 = fill3;

    this.line1 = line1;
    this.line2 = line2;
    this.line3 = line3;
    this.line4 = line4;

    this.markerSize = markerSize;
}


function CreateUniFillSchemeColorWidthTint(schemeColorId, tintVal)
{
    return ExecuteNoHistory(
        function(schemeColorId, tintVal)
        {
            return CreateUniFillSolidFillWidthTintOrShade(CreateUnifillSolidFillSchemeColorByIndex(schemeColorId), tintVal);
        },
        this, [schemeColorId, tintVal]);
}


var G_O_VISITED_HLINK_COLOR = CreateUniFillSolidFillWidthTintOrShade(CreateUnifillSolidFillSchemeColorByIndex(10), 0);

function addPointToMap(map, worksheet, row, col, pt)
{
    if(!Array.isArray(map[worksheet.getId()+""]))
    {
        map[worksheet.getId()+""] = [];
    }
    if(!Array.isArray(map[worksheet.getId()+""][row]))
    {
        map[worksheet.getId()+""][row] = [];
    }
    if(!Array.isArray(map[worksheet.getId()+""][row][col]))
    {
        map[worksheet.getId()+""][row][col] = [];
    }
    map[worksheet.getId()+""][row][col].push(pt);
}


function checkPointInMap(map, worksheet, row, col)
{
    if(map[worksheet.getId() + ""] && map[worksheet.getId() + ""][row] && map[worksheet.getId() + ""][row][col])
    {
        var cell = worksheet.getCell( new CellAddress(row, col, 0) );
        var pts = map[worksheet.getId() + ""][row][col];
        for(var i = 0; i < pts.length; ++i)
        {
            pts[i].setVal(cell.getValue());
        }
        return true;
    }
    else
    {
        return false;
    }
}


function CChartSpace()
{
    this.chart = null;
    this.clrMapOvr = null;
    this.date1904 = null;
    this.externalData = null;
    this.lang = null;
    this.pivotSource = null;
    this.printSettings = null;
    this.protection = null;
    this.roundedCorners = null;
    this.spPr = null;
    this.style = 2;
    this.txPr = null;
    this.userShapes = null;
    this.themeOverride = null;

    this.calculatedChart = null;
    this.transform = new CMatrix();


    this.bDeleted = true;
    this.snapArrayX = [];
    this.snapArrayY = [];


    this.bbox = null;


    this.selection =
    {
        title: null,
        legend: null,
        legendEntry: null,
        axisLbls: null,
        dataLbls: null,
        dataLbl: null,
        textSelection: null,
        plotArea: null
    };

    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0, x: 0, y: 0};
    this.parsedFromulas = [];
    this.pointsMap = {};

    this.setRecalculateInfo();


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CChartSpace.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    select: CShape.prototype.select,
    checkHitToBounds: CShape.prototype.checkHitToBounds,
    calculateSnapArrays: CShape.prototype.calculateSnapArrays,


    recalculateTextPr: function()
    {
        if(this.txPr && this.txPr.content)
        {
            this.txPr.content.Reset(0, 0, 10, 10);
            this.txPr.content.Recalculate_Page(0, true);
        }
    },

    getSelectionState: function()
    {
        var content_selection = null;
        if(this.selection.textSelection)
        {
            var content = this.selection.textSelection.getDocContent();
            if(content)
                content_selection = content.Get_SelectionState();
        }
        return {
            title:            this.selection.title,
            legend:           this.selection.legend,
            legendEntry:      this.selection.legendEntry,
            axisLbls:         this.selection.axisLbls,
            dataLbls:         this.selection.dataLbls,
            dataLbl:          this.selection.dataLbl,
            textSelection:    this.selection.textSelection,
            plotArea:         this.selection.plotArea,
            contentSelection: content_selection
        }
    },


    setSelectionState: function(state)
    {
       this.selection.title          = state.title;
       this.selection.legend         = state.legend;
       this.selection.legendEntry    = state.legendEntry;
       this.selection.axisLbls       = state.axisLbls;
       this.selection.dataLbls       = state.dataLbls;
       this.selection.dataLbl        = state.dataLbl;
       this.selection.textSelection  = state.textSelection;
       this.selection.plotArea       = state.plotArea;
       if(state.contentSelection)
       {
           if(this.selection.textSelection)
           {
               var content = this.selection.textSelection.getDocContent();
               if(content)
                   content.Set_SelectionState(state.contentSelection, state.contentSelection.length - 1);
           }
       }
    },

    resetInternalSelection: function()
    {
        if(this.selection.textSelection)
        {
            var content = this.selection.textSelection.getDocContent();
            content && content.Selection_Remove();
            this.selection.textSelection = null;
        }
    },


    getDocContent: function()
    {
        if(!this.txPr)
        {
            this.setTxPr(CreateTextBodyFromString("", this.getDrawingDocument(), this));
        }
        return this.txPr.content;
    },

    resetSelection: function()
    {
        this.resetInternalSelection();
        this.selection.title = null;
        this.selection.legend = null;
        this.selection.legendEntry = null;
        this.selection.axisLbls = null;
        this.selection.dataLbls = null;
        this.selection.dataLbl = null;
        this.selection.textSelection = null;
        this.selection.plotArea = null;
    },

    getStyles: function()
    {
        return ExecuteNoHistory(function(){

            //todo: доработать
            var styles = new CStyles();
            var style = new CStyle("dataLblStyle", null, null, null);
            var text_pr = new CTextPr();
            text_pr.FontSize = 10;
            text_pr.Unifill = CreateUnfilFromRGB(0,0,0);
            var parent_objects = this.getParentObjects();
            var theme = parent_objects.theme;

            var para_pr = new CParaPr();
            para_pr.Jc = align_Center;
            para_pr.Spacing.Before = 0.0;
            para_pr.Spacing.After = 0.0;
            para_pr.Spacing.Line = 1;
            para_pr.Spacing.LineRule = linerule_Auto;
            style.ParaPr = para_pr;

            var minor_font = theme.themeElements.fontScheme.minorFont;


            if(minor_font)
            {
                if(typeof minor_font.latin === "string" && minor_font.latin.length > 0)
                {
                    text_pr.RFonts.Ascii = {Name: minor_font.latin, Index: -1};
                }
                if(typeof minor_font.ea === "string" && minor_font.ea.length > 0)
                {
                    text_pr.RFonts.EastAsia = {Name: minor_font.ea, Index: -1};
                }
                if(typeof minor_font.cs === "string" && minor_font.cs.length > 0)
                {
                    text_pr.RFonts.CS = {Name: minor_font.cs, Index: -1};
                }

                if(typeof minor_font.sym === "string" && minor_font.sym.length > 0)
                {
                    text_pr.RFonts.HAnsi = {Name: minor_font.sym, Index: -1};
                }
            }
            style.TextPr = text_pr;

            var chart_text_pr;

            if(this.txPr
                && this.txPr.content
                && this.txPr.content.Content[0]
                && this.txPr.content.Content[0].Pr)
            {
                style.ParaPr.Merge(this.txPr.content.Content[0].Pr);
                if(this.txPr.content.Content[0].Pr.DefaultRunPr)
                {
                    chart_text_pr = this.txPr.content.Content[0].Pr.DefaultRunPr;
                    style.TextPr.Merge(chart_text_pr);
                }

            }

            if(this.txPr
                && this.txPr.content
                && this.txPr.content.Content[0]
                && this.txPr.content.Content[0].Pr)
            {
                style.ParaPr.Merge(this.txPr.content.Content[0].Pr);
                if(this.txPr.content.Content[0].Pr.DefaultRunPr)
                    style.TextPr.Merge(this.txPr.content.Content[0].Pr.DefaultRunPr);
            }
            styles.Add(style);
            return {lastId: style.Id, styles: styles};
        }, this, []);
    },

    paragraphAdd: function(paraItem, bRecalculate)
    {
        var content;
        if(paraItem.Type === para_TextPr)
        {
            if(this.selection.title && !this.selection.textSelection)
            {
                this.selection.title.checkDocContent();
                content = this.selection.title.getDocContent();
                content.Set_ApplyToAll(true);
                content.Paragraph_Add(paraItem, bRecalculate);
                content.Set_ApplyToAll(false);
            }
            else  if(this.selection.textSelection)
            {
                this.selection.textSelection.checkDocContent();
                this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
            }
            else
            {
                //TODO: другие случаи будут обработаны в след. версиях
            }
        }
        else
        {
            if(this.selection.textSelection)
            {
                this.selection.textSelection.checkDocContent();
                this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
            }
        }

    },

    selectTitle: function(title, pageIndex)
    {
        title.select(this, pageIndex);
        this.resetInternalSelection();
        this.selection.legend = null;
        this.selection.legendEntry = null;
        this.selection.axisLbls = null;
        this.selection.dataLbls = null;
        this.selection.dataLbl = null;
        this.selection.textSelection = null;
        this.selection.plotArea = null;
    },

    recalculateCurPos: DrawingObjectsController.prototype.recalculateCurPos,

    documentUpdateSelectionState: function()
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.updateSelectionState();
        }
    },

    getAllTitles: function()
    {
        var ret = [];
        if(this.chart )
        {
            if(this.chart.title)
            {
                ret.push(this.chart.title);
            }
            if(this.chart.plotArea)
            {
                if(this.chart.plotArea.catAx && this.chart.plotArea.catAx.title)
                {
                    ret.push(this.chart.plotArea.catAx.title);
                }
                if(this.chart.plotArea.valAx && this.chart.plotArea.valAx.title)
                {
                    ret.push(this.chart.plotArea.valAx.title);
                }
            }
        }
        return ret;
    },

    getMainGroup: function()
    {
        if(!isRealObject(this.group))
            return this;
        return this.group.getMainGroup();
    },

    getFill: CShape.prototype.getFill,

    getStroke: CShape.prototype.getStroke,

    changeFill: function (unifill)
    {
        if(this.recalcInfo.recalculatePenBrush)
        {
            this.recalculatePenBrush();
        }
        this.spPr.setFill(CorrectUniFill(unifill, this.brush));
    },
    setFill: function (fill) {

        this.spPr.setFill(fill);
    },

    changeLine: function (line)
    {
        if(this.recalcInfo.recalculatePenBrush)
        {
            this.recalculatePenBrush();
        }
        this.spPr.setLn(CorrectUniStroke(line, this.spPr.ln));
    },

    parseChartFormula: function(sFormula)
    {
        if(this.worksheet && typeof sFormula === "string" && sFormula.length > 0)
        {
            var ret = [];
            if(sFormula[0] === '(')
                sFormula = sFormula.slice(1);
            if(sFormula[sFormula.length-1] === ')')
                sFormula = sFormula.slice(0, -1);
            var f1 = sFormula;
            var arr_f = f1.split(",");
            var i, j;
            for(i = 0; i < arr_f.length; ++i)
            {
                var parsed_ref = parserHelp.parse3DRef(arr_f[i]);
                if(parsed_ref)
                {
                    var source_worksheet = this.worksheet.workbook.getWorksheetByName(parsed_ref.sheet);
                    if(source_worksheet)
                    {
                        var range1 = source_worksheet.getRange2(parsed_ref.range);
                        if(range1)
                        {
                            var range = range1.bbox;
                            ret.push({worksheet: source_worksheet, bbox: range});
                        }
                    }
                }
            }
            return ret;
        }
        return null;
    },

    checkBBoxIntersection: function(bbox1, bbox2)
    {
        return !(bbox1.r1 > bbox2.r2 || bbox2.r1 > bbox1.r2 || bbox1.c1 > bbox2.c2 || bbox2.c1 > bbox1.c2)
    },

    checkSeriesIntersection: function(val, bbox, worksheet)
    {
        if(val && bbox && worksheet)
        {
            var parsed_formulas = val.parsedFormulas;
            for(var i = 0; i < parsed_formulas.length; ++i)
            {
                if(parsed_formulas[i].worksheet === worksheet && this.checkBBoxIntersection(parsed_formulas[i].bbox, bbox))
                {
                    return true;
                }
            }
        }
        return false;
    },

    checkVal: function(val)
    {
        if(val)
        {
            if(val.numRef)
            {
                val.numRef.parsedFormulas = this.parseChartFormula(val.numRef.f);
            }
            if(val.strRef)
            {
                val.strRef.parsedFormulas = this.parseChartFormula(val.strRef.f);
            }
        }
    },

    recalculateSeriesFormulas: function()
    {
        this.checkSeriesRefs(this.checkVal);
    },

    checkChartIntersection: function(bbox, worksheet)
    {
        return this.checkSeriesRefs(this.checkSeriesIntersection, bbox, worksheet);
    },

    changeListName: function(val, oldName, newName)
    {
        if(val)
        {
            if(val.numRef && typeof val.numRef.f === "string")
            {
                val.numRef.setF(val.numRef.f.replace(new RegExp(oldName,'g'), newName));
            }
            if(val.strRef && typeof val.strRef.f === "string")
            {
                val.strRef.setF(val.strRef.f.replace(new RegExp(oldName,'g'), newName));
            }
        }
    },

    checkListName: function(val, oldName)
    {
        if(val)
        {
            if(val.numRef && typeof val.numRef.f === "string")
            {
                if(val.numRef.f.indexOf(oldName) > -1)
                    return true;
            }
            if(val.strRef && typeof val.strRef.f === "string")
            {
                if(val.strRef.f.indexOf(oldName) > -1)
                    return true;
            }
        }
        return false;
    },


    changeChartReferences: function(oldWorksheetName, newWorksheetName)
    {
        this.checkSeriesRefs(this.changeListName, oldWorksheetName, newWorksheetName);
    },

    checkChartReferences: function(oldWorksheetName)
    {
        return this.checkSeriesRefs(this.checkListName, oldWorksheetName);
    },

    updateChartReferences: function(oldWorksheetName, newWorksheetName)
    {
        if(this.checkChartReferences(oldWorksheetName))
        {
            this.changeChartReferences(oldWorksheetName, newWorksheetName);
            this.rebuildSeries();
        }
    },

    updateChartReferences2: function(oldWorksheetName, newWorksheetName)
    {
        if(this.checkChartReferences(oldWorksheetName))
        {
            this.changeChartReferences(oldWorksheetName, newWorksheetName);
        }
    },


    checkSeriesRefs: function(callback, bbox, worksheet)
    {
        if(this.chart && this.chart.plotArea)
        {
            var charts = this.chart.plotArea.charts, i, j, series, ser;
            for(i = 0; i < charts.length; ++i)
            {
                series = charts[i].series;
                if(charts[i].getObjectType() === historyitem_type_ScatterChart)
                {
                    for(j = 0; j < series.length; ++j)
                    {
                        ser = series[j];
                        if(callback(ser.xVal, bbox, worksheet))
                            return true;
                        if(callback(ser.yVal, bbox, worksheet))
                            return true;
                        if(callback(ser.tx, bbox, worksheet))
                            return true;
                    }
                }
                else
                {
                    for(j = 0; j < series.length; ++j)
                    {
                        ser = series[j];
                        if(callback(ser.val, bbox, worksheet))
                            return true;
                        if(callback(ser.cat, bbox, worksheet))
                            return true;
                        if(callback(ser.tx, bbox, worksheet))
                            return true;
                    }
                }

            }
        }
        return false;
    },

    rebuildVal: function(val)
    {
        if(val)
        {
            var i, j, k, parsed_formula, idx, cell, pt, bbox, worksheet;
            var buildCache = function (ref, cache, pointConstructor)
            {
                idx = 0;
                removePtsFromLit(cache);
                for(i = 0; i < ref.parsedFormulas.length; ++i)
                {
                    parsed_formula = ref.parsedFormulas[i];
                    bbox = parsed_formula.bbox;
                    worksheet = parsed_formula.worksheet;
                    for(j = bbox.r1; j <= bbox.r2; ++j)
                    {
                        for(k = bbox.c1; k <= bbox.c2; ++k)
                        {
                            if(!worksheet._getCol(i).hd  && !worksheet._getRow(row).hd)
                            {
                                cell = worksheet.getCell(new CellAddress(j, k, 0));
                                pt = new pointConstructor();
                                pt.setIdx(idx);
                                pt.setFormatCode && pt.setFormatCode(cell.getNumFormatStr());
                                pt.setVal(cell.getValue());
                                cache.addPt(pt);
                            }
                            ++idx;
                        }
                    }
                }
            };

            if(val.numRef)
            {
                if(!val.numRef.numCache)
                {
                    val.numRef.setNumCache(new CNumLit());
                }
                if(Array.isArray(val.numRef.parsedFormulas))
                {
                    buildCache(val.numRef, val.numRef.numCache, CNumericPoint);
                }
            }
            if(val.strRef)
            {
                if(!val.strRef.strCache)
                {
                    val.strRef.setStrCache(new CStrCache());
                }
                if(Array.isArray(val.strRef.parsedFormulas))
                {
                    buildCache(val.strRef, val.strRef.strCache, CStringPoint);
                }
            }
        }
    },

    clearCacheVal: function(val)
    {
        if(!val)
            return;
        if(val.numRef)
        {
            if(val.numRef.numCache)
            {
                val.numRef.setNumCache(null);
            }
        }
        if(val.strRef)
        {
            if(val.strRef.strCache)
            {
                val.strRef.setStrCache(null);
            }
        }
    },

    checkIntersectionChangedRange: function(data)
    {
        if(!data)
            return true;
        var i, j;
        if(this.seriesBBoxes)
        {
            for(i = 0; i < this.seriesBBoxes.length; ++i)
            {
                for(j = 0; j < data.length; ++j)
                {
                    if(this.seriesBBoxes[i].checkIntersection(data[j]))
                        return true;
                }
            }
        }
        if(this.seriesTitlesBBoxes)
        {
            for(i = 0; i < this.seriesTitlesBBoxes.length; ++i)
            {
                for(j = 0; j < data.length; ++j)
                {
                    if(this.seriesTitlesBBoxes[i].checkIntersection(data[j]))
                        return true;
                }
            }
        }
        if(this.catTitlesBBoxes)
        {
            for(i = 0; i < this.catTitlesBBoxes.length; ++i)
            {
                for(j = 0; j < data.length; ++j)
                {
                    if(this.catTitlesBBoxes[i].checkIntersection(data[j]))
                        return true;
                }
            }
        }
        return false;
    },

    rebuildSeries: function(data)
    {
        if( this.checkIntersectionChangedRange(data))
        {
            this.handleUpdateInternalChart();
            this.recalcInfo.recalculateReferences = true;
            this.checkSeriesRefs(this.clearCacheVal);
            this.recalculate();
        }
    },

    getTypeSubType: function()
    {
        var type = null, subtype = null;
        if(this.chart && this.chart.plotArea && this.chart.plotArea.chart)
        {
            switch (this.chart.plotArea.chart.getObjectType())
            {
                case historyitem_type_LineChart:
                {
                    type = c_oAscChartType.line;
                    break;
                }
                case historyitem_type_AreaChart:
                {
                    type = c_oAscChartType.area;
                    break;
                }
                case historyitem_type_DoughnutChart:
                {
                    type = c_oAscChartType.doughnut;
                    break;
                }
                case historyitem_type_PieChart:
                {
                    type = c_oAscChartType.pie;
                    break;
                }
                case historyitem_type_ScatterChart:
                {
                    type = c_oAscChartType.scatter;
                    break;
                }
                case historyitem_type_StockChart:
                {
                    type = c_oAscChartType.stock;
                    break;
                }
                case historyitem_type_BarChart:
                {
                    if(this.chart.plotArea.chart.barDir === BAR_DIR_BAR)
                        type = c_oAscChartType.hbar;
                    else
                        type = c_oAscChartType.bar;
                    break;
                }
            }

            if(isRealNumber(this.chart.plotArea.chart.grouping))
            {
                if(!this.chart.plotArea.chart.getObjectType() === historyitem_type_BarChart)
                {
                    switch(this.chart.plotArea.chart.grouping)
                    {
                        case GROUPING_STANDARD:
                        {
                            subtype = c_oAscChartSubType.normal;
                            break;
                        }
                        case GROUPING_STACKED:
                        {
                            subtype = c_oAscChartSubType.stacked;
                            break;
                        }
                        case GROUPING_PERCENT_STACKED:
                        {
                            subtype = c_oAscChartSubType.stackedPer;
                            break;
                        }
                    }
                }
                else
                {
                    switch(this.chart.plotArea.chart.grouping)
                    {
                        case BAR_GROUPING_CLUSTERED:
                        case BAR_GROUPING_STANDARD:
                        {
                            subtype = c_oAscChartSubType.normal;
                            break;
                        }
                        case BAR_GROUPING_STACKED:
                        {
                            subtype = c_oAscChartSubType.stacked;
                            break;
                        }
                        case BAR_GROUPING_PERCENT_STACKED:
                        {
                            subtype = c_oAscChartSubType.stackedPer;
                            break;
                        }
                    }
                }
            }

        }
        return {type: type, subtype: subtype};
    },

    clearFormatting: function()
    {
        if(this.spPr)
        {
            this.spPr.Fill && this.spPr.setFill(null);
            this.spPr.ln && this.spPr.setLn(null);
        }
        if(this.chart)
        {
            if(this.chart.plotArea)
            {
                if(this.chart.plotArea.spPr)
                {
                    this.chart.plotArea.spPr.Fill && this.chart.plotArea.spPr.setFill(null);
                    this.chart.plotArea.spPr.ln && this.chart.plotArea.spPr.setLn(null);
                }
                var i, j, k, series, pts, chart, ser;
                for(i = this.chart.plotArea.charts.length-1; i > -1; --i)
                {
                    chart = this.chart.plotArea.charts[i];
                    if(chart.upDownBars)
                    {
                        if(chart.upDownBars.upBars)
                        {
                            chart.upDownBars.setUpBars(null);
                        }
                        if(chart.upDownBars.downBars)
                        {
                            chart.upDownBars.setDownBars(null);
                        }
                    }
                    series = chart.series;
                    for(j = series.length - 1; j > -1; --j)
                    {
                        ser = series[i];
                        if(ser.spPr)
                        {
                            if(ser.spPr.Fill)
                            {
                                ser.spPr.setFill(null);
                            }
                            if(ser.spPr.ln)
                            {
                                ser.spPr.setLn(null);
                            }
                        }
                        removeDPtsFromSeries(ser)
                    }
                }
            }
        }
    },

    copy: function(drawingDocument)
    {
        var copy = new CChartSpace();
        if(this.chart)
        {
            copy.setChart(this.chart.createDuplicate(drawingDocument));
        }
        if(this.clrMapOvr)
        {
            copy.setClrMapOvr(this.clrMapOvr.createDuplicate());
        }
        copy.setDate1904(this.date1904);
        if(this.externalData)
        {
            copy.setExternalData(this.externalData.createDuplicate());
        }
        copy.setLang(this.lang);
        if(this.pivotSource)
        {
            copy.setPivotSource(this.pivotSource.createDuplicate());
        }
        if(this.printSettings)
        {
            copy.setPrintSettings(this.printSettings.createDuplicate());
        }
        if(this.protection)
        {
            copy.setProtection(this.protection.createDuplicate());
        }
        copy.setRoundedCorners(this.roundedCorners);
        if(this.spPr)
        {
            copy.setSpPr(this.spPr.createDuplicate());
            copy.spPr.setParent(copy);
        }
        copy.setStyle(this.style);
        if(this.txPr)
        {
            copy.setTxPr(this.txPr.createDuplicate(drawingDocument))
        }
        copy.setUserShapes(this.userShapes);
        copy.setThemeOverride(this.themeOverride);
        copy.setBDeleted(this.bDeleted);
        return copy;
    },

    convertToWord: function(document)
    {
        return this;
    },

    convertToPPTX: function(drawingDocument, worksheet)
    {
        this.setWorksheet(worksheet);
        this.setParent(null);
        return this;
    },

    rebuildSeriesFromAsc: function(asc_chart)
    {
        if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0])
        {
            var  asc_series = asc_chart.series;
            var chart_type = this.chart.plotArea.charts[0];
            var first_series = chart_type.series[0] ? chart_type.series[0] : new chart_type.getSeriesConstructor()();
            var first_series2 = chart_type.series[0] ? chart_type.series[0] : null;
            removeAllSeriesFromChart(chart_type);
            if(chart_type.getObjectType() !== historyitem_type_ScatterChart)
            {
                for(var i = 0; i < asc_series.length; ++i)
                {
                    var series = first_series.createDuplicate();
                    series.setIdx(i);
                    series.setOrder(i);
                    series.setVal(new CYVal());
                    var val = series.val;
                    val.setNumRef(new CNumRef());
                    var num_ref = val.numRef;
                    num_ref.setF(asc_series[i].Val.Formula);
                    num_ref.setNumCache(new CNumLit());
                    var num_cache = num_ref.numCache;
                    num_cache.setPtCount(asc_series[i].Val.NumCache.length);
                    for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
                    {
                        var pt = new CNumericPoint();
                        pt.setIdx(j);
                        pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
                        pt.setVal(asc_series[i].Val.NumCache[j].val);
                        num_cache.addPt(pt);
                    }
                    if(asc_series[i].Cat && asc_series[i].Cat.NumCache)
                    {
                        series.setCat(new CCat());
                        var cat = series.cat;
                        cat.setStrRef(new CStrRef());
                        var str_ref = cat.strRef;
                        str_ref.setF(asc_series[i].Cat.Formula);
                        str_ref.setStrCache(new CStrCache());
                        var str_cache = str_ref.strCache;
                        var cat_num_cache = asc_series[i].Cat.NumCache;
                        str_cache.setPtCount(cat_num_cache.length);
                        for(var j= 0; j < cat_num_cache.length; ++j)
                        {
                            var string_pt = new CStringPoint();
                            string_pt.setIdx(j);
                            string_pt.setVal(cat_num_cache[j].val);
                            str_cache.addPt(string_pt);
                        }
                    }
                    else
                    {
                        series.setCat(null);
                    }
                    if(asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
                    {
                        series.setTx(new CTx());
                        var tx= series.tx;
                        tx.setStrRef(new CStrRef());
                        var str_ref = tx.strRef;
                        str_ref.setF(asc_series[i].TxCache.Formula);
                        str_ref.setStrCache(new CStrCache());
                        var str_cache = str_ref.strCache;
                        str_cache.setPtCount(1);
                        str_cache.addPt(new CStringPoint());
                        var pt = str_cache.pt[0];
                        pt.setIdx(0);
                        pt.setVal(asc_series[i].TxCache.Tx);
                    }
                    else
                    {
                        series.setTx(null);
                    }
                    chart_type.addSer(series);
                }
            }
            else
            {
                var first_series = asc_series.length > 1 ? asc_series[0] : null;
                var start_index = asc_series.length > 1 ? 1 : 0;
                var minus = start_index === 1 ? 1 : 0;
                for(var i = start_index; i < asc_series.length; ++i)
                {
                    var series = first_series2.createDuplicate();
                    series.setIdx(i - minus);
                    series.setOrder(i - minus);
                    if(first_series)
                    {
                        series.setXVal(new CXVal());
                        var x_val = series.xVal;
                        x_val.setNumRef(new CNumRef());
                        var num_ref = x_val.numRef;
                        num_ref.setF(first_series.Val.Formula);
                        num_ref.setNumCache(new CNumLit());
                        var num_cache = num_ref.numCache;
                        num_cache.setPtCount(first_series.Val.NumCache.length);
                        for(var j = 0; j < first_series.Val.NumCache.length; ++j)
                        {
                            var pt = new CNumericPoint();
                            pt.setIdx(j);
                            pt.setFormatCode(first_series.Val.NumCache[j].numFormatStr);
                            pt.setVal(first_series.Val.NumCache[j].val);
                            num_cache.addPt(pt);
                        }
                    }
                    series.setYVal(new CYVal());
                    var y_val = series.yVal;
                    y_val.setNumRef(new CNumRef());
                    var num_ref = y_val.numRef;
                    num_ref.setF(asc_series[i].Val.Formula);
                    num_ref.setNumCache(new CNumLit());
                    var num_cache = num_ref.numCache;
                    num_cache.setPtCount(asc_series[i].Val.NumCache.length);
                    for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
                    {
                        var pt = new CNumericPoint();
                        pt.setIdx(j);
                        pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
                        pt.setVal(asc_series[i].Val.NumCache[j].val);
                        num_cache.addPt(pt);
                    }
                    chart_type.addSer(series);
                }
            }
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },


    handleUpdateType: function()
    {
        this.recalcInfo.recalculateChart =  true;
        this.recalcInfo.recalculateSeriesColors = true;
        this.recalcInfo.recalculateMarkers = true;
        this.recalcInfo.recalculateGridLines = true;
        this.recalcInfo.recalculateDLbls = true;
        this.recalcInfo.recalculateAxisLabels = true;
        this.recalcInfo.dataLbls.length = 0;
        this.recalcInfo.axisLabels.length = 0;
        this.recalcInfo.recalculateAxisVal = true;
        this.recalcInfo.recalculateAxisTickMark = true;
        this.recalcInfo.recalculateHiLowLines = true;
        this.recalcInfo.recalculateUpDownBars = true;
        this.recalcInfo.recalculateLegend = true;
        this.recalcInfo.recalculateReferences = true;
        this.recalcInfo.recalculateBBox = true;
        this.recalcInfo.recalculateFormulas = true;
        this.chartObj = null;
        this.addToRecalculate();
    },

    handleUpdateInternalChart: function()
    {
        this.recalcInfo.recalculateChart =  true;
        this.recalcInfo.recalculateSeriesColors = true;
        this.recalcInfo.recalculateDLbls = true;
        this.recalcInfo.recalculateAxisLabels = true;
        this.recalcInfo.dataLbls.length = 0;
        this.recalcInfo.axisLabels.length = 0;
        this.recalcInfo.recalculateAxisVal = true;
        this.recalcInfo.recalculateLegend = true;
        this.chartObj = null;
        this.addToRecalculate();

    },

    handleUpdateGridlines: function()
    {
        this.recalcInfo.recalculateGridLines = true;
        this.addToRecalculate();
    },

    handleUpdateDataLabels: function()
    {
        this.recalcInfo.recalculateDLbls = true;
        this.addToRecalculate();
    },

    updateChildLabelsTransform: function(posX, posY)
    {

        if(this.localTransformText)
        {
            this.transformText = this.localTransformText.CreateDublicate();
            global_MatrixTransformer.TranslateAppend(this.transformText, posX, posY);
            this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
        }

        if(this.chart)
        {
            if(this.chart.plotArea)
            {
                if(this.chart.plotArea.chart && this.chart.plotArea.chart.series)
                {
                    var series = this.chart.plotArea.chart.series;
                    for(var i = 0; i < series.length; ++i)
                    {
                        var ser = series[i];
                        var pts = getPtsFromSeries(ser);
                        for(var j = 0; j < pts.length; ++j)
                        {
                            if(pts[j].compiledDlb)
                            {
                                pts[j].compiledDlb.updatePosition(posX, posY);
                            }
                        }
                    }
                }
                if(this.chart.plotArea.catAx)
                {
                    if(this.chart.plotArea.catAx.title)
                        this.chart.plotArea.catAx.title.updatePosition(posX, posY);
                    if(this.chart.plotArea.catAx.labels)
                        this.chart.plotArea.catAx.labels.updatePosition(posX, posY);
                }
                if(this.chart.plotArea.valAx)
                {
                    if(this.chart.plotArea.valAx.title)
                        this.chart.plotArea.valAx.title.updatePosition(posX, posY);
                    if(this.chart.plotArea.valAx.labels)
                        this.chart.plotArea.valAx.labels.updatePosition(posX, posY);
                }

            }
            if(this.chart.title)
            {
                this.chart.title.updatePosition(posX, posY);
            }
            if(this.chart.legend)
            {
                this.chart.legend.updatePosition(posX, posY);
            }
        }
    },


    recalcTitles: function()
    {
        if(this.chart && this.chart.title)
        {
            this.chart.title.recalcInfo.recalculateContent = true;
            this.chart.title.recalcInfo.recalcTransform = true;
            this.chart.title.recalcInfo.recalcTransformText = true;
        }
        if(this.chart && this.chart.plotArea)
        {
            var hor_axis = this.chart.plotArea.getHorizontalAxis();
            if(hor_axis && hor_axis.title)
            {
                hor_axis.title.recalcInfo.recalculateContent = true;
                hor_axis.title.recalcInfo.recalcTransform = true;
                hor_axis.title.recalcInfo.recalcTransformText = true;
            }
            var vert_axis = this.chart.plotArea.getVerticalAxis();
            if(vert_axis && vert_axis.title)
            {
                vert_axis.title.recalcInfo.recalculateContent = true;
                vert_axis.title.recalcInfo.recalcTransform = true;
                vert_axis.title.recalcInfo.recalcTransformText = true;
            }
        }
    },


    recalcTitles2: function()
    {
        if(this.chart && this.chart.title)
        {
            this.chart.title.recalcInfo.recalculateContent = true;
            this.chart.title.recalcInfo.recalcTransform = true;
            this.chart.title.recalcInfo.recalcTransformText = true;
            this.chart.title.recalcInfo.recalculateTxBody = true;
        }
        if(this.chart && this.chart.plotArea)
        {
            var hor_axis = this.chart.plotArea.getHorizontalAxis();
            if(hor_axis && hor_axis.title)
            {
                hor_axis.title.recalcInfo.recalculateContent = true;
                hor_axis.title.recalcInfo.recalcTransform = true;
                hor_axis.title.recalcInfo.recalcTransformText = true;
                hor_axis.title.recalcInfo.recalculateTxBody = true;
            }
            var vert_axis = this.chart.plotArea.getVerticalAxis();
            if(vert_axis && vert_axis.title)
            {
                vert_axis.title.recalcInfo.recalculateContent = true;
                vert_axis.title.recalcInfo.recalcTransform = true;
                vert_axis.title.recalcInfo.recalcTransformText = true;
                vert_axis.title.recalcInfo.recalculateTxBody = true;
            }
        }
    },

    Refresh_RecalcData2: function(pageIndex, object)
    {
        if(object && object.getObjectType && object.getObjectType() === historyitem_type_Title && this.selection.title === object)
        {
            this.recalcInfo.recalcTitle = object;
        }
        else
        {
            this.setRecalculateInfo();
        }
        this.addToRecalculate();
    },

    Refresh_RecalcData: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ChartSpace_SetStyle:
            {
                this.handleUpdateStyle();
                break;
            }
            case historyitem_ChartSpace_SetTxPr:
            {
                this.recalcInfo.recalculateChart = true;
                this.recalcInfo.recalculateLegend = true;
                this.recalcInfo.recalculateDLbls = true;
                this.recalcInfo.recalculateAxisVal = true;
                this.recalcInfo.recalculateAxisCat = true;
                this.recalcInfo.recalculateAxisLabels = true;
                this.addToRecalculate();
                break;
            }
        }
    },

    getObjectType: function()
    {
        return historyitem_type_ChartSpace;
    },

    getAllRasterImages: function(images)
    {
        if(this.spPr)
        {
            this.spPr.checkBlipFillRasterImage(images);
        }
        var chart = this.chart;
        if(chart)
        {
            chart.backWall && chart.backWall.spPr && chart.backWall.spPr.checkBlipFillRasterImage(images);
            chart.floor && chart.floor.spPr && chart.floor.spPr.checkBlipFillRasterImage(images);
            chart.legend && chart.legend.spPr && chart.legend.spPr.checkBlipFillRasterImage(images);
            chart.sideWall && chart.sideWall.spPr && chart.sideWall.spPr.checkBlipFillRasterImage(images);
            chart.title && chart.title.spPr && chart.title.spPr.checkBlipFillRasterImage(images);
            //plotArea
            var plot_area = this.chart.plotArea;
            if(plot_area)
            {
                plot_area.spPr && plot_area.spPr.checkBlipFillRasterImage(images);
                var i;
                for(i = 0; i < plot_area.axId.length; ++i)
                {
                    var axis = plot_area.axId[i];
                    if(axis)
                    {
                        axis.spPr && axis.spPr.checkBlipFillRasterImage(images);
                        axis.title && axis.title && axis.title.spPr && axis.title.spPr.checkBlipFillRasterImage(images);
                    }
                }
                for(i = 0; i < plot_area.charts.length; ++i)
                {
                    plot_area.charts[i].getAllRasterImages(images);
                }
            }
        }
    },

    getAllContents: function()
    {

    },

    documentGetAllFontNames: function(allFonts)
    {
        allFonts["+mn-lt"] = 1;
        allFonts["+mn-ea"] = 1;
        allFonts["+mn-cs"] = 1;
        checkTxBodyDefFonts(allFonts, this.txPr);
        var chart = this.chart, i;
        if(chart)
        {
            for(i = 0; i < chart.pivotFmts.length; ++i)
            {
                chart.pivotFmts[i] &&  checkTxBodyDefFonts(allFonts, chart.pivotFmts[i].txPr);
            }
            if(chart.legend)
            {
                checkTxBodyDefFonts(chart.legend.txPr);
                for(i = 0;  i < chart.legend.legendEntryes.length; ++i)
                {
                    chart.legend.legendEntryes[i] && checkTxBodyDefFonts(allFonts, chart.legend.legendEntryes[i].txPr);
                }
            }
            if(chart.title)
            {
                checkTxBodyDefFonts(allFonts, chart.title.txPr);
                if(chart.title.tx && chart.title.tx.rich)
                {
                    checkTxBodyDefFonts(allFonts, chart.title.tx.rich);
                    chart.title.tx.rich.content && chart.title.tx.rich.content.Document_Get_AllFontNames(allFonts);
                }
            }
            var plot_area = chart.plotArea;
            if(plot_area)
            {
                for(i = 0; i < plot_area.charts.length; ++i)
                {
                    plot_area.charts[i] && plot_area.charts[i].documentCreateFontMap(allFonts);/*TODO надо бы этот метод переименовать чтоб название не вводило в заблуждение*/
                }
                var cur_axis;
                for(i = 0; i < plot_area.axId.length; ++i)
                {
                    cur_axis = plot_area.axId[i];
                    checkTxBodyDefFonts(allFonts, cur_axis.txPr);
                    if(cur_axis.title)
                    {
                        checkTxBodyDefFonts(allFonts, cur_axis.title.txPr);
                        if(cur_axis.title.tx && cur_axis.title.tx.rich)
                        {
                            checkTxBodyDefFonts(allFonts, cur_axis.title.tx.rich);
                            cur_axis.title.tx.rich.content && cur_axis.title.tx.rich.content.Document_Get_AllFontNames(allFonts);
                        }
                    }
                }
            }
        }
    },

    documentCreateFontMap: function(allFonts)
    {
        if(this.chart)
        {
            this.chart.title && this.chart.title.txBody && this.chart.title.txBody.content.Document_CreateFontMap(allFonts);
            var i, j, k;
            if(this.chart.legend)
            {
                var calc_entryes = this.chart.legend.calcEntryes;
                for(i = 0; i < calc_entryes.length; ++i)
                {
                    calc_entryes[i].txBody.content.Document_CreateFontMap(allFonts);
                }
            }
            var axis = this.chart.plotArea.axId, cur_axis;
            for(i = axis.length-1; i > -1 ; --i)
            {
                cur_axis = axis[i];
                if(cur_axis)
                {
                    cur_axis && cur_axis.title && cur_axis.title.txBody && cur_axis.title.txBody.content.Document_CreateFontMap(allFonts);
                    if(cur_axis.labels)
                    {
                        for(j = cur_axis.labels.arrLabels.length - 1; j > -1; --j)
                        {
                            cur_axis.labels.arrLabels[j] && cur_axis.labels.arrLabels[j].txBody && cur_axis.labels.arrLabels[j].txBody.content.Document_CreateFontMap(allFonts);
                        }
                    }
                }
            }

            var series, pts;
            for(i = this.chart.plotArea.charts.length-1; i > -1; --i)
            {
                series = this.chart.plotArea.charts[i].series;
                for(j = series.length -1; j > -1; --j)
                {
                    pts = getPtsFromSeries(series[i]);
                    if(Array.isArray(pts))
                    {
                        for(k = pts.length - 1; k > -1; --k)
                        {
                            pts[k].compiledDlb && pts[k].compiledDlb.txBody && pts[k].compiledDlb.txBody.content.Document_CreateFontMap(allFonts);
                        }
                    }
                }
            }
        }
    },

    setThemeOverride: function(pr)
    {
        History.Add(this, {Type:historyitem_ChartSpace_SetThemeOverride, oldPr: this.themeOverride, newPr: pr});
        this.themeOverride = pr;
    },


    setBDeleted: function(pr)
    {
        History.Add(this, {Type: historyitem_ShapeSetBDeleted, oldPr: this.bDeleted, newPr: pr});
        this.bDeleted = pr;
    },
    setParent: function (parent)
    {
        History.Add(this, { Type: historyitem_ChartSpace_SetParent, oldPr: this.parent, newPr: parent });
        this.parent = parent;
    },


    setChart: function(chart)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetChart, oldChart: this.chart, newChart: chart});
        this.chart = chart;
        if(chart)
        {
            chart.setParent(this);
        }
    },
    setClrMapOvr: function(clrMapOvr)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetClrMapOvr, oldClrMapOvr: this.clrMapOvr, newClrMapOvr: clrMapOvr});
        this.clrMapOvr = clrMapOvr;
    },
    setDate1904: function(date1904)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetDate1904, oldDate1904: this.date1904, newDate1904: date1904});
        this.date1904 = date1904;
    },
    setExternalData: function(externalData)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetExternalData, oldExternalData: this.externalData, newExternalData: externalData});
        this.externalData = externalData;
    },
    setLang: function(lang)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetLang, oldLang: this.lang, newLang: lang});
        this.lang = lang;
    },
    setPivotSource: function(pivotSource)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetPivotSource, oldPivotSource: this.pivotSource, newPivotSource: pivotSource});
        this.pivotSource = pivotSource;
    },
    setPrintSettings: function(printSettings)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetPrintSettings, oldPrintSettings: this.printSettings, newPrintSettings: printSettings});
        this.printSettings = printSettings;
    },
    setProtection: function(protection)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetProtection, oldProtection: this.protection, newProtection: protection});
        this.protection = protection;
    },
    setRoundedCorners: function(roundedCorners)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetRoundedCorners, oldRoundedCorners: this.roundedCorners, newRoundedCorners: roundedCorners});
        this.roundedCorners = roundedCorners;
    },
    setSpPr: function(spPr)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetSpPr, oldSpPr: this.spPr, newSpPr: spPr});
        this.spPr = spPr;
    },
    setStyle: function(style)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetStyle, oldStyle: this.style, newStyle: style});
        this.style = style;
        this.handleUpdateStyle();
    },
    setTxPr: function(txPr)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetTxPr, oldTxPr: this.txPr, newTxPr: txPr});
        this.txPr = txPr;
        if(txPr)
        {
            txPr.setParent(this);
        }
    },
    setUserShapes: function(userShapes)
    {
        History.Add(this, {Type: historyitem_ChartSpace_SetUserShapes, oldUserShapes: this.userShapes, newUserShapes: userShapes});
        this.userShapes = userShapes;
    },


    getTransformMatrix: function()
    {
        return this.transform;
    },

    canRotate: function()
    {
        return false;
    },

    drawAdjustments: function()
    {},

    isChart: function()
    {
        return true;
    },

    isShape: function()
    {
        return false;
    },

    isImage: function()
    {
        return false;
    },

    isGroup: function()
    {
        return false;
    },

    isPlaceholder: CShape.prototype.isPlaceholder,
    getBoundsInGroup: CShape.prototype.getBoundsInGroup,
    setGroup: function (group)
    {
        History.Add(this, { Type: historyitem_ChartSpace_SetGroup, oldPr: this.group, newPr: group });
        this.group = group;
    },

    getBase64Img: function () {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },

    getRangeObjectStr: function()
    {
        if(this.recalcInfo.recalculateBBox)
        {
            this.recalculateBBox();
            this.recalcInfo.recalculateBBox = false;
        }
        var ret = {range: null, bVert: null};
        if(this.bbox && this.bbox.seriesBBox)
        {
            var r1 = this.bbox.seriesBBox.r1, r2 = this.bbox.seriesBBox.r2, c1 = this.bbox.seriesBBox.c1, c2 = this.bbox.seriesBBox.c2;
            ret.bVert = this.bbox.seriesBBox.bVert;
           //if(this.bbox.seriesBBox.bVert)
           //{
           //    ret.bVert = true;
           //    if(this.bbox.catBBox)
           //    {
           //        --r1;
           //    }
           //    if(this.bbox.serBBox)
           //    {
           //        --c1;
           //    }
           //}
           //else
           //{
           //    ret.bVert = false;
           //    if(this.bbox.catBBox)
           //    {
           //        --c1;
           //    }
           //    if(this.bbox.serBBox)
           //    {
           //        --r1;
           //    }
           //}
            var startCell = new CellAddress(r1, c1, 0);
            var endCell = new CellAddress(r2, c2, 0);

            if (startCell && endCell && this.bbox.worksheet) {
				ret.range = parserHelp.get3DRef(this.bbox.worksheet.sName, startCell.getID() === endCell.getID() ?
					startCell.getID() : startCell.getID() + ':' + endCell.getID());
            }
        }
        return ret;
    },



    recalculateBBox: function()
    {
        this.bbox = null;
        this.seriesBBoxes = [];
        this.seriesTitlesBBoxes = [];
        this.catTitlesBBoxes = [];


        var series_bboxes = [], cat_bboxes = [], ser_titles_bboxes = [];

        var series_sheet, cur_bbox, parsed_formulas;

        if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0] && this.worksheet)
        {
            var series = this.chart.plotArea.charts[0].series;
            if(Array.isArray(series) && series.length > 0)
            {
                var series_title_f = [], cat_title_f, series_f = [], i, range1;
                var ref;

                var b_vert/*флаг означает, что значения в серии идут по горизонтали, а сами серии по вертикали сверху вниз*/
                    , b_titles_vert;
                var first_series_sheet;
                for(i = 0; i < series.length; ++i)
                {
                    var numRef = null;
                    if(series[i].val)
                        numRef = series[i].val.numRef;
                    else if(series[i].yVal)
                        numRef = series[i].yVal.numRef;
                    if(numRef)
                    {
                        parsed_formulas = this.parseChartFormula(numRef.f);
                        if(parsed_formulas)
                        {
                            series_bboxes = series_bboxes.concat(parsed_formulas);
                            if(series_f !== null && parsed_formulas.length === 1)
                            {
                                series_sheet = parsed_formulas[0].worksheet;
                                if(!first_series_sheet)
                                    first_series_sheet = series_sheet;
                                if(series_sheet !== first_series_sheet)
                                    series_f = null;
                                if(parsed_formulas[0].bbox)
                                {
                                    cur_bbox = parsed_formulas[0].bbox;
                                    if(cur_bbox.r1 !== cur_bbox.r2 && cur_bbox.c1 !== cur_bbox.c2)
                                        series_f = null;
                                    if(series_f && series_f.length > 0)
                                    {
                                        if(!isRealBool(b_vert))
                                        {
                                            if(series_f[0].c1 === cur_bbox.c1 && series_f[0].c2 === cur_bbox.c2)
                                            {
                                                b_vert = true;
                                            }
                                            else if(series_f[0].r1 === cur_bbox.r1 && series_f[0].r2 === cur_bbox.r2)
                                            {
                                                b_vert = false;
                                            }
                                            else
                                            {
                                                series_f = null;
                                            }
                                        }
                                        else
                                        {
                                            if(b_vert)
                                            {
                                                if(!(series_f[0].c1 === cur_bbox.c1 && series_f[0].c2 === cur_bbox.c2))
                                                {
                                                    series_f = null;
                                                }
                                            }
                                            else
                                            {
                                                if(!(series_f[0].r1 === cur_bbox.r1 && series_f[0].r2 === cur_bbox.r2))
                                                {
                                                    series_f = null;
                                                }
                                            }
                                        }
                                        if(series_f)
                                        {
                                            if(b_vert )
                                            {
                                                if(cur_bbox.r1 - series_f[series_f.length-1].r1 !== 1)
                                                    series_f = null;
                                            }
                                            else
                                            {
                                                if(cur_bbox.c1 - series_f[series_f.length-1].c1 !== 1)
                                                    series_f = null;
                                            }
                                        }
                                    }
                                    if(series_f !== null)
                                        series_f.push(cur_bbox);
                                }
                                else
                                    series_f = null;
                            }
                        }
                    }
                    else
                        series_f = null;
                    if(series[i].tx && series[i].tx.strRef)
                    {
                        parsed_formulas = this.parseChartFormula(series[i].tx.strRef.f);
                        if(parsed_formulas)
                        {
                            ser_titles_bboxes = ser_titles_bboxes.concat(parsed_formulas);
                        }
                        if(series_title_f !== null)
                        {
                            if(!parsed_formulas || parsed_formulas.length !== 1)
                            {
                                series_title_f = null;
                                continue;
                            }
                            var series_cat_sheet = parsed_formulas[0].worksheet;
                            if(series_cat_sheet !== first_series_sheet)
                            {
                                series_title_f = null;
                                continue;
                            }
                            cur_bbox = parsed_formulas[0].bbox;
                            if(cur_bbox)
                            {
                                if(cur_bbox.r1 !== cur_bbox.r2 || cur_bbox.c1 !== cur_bbox.c2)
                                {
                                    series_title_f = null;
                                    continue;
                                }
                                if(!isRealBool(b_titles_vert))
                                {
                                    if(series_title_f.length > 0)
                                    {
                                        if( cur_bbox.r1 - series_title_f[0].r1 === 1)
                                            b_titles_vert = true;
                                        else if(cur_bbox.c1 - series_title_f[0].c1 === 1)
                                            b_titles_vert = false;
                                        else
                                        {
                                            series_title_f = null;
                                            continue;
                                        }
                                    }
                                }
                                else
                                {
                                    if(b_titles_vert)
                                    {
                                        if( cur_bbox.r1 - series_title_f[series_title_f.length-1].r1 !== 1)
                                        {
                                            series_title_f = null;
                                            continue;
                                        }
                                    }
                                    else
                                    {
                                        if( cur_bbox.c1 - series_title_f[series_title_f.length-1].c1 !== 1)
                                        {
                                            series_title_f = null;
                                            continue;
                                        }
                                    }
                                }
                                series_title_f.push(cur_bbox);
                            }
                            else
                            {
                                series_title_f = null;
                                continue;
                            }
                        }
                    }
                    else
                    {
                        series_title_f = null;
                    }
                }

                if(series[0].cat && series[0].cat.strRef)
                {
                    ref = series[0].cat.strRef;
                }
                else if(series[0].xVal)
                {
                    if(series[0].xVal.strRef)
                    {
                        ref = series[0].xVal.strRef;
                    }
                    else if(series[0].xVal.numRef)
                    {
                        ref = series[0].xVal.numRef;
                    }
                }
                if(ref)
                {
                    parsed_formulas = this.parseChartFormula(ref.f);
                    if(parsed_formulas)
                    {
                        cat_bboxes = cat_bboxes.concat(parsed_formulas);
                        if(parsed_formulas.length === 1)
                        {
                            var cat_title_sheet = parsed_formulas[0].worksheet;
                            if(cat_title_sheet === first_series_sheet)
                            {
                                if(parsed_formulas[0].bbox)
                                {
                                    cat_title_f = parsed_formulas[0].bbox;
                                }
                            }
                        }
                    }
                }

                if(series_f !== null && series_f.length === 1)
                {
                    if(series_f[0].r1 === series_f[0].r2 && series_f[0].c1 !== series_f[0].c2)
                    {
                        b_vert = true;
                    }
                    else if(series_f[0].c1 === series_f[0].c2 && series_f[0].r1 !== series_f[0].r2)
                    {
                        b_vert = false;
                    }

                    if(!isRealBool(b_vert) && Array.isArray(series_title_f) )
                    {
                        if(series_f[0].r1 === series_f[0].r2 && series_title_f[0].r1 === series_f[0].r1)
                        {
                            b_vert = true;
                        }
                        else if(series_f[0].c1 === series_f[0].c2 && series_title_f[0].c1 === series_f[0].c1)
                        {
                            b_vert = false;
                        }
                    }
                    if(!isRealBool(b_vert))
                    {
                        if(cat_title_f)
                        {
                            if(series_f[0].r1 === series_f[0].r2 && cat_title_f.c1 === series_f[0].c1 && cat_title_f.c2 === series_f[0].c2)
                            {
                                b_vert = true;
                            }
                            else if(series_f[0].c1 === series_f[0].c2 && cat_title_f.r1 === series_f[0].r1 && cat_title_f.r2 === series_f[0].r2)
                            {
                                b_vert = false;
                            }
                        }
                        if(!isRealBool(b_vert))
                        {
                            b_vert = true;
                        }
                    }
                }

                if(series_f !== null && series_f.length > 0)
                {
                    this.bbox =  {
                        seriesBBox: null,
                        catBBox: null,
                        serBBox: null,
                        worksheet: first_series_sheet
                    };


                    this.bbox.seriesBBox = {
                        r1: series_f[0].r1,
                        r2: series_f[series_f.length-1].r2,
                        c1: series_f[0].c1,
                        c2: series_f[series_f.length-1].c2,
                        bVert: b_vert
                    };


                    this.seriesBBoxes.push(new BBoxInfo(first_series_sheet, this.bbox.seriesBBox));

                    if(cat_title_f)
                    {
                        if(b_vert)
                        {
                            if(cat_title_f.c1 !== this.bbox.seriesBBox.c1
                                || cat_title_f.c2 !== this.bbox.seriesBBox.c2
                                || cat_title_f.r1 !== cat_title_f.r1)
                            {
                                cat_title_f = null;
                            }
                        }
                        else
                        {
                            if(cat_title_f.c1 !== cat_title_f.c2
                                || cat_title_f.r1 !== this.bbox.seriesBBox.r1
                                || cat_title_f.r2 !== this.bbox.seriesBBox.r2)
                            {
                                cat_title_f = null;
                            }
                        }
                        this.bbox.catBBox = cat_title_f;

                        if(cat_title_f)
                        {
                            this.catTitlesBBoxes.push(new BBoxInfo(first_series_sheet, cat_title_f));
                        }
                    }
                    if(Array.isArray(series_title_f))
                    {
                        this.bbox.serBBox = {
                            r1: series_title_f[0].r1,
                            r2: series_title_f[series_title_f.length-1].r2,
                            c1: series_title_f[0].c1,
                            c2: series_title_f[series_title_f.length-1].c2
                        };
                        this.seriesTitlesBBoxes.push(new BBoxInfo(first_series_sheet, this.bbox.serBBox));
                    }
                }
                else
                {
                    for(i = 0;  i < series_bboxes.length; ++i)
                    {
                        this.seriesBBoxes.push(new BBoxInfo(series_bboxes[i].worksheet, series_bboxes[i].bbox));
                    }

                    for(i = 0;  i < cat_bboxes.length; ++i)
                    {
                        this.catTitlesBBoxes.push(new BBoxInfo(cat_bboxes[i].worksheet, cat_bboxes[i].bbox));
                    }

                    for(i = 0;  i < ser_titles_bboxes.length; ++i)
                    {
                        this.seriesTitlesBBoxes.push(new BBoxInfo(ser_titles_bboxes[i].worksheet, ser_titles_bboxes[i].bbox));
                    }
                }
            }
        }
    },


    recalculatePointMap: function()
    {

    },


    recalculateReferences: function()
    {
        var worksheet = this.worksheet;
        this.pointsMap = {};
        if(!worksheet)
            return;

        var checkValByNumRef = function(oThis, ser, val)
        {
            if(val && val.numRef && !val.numRef.numCache)
            {
                var first_slice = 0, last_slice = 0;
                if(val.numRef.f[0] === "(")
                {
                    first_slice = 1;
                }
                if(val.numRef.f[val.numRef.f.length - 1] === ")")
                {
                    last_slice = -1;
                }
                else
                {
                    last_slice = val.numRef.f.length;
                }
                var f1 = val.numRef.f.slice(first_slice, last_slice);
                var arr_f = f1.split(",");
                var num_cache = new CNumLit();
                num_cache.setFormatCode("General");
                var pt_index = 0, i, j, cell, pt, worksheet_id;
                for(i = 0; i < arr_f.length; ++i)
                {
                    var parsed_ref = parserHelp.parse3DRef(arr_f[i]);
                    if(parsed_ref)
                    {
                        var source_worksheet = oThis.worksheet.workbook.getWorksheetByName(parsed_ref.sheet);
                        if(source_worksheet)
                        {
                            worksheet_id = source_worksheet.getId() + "";
                            var range1 = source_worksheet.getRange2(parsed_ref.range);
                            if(range1)
                            {
                                var range = range1.bbox;
                                if(range.r1 === range.r2)
                                {
                                    var row = source_worksheet._getRowNoEmptyWithAll(range.r1);
                                    if(row && !row.hd)
                                    {
                                        for(j = range.c1;  j <= range.c2; ++j)
                                        {
                                            var col = source_worksheet._getColNoEmptyWithAll(j);
                                            if(!col || !col.hd)
                                            {
                                                cell = source_worksheet.getCell( new CellAddress(range.r1, j, 0) );
                                                pt = new CNumericPoint();
                                                pt.setIdx(pt_index++);
                                                pt.setVal(parseFloat(cell.getValue()));
                                                if(cell.getNumFormatStr() !== "General")
                                                {
                                                    pt.setFormatCode(cell.getNumFormatStr())
                                                }
                                                num_cache.addPt(pt);
                                                addPointToMap(oThis.pointsMap, source_worksheet, range.r1, j, pt);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    var col = source_worksheet._getColNoEmptyWithAll(range.c1);
                                    if(!col || !col.hd)
                                    {
                                        for(j = range.r1; j <= range.r2; ++j)
                                        {
                                            var row = source_worksheet._getRowNoEmptyWithAll(j);
                                            if(!row || !row.hd)
                                            {
                                                cell = source_worksheet.getCell( new CellAddress(j, range.c1, 0) );
                                                pt = new CNumericPoint();
                                                pt.setIdx(pt_index++);
                                                pt.setVal(parseFloat(cell.getValue()));
                                                if(cell.getNumFormatStr() !== "General")
                                                {
                                                    pt.setFormatCode(cell.getNumFormatStr())
                                                }
                                                num_cache.addPt(pt);
                                                addPointToMap(oThis.pointsMap, source_worksheet, j, range.c1, pt);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                num_cache.setPtCount(pt_index);
                val.numRef.setNumCache(num_cache);
            }
        };

        var checkCatByNumRef = function(oThis, ser, cat)
        {
            if(cat && cat.strRef && !cat.strRef.strCache)
            {
                var first_slice = 0, last_slice = 0;
                if(cat.strRef.f[0] === "(")
                {
                    first_slice = 1;
                }
                if(cat.strRef.f[cat.strRef.f.length - 1] === ")")
                {
                    last_slice = -1;
                }
                else
                {
                    last_slice = cat.strRef.f.length;
                }
                var f1 = cat.strRef.f.slice(first_slice, last_slice);
                var arr_f = f1.split(",");
                var str_cache = new CStrCache();
                //str_cache.setFormatCode("General");
                var pt_index = 0, i, j, cell, pt;
                var checked_hided_rows = [], checked_hided_cols = [];
                for(i = 0; i < arr_f.length; ++i)
                {
                    var parsed_ref = parserHelp.parse3DRef(arr_f[i]);
                    if(parsed_ref)
                    {
                        var source_worksheet = oThis.worksheet.workbook.getWorksheetByName(parsed_ref.sheet);
                        if(source_worksheet)
                        {
                            var range1 = source_worksheet.getRange2(parsed_ref.range);
                            if(range1)
                            {
                                var range = range1.bbox;
                                if(range.r1 === range.r2)
                                {
                                    var row = source_worksheet._getRowNoEmptyWithAll(range.r1);
                                    if(!row || !row.hd)
                                    {
                                        for(j = range.c1;  j <= range.c2; ++j)
                                        {
                                            var col = source_worksheet._getColNoEmptyWithAll(j);
                                            if(!col || !col.hd)
                                            {
                                                cell = source_worksheet.getCell( new CellAddress(range.r1, j, 0) );
                                                pt = new CStringPoint();
                                                pt.setIdx(pt_index++);
                                                pt.setVal(cell.getValue());

                                                str_cache.addPt(pt);
                                                addPointToMap(oThis.pointsMap, source_worksheet, range.r1, j, pt);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    var col = source_worksheet._getColNoEmptyWithAll(range.c1);
                                    if(!col || !col.hd)
                                    {
                                        for(j = range.r1;  j <= range.r2; ++j)
                                        {
                                            var row = source_worksheet._getRowNoEmptyWithAll(j);
                                            if(!row || !row.hd)
                                            {
                                                cell = source_worksheet.getCell(new CellAddress(j, range.c1, 0));
                                                pt = new CStringPoint();
                                                pt.setIdx(pt_index++);
                                                pt.setVal(cell.getValue());

                                                str_cache.addPt(pt);
                                                addPointToMap(oThis.pointsMap, source_worksheet, j, range.c1,  pt);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                str_cache.setPtCount(pt_index);
                cat.strRef.setStrCache(str_cache);
            }
        };

        var charts, series, i, j, ser, val;
        charts = this.chart.plotArea.charts;
        for(i = 0; i < charts.length; ++i)
        {
            series = charts[i].series;
            if(charts[i].getObjectType() !== historyitem_type_ScatterChart)
            {
                for(j = 0; j < series.length; ++j)
                {
                    ser = series[j];
                    //val
                    checkValByNumRef(this, ser, ser.val);
                    //cat
                    checkValByNumRef(this, ser, ser.cat);
                    checkCatByNumRef(this, ser, ser.cat);
                    //tx
                    checkCatByNumRef(this, ser, ser.tx);

                }
            }
            else
            {
                for(j = 0; j < series.length; ++j)
                {
                    ser = series[j];
                    checkValByNumRef(this, ser, ser.xVal);
                    checkValByNumRef(this, ser, ser.yVal);
                    checkCatByNumRef(this, ser, ser.tx);
                }
            }
        }
    },


    checkEmptySeries: function()
    {
        var chart_type = this.chart.plotArea.charts[0];
        var series = chart_type.series;
        var checkEmptyVal = function(val)
        {
            if(val.numRef)
            {
                if(!val.numRef.numCache)
                    return true;
                if(val.numRef.numCache.pts.length === 0)
                    return true;
            }
            else if(val.numLit)
            {
                if(val.numLit.pts.length === 0)
                    return true;
            }
            else
            {
                return true;
            }
            return false;
        };
        for(var i = 0; i < series.length; ++i)
        {
            var ser = series[i];
            if(ser.val)
            {
                if(!checkEmptyVal(ser.val))
                    return false;
            }
            if(ser.yVal)
            {
                if(!checkEmptyVal(ser.yVal))
                    return false;
            }
        }
        return true;
    },


    recalculateAxisTextBody: function()
    {
        if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0])
        {
            var b_checkEmpty = this.checkEmptySeries();
            this.bEmptySeries = b_checkEmpty;
            if(b_checkEmpty)
                return;
            var plot_area = this.chart.plotArea;
            var chart_object = plot_area.charts[0];
            var i;
            var chart_type = chart_object.getObjectType();
            if(chart_type === historyitem_type_ScatterChart)
            {
                var gap_hor_axis = 4;
                var axis = chart_object.axId;
                var x_ax, y_ax;
                y_ax = this.chart.plotArea.valAx;
                x_ax = this.chart.plotArea.catAx;
                if(x_ax && y_ax)
                {
                    /*new recalc*/
                    y_ax.labels  = null;
                    x_ax.labels  = null;
                    y_ax.posX  = null;
                    x_ax.posY  = null;
                    y_ax.posY  = null;
                    x_ax.posX  = null;
                    var sizes = this.getChartSizes();
                    var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                    var arr_val =  this.getValAxisValues();
                    var arr_strings = [];
                    var multiplier;
                    if(y_ax.dispUnits)
                        multiplier = y_ax.dispUnits.getMultiplier();
                    else
                        multiplier = 1;
                    var num_fmt = y_ax.numFmt;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            arr_strings.push(rich_value);
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            arr_strings.push(calc_value + "");
                        }
                    }

                    //расчитаем подписи для вертикальной оси найдем ширину максимальной и возьмем её удвоенную за ширину подписей верт оси
                    var left_align_labels = true;
                    y_ax.labels = new CValAxisLabels(this);
                    y_ax.yPoints = [];
                    var max_width = 0;
                    for(i = 0; i < arr_strings.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = y_ax;
                        dlbl.chart = this;
                        dlbl.spPr = y_ax.spPr;
                        dlbl.txPr = y_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                        if(i > 0)
                        {
                            dlbl.lastStyleObject = y_ax.labels.arrLabels[0].lastStyleObject;
                        }
                        var cur_width = dlbl.tx.rich.recalculateByMaxWord().w;
                        if(cur_width > max_width)
                            max_width = cur_width;
                        y_ax.labels.arrLabels.push(dlbl);
                    }

                    //пока расстояние между подписями и краем блока с подписями берем размер шрифта.
                    var hor_gap = y_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72);
                    y_ax.labels.extX = max_width + hor_gap;

                    /*расчитаем надписи в блоке для горизонтальной оси*/
                    var arr_x_val = this.getXValAxisValues();
                    var num_fmt = x_ax.numFmt;
                    var string_pts = [];
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_x_val.length; ++i)
                        {
                            var calc_value = arr_x_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            string_pts.push({val:rich_value});
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_x_val.length; ++i)
                        {
                            var calc_value = arr_x_val[i]*multiplier;
                            string_pts.push({val:calc_value + ""});
                        }
                    }

                    x_ax.labels = new CValAxisLabels(this);
                    var bottom_align_labels = true;
                    var max_height = 0;
                    for(i = 0; i < string_pts.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = x_ax;
                        dlbl.chart = this;
                        dlbl.spPr = x_ax.spPr;
                        dlbl.txPr = x_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                        var cur_height = dlbl.tx.rich.recalculateByMaxWord().h;
                        if(cur_height > max_height)
                            max_height = cur_height;
                        x_ax.labels.arrLabels.push(dlbl);
                    }
                    var vert_gap = x_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72);
                    x_ax.labels.extY = max_height + vert_gap;


                    /*расчитаем позицию блока с подпиясями вертикальной оси*/
                    var x_ax_orientation = isRealObject(x_ax.scaling) && isRealNumber(x_ax.scaling.orientation) ? x_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var crosses;//точка на горизонтальной оси где её пересекает вертикальная
                    if(y_ax.crosses === CROSSES_AUTO_ZERO)
                    {
                        if(arr_x_val[0] <=0 && arr_x_val[arr_x_val.length -1] >= 0)
                            crosses = 0;
                        else if(arr_x_val[0] > 0)
                            crosses = arr_x_val[0];
                        else
                            crosses = arr_x_val[arr_x_val.length-1];
                    }
                    else if(y_ax.crosses === CROSSES_MAX)
                        crosses =  arr_x_val[arr_x_val.length-1];
                    else if(y_ax.crosses === CROSSES_MIN)
                        crosses = arr_x_val[0];
                    else if(isRealNumber(y_ax.crossesAt) && arr_val[0] <= y_ax.crossesAt && arr_val[arr_val.length-1] >= y_ax.crossesAt)
                    {
                        crosses = y_ax.crossesAt;
                    }
                    else
                    {
                        //в кайнем случае ведем себя как с AUTO_ZERO
                        if(arr_x_val[0] <=0 && arr_x_val[arr_x_val.length -1] >= 0)
                            crosses = 0;
                        else if(arr_x_val[0] > 0)
                            crosses = arr_x_val[0];
                        else
                            crosses = arr_x_val[arr_x_val.length-1];
                    }


                    var hor_interval_width = rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                    var vert_interval_height = rect.h/(arr_val[arr_val.length-1] - arr_val[0]);
                    var arr_x_points = [], arr_y_points = [];
                    var labels_pos = y_ax.tickLblPos;

                    var first_hor_label_half_width = (x_ax.tickLblPos === TICK_LABEL_POSITION_NONE || x_ax.bDelete) ? 0 : x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                    var last_hor_label_half_width = (x_ax.tickLblPos === TICK_LABEL_POSITION_NONE || x_ax.bDelete) ? 0 : x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                    var left_gap = 0, right_gap = 0;
                    if(x_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        switch(labels_pos)
                        {
                            case TICK_LABEL_POSITION_HIGH:
                            {
                                left_align_labels = false;

                                right_gap = Math.max(last_hor_label_half_width, y_ax.labels.extX);
                                hor_interval_width = (rect.w - right_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.labels.x = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.xPos = rect.x + first_hor_label_half_width + (crosses-arr_x_val[0])*hor_interval_width;
                                break;
                            }
                            case TICK_LABEL_POSITION_LOW:
                            {
                                left_gap = Math.max(first_hor_label_half_width, y_ax.labels.extX);
                                hor_interval_width = (rect.w-left_gap - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + left_gap + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.labels.x = rect.x + left_gap - y_ax.labels.extX;
                                y_ax.xPos = rect.x + left_gap + (crosses-arr_x_val[0])*hor_interval_width;
                                break;
                            }
                            case TICK_LABEL_POSITION_NONE:
                            {
                                y_ax.labels = null;
                                hor_interval_width = (rect.w- first_hor_label_half_width - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.xPos = rect.x + first_hor_label_half_width + hor_interval_width*(crosses - arr_x_val[0]);
                                break;
                            }
                            default :
                            {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                                if(y_ax.crosses === CROSSES_MAX)
                                {
                                    left_align_labels = false;
                                    right_gap = Math.max(right_gap, y_ax.labels.extX);

                                    y_ax.labels.x = rect.x + rect.w - right_gap;
                                    y_ax.xPos = rect.x + rect.w - right_gap;
                                    hor_interval_width = (rect.w - right_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                    }
                                }
                                else
                                {
                                    hor_interval_width = (rect.w - first_hor_label_half_width - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    if(first_hor_label_half_width + (crosses-arr_x_val[0])*hor_interval_width < y_ax.labels.extX)
                                    {
                                        hor_interval_width = (rect.w - y_ax.labels.extX - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - crosses);
                                    }
                                    y_ax.xPos = rect.x+ rect.w - last_hor_label_half_width - (arr_x_val[arr_x_val.length-1] - crosses)*hor_interval_width;
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = y_ax.xPos + (arr_x_val[i] - crosses)*hor_interval_width;
                                    }
                                    y_ax.labels.x = y_ax.xPos - y_ax.labels.extX;
                                }
                                break;
                            }
                        }
                    }
                    else
                    {
                        switch(labels_pos)
                        {
                            case TICK_LABEL_POSITION_HIGH:
                            {
                                left_gap = Math.max(y_ax.labels.extX, last_hor_label_half_width);
                                hor_interval_width = (rect.w - left_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);

                                y_ax.xPos = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width - first_hor_label_half_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                y_ax.labels.x = y_ax.xPos - (arr_x_val[arr_x_val.length-1]-crosses)*hor_interval_width - y_ax.labels.extX;
                                break;
                            }
                            case TICK_LABEL_POSITION_LOW:
                            {
                                left_align_labels = false;

                                right_gap = Math.max(y_ax.labels.extX, first_hor_label_half_width);
                                hor_interval_width = (rect.w - right_gap - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.xPos = rect.x + rect.w - right_gap - (crosses - arr_x_val[0])*hor_interval_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                y_ax.labels.x = rect.x + rect.w - right_gap;
                                break;
                            }
                            case TICK_LABEL_POSITION_NONE:
                            {
                                y_ax.labels = null;
                                hor_interval_width = (rect.w - first_hor_label_half_width - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.xPos = rect.x + rect.w - first_hor_label_half_width - (crosses - arr_x_val[0])*hor_interval_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                break;
                            }
                            default :
                            {//TICK_LABEL_POSITION_NEXT_TO рядом с осью

                                if(y_ax.crosses === CROSSES_MAX)
                                {
                                    left_gap = Math.max(y_ax.labels.extX, last_hor_label_half_width);
                                    hor_interval_width = (rect.w - left_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    y_ax.xPos = rect.x + rect.w - first_hor_label_half_width - (crosses-arr_x_val[0])*hor_interval_width;
                                    y_ax.labels.x = y_ax.xPos - ((arr_x_val[arr_x_val.length-1] - crosses)*hor_interval_width) - y_ax.labels.extX;
                                }
                                else
                                {
                                    left_align_labels = false;
                                    hor_interval_width = (rect.w - first_hor_label_half_width - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    if(first_hor_label_half_width + (crosses-arr_x_val[0])*hor_interval_width < y_ax.labels.extX)
                                    {
                                        hor_interval_width = (rect.w - y_ax.labels.extX - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - crosses);
                                    }
                                    left_align_labels = false;
                                    y_ax.xPos = rect.x + last_hor_label_half_width + hor_interval_width*(arr_x_val[arr_x_val.length-1] - crosses);
                                    y_ax.labels.x = y_ax.xPos;
                                }
                                for(i = 0;  i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos - (arr_x_val[i] - crosses)*hor_interval_width;
                                }
                                break;
                            }
                        }
                    }
                    x_ax.interval = hor_interval_width;

                    /*рассчитаем позицию блока с подписями горизонтальной оси*/
                    var y_ax_orientation = isRealObject(y_ax.scaling) && isRealNumber(y_ax.scaling.orientation) ? y_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var crosses_x;
                    if(x_ax.crosses === CROSSES_AUTO_ZERO)
                    {
                        if(arr_val[0] <= 0 && arr_val[arr_val.length-1] >=0)
                        {
                            crosses_x = 0;
                        }
                        else if(arr_val[0] > 0)
                            crosses_x = arr_val[0];
                        else
                            crosses_x = arr_val[arr_val.length-1];
                    }
                    else if(x_ax.crosses === CROSSES_MAX)
                    {
                        crosses_x = arr_val[arr_val.length-1];
                    }
                    else if(x_ax.crosses === CROSSES_MIN)
                    {
                        crosses_x = arr_val[0];
                    }
                    else if(isRealNumber(x_ax.crossesAt) && arr_val[0] <= x_ax.crossesAt && arr_val[arr_val.length-1] >= x_ax.crossesAt)
                    {
                        crosses_x = x_ax.crossesAt;
                    }
                    else
                    {   //как с AUTO_ZERO
                        if(arr_val[0] <= 0 && arr_val[arr_val.length-1] >=0)
                        {
                            crosses_x = 0;
                        }
                        else if(arr_val[0] > 0)
                            crosses_x = arr_val[0];
                        else
                            crosses_x = arr_val[arr_val.length-1];
                    }

                    var tick_labels_pos_x = x_ax.tickLblPos;

                    var first_vert_label_half_height = 0; //TODO (y_ax.tickLblPos === TICK_LABEL_POSITION_NONE || y_ax.bDelete) ? 0 :  y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                    var last_vert_label_half_height =  0; //(y_ax.tickLblPos === TICK_LABEL_POSITION_NONE || y_ax.bDelete) ? 0 :  y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;

                    var bottom_gap = 0, top_height = 0;
                    if(y_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        switch(tick_labels_pos_x)
                        {
                            case TICK_LABEL_POSITION_HIGH:
                            {
                                bottom_align_labels = false;
                                var bottom_start_point = rect.y + rect.h - first_vert_label_half_height;


                                top_height = Math.max(x_ax.labels.extY, last_vert_label_half_height);
                                vert_interval_height = (rect.h - top_height - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);

                                x_ax.labels.y = bottom_start_point - (arr_val[arr_val.length - 1] - arr_val[0])*vert_interval_height - x_ax.labels.extY;

                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = bottom_start_point - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.yPos = bottom_start_point - (crosses_x - arr_val[0])*vert_interval_height;
                                break;
                            }
                            case TICK_LABEL_POSITION_LOW:
                            {
                                bottom_gap = Math.max(x_ax.labels.extY, first_vert_label_half_height);
                                x_ax.labels.y = rect.y + rect.h - bottom_gap;
                                vert_interval_height = (rect.h - bottom_gap - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);

                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - bottom_gap -  (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.yPos = rect.y + rect.h - bottom_gap - (crosses_x - arr_val[0])*vert_interval_height;
                                break;
                            }
                            case TICK_LABEL_POSITION_NONE:
                            {
                                x_ax.labels = null;
                                vert_interval_height = (rect.h - first_vert_label_half_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - first_vert_label_half_height - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.yPos = rect.y + rect.h - first_vert_label_half_height - (crosses_x - arr_val[0])*vert_interval_height;
                                break;
                            }
                            default :
                            {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                                if(x_ax.crosses === CROSSES_MAX)
                                {
                                    bottom_align_labels = false;
                                    top_height = Math.max(x_ax.labels.extY, last_vert_label_half_height);

                                    vert_interval_height = (rect.h - top_height - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                    for(i = 0; i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = rect.y + rect.h - first_vert_label_half_height - (arr_val[i] - arr_val[0])*vert_interval_height;
                                    }
                                    x_ax.yPos = rect.y + rect.h - first_vert_label_half_height - (arr_val[arr_val.length-1] - arr_val[0])*vert_interval_height;
                                    x_ax.labels.y = x_ax.yPos - x_ax.labels.extY;
                                }
                                else
                                {
                                    vert_interval_height = (rect.h - first_vert_label_half_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                    if(first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height < x_ax.labels.extY)
                                    {
                                        vert_interval_height = (rect.h - x_ax.labels.extY - last_vert_label_half_height)/(arr_val[arr_val.length-1] - crosses_x);
                                    }

                                    x_ax.yPos = rect.y + last_vert_label_half_height+ (arr_val[arr_val.length-1] - crosses_x)*vert_interval_height;
                                    x_ax.labels.y = x_ax.yPos;
                                    for(i = 0;i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = x_ax.yPos - (arr_val[i] - crosses_x)*vert_interval_height;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    else
                    {
                        switch(tick_labels_pos_x)
                        {
                            case TICK_LABEL_POSITION_HIGH:
                            {
                                bottom_gap = Math.max(last_vert_label_half_height, x_ax.labels.extY);
                                vert_interval_height = (rect.h - bottom_gap - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                x_ax.yPos = rect.y + first_vert_label_half_height + (crosses_x - arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = x_ax.yPos + vert_interval_height*(arr_val[i] - crosses_x);
                                }
                                x_ax.labels.y = x_ax.yPos + vert_interval_height*(arr_val[arr_val.length-1] - crosses_x);
                                break;
                            }
                            case TICK_LABEL_POSITION_LOW:
                            {
                                top_height = Math.max(x_ax.labels.extY, first_vert_label_half_height);

                                bottom_align_labels = false;
                                vert_interval_height = (rect.h - top_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                x_ax.yPos = rect.y + top_height + (crosses_x- arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + top_height + vert_interval_height*(arr_val[i] - arr_val[0]);
                                }
                                x_ax.labels.y = rect.y + top_height - x_ax.labels.extY;
                                break;
                            }
                            case TICK_LABEL_POSITION_NONE:
                            {
                                x_ax.labels = null;
                                vert_interval_height = (rect.h - first_vert_label_half_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                x_ax.yPos = rect.y + first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length;++i)
                                {
                                    arr_y_points[i] = rect.y + first_vert_label_half_height + vert_interval_height*(arr_val[i] - arr_val[0]);
                                }
                                break;
                            }
                            default :
                            {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                                if(x_ax.crosses === CROSSES_MAX)
                                {
                                    bottom_gap = Math.max(x_ax.labels.extY, last_vert_label_half_height);


                                    vert_interval_height = (rect.h - bottom_gap - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                    x_ax.yPos = rect.y + first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height;
                                    for(i = 0; i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = rect.y + first_vert_label_half_height+ vert_interval_height*(arr_val[i] - arr_val[0]);
                                    }
                                    x_ax.labels.y = rect.y + rect.extY - bottom_gap;
                                }
                                else
                                {
                                    bottom_align_labels = false;

                                    vert_interval_height = (rect.h - last_vert_label_half_height - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                    if(first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height < x_ax.labels.extY)
                                    {
                                        x_ax.yPos = rect.y + x_ax.labels.extY;
                                        vert_interval_height = (rect.h-x_ax.labels.extY - last_vert_label_half_height)/(arr_val[arr_val.length-1] - crosses_x);
                                    }
                                    else
                                    {
                                        x_ax.yPos = rect.y + rect.h - vert_interval_height*(arr_val[arr_val.length-1] - crosses_x) - last_vert_label_half_height;
                                    }
                                    x_ax.labels.y = x_ax.yPos - x_ax.labels.extY;
                                    for(i = 0; i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = x_ax.yPos + vert_interval_height*(arr_val[i] - crosses_x);
                                    }
                                }
                                break;
                            }
                        }
                    }
                    y_ax.interval = vert_interval_height;

                    y_ax.yPoints = [];
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        y_ax.yPoints.push({pos: arr_y_points[i], val: arr_val[i]});
                    }


                    x_ax.xPoints = [];
                    for(i = 0; i < arr_x_val.length; ++i)
                    {
                        x_ax.xPoints.push({pos: arr_x_points[i], val: arr_x_val[i]});
                    }

                    var arr_labels;
                    var text_transform;
                    var local_text_transform;
                    if(x_ax.bDelete)
                    {
                        x_ax.labels = null;
                    }
                    if(y_ax.bDelete)
                    {
                        y_ax.labels = null;
                    }
                    if(x_ax.labels)
                    {
                        arr_labels = x_ax.labels.arrLabels;
                        if(bottom_align_labels)
                        {
                            var top_line = x_ax.labels.y + vert_gap;
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                if(arr_labels[i])
                                {
                                    arr_labels[i].txBody = arr_labels[i].tx.rich;
                                    text_transform = arr_labels[i].transformText;


                                    text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, top_line);
                                    // global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());


                                    local_text_transform = arr_labels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, top_line);
                                }
                            }
                        }
                        else
                        {
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                if(arr_labels[i])
                                {
                                    arr_labels[i].txBody = arr_labels[i].tx.rich;
                                    text_transform = arr_labels[i].transformText;
                                    text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, x_ax.labels.y + x_ax.labels.extY - vert_gap - arr_labels[i].tx.rich.content.Get_SummaryHeight());
                                    //  global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                    local_text_transform = arr_labels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, x_ax.labels.y + x_ax.labels.extY - vert_gap - arr_labels[i].tx.rich.content.Get_SummaryHeight());

                                }
                            }
                        }
                    }


                    if(y_ax.labels)
                    {
                        arr_labels = y_ax.labels.arrLabels;
                        if(left_align_labels)
                        {
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                if(arr_labels[i])
                                {
                                    arr_labels[i].txBody = arr_labels[i].tx.rich;
                                    text_transform = arr_labels[i].transformText;
                                    text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(text_transform, y_ax.labels.x + y_ax.labels.extX - hor_gap - arr_labels[i].tx.rich.content.XLimit, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                                    //     global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                    local_text_transform = arr_labels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, y_ax.labels.x + y_ax.labels.extX - hor_gap - arr_labels[i].tx.rich.content.XLimit, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                                }
                            }
                        }
                        else
                        {
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                if(arr_labels[i])
                                {
                                    arr_labels[i].txBody = arr_labels[i].tx.rich;
                                    text_transform = arr_labels[i].transformText;
                                    text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(text_transform, y_ax.labels.x + hor_gap, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                                    //     global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                    local_text_transform = arr_labels[i].transformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, y_ax.labels.x + hor_gap, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);

                                }
                            }
                        }
                    }

                    if(y_ax.labels)
                    {
                        if(y_ax_orientation === ORIENTATION_MIN_MAX)
                        {
                            var t = y_ax.labels.arrLabels[y_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;
                            y_ax.labels.y = arr_y_points[arr_y_points.length-1] - t;
                            y_ax.labels.extY = arr_y_points[0] - arr_y_points[arr_y_points.length-1] + t + y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                        }
                        else
                        {
                            var t = y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                            y_ax.labels.y = arr_y_points[0] - t;
                            y_ax.labels.extY = arr_y_points[arr_y_points.length-1] - arr_y_points[0] + t + y_ax.labels.arrLabels[y_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;
                        }
                    }

                    if(x_ax.labels)
                    {
                        if(x_ax_orientation === ORIENTATION_MIN_MAX)
                        {
                            var t = x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                            x_ax.labels.x = arr_x_points[0] - t;
                            x_ax.labels.extX = arr_x_points[arr_x_points.length-1] + x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2 - x_ax.labels.x;
                        }
                        else
                        {
                            var t = x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                            x_ax.labels.x = arr_x_points[arr_x_points.length-1] - t;
                            x_ax.labels.extX = arr_x_points[0] + x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2 - x_ax.labels.x;
                        }
                    }
                    /*new recalc*/
                }
            }
            else if(chart_type !== historyitem_type_BarChart && (chart_type !== historyitem_type_PieChart && chart_type !== historyitem_type_DoughnutChart)
                || (chart_type === historyitem_type_BarChart && chart_object.barDir !== BAR_DIR_BAR))
            {
                var gap_hor_axis = 4;
                var axis = chart_object.axId;
                var cat_ax, val_ax;
                val_ax = this.chart.plotArea.valAx;
                cat_ax = this.chart.plotArea.catAx;
                if(val_ax && cat_ax)
                {
                    val_ax.labels  = null;
                    cat_ax.labels  = null;

                    val_ax.posX  = null;
                    cat_ax.posY  = null;
                    val_ax.posY  = null;
                    cat_ax.posX  = null;
                    var sizes = this.getChartSizes();
                    var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                    var arr_val =  this.getValAxisValues();
                    //Получим строки для оси значений с учетом формата и единиц
                    var arr_strings = [];
                    var multiplier;
                    if(val_ax.dispUnits)
                        multiplier = val_ax.dispUnits.getMultiplier();
                    else
                        multiplier = 1;
                    var num_fmt = val_ax.numFmt;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            arr_strings.push(rich_value);
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            arr_strings.push(calc_value + "");
                        }
                    }


                    /*если у нас шкала логарифмическая то будем вместо полученных значений использовать логарифм*/

                    val_ax.labels = new CValAxisLabels(this);
                    var max_width = 0;
                    val_ax.yPoints = [];

                    var max_val_labels_text_height = 0;
                    for(i = 0; i < arr_strings.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = val_ax;
                        dlbl.chart = this;
                        dlbl.spPr = val_ax.spPr;
                        dlbl.txPr = val_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                        var t = dlbl.tx.rich.recalculateByMaxWord();
                        var cur_width = t.w;
                        if(cur_width > max_width)
                            max_width = cur_width;
                        if(t.h > max_val_labels_text_height)
                            max_val_labels_text_height = t.h;
                        val_ax.labels.arrLabels.push(dlbl);
                        val_ax.yPoints.push({val: arr_val[i], pos: null});

                    }
                    var val_axis_labels_gap = val_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*25.4/72;
                    val_ax.labels.extX = max_width + val_axis_labels_gap;

                    //расчитаем подписи для горизонтальной оси
                    var ser = chart_object.series[0];
                    var string_pts = [], pts_len = 0;

                    /*string_pts  pts_len*/
                    if(ser && ser.cat)
                    {
                        var  lit;
                        if(ser.cat.strRef && ser.cat.strRef.strCache)
                        {
                            lit = ser.cat.strRef.strCache;
                        }
                        else if(ser.cat.strLit)
                        {
                            lit = ser.cat.strLit;
                        }
                        else if(ser.cat.numRef && ser.cat.numRef.numCache)
                        {
                            lit = ser.cat.numRef.numCache;
                        }
                        else if(ser.cat.numLit)
                        {
                            lit = ser.cat.numLit;
                        }
                        if(lit)
                        {
                            pts_len = lit.ptCount;
                            for(i = 0; i < pts_len; ++i)
                            {
                                var pt = lit.getPtByIndex(i);
                                if(pt)
                                {
                                    string_pts.push({val: pt.val + ""});
                                }
                                else
                                {
                                    string_pts.push({val: i + ""});
                                }
                            }
                        }
                    }
                    //if(string_pts.length === 0)
                    {
                        pts_len = 0;
                        for(i = 0; i < chart_object.series.length; ++i)
                        {
                            var cur_pts= null;
                            ser = chart_object.series[i];
                            if(ser.val)
                            {
                                if(ser.val.numRef && ser.val.numRef.numCache)
                                    cur_pts = ser.val.numRef.numCache;
                                else if(ser.val.numLit)
                                    cur_pts = ser.val.numLit;
                                if(cur_pts)
                                {
                                    pts_len = Math.max(pts_len, cur_pts.ptCount);
                                }
                            }
                        }
                        if(pts_len > string_pts.length)
                        {
                            for(i = 0; i < pts_len; ++i)
                            {
                                string_pts.push({val:i+1 + ""});
                            }
                        }
                    }
                    /*---------------------расчет позиции блока с подписями вертикальной оси-----------------------------------------------------------------------------*/
                    //расчитаем ширину интервала без учета горизонтальной оси;
                    var crosses;//номер категории в которой вертикалная ось пересекает горизонтальную;
                    if(val_ax.crosses === CROSSES_AUTO_ZERO || val_ax.crosses === CROSSES_MIN)
                        crosses = 1;
                    else if(val_ax.crosses === CROSSES_MAX)
                        crosses = string_pts.length;
                    else if(isRealNumber(val_ax.crossesAt))
                    {
                        if(val_ax.crossesAt <= string_pts.length + 1 && val_ax.crossesAt > 0)
                            crosses = val_ax.crossesAt;
                        else if(val_ax.crossesAt <= 0)
                            crosses = 1;
                        else
                            crosses = string_pts.length;
                    }
                    else
                        crosses = 1;

                    var cat_ax_orientation = cat_ax.scaling && isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var point_width = rect.w/string_pts.length;
                    var labels_pos = val_ax.tickLblPos;
                    var cross_between = isRealNumber(val_ax.crossBetween) ? val_ax.crossBetween : CROSS_BETWEEN_BETWEEN;

                    var left_val_ax_labels_align = true;//приленгание подписей оси значений к левому краю.

                    var intervals_count = cross_between === CROSS_BETWEEN_MID_CAT ? string_pts.length - 1 : string_pts.length;
                    var point_interval  = rect.w/intervals_count;//интервал между точками. Зависит от crossBetween, а также будет потом корректироваться в зависимости от подписей вертикальной и горизонтальной оси.

                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                        point_interval = rect.w/(string_pts.length - 1);
                    else
                        point_interval = rect.w/string_pts.length;

                    var left_points_width, right_point_width;
                    var arr_cat_labels_points = [];//массив середин подписей горизонтальной оси; i-й элемент - x-координата центра подписи категории с номером i;
                    if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                        {
                            if(val_ax.crosses === CROSSES_MAX)
                            {
                                left_val_ax_labels_align = false;
                                val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                                point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                                val_ax.posX = val_ax.labels.x;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                                }
                            }
                            else
                            {
                                left_points_width = point_interval*(crosses-1);//общая ширина левых точек если считать что точки занимают все пространство
                                if(left_points_width < val_ax.labels.extX)//подписи верт. оси выходят за пределы области построения
                                {
                                    var right_intervals_count = intervals_count - (crosses-1);//количесво интервалов правее вертикальной оси
                                    //скорректируем point_interval, поделив расстояние, которое осталось справа от подписей осей на количество интервалов справа
                                    point_interval = (rect.w - val_ax.labels.extX)/right_intervals_count;
                                    val_ax.labels.x = rect.x;
                                    var start_point = val_ax.labels.x + val_ax.labels.extX - (crosses-1)*point_interval;//x-координата точки, где начинается собственно область диаграммы
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point + point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = point_interval/2 + start_point + point_interval*i;
                                    }
                                }
                                else
                                {
                                    val_ax.labels.x = rect.x + left_points_width - val_ax.labels.extX;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.x + point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                                    }

                                }
                                val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                            }
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи слева от области построения
                        {
                            point_interval = (rect.w -  val_ax.labels.extX)/intervals_count;
                            val_ax.labels.x = rect.x;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + val_ax.labels.extX + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + val_ax.labels.extX + point_interval/2 + point_interval*i;
                            }
                            val_ax.posX = val_ax.labels.x + val_ax.labels.extX + point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи справа от области построения
                        {
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                            val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                            left_val_ax_labels_align = false;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                            }
                            val_ax.posX = rect.x + point_interval*(crosses-1);
                        }
                        else
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                            }
                            val_ax.posX = rect.x + point_interval*(crosses-1);
                        }
                    }
                    else
                    {//то же самое, только зеркально отраженное
                        if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                        {
                            if(val_ax.crosses === CROSSES_MAX)
                            {
                                val_ax.labels.x = rect.x;
                                point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                                }
                                val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                            }
                            else
                            {
                                left_val_ax_labels_align = false;
                                right_point_width = point_interval*(crosses-1);
                                if(right_point_width < val_ax.labels.extX)
                                {
                                    val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                                    var left_points_interval_count = intervals_count - (crosses - 1);
                                    point_interval = (val_ax.labels.x - rect.x)/left_points_interval_count;
                                    var start_point_right = rect.x + point_interval*intervals_count;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point_right - point_interval*i;

                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point_right - point_interval/2 - point_interval*i;
                                    }
                                }
                                else
                                {
                                    val_ax.labels.x = rect.x + rect.w - right_point_width;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;

                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                                    }
                                }
                                val_ax.posX = val_ax.labels.x;
                            }
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи справа от области построения
                        {
                            left_val_ax_labels_align = false;
                            point_interval = (rect.w -  val_ax.labels.extX)/intervals_count;
                            val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;

                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.x - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.x - point_interval/2 - point_interval*i;
                            }
                            val_ax.posX = rect.x + rect.w - point_interval*(crosses-1) - val_ax.labels.extX;
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи слева от области построения
                        {
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                            val_ax.labels.x = rect.x;

                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                            }

                            val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                        }
                        else
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                            }
                            val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                        }
                    }

                    cat_ax.interval = point_interval;

                    var diagram_width = point_interval*intervals_count;//размер области с самой диаграммой позже будет корректироватся;
                    var max_cat_label_width = diagram_width / string_pts.length; // максимальная ширина подписи горизонтальной оси;


                    cat_ax.labels = null;
                    var b_rotated = false;//флаг означает, что водписи не уместились в отведенное для них пространство и их пришлось перевернуть.
                    //проверим умещаются ли подписи горизонтальной оси в point_interval
                    if(TICK_LABEL_POSITION_NONE !== cat_ax.tickLblPos && !(cat_ax.bDelete === true)) //будем корректировать вертикальные подписи только если есть горизонтальные
                    {
                        cat_ax.labels = new CValAxisLabels(this);
                        var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                        var max_min_width = 0;
                        var max_max_width = 0;
                        var arr_max_contents = [];
                        for(i = 0; i < string_pts.length; ++i)
                        {
                            var dlbl = null;
                            if(i%tick_lbl_skip === 0)
                            {
                                dlbl = new CDLbl();
                                dlbl.parent = cat_ax;
                                dlbl.chart = this;
                                dlbl.spPr = cat_ax.spPr;
                                dlbl.txPr = cat_ax.txPr;
                                dlbl.tx = new CChartText();
                                dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                                //dlbl.recalculate();

                                var content = dlbl.tx.rich.content;
                                content.Set_ApplyToAll(true);
                                content.Set_ParagraphAlign(align_Center);
                                content.Set_ApplyToAll(false);
                                dlbl.txBody = dlbl.tx.rich;

                                var min_max =  dlbl.tx.rich.content.Recalculate_MinMaxContentWidth();
                                var max_min_content_width = min_max.Min;
                                if(max_min_content_width > max_min_width)
                                    max_min_width = max_min_content_width;
                                if(min_max.Max > max_max_width)
                                    max_max_width = min_max.Max;
                            }
                            cat_ax.labels.arrLabels.push(dlbl);
                        }
                        var stake_offset = isRealNumber(cat_ax.lblOffset) ? cat_ax.lblOffset/100 : 1;
                        var labels_offset = cat_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                        if(max_min_width < max_cat_label_width)//значит текст каждой из точек умещается в point_width
                        {
                            var max_height = 0;
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var content = cat_ax.labels.arrLabels[i].tx.rich.content;
                                    content.Reset(0, 0, max_cat_label_width, 20000);
                                    content.Recalculate_Page(0, true);
                                    var cur_height = content.Get_SummaryHeight();
                                    if(cur_height > max_height)
                                        max_height = cur_height;
                                }
                            }

                            cat_ax.labels.extY = max_height + labels_offset;
                            if(cross_between === CROSS_BETWEEN_MID_CAT) //корректируем позиции центров подписей горизонтальной оси, положение  вертикальной оси и её подписей
                            {
                                var left_gap_point, right_gap_point;
                                if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                                {
                                    var first_label_left_gap = cat_ax.labels.arrLabels[0].tx.rich.getMaxContentWidth(max_cat_label_width)/2;//на сколько вправа выходит первая подпись
                                    var last_labels_right_gap = cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1] ? cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1].tx.rich.getMaxContentWidth(max_cat_label_width)/2 : 0;

                                    //смотрим, выходит ли подпись первой категориии выходит за пределы области построения
                                    left_gap_point = arr_cat_labels_points[0] - first_label_left_gap;
                                    if(rect.x > left_gap_point)
                                    {
                                        if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                        {
                                            val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                        }
                                        //скорректируем point_interval
                                        point_interval *= (rect.w/(rect.x + rect.w - left_gap_point));
                                        //скорректируем arr_cat_labels_points
                                        for(i = 0; i < arr_cat_labels_points.length; ++i)
                                        {
                                            arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                        }
                                        //скорректируем позицию вертикальной оси
                                        val_ax.posX =  rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }

                                    //смотри выходит ли подпись последней категории за пределы области построения
                                    right_gap_point = arr_cat_labels_points[arr_cat_labels_points.length - 1] + last_labels_right_gap;
                                    if(right_gap_point > rect.x + rect.w)
                                    {
                                        if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                        {
                                            val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                        }
                                        //скорректируем point_interval
                                        point_interval *= (rect.w/(right_gap_point - rect.x));
                                        for(i = 0; i < arr_cat_labels_points.length; ++i)
                                        {
                                            arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                        }
                                        //скорректируем позицию вертикальной оси
                                        val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));

                                    }
                                }
                                else
                                {
                                    var last_label_left_gap = cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1] ? cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1].tx.rich.getMaxContentWidth(max_cat_label_width)/2 : 0;
                                    var first_label_right_gap = cat_ax.labels.arrLabels[0].tx.rich.getMaxContentWidth(max_cat_label_width)/2;
                                    left_gap_point = arr_cat_labels_points[arr_cat_labels_points.length - 1] - last_label_left_gap;
                                    right_gap_point = arr_cat_labels_points[0] + first_label_right_gap;
                                    if(rect.x > left_gap_point)
                                    {
                                        if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                        {
                                            val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                        }
                                        //скорректируем point_interval
                                        point_interval *= (rect.w/(rect.x + rect.w - left_gap_point));
                                        //скорректируем arr_cat_labels_points
                                        for(i = 0; i < arr_cat_labels_points.length; ++i)
                                        {
                                            arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                        }

                                        //скорректируем позицию вертикальной оси
                                        val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    if(right_gap_point > rect.x + rect.w)
                                    {
                                        if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                        {
                                            val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                        }
                                        //скорректируем point_interval
                                        point_interval *= (rect.w/(right_gap_point - rect.x));
                                        for(i = 0; i < arr_cat_labels_points.length; ++i)
                                        {
                                            arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                        }
                                        //скорректируем позицию вертикальной оси
                                        val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                }
                            }
                        }
                        else
                        {
                            b_rotated = true;
                            //пока сделаем без обрезки
                            var arr_left_points = [];
                            var arr_right_points = [];

                            var max_rotated_height = 0;
                            //смотрим на сколько подписи горизонтальной оси выходят влево за пределы области построения
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    //сначала расчитаем высоту и ширину подписи так чтобы она умещалась в одну строку
                                    var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();
                                    arr_left_points[i] = arr_cat_labels_points[i] - (wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4) - wh.h*Math.sin(Math.PI/4)/2);//вычитаем из точки привязки ширину получившейся подписи
                                    arr_right_points[i] = arr_cat_labels_points[i] + wh.h*Math.sin(Math.PI/4)/2;
                                    var h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                    if(h2 > max_rotated_height)
                                        max_rotated_height = h2;
                                }
                                else
                                {//подписи нет
                                    arr_left_points[i] = arr_cat_labels_points[i];
                                    arr_right_points[i] = arr_cat_labels_points[i];
                                }
                            }

                            cat_ax.labels.extY = max_rotated_height + labels_offset;
                            //
                            left_gap_point = Math.min.apply(Math, arr_left_points);
                            right_gap_point = Math.max.apply(Math, arr_right_points);

                            if(ORIENTATION_MIN_MAX === cat_ax_orientation)
                            {
                                if(rect.x > left_gap_point)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= rect.w/(rect.x + rect.w - left_gap_point);
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }
                                //смотри выходит ли подпись последней категории за пределы области построения
                                if(right_gap_point > rect.x + rect.w)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (right_gap_point - rect.x)/(rect.x + rect.w - rect.x);
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }


                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
                                }
                            }
                            else
                            {
                                if(rect.x > left_gap_point)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (rect.w)/(rect.x + rect.w - left_gap_point);
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }
                                if(right_gap_point > rect.x + rect.w)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (right_gap_point - rect.x)/(rect.x + rect.w - rect.x);
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)(rect.w/(right_gap_point - rect.x));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
                                }
                            }
                        }
                    }

                    //расчет позиции блока с подписями горизонтальной оси
                    var cat_labels_align_bottom = true;
                    /*-----------------------------------------------------------------------*/
                    var crosses_val_ax;//значение на ветикальной оси в котором её пересекает горизонтальная

                    if(cat_ax.crosses === CROSSES_AUTO_ZERO)
                    {
                        if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                            crosses_val_ax = 0;
                        else if(arr_val[arr_val.length-1] < 0)
                            crosses_val_ax = arr_val[arr_val.length-1];
                        else
                            crosses_val_ax = arr_val[0];
                    }
                    else if(cat_ax.crosses === CROSSES_MIN)
                    {
                        crosses_val_ax = arr_val[0];
                    }
                    else if(cat_ax.crosses === CROSSES_MAX)
                    {
                        crosses_val_ax = arr_val[arr_val.length - 1];
                    }
                    else if(isRealNumber(cat_ax.crossesAt) && cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                    {
                        //сделаем провеку на попадание в интервал
                        if(cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                            crosses_val_ax = cat_ax.crossesAt;
                    }
                    else
                    { //ведем себя как в случае (cat_ax.crosses === CROSSES_AUTO_ZERO)
                        if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                            crosses_val_ax = 0;
                        else if(arr_val[arr_val.length-1] < 0)
                            crosses_val_ax = arr_val[arr_val.length-1];
                        else
                            crosses_val_ax = arr_val[0];
                    }
                    var val_ax_orientation = val_ax.scaling && isRealNumber(val_ax.scaling.orientation) ? val_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var hor_labels_pos = cat_ax.tickLblPos;

                    var arr_val_labels_points = [];//массив середин подписей вертикальной оси; i-й элемент - y-координата центра подписи i-огто значения;
                    var top_val_axis_gap, bottom_val_axis_gap;
                    var first_val_axis_label_half_height =0; //TODO  (val_ax.bDelete || val_ax.tickLblPos ===TICK_LABEL_POSITION_NONE) ? 0 :val_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                    var last_val_axis_label_half_height = 0; //TODO (val_ax.bDelete || val_ax.tickLblPos ===TICK_LABEL_POSITION_NONE) ? 0 : val_ax.labels.arrLabels[val_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;

                    var unit_height = (rect.h - first_val_axis_label_half_height - last_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);//высота единицы измерения на вертикальной оси

                    var cat_ax_ext_y = cat_ax.labels ? cat_ax.labels.extY : 0;
                    if(val_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                        {
                            if(cat_ax.crosses === CROSSES_MAX)
                            {
                                cat_labels_align_bottom = false;
                                top_val_axis_gap = Math.max(last_val_axis_label_half_height, cat_ax_ext_y);
                                unit_height = (rect.h - top_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                                cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height - (crosses_val_ax - arr_val[0])*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;
                            }
                            else
                            {
                                var bottom_points_height = first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;//высота области под горизонтальной осью
                                if(bottom_points_height < cat_ax_ext_y)
                                {
                                    unit_height = (rect.h - last_val_axis_label_half_height - cat_ax_ext_y)/(arr_val[arr_val.length-1] - crosses_val_ax);
                                }
                                cat_ax.posY = rect.y + last_val_axis_label_half_height + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY;
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                        {
                            bottom_val_axis_gap = Math.max(cat_ax_ext_y, first_val_axis_label_half_height);
                            unit_height = (rect.h - bottom_val_axis_gap - last_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.posY = rect.y + last_val_axis_label_half_height + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                        {
                            top_val_axis_gap = Math.max(last_val_axis_label_half_height, cat_ax_ext_y);
                            unit_height = (rect.h - top_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                            cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height - (crosses_val_ax - arr_val[0])*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + top_val_axis_gap  - cat_ax_ext_y;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else
                        {
                            //подписей осей нет
                            cat_ax.labels = null;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + rect.h - first_val_axis_label_half_height - (arr_val[i] - arr_val[0])*unit_height;
                            cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height -  (crosses_val_ax - arr_val[0])*unit_height;
                        }
                    }
                    else
                    {//зеркально отражаем
                        if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                        {
                            if(cat_ax.crosses === CROSSES_MAX)
                            {
                                bottom_val_axis_gap = Math.max(cat_ax_ext_y, last_val_axis_label_half_height);
                                unit_height = (rect.h - bottom_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                cat_ax.posY = rect.y + first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                            }
                            else
                            {
                                cat_labels_align_bottom = false;
                                var top_points_height = first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                                if(top_points_height < cat_ax_ext_y)
                                {
                                    unit_height = (rect.h - cat_ax_ext_y - last_val_axis_label_half_height)/(arr_val[arr_val.length-1] - crosses_val_ax);
                                }
                                cat_ax.posY = rect.y + rect.h - last_val_axis_label_half_height - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                        {
                            cat_labels_align_bottom = false;
                            top_val_axis_gap = Math.max(first_val_axis_label_half_height, cat_ax_ext_y);
                            unit_height = (rect.h  - top_val_axis_gap - last_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                            cat_ax.yPos = rect.y + rect.h - last_val_axis_label_half_height - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;


                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = cat_ax.posY + (arr_val[0] - crosses_val_ax)*unit_height - cat_ax_ext_y;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                        {

                            bottom_val_axis_gap = Math.max(cat_ax_ext_y, last_val_axis_label_half_height);
                            unit_height = (rect.h  - bottom_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                            cat_ax.yPos = rect.y + first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                        }
                        else
                        {//подписей осей нет
                            cat_ax.labels = null;
                            unit_height = (rect.h  - last_val_axis_label_half_height - first_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + first_val_axis_label_half_height + (arr_val[i] - arr_val[0])*unit_height;
                        }
                    }

                    cat_ax.interval = unit_height;
                    //запишем в оси необходимую информацию для отрисовщика plotArea  и выставим окончательные позиции для подписей
                    var arr_labels, transform_text, local_text_transform;
                    if(val_ax.labels)
                    {
                        val_ax.labels.y = Math.min.apply(Math, arr_val_labels_points) - max_val_labels_text_height/2;
                        val_ax.labels.extY = Math.max.apply(Math, arr_val_labels_points) - Math.min.apply(Math, arr_val_labels_points) + max_val_labels_text_height;
                        arr_labels = val_ax.labels.arrLabels;
                        if(left_val_ax_labels_align)
                        {
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                arr_labels[i].txBody = arr_labels[i].tx.rich;
                                transform_text = arr_labels[i].transformText;
                                transform_text.Reset();
                                global_MatrixTransformer.TranslateAppend(transform_text, val_ax.labels.x + val_ax.labels.extX - val_axis_labels_gap - arr_labels[i].tx.rich.content.XLimit, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                local_text_transform = arr_labels[i].localTransformText;
                                local_text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(local_text_transform, val_ax.labels.x + val_ax.labels.extX - val_axis_labels_gap - arr_labels[i].tx.rich.content.XLimit, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);


                            }
                        }
                        else
                        {
                            var left_line = val_ax.labels.x + val_axis_labels_gap;
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                arr_labels[i].txBody = arr_labels[i].tx.rich;
                                transform_text = arr_labels[i].transformText;
                                transform_text.Reset();
                                global_MatrixTransformer.TranslateAppend(transform_text, left_line, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                local_text_transform = arr_labels[i].localTransformText;
                                local_text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(local_text_transform, left_line, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                            }
                        }
                    }
                    val_ax.yPoints = [];
                    for(i = 0; i < arr_val_labels_points.length; ++i)
                    {
                        val_ax.yPoints[i] = {val:arr_val[i], pos: arr_val_labels_points[i]};
                    }
                    cat_ax.xPoints = [];
                    for(i = 0; i <arr_cat_labels_points.length; ++i)
                    {
                        cat_ax.xPoints[i] = {val: i, pos: arr_cat_labels_points[i]};
                    }
                    if(cat_ax.labels)
                    {
                        if(!b_rotated)//подписи не повернутые
                        {
                            if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                            {
                                cat_ax.labels.x = arr_cat_labels_points[0] - max_cat_label_width/2;
                            }
                            else
                            {
                                cat_ax.labels.x = arr_cat_labels_points[arr_cat_labels_points.length-1] - max_cat_label_width/2;
                            }
                            cat_ax.labels.extX = arr_cat_labels_points[arr_cat_labels_points.length-1] + max_cat_label_width/2 - cat_ax.labels.x;

                            if(cat_labels_align_bottom)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                        label_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + labels_offset);
                                        //   global_MatrixTransformer.MultiplyAppend(label_text_transform, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + labels_offset);

                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                        label_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + cat_ax.labels.extY - labels_offset - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                                        //  global_MatrixTransformer.MultiplyAppend(label_text_transform, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + cat_ax.labels.extY - labels_offset - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());

                                    }
                                }
                            }
                        }
                        else
                        {
                            var left_x, right_x;
                            var w2, h2, x1, xc, yc, y0;
                            if(cat_labels_align_bottom)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Left);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                                        var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();//Todo: не расчитывать больше контент
                                        w2 = wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4);
                                        h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                        x1 = arr_cat_labels_points[i] + wh.h*Math.sin(Math.PI/4);

                                        y0 = cat_ax.labels.y + labels_offset;

                                        xc = x1 - w2/2;
                                        yc = y0 + h2/2;
                                        label_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, -wh.w/2, -wh.h/2);
                                        global_MatrixTransformer.RotateRadAppend(label_text_transform, Math.PI/4);//TODO
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, xc, yc);
                                        global_MatrixTransformer.MultiplyAppend(label_text_transform,this.transform);
                                        if(!isRealNumber(left_x))
                                        {
                                            left_x = xc - w2/2;
                                            right_x = xc + w2/2;
                                        }
                                        else
                                        {
                                            if(xc - w2/2 < left_x)
                                                left_x = xc - w2/2;
                                            if(xc + w2/2 > right_x)
                                                right_x = xc + w2/2;
                                        }

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, -wh.w/2, -wh.h/2);
                                        global_MatrixTransformer.RotateRadAppend(local_text_transform, Math.PI/4);//TODO
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, xc, yc);
                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Left);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                                        var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();//Todo: не расчитывать больше контент
                                        w2 = wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4);
                                        h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                        x1 = arr_cat_labels_points[i] - wh.h*Math.sin(Math.PI/4);

                                        y0 = cat_ax.labels.y + cat_ax.labels.extY - labels_offset;

                                        xc = x1 + w2/2;
                                        yc = y0 - h2/2;
                                        label_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, -wh.w/2, -wh.h/2);
                                        global_MatrixTransformer.RotateRadAppend(label_text_transform, Math.PI/4);//TODO
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, xc, yc);
                                        global_MatrixTransformer.MultiplyAppend(label_text_transform,this.transform);

                                        if(!isRealNumber(left_x))
                                        {
                                            left_x = xc - w2/2;
                                            right_x = xc + w2/2;
                                        }
                                        else
                                        {
                                            if(xc - w2/2 < left_x)
                                                left_x = xc - w2/2;
                                            if(xc + w2/2 > right_x)
                                                right_x = xc + w2/2;
                                        }

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, -wh.w/2, -wh.h/2);
                                        global_MatrixTransformer.RotateRadAppend(local_text_transform, Math.PI/4);//TODO
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, xc, yc);
                                    }
                                }
                            }
                            cat_ax.labels.x = left_x;
                            cat_ax.labels.extX = right_x - left_x;
                        }
                    }
                    cat_ax.xPoints.sort(function(a, b){return a.val - b.val});
                    val_ax.yPoints.sort(function(a, b){return a.val - b.val});
                }
            }
            else if(chart_type === historyitem_type_BarChart && chart_object.barDir === BAR_DIR_BAR)
            {
                var cat_ax, val_ax;
                var axis_by_types = chart_object.getAxisByTypes();
                cat_ax = axis_by_types.catAx[0];
                val_ax = axis_by_types.valAx[0];
                if(cat_ax && val_ax)
                {
                    /*---------------------new version---------------------------------------*/
                    val_ax.labels  = null;
                    cat_ax.labels  = null;

                    val_ax.posX  = null;
                    cat_ax.posY  = null;
                    val_ax.posY  = null;
                    cat_ax.posX  = null;
                    var sizes = this.getChartSizes();
                    var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                    var arr_val =  this.getValAxisValues();
                    //Получим строки для оси значений с учетом формата и единиц
                    var arr_strings = [];
                    var multiplier;
                    if(val_ax.dispUnits)
                        multiplier = val_ax.dispUnits.getMultiplier();
                    else
                        multiplier = 1;
                    var num_fmt = val_ax.numFmt;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            arr_strings.push(rich_value);
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            arr_strings.push(calc_value + "");
                        }
                    }



                    //расчитаем подписи горизонтальной оси значений
                    val_ax.labels = new CValAxisLabels(this);
                    var max_height = 0;
                    val_ax.xPoints = [];
                    var max_val_ax_label_width = 0;
                    for(i = 0; i < arr_strings.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = val_ax;
                        dlbl.chart = this;
                        dlbl.spPr = val_ax.spPr;
                        dlbl.txPr = val_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                        dlbl.txBody = dlbl.tx.rich;
                        var t = dlbl.tx.rich.recalculateByMaxWord();
                        var h = t.h;
                        if(t.w > max_val_ax_label_width)
                            max_val_ax_label_width = t.w;
                        if(h > max_height)
                            max_height = h;
                        val_ax.labels.arrLabels.push(dlbl);
                        val_ax.xPoints.push({val: arr_val[i], pos: null});
                    }

                    var val_axis_labels_gap = val_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*25.4/72;
                    val_ax.labels.extY = max_height + val_axis_labels_gap;

                    //расчитаем подписи для горизонтальной оси
                    var ser = chart_object.series[0];
                    var string_pts = [], pts_len = 0;
                    if(ser && ser.cat)
                    {
                        if(ser.cat.strRef && ser.cat.strRef.strCache)
                        {
                            string_pts = ser.cat.strRef.strCache.pt;
                            pts_len = string_pts.length;
                        }
                        else if(ser.cat.strLit)
                        {
                            string_pts = ser.cat.strLit.pt;
                            pts_len = string_pts.length;
                        }
                    }
                    var pts_len2 = pts_len;
                    // if(string_pts.length === 0)
                    {
                        if(ser.val)
                        {
                            if(ser.val.numRef && ser.val.numRef.numCache)
                                pts_len2 = ser.val.numRef.numCache.pts.length;
                            else if(ser.val.numLit)
                                pts_len2 = ser.val.numLit.pts.length;
                        }
                        if(pts_len2 > pts_len)
                        {
                            pts_len = pts_len2;
                            for(i = 0; i < pts_len2; ++i)
                            {
                                string_pts.push({val:i+1 + ""});
                            }
                        }
                    }
                    /*---------------------расчет позиции блока с подписями вертикальной оси-----------------------------------------------------------------------------*/
                    //расчитаем ширину интервала без учета горизонтальной оси;
                    var crosses;//номер категории в которой вертикалная ось пересекает горизонтальную;
                    if(val_ax.crosses === CROSSES_AUTO_ZERO || val_ax.crosses === CROSSES_MIN)
                        crosses = 1;
                    else if(val_ax.crosses === CROSSES_MAX)
                        crosses = string_pts.length;
                    else if(isRealNumber(val_ax.crossesAt))
                    {
                        if(val_ax.crossesAt <= string_pts.length + 1 && val_ax.crossesAt > 0)
                            crosses = val_ax.crossesAt;
                        else if(val_ax.crossesAt <= 0)
                            crosses = 1;
                        else
                            crosses = string_pts.length;
                    }
                    else
                        crosses = 1;

                    var cat_ax_orientation = cat_ax.scaling && isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var labels_pos = val_ax.tickLblPos;
                    var cross_between = isRealNumber(val_ax.crossBetween) ? val_ax.crossBetween : CROSS_BETWEEN_BETWEEN;

                    var bottom_val_ax_labels_align = true;//приленгание подписей оси значений к левому краю.

                    var intervals_count = cross_between === CROSS_BETWEEN_MID_CAT ? string_pts.length - 1 : string_pts.length;
                    var point_interval  = rect.h/intervals_count;//интервал между точками. Зависит от crossBetween, а также будет потом корректироваться в зависимости от подписей вертикальной и горизонтальной оси.


                    var bottom_points_height, top_point_height;
                    var arr_cat_labels_points = [];//массив середин подписей горизонтальной оси; i-й элемент - x-координата центра подписи категории с номером i;
                    if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        if(labels_pos === TICK_LABEL_POSITION_NONE || val_ax.bDelete === true)
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                            }
                            val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                        {
                            if(val_ax.crosses === CROSSES_MAX)
                            {
                                bottom_val_ax_labels_align = false;
                                val_ax.labels.y = rect.y;
                                point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                                val_ax.posY = val_ax.labels.y + val_ax.labels.extY;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = point_interval/2 + rect.y + rect.h - point_interval*i;
                                }
                            }
                            else
                            {
                                bottom_points_height = point_interval*(crosses-1);//общая ширина левых точек если считать что точки занимают все пространство
                                if(bottom_points_height < val_ax.labels.extY)//подписи верт. оси выходят за пределы области построения
                                {
                                    var top_intervals_count = intervals_count - (crosses - 1);//количесво интервалов выше горизонтальной оси
                                    //скорректируем point_interval, поделив расстояние, которое осталось справа от подписей осей на количество интервалов справа
                                    point_interval = (rect.h - val_ax.labels.extY)/top_intervals_count;
                                    val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                                    var start_point = val_ax.labels.y + (crosses-1)*point_interval;//y-координата точки низа области постоения

                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point - point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point - point_interval/2 - point_interval*i;
                                    }
                                }
                                else
                                {
                                    val_ax.labels.y = rect.y + rect.h - bottom_points_height;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                                    }
                                }
                                val_ax.posY = val_ax.labels.y;
                            }
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи снизу от области построения
                        {
                            point_interval = (rect.h -  val_ax.labels.extY)/intervals_count;
                            val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.y - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h  - val_ax.labels.extY - point_interval/2 - point_interval*i;
                            }
                            val_ax.posY = val_ax.labels.y - point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи сверху от области построения
                        {
                            point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            val_ax.labels.y = rect.y;
                            bottom_val_ax_labels_align = false;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] =rect.y + rect.h - (point_interval/2 + point_interval*i);
                            }
                            val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                        }
                        else
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                            }
                            val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                        }
                    }
                    else
                    {//то же самое, только зеркально отраженное
                        if(labels_pos === TICK_LABEL_POSITION_NONE || val_ax.bDelete === true)
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = rect.y + point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                        {
                            if(val_ax.crosses === CROSSES_MAX)
                            {
                                val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                                point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                                }
                                val_ax.posY = val_ax.labels.y;
                            }
                            else
                            {
                                bottom_val_ax_labels_align = false;
                                top_point_height = point_interval*(crosses-1);
                                if(top_point_height < val_ax.labels.extY)
                                {
                                    val_ax.labels.y = rect.y;
                                    var bottom_points_interval_count = intervals_count - (crosses - 1);
                                    point_interval = (rect.h - val_ax.labels.extY)/bottom_points_interval_count;
                                    var start_point_bottom = rect.y + rect.h - point_interval*intervals_count;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point_bottom + point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point_bottom + point_interval/2 + point_interval*i;
                                    }
                                }
                                else
                                {
                                    val_ax.labels.y = rect.y +  point_interval*(crosses-1) - val_ax.labels.extY;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.y + point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                                    }
                                }
                                val_ax.posY = val_ax.labels.y + val_ax.labels.extY;
                            }
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи сверху от области построения
                        {
                            bottom_val_ax_labels_align = false;
                            point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            val_ax.labels.y = rect.y;

                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.y + val_ax.labels.extY + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.y + val_ax.labels.extY + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = rect.y + val_ax.labels.extY + point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи снизу от области построения
                        {
                            point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = rect.y + point_interval*(crosses-1);
                        }
                        else
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = rect.y + point_interval*(crosses-1);
                        }
                    }

                    cat_ax.interval = point_interval;

                    var diagram_height = point_interval*intervals_count;//размер области с самой диаграммой позже будет корректироватся;
                    var max_cat_label_height = diagram_height / string_pts.length; // максимальная высота подписи горизонтальной оси;

                    cat_ax.labels = null;
                    var max_cat_labels_block_width = rect.w/2;
                    if(TICK_LABEL_POSITION_NONE !== cat_ax.tickLblPos && !(cat_ax.bDelete === true)) //будем корректировать вертикальные подписи только если есть горизонтальные
                    {
                        cat_ax.labels = new CValAxisLabels(this);
                        var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                        var max_min_width = 0;
                        var max_max_width = 0;
                        var max_content_width = 0;
                        var arr_min_max_min = [];
                        for(i = 0; i < string_pts.length; ++i)
                        {
                            var dlbl = null;
                            if(i%tick_lbl_skip === 0)
                            {
                                dlbl = new CDLbl();
                                dlbl.parent = cat_ax;
                                dlbl.chart = this;
                                dlbl.spPr = cat_ax.spPr;
                                dlbl.txPr = cat_ax.txPr;
                                dlbl.tx = new CChartText();
                                dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                                dlbl.tx.rich.content.Set_ApplyToAll(true);
                                dlbl.tx.rich.content.Set_ParagraphAlign(align_Center);
                                dlbl.tx.rich.content.Set_ApplyToAll(false);
                                var min_max =  dlbl.tx.rich.content.Recalculate_MinMaxContentWidth();
                                var max_min_content_width = min_max.Min;
                                if(min_max.Max > max_max_width)
                                    max_max_width = min_max.Max;

                                if(min_max.Min > max_min_width)
                                    max_min_width = min_max.Min;

                                arr_min_max_min[i] = min_max.Min;

                                dlbl.getMaxWidth = function(){return 20000};
                                dlbl.recalculate();
                                delete dlbl.getMaxWidth;
                                if(dlbl.tx.rich.content.XLimit > max_content_width)
                                    max_content_width = dlbl.tx.rich.content.XLimit;
                            }
                            cat_ax.labels.arrLabels.push(dlbl);
                        }
                        var stake_offset = isRealNumber(cat_ax.lblOffset) ? cat_ax.lblOffset/100 : 1;
                        var labels_offset = cat_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                        //сначала посмотрим убираются ли в максимальную допустимую ширину подписей подписи расчитанные в одну строку

                        var width_flag;
                        if(max_content_width + labels_offset < max_cat_labels_block_width)
                        {
                            width_flag = 0;
                            cat_ax.labels.extX = max_content_width + labels_offset;
                        }
                        else if(max_min_width + labels_offset < max_cat_labels_block_width)//ситуация, когда возможно разместить подписи без переноса слов
                        {
                            width_flag = 1;
                            cat_ax.labels.extX = max_min_width + labels_offset;
                        }
                        else //выставляем максимально возможную ширину
                        {
                            width_flag = 2;
                            cat_ax.labels.extX = max_cat_labels_block_width;
                        }
                    }
                    var cat_labels_align_left = true;//выравнивание подписей в блоке сподписями по левому краю(т. е. зазор находится справа)
                    /*-----------------------------------------------------------------------*/
                    var crosses_val_ax;//значение на горизонтальной оси значений в котором её пересекает горизонтальная
                    if(cat_ax.crosses === CROSSES_AUTO_ZERO)
                    {
                        if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                            crosses_val_ax = 0;
                        else if(arr_val[arr_val.length-1] < 0)
                            crosses_val_ax = arr_val[arr_val.length-1];
                        else
                            crosses_val_ax = arr_val[0];
                    }
                    else if(cat_ax.crosses === CROSSES_MIN)
                    {
                        crosses_val_ax = arr_val[0];
                    }
                    else if(cat_ax.crosses === CROSSES_MAX)
                    {
                        crosses_val_ax = arr_val[arr_val.length - 1];
                    }
                    else if(isRealNumber(cat_ax.crossesAt) && cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                    {
                        //сделаем провеку на попадание в интервал
                        if(cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                            crosses_val_ax = cat_ax.crossesAt;
                    }
                    else
                    { //ведем себя как в случае (cat_ax.crosses === CROSSES_AUTO_ZERO)
                        if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                            crosses_val_ax = 0;
                        else if(arr_val[arr_val.length-1] < 0)
                            crosses_val_ax = arr_val[arr_val.length-1];
                        else
                            crosses_val_ax = arr_val[0];
                    }
                    var val_ax_orientation = val_ax.scaling && isRealNumber(val_ax.scaling.orientation) ? val_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var hor_labels_pos = cat_ax.tickLblPos;



                    var first_val_lbl_half_width = (val_ax.tickLblPos === TICK_LABEL_POSITION_NONE || val_ax.bDelete) ? 0 : val_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                    var last_val_lbl_half_width = (val_ax.tickLblPos === TICK_LABEL_POSITION_NONE || val_ax.bDelete) ? 0 : val_ax.labels.arrLabels[val_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                    var right_gap, left_gap;

                    var arr_val_labels_points = [];//массив середин подписей вертикальной оси; i-й элемент - x-координата центра подписи i-огто значения;
                    var unit_width = (rect.w - first_val_lbl_half_width - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);//ширина единицы измерения на вертикальной оси
                    var cat_ax_ext_x = cat_ax.labels ? cat_ax.labels.extX : 0;
                    if(val_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                        {
                            if(cat_ax.crosses === CROSSES_MAX)
                            {
                                right_gap = Math.max(last_val_lbl_half_width, cat_ax_ext_x);
                                cat_labels_align_left = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                                if(cat_ax.labels)
                                    cat_ax.labels.x = rect.x + rect.w - right_gap;
                                unit_width = (rect.w - right_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                cat_ax.posX = rect.x + first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;
                            }
                            else
                            {
                                if((crosses_val_ax - arr_val[0])*unit_width + first_val_lbl_half_width  < cat_ax_ext_x)
                                {
                                    unit_width = (rect.w -  cat_ax_ext_x - last_val_lbl_half_width)/(arr_val[arr_val.length-1] - crosses_val_ax);
                                }
                                cat_ax.posX = rect.x + rect.w - last_val_lbl_half_width - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width;
                                if(cat_ax.labels)
                                    cat_ax.labels.x = cat_ax.posX - cat_ax_ext_x;
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                        {
                            left_gap = Math.max(first_val_lbl_half_width, cat_ax_ext_x);

                            unit_width = (rect.w - left_gap - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);

                            cat_ax.posX = rect.x + rect.w - (arr_val[arr_val.length-1] - crosses_val_ax )*unit_width - last_val_lbl_half_width;

                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width - cat_ax_ext_x;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                        {
                            cat_labels_align_left = false;

                            right_gap = Math.max(last_val_lbl_half_width, cat_ax_ext_x);
                            unit_width = (rect.w - right_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.posX = rect.x +  first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;

                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                        else
                        {
                            //подписей осей нет
                            cat_ax.labels = null;
                            unit_width = (rect.w - last_val_lbl_half_width - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.posX = rect.x +  first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                    }
                    else
                    {//зеркально отражаем
                        if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                        {
                            if(cat_ax.crosses === CROSSES_MAX)
                            {
                                left_gap = Math.max(cat_ax_ext_x, last_val_lbl_half_width);
                                unit_width = (rect.w - left_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                cat_ax.xPos = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                                if(cat_ax.labels)
                                    cat_ax.labels.x = cat_ax.xPos - cat_ax_ext_x;
                            }
                            else
                            {
                                cat_labels_align_left = false;
                                if(first_val_lbl_half_width < cat_ax_ext_x)
                                {
                                    unit_width = (rect.w - cat_ax_ext_x - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                }
                                cat_ax.xPos = rect.x + last_val_lbl_half_width + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width;
                                if(cat_ax.labels)
                                    cat_ax.labels.x = cat_ax.xPos;
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.xPos - (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                        {
                            cat_labels_align_left = false;
                            right_gap = Math.max(first_val_lbl_half_width, cat_ax_ext_x);
                            unit_width = (rect.w - last_val_lbl_half_width - right_gap)/(arr_val[arr_val.length-1] - arr_val[0]);
                            cat_ax.xPos = rect.x + last_val_lbl_half_width + (arr_val[arr_val.length-1] - crosses_val_ax)*crosses_val_ax;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.xPos - (arr_val[0] - crosses_val_ax)*unit_width;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.xPos - (arr_val[i] - crosses_val_ax)*unit_width;

                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                        {
                            left_gap = Math.max(cat_ax_ext_x, last_val_lbl_half_width);
                            unit_width = (rect.w - left_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.xPos = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.xPos - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width - cat_ax_ext_x;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.xPos - (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                        else
                        {//подписей осей нет
                            cat_ax.labels = null;
                            unit_width = (rect.w - last_val_lbl_half_width - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.xPos = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.xPos - (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                    }
                    val_ax.interval = unit_width;
                    //запишем в оси необходимую информацию для отрисовщика plotArea  и выставим окончательные позиции для подписей
                    var local_transform_text;
                    if(val_ax.labels)
                    {
                        val_ax.labels.x = Math.min.apply(Math, arr_val_labels_points) - max_val_ax_label_width/2;
                        val_ax.labels.extX = Math.max.apply(Math, arr_val_labels_points) - Math.min.apply(Math, arr_val_labels_points) + max_val_ax_label_width;
                        //val_axis_labels_gap - вертикальный зазор
                        if(bottom_val_ax_labels_align)
                        {
                            var y_pos = val_ax.labels.y + val_axis_labels_gap;
                            for(i = 0;  i < val_ax.labels.arrLabels.length; ++i)
                            {
                                var text_transform = val_ax.labels.arrLabels[i].transformText;
                                text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(text_transform, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, y_pos);
                                // global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                var local_transform_text = val_ax.labels.arrLabels[i].localTransformText;
                                local_transform_text.Reset();
                                global_MatrixTransformer.TranslateAppend(local_transform_text, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, y_pos);
                            }
                        }
                        else
                        {
                            for(i = 0;  i < val_ax.labels.arrLabels.length; ++i)
                            {
                                var text_transform = val_ax.labels.arrLabels[i].transformText;
                                text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(text_transform, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, val_ax.labels.y + val_ax.labels.extY - val_axis_labels_gap - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                                //    global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());


                                var local_transform_text = val_ax.labels.arrLabels[i].localTransformText;
                                local_transform_text.Reset();
                                global_MatrixTransformer.TranslateAppend(local_transform_text, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, val_ax.labels.y + val_ax.labels.extY - val_axis_labels_gap - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                            }
                        }
                    }
                    val_ax.xPoints = [];


                    for(i = 0; i < arr_val_labels_points.length; ++i)
                    {
                        val_ax.xPoints[i] = {val:arr_val[i], pos: arr_val_labels_points[i]};
                    }

                    cat_ax.yPoints = [];
                    for(i = 0; i <arr_cat_labels_points.length; ++i)
                    {
                        cat_ax.yPoints[i] = {val: i, pos: arr_cat_labels_points[i]};
                    }
                    if(cat_ax.labels)
                    {
                        cat_ax.labels.y = rect.y;
                        cat_ax.labels.extY = point_interval*intervals_count;
                        if(cat_labels_align_left)
                        {

                            if(width_flag === 0)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                        //     global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_transform_text = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }
                            else if(width_flag === 1)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, arr_min_max_min[i], 20000);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                        //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_transform_text = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 20000);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                        //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }



                            /*for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                             {
                             if(cat_ax.labels.arrLabels[i])
                             {
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Center);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 2000);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                             cat_ax.labels.arrLabels[i].setPosition(cat_ax.labels.x, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                             }
                             }    */
                        }
                        else
                        {
                            if(width_flag === 0)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                        //   global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }
                            else if(width_flag === 1)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, arr_min_max_min[i], 20000);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                        //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 20000);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                        //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                    }
                                }
                            }

                            /*for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                             {
                             if(cat_ax.labels.arrLabels[i])
                             {
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Center);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 2000);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                             cat_ax.labels.arrLabels[i].setPosition(cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                             }
                             }*/
                        }
                    }

                    cat_ax.yPoints.sort(function(a, b){return a.val - b.val});
                    val_ax.xPoints.sort(function(a, b){return a.val - b.val});
                }
            }
        }
    },

    recalculateAxis: function()
    {
        if(this.chart && this.chart.plotArea && this.chart.plotArea.chart)
        {
            var b_checkEmpty = this.checkEmptySeries();
            this.bEmptySeries = b_checkEmpty;
            if(b_checkEmpty)
                return;
            var plot_area = this.chart.plotArea;
            var chart_object = plot_area.chart;
            var i;
            var chart_type = chart_object.getObjectType();
            if(chart_type === historyitem_type_ScatterChart)
            {
                var gap_hor_axis = 4;
                var axis = chart_object.axId;
                var x_ax, y_ax;
                y_ax = this.chart.plotArea.valAx;
                x_ax = this.chart.plotArea.catAx;
                if(x_ax && y_ax)
                {
                    /*new recalc*/
                    y_ax.labels  = null;
                    x_ax.labels  = null;
                    y_ax.posX  = null;
                    x_ax.posY  = null;
                    y_ax.posY  = null;
                    x_ax.posX  = null;
                    var sizes = this.getChartSizes();
                    var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                    var arr_val =  this.getValAxisValues();
                    var arr_strings = [];
                    var multiplier;
                    if(y_ax.dispUnits)
                        multiplier = y_ax.dispUnits.getMultiplier();
                    else
                        multiplier = 1;
                    var num_fmt = y_ax.numFmt;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            arr_strings.push(rich_value);
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            arr_strings.push(calc_value + "");
                        }
                    }

                    //расчитаем подписи для вертикальной оси найдем ширину максимальной и возьмем её удвоенную за ширину подписей верт оси
                    var left_align_labels = true;
                    y_ax.labels = new CValAxisLabels(this);
                    y_ax.yPoints = [];
                    var max_width = 0;
                    for(i = 0; i < arr_strings.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = y_ax;
                        dlbl.chart = this;
                        dlbl.spPr = y_ax.spPr;
                        dlbl.txPr = y_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                        if(i > 0)
                        {
                            dlbl.lastStyleObject = y_ax.labels.arrLabels[0].lastStyleObject;
                        }
                        var cur_width = dlbl.tx.rich.recalculateByMaxWord().w;
                        if(cur_width > max_width)
                            max_width = cur_width;
                        y_ax.labels.arrLabels.push(dlbl);
                    }

                    //пока расстояние между подписями и краем блока с подписями берем размер шрифта.
                    var hor_gap = y_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72);
                    y_ax.labels.extX = max_width + hor_gap;

                    /*расчитаем надписи в блоке для горизонтальной оси*/
                    var arr_x_val = this.getXValAxisValues();
                    var num_fmt = x_ax.numFmt;
                    var string_pts = [];
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_x_val.length; ++i)
                        {
                            var calc_value = arr_x_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            string_pts.push({val:rich_value});
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_x_val.length; ++i)
                        {
                            var calc_value = arr_x_val[i]*multiplier;
                            string_pts.push({val:calc_value + ""});
                        }
                    }

                    x_ax.labels = new CValAxisLabels(this);
                    var bottom_align_labels = true;
                    var max_height = 0;
                    for(i = 0; i < string_pts.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = x_ax;
                        dlbl.chart = this;
                        dlbl.spPr = x_ax.spPr;
                        dlbl.txPr = x_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                        var cur_height = dlbl.tx.rich.recalculateByMaxWord().h;
                        if(cur_height > max_height)
                            max_height = cur_height;
                        x_ax.labels.arrLabels.push(dlbl);
                    }
                    var vert_gap = x_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72);
                    x_ax.labels.extY = max_height + vert_gap;


                    /*расчитаем позицию блока с подпиясями вертикальной оси*/
                    var x_ax_orientation = isRealObject(x_ax.scaling) && isRealNumber(x_ax.scaling.orientation) ? x_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var crosses;//точка на горизонтальной оси где её пересекает вертикальная
                    if(y_ax.crosses === CROSSES_AUTO_ZERO)
                    {
                        if(arr_x_val[0] <=0 && arr_x_val[arr_x_val.length -1] >= 0)
                            crosses = 0;
                        else if(arr_x_val[0] > 0)
                            crosses = arr_x_val[0];
                        else
                            crosses = arr_x_val[arr_x_val.length-1];
                    }
                    else if(y_ax.crosses === CROSSES_MAX)
                        crosses =  arr_x_val[arr_x_val.length-1];
                    else if(y_ax.crosses === CROSSES_MIN)
                        crosses = arr_x_val[0];
                    else if(isRealNumber(y_ax.crossesAt) && arr_val[0] <= y_ax.crossesAt && arr_val[arr_val.length-1] >= y_ax.crossesAt)
                    {
                        crosses = y_ax.crossesAt;
                    }
                    else
                    {
                        //в кайнем случае ведем себя как с AUTO_ZERO
                        if(arr_x_val[0] <=0 && arr_x_val[arr_x_val.length -1] >= 0)
                            crosses = 0;
                        else if(arr_x_val[0] > 0)
                            crosses = arr_x_val[0];
                        else
                            crosses = arr_x_val[arr_x_val.length-1];
                    }


                    var hor_interval_width = rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                    var vert_interval_height = rect.h/(arr_val[arr_val.length-1] - arr_val[0]);
                    var arr_x_points = [], arr_y_points = [];
                    var labels_pos = y_ax.tickLblPos;

                    var first_hor_label_half_width = (x_ax.tickLblPos === TICK_LABEL_POSITION_NONE || x_ax.bDelete) ? 0 : x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                    var last_hor_label_half_width = (x_ax.tickLblPos === TICK_LABEL_POSITION_NONE || x_ax.bDelete) ? 0 : x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                    var left_gap = 0, right_gap = 0;
                    if(x_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        switch(labels_pos)
                        {
                            case TICK_LABEL_POSITION_HIGH:
                            {
                                left_align_labels = false;

                                right_gap = Math.max(last_hor_label_half_width, y_ax.labels.extX);
                                hor_interval_width = (rect.w - right_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.labels.x = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.xPos = rect.x + first_hor_label_half_width + (crosses-arr_x_val[0])*hor_interval_width;
                                break;
                            }
                            case TICK_LABEL_POSITION_LOW:
                            {
                                left_gap = Math.max(first_hor_label_half_width, y_ax.labels.extX);
                                hor_interval_width = (rect.w-left_gap - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + left_gap + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.labels.x = rect.x + left_gap - y_ax.labels.extX;
                                y_ax.xPos = rect.x + left_gap + (crosses-arr_x_val[0])*hor_interval_width;
                                break;
                            }
                            case TICK_LABEL_POSITION_NONE:
                            {
                                y_ax.labels = null;
                                hor_interval_width = (rect.w- first_hor_label_half_width - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.xPos = rect.x + first_hor_label_half_width + hor_interval_width*(crosses - arr_x_val[0]);
                                break;
                            }
                            default :
                            {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                                if(y_ax.crosses === CROSSES_MAX)
                                {
                                    left_align_labels = false;
                                    right_gap = Math.max(right_gap, y_ax.labels.extX);

                                    y_ax.labels.x = rect.x + rect.w - right_gap;
                                    y_ax.xPos = rect.x + rect.w - right_gap;
                                    hor_interval_width = (rect.w - right_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                    }
                                }
                                else
                                {
                                    hor_interval_width = (rect.w - first_hor_label_half_width - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    if(first_hor_label_half_width + (crosses-arr_x_val[0])*hor_interval_width < y_ax.labels.extX)
                                    {
                                        hor_interval_width = (rect.w - y_ax.labels.extX - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - crosses);
                                    }
                                    y_ax.xPos = rect.x+ rect.w - last_hor_label_half_width - (arr_x_val[arr_x_val.length-1] - crosses)*hor_interval_width;
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = y_ax.xPos + (arr_x_val[i] - crosses)*hor_interval_width;
                                    }
                                    y_ax.labels.x = y_ax.xPos - y_ax.labels.extX;
                                }
                                break;
                            }
                        }
                    }
                    else
                    {
                        switch(labels_pos)
                        {
                            case TICK_LABEL_POSITION_HIGH:
                            {
                                left_gap = Math.max(y_ax.labels.extX, last_hor_label_half_width);
                                hor_interval_width = (rect.w - left_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);

                                y_ax.xPos = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width - first_hor_label_half_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                y_ax.labels.x = y_ax.xPos - (arr_x_val[arr_x_val.length-1]-crosses)*hor_interval_width - y_ax.labels.extX;
                                break;
                            }
                            case TICK_LABEL_POSITION_LOW:
                            {
                                left_align_labels = false;

                                right_gap = Math.max(y_ax.labels.extX, first_hor_label_half_width);
                                hor_interval_width = (rect.w - right_gap - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.xPos = rect.x + rect.w - right_gap - (crosses - arr_x_val[0])*hor_interval_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                y_ax.labels.x = rect.x + rect.w - right_gap;
                                break;
                            }
                            case TICK_LABEL_POSITION_NONE:
                            {
                                y_ax.labels = null;
                                hor_interval_width = (rect.w - first_hor_label_half_width - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.xPos = rect.x + rect.w - first_hor_label_half_width - (crosses - arr_x_val[0])*hor_interval_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                break;
                            }
                            default :
                            {//TICK_LABEL_POSITION_NEXT_TO рядом с осью

                                if(y_ax.crosses === CROSSES_MAX)
                                {
                                    left_gap = Math.max(y_ax.labels.extX, last_hor_label_half_width);
                                    hor_interval_width = (rect.w - left_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    y_ax.xPos = rect.x + rect.w - first_hor_label_half_width - (crosses-arr_x_val[0])*hor_interval_width;
                                    y_ax.labels.x = y_ax.xPos - ((arr_x_val[arr_x_val.length-1] - crosses)*hor_interval_width) - y_ax.labels.extX;
                                }
                                else
                                {
                                    left_align_labels = false;
                                    hor_interval_width = (rect.w - first_hor_label_half_width - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    if(first_hor_label_half_width + (crosses-arr_x_val[0])*hor_interval_width < y_ax.labels.extX)
                                    {
                                        hor_interval_width = (rect.w - y_ax.labels.extX - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - crosses);
                                    }
                                    left_align_labels = false;
                                    y_ax.xPos = rect.x + last_hor_label_half_width + hor_interval_width*(arr_x_val[arr_x_val.length-1] - crosses);
                                    y_ax.labels.x = y_ax.xPos;
                                }
                                for(i = 0;  i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos - (arr_x_val[i] - crosses)*hor_interval_width;
                                }
                                break;
                            }
                        }
                    }
                    x_ax.interval = hor_interval_width;

                    /*рассчитаем позицию блока с подписями горизонтальной оси*/
                    var y_ax_orientation = isRealObject(y_ax.scaling) && isRealNumber(y_ax.scaling.orientation) ? y_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var crosses_x;
                    if(x_ax.crosses === CROSSES_AUTO_ZERO)
                    {
                        if(arr_val[0] <= 0 && arr_val[arr_val.length-1] >=0)
                        {
                            crosses_x = 0;
                        }
                        else if(arr_val[0] > 0)
                            crosses_x = arr_val[0];
                        else
                            crosses_x = arr_val[arr_val.length-1];
                    }
                    else if(x_ax.crosses === CROSSES_MAX)
                    {
                        crosses_x = arr_val[arr_val.length-1];
                    }
                    else if(x_ax.crosses === CROSSES_MIN)
                    {
                        crosses_x = arr_val[0];
                    }
                    else if(isRealNumber(x_ax.crossesAt) && arr_val[0] <= x_ax.crossesAt && arr_val[arr_val.length-1] >= x_ax.crossesAt)
                    {
                        crosses_x = x_ax.crossesAt;
                    }
                    else
                    {   //как с AUTO_ZERO
                        if(arr_val[0] <= 0 && arr_val[arr_val.length-1] >=0)
                        {
                            crosses_x = 0;
                        }
                        else if(arr_val[0] > 0)
                            crosses_x = arr_val[0];
                        else
                            crosses_x = arr_val[arr_val.length-1];
                    }

                    var tick_labels_pos_x = x_ax.tickLblPos;

                    var first_vert_label_half_height = 0; //TODO (y_ax.tickLblPos === TICK_LABEL_POSITION_NONE || y_ax.bDelete) ? 0 :  y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                    var last_vert_label_half_height =  0; //(y_ax.tickLblPos === TICK_LABEL_POSITION_NONE || y_ax.bDelete) ? 0 :  y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;

                    var bottom_gap = 0, top_height = 0;
                    if(y_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        switch(tick_labels_pos_x)
                        {
                            case TICK_LABEL_POSITION_HIGH:
                            {
                                bottom_align_labels = false;
                                var bottom_start_point = rect.y + rect.h - first_vert_label_half_height;


                                top_height = Math.max(x_ax.labels.extY, last_vert_label_half_height);
                                vert_interval_height = (rect.h - top_height - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);

                                x_ax.labels.y = bottom_start_point - (arr_val[arr_val.length - 1] - arr_val[0])*vert_interval_height - x_ax.labels.extY;

                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = bottom_start_point - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.yPos = bottom_start_point - (crosses_x - arr_val[0])*vert_interval_height;
                                break;
                            }
                            case TICK_LABEL_POSITION_LOW:
                            {
                                bottom_gap = Math.max(x_ax.labels.extY, first_vert_label_half_height);
                                x_ax.labels.y = rect.y + rect.h - bottom_gap;
                                vert_interval_height = (rect.h - bottom_gap - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);

                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - bottom_gap -  (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.yPos = rect.y + rect.h - bottom_gap - (crosses_x - arr_val[0])*vert_interval_height;
                                break;
                            }
                            case TICK_LABEL_POSITION_NONE:
                            {
                                x_ax.labels = null;
                                vert_interval_height = (rect.h - first_vert_label_half_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - first_vert_label_half_height - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.yPos = rect.y + rect.h - first_vert_label_half_height - (crosses_x - arr_val[0])*vert_interval_height;
                                break;
                            }
                            default :
                            {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                                if(x_ax.crosses === CROSSES_MAX)
                                {
                                    bottom_align_labels = false;
                                    top_height = Math.max(x_ax.labels.extY, last_vert_label_half_height);

                                    vert_interval_height = (rect.h - top_height - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                    for(i = 0; i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = rect.y + rect.h - first_vert_label_half_height - (arr_val[i] - arr_val[0])*vert_interval_height;
                                    }
                                    x_ax.yPos = rect.y + rect.h - first_vert_label_half_height - (arr_val[arr_val.length-1] - arr_val[0])*vert_interval_height;
                                    x_ax.labels.y = x_ax.yPos - x_ax.labels.extY;
                                }
                                else
                                {
                                    vert_interval_height = (rect.h - first_vert_label_half_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                    if(first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height < x_ax.labels.extY)
                                    {
                                        vert_interval_height = (rect.h - x_ax.labels.extY - last_vert_label_half_height)/(arr_val[arr_val.length-1] - crosses_x);
                                    }

                                    x_ax.yPos = rect.y + last_vert_label_half_height+ (arr_val[arr_val.length-1] - crosses_x)*vert_interval_height;
                                    x_ax.labels.y = x_ax.yPos;
                                    for(i = 0;i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = x_ax.yPos - (arr_val[i] - crosses_x)*vert_interval_height;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    else
                    {
                        switch(tick_labels_pos_x)
                        {
                            case TICK_LABEL_POSITION_HIGH:
                            {
                                bottom_gap = Math.max(last_vert_label_half_height, x_ax.labels.extY);
                                vert_interval_height = (rect.h - bottom_gap - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                x_ax.yPos = rect.y + first_vert_label_half_height + (crosses_x - arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = x_ax.yPos + vert_interval_height*(arr_val[i] - crosses_x);
                                }
                                x_ax.labels.y = x_ax.yPos + vert_interval_height*(arr_val[arr_val.length-1] - crosses_x);
                                break;
                            }
                            case TICK_LABEL_POSITION_LOW:
                            {
                                top_height = Math.max(x_ax.labels.extY, first_vert_label_half_height);

                                bottom_align_labels = false;
                                vert_interval_height = (rect.h - top_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                x_ax.yPos = rect.y + top_height + (crosses_x- arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + top_height + vert_interval_height*(arr_val[i] - arr_val[0]);
                                }
                                x_ax.labels.y = rect.y + top_height - x_ax.labels.extY;
                                break;
                            }
                            case TICK_LABEL_POSITION_NONE:
                            {
                                x_ax.labels = null;
                                vert_interval_height = (rect.h - first_vert_label_half_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                x_ax.yPos = rect.y + first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length;++i)
                                {
                                    arr_y_points[i] = rect.y + first_vert_label_half_height + vert_interval_height*(arr_val[i] - arr_val[0]);
                                }
                                break;
                            }
                            default :
                            {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                                if(x_ax.crosses === CROSSES_MAX)
                                {
                                    bottom_gap = Math.max(x_ax.labels.extY, last_vert_label_half_height);


                                    vert_interval_height = (rect.h - bottom_gap - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                    x_ax.yPos = rect.y + first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height;
                                    for(i = 0; i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = rect.y + first_vert_label_half_height+ vert_interval_height*(arr_val[i] - arr_val[0]);
                                    }
                                    x_ax.labels.y = rect.y + rect.extY - bottom_gap;
                                }
                                else
                                {
                                    bottom_align_labels = false;

                                    vert_interval_height = (rect.h - last_vert_label_half_height - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                                    if(first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height < x_ax.labels.extY)
                                    {
                                        x_ax.yPos = rect.y + x_ax.labels.extY;
                                        vert_interval_height = (rect.h-x_ax.labels.extY - last_vert_label_half_height)/(arr_val[arr_val.length-1] - crosses_x);
                                    }
                                    else
                                    {
                                        x_ax.yPos = rect.y + rect.h - vert_interval_height*(arr_val[arr_val.length-1] - crosses_x) - last_vert_label_half_height;
                                    }
                                    x_ax.labels.y = x_ax.yPos - x_ax.labels.extY;
                                    for(i = 0; i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = x_ax.yPos + vert_interval_height*(arr_val[i] - crosses_x);
                                    }
                                }
                                break;
                            }
                        }
                    }
                    y_ax.interval = vert_interval_height;

                    y_ax.yPoints = [];
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        y_ax.yPoints.push({pos: arr_y_points[i], val: arr_val[i]});
                    }


                    x_ax.xPoints = [];
                    for(i = 0; i < arr_x_val.length; ++i)
                    {
                        x_ax.xPoints.push({pos: arr_x_points[i], val: arr_x_val[i]});
                    }

                    var arr_labels;
                    var text_transform;
                    var local_text_transform;
                    if(x_ax.bDelete)
                    {
                        x_ax.labels = null;
                    }
                    if(y_ax.bDelete)
                    {
                        y_ax.labels = null;
                    }
                    if(x_ax.labels)
                    {
                        arr_labels = x_ax.labels.arrLabels;
                        if(bottom_align_labels)
                        {
                            var top_line = x_ax.labels.y + vert_gap;
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                if(arr_labels[i])
                                {
                                    arr_labels[i].txBody = arr_labels[i].tx.rich;
                                    text_transform = arr_labels[i].transformText;


                                    text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, top_line);
                                   // global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());


                                    local_text_transform = arr_labels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, top_line);
                                }
                            }
                        }
                        else
                        {
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                if(arr_labels[i])
                                {
                                    arr_labels[i].txBody = arr_labels[i].tx.rich;
                                    text_transform = arr_labels[i].transformText;
                                    text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, x_ax.labels.y + x_ax.labels.extY - vert_gap - arr_labels[i].tx.rich.content.Get_SummaryHeight());
                                  //  global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                    local_text_transform = arr_labels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, x_ax.labels.y + x_ax.labels.extY - vert_gap - arr_labels[i].tx.rich.content.Get_SummaryHeight());

                                }
                            }
                        }
                    }


                    if(y_ax.labels)
                    {
                        arr_labels = y_ax.labels.arrLabels;
                        if(left_align_labels)
                        {
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                if(arr_labels[i])
                                {
                                    arr_labels[i].txBody = arr_labels[i].tx.rich;
                                    text_transform = arr_labels[i].transformText;
                                    text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(text_transform, y_ax.labels.x + y_ax.labels.extX - hor_gap - arr_labels[i].tx.rich.content.XLimit, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                               //     global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                    local_text_transform = arr_labels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, y_ax.labels.x + y_ax.labels.extX - hor_gap - arr_labels[i].tx.rich.content.XLimit, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                                }
                            }
                        }
                        else
                        {
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                if(arr_labels[i])
                                {
                                    arr_labels[i].txBody = arr_labels[i].tx.rich;
                                    text_transform = arr_labels[i].transformText;
                                    text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(text_transform, y_ax.labels.x + hor_gap, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                               //     global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                    local_text_transform = arr_labels[i].transformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, y_ax.labels.x + hor_gap, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);

                                }
                            }
                        }
                    }

                    if(y_ax.labels)
                    {
                        if(y_ax_orientation === ORIENTATION_MIN_MAX)
                        {
                            var t = y_ax.labels.arrLabels[y_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;
                            y_ax.labels.y = arr_y_points[arr_y_points.length-1] - t;
                            y_ax.labels.extY = arr_y_points[0] - arr_y_points[arr_y_points.length-1] + t + y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                        }
                        else
                        {
                            var t = y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                            y_ax.labels.y = arr_y_points[0] - t;
                            y_ax.labels.extY = arr_y_points[arr_y_points.length-1] - arr_y_points[0] + t + y_ax.labels.arrLabels[y_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;
                        }
                    }

                    if(x_ax.labels)
                    {
                        if(x_ax_orientation === ORIENTATION_MIN_MAX)
                        {
                            var t = x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                            x_ax.labels.x = arr_x_points[0] - t;
                            x_ax.labels.extX = arr_x_points[arr_x_points.length-1] + x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2 - x_ax.labels.x;
                        }
                        else
                        {
                            var t = x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                            x_ax.labels.x = arr_x_points[arr_x_points.length-1] - t;
                            x_ax.labels.extX = arr_x_points[0] + x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2 - x_ax.labels.x;
                        }
                    }
                    /*new recalc*/
                }
            }
            else if(chart_type !== historyitem_type_BarChart && (chart_type !== historyitem_type_PieChart && chart_type !== historyitem_type_DoughnutChart)
                || (chart_type === historyitem_type_BarChart && chart_object.barDir !== BAR_DIR_BAR))
            {
                var gap_hor_axis = 4;
                var axis = chart_object.axId;
                var cat_ax, val_ax;
                val_ax = this.chart.plotArea.valAx;
                cat_ax = this.chart.plotArea.catAx;
                if(val_ax && cat_ax)
                {
                    val_ax.labels  = null;
                    cat_ax.labels  = null;

                    val_ax.posX  = null;
                    cat_ax.posY  = null;
                    val_ax.posY  = null;
                    cat_ax.posX  = null;
                    var sizes = this.getChartSizes();
                    var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                    var arr_val =  this.getValAxisValues();
                    //Получим строки для оси значений с учетом формата и единиц
                    var arr_strings = [];
                    var multiplier;
                    if(val_ax.dispUnits)
                        multiplier = val_ax.dispUnits.getMultiplier();
                    else
                        multiplier = 1;
                    var num_fmt = val_ax.numFmt;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            arr_strings.push(rich_value);
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            arr_strings.push(calc_value + "");
                        }
                    }


                    /*если у нас шкала логарифмическая то будем вместо полученных значений использовать логарифм*/

                    val_ax.labels = new CValAxisLabels(this);
                    var max_width = 0;
                    val_ax.yPoints = [];

                    var max_val_labels_text_height = 0;
                    for(i = 0; i < arr_strings.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = val_ax;
                        dlbl.chart = this;
                        dlbl.spPr = val_ax.spPr;
                        dlbl.txPr = val_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                        var t = dlbl.tx.rich.recalculateByMaxWord();
                        var cur_width = t.w;
                        if(cur_width > max_width)
                            max_width = cur_width;
                        if(t.h > max_val_labels_text_height)
                            max_val_labels_text_height = t.h;
                        val_ax.labels.arrLabels.push(dlbl);
                        val_ax.yPoints.push({val: arr_val[i], pos: null});

                    }
                    var val_axis_labels_gap = val_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*25.4/72;
                    val_ax.labels.extX = max_width + val_axis_labels_gap;

                    //расчитаем подписи для горизонтальной оси
                    var ser = chart_object.series[0];
                    var string_pts = [], pts_len = 0;

                    /*string_pts  pts_len*/
                    if(ser && ser.cat)
                    {
                        var  lit;
                        if(ser.cat.strRef && ser.cat.strRef.strCache)
                        {
                            lit = ser.cat.strRef.strCache;
                        }
                        else if(ser.cat.strLit)
                        {
                            lit = ser.cat.strLit;
                        }
                        else if(ser.cat.numRef && ser.cat.numRef.numCache)
                        {
                            lit = ser.cat.numRef.numCache;
                        }
                        else if(ser.cat.numLit)
                        {
                            lit = ser.cat.numLit;
                        }
                        if(lit)
                        {
                            pts_len = lit.ptCount;
                            for(i = 0; i < pts_len; ++i)
                            {
                                var pt = lit.getPtByIndex(i);
                                if(pt)
                                {
                                    string_pts.push({val: pt.val + ""});
                                }
                                else
                                {
                                    string_pts.push({val: i + ""});
                                }
                            }
                        }
                    }
                    //if(string_pts.length === 0)
                    {
                        pts_len = 0;
                        for(i = 0; i < chart_object.series.length; ++i)
                        {
                            var cur_pts= null;
                            ser = chart_object.series[i];
                            if(ser.val)
                            {
                                if(ser.val.numRef && ser.val.numRef.numCache)
                                    cur_pts = ser.val.numRef.numCache;
                                else if(ser.val.numLit)
                                    cur_pts = ser.val.numLit;
                                if(cur_pts)
                                {
                                    pts_len = Math.max(pts_len, cur_pts.ptCount);
                                }
                            }
                        }
                        if(pts_len > string_pts.length)
                        {
                            for(i = 0; i < pts_len; ++i)
                            {
                                string_pts.push({val:i+1 + ""});
                            }
                        }
                    }
                    /*---------------------расчет позиции блока с подписями вертикальной оси-----------------------------------------------------------------------------*/
                    //расчитаем ширину интервала без учета горизонтальной оси;
                    var crosses;//номер категории в которой вертикалная ось пересекает горизонтальную;
                    if(val_ax.crosses === CROSSES_AUTO_ZERO || val_ax.crosses === CROSSES_MIN)
                        crosses = 1;
                    else if(val_ax.crosses === CROSSES_MAX)
                        crosses = string_pts.length;
                    else if(isRealNumber(val_ax.crossesAt))
                    {
                        if(val_ax.crossesAt <= string_pts.length + 1 && val_ax.crossesAt > 0)
                            crosses = val_ax.crossesAt;
                        else if(val_ax.crossesAt <= 0)
                            crosses = 1;
                        else
                            crosses = string_pts.length;
                    }
                    else
                        crosses = 1;

                    var cat_ax_orientation = cat_ax.scaling && isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var point_width = rect.w/string_pts.length;
                    var labels_pos = val_ax.tickLblPos;
                    var cross_between = isRealNumber(val_ax.crossBetween) ? val_ax.crossBetween : CROSS_BETWEEN_BETWEEN;

                    var left_val_ax_labels_align = true;//приленгание подписей оси значений к левому краю.

                    var intervals_count = cross_between === CROSS_BETWEEN_MID_CAT ? string_pts.length - 1 : string_pts.length;
                    var point_interval  = rect.w/intervals_count;//интервал между точками. Зависит от crossBetween, а также будет потом корректироваться в зависимости от подписей вертикальной и горизонтальной оси.

                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                        point_interval = rect.w/(string_pts.length - 1);
                    else
                        point_interval = rect.w/string_pts.length;

                    var left_points_width, right_point_width;
                    var arr_cat_labels_points = [];//массив середин подписей горизонтальной оси; i-й элемент - x-координата центра подписи категории с номером i;
                    if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                        {
                            if(val_ax.crosses === CROSSES_MAX)
                            {
                                left_val_ax_labels_align = false;
                                val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                                point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                                val_ax.posX = val_ax.labels.x;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                                }
                            }
                            else
                            {
                                left_points_width = point_interval*(crosses-1);//общая ширина левых точек если считать что точки занимают все пространство
                                if(left_points_width < val_ax.labels.extX)//подписи верт. оси выходят за пределы области построения
                                {
                                    var right_intervals_count = intervals_count - (crosses-1);//количесво интервалов правее вертикальной оси
                                    //скорректируем point_interval, поделив расстояние, которое осталось справа от подписей осей на количество интервалов справа
                                    point_interval = (rect.w - val_ax.labels.extX)/right_intervals_count;
                                    val_ax.labels.x = rect.x;
                                    var start_point = val_ax.labels.x + val_ax.labels.extX - (crosses-1)*point_interval;//x-координата точки, где начинается собственно область диаграммы
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point + point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = point_interval/2 + start_point + point_interval*i;
                                    }
                                }
                                else
                                {
                                    val_ax.labels.x = rect.x + left_points_width - val_ax.labels.extX;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.x + point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                                    }

                                }
                                val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                            }
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи слева от области построения
                        {
                            point_interval = (rect.w -  val_ax.labels.extX)/intervals_count;
                            val_ax.labels.x = rect.x;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + val_ax.labels.extX + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + val_ax.labels.extX + point_interval/2 + point_interval*i;
                            }
                            val_ax.posX = val_ax.labels.x + val_ax.labels.extX + point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи справа от области построения
                        {
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                            val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                            left_val_ax_labels_align = false;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                            }
                            val_ax.posX = rect.x + point_interval*(crosses-1);
                        }
                        else
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                            }
                            val_ax.posX = rect.x + point_interval*(crosses-1);
                        }
                    }
                    else
                    {//то же самое, только зеркально отраженное
                        if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                        {
                            if(val_ax.crosses === CROSSES_MAX)
                            {
                                val_ax.labels.x = rect.x;
                                point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                                }
                                val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                            }
                            else
                            {
                                left_val_ax_labels_align = false;
                                right_point_width = point_interval*(crosses-1);
                                if(right_point_width < val_ax.labels.extX)
                                {
                                    val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                                    var left_points_interval_count = intervals_count - (crosses - 1);
                                    point_interval = (val_ax.labels.x - rect.x)/left_points_interval_count;
                                    var start_point_right = rect.x + point_interval*intervals_count;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point_right - point_interval*i;

                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point_right - point_interval/2 - point_interval*i;
                                    }
                                }
                                else
                                {
                                    val_ax.labels.x = rect.x + rect.w - right_point_width;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;

                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                                    }
                                }
                                val_ax.posX = val_ax.labels.x;
                            }
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи справа от области построения
                        {
                            left_val_ax_labels_align = false;
                            point_interval = (rect.w -  val_ax.labels.extX)/intervals_count;
                            val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;

                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.x - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.x - point_interval/2 - point_interval*i;
                            }
                            val_ax.posX = rect.x + rect.w - point_interval*(crosses-1) - val_ax.labels.extX;
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи слева от области построения
                        {
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                            val_ax.labels.x = rect.x;

                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                            }

                            val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                        }
                        else
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                            }
                            val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                        }
                    }

                    cat_ax.interval = point_interval;

                    var diagram_width = point_interval*intervals_count;//размер области с самой диаграммой позже будет корректироватся;
                    var max_cat_label_width = diagram_width / string_pts.length; // максимальная ширина подписи горизонтальной оси;


                    cat_ax.labels = null;
                    var b_rotated = false;//флаг означает, что водписи не уместились в отведенное для них пространство и их пришлось перевернуть.
                    //проверим умещаются ли подписи горизонтальной оси в point_interval
                    if(TICK_LABEL_POSITION_NONE !== cat_ax.tickLblPos && !(cat_ax.bDelete === true)) //будем корректировать вертикальные подписи только если есть горизонтальные
                    {
                        cat_ax.labels = new CValAxisLabels(this);
                        var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                        var max_min_width = 0;
                        var max_max_width = 0;
                        var arr_max_contents = [];
                        for(i = 0; i < string_pts.length; ++i)
                        {
                            var dlbl = null;
                            if(i%tick_lbl_skip === 0)
                            {
                                dlbl = new CDLbl();
                                dlbl.parent = cat_ax;
                                dlbl.chart = this;
                                dlbl.spPr = cat_ax.spPr;
                                dlbl.txPr = cat_ax.txPr;
                                dlbl.tx = new CChartText();
                                dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                                //dlbl.recalculate();

                                var content = dlbl.tx.rich.content;
                                content.Set_ApplyToAll(true);
                                content.Set_ParagraphAlign(align_Center);
                                content.Set_ApplyToAll(false);
                                dlbl.txBody = dlbl.tx.rich;

                                var min_max =  dlbl.tx.rich.content.Recalculate_MinMaxContentWidth();
                                var max_min_content_width = min_max.Min;
                                if(max_min_content_width > max_min_width)
                                    max_min_width = max_min_content_width;
                                if(min_max.Max > max_max_width)
                                    max_max_width = min_max.Max;
                            }
                            cat_ax.labels.arrLabels.push(dlbl);
                        }
                        var stake_offset = isRealNumber(cat_ax.lblOffset) ? cat_ax.lblOffset/100 : 1;
                        var labels_offset = cat_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                        if(max_min_width < max_cat_label_width)//значит текст каждой из точек умещается в point_width
                        {
                            var max_height = 0;
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var content = cat_ax.labels.arrLabels[i].tx.rich.content;
                                    content.Reset(0, 0, max_cat_label_width, 20000);
                                    content.Recalculate_Page(0, true);
                                    var cur_height = content.Get_SummaryHeight();
                                    if(cur_height > max_height)
                                        max_height = cur_height;
                                }
                            }

                            cat_ax.labels.extY = max_height + labels_offset;
                            if(cross_between === CROSS_BETWEEN_MID_CAT) //корректируем позиции центров подписей горизонтальной оси, положение  вертикальной оси и её подписей
                            {
                                var left_gap_point, right_gap_point;
                                if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                                {
                                    var first_label_left_gap = cat_ax.labels.arrLabels[0].tx.rich.getMaxContentWidth(max_cat_label_width)/2;//на сколько вправа выходит первая подпись
                                    var last_labels_right_gap = cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1] ? cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1].tx.rich.getMaxContentWidth(max_cat_label_width)/2 : 0;

                                    //смотрим, выходит ли подпись первой категориии выходит за пределы области построения
                                    left_gap_point = arr_cat_labels_points[0] - first_label_left_gap;
                                    if(rect.x > left_gap_point)
                                    {
                                        if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                        {
                                            val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                        }
                                        //скорректируем point_interval
                                        point_interval *= (rect.w/(rect.x + rect.w - left_gap_point));
                                        //скорректируем arr_cat_labels_points
                                        for(i = 0; i < arr_cat_labels_points.length; ++i)
                                        {
                                            arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                        }
                                        //скорректируем позицию вертикальной оси
                                        val_ax.posX =  rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }

                                    //смотри выходит ли подпись последней категории за пределы области построения
                                    right_gap_point = arr_cat_labels_points[arr_cat_labels_points.length - 1] + last_labels_right_gap;
                                    if(right_gap_point > rect.x + rect.w)
                                    {
                                        if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                        {
                                            val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                        }
                                        //скорректируем point_interval
                                        point_interval *= (rect.w/(right_gap_point - rect.x));
                                        for(i = 0; i < arr_cat_labels_points.length; ++i)
                                        {
                                            arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                        }
                                        //скорректируем позицию вертикальной оси
                                        val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));

                                    }
                                }
                                else
                                {
                                    var last_label_left_gap = cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1] ? cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1].tx.rich.getMaxContentWidth(max_cat_label_width)/2 : 0;
                                    var first_label_right_gap = cat_ax.labels.arrLabels[0].tx.rich.getMaxContentWidth(max_cat_label_width)/2;
                                    left_gap_point = arr_cat_labels_points[arr_cat_labels_points.length - 1] - last_label_left_gap;
                                    right_gap_point = arr_cat_labels_points[0] + first_label_right_gap;
                                    if(rect.x > left_gap_point)
                                    {
                                        if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                        {
                                            val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                        }
                                        //скорректируем point_interval
                                        point_interval *= (rect.w/(rect.x + rect.w - left_gap_point));
                                        //скорректируем arr_cat_labels_points
                                        for(i = 0; i < arr_cat_labels_points.length; ++i)
                                        {
                                            arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                        }

                                        //скорректируем позицию вертикальной оси
                                        val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    if(right_gap_point > rect.x + rect.w)
                                    {
                                        if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                        {
                                            val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                        }
                                        //скорректируем point_interval
                                        point_interval *= (rect.w/(right_gap_point - rect.x));
                                        for(i = 0; i < arr_cat_labels_points.length; ++i)
                                        {
                                            arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                        }
                                        //скорректируем позицию вертикальной оси
                                        val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                }
                            }
                        }
                        else
                        {
                            b_rotated = true;
                            //пока сделаем без обрезки
                            var arr_left_points = [];
                            var arr_right_points = [];

                            var max_rotated_height = 0;
                            //смотрим на сколько подписи горизонтальной оси выходят влево за пределы области построения
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    //сначала расчитаем высоту и ширину подписи так чтобы она умещалась в одну строку
                                    var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();
                                    arr_left_points[i] = arr_cat_labels_points[i] - (wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4) - wh.h*Math.sin(Math.PI/4)/2);//вычитаем из точки привязки ширину получившейся подписи
                                    arr_right_points[i] = arr_cat_labels_points[i] + wh.h*Math.sin(Math.PI/4)/2;
                                    var h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                    if(h2 > max_rotated_height)
                                        max_rotated_height = h2;
                                }
                                else
                                {//подписи нет
                                    arr_left_points[i] = arr_cat_labels_points[i];
                                    arr_right_points[i] = arr_cat_labels_points[i];
                                }
                            }

                            cat_ax.labels.extY = max_rotated_height + labels_offset;
                            //
                            left_gap_point = Math.min.apply(Math, arr_left_points);
                            right_gap_point = Math.max.apply(Math, arr_right_points);

                            if(ORIENTATION_MIN_MAX === cat_ax_orientation)
                            {
                                if(rect.x > left_gap_point)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= rect.w/(rect.x + rect.w - left_gap_point);
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }
                                //смотри выходит ли подпись последней категории за пределы области построения
                                if(right_gap_point > rect.x + rect.w)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (right_gap_point - rect.x)/(rect.x + rect.w - rect.x);
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }


                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
                                }
                            }
                            else
                            {
                                if(rect.x > left_gap_point)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (rect.w)/(rect.x + rect.w - left_gap_point);
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }
                                if(right_gap_point > rect.x + rect.w)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (right_gap_point - rect.x)/(rect.x + rect.w - rect.x);
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)(rect.w/(right_gap_point - rect.x));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
                                }
                            }
                        }
                    }

                    //расчет позиции блока с подписями горизонтальной оси
                    var cat_labels_align_bottom = true;
                    /*-----------------------------------------------------------------------*/
                    var crosses_val_ax;//значение на ветикальной оси в котором её пересекает горизонтальная

                    if(cat_ax.crosses === CROSSES_AUTO_ZERO)
                    {
                        if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                            crosses_val_ax = 0;
                        else if(arr_val[arr_val.length-1] < 0)
                            crosses_val_ax = arr_val[arr_val.length-1];
                        else
                            crosses_val_ax = arr_val[0];
                    }
                    else if(cat_ax.crosses === CROSSES_MIN)
                    {
                        crosses_val_ax = arr_val[0];
                    }
                    else if(cat_ax.crosses === CROSSES_MAX)
                    {
                        crosses_val_ax = arr_val[arr_val.length - 1];
                    }
                    else if(isRealNumber(cat_ax.crossesAt) && cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                    {
                        //сделаем провеку на попадание в интервал
                        if(cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                            crosses_val_ax = cat_ax.crossesAt;
                    }
                    else
                    { //ведем себя как в случае (cat_ax.crosses === CROSSES_AUTO_ZERO)
                        if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                            crosses_val_ax = 0;
                        else if(arr_val[arr_val.length-1] < 0)
                            crosses_val_ax = arr_val[arr_val.length-1];
                        else
                            crosses_val_ax = arr_val[0];
                    }
                    var val_ax_orientation = val_ax.scaling && isRealNumber(val_ax.scaling.orientation) ? val_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var hor_labels_pos = cat_ax.tickLblPos;

                    var arr_val_labels_points = [];//массив середин подписей вертикальной оси; i-й элемент - y-координата центра подписи i-огто значения;
                    var top_val_axis_gap, bottom_val_axis_gap;
                    var first_val_axis_label_half_height =0; //TODO  (val_ax.bDelete || val_ax.tickLblPos ===TICK_LABEL_POSITION_NONE) ? 0 :val_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                    var last_val_axis_label_half_height = 0; //TODO (val_ax.bDelete || val_ax.tickLblPos ===TICK_LABEL_POSITION_NONE) ? 0 : val_ax.labels.arrLabels[val_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;

                    var unit_height = (rect.h - first_val_axis_label_half_height - last_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);//высота единицы измерения на вертикальной оси

                    var cat_ax_ext_y = cat_ax.labels ? cat_ax.labels.extY : 0;
                    if(val_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                        {
                            if(cat_ax.crosses === CROSSES_MAX)
                            {
                                cat_labels_align_bottom = false;
                                top_val_axis_gap = Math.max(last_val_axis_label_half_height, cat_ax_ext_y);
                                unit_height = (rect.h - top_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                                cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height - (crosses_val_ax - arr_val[0])*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;
                            }
                            else
                            {
                                var bottom_points_height = first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;//высота области под горизонтальной осью
                                if(bottom_points_height < cat_ax_ext_y)
                                {
                                    unit_height = (rect.h - last_val_axis_label_half_height - cat_ax_ext_y)/(arr_val[arr_val.length-1] - crosses_val_ax);
                                }
                                cat_ax.posY = rect.y + last_val_axis_label_half_height + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY;
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                        {
                            bottom_val_axis_gap = Math.max(cat_ax_ext_y, first_val_axis_label_half_height);
                            unit_height = (rect.h - bottom_val_axis_gap - last_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.posY = rect.y + last_val_axis_label_half_height + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                        {
                            top_val_axis_gap = Math.max(last_val_axis_label_half_height, cat_ax_ext_y);
                            unit_height = (rect.h - top_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                            cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height - (crosses_val_ax - arr_val[0])*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + top_val_axis_gap  - cat_ax_ext_y;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else
                        {
                            //подписей осей нет
                            cat_ax.labels = null;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + rect.h - first_val_axis_label_half_height - (arr_val[i] - arr_val[0])*unit_height;
                            cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height -  (crosses_val_ax - arr_val[0])*unit_height;
                        }
                    }
                    else
                    {//зеркально отражаем
                        if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                        {
                            if(cat_ax.crosses === CROSSES_MAX)
                            {
                                bottom_val_axis_gap = Math.max(cat_ax_ext_y, last_val_axis_label_half_height);
                                unit_height = (rect.h - bottom_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                cat_ax.posY = rect.y + first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                            }
                            else
                            {
                                cat_labels_align_bottom = false;
                                var top_points_height = first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                                if(top_points_height < cat_ax_ext_y)
                                {
                                    unit_height = (rect.h - cat_ax_ext_y - last_val_axis_label_half_height)/(arr_val[arr_val.length-1] - crosses_val_ax);
                                }
                                cat_ax.posY = rect.y + rect.h - last_val_axis_label_half_height - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                        {
                            cat_labels_align_bottom = false;
                            top_val_axis_gap = Math.max(first_val_axis_label_half_height, cat_ax_ext_y);
                            unit_height = (rect.h  - top_val_axis_gap - last_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                            cat_ax.yPos = rect.y + rect.h - last_val_axis_label_half_height - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;


                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = cat_ax.posY + (arr_val[0] - crosses_val_ax)*unit_height - cat_ax_ext_y;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                        {

                            bottom_val_axis_gap = Math.max(cat_ax_ext_y, last_val_axis_label_half_height);
                            unit_height = (rect.h  - bottom_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                            cat_ax.yPos = rect.y + first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                        }
                        else
                        {//подписей осей нет
                            cat_ax.labels = null;
                            unit_height = (rect.h  - last_val_axis_label_half_height - first_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]);
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + first_val_axis_label_half_height + (arr_val[i] - arr_val[0])*unit_height;
                        }
                    }

                    cat_ax.interval = unit_height;
                    //запишем в оси необходимую информацию для отрисовщика plotArea  и выставим окончательные позиции для подписей
                    var arr_labels, transform_text, local_text_transform;
                    if(val_ax.labels)
                    {
                        val_ax.labels.y = Math.min.apply(Math, arr_val_labels_points) - max_val_labels_text_height/2;
                        val_ax.labels.extY = Math.max.apply(Math, arr_val_labels_points) - Math.min.apply(Math, arr_val_labels_points) + max_val_labels_text_height;
                        arr_labels = val_ax.labels.arrLabels;
                        if(left_val_ax_labels_align)
                        {
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                arr_labels[i].txBody = arr_labels[i].tx.rich;
                                transform_text = arr_labels[i].transformText;
                                transform_text.Reset();
                                global_MatrixTransformer.TranslateAppend(transform_text, val_ax.labels.x + val_ax.labels.extX - val_axis_labels_gap - arr_labels[i].tx.rich.content.XLimit, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                              //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                local_text_transform = arr_labels[i].localTransformText;
                                local_text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(local_text_transform, val_ax.labels.x + val_ax.labels.extX - val_axis_labels_gap - arr_labels[i].tx.rich.content.XLimit, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);


                            }
                        }
                        else
                        {
                            var left_line = val_ax.labels.x + val_axis_labels_gap;
                            for(i = 0; i < arr_labels.length; ++i)
                            {
                                arr_labels[i].txBody = arr_labels[i].tx.rich;
                                transform_text = arr_labels[i].transformText;
                                transform_text.Reset();
                                global_MatrixTransformer.TranslateAppend(transform_text, left_line, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                              //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                local_text_transform = arr_labels[i].localTransformText;
                                local_text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(local_text_transform, left_line, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                            }
                        }
                    }
                    val_ax.yPoints = [];
                    for(i = 0; i < arr_val_labels_points.length; ++i)
                    {
                        val_ax.yPoints[i] = {val:arr_val[i], pos: arr_val_labels_points[i]};
                    }
                    cat_ax.xPoints = [];
                    for(i = 0; i <arr_cat_labels_points.length; ++i)
                    {
                        cat_ax.xPoints[i] = {val: i, pos: arr_cat_labels_points[i]};
                    }
                    if(cat_ax.labels)
                    {
                        if(!b_rotated)//подписи не повернутые
                        {
                            if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                            {
                                cat_ax.labels.x = arr_cat_labels_points[0] - max_cat_label_width/2;
                            }
                            else
                            {
                                cat_ax.labels.x = arr_cat_labels_points[arr_cat_labels_points.length-1] - max_cat_label_width/2;
                            }
                            cat_ax.labels.extX = arr_cat_labels_points[arr_cat_labels_points.length-1] + max_cat_label_width/2 - cat_ax.labels.x;

                            if(cat_labels_align_bottom)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                        label_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + labels_offset);
                                     //   global_MatrixTransformer.MultiplyAppend(label_text_transform, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + labels_offset);

                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                        label_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + cat_ax.labels.extY - labels_offset - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                                      //  global_MatrixTransformer.MultiplyAppend(label_text_transform, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + cat_ax.labels.extY - labels_offset - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());

                                    }
                                }
                            }
                        }
                        else
                        {
                            var left_x, right_x;
                            var w2, h2, x1, xc, yc, y0;
                            if(cat_labels_align_bottom)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Left);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                                        var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();//Todo: не расчитывать больше контент
                                        w2 = wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4);
                                        h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                        x1 = arr_cat_labels_points[i] + wh.h*Math.sin(Math.PI/4);

                                        y0 = cat_ax.labels.y + labels_offset;

                                        xc = x1 - w2/2;
                                        yc = y0 + h2/2;
                                        label_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, -wh.w/2, -wh.h/2);
                                        global_MatrixTransformer.RotateRadAppend(label_text_transform, Math.PI/4);//TODO
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, xc, yc);
                                        global_MatrixTransformer.MultiplyAppend(label_text_transform,this.transform);
                                        if(!isRealNumber(left_x))
                                        {
                                            left_x = xc - w2/2;
                                            right_x = xc + w2/2;
                                        }
                                        else
                                        {
                                            if(xc - w2/2 < left_x)
                                                left_x = xc - w2/2;
                                            if(xc + w2/2 > right_x)
                                                right_x = xc + w2/2;
                                        }

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, -wh.w/2, -wh.h/2);
                                        global_MatrixTransformer.RotateRadAppend(local_text_transform, Math.PI/4);//TODO
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, xc, yc);
                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Left);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                                        var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();//Todo: не расчитывать больше контент
                                        w2 = wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4);
                                        h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                        x1 = arr_cat_labels_points[i] - wh.h*Math.sin(Math.PI/4);

                                        y0 = cat_ax.labels.y + cat_ax.labels.extY - labels_offset;

                                        xc = x1 + w2/2;
                                        yc = y0 - h2/2;
                                        label_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, -wh.w/2, -wh.h/2);
                                        global_MatrixTransformer.RotateRadAppend(label_text_transform, Math.PI/4);//TODO
                                        global_MatrixTransformer.TranslateAppend(label_text_transform, xc, yc);
                                        global_MatrixTransformer.MultiplyAppend(label_text_transform,this.transform);

                                        if(!isRealNumber(left_x))
                                        {
                                            left_x = xc - w2/2;
                                            right_x = xc + w2/2;
                                        }
                                        else
                                        {
                                            if(xc - w2/2 < left_x)
                                                left_x = xc - w2/2;
                                            if(xc + w2/2 > right_x)
                                                right_x = xc + w2/2;
                                        }

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, -wh.w/2, -wh.h/2);
                                        global_MatrixTransformer.RotateRadAppend(local_text_transform, Math.PI/4);//TODO
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, xc, yc);
                                    }
                                }
                            }
                            cat_ax.labels.x = left_x;
                            cat_ax.labels.extX = right_x - left_x;
                        }
                    }
                    cat_ax.xPoints.sort(function(a, b){return a.val - b.val});
                    val_ax.yPoints.sort(function(a, b){return a.val - b.val});
                }
            }
            else if(chart_type === historyitem_type_BarChart && chart_object.barDir === BAR_DIR_BAR)
            {
                var cat_ax, val_ax;
                var axis_by_types = chart_object.getAxisByTypes();
                cat_ax = axis_by_types.catAx[0];
                val_ax = axis_by_types.valAx[0];
                if(cat_ax && val_ax)
                {
                    /*---------------------new version---------------------------------------*/
                    val_ax.labels  = null;
                    cat_ax.labels  = null;

                    val_ax.posX  = null;
                    cat_ax.posY  = null;
                    val_ax.posY  = null;
                    cat_ax.posX  = null;
                    var sizes = this.getChartSizes();
                    var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                    var arr_val =  this.getValAxisValues();
                    //Получим строки для оси значений с учетом формата и единиц
                    var arr_strings = [];
                    var multiplier;
                    if(val_ax.dispUnits)
                        multiplier = val_ax.dispUnits.getMultiplier();
                    else
                        multiplier = 1;
                    var num_fmt = val_ax.numFmt;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            arr_strings.push(rich_value);
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            arr_strings.push(calc_value + "");
                        }
                    }



                    //расчитаем подписи горизонтальной оси значений
                    val_ax.labels = new CValAxisLabels(this);
                    var max_height = 0;
                    val_ax.xPoints = [];
                    var max_val_ax_label_width = 0;
                    for(i = 0; i < arr_strings.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = val_ax;
                        dlbl.chart = this;
                        dlbl.spPr = val_ax.spPr;
                        dlbl.txPr = val_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                        dlbl.txBody = dlbl.tx.rich;
                        var t = dlbl.tx.rich.recalculateByMaxWord();
                        var h = t.h;
                        if(t.w > max_val_ax_label_width)
                            max_val_ax_label_width = t.w;
                        if(h > max_height)
                            max_height = h;
                        val_ax.labels.arrLabels.push(dlbl);
                        val_ax.xPoints.push({val: arr_val[i], pos: null});
                    }

                    var val_axis_labels_gap = val_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*25.4/72;
                    val_ax.labels.extY = max_height + val_axis_labels_gap;

                    //расчитаем подписи для горизонтальной оси
                    var ser = chart_object.series[0];
                    var string_pts = [], pts_len = 0;
                    if(ser && ser.cat)
                    {
                        if(ser.cat.strRef && ser.cat.strRef.strCache)
                        {
                            string_pts = ser.cat.strRef.strCache.pt;
                            pts_len = string_pts.length;
                        }
                        else if(ser.cat.strLit)
                        {
                            string_pts = ser.cat.strLit.pt;
                            pts_len = string_pts.length;
                        }
                    }
                    var pts_len2 = pts_len;
                   // if(string_pts.length === 0)
                    {
                        if(ser.val)
                        {
                            if(ser.val.numRef && ser.val.numRef.numCache)
                                pts_len2 = ser.val.numRef.numCache.pts.length;
                            else if(ser.val.numLit)
                                pts_len2 = ser.val.numLit.pts.length;
                        }
                        if(pts_len2 > pts_len)
                        {
                            pts_len = pts_len2;
                            for(i = 0; i < pts_len2; ++i)
                            {
                                string_pts.push({val:i+1 + ""});
                            }
                        }
                    }
                    /*---------------------расчет позиции блока с подписями вертикальной оси-----------------------------------------------------------------------------*/
                    //расчитаем ширину интервала без учета горизонтальной оси;
                    var crosses;//номер категории в которой вертикалная ось пересекает горизонтальную;
                    if(val_ax.crosses === CROSSES_AUTO_ZERO || val_ax.crosses === CROSSES_MIN)
                        crosses = 1;
                    else if(val_ax.crosses === CROSSES_MAX)
                        crosses = string_pts.length;
                    else if(isRealNumber(val_ax.crossesAt))
                    {
                        if(val_ax.crossesAt <= string_pts.length + 1 && val_ax.crossesAt > 0)
                            crosses = val_ax.crossesAt;
                        else if(val_ax.crossesAt <= 0)
                            crosses = 1;
                        else
                            crosses = string_pts.length;
                    }
                    else
                        crosses = 1;

                    var cat_ax_orientation = cat_ax.scaling && isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var labels_pos = val_ax.tickLblPos;
                    var cross_between = isRealNumber(val_ax.crossBetween) ? val_ax.crossBetween : CROSS_BETWEEN_BETWEEN;

                    var bottom_val_ax_labels_align = true;//приленгание подписей оси значений к левому краю.

                    var intervals_count = cross_between === CROSS_BETWEEN_MID_CAT ? string_pts.length - 1 : string_pts.length;
                    var point_interval  = rect.h/intervals_count;//интервал между точками. Зависит от crossBetween, а также будет потом корректироваться в зависимости от подписей вертикальной и горизонтальной оси.


                    var bottom_points_height, top_point_height;
                    var arr_cat_labels_points = [];//массив середин подписей горизонтальной оси; i-й элемент - x-координата центра подписи категории с номером i;
                    if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        if(labels_pos === TICK_LABEL_POSITION_NONE || val_ax.bDelete === true)
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                            }
                            val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                        {
                            if(val_ax.crosses === CROSSES_MAX)
                            {
                                bottom_val_ax_labels_align = false;
                                val_ax.labels.y = rect.y;
                                point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                                val_ax.posY = val_ax.labels.y + val_ax.labels.extY;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = point_interval/2 + rect.y + rect.h - point_interval*i;
                                }
                            }
                            else
                            {
                                bottom_points_height = point_interval*(crosses-1);//общая ширина левых точек если считать что точки занимают все пространство
                                if(bottom_points_height < val_ax.labels.extY)//подписи верт. оси выходят за пределы области построения
                                {
                                    var top_intervals_count = intervals_count - (crosses - 1);//количесво интервалов выше горизонтальной оси
                                    //скорректируем point_interval, поделив расстояние, которое осталось справа от подписей осей на количество интервалов справа
                                    point_interval = (rect.h - val_ax.labels.extY)/top_intervals_count;
                                    val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                                    var start_point = val_ax.labels.y + (crosses-1)*point_interval;//y-координата точки низа области постоения

                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point - point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point - point_interval/2 - point_interval*i;
                                    }
                                }
                                else
                                {
                                    val_ax.labels.y = rect.y + rect.h - bottom_points_height;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                                    }
                                }
                                val_ax.posY = val_ax.labels.y;
                            }
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи снизу от области построения
                        {
                            point_interval = (rect.h -  val_ax.labels.extY)/intervals_count;
                            val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.y - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h  - val_ax.labels.extY - point_interval/2 - point_interval*i;
                            }
                            val_ax.posY = val_ax.labels.y - point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи сверху от области построения
                        {
                            point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            val_ax.labels.y = rect.y;
                            bottom_val_ax_labels_align = false;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] =rect.y + rect.h - (point_interval/2 + point_interval*i);
                            }
                            val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                        }
                        else
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                            }
                            val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                        }
                    }
                    else
                    {//то же самое, только зеркально отраженное
                        if(labels_pos === TICK_LABEL_POSITION_NONE || val_ax.bDelete === true)
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = rect.y + point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                        {
                            if(val_ax.crosses === CROSSES_MAX)
                            {
                                val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                                point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                                }
                                val_ax.posY = val_ax.labels.y;
                            }
                            else
                            {
                                bottom_val_ax_labels_align = false;
                                top_point_height = point_interval*(crosses-1);
                                if(top_point_height < val_ax.labels.extY)
                                {
                                    val_ax.labels.y = rect.y;
                                    var bottom_points_interval_count = intervals_count - (crosses - 1);
                                    point_interval = (rect.h - val_ax.labels.extY)/bottom_points_interval_count;
                                    var start_point_bottom = rect.y + rect.h - point_interval*intervals_count;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point_bottom + point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point_bottom + point_interval/2 + point_interval*i;
                                    }
                                }
                                else
                                {
                                    val_ax.labels.y = rect.y +  point_interval*(crosses-1) - val_ax.labels.extY;
                                    if(cross_between === CROSS_BETWEEN_MID_CAT)
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.y + point_interval*i;
                                    }
                                    else
                                    {
                                        for(i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                                    }
                                }
                                val_ax.posY = val_ax.labels.y + val_ax.labels.extY;
                            }
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи сверху от области построения
                        {
                            bottom_val_ax_labels_align = false;
                            point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            val_ax.labels.y = rect.y;

                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.y + val_ax.labels.extY + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.y + val_ax.labels.extY + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = rect.y + val_ax.labels.extY + point_interval*(crosses-1);
                        }
                        else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи снизу от области построения
                        {
                            point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = rect.y + point_interval*(crosses-1);
                        }
                        else
                        {
                            val_ax.labels = null;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = rect.y + point_interval*(crosses-1);
                        }
                    }

                    cat_ax.interval = point_interval;

                    var diagram_height = point_interval*intervals_count;//размер области с самой диаграммой позже будет корректироватся;
                    var max_cat_label_height = diagram_height / string_pts.length; // максимальная высота подписи горизонтальной оси;

                    cat_ax.labels = null;
                    var max_cat_labels_block_width = rect.w/2;
                    if(TICK_LABEL_POSITION_NONE !== cat_ax.tickLblPos && !(cat_ax.bDelete === true)) //будем корректировать вертикальные подписи только если есть горизонтальные
                    {
                        cat_ax.labels = new CValAxisLabels(this);
                        var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                        var max_min_width = 0;
                        var max_max_width = 0;
                        var max_content_width = 0;
                        var arr_min_max_min = [];
                        for(i = 0; i < string_pts.length; ++i)
                        {
                            var dlbl = null;
                            if(i%tick_lbl_skip === 0)
                            {
                                dlbl = new CDLbl();
                                dlbl.parent = cat_ax;
                                dlbl.chart = this;
                                dlbl.spPr = cat_ax.spPr;
                                dlbl.txPr = cat_ax.txPr;
                                dlbl.tx = new CChartText();
                                dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                                dlbl.tx.rich.content.Set_ApplyToAll(true);
                                dlbl.tx.rich.content.Set_ParagraphAlign(align_Center);
                                dlbl.tx.rich.content.Set_ApplyToAll(false);
                                var min_max =  dlbl.tx.rich.content.Recalculate_MinMaxContentWidth();
                                var max_min_content_width = min_max.Min;
                                if(min_max.Max > max_max_width)
                                    max_max_width = min_max.Max;

                                if(min_max.Min > max_min_width)
                                    max_min_width = min_max.Min;

                                arr_min_max_min[i] = min_max.Min;

                                dlbl.getMaxWidth = function(){return 20000};
                                dlbl.recalculate();
                                delete dlbl.getMaxWidth;
                                if(dlbl.tx.rich.content.XLimit > max_content_width)
                                    max_content_width = dlbl.tx.rich.content.XLimit;
                            }
                            cat_ax.labels.arrLabels.push(dlbl);
                        }
                        var stake_offset = isRealNumber(cat_ax.lblOffset) ? cat_ax.lblOffset/100 : 1;
                        var labels_offset = cat_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                        //сначала посмотрим убираются ли в максимальную допустимую ширину подписей подписи расчитанные в одну строку

                        var width_flag;
                        if(max_content_width + labels_offset < max_cat_labels_block_width)
                        {
                            width_flag = 0;
                            cat_ax.labels.extX = max_content_width + labels_offset;
                        }
                        else if(max_min_width + labels_offset < max_cat_labels_block_width)//ситуация, когда возможно разместить подписи без переноса слов
                        {
                            width_flag = 1;
                            cat_ax.labels.extX = max_min_width + labels_offset;
                        }
                        else //выставляем максимально возможную ширину
                        {
                            width_flag = 2;
                            cat_ax.labels.extX = max_cat_labels_block_width;
                        }
                    }
                    var cat_labels_align_left = true;//выравнивание подписей в блоке сподписями по левому краю(т. е. зазор находится справа)
                    /*-----------------------------------------------------------------------*/
                    var crosses_val_ax;//значение на горизонтальной оси значений в котором её пересекает горизонтальная
                    if(cat_ax.crosses === CROSSES_AUTO_ZERO)
                    {
                        if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                            crosses_val_ax = 0;
                        else if(arr_val[arr_val.length-1] < 0)
                            crosses_val_ax = arr_val[arr_val.length-1];
                        else
                            crosses_val_ax = arr_val[0];
                    }
                    else if(cat_ax.crosses === CROSSES_MIN)
                    {
                        crosses_val_ax = arr_val[0];
                    }
                    else if(cat_ax.crosses === CROSSES_MAX)
                    {
                        crosses_val_ax = arr_val[arr_val.length - 1];
                    }
                    else if(isRealNumber(cat_ax.crossesAt) && cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                    {
                        //сделаем провеку на попадание в интервал
                        if(cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                            crosses_val_ax = cat_ax.crossesAt;
                    }
                    else
                    { //ведем себя как в случае (cat_ax.crosses === CROSSES_AUTO_ZERO)
                        if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                            crosses_val_ax = 0;
                        else if(arr_val[arr_val.length-1] < 0)
                            crosses_val_ax = arr_val[arr_val.length-1];
                        else
                            crosses_val_ax = arr_val[0];
                    }
                    var val_ax_orientation = val_ax.scaling && isRealNumber(val_ax.scaling.orientation) ? val_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                    var hor_labels_pos = cat_ax.tickLblPos;



                    var first_val_lbl_half_width = (val_ax.tickLblPos === TICK_LABEL_POSITION_NONE || val_ax.bDelete) ? 0 : val_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                    var last_val_lbl_half_width = (val_ax.tickLblPos === TICK_LABEL_POSITION_NONE || val_ax.bDelete) ? 0 : val_ax.labels.arrLabels[val_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                    var right_gap, left_gap;

                    var arr_val_labels_points = [];//массив середин подписей вертикальной оси; i-й элемент - x-координата центра подписи i-огто значения;
                    var unit_width = (rect.w - first_val_lbl_half_width - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);//ширина единицы измерения на вертикальной оси
                    var cat_ax_ext_x = cat_ax.labels ? cat_ax.labels.extX : 0;
                    if(val_ax_orientation === ORIENTATION_MIN_MAX)
                    {
                        if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                        {
                            if(cat_ax.crosses === CROSSES_MAX)
                            {
                                right_gap = Math.max(last_val_lbl_half_width, cat_ax_ext_x);
                                cat_labels_align_left = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                                if(cat_ax.labels)
                                    cat_ax.labels.x = rect.x + rect.w - right_gap;
                                unit_width = (rect.w - right_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                cat_ax.posX = rect.x + first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;
                            }
                            else
                            {
                                if((crosses_val_ax - arr_val[0])*unit_width + first_val_lbl_half_width  < cat_ax_ext_x)
                                {
                                    unit_width = (rect.w -  cat_ax_ext_x - last_val_lbl_half_width)/(arr_val[arr_val.length-1] - crosses_val_ax);
                                }
                                cat_ax.posX = rect.x + rect.w - last_val_lbl_half_width - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width;
                                if(cat_ax.labels)
                                    cat_ax.labels.x = cat_ax.posX - cat_ax_ext_x;
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                        {
                            left_gap = Math.max(first_val_lbl_half_width, cat_ax_ext_x);

                            unit_width = (rect.w - left_gap - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);

                            cat_ax.posX = rect.x + rect.w - (arr_val[arr_val.length-1] - crosses_val_ax )*unit_width - last_val_lbl_half_width;

                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width - cat_ax_ext_x;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                        {
                            cat_labels_align_left = false;

                            right_gap = Math.max(last_val_lbl_half_width, cat_ax_ext_x);
                            unit_width = (rect.w - right_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.posX = rect.x +  first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;

                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                        else
                        {
                            //подписей осей нет
                            cat_ax.labels = null;
                            unit_width = (rect.w - last_val_lbl_half_width - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.posX = rect.x +  first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                    }
                    else
                    {//зеркально отражаем
                        if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                        {
                            if(cat_ax.crosses === CROSSES_MAX)
                            {
                                left_gap = Math.max(cat_ax_ext_x, last_val_lbl_half_width);
                                unit_width = (rect.w - left_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                cat_ax.xPos = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                                if(cat_ax.labels)
                                    cat_ax.labels.x = cat_ax.xPos - cat_ax_ext_x;
                            }
                            else
                            {
                                cat_labels_align_left = false;
                                if(first_val_lbl_half_width < cat_ax_ext_x)
                                {
                                    unit_width = (rect.w - cat_ax_ext_x - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                                }
                                cat_ax.xPos = rect.x + last_val_lbl_half_width + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width;
                                if(cat_ax.labels)
                                    cat_ax.labels.x = cat_ax.xPos;
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.xPos - (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                        {
                            cat_labels_align_left = false;
                            right_gap = Math.max(first_val_lbl_half_width, cat_ax_ext_x);
                            unit_width = (rect.w - last_val_lbl_half_width - right_gap)/(arr_val[arr_val.length-1] - arr_val[0]);
                            cat_ax.xPos = rect.x + last_val_lbl_half_width + (arr_val[arr_val.length-1] - crosses_val_ax)*crosses_val_ax;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.xPos - (arr_val[0] - crosses_val_ax)*unit_width;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.xPos - (arr_val[i] - crosses_val_ax)*unit_width;

                        }
                        else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                        {
                            left_gap = Math.max(cat_ax_ext_x, last_val_lbl_half_width);
                            unit_width = (rect.w - left_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.xPos = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.xPos - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width - cat_ax_ext_x;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.xPos - (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                        else
                        {//подписей осей нет
                            cat_ax.labels = null;
                            unit_width = (rect.w - last_val_lbl_half_width - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            cat_ax.xPos = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.xPos - (arr_val[i] - crosses_val_ax)*unit_width;
                        }
                    }
                    val_ax.interval = unit_width;
                    //запишем в оси необходимую информацию для отрисовщика plotArea  и выставим окончательные позиции для подписей
                    var local_transform_text;
                    if(val_ax.labels)
                    {
                        val_ax.labels.x = Math.min.apply(Math, arr_val_labels_points) - max_val_ax_label_width/2;
                        val_ax.labels.extX = Math.max.apply(Math, arr_val_labels_points) - Math.min.apply(Math, arr_val_labels_points) + max_val_ax_label_width;
                        //val_axis_labels_gap - вертикальный зазор
                        if(bottom_val_ax_labels_align)
                        {
                            var y_pos = val_ax.labels.y + val_axis_labels_gap;
                            for(i = 0;  i < val_ax.labels.arrLabels.length; ++i)
                            {
                                var text_transform = val_ax.labels.arrLabels[i].transformText;
                                text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(text_transform, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, y_pos);
                               // global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                var local_transform_text = val_ax.labels.arrLabels[i].localTransformText;
                                local_transform_text.Reset();
                                global_MatrixTransformer.TranslateAppend(local_transform_text, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, y_pos);
                            }
                        }
                        else
                        {
                            for(i = 0;  i < val_ax.labels.arrLabels.length; ++i)
                            {
                                var text_transform = val_ax.labels.arrLabels[i].transformText;
                                text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(text_transform, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, val_ax.labels.y + val_ax.labels.extY - val_axis_labels_gap - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                            //    global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());


                                var local_transform_text = val_ax.labels.arrLabels[i].localTransformText;
                                local_transform_text.Reset();
                                global_MatrixTransformer.TranslateAppend(local_transform_text, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, val_ax.labels.y + val_ax.labels.extY - val_axis_labels_gap - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                            }
                        }
                    }
                    val_ax.xPoints = [];


                    for(i = 0; i < arr_val_labels_points.length; ++i)
                    {
                        val_ax.xPoints[i] = {val:arr_val[i], pos: arr_val_labels_points[i]};
                    }

                    cat_ax.yPoints = [];
                    for(i = 0; i <arr_cat_labels_points.length; ++i)
                    {
                        cat_ax.yPoints[i] = {val: i, pos: arr_cat_labels_points[i]};
                    }
                    if(cat_ax.labels)
                    {
                        cat_ax.labels.y = rect.y;
                        cat_ax.labels.extY = point_interval*intervals_count;
                        if(cat_labels_align_left)
                        {

                            if(width_flag === 0)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                   //     global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_transform_text = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }
                            else if(width_flag === 1)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, arr_min_max_min[i], 20000);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                      //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_transform_text = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 20000);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                      //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }



                            /*for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                             {
                             if(cat_ax.labels.arrLabels[i])
                             {
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Center);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 2000);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                             cat_ax.labels.arrLabels[i].setPosition(cat_ax.labels.x, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                             }
                             }    */
                        }
                        else
                        {
                            if(width_flag === 0)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                     //   global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }
                            else if(width_flag === 1)
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, arr_min_max_min[i], 20000);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                      //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                                {
                                    if(cat_ax.labels.arrLabels[i])
                                    {
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 20000);
                                        cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                                        var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                        transform_text.Reset();
                                        global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                      //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                        local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                        local_text_transform.Reset();
                                        global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                    }
                                }
                            }

                            /*for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                             {
                             if(cat_ax.labels.arrLabels[i])
                             {
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Center);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 2000);
                             cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                             cat_ax.labels.arrLabels[i].setPosition(cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                             }
                             }*/
                        }
                    }

                    cat_ax.yPoints.sort(function(a, b){return a.val - b.val});
                    val_ax.xPoints.sort(function(a, b){return a.val - b.val});
                }
            }
        }
    },


    recalculateLegend: function()
    {
        if(this.chart && this.chart.legend)
        {
            var parents = this.getParentObjects();
            var RGBA = {R:0, G:0, B: 0, A:255};
            var legend = this.chart.legend;
            var arr_str_labels = [], i;
            var calc_entryes = legend.calcEntryes;
            calc_entryes.length = 0;
            var series = this.getAllSeries();
            var calc_entry, union_marker, entry;
            var max_width = 0, cur_width, max_font_size = 0, cur_font_size, ser, b_line_series;
            var max_word_width = 0;
            this.chart.legend.chart = this;
            var b_scatter_no_line = false;/*(this.chart.plotArea.chart.getObjectType() === historyitem_type_ScatterChart &&
                (this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_MARKER || this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_NONE));  */
            if( !this.chart.plotArea.chart.varyColors || (this.chart.plotArea.chart.getObjectType() !== historyitem_type_PieChart && this.chart.plotArea.chart.getObjectType() !== historyitem_type_DoughnutChart) && series.length !== 1)
            {
                for(i = 0; i < series.length; ++i)
                {
                    ser = series[i];
                    arr_str_labels.push(ser.getSeriesName());
                    calc_entry = new CalcLegendEntry(legend, this);
                    calc_entry.txBody = CreateTextBodyFromString(arr_str_labels[i], this.getDrawingDocument(), calc_entry);
                    entry = legend.findLegendEntryByIndex(i);
                    if(entry)
                        calc_entry.txPr = entry.txPr;
                    calc_entryes.push(calc_entry);

                    cur_width = calc_entry.txBody.getRectWidth(2000);
                    if(cur_width > max_width)
                        max_width = cur_width;

                    cur_font_size = calc_entry.txBody.content.Content[0].CompiledPr.Pr.TextPr.FontSize;
                    if(cur_font_size > max_font_size)
                        max_font_size = cur_font_size;

                    calc_entry.calcMarkerUnion = new CUnionMarker();
                    union_marker = calc_entry.calcMarkerUnion;
                    var pts = getPtsFromSeries(ser);
                    switch(ser.getObjectType())
                    {
                        case historyitem_type_BarSeries:
                        case historyitem_type_BubbleSeries:
                        case historyitem_type_AreaSeries:
                        case historyitem_type_PieSeries:
                        {
                            union_marker.marker = CreateMarkerGeometryByType(SYMBOL_SQUARE, null);
                            union_marker.marker.pen = ser.compiledSeriesPen;
                            union_marker.marker.brush = ser.compiledSeriesBrush;
                            break;
                        }
                        case historyitem_type_LineSeries:
                        case historyitem_type_ScatterSer:
                        case historyitem_type_SurfaceSeries:
                        {
                            if(ser.compiledSeriesMarker)
                            {
                                union_marker.marker = CreateMarkerGeometryByType(ser.compiledSeriesMarker.symbol, null);
                                if(pts[0] && pts[0].compiledMarker)
                                {
                                    union_marker.marker.brush = pts[0].compiledMarker.brush;
                                    union_marker.marker.pen = pts[0].compiledMarker.pen;

                                }
                            }

                            if(ser.compiledSeriesPen && !b_scatter_no_line)
                            {
                                union_marker.lineMarker = CreateMarkerGeometryByType(SYMBOL_DASH, null);
                                union_marker.lineMarker.pen = ser.compiledSeriesPen.createDuplicate(); //Копируем, так как потом возможно придется изменять толщину линии;
                            }
                            if(!b_scatter_no_line)
                                b_line_series = true;
                            break;
                        }
                    }
                    if(union_marker.marker)
                    {
                        union_marker.marker.pen && union_marker.marker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        union_marker.marker.brush && union_marker.marker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    union_marker.lineMarker && union_marker.lineMarker.pen && union_marker.lineMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
            }
            else
            {
                ser = series[0];
                var pts = getPtsFromSeries(ser), pt;
                var cat_str_lit = getCatStringPointsFromSeries(ser);
                for(i = 0; i < pts.length; ++i)
                {
                    pt = pts[i];
                    var str_pt = cat_str_lit ? cat_str_lit.getPtByIndex(pt.idx) : null;
                    if(str_pt)
                        arr_str_labels.push(str_pt.val);
                    else
                        arr_str_labels.push(pt.idx+"");

                    calc_entry = new CalcLegendEntry(legend, this);
                    calc_entry.txBody = CreateTextBodyFromString(arr_str_labels[i], this.getDrawingDocument(), calc_entry);
                    entry = legend.findLegendEntryByIndex(i);
                    if(entry)
                        calc_entry.txPr = entry.txPr;
                    calc_entryes.push(calc_entry);

                    cur_width = calc_entry.txBody.getRectWidth(2000);
                    if(cur_width > max_width)
                        max_width = cur_width;

                    cur_font_size = calc_entry.txBody.content.Content[0].CompiledPr.Pr.TextPr.FontSize;
                    if(cur_font_size > max_font_size)
                        max_font_size = cur_font_size;

                    calc_entry.calcMarkerUnion = new CUnionMarker();
                    union_marker = calc_entry.calcMarkerUnion;
                    if(ser.getObjectType() === historyitem_type_LineSeries || ser.getObjectType() === historyitem_type_ScatterSer)
                    {
                        if(pt.compiledMarker)
                        {
                            union_marker.marker = CreateMarkerGeometryByType(pt.compiledMarker.symbol, null);
                            union_marker.marker.brush = pt.compiledMarker.pen.Fill;
                            union_marker.marker.pen = pt.compiledMarker.pen;
                        }
                        if(pt.pen)
                        {
                            union_marker.lineMarker = CreateMarkerGeometryByType(SYMBOL_DASH, null);
                            union_marker.lineMarker.pen = pt.pen;
                        }
                        if(!b_scatter_no_line)
                            b_line_series = true;
                    }
                    else
                    {
                        union_marker.marker = CreateMarkerGeometryByType(SYMBOL_SQUARE, null);
                        union_marker.marker.pen = pt.pen;
                        union_marker.marker.brush = pt.brush;
                    }
                    if(union_marker.marker)
                    {
                        union_marker.marker.pen && union_marker.marker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        union_marker.marker.brush && union_marker.marker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    union_marker.lineMarker && union_marker.lineMarker.pen && union_marker.lineMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
            }
            var marker_size;
            var distance_to_text;
            var line_marker_width;
            if(b_line_series)
            {
                marker_size = 2.5;
                line_marker_width = 7.7;//Пока так
                for(i = 0; i < calc_entryes.length; ++i)
                {
                    calc_entry = calc_entryes[i];
                    if(calc_entry.calcMarkerUnion.lineMarker)
                    {
                        calc_entry.calcMarkerUnion.lineMarker.spPr.geometry.Recalculate(line_marker_width, 1);
                        /*Excel не дает сделать толщину линии для маркера легенды больше определенной. Считаем, что это толщина равна 133000emu*/
                        if(calc_entry.calcMarkerUnion.lineMarker.pen
                            && isRealNumber(calc_entry.calcMarkerUnion.lineMarker.pen.w) && calc_entry.calcMarkerUnion.lineMarker.pen.w > 133000)
                        {
                            calc_entry.calcMarkerUnion.lineMarker.pen.w = 133000;
                        }
                        calc_entry.calcMarkerUnion.lineMarker.penWidth = calc_entry.calcMarkerUnion.lineMarker.pen && isRealNumber(calc_entry.calcMarkerUnion.lineMarker.pen.w) ? calc_entry.calcMarkerUnion.lineMarker.pen.w/36000 : 0;
                    }
                    if(calc_entryes[i].calcMarkerUnion.marker)
                    {
                        calc_entryes[i].calcMarkerUnion.marker.spPr.geometry.Recalculate(marker_size, marker_size);
                        calc_entryes[i].calcMarkerUnion.marker.extX = marker_size;
                        calc_entryes[i].calcMarkerUnion.marker.extY = marker_size;
                    }
                }
                distance_to_text = marker_size;
            }
            else
            {
                marker_size = 0.2*max_font_size;
                for(i = 0; i < calc_entryes.length; ++i)
                {
                    calc_entryes[i].calcMarkerUnion.marker.spPr.geometry.Recalculate(marker_size, marker_size);
                }
                distance_to_text = marker_size;
            }
            var left_inset = marker_size + 3*distance_to_text;
            var legend_pos;
            if(isRealNumber(legend.legendPos))
            {
                legend_pos = legend.legendPos;
            }
            else if(!isRealObject(legend.layout) || !isRealObject(legend.layout.manualLayout))
            {
                legend_pos = LEGEND_POS_L;
            }
            var legend_width, legend_height;
            if(isRealNumber(legend_pos)
                && (!legend.layout || !legend.layout.manualLayout
                || !isRealNumber(legend.layout.manualLayout.w) || !isRealNumber(legend.layout.manualLayout.h)
                || !isRealNumber(legend.layout.manualLayout.x) || !isRealNumber(legend.layout.manualLayout.y)
                || !isRealNumber(legend.layout.manualLayout.wMode) || !isRealNumber(legend.layout.manualLayout.hMode)
                || !isRealNumber(legend.layout.manualLayout.xMode) || !isRealNumber(legend.layout.manualLayout.yMode)))
            {
                var max_legend_width, max_legend_height;
                var cut_index;
                if(legend_pos === LEGEND_POS_L || legend_pos === LEGEND_POS_R || legend_pos === LEGEND_POS_TR)
                {
                    max_legend_width = this.extX/3;//Считаем, что ширина легенды не больше трети ширины всей диаграммы;
                    var sizes = this.getChartSizes();
                    max_legend_height = sizes.h;
                    if(b_line_series)
                    {
                        left_inset = line_marker_width + 3*distance_to_text;
                        var content_width = max_legend_width - left_inset;
                        if(content_width <= 0)
                            content_width = 0.01;
                        var cur_content_width, max_content_width = 0;
                        var arr_heights = [];
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width, true);
                            if(cur_content_width > max_content_width)
                                max_content_width = cur_content_width;
                            arr_heights.push(calc_entry.txBody.getSummaryHeight());
                        }
                        if(max_content_width < max_legend_width - left_inset)
                        {
                            legend_width = max_content_width + left_inset;
                        }
                        else
                        {
                            legend_width = max_legend_width;
                        }

                        var max_entry_height2 = Math.max.apply(Math, arr_heights);
                        for(i = 0; i < arr_heights.length; ++i)
                            arr_heights[i] = max_entry_height2;

                        var height_summ = 0;
                        for(i = 0;  i < arr_heights.length; ++i)
                        {
                            height_summ+=arr_heights[i];
                            if(height_summ > max_legend_height)
                            {
                                cut_index = i;
                                break;
                            }
                        }
                        if(isRealNumber(cut_index))
                        {
                            if(cut_index > 0)
                            {
                                legend_height = height_summ - arr_heights[cut_index];
                            }
                            else
                            {
                                legend_height = max_legend_height;
                            }
                        }
                        else
                        {
                            cut_index = arr_heights.length;
                            legend_height = height_summ;
                        }
                        legend.x = 0;
                        legend.y = 0;
                        legend.extX = legend_width;
                        legend.extY = legend_height;
                        var summ_h = 0;
                        calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                        for(i = 0; i <  cut_index && i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            if(calc_entry.calcMarkerUnion.marker)
                            {
                                calc_entry.calcMarkerUnion.marker.localX = distance_to_text + line_marker_width/2 - calc_entry.calcMarkerUnion.marker.extX/2;
                                calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                            }

                            if(calc_entry.calcMarkerUnion.lineMarker)
                            {
                                calc_entry.calcMarkerUnion.lineMarker.localX = distance_to_text;
                                calc_entry.calcMarkerUnion.lineMarker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2;// - calc_entry.calcMarkerUnion.lineMarker.penWidth/2;
                                calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width + distance_to_text;
                                calc_entry.localY = summ_h;
                            }


                            summ_h+=arr_heights[i];
                        }
                        legend.setPosition(0, 0);
                    }
                    else
                    {
                        var content_width = max_legend_width - left_inset;
                        if(content_width <= 0)
                            content_width = 0.01;
                        var cur_content_width, max_content_width = 0;
                        var arr_heights = [];
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width, true);
                            if(cur_content_width > max_content_width)
                                max_content_width = cur_content_width;
                            arr_heights.push(calc_entry.txBody.getSummaryHeight());
                        }

                        var max_entry_height2 = Math.max.apply(Math, arr_heights);
                        for(i = 0; i < arr_heights.length; ++i)
                            arr_heights[i] = max_entry_height2;
                        if(max_content_width < max_legend_width - left_inset)
                        {
                            legend_width = max_content_width + left_inset;
                        }
                        else
                        {
                            legend_width = max_legend_width;
                        }
                        var height_summ = 0;
                        for(i = 0;  i < arr_heights.length; ++i)
                        {
                            height_summ+=arr_heights[i];
                            if(height_summ > max_legend_height)
                            {
                                cut_index = i;
                                break;
                            }
                        }
                        if(isRealNumber(cut_index))
                        {
                            if(cut_index > 0)
                            {
                                legend_height = height_summ - arr_heights[cut_index];
                            }
                            else
                            {
                                legend_height = max_legend_height;
                            }
                        }
                        else
                        {
                            cut_index = arr_heights.length;
                            legend_height = height_summ;
                        }
                        legend.x = 0;
                        legend.y = 0;
                        legend.extX = legend_width;
                        legend.extY = legend_height;
                        var summ_h = 0;
                        calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                        for(i = 0; i <  cut_index && i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            if(calc_entry.calcMarkerUnion.marker)
                            {
                                calc_entry.calcMarkerUnion.marker.localX = distance_to_text;
                                calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                            }
                            calc_entry.localX = 2*distance_to_text + marker_size;
                            calc_entry.localY = summ_h;
                            summ_h+=arr_heights[i];
                        }
                        legend.setPosition(0, 0);
                    }
                }
                else
                {
                    /*пока сделаем так: максимальная ширимна 0.9 от ширины дмаграммы
                     без заголовка  максимальная высота легенды 0.6 от высоты диаграммы,
                     с заголовком 0.6 от высоты за вычетом высоты заголовка*/
                    max_legend_width = 0.9*this.extX;
                    max_legend_height = (this.extY - (this.chart.title ? this.chart.title.extY : 0))*0.6;
                    if(b_line_series)
                    {
                        //сначала найдем максимальную ширину записи. ширина записи получается как отступ слева от маркера + ширина маркера + отступ справа от маркера + ширина текста
                        var max_entry_width = 0, cur_entry_width, cur_entry_height;
                        //найдем максимальную ширину надписи
                        var left_width = line_marker_width + 3*distance_to_text;
                        var arr_width = [], arr_height = []; //массив ширин записей
                        var summ_width = 0;//сумма ширин всех подписей
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            cur_entry_width = calc_entry.txBody.getMaxContentWidth(20000/*ставим большое число чтобы текст расчитался в одну строчку*/, true);
                            if(cur_entry_width > max_entry_width)
                                max_entry_width = cur_entry_width;
                            arr_height.push(calc_entry.txBody.getSummaryHeight());
                            arr_width.push(cur_entry_width+left_width);
                            summ_width+=arr_width[arr_width.length-1];
                        }

                        var max_entry_height = Math.max.apply(Math, arr_height);
                        var cur_left_x = 0;
                        if(summ_width < max_legend_width)//значит все надписи убираются в одну строчку
                        {
                            /*прибавим справа ещё боковой зазаор и посмотрим уберется ли новая ширина в максимальную ширину*/
                            if(summ_width + distance_to_text < max_legend_width)
                                legend_width = summ_width + distance_to_text;
                            else
                                legend_width = max_legend_width;
                            legend_height = max_entry_height;
                            for(i = 0; i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                if(calc_entry.calcMarkerUnion.marker)
                                    calc_entry.calcMarkerUnion.marker.localX = cur_left_x + distance_to_text + line_marker_width/2 - marker_size/2;
                                calc_entry.calcMarkerUnion.lineMarker.localX = cur_left_x + distance_to_text;
                                calc_entry.calcMarkerUnion.lineMarker.localY = legend_height/2;
                                cur_left_x += arr_width[i];
                                if(calc_entry.calcMarkerUnion.marker)
                                    calc_entry.calcMarkerUnion.marker.localY = legend_height/2 - marker_size/2;
                                calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX+line_marker_width+distance_to_text;
                                calc_entry.localY = 0;
                            }
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            legend.setPosition(0, 0);
                        }
                        else if(max_legend_width >= max_entry_width + left_width)
                        {
                            var hor_count = (max_legend_width/(max_entry_width + left_width)) >> 0;//количество записей в одной строке
                            var vert_count;//количество строк
                            var t = calc_entryes.length / hor_count;
                            if(t - (t >> 0) > 0)
                                vert_count = t+1;
                            else
                                vert_count = t;
                            //посмотрим убираются ли все эти строки в максимальную высоту. те которые не убираются обрежем, кроме первой.
                            legend_width = hor_count*(max_legend_width + left_width);
                            if(legend_width + distance_to_text <= max_legend_width)
                                legend_width += distance_to_text;
                            else
                                legend_width = max_legend_width;

                            var max_line_count = (max_legend_height/max_entry_height)>>0; //максимальное количество строчек в легенде;
                            if(vert_count <= max_line_count)
                            {
                                cut_index = calc_entryes.length;
                                legend_height = vert_count*max_entry_height;
                            }
                            else
                            {
                                if(max_line_count === 0)
                                {
                                    cut_index = hor_count + 1;
                                    legend_height = max_entry_height;
                                }
                                else
                                {
                                    cut_index = max_line_count*hor_count+1;
                                    legend_height = max_entry_height*max_line_count;
                                }
                            }
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i <cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.calcMarkerUnion.lineMarker.localX = (i - hor_count*((i/hor_count) >> 0))*(max_entry_width + line_marker_width + 2*distance_to_text)  + distance_to_text;
                                calc_entry.calcMarkerUnion.lineMarker.localY = ((i/hor_count) >> 0)*(max_entry_height) + max_entry_height/2;
                                calc_entry.calcMarkerUnion.marker.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width/2 - marker_size/2;
                                calc_entry.calcMarkerUnion.marker.localY = calc_entry.calcMarkerUnion.lineMarker.localY - marker_size/2;



                                calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width + distance_to_text;
                                calc_entry.localY = ((i/hor_count) >> 0)*(max_entry_height);
                            }
                            legend.setPosition(0, 0);
                        }
                        else
                        {
                            //значит максималная по ширине надпись не убирается в рект для легенды
                            var content_width = max_legend_width - 2*distance_to_text - marker_size;
                            if(content_width <= 0)
                                content_width = 0.01;
                            var cur_content_width, max_content_width = 0;
                            var arr_heights = [];
                            for(i = 0; i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width, true);
                                if(cur_content_width > max_content_width)
                                    max_content_width = cur_content_width;
                                arr_heights.push(calc_entry.txBody.getSummaryHeight());
                            }
                            if(max_content_width < max_legend_width - left_inset)
                            {
                                legend_width = max_content_width + left_inset;
                            }
                            else
                            {
                                legend_width = max_legend_width;
                            }
                            var height_summ = 0;
                            for(i = 0;  i < arr_heights.length; ++i)
                            {
                                height_summ+=arr_heights[i];
                                if(height_summ > max_legend_height)
                                {
                                    cut_index = i;
                                    break;
                                }
                            }
                            if(isRealNumber(cut_index))
                            {
                                if(cut_index > 0)
                                {
                                    legend_height = height_summ - arr_heights[cut_index];
                                }
                                else
                                {
                                    legend_height = max_legend_height;
                                }
                            }
                            else
                            {
                                cut_index = arr_heights.length;
                                legend_height = height_summ;
                            }
                            legend.x = 0;
                            legend.y = 0;
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            var summ_h = 0;

                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i <  cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.calcMarkerUnion.marker.localX = distance_to_text;
                                calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                                calc_entry.localX = 2*distance_to_text + marker_size;
                                calc_entry.localY = summ_h;
                                summ_h+=arr_heights[i];
                            }
                            legend.setPosition(0, 0);
                        }
                    }
                    else
                    {
                        //сначала найдем максимальную ширину записи. ширина записи получается как отступ слева от маркера + ширина маркера + отступ справа от маркера + ширина текста
                        var max_entry_width = 0, cur_entry_width, cur_entry_height;
                        //найдем максимальную ширину надписи
                        var left_width = marker_size + 3*distance_to_text;
                        var arr_width = [], arr_height = []; //массив ширин записей
                        var summ_width = 0;//сумма ширин всех подписей
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            cur_entry_width = calc_entry.txBody.getMaxContentWidth(20000/*ставим большое число чтобы текст расчитался в одну строчку*/, true);
                            if(cur_entry_width > max_entry_width)
                                max_entry_width = cur_entry_width;
                            arr_height.push(calc_entry.txBody.getSummaryHeight());
                            arr_width.push(cur_entry_width+left_width);
                            summ_width+=arr_width[arr_width.length-1];
                        }

                        var max_entry_height = Math.max.apply(Math, arr_height);
                        var cur_left_x = 0;
                        if(summ_width < max_legend_width)//значит все надписи убираются в одну строчку
                        {
                            /*прибавим справа ещё боковой зазаор и посмотрим уберется ли новая ширина в максимальную ширину*/
                            if(summ_width + distance_to_text < max_legend_width)
                                legend_width = summ_width + distance_to_text;
                            else
                                legend_width = max_legend_width;
                            legend_height = max_entry_height;

                            for(i = 0; i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.calcMarkerUnion.marker.localX = cur_left_x + distance_to_text;
                                cur_left_x += arr_width[i];
                                calc_entry.calcMarkerUnion.marker.localY = legend_height/2 - marker_size/2;
                                calc_entry.localX = calc_entry.calcMarkerUnion.marker.localX+marker_size+distance_to_text;
                                calc_entry.localY = 0;
                            }
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            legend.setPosition(0, 0);
                        }
                        else if(max_legend_width >= max_entry_width + left_width)
                        {
                            var hor_count = (max_legend_width/(max_entry_width + left_width)) >> 0;//количество записей в одной строке
                            var vert_count;//количество строк
                            var t = calc_entryes.length / hor_count;
                            if(t - (t >> 0) > 0)
                                vert_count = t+1;
                            else
                                vert_count = t;
                            //посмотрим убираются ли все эти строки в максимальную высоту. те которые не убираются обрежем, кроме первой.
                            legend_width = hor_count*(max_entry_width + left_width);
                            if(legend_width + distance_to_text <= max_legend_width)
                                legend_width += distance_to_text;
                            else
                                legend_width = max_legend_width;

                            var max_line_count = (max_legend_height/max_entry_height)>>0; //максимальное количество строчек в легенде;
                            if(vert_count <= max_line_count)
                            {
                                cut_index = calc_entryes.length;
                                legend_height = vert_count*max_entry_height;
                            }
                            else
                            {
                                if(max_line_count === 0)
                                {
                                    cut_index = hor_count + 1;
                                    legend_height = max_entry_height;
                                }
                                else
                                {
                                    cut_index = max_line_count*hor_count+1;
                                    legend_height = max_entry_height*max_line_count;
                                }
                            }
                            legend.extX = legend_width;
                            legend.extY = legend_height;

                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i <cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.calcMarkerUnion.marker.localX = (i - hor_count*((i/hor_count) >> 0))*(max_entry_width + marker_size + 2*distance_to_text)  + distance_to_text;
                                calc_entry.calcMarkerUnion.marker.localY = ((i/hor_count) >> 0)*(max_entry_height) + max_entry_height/2 - marker_size/2;
                                calc_entry.localX = calc_entry.calcMarkerUnion.marker.localX + marker_size + distance_to_text;
                                calc_entry.localY = ((i/hor_count) >> 0)*(max_entry_height);
                            }
                            legend.setPosition(0, 0);
                        }
                        else
                        {
                            //значит максималная по ширине надпись не убирается в рект для легенды
                            var content_width = max_legend_width - 2*distance_to_text - marker_size;
                            if(content_width <= 0)
                                content_width = 0.01;
                            var cur_content_width, max_content_width = 0;
                            var arr_heights = [];
                            for(i = 0; i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width, true);
                                if(cur_content_width > max_content_width)
                                    max_content_width = cur_content_width;
                                arr_heights.push(calc_entry.txBody.getSummaryHeight());
                            }
                            if(max_content_width < max_legend_width - left_inset)
                            {
                                legend_width = max_content_width + left_inset;
                            }
                            else
                            {
                                legend_width = max_legend_width;
                            }
                            var height_summ = 0;
                            for(i = 0;  i < arr_heights.length; ++i)
                            {
                                height_summ+=arr_heights[i];
                                if(height_summ > max_legend_height)
                                {
                                    cut_index = i;
                                    break;
                                }
                            }
                            if(isRealNumber(cut_index))
                            {
                                if(cut_index > 0)
                                {
                                    legend_height = height_summ - arr_heights[cut_index];
                                }
                                else
                                {
                                    legend_height = max_legend_height;
                                }
                            }
                            else
                            {
                                cut_index = arr_heights.length;
                                legend_height = height_summ;
                            }
                            legend.x = 0;
                            legend.y = 0;
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            var summ_h = 0;

                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i <  cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.calcMarkerUnion.marker.localX = distance_to_text;
                                calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                                calc_entry.localX = 2*distance_to_text + marker_size;
                                calc_entry.localY = summ_h;
                                summ_h+=arr_heights[i];
                            }
                            legend.setPosition(0, 0);
                        }
                    }
                }
            }
            else
            {
                //TODO
            }
            legend.recalcInfo = {recalculateLine: true, recalculateFill: true, recalculateTransparent: true};
            legend.recalculatePen();
            legend.recalculateBrush();
        }
    },


    recalculateUpDownBars: function()
    {
        if(this.chart && this.chart.plotArea && this.chart.plotArea.chart && this.chart.plotArea.chart.upDownBars)
        {
            var bars = this.chart.plotArea.chart.upDownBars;
            var up_bars = bars.upBars;
            var down_bars = bars.downBars;
            var parents = this.getParentObjects();
            bars.upBarsBrush = null;
            bars.upBarsPen = null;
            bars.downBarsBrush = null;
            bars.downBarsPen = null;
            if(up_bars || down_bars)
            {
                var default_bar_line = new CLn();
                if(parents.theme  && parents.theme.themeElements
                    && parents.theme.themeElements.fmtScheme
                    && parents.theme.themeElements.fmtScheme.lnStyleLst)
                {
                    default_bar_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[0]);
                }
                if(this.style >= 1 && this.style <= 16)
                    default_bar_line.setFill(CreateUnifillSolidFillSchemeColor(15, 0));
                else if(this.style >= 17 && this.style <= 32 ||
                    this.style >= 41 && this.style <= 48)
                    default_bar_line = CreateNoFillLine();
                else if(this.style === 33 || this.style === 34)
                    default_bar_line.setFill(CreateUnifillSolidFillSchemeColor(8, 0));
                else if(this.style >= 35 && this.style <= 40)
                    default_bar_line.setFill(CreateUnifillSolidFillSchemeColor(this.style - 35, -0.25000));
            }
            if(up_bars)
            {
                var default_up_bars_fill;
                if(this.style === 1 || this.style === 9 || this.style === 17 || this.style === 25 || this.style === 41)
                {
                    default_up_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0.25000);
                }
                else if(this.style === 2 || this.style === 10 || this.style === 18 || this.style === 26)
                {
                    default_up_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0.05000);
                }
                else if(this.style >= 3 && this.style <= 8)
                {
                    default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 3, 0.25000);
                }
                else if(this.style >= 11 && this.style <= 16)
                {
                    default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 11, 0.25000);
                }
                else if(this.style >=19 && this.style <= 24)
                {
                    default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 19, 0.25000);
                }
                else if(this.style >= 27 && this.style <= 32 )
                {
                    default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 27, 0.25000);
                }
                else if(this.style >= 33 && this.style <= 40 || this.style === 42)
                {
                    default_up_bars_fill = CreateUnifillSolidFillSchemeColor(12, 0);
                }
                else
                {
                    default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 43, 0.25000);
                }
                if(up_bars.Fill)
                {
                    default_up_bars_fill.merge(up_bars.Fill);
                }
                default_up_bars_fill.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                this.chart.plotArea.chart.upDownBars.upBarsBrush = default_up_bars_fill;
                var up_bars_line = default_bar_line.createDuplicate();
                if(up_bars.ln)
                    up_bars_line.merge(up_bars.ln);
                up_bars_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                this.chart.plotArea.chart.upDownBars.upBarsPen = up_bars_line;

            }
            if(down_bars)
            {
                var default_down_bars_fill;
                if(this.style === 1 || this.style === 9 || this.style === 17 || this.style === 25 || this.style === 41 || this.style === 33)
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0.85000);
                }
                else if(this.style === 2 || this.style === 10 || this.style === 18 || this.style === 26 || this.style === 34)
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0.95000);
                }
                else if(this.style >= 3 && this.style <= 8)
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 3, -0.25000);
                }
                else if(this.style >= 11 && this.style <= 16)
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 11, -0.25000);
                }
                else if(this.style >=19 && this.style <= 24)
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 19, -0.25000);
                }
                else if(this.style >= 27 && this.style <= 32 )
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 27, -0.25000);
                }
                else if(this.style >= 35 && this.style <= 40)
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 35, -0.25000);
                }
                else if(this.style === 42)
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0);
                }
                else
                {
                    default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 43, -0.25000);
                }
                if(down_bars.Fill)
                {
                    default_down_bars_fill.merge(down_bars.Fill);
                }
                default_down_bars_fill.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                this.chart.plotArea.chart.upDownBars.downBarsBrush = default_down_bars_fill;
                var down_bars_line = default_bar_line.createDuplicate();
                if(down_bars.ln)
                    down_bars_line.merge(down_bars.ln);
                down_bars_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                this.chart.plotArea.chart.upDownBars.downBarsPen = down_bars_line;
            }
        }
    },

    recalculatePlotAreaChartPen: function()
    {
        if(this.chart && this.chart.plotArea)
        {
            if(this.chart.plotArea.spPr && this.chart.plotArea.spPr.ln)
            {
                this.chart.plotArea.pen = this.chart.plotArea.spPr.ln;
                var parents = this.getParentObjects();
                this.chart.plotArea.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            }
            else
            {
                this.chart.plotArea.pen = null;
            }
        }
    },


    recalculatePenBrush: function()
    {
        var parents = this.getParentObjects(), RGBA = {R: 0, G: 0, B: 0, A: 255};
        if(this.brush)
        {
            this.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
        }
        if(this.pen)
        {
            this.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
        }
        if(this.chart)
        {
            if(this.chart.title)
            {
                if(this.chart.title.brush)
                {
                    this.chart.title.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
                if(this.chart.title.pen)
                {
                    this.chart.title.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
            }
            if(this.chart.plotArea)
            {
                if(this.chart.plotArea.brush)
                {
                    this.chart.plotArea.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
                if(this.chart.plotArea.pen)
                {
                    this.chart.plotArea.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
                if(this.chart.plotArea.valAx)
                {
                    if(this.chart.plotArea.valAx.compiledTickMarkLn)
                    {
                        this.chart.plotArea.valAx.compiledTickMarkLn.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.valAx.compiledMajorGridLines)
                    {
                        this.chart.plotArea.valAx.compiledMajorGridLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.valAx.compiledMinorGridLines)
                    {
                        this.chart.plotArea.valAx.compiledMinorGridLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.valAx.title)
                    {

                        if(this.chart.plotArea.valAx.title.brush)
                        {
                            this.chart.plotArea.valAx.title.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                        if(this.chart.plotArea.valAx.title.pen)
                        {
                            this.chart.plotArea.valAx.title.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                    }

                }
                if(this.chart.plotArea.catAx)
                {
                    if(this.chart.plotArea.catAx.compiledTickMarkLn)
                    {
                        this.chart.plotArea.catAx.compiledTickMarkLn.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.catAx.compiledMajorGridLines)
                    {
                        this.chart.plotArea.catAx.compiledMajorGridLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.catAx.compiledMinorGridLines)
                    {
                        this.chart.plotArea.catAx.compiledMinorGridLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.catAx.title)
                    {
                        if(this.chart.plotArea.catAx.title.brush)
                        {
                            this.chart.plotArea.catAx.title.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                        if(this.chart.plotArea.catAx.title.pen)
                        {
                            this.chart.plotArea.catAx.title.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                    }
                }

                if(this.chart.plotArea.chart)
                {
                    var series = this.chart.plotArea.chart.series;
                    for(var i = 0; i < series.length; ++i)
                    {
                        var pts = getPtsFromSeries(series[i]);
                        for(var j = 0; j < pts.length; ++j)
                        {
                            var pt = pts[j];
                            if(pt.brush)
                            {
                                pt.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);

                            }
                            if(pt.pen)
                            {
                                pt.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                            if(pt.compiledMarker)
                            {
                                if(pt.compiledMarker.brush)
                                {
                                    pt.compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                }
                                if(pt.compiledMarker.pen)
                                {
                                    pt.compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                }
                            }
                            if(pt.compiledDlb)
                            {
                                if(pt.compiledDlb.brush)
                                {
                                    pt.compiledDlb.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                }
                                if(pt.compiledDlb.pen)
                                {
                                    pt.compiledDlb.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                }

                            }
                        }
                    }
                    if(this.chart.plotArea.chart.calculatedHiLowLines)
                    {
                        this.chart.plotArea.chart.calculatedHiLowLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if( this.chart.plotArea.chart.upDownBars)
                    {
                        if(this.chart.plotArea.chart.upDownBars.upBarsBrush)
                        {
                            this.chart.plotArea.chart.upDownBars.upBarsBrush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                        if(this.chart.plotArea.chart.upDownBars.upBarsPen)
                        {
                            this.chart.plotArea.chart.upDownBars.upBarsPen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                        if(this.chart.plotArea.chart.upDownBars.downBarsBrush)
                        {
                            this.chart.plotArea.chart.upDownBars.downBarsBrush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                        if(this.chart.plotArea.chart.upDownBars.downBarsPen)
                        {
                            this.chart.plotArea.chart.upDownBars.downBarsPen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                    }
                }
            }
            if(this.chart.legend)
            {
                if(this.chart.legend.brush)
                {
                    this.chart.legend.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
                if(this.chart.legend.pen)
                {
                    this.chart.legend.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }

                var legend = this.chart.legend;
                for(var i = 0; i < legend.calcEntryes.length; ++i)
                {
                    var union_marker = legend.calcEntryes[i].calcMarkerUnion;
                    if(union_marker)
                    {
                        if(union_marker.marker)
                        {
                            if(union_marker.marker.pen)
                            {
                                union_marker.marker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                            if(union_marker.marker.brush)
                            {
                                union_marker.marker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                        }
                        if(union_marker.lineMarker)
                        {
                            if(union_marker.lineMarker.pen)
                            {
                                union_marker.lineMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                            if(union_marker.lineMarker.brush)
                            {
                                union_marker.lineMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                        }
                    }
                }
            }
        }
    },

    getChartSizes: function()
    {
        if(!this.chartObj)
            this.chartObj = new CChartsDrawer();
        return this.chartObj.calculateSizePlotArea(this);
    },


    getAllSeries:  function()
    {
        //TODO:Переделать когда будем поддерживать насколько вложенных чартов
        return this.chart.plotArea.chart.series;
    },

    recalculatePlotAreaChartBrush: function()
    {
        if(this.chart && this.chart.plotArea)
        {
            var plot_area = this.chart.plotArea;
            var default_brush;
            var tint = 0.20000;
            if(this.style >=1 && this.style <=32)
                default_brush = CreateUnifillSolidFillSchemeColor(6, tint);
            else if(this.style >=33 && this.style <= 34)
                default_brush = CreateUnifillSolidFillSchemeColor(8, 0.20000);
            else if(this.style >=35 && this.style <=40)
                default_brush = CreateUnifillSolidFillSchemeColor(this.style - 35, 0 + tint);
            else
                default_brush = CreateUnifillSolidFillSchemeColor(8, 0.95000 - tint);

            if(plot_area.spPr && plot_area.spPr.Fill)
            {
                default_brush.merge(plot_area.spPr.Fill);
            }
            var parents = this.getParentObjects();
            default_brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            plot_area.brush = default_brush;
        }
    },

    recalculateChartPen: function()
    {
        var parent_objects = this.getParentObjects();
        var default_line = new CLn();
        if(parent_objects.theme  && parent_objects.theme.themeElements
            && parent_objects.theme.themeElements.fmtScheme
            && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
        {
            default_line.merge(parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0]);
        }

        var fill;
        if(this.style >= 1 && this.style <= 32)
            fill = CreateUnifillSolidFillSchemeColor(15, 0.75000);
        else if(this.style >= 33 && this.style <= 40)
            fill = CreateUnifillSolidFillSchemeColor(8, 0.75000);
        else
            fill = CreateUnifillSolidFillSchemeColor(12, 0);
        default_line.setFill(fill);
        if(this.spPr && this.spPr.ln)
            default_line.merge(this.spPr.ln);
        var parents = this.getParentObjects();
        default_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
        this.pen = default_line;
    },




    recalculateChartBrush: function()
    {
        var default_brush;
        if(this.style >=1 && this.style <=32)
            default_brush = CreateUnifillSolidFillSchemeColor(6, 0);
        else if(this.style >=33 && this.style <= 40)
            default_brush = CreateUnifillSolidFillSchemeColor(12, 0);
        else
            default_brush = CreateUnifillSolidFillSchemeColor(8, 0);

        if(this.spPr && this.spPr.Fill)
        {
            default_brush.merge(this.spPr.Fill);
        }
        var parents = this.getParentObjects();
        default_brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
        this.brush = default_brush;

    },



    recalculateAxisTickMark: function()
    {
        if(this.chart && this.chart.plotArea)
        {
            var calcMajorMinorGridLines = function (axis, defaultStyle, subtleLine, parents)
            {
                function calcGridLine(defaultStyle, spPr, subtleLine, parents)
                {
                    var compiled_grid_lines = new CLn();
                    compiled_grid_lines.merge(subtleLine);

                    if(!compiled_grid_lines.Fill)

                    {
                        compiled_grid_lines.setFill(new CUniFill());
                    }
                    compiled_grid_lines.Fill.merge(defaultStyle);
                    if(spPr)
                    {
                        compiled_grid_lines.merge(spPr.ln);
                    }
                    compiled_grid_lines.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                    return compiled_grid_lines;
                }
                axis.compiledLn = calcGridLine(defaultStyle.axisAndMajorGridLines, axis.spPr, subtleLine, parents);
                axis.compiledTickMarkLn = axis.compiledLn.createDuplicate();
                if(isRealNumber(axis.compiledTickMarkLn.w))
                    axis.compiledTickMarkLn.w/=2;
                axis.compiledTickMarkLn.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255})
            };
            var default_style = CHART_STYLE_MANAGER.getDefaultLineStyleByIndex(this.style);
            var parent_objects = this.getParentObjects();
            var RGBA = {R:0, G:0, B:0, A: 255};
            var subtle_line;
            if(parent_objects.theme  && parent_objects.theme.themeElements
                && parent_objects.theme.themeElements.fmtScheme
                && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
            {
                subtle_line = parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0];
            }
            if(this.chart.plotArea.valAx)
                calcMajorMinorGridLines(this.chart.plotArea.valAx, default_style, subtle_line, parent_objects);
            if(this.chart.plotArea.catAx)
                calcMajorMinorGridLines(this.chart.plotArea.catAx, default_style, subtle_line, parent_objects);
        }
    },


    recalculateAxisValLabels: function()
    {

        if(this.chart && this.chart.plotArea && this.chart.plotArea)
        {
            var plot_area = this.chart.plotArea;
            var chart = plot_area.chart;
            var i;
            if(!(chart instanceof CScatterChart))
            {
                var val_ax, cat_ax;
                if(plot_area.valAx)
                {
                    val_ax = this.chart.plotArea.valAx;
                    var arr_val =  this.getValAxisValues();
                    var arr_strings = [];
                    var multiplier;
                    if(val_ax.dispUnits)
                        multiplier = val_ax.dispUnits.getMultiplier();
                    else
                        multiplier = 1;
                    var num_fmt = val_ax.numFmt;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            var rich_value = num_format.formatToChart(calc_value);
                            arr_strings.push(rich_value);
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            arr_strings.push(calc_value + "");
                        }
                    }
                    val_ax.labels = new CValAxisLabels(this);
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        var dlbl = new CDLbl();
                        dlbl.parent = val_ax;
                        dlbl.chart = this;
                        dlbl.spPr = val_ax.spPr;
                        dlbl.txPr = val_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                        dlbl.recalculate();
                        val_ax.labels.arrLabels.push(dlbl);
                    }
                    val_ax.labels.recalculateExtX();
                }

                var string_pts = [];
                var pts_len = 0;
                if(plot_area.catAx)
                {
                    cat_ax = plot_area.catAx;
                    var ser = chart.series[0];
                    if(ser && ser.cat)
                    {
                        if(ser.cat.strRef && ser.cat.strRef.strCache)
                        {
                            string_pts = ser.cat.strRef.strCache.pt;
                            pts_len = string_pts.length;
                        }
                        else if(ser.cat.strLit)
                        {
                            string_pts = ser.cat.strLit.pt;
                            pts_len = string_pts.length;
                        }
                    }
                    if(string_pts.length === 0)
                    {
                        if(ser.val)
                        {
                            if(ser.val.numRef && ser.val.numRef.numCache)
                                pts_len = ser.val.numRef.numCache.pts.length;
                            else if(ser.val.numLit)
                                pts_len = ser.val.numLit.pts.length;
                        }
                        for(i = 0; i < pts_len; ++i)
                        {
                            string_pts.push({val:i+1 + ""});
                        }
                    }
                }
                if(val_ax && cat_ax)
                {
                    cat_ax.labels = new CValAxisLabels(this);
                    var t = this.getChartSizes();
                    var common_width = t.w;
                    var common_height = t.h;
                    var plot_area_width = common_width - val_ax.labels.extX;
                    var max_sect_width = plot_area_width/string_pts.length;
                    var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                    for(i = 0; i < string_pts.length; ++i)
                    {
                        var dlbl = null;
                        if(i%tick_lbl_skip === 0)
                        {
                            dlbl = new CDLbl();
                            dlbl.parent = cat_ax;
                            dlbl.chart = this;
                            dlbl.spPr = cat_ax.spPr;
                            dlbl.txPr = cat_ax.txPr;
                            dlbl.tx = new CChartText();
                            dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                            dlbl.recalculate();
                        }
                        cat_ax.labels.arrLabels.push(dlbl);
                    }
                    var lbls = cat_ax.labels.arrLabels;
                    var rot = null;
                    var w0 = val_ax.labels.extX;
                    var w1 = (common_width - val_ax.labels.extX)/pts_len;
                    var max_text_height = 0;
                    if(!(cat_ax.txPr && cat_ax.txPr.bodyPr && isRealNumber(cat_ax.txPr.bodyPr.rot)))
                    {
                        var max_min_text_width = cat_ax.labels.getMinWidth();
                        for(i = 0; i < lbls.length; ++i)
                        {
                            if(lbls[i])
                            {
                                if(lbls[i].extY > max_text_height)
                                    max_text_height = lbls[i].extY;
                            }
                        }
                        if(max_min_text_width <= max_sect_width)
                        {
                            for(i = 0; i < lbls.length; ++i)
                            {
                                if(lbls[i])
                                {
                                    lbls[i].x = w0 + w1/2 + w1*(i) - lbls[i].extX/2;
                                    lbls[i].y = max_text_height;
                                }
                            }
                        }
                        else
                        {
                            rot = -Math.PI/4;
                        }
                    }

                    var _rot = isRealNumber(rot) ? rot : 0;
                    var _cos = Math.cos(_rot);
                    var _sin = Math.sin(_rot);
                    if(isRealNumber(rot))
                    {
                        var max_height = 0;
                        for(i = 0; i < lbls.length; ++i)
                        {
                            if(lbls[i])
                            {
                                var cur_height = lbls[i].extX*_sin;
                                if(cur_height > max_height)
                                    max_height = cur_height;
                                if(lbls[i].extY > max_text_height)
                                    max_text_height = lbls[i].extY;
                            }
                        }
                        if(max_height + max_text_height <= common_height/2) //TODO:пока так. надо разобраться(зависит от шрифта подписей)
                        {
                            var min_x = w1/2 + w0;
                            for(i = 0; i < lbls.length; ++i)
                            {
                                if(lbls[i])
                                {
                                    var point_cx = w1/2 + w0 + (i)*w1;
                                    if(lbls[i].extX*_cos <= point_cx)
                                    {
                                        lbls[i].pX = point_cx - lbls[i].extX*_cos;
                                        if(point_cx - lbls[i].extX*_cos<= min_x)
                                        {
                                            min_x = point_cx - lbls[i].extX;
                                        }
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                            }
                            if(i === lbls.length)
                            {//Значит слева мы не вылезли за пределы подписей значений
                                if(rot < 0)
                                {
                                    for(i = 0; i < lbls.length; ++i)
                                    {
                                        if(lbls[i])
                                        {
                                            var point_cx = w1/2 + w0 + (i)*w1;
                                            var x = point_cx - lbls[i].extX*_cos - lbls[i].extX;
                                            var y = max_text_height + lbls[i].extX*(Math.abs(_sin));
                                            lbls[i].setPositionRelative(x, y);
                                        }
                                    }
                                }
                                else
                                {
                                    for(i = 0; i < lbls.length; ++i)
                                    {
                                        if(lbls[i])
                                        {
                                            var point_cx = w1/2 + w0 + (i)*w1;
                                            var x = point_cx + lbls[i].extX*_cos - lbls[i].extX;
                                            var y = max_text_height + lbls[i].extX*(Math.abs(_sin));
                                            lbls[i].setPositionRelative(x, y);
                                        }
                                    }
                                }
                            }
                            else
                            {}
                        }
                    }
                    else
                    {
                        for(i = 0; i < lbls.length; ++i)
                        {
                            if(lbls[i])
                            {
                                var cx = w1/2 + w1*i;
                                lbls[i].setPositionRelative(cx - lbls[i].extX/2, max_text_height);
                            }
                        }
                    }
                    var rot_matrix = new CMatrix();
                    global_MatrixTransformer.RotateRadAppend(rot_matrix, -_rot);
                    if(!cat_ax.txPr)
                    {
                        cat_ax.setTxPr(new CTextBody());
                    }
                    if(!cat_ax.txPr.bodyPr)
                    {
                        cat_ax.txPr.setBodyPr(new CBodyPr());
                    }
                    if(!isRealNumber( cat_ax.txPr.bodyPr.rot))
                    {
                        cat_ax.txPr.bodyPr.rot = _rot;
                    }
                    for(i = 0; i < lbls.length; ++i)
                    {
                        var lbl = lbls[i];
                        var hc = lbl.extX/2;
                        var vc = lbl.extY/2;
                        var xc = lbl.x + hc, yc = lbl.y + vc;
                        var x_0 = xc + rot_matrix.TransformPointX(-hc - vc);
                        var y_0 = yc + rot_matrix.TransformPointY(-hc - vc);
                        var x_1 = xc + rot_matrix.TransformPointX(hc, -vc);
                        var y_1 = yc + rot_matrix.TransformPointY(hc, -vc);
                        var x_2 = xc + rot_matrix.TransformPointX(hc, vc);
                        var y_2 = yc + rot_matrix.TransformPointY(hc, vc);
                        var x_3 = xc + rot_matrix.TransformPointX(-hc, vc);
                        var y_3 = yc + rot_matrix.TransformPointY(-hc, vc);
                        lbls[i].recalculate();
                    }
                    var val_labels = val_ax.labels;
                    val_labels.extY =  common_height - cat_ax.labels.extY;
                    for(i = 0; i < val_labels.length; ++i)
                    {

                    }
                }
            }
        }
    },

    getXValAxisValues: function()
    {
        if(!this.chartObj)
        {
            this.chartObj = new CChartsDrawer()
        }
        this.chartObj.preCalculateData(this);
        return [].concat(this.chartObj.calcProp.xScale);
    },


    getValAxisValues: function()
    {
        if(!this.chartObj)
        {
            this.chartObj = new CChartsDrawer()
        }
        this.chartObj.preCalculateData(this);
        return [].concat(this.chartObj.calcProp.scale);
    },

    getCalcProps: function()
    {
        if(!this.chartObj)
        {
            this.chartObj = new CChartsDrawer()
        }
        this.chartObj.preCalculateData(this);
        return this.chartObj.calcProp;
    },


    recalculateDLbls: function()
    {
        if(this.chart && this.chart.plotArea && this.chart.plotArea.chart && this.chart.plotArea.chart.series)
        {
            var default_lbl = new CDLbl();
            default_lbl.initDefault();
            var series = this.chart.plotArea.chart.series;
            for(var i = 0; i < series.length; ++i)
            {
                var ser = series[i];
                var pts = getPtsFromSeries(ser);
                for(var j = 0; j < pts.length; ++j)
                {
                    var pt = pts[j];
                    var compiled_dlb = new CDLbl();
                    compiled_dlb.merge(default_lbl);
                    compiled_dlb.merge(this.chart.plotArea.chart.dLbls);
                    if(this.chart.plotArea.chart.dLbls)
                        compiled_dlb.merge(this.chart.plotArea.chart.dLbls.findDLblByIdx(pt.idx), false);
                    compiled_dlb.merge(ser.dLbls);
                    if(ser.dLbls)
                        compiled_dlb.merge(ser.dLbls.findDLblByIdx(pt.idx), true);

                    if(compiled_dlb.checkNoLbl())
                    {
                        pt.compiledDlb = null;
                    }
                    else
                    {
                        pt.compiledDlb = compiled_dlb;
                        pt.compiledDlb.chart = this;
                        pt.compiledDlb.series = ser;
                        pt.compiledDlb.pt = pt;
                        pt.compiledDlb.recalculate();
                    }
                }
            }
        }
    },

    recalculateHiLowLines: function()
    {
        if(this.chart && this.chart.plotArea && (this.chart.plotArea.chart instanceof CStockChart || this.chart.plotArea.chart instanceof CLineChart) && this.chart.plotArea.chart.hiLowLines)
        {
            var parents = this.getParentObjects();
            var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0].createDuplicate();
            if(this.style >=1 && this.style <= 32)
                default_line.setFill(CreateUnifillSolidFillSchemeColor(15, 0));
            else if(this.style >= 33 && this.style <= 34)
                default_line.setFill(CreateUnifillSolidFillSchemeColor(8, 0));
            else if(this.style >= 35 && this.style <= 40)
                default_line.setFill(CreateUnifillSolidFillSchemeColor(8, -0.25000));
            else
                default_line.setFill(CreateUnifillSolidFillSchemeColor(12, 0));
            default_line.merge(this.chart.plotArea.chart.hiLowLines.ln);
            this.chart.plotArea.chart.calculatedHiLowLines = default_line;
            default_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R:0, G:0, B:0, A:255});
        }
        else
        {
            this.chart.plotArea.chart.calculatedHiLowLines = null;
        }
    },

    recalculateSeriesColors: function()
    {
        if(this.chart && this.chart.plotArea && this.chart.plotArea.chart && this.chart.plotArea.chart.series)
        {
            var style = CHART_STYLE_MANAGER.getStyleByIndex(this.style);
            var series = this.chart.plotArea.chart.series;
            var parents = this.getParentObjects();
            var RGBA = {R: 0, G: 0, B: 0, A: 255};
            if(this.chart.plotArea.chart.varyColors && (series.length === 1 || this.chart.plotArea.chart.getObjectType() === historyitem_type_PieChart || this.chart.plotArea.chart.getObjectType() === historyitem_type_DoughnutChart))
            {
                var ser = series[0];
                var pts = getPtsFromSeries(ser);
                if(!(this.chart.plotArea.chart.getObjectType() === historyitem_type_LineChart || this.chart.plotArea.chart.getObjectType() === historyitem_type_ScatterChart))
                {
                    var base_fills = getArrayFillsFromBase(style.fill2, getMaxIdx(pts));
                    for(var i = 0; i < pts.length; ++i)
                    {
                        var compiled_brush = new CUniFill();
                        compiled_brush.merge(base_fills[pts[i].idx]);
                        if(ser.spPr && ser.spPr.Fill)
                        {
                            compiled_brush.merge(ser.spPr.Fill);
                        }
                        if(Array.isArray(ser.dPt))
                        {
                            for(var j = 0; j < ser.dPt.length; ++j)
                            {
                                if(ser.dPt[j].idx === pts[i].idx)
                                {
                                    if(ser.dPt[j].spPr)
                                    {
                                        compiled_brush.merge(ser.dPt[j].spPr.Fill);
                                    }
                                    break;
                                }
                            }
                        }
                        pts[i].brush = compiled_brush;
                        pts[i].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }

                    default_line =  new CLn();
                    if(style.line1 === EFFECT_NONE)
                    {
                        default_line.w = 0;
                    }
                    else if(style.line1 === EFFECT_SUBTLE)
                    {
                        default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[0]);
                    }
                    else if(style.line1 === EFFECT_MODERATE)
                    {
                        default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[1]);
                    }
                    else if(style.line1 === EFFECT_INTENSE)
                    {
                        default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[2]);
                    }
                    var base_line_fills;
                    if(this.style === 34)
                        base_line_fills = getArrayFillsFromBase(style.line2, getMaxIdx(pts));
                    for(i = 0; i < pts.length; ++i)
                    {
                        var compiled_line = new CLn();
                        compiled_line.merge(default_line);
                        compiled_line.Fill = new CUniFill();
                        if(this.style !== 34)
                        {
                            compiled_line.Fill.merge(style.line2[0]);
                        }
                        else
                        {
                            compiled_line.Fill.merge(base_line_fills[pts[i].idx]);
                        }
                        if(ser.spPr && ser.spPr.ln)
                            compiled_line.merge(ser.spPr.ln);
                        if(Array.isArray(ser.dPt))
                        {
                            for(var j = 0; j < ser.dPt.length; ++j)
                            {
                                if(ser.dPt[j].idx === pts[i].idx)
                                {
                                    if(ser.dPt[j].spPr)
                                    {
                                        compiled_line.merge(ser.dPt[j].spPr.ln);
                                    }
                                    break;
                                }
                            }
                        }
                        pts[i].pen = compiled_line;
                        pts[i].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                }
                else
                {
                    var default_line;
                    if(this.chart.plotArea.chart.getObjectType() === historyitem_type_ScatterChart && this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_MARKER || this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_NONE)
                    {
                        default_line = new CLn();
                        default_line.setFill(new CUniFill());
                        default_line.Fill.setFill(new CNoFill());
                    }
                    else
                    {
                        default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                    }
                    var base_line_fills = getArrayFillsFromBase(style.line4, getMaxIdx(pts));
                    for(var i = 0; i < pts.length; ++i)
                    {
                        var compiled_line = new CLn();
                        compiled_line.merge(default_line);
                        if(!(this.chart.plotArea.chart.getObjectType() === historyitem_type_ScatterChart && this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_MARKER || this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_NONE))
                            compiled_line.Fill.merge(base_line_fills[pts[i].idx]);
                        compiled_line.w *= style.line3;
                        if(ser.spPr && ser.spPr.ln)
                        {
                            compiled_line.merge(ser.spPr.ln);
                        }
                        if(Array.isArray(ser.dPt))
                        {
                            for(var j = 0; j < ser.dPt.length; ++j)
                            {
                                if(ser.dPt[j].idx === pts[i].idx)
                                {
                                    if(ser.dPt[j].spPr)
                                    {
                                        compiled_line.merge(ser.dPt[j].spPr.ln);
                                    }
                                    break;
                                }
                            }
                        }
                        pts[i].brush = null;
                        pts[i].pen = compiled_line;
                        pts[i].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                }
                for(var j = 0; j < pts.length; ++j)
                {
                    if(pts[j].compiledMarker)
                    {

                        pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);

                    }
                }
            }
            else
            {
                switch(this.chart.plotArea.chart.getObjectType())
                {
                    case historyitem_type_LineChart:
                    case historyitem_type_RadarChart:
                    {
                        var base_line_fills = getArrayFillsFromBase(style.line4, getMaxIdx(series));
                        for(var i = 0; i < series.length; ++i)
                        {
                            var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                            var ser = series[i];
                            var pts = getPtsFromSeries(ser);
                            for(var j = 0; j < pts.length; ++j)
                            {
                                var compiled_line = new CLn();
                                compiled_line.merge(default_line);
                                compiled_line.Fill.merge(base_line_fills[ser.idx]);
                                compiled_line.w *= style.line3;
                                if(ser.spPr && ser.spPr.ln)
                                    compiled_line.merge(ser.spPr.ln);
                                if(j === 0)
                                    ser.compiledSeriesPen = compiled_line.createDuplicate();
                                if(Array.isArray(ser.dPt))
                                {
                                    for(var k = 0; k < ser.dPt.length; ++k)
                                    {
                                        if(ser.dPt[k].idx === pts[j].idx)
                                        {
                                            if(ser.dPt[k].spPr)
                                            {
                                                compiled_line.merge(ser.dPt[k].spPr.ln);
                                            }
                                            break;
                                        }
                                    }
                                }
                                pts[j].brush = null;
                                pts[j].pen = compiled_line;
                                pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                if(pts[j].compiledMarker)
                                {

                                    pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                    pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);

                                }
                            }
                        }
                        break;
                    }
                    case historyitem_type_ScatterChart:
                    {
                        var base_line_fills = getArrayFillsFromBase(style.line4, getMaxIdx(series));
                        for(var i = 0; i < series.length; ++i)
                        {
                            var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                            var ser = series[i];
                            var pts = getPtsFromSeries(ser);
                            if(this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_SMOOTH || this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_SMOOTH_MARKER)
                            {
                                if(!isRealBool(ser.smooth))
                                {
                                    ser.smooth = true;
                                }
                            }
                            if(this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_MARKER || this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_NONE)
                            {
                                default_line = new CLn();
                                default_line.setFill(new CUniFill());
                                default_line.Fill.setFill(new CNoFill());
                            }

                            for(var j = 0; j < pts.length; ++j)
                            {
                                var compiled_line = new CLn();
                                compiled_line.merge(default_line);
                                if(!(this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_MARKER || this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_NONE))
                                    compiled_line.Fill.merge(base_line_fills[ser.idx]);
                                compiled_line.w *= style.line3;
                                if(ser.spPr && ser.spPr.ln)
                                    compiled_line.merge(ser.spPr.ln);
                                if(j === 0)
                                    ser.compiledSeriesPen = compiled_line.createDuplicate();
                                if(Array.isArray(ser.dPt))
                                {
                                    for(var k = 0; k < ser.dPt.length; ++k)
                                    {
                                        if(ser.dPt[k].idx === pts[j].idx)
                                        {
                                            if(ser.dPt[k].spPr)
                                            {
                                                compiled_line.merge(ser.dPt[k].spPr.ln);
                                            }
                                            break;
                                        }
                                    }
                                }
                                pts[j].brush = null;
                                pts[j].pen = compiled_line;
                                pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                if(pts[j].compiledMarker)
                                {

                                    pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                    pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);

                                }
                            }
                        }
                        break;
                    }
                    default :
                    {
                        var base_fills = getArrayFillsFromBase(style.fill2, getMaxIdx(series));
                        var base_line_fills = null;
                        if(style.line1 === EFFECT_SUBTLE && this.style === 34)
                            base_line_fills	= getArrayFillsFromBase(style.line2, getMaxIdx(series));
                        for(var i = 0; i < series.length; ++i)
                        {
                            var ser = series[i];
                            var pts = getPtsFromSeries(ser);
                            for(var j = 0; j < pts.length; ++j)
                            {
                                var compiled_brush = new CUniFill();
                                compiled_brush.merge(base_fills[ser.idx]);
                                if(ser.spPr && ser.spPr.Fill)
                                {
                                    compiled_brush.merge(ser.spPr.Fill);
                                }
                                if(j === 0)
                                    ser.compiledSeriesBrush = compiled_brush.createDuplicate();
                                if(Array.isArray(ser.dPt))
                                {
                                    for(var k = 0; k < ser.dPt.length; ++k)
                                    {
                                        if(ser.dPt[k].idx === pts[j].idx)
                                        {
                                            if(ser.dPt[k].spPr)
                                            {
                                                compiled_brush.merge(ser.dPt[k].spPr.Fill);
                                            }
                                            break;
                                        }
                                    }
                                }
                                pts[j].brush = compiled_brush;
                                pts[j].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }


                            //
                            {
                                default_line =  new CLn();
                                if(style.line1 === EFFECT_NONE)
                                {
                                    default_line.w = 0;
                                }
                                else if(style.line1 === EFFECT_SUBTLE)
                                {
                                    default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[0]);
                                }
                                else if(style.line1 === EFFECT_MODERATE)
                                {
                                    default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[1]);
                                }
                                else if(style.line1 === EFFECT_INTENSE)
                                {
                                    default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[2]);
                                }
                                var base_line_fills;
                                if(this.style === 34)
                                    base_line_fills = getArrayFillsFromBase(style.line2, getMaxIdx(pts));

                                for(var j = 0; j < pts.length; ++j)
                                {
                                    var compiled_line = new CLn();
                                    compiled_line.merge(default_line);
                                    compiled_line.Fill = new CUniFill();
                                    if(this.style !== 34)
                                        compiled_line.Fill.merge(style.line2[0]);
                                    else
                                        compiled_line.Fill.merge(base_line_fills[ser.idx]);
                                    if(ser.spPr && ser.spPr.ln)
                                    {
                                        compiled_line.merge(ser.spPr.ln);
                                    }
                                    if(j === 0)
                                        ser.compiledSeriesPen = compiled_line.createDuplicate();
                                    if(Array.isArray(ser.dPt))
                                    {
                                        for(var k = 0; k < ser.dPt.length; ++k)
                                        {
                                            if(ser.dPt[k].idx === pts[j].idx)
                                            {
                                                if(ser.dPt[k].spPr)
                                                {
                                                    compiled_line.merge(ser.dPt[k].spPr.ln);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    pts[j].pen = compiled_line;
                                    pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                    if(pts[j].compiledMarker)
                                    {
                                        pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                        pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
    },


    recalculateChartTitleEditMode: function(bWord)
    {
        var old_pos_x, old_pos_y, old_pos_cx, old_pos_cy;
        var pos_x, pos_y;
        old_pos_x = this.recalcInfo.recalcTitle.x;
        old_pos_y = this.recalcInfo.recalcTitle.y;
        old_pos_cx = this.recalcInfo.recalcTitle.x + this.recalcInfo.recalcTitle.extX/2;
        old_pos_cy = this.recalcInfo.recalcTitle.y + this.recalcInfo.recalcTitle.extY/2;

        this.recalculateAxisLabels();
        if(checkVerticalTitle(this.recalcInfo.recalcTitle))
        {
            pos_x = old_pos_x;
            pos_y = old_pos_cy - this.recalcInfo.recalcTitle.extY/2;
        }
        else
        {
            pos_x = old_pos_cx - this.recalcInfo.recalcTitle.extX/2;
            pos_y = old_pos_y;
        }
        this.recalcInfo.recalcTitle.setPosition(pos_x, pos_y);
        if(bWord)
        {
            this.recalcInfo.recalcTitle.updatePosition(this.posX, this.posY);
        }
    },


    recalculateMarkers: function()
    {
        if(this.chart && this.chart.plotArea && this.chart.plotArea.chart)
        {
            var series = this.chart.plotArea.chart.series, pts;
            for(var i = 0; i < series.length; ++i)
            {
                var ser = series[i];
                ser.compiledSeriesMarker = null;
                pts =  getPtsFromSeries(ser);
                for(var j = 0; j < pts.length; ++j)
                {
                    pts[j].compiledMarker = null;
                }
            }

            var oThis = this;
            var recalculateMarkers2 = function()
            {
                var chart_style = CHART_STYLE_MANAGER.getStyleByIndex(oThis.style);
                var effect_fill = chart_style.fill1;
                var fill = chart_style.fill2;
                var line = chart_style.line4;
                var masrker_default_size = chart_style.markerSize;
                var default_marker = new CMarker();
                default_marker.setSize(masrker_default_size);
                var parent_objects = oThis.getParentObjects();

                if(parent_objects.theme  && parent_objects.theme.themeElements
                    && parent_objects.theme.themeElements.fmtScheme
                    && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
                {
                    default_marker.setSpPr(new CSpPr());
                    default_marker.spPr.setLn(new CLn());
                    default_marker.spPr.ln.merge(parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0]);
                }
                var RGBA = {R:0, G:0, B:0, A: 255};
                if(oThis.chart.plotArea.chart.varyColors && (oThis.chart.plotArea.chart.series.length === 1 || oThis.chart.plotArea.chart.getObjectType() === historyitem_type_PieChart || oThis.chart.plotArea.chart.getObjectType() === historyitem_type_DoughnutChart))
                {
                    var ser = oThis.chart.plotArea.chart.series[0], pts;
                    pts = getPtsFromSeries(ser);
                    var series_marker = ser.marker;
                    var brushes = getArrayFillsFromBase(fill, getMaxIdx(pts));
                    var pens_fills = getArrayFillsFromBase(line, getMaxIdx(pts));
                    var compiled_markers = [];
                    for(var i = 0;  i < pts.length; ++i)
                    {
                        var compiled_marker = new CMarker();
                        compiled_marker.merge(default_marker);
                        if(!compiled_marker.spPr)
                        {
                            compiled_marker.setSpPr(new CSpPr());
                        }
                        compiled_marker.spPr.setFill(brushes[pts[i].idx]);
                        compiled_marker.spPr.Fill.merge(pts[i].brush);
                        if(!compiled_marker.spPr.ln)
                            compiled_marker.spPr.setLn(new CLn());
                        compiled_marker.spPr.ln.merge(pts[i].pen);
                        compiled_marker.merge(ser.marker);
                        compiled_marker.setSymbol(GetTypeMarkerByIndex(j));

                        if(Array.isArray(ser.dPt))
                        {
                            for(var j = 0; j < ser.dPt.length; ++j)
                            {
                                if(ser.dPt[j].idx === pts[i].idx)
                                {

                                    var d_pt = ser.dPt[j];
                                    if(d_pt.spPr && (d_pt.spPr.Fill || d_pt.spPr.ln))
                                    {
                                        if(!compiled_marker.spPr)
                                        {
                                            compiled_marker.setSpPr(new CSpPr());
                                        }
                                        if(d_pt.spPr.Fill)
                                        {
                                            compiled_marker.spPr.setFill(d_pt.spPr.Fill.createDuplicate());
                                        }
                                        if(d_pt.spPr.ln)
                                        {
                                            if(!compiled_marker.spPr.ln)
                                            {
                                                compiled_marker.spPr.setLn(new CLn());
                                            }
                                            compiled_marker.spPr.ln.merge(d_pt.spPr.ln);
                                        }
                                    }

                                    compiled_marker.merge(ser.dPt[j].marker);
                                    break;
                                }
                            }
                        }
                        pts[i].compiledMarker = compiled_marker;
                        pts[i].compiledMarker.pen = compiled_marker.spPr.ln;
                        pts[i].compiledMarker.brush = compiled_marker.spPr.Fill;
                        pts[i].compiledMarker.brush.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, RGBA);
                        pts[i].compiledMarker.pen.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, RGBA);
                    }
                }
                else
                {
                    var series = oThis.chart.plotArea.chart.series;
                    var brushes = getArrayFillsFromBase(fill, getMaxIdx(series));
                    var pens_fills = getArrayFillsFromBase(line, getMaxIdx(series));
                    for(var i = 0; i < series.length; ++i)
                    {
                        var ser = series[i];
                        pts = getPtsFromSeries(ser);
                        for(var j = 0; j < pts.length; ++j)
                        {
                            var compiled_marker = new CMarker();
                            compiled_marker.merge(default_marker);
                            if(!compiled_marker.spPr)
                            {
                                compiled_marker.setSpPr(new CSpPr());
                            }
                            compiled_marker.spPr.setFill(brushes[series[i].idx]);
                            if(!compiled_marker.spPr.ln)
                                compiled_marker.spPr.setLn(new CLn());
                            compiled_marker.spPr.ln.setFill(pens_fills[series[i].idx]);
                            compiled_marker.setSymbol(GetTypeMarkerByIndex(series[i].idx));
                            compiled_marker.merge(ser.marker);
                            if(j === 0)
                                ser.compiledSeriesMarker = compiled_marker.createDuplicate();
                            if(Array.isArray(ser.dPt))
                            {
                                for(var k = 0; k < ser.dPt.length; ++k)
                                {
                                    if(ser.dPt[k].idx === pts[j].idx)
                                    {
                                        compiled_marker.merge(ser.dPt[k].marker);
                                        break;
                                    }
                                }
                            }
                            pts[j].compiledMarker = compiled_marker;
                            pts[j].compiledMarker.pen = compiled_marker.spPr.ln;
                            pts[j].compiledMarker.brush = compiled_marker.spPr.Fill;
                            pts[j].compiledMarker.brush.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, RGBA);
                            pts[j].compiledMarker.pen.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, RGBA);
                        }
                    }
                }
            };
            switch (this.chart.plotArea.chart.getObjectType())
            {
                case historyitem_type_LineChart:
                case historyitem_type_RadarChart:
                {
                    if(this.chart.plotArea.chart.marker)
                    {
                        recalculateMarkers2();
                    }
                    break;
                }
                case historyitem_type_ScatterChart:
                {
                    if(this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_MARKER || this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_LINE_MARKER || this.chart.plotArea.chart.scatterStyle === SCATTER_STYLE_SMOOTH_MARKER)
                    {
                        recalculateMarkers2();
                    }
                    break;
                }
                default:
                {
                    recalculateMarkers2();
                    break;
                }
            }
        }
    },

    recalculateGridLines: function()
    {
        if(this.chart && this.chart.plotArea)
        {
            var calcMajorMinorGridLines = function (axis, defaultStyle, subtleLine, parents)
            {
                if(!axis)
                    return;
                function calcGridLine(defaultStyle, spPr, subtleLine, parents)
                {
                    if(spPr)
                    {
                        var compiled_grid_lines = new CLn();
                        compiled_grid_lines.merge(subtleLine);
                        if(compiled_grid_lines.Fill && compiled_grid_lines.Fill.fill && compiled_grid_lines.Fill.fill.color && compiled_grid_lines.Fill.fill.color.Mods)
                        {
                            compiled_grid_lines.Fill.fill.color.Mods.Mods.length = 0;
                        }
                        if(!compiled_grid_lines.Fill)
                        {
                            compiled_grid_lines.setFill(new CUniFill());
                        }
                        compiled_grid_lines.Fill.merge(defaultStyle);
                        compiled_grid_lines.merge(spPr.ln);
                        compiled_grid_lines.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                        return compiled_grid_lines;
                    }
                    return null;
                }
                axis.compiledMajorGridLines = calcGridLine(defaultStyle.axisAndMajorGridLines, axis.majorGridlines, subtleLine, parents);
                axis.compiledMinorGridLines = calcGridLine(defaultStyle.minorGridlines, axis.minorGridlines, subtleLine, parents);
            };
            var default_style = CHART_STYLE_MANAGER.getDefaultLineStyleByIndex(this.style);
            var parent_objects = this.getParentObjects();
            var RGBA = {R:0, G:0, B:0, A: 255};
            var subtle_line;
            if(parent_objects.theme  && parent_objects.theme.themeElements
                && parent_objects.theme.themeElements.fmtScheme
                && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
            {
                subtle_line = parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0];
            }
            calcMajorMinorGridLines(this.chart.plotArea.valAx, default_style, subtle_line, parent_objects);
            calcMajorMinorGridLines(this.chart.plotArea.catAx, default_style, subtle_line, parent_objects);
        }
    },

    getNeedColorCount: function()
    {
        var b_vary_markers = this.chart.plotArea.chart instanceof CDoughnutChart || this.chart.plotArea.chart instanceof CPieChart || (this.chart.plotArea.chart.varyColors && this.chart.plotArea.chart.series.length === 1);
        var need_colors;
        if(!b_vary_markers)
        {
            return this.chart.plotArea.chart.series.length;
        }
        else
        {
            if(this.chart.plotArea.chart.series[0].val)
            {
                return this.chart.plotArea.chart.series[0].val.numRef.numCache.pts.length;
            }
            else
            {
                if(this.chart.plotArea.chart.series[0].yVal)
                {
                    return this.chart.plotArea.chart.series[0].yVal.numRef.numCache.pts.length;
                }
                else
                {
                    return 0;
                }
            }
        }
    },

    hitToAdjustment: function()
    {
        return {hit: false};
    },

    hitInWorkArea: function()
    {
        return false;
    },

    recalculateAxisLabels: function()
    {
        if(this.chart && this.chart.title)
        {
            var title = this.chart.title;
            //title.parent = this.chart;
            title.chart = this;
            title.recalculate();
        }
        if(this.chart && this.chart.plotArea)
        {
            var hor_axis = this.chart.plotArea.getHorizontalAxis();
            if(hor_axis && hor_axis.title)
            {
                var title = hor_axis.title;
                //title.parent = hor_axis;
                title.chart = this;
                title.recalculate();
            }
            var vert_axis = this.chart.plotArea.getVerticalAxis();
            if(vert_axis && vert_axis.title)
            {
                var title = vert_axis.title;
                //title.parent = vert_axis;
                title.chart = this;
                title.recalculate();
            }
        }
    },

    recalculateBaseColors: function()
    {
        if ( this.style && (typeof(this.style) == 'number') )
        {
            if ( this.style % 8 === 0 )
                this.baseColors = CreateColorMapByIndex(8);
            else
                this.baseColors = CreateColorMapByIndex(this.style % 8);
        }
        else
            this.baseColors = CreateColorMapByIndex(2);
    },


    updateLinks: function()
    {
        //Этот метод нужен, т. к. мы не полностью поддерживаем формат в котором в одном plotArea может быть несколько разных диаграмм(конкретных типов).
        // Здесь мы берем первую из диаграмм лежащих в массиве plotArea.charts, а также выставляем ссылки для осей ;
        if(this.chart && this.chart.plotArea)
        {
            this.chart.plotArea.chart = this.chart.plotArea.charts[0];
            if(this.chart.plotArea.chart.getAxisByTypes)
            {
                var axis_by_types = this.chart.plotArea.chart.getAxisByTypes();
                if(axis_by_types.valAx.length === 1 && axis_by_types.catAx.length === 1)
                {
                    this.chart.plotArea.valAx = axis_by_types.valAx[0];
                    this.chart.plotArea.catAx = axis_by_types.catAx[0];
                }
                else
                {
                    if(axis_by_types.valAx.length > 1)
                    {//TODO: выставлять оси исходя из настроек
                        this.chart.plotArea.valAx = axis_by_types.valAx[1];
                        this.chart.plotArea.catAx = axis_by_types.valAx[0];
                    }
                }
            }
            else
            {
                this.chart.plotArea.valAx = null;
                this.chart.plotArea.catAx = null;
            }
        }
    },

    draw: function(graphics)
    {
        /*this.setRecalculateInfo();
         this.recalculate();*/
        if(graphics.IsSlideBoundsCheckerType)
        {
            graphics.transform3(this.transform);
            graphics._s();
            graphics._m(0, 0);
            graphics._l(this.extX, 0);
            graphics._l(this.extX, this.extY);
            graphics._l(0, this.extY);
            graphics._e();
            return;
        }
        if(graphics.updatedRect)
        {
            var rect = graphics.updatedRect;
            var bounds = this.bounds;
            if(bounds.x > rect.x + rect.w
                || bounds.y > rect.y + rect.h
                || bounds.x + bounds.w < rect.x
                || bounds.y + bounds.h < rect.y)
                return;
        }

        var pix= 3*this.convertPixToMM(1);
        var intGrid = graphics.GetIntegerGrid();
        graphics.SaveGrState();
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);

        var ln_width;
        if(this.pen && isRealNumber(this.pen.w))
        {
            ln_width = this.pen.w/36000;
        }
        else
        {
            ln_width = 0;
        }
        graphics.AddClipRect(-ln_width, -ln_width, this.extX+2*ln_width, this.extY+2*ln_width);


        if(this.chartObj)
        {
            this.chartObj.draw(this, graphics);
        }
       // graphics.reset();



        if(this.chart)
        {
            if(this.chart.plotArea)
            {
                if(this.chart.plotArea.chart && this.chart.plotArea.chart.series)
                {
                    var series = this.chart.plotArea.chart.series;
                    var _len = this.chart.plotArea.chart.getObjectType() === historyitem_type_PieChart ? 1 : series.length;
                    for(var i = 0; i < _len; ++i)
                    {
                        var ser = series[i];
                        var pts = getPtsFromSeries(ser);
                        for(var j = 0; j < pts.length; ++j)
                        {
                            if(pts[j].compiledDlb)
                                pts[j].compiledDlb.draw(graphics);
                        }
                    }
                }
                if(this.chart.plotArea.catAx)
                {
                    if(this.chart.plotArea.catAx.title)
                        this.chart.plotArea.catAx.title.draw(graphics);
                    if(this.chart.plotArea.catAx.labels)
                        this.chart.plotArea.catAx.labels.draw(graphics);
                }
                if(this.chart.plotArea.valAx)
                {
                    if(this.chart.plotArea.valAx.title)
                        this.chart.plotArea.valAx.title.draw(graphics);
                    if(this.chart.plotArea.valAx.labels)
                        this.chart.plotArea.valAx.labels.draw(graphics);
                }

            }
            if(this.chart.title)
            {
                this.chart.title.draw(graphics);
            }
            if(this.chart.legend)
            {
                this.chart.legend.draw(graphics);
            }
        }

        graphics.RestoreGrState();
       // graphics.reset();
    },

    addToSetPosition: function(dLbl)
    {
        if(dLbl instanceof CDLbl)
            this.recalcInfo.dataLbls.push(dLbl);
        else if(dLbl instanceof CTitle)
            this.recalcInfo.axisLabels.push(dLbl);
    },

    recalculateChart: function()
    {
        if(this.chartObj == null)
            this.chartObj =  new CChartsDrawer();
        this.chartObj.reCalculate(this);
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_AutoShapes_RemoveFromDrawingObjects:
            {
                addToDrawings(this.worksheet, this, data.Pos);
                break;
            }
            case historyitem_AutoShapes_AddToDrawingObjects:
            {
                deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
                break;
            }
            case historyitem_AutoShapes_SetWorksheet:
            {
                this.worksheet = data.oldPr;
                break;
            }
            case historyitem_ChartSpace_SetParent:
            {
                this.parent = data.oldPr;
                break;
            }
            case historyitem_ShapeSetBDeleted:
            {
                this.bDeleted = data.oldPr;
                break;
            }
            case historyitem_ChartSpace_SetChart:
            {
                this.chart = data.oldChart;
                break;
            }
            case historyitem_ChartSpace_SetClrMapOvr:
            {
                this.clrMapOvr = data.oldClrMapOvr;
                break;
            }
            case historyitem_ChartSpace_SetDate1904:
            {
                this.date1904 = data.oldDate1904;
                break;
            }
            case historyitem_ChartSpace_SetExternalData:
            {
                this.externalData = data.oldExternalData;
                break;
            }
            case historyitem_ChartSpace_SetLang:
            {
                this.lang = data.oldLang;
                break;
            }
            case historyitem_ChartSpace_SetPivotSource:
            {
                this.pivotSource = data.oldPivotSource;
                break;
            }
            case historyitem_ChartSpace_SetPrintSettings:
            {
                this.printSettings = data.oldPrintSettings;
                break;
            }
            case historyitem_ChartSpace_SetProtection:
            {
                this.protection = data.oldProtection;
                break;
            }
            case historyitem_ChartSpace_SetRoundedCorners:
            {
                this.roundedCorners = data.oldRoundedCorners;
                break;
            }
            case historyitem_ChartSpace_SetSpPr:
            {
                this.spPr = data.oldSpPr;
                break;
            }
            case historyitem_ChartSpace_SetStyle:
            {
                this.style = data.oldStyle;
                break;
            }
            case historyitem_ChartSpace_SetTxPr:
            {
                this.txPr = data.oldTxPr;
                break;
            }
            case historyitem_ChartSpace_SetUserShapes:
            {
                this.userShapes = data.oldUserShapes;
                break;
            }
            case historyitem_ChartSpace_SetThemeOverride:
            {
                this.themeOverride = data.oldPr;
                break;
            }
            case historyitem_ChartSpace_SetGroup:
            {
                this.group = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_AutoShapes_RemoveFromDrawingObjects:
            {
                deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
                break;
            }
            case historyitem_AutoShapes_AddToDrawingObjects:
            {
                addToDrawings(this.worksheet, this, data.Pos);
                break;
            }

            case historyitem_ChartSpace_SetParent:
            {
                this.parent = data.newPr;
                break;
            }
            case historyitem_AutoShapes_SetWorksheet:
            {
                this.worksheet = data.newPr;
                break;
            }
            case historyitem_ShapeSetBDeleted:
            {
                this.bDeleted = data.newPr;
                break;
            }
            case historyitem_ChartSpace_SetChart:
            {
                this.chart = data.newChart;
                break;
            }
            case historyitem_ChartSpace_SetClrMapOvr:
            {
                this.clrMapOvr = data.newClrMapOvr;
                break;
            }
            case historyitem_ChartSpace_SetDate1904:
            {
                this.date1904 = data.newDate1904;
                break;
            }
            case historyitem_ChartSpace_SetExternalData:
            {
                this.externalData = data.newExternalData;
                break;
            }
            case historyitem_ChartSpace_SetLang:
            {
                this.lang = data.newLang;
                break;
            }
            case historyitem_ChartSpace_SetPivotSource:
            {
                this.pivotSource = data.newPivotSource;
                break;
            }
            case historyitem_ChartSpace_SetPrintSettings:
            {
                this.printSettings = data.newPrintSettings;
                break;
            }
            case historyitem_ChartSpace_SetProtection:
            {
                this.protection = data.newProtection;
                break;
            }
            case historyitem_ChartSpace_SetRoundedCorners:
            {
                this.roundedCorners = data.newRoundedCorners;
                break;
            }
            case historyitem_ChartSpace_SetSpPr:
            {
                this.spPr = data.newSpPr;
                break;
            }
            case historyitem_ChartSpace_SetStyle:
            {
                this.style = data.newStyle;
                break;
            }
            case historyitem_ChartSpace_SetTxPr:
            {
                this.txPr = data.newTxPr;
                break;
            }
            case historyitem_ChartSpace_SetUserShapes:
            {
                this.userShapes = data.newUserShapes;
                break;
            }
            case historyitem_ChartSpace_SetThemeOverride:
            {
                this.themeOverride = data.newPr;
                break;
            }
            case historyitem_ChartSpace_SetGroup:
            {
                this.group = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_AutoShapes_RemoveFromDrawingObjects:
            {
                break;
            }
            case historyitem_AutoShapes_AddToDrawingObjects:
            {
                var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
                writeLong(w, Pos);
                break;
            }
            case historyitem_AutoShapes_SetWorksheet:
            {
                writeBool(w,isRealObject(data.newPr));
                if(isRealObject(w,data.newPr))
                {
                    writeString(w,data.newPr.getId());
                }
                break;
            }

            case historyitem_ChartSpace_SetParent:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_ShapeSetBDeleted:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_ChartSpace_SetChart:
            {
                writeObject(w,data.newChart);
                break;
            }
            case historyitem_ChartSpace_SetClrMapOvr:
            {
                writeObject(w,data.newClrMapOvr);
                break;
            }
            case historyitem_ChartSpace_SetDate1904:
            {
                writeBool(w,data.newDate1904);
                break;
            }
            case historyitem_ChartSpace_SetExternalData:
            {
                writeObject(w,data.newExternalData);
                break;
            }
            case historyitem_ChartSpace_SetLang:
            {
                writeString(w, data.newLang);
                break;
            }
            case historyitem_ChartSpace_SetPivotSource:
            {
                writeObject(w, data.newPivotSource);
                break;
            }
            case historyitem_ChartSpace_SetPrintSettings:
            {
                writeObject(w, data.newPrintSettings);
                break;
            }
            case historyitem_ChartSpace_SetProtection:
            {
                writeObject(w, data.newProtection);
                break;
            }
            case historyitem_ChartSpace_SetRoundedCorners:
            {
                writeBool(w, data.newRoundedCorners);
                break;
            }
            case historyitem_ChartSpace_SetSpPr:
            {
                writeObject(w, data.newSpPr);
                break;
            }
            case historyitem_ChartSpace_SetStyle:
            {
                writeLong(w, data.newStyle);
                break;
            }
            case historyitem_ChartSpace_SetTxPr:
            {
                writeObject(w, data.newTxPr);
                break;
            }
            case historyitem_ChartSpace_SetUserShapes:
            {
                writeString(w, data.newUserShapes);
                break;
            }

            case historyitem_ChartSpace_SetThemeOverride:
            {
                writeObject(w, data.oldPr);
                break;
            }

            case historyitem_ChartSpace_SetGroup:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_AutoShapes_RemoveFromDrawingObjects:
            {
                deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
                break;
            }
            case historyitem_AutoShapes_AddToDrawingObjects:
            {
                var pos = readLong(r);
                if(this.worksheet)
                {
                    pos = this.worksheet.contentChanges.Check(contentchanges_Add, pos);
                }
                addToDrawings(this.worksheet, this, pos);
                break;
            }
            case historyitem_AutoShapes_SetWorksheet:
            {
                if(readBool(r))
                {
                    var api = window["Asc"]["editor"];
                    if ( api.wb )
                    {
                        var id = readString(r);
                        this.worksheet = api.wbModel.getWorksheetById(id);
                    }
                }
                else
                {
                    this.worksheet = null;
                }
                break;
            }
            case historyitem_ChartSpace_SetParent:
            {
                this.parent = readObject(r);
                break;
            }
            case historyitem_ShapeSetBDeleted:
            {
                this.bDeleted = readBool(r);
                break;
            }
            case historyitem_ChartSpace_SetChart:
            {
                this.chart = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetClrMapOvr:
            {
                this.clrMapOvr = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetDate1904:
            {
                this.date1904 = readBool(r);
                break;
            }
            case historyitem_ChartSpace_SetExternalData:
            {
                this.externalData = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetLang:
            {
                this.lang = readString(r);
                break;
            }
            case historyitem_ChartSpace_SetPivotSource:
            {
                this.pivotSource = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetPrintSettings:
            {
                this.printSettings = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetProtection:
            {
                this.protection = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetRoundedCorners:
            {
                this.roundedCorners = readBool(r);
                break;
            }
            case historyitem_ChartSpace_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetStyle:
            {
                this.style = readLong(r);
                this.handleUpdateStyle();
                break;
            }
            case historyitem_ChartSpace_SetTxPr:
            {
                this.txPr = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetUserShapes:
            {
                this.userShapes = readString(r);
                break;
            }
            case historyitem_ChartSpace_SetThemeOverride:
            {
                this.themeOverride = readObject(r);
                break;
            }
            case historyitem_ChartSpace_SetGroup:
            {
                this.group = readObject(r);
                break;
            }                
        }
    },

    Search : function(Str, Props, SearchEngine, Type)
    {
        var titles = this.getAllTitles();
        for(var i = 0; i < titles.length; ++i)
        {
            titles[i].Search(Str, Props, SearchEngine, Type)
        }
    },

    Search_GetId : function(bNext, bCurrent)
    {
        var Current = -1;
        var titles = this.getAllTitles();
        var Len = titles.length;

        var Id = null;
        if ( true === bCurrent )
        {
            for(var i = 0; i < Len; ++i)
            {
                if(titles[i] === this.selection.textSelection)
                {
                    Current = i;
                    break;
                }
            }
        }

        if ( true === bNext )
        {
            var Start = ( -1 !== Current ? Current : 0 );

            for ( var i = Start; i < Len; i++ )
            {
                if ( titles[i].Search_GetId )
                {
                    Id = titles[i].Search_GetId(true, i === Current ? true : false);
                    if ( null !== Id )
                        return Id;
                }
            }
        }
        else
        {
            var Start = ( -1 !== Current ? Current : Len - 1 );

            for ( var i = Start; i >= 0; i-- )
            {
                if (titles[i].Search_GetId )
                {
                    Id = titles[i].Search_GetId(false, i === Current ? true : false);
                    if ( null !== Id )
                        return Id;
                }
            }
        }
        return null;
    }
};



function getPtsFromSeries(ser)
{
    if(ser)
    {
        if(ser.val)
        {
            if(ser.val.numRef && ser.val.numRef.numCache)
                return ser.val.numRef.numCache.pts;
            else if(ser.val.numLit)
                return ser.val.numLit.pts
        }
        else if(ser.yVal)
        {
            if(ser.yVal.numRef && ser.yVal.numRef.numCache)
                return ser.yVal.numRef.numCache.pts;
            else if(ser.yVal.numLit)
                return ser.yVal.numLit.pts
        }
    }
    return [];
}


function getCatStringPointsFromSeries(ser)
{
    if(ser && ser.cat)
    {
        if(ser.cat.strRef && ser.cat.strRef.strCache)
        {
            return ser.cat.strRef.strCache;
        }
        else if(ser.cat.strLit)
        {
            return ser.cat.strLit;
        }
    }
    return null;
}

function getMaxIdx(arr)
{
    var max_idx = 0;
    for(var i = 0; i < arr.length;++i)
        arr[i].idx > max_idx && (max_idx = arr[i].idx);
    return max_idx+1;
}



function getArrayFillsFromBase(arrBaseFills, needFillsCount)
{
    var ret = [];
    var count_base = arrBaseFills.length;

    var need_create = parseInt(needFillsCount / count_base) + 1;

    for (var i = 0; i < need_create; i++)
    {
        for (var j = 0; j < count_base; j++)
        {
            var percent = (-70 + 140 * ( (i + 1) / (need_create + 1) )) /100;
            var color = CreateUniFillSolidFillWidthTintOrShade(arrBaseFills[j], 1 - percent);
            ret.push( color );
        }
    }
    ret.splice(needFillsCount, ret.length - needFillsCount);
    return ret;
}

function GetTypeMarkerByIndex(index)
{
    return MARKER_SYMBOL_TYPE[index % 9];
}

function CreateUnfilFromRGB(r, g, b)
{
    var ret =  new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(new CUniColor());
    ret.fill.color.setColor(new CRGBColor());
    ret.fill.color.color.setColor(r, g, b);
    return ret;
}

function CreateColorMapByIndex(index)
{
    var ret = [];
    switch(index)
    {
        case 1:
        {
            ret.push(CreateUnfilFromRGB(85, 85, 85));
            ret.push(CreateUnfilFromRGB(158, 158, 158));
            ret.push(CreateUnfilFromRGB(114, 114, 114));
            ret.push(CreateUnfilFromRGB(70, 70, 70));
            ret.push(CreateUnfilFromRGB(131, 131, 131));
            ret.push(CreateUnfilFromRGB(193, 193, 193));
            break;
        }
        case 2:
        {
            for(var i = 0;  i < 6; ++i)
            {
                ret.push(CreateUnifillSolidFillSchemeColorByIndex(i));
            }
            break;
        }
        default:
        {
            ret.push(CreateUnifillSolidFillSchemeColorByIndex(index - 3));
            break;
        }
    }
    return ret;
}


function CreateUniFillSolidFillWidthTintOrShade(unifill, effectVal)
{
    var ret = unifill.createDuplicate();
    var unicolor = ret.fill.color;
    if(effectVal !== 0)
    {
        effectVal*=100000.0;
        if(!unicolor.Mods)
            unicolor.setMods(new CColorModifiers());
        var mod = new CColorMod();
        if(effectVal > 0)
        {
            mod.setName("tint");
            mod.setVal(effectVal);
        }
        else
        {
            mod.setName("shade");
            mod.setVal(Math.abs(effectVal));
        }
        unicolor.Mods.addMod(mod);
    }
    return ret;
}



function CreateUnifillSolidFillSchemeColor(colorId, tintOrShade)
{
    var unifill = new CUniFill();
    unifill.setFill(new CSolidFill());
    unifill.fill.setColor(new CUniColor());
    unifill.fill.color.setColor(new CSchemeColor());
    unifill.fill.color.color.setId(colorId);
    return CreateUniFillSolidFillWidthTintOrShade(unifill, tintOrShade);
}

function CreateNoFillLine()
{
    var ret = new CLn();
    ret.setFill(CreateNoFillUniFill());
    return ret;
}

function CreateNoFillUniFill()
{
    var ret = new CUniFill();
    ret.setFill(new CNoFill());
    return ret;
}

function CExternalData()
{
    this.autoUpdate = null;
    this.id  = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CExternalData.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},
    getObjectType: function()
    {
        return historyitem_type_ExternalData;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setAutoUpdate: function(pr)
    {
        History.Add(this, {Type: historyitem_ExternalData_SetAutoUpdate, oldPr: this.autoUpdate, newPr: pr});
        this.autoUpdate = pr;
    },

    setId: function(pr)
    {
        History.Add(this, {Type: historyitem_ExternalData_SetId, oldPr: this.id, newPr: pr});
        this.id = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ExternalData_SetAutoUpdate:
            {
                this.autoUpdate = data.oldPr;
                break;
            }
            case historyitem_ExternalData_SetId:
            {
                this.id = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ExternalData_SetAutoUpdate:
            {
                this.autoUpdate = data.newPr;
                break;
            }
            case historyitem_ExternalData_SetId:
            {
                this.id = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ExternalData_SetAutoUpdate:
            {
                writeBool(data.newPr);
                break;
            }
            case historyitem_ExternalData_SetId:
            {
                writeString(data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_ExternalData_SetAutoUpdate:
            {
                this.autoUpdate = readBool(r);
                break;
            }
            case historyitem_ExternalData_SetId:
            {
                this.id = readString(r);
                break;
            }
        }
    }
};

function CPivotSource()
{
    this.fmtId = null;
    this.name  = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPivotSource.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return historyitem_type_PivotSource;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setFmtId: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotSource_SetFmtId, oldPr: this.fmtId, newPr: pr});
        this.fmtId = pr;
    },

    setName: function(pr)
    {
        History.Add(this, {Type:historyitem_PivotSource_SetName, oldPr: this.name, newPr: pr});
        this.name = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PivotSource_SetFmtId:
            {
                this.fmtId = data.oldPr;
                break;
            }
            case historyitem_PivotSource_SetName:
            {
                this.name = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PivotSource_SetFmtId:
            {
                this.fmtId = data.newPr;
                break;
            }
            case historyitem_PivotSource_SetName:
            {
                this.name = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PivotSource_SetFmtId:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_PivotSource_SetName:
            {
                writeString(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PivotSource_SetFmtId:
            {
                this.fmtId = readLong(r);
                break;
            }
            case historyitem_PivotSource_SetName:
            {
                this.name = readString(r);
                break;
            }
        }
    }
};


function CProtection()
{
    this.chartObject   = null;
    this.data          = null;
    this.formatting    = null;
    this.selection     = null;
    this.userInterface = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CProtection.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return historyitem_type_Protection;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setChartObject: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetChartObject, newPr: pr, oldPr:this.chartObject});
        this.chartObject = pr;
    },
    setData: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetData, newPr: pr, oldPr:this.data});
        this.data = pr;
    },
    setFormatting: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetFormatting, newPr: pr, oldPr:this.formatting});
        this.formatting = pr;
    },
    setSelection: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetSelection, newPr: pr, oldPr:this.selection});
        this.selection = pr;
    },
    setUserInterface: function(pr)
    {
        History.Add(this, {Type: historyitem_Protection_SetUserInterface, newPr: pr, oldPr:this.userInterface});
        this.userInterface = pr;
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_Protection_SetChartObject:
            {
                this.chartObject = data.oldPr;
                break;
            }
            case historyitem_Protection_SetData:
            {
                this.data = data.oldPr;
                break;
            }
            case historyitem_Protection_SetFormatting:
            {
                this.formatting = data.oldPr;
                break;
            }
            case historyitem_Protection_SetSelection:
            {
                this.selection = data.oldPr;
                break;
            }
            case historyitem_Protection_SetUserInterface:
            {
                this.userInterface = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_Protection_SetChartObject:
            {
                this.chartObject = data.newPr;
                break;
            }
            case historyitem_Protection_SetData:
            {
                this.data = data.oldPr;
                break;
            }
            case historyitem_Protection_SetFormatting:
            {
                this.formatting = data.newPr;
                break;
            }
            case historyitem_Protection_SetSelection:
            {
                this.selection = data.newPr;
                break;
            }
            case historyitem_Protection_SetUserInterface:
            {
                this.userInterface = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_Protection_SetChartObject:
            case historyitem_Protection_SetData:
            case historyitem_Protection_SetFormatting:
            case historyitem_Protection_SetSelection:
            case historyitem_Protection_SetUserInterface:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_Protection_SetChartObject:
            {
                this.chartObject = readBool(r);
                break;
            }
            case historyitem_Protection_SetData:
            {
                this.data = readBool(r);
                break;
            }
            case historyitem_Protection_SetFormatting:
            {
                this.formatting = readBool(r);
                break;
            }
            case historyitem_Protection_SetSelection:
            {
                this.selection = readBool(r);
                break;
            }
            case historyitem_Protection_SetUserInterface:
            {
                this.userInterface = readBool(r);
                break;
            }
        }
    }
};


function CPrintSettings()
{
    this.headerFooter = null;
    this.pageMargins  = null;
    this.pageSetup    = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPrintSettings.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    createDuplicate : function()
    {
        var oPS = new CPrintSettings();
        
        if ( this.headerFooter )
            oPS.headerFooter = this.headerFooter.createDuplicate();
        
        if ( this.pageMargins )
            oPS.pageMargins  = this.pageMargins.createDuplicate();
        
        if ( this.pageSetup )
            oPS.pageSetup    = this.pageSetup.createDuplicate();
        
        return oPS;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return historyitem_type_PrintSettings;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setHeaderFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_PrintSettingsSetHeaderFooter, oldPr: this.headerFooter, newPr: pr});
        this.headerFooter = pr;
    },
    setPageMargins: function(pr)
    {
        History.Add(this, {Type: historyitem_PrintSettingsSetPageMargins, oldPr: this.pageMargins, newPr: pr});
        this.pageMargins = pr;
    },
    setPageSetup: function(pr)
    {
        History.Add(this, {Type: historyitem_PrintSettingsSetPageSetup, oldPr: this.pageSetup, newPr: pr});
        this.pageSetup = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PrintSettingsSetHeaderFooter:
            {
                this.headerFooter = data.oldPr;
                break;
            }
            case historyitem_PrintSettingsSetPageMargins:
            {
                this.pageMargins = data.oldPr;
                break;
            }
            case historyitem_PrintSettingsSetPageSetup:
            {
                this.pageSetup = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PrintSettingsSetHeaderFooter:
            {
                this.headerFooter = data.newPr;
                break;
            }
            case historyitem_PrintSettingsSetPageMargins:
            {
                this.pageMargins = data.newPr;
                break;
            }
            case historyitem_PrintSettingsSetPageSetup:
            {
                this.pageSetup = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PrintSettingsSetHeaderFooter:
            case historyitem_PrintSettingsSetPageMargins:
            case historyitem_PrintSettingsSetPageSetup:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PrintSettingsSetHeaderFooter:
            {
                this.headerFooter = readObject(r);
                break;
            }
            case historyitem_PrintSettingsSetPageMargins:
            {
                this.pageMargins = readObject(r);
                break;
            }
            case historyitem_PrintSettingsSetPageSetup:
            {
                this.pageSetup = readObject(r);
                break;
            }
        }
    }
};


function CHeaderFooterChart()
{
    this.alignWithMargins = null;
    this.differentFirst   = null;
    this.differentOddEven = null;
    this.evenFooter       = null;
    this.evenHeader       = null;
    this.firstFooter      = null;
    this.firstHeader      = null;
    this.oddFooter        = null;
    this.oddHeader        = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CHeaderFooterChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    createDuplicate : function()
    {
        // TODO: Проверить работу данной функции        
        var oHFC = new CHeaderFooterChart();

        oHFC.alignWithMargins = this.alignWithMargins;
        oHFC.differentFirst   = this.differentFirst;
        oHFC.differentOddEven = this.differentOddEven;

        if ( this.evenFooter )
            oHFC.evenFooter = this.evenFooter.createDuplicate();

        if ( this.evenHeader )
            oHFC.evenHeader = this.evenHeader.createDuplicate();

        if ( this.firstFooter )
            oHFC.firstFooter = this.firstFooter.createDuplicate();

        if ( this.firstHeader )
            oHFC.firstHeader = this.firstHeader.createDuplicate();

        if ( this.oddFooter )
            oHFC.oddFooter = this.oddFooter.createDuplicate();

        if ( this.oddHeader )
            oHFC.oddHeader = this.oddHeader.createDuplicate();

        return oHFC;
    },


    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_HeaderFooterChart;
    },


    setAlignWithMargins: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetAlignWithMargins, oldPr:this.alignWithMargins, newPr: pr});
        this.alignWithMargins = pr;
    },
    setDifferentFirst: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetDifferentFirst, oldPr:this.differentFirst, newPr: pr});
        this.differentFirst = pr;
    },
    setDifferentOddEven: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetDifferentOddEven, oldPr:this.differentOddEven, newPr: pr});
        this.differentOddEven = pr;
    },
    setEvenFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetEvenFooter, oldPr:this.evenFooter, newPr: pr});
        this.evenFooter = pr;
    },
    setEvenHeader: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetEvenHeader, oldPr:this.evenHeader, newPr: pr});
        this.evenHeader = pr;
    },
    setFirstFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetFirstFooter, oldPr:this.firstFooter, newPr: pr});
        this.firstFooter = pr;
    },
    setFirstHeader: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetFirstHeader, oldPr:this.firstHeader, newPr: pr});
        this.firstHeader = pr;
    },
    setOddFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetOddFooter, oldPr:this.oddFooter, newPr: pr});
        this.oddFooter = pr;
    },
    setOddHeader: function(pr)
    {
        History.Add(this, {Type: historyitem_HeaderFooterChartSetOddHeader, oldPr:this.oddHeader, newPr: pr});
        this.oddHeader = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_HeaderFooterChartSetAlignWithMargins:
            {
                this.alignWithMargins = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentFirst:
            {
                this.differentFirst = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentOddEven:
            {
                this.differentOddEven = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetEvenFooter:
            {
                this.evenFooter = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetEvenHeader:
            {
                this.evenHeader = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetFirstFooter:
            {
                this.firstFooter = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetFirstHeader:
            {
                this.firstHeader = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetOddFooter:
            {
                this.oddFooter = data.oldPr;
                break;
            }
            case historyitem_HeaderFooterChartSetOddHeader:
            {
                this.oddHeader = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_HeaderFooterChartSetAlignWithMargins:
            {
                this.alignWithMargins = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentFirst:
            {
                this.differentFirst = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentOddEven:
            {
                this.differentOddEven = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetEvenFooter:
            {
                this.evenFooter = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetEvenHeader:
            {
                this.evenHeader = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetFirstFooter:
            {
                this.firstFooter = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetFirstHeader:
            {
                this.firstHeader = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetOddFooter:
            {
                this.oddFooter = data.newPr;
                break;
            }
            case historyitem_HeaderFooterChartSetOddHeader:
            {
                this.oddHeader = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_HeaderFooterChartSetAlignWithMargins:
            case historyitem_HeaderFooterChartSetDifferentFirst:
            case historyitem_HeaderFooterChartSetDifferentOddEven:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_HeaderFooterChartSetEvenFooter:
            case historyitem_HeaderFooterChartSetEvenHeader:
            case historyitem_HeaderFooterChartSetFirstFooter:
            case historyitem_HeaderFooterChartSetFirstHeader:
            case historyitem_HeaderFooterChartSetOddFooter:
            case historyitem_HeaderFooterChartSetOddHeader:
            {
                writeString(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_HeaderFooterChartSetAlignWithMargins:
            {
                this.alignWithMargins = readBool(r);
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentFirst:
            {
                this.differentFirst = readBool(r);
                break;
            }
            case historyitem_HeaderFooterChartSetDifferentOddEven:
            {
                this.differentOddEven = readBool(r);
                break;
            }
            case historyitem_HeaderFooterChartSetEvenFooter:
            {
                this.evenFooter = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetEvenHeader:
            {
                this.evenHeader = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetFirstFooter:
            {
                this.firstFooter = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetFirstHeader:
            {
                this.firstHeader = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetOddFooter:
            {
                this.oddFooter = readString(r);
                break;
            }
            case historyitem_HeaderFooterChartSetOddHeader:
            {
                this.oddHeader = readString(r);
                break;
            }
        }
    }
};

function CPageMarginsChart()
{
    this.b      = null;
    this.footer = null;
    this.header = null;
    this.l      = null;
    this.r      = null;
    this.t      = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPageMarginsChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    createDuplicate : function()
    {
        var oPMC = new CPageMarginsChart();

        oPMC.b      = this.b;
        oPMC.footer = this.footer;
        oPMC.header = this.header;
        oPMC.l      = this.l;
        oPMC.r      = this.r;
        oPMC.t      = this.t;

        return oPMC;
    },

    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_PageMarginsChart;
    },

    setB: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetB, oldPr: this.b, newPr: pr});
        this.b = pr;
    },
    setFooter: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetFooter, oldPr: this.footer, newPr: pr});
        this.footer = pr;
    },
    setHeader: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetHeader, oldPr: this.header, newPr: pr});
        this.header = pr;
    },
    setL: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetL, oldPr: this.l, newPr: pr});
        this.l = pr;
    },
    setR: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetR, oldPr: this.r, newPr: pr});
        this.r = pr;
    },
    setT: function(pr)
    {
        History.Add(this, {Type: historyitem_PageMarginsSetT, oldPr: this.t, newPr: pr});
        this.t = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PageMarginsSetB:
            {
                this.b = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetFooter:
            {
                this.footer = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetHeader:
            {
                this.header = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetL:
            {
                this.l = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetR:
            {
                this.r = data.oldPr;
                break;
            }
            case historyitem_PageMarginsSetT:
            {
                this.t = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PageMarginsSetB:
            {
                this.b = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetFooter:
            {
                this.footer = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetHeader:
            {
                this.header = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetL:
            {
                this.l = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetR:
            {
                this.r = data.newPr;
                break;
            }
            case historyitem_PageMarginsSetT:
            {
                this.t = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PageMarginsSetB:
            case historyitem_PageMarginsSetFooter:
            case historyitem_PageMarginsSetHeader:
            case historyitem_PageMarginsSetL:
            case historyitem_PageMarginsSetR:
            case historyitem_PageMarginsSetT:
            {
                writeDouble(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PageMarginsSetB:
            {
                this.b = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetFooter:
            {
                this.footer = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetHeader:
            {
                this.header = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetL:
            {
                this.l = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetR:
            {
                this.r = readDouble(r);
                break;
            }
            case historyitem_PageMarginsSetT:
            {
                this.t = readDouble(r);
                break;
            }
        }
    }
};


var PAGE_SETUP_ORIENTATION_DEFAULT = 0;
var PAGE_SETUP_ORIENTATION_LANDSCAPE = 1;
var PAGE_SETUP_ORIENTATION_PORTRAIT = 2;
function CPageSetup()
{
    this.blackAndWhite     = null;
    this.copies            = null;
    this.draft             = null;
    this.firstPageNumber   = null;
    this.horizontalDpi     = null;
    this.orientation       = null;
    this.paperHeight       = null;
    this.paperSize         = null;
    this.paperWidth        = null;
    this.useFirstPageNumb  = null;
    this.verticalDpi       = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPageSetup.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    
    createDuplicate : function()
    {
        var oPS = new CPageSetup();
        
        oPS.blackAndWhite    = this.blackAndWhite;
        oPS.copies           = this.copies;
        oPS.draft            = this.draft;
        oPS.firstPageNumber  = this.firstPageNumber;
        oPS.horizontalDpi    = this.horizontalDpi;
        oPS.orientation      = this.orientation;
        oPS.paperHeight      = this.paperHeight;
        oPS.paperSize        = this.paperSize;
        oPS.paperWidth       = this.paperWidth;
        oPS.useFirstPageNumb = this.useFirstPageNumb;
        oPS.verticalDpi      = this.verticalDpi;
                
        return oPS;
    },


    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_PageSetup;
    },
    setBlackAndWhite: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetBlackAndWhite, oldPr: this.blackAndWhite, newPr: pr});
        this.blackAndWhite = pr;
    },
    setCopies: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetCopies, oldPr: this.copies, newPr: pr});
        this.copies = pr;
    },
    setDraft: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetDraft, oldPr: this.draft, newPr: pr});
        this.draft = pr;
    },
    setFirstPageNumber: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetFirstPageNumber, oldPr: this.firstPageNumber, newPr: pr});
        this.firstPageNumber = pr;
    },
    setHorizontalDpi: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetHorizontalDpi, oldPr: this.horizontalDpi, newPr: pr});
        this.horizontalDpi = pr;
    },
    setOrientation: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetOrientation, oldPr: this.orientation, newPr: pr});
        this.orientation = pr;
    },
    setPaperHeight: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetPaperHeight, oldPr: this.paperHeight, newPr: pr});
        this.paperHeight = pr;
    },
    setPaperSize: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetPaperSize, oldPr: this.paperSize, newPr: pr});
        this.paperSize = pr;
    },
    setPaperWidth: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetPaperWidth, oldPr: this.paperWidth, newPr: pr});
        this.paperWidth = pr;
    },
    setUseFirstPageNumb: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetUseFirstPageNumb, oldPr: this.useFirstPageNumb, newPr: pr});
        this.useFirstPageNumb = pr;
    },
    setVerticalDpi: function(pr)
    {
        History.Add(this, {Type: historyitem_PageSetupSetVerticalDpi, oldPr: this.verticalDpi, newPr: pr});
        this.verticalDpi = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PageSetupSetBlackAndWhite:
            {
                this.blackAndWhite = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetCopies:
            {
                this.copies = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetDraft:
            {
                this.draft = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetFirstPageNumber:
            {
                this.firstPageNumber = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetHorizontalDpi:
            {
                this.horizontalDpi = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetOrientation:
            {
                this.orientation = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetPaperHeight:
            {
                this.paperHeight = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetPaperSize:
            {
                this.paperSize = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetPaperWidth:
            {
                this.paperWidth = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetUseFirstPageNumb:
            {
                this.useFirstPageNumb = data.oldPr;
                break;
            }
            case historyitem_PageSetupSetVerticalDpi:
            {
                this.verticalDpi = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PageSetupSetBlackAndWhite:
            {
                this.blackAndWhite = data.newPr;
                break;
            }
            case historyitem_PageSetupSetCopies:
            {
                this.copies = data.newPr;
                break;
            }
            case historyitem_PageSetupSetDraft:
            {
                this.draft = data.newPr;
                break;
            }
            case historyitem_PageSetupSetFirstPageNumber:
            {
                this.firstPageNumber = data.newPr;
                break;
            }
            case historyitem_PageSetupSetHorizontalDpi:
            {
                this.horizontalDpi = data.newPr;
                break;
            }
            case historyitem_PageSetupSetOrientation:
            {
                this.orientation = data.newPr;
                break;
            }
            case historyitem_PageSetupSetPaperHeight:
            {
                this.paperHeight = data.newPr;
                break;
            }
            case historyitem_PageSetupSetPaperSize:
            {
                this.paperSize = data.newPr;
                break;
            }
            case historyitem_PageSetupSetPaperWidth:
            {
                this.paperWidth = data.newPr;
                break;
            }
            case historyitem_PageSetupSetUseFirstPageNumb:
            {
                this.useFirstPageNumb = data.newPr;
                break;
            }
            case historyitem_PageSetupSetVerticalDpi:
            {
                this.verticalDpi = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PageSetupSetBlackAndWhite:
            case historyitem_PageSetupSetDraft:
            case historyitem_PageSetupSetUseFirstPageNumb:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_PageSetupSetCopies:
            case historyitem_PageSetupSetFirstPageNumber:
            case historyitem_PageSetupSetHorizontalDpi:
            case historyitem_PageSetupSetOrientation:
            case historyitem_PageSetupSetPaperSize:
            case historyitem_PageSetupSetVerticalDpi:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_PageSetupSetPaperHeight:
            case historyitem_PageSetupSetPaperWidth:
            {
                writeDouble(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PageSetupSetBlackAndWhite:
            {
                this.blackAndWhite = readBool(r);
                break;
            }
            case historyitem_PageSetupSetCopies:
            {
                this.copies = readLong(r);
                break;
            }
            case historyitem_PageSetupSetDraft:
            {
                this.draft = readBool(r);
                break;
            }
            case historyitem_PageSetupSetFirstPageNumber:
            {
                this.firstPageNumber = readLong(r);
                break;
            }
            case historyitem_PageSetupSetHorizontalDpi:
            {
                this.horizontalDpi = readLong(r);
                break;
            }
            case historyitem_PageSetupSetOrientation:
            {
                this.orientation = readLong(r);
                break;
            }
            case historyitem_PageSetupSetPaperHeight:
            {
                this.paperHeight = readDouble(r);
                break;
            }
            case historyitem_PageSetupSetPaperSize:
            {
                this.paperSize = readLong(r);
                break;
            }
            case historyitem_PageSetupSetPaperWidth:
            {
                this.paperWidth = readDouble(r);
                break;
            }
            case historyitem_PageSetupSetUseFirstPageNumb:
            {
                this.useFirstPageNumb = readBool(r);
                break;
            }
            case historyitem_PageSetupSetVerticalDpi:
            {
                this.verticalDpi = readLong(r);
                break;
            }
        }
    }


};

function CreateLineChart(chartSeries, type)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    var disp_blanks_as;
    if(type === GROUPING_STANDARD)
    {
        disp_blanks_as = DISP_BLANKS_AS_GAP;
    }
    else
    {
        disp_blanks_as = DISP_BLANKS_AS_ZERO;
    }
    chart.setDispBlanksAs(disp_blanks_as);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CLineChart());

    var cat_ax = new CCatAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var line_chart = plot_area.charts[0];
    line_chart.setGrouping(type);
    line_chart.setVaryColors(false);
    line_chart.setMarker(true);
    line_chart.setSmooth(false);
    line_chart.addAxId(cat_ax);
    line_chart.addAxId(val_ax);
    plot_area.valAx.setCrosses(2);
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CLineSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setMarker(new CMarker());
        series.marker.setSymbol(SYMBOL_NONE);
        series.setSmooth(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }
        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setIdx(0);
            pt.setVal(asc_series[i].TxCache.Tx);
        }
        line_chart.addSer(series);
    }
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_OUT);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = "General";
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateBarChart(chartSeries, type)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CBarChart());




    var cat_ax = new CCatAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var bar_chart = plot_area.charts[0];
    bar_chart.setBarDir(BAR_DIR_COL);
    bar_chart.setGrouping(type);
    bar_chart.setVaryColors(false);
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CBarSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setInvertIfNegative(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }
        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setIdx(0);
            pt.setVal(asc_series[i].TxCache.Tx);
        }
        bar_chart.addSer(series);
    }
    bar_chart.setGapWidth(150);
    if(BAR_GROUPING_PERCENT_STACKED === type || BAR_GROUPING_STACKED === type)
        bar_chart.setOverlap(100);
    bar_chart.addAxId(cat_ax);
    bar_chart.addAxId(val_ax);
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === BAR_GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = "General";
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateHBarChart(chartSeries, type)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CBarChart());


    var cat_ax = new CCatAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var bar_chart = plot_area.charts[0];
    bar_chart.setBarDir(BAR_DIR_BAR);
    bar_chart.setGrouping(type);
    bar_chart.setVaryColors(false);
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CBarSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setInvertIfNegative(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }

        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setIdx(0);
            pt.setVal(asc_series[i].TxCache.Tx);
        }

        bar_chart.addSer(series);
    }
    //bar_chart.setDLbls(new CDLbls());
    //var d_lbls = bar_chart.dLbls;
    //d_lbls.setShowLegendKey(false);
    //d_lbls.setShowVal(true);
    bar_chart.setGapWidth(150);
    if(BAR_GROUPING_PERCENT_STACKED === type || BAR_GROUPING_STACKED === type)
        bar_chart.setOverlap(100);
    bar_chart.addAxId(cat_ax);
    bar_chart.addAxId(val_ax);
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_L);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_B);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    /*if(type === GROUPING_PERCENT_STACKED)
     {
     format_code = "0%";
     }
     else */
    {
        format_code = "General";
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateAreaChart(chartSeries, type)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_ZERO);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CAreaChart());



    var cat_ax = new CCatAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);


    var area_chart = plot_area.charts[0];
    area_chart.setGrouping(type);
    area_chart.setVaryColors(false);
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CAreaSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }

        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setIdx(0);
            pt.setVal(asc_series[i].TxCache.Tx);
        }

        area_chart.addSer(series);
    }
    //area_chart.setDLbls(new CDLbls());
    area_chart.addAxId(cat_ax);
    area_chart.addAxId(val_ax);
    //var d_lbls = area_chart.dLbls;
    //d_lbls.setShowLegendKey(false);
    //d_lbls.setShowVal(true);
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    cat_ax.scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_MID_CAT);
    var scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = "General";
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreatePieChart(chartSeries, bDoughnut)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setStyle(2);
    chart_space.setChart(new CChart());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(bDoughnut ? new CDoughnutChart() : new CPieChart());
    var pie_chart = plot_area.charts[0];
    pie_chart.setVaryColors(true);
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CPieSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }

        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setIdx(0);
            pt.setVal(asc_series[i].TxCache.Tx);
        }

        pie_chart.addSer(series);
    }
    //pie_chart.setDLbls(new CDLbls());
    //pie_chart.dLbls.setShowLegendKey(false);
    //pie_chart.dLbls.setShowVal(true);
    pie_chart.setFirstSliceAng(0);
    if(bDoughnut)
        pie_chart.setHoleSize(50);
    chart.setLegend(new CLegend());
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    chart_space.setPrintSettings(new CPrintSettings());
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateScatterChart(chartSeries)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setStyle(2);
    chart_space.setChart(new CChart());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CScatterChart());
    var scatter_chart = plot_area.charts[0];
    scatter_chart.setScatterStyle(SCATTER_STYLE_MARKER);
    scatter_chart.setVaryColors(false);



    var cat_ax = new CValAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);


    var first_series = asc_series.length > 1 ? asc_series[0] : null;
    var start_index = asc_series.length > 1 ? 1 : 0;
    var minus = start_index === 1 ? 1 : 0;
    for(var i = start_index; i < asc_series.length; ++i)
    {
        var series = new CScatterSeries();
        series.setIdx(i - minus);
        series.setOrder(i - minus);
        if(first_series)
        {
            series.setXVal(new CXVal());
            var x_val = series.xVal;
            x_val.setNumRef(new CNumRef());
            var num_ref = x_val.numRef;
            num_ref.setF(first_series.Val.Formula);
            num_ref.setNumCache(new CNumLit());
            var num_cache = num_ref.numCache;
            num_cache.setPtCount(first_series.Val.NumCache.length);
            for(var j = 0; j < first_series.Val.NumCache.length; ++j)
            {
                var pt = new CNumericPoint();
                pt.setIdx(j);
                pt.setFormatCode(first_series.Val.NumCache[j].numFormatStr);
                pt.setVal(first_series.Val.NumCache[j].val);
                num_cache.addPt(pt);
            }
        }
        series.setYVal(new CYVal());
        var y_val = series.yVal;
        y_val.setNumRef(new CNumRef());
        var num_ref = y_val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }
        //if(parsedHeaders.bTop)
        //{
        //    series.setCat(new CCat());
        //    var cat = series.cat;
        //    cat.setStrRef(new CStrRef());
        //    var str_ref = cat.strRef;
        //    str_ref.setF(asc_series[i].Cat.Formula);
        //    str_ref.setStrCache(new CStrCache());
        //    var str_cache = str_ref.strCache;
        //    var cat_num_cache = asc_series[i].Cat.NumCache;
        //    str_cache.setPtCount(cat_num_cache.length);
        //    for(var j= 0; j < cat_num_cache.length; ++j)
        //    {
        //        var string_pt = new CStringPoint();
        //        string_pt.setIdx(j);
        //        string_pt.setVal(cat_num_cache[j].val);
        //        str_cache.addPt(string_pt);
        //    }
        //}
        //if(parsedHeaders.bLeft && asc_series[i].TxCache)
        //{
        //    series.setTx(new CTx());
        //    var tx= series.tx;
        //    tx.setStrRef(new CStrRef());
        //    var str_ref = tx.strRef;
        //    str_ref.setF(asc_series[i].TxCache.Formula);
        //    str_ref.setStrCache(new CStrCache());
        //    var str_cache = str_ref.strCache;
        //    str_cache.setPtCount(1);
        //    str_cache.addPt(new CStringPoint());
        //    var pt = str_cache.pt[0];
        //    pt.setVal(asc_series[i].TxCache.Tx);
        //}
        scatter_chart.addSer(series);
    }
    scatter_chart.addAxId(cat_ax);
    scatter_chart.addAxId(val_ax);
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    var scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code = "General";
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    chart.setLegend(new CLegend());
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    chart_space.setPrintSettings(new CPrintSettings());
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);





    return chart_space;
}

function CreateStockChart(chartSeries)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    var disp_blanks_as;
    disp_blanks_as = DISP_BLANKS_AS_GAP;
    chart.setDispBlanksAs(disp_blanks_as);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CStockChart());




    var cat_ax = new CCatAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);


    var line_chart = plot_area.charts[0];
    line_chart.addAxId(cat_ax);
    line_chart.addAxId(val_ax);
    line_chart.setHiLowLines(new CSpPr());
    line_chart.setUpDownBars(new CUpDownBars());
    line_chart.upDownBars.setGapWidth(150);
    line_chart.upDownBars.setUpBars(new CSpPr());
    line_chart.upDownBars.setDownBars(new CSpPr());
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CLineSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setMarker(new CMarker());
        series.marker.setSymbol(SYMBOL_NONE);
        series.setSmooth(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }

        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setIdx(0);
            pt.setVal(asc_series[i].TxCache.Tx);
        }

        line_chart.addSer(series);
    }
    //var d_lbls = line_chart.dLbls;
    //d_lbls.setShowLegendKey(false);
    //d_lbls.setShowVal(true);
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_OUT);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    format_code = "General";
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateDefaultAxises(valFormatCode)
{
    var cat_ax = new CCatAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);


    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    var num_fmt = val_ax.numFmt;
    num_fmt.setFormatCode(valFormatCode);
    num_fmt.setSourceLinked(true);
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(cat_ax);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    cat_ax.setCrossAx(val_ax);
    //cat_ax.setTitle(new CTitle());
    //val_ax.setTitle(new CTitle());
   // var title = val_ax.title;
   // title.setTxPr(new CTextBody());
   // title.txPr.setBodyPr(new CBodyPr());
   // title.txPr.bodyPr.setVert(nVertTTvert);
    return {valAx: val_ax, catAx: cat_ax};
}

function CreateScatterAxis()
{
    var cat_ax = new CValAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrossAx(val_ax);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    val_ax.setMajorTickMark(TICK_MARK_OUT);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(val_ax);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    var scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code = "General";
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    return {valAx: val_ax, catAx: cat_ax};
}

function CreateRadarChart(chartSeries)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new CPlotArea());
    chart.setLegend(new CLegend());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new CLayout());
    plot_area.addChart(new CRadarChart());


    var cat_ax = new CCatAx();
    var val_ax = new CValAx();
    cat_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var bar_chart = plot_area.charts[0];
    bar_chart.setVaryColors(false);
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new CBarSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setInvertIfNegative(false);
        series.setVal(new CYVal());
        var val = series.val;
        val.setNumRef(new CNumRef());
        var num_ref = val.numRef;
        num_ref.setF(asc_series[i].Val.Formula);
        num_ref.setNumCache(new CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(asc_series[i].Val.NumCache.length);
        for(var j = 0; j < asc_series[i].Val.NumCache.length; ++j)
        {
            var pt = new CNumericPoint();
            pt.setIdx(j);
            pt.setFormatCode(asc_series[i].Val.NumCache[j].numFormatStr);
            pt.setVal(asc_series[i].Val.NumCache[j].val);
            num_cache.addPt(pt);
        }
        if(parsedHeaders.bTop)
        {
            series.setCat(new CCat());
            var cat = series.cat;
            cat.setStrRef(new CStrRef());
            var str_ref = cat.strRef;
            str_ref.setF(asc_series[i].Cat.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            var cat_num_cache = asc_series[i].Cat.NumCache;
            str_cache.setPtCount(cat_num_cache.length);
            for(var j= 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
        if(parsedHeaders.bLeft && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            series.setTx(new CTx());
            var tx= series.tx;
            tx.setStrRef(new CStrRef());
            var str_ref = tx.strRef;
            str_ref.setF(asc_series[i].TxCache.Formula);
            str_ref.setStrCache(new CStrCache());
            var str_cache = str_ref.strCache;
            str_cache.setPtCount(1);
            str_cache.addPt(new CStringPoint());
            var pt = str_cache.pt[0];
            pt.setIdx(0);
            pt.setVal(asc_series[i].TxCache.Tx);
        }
        bar_chart.addSer(series);
    }
    //bar_chart.setDLbls(new CDLbls());
    bar_chart.addAxId(plot_area.catAx);
    bar_chart.addAxId(plot_area.valAx);
    //var d_lbls = bar_chart.dLbls;
    //d_lbls.setShowLegendKey(false);
    //d_lbls.setShowVal(true);
    cat_ax.setScaling(new CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AX_POS_B);
    cat_ax.setMajorTickMark(TICK_MARK_OUT);
    cat_ax.setMinorTickMark(TICK_MARK_NONE);
    cat_ax.setCrossAx(plot_area.valAx);
    cat_ax.setCrosses(CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    val_ax.setScaling(new CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AX_POS_L);
    val_ax.setMajorGridlines(new CSpPr());
    val_ax.setNumFmt(new CNumFmt());
    var num_fmt = val_ax.numFmt;
    var format_code = "General";
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    val_ax.setMajorTickMark(TICK_MARK_CROSS);
    val_ax.setMinorTickMark(TICK_MARK_NONE);
    val_ax.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrossAx(plot_area.catAx);
    val_ax.setCrosses(CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(ORIENTATION_MIN_MAX);
    var legend = chart.legend;
    legend.setLegendPos(LEGEND_POS_R);
    legend.setLayout(new CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function parseSeriesHeaders (ws, rangeBBox) {
	var cntLeft = 0, cntTop = 0;
	var headers = { bLeft: false, bTop: false };
	var i, cell, value;

	if (rangeBBox) {
		if (rangeBBox.c2 - rangeBBox.c1 > 0) {
			for (i = rangeBBox.r1 + 1; i <= rangeBBox.r2; i++) {
				cell = ws.getCell( new CellAddress(i, rangeBBox.c1, 0) );
				value = cell.getValue();
				if (!isNumber(value) && (value != ""))
					cntLeft++;
			}
			if ((cntLeft > 0) && (cntLeft >= rangeBBox.r2 - rangeBBox.r1))
				headers.bLeft = true;
		}

		if (rangeBBox.r2 - rangeBBox.r1 > 0) {
			for (i = rangeBBox.c1 + 1; i <= rangeBBox.c2; i++) {

				cell = ws.getCell( new CellAddress(rangeBBox.r1, i, 0) );
				value = cell.getValue();
				if (!isNumber(value) && (value != ""))
					cntTop++;
			}
			if ((cntTop > 0) && (cntTop >= rangeBBox.c2 - rangeBBox.c1))
				headers.bTop = true;
		}
	}
	else
		headers = { bLeft: true, bTop: true };

	return headers;
}

function getChartSeries (worksheet, options, catHeadersBBox, serHeadersBBox) {
	var api = window["Asc"]["editor"];
	var ws = null;
	var range = null;
	var result = parserHelp.parse3DRef(options.range);
	if (null !== result) {
		ws = worksheet.workbook.getWorksheetByName(result.sheet);
		if (ws)
			range = ws.getRange2(result.range);
	}

	if (null === range)
		return null;

	var bbox = range.getBBox0();
	var nameIndex = 1;

	var i, series = [];

	function getNumCache(c1, c2, r1, r2) {

		// (c1 == c2) || (r1 == r2)
		var cache = [], cell, item;

		if ( c1 == c2 ) {		// vertical cache
			for (var row = r1; row <= r2; row++) {
				cell = ws.getCell( new CellAddress(row, c1, 0) );

				item = {};
				item.numFormatStr = cell.getNumFormatStr();
				item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
				item.val = cell.getValue();
				item.isHidden = (ws._getCol(c1).hd === true) || (ws._getRow(row).hd === true);

				cache.push(item);
			}
		} else /*r1 == r2*/ {		// horizontal cache
			for (var col = c1; col <= c2; col++) {
				cell = ws.getCell( new CellAddress(r1, col, 0) );

				item = {};
				item.numFormatStr = cell.getNumFormatStr();
				item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
				item.val = cell.getValue();
				item.isHidden = (ws._getCol(col).hd === true) || (ws._getRow(r1).hd === true);

				cache.push(item);
			}
		}

		return cache;
	}

	var parsedHeaders = parseSeriesHeaders(ws, bbox);
	var data_bbox = {
		r1: parsedHeaders.bTop ? bbox.r1 + 1 : bbox.r1,
		r2: bbox.r2,
		c1: parsedHeaders.bLeft ? bbox.c1 + 1 : bbox.c1,
		c2: bbox.c2
	};

	var bIsScatter = (c_oAscChartTypeSettings.scatter <= options.type && options.type <= c_oAscChartTypeSettings.scatterSmoothMarker);
	var top_header_bbox, left_header_bbox, ser, startCell, endCell, formulaCell, seriaName, start, end, formula, numCache;
	if (!options.getInColumns()) {
		if(parsedHeaders.bTop)
			top_header_bbox = {r1: bbox.r1, c1: data_bbox.c1, r2: bbox.r1, c2: data_bbox.c2};
		else if(catHeadersBBox && catHeadersBBox.c1 === data_bbox.c1 && catHeadersBBox.c2 === data_bbox.c2 && catHeadersBBox.r1 === catHeadersBBox.r2)
			top_header_bbox = {r1: catHeadersBBox.r1, c1: catHeadersBBox.c1, r2: catHeadersBBox.r1, c2:catHeadersBBox.c2};

		if(parsedHeaders.bLeft)
			left_header_bbox = {r1: data_bbox.r1, r2: data_bbox.r2, c1: bbox.c1, c2: bbox.c1};
		else if(serHeadersBBox && serHeadersBBox.c1 === serHeadersBBox.c2 && serHeadersBBox.r1 === data_bbox.r1 && serHeadersBBox.r2 === data_bbox.r2)
			left_header_bbox = {r1: serHeadersBBox.r1, c1: serHeadersBBox.c1, r2: serHeadersBBox.r1, c2: serHeadersBBox.c2};

		for (i = data_bbox.r1; i <= data_bbox.r2; ++i) {
			ser = new asc_CChartSeria();
			startCell = new CellAddress(i, data_bbox.c1, 0);
			endCell = new CellAddress(i, data_bbox.c2, 0);

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
				formulaCell = new CellAddress( i, left_header_bbox.c1, 0 );
				ser.TxCache.Formula = parserHelp.get3DRef(ws.sName, formulaCell.getID());
			}
			// xVal

			if(top_header_bbox)
			{
				start = new CellAddress(top_header_bbox.r1, top_header_bbox.c1, 0);
				end = new CellAddress(top_header_bbox.r1, top_header_bbox.c2, 0);

				formula = parserHelp.get3DRef(ws.sName, start.getID() + ':' + end.getID());
				numCache = getNumCache(top_header_bbox.c1, top_header_bbox.c2, top_header_bbox.r1, top_header_bbox.r1 );

				if (bIsScatter)
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

			seriaName = left_header_bbox ? (ws.getCell(new CellAddress(i, left_header_bbox.c1, 0)).getValue()) : (api.chartTranslate.series + " " + nameIndex);
			ser.TxCache.Tx = seriaName;
			series.push(ser);
			nameIndex++;
		}
	} else {
		if(parsedHeaders.bTop)
			top_header_bbox = {r1: bbox.r1, c1: data_bbox.c1, r2: bbox.r1, c2: data_bbox.c2};
		else if(serHeadersBBox && serHeadersBBox.r1 === serHeadersBBox.r2 && serHeadersBBox.c1 === data_bbox.c1 && serHeadersBBox.c2 === data_bbox.c2)
			top_header_bbox = {r1: serHeadersBBox.r1, c1: serHeadersBBox.c1, r2: serHeadersBBox.r2, c2: serHeadersBBox.c2};

		if(parsedHeaders.bLeft)
			left_header_bbox = {r1: data_bbox.r1, c1: bbox.c1, r2: data_bbox.r2, c2: bbox.c1};
		else if(catHeadersBBox && catHeadersBBox.c1 === catHeadersBBox.c2 && catHeadersBBox.r1 === data_bbox.r1 && catHeadersBBox.r2 === data_bbox.r2)
			left_header_bbox = {r1: catHeadersBBox.r1, c1: catHeadersBBox.c1, r2: catHeadersBBox.r2, c2: catHeadersBBox.c2};


		for (i = data_bbox.c1; i <= data_bbox.c2; i++) {

			ser = new asc_CChartSeria();
			startCell = new CellAddress(data_bbox.r1, i, 0);
			endCell = new CellAddress(data_bbox.r2, i, 0);

			if (ws._getCol(i).hd === true)
				ser.isHidden = true;

			// Val
			if (startCell && endCell) {
				if (startCell.getID() == endCell.getID())
					ser.Val.Formula =  parserHelp.get3DRef(ws.sName, startCell.getID());
				else
					ser.Val.Formula = parserHelp.get3DRef(ws.sName, startCell.getID() + ':' + endCell.getID());
			}
			ser.Val.NumCache = getNumCache(i, i, data_bbox.r1, bbox.r2);


			if ( left_header_bbox )
			{
				start = new CellAddress(left_header_bbox.r1, left_header_bbox.c1, 0);
				end = new CellAddress(left_header_bbox.r2, left_header_bbox.c1, 0);

				formula = parserHelp.get3DRef(ws.sName, start.getID() + ':' + end.getID());
				numCache = getNumCache( left_header_bbox.c1, left_header_bbox.c1, left_header_bbox.r1, left_header_bbox.r2 );

				if (bIsScatter) {
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
				formulaCell = new CellAddress( top_header_bbox.r1, i, 0 );
				ser.TxCache.Formula = parserHelp.get3DRef(ws.sName, formulaCell.getID());
			}

			seriaName = top_header_bbox ? (ws.getCell(new CellAddress(top_header_bbox.r1, i, 0)).getValue()) : (api.chartTranslate.series + " " + nameIndex);
			ser.TxCache.Tx = seriaName;
			series.push(ser);
			nameIndex++;
		}
	}

	return {series: series, parsedHeaders: parsedHeaders};
}

