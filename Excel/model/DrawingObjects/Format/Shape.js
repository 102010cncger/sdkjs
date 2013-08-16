/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 6:09 PM
 * To change this template use File | Settings | File Templates.
 */

var g_mouse_event_type_down  = 0;
var g_mouse_event_type_move  = 1;
var g_mouse_event_type_up    = 2;
var g_mouse_event_type_wheel = 3;

var g_mouse_button_left     = 0;
var g_mouse_button_center   = 1;
var g_mouse_button_right    = 2;

var g_o_event_map =
{
    "mousedown": g_mouse_event_type_down,
    "mousemove": g_mouse_event_type_move,
    "mouseup": g_mouse_event_type_up

};
function CMouseEventHandler()
{
    this.X          = 0;                            // ������� ������� X
    this.Y          = 0;                            // ������� ������� Y

    this.Button     = g_mouse_button_left;          // ������ ����
    this.Type       = g_mouse_event_type_move;      // ��� ������

    this.AltKey     = false;                        // ������ �� ������ alt
    this.CtrlKey    = false;                        // ������ �� ������ ctrl
    this.ShiftKey   = false;                        // ������ �� ������ shift

    this.Sender     = null;                         // �� ������ html �������� ������ �����

    this.LastClickTime  = -1;                       // ����� ���������� mousedown
    this.ClickCount     = 0;                        // ���������� ������

    this.WheelDelta = 0;

    // ���������� ����� ��� ���������� mousedown (��� mousemove)
    this.IsPressed  = false;                        // ���� �� ������ ������
    this.LastX      = 0;
    this.LastY      = 0;

    this.KoefPixToMM = 1;

    this.IsLocked       = false;
    this.IsLockedEvent  = false;

    this.buttonObject   = null;

    this.LockMouse = function()
    {
        if (!this.IsLocked)
        {
            this.IsLocked = true;

            if (window.captureEvents)
                window.captureEvents(Event.MOUSEDOWN | Event.MOUSEUP);

            /*
             var parent = window;
             while (true)
             {
             if (!parent)
             break;

             if (parent.captureEvents)
             parent.captureEvents(Event.MOUSEDOWN | Event.MOUSEUP);

             if (parent == parent.parent)
             break;

             parent = parent.parent;
             }
             */

            return true;
        }
        return false;
    };
    this.UnLockMouse = function()
    {
        if (this.IsLocked)
        {
            this.IsLocked = false;

            if (window.releaseEvents)
                window.releaseEvents(Event.MOUSEMOVE);

            /*
             var parent = window;
             while (true)
             {
             if (!parent)
             break;

             if (parent.releaseEvents)
             parent.releaseEvents(Event.MOUSEMOVE);

             if (parent == parent.parent)
             break;

             parent = parent.parent;
             }
             */

            return true;
        }
        return false;
    };

    this.fromJQueryEvent = function(e)
    {
        this.ClickCount = e.ClickCount;
        this.Type =  g_o_event_map[e.type];
        this.ShiftKey = e.shiftKey;
    };
}


function CShape(drawingBase, drawingObjects, legendEntry)
{
    this.drawingBase = drawingBase;
    this.drawingObjects = null;//drawingObjects;
    this.nvSpPr = null;
    this.spPr = new CSpPr();
    this.style = null;
    this.txBody = null;

    this.group = null;

    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateBrush: true,
        recalculatePen: true
    };

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
	this.mainGroup = null;
    this.transform = new CMatrix();
    this.invertTransform = null;
    this.transformText = new CMatrix();
    this.invertTransformText = null;
    this.cursorTypes = [];

    this.brush  = null;
    this.pen = null;

    this.selected = false;
    this.legendEntry = legendEntry;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if(isRealObject(drawingObjects))
        this.setDrawingObjects(drawingObjects);
}


