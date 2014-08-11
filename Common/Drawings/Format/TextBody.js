"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 11:55 AM
 * To change this template use File | Settings | File Templates.
 */




var  field_type_slidenum   = 0;
var  field_type_datetime   = 1;
var  field_type_datetime1  = 2;
var  field_type_datetime2  = 3;
var  field_type_datetime3  = 4;
var  field_type_datetime4  = 5;
var  field_type_datetime5  = 6;
var  field_type_datetime6  = 7;
var  field_type_datetime7  = 8;
var  field_type_datetime8  = 9;
var  field_type_datetime9  = 10;
var  field_type_datetime10 = 11;
var  field_type_datetime11 = 12;
var  field_type_datetime12 = 13;
var  field_type_datetime13 = 14;

var pHText = [];
pHText[0] = [];//rus         ""                                                          ;
pHText[0][phType_body]  =    "Slide text";             //"Текст слайда" ;                              ;
pHText[0][phType_chart]    = "Chart";         // "Диаграмма" ;                                     ;
pHText[0][phType_clipArt]  = "ClipArt";// "Текст слайда" ; //(Clip Art)                   ;
pHText[0][phType_ctrTitle] = "Slide title";// "Заголовок слайда" ; //(Centered Title)     ;
pHText[0][phType_dgm]      = "Diagram";// "Диаграмма";// (Diagram)                        ;
pHText[0][phType_dt]       = "Date and time";// "Дата и время";// (Date and Time)         ;
pHText[0][phType_ftr]      = "Footer";// "Нижний колонтитул";// (Footer)                  ;
pHText[0][phType_hdr]      = "Header";// "Верхний колонтитул"; //(Header)                 ;
pHText[0][phType_media]    = "Media";// "Текст слайда"; //(Media)                         ;
pHText[0][phType_obj]      = "Slide text";// "Текст слайда"; //(Object)                   ;
pHText[0][phType_pic]      = "Picture";// "Вставка рисунка"; //(Picture)                  ;
pHText[0][phType_sldImg]   = "Image";// "Вставка рисунка"; //(Slide Image)                ;
pHText[0][phType_sldNum]   = "Slide number";// "Номер слайда"; //(Slide Number)           ;
pHText[0][phType_subTitle] = "Slide subtitle";// "Подзаголовок слайда"; //(Subtitle)      ;
pHText[0][phType_tbl]      = "Table";// "Таблица"; //(Table)                              ;
pHText[0][phType_title]    = "Slide title";// "Заголовок слайда" ;  //(Title)             ;


var field_months = [];
field_months[0] = [];//rus
field_months[0][0]  = "января" ;
field_months[0][1]  = "февраля";
field_months[0][2]  = "марта";
field_months[0][3]  = "апреля";
field_months[0][4]  = "мая";
field_months[0][5]  = "июня";
field_months[0][6]  = "июля";
field_months[0][7]  = "августа";
field_months[0][8]  = "сентября";
field_months[0][9]  = "октября";
field_months[0][10] = "ноября";
field_months[0][11] = "декабря";





//Overflow Types
var nOTClip     = 0;
var nOTEllipsis = 1;
var nOTOwerflow = 2;
//-----------------------------

//Text Anchoring Types
var nTextATB = 0;// (Text Anchor Enum ( Bottom ))
var nTextATCtr = 1;// (Text Anchor Enum ( Center ))
var nTextATDist = 2;// (Text Anchor Enum ( Distributed ))
var nTextATJust = 3;// (Text Anchor Enum ( Justified ))
var nTextATT = 4;// Top

//Vertical Text Types
var nVertTTeaVert          = 0; //( ( East Asian Vertical ))
var nVertTThorz            = 1; //( ( Horizontal ))
var nVertTTmongolianVert   = 2; //( ( Mongolian Vertical ))
var nVertTTvert            = 3; //( ( Vertical ))
var nVertTTvert270         = 4;//( ( Vertical 270 ))
var nVertTTwordArtVert     = 5;//( ( WordArt Vertical ))
var nVertTTwordArtVertRtl  = 6;//(Vertical WordArt Right to Left)
//-------------------------------------------------------------------
//Text Wrapping Types
var nTWTNone   = 0;
var nTWTSquare = 1;
//-------------------

