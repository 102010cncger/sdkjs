"use strict";

var BOUNDS_DELTA = 3;
function CheckObjectLine(obj)
{
    return (obj instanceof CShape && obj.spPr && obj.spPr.geometry && obj.spPr.geometry.preset === "line");
}
function hitToHandles(x, y, object)
{
    var invert_transform = object.getInvertTransform();
    var t_x, t_y;
    t_x = invert_transform.TransformPointX(x, y);
    t_y = invert_transform.TransformPointY(x, y);
    var radius = object.convertPixToMM(TRACK_CIRCLE_RADIUS);

    var check_line = CheckObjectLine(object);
    var sqr_x = t_x * t_x, sqr_y = t_y * t_y;
    if (Math.sqrt(sqr_x + sqr_y) < radius)
        return 0;

    var hc = object.extX * 0.5;
    var dist_x = t_x - hc;
    sqr_x = dist_x * dist_x;
    if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line)
        return 1;

    dist_x = t_x - object.extX;
    sqr_x = dist_x * dist_x;
    if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line)
        return 2;

    var vc = object.extY * 0.5;
    var dist_y = t_y - vc;
    sqr_y = dist_y * dist_y;
    if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line)
        return 3;

    dist_y = t_y - object.extY;
    sqr_y = dist_y * dist_y;
    if (Math.sqrt(sqr_x + sqr_y) < radius)
        return 4;

    dist_x = t_x - hc;
    sqr_x = dist_x * dist_x;
    if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line)
        return 5;

    dist_x = t_x;
    sqr_x = dist_x * dist_x;
    if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line)
        return 6;

    dist_y = t_y - vc;
    sqr_y = dist_y * dist_y;
    if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line)
        return 7;

    if(object.canRotate && object.canRotate())
    {
        var rotate_distance = object.convertPixToMM(TRACK_DISTANCE_ROTATE);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y * dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line)
            return 8;
    }

    return -1;
}

function getRotateAngle(x, y, object)
{
    var transform = object.getTransformMatrix();
    var rotate_distance = object.convertPixToMM(TRACK_DISTANCE_ROTATE);
    var hc = object.extX * 0.5;
    var vc = object.extY * 0.5;
    var xc_t = transform.TransformPointX(hc, vc);
    var yc_t = transform.TransformPointY(hc, vc);
    var rot_x_t = transform.TransformPointX(hc, -rotate_distance);
    var rot_y_t = transform.TransformPointY(hc, -rotate_distance);

    var invert_transform = object.getInvertTransform();
    var rel_x = invert_transform.TransformPointX(x, y);

    var v1_x, v1_y, v2_x, v2_y;
    v1_x = x - xc_t;
    v1_y = y - yc_t;

    v2_x = rot_x_t - xc_t;
    v2_y = rot_y_t - yc_t;

    var flip_h = object.getFullFlipH();
    var flip_v = object.getFullFlipV();
    var same_flip = flip_h && flip_v || !flip_h && !flip_v;
    var angle = rel_x > object.extX * 0.5 ? Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y) : -Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y);
    return same_flip ? angle : -angle;
}

function getBoundsInGroup(shape)
{
    var r = shape.rot;
    if (!isRealNumber(r) || (r >= 0 && r < Math.PI * 0.25)
        || (r > 3 * Math.PI * 0.25 && r < 5 * Math.PI * 0.25)
        || (r > 7 * Math.PI * 0.25 && r < 2 * Math.PI)) {
        return { minX: shape.x, minY: shape.y, maxX: shape.x + shape.extX, maxY: shape.y + shape.extY };
    }
    else {
        var hc = shape.extX * 0.5;
        var vc = shape.extY * 0.5;
        var xc = shape.x + hc;
        var yc = shape.y + vc;
        return { minX: xc - vc, minY: yc - hc, maxX: xc + vc, maxY: yc + hc };
    }
}


var SHAPE_TYPE_RECALC_POSITION = 0;
var SHAPE_TYPE_RECALC_EXTENTS = 1;
var SHAPE_TYPE_RECALC_ROT = 2;
var SHAPE_TYPE_RECALC_FLIP = 3;
var SHAPE_TYPE_RECALC_FILL = 4;
var SHAPE_TYPE_RECALC_LINE = 5;
var SHAPE_TYPE_RECALC_GEOMETRY = 6;


function CreateUniFillByUniColorCopy(uniColor)
{
    var ret = new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(uniColor.createDuplicate());
    return ret;
}

function CShape()
{
    this.nvSpPr         = null;
    this.spPr           = null;
    this.style          = null;
    this.txBody         = null;
    this.bodyPr			= null;
    this.textBoxContent = null;
    this.parent         = null;//В Word - ParaDrawing, в PowerPoint - Slide;
    this.group          = null;
    this.drawingBase    = null;//DrawingBase в Excell'е
    this.bWordShape     = null;//если этот флаг стоит в true то автофигура имеет формат как в редакторе документов
    this.bDeleted = true;



    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();
    this.invertTransform = null;
    this.transformText = new CMatrix();
    this.invertTransformText = null;
    this.brush  = null;
    this.pen = null;
    this.selected = false;


    this.snapArrayX = [];
    this.snapArrayY = [];

    this.localTransform = new CMatrix();
    this.localTransformText = new CMatrix();
    this.worksheet = null;

    this.setRecalculateInfo();

    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add( this, this.Id );
}