CShape.prototype =
{

    Get_Id:  function()
    {
        return this.Id;
    },
    getObjectType: function()
    {
        return CLASS_TYPE_SHAPE;
    },

    isShape: function()
    {
        return true;
    },

    isGroup: function()
    {
        return false;
    },

    isImage: function()
    {
        return false;
    },

    isChart: function()
    {
        return false;
    },

    isSimpleObject: function()
    {
        return true;
    },

    OnContentRecalculate: function()
    {
        this.calculateContent();
        this.calculateTransformTextMatrix();
    },

    deleteDrawingBase: function()
    {
        var position = this.drawingObjects.deleteDrawingBase(this.Get_Id());
        if(isRealNumber(position))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_DeleteDrawingBase, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(position, null)), null);
        }
        return position;
    },

    addToDrawingObjects: function(pos)
    {
        var position = this.drawingObjects.addGraphicObject(this, pos);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_To_Drawing_Objects, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(position, null)), null);
    },

    setCellFontName: function (fontName) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();
            this.drawingObjects.showDrawingObjects();
        }
    },

    setCellFontSize: function (fontSize) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontSize(fontSize);
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();
            this.drawingObjects.showDrawingObjects();
        }
    },

    setCellBold: function (isBold) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_Bold(isBold);
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();
            this.drawingObjects.showDrawingObjects();
        }
    },

    setCellItalic: function (isItalic) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_Italic(isItalic);
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();
            this.drawingObjects.showDrawingObjects();
        }
    },

    setCellUnderline: function (isUnderline) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_Underline(isUnderline);
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();

        }
    },

    setCellStrikeout: function (isStrikeout) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_Strikeout(isStrikeout);
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();

        }
    },

    setCellSubscript: function (isSubscript) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_VertAlign(isSubscript ? vertalign_SubScript : vertalign_Baseline);
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();

        }
    },

    setCellSuperscript: function (isSuperscript) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_VertAlign(isSuperscript ? vertalign_SuperScript : vertalign_Baseline);
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();

        }
    },

    setCellAlign: function (align) {
        if(isRealObject(this.txBody))
        {
            var align_num = null;
            switch(align)
            {
                case "left":
                {
                    align_num = align_Left;
                    break;
                }
                case "right":
                {
                    align_num = align_Right;
                    break;
                }
                case "center":
                {
                    align_num = align_Center;
                    break;
                }

                case "justify":
                {
                    align_num = align_Justify;
                    break;
                }

            }
            if(isRealNumber(align_num))
            {
                this.txBody.content.Set_ParagraphAlign(align_num);
                //this.calculateTransformTextMatrix();

            }
        }
    },



    setCellVertAlign: function (align) {
        if(isRealObject(this.txBody))
        {
            this.txBody.setVerticalAlign(align);
            this.calculateTransformTextMatrix();
        }
    },

    setPaddings: function (paddings) {
        if(isRealObject(this.txBody))
        {
            this.txBody.setPaddings(paddings);
            this.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },

    setCellTextWrap: function (isWrapped) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();

        }
    },

    setCellTextShrink: function (isShrinked) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();

        }
    },

    setCellTextColor: function (color) {
        if(isRealObject(this.txBody))
        {
            var unifill = new CUniFill();
            unifill.setFill(new CSolidFill());
            unifill.fill.setColor(CorrectUniColor(color, null));
            var text_pr = new ParaTextPr();
            text_pr.SetUniFill(unifill);
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();

        }

    },

    setCellBackgroundColor: function (color)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateBrushUndo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        var unifill = new CUniFill();
        unifill.setFill(new CSolidFill());
        unifill.fill.setColor(CorrectUniColor(color, null));
        this.setUniFill(unifill);
        this.recalculateBrush();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateBrushRedo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },


    setCellAngle: function (angle) {
        if(isRealObject(this.txBody))
        {
            this.txBody.setVert(angle);
            this.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },

    setCellStyle: function (name) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();

        }
    },


    setCellAllFontName: function (fontName) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();
        }
    },

    setCellAllFontSize: function (fontSize) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontSize(fontSize);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();

        }
    },

    setCellAllBold: function (isBold) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_Bold(isBold);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();

        }
    },

    setCellAllItalic: function (isItalic) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_Italic(isItalic);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();

        }
    },

    setCellAllUnderline: function (isUnderline) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_Underline(isUnderline);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();

        }
    },

    setCellAllStrikeout: function (isStrikeout) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_Strikeout(isStrikeout);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();

        }
    },

    setCellAllSubscript: function (isSubscript) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_VertAlign(isSubscript ? vertalign_SubScript : vertalign_Baseline);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();

        }
    },

    setCellAllSuperscript: function (isSuperscript) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_VertAlign(isSubscript ? vertalign_SuperScript : vertalign_Baseline);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();
        }
    },

    setCellAllAlign: function (align) {
        if(isRealObject(this.txBody))
        {
            var align_num = null;
            switch(align)
            {
                case "left":
                {
                    align_num = align_Left;
                    break;
                }
                case "right":
                {
                    align_num = align_Right;
                    break;
                }
                case "center":
                {
                    align_num = align_Center;
                    break;
                }

                case "justify":
                {
                    align_num = align_Justify;
                    break;
                }

            }
            if(isRealNumber(align_num))
            {
                this.txBody.content.Set_ApplyToAll(true);
                this.txBody.content.Set_ParagraphAlign(align_num);
                this.txBody.content.Set_ApplyToAll(false);
                this.calculateContent();
                this.calculateTransformTextMatrix();
            }
        }
    },



    setCellAllVertAlign: function (align) {
        if(isRealObject(this.txBody))
        {
            this.txBody.setVerticalAlign(align);
            this.calculateTransformTextMatrix();
        }
    },

    setCellAllTextWrap: function (isWrapped) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();
        }
    },

    setCellAllTextShrink: function (isShrinked) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();
        }
    },

    setCellAllTextColor: function (color) {
        if(isRealObject(this.txBody))
        {
            var unifill = new CUniFill();
            unifill.setFill(new CSolidFill());
            unifill.fill.setColor(CorrectUniColor(color, null));
            var text_pr = new ParaTextPr();
            text_pr.SetUniFill(unifill);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.calculateTransformTextMatrix();
        }

    },

    setCellAllBackgroundColor: function (color) {

        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateBrushUndo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        var unifill = new CUniFill();
        unifill.setFill(new CSolidFill());
        unifill.fill.setColor(CorrectUniColor(color, null));
        this.setUniFill(unifill);
        this.recalculateBrush();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateBrushRedo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));

    },


    setCellAllAngle: function (angle) {
        if(isRealObject(this.txBody))
        {
            this.txBody.setVert(angle);
            this.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },

    setCellAllStyle: function (name) {
        if(isRealObject(this.txBody))
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();
        }
    },

    // Увеличение размера шрифта
    increaseFontSize: function () {
        if(isRealObject(this.txBody))
        {
            this.txBody.content.Paragraph_IncDecFontSize(true);
            this.txBody.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },

    // Уменьшение размера шрифта
    decreaseFontSize: function () {
        if(isRealObject(this.txBody))
        {
            this.txBody.content.Paragraph_IncDecFontSize(false);
            this.txBody.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },


    increaseAllFontSize: function () {
        if(isRealObject(this.txBody))
        {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Paragraph_IncDecFontSize(true);
            this.txBody.content.Set_ApplyToAll(false);
            this.txBody.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },

    // Уменьшение размера шрифта
    decreaseAllFontSize: function () {
        if(isRealObject(this.txBody))
        {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Paragraph_IncDecFontSize(false);
            this.txBody.content.Set_ApplyToAll(false);
            this.txBody.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },

    insertHyperlink: function (options) {
        if(typeof this.curState.insertHyperlink === "function")
        {
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({Name: fontName, Index: -1});
            this.txBody.paragraphAdd(text_pr);
            this.calculateTransformTextMatrix();
        }
    },


    initDefault: function(x, y, extX, extY, flipH, flipV, presetGeom)
    {
        this.setXfrmObject(new CXfrm());
        this.setPosition(x, y);
        this.setExtents(extX, extY);
        this.setFlips(flipH, flipV);
        this.setPresetGeometry(presetGeom);
        this.setDefaultStyle();
        this.recalculate();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterInit, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },

    setXfrmObject: function(xfrm)
    {
        var oldId = isRealObject(this.spPr.xfrm) ? this.spPr.xfrm.Get_Id() : null;
        var newId = isRealObject(xfrm) ? xfrm.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetXfrm, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.spPr.xfrm = xfrm;
    },


    recalculateColors: function()
    {
        this.recalculatePen();
        this.recalculateBrush();
    },

    initDefaultTextRect: function(x, y, extX, extY, flipH, flipV)
    {
        this.setXfrmObject(new CXfrm());
        this.setPosition(x, y);
        this.setExtents(extX, extY);
        this.setFlips(flipH, flipV);
        this.setPresetGeometry("rect");
        this.setDefaultTextRectStyle();
        var uni_fill = new CUniFill();
        uni_fill.setFill(new CSolidFill());
        uni_fill.fill.setColor(new CUniColor());
        uni_fill.fill.color.setColor(new CSchemeColor());
        uni_fill.fill.color.color.setColorId(12);
        this.setUniFill(uni_fill);

        var ln = new CLn();
        ln.setW(6350);
        ln.setFill(new CUniFill());
        ln.Fill.setFill(new CSolidFill());
        ln.Fill.fill.setColor(new CUniColor());
        ln.Fill.fill.color.setColor(new CPrstColor());
        ln.Fill.fill.color.color.setColorId("black");
        this.setUniLine(ln);
        this.addTextBody(new CTextBody(this));

        this.recalculate();
        this.txBody.calculateContent();
        this.calculateTransformTextMatrix();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterInit, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },

    setDefaultStyle: function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetDefaultStyle, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        this.style = CreateDefaultShapeStyle();
    },

    setDefaultTextRectStyle: function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetDefaultTextRectStyle, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        this.style = CreateDefaultTextRectStyle();
    },

    setUniFill: function(unifill)
    {
        var oldValue = isRealObject(this.spPr.Fill) ? this.spPr.Fill.Get_Id() : null;
        var newValue = isRealObject(unifill) ? unifill.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetUniFill, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.spPr.Fill = unifill;
    },

    setUniLine: function(ln)
    {
        var oldValue = isRealObject(this.spPr.ln) ? this.spPr.ln.Get_Id() : null;
        var newValue = isRealObject(ln) ? ln.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetUniLine, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.spPr.ln = ln;
    },

    setDrawingObjects: function(drawingObjects)
    {
        var newValue = isRealObject(drawingObjects) ? drawingObjects.getWorksheet().model.getId() : null;
        var oldValue = isRealObject(this.drawingObjects) ? this.drawingObjects.getWorksheet().model.getId() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetDrawingObjects, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.drawingObjects = drawingObjects;

    },

    setGroup: function(group)
    {
        var oldId = isRealObject(this.group) ? this.group.Get_Id() : null;
        var newId = isRealObject(group) ? group.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetGroup, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.group = group;
    },

    getStyles: function(level)
    {
        var styles = new CStyles();
        if(!isRealObject(this.legendEntry))
        {
            var ref_style = new CStyle("ref_style", styles.Default.Paragraph, null, styletype_Paragraph);
            if(isRealObject(this.style) && isRealObject(this.style.fontRef))
            {
                switch(this.style.fontRef.idx)
                {
                    case fntStyleInd_major:
                    {
                        ref_style.TextPr.themeFont = "+mj-lt";
                        break;
                    }
                    case fntStyleInd_minor:
                    {
                        ref_style.TextPr.themeFont = "+mj-lt";
                        break;
                    }
                }

                if(isRealObject(this.style.fontRef.Color) && isRealObject(this.style.fontRef.Color.color))
                {
                    var unifill = new CUniFill();
                    unifill.fill = new CSolidFill();
                    unifill.fill.color = this.style.fontRef.Color.createDuplicate();
                    ref_style.TextPr.unifill = unifill;
                }
            }
            styles.Style[styles.Id] = ref_style;
            ++styles.Id;
        }
        else
        {

        }
        return styles;
    },

    setDrawingBase: function(drawingBase)
    {
        this.drawingBase = drawingBase;
    },

    recalculate: function()
    {
        if(this.recalcInfo.recalculateTransform)
		{
            this.recalculateTransform();
			this.recalcInfo.recalculateTransform = false;
		}
        if(this.recalcInfo.recalculateBrush)
		{
            this.recalculateBrush();
			this.recalcInfo.recalculateBrush = false;
		}
		if(this.recalcInfo.recalculatePen)
		{
            this.recalculatePen();
			this.recalcInfo.recalculatePen = false;
		}
		if(this.recalcInfo.recalculateGeometry)
		{
			if(this.spPr.geometry)
			{
				this.spPr.geometry.Recalculate(this.extX, this.extY);
			}
		}
    },

	calculateFill: function()
    {
		var api = window["Asc"]["editor"];
        var theme = api.wbModel.theme;
        var brush;
        var colorMap = api.wbModel.clrSchemeMap.color_map;
        var RGBA = {R: 0, G: 0, B: 0, A: 255};
        if (colorMap == null)
            colorMap = GenerateDefaultColorMap().color_map;
        if (theme && this.style != null && this.style.fillRef != null)
        {
            brush = theme.getFillStyle(this.style.fillRef.idx);
            this.style.fillRef.Color.Calculate(theme, colorMap, {R:0, G:0, B:0, A:255});
            RGBA = this.style.fillRef.Color.RGBA;

            if (this.style.fillRef.Color.color != null)
            {
                if (brush.fill != null && (brush.fill.type == FILL_TYPE_SOLID || brush.fill.type == FILL_TYPE_GRAD))
                {
                    brush.fill.color = this.style.fillRef.Color.createDuplicate();
                }
            }
        }
        else
        {
            brush = new CUniFill();
        }


        brush.merge(this.spPr.Fill);
        this.brush = brush;
        this.brush.calculate(theme, colorMap, RGBA);
    },
	
	calculateLine: function()
    {
		var api = window["Asc"]["editor"];
        var _calculated_line;
        var _theme = api.wbModel.theme;
        var colorMap = api.wbModel.clrSchemeMap.color_map;
        if (colorMap == null)
            colorMap = GenerateDefaultColorMap().color_map;
        var RGBA = {R: 0, G: 0, B: 0, A: 255};
        if(_theme !== null && typeof _theme === "object" && typeof _theme.getLnStyle === "function"
            && this.style !== null && typeof  this.style === "object"
            && this.style.lnRef !== null && typeof this.style.lnRef === "object" && typeof  this.style.lnRef.idx === "number"
            && this.style.lnRef.Color !== null && typeof  this.style.lnRef.Color.Calculate === "function")
        {
            _calculated_line = _theme.getLnStyle(this.style.lnRef.idx);
            this.style.lnRef.Color.Calculate(_theme, colorMap, {R: 0 , G: 0, B: 0, A: 255});
            RGBA = this.style.lnRef.Color.RGBA;
        }
        else
        {
            _calculated_line = new CLn();
        }

        _calculated_line.merge(this.spPr.ln);

        if (_calculated_line.Fill!=null)
        {
            _calculated_line.Fill.calculate(_theme, colorMap, RGBA) ;
        }

        this.pen = _calculated_line;
    },
	
    setPosition: function(x, y)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setPosition(x, y, model_id);
    },

    updateDrawingBaseCoordinates: function()
    {
        if(isRealObject(this.drawingBase))
            this.drawingBase.setGraphicObjectCoords()
    },

    updateSelectionState: function(drawingDocument)
    {
        drawingDocument.UpdateTargetTransform(this.transformText);
        this.txBody.content.RecalculateCurPos();
        this.txBody.updateSelectionState(drawingDocument);
    },

    recalculateCurPos: function()
    {
        if(this.txBody)
            this.txBody.recalculateCurPos();
    },

    setExtents: function(extX, extY)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setExtents(extX, extY, model_id);
    },

    setFlips: function(flipH, flipV)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setFlips(flipH, flipV, model_id);
    },

    setRotate: function(rot)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setRotate(rot, model_id);
    },

    setPresetGeometry: function(presetGeom)
    {
        var oldId = isRealObject(this.spPr.geometry) ? this.spPr.geometry.Get_Id() : null;
        this.spPr.geometry = CreateGeometry(presetGeom);
        var newId = this.spPr.geometry.Get_Id();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetPresetGeometry, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));

        this.spPr.geometry.Init(5, 5);
    },

    setRecalculateAll: function()
    {
        this.recalcInfo =
        {
            recalculateTransform: true,
            recalculateBrush: true,
            recalculatePen: true
        };
    },

    setStyle: function(style)
    {
        this.style = style;
    },

    setFill: function(fill)
    {
        this.spPr.Fill = fill;
    },

    setLine: function(line)
    {
        this.spPr.ln = line;
    },

    setAdjustmentValue: function(ref1, value1, ref2, value2)
    {
        if(this.spPr.geometry)
        {
            var geometry = this.spPr.geometry;
            var model_id = this.drawingObjects.getWorksheet().model.getId();
            geometry.setGuideValue(ref1, value1, model_id);
            geometry.setGuideValue(ref2, value2, model_id);
            geometry.Recalculate(this.extX, this.extY);
        }
    },

	setXfrm: function(offsetX, offsetY, extX, extY, rot, flipH, flipV)
    {
        //var data = {Type: historyitem_SetXfrmShape};

        var _xfrm = this.spPr.xfrm;
        if(offsetX !== null)
        {
            //data.oldOffsetX = _xfrm.offX;
            //data.newOffsetX = offsetX;
            _xfrm.offX = offsetX;
        }

        if(offsetY !== null)
        {
            //data.oldOffsetY = _xfrm.offY;
            //data.newOffsetY = offsetY;
            _xfrm.offY = offsetY;
        }


        if(extX !== null)
        {
            //data.oldExtX = _xfrm.extX;
            //data.newExtX = extX;
            _xfrm.extX = extX;
        }

        if(extY !== null)
        {
            //data.oldExtY = _xfrm.extY;
            //data.newExtY = extY;
            _xfrm.extY = extY;
        }

        if(rot !== null)
        {
            //data.oldRot = _xfrm.rot == null ? 0 : _xfrm.rot;
            //data.newRot = rot;
            _xfrm.rot = rot;
        }

        if(flipH !== null)
        {
            //data.oldFlipH = _xfrm.flipH == null ? false : _xfrm.flipH;
            //data.newFlipH = flipH;
            _xfrm.flipH = flipH;
        }

        if(flipV !== null)
        {
            //data.oldFlipV = _xfrm.flipV == null ? false : _xfrm.flipV;
            //data.newFlipV = flipV;
            _xfrm.flipV = flipV;
        }

        //History.Add(this, data);
    },

    paragraphAdd: function(paraItem, bRecalculate)
    {

        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterParagraphAddUndo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        if(!isRealObject(this.txBody))
        {
            this.addTextBody(new CTextBody(this));
            this.txBody.calculateContent();
        }
        this.txBody.paragraphAdd(paraItem, bRecalculate);

        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterParagraphAddRedo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },

    addNewParagraph: function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterParagraphAddUndo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        this.txBody.addNewParagraph();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterParagraphAddRedo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },

    remove: function(direction, bOnlyText)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterParagraphAddUndo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        this.txBody.remove(direction, bOnlyText);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterParagraphAddRedo, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },

    calculateContent: function()
    {
        if(this.txBody)
            this.txBody.calculateContent();
    },

    calculateTransformTextMatrix: function()
    {
        if(this.txBody === null)
            return;
        this.transformText.Reset();
        var _text_transform = this.transformText;
        var _shape_transform = this.transform;
        var _body_pr = this.txBody.getBodyPr();
        var _content_height = this.txBody.getSummaryHeight();
        var _l, _t, _r, _b;

        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if(isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect))
        {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        }
        else
        {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = this.extX - _body_pr.rIns;
            _b = this.extY - _body_pr.bIns;
        }

        if(_l >= _r)
        {
            var _c = (_l + _r)*0.5;
            _l = _c - 0.01;
            _r = _c + 0.01;
        }

        if(_t >= _b)
        {
            _c = (_t + _b)*0.5;
            _t = _c - 0.01;
            _b = _c + 0.01;
        }

        _t_x_lt = _shape_transform.TransformPointX(_l, _t);
        _t_y_lt = _shape_transform.TransformPointY(_l, _t);

        _t_x_rt = _shape_transform.TransformPointX(_r, _t);
        _t_y_rt = _shape_transform.TransformPointY(_r, _t);

        _t_x_lb = _shape_transform.TransformPointX(_l, _b);
        _t_y_lb = _shape_transform.TransformPointY(_l, _b);

        _t_x_rb = _shape_transform.TransformPointX(_r, _b);
        _t_y_rb = _shape_transform.TransformPointY(_r, _b);

        var _dx_t, _dy_t;
        _dx_t = _t_x_rt - _t_x_lt;
        _dy_t = _t_y_rt - _t_y_lt;

        var _dx_lt_rb, _dy_lt_rb;
        _dx_lt_rb = _t_x_rb - _t_x_lt;
        _dy_lt_rb = _t_y_rb - _t_y_lt;

        var _vertical_shift;
        var _text_rect_height = _b - _t;
        var _text_rect_width = _r - _l;
        if(_body_pr.upright ===  false)
        {
            if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
            {
                if(_content_height < _text_rect_height)
                {
                    switch (_body_pr.anchor)
                    {
                        case 0 ://b
                        { // (Text Anchor Enum ( Bottom ))
                            _vertical_shift = _text_rect_height - _content_height;
                            break;
                        }
                        case 1 :    //ctr
                        {// (Text Anchor Enum ( Center ))
                            _vertical_shift = (_text_rect_height - _content_height)*0.5;
                            break;
                        }
                        case  2 : //dist
                        {// (Text Anchor Enum ( Distributed )) TODO: пока выравнивание  по центру. Переделать!
                            _vertical_shift = (_text_rect_height - _content_height)*0.5;
                            break;
                        }
                        case  3 ://just
                        {// (Text Anchor Enum ( Justified )) TODO: пока выравнивание  по центру. Переделать!
                            _vertical_shift = (_text_rect_height - _content_height)*0.5;
                            break;
                        }
                        case 4 ://t
                        {//Top
                            _vertical_shift = 0;
                            break;
                        }
                    }

                }
                else
                {
                    _vertical_shift = 0;

                    //_vertical_shift =  _text_rect_height - _content_height;
                    /*if(_body_pr.anchor === 0)
                     {
                     _vertical_shift =  _text_rect_height - _content_height;
                     }
                     else
                     {
                     _vertical_shift = 0;
                     } */
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                if(_dx_lt_rb*_dy_t - _dy_lt_rb*_dx_t <= 0)
                {
                    var alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                }
                else
                {
                    alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI-alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                }
            }
            else
            {
                if(_content_height < _text_rect_width)
                {
                    switch (_body_pr.anchor)
                    {
                        case 0 ://b
                        { // (Text Anchor Enum ( Bottom ))
                            _vertical_shift = _text_rect_width - _content_height;
                            break;
                        }
                        case 1 :    //ctr
                        {// (Text Anchor Enum ( Center ))
                            _vertical_shift = (_text_rect_width - _content_height)*0.5;
                            break;
                        }
                        case  2 : //dist
                        {// (Text Anchor Enum ( Distributed ))
                            _vertical_shift = (_text_rect_width - _content_height)*0.5;
                            break;
                        }
                        case  3 ://just
                        {// (Text Anchor Enum ( Justified ))
                            _vertical_shift = (_text_rect_width - _content_height)*0.5;
                            break;
                        }
                        case 4 ://t
                        {//Top
                            _vertical_shift = 0;
                            break;
                        }
                    }
                }
                else
                {
                    _vertical_shift = 0;
                    /*if(_body_pr.anchor === 0)
                     {
                     _vertical_shift =  _text_rect_width - _content_height;
                     }
                     else
                     {
                     _vertical_shift = 0;
                     }  */
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                var  _alpha;
                _alpha = Math.atan2(_dy_t, _dx_t);
                if(_body_pr.vert === nVertTTvert)
                {
                    if(_dx_lt_rb*_dy_t - _dy_lt_rb*_dx_t <= 0)
                    {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI*0.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                    }
                    else
                    {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI*0.5-_alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                    }
                }
                else
                {
                    if(_dx_lt_rb*_dy_t - _dy_lt_rb*_dx_t <= 0)
                    {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI*1.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lb, _t_y_lb);
                    }
                    else
                    {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI*0.5-_alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rb, _t_y_rb);
                    }
                }
            }
            if(isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect))
            {
                var rect = this.spPr.geometry.rect;
                this.clipRect = {x: rect.l, y: rect.t, w: rect.r - rect.l, h: rect.b - rect.t};
            }
            else
            {
                this.clipRect = {x: 0, y: 0, w: this.absExtX, h: this.absExtY};
            }
        }
        else
        {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();

            var _hc = this.absExtX*0.5;
            var _vc = this.absExtY*0.5;
            var _transformed_shape_xc = this.transform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.transform.TransformPointY(_hc, _vc);


            var _content_width, content_height2;
            if((_full_rotate >= 0 && _full_rotate < Math.PI*0.25)
                || (_full_rotate > 3*Math.PI*0.25 && _full_rotate < 5*Math.PI*0.25)
                || (_full_rotate > 7*Math.PI*0.25 && _full_rotate < 2*Math.PI))
            {
                if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
                else
                {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                }
            }
            else
            {
                if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;

                }
                else
                {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
            }

            if(_content_height < content_height2)
            {
                switch (_body_pr.anchor)
                {
                    case 0 ://b
                    { // (Text Anchor Enum ( Bottom ))
                        _vertical_shift = content_height2 - _content_height;
                        break;
                    }
                    case 1 :    //ctr
                    {// (Text Anchor Enum ( Center ))
                        _vertical_shift = (content_height2 - _content_height)*0.5;
                        break;
                    }
                    case  2 : //dist
                    {// (Text Anchor Enum ( Distributed ))
                        _vertical_shift = (content_height2 - _content_height)*0.5;
                        break;
                    }
                    case  3 ://just
                    {// (Text Anchor Enum ( Justified ))
                        _vertical_shift = (content_height2 - _content_height)*0.5;
                        break;
                    }
                    case 4 ://t
                    {//Top
                        _vertical_shift = 0;
                        break;
                    }
                }
            }
            else
            {
                _vertical_shift = 0;
                /*if(_body_pr.anchor === 0)
                 {
                 _vertical_shift =  content_height2 - _content_height;
                 }
                 else
                 {
                 _vertical_shift = 0;
                 } */
            }

            var _text_rect_xc = _l + (_r - _l)*0.5;
            var _text_rect_yc = _t + (_b - _t)*0.5;

            var _vx = _text_rect_xc - _hc;
            var _vy = _text_rect_yc - _vc;

            var _transformed_text_xc, _transformed_text_yc;
            if(!_full_flip.flipH)
            {
                _transformed_text_xc = _transformed_shape_xc + _vx;
            }
            else
            {
                _transformed_text_xc = _transformed_shape_xc - _vx;
            }

            if(!_full_flip.flipV)
            {
                _transformed_text_yc = _transformed_shape_yc + _vy;
            }
            else
            {
                _transformed_text_yc = _transformed_shape_yc - _vy;
            }

            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if(_body_pr.vert === nVertTTvert)
            {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width*0.5, - content_height2*0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI*0.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width*0.5,  content_height2*0.5);

            }
            if(_body_pr.vert === nVertTTvert270)
            {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width*0.5, - content_height2*0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI*1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width*0.5,  content_height2*0.5);
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, _transformed_text_xc - _content_width*0.5,  _transformed_text_yc - content_height2*0.5);

            var body_pr = this.bodyPr;
            var l_ins = typeof body_pr.lIns === "number" ? body_pr.lIns : 2.54;
            var t_ins = typeof body_pr.tIns === "number" ? body_pr.tIns : 1.27;
            var r_ins = typeof body_pr.rIns === "number" ? body_pr.rIns : 2.54;
            var b_ins = typeof body_pr.bIns === "number" ? body_pr.bIns : 1.27;
            this.clipRect = {
                x: -l_ins,
                y: -_vertical_shift - t_ins,
                w: this.contentWidth + (r_ins + l_ins),
                h: this.contentHeight + (b_ins + t_ins)
            };
        }
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
    },

	/*calculateAfterResize: function()
    {
        if(this.spPr.geometry !== null)
            this.spPr.geometry.Recalculate(this.absExtX, this.absExtY);
        this.calculateTransformMatrix();
        this.calculateContent();
        this.calculateTransformTextMatrix();
        this.calculateLeftTopPoint();
    },
	
	calculateLeftTopPoint: function()
    {
        var _horizontal_center = this.extX * 0.5;
        var _vertical_enter = this.extY * 0.5;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        this.absXLT = -_horizontal_center*_cos + _vertical_enter*_sin +this.absOffsetX + _horizontal_center;
        this.absYLT = -_horizontal_center*_sin - _vertical_enter*_cos +this.absOffsetY + _vertical_enter;
    }, */
	
	checkLine: function()
    {
        return (this.spPr.geometry && CheckLinePreset(this.spPr.geometry.preset));
    },

    addTextBody: function(textBody)
    {
        var oldId = isRealObject(this.txBody) ? this.txBody.Get_Id() : null;
        var newId = isRealObject(textBody) ? textBody.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddTextBody, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.txBody = textBody;
    },

    select: function(drawingObjectsController)
    {
        this.selected = true;
        var selected_objects;
        if(!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i] === this)
                break;
        }
        if(i === selected_objects.length)
            selected_objects.push(this);
    },

    deselect: function(drawingObjectsController)
    {
        this.selected = false;
        var selected_objects;
        if(!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i] === this)
            {
                selected_objects.splice(i, 1);
                break;
            }
        }
    },

    selectionSetStart: function(e, x, y)
    {
        var t_x, t_y;
        t_x = this.invertTransformText.TransformPointX(x, y);
        t_y = this.invertTransformText.TransformPointY(x, y);
        var event =  new CMouseEventHandler();
        event.fromJQueryEvent(e);
        this.txBody.selectionSetStart(e, t_x, t_y);
        this.txBody.content.RecalculateCurPos();
    },

    selectionSetEnd: function(e, x, y)
    {
        var t_x, t_y;
        t_x = this.invertTransformText.TransformPointX(x, y);
        t_y = this.invertTransformText.TransformPointY(x, y);
        var event =  new CMouseEventHandler();
        event.fromJQueryEvent(e);
        this.txBody.selectionSetEnd(e, t_x, t_y);
    },

	setAbsoluteTransform: function(offsetX, offsetY, extX, extY, rot, flipH, flipV, open)
    {

        if(offsetX != null)
        {
            this.absOffsetX = offsetX;
        }

        if(offsetY != null)
        {
            this.absOffsetY = offsetY;
        }


        if(extX != null)
        {
            this.extX = extX;
        }

        if(extY != null)
        {
            this.extY = extY;
        }
        /*if(extX != null || extY!=null)
        {
            if(this.spPr.geometry)
                this.spPr.geometry.Recalculate(this.absExtX, this.absExtY);
        }      */

        if(rot != null)
        {
            this.absRot = rot;
        }

        if(flipH != null)
        {
            this.absFlipH = flipH;
        }

        if(flipV != null)
        {
            this.absFlipV = flipV;
        }
        if(this.parent)
            this.parent.setAbsoluteTransform(offsetX, offsetY, extX, extY, rot, flipH, flipV, true);
        if(open !== false)
            this.calculateContent();
        this.recalculate(open);
    },
	
    recalculateTransform: function()
    {
        var xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        else
        {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx*xfrm.extX;
            this.extY = scale_scale_coefficients.cy*xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        if(isRealObject(this.spPr.geometry))
            this.spPr.geometry.Recalculate(this.extX, this.extY);
        this.transform.Reset();
        var hc, vc;
        hc = this.extX*0.5;
        vc = this.extY*0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);

        global_MatrixTransformer.RotateRadAppend(this.transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    },

    normalize: function()
    {
        var new_off_x, new_off_y, new_ext_x, new_ext_y;
        var xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
            new_off_x = xfrm.offX;
            new_off_y = xfrm.offY;
            new_ext_x = xfrm.extX;
            new_ext_y = xfrm.extY;
        }
        else
        {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            new_off_x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            new_off_y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            new_ext_x = scale_scale_coefficients.cx*xfrm.extX;
            new_ext_y = scale_scale_coefficients.cy*xfrm.extY;
        }
        this.setPosition(new_off_x, new_off_y);
        this.setExtents(new_ext_x, new_ext_y);
    },

    recalculateBrush: function()
    {
        var brush;
        var wb = this.drawingObjects.getWorkbook();

        var theme = wb.theme;
        var colorMap = GenerateDefaultColorMap().color_map;
        var RGBA = {R: 0, G: 0, B: 0, A: 255};
        if (theme && this.style != null && this.style.fillRef!=null)
        {
            brush = theme.getFillStyle(this.style.fillRef.idx);
            this.style.fillRef.Color.Calculate(theme, colorMap, {R:0, G:0, B:0, A:255});
            RGBA = this.style.fillRef.Color.RGBA;

            if (this.style.fillRef.Color.color != null)
            {
                if (brush.fill != null && (brush.fill.type == FILL_TYPE_SOLID || brush.fill.type == FILL_TYPE_GRAD))
                {
                    brush.fill.color = this.style.fillRef.Color.createDuplicate();
                }
            }
        }
        else
        {
            brush = new CUniFill();
        }

        brush.merge(this.spPr.Fill);
        this.brush = brush;
        this.brush.calculate(theme, colorMap, RGBA);
    },

    recalculatePen: function()
    {
        var _calculated_line;
        var _theme = this.drawingObjects.getWorkbook().theme;
        var colorMap = GenerateDefaultColorMap().color_map;
        var RGBA = {R: 0, G: 0, B: 0, A: 255};
        if(_theme !== null && typeof _theme === "object" && typeof _theme.getLnStyle === "function"
            && this.style !== null && typeof  this.style === "object"
            && this.style.lnRef !== null && typeof this.style.lnRef === "object" && typeof  this.style.lnRef.idx === "number"
            && this.style.lnRef.Color !== null && typeof  this.style.lnRef.Color.Calculate === "function")
        {
            _calculated_line = _theme.getLnStyle(this.style.lnRef.idx);
            this.style.lnRef.Color.Calculate(_theme, colorMap, {R: 0 , G: 0, B: 0, A: 255});
            RGBA = this.style.lnRef.Color.RGBA;
        }
        else
        {
            _calculated_line = new CLn();
        }

        _calculated_line.merge(this.spPr.ln);

        if(_calculated_line.Fill!=null)
        {
            _calculated_line.Fill.calculate(_theme, colorMap, RGBA) ;
        }

        this.pen = _calculated_line;
    },

    getColorMap: function()
    {
        return this.drawingObjects.controller.getColorMap();
    },

    getTheme: function()
    {
        return this.drawingObjects.getWorkbook().theme;
    },

    recalculateGeometry: function()
    {
        if(isRealObject(this.spPr.geometry))
        {
            this.spPr.geometry.Recalculate(this.extX, this.extY);
        }
    },

    draw: function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape(this, graphics);
        shape_drawer.draw(this.spPr.geometry);
        graphics.reset();
        graphics.SetIntegerGrid(true);
        if ( this.txBody )
        {
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.transformText);
            this.txBody.draw(graphics);
          /*  if (graphics.FreeFont !== undefined)
                graphics.FreeFont(); */


            graphics.reset();
            graphics.SetIntegerGrid(true);
        }
    },

    drawTextSelection: function()
    {
        if(isRealObject(this.txBody))
        {
            this.txBody.drawTextSelection();
        }
    },

    Selection_Is_TableBorderMove: function()
    {
        if(isRealObject(this.txBody) && isRealObject(this.txBody.content))
        {
            return this.txBody.content.Selection_Is_TableBorderMove();
        }
        return false;
    },

    check_bounds: function(checker)
    {
        if (this.spPr.geometry)
        {
            this.spPr.geometry.check_bounds(checker);
        }
        else
        {
            checker._s();
            checker._m(0, 0);
            checker._l(this.extX, 0);
            checker._l(this.extX, this.extY);
            checker._l(0, this.extY);
            checker._z();
            checker._e();
        }
    },

	calculateTransformMatrix: function()
    {
        var _transform = new CMatrix();

        var _horizontal_center = this.absExtX*0.5;
        var _vertical_center = this.absExtY*0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);

        if(this.absFlipH)
        {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if(this.absFlipV)
        {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }

        global_MatrixTransformer.RotateRadAppend(_transform, -this.absRot);

        global_MatrixTransformer.TranslateAppend(_transform, this.absOffsetX, this.absOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);

        if(this.mainGroup !== null)
        {
            global_MatrixTransformer.MultiplyAppend(_transform, this.mainGroup.getTransform());
        }
        this.transform = _transform;
        this.ownTransform = _transform.CreateDublicate();
    },

	calculateAfterResize: function()
    {
        if(this.spPr.geometry !== null)
            this.spPr.geometry.Recalculate(this.extX, this.extY);
        //this.calculateTransformMatrix();
        this.calculateContent();
        //this.calculateTransformTextMatrix();
        this.calculateLeftTopPoint();
    },
	
	calculateTransformMatrix: function()
    {
        var _transform = new CMatrix();

        var _horizontal_center = this.extX * 0.5;
        var _vertical_center = this.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);

        if(this.absFlipH)
        {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if(this.absFlipV)
        {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }

        global_MatrixTransformer.RotateRadAppend(_transform, -this.absRot);

        global_MatrixTransformer.TranslateAppend(_transform, this.absOffsetX, this.absOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);

        if(this.mainGroup !== null)
        {
            global_MatrixTransformer.MultiplyAppend(_transform, this.mainGroup.getTransform());
        }
        this.transform = _transform;
        this.ownTransform = _transform.CreateDublicate();
    },
	
	calculateLeftTopPoint: function()
    {
        var _horizontal_center = this.absExtX*0.5;
        var _vertical_enter = this.absExtY*0.5;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        this.absXLT = -_horizontal_center*_cos + _vertical_enter*_sin +this.absOffsetX + _horizontal_center;
        this.absYLT = -_horizontal_center*_sin - _vertical_enter*_cos +this.absOffsetY + _vertical_enter;
    },
	
    drawAdjustments: function(drawingDocument)
    {
        if(isRealObject(this.spPr.geometry))
        {
            this.spPr.geometry.drawAdjustments(drawingDocument, this.transform);
        }
    },

    getTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.transform;
    },

    getInvertTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.invertTransform;
    },

    getFullFlipH: function()
    {
        if(!isRealObject(this.group))
            return this.flipH;
        return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    },


    getFullFlipV: function()
    {
        if(!isRealObject(this.group))
            return this.flipV;
        return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    },

    getAspect: function(num)
    {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x/_tmp_y : _tmp_y/_tmp_x;
    },

    getFullRotate: function()
    {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    },

    getBoundsInGroup: function()
    {
        var r = this.rot;
        if((r >= 0 && r < Math.PI*0.25)
            || (r > 3*Math.PI*0.25 && r < 5*Math.PI*0.25)
            || (r > 7*Math.PI*0.25 && r < 2*Math.PI))
        {
            return {minX: this.x, minY: this.y, maxX: this.x + this.extX, maxY: this.y + this.extY};
        }
        else
        {
            var hc = this.extX*0.5;
            var vc = this.extY*0.5;
            var xc = this.x + hc;
            var yc = this.y + vc;
            return {minX: xc - vc, minY: yc - hc, maxX: xc + vc, maxY: yc + hc};
        }
    },

    getCardDirectionByNum: function(num)
    {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if(same_flip)
            return ((num - num_north) + CARD_DIRECTION_N + 8)%8;

        return (CARD_DIRECTION_N - (num - num_north)+ 8)%8;
    },

    getNumByCardDirection: function(cardDirection)
    {
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        var transform = this.getTransform();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);

        var north_number;
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                north_number = !full_flip_v ? 1 : 5;
                break;
            }
            case y3:
            {
                north_number = !full_flip_h ? 3 : 7;
                break;
            }
            case y5:
            {
                north_number = !full_flip_v ? 5 : 1;
                break;
            }
            default:
            {
                north_number = !full_flip_h ? 7 : 3;
                break;
            }
        }
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;

        if(same_flip)
            return (north_number + cardDirection)%8;
        return (north_number - cardDirection + 8)%8;
    },

    getResizeCoefficients: function(numHandle, x, y)
    {
        var cx, cy;
        cx= this.extX > 0 ? this.extX : 0.01;
        cy= this.extY > 0 ? this.extY : 0.01;

        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);

        switch(numHandle)
        {
            case 0:
                return {kd1: (cx-t_x)/cx, kd2: (cy-t_y)/cy};
            case 1:
                return {kd1: (cy-t_y)/cy, kd2: 0};
            case 2:
                return {kd1: (cy-t_y)/cy, kd2: t_x/cx};
            case 3:
                return {kd1: t_x/cx, kd2: 0};
            case 4:
                return {kd1: t_x/cx, kd2: t_y/cy};
            case 5:
                return {kd1: t_y/cy, kd2: 0};
            case 6:
                return {kd1: t_y/cy, kd2:(cx-t_x)/cx};
            case 7:
                return {kd1:(cx-t_x)/cx, kd2: 0};
        }
        return {kd1: 1, kd2: 1};
    },

	getPresetGeom: function()
    {
        if(this.spPr.geometry != null)
        {
            return this.spPr.geometry.preset;
        }
        else
        {
            return null;
        }
    },
	
	getFill: function()
    {
        return this.brush;
    },
	
	getStroke: function()
    {
        if(!isRealObject(this.pen))
            return null;
        return this.pen;
    },

    getPaddings: function()
    {
        if(isRealObject(this.txBody))
        {
            var body_pr = this.txBody.getBodyPr();
            var paddings = new asc_CPaddings();
            paddings.Top = body_pr.tIns;
            paddings.Left = body_pr.lIns;
            paddings.Right = body_pr.rIns;
            paddings.Bottom = body_pr.bIns;
            return paddings;
        }
        return null;
    },

    getParagraphParaPr: function()
    {
        if(this.txBody)
        {
            return this.txBody.content.Get_Paragraph_ParaPr();
        }
        return null;
    },

    getParagraphTextPr: function()
    {
        if(this.txBody)
        {
            return this.txBody.content.Get_Paragraph_TextPr();
        }
        return null;
    },

    getAllParagraphParaPr: function()
    {
        if(this.txBody)
        {
            this.txBody.content.Set_ApplyToAll(true);
            var paraPr = this.txBody.content.Get_Paragraph_ParaPr();
            this.txBody.content.Set_ApplyToAll(false);
            return paraPr;
        }
        return null;
    },

    getAllParagraphTextPr: function()
    {
        if(this.txBody)
        {
            this.txBody.content.Set_ApplyToAll(true);
            var paraPr = this.txBody.content.Get_Paragraph_TextPr();
            this.txBody.content.Set_ApplyToAll(false);
            return paraPr;
        }
        return null;
    },

	changeFill : function(ascFill)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateBrushUndo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(null, null)), null);

        this.setUniFill(CorrectUniFillEx(ascFill, this.spPr.Fill));
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateBrushRedo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(null, null)), null);

        //this.spPr.Fill = CorrectUniFillEx(ascFill, this.spPr.Fill);

       /* if(isRealObject(this.spPr.Fill) && isRealObject(this.spPr.Fill.fill) && this.spPr.Fill.fill.type === FILL_TYPE_BLIP)
        {
            editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(this.spPr.Fill.fill.RasterImageId);
        }  */
        //History.Add(this, historyObj);
        this.recalculateBrush();
    },

    changeLine : function(line)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateBrushUndo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(null, null)), null);
        this.setUniLine(CorrectUniStrokeEx(line, this.spPr.ln));
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateBrushRedo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(null, null)), null);
        this.recalculatePen();
    },

    changePresetGeometry: function(sPreset)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(null, null)), null);
        this.setPresetGeometry(sPreset);
        this.spPr.geometry.Recalculate(this.extX, this.extY);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(null, null)), null);

    },
	
	canChangeArrows : function()
    {
        if(this.spPr.geometry == null)
        {
            return false;
        }
        var _path_list = this.spPr.geometry.pathLst;
        var _path_index;
        var _path_command_index;
        var _path_command_arr;
        for(_path_index = 0; _path_index < _path_list.length; ++_path_index)
        {
            _path_command_arr = _path_list[_path_index].ArrPathCommandInfo;
            for(_path_command_index = 0; _path_command_index < _path_command_arr.length; ++ _path_command_index)
            {
                if(_path_command_arr[_path_command_index].id == 5)
                {
                    break;
                }
            }
            if(_path_command_index == _path_command_arr.length)
            {
                return true;
            }
        }
        return false;
    },

    getRotateAngle: function(x, y)
    {
        var transform = this.getTransform();
        var rotate_distance =  this.drawingObjects.convertMetric(TRACK_DISTANCE_ROTATE, 0, 3);
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        var xc_t = transform.TransformPointX(hc, vc);
        var yc_t = transform.TransformPointY(hc, vc);
        var rot_x_t = transform.TransformPointX(hc, - rotate_distance);
        var rot_y_t = transform.TransformPointY(hc, - rotate_distance);

        var invert_transform = this.getInvertTransform();
        var rel_x = invert_transform.TransformPointX(x, y);

        var v1_x, v1_y, v2_x, v2_y;
        v1_x = x - xc_t;
        v1_y = y - yc_t;

        v2_x = rot_x_t - xc_t;
        v2_y = rot_y_t - yc_t;

        var flip_h = this.getFullFlipH();
        var flip_v = this.getFullFlipV();
        var same_flip = flip_h && flip_v || !flip_h && !flip_v;
        var angle =  rel_x > this.extX*0.5 ? Math.atan2( Math.abs(v1_x*v2_y - v1_y*v2_x), v1_x*v2_x + v1_y*v2_y) : -Math.atan2( Math.abs(v1_x*v2_y - v1_y*v2_x), v1_x*v2_x + v1_y*v2_y);
        return same_flip ? angle : -angle;
    },


    getRectBounds: function()
    {
        var transform = this.getTransform();
        var w = this.extX;
        var h = this.extY;
        var rect_points = [{x:0, y:0}, {x: w, y: 0}, {x: w, y: h}, {x: 0, y: h}];
        var min_x, max_x, min_y, max_y;
        min_x = transform.TransformPointX(rect_points[0].x, rect_points[0].y);
        min_y = transform.TransformPointY(rect_points[0].x, rect_points[0].y);
        max_x = min_x;
        max_y = min_y;
        var cur_x, cur_y;
        for(var i = 1; i < 4; ++i)
        {
            cur_x = transform.TransformPointX(rect_points[i].x, rect_points[i].y);
            cur_y = transform.TransformPointY(rect_points[i].x, rect_points[i].y);
            if(cur_x < min_x)
                min_x = cur_x;
            if(cur_x > max_x)
                max_x = cur_x;

            if(cur_y < min_y)
                min_y = cur_y;
            if(cur_y > max_y)
                max_y = cur_y;
        }
        return {minX: min_x, maxX: max_x, minY: min_y, maxY: max_y};
    },

    getRectForGrouping: function()
    {

    },

    getFullOffset: function()
    {
        if(!isRealObject(this.group))
            return {offX: this.x, offY: this.y};
        var group_offset = this.group.getFullOffset();
        return {offX: this.x + group_offset.offX, offY: this.y + group_offset.offY};
    },

    transformPointRelativeShape: function(x, y)
    {

        var _horizontal_center = this.extX*0.5;
        var _vertical_enter = this.extY*0.5;
        var _sin = Math.sin(this.rot);
        var _cos = Math.cos(this.rot);


        var _temp_x = x - (-_horizontal_center*_cos + _vertical_enter*_sin +this.x + _horizontal_center);
        var _temp_y = y - (-_horizontal_center*_sin - _vertical_enter*_cos +this.y + _vertical_enter);

        var _relative_x = _temp_x*_cos + _temp_y*_sin;
        var _relative_y = -_temp_x*_sin + _temp_y*_cos;

        if(this.absFlipH)
            _relative_x = this.extX - _relative_x;

        if(this.absFlipV)
            _relative_y = this.extY - _relative_y;

        return {x: _relative_x, y: _relative_y};
    },

    hitToAdjustment: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitToAdj(t_x, t_y, this.drawingObjects.convertMetric(TRACK_CIRCLE_RADIUS, 0, 3));
        return {hit: false, adjPolarFlag: null, adjNum: null};
    },

    hitToHandles: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        var radius = this.drawingObjects.convertMetric(TRACK_CIRCLE_RADIUS, 0, 3);

        var sqr_x = t_x*t_y, sqr_y = t_y*t_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 0;

        var hc = this.extX*0.5;
        var dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 1;

        dist_x = t_x - this.extX;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 2;

        var vc = this.extY*0.5;
        var dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 3;

        dist_y = t_y - this.extY;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 4;

        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 5;

        dist_x = t_x;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 6;

        dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 7;

        var rotate_distance = this.drawingObjects.convertMetric(TRACK_DISTANCE_ROTATE, 0, 3);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y*dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 8;

        return -1;

    },

    hit: function(x, y)
    {
        return this.hitInInnerArea(x, y) || this.hitInPath(x, y) || this.hitInTextRect(x, y);
    },

    hitInPath: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInPath(this.drawingObjects.getCanvasContext(), x_t, y_t);
        return false;
    },

    hitInInnerArea: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInInnerArea(this.drawingObjects.getCanvasContext(), x_t, y_t);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },

    hitInTextRect: function(x, y)
    {
        if(isRealObject(this.txBody))
        {
            var t_x, t_y;
            t_x = this.invertTransformText.TransformPointX(x, y);
            t_y = this.invertTransformText.TransformPointY(x, y);
            return  t_x > 0 &&  t_x < this.txBody.contentWidth && t_y > 0 && t_y < this.txBody.contentHeight;
        }
        return false;
    },

    hitInBoundingRect: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);

        var _hit_context = this.drawingObjects.getCanvasContext();

        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY)||
            HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY)||
            HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0) /*||
            HitInLine(_hit_context, x_t, y_t, this.extX*0.5, 0, this.extX*0.5, -this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE))*/);
    },

    canRotate: function()
    {
        return true;
    },

    canResize: function()
    {
        return true;//TODO
    },

    canMove: function()
    {
        return true;//TODO
    },

    canGroup: function()
    {
        return true;//TODO
    },


    canChangeAdjustments: function()
    {
        return true;//TODO
    },

    createRotateTrack: function()
    {
        return new RotateTrackShapeImage(this);
    },

    createResizeTrack: function(cardDirection)
    {
        return new ResizeTrackShapeImage(this, cardDirection);
    },

    createMoveTrack: function()
    {
        return new MoveShapeImageTrack(this);
    },


    createRotateInGroupTrack: function()
    {
        return new RotateTrackShapeImageInGroup(this);
    },

    createResizeInGroupTrack: function(cardDirection)
    {
        return new ResizeTrackShapeImageInGroup(this, cardDirection);
    },

    createMoveInGroupTrack: function()
    {
        return new MoveShapeImageTrackInGroup(this);
    },

    copyFromOther: function(sp)
    {
        this.spPr.copyFromOther(sp.spPr);
        if(isRealObject(sp.style))
        {
            if(!isRealObject(this.style))
                this.setSyle(new CShapeStyle());
            this.style.copyFromOther(sp.style);
        }
    },

	Get_Props: function(OtherProps)
    {
		var Props = new Object();
        Props.Width  = this.extX;
        Props.Height = this.extY;

        if(!isRealObject(OtherProps))
            return Props;


        OtherProps.Width = OtherProps.Width === Props.Width ? Props.Width : undefined;
        OtherProps.Height = OtherProps.Height === Props.Height ? Props.Height : undefined;

		return OtherProps;
	},
	


    Undo: function(type, data)
    {
        switch (type)
        {

            case historyitem_AutoShapes_RecalculateAfterParagraphAddUndo:
            {
                if(isRealObject(this.txBody))
                {
                    this.txBody.calculateContent();
                    this.calculateTransformTextMatrix();
                }
                break;
            }
            case historyitem_AutoShapes_SetDefaultTextRectStyle:
            {
                this.style = null;
                break;
            }
            case historyitem_AutoShapes_SetPresetGeometry:
            {
                this.spPr.geometry = g_oTableId.Get_ById(data.oldValue);
                break;
            }

            case historyitem_AutoShapes_RecalculateTransformUndo:
            {
                this.recalculateTransform();
                this.calculateContent();
                this.calculateTransformTextMatrix();
                break;
            }
            case historyitem_AutoShapes_RecalculateGeometry_Undo:
            {
                if(isRealObject(this.spPr.geometry))
                    this.spPr.geometry.Recalculate(this.extX, this.extY);
                break;
            }
            case historyitem_AutoShapes_Add_To_Drawing_Objects:
            {
                this.drawingObjects.deleteDrawingBase(this.Id);
                break;
            }

            case historyitem_AutoShapes_DeleteDrawingBase:
            {
                this.drawingObjects.addGraphicObject(this, data.oldValue);
                break;
            }

            case historyitem_AutoShapes_SetGroup:
            {
                this.group = g_oTableId.Get_ById(data.oldValue);
                break;
            }
            case historyitem_AutoShapes_SetDefaultStyle:
            {
                this.style = null;
                break;
            }
            case historyitem_AutoShapes_SetUniFill:
            {
                this.spPr.Fill = g_oTableId.Get_ById(data.oldValue);
                break;
            }
            case historyitem_AutoShapes_SetUniLine:
            {
                this.spPr.ln = g_oTableId.Get_ById(data.oldValue);
                break;
            }
            case historyitem_AutoShapes_SetDrawingObjects:
            {
                if(data.oldValue !== null)
                {
                    var api = window["Asc"]["editor"];
                    if ( api.wb )
                    {
                        var ws = api.wb.getWorksheetById(data.oldValue);
                        this.drawingObjects = ws.objectRender;
                    }
                }
                break;
            }

            case historyitem_AutoShapes_SetXfrm:
            {
                this.spPr.xfrm = g_oTableId.Get_ById(data.oldValue);
                break;
            }
            case historyitem_AutoShapes_AddTextBody:
            {
                this.txBody = g_oTableId.Get_ById(data.oldValue);
                break;
            }

            case historyitem_AutoShapes_RecalculateBrushUndo:
            {

                this.recalculateBrush();
                this.recalculatePen();
                break;
            }
        }
    },

    Redo: function(type, data)
    {
        switch (type)
        {
            case historyitem_AutoShapes_RecalculateBrushRedo:
            {
                this.recalculateBrush();
                this.recalculatePen();
                break;
            }
            case historyitem_AutoShapes_RecalculateAfterParagraphAddRedo:
            {
                if(isRealObject(this.txBody))
                {
                    this.txBody.calculateContent();
                    this.calculateTransformTextMatrix();
                }
                break;
            }
            case historyitem_AutoShapes_SetDefaultTextRectStyle:
            {
                this.style = CreateDefaultTextRectStyle();
                break;
            }
            case historyitem_AutoShapes_SetPresetGeometry:
            {
                this.spPr.geometry = g_oTableId.Get_ById(data.newValue);
                break;
            }
            case historyitem_AutoShapes_RecalculateTransformRedo:
            {
                this.recalculateTransform();
                this.calculateContent();
                this.calculateTransformTextMatrix();
                break;
            }
            case historyitem_AutoShapes_RecalculateGeometry_Redo:
            {
                if(isRealObject(this.spPr.geometry))
                    this.spPr.geometry.Recalculate(this.extX, this.extY);
                break;
            }
            case historyitem_AutoShapes_Add_To_Drawing_Objects:
            {
                this.drawingObjects.addGraphicObject(this, data.oldValue);
                break;
            }

            case historyitem_AutoShapes_DeleteDrawingBase:
            {
                this.drawingObjects.deleteDrawingBase(this.Id);
                break;
            }
            case historyitem_AutoShapes_SetGroup:
            {
                this.group = g_oTableId.Get_ById(data.newValue);
                break;
            }

            case historyitem_AutoShapes_SetDefaultStyle:
            {
                this.style = CreateDefaultShapeStyle();
                break;
            }
            case historyitem_AutoShapes_RecalculateAfterInit:
            {
                this.recalculateTransform();
                this.recalculateBrush();
                this.recalculatePen();
                break;
            }

            case historyitem_AutoShapes_SetUniFill:
            {
                this.spPr.Fill = g_oTableId.Get_ById(data.newValue);
                break;
            }
            case historyitem_AutoShapes_SetUniLine:
            {
                this.spPr.ln = g_oTableId.Get_ById(data.newValue);
                break;
            }
            case historyitem_AutoShapes_SetDrawingObjects:
            {
                if(data.newValue !== null)
                {
                    var api = window["Asc"]["editor"];
                    if ( api.wb )
                    {
                        var ws = api.wb.getWorksheetById(data.newValue);
                        this.drawingObjects = ws.objectRender;
                    }
                }
                break;
            }

            case historyitem_AutoShapes_SetXfrm:
            {
                this.spPr.xfrm = g_oTableId.Get_ById(data.newValue);
                break;
            }
            case historyitem_AutoShapes_AddTextBody:
            {
                this.txBody = g_oTableId.Get_ById(data.newValue);
                break;
            }
        }
    }
};