function CTextBody()
{
    this.bodyPr = null;
    this.lstStyle = null;
    this.content = null;
    this.parent = null;

    this.content2 = null;
    this.compiledBodyPr = null;
    this.parent = null;
    this.recalcInfo =
    {
        recalculateBodyPr: true,
        recalculateContent2: true
    };
    this.textPropsForRecalc = [];
    this.bRecalculateNumbering = true;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CTextBody.prototype =
{

    getSearchResults : function(str)
    {
        return this.content != null ? this.content.getSearchResults(str) : [];
    },

    createDuplicate: function()
    {
        var ret = new CTextBody();
        if(this.bodyPr)
            ret.setBodyPr(this.bodyPr.createDuplicate());
        if(this.lstStyle)
            ret.setLstStyle(this.lstStyle.createDuplicate());
        if(this.content)
            ret.setContent(this.content.Copy(ret, NEW_WORKSHEET_DRAWING_DOCUMENT));
        return ret;
    },

    createDuplicate2: function()
    {
        var ret = new CTextBody();
        if(this.bodyPr)
            ret.setBodyPr(this.bodyPr.createDuplicate());
        if(this.lstStyle)
            ret.setLstStyle(this.lstStyle.createDuplicate());
        if(this.content)
            ret.setContent(this.content.Copy3(ret));
        return ret;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    Is_TopDocument: function()
    {
        return false;
    },

    Get_Theme : function()
    {
        return this.parent.Get_Theme();
    },

    Get_ColorMap: function()
    {
        return this.parent.Get_ColorMap();
    },

    setParent: function(pr)
    {
        History.Add(this, {Type: historyitem_TextBodySetParent, oldPr: this.parent, newPr: pr});
        this.parent = pr;
    },

    setBodyPr: function(pr)
    {
        History.Add(this, {Type: historyitem_TextBodySetBodyPr, oldPr: this.bodyPr, newPr: pr});
        this.bodyPr = pr;
        if(this.parent && this.parent.recalcInfo)
        {
            this.parent.recalcInfo.recalcContent = true;
            this.parent.recalcInfo.recalcTransformText = true;
            if(this.parent.addToRecalculate)
            {
                this.parent.addToRecalculate();
            }
        }

        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setContent: function(pr)
    {
        History.Add(this, {Type: historyitem_TextBodySetContent, oldPr: this.content, newPr: pr});
        this.content = pr;
    },

    setLstStyle: function(lstStyle)
    {
        History.Add(this, {Type:historyitem_TextBodySetLstStyle, oldPr: this.lstStyle, newPr: lstStyle});
        this.lstStyle = lstStyle;
    },

    getObjectType: function()
    {
        return historyitem_type_TextBody;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_TextBodySetParent:
            {
                this.parent = data.oldPr;
                break;
            }

            case historyitem_TextBodySetBodyPr:
            {
                this.bodyPr = data.oldPr;


                if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.handleUpdateInternalChart)
                {
                    this.parent.parent.parent.parent.parent.handleUpdateInternalChart();
                }
                break;
            }
            case historyitem_TextBodySetContent:
            {
                this.content = data.oldPr;
                break;
            }
            case historyitem_TextBodySetLstStyle:
            {
                this.lstStyle = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_TextBodySetParent:
            {
                this.parent = data.newPr;
                break;
            }

            case historyitem_TextBodySetBodyPr:
            {
                this.bodyPr = data.newPr;

                if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.handleUpdateInternalChart)
                {
                    this.parent.parent.parent.parent.parent.handleUpdateInternalChart();
                }
                break;
            }
            case historyitem_TextBodySetContent:
            {
                this.content = data.newPr;
                break;
            }
            case historyitem_TextBodySetLstStyle:
            {
                this.lstStyle = data.newPr;
                break;
            }
        }
    },
    Save_Changes: function(data, w)
    {
        w.WriteLong(historyitem_type_TextBody);
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_TextBodySetParent:
            case historyitem_TextBodySetContent:
            case historyitem_TextBodySetLstStyle:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_TextBodySetBodyPr:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    data.newPr.Write_ToBinary(w);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() === historyitem_type_TextBody)
        {
            var type = r.GetLong();
            switch(type)
            {
                case historyitem_TextBodySetParent:
                {
                    this.parent = readObject(r);
                    break;
                }

                case historyitem_TextBodySetBodyPr:
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

                    if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.handleUpdateInternalChart)
                    {
                        this.parent.parent.parent.parent.parent.handleUpdateInternalChart();
                    }
                    break;
                }
                case historyitem_TextBodySetContent:
                {
                    this.content = readObject(r);
                    break;
                }
                case historyitem_TextBodySetLstStyle:
                {
                    this.lstStyle = readObject(r);
                    break;
                }
            }
        }
    },



    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_TextBody);
        w.WriteString2(this.Id);
    },


    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    recalculate: function()
    {

    },

    recalcAll: function()
    {
        this.recalcInfo =
        {
            recalculateBodyPr: true,
            recalculateContent2: true
        };
        this.bRecalculateNumbering = true;
        var content = this.content;

        for(var i = 0; i < content.Content.length; ++i)
        {
            content.Content[i].Recalc_CompiledPr();
            content.Content[i].RecalcInfo.Recalc_0_Type = pararecalc_0_All;
        }
        this.arrStyles = [];
        content.arrStyles = [];
    },

    recalcColors: function()
    {
        this.content.recalcColors();
    },

    recalculateBodyPr: function()
    {
        ExecuteNoHistory(function()
        {
            if(!this.compiledBodyPr)
                this.compiledBodyPr = new CBodyPr();
            this.compiledBodyPr.setDefault();
            if(this.parent && this.parent.isPlaceholder && this.parent.isPlaceholder())
            {
                var hierarchy = this.parent.getHierarchy();
                for(var i = hierarchy.length - 1; i > -1; --i)
                {
                    if(isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].txBody) && isRealObject(hierarchy[i].txBody.bodyPr))
                        this.compiledBodyPr.merge(hierarchy[i].txBody.bodyPr)
                }
            }
            if(isRealObject(this.bodyPr))
            {
                this.compiledBodyPr.merge(this.bodyPr);
            }
        }, this, []);
    },

    Refresh_RecalcData: function()
    {
        if(this.parent && this.parent.recalcInfo)
        {
            this.parent.recalcInfo.recalcContent = true;
            this.parent.recalcInfo.recalcTransformText = true;

            this.parent.recalcInfo.recalculateContent = true;
            this.parent.recalcInfo.recalculateTransformText = true;
            if(this.parent.addToRecalculate)
            {
                this.parent.addToRecalculate();
            }
        }
    },


    updateSelectionState: function(drawingDocument)
    {
        var Doc = this.content;
        if ( true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty())
        {
            drawingDocument.UpdateTargetTransform(this.shape.transformText);
            drawingDocument.TargetEnd();
            drawingDocument.SelectEnabled(true);
            drawingDocument.SelectClear();
            this.content.Selection_Draw_Page(this.shape.parent ? this.shape.parent.num : this.shape.chartGroup.parent.num);
            drawingDocument.SelectShow();
        }
        else /*if(this.parent.elementsManipulator.Document.CurPos.Type == docpostype_FlowObjects ) */
        {
            drawingDocument.UpdateTargetTransform(this.shape.transformText);
            drawingDocument.TargetShow();
            drawingDocument.SelectEnabled(false);
        }
    },

    isEmpty: function()
    {
        return this.content.Is_Empty();
    },

    OnContentReDraw: function()
    {},

    calculateContent: function()
    {
        var parent_object = this.shape.getParentObjects();
        for(var i = 0; i < this.textPropsForRecalc.length; ++i)
        {
            var props = this.textPropsForRecalc[i].Value;
            if(props && props.FontFamily && typeof props.FontFamily.Name === "string" && isThemeFont(props.FontFamily.Name))
            {
                props.FontFamily.themeFont = props.FontFamily.Name;
                props.FontFamily.Name = getFontInfo(props.FontFamily.Name)(parent_object.theme.themeElements.fontScheme);
            }
            var TextPr = props;
            var parents = parent_object;
            if(isRealObject(TextPr) && isRealObject(TextPr.unifill) && isRealObject(TextPr.unifill.fill))
            {
                TextPr.unifill.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R:0, G:0, B:0, A:255});
                var _rgba = TextPr.unifill.getRGBAColor();
                TextPr.Color = new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
            }
            if(isRealObject(props.FontFamily) && typeof props.FontFamily.Name === "string")
            {
                TextPr.RFonts.Ascii = {Name : TextPr.FontFamily.Name, Index: -1};
                TextPr.RFonts.CS = {Name : TextPr.FontFamily.Name, Index: -1};
                TextPr.RFonts.HAnsi = {Name : TextPr.FontFamily.Name, Index: -1};
            }
        }
        this.textPropsForRecalc.length = 0;
        if(this.bRecalculateNumbering)
        {
            this.content.RecalculateNumbering();
            this.bRecalculateNumbering = false;
        }

        this.content.Set_StartPage(/*isRealNumber(this.shape.parent.num) ? this.shape.parent.num : */0);



        if(this.textFieldFlag)
        {
            this.textFieldFlag = false;
            if(this.shape && this.shape.isPlaceholder())
            {
                var _ph_type = this.shape.getPlaceholderType();
                switch (_ph_type)
                {
                    case phType_dt :
                    {
                        var _cur_date = new Date();
                        var _cur_year = _cur_date.getFullYear();
                        var _cur_month = _cur_date.getMonth();
                        var _cur_month_day = _cur_date.getDate();
                        var _cur_week_day = _cur_date.getDay();
                        var _cur_hour = _cur_date.getHours();
                        var _cur_minute = _cur_date.getMinutes();
                        var _cur_second = _cur_date.getSeconds();
                        var _text_string = "";
                        switch (this.fieldType)
                        {
                            default :
                            {
                                _text_string += (_cur_month_day > 9 ? _cur_month_day : "0" + _cur_month_day)
                                    +  "." +   ((_cur_month +1) > 9 ? (_cur_month + 1) : "0" + (_cur_month +1))
                                    + "." + _cur_year;
                                break;
                            }
                        }
                        var par = this.content.Content[0];
                        var EndPos = par.Internal_GetEndPos();

                        var _history_status = History.Is_On();

                        if(_history_status)
                        {
                            History.TurnOff();
                        }

                        for(var _text_index = 0; _text_index < _text_string.length; ++_text_index)
                        {
                            if(_text_string[_text_index] != " ")
                            {
                                par.Internal_Content_Add(EndPos, new ParaText(_text_string[_text_index]));
                            }
                            else
                            {
                                par.Internal_Content_Add(EndPos, new ParaSpace(1));
                            }
                            ++EndPos;
                        }
                        if(_history_status)
                        {
                            History.TurnOn();
                        }
                        this.calculateContent();
                        break;
                    }
                    case phType_sldNum :
                    {
                        if(this.shape.parent instanceof Slide)
                        {
                            var _text_string = "" + (this.shape.parent.num+1);
                            par = this.content.Content[0];
                            EndPos = par.Internal_GetEndPos();

                            _history_status = History.Is_On();

                            if(_history_status)
                            {
                                History.TurnOff();
                            }

                            for(_text_index = 0; _text_index < _text_string.length; ++_text_index)
                            {
                                if(_text_string[_text_index] != " ")
                                {
                                    par.Internal_Content_Add(EndPos, new ParaText(_text_string[_text_index]));
                                }
                                else
                                {
                                    par.Internal_Content_Add(EndPos, new ParaSpace(1));
                                }
                                ++EndPos;
                            }

                            if(_history_status)
                            {
                                History.TurnOn();
                            }
                            this.calculateContent();
                        }
                        break;
                    }
                }
            }
        }

        if(this.bodyPr.textFit !== null && typeof this.bodyPr.textFit === "object")
        {
            if(this.bodyPr.textFit.type === text_fit_NormAuto)
            {
                var text_fit = this.bodyPr.textFit;
                var font_scale, spacing_scale;
                if(!isNaN(text_fit.fontScale) && typeof text_fit.fontScale === "number")
                    font_scale = text_fit.fontScale/100000;
                if(!isNaN(text_fit.lnSpcReduction) && typeof text_fit.lnSpcReduction === "number")
                    spacing_scale = text_fit.lnSpcReduction/100000;

                if(!isNaN(font_scale) && typeof font_scale === "number"
                    || !isNaN(spacing_scale) && typeof spacing_scale === "number")
                {
                    var pars = this.content.Content;
                    for(var index = 0; index < pars.length; ++index)
                    {
                        var parg = pars[index];
                        if(!isNaN(spacing_scale) && typeof spacing_scale === "number")
                        {
                            var spacing = parg.Pr.Spacing;
                            var spacing2 = parg.Get_CompiledPr(false).ParaPr;
                            parg.Recalc_CompiledPr();
                            var spc = (spacing2.Line*spacing_scale);
                            if(!isNaN(spc) && typeof spc === "number")
                                spacing.Line = spc;

                            spc = (spacing2.Before*spacing_scale);
                            if(!isNaN(spc) && typeof spc === "number")
                                spacing.Before = spc;

                            spc = (spacing2.After*spacing_scale);
                            if(!isNaN(spc) && typeof spc === "number")
                                spacing.After = spc;
                        }

                        if(!isNaN(font_scale) && typeof font_scale === "number")
                        {
                            var par_font_size = parg.Get_CompiledPr(false).TextPr.FontSize;
                            parg.Recalc_CompiledPr();
                            for(var r = 0; r < parg.Content.length; ++r)
                            {
                                var item = parg.Content[r];
                                if(item.Type === para_TextPr)
                                {
                                    var value = item.Value;
                                    if(!isNaN(value.FontSize) && typeof value.FontSize === "number")
                                    {
                                        value.FontSize = (value.FontSize*font_scale) >> 0;
                                    }
                                }
                            }
                            var result_par_text_pr_font_size = (par_font_size*font_scale) >> 0;
                            if(!isNaN(result_par_text_pr_font_size) && typeof result_par_text_pr_font_size === "number")
                            {
                                var b_insert_text_pr = false, pos = -1;
                                for(var p = 0; p < parg.Content.length; ++p)
                                {
                                    if(parg.Content[p].Type === para_TextPr)
                                    {
                                        if(!(!isNaN(parg.Content[p].Value.FontSize) && typeof parg.Content[p].Value.FontSize === "number"))
                                            parg.Content[p].Value.FontSize = result_par_text_pr_font_size;
                                        break;
                                    }
                                    if(parg.Content[p].Type === para_Text)
                                    {
                                        b_insert_text_pr = true;
                                        pos = p;
                                        break;
                                    }
                                }
                                if(b_insert_text_pr)
                                {
                                    var history_is_on = History.Is_On();
                                    if(history_is_on)
                                        History.TurnOff();
                                    parg.Internal_Content_Add(p, new ParaTextPr({FontSize: result_par_text_pr_font_size}));
                                    if(history_is_on)
                                        History.TurnOn();
                                }
                            }
                        }
                    }

                }

            }
            this.bodyPr.textFit = null;
            this.calculateContent();
            return;
        }

        this.bodyPr.normAutofit = false;

        var _l, _t, _r, _b;

        var _body_pr = this.getBodyPr();
        var sp = this.shape;
        if(isRealObject(sp.spPr.geometry) && isRealObject(sp.spPr.geometry.rect))
        {
            var _rect = sp.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        }
        else
        {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = sp.extX - _body_pr.rIns;
            _b = sp.extY - _body_pr.bIns;
        }

        if(_body_pr.upright === false)
        {
            var _content_width;
            if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
            {
                _content_width = _r - _l;
                this.contentWidth = _content_width;
                this.contentHeight = _b - _t;
            }
            else
            {
                _content_width = _b - _t;
                this.contentWidth = _content_width;
                this.contentHeight = _r - _l;
            }

        }
        else
        {
            var _full_rotate = sp.getFullRotate();
            if((_full_rotate >= 0 && _full_rotate < Math.PI*0.25)
                || (_full_rotate > 3*Math.PI*0.25 && _full_rotate < 5*Math.PI*0.25)
                || (_full_rotate > 7*Math.PI*0.25 && _full_rotate < 2*Math.PI))
            {
                if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                {
                    _content_width = _r - _l;
                    this.contentWidth = _content_width;
                    this.contentHeight = _b - _t;
                }
                else
                {
                    _content_width = _b - _t;
                    this.contentWidth = _content_width;
                    this.contentHeight = _r - _l;
                }
            }
            else
            {
                if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                {
                    _content_width = _b - _t;
                    this.contentWidth = _content_width;
                    this.contentHeight = _r - _l;
                }
                else
                {
                    _content_width = _r - _l;
                    this.contentWidth  = _content_width;
                    this.contentHeight = _b - _t;
                }
            }
        }
        this.content.Reset(0, 0, _content_width, 20000);
        this.content.Recalculate_Page(0, true);
        this.contentHeight = this.getSummaryHeight();




        if(this.recalcInfo.recalculateContent2)
        {

            var _history_is_on = History.Is_On();
            if(_history_is_on)
            {
                History.TurnOff();
            }
            if(this.shape.isPlaceholder())
            {
                var text = pHText[0][this.shape.nvSpPr.nvPr.ph.type] != undefined ?  pHText[0][this.shape.nvSpPr.nvPr.ph.type] : pHText[0][phType_body];
                this.content2 = new CDocumentContent(this, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, false);
                this.content2.Content.length = 0;
                var par = new Paragraph(editor.WordControl.m_oDrawingDocument, this.content2, 0, 0, 0, 0, 0);
                var EndPos = 0;
                for(var key = 0 ; key <  text.length; ++key)
                {
                    par.Internal_Content_Add( EndPos++, CreateParaContentFromString(text[key]));
                }
                if(this.content && this.content.Content[0] )
                {
                    if(this.content.Content[0].Pr)
                    {
                        par.Pr = this.content.Content[0].Pr.Copy();
                    }
                    if(this.content.Content[0].rPr)
                    {
                        par.rPr = clone(this.content.Content[0].rPr);
                    }
                }
                this.content2.Internal_Content_Add( 0, par);

                this.content2.RecalculateNumbering();
                this.content2.Set_StartPage(/*isRealNumber(this.shape.parent.num) ? this.shape.parent.num : */0);
                if(_body_pr.upright === false)
                {
                    var _content_width;
                    if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                    {
                        _content_width = _r - _l;
                        this.contentWidth2 = _content_width;
                        this.contentHeight2 = _b - _t;
                    }
                    else
                    {
                        _content_width = _b - _t;
                        this.contentWidth2 = _content_width;
                        this.contentHeight2 = _r - _l;
                    }

                }
                else
                {
                    var _full_rotate = sp.getFullRotate();
                    if((_full_rotate >= 0 && _full_rotate < Math.PI*0.25)
                        || (_full_rotate > 3*Math.PI*0.25 && _full_rotate < 5*Math.PI*0.25)
                        || (_full_rotate > 7*Math.PI*0.25 && _full_rotate < 2*Math.PI))
                    {
                        if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                        {
                            _content_width = _r - _l;
                            this.contentWidth2 = _content_width;
                            this.contentHeight2 = _b - _t;
                        }
                        else
                        {
                            _content_width = _b - _t;
                            this.contentWidth2 = _content_width;
                            this.contentHeight2 = _r - _l;
                        }
                    }
                    else
                    {
                        if(!(_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270))
                        {
                            _content_width = _b - _t;
                            this.contentWidth2 = _content_width;
                            this.contentHeight2 = _r - _l;
                        }
                        else
                        {
                            _content_width = _r - _l;
                            this.contentWidth2  = _content_width;
                            this.contentHeight2 = _b - _t;
                        }
                    }
                }
                this.content2.Reset(0, 0, _content_width, 20000);
                this.content2.Recalculate_Page(0, true);
                this.contentHeight2 = this.getSummaryHeight2();
            }




            if(_history_is_on)
            {
                History.TurnOn();
            }
            this.recalcInfo.recalculateContent2 = false;
        }


    },

    copy: function(txBody)
    {
        txBody.setDocContent(this.content.Copy(txBody));
    },

    updateCursorType: function(x, y, e)
    {
        if(this.shape && this.shape.invertTransformText)
        {
            var tx = this.shape.invertTransformText.TransformPointX(x, y);
            var ty = this.shape.invertTransformText.TransformPointY(x, y);
            this.content.Update_CursorType(tx, ty, 0);
        }
    },

    Get_StartPage_Absolute: function()
    {
        return 0//TODO;
    },

    Get_TextBackGroundColor: function()
    {},

    Is_HdrFtr: function()
    {
        return false;
    },

    Get_PageContentStartPos: function(pageNum)
    {
        return {X: 0, Y: 0, XLimit: this.contentWidth, YLimit: 20000};
    },


    Get_Numbering: function()
    {
        return new CNumbering();
    },

    Set_CurrentElement: function(bUpdate, pageIndex)
    {
        if(this.parent.Set_CurrentElement)
        {
            this.parent.Set_CurrentElement(bUpdate, pageIndex);
        }
    },


    checkDocContent: function()
    {
        this.parent && this.parent.checkDocContent && this.parent.checkDocContent();
    },
    getBodyPr: function()
    {
        if(this.recalcInfo.recalculateBodyPr)
        {
            this.recalculateBodyPr();
            this.recalcInfo.recalculateBodyPr = false;
        }
        return this.compiledBodyPr;
    },

    onParagraphChanged: function()
    {
        if(this.shape )
            this.shape.onParagraphChanged();
    },

    getSummaryHeight: function()
    {
        return this.content.Get_SummaryHeight();
    },


    getSummaryHeight2: function()
    {
        return this.content2 ? this.content2.Get_SummaryHeight() : 0;
    },

    getCompiledBodyPr: function()
    {
        this.recalculateBodyPr();
        return this.compiledBodyPr;
    },

    addPhContent: function(phType)
    {},

    Get_TableStyleForPara: function()
    {
        return null;
    },

    draw: function(graphics)
    {
        /*if(this.content.Is_Empty() && isRealObject(this.phContent))
         this.content2.Draw(graphics);
         else
         this.content.Draw(0, graphics);  */

        if((!this.content || this.content.Is_Empty()) && this.content2!=null && !this.shape.addTextFlag && (this.shape.isEmptyPlaceholder ? this.shape.isEmptyPlaceholder() : false))
        {
            if (graphics.IsNoDrawingEmptyPlaceholder !== true && graphics.IsNoDrawingEmptyPlaceholderText !== true)
            {
                if(graphics.IsNoSupportTextDraw)
                {
                    var _w2 = this.content2.XLimit;
                    var _h2 = this.content2.Get_SummaryHeight();
                    graphics.rect(this.content2.X, this.content2.Y, _w2, _h2);
                }

                this.content2.Set_StartPage(0);
                this.content2.Draw(0, graphics);
            }
        }
        else if(this.content)
        {
            if(graphics.IsNoSupportTextDraw)
            {
                var _w = this.content.XLimit;
                var _h = this.content.Get_SummaryHeight();
                graphics.rect(this.content.X, this.content.Y, _w, _h);
            }
            var old_start_page = this.content.StartPage;
            this.content.Set_StartPage(0);
            this.content.Draw(0, graphics);
            this.content.Set_StartPage(old_start_page);
        }
    },

    Get_Styles: function(level)
    {
        return this.parent.getStyles(level);
    },

    Is_Cell: function()
    {
        return false;
    },
    OnContentRecalculate: function()
    {},



    getMargins: function ()
    {
        var _parent_transform = this.shape.transform;
        var _l;
        var _r;
        var _b;
        var _t;
        var _body_pr = this.getBodyPr();
        var sp = this.shape;
        if(isRealObject(sp.spPr.geometry) && isRealObject(sp.spPr.geometry.rect))
        {
            var _rect = sp.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        }
        else
        {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = sp.extX - _body_pr.rIns;
            _b = sp.extY - _body_pr.bIns;
        }

        var x_lt, y_lt, x_rb, y_rb;

        x_lt = _parent_transform.TransformPointX(_l, _t);
        y_lt = _parent_transform.TransformPointY(_l, _t);

        x_rb = _parent_transform.TransformPointX(_r, _b);
        y_rb = _parent_transform.TransformPointY(_r, _b);

        var hc = (_r - _l)/2;
        var vc = (_b - _t)/2;

        var xc = (x_lt + x_rb)/2;
        var yc = (y_lt + y_rb)/2;

        var tx = xc-hc;
        var ty = yc-vc;
        return {L : xc - hc , T: yc - vc , R : xc + hc , B : yc + vc, textMatrix : this.shape.transform};
    },


    Refresh_RecalcData2: function(pageIndex)
    {
        this.parent && this.parent.Refresh_RecalcData2 && this.parent.Refresh_RecalcData2(pageIndex, this);
    },

    getContentOneStringSizes: function()
    {
        //TODO: потом переделать
        this.content.Reset(0, 0, 20000, 20000);//выставляем большую ширину чтобы текст расчитался в одну строку.
        this.content.Recalculate_Page(0, true);
        return {w: this.content.Content[0].Lines[0].Ranges[0].W+0.1, h: this.content.Get_SummaryHeight()+0.1};
    },

    recalculateByMaxWord: function()
    {
        var max_content = this.content.Recalculate_MinMaxContentWidth().Max;
        this.content.Set_ApplyToAll(true);
        this.content.Set_ParagraphAlign(align_Center);
        this.content.Set_ApplyToAll(false);
        this.content.Reset(0, 0,max_content, 20000);
        this.content.Recalculate_Page(0, true);
        return {w: max_content, h: this.content.Get_SummaryHeight()};
    },

    getRectWidth: function(maxWidth)
    {
        var body_pr = this.getBodyPr();
        var r_ins = body_pr.rIns;
        var l_ins = body_pr.lIns;
        var max_content_width = maxWidth - r_ins - l_ins;
        this.content.Reset(0, 0, max_content_width, 20000);
        this.content.Recalculate_Page(0, true);
        var max_width = 0;
        for(var i = 0; i < this.content.Content.length; ++i)
        {
            var par = this.content.Content[i];
            for(var j = 0; j < par.Lines.length; ++j)
            {
                if(par.Lines[j].Ranges[0].W  > max_width)
                {
                    max_width = par.Lines[j].Ranges[0].W;
                }
            }
        }
        return max_width + 2 + r_ins + l_ins;
    },

    getRectHeight: function(maxHeight, width)
    {
        this.content.RecalculateNumbering();
        this.content.Reset(0, 0, width, 20000);
        this.content.Recalculate_Page(0, true);
        var content_height = this.getSummaryHeight();
        var t_ins = isRealNumber(this.bodyPr.tIns) ? this.bodyPr.tIns : 1.27;
        var b_ins = isRealNumber(this.bodyPr.bIns) ? this.bodyPr.bIns : 1.27;
        return content_height + t_ins + b_ins;
    },

    getMaxContentWidth: function(maxWidth, bLeft)
    {
        this.content.Reset(0, 0, maxWidth - 0.01, 20000);
        if(bLeft)
        {
            this.content.Set_ApplyToAll(true);
            this.content.Set_ParagraphAlign(align_Left);
            this.content.Set_ApplyToAll(false);
        }
        this.content.Recalculate_Page(0, true);
        var max_width = 0, arr_content = this.content.Content, paragraph_lines, i, j;
        for(i = 0;  i < arr_content.length; ++i)
        {
            paragraph_lines = arr_content[i].Lines;
            for(j = 0;  j < paragraph_lines.length; ++j)
            {
                if(paragraph_lines[j].Ranges[0].W > max_width)
                    max_width = paragraph_lines[j].Ranges[0].W;
            }
        }
        return max_width + 0.01;
    },

    Get_PrevElementEndInfo : function(CurElement)
    {
        return null;
    }
};

function CreateParaContentFromString(str)
{
    if (str == '\t')
    {
        return new ParaTab();
    }
    else if (str == '\n')
    {
        return new ParaNewLine( break_Line );
    }
    else if (str != ' ')
    {
        return new ParaText(str);
    }
    else
    {
        return new ParaSpace(1);
    }
}