CShape.prototype =
{
    Get_Id: function ()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Shape;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(historyitem_type_Shape);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    convertToWord: function(document)
    {
        var c = new CShape();
        c.setWordShape(true);
        c.setBDeleted(false);
        if(this.nvSpPr)
        {
            c.setNvSpPr(this.nvSpPr.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
            c.spPr.setParent(c);
        }
        if(this.style)
        {
            c.setStyle(this.style.createDuplicate());
        }
        if(this.txBody)
        {
            if(this.txBody.bodyPr)
            {
                c.setBodyPr(this.txBody.bodyPr.createDuplicate());
            }
            if(this.txBody.content)
            {
                var new_content = new CDocumentContent(c, document.DrawingDocument, 0, 0, 0, 20000, false, false, false);
                var paragraphs = this.txBody.content.Content;

                new_content.Internal_Content_RemoveAll();
                for(var i = 0; i < paragraphs.length; ++i)
                {
                    var cur_par = paragraphs[i];
                    cur_par.bFromDocument = true;
                    var new_paragraph = cur_par.Copy(new_content);
                    cur_par.bFromDocument = false;
                    new_content.Internal_Content_Add( i, new_paragraph, false );
                    /*var bullet = cur_par.Pr.Bullet;
                    if(bullet && bullet.bulletType && bullet.bulletType.type !== BULLET_TYPE_BULLET_NONE)
                    {
                        switch(bullet.bulletType.type)
                        {
                            case BULLET_TYPE_BULLET_CHAR:
                            case BULLET_TYPE_BULLET_BLIP :
                            {
                                _bullet.m_nType = numbering_presentationnumfrmt_Char;
                                _bullet.m_sChar = _final_bullet.bulletType.Char[0];
                                _cur_paragraph.Add_PresentationNumbering(_bullet, true);
                                break;
                            }
                            case BULLET_TYPE_BULLET_AUTONUM :
                            {
                                _bullet.m_nType = g_NumberingArr[_final_bullet.bulletType.AutoNumType];
                                _bullet.m_nStartAt = _final_bullet.bulletType.startAt;
                                _cur_paragraph.Add_PresentationNumbering(_bullet, true);
                                break;
                            }
                        }
                    } */
                }
                c.setTextBoxContent(new_content);
            }
        }
        return c;
    },

    convertToPPTX: function(drawingDocument, worksheet)
    {
        var c = new CShape();
        c.setWordShape(false);
        c.setBDeleted(false);
        c.setWorksheet(worksheet);
        if(this.nvSpPr)
        {
            c.setNvSpPr(this.nvSpPr.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
            c.spPr.setParent(c);
        }
        if(this.style)
        {
            c.setStyle(this.style.createDuplicate());
        }
        if(this.textBoxContent)
        {
            var tx_body = new CTextBody();
            tx_body.setParent(c);
            if(this.bodyPr)
            {
                tx_body.setBodyPr(this.bodyPr.createDuplicate());
            }
            var new_content = new CDocumentContent(tx_body, drawingDocument, 0, 0, 0, 0, false, false, true);
            new_content.Internal_Content_RemoveAll();
            var paragraphs = this.textBoxContent.Content;
            for(var i = 0; i < paragraphs.length; ++i)
            {
                var cur_par = paragraphs[i];
                var new_paragraph = new Paragraph(drawingDocument, tx_body, 0, 0, 0, 0, 0, true);
                new_paragraph.Set_Pr(cur_par.Pr.Copy());
                new_paragraph.TextPr.Set_Value( cur_par.TextPr.Value );
                new_paragraph.Internal_Content_Remove2(0, new_paragraph.Content.length);
                var Count = cur_par.Content.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Item = cur_par.Content[Index];
                    new_paragraph.Internal_Content_Add( new_paragraph.Content.length, Item.Copy(false), false );
                }
                var EndRun = new ParaRun(new_paragraph);
                EndRun.Add_ToContent( 0, new ParaEnd() );
                new_paragraph.Internal_Content_Add( new_paragraph.Content.length, EndRun, false );
                new_content.Internal_Content_Add( i, new_paragraph, false );
            }
            tx_body.setContent(new_content);
            c.setTxBody(tx_body);
        }
        return c;
    },

    documentGetAllFontNames: function(AllFonts)
    {
        //TODO
        var content = this.getDocContent();
        if(content)
        {
            content.Document_Get_AllFontNames(AllFonts);
        }
    },

    documentCreateFontMap: function(map)
    {
        var content = this.getDocContent();
        if(content)
        {
            content.Document_CreateFontMap(map);
        }
    },

    setBDeleted: function(pr)
    {
        History.Add(this, {Type: historyitem_ShapeSetBDeleted, oldPr: this.bDeleted, newPr: pr});
        this.bDeleted = pr;
    },

    setNvSpPr: function (pr)
    {
        History.Add(this, { Type: historyitem_ShapeSetNvSpPr, oldPr: this.nvSpPr, newPr: pr });
        this.nvSpPr = pr;
    },

    setSpPr: function (spPr)
    {
        History.Add(this, { Type: historyitem_ShapeSetSpPr, oldPr: this.spPr, newPr: spPr });
        this.spPr = spPr;
    },

    setStyle: function (style)
    {
        History.Add(this, { Type: historyitem_ShapeSetStyle, oldPr: this.style, newPr: style });
        this.style = style;
        var content = this.getDocContent();

        this.recalcInfo.recalculateShapeStyleForParagraph = true;
        if(this.recalcTextStyles)
            this.recalcTextStyles();
        if(content)
        {
            content.Recalc_AllParagraphs_CompiledPr();
        }
    },

    setTxBody: function (txBody)
    {
        History.Add(this, { Type: historyitem_ShapeSetTxBody, oldPr: this.txBody, newPr: txBody });
        this.txBody = txBody;
    },

    setTextBoxContent: function(textBoxContent)
    {
        History.Add(this, {Type: historyitem_ShapeSetTextBoxContent, oldPr: this.textBoxContent, newPr: textBoxContent});
        this.textBoxContent = textBoxContent;
    },

    setBodyPr: function(pr)
    {
        History.Add(this, {Type: historyitem_ShapeSetBodyPr, oldPr: this.bodyPr, newPr: pr});
        this.bodyPr = pr;
        this.recalcInfo.recalcContent = true;
        this.recalcInfo.recalcTransformText = true;
        this.addToRecalculate();
    },

    createTextBody: function()
    {
        var tx_body = new CTextBody();
        tx_body.setParent(this);
        tx_body.setContent(new CDocumentContent(tx_body, this.getDrawingDocument(), 0, 0, 0, 20000, false, false, true));
        tx_body.setBodyPr(new CBodyPr());
        tx_body.content.Content[0].Set_DocumentIndex(0);
        this.setTxBody(tx_body);
    },

    createTextBoxContent: function()
    {
        var body_pr = new CBodyPr();
        body_pr.setAnchor(1);
        this.setBodyPr(body_pr);
        this.setTextBoxContent(new CDocumentContent(this, this.getDrawingDocument(), 0, 0, 0, 20000, false, false));
        this.textBoxContent.Set_ParagraphAlign(align_Center);
        this.textBoxContent.Content[0].Set_DocumentIndex(0);
    },

    paragraphAdd: function (paraItem, bRecalculate)
    {
        var content_to_add =  this.getDocContent();
        if(!content_to_add)
        {
            if(this.bWordShape)
            {
                this.createTextBoxContent();
            }
            else
            {
                this.createTextBody();
            }
            content_to_add =  this.getDocContent();
        }
        if(content_to_add)
        {
            content_to_add.Paragraph_Add(paraItem, bRecalculate);
        }
    },

    getDocContent: function()
    {
        if(this.txBody)
        {
            return this.txBody.content;
        }
        else if(this.textBoxContent)
        {
            return this.textBoxContent;
        }
        return null;
    },

    getBodyPr: function()
    {
        return ExecuteNoHistory(function(){

            if(this.bWordShape)
            {
                var ret = new CBodyPr();
                ret.setDefault();
                if(this.bodyPr)
                    ret.merge(this.bodyPr);
                return ret;
            }
            else
            {
                if(this.txBody && this.txBody.bodyPr)
                    return this.txBody.getCompiledBodyPr();
                var ret = new CBodyPr();
                ret.setDefault();
                return ret;
            }
        }, this, []);
    },

    Search : function(Str, Props, SearchEngine, Type)
    {
        if(this.textBoxContent)
        {
            var dd = this.getDrawingDocument();
            dd.StartSearchTransform(this.transformText);
            this.textBoxContent.Search(Str, Props, SearchEngine, Type);
            dd.EndSearchTransform();
        }
    },
    
    Search_GetId : function(bNext, bCurrent)
    {
        if(this.textBoxContent)
            return this.textBoxContent.Search_GetId(bNext, bCurrent);
        
        return null;
    },

    documentUpdateRulersState: function()
    {
        var content = this.getDocContent();
        if(!content)
            return;
        var xc, yc;
        var l, t, r, b;
        var body_pr = this.getBodyPr();
        var l_ins, t_ins, r_ins, b_ins;
        if(typeof body_pr.lIns === "number")
            l_ins = body_pr.lIns;
        else
            l_ins = 2.54;

        if(typeof body_pr.tIns === "number")
            t_ins = body_pr.tIns;
        else
            t_ins = 1.27;

        if(typeof body_pr.rIns === "number")
            r_ins = body_pr.rIns;
        else
            r_ins = 2.54;

        if(typeof body_pr.bIns === "number")
            b_ins = body_pr.bIns;
        else
            b_ins = 1.27;

        if(this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect))
        {
            l = this.spPr.geometry.rect.l+l_ins;
            t = this.spPr.geometry.rect.t+t_ins;
            r = this.spPr.geometry.rect.r-r_ins;
            b = this.spPr.geometry.rect.b-b_ins;

        }
        else
        {
            l = l_ins;
            t = t_ins;
            r = this.extX-r_ins;
            b = this.extY-b_ins;
        }

        var x_lt, y_lt, x_rt, y_rt, x_rb, y_rb, x_lb, y_lb;
        var tr = this.transform;
        x_lt = tr.TransformPointX(l, t);
        y_lt = tr.TransformPointY(l, t);

        x_rb = tr.TransformPointX(r, b);
        y_rb = tr.TransformPointY(r, b);


        xc = (x_lt + x_rb)*0.5;
        yc = (y_lt + y_rb)*0.5;

        var hc = (r - l)*0.5;
        var vc = (b - t)*0.5;

        this.getDrawingDocument().Set_RulerState_Paragraph({L: xc - hc, T: yc - vc, R: xc + hc, B: yc + vc});
        content.Document_UpdateRulersState(isRealNumber(this.selectStartPage) ? this.selectStartPage : 0);
    },

    setParent: function (parent)
    {
        History.Add(this, { Type: historyitem_ShapeSetParent, oldPr: this.parent, newPr: parent });
        this.parent = parent;
    },

    setGroup: function (group)
    {
        History.Add(this, { Type: historyitem_ShapeSetGroup, oldPr: this.group, newPr: group });
        this.group = group;
    },

    getAllImages: function (images) {
        if (this.spPr && this.spPr.Fill && this.spPr.Fill.fill instanceof CBlipFill && typeof this.spPr.Fill.fill.RasterImageId === "string") {
            images[_getFullImageSrc(this.spPr.Fill.fill.RasterImageId)] = true;
        }
    },

    recalcAll: function () {
        this.recalcInfo =
        {
            recalculateContent: true,
            recalculateBrush: true,
            recalculatePen: true,
            recalculateTransform: true,
            recalculateTransformText: true,
            recalculateCursorTypes: true,
            recalculateGeometry: true,
            recalculateStyle: true,
            recalculateFill: true,
            recalculateLine: true,
            recalculateShapeHierarchy: true,
            recalculateTransparent: true,
            recalculateGroupHierarchy: true,
            recalculateTextStyles: [true, true, true, true, true, true, true, true, true]
        };
        if (this.txBody) {
            this.txBody.recalcAll();
        }
    },

    recalcAllColors: function () {
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateBrush = true;
        this.recalcInfo.recalculatePen = true;
        this.recalcInfo.recalculateStyle = true;
        this.recalcInfo.recalculateFill = true;
        this.recalcInfo.recalculateLine = true;
        this.recalcInfo.recalculateTextStyles = [true, true, true, true, true, true, true, true, true];
        if (this.txBody) {
            this.txBody.recalcColors();
        }
    },


    getType: function () {
        return DRAWING_OBJECT_TYPE_SHAPE;
    },

    getAllFonts: function (fonts) {
        if (this.txBody) {
            this.txBody.content.Document_Get_AllFontNames(fonts);
            delete fonts["+mj-lt"];
            delete fonts["+mn-lt"];
            delete fonts["+mj-ea"];
            delete fonts["+mn-ea"];
            delete fonts["+mj-cs"];
            delete fonts["+mn-cs"];
        }
    },

    canFill: function()
    {
        if(this.spPr && this.spPr.geometry)
        {
            return this.spPr.geometry.canFill();
        }
        return false;
    },

    initDefault: function (x, y, extX, extY, flipH, flipV, presetGeom, arrowsCount) {
        this.setXfrm(x, y, extX, extY, 0, flipH, flipV);
        this.setPresetGeometry(presetGeom);
        this.setDefaultStyle();
        if (arrowsCount === 1 || arrowsCount === 2) {
            switch (arrowsCount) {
                case 1:
                {
                    var ln = new CLn();
                    ln.tailEnd = new EndArrow();
                    ln.tailEnd.type = LineEndType.Arrow;
                    ln.tailEnd.len = LineEndSize.Mid;
                    break;
                }
                case 2:
                {
                    var ln = new CLn();
                    ln.tailEnd = new EndArrow();
                    ln.tailEnd.type = LineEndType.Arrow;
                    ln.tailEnd.len = LineEndSize.Mid;
                    ln.headEnd = new EndArrow();
                    ln.headEnd.type = LineEndType.Arrow;
                    ln.headEnd.len = LineEndSize.Mid;
                    break;
                }
            }
            this.spPr.setLn(ln);
        }
    },

    Hyperlink_CanAdd: function (bCheck) {
        if (this.txBody)
            return this.txBody.content.Hyperlink_CanAdd(bCheck);
        return false;
    },

    Hyperlink_Check: function (bCheck) {
        if (this.txBody)
            return this.txBody.content.Hyperlink_Check(bCheck);
        return false;
    },


    Hyperlink_Add: function (HyperProps) {
        if (this.txBody) {
            this.txBody.content.Hyperlink_Add(HyperProps);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    Hyperlink_Modify: function (HyperProps) {
        if (this.txBody) {
            this.txBody.content.Hyperlink_Modify(HyperProps);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    Hyperlink_Remove: function () {
        if (this.txBody) {
            this.txBody.content.Hyperlink_Remove();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    Get_SelectedText: function (bClearText) {
        if (this.txBody) {
            return this.txBody.content.Get_SelectedText(bClearText);
        }
        return null;
    },

    pointInSelectedText: function (x, y) {
        if (this.txBody && this.invertTransformText)
        {
            var tx = this.invertTransformText.TransformPointX(x, y);
            var ty = this.invertTransformText.TransformPointY(x, y);
            return this.txBody.content.Selection_Check(tx, ty, this.parent.num);
        }
        return false;
    },

    getTextPr: function () {
        if (this.txBody) {
            return this.txBody.content.Get_Paragraph_TextPr();
        }
        return new CTextPr();
    },

    getParaPr: function () {
        if (this.txBody) {
            return this.txBody.content.Get_Paragraph_ParaPr();
        }
        return new CParaPr();
    },

    Paragraph_ClearFormatting: function () {
        if (this.txBody) {
            return this.txBody.content.Paragraph_ClearFormatting();
        }
    },

    initDefaultTextRect: function (x, y, extX, extY, flipH, flipV) {
        this.setXfrm(x, y, extX, extY, 0, flipH, flipV);
        this.setPresetGeometry("rect");
        this.setDefaultTextRectStyle();
        var uni_fill = new CUniFill();
        uni_fill.fill = (new CSolidFill());
        uni_fill.fill.color = (new CUniColor());
        uni_fill.fill.color.color = (new CSchemeColor());
        uni_fill.fill.color.color.id = (12);
        this.setFill(uni_fill);

        var ln = new CLn();
        ln.w = (6350);
        ln.Fill = new CUniFill();
        ln.Fill.fill = (new CSolidFill());
        ln.Fill.fill.color = (new CUniColor());
        ln.Fill.fill.color.color = (new CPrstColor());
        ln.Fill.fill.color.color.id = ("black");
        this.spPr.setLn(ln);
        this.setTextBody(new CTextBody(this));
    },



    setUniFill: function (fill) {
        this.spPr.Fill = fill;
    },

    setUniLine: function (ln) {
        this.spPr.ln = ln;
    },

    setPresetGeometry: function (preset) {
        var old_geometry = this.spPr.geometry;
        this.spPr.geometry = CreateGeometry(preset);
        this.spPr.geometry.Init(5, 5);
        History.Add(this, { Type: historyitem_SetShapeSetGeometry, oldGeometry: old_geometry, newGeometry: this.spPr.geometry });

    },

    setDefaultStyle: function () {

        this.setStyle(CreateDefaultShapeStyle(this.spPr && this.spPr.geometry ? this.spPr.geometry.preset : null));
    },

    setDefaultTextRectStyle: function () {
        this.setStyle(CreateDefaultTextRectStyle());
    },

    isShape: function () {
        return true;
    },

    isImage: function () {
        return false;
    },

    isChart: function () {
        return false;
    },

    isGroup: function () {
        return false;
    },

    checkNotNullTransform: function () {
        if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNull())
            return true;
        if (this.isPlaceholder()) {
            var ph_type = this.getPlaceholderType();
            var ph_index = this.getPlaceholderIndex();
            switch (this.parent.kind) {
                case SLIDE_KIND:
                {
                    var placeholder = this.parent.Layout.getMatchingShape(ph_type, ph_index);
                    if (placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull())
                        return true;
                    placeholder = this.parent.Layout.Master.getMatchingShape(ph_type, ph_index);
                    return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull();
                }

                case LAYOUT_KIND:
                {
                    var placeholder = this.parent.Master.getMatchingShape(ph_type, ph_index);
                    return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull();
                }
            }
        }
        return false;
    },

    getHierarchy: function () {
        if (this.recalcInfo.recalculateShapeHierarchy) {
            this.compiledHierarchy.length = 0;
            var hierarchy = this.compiledHierarchy;
            if (this.isPlaceholder()) {
                var ph_type = this.getPlaceholderType();
                var ph_index = this.getPlaceholderIndex();
                switch (this.parent.kind) {
                    case SLIDE_KIND:
                    {
                        hierarchy.push(this.parent.Layout.getMatchingShape(ph_type, ph_index));
                        hierarchy.push(this.parent.Layout.Master.getMatchingShape(ph_type, ph_index));
                        break;
                    }

                    case LAYOUT_KIND:
                    {
                        hierarchy.push(this.parent.Master.getMatchingShape(ph_type, ph_index));
                        break;
                    }
                }
            }
            this.recalcInfo.recalculateShapeHierarchy = true;
        }
        return this.compiledHierarchy;
    },

    // getCompiledStyle: function () {
    //
    //     if (this.recalcInfo.recalculateStyle) {
    //         this.compiledStyle = null;
    //         if (this.isPlaceholder()) {
    //             if (isRealObject(this.style)) {
    //                 this.compiledStyle = this.style.createDuplicate();
    //             }
    //             else {
    //                 var hierarchy = this.getHierarchy();
    //                 for (var i = 0; i < hierarchy.length; ++i) {
    //                     if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].style)) {
    //                         this.compiledStyle = hierarchy[i].style.createDuplicate();
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //         else {
    //             if (isRealObject(this.style))
    //                 this.compiledStyle = this.style.createDuplicate();
    //         }
    //         if (isRealObject(this.compiledStyle)) {
    //             var parents = this.getParentObjects();
    //             if (isRealObject(this.compiledStyle.fillRef)
    //                 && isRealObject(this.compiledStyle.fillRef.Color)) {
    //                 this.compiledStyle.fillRef.Color.Calculate(parents.theme, parents.slide, parents.layout, parents.master);
    //             }
    //             if (isRealObject(this.compiledStyle.lnRef)
    //                 && isRealObject(this.compiledStyle.lnRef.Color)) {
    //                 this.compiledStyle.lnRef.Color.Calculate(parents.theme, parents.slide, parents.layout, parents.master);
    //             }
    //             if (isRealObject(this.compiledStyle.fontRef)
    //                 && isRealObject(this.compiledStyle.fontRef.Color)) {
    //                 this.compiledStyle.fontRef.Color.Calculate(parents.theme, parents.slide, parents.layout, parents.master);
    //             }
    //         }
    //         this.recalcInfo.recalculateStyle = false;
    //     }
    //     return this.compiledStyle;
    // },

    getPaddings: function () {
        var paddings = null;
        var shape = this;
        var body_pr;
        if (shape.txBody)
        {
            body_pr = shape.txBody.bodyPr;
        }
        else if(shape.textBoxContent)
        {
            body_pr = shape.bodyPr;
        }
        if(body_pr)
        {
            paddings = new CPaddings();
            if (typeof body_pr.lIns === "number")
                paddings.Left = body_pr.lIns;
            else
                paddings.Left = 2.54;

            if (typeof body_pr.tIns === "number")
                paddings.Top = body_pr.tIns;
            else
                paddings.Top = 1.27;

            if (typeof body_pr.rIns === "number")
                paddings.Right = body_pr.rIns;
            else
                paddings.Right = 2.54;

            if (typeof body_pr.bIns === "number")
                paddings.Bottom = body_pr.bIns;
            else
                paddings.Bottom = 1.27;
        }
        return paddings;
    },

    //getParentObjects: function () {
    //    var parents = { slide: null, layout: null, master: null, theme: null };
    //    switch (this.parent.kind) {
    //        case SLIDE_KIND:
    //        {
    //            parents.slide = this.parent;
    //            parents.layout = this.parent.Layout;
    //            parents.master = this.parent.Layout.Master;
    //            parents.theme = this.parent.Layout.Master.Theme;
    //            parents.presentation = this.parent.Layout.Master.presentation;
    //            break;
    //        }
    //        case LAYOUT_KIND:
    //        {
    //            parents.layout = this.parent;
    //            parents.master = this.parent.Master;
    //            parents.theme = this.parent.Master.Theme;
    //            parents.presentation = this.parent.Master.presentation;
    //            break;
    //        }
    //        case MASTER_KIND:
    //        {
    //            parents.master = this.parent;
    //            parents.theme = this.parent.Theme;
    //            parents.presentation = this.parent.presentation;
    //            break;
    //        }
    //    }
    //    return parents;
    //},

    getCompiledFill: function () {
        if (this.recalcInfo.recalculateFill) {
            this.compiledFill = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealObject(this.spPr.Fill.fill)) {
                if (this.spPr.Fill.fill instanceof CGradFill && this.spPr.Fill.fill.colors.length === 0) {
                    History.TurnOff();
                    var parent_objects = this.getParentObjects();
                    var theme = parent_objects.theme;
                    var fmt_scheme = theme.themeElements.fmtScheme;
                    var fill_style_lst = fmt_scheme.fillStyleLst;
                    for (var i = fill_style_lst.length - 1; i > -1; --i) {
                        if (fill_style_lst[i] && fill_style_lst[i].fill instanceof CGradFill) {
                            this.spPr.Fill = fill_style_lst[i].createDuplicate();
                            break;
                        }
                    }
                    History.TurnOn();
                }
                this.compiledFill = this.spPr.Fill.createDuplicate();
            }
            else if (isRealObject(this.group)) {
                var group_compiled_fill = this.group.getCompiledFill();
                if (isRealObject(group_compiled_fill) && isRealObject(group_compiled_fill.fill)) {
                    this.compiledFill = group_compiled_fill.createDuplicate();
                }
                else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill)) {
                            this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                            break;
                        }
                    }
                }
            }
            else {
                var hierarchy = this.getHierarchy();
                for (var i = 0; i < hierarchy.length; ++i) {
                    if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill)) {
                        this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                        break;
                    }
                }
            }
            this.recalcInfo.recalculateFill = false;
        }
        return this.compiledFill;
    },

    getMargins: function () {
        if (this.txBody) {
            return this.txBody.getMargins()
        }
        else {
            return null;
        }
    },
    Document_UpdateRulersState: function (margins) {
        if (this.txBody && this.txBody.content) {
            this.txBody.content.Document_UpdateRulersState(this.parent.num, this.getMargins());
        }
    },


    getSelectedTextInfo: function(info)
    {
        var content = this.getDocContent();
        if(content)
            content.Get_SelectedElementsInfo(info);
    },

    getCompiledLine: function () {
        if (this.recalcInfo.recalculateLine) {
            this.compiledLine = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.ln) && isRealObject(this.spPr.ln)) {
                this.compiledLine = this.spPr.ln.createDuplicate();
            }
            else if (isRealObject(this.group)) {
                var group_compiled_line = this.group.getCompiledLine();
                if (isRealObject(group_compiled_line) && isRealObject(group_compiled_line.fill)) {
                    this.compiledLine = group_compiled_line.createDuplicate();
                }
                else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.ln)) {
                            this.compiledLine = hierarchy[i].spPr.ln.createDuplicate();
                            break;
                        }
                    }
                }
            }
            else {
                var hierarchy = this.getHierarchy();
                for (var i = 0; i < hierarchy.length; ++i) {
                    if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.ln)) {
                        this.compiledLine = hierarchy[i].spPr.ln.createDuplicate();
                        break;
                    }
                }
            }
            this.recalcInfo.recalculateLine = false;
        }
        return this.compiledLine;
    },

    getCompiledTransparent: function () {
        if (this.recalcInfo.recalculateTransparent) {
            this.compiledTransparent = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealNumber(this.spPr.Fill.transparent))
                this.compiledTransparent = this.spPr.Fill.transparent;
            else if (isRealObject(this.group)) {
                var group_transparent = this.group.getCompiledTransparent();
                if (isRealNumber(group_transparent)) {
                    this.compiledTransparent = group_transparent;
                }
                else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealNumber(hierarchy[i].spPr.Fill.transparent)) {
                            this.compiledTransparent = this.spPr.Fill.transparent;
                            break;
                        }

                    }
                }
            }
            else {
                var hierarchy = this.getHierarchy();
                for (var i = 0; i < hierarchy.length; ++i) {
                    if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealNumber(hierarchy[i].spPr.Fill.transparent)) {
                        this.compiledTransparent = this.spPr.Fill.transparent;
                        break;
                    }

                }
            }
            this.recalcInfo.recalculateTransparent = false;
        }
        return this.compiledTransparent;
    },

    isPlaceholder: function () {
        return isRealObject(this.nvSpPr) && isRealObject(this.nvSpPr.nvPr) && isRealObject(this.nvSpPr.nvPr.ph);
    },



    getPlaceholderType: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.type : null;
    },

    getPlaceholderIndex: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.idx : null;
    },

    getPhType: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.type : null;
    },

    getPhIndex: function ()
    {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.idx : null;
    },

    setVerticalAlign: function (align) {
        var new_body_pr = this.getBodyPr();
        if(new_body_pr)
        {
            new_body_pr = new_body_pr.createDuplicate();
            new_body_pr.anchor = align;
            if(this.bWordShape)
            {
                this.setBodyPr(new_body_pr);
            }
            else
            {
                if(this.txBody)
                {
                    this.txBody.setBodyPr(new_body_pr);
                }
            }
        }
    },
    setPaddings: function (paddings) {
        if (paddings) {

            var new_body_pr = this.getBodyPr();
            if(new_body_pr)
            {
                new_body_pr = new_body_pr.createDuplicate();
                if (isRealNumber(paddings.Left)) {
                    new_body_pr.lIns = paddings.Left;
                }

                if (isRealNumber(paddings.Top)) {
                    new_body_pr.tIns = paddings.Top;
                }

                if (isRealNumber(paddings.Right)) {
                    new_body_pr.rIns = paddings.Right;
                }
                if (isRealNumber(paddings.Bottom)) {
                    new_body_pr.bIns = paddings.Bottom;
                }

                if(this.bWordShape)
                {
                    this.setBodyPr(new_body_pr);
                }
                else
                {
                    if(this.txBody)
                    {
                        this.txBody.setBodyPr(new_body_pr);
                    }
                }
            }
        }
    },

    recalculateTransformText: function () {
        if (this.txBody == null && this.textBoxContent == null)
            return;

        var _text_transform = this.localTransformText;
        _text_transform.Reset();
        var _shape_transform = this.localTransform;
        var _body_pr = this.getBodyPr();
        var content = this.getDocContent();
        var _content_height = content.Get_SummaryHeight();
        var _l, _t, _r, _b;

        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        }
        else {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = this.extX - _body_pr.rIns;
            _b = this.extY - _body_pr.bIns;
        }

        if (_l >= _r) {
            var _c = (_l + _r) * 0.5;
            _l = _c - 0.01;
            _r = _c + 0.01;
        }

        if (_t >= _b) {
            _c = (_t + _b) * 0.5;
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
        if (!_body_pr.upright) {
            if (!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                if (!this.bWordShape || _content_height < _text_rect_height) {
                    switch (_body_pr.anchor) {
                        case 0: //b
                        { // (Text Anchor Enum ( Bottom ))
                            _vertical_shift = _text_rect_height - _content_height;
                            break;
                        }
                        case 1:    //ctr
                        {// (Text Anchor Enum ( Center ))
                            _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                            break;
                        }
                        case 2: //dist
                        {// (Text Anchor Enum ( Distributed )) TODO: пока выравнивание  по центру. Переделать!
                            _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                            break;
                        }
                        case 3: //just
                        {// (Text Anchor Enum ( Justified )) TODO: пока выравнивание  по центру. Переделать!
                            _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                            break;
                        }
                        case 4: //t
                        {//Top
                            _vertical_shift = 0;
                            break;
                        }
                    }

                }
                else {
                    _vertical_shift =  _text_rect_height - _content_height;
                    if(_body_pr.anchor === 0)
                     {
                        _vertical_shift =  _text_rect_height - _content_height;
                     }
                     else
                     {
                        _vertical_shift = 0;
                     }
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                    var alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                }
                else {
                    alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI - alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                }
            }
            else {
                if (!this.bWordShape || _content_height < _text_rect_width) {
                    switch (_body_pr.anchor) {
                        case 0: //b
                        { // (Text Anchor Enum ( Bottom ))
                            _vertical_shift = _text_rect_width - _content_height;
                            break;
                        }
                        case 1:    //ctr
                        {// (Text Anchor Enum ( Center ))
                            _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                            break;
                        }
                        case 2: //dist
                        {// (Text Anchor Enum ( Distributed ))
                            _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                            break;
                        }
                        case 3: //just
                        {// (Text Anchor Enum ( Justified ))
                            _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                            break;
                        }
                        case 4: //t
                        {//Top
                            _vertical_shift = 0;
                            break;
                        }
                    }
                }
                else {
                    if(_body_pr.anchor === 0)
                     {
                        _vertical_shift =  _text_rect_width - _content_height;
                     }
                     else
                     {
                        _vertical_shift = 0;
                     }
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                var _alpha;
                _alpha = Math.atan2(_dy_t, _dx_t);
                if (_body_pr.vert === nVertTTvert) {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 0.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                    }
                    else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                    }
                }
                else {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 1.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lb, _t_y_lb);
                    }
                    else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rb, _t_y_rb);
                    }
                }
            }
            if(this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect))
            {
                var rect = this.spPr.geometry.rect;
                this.clipRect = {x: rect.l + _body_pr.lIns, y: rect.t + _body_pr.tIns, w: rect.r - rect.l - _body_pr.rIns, h: rect.b - rect.t - _body_pr.bIns};
            }
            else
            {
                this.clipRect = {x: _body_pr.lIns, y: _body_pr.tIns, w: this.extX - _body_pr.rIns, h: this.extY - _body_pr.bIns};
            }
        }
        else {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();

            var _hc = this.extX * 0.5;
            var _vc = this.extY * 0.5;
            var _transformed_shape_xc = this.localTransform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.localTransform.TransformPointY(_hc, _vc);


            var _content_width, content_height2;
            if ((_full_rotate >= 0 && _full_rotate < Math.PI * 0.25)
                || (_full_rotate > 3 * Math.PI * 0.25 && _full_rotate < 5 * Math.PI * 0.25)
                || (_full_rotate > 7 * Math.PI * 0.25 && _full_rotate < 2 * Math.PI)) {
                if (!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
                else {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                }
            }
            else {
                if (!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;

                }
                else {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
            }

            if (!this.bWordShape || _content_height < content_height2) {
                switch (_body_pr.anchor) {
                    case 0: //b
                    { // (Text Anchor Enum ( Bottom ))
                        _vertical_shift = content_height2 - _content_height;
                        break;
                    }
                    case 1:    //ctr
                    {// (Text Anchor Enum ( Center ))
                        _vertical_shift = (content_height2 - _content_height) * 0.5;
                        break;
                    }
                    case 2: //dist
                    {// (Text Anchor Enum ( Distributed ))
                        _vertical_shift = (content_height2 - _content_height) * 0.5;
                        break;
                    }
                    case 3: //just
                    {// (Text Anchor Enum ( Justified ))
                        _vertical_shift = (content_height2 - _content_height) * 0.5;
                        break;
                    }
                    case 4: //t
                    {//Top
                        _vertical_shift = 0;
                        break;
                    }
                }
            }
            else {
                if(_body_pr.anchor === 0)
                 {
                    _vertical_shift =  content_height2 - _content_height;
                 }
                 else
                 {
                    _vertical_shift = 0;
                 }
            }

            var _text_rect_xc = _l + (_r - _l) * 0.5;
            var _text_rect_yc = _t + (_b - _t) * 0.5;

            var _vx = _text_rect_xc - _hc;
            var _vy = _text_rect_yc - _vc;

            var _transformed_text_xc, _transformed_text_yc;
            if (!_full_flip.flipH) {
                _transformed_text_xc = _transformed_shape_xc + _vx;
            }
            else {
                _transformed_text_xc = _transformed_shape_xc - _vx;
            }

            if (!_full_flip.flipV) {
                _transformed_text_yc = _transformed_shape_yc + _vy;
            }
            else {
                _transformed_text_yc = _transformed_shape_yc - _vy;
            }

            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if (_body_pr.vert === nVertTTvert) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);

            }
            if (_body_pr.vert === nVertTTvert270) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, _transformed_text_xc - _content_width * 0.5, _transformed_text_yc - content_height2 * 0.5);

            var body_pr = this.getBodyPr();
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

        this.transformText = this.localTransformText.CreateDublicate();
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
        this.recalculateTransformText2();
        if(this.checkPosTransformText)
        {
            this.checkPosTransformText();
        }
        if(this.checkContentDrawings)
        {
            this.checkContentDrawings();
        }
    },

    getFullFlip: function()
    {
        var _transform = this.localTransform;
        var _full_rotate = this.getFullRotate();
        var _full_pos_x_lt = _transform.TransformPointX(0, 0);
        var _full_pos_y_lt = _transform.TransformPointY(0, 0);

        var _full_pos_x_rt = _transform.TransformPointX(this.extX, 0);
        var _full_pos_y_rt = _transform.TransformPointY(this.extX, 0);

        var _full_pos_x_rb = _transform.TransformPointX(this.extX, this.extY);
        var _full_pos_y_rb = _transform.TransformPointY(this.extX, this.extY);

        var _rotate_matrix = new CMatrix();
        global_MatrixTransformer.RotateRadAppend(_rotate_matrix, _full_rotate);

        var _rotated_pos_x_lt = _rotate_matrix.TransformPointX(_full_pos_x_lt, _full_pos_y_lt);

        var _rotated_pos_x_rt = _rotate_matrix.TransformPointX(_full_pos_x_rt, _full_pos_y_rt);
        var _rotated_pos_y_rt = _rotate_matrix.TransformPointY(_full_pos_x_rt, _full_pos_y_rt);

        var _rotated_pos_y_rb = _rotate_matrix.TransformPointY(_full_pos_x_rb, _full_pos_y_rb);
        return {
            flipH: _rotated_pos_x_lt > _rotated_pos_x_rt,
            flipV: _rotated_pos_y_rt > _rotated_pos_y_rb
        };
    },

    recalculateTransformText2: function () {
        if (this.txBody === null)
            return;
        if (!this.txBody.content2)
            return;
        this.transformText2.Reset();
        var _text_transform = this.transformText2;
        var _shape_transform = this.transform;
        var _body_pr = this.txBody.getBodyPr();
        var _content_height = this.txBody.getSummaryHeight2();
        var _l, _t, _r, _b;

        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        }
        else {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = this.extX - _body_pr.rIns;
            _b = this.extY - _body_pr.bIns;
        }

        if (_l >= _r) {
            var _c = (_l + _r) * 0.5;
            _l = _c - 0.01;
            _r = _c + 0.01;
        }

        if (_t >= _b) {
            _c = (_t + _b) * 0.5;
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
        if (_body_pr.upright === false) {
            if (!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                if (/*_content_height < _text_rect_height*/true) {
                    switch (_body_pr.anchor) {
                        case 0: //b
                        { // (Text Anchor Enum ( Bottom ))
                            _vertical_shift = _text_rect_height - _content_height;
                            break;
                        }
                        case 1:    //ctr
                        {// (Text Anchor Enum ( Center ))
                            _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                            break;
                        }
                        case 2: //dist
                        {// (Text Anchor Enum ( Distributed )) TODO: пока выравнивание  по центру. Переделать!
                            _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                            break;
                        }
                        case 3: //just
                        {// (Text Anchor Enum ( Justified )) TODO: пока выравнивание  по центру. Переделать!
                            _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                            break;
                        }
                        case 4: //t
                        {//Top
                            _vertical_shift = 0;
                            break;
                        }
                    }

                }
                else {
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
                if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                    var alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                }
                else {
                    alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI - alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                }
            }
            else {
                if (/*_content_height < _text_rect_width*/true) {
                    switch (_body_pr.anchor) {
                        case 0: //b
                        { // (Text Anchor Enum ( Bottom ))
                            _vertical_shift = _text_rect_width - _content_height;
                            break;
                        }
                        case 1:    //ctr
                        {// (Text Anchor Enum ( Center ))
                            _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                            break;
                        }
                        case 2: //dist
                        {// (Text Anchor Enum ( Distributed ))
                            _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                            break;
                        }
                        case 3: //just
                        {// (Text Anchor Enum ( Justified ))
                            _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                            break;
                        }
                        case 4: //t
                        {//Top
                            _vertical_shift = 0;
                            break;
                        }
                    }
                }
                else {
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
                var _alpha;
                _alpha = Math.atan2(_dy_t, _dx_t);
                if (_body_pr.vert === nVertTTvert) {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 0.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                    }
                    else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                    }
                }
                else {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 1.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lb, _t_y_lb);
                    }
                    else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rb, _t_y_rb);
                    }
                }
            }
            if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
                var rect = this.spPr.geometry.rect;
                this.clipRect = { x: rect.l, y: rect.t, w: rect.r - rect.l, h: rect.b - rect.t };
            }
            else {
                this.clipRect = { x: 0, y: 0, w: this.extX, h: this.extY };
            }
        }
        else {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();

            var _hc = this.extX * 0.5;
            var _vc = this.extY * 0.5;
            var _transformed_shape_xc = this.transform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.transform.TransformPointY(_hc, _vc);


            var _content_width, content_height2;
            if ((_full_rotate >= 0 && _full_rotate < Math.PI * 0.25)
                || (_full_rotate > 3 * Math.PI * 0.25 && _full_rotate < 5 * Math.PI * 0.25)
                || (_full_rotate > 7 * Math.PI * 0.25 && _full_rotate < 2 * Math.PI)) {
                if (!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
                else {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                }
            }
            else {
                if (!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;

                }
                else {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
            }

            if (/*_content_height < content_height2*/true) {
                switch (_body_pr.anchor) {
                    case 0: //b
                    { // (Text Anchor Enum ( Bottom ))
                        _vertical_shift = content_height2 - _content_height;
                        break;
                    }
                    case 1:    //ctr
                    {// (Text Anchor Enum ( Center ))
                        _vertical_shift = (content_height2 - _content_height) * 0.5;
                        break;
                    }
                    case 2: //dist
                    {// (Text Anchor Enum ( Distributed ))
                        _vertical_shift = (content_height2 - _content_height) * 0.5;
                        break;
                    }
                    case 3: //just
                    {// (Text Anchor Enum ( Justified ))
                        _vertical_shift = (content_height2 - _content_height) * 0.5;
                        break;
                    }
                    case 4: //t
                    {//Top
                        _vertical_shift = 0;
                        break;
                    }
                }
            }
            else {
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

            var _text_rect_xc = _l + (_r - _l) * 0.5;
            var _text_rect_yc = _t + (_b - _t) * 0.5;

            var _vx = _text_rect_xc - _hc;
            var _vy = _text_rect_yc - _vc;

            var _transformed_text_xc, _transformed_text_yc;
            if (!_full_flip.flipH) {
                _transformed_text_xc = _transformed_shape_xc + _vx;
            }
            else {
                _transformed_text_xc = _transformed_shape_xc - _vx;
            }

            if (!_full_flip.flipV) {
                _transformed_text_yc = _transformed_shape_yc + _vy;
            }
            else {
                _transformed_text_yc = _transformed_shape_yc - _vy;
            }

            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if (_body_pr.vert === nVertTTvert) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);

            }
            if (_body_pr.vert === nVertTTvert270) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, _transformed_text_xc - _content_width * 0.5, _transformed_text_yc - content_height2 * 0.5);

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
        this.invertTransformText2 = global_MatrixTransformer.Invert(this.transformText2);
    },

    setWordShape: function(pr)
    {
        History.Add(this, {Type: historyitem_ShapeSetWordShape, oldPr: this.bWordShape, newPr: pr});
        this.bWordShape = pr;
    },

    selectionCheck: function( X, Y, Page_Abs, NearPos)
    {

        var content = this.getDocContent();
        if(content)
        {
            if ( undefined !== NearPos )
                return content.Selection_Check(X, Y, Page_Abs, NearPos);

            if(isRealObject(content) && this.hitInTextRect(X, Y) && this.invertTransformText)
            {
                var t_x = this.invertTransformText.TransformPointX(X, Y);
                var t_y = this.invertTransformText.TransformPointY(X, Y);
                return content.Selection_Check(t_x, t_y, Page_Abs,  NearPos);
            }
        }
        return false;
    },

    copy: function ()
    {
        var copy = new CShape();
        if(this.nvSpPr)
            copy.setNvSpPr(this.nvSpPr.createDuplicate());
        if(this.spPr)
        {
            copy.setSpPr(this.spPr.createDuplicate());
            copy.spPr.setParent(copy);
        }
        if(this.style)
        {
            copy.setStyle(this.style.createDuplicate());
        }
        if(this.txBody)
        {
            copy.setTxBody(this.txBody.createDuplicate());
            copy.txBody.setParent(copy);
        }
        if(this.bodyPr)
        {
            copy.setBodyPr(this.bodyPr.createDuplicate());
        }
        if(this.textBoxContent)
        {
            copy.setTextBoxContent(this.textBoxContent.Copy(copy));
        }
        copy.setWordShape(this.bWordShape);
        copy.setBDeleted(this.bDeleted);
        return copy;
    },

    Get_Styles: function (level) {

        var _level = isRealNumber(level) ? level : 0;
        if (this.recalcInfo.recalculateTextStyles[_level])
        {
            this.recalculateTextStyles(_level);
            this.recalcInfo.recalculateTextStyles[_level] = false;
        }
        return this.compiledStyles[_level];
    },



    recalculateTextStyles: function (level)
    {
        return ExecuteNoHistory(function()
        {

            var parent_objects = this.getParentObjects();
            var default_style = new CStyle("defaultStyle", null, null, null);
            default_style.ParaPr.Spacing.LineRule = linerule_Auto;
            default_style.ParaPr.Spacing.Line = 1;
            default_style.ParaPr.Spacing.Before = 0;
            default_style.ParaPr.Spacing.After = 0;
            if (isRealObject(parent_objects.presentation) && isRealObject(parent_objects.presentation.defaultTextStyle)
                && isRealObject(parent_objects.presentation.defaultTextStyle.levels[level]))
            {
                var default_ppt_style = parent_objects.presentation.defaultTextStyle.levels[level];
                default_style.ParaPr.Merge(default_ppt_style.Copy());
                default_style.TextPr.Merge(default_ppt_style.DefaultRunPr.Copy());
            }

            var master_style;
            if (isRealObject(parent_objects.master) && isRealObject(parent_objects.master.txStyles))
            {
                var master_ppt_styles;
                master_style = new CStyle("masterStyele", null, null, null);
                if (this.isPlaceholder())
                {
                    switch (this.getPlaceholderType())
                    {
                        case phType_ctrTitle:
                        case phType_title:
                        {
                            master_ppt_styles = parent_objects.master.txStyles.titleStyle;
                            break;
                        }
                        case phType_body:
                        case phType_subTitle:
                        case phType_obj:
                        case null:
                        {
                            master_ppt_styles = parent_objects.master.txStyles.bodyStyle;
                            break;
                        }
                        default:
                        {
                            master_ppt_styles = parent_objects.master.txStyles.otherStyle;
                            break;
                        }
                    }
                }
                else
                {
                    master_ppt_styles = parent_objects.master.txStyles.otherStyle;
                }

                if (isRealObject(master_ppt_styles) && isRealObject(master_ppt_styles.levels) && isRealObject(master_ppt_styles.levels[level]))
                {
                    var master_ppt_style = master_ppt_styles.levels[level];
                    master_style.ParaPr = master_ppt_style.Copy();
                    master_style.TextPr = master_ppt_style.DefaultRunPr.Copy();
                }
            }

            var hierarchy = this.getHierarchy();
            var hierarchy_styles = [];
            for (var i = 0; i < hierarchy.length; ++i)
            {
                var hierarchy_shape = hierarchy[i];
                if (isRealObject(hierarchy_shape)
                    && isRealObject(hierarchy_shape.txBody)
                    && isRealObject(hierarchy_shape.txBody.lstStyle)
                    && isRealObject(hierarchy_shape.txBody.lstStyle.levels)
                    && isRealObject(hierarchy_shape.txBody.lstStyle.levels[level]))
                {
                    var hierarchy_ppt_style = hierarchy_shape.txBody.lstStyle.levels[level];
                    var hierarchy_style = new CStyle("hierarchyStyle" + i, null, null, null);
                    hierarchy_style.ParaPr = hierarchy_ppt_style.Copy();
                    hierarchy_style.TextPr = hierarchy_ppt_style.DefaultRunPr.Copy();
                    hierarchy_styles.push(hierarchy_style);
                }
            }

            var ownStyle;
            if (isRealObject(this.txBody) && isRealObject(this.txBody.lstStyle) && isRealObject(this.txBody.lstStyle[level]))
            {
                ownStyle = new CStyle("ownStyle", null, null, null);
                var own_ppt_style = this.txBody.lstStyle[level];
                ownStyle.ParaPr = own_ppt_style.Copy();
                ownStyle.TextPr = own_ppt_style.DefaultRunPr.Copy();
            }
            var shape_text_style;
            if (isRealObject(this.style) && isRealObject(this.style.fontRef))
            {
                shape_text_style = new CStyle("shapeTextStyle", null, null, null);
                var first_name;
                if(this.style.fontRef.idx === fntStyleInd_major)
                    first_name = "+mj-";
                else
                    first_name = "+mn-";

                shape_text_style.TextPr.RFonts.Ascii =  { Name: first_name + "lt", Index: -1 };
                shape_text_style.TextPr.RFonts.EastAsia =  { Name: first_name +"ea", Index: -1 };
                shape_text_style.TextPr.RFonts.CS =  { Name: first_name +"cs", Index: -1 };

                if (this.style.fontRef.Color != null && this.style.fontRef.Color.color != null)
                {
                    var unifill = new CUniFill();
                    unifill.fill = new CSolidFill();
                    unifill.fill.color = this.style.fontRef.Color;
                    shape_text_style.TextPr.Unifill = unifill;
                }
            }
            var Styles = new CStyles();

            var last_style_id;
            var isPlaceholder = this.isPlaceholder();
            if (isPlaceholder) {
                if (default_style) {
                    Styles.Add(default_style);
                    default_style.BasedOn = null;
                    last_style_id = default_style.Id;
                }

                if (master_style) {
                    Styles.Add(master_style);
                    master_style.BasedOn = last_style_id;
                    last_style_id = master_style.Id;
                }
            }
            else {
                if (master_style) {
                    Styles.Add(master_style);
                    master_style.BasedOn = null;
                    last_style_id = master_style.Id;
                }

                if (default_style) {
                    Styles.Add(default_style);
                    default_style.BasedOn = last_style_id;
                    last_style_id = default_style.Id;
                }
            }

            for (var i = hierarchy_styles.length - 1; i > -1; --i) {

                if (hierarchy_styles[i]) {
                    Styles.Add(hierarchy_styles[i]);
                    hierarchy_styles[i].BasedOn = last_style_id;
                    last_style_id = hierarchy_styles[i].Id;
                }
            }

            if (shape_text_style) {
                Styles.Add(shape_text_style);
                shape_text_style.BasedOn = last_style_id;
                last_style_id = shape_text_style.Id;
            }

            this.compiledStyles[level] = {styles: Styles, lastId: last_style_id};
            return this.compiledStyles[level];
        }, this, []);
    },

    recalculateBrush: function () {
        var compiled_style = this.getCompiledStyle();
        var RGBA = { R: 0, G: 0, B: 0, A: 255 };
        var parents = this.getParentObjects();
        if (isRealObject(parents.theme) && isRealObject(compiled_style) && isRealObject(compiled_style.fillRef))
        {
            compiled_style.fillRef.Color.Calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A:255});
            RGBA = compiled_style.fillRef.Color.RGBA;
            this.brush = parents.theme.getFillStyle(compiled_style.fillRef.idx);
            if (isRealObject(this.brush))
            {
                if (isRealObject(compiled_style.fillRef.Color.color)
                    && isRealObject(this.brush)
                    && isRealObject(this.brush.fill)
                    && this.brush.fill.type === FILL_TYPE_SOLID)
                {
                    this.brush.fill.color = compiled_style.fillRef.Color.createDuplicate();
                }
            }
            else
            {
                this.brush = new CUniFill();
            }
        }
        else
        {
            this.brush = new CUniFill();
        }

        this.brush.merge(this.getCompiledFill());
        this.brush.transparent = this.getCompiledTransparent();
        this.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
    },

    recalculatePen: function () {
        var compiled_style = this.getCompiledStyle();
        var RGBA = { R: 0, G: 0, B: 0, A: 255 };
        var parents = this.getParentObjects();
        if (isRealObject(parents.theme) && isRealObject(compiled_style) && isRealObject(compiled_style.lnRef)) {
            compiled_style.lnRef.Color.Calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A:255});
            RGBA = compiled_style.lnRef.Color.RGBA;
            this.pen = parents.theme.getLnStyle(compiled_style.lnRef.idx);
            if (isRealObject(this.pen)) {
                if (isRealObject(compiled_style.lnRef.Color.color)
                    && isRealObject(this.pen)
                    && isRealObject(this.pen.Fill)
                    && isRealObject(this.pen.Fill.fill)
                    && this.pen.Fill.fill.type === FILL_TYPE_SOLID) {
                    this.pen.Fill.fill.color = compiled_style.lnRef.Color.createDuplicate();
                }
            }
            else {
                this.pen = new CLn();
            }
        }
        else {
            this.pen = new CLn();
        }

        this.pen.merge(this.getCompiledLine());
        this.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
    },

    isEmptyPlaceholder: function () {
        if (this.isPlaceholder()) {
            if (this.nvSpPr.nvPr.ph.type == phType_title
                || this.nvSpPr.nvPr.ph.type == phType_ctrTitle
                || this.nvSpPr.nvPr.ph.type == phType_body
                || this.nvSpPr.nvPr.ph.type == phType_subTitle
                || this.nvSpPr.nvPr.ph.type == null
                || this.nvSpPr.nvPr.ph.type == phType_dt
                || this.nvSpPr.nvPr.ph.type == phType_ftr
                || this.nvSpPr.nvPr.ph.type == phType_hdr
                || this.nvSpPr.nvPr.ph.type == phType_sldNum
                || this.nvSpPr.nvPr.ph.type == phType_sldImg) {
                if (this.txBody) {
                    if (this.txBody.content) {
                        return this.txBody.content.Is_Empty();
                    }
                    return true;
                }
                return true;
            }
            if (this.nvSpPr.nvPr.ph.type == phType_chart
                || this.nvSpPr.nvPr.ph.type == phType_media) {
                return true;
            }
            if (this.nvSpPr.nvPr.ph.type == phType_pic) {
                var _b_empty_text = true;
                if (this.txBody) {
                    if (this.txBody.content) {
                        _b_empty_text = this.txBody.content.Is_Empty();
                    }
                }
                return (_b_empty_text && (this.brush == null || this.brush.fill == null));
            }
        }
        else {
            return false;
        }
    },


    changeSize: function (kw, kh) {
        if (this.spPr && this.spPr.xfrm.isNotNull()) {
            var xfrm = this.spPr.xfrm;
            this.setOffset(xfrm.offX * kw, xfrm.offY * kh);
            this.setExtents(xfrm.extX * kw, xfrm.extY * kh);
        }
    },

    recalculateTransform: function () {

        this.recalculateLocalTransform(this.transform);
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        if(this.drawingBase && !this.group)
        {
            this.drawingBase.setGraphicObjectCoords();
        }
        this.localTransform = this.transform.CreateDublicate();
    },


    recalculateLocalTransform: function(transform)
    {
        if (!isRealObject(this.group))
        {
            if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNull())
            {
                var xfrm = this.spPr.xfrm;
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
                if (this.isPlaceholder())
                {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i)
                    {
                        var hierarchy_sp = hierarchy[i];
                        if (isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull())
                        {
                            var xfrm = hierarchy_sp.spPr.xfrm;
                            this.x = xfrm.offX;
                            this.y = xfrm.offY;
                            this.extX = xfrm.extX;
                            this.extY = xfrm.extY;
                            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                            this.flipH = xfrm.flipH === true;
                            this.flipV = xfrm.flipV === true;
                            break;
                        }
                    }
                    if (i === hierarchy.length)
                    {
                        this.x = 0;
                        this.y = 0;
                        this.extX = 5;
                        this.extY = 5;
                        this.rot = 0;
                        this.flipH = false;
                        this.flipV = false;
                    }
                }
                else
                {
                    var extX, extY;
                    if(this.parent && this.parent.Extent)
                    {
                        this.x = 0;
                        this.y = 0;
                        extX = this.parent.Extent.W;
                        extY = this.parent.Extent.H;
                    }
                    else if(this.drawingBase)
                    {
                        var metrics = this.drawingBase.getGraphicObjectMetrics();
                        this.x = metrics.x;
                        this.y = metrics.y;
                        extX = metrics.extX;
                        extY = metrics.extY;
                    }
                    else
                    {
                        this.x = 0;
                        this.y = 0;
                        extX = 5;
                        extY = 5;
                    }
                    this.extX = extX;
                    this.extY = extY;
                    this.rot = 0;
                    this.flipH = false;
                    this.flipV = false;
                }
            }
        }
        else
        {
            var xfrm;
            if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNull())
            {
                xfrm = this.spPr.xfrm;
            }
            else
            {
                if (this.isPlaceholder()) {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        var hierarchy_sp = hierarchy[i];
                        if (isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull()) {
                            xfrm = hierarchy_sp.spPr.xfrm;
                            break;
                        }
                    }
                    if (i === hierarchy.length) {
                        xfrm = new CXfrm();
                        xfrm.offX = 0;
                        xfrm.offX = 0;
                        xfrm.extX = 5;
                        xfrm.extY = 5;
                    }
                }
                else {
                    xfrm = new CXfrm();
                    xfrm.offX = 0;
                    xfrm.offY = 0;
                    xfrm.extX = 5;
                    xfrm.extY = 5;
                }
            }
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx * xfrm.extX;
            this.extY = scale_scale_coefficients.cy * xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        this.localX = this.x;
        this.localY = this.y;
        transform.Reset();
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(transform, -hc, -vc);
        if (this.flipH)
            global_MatrixTransformer.ScaleAppend(transform, -1, 1);
        if (this.flipV)
            global_MatrixTransformer.ScaleAppend(transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(transform, this.x + hc, this.y + vc);
        if (isRealObject(this.group)) {
            global_MatrixTransformer.MultiplyAppend(transform, this.group.getLocalTransform());
        }
        this.localTransform = transform;
        this.transform = transform;
    },

    updateInterfaceTextState: function () {
        var _b_no_change_indent;
        if (this.isPlaceholder()) {
            var _ph_type = this.getPhType();
            _b_no_change_indent = _ph_type === phType_title || _ph_type === phType_ctrTitle || _ph_type === phType_chart
                || _ph_type === phType_pic || _ph_type === phType_clipArt || _ph_type === phType_dgm
                || _ph_type === phType_dgm;
        }
        else {
            _b_no_change_indent = false;
        }
        if (this.txBody !== null && typeof this.txBody === "object") {
            if (this.txBody.content !== null && typeof this.txBody.content === "object") {
                var _content = this.txBody.content;
                if (typeof _content.Document_UpdateInterfaceState === "function") {
                    _content.Document_UpdateInterfaceState();
                }
                if (typeof _content.canIncreaseIndent === "function" && _b_no_change_indent === false) {
                    editor.asc_fireCallback("asc_canIncreaseIndent", _content.canIncreaseIndent(true));
                    editor.asc_fireCallback("asc_canDecreaseIndent", _content.canIncreaseIndent(false));
                    return;
                }
            }
        }
        editor.asc_fireCallback("asc_canIncreaseIndent", false);
        editor.asc_fireCallback("asc_canDecreaseIndent", false);
    },

    getTransformMatrix: function ()
    {
        return this.transform;
    },

    getTransform: function () {

        return { x: this.x, y: this.y, extX: this.extX, extY: this.extY, rot: this.rot, flipH: this.flipH, flipV: this.flipV };
    },

    getRotateTrackObject: function () {
        return new RotateTrackShape(this);
    },

    getResizeTrackObject: function (cardDirection) {
        return new CResizeShapeTrack(this, cardDirection);
    },

    getCardDirection: function (num) {

    },

    getAngle: function (x, y) {
        var px = this.invertTransform.TransformPointX(x, y);
        var py = this.invertTransform.TransformPointY(x, y);
        return Math.PI * 0.5 + Math.atan2(px - this.extX * 0.5, py - this.extY * 0.5);
    },

    recalculateCursorTypes: function () {
        var transform_matrix = this.getTransformMatrix();
        var transform = this.getTransformMatrix();
        var hc = transform.extX * 0.5;
        var vc = transform.extY * 0.5;
        var xc = transform_matrix.TransformPointX(hc, vc);
        var yc = transform_matrix.TransformPointY(hc, vc);
        var xt = transform_matrix.TransformPointX(hc, 0);
        var yt = transform_matrix.TransformPointY(hc, 0);
        var vx = xt - xc;
        var vy = yc - yt;
        var angle = Math.atan2(vy, vx) + Math.PI / 8;
        while (angle < 0)
            angle += 2 * Math.PI;
        while (angle >= 2 * Math.PI)
            angle -= 2 * Math.PI;

        var xlt = transform_matrix.TransformPointX(0, 0);
        var ylt = transform_matrix.TransformPointY(0, 0);
        var vx_lt = xlt - xc;
        var vy_lt = yc - ylt;
        var _index = Math.floor(angle / (Math.PI / 4));
        var _index2, t;
        if (vx_lt * vy - vx * vy_lt < 0) // нумерация якорьков по часовой стрелке
        {
            for (var i = 0; i < 8; ++i) {
                t = i - _index + 17;
                _index2 = t - ((t / 8) >> 0) * 8;
                this.cursorTypes[i] = DEFAULT_CURSOR_TYPES[_index2];
            }
        }
        else {
            for (i = 0; i < 8; ++i) {
                t = -i - _index + 19;
                _index2 = t - ((t / 8) >> 0) * 8;
                this.cursorTypes[i] = DEFAULT_CURSOR_TYPES[_index2];
            }
        }
        this.recalcInfo.recalculateCursorTypes = false;
    },

    recalculateGeometry: function () {
        if (this.spPr && isRealObject(this.spPr.geometry)) {
            var transform = this.getTransform();
            this.spPr.geometry.Recalculate(transform.extX, transform.extY);
        }
    },
    drawAdjustments: function (drawingDocument) {
        if (this.spPr && isRealObject(this.spPr.geometry)) {
            this.spPr.geometry.drawAdjustments(drawingDocument, this.transform);
        }
    },

    getCardDirectionByNum: function (num) {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if (same_flip)
            return ((num - num_north) + CARD_DIRECTION_N + 8) % 8;

        return (CARD_DIRECTION_N - (num - num_north) + 8) % 8;
    },

    getNumByCardDirection: function (cardDirection) {
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        var transform = this.getTransformMatrix();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);

        var north_number;
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        switch (Math.min(y1, y3, y5, y7)) {
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

        if (same_flip)
            return (north_number + cardDirection) % 8;
        return (north_number - cardDirection + 8) % 8;
    },

    getResizeCoefficients: function (numHandle, x, y) {
        var cx, cy;
        cx = this.extX > 0 ? this.extX : 0.01;
        cy = this.extY > 0 ? this.extY : 0.01;

        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);

        switch (numHandle) {
            case 0:
                return { kd1: (cx - t_x) / cx, kd2: (cy - t_y) / cy };
            case 1:
                return { kd1: (cy - t_y) / cy, kd2: 0 };
            case 2:
                return { kd1: (cy - t_y) / cy, kd2: t_x / cx };
            case 3:
                return { kd1: t_x / cx, kd2: 0 };
            case 4:
                return { kd1: t_x / cx, kd2: t_y / cy };
            case 5:
                return { kd1: t_y / cy, kd2: 0 };
            case 6:
                return { kd1: t_y / cy, kd2: (cx - t_x) / cx };
            case 7:
                return { kd1: (cx - t_x) / cx, kd2: 0 };
        }
        return { kd1: 1, kd2: 1 };
    },


    select: function (drawingObjectsController, pageIndex)
    {
        this.selected = true;
        this.selectStartPage = pageIndex;
        var content = this.getDocContent && this.getDocContent();
        if(content)
            content.Set_StartPage(pageIndex);
        var selected_objects;
        if (!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (selected_objects[i] === this)
                break;
        }
        if (i === selected_objects.length)
            selected_objects.push(this);
    },

    deselect: function (drawingObjectsController) {
        this.selected = false;
        this.addTextFlag = false;
        var selected_objects;
        if (!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (selected_objects[i] === this) {
                selected_objects.splice(i, 1);
                break;
            }
        }
        return this;
    },

    getMainGroup: function () {
        if (!isRealObject(this.group))
            return null;

        var cur_group = this.group;
        while (isRealObject(cur_group.group))
            cur_group = cur_group.group;
        return cur_group;
    },

    getGroupHierarchy: function () {
        if (this.recalcInfo.recalculateGroupHierarchy) {
            this.groupHierarchy = [];
            if (isRealObject(this.group)) {
                var parent_group_hierarchy = this.group.getGroupHierarchy();
                for (var i = 0; i < parent_group_hierarchy.length; ++i) {
                    this.groupHierarchy.push(parent_group_hierarchy[i]);
                }
                this.groupHierarchy.push(this.group);
            }
            this.recalcInfo.recalculateGroupHierarchy = false;
        }
        return this.groupHierarchy;
    },

    checkHitToBounds: function(x, y)
    {
        if(this.getObjectType() === historyitem_type_ImageShape && this.parent && this.parent.isShapeChild())
        {
            return true;
        }
        var _x, _y;
        if(isRealNumber(this.posX) && isRealNumber(this.posY))
        {
            _x = x - this.posX - this.bounds.x;
            _y = y - this.posY - this.bounds.y;
        }
        else
        {
            _x = x - this.bounds.x;
            _y = y - this.bounds.y;
        }
        var delta = BOUNDS_DELTA + (this.pen && isRealNumber(this.pen.w) ? this.pen.w/36000 : 0);
        return _x >= -delta && _x <= this.bounds.w + delta && _y >= -delta && _y <= this.bounds.h + delta;

    },

    hitToAdj: function (x, y) {
        if (this.spPr && isRealObject(this.spPr.geometry)) {
            var px, py;
            px = this.invertTransform.TransformPointX(x, y);
            py = this.invertTransform.TransformPointY(x, y);
            return this.spPr.geometry.hitToAdj(px, py);
        }
        return { hit: false, num: -1, polar: false };
    },



    hitToPath: function (x, y) {

        if (this.spPr &&  isRealObject(this.spPr.geometry) && this.checkHitToBounds(x, y)) {
            var px = this.invertTransform.TransformPointX(x, y);
            var py = this.invertTransform.TransformPointY(x, y);
            return this.spPr.geometry.hitInPath(this.getDrawingDocument().CanvasHitContext, px, py);
        }
        return false;
    },

    hitToInnerArea: function (x, y) {
        if (this.spPr &&  isRealObject(this.spPr.geometry) && this.checkHitToBounds(x, y)) {
            var px = this.invertTransform.TransformPointX(x, y);
            var py = this.invertTransform.TransformPointY(x, y);
            return this.spPr.geometry.hitInInnerArea(this.getDrawingDocument().CanvasHitContext, px, py);
        }
        return false;
    },

    hitToTextRect: function (x, y) {
        if (isRealObject(this.txBody) && this.invertTransformText) {
            var px = this.invertTransformText.TransformPointX(x, y);
            var py = this.invertTransformText.TransformPointY(x, y);
            return this.txBody.hitToRect(px, py);
        }
        return false;
    },

    hitToBoundsRect: function (x, y) {
        return false;
    },

    hitInTextRect: function (x, y) {
        var tx_body = this.bWordShape ? this : this.txBody;
        var content = this.getDocContent && this.getDocContent();
        if (isRealObject(tx_body) && content && this.invertTransformText) {

            var t_x, t_y;
            t_x = this.invertTransformText.TransformPointX(x, y);
            t_y = this.invertTransformText.TransformPointY(x, y);
            return t_x > 0 && t_x < tx_body.contentWidth && t_y > 0 && t_y < tx_body.contentHeight;
        }
        return false;
    },

    setAdjustmentValue: function (ref1, value1, ref2, value2) {
        if (this.spPr && isRealObject(this.spPr.geometry)) {
            var old_geometry = this.spPr.geometry.createDuplicate();
            this.spPr.geometry.setGuideValue(ref1, value1);
            this.spPr.geometry.setGuideValue(ref2, value2);
            var new_geometry = this.spPr.geometry.createDuplicate();
            History.Add(this, { Type: historyitem_SetShapeSetGeometry, oldGeometry: old_geometry, newGeometry: new_geometry });
            this.recalcInfo.recalculateGeometry = true;
        }
    },

    updateCursorType: function (x, y, e) {
        if(this.invertTransformText)
        {
            var tx = this.invertTransformText.TransformPointX(x, y);
            var ty = this.invertTransformText.TransformPointY(x, y);
            var page_num = this.parent instanceof Slide ? this.parent.num : 0;
            this.txBody.content.Update_CursorType(tx, ty, page_num);
        }
    },


    sendMouseData: function () {
        if (true === this.Lock.Is_Locked()) {
            var MMData = new CMouseMoveData();
            var Coords = editor.WordControl.m_oLogicDocument.DrawingDocument.ConvertCoordsToCursorWR(this.x, this.y, this.parent.num, null);
            MMData.X_abs = Coords.X - 5;
            MMData.Y_abs = Coords.Y;
            MMData.Type = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId = this.Lock.Get_UserId();
            MMData.HaveChanges = this.Lock.Have_Changes();
            MMData.LockedObjectType = 0;
            editor.sync_MouseMoveCallback(MMData);
        }
    },

    selectionSetStart: function (e, x, y, slideIndex) {

        var content = this.getDocContent();
        if (isRealObject(content)) {
            var tx, ty;
            tx = this.invertTransformText.TransformPointX(x, y);
            ty = this.invertTransformText.TransformPointY(x, y);
            if(e.Button === g_mouse_button_right)
            {
                if(content.Selection_Check(tx, ty, 0))
                {
                    this.rightButtonFlag = true;
                    return;
                }
            }
            if(!(content.Is_TextSelectionUse() && e.ShiftKey))
                content.Selection_SetStart(tx, ty, slideIndex, e);
            else
                content.Selection_SetEnd(tx, ty, slideIndex, e);

        }
    },

    selectionSetEnd: function (e, x, y, slideIndex)
    {
        var content = this.getDocContent();
        if (isRealObject(content)) {
            var tx, ty;
            tx = this.invertTransformText.TransformPointX(x, y);
            ty = this.invertTransformText.TransformPointY(x, y);
            if(!(e.Type === g_mouse_event_type_up && this.rightButtonFlag))
            {
                content.Selection_SetEnd(tx, ty, slideIndex, e);
            }
        }
        delete this.rightButtonFlag;
    },

    Get_Theme: function()
    {
        return this.getParentObjects().theme;
    },

    updateSelectionState: function ()
    {
        var drawing_document = this.getDrawingDocument();
        if(drawing_document)
        {
            var content = this.getDocContent();
            if(content)
            {
                drawing_document.UpdateTargetTransform(this.transformText);
                if ( true === content.Is_SelectionUse() )
                {
                    // Выделение нумерации
                    if ( selectionflag_Numbering == content.Selection.Flag )
                    {
                        drawing_document.TargetEnd();
                        drawing_document.SelectEnabled(true);
                        drawing_document.SelectClear();
                        drawing_document.SelectShow();
                    }
                    // Обрабатываем движение границы у таблиц
                    else if ( null != content.Selection.Data && true === content.Selection.Data.TableBorder && type_Table == content.Content[content.Selection.Data.Pos].GetType() )
                    {
                        // Убираем курсор, если он был
                        drawing_document.TargetEnd();
                    }
                    else
                    {
                        if ( false === content.Selection_IsEmpty() )
                        {
                            drawing_document.TargetEnd();
                            drawing_document.SelectEnabled(true);
                            drawing_document.SelectClear();
                            drawing_document.SelectShow();
                        }
                        else
                        {
                            drawing_document.SelectEnabled(false);
                            content.RecalculateCurPos();

                            drawing_document.TargetStart();
                            drawing_document.TargetShow();
                        }
                    }
                }
                else
                {
                    drawing_document.SelectEnabled(false);
                    content.RecalculateCurPos();

                    drawing_document.TargetStart();
                    drawing_document.TargetShow();
                }
            }
            else
            {
                drawing_document.UpdateTargetTransform(new CMatrix());
                drawing_document.TargetEnd();
                drawing_document.SelectEnabled(false);
                drawing_document.SelectClear();
                drawing_document.SelectShow();
            }
        }
    },


    setXfrm: function (offX, offY, extX, extY, rot, flipH, flipV) {
        if (this.spPr.xfrm.isNotNull()) {
            if (isRealNumber(offX) && isRealNumber(offY))
                this.setOffset(offX, offY);

            if (isRealNumber(extX) && isRealNumber(extY))
                this.setExtents(extX, extY);

            if (isRealNumber(rot))
                this.setRotate(rot);

            if (isRealBool(flipH) && isRealBool(flipV))
                this.setFlips(flipH, flipV);
        }
        else {
            var transform = this.getTransform();
            if (isRealNumber(offX) && isRealNumber(offY))
                this.setOffset(offX, offY);
            else
                this.setOffset(transform.x, transform.y);

            if (isRealNumber(extX) && isRealNumber(extY))
                this.setExtents(extX, extY);
            else
                this.setExtents(transform.extX, transform.extY);

            if (isRealNumber(rot))
                this.setRotate(rot);
            else
                this.setRotate(transform.rot);
            if (isRealBool(flipH) && isRealBool(flipV))
                this.setFlips(flipH, flipV);
            else
                this.setFlips(transform.flipH, transform.flipV);
        }
    },

    normalize: function () {
        var new_off_x, new_off_y, new_ext_x, new_ext_y;
        var xfrm = this.spPr.xfrm;
        if (!isRealObject(this.group)) {
            new_off_x = xfrm.offX;
            new_off_y = xfrm.offY;
            new_ext_x = xfrm.extX;
            new_ext_y = xfrm.extY;
        }
        else {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            new_off_x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            new_off_y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            new_ext_x = scale_scale_coefficients.cx * xfrm.extX;
            new_ext_y = scale_scale_coefficients.cy * xfrm.extY;
        }
        var xfrm = this.spPr.xfrm;
        xfrm.setOffX(new_off_x);
        xfrm.setOffY(new_off_y);
        xfrm.setExtX(new_ext_x);
        xfrm.setExtY(new_ext_y);
    },

    check_bounds: function (checker) {
        if (this.spPr && this.spPr.geometry) {
            this.spPr.geometry.check_bounds(checker);
        }
        else {
            checker._s();
            checker._m(0, 0);
            checker._l(this.extX, 0);
            checker._l(this.extX, this.extY);
            checker._l(0, this.extY);
            checker._z();
            checker._e();
        }
    },


    getBase64Img: function () {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },



    addNewParagraph: function () {
        if (!isRealObject(this.txBody)) {
            this.addTextBody(new CTextBody(this));
            this.recalculateContent();
        }
        else {
            this.txBody.content.Add_NewParagraph(false);
            //this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            this.txBody.bRecalculateNumbering = true;
        }
    },

    paragraphFormatPaste: function (CopyTextPr, CopyParaPr, Bool) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool);

            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }

    },

    setParagraphAlign: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphAlign(val);
            //this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    applyAllAlign: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Set_ParagraphAlign(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    setParagraphSpacing: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphSpacing(val);
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    setParagraphTabs: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphTabs(val);
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    applyAllSpacing: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Set_ParagraphSpacing(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    setParagraphNumbering: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphNumbering(val);
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    applyAllNumbering: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Set_ParagraphNumbering(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    setParagraphIndent: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphIndent(val);
            this.txBody.bRecalculateNumbering = true;
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    applyAllIndent: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Set_ParagraphIndent(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    Paragraph_IncDecFontSize: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Paragraph_IncDecFontSize(val);
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    Paragraph_IncDecFontSizeAll: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Paragraph_IncDecFontSize(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    Cursor_MoveToStartPos: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveToStartPos();
            this.txBody.content.RecalculateCurPos();

        }
    },

    Cursor_MoveToEndPos: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveToEndPos();
            this.txBody.content.RecalculateCurPos();

        }
    },

    Cursor_MoveLeft: function (AddToSelect, Word) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveLeft(AddToSelect, Word);
            this.txBody.content.RecalculateCurPos();

        }
    },

    Cursor_MoveRight: function (AddToSelect, Word) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveRight(AddToSelect, Word);
            this.txBody.content.RecalculateCurPos();

        }
    },

    Cursor_MoveUp: function (AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveUp(AddToSelect);
            this.txBody.content.RecalculateCurPos();

        }
    },

    Cursor_MoveDown: function (AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveDown(AddToSelect);
            this.txBody.content.RecalculateCurPos();

        }
    },

    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveEndOfLine(AddToSelect);
            this.txBody.content.RecalculateCurPos();

        }
    },

    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveStartOfLine(AddToSelect);
            this.txBody.content.RecalculateCurPos();

        }
    },

    Cursor_MoveAt: function (X, Y, AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveAt(X, Y, AddToSelect);
            this.txBody.content.RecalculateCurPos();

        }
    },


    addTextBody: function (txBody) {
    },

    recalculateCurPos: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.content.RecalculateCurPos();
        }
    },

    onParagraphChanged: function () {
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateTransformText = true;
    },

    isSimpleObject: function () {
        return true;
    },


    getSearchResults: function (str, ownNum)//возвращает массив SelectionState'ов
    {
        var documentContentSelectionStates = this.txBody ? this.txBody.getSearchResults(str) : [];
        if (documentContentSelectionStates.length > 0) {
            var arrSelSt = [];
            for (var i = 0; i < documentContentSelectionStates.length; ++i) {

                var s = {};
                if (!isRealObject(this.group)) {
                    s.id = STATES_ID_TEXT_ADD;
                    s.textObject = this;
                    s.textSelectionState = documentContentSelectionStates[i];
                }
                else {
                    s.id = STATES_ID_TEXT_ADD_IN_GROUP;
                    var group = this.group;
                    while (group.group)
                        group = group.group;
                    s.group = group;
                    s.textObject = this;
                    s.textSelectionState = documentContentSelectionStates[i];
                }
                arrSelSt.push(s);
            }
            return arrSelSt;
        }
        else {
            return null;
        }
    },

    draw: function (graphics, transform, transformText, pageIndex) {

        if(graphics.updatedRect && this.bounds)
        {
            var rect = graphics.updatedRect;
            var bounds = this.bounds;
            if(bounds.x > rect.x + rect.w
                || bounds.y > rect.y + rect.h
                || bounds.x + bounds.w < rect.x
                || bounds.y + bounds.h < rect.y)
                return;
        }
        var _transform = transform ? transform : this.transform;
        var _transform_text = transformText ? transformText : this.transformText;
        if (graphics.IsSlideBoundsCheckerType === true) {
            graphics.transform3(_transform);
            if (!this.spPr || null == this.spPr.geometry || !graphics.IsShapeNeedBounds(this.spPr.geometry.preset)) {
                graphics._s();
                graphics._m(0, 0);
                graphics._l(this.extX, 0);
                graphics._l(this.extX, this.extY);
                graphics._l(0, this.extY);
                graphics._e();
            }
            else {
                this.spPr.geometry.check_bounds(graphics);
            }

            if (this.txBody) {
                graphics.SetIntegerGrid(false);

                var transform_text;
                if ((!this.txBody.content || this.txBody.content.Is_Empty()) && this.txBody.content2 != null && !this.addTextFlag && (this.isEmptyPlaceholder ? this.isEmptyPlaceholder() : false) && this.transformText2) {
                    transform_text = this.transformText2;
                }
                else if (this.txBody.content) {
                    transform_text = _transform_text;
                }

                graphics.transform3(transform_text);

                if (graphics.CheckUseFonts2 !== undefined)
                    graphics.CheckUseFonts2(transform_text);
                this.txBody.draw(graphics);
                if (graphics.UncheckUseFonts2 !== undefined)
                    graphics.UncheckUseFonts2(transform_text);
                graphics.SetIntegerGrid(true);
            }

            graphics.reset();
            return;
        }

        if (this.spPr && this.spPr.geometry || this.style || (this.brush && this.brush.fill) || (this.pen && this.pen.Fill && this.pen.Fill.fill)) {
            graphics.SetIntegerGrid(false);
            graphics.transform3(_transform, false);

            var shape_drawer = new CShapeDrawer();
            shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
            shape_drawer.draw(this.spPr.geometry);
        }
        if (this.isEmptyPlaceholder() && graphics.IsNoDrawingEmptyPlaceholder !== true) {
            if (graphics.m_oContext !== undefined && graphics.IsTrack === undefined && !this.addTextFlag) {
                if (global_MatrixTransformer.IsIdentity2(_transform)) {
                    graphics.transform3(_transform, false);
                    var tr = graphics.m_oFullTransform;
                    graphics.SetIntegerGrid(true);

                    var _x = tr.TransformPointX(0, 0);
                    var _y = tr.TransformPointY(0, 0);
                    var _r = tr.TransformPointX(this.extX, this.extY);
                    var _b = tr.TransformPointY(this.extX, this.extY);

                    graphics.m_oContext.lineWidth = 1;
                    graphics.p_color(127, 127, 127, 255);

                    graphics._s();
                    editor.WordControl.m_oDrawingDocument.AutoShapesTrack.AddRectDashClever(graphics.m_oContext, _x >> 0, _y >> 0, _r >> 0, _b >> 0, 2, 2);
                    graphics.ds();
                }
                else {
                    graphics.transform3(_transform, false);
                    var tr = graphics.m_oFullTransform;
                    graphics.SetIntegerGrid(true);

                    var _r = this.extX;
                    var _b = this.extY;

                    var x1 = tr.TransformPointX(0, 0) >> 0;
                    var y1 = tr.TransformPointY(0, 0) >> 0;

                    var x2 = tr.TransformPointX(_r, 0) >> 0;
                    var y2 = tr.TransformPointY(_r, 0) >> 0;

                    var x3 = tr.TransformPointX(0, _b) >> 0;
                    var y3 = tr.TransformPointY(0, _b) >> 0;

                    var x4 = tr.TransformPointX(_r, _b) >> 0;
                    var y4 = tr.TransformPointY(_r, _b) >> 0;

                    graphics.m_oContext.lineWidth = 1;
                    graphics.p_color(127, 127, 127, 255);

                    graphics._s();
                    editor.WordControl.m_oDrawingDocument.AutoShapesTrack.AddRectDash(graphics.m_oContext, x1, y1, x2, y2, x3, y3, x4, y4, 3, 1);
                    graphics.ds();
                }
            }
            else {
                graphics.SetIntegerGrid(false);
                graphics.p_width(70);
                graphics.transform3(_transform, false);
                graphics.p_color(0, 0, 0, 255);
                graphics._s();
                graphics._m(0, 0);
                graphics._l(this.extX, 0);
                graphics._l(this.extX, this.extY);
                graphics._l(0, this.extY);
                graphics._z();
                graphics.ds();

                graphics.SetIntegerGrid(true);
            }
        }

        if (this.txBody) {

            graphics.SaveGrState();
            graphics.SetIntegerGrid(false);
            var transform_text;
            if ((!this.txBody.content || this.txBody.content.Is_Empty()) && this.txBody.content2 != null && !this.addTextFlag && (this.isEmptyPlaceholder ? this.isEmptyPlaceholder() : false) && this.transformText2) {
                transform_text = this.transformText2;
            }
            else if (this.txBody.content) {
                transform_text = _transform_text;
            }
            var clip_rect = this.clipRect;
            var bodyPr = this.txBody.bodyPr;
            if(clip_rect)
            {
                if(!bodyPr || !bodyPr.upright)
                {
                    graphics.transform3(this.transform);
                    graphics.AddClipRect(clip_rect.x, clip_rect.y, clip_rect.w, clip_rect.h);
                    graphics.transform3(transform_text, true);
                }
                else
                {
                    graphics.transform3(transform_text, true);
                    graphics.AddClipRect(clip_rect.x, clip_rect.y, clip_rect.w, clip_rect.h);
                }
            }
            else
            {
                graphics.transform3(transform_text, true);
            }
            if (graphics.CheckUseFonts2 !== undefined)
                graphics.CheckUseFonts2(transform_text);
            this.txBody.draw(graphics);
            if (graphics.UncheckUseFonts2 !== undefined)
                graphics.UncheckUseFonts2(transform_text);
            graphics.RestoreGrState();
            /*if (graphics.FreeFont !== undefined)
             graphics.FreeFont(); */

            /*var _masrgins = this.getMargins();
             graphics.reset();
             graphics.SetIntegerGrid(false);
             graphics.p_width(70);
             graphics.transform3(this.TransformTextMatrix);
             graphics.p_color(0,0,0,255);
             graphics._s();
             graphics._m(_masrgins.L*100, _masrgins.T*100);
             graphics._l(_masrgins.R*100, _masrgins.T*100);
             graphics._l(_masrgins.R*100, _masrgins.B*100);
             graphics._l(_masrgins.L*100, _masrgins.B*100);
             graphics._z();
             graphics.ds();        */

        }

        if(this.textBoxContent && !graphics.IsNoSupportTextDraw && this.transformText)
        {
            var old_start_page = this.textBoxContent.Get_StartPage_Relative();
            this.textBoxContent.Set_StartPage(pageIndex);

            var clip_rect = this.clipRect;
            if(!this.bodyPr.upright)
            {
                graphics.SaveGrState();

                graphics.SetIntegerGrid(false);
                graphics.transform3(this.transform);
                graphics.AddClipRect(clip_rect.x, clip_rect.y, clip_rect.w, clip_rect.h);

                graphics.SetIntegerGrid(false);
                graphics.transform3(this.transformText, true);
            }
            else
            {
                graphics.SaveGrState();
                graphics.SetIntegerGrid(false);
                graphics.transform3(this.transformText, true);
                graphics.AddClipRect(clip_rect.x, clip_rect.y, clip_rect.w, clip_rect.h);
            }
            var result_page_index = isRealNumber(graphics.shapePageIndex) ? graphics.shapePageIndex : old_start_page;

            if (graphics.CheckUseFonts2 !== undefined)
                graphics.CheckUseFonts2(this.transformText);

            if (window.IsShapeToImageConverter)
            {
                this.textBoxContent.Set_StartPage(0);
                result_page_index = 0;
            }


            this.textBoxContent.Set_StartPage(result_page_index);
            this.textBoxContent.Draw(result_page_index, graphics);

            if (graphics.UncheckUseFonts2 !== undefined)
                graphics.UncheckUseFonts2();

            this.textBoxContent.Set_StartPage(old_start_page);

            graphics.RestoreGrState();
        }


        if (this.Lock && locktype_None != this.Lock.Get_Type())
        {
            graphics.transform3(_transform);
            graphics.SetIntegerGrid(false);
            graphics.DrawLockObjectRect(this.Lock.Get_Type(), 0, 0, this.extX, this.extY);
        }
        graphics.SetIntegerGrid(true);
        graphics.reset();
    },

    getRotateAngle: function (x, y) {
        var transform = this.getTransformMatrix();
        var rotate_distance = this.convertPixToMM(TRACK_DISTANCE_ROTATE);
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        var xc_t = transform.TransformPointX(hc, vc);
        var yc_t = transform.TransformPointY(hc, vc);
        var rot_x_t = transform.TransformPointX(hc, -rotate_distance);
        var rot_y_t = transform.TransformPointY(hc, -rotate_distance);

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
        var angle = rel_x > this.extX * 0.5 ? Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y) : -Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y);
        return same_flip ? angle : -angle;
    },

    getFullFlipH: function () {
        if (!isRealObject(this.group))
            return this.flipH;
        return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    },

    getFullFlipV: function () {
        if (!isRealObject(this.group))
            return this.flipV;
        return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    },

    getAspect: function (num) {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },

    getFullRotate: function () {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    },

    getRectBounds: function () {
        var transform = this.getTransformMatrix();
        var w = this.extX;
        var h = this.extY;
        var rect_points = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h}];
        var min_x, max_x, min_y, max_y;
        min_x = transform.TransformPointX(rect_points[0].x, rect_points[0].y);
        min_y = transform.TransformPointY(rect_points[0].x, rect_points[0].y);
        max_x = min_x;
        max_y = min_y;
        var cur_x, cur_y;
        for (var i = 1; i < 4; ++i) {
            cur_x = transform.TransformPointX(rect_points[i].x, rect_points[i].y);
            cur_y = transform.TransformPointY(rect_points[i].x, rect_points[i].y);
            if (cur_x < min_x)
                min_x = cur_x;
            if (cur_x > max_x)
                max_x = cur_x;

            if (cur_y < min_y)
                min_y = cur_y;
            if (cur_y > max_y)
                max_y = cur_y;
        }
        return { minX: min_x, maxX: max_x, minY: min_y, maxY: max_y };
    },

    getRectForGrouping: function () {

    },

    getInvertTransform: function ()
    {
        return this.invertTransform ? this.invertTransform : new CMatrix();
    },

    calculateSnapArrays: function(snapArrayX, snapArrayY)
    {
        var t = this.transform;
        snapArrayX.push(t.TransformPointX(0, 0));
        snapArrayY.push(t.TransformPointY(0, 0));
        snapArrayX.push(t.TransformPointX(this.extX, 0));
        snapArrayY.push(t.TransformPointY(this.extX, 0));

        snapArrayX.push(t.TransformPointX(this.extX*0.5, this.extY*0.5));
        snapArrayY.push(t.TransformPointY(this.extX*0.5, this.extY*0.5));
        snapArrayX.push(t.TransformPointX(this.extX, this.extY));
        snapArrayY.push(t.TransformPointY(this.extX, this.extY));
        snapArrayX.push(t.TransformPointX(0, this.extY));
        snapArrayY.push(t.TransformPointY(0, this.extY));
    },

    getFullOffset: function () {
        if (!isRealObject(this.group))
            return { offX: this.x, offY: this.y };
        var group_offset = this.group.getFullOffset();
        return { offX: this.x + group_offset.offX, offY: this.y + group_offset.offY };
    },

    getPresetGeom: function () {
        if (this.spPr && this.spPr.geometry) {
            return this.spPr.geometry.preset;
        }
        else {
            return null;
        }
    },

    getFill: function () {
        return this.brush;
    },

    getStroke: function () {
        return this.pen;
    },

    canChangeArrows: function () {
        if (!this.spPr || this.spPr.geometry == null) {
            return false;
        }
        var _path_list = this.spPr.geometry.pathLst;
        var _path_index;
        var _path_command_index;
        var _path_command_arr;
        for (_path_index = 0; _path_index < _path_list.length; ++_path_index) {
            _path_command_arr = _path_list[_path_index].ArrPathCommandInfo;
            for (_path_command_index = 0; _path_command_index < _path_command_arr.length; ++_path_command_index) {
                if (_path_command_arr[_path_command_index].id == 5) {
                    break;
                }
            }
            if (_path_command_index == _path_command_arr.length) {
                return true;
            }
        }
        return false;
    },

    getParagraphParaPr: function () {
        if (this.txBody && this.txBody.content) {
            var _result;
            this.txBody.content.Set_ApplyToAll(true);
            _result = this.txBody.content.Get_Paragraph_ParaPr();
            this.txBody.content.Set_ApplyToAll(false);
            return _result;
        }
        return null;
    },

    getParagraphTextPr: function () {
        if (this.txBody && this.txBody.content) {
            var _result;
            this.txBody.content.Set_ApplyToAll(true);
            _result = this.txBody.content.Get_Paragraph_TextPr();
            this.txBody.content.Set_ApplyToAll(false);
            return _result;
        }
        return null;
    },

    getAllRasterImages: function(images)
    {
        if(this.spPr && this.spPr.Fill && this.spPr.Fill.fill && typeof this.spPr.Fill.fill.RasterImageId === "string" && this.spPr.Fill.fill.RasterImageId.length > 0)
            images.push(this.spPr.Fill.fill.RasterImageId);
    },

    changePresetGeom: function (sPreset) {


        if(sPreset === "textRect")
        {
            this.spPr.setGeometry(CreateGeometry("rect"));
            this.spPr.geometry.setParent(this.spPr);
            this.setStyle(CreateDefaultTextRectStyle());
            var fill = new CUniFill();
            fill.setFill(new CSolidFill());
            fill.fill.setColor(new CUniColor());
            fill.fill.color.setColor(new CSchemeColor());
            fill.fill.color.color.setId(12);
            this.spPr.setFill(fill);

            var ln = new CLn();
            ln.setW(6350);
            ln.setFill(new CUniFill());
            ln.Fill.setFill(new CSolidFill());
            ln.Fill.fill.setColor(new CUniColor());
            ln.Fill.fill.color.setColor(new CPrstColor());
            ln.Fill.fill.color.color.setId("black");
            this.spPr.setLn(ln);
            if(this.bWordShape)
            {
                if(!this.textBoxContent)
                {
                    this.setTextBoxContent(new CDocumentContent(this, this.getDrawingDocument(), 0, 0, 0, 0, false, false, false));
                    var body_pr = new CBodyPr();
                    body_pr.setDefault();
                    this.setBodyPr(body_pr);
                }
            }
            else
            {
                if(!this.txBody)
                {
                    this.setTxBody(new CTextBody());
                    var content = new CDocumentContent(this.txBody, this.getDrawingDocument(), 0, 0, 0, 0, false, false, true);
                    this.txBody.setParent(this);
                    this.txBody.setContent(content);
                    var body_pr = new CBodyPr();
                    body_pr.setDefault();
                    this.txBody.setBodyPr(body_pr);
                }
            }
            return;
        }
        var _final_preset;
        var _old_line;
        var _new_line;


        if (this.spPr.ln == null) {
            _old_line = null;
        }
        else {
            _old_line = this.spPr.ln.createDuplicate();
        }
        switch (sPreset) {
            case "lineWithArrow":
            {
                _final_preset = "line";
                if (_old_line == null) {
                    _new_line = new CLn();
                }
                else {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;
                break;
            }
            case "lineWithTwoArrows":
            {
                _final_preset = "line";
                if (_old_line == null) {
                    _new_line = new CLn();

                }
                else {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;

                _new_line.headEnd = new EndArrow();
                _new_line.headEnd.type = LineEndType.Arrow;
                _new_line.headEnd.len = LineEndSize.Mid;
                _new_line.headEnd.w = LineEndSize.Mid;
                break;
            }
            case "bentConnector5WithArrow":
            {
                _final_preset = "bentConnector5";
                if (_old_line == null) {
                    _new_line = new CLn();

                }
                else {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;
                break;
            }
            case "bentConnector5WithTwoArrows":
            {
                _final_preset = "bentConnector5";
                if (_old_line == null) {
                    _new_line = new CLn();

                }
                else {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;

                _new_line.headEnd = new EndArrow();
                _new_line.headEnd.type = LineEndType.Arrow;
                _new_line.headEnd.len = LineEndSize.Mid;
                _new_line.headEnd.w = LineEndSize.Mid;
                break;
            }
            case "curvedConnector3WithArrow":
            {
                _final_preset = "curvedConnector3";
                if (_old_line == null) {
                    _new_line = new CLn();

                }
                else {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;
                break;
            }
            case "curvedConnector3WithTwoArrows":
            {
                _final_preset = "curvedConnector3";
                if (_old_line == null) {
                    _new_line = new CLn();

                }
                else {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.Arrow;
                _new_line.tailEnd.len = LineEndSize.Mid;
                _new_line.tailEnd.w = LineEndSize.Mid;

                _new_line.headEnd = new EndArrow();
                _new_line.headEnd.type = LineEndType.Arrow;
                _new_line.headEnd.len = LineEndSize.Mid;
                _new_line.headEnd.w = LineEndSize.Mid;
                break;
            }
            default:
            {
                _final_preset = sPreset;
                if (_old_line == null) {
                    _new_line = new CLn();
                }
                else {
                    _new_line = this.spPr.ln.createDuplicate();
                }
                _new_line.tailEnd = null;

                _new_line.headEnd = null;
                break;
            }
        }
        if (_final_preset != null) {
            this.spPr.setGeometry(CreateGeometry(_final_preset));
            if(this.spPr.geometry)
            {
                this.spPr.geometry.setParent(this.spPr);
            }
        }
        else {
            this.spPr.geometry = null;
        }
        if ((!this.brush || !this.brush.fill) && (!this.pen || !this.pen.Fill || !this.pen.Fill.fill)) {
            var new_line2 = new CLn();
            new_line2.Fill = new CUniFill();
            new_line2.Fill.fill = new CSolidFill();
            new_line2.Fill.fill.color = new CUniColor();
            new_line2.Fill.fill.color.color = new CSchemeColor();
            new_line2.Fill.fill.color.color.id = 0;
            if (isRealObject(_new_line)) {
                new_line2.merge(_new_line);
            }
            this.spPr.setLn(new_line2);
        }
        else
            this.spPr.setLn(_new_line);
    },

    setGeometry: function (geometry) {
        var old_geometry = this.spPr.geometry;
        var new_geometry = geometry;
        this.spPr.geometry = geometry;
        History.Add(this, { Type: historyitem_SetShapeSetGeometry, oldGeometry: old_geometry, newGeometry: new_geometry });
        this.recalcInfo.recalculateGeometry = true;
    },

    changeFill: function (unifill) {

        if(this.recalcInfo.recalculateBrush)
        {
            this.recalculateBrush();
        }
        var unifill2 = CorrectUniFill(unifill, this.brush);
        unifill2.convertToPPTXMods();
        this.spPr.setFill(unifill2);
    },
    setFill: function (fill) {

        this.spPr.setFill(fill);
    },

    changeLine: function (line)
    {
        if(this.recalcInfo.recalculatePen)
        {
            this.recalculatePen();
        }
        var stroke = CorrectUniStroke(line, this.pen);
        if(stroke.Fill)
        {
            stroke.Fill.convertToPPTXMods();
        }
        this.spPr.setLn(stroke);
    },

    setLine: function (line) {
        var old_line = this.spPr.ln;
        var new_line = line;
        this.spPr.ln = line;

        this.recalcInfo.recalculateLine = true;
        this.recalcInfo.recalculatePen = true;
    },


    hitToAdjustment: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        if (this.spPr && isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitToAdj(t_x, t_y, this.convertPixToMM(TRACK_CIRCLE_RADIUS));
        return { hit: false, adjPolarFlag: null, adjNum: null };
    },

    hitToHandles: function (x, y) {
        return hitToHandles(x, y, this);

    },

    hit: function (x, y) {
        return this.hitInInnerArea(x, y) || this.hitInPath(x, y) || this.hitInTextRect(x, y);
    },

    hitInPath: function (x, y) {
        if(!this.checkHitToBounds(x, y))
            return;
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr) && isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInPath(this.getCanvasContext(), x_t, y_t);
        else
            return this.hitInBoundingRect(x, y);
        return false;
    },

    hitInInnerArea: function (x, y) {
        if ((this.getObjectType && this.getObjectType() === historyitem_type_ChartSpace) || this.brush != null && this.brush.fill != null
            && this.brush.fill.type != FILL_TYPE_NOFILL && this.checkHitToBounds(x, y)) {
            var invert_transform = this.getInvertTransform();
            var x_t = invert_transform.TransformPointX(x, y);
            var y_t = invert_transform.TransformPointY(x, y);
            if (isRealObject(this.spPr) && isRealObject(this.spPr.geometry) && !(this.getObjectType && this.getObjectType() === historyitem_type_ChartSpace))
                return this.spPr.geometry.hitInInnerArea(this.getCanvasContext(), x_t, y_t);
            return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
        }
        return false;
    },


    hitInBoundingRect: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);

        var _hit_context = this.getCanvasContext();

        return !(CheckObjectLine(this)) && (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY) ||
            HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0) ||
            (this.canRotate && this.canRotate() && HitInLine(_hit_context, x_t, y_t, this.extX * 0.5, 0, this.extX * 0.5, -this.convertPixToMM(TRACK_DISTANCE_ROTATE))));
    },

    canRotate: function () {
        return true;
    },

    canResize: function () {
        return true; //TODO
    },

    canMove: function () {
        return true; //TODO
    },

    canGroup: function () {
        return !this.isPlaceholder(); //TODO
    },

    getBoundsInGroup: function () {
        return getBoundsInGroup(this);
    },

    canChangeAdjustments: function () {
        return true; //TODO
    },

    createRotateTrack: function () {
        return new RotateTrackShapeImage(this);
    },

    createResizeTrack: function (cardDirection) {
        return new ResizeTrackShapeImage(this, cardDirection);
    },

    createMoveTrack: function () {
        return new MoveShapeImageTrack(this);
    },

    createRotateInGroupTrack: function () {
        return new RotateTrackShapeImageInGroup(this);
    },

    createResizeInGroupTrack: function (cardDirection) {
        return new ResizeTrackShapeImageInGroup(this, cardDirection);
    },

    createMoveInGroupTrack: function () {
        return new MoveShapeImageTrackInGroup(this);
    },



    remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        if (this.txBody) {
            this.txBody.content.Remove(Count, bOnlyText, bRemoveOnlySelection);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },

    getTextSelectionState: function () {
        if (this.txBody) {
            return this.txBody.content.Get_SelectionState();
        }
        return [];
    },

    setTextSelectionState: function (s) {
        if (this.txBody) {
            this.txBody.content.Set_SelectionState(s, s.length - 1);
        }
    },

    Refresh_RecalcData: function (data)
    {
        //this.recalcTxBoxContent();
        //this.recalcTransformText();
        this.Refresh_RecalcData2();
    },

    Refresh_RecalcData2: function(pageIndex/*для текста*/)
    {
        this.recalcContent();
        this.recalcTransformText();
        this.addToRecalculate();
    },

    Undo: function (data)
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
            case historyitem_ShapeSetBDeleted:
            {
                this.bDeleted = data.oldPr;
                break;
            }
            case historyitem_ShapeSetNvSpPr:
            {
                this.nvSpPr = data.oldPr;
                break;
            }
            case historyitem_ShapeSetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_ShapeSetStyle:
            {
                this.style = data.oldPr;


                this.recalcInfo.recalculateShapeStyleForParagraph = true;
                if(this.recalcTextStyles)
                    this.recalcTextStyles();
                var content = this.getDocContent();
                if(content)
                {
                    content.Recalc_AllParagraphs_CompiledPr();
                }
                break;
            }
            case historyitem_ShapeSetTxBody:
            {
                this.txBody = data.oldPr;
                break;
            }
            case historyitem_ShapeSetTextBoxContent:
            {
                this.textBoxContent = data.oldPr;
                break;
            }
            case historyitem_ShapeSetParent:
            {
                this.parent = data.oldPr;
                break;
            }
            case historyitem_ShapeSetGroup:
            {
                this.group = data.oldPr;
                break;
            }
            case historyitem_ShapeSetBodyPr:
            {
                this.bodyPr = data.oldPr;
                break;
            }
            case historyitem_ShapeSetWordShape:
            {
                this.bWordShape = data.oldPr;
                break;
            }
        }
    },

    Redo: function (data)
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
            case historyitem_ShapeSetNvSpPr:
            {
                this.nvSpPr = data.newPr;
                break;
            }
            case historyitem_ShapeSetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_ShapeSetStyle:
            {
                this.style = data.newPr;
                var content = this.getDocContent();

                this.recalcInfo.recalculateShapeStyleForParagraph = true;
                if(this.recalcTextStyles)
                    this.recalcTextStyles();
                if(content)
                {
                    content.Recalc_AllParagraphs_CompiledPr();
                }
                break;
            }
            case historyitem_ShapeSetTxBody:
            {
                this.txBody = data.newPr;
                break;
            }
            case historyitem_ShapeSetTextBoxContent:
            {
                this.textBoxContent = data.newPr;
                break;
            }
            case historyitem_ShapeSetParent:
            {
                this.parent = data.newPr;
                break;
            }
            case historyitem_ShapeSetGroup:
            {
                this.group = data.newPr;
                break;
            }
            case historyitem_ShapeSetBodyPr:
            {
                this.bodyPr = data.newPr;
                break;
            }
            case historyitem_ShapeSetWordShape:
            {
                this.bWordShape = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function (data, w)
    {
        w.WriteLong(this.getObjectType());
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
                writeBool(w, isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    writeString(w, data.newPr.getId());
                }
                break;
            }
            case historyitem_ShapeSetNvSpPr:
            case historyitem_ShapeSetSpPr:
            case historyitem_ShapeSetStyle:
            case historyitem_ShapeSetTxBody:
            case historyitem_ShapeSetTextBoxContent:
            case historyitem_ShapeSetParent:
            case historyitem_ShapeSetGroup:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_ShapeSetBodyPr:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                   data.newPr.Write_ToBinary(w);
                }
                break;
            }
            case historyitem_ShapeSetWordShape:

            case historyitem_ShapeSetBDeleted:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function (r)
    {
        if (r.GetLong() === this.getObjectType())
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
                case historyitem_ShapeSetBDeleted:
                {
                    this.bDeleted = readBool(r);
                    break;
                }
                case historyitem_ShapeSetNvSpPr:
                {
                    this.nvSpPr = readObject(r);
                    break;
                }
                case historyitem_ShapeSetSpPr:
                {
                    this.spPr = readObject(r);
                    break;
                }
                case historyitem_ShapeSetStyle:
                {
                    this.style = readObject(r);
                    var content = this.getDocContent();

                    this.recalcInfo.recalculateShapeStyleForParagraph = true;
                    if(this.recalcTextStyles)
                        this.recalcTextStyles();
                    if(content)
                    {
                        content.Recalc_AllParagraphs_CompiledPr();
                    }
                    break;
                }
                case historyitem_ShapeSetTxBody:
                {
                    this.txBody = readObject(r);
                    break;
                }
                case historyitem_ShapeSetTextBoxContent:
                {
                    this.textBoxContent = readObject(r);
                    break;
                }
                case historyitem_ShapeSetParent:
                {
                    this.parent = readObject(r);
                    break;
                }
                case historyitem_ShapeSetGroup:
                {
                    this.group = readObject(r);
                    break;
                }
                case historyitem_ShapeSetBodyPr:
                {
                    if(r.GetBool())
                    {
                        this.bodyPr = new CBodyPr();
                        this.bodyPr.Read_FromBinary(r);
                    }
                    else
                    {
                        this.bodyPr = null;
                    }
                    break;
                }
                case historyitem_ShapeSetWordShape:
                {
                    this.bWordShape = readBool(r);
                    break;
                }
            }
        }
    },

    Load_LinkData: function (linkData)
    {
    },

    Get_PageContentStartPos: function(pageNum)
    {
        if(this.textBoxContent)
        {
            if(this.spPr && this.spPr.geometry && this.spPr.geometry.rect)
            {
                var rect = this.spPr.geometry.rect;
                return {X: 0, Y: 0, XLimit: rect.r - rect.l, YLimit: 20000};
            }
            else
            {
                return {X: 0, Y: 0, XLimit: this.extX, YLimit: 20000};
            }
        }
        return null;
    },

    OnContentRecalculate: function()
    {},

    recalculateBounds: function()
    {
        var boundsChecker = new  CSlideBoundsChecker();
        this.draw(boundsChecker, this.localTransform, this.localTransformText);
        if(!this.group)
        {
            var tr = this.localTransform;
            var arr_p_x = [];
            var arr_p_y = [];
            arr_p_x.push(tr.TransformPointX(0,0));
            arr_p_y.push(tr.TransformPointY(0,0));
            arr_p_x.push(tr.TransformPointX(this.extX,0));
            arr_p_y.push(tr.TransformPointY(this.extX,0));
            arr_p_x.push(tr.TransformPointX(this.extX,this.extY));
            arr_p_y.push(tr.TransformPointY(this.extX,this.extY));
            arr_p_x.push(tr.TransformPointX(0,this.extY));
            arr_p_y.push(tr.TransformPointY(0,this.extY));

            arr_p_x.push(boundsChecker.Bounds.min_x);
            arr_p_x.push(boundsChecker.Bounds.max_x);
            arr_p_y.push(boundsChecker.Bounds.min_y);
            arr_p_y.push(boundsChecker.Bounds.max_y);

            var min_b_x = Math.min.apply(Math, arr_p_x);
            var max_b_x = Math.max.apply(Math, arr_p_x);
            var min_b_y = Math.min.apply(Math, arr_p_y);
            var max_b_y = Math.max.apply(Math, arr_p_y);

            this.bounds.l = min_b_x;
            this.bounds.t = min_b_y;
            this.bounds.r = max_b_x;
            this.bounds.b = max_b_y;
        }
        else
        {

            this.bounds.l = boundsChecker.Bounds.min_x;
            this.bounds.t = boundsChecker.Bounds.min_y;
            this.bounds.r = boundsChecker.Bounds.max_x;
            this.bounds.b = boundsChecker.Bounds.max_y;
        }


        this.bounds.x = this.bounds.l;
        this.bounds.y = this.bounds.t;
        this.bounds.w = this.bounds.r - this.bounds.l;
        this.bounds.h = this.bounds.b - this.bounds.t;
    }
};

function CreateBinaryReader(szSrc, offset, srcLen)
{
    var nWritten = 0;

    var index =  -1 + offset;
    var dst_len = "";

    for( ; index < srcLen; )
    {
        index++;
        var _c = szSrc.charCodeAt(index);
        if (_c == ";".charCodeAt(0))
        {
            index++;
            break;
        }

        dst_len += String.fromCharCode(_c);
    }

    var dstLen = parseInt(dst_len);
    if(isNaN(dstLen))
        return null;
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream2(pointer.data, dstLen);
    stream.obj = pointer.obj;

    var dstPx = stream.data;

    if (window.chrome)
    {
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1)
                {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }

            dwCurr <<= 24-nBits;
            for (i=0; i<nBits/8; i++)
            {
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    else
    {
        var p = b64_decode;
        while (index < srcLen)
        {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i=0; i<4; i++)
            {
                if (index >= srcLen)
                    break;
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined)
                {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }

            dwCurr <<= 24-nBits;
            for (i=0; i<nBits/8; i++)
            {
                dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                dwCurr <<= 8;
            }
        }
    }

    return stream;
}