function CheckLinePreset(preset)
{
    return preset === "line";
}

function CorrectUniFill(asc_fill, unifill)
{
    if (null == asc_fill)
        return unifill;

    var ret = unifill;
    if (null == ret)
        ret = new CUniFill();

    var _fill = asc_fill.get_fill();
    var _type = asc_fill.get_type();

    if (null != _type)
    {
        switch (_type)
        {
            case c_oAscFill.FILL_TYPE_NOFILL:
            {
                ret.setFill(new CNoFill());
                break;
            }
            case c_oAscFill.FILL_TYPE_BLIP:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_BLIP)
                {
                    ret.setFill( new CBlipFill() );
                }

                var _url = _fill.get_url();
                var _tx_id = _fill.get_texture_id();
                if (null != _tx_id && (0 <= _tx_id) && (_tx_id < g_oUserTexturePresets.length))
                {
                    _url = g_oUserTexturePresets[_tx_id];
                }

                if (_url != null && _url !== undefined && _url != "")
                    ret.fill.setRasterImageId(_url);

                if (ret.fill.RasterImageId == null)
                    ret.fill.setRasterImageId("");

                var tile = _fill.get_type();
                if (tile == c_oAscFillBlipType.STRETCH)
                    ret.fill.tile = null;
                else if (tile == c_oAscFillBlipType.TILE)
                    ret.fill.tile = true;

                break;
            }
            default:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_SOLID)
                {
                    ret.setFill(new CSolidFill());
                }
                ret.fill.setColor(CorrectUniColor(_fill.get_color(), ret.fill.color));
            }
        }
    }

    var _alpha = asc_fill.get_transparent();
    if (null != _alpha)
        ret.transparent = _alpha;

    return ret;
}

function CorrectUniColor(asc_color, unicolor)
{
    if (null == asc_color)
        return unicolor;

    var ret = unicolor;
    if (null == ret)
        ret = new CUniColor();

    var _type = asc_color.get_type();
    switch (_type)
    {
        case c_oAscColor.COLOR_TYPE_PRST:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_PRST)
            {
                ret.setColor(new CPrstColor());
            }
            ret.color.setId(asc_color.get_value());
            break;
        }
        case c_oAscColor.COLOR_TYPE_SCHEME:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SCHEME)
            {
                ret.setColor(new CSchemeColor());
            }

            // тут выставляется ТОЛЬКО из меню. поэтому:
            var _index = parseInt(asc_color.get_value());
            var _id = (_index / 6) >> 0;
            var _pos = _index - _id * 6;

            var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
            ret.color.setColorId(array_colors_types[_id]);

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);

            if (1 <= _pos && _pos <= 5)
            {
                var _mods = g_oThemeColorsDefaultMods[_pos - 1];
                var _ind = 0;
                for (var k in _mods)
                {
                    var mod = new CColorMod();
                    mod.setName(k);
                    mod.setVal(_mods[k]);
                    ret.addMod(mod);
                    _ind++;
                }
            }

            break;
        }
        default:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SRGB)
            {
                ret.setColor(new CRGBColor());
            }
            ret.color.setColor(asc_color.get_r()*16*16 + asc_color.get_g()*16 + asc_color.get_b());
            /*ret.color.RGBA.R = asc_color.get_r();
            ret.color.RGBA.G = asc_color.get_g();
            ret.color.RGBA.B = asc_color.get_b();
            ret.color.RGBA.A = asc_color.get_a();           */
        }
    }
    return ret;
}
