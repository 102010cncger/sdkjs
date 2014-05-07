﻿/** @define {boolean} */
var ASC_DOCS_API_DEBUG = true;

var ASC_DOCS_API_USE_EMBEDDED_FONTS = "@@ASC_DOCS_API_USE_EMBEDDED_FONTS";

var documentId = undefined;
var documentUserId = undefined;
var documentUrl = 'null';
var documentTitle = 'null';
var documentTitleWithoutExtention = 'null';
var documentFormat = 'null';
var documentVKey = null;
var documentOrigin = "";
var documentFormatSave = c_oAscFileType.DOCX;
var documentFormatSaveTxtCodepage = 65001;//utf8

function CDocOpenProgress()
{
    this.Type = c_oAscAsyncAction.Open;

    this.FontsCount = 0;
    this.CurrentFont = 0;

    this.ImagesCount = 0;
    this.CurrentImage = 0;
}

CDocOpenProgress.prototype.get_Type = function(){return this.Type}
CDocOpenProgress.prototype.get_FontsCount = function(){return this.FontsCount}
CDocOpenProgress.prototype.get_CurrentFont = function(){return this.CurrentFont}
CDocOpenProgress.prototype.get_ImagesCount = function(){return this.ImagesCount}
CDocOpenProgress.prototype.get_CurrentImage = function(){return this.CurrentImage}

function CDocInfo (obj){
	if(obj){
		if (typeof obj.Id != 'undefined'){
			this.Id = obj.Id;
		}
		if (typeof obj.Url != 'undefined'){
			this.Url = obj.Url;
		}
		if (typeof obj.Title != 'undefined'){
			this.Title = obj.Title;
		}
		if (typeof obj.Format != 'undefined'){
			this.Format = obj.Format;
		}
		if (typeof obj.VKey != 'undefined'){
			this.VKey = obj.VKey;
		}
        if (typeof obj.UserId != 'undefined'){
            this.UserId = obj.UserId;
        }
		if (typeof obj.UserName != 'undefined'){
			this.UserName = obj.UserName;
		}
		if (typeof obj.Options != 'undefined'){
			this.Options = obj.Options;
		}
        if (obj.OfflineApp === true)
            this.OfflineApp = true;
	}
	else{
		this.Id = null;
		this.Url = null;
		this.Title = null;
		this.Format = null;
		this.VKey = null;
        this.UserId = null;
		this.UserName = null;
		this.Options = null;
	}
}
CDocInfo.prototype.get_Id = function(){return this.Id}
CDocInfo.prototype.put_Id = function(v){this.Id = v;}
CDocInfo.prototype.get_Url = function(){return this.Url;}
CDocInfo.prototype.put_Url = function(v){this.Url = v;}
CDocInfo.prototype.get_Title = function(){return this.Title;}
CDocInfo.prototype.put_Title = function(v){this.Title = v;}
CDocInfo.prototype.get_Format = function(){return this.Format;}
CDocInfo.prototype.put_Format = function(v){this.Format = v;}
CDocInfo.prototype.get_VKey = function(){return this.VKey;}
CDocInfo.prototype.put_VKey = function(v){this.VKey = v;}
CDocInfo.prototype.get_OfflineApp = function(){return this.OfflineApp;}
CDocInfo.prototype.put_OfflineApp = function(v){this.OfflineApp = v;}
CDocInfo.prototype.get_UserId = function(){return this.UserId;}
CDocInfo.prototype.put_UserId = function(v){this.UserId = v;}
CDocInfo.prototype.get_UserName = function(){return this.UserName;}
CDocInfo.prototype.put_UserName = function(v){this.UserName = v;}
CDocInfo.prototype.get_Options = function(){return this.Options;}
CDocInfo.prototype.put_Options = function(v){this.Options = v;}

function CListType(obj)
{
	if (obj)
	{
		this.Type = (undefined == obj.Type) ? null : obj.Type;
		this.SubType = (undefined == obj.Type) ? null : obj.SubType;
	}
	else
	{
		this.Type = null;
		this.SubType = null;
	}
}
CListType.prototype.get_ListType = function() { return this.Type; }
CListType.prototype.get_ListSubType = function() { return this.SubType; }

function CAscSection()
{
    this.PageWidth = 0;
    this.PageHeight = 0;

    this.MarginLeft = 0;
    this.MarginRight = 0;
    this.MarginTop = 0;
    this.MarginBottom = 0;
}
CAscSection.prototype.get_PageWidth = function() { return this.PageWidth; }
CAscSection.prototype.get_PageHeight = function() { return this.PageHeight; }
CAscSection.prototype.get_MarginLeft = function() { return this.MarginLeft; }
CAscSection.prototype.get_MarginRight = function() { return this.MarginRight; }
CAscSection.prototype.get_MarginTop = function() { return this.MarginTop; }
CAscSection.prototype.get_MarginBottom = function() { return this.MarginBottom; }

function CImagePositionH(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? undefined : obj.RelativeFrom;
        this.UseAlign     = ( undefined === obj.UseAlign     ) ? undefined : obj.UseAlign;
        this.Align        = ( undefined === obj.Align        ) ? undefined : obj.Align;
        this.Value        = ( undefined === obj.Value        ) ? undefined : obj.Value;
    }
    else
    {
        this.RelativeFrom = undefined;
        this.UseAlign     = undefined;
        this.Align        = undefined;
        this.Value        = undefined;
    }
}

CImagePositionH.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; }
CImagePositionH.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; }
CImagePositionH.prototype.get_UseAlign = function()  { return this.UseAlign; }
CImagePositionH.prototype.put_UseAlign = function(v) { this.UseAlign = v; }
CImagePositionH.prototype.get_Align = function()  { return this.Align; }
CImagePositionH.prototype.put_Align = function(v) { this.Align = v; }
CImagePositionH.prototype.get_Value = function()  { return this.Value; }
CImagePositionH.prototype.put_Value = function(v) { this.Value = v; }

function CImagePositionV(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? undefined : obj.RelativeFrom;
        this.UseAlign     = ( undefined === obj.UseAlign     ) ? undefined : obj.UseAlign;
        this.Align        = ( undefined === obj.Align        ) ? undefined : obj.Align;
        this.Value        = ( undefined === obj.Value        ) ? undefined : obj.Value;
    }
    else
    {
        this.RelativeFrom = undefined;
        this.UseAlign     = undefined;
        this.Align        = undefined;
        this.Value        = undefined;
    }
}

CImagePositionV.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; }
CImagePositionV.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; }
CImagePositionV.prototype.get_UseAlign = function()  { return this.UseAlign; }
CImagePositionV.prototype.put_UseAlign = function(v) { this.UseAlign = v; }
CImagePositionV.prototype.get_Align = function()  { return this.Align; }
CImagePositionV.prototype.put_Align = function(v) { this.Align = v; }
CImagePositionV.prototype.get_Value = function()  { return this.Value; }
CImagePositionV.prototype.put_Value = function(v) { this.Value = v; }

function CPosition( obj )
{
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
CPosition.prototype.get_X = function() { return this.X; }
CPosition.prototype.put_X = function(v) { this.X = v; }
CPosition.prototype.get_Y = function() { return this.Y; }
CPosition.prototype.put_Y = function(v) { this.Y = v; }



function CImageSize( width, height, isCorrect )
{
	this.Width = (undefined == width) ? 0.0 : width;
	this.Height = (undefined == height) ? 0.0 : height;
    this.IsCorrect = isCorrect;
}

CImageSize.prototype.get_ImageWidth = function() { return this.Width; }
CImageSize.prototype.get_ImageHeight = function() { return this.Height; }
CImageSize.prototype.get_IsCorrect = function() { return this.IsCorrect; }

function CImgProperty( obj )
{
	if( obj )
	{
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
	else
	{
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


CImgProperty.prototype.get_ChangeLevel = function() { return this.ChangeLevel; };
CImgProperty.prototype.put_ChangeLevel = function(v) { this.ChangeLevel = v; };

CImgProperty.prototype.get_CanBeFlow = function() { return this.CanBeFlow; }
CImgProperty.prototype.get_Width = function() { return this.Width; }
CImgProperty.prototype.put_Width = function(v) { this.Width = v; }
CImgProperty.prototype.get_Height = function() { return this.Height; }
CImgProperty.prototype.put_Height = function(v) { this.Height = v; }
CImgProperty.prototype.get_WrappingStyle = function() { return this.WrappingStyle; }
CImgProperty.prototype.put_WrappingStyle = function(v) { this.WrappingStyle = v; }
// Возвращается объект класса CPaddings
CImgProperty.prototype.get_Paddings = function() { return this.Paddings; }
// Аргумент объект класса CPaddings
CImgProperty.prototype.put_Paddings = function(v) { this.Paddings = v; }
CImgProperty.prototype.get_AllowOverlap = function() {return this.AllowOverlap;}
CImgProperty.prototype.put_AllowOverlap = function(v) {this.AllowOverlap = v;}
// Возвращается объект класса CPosition
CImgProperty.prototype.get_Position = function() { return this.Position; }
// Аргумент объект класса CPosition
CImgProperty.prototype.put_Position = function(v) { this.Position = v; }
CImgProperty.prototype.get_PositionH = function()  { return this.PositionH; }
CImgProperty.prototype.put_PositionH = function(v) { this.PositionH = v; }
CImgProperty.prototype.get_PositionV = function()  { return this.PositionV; }
CImgProperty.prototype.put_PositionV = function(v) { this.PositionV = v; }
CImgProperty.prototype.get_Value_X = function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_X_Value(RelativeFrom);  return 0; }
CImgProperty.prototype.get_Value_Y = function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);  return 0; }

CImgProperty.prototype.get_ImageUrl = function() { return this.ImageUrl; }
CImgProperty.prototype.put_ImageUrl = function(v) { this.ImageUrl = v; }
CImgProperty.prototype.get_Group = function() { return this.Group; }
CImgProperty.prototype.put_Group = function(v) { this.Group = v; }
CImgProperty.prototype.get_FromGroup = function() { return this.fromGroup; }
CImgProperty.prototype.put_FromGroup = function(v) { this.fromGroup = v; }

CImgProperty.prototype.get_isChartProps = function() { return this.isChartProps; }
CImgProperty.prototype.put_isChartPross = function(v) { this.isChartProps = v; }


CImgProperty.prototype.get_SeveralCharts = function() { return this.severalCharts; }
CImgProperty.prototype.put_SeveralCharts = function(v) { this.severalCharts = v; }
CImgProperty.prototype.get_SeveralChartTypes = function() { return this.severalChartTypes; }
CImgProperty.prototype.put_SeveralChartTypes = function(v) { this.severalChartTypes = v; }

CImgProperty.prototype.get_SeveralChartStyles = function() { return this.severalChartStyles; }
CImgProperty.prototype.put_SeveralChartStyles = function(v) { this.severalChartStyles = v; }

CImgProperty.prototype.get_VerticalTextAlign = function() { return this.verticalTextAlign; };
CImgProperty.prototype.put_VerticalTextAlign = function(v) { this.verticalTextAlign = v; };

CImgProperty.prototype.get_OriginSize = function(api)
{
    var _image = api.ImageLoader.map_image_index[_getFullImageSrc(this.ImageUrl)];
    if (_image != undefined && _image.Image != null && _image.Status == ImageLoadStatus.Complete)
    {
        var _w = Math.max(1, Page_Width - (X_Left_Margin + X_Right_Margin));
        var _h = Math.max(1, Page_Height - (Y_Top_Margin + Y_Bottom_Margin));

        var bIsCorrect = false;
        if (_image.Image != null)
        {
            var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
            var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);

            var dKoef = Math.max(__w / _w, __h / _h);
            if (dKoef > 1)
            {
                _w = Math.max(5, __w / dKoef);
                _h = Math.max(5, __h / dKoef);

                bIsCorrect = true;
            }
            else
            {
                _w = __w;
                _h = __h;
            }
        }

        return new CImageSize( parseInt(_w), parseInt(_h), bIsCorrect);
    }
    return new CImageSize( 50, 50, false );
}
CImgProperty.prototype.get_Locked = function() { return this.Locked; }

CImgProperty.prototype.get_ChartProperties = function()
{
    return this.ChartProperties;
};

CImgProperty.prototype.put_ChartProperties = function(v)
{
    this.ChartProperties = v;
};

CImgProperty.prototype.get_ShapeProperties = function()
{
    return this.ShapeProperties;
};

CImgProperty.prototype.put_ShapeProperties = function(v)
{
    this.ShapeProperties = v;
};

function CHeaderProp( obj )
{
	/*{
		Type : hdrftr_Footer (hdrftr_Header),
		Position : 12.5,
		DifferentFirst : true/false,
		DifferentEvenOdd : true/false,
	}*/
	if( obj )
	{
		this.Type = (undefined != obj.Type) ? obj.Type: null;
		this.Position = (undefined != obj.Position) ? obj.Position : null;
		this.DifferentFirst = (undefined != obj.DifferentFirst) ? obj.DifferentFirst : null;
		this.DifferentEvenOdd = (undefined != obj.DifferentEvenOdd) ? obj.DifferentEvenOdd : null;
        this.LinkToPrevious   = (undefined != obj.LinkToPrevious)   ? obj.LinkToPrevious   : null;
        this.Locked = (undefined != obj.Locked) ? obj.Locked : false;
	}
	else
	{
		this.Type = hdrftr_Footer;
		this.Position = 12.5;
		this.DifferentFirst = false;
		this.DifferentEvenOdd = false;
        this.LinkToPrevious   = null;
        this.Locked = false;
	}
}

CHeaderProp.prototype.get_Type = function(){ return this.Type; }
CHeaderProp.prototype.put_Type = function(v){ this.Type = v; }
CHeaderProp.prototype.get_Position = function(){ return this.Position; }
CHeaderProp.prototype.put_Position = function(v){ this.Position = v; }
CHeaderProp.prototype.get_DifferentFirst = function(){ return this.DifferentFirst; }
CHeaderProp.prototype.put_DifferentFirst = function(v){ this.DifferentFirst = v; }
CHeaderProp.prototype.get_DifferentEvenOdd = function(){ return this.DifferentEvenOdd; }
CHeaderProp.prototype.put_DifferentEvenOdd = function(v){ this.DifferentEvenOdd = v; }
CHeaderProp.prototype.get_LinkToPrevious = function() { return this.LinkToPrevious; }
CHeaderProp.prototype.get_Locked = function() { return this.Locked; }

function CSelectedObject( type, val )
{
	this.Type = (undefined != type) ? type : null;
	this.Value = (undefined != val) ? val : null;
}
// Возвращает тип объекта c_oAscTypeSelectElement
CSelectedObject.prototype.get_ObjectType = function() { return this.Type; }

// Возвращает собственно сам объект класса в зависимости от типа
// c_oAscTypeSelectElement.Paragraph CParagraphProp
// c_oAscTypeSelectElement.Image CImgProperty
// c_oAscTypeSelectElement.Table CTableProp
// c_oAscTypeSelectElement.Header CHeaderProp
CSelectedObject.prototype.get_ObjectValue = function() { return this.Value; }

// [!dirty hack for minimizer - don't delete this comment!] function CStylesPainter ()
// [!dirty hack for minimizer - don't delete this comment!] function CStyleImage ()
// [!dirty hack for minimizer - don't delete this comment!] function CFont ()
CStylesPainter.prototype.get_DefaultStylesImage = function() { return this.defaultStylesImage; }
CStylesPainter.prototype.get_DocStylesImage = function() { return this.docStylesImage; }
CStylesPainter.prototype.get_MergedStyles = function() { return this.mergedStyles; }
CStylesPainter.prototype.get_STYLE_THUMBNAIL_WIDTH = function() { return this.STYLE_THUMBNAIL_WIDTH; }
CStylesPainter.prototype.get_STYLE_THUMBNAIL_HEIGHT = function() { return this.STYLE_THUMBNAIL_HEIGHT; }
CStylesPainter.prototype.get_IsRetinaEnabled = function() { return this.IsRetinaEnabled; }

CStyleImage.prototype.get_ThumbnailOffset = function() { return this.ThumbnailOffset; }
CStyleImage.prototype.get_Type = function() { return this.Type; }
CStyleImage.prototype.get_Name = function() { return this.Name; }

CFont.prototype.asc_getFontId = function() { return this.id; }
CFont.prototype.asc_getFontName = function() { return this.name; }
CFont.prototype.asc_getFontThumbnail = function() { return this.thumbnail; }
CFont.prototype.asc_getFontType = function() { return this.type; }

var DocumentPageSize = new function() {
    this.oSizes = [{name:"US Letter", w_mm: 215.9, h_mm: 279.4, w_tw: 12240, h_tw: 15840},
        {name:"US Legal", w_mm: 215.9, h_mm: 355.6, w_tw: 12240, h_tw: 20160},
        {name:"A4", w_mm: 210, h_mm: 297, w_tw: 11907, h_tw: 16839},
        {name:"A5", w_mm: 148.1, h_mm: 209.9, w_tw: 8391, h_tw: 11907},
        {name:"B5", w_mm: 176, h_mm: 250.1, w_tw: 9979, h_tw: 14175},
        {name:"Envelope #10", w_mm: 104.8, h_mm: 241.3, w_tw: 5940, h_tw: 13680},
        {name:"Envelope DL", w_mm: 110.1, h_mm: 220.1, w_tw: 6237, h_tw: 12474},
        {name:"Tabloid", w_mm: 279.4, h_mm: 431.7, w_tw: 15842, h_tw: 24477},
        {name:"A3", w_mm: 297, h_mm: 420.1, w_tw: 16840, h_tw: 23820},
        {name:"Tabloid Oversize", w_mm: 304.8, h_mm: 457.1, w_tw: 17282, h_tw: 25918},
        {name:"ROC 16K", w_mm: 196.8, h_mm: 273, w_tw: 11164, h_tw: 15485},
        {name:"Envelope Coukei 3", w_mm: 119.9, h_mm: 234.9, w_tw: 6798, h_tw: 13319},
        {name:"Super B/A3", w_mm: 330.2, h_mm: 482.5, w_tw: 18722, h_tw: 27358}
    ];
    this.sizeEpsMM = 0.5;
    this.getSize = function(widthMm, heightMm)
    {
        for( var index in this.oSizes)
        {
            var item = this.oSizes[index];
            if(Math.abs(widthMm - item.w_mm) < this.sizeEpsMM && Math.abs(heightMm - item.h_mm) < this.sizeEpsMM)
                return item;
        }
        return {w_mm: widthMm, h_mm: heightMm};
    };
};

// пользоваться так:
// подрубить его последним из скриптов к страничке
// и вызвать, после подгрузки (конец метода OnInit <- Drawing/HtmlPage.js)
// var _api = new asc_docs_api();
// _api.init(oWordControl);

function asc_docs_api(name)
{
    var CDocsCoApi      = window["CDocsCoApi"];
    var CSpellCheckApi  = window["CSpellCheckApi"];

    History    = new CHistory();
    g_oTableId = new CTableId();

	/************ private!!! **************/
    this.HtmlElementName = name;

    this.WordControl = new CEditorPage(this);
    this.WordControl.Name = this.HtmlElementName;

    this.FontLoader = window.g_font_loader;
    this.ImageLoader = window.g_image_loader;
	this.ScriptLoader = window.g_script_loader;
	this.ScriptSpellCheckLoader = window.g_script_loader2;
    this.FontLoader.put_Api(this);
    this.ImageLoader.put_Api(this);

    this.FontLoader.SetStandartFonts();

    this.LoadedObject = null;
    this.DocumentType = 0; // 0 - empty, 1 - test, 2 - document (from json)

    this.DocumentUrl = "";
    this.DocumentName = "";
	this.DocInfo = null;
	this.InterfaceLocale = null;
        
    this.ShowParaMarks = false;
	this.isAddSpaceBetweenPrg = false;
    this.isPageBreakBefore = false;
    this.isKeepLinesTogether = false;

    this.isMobileVersion = false;
    this.isPaintFormat = false;
    this.isMarkerFormat = false;
    this.isViewMode = false;
    this.isStartAddShape = false;
    this.addShapePreset = "";
    this.isShowTableEmptyLine = true;
    this.isShowTableEmptyLineAttack = false;

    this.isApplyChangesOnOpen = false;
    this.isApplyChangesOnOpenEnabled = true;

    // CoAuthoring and Chat
    this.User = undefined;
    this.CoAuthoringApi = new CDocsCoApi();
	this.isCoAuthoringEnable = true;
    this.isCoMarksDraw = false;

	// Spell Checking
	this.SpellCheckApi = new CSpellCheckApi();
	this.isSpellCheckEnable = true;
	
	// Chart
	this.chartTranslate = new asc_CChartTranslate();

    // это чтобы сразу показать ридер, без возможности вернуться в редактор/вьюер
    this.isOnlyReaderMode = false;
	
    /**************************************/

	// AutoSave
	this.autoSaveGap = 0;				// Интервал автосохранения (0 - означает, что автосохранения нет) в милесекундах
	this.autoSaveTimeOutId = null;		// Идентификатор таймаута
	this.isAutoSave = false;			// Флаг, означает что запущено автосохранение
	this.autoSaveGapAsk = 5000;			// Константа для повторного запуска автосохранения, если не смогли сделать сразу lock (только при автосохранении) в милесекундах

    this.bInit_word_control = false;
	this.isDocumentModify = false;

    this.isImageChangeUrl = false;
    this.isShapeImageChangeUrl = false;

    this.FontAsyncLoadType = 0;
    this.FontAsyncLoadParam = null;
	
    this.isPasteFonts_Images = false;
    this.isLoadNoCutFonts = false;
	
	// На этапе сборки значение переменной ASC_DOCS_API_USE_EMBEDDED_FONTS может менятся.
	// По дефолту встроенные шрифты использоваться не будут, как и при любом значении
	// ASC_DOCS_API_USE_EMBEDDED_FONTS, кроме "true"(написание от регистра не зависит).
    this.isUseEmbeddedCutFonts = ("true" == ASC_DOCS_API_USE_EMBEDDED_FONTS.toLowerCase());

    this.pasteCallback = null;
    this.pasteImageMap = null;
    this.EndActionLoadImages = 0;

    this.isSaveFonts_Images = false;
    this.saveImageMap = null;
	this.canSave = true;//Флаг нужен чтобы не происходило сохранение пока не завершится предыдущее сохранение

    this.isLoadImagesCustom = false;
    this.loadCustomImageMap = null;

    this.ServerIdWaitComplete = false;
    this.ServerImagesWaitComplete = false;

    this.DocumentOrientation = orientation_Portrait ? true : false;

    this.SelectedObjectsStack = [];

    this.noCreatePoint = false;
	this.isDocumentEditor = true;

    this.OpenDocumentProgress = new CDocOpenProgress();
    this._lastConvertProgress = 0;

    this.CurrentTranslate = translations_map["en"];

    this.CollaborativeMarksShowType = c_oAscCollaborativeMarksShowType.All;

    // объекты, нужные для отправки в тулбар (шрифты, стили)
    this._gui_fonts = null;
    this._gui_styles = null;
    this._gui_control_colors = null;
    this._gui_color_schemes = null;

    //выставляем тип copypaste
    g_bIsDocumentCopyPaste = true;
    this.DocumentReaderMode = null;
	
	this.isChartEditor = false;
	
	if(typeof ChartStyleManager != "undefined")
		this.chartStyleManager = new ChartStyleManager();
	else
		this.chartStyleManager = null;
	if(typeof ChartPreviewManager != "undefined")
		this.chartPreviewManager = new ChartPreviewManager();
	else
		this.chartPreviewManager = null;
	
    this.IsLongActionCurrent = false;
    this.ParcedDocument = false;
	this.isStartCoAuthoringOnEndLoad = false;	// Подсоединились раньше, чем документ загрузился
	
	this.TrackFile = null;

	var oThis = this;
	if(window.addEventListener)
		window.addEventListener("message", function(){
			oThis.OnHandleMessage.apply(oThis, arguments);
		}, false);
	if ("undefined" != typeof(FileReader) && "undefined" != typeof(FormData)) {
		//var element = document.body;
		var element = document.getElementById(this.HtmlElementName);
		if(null != element)
		{
			element["ondragover"] = function(e) {
				e.preventDefault();
				if(CanDropFiles(e))
					e.dataTransfer.dropEffect = 'copy';
				else
					e.dataTransfer.dropEffect = 'none';
				return false;
			};
			element["ondrop"] = function(e) {
				e.preventDefault();
				var files = e.dataTransfer.files;
				var nError = ValidateUploadImage(files);
				if(c_oAscServerError.NoError == nError)
				{
					oThis.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
					var xhr = new XMLHttpRequest();
					var fd = new FormData();
					for(var i = 0, length = files.length; i < length; i++)
						fd.append('file[' + i + ']', files[i]);
					xhr.open('POST', g_sUploadServiceLocalUrl+'?key='+documentId);
					xhr.onreadystatechange = function(){
						if(4 == this.readyState)
						{
							if((this.status == 200 || this.status == 1223))
							{
								var frameWindow = GetUploadIFrame();
								var content = this.responseText;
								frameWindow.document.open();
								frameWindow.document.write(content);
								frameWindow.document.close();
							}
							else
								oThis.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
							oThis.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
						}
					};
					xhr.send(fd);
				}
				else
					oThis.asc_fireCallback("asc_onError",_mapAscServerErrorToAscError(nError),c_oAscError.Level.NoCritical);
			};
		}
	}

    if (window.editor == undefined)
    {
        window.editor = this;
        window['editor'] = window.editor;
        
        if (window["NATIVE_EDITOR_ENJINE"])
            editor = window.editor;
    }
    CHART_STYLE_MANAGER = new CChartStyleManager();
}

asc_docs_api.prototype.LoadFontsFromServer = function(_fonts)
{
    if (undefined === _fonts)
        _fonts = ["Arial","Symbol","Wingdings","Wingdings 3","Courier New","Times New Roman"];
    this.FontLoader.LoadFontsFromServer(_fonts);
}

asc_docs_api.prototype.SetCollaborativeMarksShowType = function(Type)
{
    this.CollaborativeMarksShowType = Type;
}

asc_docs_api.prototype.GetCollaborativeMarksShowType = function(Type)
{
    return this.CollaborativeMarksShowType;
}

asc_docs_api.prototype.Clear_CollaborativeMarks = function()
{
    CollaborativeEditing.Clear_CollaborativeMarks(true);
}

asc_docs_api.prototype.SetLanguage = function(langId)
{
    langId = langId.toLowerCase();
    if (undefined !== translations_map[langId])
        this.CurrentTranslate = translations_map[langId];
}

asc_docs_api.prototype.asc_GetFontThumbnailsPath = function()
{
    return "../Common/Images/";
}

asc_docs_api.prototype.TranslateStyleName = function(style_name)
{
    var ret = this.CurrentTranslate.DefaultStyles[style_name];

    if (ret !== undefined)
        return ret;

    return style_name;
}

asc_docs_api.prototype.SetUnchangedDocument = function()
{
    History.Reset_SavedIndex();

    this.isDocumentModify = false;
    //this.WordControl.m_oDrawingDocument.m_bIsSendApiDocChanged = false;

    this.asc_fireCallback("asc_onDocumentModifiedChanged");
}

asc_docs_api.prototype.isDocumentModified = function()
{
	if (!this.canSave) {
		// Пока идет сохранение, мы не закрываем документ
		return true;
	}
    return this.isDocumentModify;
}

asc_docs_api.prototype.sync_BeginCatchSelectedElements = function()
{
    if (0 != this.SelectedObjectsStack.length)
        this.SelectedObjectsStack.splice(0, this.SelectedObjectsStack.length);

    if (this.WordControl && this.WordControl.m_oDrawingDocument)
        this.WordControl.m_oDrawingDocument.StartTableStylesCheck();
}
asc_docs_api.prototype.sync_EndCatchSelectedElements = function()
{
    if (this.WordControl && this.WordControl.m_oDrawingDocument)
        this.WordControl.m_oDrawingDocument.EndTableStylesCheck();

    this.asc_fireCallback("asc_onFocusObject", this.SelectedObjectsStack);
}
asc_docs_api.prototype.getSelectedElements = function(bUpdate)
{
    if ( true === bUpdate )
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

    return this.SelectedObjectsStack;
}
asc_docs_api.prototype.sync_ChangeLastSelectedElement = function(type, obj)
{			
	var oUnkTypeObj = null;
			
	switch( type )
	{
		case c_oAscTypeSelectElement.Paragraph: oUnkTypeObj = new CParagraphProp( obj );
			break;
		case c_oAscTypeSelectElement.Image: oUnkTypeObj = new CImgProperty( obj );
			break;
		case c_oAscTypeSelectElement.Table: oUnkTypeObj = new CTableProp( obj );
			break;
		case c_oAscTypeSelectElement.Header: oUnkTypeObj = new CHeaderProp( obj );
			break;
	}
			
    var _i = this.SelectedObjectsStack.length - 1;
    var bIsFound = false;
    while (_i >= 0)
    {
        if (this.SelectedObjectsStack[_i].Type == type)
        {

            this.SelectedObjectsStack[_i].Value = oUnkTypeObj;
            bIsFound = true;
            break;
        }
        _i--;
    }

    if (!bIsFound)
    {
        this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( type, oUnkTypeObj );
    }
}

asc_docs_api.prototype.Init = function()
{
	this.WordControl.Init();
}
asc_docs_api.prototype.asc_getEditorPermissions = function()
{
	if (undefined != window['qtDocBridge'])
	{
		// set permissions
		//var asc_CAscEditorPermissions = window["Asc"].asc_CAscEditorPermissions;
		//editor.asc_fireCallback("asc_onGetEditorPermissions", new asc_CAscEditorPermissions());	
	}
	else
	{
		if (this.DocInfo && this.DocInfo.get_Id()) {
			var rData = {
				"c"			: "getsettings",
				"id"		: this.DocInfo.get_Id(),
				"userid"	: this.DocInfo.get_UserId(),
				"format"	: this.DocInfo.get_Format(),
				"vkey"		: this.DocInfo.get_VKey(),
				"editorid"	: c_oEditorId.Word
			};
			
			sendCommand( this, this.asc_getEditorPermissionsCallback, rData );
		} else {
			var asc_CAscEditorPermissions = window["Asc"].asc_CAscEditorPermissions;
			editor.asc_fireCallback("asc_onGetEditorPermissions", new asc_CAscEditorPermissions());	
		}
	}
};

asc_docs_api.prototype.asc_getLicense = function () 
{
	if (undefined != window['qtDocBridge'])
	{
		editor._onGetLicense(null);
	}
	else
	{
		var t = this;
		var rdata = {
			"c" 		: "getlicense"
		};
		sendCommand(this, function (response) {t._onGetLicense(response);}, rdata);
	}
};

asc_docs_api.prototype.asc_getEditorPermissionsCallback = function(incomeObject)
{				
	if(null != incomeObject && "getsettings" == incomeObject["type"]){
		var oSettings = JSON.parse(incomeObject["data"]);
		
		//Set up coauthoring and spellcheker service
		window.g_cAscCoAuthoringUrl = oSettings['g_cAscCoAuthoringUrl'];
		window.g_cAscSpellCheckUrl = oSettings['g_cAscSpellCheckUrl'];
		
		var asc_CAscEditorPermissions = window["Asc"].asc_CAscEditorPermissions;
		var oEditorPermissions = new asc_CAscEditorPermissions(oSettings);
		editor.asc_fireCallback("asc_onGetEditorPermissions", oEditorPermissions);
		
		if(undefined != oSettings['trackingInfo'] &&
			null != oSettings['trackingInfo'])
		{
			var asc_CTrackFile = window["Asc"].CTrackFile;
			editor.TrackFile = new asc_CTrackFile(oSettings['trackingInfo']);
			
			editor.TrackFile.setDocId(editor.DocInfo.get_Id());
			editor.TrackFile.setUserId(editor.DocInfo.get_UserId());
			editor.TrackFile.setTrackFunc(sendTrack);
			
			var _isDocumentModified = function(){
				return editor.isDocumentModified();
			};
			editor.TrackFile.setIsDocumentModifiedFunc(_isDocumentModified);
			
			if(undefined != oSettings['TrackingInterval'] &&
				null != oSettings['TrackingInterval'])
				editor.TrackFile.setInterval(oSettings['TrackingInterval']);
				
			editor.TrackFile.Start();							
		}
	}
}

asc_docs_api.prototype._onGetLicense = function (response) {
	if (null != response && "getlicense" == response.type){
		var oSettings = JSON.parse(response.data);
		var oLicense = (null != oSettings) ? new window["Asc"].asc_CAscLicense(oSettings) : null;
		this.asc_fireCallback("asc_onGetLicense", oLicense);
	}
};
asc_docs_api.prototype.asc_setDocInfo = function(c_DocInfo)
{
	if(c_DocInfo)
		this.DocInfo = c_DocInfo;
}
asc_docs_api.prototype.asc_setLocale = function(val)
{
	this.InterfaceLocale = val;
}
asc_docs_api.prototype.LoadDocument = function(c_DocInfo)
{

	this.asc_setDocInfo(c_DocInfo);
    this.WordControl.m_oDrawingDocument.m_bIsOpeningDocument = true;

	if(this.DocInfo){
		documentId = this.DocInfo.get_Id();
		documentUserId = this.DocInfo.get_UserId();
		documentUrl = this.DocInfo.get_Url();
		documentTitle = this.DocInfo.get_Title();
		documentFormat = this.DocInfo.get_Format();
		if(documentFormat)
		{
			switch(documentFormat)
			{
				case "docx" : documentFormatSave = c_oAscFileType.DOCX;break;
				case "doc" : documentFormatSave = c_oAscFileType.DOC;break;
				case "odt" : documentFormatSave = c_oAscFileType.ODT;break;
				case "rtf" : documentFormatSave = c_oAscFileType.RTF;break;
				case "txt" : documentFormatSave = c_oAscFileType.TXT;break;
				case "htm" :
				case "html" : documentFormatSave = c_oAscFileType.HTML_ZIP;break;
				case "mht" : documentFormatSave = c_oAscFileType.MHT;break;
				case "pdf" : documentFormatSave = c_oAscFileType.PDF;break;
				case "epub" : documentFormatSave = c_oAscFileType.EPUB;break;
				case "fb2" : documentFormatSave = c_oAscFileType.FB2;break;
				case "mobi" : documentFormatSave = c_oAscFileType.MOBI;break;
			}
		}
		var nIndex = -1;
		if(documentTitle)
			nIndex = documentTitle.lastIndexOf(".");
		if(-1 != nIndex)
			documentTitleWithoutExtention = documentTitle.substring(0, nIndex);
		else
			documentTitleWithoutExtention = documentTitle;
		
		documentVKey = this.DocInfo.get_VKey();
		// documentOrigin  = this.DocInfo.get_Origin();
		var sProtocol = window.location.protocol;
		var sHost = window.location.host;
		documentOrigin = "";
		if(sProtocol && "" != sProtocol)
			documentOrigin = sProtocol + "//" + sHost;
		else
			documentOrigin = sHost;

		var asc_user = window["Asc"].asc_CUser;
		this.User = new asc_user();
		this.User.asc_setId(this.DocInfo.get_UserId());
		this.User.asc_setUserName(this.DocInfo.get_UserName());
	}
	
    this.DocumentName = documentTitle;
	var oThis = this;

    if (this.DocInfo.get_OfflineApp() === true)
    {
        this.OfflineAppDocumentStartLoad();
        this.asyncServerIdStartLoaded();
        return;
    }

	if(documentId){
		var oOpenOptions = this.DocInfo.get_Options();
		if(oOpenOptions && oOpenOptions["isEmpty"])
		{
			var rData = {
				"c": "create",
				"id": documentId,
				"userid": documentUserId,
				"format": documentFormat,
				"vkey": documentVKey,
				"editorid": c_oEditorId.Word,
				"url": documentUrl,
				"title": documentTitle,
				"embeddedfonts": this.isUseEmbeddedCutFonts,
				"data": g_sEmpty_bin};
				
			sendCommand( oThis, function(){}, rData );
			editor.OpenDocument2(g_sResourceServiceLocalUrl + documentId + "/", g_sEmpty_bin);
			if(this.InterfaceLocale)
			{
				var nLocale = g_oLcidNameToIdMap[this.InterfaceLocale];
				if(null != nLocale)
					this.asc_setDefaultLanguage(nLocale);
			}
		}
		else
		{
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
			var rData = {
				"id": documentId,
				"userid": documentUserId,
				"format": documentFormat,
				"vkey": documentVKey,
				"editorid": c_oEditorId.Word,
				"c": "open",
				"url": documentUrl,
				"title": documentTitle,
				"embeddedfonts": this.isUseEmbeddedCutFonts};
				
			sendCommand( oThis, function(){}, rData );
		}
		this.sync_zoomChangeCallback(this.WordControl.m_nZoomValue, 0);
	}
	else
    {
		// ToDo убрать зависимость от this.FontLoader.fontFilesPath
        documentUrl = this.FontLoader.fontFilesPath + "../Word/document/";
        this.DocInfo.put_OfflineApp(true);

        // For test create unique id
        documentId = "test_document_id";
        this.OfflineAppDocumentStartLoad();
        this.sync_zoomChangeCallback(this.WordControl.m_nZoomValue, 0);
    }

    this.asyncServerIdStartLoaded();
}

asc_docs_api.prototype.SetFontsPath = function(path)
{
	this.FontLoader.fontFilesPath = path;
}

asc_docs_api.prototype.SetTextBoxInputMode = function(bIsEA)
{
    this.WordControl.SetTextBoxMode(bIsEA);
}
asc_docs_api.prototype.GetTextBoxInputMode = function()
{
    return this.WordControl.TextBoxInputMode;
}

asc_docs_api.prototype.ChangeReaderMode = function()
{
    return this.WordControl.ChangeReaderMode();
}
asc_docs_api.prototype.SetReaderModeOnly = function()
{
    this.isOnlyReaderMode = true;
    this.ImageLoader.bIsAsyncLoadDocumentImages = false;
}

asc_docs_api.prototype.IncreaseReaderFontSize = function()
{
    return this.WordControl.IncreaseReaderFontSize();
}
asc_docs_api.prototype.DecreaseReaderFontSize = function()
{
    return this.WordControl.DecreaseReaderFontSize();
}

asc_docs_api.prototype.CreateCSS = function()
{
    if (window["flat_desine"] === true)
    {
        GlobalSkin = GlobalSkinFlat;
    }

    var _head = document.getElementsByTagName('head')[0];

    var style0 = document.createElement('style');
    style0.type = 'text/css';
    style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
    _head.appendChild(style0);

    var style1 = document.createElement('style');
    style1.type = 'text/css';
    style1.innerHTML = ".buttonTabs {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAA5CAMAAADjueCuAAAABGdBTUEAALGPC/xhBQAAAEhQTFRFAAAAWFhYZWVlSEhIY2NjV1dXQ0NDYWFhYmJiTk5OVlZWYGBgVFRUS0tLbGxsRERETExMZmZmVVVVXl5eR0dHa2trPj4+u77CpAZQrwAAAAF0Uk5TAEDm2GYAAABwSURBVDjL1dHHDoAgEEVR7NLr4P//qQm6EMaFxtje8oTF5ELIpU35Fstf3GegsPEBG+uwSYpNB1qNKreoDeNw/r6dLr/tnFpbbNZj8wKbk8W/1d6ZPjfrhdHx9c4fbA9wzMYWm3OFhbQmbC2ue6z9DCH/Exf/mU3YAAAAAElFTkSuQmCC);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style1);

    var style2 = document.createElement('style');
    style2.type = 'text/css';
    style2.innerHTML = ".buttonRuler {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAYAAAAYX/pXAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABhElEQVRIS62Uwa6CMBBF/VQNQcOCBS5caOICApEt3+Wv+AcmfQ7pbdreqY+CJifTdjpng727aZrMFmbB+/3erYEE+/3egMPhMPP57QR/EJCgKAoTs1hQlqURjsdjAESyPp1O7pwEVVWZ1+s1VyB7DemRoK5rN+CvNaRPgqZpgqHz+UwSnEklweVyCQbivX8mlQTX65UGfG63m+vLXRLc7/ekQHoAexK0bWs0uq5TKwli8Afq+94Mw+CQPe78K5D6eDzMOI4GVcCdr4IlOMEWfiP4fJpVkEDLA38ghgR+DgB/ICYQ5OYBCez7d1mAvQZ6gcBmAK010A8ENg8c9u2rZ6iBwL51R7z3z1ADgc2DJDYPZnA3ENi3rhLlgauBAO8/JpUHJEih5QF6iwRaHqC3SPANJ9jCbwTP53MVJNDywB+IIYGfA8AfiAkEqTyQDEAO+HlAgtw8IEFuHpAgNw9IkJsHJMjNAxLk5gEJ8P5jUnlAghRaHqC3SKDlAXqLBN9wgvVM5g/dFuEU6U2wnAAAAABJRU5ErkJggg==);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style2);

    var style3 = document.createElement('style');
    style3.type = 'text/css';
    style3.innerHTML = ".buttonPrevPage {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgBAMAAADm/++TAAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAA////UVNVu77Cenp62Nrc3x8hMQAAAAF0Uk5TAEDm2GYAAABySURBVCjPY2AgETDBGEoKUAElJcJSxANjKGAwDQWDYAKMIBhDSRXCCFJSIixF0GS4M+AMExcwcCbAcIQxBEUgDEdBQcJSBE2GO4PU6IJHASxS4NGER4p28YWIAlikwKMJjxTt4gsRBbBIgUcTHini4wsAwMmIvYZODL0AAAAASUVORK5CYII=);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style3);

    var style4 = document.createElement('style');
    style4.type = 'text/css';
    style4.innerHTML = ".buttonNextPage {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgBAMAAADm/++TAAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAA////UVNVu77Cenp62Nrc3x8hMQAAAAF0Uk5TAEDm2GYAAABySURBVCjPY2AgETDBGEoKUAElJcJSxANjKGAwDQWDYAKMIBhDSRXCCFJSIixF0GS4M+AMExcwcCbAcIQxBEUgDEdBQcJSBE2GO4PU6IJHASxS4NGER4p28YWIAlikwKMJjxTt4gsRBbBIgUcTHini4wsAwMmIvYZODL0AAAAASUVORK5CYII=);\
background-position: 0px -48px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style4);
}

asc_docs_api.prototype.CreateComponents = function()
{
    this.CreateCSS();

	var element = document.getElementById(this.HtmlElementName);
	if (element != null)
		element.innerHTML = "<div id=\"id_main\" class=\"block_elem\" style=\"-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:" + GlobalSkin.BackgroundColor + ";overflow:hidden;\" UNSELECTABLE=\"on\">\
								<div id=\"id_panel_left\" class=\"block_elem\">\
									<div id=\"id_buttonTabs\" class=\"block_elem buttonTabs\"></div>\
									<canvas id=\"id_vert_ruler\" class=\"block_elem\"></canvas>\
								</div>\
									<div id=\"id_panel_top\" class=\"block_elem\">\
									<canvas id=\"id_hor_ruler\" class=\"block_elem\"></canvas>\
									</div>\
                                    <div id=\"id_main_view\" class=\"block_elem\" style=\"overflow:hidden\">\
                                        <canvas id=\"id_viewer\" class=\"block_elem\" style=\"background-color:" + GlobalSkin.BackgroundColor + ";z-index:1\"></canvas>\
									    <canvas id=\"id_viewer_overlay\" class=\"block_elem\" style=\"z-index:2\"></canvas>\
									    <canvas id=\"id_target_cursor\" class=\"block_elem\" width=\"1\" height=\"1\" style=\"width:2px;height:13px;display:none;z-index:3;\"></canvas>\
                                    </div>\
								</div>\
									<div id=\"id_panel_right\" class=\"block_elem\" style=\"margin-right:1px;background-color:" + GlobalSkin.BackgroundScroll + ";\">\
									<div id=\"id_buttonRulers\" class=\"block_elem buttonRuler\"></div>\
									<div id=\"id_vertical_scroll\" style=\"left:0;top:0;width:16px;overflow:hidden;position:absolute;\">\
									<div id=\"panel_right_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:16px;height:6000px;\"></div>\
									</div>\
									<div id=\"id_buttonPrevPage\" class=\"block_elem buttonPrevPage\"></div>\
									<div id=\"id_buttonNextPage\" class=\"block_elem buttonNextPage\"></div>\
								</div>\
									<div id=\"id_horscrollpanel\" class=\"block_elem\" style=\"margin-bottom:1px;background-color:" + GlobalSkin.BackgroundScroll + ";\">\
									<div id=\"id_horizontal_scroll\" style=\"left:0;top:0;height:16px;overflow:hidden;position:absolute;width:100%;\">\
										<div id=\"panel_hor_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:6000px;height:16px;\"></div>\
									</div>\
									</div>";
}

asc_docs_api.prototype.GetCopyPasteDivId = function()
{
    if (this.isMobileVersion)
        return this.WordControl.Name;
    return "";
}

asc_docs_api.prototype.ContentToHTML = function(bIsRet)
{
    this.DocumentReaderMode = new CDocumentReaderMode();
    var _old = copyPasteUseBinery;
    copyPasteUseBinery = false;
    Editor_Copy(this);
    copyPasteUseBinery = _old;
    this.DocumentReaderMode = null;
    return document.getElementById("SelectId").innerHTML;
}

asc_docs_api.prototype.InitEditor = function()
{
    this.WordControl.m_oLogicDocument   = new CDocument(this.WordControl.m_oDrawingDocument);
    this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;

    if (this.WordControl.MobileTouchManager)
        this.WordControl.MobileTouchManager.LogicDocument = this.WordControl.m_oLogicDocument;
}

asc_docs_api.prototype.SetInterfaceDrawImagePlaceShape = function(div_id)
{
    this.WordControl.m_oDrawingDocument.InitGuiCanvasShape(div_id);
}

asc_docs_api.prototype.InitViewer = function()
{
    this.WordControl.m_oDrawingDocument.m_oDocumentRenderer = new CDocMeta();
}

asc_docs_api.prototype.OpenNewDocument = function()
{
	if (undefined != window['qtDocBridge'])
	{
		// push data to native QT code
		window['qtDocBridge']['openedNewDocument'] ();
	}
	else
	{
		this.OpenEmptyDocument();
	}
}

asc_docs_api.prototype.LoadDocumentFromDisk = function()
{
	if (undefined != window['qtDocBridge'])
	{
		// push data to native QT code
		window['qtDocBridge']['loadedDocumentFromDisk'] ();
	}
	else
	{
		// may be it's useful for online version too
	}
}

asc_docs_api.prototype.OpenTestDocumentViewer = function()
{
	this.LoadedObject = null;
	this.DocumentType = 1;

    this.InitViewer();
    this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Load("./Document/", window["document_base64"]);
    delete window["document_base64"];
	this.FontLoader.LoadDocumentFonts(this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Fonts, true);
}

asc_docs_api.prototype.OpenDocument = function(url, gObject)
{
    this.isOnlyReaderMode = false;
    this.InitViewer();
    this.LoadedObject = null;
    this.DocumentType = 1;
    this.ServerIdWaitComplete = true;

    this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Load(url, gObject);
    this.FontLoader.LoadDocumentFonts(this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Fonts, true);
}

asc_docs_api.prototype.OpenDocument2 = function(url, gObject)
{
	this.InitEditor();
	this.DocumentUrl = url;
	this.DocumentType = 2;
	this.LoadedObjectDS = Common_CopyObj(this.WordControl.m_oLogicDocument.Get_Styles().Style);

	g_oIdCounter.Set_Load(true);

	var openParams = {checkFileSize: this.isMobileVersion, charCount: 0, parCount: 0};
	var oBinaryFileReader = new BinaryFileReader(this.WordControl.m_oLogicDocument, openParams);
	if(oBinaryFileReader.Read(gObject))
	{
		g_oIdCounter.Set_Load(false);
		this.LoadedObject = 1;

		this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

		// проверяем какие шрифты нужны
		this.WordControl.m_oDrawingDocument.CheckFontNeeds();
		window.global_pptx_content_loader.CheckImagesNeeds(this.WordControl.m_oLogicDocument);

		//this.asyncServerIdStartLoaded();

		//this.FontLoader.LoadEmbeddedFonts(this.DocumentUrl, this.WordControl.m_oLogicDocument.EmbeddedFonts);
		this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, false);
	}
	else
		editor.asc_fireCallback("asc_onError",c_oAscError.ID.MobileUnexpectedCharCount,c_oAscError.Level.Critical);

	//callback
	editor.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
	var sizeMM;
	if(editor.DocumentOrientation)
		sizeMM = DocumentPageSize.getSize(Page_Width, Page_Height);
	else
		sizeMM = DocumentPageSize.getSize(Page_Height, Page_Width);
	editor.sync_DocSizeCallback(sizeMM.w_mm, sizeMM.h_mm);
	editor.sync_PageOrientCallback(editor.get_DocumentOrientation());
							
    this.ParcedDocument = true;
	if (this.isStartCoAuthoringOnEndLoad) {
		this.CoAuthoringApi.onStartCoAuthoring(true);
		this.isStartCoAuthoringOnEndLoad = false;
	}

    if (this.isMobileVersion)
    {
        window.USER_AGENT_SAFARI_MACOS = false;
        PASTE_ELEMENT_ID = "wrd_pastebin";
        ELEMENT_DISPAY_STYLE = "none";
    }

    if (window.USER_AGENT_SAFARI_MACOS)
        setInterval(SafariIntervalFocus, 10);
}
asc_docs_api.prototype.get_DocumentName = function()
{
	return this.DocumentName;
}
// Callbacks
/* все имена callback'оф начинаются с On. Пока сделаны:
	OnBold,
	OnItalic,
	OnUnderline,
	OnTextPrBaseline(возвращается расположение строки - supstring, superstring, baseline),
	OnPrAlign(выравнивание по ширине, правому краю, левому краю, по центру),
	OnListType( возвращается CListType )

	фейк-функции ожидающие TODO:
	Print,Undo,Redo,Copy,Cut,Paste,Share,Save,Download & callbacks
	OnFontName, OnFontSize, OnLineSpacing

	OnFocusObject( возвращается массив CSelectedObject )
	OnInitEditorStyles( возвращается CStylesPainter )
	OnSearchFound( возвращается CSearchResult );
	OnParaSpacingLine( возвращается CParagraphSpacing )
	OnLineSpacing( не используется? )
	OnTextColor( возвращается CColor )
	OnTextHightLight( возвращается CColor )
	OnInitEditorFonts( возвращается массив объектов СFont )
	OnFontFamily( возвращается CTextFontFamily )
*/
var _callbacks = {};

asc_docs_api.prototype.asc_registerCallback = function(name, callback) {
	if (!_callbacks.hasOwnProperty(name))
		_callbacks[name] = [];
	_callbacks[name].push(callback);
}

asc_docs_api.prototype.asc_unregisterCallback = function(name, callback) {
	if (_callbacks.hasOwnProperty(name)) {
		for (var i = _callbacks[name].length - 1; i >= 0 ; --i) {
			if (_callbacks[name][i] == callback)
				_callbacks[name].splice(i, 1);
		}
	}
		_callbacks[name] = []
	_callbacks[name].push(callback);
}

asc_docs_api.prototype.asc_fireCallback = function(name) {
	if (_callbacks.hasOwnProperty(name))
    {
		for (var i = 0; i < _callbacks[name].length; ++i)
        {
			_callbacks[name][i].apply(this || window, Array.prototype.slice.call(arguments, 1));
		}
        return true;
	}
    return false;
}

asc_docs_api.prototype.asc_checkNeedCallback = function(name) {
    if (_callbacks.hasOwnProperty(name))
    {
        return true;
    }
    return false;
}

// тут методы, замены евентов
asc_docs_api.prototype.get_PropertyEditorShapes = function()
{
    var ret = [g_oAutoShapesGroups, g_oAutoShapesTypes];
    return ret;
}
asc_docs_api.prototype.get_PropertyEditorFonts = function()
{
    return this._gui_fonts;
}
asc_docs_api.prototype.get_PropertyStandartTextures = function()
{
    var _count = g_oUserTexturePresets.length;
    var arr = new Array(_count);
    for (var i = 0; i < _count; ++i)
    {
        arr[i] = new CAscTexture();
        arr[i].Id = i;
        arr[i].Image = g_oUserTexturePresets[i];
    }
    return arr;
}
asc_docs_api.prototype.get_PropertyEditorStyles = function()
{
    return this._gui_styles;
}
asc_docs_api.prototype.get_PropertyThemeColors = function()
{
    var _ret = [this._gui_control_colors.Colors, this._gui_control_colors.StandartColors];
    return _ret;
}
asc_docs_api.prototype.get_PropertyThemeColorSchemes = function()
{
    return this._gui_color_schemes;
}
// -------

/////////////////////////////////////////////////////////////////////////
///////////////////CoAuthoring and Chat api//////////////////////////////
/////////////////////////////////////////////////////////////////////////

function CChatMessage(user, message)
{
    this.UserId = (undefined != user_id) ? user_id : null;
    this.Message = (undefined != message) ? message : null;
}
CChatMessage.prototype.get_UserId = function() { return this.UserId; }
CChatMessage.prototype.get_Message = function() { return this.Message; }

/*
    ToDo Register Callback OnCoAuthoringChatReceiveMessage return object CChatMessage (возможно возвращается МАСС�?В CChatMessage со всеми сообщениями)
    ToDo Register Callback OnCoAuthoringConnectUser возвращается userId
    ToDo Register Callback OnCoAuthoringDisconnectUser возвращается userId
 */
// Init CoAuthoring
asc_docs_api.prototype._coAuthoringInit = function()
{
    if (!this.CoAuthoringApi) {
		g_oIdCounter.Set_Load(false);
		this.asyncServerIdEndLoaded ();
        return; // Error
	}

	if (undefined !== window['g_cAscCoAuthoringUrl'])
		window.g_cAscCoAuthoringUrl = window['g_cAscCoAuthoringUrl'];
	if (undefined !== window.g_cAscCoAuthoringUrl) {
		//Turn off CoAuthoring feature if it disabled
		if (!this.isCoAuthoringEnable)
			window.g_cAscCoAuthoringUrl = "";
			
		this.CoAuthoringApi.set_url(window.g_cAscCoAuthoringUrl);
	}
	//Если User не задан, отключаем коавторинг.
	if (null == this.User || null == this.User.asc_getId()) {
		var asc_user = window["Asc"].asc_CUser;
		this.User = new asc_user();
		this.User.asc_setId("Unknown");
		this.User.asc_setUserName("Unknown");

		this.CoAuthoringApi.set_url("");
	}

    var t = this;
    this.CoAuthoringApi.onParticipantsChanged   	= function (e, CountEditUsers) {
        t.asc_fireCallback("asc_onParticipantsChanged", e, CountEditUsers);

        if ( 1 >= CountEditUsers )
            editor.asc_setDrawCollaborationMarks(false);
        else
            editor.asc_setDrawCollaborationMarks(true);
    };
	this.CoAuthoringApi.onAuthParticipantsChanged  	= function (e, count) { t.asc_fireCallback("asc_onAuthParticipantsChanged", e, count); };
    this.CoAuthoringApi.onMessage               	= function (e, count) { t.asc_fireCallback("asc_onCoAuthoringChatReceiveMessage", e); };
	this.CoAuthoringApi.onConnectionStateChanged	= function (e) { t.asc_fireCallback("asc_onConnectionStateChanged", e); };
	this.CoAuthoringApi.onLocksAcquired				= function (e)
    {
        if ( 2 != e["state"] )
        {
            var Id = e["block"];
            var Class = g_oTableId.Get_ById( Id );
            if ( null != Class )
            {
                var Lock = Class.Lock;

                var OldType = Class.Lock.Get_Type();
                if ( locktype_Other2 === OldType || locktype_Other3 === OldType )
                    Lock.Set_Type( locktype_Other3, true );
                else
                    Lock.Set_Type( locktype_Other, true );

                // Выставляем ID пользователя, залочившего данный элемент
                Lock.Set_UserId( e["user"] );

                if ( Class instanceof CHeaderFooterController )
                    editor.sync_LockHeaderFooters();
                else if ( Class instanceof CDocument )
                    editor.sync_LockDocumentProps();
                else if ( Class instanceof CComment )
                    editor.sync_LockComment(Class.Get_Id(), e["user"]);
                else if ( Class instanceof CGraphicObjects )
                    editor.sync_LockDocumentSchema();

                // TODO: Здесь для ускорения надо сделать проверку, является ли текущим элемент с
                //       заданным Id. Если нет, тогда и не надо обновлять состояние.
                editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
            }
            else
            {
                CollaborativeEditing.Add_NeedLock(Id, e["user"]);
            }
        }
    };
	this.CoAuthoringApi.onLocksReleased				= function (e, bChanges)
    {
        var Id = e["block"];
        var Class = g_oTableId.Get_ById( Id );
        if ( null != Class )
        {
            var Lock = Class.Lock;
            if ( "undefined" != typeof(Lock) )
            {
                var CurType = Lock.Get_Type();

                var NewType = locktype_None;

                if ( CurType === locktype_Other )
                {
                    if ( true != bChanges )
                        NewType = locktype_None;
                    else
                    {
                        NewType = locktype_Other2;
                        CollaborativeEditing.Add_Unlock(Class);
                    }
                }
                else if ( CurType === locktype_Mine )
                {
                    // Такого быть не должно
                    NewType = locktype_Mine;
                }
                else if ( CurType === locktype_Other2 || CurType === locktype_Other3 )
                    NewType = locktype_Other2;

                Lock.Set_Type( NewType, true );
            }
        }
        else
        {
            CollaborativeEditing.Remove_NeedLock(Id);
        }
    };
	this.CoAuthoringApi.onSaveChanges				= function (e, userId, bSendEvent)
	{
		var oUser = t.CoAuthoringApi.getUser(userId);
		var nColor = oUser ? oUser.asc_getColorValue() :  null;
        var oColor = null !== nColor ? new CDocumentColor( (nColor >> 16) & 0xFF, (nColor >> 8) & 0xFF, nColor & 0xFF ) : new CDocumentColor( 191, 255, 199 );

        var Count = e.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Changes = new CCollaborativeChanges();
            Changes.Set_Id( e[Index]["Id"] );
            Changes.Set_Data( e[Index]["Data"] );
            Changes.Set_Color( oColor );
            CollaborativeEditing.Add_Changes( Changes );
        }

        // т.е. если bSendEvent не задан, то посылаем  сообщение + когда загрузился документ
        if ( Count > 0 && false != bSendEvent && t.bInit_word_control )
            t.sync_CollaborativeChanges();
	};
	this.CoAuthoringApi.onFirstLoadChanges			= function (e, userId)
	{
        t.CoAuthoringApi.onSaveChanges(e, userId, false);
        //CollaborativeEditing.Apply_Changes();
	};
	this.CoAuthoringApi.onFirstLoadChangesEnd		= function () {
		t.asyncServerIdEndLoaded ();
	};
	this.CoAuthoringApi.onSetIndexUser			= function (e)
	{
		g_oIdCounter.Set_UserId("" + e);
	};
	this.CoAuthoringApi.onStartCoAuthoring		= function (isStartEvent) {
		if (t.ParcedDocument) {
			CollaborativeEditing.Start_CollaborationEditing();
			editor.asc_setDrawCollaborationMarks(true);
			editor.WordControl.m_oLogicDocument.DrawingDocument.Start_CollaborationEditing();

			if (true != History.Is_Clear()) {
				CollaborativeEditing.Apply_Changes();
				CollaborativeEditing.Send_Changes();
			}
		} else
			t.isStartCoAuthoringOnEndLoad = true;
	};
	/**
	 * Event об отсоединении от сервера
	 * @param {jQuery} e  event об отсоединении с причиной
	 * @param {Bool} isDisconnectAtAll  окончательно ли отсоединяемся(true) или будем пробовать сделать reconnect(false) + сами отключились
	 * @param {Bool} isCloseCoAuthoring
	 */
	this.CoAuthoringApi.onDisconnect				= function (e, isDisconnectAtAll, isCloseCoAuthoring) {
		if (0 === t.CoAuthoringApi.get_state())
			t.asyncServerIdEndLoaded();
		if (isDisconnectAtAll) {
			// Посылаем наверх эвент об отключении от сервера
			t.asc_fireCallback("asc_onСoAuthoringDisconnect");
			t.SetViewMode(true);
			if (!isCloseCoAuthoring){
				t.sync_ErrorCallback(c_oAscError.ID.CoAuthoringDisconnect, c_oAscError.Level.NoCritical);
			}
		}
	};

    this.CoAuthoringApi.init (editor.User, documentId, 'fghhfgsjdgfjs', window.location.host, g_sMainServiceLocalUrl, function(){
    }, c_oEditorId.Word, documentFormatSave);

    // ToDo init other callbacks
}

// send chart message
asc_docs_api.prototype.asc_coAuthoringChatSendMessage = function(message)
{
    if (!this.CoAuthoringApi)
        return; // Error
    this.CoAuthoringApi.sendMessage(message);
}
// get chart messages, возвращается массив CChatMessage
asc_docs_api.prototype.asc_coAuthoringChatGetMessages = function()
{
    if (!this.CoAuthoringApi)
		return; // Error
	this.CoAuthoringApi.getMessages();
}
// get users, возвращается массив users
asc_docs_api.prototype.asc_coAuthoringGetUsers = function()
{
    if (!this.CoAuthoringApi)
		return; // Error
	this.CoAuthoringApi.getUsers();
}
// server disconnect
asc_docs_api.prototype.asc_coAuthoringDisconnect = function () {
	if (!this.CoAuthoringApi)
		return; // Error
	this.CoAuthoringApi.disconnect();
}

/////////////////////////////////////////////////////////////////////////
//////////////////////////SpellChecking api//////////////////////////////
/////////////////////////////////////////////////////////////////////////
// Init SpellCheck
asc_docs_api.prototype._coSpellCheckInit = function() {
	if (!this.SpellCheckApi) {
		return; // Error
	}
	
	if(undefined !== window['g_cAscSpellCheckUrl'])
		window.g_cAscSpellCheckUrl = window['g_cAscSpellCheckUrl'];

	if(undefined !== window.g_cAscSpellCheckUrl) {
		//Turn off SpellCheck feature if it disabled
		if(!this.isSpellCheckEnable)
			window.g_cAscSpellCheckUrl = "";

		this.SpellCheckApi.set_url(window.g_cAscSpellCheckUrl);
	}

	this.SpellCheckApi.onSpellCheck	= function (e) {
		var incomeObject = JSON.parse(e);
		SpellCheck_CallBack(incomeObject);
	};

	this.SpellCheckApi.init (documentId);
};

asc_docs_api.prototype.asc_getSpellCheckLanguages = function() {
	return g_spellCheckLanguages;
};
/////////////////////////////////////////////////////////////////////////
////////////////////////////AutoSave api/////////////////////////////////
/////////////////////////////////////////////////////////////////////////
asc_docs_api.prototype.autoSaveInit = function (autoSaveGap) {
	// Очищаем предыдущий таймер
	if (null !== this.autoSaveTimeOutId)
		clearTimeout(this.autoSaveTimeOutId);

	if (autoSaveGap || this.autoSaveGap) {
		var t = this;
		this.autoSaveTimeOutId = setTimeout(function () {
			t.autoSaveTimeOutId = null;
			if (t.isViewMode) {
				/*
				 1) При загрузке файла на просмотре при совместном редактировании загрузится
				 файл уже с последними изменениями.
				 2) Далее при срабатывании автосохранения должны накатываться новые изменения
				 (это надо делать) при этом файл отсылаться не должен, т.к. изменений во вьювере нет.
				 3) Если пользователь отключил автосохранение, то изменения к нему приходить не
				 будут, поскольку это его решение.
				 */
				// Принимаем чужие изменения
				CollaborativeEditing.Apply_Changes();
				t.autoSaveInit();
			} else if (t.isDocumentModified())
				t.asc_Save(/*isAutoSave*/true);
			else
				t.autoSaveInit();
		}, (autoSaveGap || this.autoSaveGap));
	}
};

// get functions
// Возвращает
//{
// ParaPr :
// {
//    ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
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
//
//    Spacing :
//    {
//        Line     : 1.15,                  // Расстояние между строками внутри абзаца
//        LineRule : linerule_Auto,         // Тип расстрояния между строками
//        Before   : 0,                     // Дополнительное расстояние до абзаца
//        After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
//    },
//
//    Shd :
//    {
//        Value : shd_Nil,
//        Color :
//        {
//            r : 255,
//            g : 255,
//            b : 255
//        }
//    },
//
//    WidowControl : true,                  // Запрет висячих строк
//
//    Tabs : []
// },
//
// TextPr :
// {
//    Bold       : false,
//    Italic     : false,
//    Underline  : false,
//    Strikeout  : false,
//    FontFamily :
//    {
//        Name  : "Times New Roman",
//        Index : -1
//    },
//    FontSize   : 12,
//    Color      :
//    {
//        r : 0,
//        g : 0,
//        b : 0
//    },
//    VertAlign : vertalign_Baseline,
//    HighLight : highlight_None
// }
//}

// Paragraph spacing properties
function CParagraphInd (obj)
{
	if (obj)
	{
		this.Left      = (undefined != obj.Left     ) ? obj.Left      : null; // Левый отступ
		this.Right     = (undefined != obj.Right    ) ? obj.Right     : null; // Правый отступ
		this.FirstLine = (undefined != obj.FirstLine) ? obj.FirstLine : null; // Первая строка
	}
	else
	{
		this.Left      = undefined; // Левый отступ
		this.Right     = undefined; // Правый отступ
		this.FirstLine = undefined; // Первая строка
	}
}
CParagraphInd.prototype.get_Left = function () { return this.Left; }
CParagraphInd.prototype.put_Left = function (v) { this.Left = v; }
CParagraphInd.prototype.get_Right = function () { return this.Right; }
CParagraphInd.prototype.put_Right = function (v) { this.Right = v; }
CParagraphInd.prototype.get_FirstLine = function () { return this.FirstLine; }
CParagraphInd.prototype.put_FirstLine = function (v) { this.FirstLine = v; }


// Paragraph spacing properties
function CParagraphSpacing (obj)
{
	if (obj)
	{
		this.Line     = (undefined != obj.Line    ) ? obj.Line     : null; // Расстояние между строками внутри абзаца
		this.LineRule = (undefined != obj.LineRule) ? obj.LineRule : null; // Тип расстрояния между строками
		this.Before   = (undefined != obj.Before  ) ? obj.Before   : null; // Дополнительное расстояние до абзаца
		this.After    = (undefined != obj.After   ) ? obj.After    : null; // Дополнительное расстояние после абзаца
	}
	else
	{
		this.Line     = undefined; // Расстояние между строками внутри абзаца
		this.LineRule = undefined; // Тип расстрояния между строками
		this.Before   = undefined; // Дополнительное расстояние до абзаца
		this.After    = undefined; // Дополнительное расстояние после абзаца
	}
}
CParagraphSpacing.prototype.get_Line = function ()
{
	return this.Line;
}
CParagraphSpacing.prototype.get_LineRule = function ()
{
	return this.LineRule;
}
CParagraphSpacing.prototype.get_Before = function ()
{
	return this.Before;
}
CParagraphSpacing.prototype.get_After = function ()
{
	return this.After;
}

// Paragraph shd properties
function CParagraphShd (obj)
{
	if (obj)
	{
		this.Value = (undefined != obj.Value) ? obj.Value : null;
		this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom( obj.Color.r, obj.Color.g, obj.Color.b ) : null;
	}
	else
	{
		this.Value = shd_Nil;
		this.Color = CreateAscColorCustom(255, 255, 255);
	}
}
CParagraphShd.prototype.get_Value = function (){ return this.Value; }
CParagraphShd.prototype.put_Value = function (v){ this.Value = v; }
CParagraphShd.prototype.get_Color = function (){ return this.Color; }
CParagraphShd.prototype.put_Color = function (v){ this.Color = (v) ? v : null; }

function CParagraphTab(Pos, Value)
{
    this.Pos   = Pos;
    this.Value = Value;
}
CParagraphTab.prototype.get_Value = function (){ return this.Value; }
CParagraphTab.prototype.put_Value = function (v){ this.Value = v; }
CParagraphTab.prototype.get_Pos = function (){ return this.Pos; }
CParagraphTab.prototype.put_Pos = function (v){ this.Pos = v; }

function CParagraphTabs (obj)
{
    this.Tabs = [];

    if ( undefined != obj )
    {
        var Count = obj.Tabs.length;
        for (var Index = 0; Index < Count; Index++)
        {
            this.Tabs.push( new CParagraphTab(obj.Tabs[Index].Pos, obj.Tabs[Index].Value) );
        }
    }
}
CParagraphTabs.prototype.get_Count = function (){ return this.Tabs.length; }
CParagraphTabs.prototype.get_Tab = function (Index){ return this.Tabs[Index]; }
CParagraphTabs.prototype.add_Tab = function (Tab){ this.Tabs.push(Tab) }
CParagraphTabs.prototype.clear = function (){ this.Tabs.length = 0; }

function CParagraphFrame(obj)
{
    if ( obj )
    {
        this.FromDropCapMenu = false;

        this.DropCap = ( dropcap_None === obj.DropCap ? c_oAscDropCap.None : ( dropcap_Drop === obj.DropCap ? c_oAscDropCap.Drop : ( dropcap_Margin === obj.DropCap ? c_oAscDropCap.Margin : undefined ) ) );
        this.H       = obj.H;
        this.HAnchor = obj.HAnchor;
        this.HRule   = ( heightrule_AtLeast ===  obj.HRule ? linerule_AtLeast : ( heightrule_Auto === obj.HRule  ? linerule_Auto : ( heightrule_Exact === obj.HRule ? linerule_Exact : undefined ) ) );
        this.HSpace  = obj.HSpace;
        this.Lines   = obj.Lines;
        this.VAnchor = obj.VAnchor;
        this.VSpace  = obj.VSpace;
        this.W       = obj.W;
        this.Wrap    = ( wrap_Around === obj.Wrap ? true : ( wrap_None === obj.Wrap ? false : undefined ) );
        this.X       = obj.X;
        this.XAlign  = obj.XAlign;
        this.Y       = obj.Y;
        this.YAlign  = obj.YAlign;
        this.Brd     = (undefined != obj.Brd     && null != obj.Brd) ? new CParagraphBorders (obj.Brd) : null;
        this.Shd     = (undefined != obj.Shd     && null != obj.Shd)     ? new CParagraphShd (obj.Shd) : null;
        this.FontFamily = (undefined != obj.FontFamily && null != obj.FontFamily) ? new CTextFontFamily (obj.FontFamily) : null;
    }
    else
    {
        this.FromDropCapMenu = false;

        this.DropCap = undefined;
        this.H       = undefined;
        this.HAnchor = undefined;
        this.HRule   = undefined;
        this.HSpace  = undefined;
        this.Lines   = undefined;
        this.VAnchor = undefined;
        this.VSpace  = undefined;
        this.W       = undefined;
        this.Wrap    = undefined;
        this.X       = undefined;
        this.XAlign  = undefined;
        this.Y       = undefined;
        this.YAlign  = undefined;
        this.Shd     = null;
        this.Brd     = null;
        this.FontFamily = null;
    }
}

CParagraphFrame.prototype.get_DropCap = function () { return this.DropCap; }
CParagraphFrame.prototype.put_DropCap = function (v) { this.DropCap = v; }
CParagraphFrame.prototype.get_H = function () { return this.H; }
CParagraphFrame.prototype.put_H = function (v) { this.H = v; }
CParagraphFrame.prototype.get_HAnchor = function () { return this.HAnchor; }
CParagraphFrame.prototype.put_HAnchor = function (v) { this.HAnchor = v; }
CParagraphFrame.prototype.get_HRule = function () { return this.HRule; }
CParagraphFrame.prototype.put_HRule = function (v) { this.HRule = v; }
CParagraphFrame.prototype.get_HSpace = function () { return this.HSpace; }
CParagraphFrame.prototype.put_HSpace = function (v) { this.HSpace = v; }
CParagraphFrame.prototype.get_Lines = function () { return this.Lines; }
CParagraphFrame.prototype.put_Lines = function (v) { this.Lines = v; }
CParagraphFrame.prototype.get_VAnchor = function () { return this.VAnchor; }
CParagraphFrame.prototype.put_VAnchor = function (v) { this.VAnchor = v; }
CParagraphFrame.prototype.get_VSpace = function () { return this.VSpace; }
CParagraphFrame.prototype.put_VSpace = function (v) { this.VSpace = v; }
CParagraphFrame.prototype.get_W = function () { return this.W; }
CParagraphFrame.prototype.put_W = function (v) { this.W = v; }
CParagraphFrame.prototype.get_Wrap = function () { return this.Wrap; }
CParagraphFrame.prototype.put_Wrap = function (v) { this.Wrap = v; }
CParagraphFrame.prototype.get_X = function () { return this.X; }
CParagraphFrame.prototype.put_X = function (v) { this.X = v; }
CParagraphFrame.prototype.get_XAlign = function () { return this.XAlign; }
CParagraphFrame.prototype.put_XAlign = function (v) { this.XAlign = v; }
CParagraphFrame.prototype.get_Y = function () { return this.Y; }
CParagraphFrame.prototype.put_Y = function (v) { this.Y = v; }
CParagraphFrame.prototype.get_YAlign = function () { return this.YAlign; }
CParagraphFrame.prototype.put_YAlign = function (v) { this.YAlign = v; }
CParagraphFrame.prototype.get_Borders = function () { return this.Brd; }
CParagraphFrame.prototype.put_Borders = function (v) { this.Brd = v; }
CParagraphFrame.prototype.get_Shade = function () { return this.Shd; }
CParagraphFrame.prototype.put_Shade = function (v) { this.Shd = v; }
CParagraphFrame.prototype.get_FontFamily = function () { return this.FontFamily; }
CParagraphFrame.prototype.put_FontFamily = function (v) { this.FontFamily = v; }
CParagraphFrame.prototype.put_FromDropCapMenu = function (v) { this.FromDropCapMenu = v; }

asc_docs_api.prototype.put_FramePr = function(Obj)
{
    if ( undefined != Obj.FontFamily )
    {
        var name     = Obj.FontFamily;
        Obj.FontFamily = new CTextFontFamily( { Name : Obj.FontFamily, Index : -1 } );

        var loader   = window.g_font_loader;
        var nIndex   = loader.map_font_index[name];
        var fontinfo = loader.fontInfos[nIndex];
        var isasync  = loader.LoadFont(fontinfo, editor.asyncFontEndLoaded_DropCap, Obj);

        if (false === isasync)
        {
            if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                this.WordControl.m_oLogicDocument.Set_ParagraphFramePr( Obj );
            }
        }
    }
    else
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Set_ParagraphFramePr( Obj );
        }
    }
}

asc_docs_api.prototype.asyncFontEndLoaded_DropCap = function(Obj)
{
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphFramePr( Obj );
    }
    // отжать заморозку меню
}

asc_docs_api.prototype.asc_addDropCap = function(bInText)
{
    this.WordControl.m_oLogicDocument.Add_DropCap( bInText );
}

asc_docs_api.prototype.removeDropcap = function(bDropCap)
{
    this.WordControl.m_oLogicDocument.Remove_DropCap( bDropCap );
}

function CParagraphProp (obj)
{
	if (obj)
	{
		this.ContextualSpacing = (undefined != obj.ContextualSpacing)              ? obj.ContextualSpacing : null;
		this.Ind               = (undefined != obj.Ind     && null != obj.Ind)     ? new CParagraphInd (obj.Ind) : null;
		this.KeepLines         = (undefined != obj.KeepLines)                      ? obj.KeepLines : null;
        this.KeepNext          = (undefined != obj.KeepNext)                       ? obj.KeepNext  : undefined;
        this.WidowControl      = (undefined != obj.WidowControl                    ? obj.WidowControl : undefined );
		this.PageBreakBefore   = (undefined != obj.PageBreakBefore)                ? obj.PageBreakBefore : null;
		this.Spacing           = (undefined != obj.Spacing && null != obj.Spacing) ? new CParagraphSpacing (obj.Spacing) : null;
		this.Brd               = (undefined != obj.Brd     && null != obj.Brd)     ? new CParagraphBorders (obj.Brd) : null;
		this.Shd               = (undefined != obj.Shd     && null != obj.Shd)     ? new CParagraphShd (obj.Shd) : null;
        this.Tabs              = (undefined != obj.Tabs)                           ? new CParagraphTabs(obj.Tabs) : undefined;
        this.DefaultTab        = Default_Tab_Stop;
        this.Locked            = (undefined != obj.Locked  && null != obj.Locked ) ? obj.Locked : false;
        this.CanAddTable       = (undefined != obj.CanAddTable )                   ? obj.CanAddTable : true;
        this.FramePr           = (undefined != obj.FramePr )                       ? new CParagraphFrame( obj.FramePr ) : undefined;
        this.CanAddDropCap     = (undefined != obj.CanAddDropCap )                 ? obj.CanAddDropCap : false;

        this.Subscript         = (undefined != obj.Subscript)                      ? obj.Subscript   : undefined;
        this.Superscript       = (undefined != obj.Superscript)                    ? obj.Superscript : undefined;
        this.SmallCaps         = (undefined != obj.SmallCaps)                      ? obj.SmallCaps   : undefined;
        this.AllCaps           = (undefined != obj.AllCaps)                        ? obj.AllCaps     : undefined;
        this.Strikeout         = (undefined != obj.Strikeout)                      ? obj.Strikeout   : undefined;
        this.DStrikeout        = (undefined != obj.DStrikeout)                     ? obj.DStrikeout  : undefined;
        this.TextSpacing       = (undefined != obj.TextSpacing)                    ? obj.TextSpacing     : undefined;
        this.Position          = (undefined != obj.Position)                       ? obj.Position    : undefined;
	}
	else
	{
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
		this.Ind               = new CParagraphInd ();
		this.KeepLines         = undefined;
        this.KeepNext          = undefined;
        this.WidowControl      = undefined;
		this.PageBreakBefore   = undefined;
		this.Spacing           = new CParagraphSpacing ();
		this.Brd               = undefined;
        this.Shd               = undefined;
        this.Locked            = false;
        this.CanAddTable       = true;
        this.Tabs              = undefined;
        this.CanAddDropCap     = false;

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

CParagraphProp.prototype.get_ContextualSpacing = function () { return this.ContextualSpacing; }
CParagraphProp.prototype.put_ContextualSpacing = function (v) { this.ContextualSpacing = v; }
CParagraphProp.prototype.get_Ind = function () { return this.Ind; }
CParagraphProp.prototype.put_Ind = function (v) { this.Ind = v; }
CParagraphProp.prototype.get_KeepLines = function () { return this.KeepLines; }
CParagraphProp.prototype.put_KeepLines = function (v) { this.KeepLines = v; }
CParagraphProp.prototype.get_KeepNext = function () { return this.KeepNext; }
CParagraphProp.prototype.put_KeepNext = function (v) { this.KeepNext = v; }
CParagraphProp.prototype.get_PageBreakBefore = function (){ return this.PageBreakBefore; }
CParagraphProp.prototype.put_PageBreakBefore = function (v){ this.PageBreakBefore = v; }
CParagraphProp.prototype.get_WidowControl = function (){ return this.WidowControl; }
CParagraphProp.prototype.put_WidowControl = function (v){ this.WidowControl = v; }
CParagraphProp.prototype.get_Spacing = function () { return this.Spacing; }
CParagraphProp.prototype.put_Spacing = function (v) { this.Spacing = v; }
CParagraphProp.prototype.get_Borders = function () { return this.Brd; }
CParagraphProp.prototype.put_Borders = function (v) { this.Brd = v; }
CParagraphProp.prototype.get_Shade = function () { return this.Shd; }
CParagraphProp.prototype.put_Shade = function (v) { this.Shd = v; }
CParagraphProp.prototype.get_Locked = function() { return this.Locked; }
CParagraphProp.prototype.get_CanAddTable = function() { return this.CanAddTable; }
CParagraphProp.prototype.get_Subscript = function () { return this.Subscript; }
CParagraphProp.prototype.put_Subscript = function (v) { this.Subscript = v; }
CParagraphProp.prototype.get_Superscript = function () { return this.Superscript; }
CParagraphProp.prototype.put_Superscript = function (v) { this.Superscript = v; }
CParagraphProp.prototype.get_SmallCaps = function () { return this.SmallCaps; }
CParagraphProp.prototype.put_SmallCaps = function (v) { this.SmallCaps = v; }
CParagraphProp.prototype.get_AllCaps = function () { return this.AllCaps; }
CParagraphProp.prototype.put_AllCaps = function (v) { this.AllCaps = v; }
CParagraphProp.prototype.get_Strikeout = function () { return this.Strikeout; }
CParagraphProp.prototype.put_Strikeout = function (v) { this.Strikeout = v; }
CParagraphProp.prototype.get_DStrikeout = function () { return this.DStrikeout; }
CParagraphProp.prototype.put_DStrikeout = function (v) { this.DStrikeout = v; }
CParagraphProp.prototype.get_TextSpacing = function () { return this.TextSpacing; }
CParagraphProp.prototype.put_TextSpacing = function (v) { this.TextSpacing = v; }
CParagraphProp.prototype.get_Position = function () { return this.Position; }
CParagraphProp.prototype.put_Position = function (v) { this.Position = v; }
CParagraphProp.prototype.get_Tabs = function () { return this.Tabs; }
CParagraphProp.prototype.put_Tabs = function (v) { this.Tabs = v; }
CParagraphProp.prototype.get_DefaultTab = function () { return this.DefaultTab; }
CParagraphProp.prototype.put_DefaultTab = function (v) { this.DefaultTab = v; }
CParagraphProp.prototype.get_FramePr = function () { return this.FramePr; }
CParagraphProp.prototype.put_FramePr = function (v) { this.FramePr = v; }
CParagraphProp.prototype.get_CanAddDropCap = function() { return this.CanAddDropCap; }

// Paragraph properties
function CParagraphPropEx (obj)
{
	if (obj)
	{
		this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
		this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new CParagraphInd (obj.Ind) : null;
		this.Jc = (undefined != obj.Jc) ? obj.Jc : null;
		this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
		this.KeepNext = (undefined != obj.KeepNext) ? obj.KeepNext : null;
		this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
		this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new CParagraphSpacing (obj.Spacing) : null;
		this.Shd = (undefined != obj.Shd && null != obj.Shd) ? new CParagraphShd (obj.Shd) : null;
		this.WidowControl = (undefined != obj.WidowControl) ? obj.WidowControl : null;                  // Запрет висячих строк
		this.Tabs = obj.Tabs;
	}
	else
	{
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
		this.ContextualSpacing = false;
		this.Ind = new CParagraphInd ();
		this.Jc = align_Left;
		this.KeepLines = false;
		this.KeepNext = false;
		this.PageBreakBefore = false;
		this.Spacing = new CParagraphSpacing ();
		this.Shd = new CParagraphShd ();
		this.WidowControl = true;                  // Запрет висячих строк
		this.Tabs = null;
	}
}
CParagraphPropEx.prototype.get_ContextualSpacing = function ()
{
	return this.ContextualSpacing;
}
CParagraphPropEx.prototype.get_Ind = function ()
{
	return this.Ind;
}
CParagraphPropEx.prototype.get_Jc = function ()
{
	return this.Jc;
}
CParagraphPropEx.prototype.get_KeepLines = function ()
{
	return this.KeepLines;
}
CParagraphPropEx.prototype.get_KeepNext = function ()
{
	return this.KeepNext;
}
CParagraphPropEx.prototype.get_PageBreakBefore = function ()
{
	return this.PageBreakBefore;
}
CParagraphPropEx.prototype.get_Spacing = function ()
{
	return this.Spacing;
}
CParagraphPropEx.prototype.get_Shd = function ()
{
	return this.Shd;
}
CParagraphPropEx.prototype.get_WidowControl = function ()
{
	return this.WidowControl;
}
CParagraphPropEx.prototype.get_Tabs = function ()
{
	return this.Tabs;
}

// Text properties
// TextPr :
// {
//    Bold       : false,
//    Italic     : false,
//    Underline  : false,
//    Strikeout  : false,
//    FontFamily :
//    {
//        Name  : "Times New Roman",
//        Index : -1
//    },
//    FontSize   : 12,
//    Color      :
//    {
//        r : 0,
//        g : 0,
//        b : 0
//    },
//    VertAlign : vertalign_Baseline,
//    HighLight : highlight_None
// }
function CTextFontFamily (obj)
{
	if (obj)
	{
		this.Name = (undefined != obj.Name) ? obj.Name : null; 		// "Times New Roman"
		this.Index = (undefined != obj.Index) ? obj.Index : null;	// -1
	}
	else
	{
		this.Name = "Times New Roman";
		this.Index = -1;
	}
}
CTextFontFamily.prototype.get_Name = function ()
{
	return this.Name;
}
CTextFontFamily.prototype.get_Index = function ()
{
	return this.Index;
}
// CTextProp
function CTextProp (obj)
{
	if (obj)
	{
		this.Bold       = (undefined != obj.Bold) ? obj.Bold : null;
		this.Italic     = (undefined != obj.Italic) ? obj.Italic : null;
		this.Underline  = (undefined != obj.Underline) ? obj.Underline : null;
		this.Strikeout  = (undefined != obj.Strikeout) ? obj.Strikeout : null;
		this.FontFamily = (undefined != obj.FontFamily && null != obj.FontFamily) ? new CTextFontFamily (obj.FontFamily) : null;
		this.FontSize   = (undefined != obj.FontSize) ? obj.FontSize : null;
		this.Color      = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.VertAlign  = (undefined != obj.VertAlign) ? obj.VertAlign : null;
		this.HighLight  = (undefined != obj.HighLight) ? obj.HighLight == highlight_None ? obj.HighLight : new CColor (obj.HighLight.r, obj.HighLight.g, obj.HighLight.b) : null;
        this.DStrikeout = (undefined != obj.DStrikeout) ? obj.DStrikeout : null;
        this.Spacing    = (undefined != obj.Spacing)    ? obj.Spacing    : null;
        this.Caps       = (undefined != obj.Caps)       ? obj.Caps       : null;
        this.SmallCaps  = (undefined != obj.SmallCaps)  ? obj.SmallCaps  : null;
	}
	else
	{
		//    Bold       : false,
		//    Italic     : false,
		//    Underline  : false,
		//    Strikeout  : false,
		//    FontFamily :
		//    {
		//        Name  : "Times New Roman",
		//        Index : -1
		//    },
		//    FontSize   : 12,
		//    Color      :
		//    {
		//        r : 0,
		//        g : 0,
		//        b : 0
		//    },
		//    VertAlign : vertalign_Baseline,
		//    HighLight : highlight_None
		this.Bold       = false;
		this.Italic     = false;
		this.Underline  = false;
		this.Strikeout  = false;
		this.FontFamily = new CTextFontFamily();
		this.FontSize   = 12;
		this.Color      = CreateAscColorCustom(0, 0, 0);
		this.VertAlign  = vertalign_Baseline;
		this.HighLight  = highlight_None;
        this.DStrikeout = false;
        this.Spacing    = 0;
        this.Caps       = false;
        this.SmallCaps  = false;
    }
}
CTextProp.prototype.get_Bold = function ()
{
	return this.Bold;
}
CTextProp.prototype.get_Italic = function ()
{
	return this.Italic;
}
CTextProp.prototype.get_Underline = function ()
{
	return this.Underline;
}
CTextProp.prototype.get_Strikeout = function ()
{
	return this.Strikeout;
}
CTextProp.prototype.get_FontFamily = function ()
{
	return this.FontFamily;
}
CTextProp.prototype.get_FontSize = function ()
{
	return this.FontSize;
}
CTextProp.prototype.get_Color = function ()
{
	return this.Color;
}
CTextProp.prototype.get_VertAlign = function ()
{
	return this.VertAlign;
}
CTextProp.prototype.get_HighLight = function ()
{
	return this.HighLight;
}

CTextProp.prototype.get_Spacing = function ()
{
    return this.Spacing;
}

CTextProp.prototype.get_DStrikeout = function ()
{
    return this.DStrikeout;
}

CTextProp.prototype.get_Caps = function ()
{
    return this.Caps;
}

CTextProp.prototype.get_SmallCaps = function ()
{
    return this.SmallCaps;
}


// paragraph and text properties objects container
function CParagraphAndTextProp (paragraphProp, textProp)
{
	this.ParaPr = (undefined != paragraphProp && null != paragraphProp) ? new CParagraphPropEx (paragraphProp) : null;
	this.TextPr = (undefined != textProp && null != textProp) ? new CTextProp (textProp) : null;
}
CParagraphAndTextProp.prototype.get_ParaPr = function ()
{
	return this.ParaPr;
}
CParagraphAndTextProp.prototype.get_TextPr = function ()
{
	return this.TextPr;
}

//
asc_docs_api.prototype.get_TextProps = function()
{
	var Doc = this.WordControl.m_oLogicDocument;
	var ParaPr = Doc.Get_Paragraph_ParaPr();
	var TextPr = Doc.Get_Paragraph_TextPr();

	// return { ParaPr: ParaPr, TextPr : TextPr };
	return new CParagraphAndTextProp (ParaPr, TextPr);	// uncomment if this method will be used externally. 20/03/2012 uncommented for testers
}

// -------
asc_docs_api.prototype.GetJSONLogicDocument = function()
{
	return JSON.stringify(this.WordControl.m_oLogicDocument);
}

asc_docs_api.prototype.get_ContentCount = function()
{
	return this.WordControl.m_oLogicDocument.Content.length;
}

asc_docs_api.prototype.select_Element = function(Index)
{
	var Document = this.WordControl.m_oLogicDocument;

	if ( true === Document.Selection.Use )
		Document.Selection_Remove();

	Document.DrawingDocument.SelectEnabled(true);
	Document.DrawingDocument.TargetEnd();

	Document.Selection.Use      = true;
	Document.Selection.Start    = false;
	Document.Selection.Flag     = selectionflag_Common;

	Document.Selection.StartPos = Index;
	Document.Selection.EndPos   = Index;

	Document.Content[Index].Selection.Use      = true;
	Document.Content[Index].Selection.StartPos = Document.Content[Index].Internal_GetStartPos();
	Document.Content[Index].Selection.EndPos   = Document.Content[Index].Content.length - 1;

	Document.Selection_Draw();
}

asc_docs_api.prototype.UpdateTextPr = function(TextPr)
{
	if ( "undefined" != typeof(TextPr) )
	{
		var oTextPrMap =
        {
			Bold       : function(oThis, v){ oThis.sync_BoldCallBack(v); },
			Italic     : function(oThis, v){ oThis.sync_ItalicCallBack(v); },
			Underline  : function(oThis, v){ oThis.sync_UnderlineCallBack(v); },
			Strikeout  : function(oThis, v){ oThis.sync_StrikeoutCallBack(v); },
			FontSize   : function(oThis, v){ oThis.sync_TextPrFontSizeCallBack(v); },
			FontFamily : function(oThis, v){ oThis.sync_TextPrFontFamilyCallBack(v); },
			VertAlign  : function(oThis, v){ oThis.sync_VerticalAlign(v); },
			Color      : function(oThis, v){ oThis.sync_TextColor(v); },
			HighLight  : function(oThis, v){ oThis.sync_TextHighLight(v); },
            Spacing    : function(oThis, v){ oThis.sync_TextSpacing(v); },
            DStrikeout : function(oThis, v){ oThis.sync_TextDStrikeout(v); },
            Caps       : function(oThis, v){ oThis.sync_TextCaps(v); },
            SmallCaps  : function(oThis, v){ oThis.sync_TextSmallCaps(v); },
            Position   : function(oThis, v){ oThis.sync_TextPosition(v); },
            Lang       : function(oThis, v){ oThis.sync_TextLangCallBack(v);}
		}

        for ( var Item in oTextPrMap )
        {
            oTextPrMap[Item]( this, TextPr[Item] );
        }
	}
}
asc_docs_api.prototype.UpdateParagraphProp = function(ParaPr)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //{
    //    ParaPr.Locked      = true;
    //    ParaPr.CanAddTable = false;
    //}

	// var prgrhPr = this.get_TextProps();
	// var prProp = {};
	// prProp.Ind = prgrhPr.ParaPr.Ind;
	// prProp.ContextualSpacing = prgrhPr.ParaPr.ContextualSpacing;
	// prProp.Spacing = prgrhPr.ParaPr.Spacing;
	// prProp.PageBreakBefore = prgrhPr.ParaPr.PageBreakBefore;
	// prProp.KeepLines = prgrhPr.ParaPr.KeepLines;

	// {
	//    ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
	//
	//    Ind :
	//    {
	//        Left      : 0,                    // Левый отступ
	//        Right     : 0,                    // Правый отступ
	//        FirstLine : 0                     // Первая строка
	//    },
	//    Jc : align_Left,                      // Прилегание параграфа
	//    KeepLines : false,                    // переносить параграф на новую страницу,
	//                                          // если на текущей он целиком не убирается
	//    PageBreakBefore : false,              // начинать параграф с новой страницы
	//
	//    Spacing :
	//    {
	//        Line     : 1.15,                  // Расстояние между строками внутри абзаца
	//        LineRule : linerule_Auto,         // Тип расстрояния между строками
	//        Before   : 0,                     // Дополнительное расстояние до абзаца
	//        After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
	//    }
	//	}

    // TODO: как только разъединят настройки параграфа и текста переделать тут
    var TextPr = editor.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();
    ParaPr.Subscript   = ( TextPr.VertAlign === vertalign_SubScript   ? true : false );
    ParaPr.Superscript = ( TextPr.VertAlign === vertalign_SuperScript ? true : false );
    ParaPr.Strikeout   = TextPr.Strikeout;
    ParaPr.DStrikeout  = TextPr.DStrikeout;
    ParaPr.AllCaps     = TextPr.Caps;
    ParaPr.SmallCaps   = TextPr.SmallCaps;
    ParaPr.TextSpacing = TextPr.Spacing;
    ParaPr.Position    = TextPr.Position;
    //-----------------------------------------------------------------------------

    if ( true === ParaPr.Spacing.AfterAutoSpacing )
        ParaPr.Spacing.After = spacing_Auto;
    else if ( undefined === ParaPr.Spacing.AfterAutoSpacing )
        ParaPr.Spacing.After = UnknownValue;

    if ( true === ParaPr.Spacing.BeforeAutoSpacing )
        ParaPr.Spacing.Before = spacing_Auto;
    else if ( undefined === ParaPr.Spacing.BeforeAutoSpacing )
        ParaPr.Spacing.Before = UnknownValue;

    if ( -1 === ParaPr.PStyle )
        ParaPr.StyleName = "";
    else if ( undefined === ParaPr.PStyle )
        ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[this.WordControl.m_oLogicDocument.Styles.Get_Default_Paragraph()].Name;
    else
        ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[ParaPr.PStyle].Name;

    if ( null == ParaPr.NumPr || 0 === ParaPr.NumPr.NumId || "0" === ParaPr.NumPr.NumId )
        ParaPr.ListType = {Type: -1, SubType : -1};
    else
    {
        var NumFmt = this.WordControl.m_oLogicDocument.Numbering.Get_Format( ParaPr.NumPr.NumId, ParaPr.NumPr.Lvl );
        switch(NumFmt)
        {
            case numbering_numfmt_Bullet:
            {
                ParaPr.ListType = { Type : 0, SubType : 0 };
                break;
            }
            default:
            {
                ParaPr.ListType = { Type : 1, SubType : 0 };
                break;
            }
        }
    }

	this.sync_ParaSpacingLine( ParaPr.Spacing );
	this.Update_ParaInd(ParaPr.Ind);
	this.sync_PrAlignCallBack(ParaPr.Jc);
	this.sync_ParaStyleName(ParaPr.StyleName);
	this.sync_ListType(ParaPr.ListType);
	this.sync_PrPropCallback(ParaPr);
}

/*----------------------------------------------------------------*/
/*functions for working with clipboard, document*/
/*TODO: Print,Undo,Redo,Copy,Cut,Paste,Share,Save,DownloadAs,ReturnToDocuments(вернуться на предыдущую страницу) & callbacks for these functions*/
asc_docs_api.prototype.asc_Print = function()
{
	if (undefined != window['qtDocBridge'])
	{
        this.async_SaveToPdf();
	}
	else
	{
		this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Print);
		var editor = this;
		if(null == this.WordControl.m_oLogicDocument)
		{
			var rData = {
				"id":documentId,
				"userid": documentUserId,
				"vkey": documentVKey,
				"format": documentFormat,
				"c":"savefromorigin"};
				
			sendCommand(editor, function(incomeObject){
				if(null != incomeObject && "save" == incomeObject["type"])
					editor.processSavedFile(incomeObject["data"], false);
				editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Print);}, rData);
		}
		else
			_downloadAs(this, c_oAscFileType.PDF, function(incomeObject){
				if(null != incomeObject && "save" == incomeObject["type"])
					editor.processSavedFile(incomeObject["data"], false);
				editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Print);}, true);
	}
}
asc_docs_api.prototype.Undo = function()
{
	this.WordControl.m_oLogicDocument.Document_Undo();
}
asc_docs_api.prototype.Redo = function()
{
	this.WordControl.m_oLogicDocument.Document_Redo();
}
asc_docs_api.prototype.Copy = function()
{
	return Editor_Copy_Button(this)
}
asc_docs_api.prototype.Update_ParaTab = function(Default_Tab, ParaTabs){
    this.WordControl.m_oDrawingDocument.Update_ParaTab(Default_Tab, ParaTabs);
}
asc_docs_api.prototype.Cut = function()
{
	return Editor_Copy_Button(this, true);
}
asc_docs_api.prototype.Paste = function()
{
    if (!window.GlobalPasteFlag)
    {
        if (!window.USER_AGENT_SAFARI_MACOS)
        {
            window.GlobalPasteFlag = true;
            return Editor_Paste_Button(this);
        }
        else
        {
            if (0 === window.GlobalPasteFlagCounter)
            {
                SafariIntervalFocus();
                window.GlobalPasteFlag = true;
                return Editor_Paste_Button(this);
            }
        }
    }
}
asc_docs_api.prototype.Share = function(){

}
asc_docs_api.prototype.asc_Save = function (isAutoSave) {
	if(true === this.canSave) {
		this.canSave = false;
		this.isAutoSave = !!isAutoSave;
		if (!this.isAutoSave) {
			this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
		}

        this.CoAuthoringApi.askSaveChanges(OnSave_Callback);
	}
};

asc_docs_api.prototype.asc_OnSaveEnd = function (isDocumentSaved) {
	// Если не автосохранение, то не забываем закрыть Block-сообщение
	if (!this.isAutoSave)
		this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
	this.canSave = true;
	this.isAutoSave = false;
	this.CoAuthoringApi.unSaveChanges();
	if (isDocumentSaved) {
		// Запускаем таймер автосохранения
		this.autoSaveInit();
	} else {
		this.CoAuthoringApi.disconnect();
	}
};

function safe_Apply_Changes()
{
    try
    {
        CollaborativeEditing.Apply_Changes();
    }
    catch(err)
    {
    }
}

function OnSave_Callback(e)
{
	var nState;
    if ( false == e["savelock"] ) {
		if (editor.isAutoSave) {
			editor.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
			editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
		}

        if ( c_oAscCollaborativeMarksShowType.LastChanges === editor.CollaborativeMarksShowType )
            CollaborativeEditing.Clear_CollaborativeMarks();

        // Принимаем чужие изменения
        safe_Apply_Changes();

        // Сохраняем файл на сервер
        var oBinaryFileWriter = new BinaryFileWriter(editor.WordControl.m_oLogicDocument);

        if (undefined != window['qtDocBridge']) {
            var data = oBinaryFileWriter.Write();
            // push data to native QT code
            window['qtDocBridge']['savedDocument'] (data);
            
        } else {
            /*var oAdditionalData = {};
			oAdditionalData["c"] = "save";
			oAdditionalData["id"] = documentId;
			oAdditionalData["userid"] = documentUserId;
            oAdditionalData["vkey"] = documentVKey;
            oAdditionalData["outputformat"] = documentFormatSave;
			if(c_oAscFileType.TXT == documentFormatSaveTxtCodepage)
				oAdditionalData["codepage"] = documentFormatSaveTxtCodepage;
			oAdditionalData["innersave"] = true;
			var data = oBinaryFileWriter.Write();
			oAdditionalData["savetype"] = "completeall";
			////uncoment to save changes only instead send file complete
            //var data = JSON.stringify( CollaborativeEditing.Get_SelfChanges() );
			//oAdditionalData["savetype"] = "changes";
			oAdditionalData["data"] = data;
            sendCommand(editor, function(incomeObject){
				if(null != incomeObject && "save" == incomeObject["type"])
					editor.processSavedFile(incomeObject["data"], true);
			}, oAdditionalData);*/
        }

		// Пересылаем свои изменения
		CollaborativeEditing.Send_Changes();
		//Обратно выставляем, что документ не модифицирован
		editor.SetUnchangedDocument();

		// Заканчиваем сохранение, т.к. мы хотим дать пользователю продолжать набирать документ
		// Но сохранять до прихода ответа от сервера не сможет
		editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
		// Если не автосохранение, то продолжаем показывать Block-сообщение
		if (!editor.isAutoSave)
			editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
		editor.processSavedFile("", true);
    } else {
		nState = editor.CoAuthoringApi.get_state();
		if (3 === nState) {
			// Отключаемся от сохранения, соединение потеряно
			if (!editor.isAutoSave) {
				editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.PrepareToSave);
				editor.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);
			}
			editor.isAutoSave = false;
			editor.canSave = true;
		} else {
			// Если автосохранение, то не будем ждать ответа, а просто перезапустим таймер на немного
			if (editor.isAutoSave) {
				editor.isAutoSave = false;
				editor.canSave = true;
				editor.autoSaveInit(editor.autoSaveGapAsk);
				return;
			}
			
        	setTimeout( function(){ editor.CoAuthoringApi.askSaveChanges( OnSave_Callback ); }, 1000 );
		}
    }
}

asc_docs_api.prototype.asc_DownloadAs = function(typeFile){//передаем число соответствующее своему формату.
	this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
	var editor = this;
	_downloadAs(this, typeFile, function(incomeObject){
		if(null != incomeObject && "save" == incomeObject["type"])
			editor.processSavedFile(incomeObject["data"], false);
		editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);}, true);
}
asc_docs_api.prototype.Resize = function(){
	if (false === this.bInit_word_control)
		return;
	this.WordControl.OnResize(false);
}
asc_docs_api.prototype.AddURL = function(url){

}
asc_docs_api.prototype.Help = function(){

}
asc_docs_api.prototype.ClearCache = function(){
	var rData = {
		"id":documentId,
		"userid": documentUserId,
		"vkey": documentVKey,
		"format": documentFormat,
		"c":"cc"};

	sendCommand(editor, function(){}, rData);
}

asc_docs_api.prototype.SetFontRenderingMode = function(mode)
{
    if (1 == mode)
    {
        SetHintsProps(false, false);
    }
    else if (2 == mode)
    {
        SetHintsProps(true, false);
    }
    else if (3 == mode)
    {
        SetHintsProps(true, true);
    }

    this.WordControl.m_oDrawingDocument.ClearCachePages();
    g_fontManager.ClearFontsRasterCache();

    if (window.g_fontManager2 !== undefined && window.g_fontManager2 !== null)
        window.g_fontManager2.ClearFontsRasterCache();

    if (this.bInit_word_control)
        this.WordControl.OnScroll();
}
asc_docs_api.prototype.processSavedFile = function(url, bInner)
{
	if(bInner)
	{
		this.asc_fireCallback("asc_onSaveUrl", url, function(hasError){});
	}
	else
	{
		getFile(url);
	}	
}
asc_docs_api.prototype.startGetDocInfo = function(){
	/*
	Возвращаем объект следующего вида:
	{
		PageCount: 12,
		WordsCount: 2321,
		ParagraphCount: 45,
		SymbolsCount: 232345,
		SymbolsWSCount: 34356
	}
	*/
	this.sync_GetDocInfoStartCallback();

    if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
    {
        var _render = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer;

        var obj = { PageCount: _render.PagesCount, WordsCount: _render.CountWords, ParagraphCount: _render.CountParagraphs,
                        SymbolsCount: _render.CountSymbols, SymbolsWSCount: (_render.CountSymbols + _render.CountSpaces) };

        this.asc_fireCallback( "asc_onDocInfo", new CDocInfoProp(obj));

        this.sync_GetDocInfoEndCallback();
    }
    else
    {
        this.WordControl.m_oLogicDocument.Statistics_Start();
    }
}
asc_docs_api.prototype.stopGetDocInfo = function(){
    this.sync_GetDocInfoStopCallback();

    if (null != this.WordControl.m_oLogicDocument)
        this.WordControl.m_oLogicDocument.Statistics_Stop();
}
asc_docs_api.prototype.sync_DocInfoCallback = function(obj){
	this.asc_fireCallback( "asc_onDocInfo", new CDocInfoProp(obj));
}
asc_docs_api.prototype.sync_GetDocInfoStartCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoStart");
}
asc_docs_api.prototype.sync_GetDocInfoStopCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoStop");
}
asc_docs_api.prototype.sync_GetDocInfoEndCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoEnd");
}
asc_docs_api.prototype.sync_CanUndoCallback = function(bCanUndo)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    this.asc_fireCallback("asc_onCanUndo", false);
    //else
        this.asc_fireCallback("asc_onCanUndo", bCanUndo);
}
asc_docs_api.prototype.sync_CanRedoCallback = function(bCanRedo)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    this.asc_fireCallback("asc_onCanRedo", false);
    //else
        this.asc_fireCallback("asc_onCanRedo", bCanRedo);
}

asc_docs_api.prototype.setStartPointHistory = function(){this.noCreatePoint = true; History.Create_NewPoint();};
asc_docs_api.prototype.setEndPointHistory   = function(){this.noCreatePoint = false; };

function CDocInfoProp(obj)
{
	if(obj){
		this.PageCount = obj.PageCount;
		this.WordsCount = obj.WordsCount;
		this.ParagraphCount = obj.ParagraphCount;
		this.SymbolsCount = obj.SymbolsCount;
		this.SymbolsWSCount = obj.SymbolsWSCount;
	}
	else {
		this.PageCount = -1;
		this.WordsCount = -1;
		this.ParagraphCount = -1;
		this.SymbolsCount = -1;
		this.SymbolsWSCount = -1;
	}
}
CDocInfoProp.prototype.get_PageCount = function(){ return this.PageCount; }
CDocInfoProp.prototype.put_PageCount = function(v){ this.PageCount = v; }
CDocInfoProp.prototype.get_WordsCount = function(){ return this.WordsCount; }
CDocInfoProp.prototype.put_WordsCount = function(v){ this.WordsCount = v; }
CDocInfoProp.prototype.get_ParagraphCount = function(){ return this.ParagraphCount; }
CDocInfoProp.prototype.put_ParagraphCount = function(v){ this.ParagraphCount = v; }
CDocInfoProp.prototype.get_SymbolsCount = function(){ return this.SymbolsCount; }
CDocInfoProp.prototype.put_SymbolsCount = function(v){ this.SymbolsCount = v; }
CDocInfoProp.prototype.get_SymbolsWSCount = function(){ return this.SymbolsWSCount; }
CDocInfoProp.prototype.put_SymbolsWSCount = function(v){ this.SymbolsWSCount = v; }

/*callbacks*/
/*asc_docs_api.prototype.sync_CursorLockCallBack = function(isLock){
	this.asc_fireCallback("asc_onCursorLock",isLock);
}*/
asc_docs_api.prototype.sync_PrintCallBack = function(){
	this.asc_fireCallback("asc_onPrint");
}
asc_docs_api.prototype.sync_UndoCallBack = function(){
	this.asc_fireCallback("asc_onUndo");
}
asc_docs_api.prototype.sync_RedoCallBack = function(){
	this.asc_fireCallback("asc_onRedo");
}
asc_docs_api.prototype.sync_CopyCallBack = function(){
	this.asc_fireCallback("asc_onCopy");
}
asc_docs_api.prototype.sync_CutCallBack = function(){
	this.asc_fireCallback("asc_onCut");
}
asc_docs_api.prototype.sync_PasteCallBack = function(){
	this.asc_fireCallback("asc_onPaste");
}
asc_docs_api.prototype.sync_ShareCallBack = function(){
	this.asc_fireCallback("asc_onShare");
}
asc_docs_api.prototype.sync_SaveCallBack = function(){
	this.asc_fireCallback("asc_onSave");
}
asc_docs_api.prototype.sync_DownloadAsCallBack = function(){
	this.asc_fireCallback("asc_onDownload");
}
asc_docs_api.prototype.sync_StartAction = function(type, id){
	//this.AsyncAction
	this.asc_fireCallback("asc_onStartAction", type, id);
	//console.log("asc_onStartAction: type = " + type + " id = " + id);

    if (c_oAscAsyncActionType.BlockInteraction == type)
        this.IsLongActionCurrent = true;
}
asc_docs_api.prototype.sync_EndAction = function(type, id){
	//this.AsyncAction
	this.asc_fireCallback("asc_onEndAction", type, id);
	//console.log("asc_onEndAction: type = " + type + " id = " + id);

    if (c_oAscAsyncActionType.BlockInteraction == type)
        this.IsLongActionCurrent = false;
}
asc_docs_api.prototype.sync_AddURLCallback = function(){
	this.asc_fireCallback("asc_onAddURL");
}
asc_docs_api.prototype.sync_ErrorCallback = function(errorID,errorLevel){
	this.asc_fireCallback("asc_onError",errorID,errorLevel);
}
asc_docs_api.prototype.sync_HelpCallback = function(url){
	this.asc_fireCallback("asc_onHelp",url);
}
asc_docs_api.prototype.sync_UpdateZoom = function(zoom){
	this.asc_fireCallback("asc_onZoom", zoom);
}
asc_docs_api.prototype.sync_StatusMessage = function(message){
	this.asc_fireCallback("asc_onMessage", message);
}
asc_docs_api.prototype.ClearPropObjCallback = function(prop){//колбэк предшествующий приходу свойств объекта, prop а всякий случай
	this.asc_fireCallback("asc_onClearPropObj", prop);
}

/*----------------------------------------------------------------*/
/*functions for working with headers*/
/*
	структура заголовков, предварительно, выглядит так
	{
		headerText: "Header1",//заголовок
		pageNumber: 0, //содержит номер страницы, где находится искомая последовательность
		X: 0,//координаты по OX начала последовательности на данной страницы
		Y: 0,//координаты по OY начала последовательности на данной страницы
		level: 0//уровень заголовка
	}
	заголовки приходят либо в списке, либо последовательно.
*/
// CHeader
function CHeader (obj)
{
	if (obj)
	{
		this.headerText = (undefined != obj.headerText) ? obj.headerText : null;	//заголовок
		this.pageNumber = (undefined != obj.pageNumber) ? obj.pageNumber : null;	//содержит номер страницы, где находится искомая последовательность
		this.X = (undefined != obj.X) ? obj.X : null;								//координаты по OX начала последовательности на данной страницы
		this.Y = (undefined != obj.Y) ? obj.Y : null;								//координаты по OY начала последовательности на данной страницы
		this.level = (undefined != obj.level) ? obj.level : null;					//позиция заголовка
	}
	else
	{
		this.headerText = null;				//заголовок
		this.pageNumber = null;				//содержит номер страницы, где находится искомая последовательность
		this.X = null;						//координаты по OX начала последовательности на данной страницы
		this.Y = null;						//координаты по OY начала последовательности на данной страницы
		this.level = null;					//позиция заголовка
	}
}
CHeader.prototype.get_headerText = function ()
{
	return this.headerText;
}
CHeader.prototype.get_pageNumber = function ()
{
	return this.pageNumber;
}
CHeader.prototype.get_X = function ()
{
	return this.X;
}
CHeader.prototype.get_Y = function ()
{
	return this.Y;
}
CHeader.prototype.get_Level = function ()
{
	return this.level;
}
var _fakeHeaders = [
	new CHeader ({headerText: "Header1", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header2", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 2}),
	new CHeader ({headerText: "Header4", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 2}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 3}),
	new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 4}),
	new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 5}),
	new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 6}),
	new CHeader ({headerText: "Header4", pageNumber: 0, X: 0, Y: 0, level: 7}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 8}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 2}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 3}),
	new CHeader ({headerText: "Header6", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0})
]

asc_docs_api.prototype.CollectHeaders = function(){
	this.sync_ReturnHeadersCallback(_fakeHeaders);
}
asc_docs_api.prototype.GetActiveHeader = function(){

}
asc_docs_api.prototype.gotoHeader = function(page, X, Y){
	this.goToPage(page);
}
asc_docs_api.prototype.sync_ChangeActiveHeaderCallback = function (position, header){
	this.asc_fireCallback("asc_onChangeActiveHeader", position, new CHeader (header));
}
asc_docs_api.prototype.sync_ReturnHeadersCallback = function (headers){
	var _headers = Array ();
	for (var i = 0; i < headers.length; i++)
	{
		_headers[i] = new CHeader (headers[i]);
	}

	this.asc_fireCallback("asc_onReturnHeaders", _headers);
}
/*----------------------------------------------------------------*/
/*functions for working with search*/
/*
	структура поиска, предварительно, выглядит так
	{
		text: "...<b>слово поиска</b>...",
		pageNumber: 0, //содержит номер страницы, где находится искомая последовательность
		X: 0,//координаты по OX начала последовательности на данной страницы
		Y: 0//координаты по OY начала последовательности на данной страницы
	}
*/

asc_docs_api.prototype.asc_searchEnabled = function(bIsEnabled)
{
    if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
    {
        this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.SearchResults.IsSearch = false;
        this.WordControl.OnUpdateOverlay();
    }
}

asc_docs_api.prototype.asc_findText = function(text, isNext, isMatchCase)
{
    if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
    {
        this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.findText(text, isMatchCase, isNext);
        return this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.SearchResults.Count;
    }

    var SearchEngine = editor.WordControl.m_oLogicDocument.Search( text, { MatchCase : isMatchCase } );

    var Id = this.WordControl.m_oLogicDocument.Search_GetId( isNext );

    if ( null != Id )
        this.WordControl.m_oLogicDocument.Search_Select( Id );

    return SearchEngine.Count;
}

asc_docs_api.prototype.asc_replaceText = function(text, replaceWith, isReplaceAll, isMatchCase)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    this.WordControl.m_oLogicDocument.Search( text, { MatchCase : isMatchCase } );

    if ( true === isReplaceAll )
        this.WordControl.m_oLogicDocument.Search_Replace(replaceWith, true, -1);
    else
    {
        var CurId = this.WordControl.m_oLogicDocument.SearchEngine.CurId;
        var bDirection = this.WordControl.m_oLogicDocument.SearchEngine.Direction;
        if ( -1 != CurId )
            this.WordControl.m_oLogicDocument.Search_Replace(replaceWith, false, CurId);

        var Id = this.WordControl.m_oLogicDocument.Search_GetId( bDirection );

        if ( null != Id )
        {
            this.WordControl.m_oLogicDocument.Search_Select( Id );
            return true;
        }

        return false;
    }
}

asc_docs_api.prototype.asc_selectSearchingResults = function(bShow)
{
    if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
    {
        this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.SearchResults.Show = bShow;
        this.WordControl.OnUpdateOverlay();
        return;
    }
    this.WordControl.m_oLogicDocument.Search_Set_Selection(bShow);
}

asc_docs_api.prototype.asc_isSelectSearchingResults = function()
{
    if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
    {
        return this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.SearchResults.Show;
    }
    return this.WordControl.m_oLogicDocument.Search_Get_Selection();
}

asc_docs_api.prototype.sync_ReplaceAllCallback = function(ReplaceCount, OverallCount)
{
    this.asc_fireCallback("asc_onReplaceAll", ReplaceCount, OverallCount);
}

asc_docs_api.prototype.sync_SearchEndCallback = function()
{
	this.asc_fireCallback("asc_onSearchEnd");
}
/*----------------------------------------------------------------*/
/*functions for working with font*/
/*setters*/
asc_docs_api.prototype.put_TextPrFontName = function(name)
{
	var loader = window.g_font_loader;
	var nIndex = loader.map_font_index[name];
	var fontinfo = loader.fontInfos[nIndex];
	var isasync = loader.LoadFont(fontinfo);
	if (false === isasync)
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontFamily : { Name : fontinfo.Name , Index : nIndex } } ) );
        }
    }
}
asc_docs_api.prototype.put_TextPrFontSize = function(size)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontSize : Math.min(size, 100) } ) );
    }
}
asc_docs_api.prototype.put_TextPrBold = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Bold : value } ) );
    }
}
asc_docs_api.prototype.put_TextPrItalic = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	    this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Italic : value } ) );
    }
}
asc_docs_api.prototype.put_TextPrUnderline = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Underline : value } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}
asc_docs_api.prototype.put_TextPrStrikeout = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Strikeout : value, DStrikeout : false } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}
asc_docs_api.prototype.put_TextPrDStrikeout = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { DStrikeout : value, Strikeout : false } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}
asc_docs_api.prototype.put_TextPrSpacing = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Spacing : value } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}

asc_docs_api.prototype.put_TextPrCaps = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Caps : value, SmallCaps : false } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}

asc_docs_api.prototype.put_TextPrSmallCaps = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { SmallCaps : value, Caps : false } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}


asc_docs_api.prototype.put_TextPrPosition = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Position : value } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}

asc_docs_api.prototype.put_TextPrLang = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Lang : { Val : value } } ) );

        this.WordControl.m_oLogicDocument.Spelling.Check_CurParas();

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}


asc_docs_api.prototype.put_PrLineSpacing = function(Type, Value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { LineRule : Type,  Line : Value } );

        var ParaPr = this.get_TextProps().ParaPr;
        if ( null != ParaPr )
            this.sync_ParaSpacingLine( ParaPr.Spacing );
    }
}
asc_docs_api.prototype.put_LineSpacingBeforeAfter = function(type,value)//"type == 0" means "Before", "type == 1" means "After"
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        switch (type)
        {
            case 0:
            {
                if ( spacing_Auto === value )
                    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { BeforeAutoSpacing : true } );
                else
                    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { Before : value, BeforeAutoSpacing : false } );

                break;
            }
            case 1:
            {
                if ( spacing_Auto === value )
                    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { AfterAutoSpacing : true } );
                else
                    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { After : value, AfterAutoSpacing : false });

                break;
            }
        }
    }
}
asc_docs_api.prototype.FontSizeIn = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(true);
    }
}
asc_docs_api.prototype.FontSizeOut = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(false);
    }
}
// Object:
// {
//    Bottom :
//    {
//        Color : { r : 0, g : 0, b : 0 },
//        Value : border_Single,
//        Size  : 0.5 * g_dKoef_pt_to_mm
//        Space : 0
//    },
//    Left :
//    {
//        ....
//    }
//    Right :
//    {
//        ....
//    }
//    Top :
//    {
//        ....
//    }
//    },
//    Between :
//    {
//        ....
//    }
// }

function CParagraphBorders (obj)
{
	if (obj)
	{
		this.Left = (undefined != obj.Left && null != obj.Left) ? new CBorder (obj.Left) : null;
		this.Top = (undefined != obj.Top && null != obj.Top) ? new CBorder (obj.Top) : null;
		this.Right = (undefined != obj.Right && null != obj.Right) ? new CBorder (obj.Right) : null;
		this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new CBorder (obj.Bottom) : null;
		this.Between = (undefined != obj.Between && null != obj.Between) ? new CBorder (obj.Between) : null;
	}
	else
	{
		this.Left = null;
		this.Top = null;
		this.Right = null;
		this.Bottom = null;
		this.Between = null;
	}
}
CParagraphBorders.prototype.get_Left = function(){return this.Left; }
CParagraphBorders.prototype.put_Left = function(v){this.Left = (v) ? new CBorder (v) : null;}
CParagraphBorders.prototype.get_Top = function(){return this.Top; }
CParagraphBorders.prototype.put_Top = function(v){this.Top = (v) ? new CBorder (v) : null;}
CParagraphBorders.prototype.get_Right = function(){return this.Right; }
CParagraphBorders.prototype.put_Right = function(v){this.Right = (v) ? new CBorder (v) : null;}
CParagraphBorders.prototype.get_Bottom = function(){return this.Bottom; }
CParagraphBorders.prototype.put_Bottom = function(v){this.Bottom = (v) ? new CBorder (v) : null;}
CParagraphBorders.prototype.get_Between = function(){return this.Between; }
CParagraphBorders.prototype.put_Between = function(v){this.Between = (v) ? new CBorder (v) : null;}

asc_docs_api.prototype.put_Borders = function(Obj)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphBorders( Obj );
    }
}
/*callbacks*/
asc_docs_api.prototype.sync_BoldCallBack = function(isBold){
	this.asc_fireCallback("asc_onBold",isBold);
}
asc_docs_api.prototype.sync_ItalicCallBack = function(isItalic){
	this.asc_fireCallback("asc_onItalic",isItalic);
}
asc_docs_api.prototype.sync_UnderlineCallBack = function(isUnderline){
	this.asc_fireCallback("asc_onUnderline",isUnderline);
}
asc_docs_api.prototype.sync_StrikeoutCallBack = function(isStrikeout){
	this.asc_fireCallback("asc_onStrikeout",isStrikeout);
}
asc_docs_api.prototype.sync_TextPrFontFamilyCallBack = function(FontFamily)
{
    if ( undefined != FontFamily )
	    this.asc_fireCallback("asc_onFontFamily", new CTextFontFamily( FontFamily ));
    else
        this.asc_fireCallback("asc_onFontFamily", new CTextFontFamily( { Name : "", Index : -1 } ));
}
asc_docs_api.prototype.sync_TextPrFontSizeCallBack = function(FontSize){
	this.asc_fireCallback("asc_onFontSize",FontSize);
}
asc_docs_api.prototype.sync_PrLineSpacingCallBack = function(LineSpacing){
    this.asc_fireCallback("asc_onLineSpacing", new CParagraphInd( LineSpacing ) );
}
asc_docs_api.prototype.sync_InitEditorFonts = function(gui_fonts){
    this._gui_fonts = gui_fonts;
}
asc_docs_api.prototype.sync_InitEditorStyles = function(styles_painter){
    this._gui_styles = styles_painter;
}
asc_docs_api.prototype.sync_InitEditorTableStyles = function(styles, is_retina_enabled){
    this.asc_fireCallback("asc_onInitTableTemplates",styles, is_retina_enabled);
}


/*----------------------------------------------------------------*/
/*functions for working with paragraph*/
/*setters*/
// Right = 0; Left = 1; Center = 2; Justify = 3; or using enum that written above

/* структура для параграфа
	Ind :
   	{
       	Left      : 0,                    // Левый отступ
       	Right     : 0,                    // Правый отступ
     	FirstLine : 0                     // Первая строка
   	}
   	Spacing :
   	{
       	Line     : 1.15,                  // Расстояние между строками внутри абзаца
       	LineRule : linerule_Auto,         // Тип расстрояния между строками
       	Before   : 0,                     // Дополнительное расстояние до абзаца
       	After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
   	},
   	KeepLines : false,                    // переносить параграф на новую страницу,
                                         // если на текущей он целиком не убирается
   	PageBreakBefore : false
*/

asc_docs_api.prototype.paraApply = function(Props)
{
    var Additional = undefined;
    if ( undefined != Props.DefaultTab )
        Additional = { Type : changestype_2_Element_and_Type, Element : this.WordControl.m_oLogicDocument, CheckType : changestype_Document_SectPr };

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties, Additional) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();

        // TODO: Сделать так, чтобы пересчет был всего 1 здесь
        if ( "undefined" != typeof(Props.ContextualSpacing) && null != Props.ContextualSpacing )
            this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing( Props.ContextualSpacing );

        if ( "undefined" != typeof(Props.Ind) && null != Props.Ind )
            this.WordControl.m_oLogicDocument.Set_ParagraphIndent( Props.Ind );

        if ( "undefined" != typeof(Props.Jc) && null != Props.Jc )
            this.WordControl.m_oLogicDocument.Set_ParagraphAlign( Props.Jc );

        if ( "undefined" != typeof(Props.KeepLines) && null != Props.KeepLines )
            this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines( Props.KeepLines );

        if ( undefined != Props.KeepNext && null != Props.KeepNext )
            this.WordControl.m_oLogicDocument.Set_ParagraphKeepNext( Props.KeepNext );

        if ( undefined != Props.WidowControl && null != Props.WidowControl )
            this.WordControl.m_oLogicDocument.Set_ParagraphWidowControl( Props.WidowControl );

        if ( "undefined" != typeof(Props.PageBreakBefore) && null != Props.PageBreakBefore )
            this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore( Props.PageBreakBefore );

        if ( "undefined" != typeof(Props.Spacing) && null != Props.Spacing )
            this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( Props.Spacing );

        if ( "undefined" != typeof(Props.Shd) && null != Props.Shd )
            this.WordControl.m_oLogicDocument.Set_ParagraphShd( Props.Shd );

        if ( "undefined" != typeof(Props.Brd) && null != Props.Brd )
            this.WordControl.m_oLogicDocument.Set_ParagraphBorders( Props.Brd );

        if ( undefined != Props.Tabs )
        {
            var Tabs = new CParaTabs();
            Tabs.Set_FromObject( Props.Tabs.Tabs );
            this.WordControl.m_oLogicDocument.Set_ParagraphTabs( Tabs );
        }

        if ( undefined != Props.DefaultTab )
        {
            this.WordControl.m_oLogicDocument.Set_DocumentDefaultTab( Props.DefaultTab );
        }


        // TODO: как только разъединят настройки параграфа и текста переделать тут
        var TextPr = new CTextPr();

        if ( true === Props.Subscript )
            TextPr.VertAlign = vertalign_SubScript;
        else if ( true === Props.Superscript )
            TextPr.VertAlign = vertalign_SuperScript;
        else if ( false === Props.Superscript || false === Props.Subscript )
            TextPr.VertAlign = vertalign_Baseline;

        if ( undefined != Props.Strikeout )
        {
            TextPr.Strikeout  = Props.Strikeout;
            TextPr.DStrikeout = false;
        }

        if ( undefined != Props.DStrikeout )
        {
            TextPr.DStrikeout = Props.DStrikeout;
            if ( true === TextPr.DStrikeout )
                TextPr.Strikeout = false;
        }

        if ( undefined != Props.SmallCaps )
        {
            TextPr.SmallCaps = Props.SmallCaps;
            TextPr.AllCaps   = false;
        }

        if ( undefined != Props.AllCaps )
        {
            TextPr.Caps = Props.AllCaps;
            if ( true === TextPr.AllCaps )
                TextPr.SmallCaps = false;
        }

        if ( undefined != Props.TextSpacing )
            TextPr.Spacing = Props.TextSpacing;

        if ( undefined != Props.Position )
            TextPr.Position = Props.Position;

        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr(TextPr) );
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }
}

asc_docs_api.prototype.put_PrAlign = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphAlign(value);
    }
}
// 0- baseline, 2-subscript, 1-superscript
asc_docs_api.prototype.put_TextPrBaseline = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { VertAlign : value } ) );
    }
}
/*
    Во всех случаях SubType = 0 означает, что нажали просто на кнопку
    c выбором типа списка, без выбора подтипа.

 	Маркированный список Type = 0
		нет          - SubType = -1
		черная точка - SubType = 1
		круг         - SubType = 2
		квадрат      - SubType = 3
		картинка     - SubType = -1
		4 ромба      - SubType = 4
		ч/б стрелка  - SubType = 5
		галка        - SubType = 6
		ромб         - SubType = 7

	Нумерованный список Type = 1
		нет - SubType = -1
		1.  - SubType = 1
		1)  - SubType = 2
		I.  - SubType = 3
		A.  - SubType = 4
		a)  - SubType = 5
		a.  - SubType = 6
		i.  - SubType = 7

	Многоуровневый список Type = 2
		нет           - SubType = -1
		1)a)i)        - SubType = 1
		1.1.1         - SubType = 2
		маркированный - SubType = 3
*/
asc_docs_api.prototype.put_ListType = function(type, subtype)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        var NumberInfo =
        {
            Type    : 0,
            SubType : -1
        };

        NumberInfo.Type = type;
        NumberInfo.SubType = subtype;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphNumbering( NumberInfo );
    }
}
asc_docs_api.prototype.put_Style = function(name)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphStyle(name);
    }
}

asc_docs_api.prototype.SetDeviceInputHelperId = function(idKeyboard)
{
    if (window.ID_KEYBOARD_AREA === undefined && this.WordControl.m_oMainView != null)
    {
        window.ID_KEYBOARD_AREA = document.getElementById(idKeyboard);

        window.ID_KEYBOARD_AREA.onkeypress = function(e){
            if (false === editor.WordControl.IsFocus)
            {
                editor.WordControl.IsFocus = true;
                var ret = editor.WordControl.onKeyPress(e);
                editor.WordControl.IsFocus = false;
                return ret;
            }
        }
        window.ID_KEYBOARD_AREA.onkeydown = function(e){
            if (false === editor.WordControl.IsFocus)
            {
                editor.WordControl.IsFocus = true;
                var ret = editor.WordControl.onKeyDown(e);
                editor.WordControl.IsFocus = false;
                return ret;
            }
        }
    }
}

asc_docs_api.prototype.put_ShowParaMarks = function(isShow)
{
    /*
    if (window.IsAddDiv === undefined && this.WordControl.m_oMainView != null)
    {
        window.IsAddDiv = true;

        var _div = this.WordControl.m_oMainView.HtmlElement;

        var test = document.createElement('textarea');
        test.id = "area_id";

        test.setAttribute("style", "font-family:arial;font-size:12pt;position:absolute;resize:none;padding:2px;margin:0px;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;z-index:1000");
        test.style.border = "2px solid #4363A4";

        test.style.width = "100px";
        //this.TextBoxInput.style.height = "40px";
        test.rows = 1;

        _div.appendChild(test);

        test.onkeypress = function(e){
            return editor.WordControl.onKeyPress(e);
        }
        test.onkeydown = function(e){
            return editor.WordControl.onKeyDown(e);
        }
    }
    */

	this.ShowParaMarks = isShow;
	this.WordControl.OnRePaintAttack();

    if ( true === this.isMarkerFormat )
        this.sync_MarkerFormatCallback( false );

    return this.ShowParaMarks;
}
asc_docs_api.prototype.get_ShowParaMarks = function(){
    return this.ShowParaMarks;
}
asc_docs_api.prototype.put_ShowTableEmptyLine = function(isShow)
{
    this.isShowTableEmptyLine = isShow;
    this.WordControl.OnRePaintAttack();

    if ( true === this.isMarkerFormat )
        this.sync_MarkerFormatCallback( false );

    return this.isShowTableEmptyLine;
}
asc_docs_api.prototype.get_ShowTableEmptyLine = function(){
    return this.isShowTableEmptyLine;
}
asc_docs_api.prototype.put_PageBreak = function(isBreak)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.isPageBreakBefore = isBreak;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore(isBreak);
        this.sync_PageBreakCallback(isBreak);
    }
}

asc_docs_api.prototype.put_WidowControl = function(bValue)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphWidowControl(bValue);
        this.sync_WidowControlCallback(bValue);
    }
}

asc_docs_api.prototype.put_KeepLines = function(isKeepLines)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.isKeepLinesTogether = isKeepLines;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines(isKeepLines);
        this.sync_KeepLinesCallback(isKeepLines);
    }
}

asc_docs_api.prototype.put_KeepNext = function(isKeepNext)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphKeepNext(isKeepNext);
        this.sync_KeepNextCallback(isKeepNext);
    }
}

asc_docs_api.prototype.put_AddSpaceBetweenPrg = function(isSpacePrg)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.isAddSpaceBetweenPrg = isSpacePrg;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing(isSpacePrg);
    }
}
asc_docs_api.prototype.put_LineHighLight = function(is_flag, r, g, b)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        if (false === is_flag)
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { HighLight : highlight_None  } ) );
        }
        else
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { HighLight :  { r : r, g : g, b: b}  } ) );
        }
    }
}
asc_docs_api.prototype.put_TextColor = function(color)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        var Unifill = new CUniFill();
        Unifill.fill = new CSolidFill();
        Unifill.fill.color = CorrectUniColor(color, Unifill.fill.color);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Unifill : Unifill} ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
}
asc_docs_api.prototype.put_ParagraphShade = function(is_flag, color)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        if (false === is_flag)
            this.WordControl.m_oLogicDocument.Set_ParagraphShd( { Value : shd_Nil  }  );
        else
        {
            var Unifill = new CUniFill();
            Unifill.fill = new CSolidFill();
            Unifill.fill.color = CorrectUniColor(color, Unifill.fill.color);
            this.WordControl.m_oLogicDocument.Set_ParagraphShd( { Value : shd_Clear, Color : { r : color.get_r(), g : color.get_g(), b : color.get_b() }, Unifill: Unifill } );
        }
    }
}
asc_docs_api.prototype.put_PrIndent = function(value,levelValue)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : value, ChangeLevel: levelValue } );
    }
}
asc_docs_api.prototype.IncreaseIndent = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_IncDecIndent( true );
    }
}
asc_docs_api.prototype.DecreaseIndent = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_IncDecIndent( false );
    }
}
asc_docs_api.prototype.put_PrIndentRight = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Right : value } );
    }
}
asc_docs_api.prototype.put_PrFirstLineIndent = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	    this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { FirstLine : value } );
    }
}
asc_docs_api.prototype.put_Margins = function(left, top, right, bottom)
{
	this.WordControl.m_oLogicDocument.Set_DocumentMargin( { Left : left, Top : top, Right : right, Bottom : bottom });
}
asc_docs_api.prototype.getFocusObject = function(){//возвратит тип элемента - параграф c_oAscTypeSelectElement.Paragraph, изображение c_oAscTypeSelectElement.Image, таблица c_oAscTypeSelectElement.Table, колонтитул c_oAscTypeSelectElement.Header.

}

/*callbacks*/
asc_docs_api.prototype.sync_VerticalAlign = function(typeBaseline){
	this.asc_fireCallback("asc_onVerticalAlign",typeBaseline);
}
asc_docs_api.prototype.sync_PrAlignCallBack = function(value){
	this.asc_fireCallback("asc_onPrAlign",value);
}
asc_docs_api.prototype.sync_ListType = function(NumPr){
    this.asc_fireCallback("asc_onListType", new CListType( NumPr ) );
}
asc_docs_api.prototype.sync_TextColor = function(Color)
{
    if ( undefined != Color )
	    this.asc_fireCallback("asc_onTextColor", CreateAscColorCustom( Color.r, Color.g, Color.b, Color.Auto ));
}
asc_docs_api.prototype.sync_TextHighLight = function(HighLight)
{
    if ( undefined != HighLight )
	    this.asc_fireCallback("asc_onTextHighLight", new CColor( HighLight.r, HighLight.g, HighLight.b ) );
}
asc_docs_api.prototype.sync_TextSpacing = function(Spacing)
{
    this.asc_fireCallback("asc_onTextSpacing", Spacing );
}
asc_docs_api.prototype.sync_TextDStrikeout = function(Value)
{
    this.asc_fireCallback("asc_onTextDStrikeout", Value );
}
asc_docs_api.prototype.sync_TextCaps = function(Value)
{
    this.asc_fireCallback("asc_onTextCaps", Value );
}
asc_docs_api.prototype.sync_TextSmallCaps = function(Value)
{
    this.asc_fireCallback("asc_onTextSmallCaps", Value );
}
asc_docs_api.prototype.sync_TextPosition = function(Value)
{
    this.asc_fireCallback("asc_onTextPosition", Value );
}
asc_docs_api.prototype.sync_TextLangCallBack = function(Lang)
{
    this.asc_fireCallback("asc_onTextLanguage", Lang.Val );
}
asc_docs_api.prototype.sync_ParaStyleName = function(Name){
	this.asc_fireCallback("asc_onParaStyleName",Name);
}
asc_docs_api.prototype.sync_ParaSpacingLine = function(SpacingLine)
{
    if ( true === SpacingLine.AfterAutoSpacing )
        SpacingLine.After = spacing_Auto;
    else if ( undefined === SpacingLine.AfterAutoSpacing )
        SpacingLine.After = UnknownValue;

    if ( true === SpacingLine.BeforeAutoSpacing )
        SpacingLine.Before = spacing_Auto;
    else if ( undefined === SpacingLine.BeforeAutoSpacing )
        SpacingLine.Before = UnknownValue;

	this.asc_fireCallback("asc_onParaSpacingLine", new CParagraphSpacing( SpacingLine ));
}
asc_docs_api.prototype.sync_PageBreakCallback = function(isBreak){
	this.asc_fireCallback("asc_onPageBreak",isBreak);
}

asc_docs_api.prototype.sync_WidowControlCallback = function(bValue)
{
    this.asc_fireCallback("asc_onWidowControl",bValue);
}

asc_docs_api.prototype.sync_KeepNextCallback = function(bValue)
{
    this.asc_fireCallback("asc_onKeepNext",bValue);
}

asc_docs_api.prototype.sync_KeepLinesCallback = function(isKeepLines){
	this.asc_fireCallback("asc_onKeepLines",isKeepLines);
}
asc_docs_api.prototype.sync_ShowParaMarksCallback = function(){
	this.asc_fireCallback("asc_onShowParaMarks");
}
asc_docs_api.prototype.sync_SpaceBetweenPrgCallback = function(){
	this.asc_fireCallback("asc_onSpaceBetweenPrg");
}
asc_docs_api.prototype.sync_PrPropCallback = function(prProp){
    var _len = this.SelectedObjectsStack.length;
    if (_len > 0)
    {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Paragraph)
        {
            this.SelectedObjectsStack[_len - 1].Value = new CParagraphProp( prProp );
            return;
        }
    }

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Paragraph, new CParagraphProp( prProp ) );
}

asc_docs_api.prototype.sync_EndAddShape = function()
{
    editor.asc_fireCallback("asc_onEndAddShape");
    if (this.WordControl.m_oDrawingDocument.m_sLockedCursorType == "crosshair")
    {
        this.WordControl.m_oDrawingDocument.UnlockCursorType();
    }
}

asc_docs_api.prototype.SetDrawingFreeze = function(bIsFreeze)
{
    this.WordControl.DrawingFreeze = bIsFreeze;

    var _elem1 = document.getElementById("id_main");
    if (_elem1)
    {
        var _elem2 = document.getElementById("id_horscrollpanel");
        var _elem3 = document.getElementById("id_panel_right");
        if (bIsFreeze)
        {
            _elem1.style.display = "none";
            _elem2.style.display = "none";
            _elem3.style.display = "none";
        }
        else
        {
            _elem1.style.display = "block";
            _elem2.style.display = "block";
            _elem3.style.display = "block";
        }
    }

    if (!bIsFreeze)
        this.WordControl.OnScroll();
}

/*----------------------------------------------------------------*/
/*functions for working with page*/
asc_docs_api.prototype.change_PageOrient = function(isPortrait)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Document_SectPr) )
    {
        this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        if (isPortrait)
        {
            this.WordControl.m_oLogicDocument.Set_DocumentOrientation(orientation_Portrait);
            this.DocumentOrientation = isPortrait;
        }
        else
        {
            this.WordControl.m_oLogicDocument.Set_DocumentOrientation(orientation_Landscape);
            this.DocumentOrientation = isPortrait;
        }
        this.sync_PageOrientCallback(editor.get_DocumentOrientation());
    }
}
asc_docs_api.prototype.get_DocumentOrientation = function()
{
	return this.DocumentOrientation;
}
asc_docs_api.prototype.change_DocSize = function(width,height)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Document_SectPr) )
    {
        this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        if (this.DocumentOrientation)
            this.WordControl.m_oLogicDocument.Set_DocumentPageSize(width, height);
        else
            this.WordControl.m_oLogicDocument.Set_DocumentPageSize(height, width);
    }
}

asc_docs_api.prototype.get_DocumentWidth = function()
{
    return Page_Width;
}

asc_docs_api.prototype.get_DocumentHeight = function()
{
    return Page_Height;
}

asc_docs_api.prototype.put_AddPageBreak = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        var Document = this.WordControl.m_oLogicDocument;

        if ( null === Document.Hyperlink_Check(false) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaNewLine( break_Page ) );
        }
    }
}
asc_docs_api.prototype.Update_ParaInd = function( Ind ){
	var FirstLine = 0,
		Left = 0,
		Right = 0;
	if ( "undefined" != typeof(Ind) )
	{
		if("undefined" != typeof(Ind.FirstLine))
		{
			FirstLine = Ind.FirstLine;
		}
		if("undefined" != typeof(Ind.Left))
		{
			Left = Ind.Left;
		}
		if("undefined" != typeof(Ind.Right))
		{
			Right = Ind.Right;
		}
	}

    var bIsUpdate = false;
    var _ruler = this.WordControl.m_oHorRuler;
    if (_ruler.m_dIndentLeft != Left)
    {
        _ruler.m_dIndentLeft = Left;
        bIsUpdate = true;
    }
    if (_ruler != (FirstLine + Left))
    {
        _ruler.m_dIndentLeftFirst = (FirstLine + Left);
        bIsUpdate = true;
    }
    if (_ruler.m_dIndentRight != Right)
    {
        _ruler.m_dIndentRight = Right;
        bIsUpdate = true;
    }
    if (bIsUpdate)
        this.WordControl.UpdateHorRuler();
}
asc_docs_api.prototype.Internal_Update_Ind_FirstLine = function(FirstLine,Left){
	if (this.WordControl.m_oHorRuler.m_dIndentLeftFirst != (FirstLine + Left))
    {
        this.WordControl.m_oHorRuler.m_dIndentLeftFirst = (FirstLine + Left);
	    this.WordControl.UpdateHorRuler();
    }
}
asc_docs_api.prototype.Internal_Update_Ind_Left = function(Left){
    if (this.WordControl.m_oHorRuler.m_dIndentLeft != Left)
    {
        this.WordControl.m_oHorRuler.m_dIndentLeft = Left;
        this.WordControl.UpdateHorRuler();
    }
}
asc_docs_api.prototype.Internal_Update_Ind_Right = function(Right){
    if (this.WordControl.m_oHorRuler.m_dIndentRight != Right)
    {
        this.WordControl.m_oHorRuler.m_dIndentRight = Right;
        this.WordControl.UpdateHorRuler();
    }
}

// "where" где нижний или верхний, align выравнивание
asc_docs_api.prototype.put_PageNum = function(where,align)
{
    if ( where >= 0 )
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_HdrFtr }) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Document_AddPageNum( where, align );
        }
    }
    else
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Document_AddPageNum( where, align );
        }
    }
}

asc_docs_api.prototype.put_HeadersAndFootersDistance = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Document_SetHdrFtrDistance(value);
    }
}

asc_docs_api.prototype.HeadersAndFooters_DifferentFirstPage = function(isOn)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Document_SetHdrFtrFirstPage( isOn );
    }
}

asc_docs_api.prototype.HeadersAndFooters_DifferentOddandEvenPage = function(isOn)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Document_SetHdrFtrEvenAndOddHeaders( isOn );
    }
}

asc_docs_api.prototype.HeadersAndFooters_LinkToPrevious = function(isOn)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Document_SetHdrFtrLink( isOn );
    }
}

/*структура для передачи настроек колонтитулов
	{
		Type : hdrftr_Footer (hdrftr_Header),
		Position : 12.5,
		DifferentFirst : true/false,
		DifferentEvenOdd : true/false,
	}
*/
/*callback*/
asc_docs_api.prototype.sync_DocSizeCallback = function(width,height){
	this.asc_fireCallback("asc_onDocSize",width,height);
}
asc_docs_api.prototype.sync_PageOrientCallback = function(isPortrait){
    this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
	this.asc_fireCallback("asc_onPageOrient",isPortrait);
}
asc_docs_api.prototype.sync_HeadersAndFootersPropCallback = function(hafProp)
{
    if ( true === hafProp )
        hafProp.Locked = true;

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Header, new CHeaderProp( hafProp ) );
}

/*----------------------------------------------------------------*/
/*functions for working with table*/
asc_docs_api.prototype.put_Table = function(col,row,isFlow)
{
    if ( isFlow )
    {
        // TODO: Как только сделаем привязку Flow-таблиц к месту в документе,
        //       добавить проверку здесь. Пока Flow-таблицы всегда можно добавить
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Add_FlowTable(col,row);
    }
    else
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Document_Content_Add) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Add_InlineTable(col,row);
        }
    }

}
asc_docs_api.prototype.addRowAbove = function(count)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_AddRow(true);
    }
}
asc_docs_api.prototype.addRowBelow = function(count)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_AddRow(false);
    }
}
asc_docs_api.prototype.addColumnLeft = function(count)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_AddCol(true);
    }
}
asc_docs_api.prototype.addColumnRight = function(count)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_AddCol(false);
    }
}
asc_docs_api.prototype.remRow = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_RemoveRow();
    }
}
asc_docs_api.prototype.remColumn = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_RemoveCol();
    }
}
asc_docs_api.prototype.remTable = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_RemoveTable();
    }
}
asc_docs_api.prototype.selectRow = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Row );
}
asc_docs_api.prototype.selectColumn = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Column );
}
asc_docs_api.prototype.selectCell = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Cell );
}
asc_docs_api.prototype.selectTable = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Table );
}
asc_docs_api.prototype.setColumnWidth = function(width){

}
asc_docs_api.prototype.setRowHeight = function(height){

}
asc_docs_api.prototype.set_TblDistanceFromText = function(left,top,right,bottom){

}
asc_docs_api.prototype.CheckBeforeMergeCells = function()
{
    return this.WordControl.m_oLogicDocument.Table_CheckMerge();
}
asc_docs_api.prototype.CheckBeforeSplitCells = function()
{
    return this.WordControl.m_oLogicDocument.Table_CheckSplit();
}
asc_docs_api.prototype.MergeCells = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_MergeCells();
    }
}
asc_docs_api.prototype.SplitCell = function(Cols, Rows)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Table_SplitCell(Cols, Rows);
    }
}
asc_docs_api.prototype.widthTable = function(width){

}
asc_docs_api.prototype.put_CellsMargin = function(left,top,right,bottom){

}
asc_docs_api.prototype.set_TblWrap = function(type){

}
asc_docs_api.prototype.set_TblIndentLeft = function(spacing){

}
asc_docs_api.prototype.set_Borders = function(typeBorders,size,Color){//если size == 0 то границы нет.

}
asc_docs_api.prototype.set_TableBackground = function(Color){

}
asc_docs_api.prototype.set_AlignCell = function(align){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	switch(align)
	{
		case c_oAscAlignType.LEFT : break;
		case c_oAscAlignType.CENTER : break;
		case c_oAscAlignType.RIGHT : break;
	}
}
asc_docs_api.prototype.set_TblAlign = function(align){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	switch(align)
	{
		case c_oAscAlignType.LEFT : break;
		case c_oAscAlignType.CENTER : break;
		case c_oAscAlignType.RIGHT : break;
	}
}
asc_docs_api.prototype.set_SpacingBetweenCells = function(isOn,spacing){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	if(isOn){

	}
}

// CBackground
// Value : тип заливки(прозрачная или нет),
// Color : { r : 0, g : 0, b : 0 }
function CBackground (obj)
{
	if (obj)
	{
		this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.Value = (undefined != obj.Value) ? obj.Value : null;
	}
	else
	{
		this.Color = CreateAscColorCustom(0, 0, 0);
		this.Value = 1;
	}
}
CBackground.prototype.get_Color = function (){return this.Color;}
CBackground.prototype.put_Color = function (v){this.Color = (v) ? v: null;}
CBackground.prototype.get_Value = function (){return this.Value;}
CBackground.prototype.put_Value = function (v){this.Value = v;}

function CTablePositionH(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? c_oAscHAnchor.Margin : obj.RelativeFrom;
        this.UseAlign     = ( undefined === obj.UseAlign     ) ? false                : obj.UseAlign;
        this.Align        = ( undefined === obj.Align        ) ? undefined            : obj.Align;
        this.Value        = ( undefined === obj.Value        ) ? 0                    : obj.Value;
    }
    else
    {
        this.RelativeFrom = c_oAscHAnchor.Column;
        this.UseAlign     = false;
        this.Align        = undefined;
        this.Value        = 0;
    }
}

CTablePositionH.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; }
CTablePositionH.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; }
CTablePositionH.prototype.get_UseAlign = function()  { return this.UseAlign; }
CTablePositionH.prototype.put_UseAlign = function(v) { this.UseAlign = v; }
CTablePositionH.prototype.get_Align = function()  { return this.Align; }
CTablePositionH.prototype.put_Align = function(v) { this.Align = v; }
CTablePositionH.prototype.get_Value = function()  { return this.Value; }
CTablePositionH.prototype.put_Value = function(v) { this.Value = v; }

function CTablePositionV(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? c_oAscVAnchor.Text : obj.RelativeFrom;
        this.UseAlign     = ( undefined === obj.UseAlign     ) ? false              : obj.UseAlign;
        this.Align        = ( undefined === obj.Align        ) ? undefined          : obj.Align;
        this.Value        = ( undefined === obj.Value        ) ? 0                  : obj.Value;
    }
    else
    {
        this.RelativeFrom = c_oAscVAnchor.Text;
        this.UseAlign     = false;
        this.Align        = undefined;
        this.Value        = 0;
    }
}

CTablePositionV.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; }
CTablePositionV.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; }
CTablePositionV.prototype.get_UseAlign = function()  { return this.UseAlign; }
CTablePositionV.prototype.put_UseAlign = function(v) { this.UseAlign = v; }
CTablePositionV.prototype.get_Align = function()  { return this.Align; }
CTablePositionV.prototype.put_Align = function(v) { this.Align = v; }
CTablePositionV.prototype.get_Value = function()  { return this.Value; }
CTablePositionV.prototype.put_Value = function(v) { this.Value = v; }

function CTablePropLook(obj)
{
    this.FirstCol = false;
    this.FirstRow = false;
    this.LastCol  = false;
    this.LastRow  = false;
    this.BandHor  = false;
    this.BandVer  = false;

    if ( obj )
    {
        this.FirstCol = ( undefined === obj.m_bFirst_Col ? false : obj.m_bFirst_Col );
        this.FirstRow = ( undefined === obj.m_bFirst_Row ? false : obj.m_bFirst_Row );
        this.LastCol  = ( undefined === obj.m_bLast_Col  ? false : obj.m_bLast_Col );
        this.LastRow  = ( undefined === obj.m_bLast_Row  ? false : obj.m_bLast_Row );
        this.BandHor  = ( undefined === obj.m_bBand_Hor  ? false : obj.m_bBand_Hor );
        this.BandVer  = ( undefined === obj.m_bBand_Ver  ? false : obj.m_bBand_Ver );
    }
}

CTablePropLook.prototype.get_FirstCol = function() {return this.FirstCol;}
CTablePropLook.prototype.put_FirstCol = function(v) {this.FirstCol = v;}
CTablePropLook.prototype.get_FirstRow = function() {return this.FirstRow;}
CTablePropLook.prototype.put_FirstRow = function(v) {this.FirstRow = v;}
CTablePropLook.prototype.get_LastCol = function() {return this.LastCol;}
CTablePropLook.prototype.put_LastCol = function(v) {this.LastCol = v;}
CTablePropLook.prototype.get_LastRow = function() {return this.LastRow;}
CTablePropLook.prototype.put_LastRow = function(v) {this.LastRow = v;}
CTablePropLook.prototype.get_BandHor = function() {return this.BandHor;}
CTablePropLook.prototype.put_BandHor = function(v) {this.BandHor = v;}
CTablePropLook.prototype.get_BandVer = function() {return this.BandVer;}
CTablePropLook.prototype.put_BandVer = function(v) {this.BandVer = v;}

function CTableProp (tblProp)
{
	if (tblProp)
	{
        this.CanBeFlow = (undefined != tblProp.CanBeFlow ? tblProp.CanBeFlow : false );
        this.CellSelect = (undefined != tblProp.CellSelect ? tblProp.CellSelect : false );
        this.CellSelect = (undefined != tblProp.CellSelect) ? tblProp.CellSelect : false;
		this.TableWidth = (undefined != tblProp.TableWidth) ? tblProp.TableWidth : null;
		this.TableSpacing = (undefined != tblProp.TableSpacing) ? tblProp.TableSpacing : null;
		this.TableDefaultMargins = (undefined != tblProp.TableDefaultMargins && null != tblProp.TableDefaultMargins) ? new CPaddings (tblProp.TableDefaultMargins) : null;

		this.CellMargins = (undefined != tblProp.CellMargins && null != tblProp.CellMargins) ? new CMargins (tblProp.CellMargins) : null;

		this.TableAlignment = (undefined != tblProp.TableAlignment) ? tblProp.TableAlignment : null;
		this.TableIndent = (undefined != tblProp.TableIndent) ? tblProp.TableIndent : null;
		this.TableWrappingStyle = (undefined != tblProp.TableWrappingStyle) ? tblProp.TableWrappingStyle : null;

		this.TablePaddings = (undefined != tblProp.TablePaddings && null != tblProp.TablePaddings) ? new CPaddings (tblProp.TablePaddings) : null;

		this.TableBorders = (undefined != tblProp.TableBorders && null != tblProp.TableBorders) ? new CBorders (tblProp.TableBorders) : null;
		this.CellBorders = (undefined != tblProp.CellBorders && null != tblProp.CellBorders) ? new CBorders (tblProp.CellBorders) : null;
		this.TableBackground = (undefined != tblProp.TableBackground && null != tblProp.TableBackground) ? new CBackground (tblProp.TableBackground) : null;
		this.CellsBackground = (undefined != tblProp.CellsBackground && null != tblProp.CellsBackground) ? new CBackground (tblProp.CellsBackground) : null;
		this.Position = (undefined != tblProp.Position && null != tblProp.Position) ? new CPosition (tblProp.Position) : null;
        this.PositionH = ( undefined != tblProp.PositionH && null != tblProp.PositionH ) ? new CTablePositionH(tblProp.PositionH) : undefined;
        this.PositionV = ( undefined != tblProp.PositionV && null != tblProp.PositionV ) ? new CTablePositionV(tblProp.PositionV) : undefined;
        this.Internal_Position = ( undefined != tblProp.Internal_Position ) ? tblProp.Internal_Position : undefined;

        this.ForSelectedCells = (undefined != tblProp.ForSelectedCells) ? tblProp.ForSelectedCells : true;
        this.TableStyle = (undefined != tblProp.TableStyle) ? tblProp.TableStyle : null;
        this.TableLook = (undefined != tblProp.TableLook) ? new CTablePropLook(tblProp.TableLook) : null;
        this.RowsInHeader = (undefined != tblProp.RowsInHeader) ? tblProp.RowsInHeader : 0;
        this.CellsVAlign = (undefined != tblProp.CellsVAlign) ? tblProp.CellsVAlign :c_oAscVertAlignJc.Top;
        this.AllowOverlap = (undefined != tblProp.AllowOverlap) ? tblProp.AllowOverlap : undefined;
        this.TableLayout  = tblProp.TableLayout;
        this.Locked = (undefined != tblProp.Locked) ? tblProp.Locked : false;
	}
	else
	{
		//Все свойства класса CTableProp должны быть undefined если они не изменялись
        //this.CanBeFlow = false;
        this.CellSelect = false; //обязательное свойство
		/*this.TableWidth = null;
		this.TableSpacing = null;
		this.TableDefaultMargins = new CPaddings ();

		this.CellMargins = new CMargins ();

		this.TableAlignment = 0;
		this.TableIndent = 0;
		this.TableWrappingStyle = c_oAscWrapStyle.Inline;

		this.TablePaddings = new CPaddings ();

		this.TableBorders = new CBorders ();
		this.CellBorders = new CBorders ();
		this.TableBackground = new CBackground ();
		this.CellsBackground = new CBackground ();;
		this.Position = new CPosition ();
		this.ForSelectedCells = true;*/

        this.Locked = false;
	}
}

CTableProp.prototype.get_Width = function (){return this.TableWidth;}
CTableProp.prototype.put_Width = function (v){this.TableWidth = v;}
CTableProp.prototype.get_Spacing = function (){return this.TableSpacing;}
CTableProp.prototype.put_Spacing = function (v){this.TableSpacing = v;}
CTableProp.prototype.get_DefaultMargins = function (){return this.TableDefaultMargins;}
CTableProp.prototype.put_DefaultMargins = function (v){this.TableDefaultMargins = v;}
CTableProp.prototype.get_CellMargins = function (){return this.CellMargins;}
CTableProp.prototype.put_CellMargins = function (v){ this.CellMargins = v;}
CTableProp.prototype.get_TableAlignment = function (){return this.TableAlignment;}
CTableProp.prototype.put_TableAlignment = function (v){this.TableAlignment = v;}
CTableProp.prototype.get_TableIndent = function (){return this.TableIndent;}
CTableProp.prototype.put_TableIndent = function (v){this.TableIndent = v;}
CTableProp.prototype.get_TableWrap = function (){return this.TableWrappingStyle;}
CTableProp.prototype.put_TableWrap = function (v){this.TableWrappingStyle = v;}
CTableProp.prototype.get_TablePaddings = function (){return this.TablePaddings;}
CTableProp.prototype.put_TablePaddings = function (v){this.TablePaddings = v;}
CTableProp.prototype.get_TableBorders = function (){return this.TableBorders;}
CTableProp.prototype.put_TableBorders = function (v){this.TableBorders = v;}
CTableProp.prototype.get_CellBorders = function (){return this.CellBorders;}
CTableProp.prototype.put_CellBorders = function (v){this.CellBorders = v;}
CTableProp.prototype.get_TableBackground = function (){return this.TableBackground;}
CTableProp.prototype.put_TableBackground = function (v){this.TableBackground = v;}
CTableProp.prototype.get_CellsBackground = function (){return this.CellsBackground;}
CTableProp.prototype.put_CellsBackground = function (v){this.CellsBackground = v;}
CTableProp.prototype.get_Position = function (){return this.Position;}
CTableProp.prototype.put_Position = function (v){this.Position = v;}
CTableProp.prototype.get_PositionH = function(){return this.PositionH;}
CTableProp.prototype.put_PositionH = function(v){this.PositionH = v;}
CTableProp.prototype.get_PositionV = function(){return this.PositionV;}
CTableProp.prototype.put_PositionV = function(v){this.PositionV = v;}
CTableProp.prototype.get_Value_X = function(RelativeFrom) { if ( undefined != this.Internal_Position ) return this.Internal_Position.Calculate_X_Value(RelativeFrom);  return 0; }
CTableProp.prototype.get_Value_Y = function(RelativeFrom) { if ( undefined != this.Internal_Position ) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);  return 0; }
CTableProp.prototype.get_ForSelectedCells = function (){return this.ForSelectedCells;}
CTableProp.prototype.put_ForSelectedCells = function (v){this.ForSelectedCells = v;}
CTableProp.prototype.put_CellSelect = function(v){this.CellSelect = v;}
CTableProp.prototype.get_CellSelect = function(){return this.CellSelect};
CTableProp.prototype.get_CanBeFlow = function(){return this.CanBeFlow;}
CTableProp.prototype.get_RowsInHeader = function(){return this.RowsInHeader;};
CTableProp.prototype.put_RowsInHeader = function(v){this.RowsInHeader = v;};
CTableProp.prototype.get_Locked = function() { return this.Locked; }
CTableProp.prototype.get_CellsVAlign = function() { return this.CellsVAlign; }
CTableProp.prototype.put_CellsVAlign = function(v){ this.CellsVAlign = v; }
CTableProp.prototype.get_TableLook = function() {return this.TableLook;}
CTableProp.prototype.put_TableLook = function(v){this.TableLook = v;}
CTableProp.prototype.get_TableStyle = function() {return this.TableStyle;}
CTableProp.prototype.put_TableStyle = function(v){this.TableStyle = v;}
CTableProp.prototype.get_AllowOverlap = function() {return this.AllowOverlap;}
CTableProp.prototype.put_AllowOverlap = function(v){this.AllowOverlap = v;}
CTableProp.prototype.get_TableLayout = function() {return this.TableLayout;}
CTableProp.prototype.put_TableLayout = function(v){this.TableLayout = v;}

function CBorders (obj)
{
	if (obj)
	{
		this.Left = (undefined != obj.Left && null != obj.Left) ? new CBorder (obj.Left) : null;
		this.Top = (undefined != obj.Top && null != obj.Top) ? new CBorder (obj.Top) : null;
		this.Right = (undefined != obj.Right && null != obj.Right) ? new CBorder (obj.Right) : null;
		this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new CBorder (obj.Bottom) : null;
		this.InsideH = (undefined != obj.InsideH && null != obj.InsideH) ? new CBorder (obj.InsideH) : null;
		this.InsideV = (undefined != obj.InsideV && null != obj.InsideV) ? new CBorder (obj.InsideV) : null;
	}
	//Все свойства класса CBorders должны быть undefined если они не изменялись
	/*else
	{
		this.Left = null;
		this.Top = null;
		this.Right = null;
		this.Bottom = null;
		this.InsideH = null;
		this.InsideV = null;
	}*/
}
CBorders.prototype.get_Left = function(){return this.Left; }
CBorders.prototype.put_Left = function(v){this.Left = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Top = function(){return this.Top; }
CBorders.prototype.put_Top = function(v){this.Top = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Right = function(){return this.Right; }
CBorders.prototype.put_Right = function(v){this.Right = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Bottom = function(){return this.Bottom; }
CBorders.prototype.put_Bottom = function(v){this.Bottom = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_InsideH = function(){return this.InsideH; }
CBorders.prototype.put_InsideH = function(v){this.InsideH = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_InsideV = function(){return this.InsideV; }
CBorders.prototype.put_InsideV = function(v){this.InsideV = (v) ? new CBorder (v) : null;}

function CBorder (obj)
{
	if (obj)
	{
		this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.Size = (undefined != obj.Size) ? obj.Size : null;
		this.Value = (undefined != obj.Value) ? obj.Value : null;
		this.Space = (undefined != obj.Space) ? obj.Space : null;
	}
	else
	{
		this.Color = CreateAscColorCustom(0,0,0);
		this.Size  = 0.5 * g_dKoef_pt_to_mm;
		this.Value = border_Single;
		this.Space = 0;
	}
}
CBorder.prototype.get_Color = function(){return this.Color; }
CBorder.prototype.put_Color = function(v){this.Color = v;}
CBorder.prototype.get_Size = function(){return this.Size; }
CBorder.prototype.put_Size = function(v){this.Size = v;}
CBorder.prototype.get_Value = function(){return this.Value; }
CBorder.prototype.put_Value = function(v){this.Value = v;}
CBorder.prototype.get_Space = function(){return this.Space; }
CBorder.prototype.put_Space = function(v){this.Space = v;}
CBorder.prototype.get_ForSelectedCells = function(){return this.ForSelectedCells; }
CBorder.prototype.put_ForSelectedCells = function(v){this.ForSelectedCells = v;}

// CMargins
function CMargins (obj)
{
	if (obj)
	{
		this.Left = (undefined != obj.Left) ? obj.Left : null;
		this.Right = (undefined != obj.Right) ? obj.Right : null;
		this.Top = (undefined != obj.Top) ? obj.Top : null;
		this.Bottom = (undefined != obj.Bottom) ? obj.Bottom : null;
		this.Flag = (undefined != obj.Flag) ? obj.Flag : null;
	}
	else
	{
		this.Left = null;
		this.Right = null;
		this.Top = null;
		this.Bottom = null;
		this.Flag = null;
	}
}
CMargins.prototype.get_Left = function(){return this.Left; }
CMargins.prototype.put_Left = function(v){this.Left = v;}
CMargins.prototype.get_Right = function(){return this.Right; }
CMargins.prototype.put_Right = function(v){this.Right = v;}
CMargins.prototype.get_Top = function(){return this.Top; }
CMargins.prototype.put_Top = function(v){this.Top = v;}
CMargins.prototype.get_Bottom = function(){return this.Bottom; }
CMargins.prototype.put_Bottom = function(v){this.Bottom = v;}
CMargins.prototype.get_Flag = function(){return this.Flag; }
CMargins.prototype.put_Flag = function(v){this.Flag = v;}

/*
	{
	    TableWidth   : null - галочка убрана, либо заданное значение в мм
	    TableSpacing : null - галочка убрана, либо заданное значение в мм

	    TableDefaultMargins :  // маргины для всей таблицы(значение по умолчанию)
	    {
	        Left   : 1.9,
	        Right  : 1.9,
	        Top    : 0,
	        Bottom : 0
	    }

	    CellMargins :
        {
            Left   : 1.9, (null - неопределенное значение)
            Right  : 1.9, (null - неопределенное значение)
            Top    : 0,   (null - неопределенное значение)
            Bottom : 0,   (null - неопределенное значение)
            Flag   : 0 - У всех выделенных ячеек значение берется из TableDefaultMargins
                     1 - У выделенных ячеек есть ячейки с дефолтовыми значениями, и есть со своими собственными
                     2 - У всех ячеек свои собственные значения
        }

        TableAlignment : 0, 1, 2 (слева, по центру, справа)
        TableIndent : значение в мм,
        TableWrappingStyle : 0, 1 (inline, flow)
        TablePaddings:
        {
             Left   : 3.2,
             Right  : 3.2,
             Top    : 0,
             Bottom : 0
        }

        TableBorders : // границы таблицы
        {
            Bottom :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Left :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Right :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Top :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            InsideH :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            InsideV :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            }
        }

        CellBorders : // границы выделенных ячеек
        {
			ForSelectedCells : true,

            Bottom :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Left :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Right :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Top :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            InsideH : // данного элемента может не быть, если у выделенных ячеек
                      // нет горизонтальных внутренних границ
            {
                Color : { r : 0, g : 0, b : 0 },
                 Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            InsideV : // данного элемента может не быть, если у выделенных ячеек
                      // нет вертикальных внутренних границ
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            }
        }

        TableBackground :
        {
            Value : тип заливки(прозрачная или нет),
            Color : { r : 0, g : 0, b : 0 }
        }
        CellsBackground : null если заливка не определена для выделенных ячеек
        {
            Value : тип заливки(прозрачная или нет),
            Color : { r : 0, g : 0, b : 0 }
        }

		Position:
		{
			X:0,
			Y:0
		}
	}
*/
asc_docs_api.prototype.tblApply = function(obj)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Set_TableProps(obj);
    }
}
/*callbacks*/
asc_docs_api.prototype.sync_AddTableCallback = function(){
	this.asc_fireCallback("asc_onAddTable");
}
asc_docs_api.prototype.sync_AlignCellCallback = function(align){
	this.asc_fireCallback("asc_onAlignCell",align);
}
asc_docs_api.prototype.sync_TblPropCallback = function(tblProp)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    tblProp.Locked = true;

    // TODO: вызвать функцию asc_onInitTableTemplatesв зависимости от TableLook

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Table, new CTableProp( tblProp ));
}
asc_docs_api.prototype.sync_TblWrapStyleChangedCallback = function(style){
	this.asc_fireCallback("asc_onTblWrapStyleChanged",style);
}
asc_docs_api.prototype.sync_TblAlignChangedCallback = function(style){
	this.asc_fireCallback("asc_onTblAlignChanged",style);
}

/*----------------------------------------------------------------*/
/*functions for working with images*/
asc_docs_api.prototype.ChangeImageFromFile = function()
{
    this.isImageChangeUrl = true;
    this.AddImage();
}
asc_docs_api.prototype.ChangeShapeImageFromFile = function()
{
    this.isShapeImageChangeUrl = true;
    this.AddImage();
}

asc_docs_api.prototype.AddImage = function(){
	if (undefined != window['qtDocBridge'])
	{
		// call native QT code
		window['qtDocBridge']['addedImage'] ();
	}
	else
	{
		var frameWindow = GetUploadIFrame();
		var content = '<html><head></head><body><form action="'+g_sUploadServiceLocalUrl+'?key='+documentId+'" method="POST" enctype="multipart/form-data"><input id="apiiuFile" name="apiiuFile" type="file" accept="image/*" size="1"><input id="apiiuSubmit" name="apiiuSubmit" type="submit" style="display:none;"></form></body></html>';
		frameWindow.document.open();
		frameWindow.document.write(content);
		frameWindow.document.close();

		var fileName = frameWindow.document.getElementById("apiiuFile");
		var fileSubmit = frameWindow.document.getElementById("apiiuSubmit");
		var oThis = this;
		fileName.onchange = function(e)
		{
			var bNeedSubmit = true;
			if(e && e.target && e.target.files)
			{
				var nError = ValidateUploadImage(e.target.files);
				if(c_oAscServerError.NoError != nError)
				{
					bNeedSubmit = false;
					oThis.asc_fireCallback("asc_onError",_mapAscServerErrorToAscError(nError),c_oAscError.Level.NoCritical);
				}
			}
			if(bNeedSubmit)
			{
				oThis.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
				fileSubmit.click();
			}
		};
		//todo пересмотреть opera
		if (window.opera != undefined)
			setTimeout( function(){fileName.click();}, 0);
		else
			fileName.click();
	}
}

asc_docs_api.prototype.AddImageUrl2 = function(url)
{
    this.AddImageUrl(_getFullImageSrc(url));
}

asc_docs_api.prototype.AddImageUrl = function(url, imgProp)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
		if(0 == url.indexOf(this.DocumentUrl))
		{
			this.AddImageUrlAction(url, imgProp);
		}
		else
		{
			var rData = {
				"id": documentId,
				"userid": documentUserId,
				"vkey": documentVKey,
				"c": "imgurl",
				"data": url};

			var oThis = this;
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
			sendCommand( oThis, function(incomeObject){
				if(null != incomeObject && "imgurl" ==incomeObject["type"])
					oThis.AddImageUrlAction(incomeObject["data"], imgProp);
				oThis.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
				}, rData );
		}
    }
}
asc_docs_api.prototype.AddImageUrlAction = function(url, imgProp)
{
    var _image = this.ImageLoader.LoadImage(url, 1);
    if (null != _image)
    {
        var _w = Math.max(1, Page_Width - (X_Left_Margin + X_Right_Margin));
        var _h = Math.max(1, Page_Height - (Y_Top_Margin + Y_Bottom_Margin));
        if (_image.Image != null)
        {
            var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
            var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);
            _w = Math.max(5, Math.min(_w, __w));
            _h = Math.max(5, Math.min(parseInt(_w * __h / __w)));
        }
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();

        var src = _image.src;
        if (this.isShapeImageChangeUrl)
        {
            var AscShapeProp = new CAscShapeProp();
            AscShapeProp.fill = new CAscFill();
            AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
            AscShapeProp.fill.fill = new CAscFillBlip();
            AscShapeProp.fill.fill.put_url(src);
            this.ImgApply(new CImgProperty({ShapeProperties:AscShapeProp}));
            this.isShapeImageChangeUrl = false;
        }
        else if (this.isImageChangeUrl)
        {
            var AscImageProp = new CImgProperty();
            AscImageProp.ImageUrl = src;
            this.ImgApply(AscImageProp);
            this.isImageChangeUrl = false;
        }
        else
        {
            var sFindString = editor.DocumentUrl + "media/";
            if(0 == src.indexOf(sFindString))
                src = src.substring(sFindString.length);

            if (undefined === imgProp || undefined === imgProp.WrappingStyle || 0 == imgProp.WrappingStyle)
                this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, src);
            else
                this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, src, null, true);
        }
    }
    else
    {
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
        this.asyncImageEndLoaded2 = function(_image)
        {
            var _w = Math.max(1, Page_Width - (X_Left_Margin + X_Right_Margin));
            var _h = Math.max(1, Page_Height - (Y_Top_Margin + Y_Bottom_Margin));
            if (_image.Image != null)
            {
                var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
                var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);
                _w = Math.max(5, Math.min(_w, __w));
                _h = Math.max(5, Math.min(parseInt(_w * __h / __w)));
            }
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            var src = _image.src;

            //this.WordControl.m_oLogicDocument.Add_FlowImage(_w, _h, src);
            if (this.isShapeImageChangeUrl)
            {
                var AscShapeProp = new CAscShapeProp();
                AscShapeProp.fill = new CAscFill();
                AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
                AscShapeProp.fill.fill = new CAscFillBlip();
                AscShapeProp.fill.fill.put_url(src);
                this.ImgApply(new CImgProperty({ShapeProperties:AscShapeProp}));
                this.isShapeImageChangeUrl = false;
            }
            else if (this.isImageChangeUrl)
            {
                var AscImageProp = new CImgProperty();
                AscImageProp.ImageUrl = src;
                this.ImgApply(AscImageProp);
                this.isImageChangeUrl = false;
            }
            else
            {
                var sFindString = editor.DocumentUrl + "media/";
                if(0 == src.indexOf(sFindString))
                    src = src.substring(sFindString.length);

                if (undefined === imgProp || undefined === imgProp.WrappingStyle || 0 == imgProp.WrappingStyle)
                    this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, src);
                else
                    this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, src, null, true);
            }

            this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);

            this.asyncImageEndLoaded2 = null;
        }
    }
}
/* В качестве параметра  передается объект класса CImgProperty, он же приходит на OnImgProp
CImgProperty заменяет пережнюю структуру:
если параметр не имеет значения то передвать следует null, напримере inline-картинок: в качестве left,top,bottom,right,X,Y,ImageUrl необходимо передавать null.
	{
		Width: 0,
		Height: 0,
		WrappingStyle: 0,
		Paddings: { Left : 0, Top : 0, Bottom: 0, Right: 0 },
		Position : {X : 0, Y : 0},
		ImageUrl : ""
	}
*/
asc_docs_api.prototype.ImgApply = function(obj)
{
    var ImagePr = obj;

    // Если у нас меняется с Float->Inline мы также должны залочить соответствующий параграф
    var AdditionalData = null;
    var LogicDocument = this.WordControl.m_oLogicDocument;

    /*
    if ( docpostype_FlowObjects == LogicDocument.CurPos.Type && "undefined" != typeof( ImagePr.WrappingStyle ) && null != ImagePr.WrappingStyle && c_oAscWrapStyle.Flow != ImagePr.WrappingStyle )
    {
        var FlowObject = LogicDocument.Pages[LogicDocument.Selection.Data.PageNum].FlowObjects.Get_ByIndex( LogicDocument.CurPos.ContentPos );
        AdditionalData =
        {
            Type    : 1,
            X       : FlowObject.X,
            Y       : FlowObject.Y,
            PageNum : LogicDocument.Selection.Data.PageNum
        }
    }
    */

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Image_Properties, AdditionalData) )
    {
        if(!this.noCreatePoint)
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();

        if (ImagePr.ShapeProperties)
            ImagePr.ImageUrl = "";

        if(ImagePr.ImageUrl != undefined && ImagePr.ImageUrl != null && ImagePr.ImageUrl != "")
        {
            var _img = this.ImageLoader.LoadImage(ImagePr.ImageUrl, 1)
            if (null != _img)
            {
                ImagePr.ImageUrl = _img.src;
                this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
            }
            else
            {
                this.asyncImageEndLoaded2 = function(_image)
                {
                    ImagePr.ImageUrl = _image.src;
                    this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                }
            }
        }
        else if (ImagePr.ShapeProperties && ImagePr.ShapeProperties.fill && ImagePr.ShapeProperties.fill.fill &&
            ImagePr.ShapeProperties.fill.fill.url !== undefined && ImagePr.ShapeProperties.fill.fill.url != null && ImagePr.ShapeProperties.fill.fill.url != "")
        {
            var _img = this.ImageLoader.LoadImage(ImagePr.ShapeProperties.fill.fill.url, 1)
            if (null != _img)
            {
                ImagePr.ImageUrl = _img.src;
                this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
            }
            else
            {
                this.asyncImageEndLoaded2 = function(_image)
                {
                    ImagePr.ImageUrl = _image.src;
                    this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                }
            }
        }
        else
        {
            ImagePr.ImageUrl = null;
            this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
        }
    }
}
asc_docs_api.prototype.set_Size = function(width, height){

}
asc_docs_api.prototype.set_ConstProportions = function(isOn){
	if (isOn){

	}
	else{

	}
}
asc_docs_api.prototype.set_WrapStyle = function(type){

}
asc_docs_api.prototype.deleteImage = function(){

}
asc_docs_api.prototype.set_ImgDistanceFromText = function(left,top,right,bottom){

}
asc_docs_api.prototype.set_PositionOnPage = function(X,Y){//расположение от начала страницы

}
asc_docs_api.prototype.get_OriginalSizeImage = function(){
	if (0 == this.SelectedObjectsStack.length)
        return null;
    var obj = this.SelectedObjectsStack[this.SelectedObjectsStack.length - 1];
    if (obj == null)
        return null;
    if (obj.Type == c_oAscTypeSelectElement.Image)
        return obj.Value.get_OriginSize(this);
}

asc_docs_api.prototype.ShapeApply = function(shapeProps)
{
    // нужно определить, картинка это или нет
    var image_url = "";
    if (shapeProps.fill != null)
    {
        if (shapeProps.fill.fill != null && shapeProps.fill.type == c_oAscFill.FILL_TYPE_BLIP)
        {
            image_url = shapeProps.fill.fill.get_url();

            var _tx_id = shapeProps.fill.fill.get_texture_id();
            if (null != _tx_id && 0 <= _tx_id && _tx_id < g_oUserTexturePresets.length)
            {
                image_url = g_oUserTexturePresets[_tx_id];
            }
        }
    }
    if (image_url != "")
    {
        var _image = this.ImageLoader.LoadImage(image_url, 1);

        var sFindString = editor.DocumentUrl + "media/";
        if(0 == image_url.indexOf(sFindString))
        {
            image_url = image_url.substring(sFindString.length);
            shapeProps.fill.fill.put_url(image_url); // erase documentUrl
        }

        if (null != _image)
        {
            this.WordControl.m_oLogicDocument.ShapeApply(shapeProps);
            this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);
        }
        else
        {
            this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);

            var oProp = shapeProps;
            this.asyncImageEndLoaded2 = function(_image)
            {
                this.WordControl.m_oLogicDocument.ShapeApply(oProp);
                this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);

                this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                this.asyncImageEndLoaded2 = null;
            }
        }
    }
    else
    {
        this.WordControl.m_oLogicDocument.ShapeApply(shapeProps);
    }
}
/*callbacks*/
asc_docs_api.prototype.sync_AddImageCallback = function(){
	this.asc_fireCallback("asc_onAddImage");
}
asc_docs_api.prototype.sync_ImgPropCallback = function(imgProp)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    imgProp.Locked = true;

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Image, new CImgProperty( imgProp ) );
}
asc_docs_api.prototype.sync_ImgWrapStyleChangedCallback = function(style){
	this.asc_fireCallback("asc_onImgWrapStyleChanged",style);
}

//-----------------------------------------------------------------
// События контекстного меню
//-----------------------------------------------------------------

function CContextMenuData( obj )
{
    if( obj )
    {
        this.Type  = ( undefined != obj.Type ) ? obj.Type : c_oAscContextMenuTypes.Common;
        this.X_abs = ( undefined != obj.X_abs ) ? obj.X_abs : 0;
        this.Y_abs = ( undefined != obj.Y_abs ) ? obj.Y_abs : 0;

        switch ( this.Type )
        {
            case c_oAscContextMenuTypes.ChangeHdrFtr :
            {
                this.PageNum = ( undefined != obj.PageNum ) ? obj.PageNum : 0;
                this.Header  = ( undefined != obj.Header  ) ? obj.Header  : true;

                break;
            }
        }
    }
    else
    {
        this.Type  = c_oAscContextMenuTypes.Common;
        this.X_abs = 0;
        this.Y_abs = 0;
    }
}

CContextMenuData.prototype.get_Type  = function()  { return this.Type; }
CContextMenuData.prototype.get_X = function()  { return this.X_abs; }
CContextMenuData.prototype.get_Y = function()  { return this.Y_abs; }
CContextMenuData.prototype.get_PageNum = function()  { return this.PageNum; }
CContextMenuData.prototype.is_Header = function()  { return this.Header; }

asc_docs_api.prototype.sync_ContextMenuCallback = function(Data)
{
    this.asc_fireCallback("asc_onContextMenu", new CContextMenuData( Data ) );
}

//-----------------------------------------------------------------
// События движения мыши
//-----------------------------------------------------------------
function CMouseMoveData( obj )
{
    if( obj )
    {
        this.Type  = ( undefined != obj.Type ) ? obj.Type : c_oAscMouseMoveDataTypes.Common;
        this.X_abs = ( undefined != obj.X_abs ) ? obj.X_abs : 0;
        this.Y_abs = ( undefined != obj.Y_abs ) ? obj.Y_abs : 0;

        switch ( this.Type )
        {
            case c_oAscMouseMoveDataTypes.Hyperlink :
            {
                this.Hyperlink = ( undefined != obj.PageNum ) ? obj.PageNum : 0;
                break;
            }

            case c_oAscMouseMoveDataTypes.LockedObject :
            {
                this.UserId           = ( undefined != obj.UserId ) ? obj.UserId : "";
                this.HaveChanges      = ( undefined != obj.HaveChanges ) ? obj.HaveChanges : false;
                this.LockedObjectType = ( undefined != obj.LockedObjectType ) ? obj.LockedObjectType : c_oAscMouseMoveLockedObjectType.Common;
                break;
            }
        }
    }
    else
    {
        this.Type  = c_oAscMouseMoveDataTypes.Common;
        this.X_abs = 0;
        this.Y_abs = 0;
    }
}

CMouseMoveData.prototype.get_Type  = function()  { return this.Type; }
CMouseMoveData.prototype.get_X = function()  { return this.X_abs; }
CMouseMoveData.prototype.get_Y = function()  { return this.Y_abs; }
CMouseMoveData.prototype.get_Hyperlink = function()  { return this.Hyperlink; }
CMouseMoveData.prototype.get_UserId = function() { return this.UserId; };
CMouseMoveData.prototype.get_HaveChanges = function() { return this.HaveChanges; };
CMouseMoveData.prototype.get_LockedObjectType = function() { return this.LockedObjectType; };

asc_docs_api.prototype.sync_MouseMoveStartCallback = function()
{
    this.asc_fireCallback("asc_onMouseMoveStart");
}

asc_docs_api.prototype.sync_MouseMoveEndCallback = function()
{
    this.asc_fireCallback("asc_onMouseMoveEnd");
}

asc_docs_api.prototype.sync_MouseMoveCallback = function(Data)
{
    this.asc_fireCallback("asc_onMouseMove", Data );
}

//-----------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------
asc_docs_api.prototype.can_AddHyperlink = function()
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    return false;

    var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd(true);
    if ( true === bCanAdd )
        return this.WordControl.m_oLogicDocument.Get_SelectedText(true);

    return false;
}

// HyperProps - объект CHyperlinkProperty
asc_docs_api.prototype.add_Hyperlink = function(HyperProps)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Hyperlink_Add( HyperProps );
    }
}

// HyperProps - объект CHyperlinkProperty
asc_docs_api.prototype.change_Hyperlink = function(HyperProps)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Hyperlink_Modify( HyperProps );
    }
}

asc_docs_api.prototype.remove_Hyperlink = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Hyperlink_Remove();
    }
}

function CHyperlinkProperty( obj )
{
    if( obj )
    {
        this.Text    = (undefined != obj.Text   ) ? obj.Text    : null;
        this.Value   = (undefined != obj.Value  ) ? obj.Value   : "";
        this.ToolTip = (undefined != obj.ToolTip) ? obj.ToolTip : "";
    }
    else
    {
        this.Text    = null;
        this.Value   = "";
        this.ToolTip = "";
    }
}

CHyperlinkProperty.prototype.get_Value   = function()  { return this.Value; }
CHyperlinkProperty.prototype.put_Value   = function(v) { this.Value = v; }
CHyperlinkProperty.prototype.get_ToolTip = function()  { return this.ToolTip; }
CHyperlinkProperty.prototype.put_ToolTip = function(v) { this.ToolTip = v; }
CHyperlinkProperty.prototype.get_Text    = function()  { return this.Text; }
CHyperlinkProperty.prototype.put_Text    = function(v) { this.Text = v; }

asc_docs_api.prototype.sync_HyperlinkPropCallback = function(hyperProp)
{
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Hyperlink, new CHyperlinkProperty( hyperProp ) );
}

asc_docs_api.prototype.sync_HyperlinkClickCallback = function(Url)
{
    this.asc_fireCallback("asc_onHyperlinkClick", Url);
}

asc_docs_api.prototype.sync_CanAddHyperlinkCallback = function(bCanAdd)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    this.asc_fireCallback("asc_onCanAddHyperlink", false);
    //else
        this.asc_fireCallback("asc_onCanAddHyperlink", bCanAdd);
}

asc_docs_api.prototype.sync_DialogAddHyperlink = function()
{
    this.asc_fireCallback("asc_onDialogAddHyperlink");
}

asc_docs_api.prototype.sync_DialogAddHyperlink = function()
{
    this.asc_fireCallback("asc_onDialogAddHyperlink");
}

//-----------------------------------------------------------------
// Функции для работы с орфографией
//-----------------------------------------------------------------
function asc_CSpellCheckProperty( Word, Checked, Variants, ParaId, ElemId )
{
    this.Word     = Word;
    this.Checked  = Checked;
    this.Variants = Variants;

    this.ParaId   = ParaId;
    this.ElemId   = ElemId;
}

asc_CSpellCheckProperty.prototype.get_Word     = function()  { return this.Word; }
asc_CSpellCheckProperty.prototype.get_Checked  = function()  { return this.Checked; }
asc_CSpellCheckProperty.prototype.get_Variants = function()  { return this.Variants; }

asc_docs_api.prototype.sync_SpellCheckCallback = function(Word, Checked, Variants, ParaId, ElemId)
{
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.SpellCheck, new asc_CSpellCheckProperty( Word, Checked, Variants, ParaId, ElemId ) );
}

asc_docs_api.prototype.sync_SpellCheckVariantsFound = function()
{
    this.asc_fireCallback("asc_onSpellCheckVariantsFound");
}

asc_docs_api.prototype.asc_replaceMisspelledWord = function(Word, SpellCheckProperty)
{
    var ParaId = SpellCheckProperty.ParaId;
    var ElemId = SpellCheckProperty.ElemId;

    var Paragraph = g_oTableId.Get_ById(ParaId);
    if ( null != Paragraph && false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Element_and_Type, Element : Paragraph, CheckType : changestype_Paragraph_Content } ) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        Paragraph.Replace_MisspelledWord( Word, ElemId );
        this.WordControl.m_oLogicDocument.Recalculate();
        Paragraph.Document_SetThisElementCurrent(true);
    }
}

asc_docs_api.prototype.asc_ignoreMisspelledWord = function(SpellCheckProperty, bAll)
{
    if ( false === bAll )
    {
        var ParaId = SpellCheckProperty.ParaId;
        var ElemId = SpellCheckProperty.ElemId;

        var Paragraph = g_oTableId.Get_ById(ParaId);
        if ( null != Paragraph )
        {
            Paragraph.Ignore_MisspelledWord( ElemId );
        }
    }
    else
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        LogicDocument.Spelling.Add_Word( SpellCheckProperty.Word );
        LogicDocument.DrawingDocument.ClearCachePages();
        LogicDocument.DrawingDocument.FirePaint();
    }
}

asc_docs_api.prototype.asc_setDefaultLanguage = function(Lang)
{
    if (editor.WordControl.m_oLogicDocument)
        editor.WordControl.m_oLogicDocument.Set_DefaultLanguage(Lang);
}

asc_docs_api.prototype.asc_getDefaultLanguage = function()
{
    if (editor.WordControl.m_oLogicDocument)
        return editor.WordControl.m_oLogicDocument.Get_DefaultLanguage();
    return null;
}
//-----------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------
function asc_CCommentData( obj )
{
    if( obj )
    {
        this.m_sText      = (undefined != obj.m_sText     ) ? obj.m_sText      : "";
        this.m_sTime      = (undefined != obj.m_sTime     ) ? obj.m_sTime      : "";
        this.m_sUserId    = (undefined != obj.m_sUserId   ) ? obj.m_sUserId    : "";
        this.m_sQuoteText = (undefined != obj.m_sQuoteText) ? obj.m_sQuoteText : null;
        this.m_bSolved    = (undefined != obj.m_bSolved   ) ? obj.m_bSolved    : false;
        this.m_sUserName  = (undefined != obj.m_sUserName ) ? obj.m_sUserName  : "";
        this.m_aReplies   = [];
        if ( undefined != obj.m_aReplies )
        {
            var Count = obj.m_aReplies.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var Reply = new asc_CCommentData( obj.m_aReplies[Index] );
                this.m_aReplies.push( Reply );
            }
        }
    }
    else
    {
        this.m_sText      = "";
        this.m_sTime      = "";
        this.m_sUserId    = "";
        this.m_sQuoteText = null;
        this.m_bSolved    = false;
        this.m_sUserName  = "";
        this.m_aReplies   = [];
    }
}

asc_CCommentData.prototype.asc_getText         = function()  { return this.m_sText; }
asc_CCommentData.prototype.asc_putText         = function(v) { this.m_sText = v; }
asc_CCommentData.prototype.asc_getTime         = function()  { return this.m_sTime; }
asc_CCommentData.prototype.asc_putTime         = function(v) { this.m_sTime = v; }
asc_CCommentData.prototype.asc_getUserId       = function()  { return this.m_sUserId; }
asc_CCommentData.prototype.asc_putUserId       = function(v) { this.m_sUserId = v; }
asc_CCommentData.prototype.asc_getUserName     = function()  { return this.m_sUserName; }
asc_CCommentData.prototype.asc_putUserName     = function(v) { this.m_sUserName = v; }
asc_CCommentData.prototype.asc_getQuoteText    = function()  { return this.m_sQuoteText; };
asc_CCommentData.prototype.asc_putQuoteText    = function(v) { this.m_sQuoteText = v; };
asc_CCommentData.prototype.asc_getSolved       = function()  { return this.m_bSolved; };
asc_CCommentData.prototype.asc_putSolved       = function(v) { this.m_bSolved = v; };
asc_CCommentData.prototype.asc_getReply        = function(i) { return this.m_aReplies[i]; }
asc_CCommentData.prototype.asc_addReply        = function(v) { this.m_aReplies.push( v ); }
asc_CCommentData.prototype.asc_getRepliesCount = function(v) { return this.m_aReplies.length; }


asc_docs_api.prototype.asc_showComments = function()
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    this.WordControl.m_oLogicDocument.Show_Comments();
}

asc_docs_api.prototype.asc_hideComments = function()
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    this.WordControl.m_oLogicDocument.Hide_Comments();
    editor.sync_HideComment();
}

asc_docs_api.prototype.asc_addComment = function(AscCommentData)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //   return;

    if (null == this.WordControl.m_oLogicDocument)
        return;

    var CommentData = new CCommentData();
    CommentData.Read_FromAscCommentData(AscCommentData);

    // Добавлять комментарии можно всегда
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    var Comment = this.WordControl.m_oLogicDocument.Add_Comment( CommentData );
    if ( null != Comment )
        this.sync_AddComment( Comment.Get_Id(), CommentData );
    
    return Comment.Get_Id();
}

asc_docs_api.prototype.asc_removeComment = function(Id)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Comment, Id : Id } ) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Remove_Comment( Id, true );
    }
}

asc_docs_api.prototype.asc_changeComment = function(Id, AscCommentData)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Comment, Id : Id } ) )
    {
        var CommentData = new CCommentData();
        CommentData.Read_FromAscCommentData(AscCommentData);

        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Change_Comment( Id, CommentData );

        this.sync_ChangeCommentData( Id, CommentData );
    }
}

asc_docs_api.prototype.asc_selectComment = function(Id)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    this.WordControl.m_oLogicDocument.Select_Comment(Id);
}

asc_docs_api.prototype.asc_showComment = function(Id)
{
    this.WordControl.m_oLogicDocument.Show_Comment(Id);
}

asc_docs_api.prototype.can_AddQuotedComment = function()
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    return false;

    return this.WordControl.m_oLogicDocument.CanAdd_Comment();
}

asc_docs_api.prototype.sync_RemoveComment = function(Id)
{
    this.asc_fireCallback("asc_onRemoveComment", Id);
}

asc_docs_api.prototype.sync_AddComment = function(Id, CommentData)
{
    var AscCommentData = new asc_CCommentData(CommentData);
    this.asc_fireCallback("asc_onAddComment", Id, AscCommentData);
}

asc_docs_api.prototype.sync_ShowComment = function(Id, X, Y)
{
    // TODO: Переделать на нормальный массив
    this.asc_fireCallback("asc_onShowComment", [ Id ], X, Y);
}

asc_docs_api.prototype.sync_HideComment = function()
{
    this.asc_fireCallback("asc_onHideComment");
}

asc_docs_api.prototype.sync_UpdateCommentPosition = function(Id, X, Y)
{
    // TODO: Переделать на нормальный массив
    this.asc_fireCallback("asc_onUpdateCommentPosition", [ Id ], X, Y);
}

asc_docs_api.prototype.sync_ChangeCommentData = function(Id, CommentData)
{
    var AscCommentData = new asc_CCommentData(CommentData);
    this.asc_fireCallback("asc_onChangeCommentData", Id, AscCommentData);
}

asc_docs_api.prototype.sync_LockComment = function(Id, UserId)
{
    this.asc_fireCallback("asc_onLockComment", Id, UserId);
}

asc_docs_api.prototype.sync_UnLockComment = function(Id)
{
    this.asc_fireCallback("asc_onUnLockComment", Id);
}

asc_docs_api.prototype.asc_getComments = function()
{
    var ResComments = [];
    var LogicDocument = this.WordControl.m_oLogicDocument;
    if ( undefined != LogicDocument )
    {
        var DocComments = LogicDocument.Comments;
        for ( var Id in DocComments.m_aComments )
        {
            var AscCommentData = new asc_CCommentData(DocComments.m_aComments[Id].Data);
            ResComments.push( { "Id" : Id, "Comment" : AscCommentData } );
        }
    }

    return ResComments;
}
//-----------------------------------------------------------------
asc_docs_api.prototype.sync_LockHeaderFooters = function()
{
    this.asc_fireCallback("asc_onLockHeaderFooters");
}

asc_docs_api.prototype.sync_LockDocumentProps = function()
{
    this.asc_fireCallback("asc_onLockDocumentProps");
}

asc_docs_api.prototype.sync_UnLockHeaderFooters = function()
{
    this.asc_fireCallback("asc_onUnLockHeaderFooters");
}

asc_docs_api.prototype.sync_UnLockDocumentProps = function()
{
    this.asc_fireCallback("asc_onUnLockDocumentProps");
}

asc_docs_api.prototype.sync_CollaborativeChanges = function()
{
    this.asc_fireCallback("asc_onCollaborativeChanges");
}

asc_docs_api.prototype.sync_LockDocumentSchema = function()
{
    this.asc_fireCallback("asc_onLockDocumentSchema");
}

asc_docs_api.prototype.sync_UnLockDocumentSchema = function()
{
    this.asc_fireCallback("asc_onUnLockDocumentSchema");
}


/*----------------------------------------------------------------*/
/*functions for working with zoom & navigation*/
asc_docs_api.prototype.zoomIn = function(){
    this.WordControl.zoom_In();
}
asc_docs_api.prototype.zoomOut = function(){
    this.WordControl.zoom_Out();
}
asc_docs_api.prototype.zoomFitToPage = function(){
    this.WordControl.zoom_FitToPage();
}
asc_docs_api.prototype.zoomFitToWidth = function(){
    this.WordControl.zoom_FitToWidth();
}
asc_docs_api.prototype.zoomCustomMode = function(){
    this.WordControl.m_nZoomType = 0;
    this.WordControl.zoom_Fire(0, this.WordControl.m_nZoomValue);
}
asc_docs_api.prototype.zoom100 = function(){
	this.zoom(100);
}
asc_docs_api.prototype.zoom = function(percent){
    var _old_val = this.WordControl.m_nZoomValue;
    this.WordControl.m_nZoomValue = percent;
    this.WordControl.m_nZoomType = 0;
    this.WordControl.zoom_Fire(0, _old_val);
}
asc_docs_api.prototype.goToPage = function(number){
	this.WordControl.GoToPage(number);
}
asc_docs_api.prototype.getCountPages = function(){
	return this.WordControl.m_oDrawingDocument.m_lPagesCount;
}
asc_docs_api.prototype.getCurrentPage = function(){
	return this.WordControl.m_oDrawingDocument.m_lCurrentPage;
}
/*callbacks*/
asc_docs_api.prototype.sync_zoomChangeCallback = function(percent,type){	//c_oAscZoomType.Current, c_oAscZoomType.FitWidth, c_oAscZoomType.FitPage
	this.asc_fireCallback("asc_onZoomChange",percent,type);
}
asc_docs_api.prototype.sync_countPagesCallback = function(count){
	this.asc_fireCallback("asc_onCountPages",count);
}
asc_docs_api.prototype.sync_currentPageCallback = function(number){
	this.asc_fireCallback("asc_onCurrentPage",number);
}

asc_docs_api.prototype.async_SaveToPdf = function(){

    var oThis = this;
    var pdf_interval = setInterval(function(){
        var dd = oThis.WordControl.m_oDrawingDocument;

        var is_end = dd.isComleteRenderer2();
		oThis.async_SaveToPdf_PartCallback(dd.ToRendererPart(), is_end);
        if (is_end)
        {
            clearInterval(pdf_interval);
        }
    }, 10);
}

asc_docs_api.prototype.async_SaveToPdf_PartCallback = function(part64, is_end)
{
	if (undefined != window['qtDocBridge'])
	{
		window['qtDocBridge']['printedDocumentPart'] (part64, is_end);
	}
}
asc_docs_api.prototype.async_SaveToPdf_Progress = function(progress)
{
	if (undefined != window['qtDocBridge'])
	{
		window['qtDocBridge']['progressedSaveToPDF'] (progress);
	}
}

/*----------------------------------------------------------------*/
asc_docs_api.prototype.asc_enableKeyEvents = function(value){
	if (this.WordControl.IsFocus != value) {
		this.WordControl.IsFocus = value;

        if (this.WordControl.IsFocus && null != this.WordControl.TextBoxInput)
            this.WordControl.TextBoxInput.focus();

		this.asc_fireCallback("asc_onEnableKeyEventsChanged", value);
	}
}

asc_docs_api.prototype.asyncServerIdStartLoaded = function()
{
	this._coSpellCheckInit();
	this._coAuthoringInit();
}

asc_docs_api.prototype.asyncServerIdEndLoaded = function()
{
    this.ServerIdWaitComplete = true;
    if (true == this.ServerImagesWaitComplete)
        this.OpenDocumentEndCallback();
}

// работа с шрифтами
asc_docs_api.prototype.asyncFontsDocumentStartLoaded = function()
{
	// здесь прокинуть евент о заморозке меню
	// и нужно вывести информацию в статус бар
    if (this.isPasteFonts_Images)
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadFont);
    else if (this.isSaveFonts_Images)
        this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    else
    {
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

        // заполним прогресс
        var _progress = this.OpenDocumentProgress;
        _progress.Type = c_oAscAsyncAction.LoadDocumentFonts;
        _progress.FontsCount = this.FontLoader.fonts_loading.length;
        _progress.CurrentFont = 0;

        var _loader_object = this.WordControl.m_oLogicDocument;
        var _count = 0;
        if (_loader_object !== undefined && _loader_object != null)
        {
            for (var i in _loader_object.ImageMap)
                ++_count;
        }

        _progress.ImagesCount = _count;
        _progress.CurrentImage = 0;
    }
}
asc_docs_api.prototype.GenerateStyles = function()
{
    var StylesPainter = new CStylesPainter();
    if (null == this.LoadedObject && null != this.WordControl.m_oLogicDocument)
    {
        StylesPainter.GenerateStyles(this, this.WordControl.m_oLogicDocument.Get_Styles().Style);
    }
    else
    {
        StylesPainter.GenerateStyles(this, this.LoadedObjectDS);
    }
}
asc_docs_api.prototype.asyncFontsDocumentEndLoaded = function()
{
    // все, шрифты загружены. Теперь нужно подгрузить картинки
    if (this.isPasteFonts_Images)
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadFont);
    else if (this.isSaveFonts_Images)
        this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    else
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

    this.EndActionLoadImages = 0;
    if (this.isPasteFonts_Images)
    {
        var _count = 0;
        for (var i in this.pasteImageMap)
            ++_count;

        if (_count > 0)
        {
            this.EndActionLoadImages = 2;
            this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
        }

        var _oldAsyncLoadImages = this.ImageLoader.bIsAsyncLoadDocumentImages;
        this.ImageLoader.bIsAsyncLoadDocumentImages = false;
        this.ImageLoader.LoadDocumentImages(this.pasteImageMap, false);
        this.ImageLoader.bIsAsyncLoadDocumentImages = true;
        return;
    }
    else if (this.isSaveFonts_Images)
    {
        var _count = 0;
        for (var i in this.saveImageMap)
            ++_count;

        if (_count > 0)
        {
            this.EndActionLoadImages = 2;
            this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
        }

        this.ImageLoader.LoadDocumentImages(this.saveImageMap, false);
        return;
    }

    if (!this.FontLoader.embedded_cut_manager.bIsCutFontsUse)
        this.GenerateStyles();

    if (null != this.WordControl.m_oLogicDocument)
    {
        this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
        this.WordControl.m_oDrawingDocument.SendThemeColorScheme();
		this.asc_fireCallback("asc_onUpdateChartStyles");
    }

    if (this.isLoadNoCutFonts)
    {
        this.isLoadNoCutFonts = false;
        this.SetViewMode(false);
        return;
    }

    // открытие после загрузки документа

	var _loader_object = this.WordControl.m_oLogicDocument;
	if (null == _loader_object)
		_loader_object = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer;

    var _count = 0;
	for (var i in _loader_object.ImageMap)
        ++_count;

    if (!this.isOnlyReaderMode)
    {
        // add const textures
        var _st_count = g_oUserTexturePresets.length;
        for (var i = 0; i < _st_count; i++)
            _loader_object.ImageMap[_count + i] = g_oUserTexturePresets[i];

        if (this.OpenDocumentProgress && !this.ImageLoader.bIsAsyncLoadDocumentImages)
        {
            this.OpenDocumentProgress.ImagesCount += _st_count;
        }
    }

    if (_count > 0)
    {
        this.EndActionLoadImages = 1;
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
    }

    this.ImageLoader.bIsLoadDocumentFirst = true;
	this.ImageLoader.LoadDocumentImages(_loader_object.ImageMap, true);
}

asc_docs_api.prototype.CreateFontsCharMap = function()
{
    var _info = new CFontsCharMap();
    _info.StartWork();

    this.WordControl.m_oLogicDocument.Document_CreateFontCharMap(_info);

    return _info.EndWork();
}

asc_docs_api.prototype.sync_SendThemeColors = function(colors,standart_colors)
{
    this._gui_control_colors = { Colors : colors, StandartColors : standart_colors };
    this.asc_fireCallback("asc_onSendThemeColors",colors,standart_colors);
}
asc_docs_api.prototype.sync_SendThemeColorSchemes = function(param)
{
    this._gui_color_schemes = param;
}

asc_docs_api.prototype.ChangeColorScheme = function(index_scheme)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    var _changer = this.WordControl.m_oLogicDocument.DrawingObjects;
    if (null == _changer)
        return;

    var theme = this.WordControl.m_oLogicDocument.theme;

    var _count_defaults = g_oUserColorScheme.length;
    this.WordControl.m_oLogicDocument.DrawingObjects.Document_Is_SelectionLocked(changestype_ColorScheme);

    if(this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_ColorScheme) === false)
    {
        History.Create_NewPoint();
        var data = {Type: historyitem_ChangeColorScheme, oldScheme:theme.themeElements.clrScheme};

        if (index_scheme < _count_defaults)
        {
            var _obj = g_oUserColorScheme[index_scheme];
            var scheme = new ClrScheme();
			scheme.name = _obj["name"];
            var _c = null;

            _c = _obj["dk1"];
            scheme.colors[8] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["lt1"];
            scheme.colors[12] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["dk2"];
            scheme.colors[9] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["lt2"];
            scheme.colors[13] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent1"];
            scheme.colors[0] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent2"];
            scheme.colors[1] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent3"];
            scheme.colors[2] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent4"];
            scheme.colors[3] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent5"];
            scheme.colors[4] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent6"];
            scheme.colors[5] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["hlink"];
            scheme.colors[11] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["folHlink"];
            scheme.colors[10] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            theme.themeElements.clrScheme = scheme;
            /*_changer.calculateAfterChangeTheme();

             // TODO:
             this.WordControl.m_oDrawingDocument.ClearCachePages();
             this.WordControl.OnScroll();*/
        }
        else
        {
            index_scheme -= _count_defaults;

            if (index_scheme < 0 || index_scheme >= theme.extraClrSchemeLst.length)
                return;

            theme.themeElements.clrScheme = theme.extraClrSchemeLst[index_scheme].clrScheme.createDuplicate();
            /*_changer.calculateAfterChangeTheme();

             // TODO:
             this.WordControl.m_oDrawingDocument.ClearCachePages();
             this.WordControl.OnScroll();*/
        }

        data.newScheme = theme.themeElements.clrScheme;
        History.Add(this.WordControl.m_oLogicDocument.DrawingObjects, data);
        this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
        var is_on = History.Is_On();
        if(is_on)
        {
            History.TurnOff();
        }
        //this.chartStyleManager.init();
        //this.chartPreviewManager.init();
        if(is_on)
        {
            History.TurnOn();
        }
        this.asc_fireCallback("asc_onUpdateChartStyles");
        this.WordControl.m_oLogicDocument.Recalculate();

        // TODO:
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.OnScroll();

        this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
    }

}

asc_docs_api.prototype.asyncImagesDocumentStartLoaded = function()
{
	// евент о заморозке не нужен... оно и так заморожено
	// просто нужно вывести информацию в статус бар (что началась загрузка картинок)
}
asc_docs_api.prototype.asyncImagesDocumentEndLoaded = function()
{
    if (this.EndActionLoadImages == 1)
    {
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
    }
    else if (this.EndActionLoadImages == 2)
    {
        if (this.isPasteFonts_Images)
            this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
        else
            this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
    }

    this.EndActionLoadImages = 0;
    this.ImageLoader.bIsLoadDocumentFirst = false;

    if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
    {
        this.WordControl.m_oDrawingDocument.OpenDocument();

        this.LoadedObject = null;

        this.bInit_word_control = true;

        if (false === this.isPasteFonts_Images)
            this.asc_fireCallback("asc_onDocumentContentReady");

        this.WordControl.InitControl();

        if (this.isViewMode)
            this.SetViewMode(true);

        //this.asyncServerIdStartLoaded();
        return;
    }

	// размораживаем меню... и начинаем считать документ
    if (false === this.isPasteFonts_Images && false === this.isSaveFonts_Images && false === this.isLoadImagesCustom)
    {
        this.ServerImagesWaitComplete = true;
        if (true == this.ServerIdWaitComplete)
            this.OpenDocumentEndCallback();

        //this.asyncServerIdStartLoaded();
    }
    else
    {
        if (this.isPasteFonts_Images)
        {
            this.isPasteFonts_Images = false;
            this.pasteImageMap = null;
            this.pasteCallback();
            window.GlobalPasteFlag = false;
            window.GlobalPasteFlagCounter = 0;
            this.pasteCallback = null;
        }
        else if (this.isSaveFonts_Images)
        {
            this.isSaveFonts_Images = false;
            this.saveImageMap = null;
            this.pre_SaveCallback();
        }
        else if (this.isLoadImagesCustom)
        {
            this.isLoadImagesCustom = false;
            this.loadCustomImageMap = null;

            if (!this.ImageLoader.bIsAsyncLoadDocumentImages)
                this.SyncLoadImages_callback();
        }
    }
}

asc_docs_api.prototype.OpenDocumentEndCallback = function()
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    if (0 == this.DocumentType)
        this.WordControl.m_oLogicDocument.LoadEmptyDocument();
    else if (1 == this.DocumentType)
    {
        this.WordControl.m_oLogicDocument.LoadTestDocument();
    }
    else
    {
        if(this.LoadedObject)
        {
            if(1 != this.LoadedObject)
            {
                this.WordControl.m_oLogicDocument.fromJfdoc(this.LoadedObject);
                this.WordControl.m_oDrawingDocument.TargetStart();
                this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
            }
            else
            {
                var Document = this.WordControl.m_oLogicDocument;

                if (this.isApplyChangesOnOpenEnabled)
                {
                    this.isApplyChangesOnOpenEnabled = false;
                    this.isApplyChangesOnOpen = true;
                    CollaborativeEditing.Apply_Changes();
                    CollaborativeEditing.Release_Locks();
                }

                History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : { Pos : 0, PageNum : 0 } } );

                //Recalculate для Document
                Document.CurPos.ContentPos = 0;
                History.RecalcData_Add({Type: historyrecalctype_Drawing, All: true});
                Document.DrawingObjects.addToZIndexManagerAfterOpen();
                if (!this.isOnlyReaderMode)
                {
                    Document.Recalculate();
                    this.WordControl.m_oDrawingDocument.TargetStart();
                }
                else
                {
                    Document.Recalculate_AllTables();
                    this.ChangeReaderMode();
                }
            }
        }
    }

    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    //this.WordControl.m_oLogicDocument.Document_UpdateRulersState();
    this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
    this.LoadedObject = null;

    this.bInit_word_control = true;
    this.asc_fireCallback("asc_onDocumentContentReady");

    this.WordControl.InitControl();

    if (this.isViewMode)
        this.SetViewMode(true);
		
	if (undefined != window['qtDocBridge'])
    {
        window['qtDocBridge']['documentContentReady'] ();
	}

	// Запускаем таймер автосохранения
	this.autoSaveInit();
}

asc_docs_api.prototype.UpdateInterfaceState = function()
{
    if (this.WordControl.m_oLogicDocument != null)
    {
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }
}

asc_docs_api.prototype.asyncFontStartLoaded = function()
{
	// здесь прокинуть евент о заморозке меню
    this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
}
asc_docs_api.prototype.asyncFontEndLoaded = function(fontinfo)
{
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);

    if (this.FontAsyncLoadType == 1)
    {
        this.FontAsyncLoadType = 0;
        this.asc_AddMath2(this.FontAsyncLoadParam);
        this.FontAsyncLoadParam = null;
        return;
    }

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontFamily : { Name : fontinfo.Name , Index : -1 } } ) );
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }
	// отжать заморозку меню
}

asc_docs_api.prototype.asyncImageStartLoaded = function()
{
    // здесь прокинуть евент о заморозке меню
}
asc_docs_api.prototype.asyncImageEndLoaded = function(_image)
{
    // отжать заморозку меню
	if (this.asyncImageEndLoaded2)
		this.asyncImageEndLoaded2(_image);
	else
    {
        if (_image.Type == 0)
        {
            // TODO: Как только сделаем привязку Flow-объектов к параграфу
            //       добавить проверку здесь. Пока Flow-картинки всегда можно добавить
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
            this.WordControl.m_oLogicDocument.Add_FlowImage(50, 50, _image.src);
        }
        else
        {
            if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                this.WordControl.m_oLogicDocument.Add_InlineImage(50, 50, _image.src);
            }
        }
	}
}

asc_docs_api.prototype.asyncImageEndLoadedBackground = function(_image)
{
    this.WordControl.m_oDrawingDocument.CheckRasterImageOnScreen(_image.src);
}
asc_docs_api.prototype.IsAsyncOpenDocumentImages = function()
{
    return true;
}

asc_docs_api.prototype.SendOpenProgress = function()
{
    // Пока отсылаем старый callback
    this.asc_fireCallback("asc_onOpenDocumentProgress", this.OpenDocumentProgress);
    var _progress = this.OpenDocumentProgress;
    var _percents = (_progress.get_CurrentFont() + _progress.get_CurrentImage())/(_progress.get_FontsCount() + _progress.get_ImagesCount());
    // приводим к 0..100
    _percents *= 100;
    // рассчет исходя из того, что часть прогресса прошли на конвертации
    _percents = this._lastConvertProgress + _percents * (100.0 - this._lastConvertProgress) / 100.0;
    return this.sync_SendProgress(_percents);
    //console.log("" + this.OpenDocumentProgress.CurrentFont);
}

asc_docs_api.prototype.sync_SendProgress = function(Percents)
{
    this.asc_fireCallback("asc_onOpenDocumentProgress2", Percents);
	if (undefined != window['qtDocBridge'])
    {
        // push data to native QT code
        window['qtDocBridge']['openedProgress'] (Percents);
    }
}

asc_docs_api.prototype.pre_Paste = function(_fonts, _images, callback)
{
    this.pasteCallback = callback;
    this.pasteImageMap = _images;

    var _count = 0;
    for (var i in this.pasteImageMap)
        ++_count;
    if (0 == _count && false === this.FontLoader.CheckFontsNeedLoading(_fonts))
    {
        // никаких евентов. ничего грузить не нужно. сделано для сафари под макОс.
        // там при LongActions теряется фокус и вставляются пробелы
        this.pasteCallback();
        window.GlobalPasteFlag = false;
        window.GlobalPasteFlagCounter = 0;
        this.pasteCallback = null;
        return;
    }

    this.isPasteFonts_Images = true;
    this.FontLoader.LoadDocumentFonts2(_fonts);
}

asc_docs_api.prototype.pre_Save = function(_images)
{
    this.isSaveFonts_Images = true;
    this.saveImageMap = _images;
    this.WordControl.m_oDrawingDocument.CheckFontNeeds();
    this.FontLoader.LoadDocumentFonts2(this.WordControl.m_oLogicDocument.Fonts);
}

asc_docs_api.prototype.SyncLoadImages = function(_images)
{
    this.isLoadImagesCustom = true;
    this.loadCustomImageMap = _images;

    var _count = 0;
    var _loaded = this.ImageLoader.map_image_index;

    var _new_len = this.loadCustomImageMap.length;
    for (var i = 0; i < _new_len; i++)
    {
        if (undefined !== _loaded[this.loadCustomImageMap[i]])
        {
            this.loadCustomImageMap.splice(i, 1);
            i--;
            _new_len--;
            continue;
        }
        ++_count;
    }

    if (_count > 0)
    {
        this.EndActionLoadImages = 2;
        this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
    }

    this.ImageLoader.LoadDocumentImages(this.loadCustomImageMap, false);
}
asc_docs_api.prototype.SyncLoadImages_callback = function()
{
    this.WordControl.OnRePaintAttack();
}

asc_docs_api.prototype.pre_SaveCallback = function()
{
    CollaborativeEditing.OnEnd_Load_Objects();

    if (this.isApplyChangesOnOpen)
    {
        this.isApplyChangesOnOpen = false;
        this.OpenDocumentEndCallback();
    }
}

asc_docs_api.prototype.initEvents2MobileAdvances = function()
{
    //this.WordControl.initEvents2MobileAdvances();
}
asc_docs_api.prototype.ViewScrollToX = function(x)
{
    this.WordControl.m_oScrollHorApi.scrollToX(x);
}
asc_docs_api.prototype.ViewScrollToY = function(y)
{
    this.WordControl.m_oScrollVerApi.scrollToY(y);
}
asc_docs_api.prototype.GetDocWidthPx = function()
{
    return this.WordControl.m_dDocumentWidth;
}
asc_docs_api.prototype.GetDocHeightPx = function()
{
    return this.WordControl.m_dDocumentHeight;
}
asc_docs_api.prototype.ClearSearch = function()
{
    return this.WordControl.m_oDrawingDocument.EndSearch(true);
}
asc_docs_api.prototype.GetCurrentVisiblePage = function()
{
    var lPage1 = this.WordControl.m_oDrawingDocument.m_lDrawingFirst;
    var lPage2 = lPage1 + 1;

    if (lPage2 > this.WordControl.m_oDrawingDocument.m_lDrawingEnd)
        return lPage1;

    var lWindHeight = this.WordControl.m_oEditor.HtmlElement.height;
    var arPages = this.WordControl.m_oDrawingDocument.m_arrPages;

    var dist1 = arPages[lPage1].drawingPage.bottom;
    var dist2 = lWindHeight - arPages[lPage2].drawingPage.top;

    if (dist1 > dist2)
        return lPage1;

    return lPage2;
};

// Выставление интервала автосохранения (0 - означает, что автосохранения нет)
asc_docs_api.prototype.asc_setAutoSaveGap = function (autoSaveGap) {
	if (typeof autoSaveGap === "number") {
		this.autoSaveGap = autoSaveGap * 1000; // Нам выставляют в секундах
		this.autoSaveInit();
	}
};

asc_docs_api.prototype.asc_SetDocumentPlaceChangedEnabled = function(bEnabled)
{
    if (this.WordControl)
        this.WordControl.m_bDocumentPlaceChangedEnabled = bEnabled;
}

asc_docs_api.prototype.asc_SetViewRulers = function(bRulers)
{
    //if (false === this.bInit_word_control || true === this.isViewMode)
    //    return;

    if (this.WordControl.m_bIsRuler != bRulers)
    {
        this.WordControl.m_bIsRuler = bRulers;
        this.WordControl.checkNeedRules();
        this.WordControl.OnResize(true);
    }
}
asc_docs_api.prototype.asc_SetViewRulersChange = function()
{
    //if (false === this.bInit_word_control || true === this.isViewMode)
    //    return;

    this.WordControl.m_bIsRuler = !this.WordControl.m_bIsRuler;
    this.WordControl.checkNeedRules();
    this.WordControl.OnResize(true);
    return this.WordControl.m_bIsRuler;
}
asc_docs_api.prototype.asc_GetViewRulers = function()
{
    return this.WordControl.m_bIsRuler;
}

asc_docs_api.prototype.SetMobileVersion = function(val)
{
    this.isMobileVersion = val;
    if (this.isMobileVersion)
    {
        this.WordControl.bIsRetinaSupport = false; // ipad имеет проблемы с большими картинками
        this.WordControl.bIsRetinaNoSupportAttack = true;
        this.WordControl.m_bIsRuler = false;
		this.ShowParaMarks = false;

        this.SetFontRenderingMode(1);
    }
};

asc_docs_api.prototype.GoToHeader = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.Button = 0;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, 0, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, 0, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseMove(global_mouseEvent, 0, 0, pageNumber);

    this.WordControl.m_oLogicDocument.Cursor_MoveLeft();
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

    global_mouseEvent.ClickCount = oldClickCount;
}

asc_docs_api.prototype.GoToFooter = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.Button = 0;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseMove(global_mouseEvent, 0, 0, pageNumber);

    this.WordControl.m_oLogicDocument.Cursor_MoveLeft();
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

    global_mouseEvent.ClickCount = oldClickCount;
}

asc_docs_api.prototype.ExitHeader_Footer = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height / 2, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height / 2, pageNumber);

    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

    global_mouseEvent.ClickCount = oldClickCount;
}

asc_docs_api.prototype.GetCurrentPixOffsetY = function()
{
    return this.WordControl.m_dScrollY;
}

asc_docs_api.prototype.SetPaintFormat = function(value)
{
    this.isPaintFormat = value;
    this.WordControl.m_oLogicDocument.Document_Format_Copy();
}

asc_docs_api.prototype.ChangeShapeType = function(value)
{
    this.ImgApply(new CImgProperty({ShapeProperties:{type:value}}));
}

asc_docs_api.prototype.sync_PaintFormatCallback = function(value)
{
    this.isPaintFormat = value;
    return this.asc_fireCallback("asc_onPaintFormatChanged", value);
}
asc_docs_api.prototype.SetMarkerFormat = function(value, is_flag, r, g, b)
{
    this.isMarkerFormat = value;

    if (this.isMarkerFormat)
    {
        this.WordControl.m_oLogicDocument.Paragraph_SetHighlight(is_flag, r, g, b);
        this.WordControl.m_oLogicDocument.Document_Format_Copy();
    }
}

asc_docs_api.prototype.sync_MarkerFormatCallback = function(value)
{
    this.isMarkerFormat = value;
    return this.asc_fireCallback("asc_onMarkerFormatChanged", value);
}

asc_docs_api.prototype.StartAddShape = function(sPreset, is_apply)
{
    this.isStartAddShape = true;
    this.addShapePreset = sPreset;
    if (is_apply)
    {
        this.WordControl.m_oDrawingDocument.LockCursorType("crosshair");
    }
    else
    {
        editor.sync_EndAddShape();
        editor.sync_StartAddShapeCallback(false);
    }
}

asc_docs_api.prototype.sync_StartAddShapeCallback = function(value)
{
    this.isStartAddShape = value;
    return this.asc_fireCallback("asc_onStartAddShapeChanged", value);
}

asc_docs_api.prototype.CanGroup = function()
{
    return this.WordControl.m_oLogicDocument.CanGroup();
}

asc_docs_api.prototype.CanUnGroup = function()
{
    return this.WordControl.m_oLogicDocument.CanUnGroup();
}

asc_docs_api.prototype.CanChangeWrapPolygon = function()
{
    return this.WordControl.m_oLogicDocument.CanChangeWrapPolygon();
}

asc_docs_api.prototype.StartChangeWrapPolygon = function()
{
    return this.WordControl.m_oLogicDocument.StartChangeWrapPolygon();
}


asc_docs_api.prototype.ClearFormating = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Paragraph_ClearFormatting();
    }
}

asc_docs_api.prototype.GetSectionInfo = function()
{
    var obj = new CAscSection();
        
    // TODO: Переделать данную функцию, если она вообще нужна
    obj.PageWidth    = 297;
    obj.PageHeight   = 210;

    obj.MarginLeft   = 30;
    obj.MarginRight  = 15;
    obj.MarginTop    = 20;
    obj.MarginBottom = 20;

    return obj;
}

asc_docs_api.prototype.SetViewMode = function( isViewMode )
{
    if (isViewMode)
    {
        this.isViewMode = true;
        this.ShowParaMarks = false;
        //this.isShowTableEmptyLine = false;
        //this.WordControl.m_bIsRuler = true;
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.HideRulers();
    }
    else
    {
        if (this.bInit_word_control === true && this.FontLoader.embedded_cut_manager.bIsCutFontsUse)
        {
            this.isLoadNoCutFonts = true;
            this.FontLoader.embedded_cut_manager.bIsCutFontsUse = false;
            this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, true);
            return;
        }

        if ( this.bInit_word_control === true )
        {
            CollaborativeEditing.Apply_Changes();
            CollaborativeEditing.Release_Locks();
        }

        this.isUseEmbeddedCutFonts = false;

        this.isViewMode = false;
        //this.WordControl.m_bIsRuler = true;
        this.WordControl.checkNeedRules();
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.OnResize(true);
    }
}

asc_docs_api.prototype.SetUseEmbeddedCutFonts = function(bUse)
{
    this.isUseEmbeddedCutFonts = bUse;
}

asc_docs_api.prototype.IsNeedDefaultFonts = function()
{
    if (this.WordControl.m_oLogicDocument != null)
        return true;
    return false;
}

asc_docs_api.prototype.OnMouseUp = function(x, y)
{
    this.WordControl.onMouseUpExternal(x, y);
}
asc_docs_api.prototype.OnHandleMessage = function(event)
{
	if (null != event && null != event.data)
    {
        try
        {
            var data = JSON.parse(event.data);
            if(null != data && null != data["type"])
            {
                if(PostMessageType.UploadImage == data["type"])
                {
                    editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
                    if(c_oAscServerError.NoError == data["error"])
					{
						var urls = data["urls"];
						if(urls && urls.length > 0)
							this.AddImageUrl(urls[0]);
					}
                    else
                        this.sync_ErrorCallback(_mapAscServerErrorToAscError(data["error"]), c_oAscError.Level.NoCritical);
                }
            }
        }
        catch (err)
        {
        }
	}
}
asc_docs_api.prototype.asyncImageEndLoaded2 = null;

asc_docs_api.prototype.OfflineAppDocumentStartLoad = function()
{
	if (undefined != window['qtDocBridge'])
    {
        // native QT code
        window['qtDocBridge']['documentLoadStart'] ();
    }
	
    var scriptElem = document.createElement('script');

    if (scriptElem.readyState && false)
    {
        scriptElem.onreadystatechange = function () {
            if (this.readyState == 'complete' || this.readyState == 'loaded')
            {
                scriptElem.onreadystatechange = null;
                setTimeout(editor.OfflineAppDocumentEndLoad, 0);
            }
        }
    }
    scriptElem.onload = scriptElem.onerror = this.OfflineAppDocumentEndLoad;

    scriptElem.setAttribute('src',documentUrl + "editor.js");
    scriptElem.setAttribute('type','text/javascript');
    document.getElementsByTagName('head')[0].appendChild(scriptElem);
}

asc_docs_api.prototype.OfflineAppDocumentEndLoad = function()
{
	if (undefined != window['qtDocBridge'])
    {
        // native QT code
        window['qtDocBridge']['documentLoadEnd'] ();
    }
	
    if (undefined == window["editor_bin"])
        return;

    var bIsViewer = false;
    if(window["editor_bin"].length > 0)
    {
        if(c_oSerFormat.Signature != window["editor_bin"].substring(0, c_oSerFormat.Signature.length))
            bIsViewer = true;
    }
    if(true == bIsViewer)
        editor.OpenDocument(documentUrl, window["editor_bin"]);
    else
        editor.OpenDocument2(documentUrl, window["editor_bin"]);
}

asc_docs_api.prototype.SetDrawImagePlaceParagraph = function(element_id, props)
{
    this.WordControl.m_oDrawingDocument.InitGuiCanvasTextProps(element_id);
    this.WordControl.m_oDrawingDocument.DrawGuiCanvasTextProps(props);
}

asc_docs_api.prototype.asc_setCoAuthoringEnable = function (isCoAuthoringEnable)
{
	this.isCoAuthoringEnable = !!isCoAuthoringEnable;
}

asc_docs_api.prototype.asc_getMasterCommentId = function()
{
    return -1;
}

asc_docs_api.prototype.asc_getAnchorPosition = function()
{
    var AnchorPos = this.WordControl.m_oLogicDocument.Get_SelectionAnchorPos();    
    return new asc_CRect(AnchorPos.X0, AnchorPos.Y, AnchorPos.X1 - AnchorPos.X0, 0);
}

var cCharDelimiter = String.fromCharCode(5);

function getURLParameter(name) {
    return (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
}

function spellCheck (editor, rdata) {
	//console.log("start - " + rdata);
	// ToDo проверка на подключение
	switch (rdata.type) {
		case "spell":
		case "suggest":
			if (undefined != window['qtDocBridge'])
			{
				// push data to native QT code
				window['qtDocBridge']['spellCheck'] (JSON.stringify(rdata));
			}
			else
			{
				editor.SpellCheckApi.spellCheck(JSON.stringify(rdata));
			}
			
			break;
	}
}

function _onSpellCheck_Callback2 (response)
{
	var incomeObject = JSON.parse(response);
	SpellCheck_CallBack(incomeObject);
}

/*function spellCheck (editor, fCallback, rdata){
	asc_ajax({
        type: 'POST',
        url: g_sSpellCheckServiceLocalUrl,
        data: rdata,
        error: function(jqXHR, textStatus, errorThrown){
				editor.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);
				if(fCallback)
					fCallback();
            },
        success: function(msg){
			var incomeObject = JSON.parse(msg);
			switch(incomeObject.type){
                case "spell":
					if(fCallback)
                        fCallback(incomeObject);
                break;
				case "synonym":
					if(fCallback)
                        fCallback(incomeObject);
                break;
				case "suggest":
					if(fCallback)
                        fCallback(incomeObject);
                break;
                case "err":
					editor.asc_fireCallback("asc_onError", _mapAscServerErrorToAscError(parseInt(incomeObject.data)), c_oAscError.Level.Critical);
					if(fCallback)
						fCallback(incomeObject);
                break;
            }
		}
	})
};*/
function sendCommand(editor, fCallback, rdata){
	var sData;
	//json не должен превышать размера g_nMaxJsonLength, иначе при его чтении будет exception
	if(null != rdata["data"] && "string" === typeof(rdata["data"]) && rdata["data"].length > g_nMaxJsonLengthChecked)
	{
		var sTemp = rdata["data"];
		rdata["data"] = null;
		sData = "mnuSaveAs" + cCharDelimiter + JSON.stringify(rdata) + cCharDelimiter + sTemp;
	}
	else
		sData = JSON.stringify(rdata);
	asc_ajax({
        type: 'POST',
        url: g_sMainServiceLocalUrl,
        data: sData,
        error: function(jqXHR, textStatus, errorThrown){
				editor.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);
				if(fCallback)
					fCallback();
            },
        success: function(msg){
			var incomeObject = JSON.parse(msg);
			switch (incomeObject["type"]) {
			    case "updateversion":
			    case "open":
			        if ("updateversion" == incomeObject["type"])
			            editor.SetViewMode(true);
                    var sJsonUrl = g_sResourceServiceLocalUrl + incomeObject["data"];
					asc_ajax({
						url: sJsonUrl,
						dataType: "text",
						success: function(result, textStatus) {
							//получаем url к папке с файлом
							var url;
							var nIndex = sJsonUrl.lastIndexOf("/");
							if(-1 != nIndex)
								url = sJsonUrl.substring(0, nIndex + 1);
							else
								url = sJsonUrl;
							var bIsViewer = false;
							if(result.length > 0)
							{
								if(c_oSerFormat.Signature != result.substring(0, c_oSerFormat.Signature.length))
									bIsViewer = true;
							}
							if(true == bIsViewer)
								editor.OpenDocument(url, result);
							else
								editor.OpenDocument2(url, result);
							if(fCallback)
								fCallback(incomeObject);
						},
						error:function(){
							editor.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);
							if(fCallback)
								fCallback();
						}
					});
                break;
				case "needparams":
					//todo dialog
					var rData = {
						"id":documentId,
						"userid": documentUserId,
						"format": documentFormat,
						"vkey": documentVKey,
						"editorid": c_oEditorId.Word,
						"c":"reopen",
						"url": documentUrl,
						"title": documentTitle,
						"codepage": documentFormatSaveTxtCodepage,
						"embeddedfonts": editor.isUseEmbeddedCutFonts};
						
                    sendCommand(editor, fCallback,  rData)
                break;
                case "waitopen":
                    if (incomeObject["data"])
                    {
                        editor._lastConvertProgress = incomeObject["data"] / 2;
                        editor.sync_SendProgress(editor._lastConvertProgress);
                    }
					var rData = {
						"id": documentId,
						"userid": documentUserId,
						"format": documentFormat,
						"vkey": documentVKey,
						"editorid": c_oEditorId.Word,
						"c": "chopen"};
						
                    setTimeout( function(){sendCommand(editor, fCallback,  rData)}, 3000);
                break;
				case "changes":
					//var rData = {"id":documentId, "c":"sfc", "outputformat": c_oAscFileType.DOCX};
					//sendCommand(editor, fCallback,  rData);
					if(fCallback)
						fCallback(incomeObject);

					// Важно: потом сверху этот эвент придти не должен (т.е. мы не отправляем ссылку на документ наверх)
					editor.asc_OnSaveEnd(/*isDocumentSaved*/true);
				break;
                case "save":
					if(fCallback)
						fCallback(incomeObject);
                break;
                case "waitsave":
				{
					var rData = {
						"id":documentId,
						"userid": documentUserId,
						"vkey": documentVKey,
						"title": documentTitleWithoutExtention,
						"c": "chsave",
						"data": incomeObject["data"]};

                    setTimeout( function(){sendCommand(editor, fCallback, rData)}, 3000);
				}
                break;
				case "savepart":
					var outputData = JSON.parse(incomeObject["data"]);
                    _downloadAs(editor, outputData["format"], fCallback, false, outputData["savekey"]);
                break;
				case "getsettings":
					if(fCallback)
                        fCallback(incomeObject);
				break;
                case "err":
					var nErrorLevel = c_oAscError.Level.NoCritical;
					//todo передалеть работу с callback
					if("getsettings" == rdata["c"] || "open" == rdata["c"] || "chopen" == rdata["c"] || "create" == rdata["c"])
						nErrorLevel = c_oAscError.Level.Critical;
					editor.asc_fireCallback("asc_onError", _mapAscServerErrorToAscError(parseInt(incomeObject["data"])), nErrorLevel);
					if(fCallback)
						fCallback(incomeObject);
                break;
				default:
					if(fCallback)
                        fCallback(incomeObject);
				break;
            }
		}
	})

	};
function sendTrack(fCallback, url, rdata){
	asc_ajax({
        type: 'POST',
        url: url,
        data: rdata,
        error: function(jqXHR, textStatus, errorThrown){
				if(fCallback)
					fCallback();
            },
        success: function(msg){
			var incomeObject = JSON.parse(msg);
			if(fCallback)
				fCallback(incomeObject);			
		}
	})
};
function _downloadAs(editor, filetype, fCallback, bStart, sSaveKey)
{
	var sData;
	var oAdditionalData = {};
	oAdditionalData["c"] = "save";
	oAdditionalData["id"] = documentId;
	oAdditionalData["userid"] = documentUserId;
	oAdditionalData["vkey"] = documentVKey;
	oAdditionalData["outputformat"] = filetype;
	if(null != sSaveKey)
		oAdditionalData["savekey"] = sSaveKey;
	if(c_oAscFileType.PDF == filetype)
	{
		var dd = editor.WordControl.m_oDrawingDocument;
		if(dd.isComleteRenderer2())
		{
			if(false == bStart)
				oAdditionalData["savetype"] = "complete";
			else
				oAdditionalData["savetype"] = "completeall";
		}
		else
		{
			if(false == bStart)
				oAdditionalData["savetype"] = "part";
			else
				oAdditionalData["savetype"] = "partstart";
		}
		oAdditionalData["data"] = dd.ToRendererPart();
		sendCommand(editor, fCallback, oAdditionalData);
	}
	else
	{
		var oBinaryFileWriter = new BinaryFileWriter(editor.WordControl.m_oLogicDocument);
		oAdditionalData["savetype"] = "completeall";
		oAdditionalData["data"] = oBinaryFileWriter.Write();
		sendCommand(editor, fCallback, oAdditionalData);
	}
};

function _addImageUrl2 (url)
{
	editor.AddImageUrl2 (url);
}
function _isDocumentModified2 ()
{
	return editor.isDocumentModified();
}
function _asc_Save2 ()
{
	editor.asc_Save();
}
function _asc_SavingEnd ()
{
	editor.asc_OnSaveEnd(true);
}
function  _asc_scrollTo (x,y)
{
	editor.WordControl.m_oScrollHorApi.scrollToX(x);
	editor.WordControl.m_oScrollVerApi.scrollToY(y);
}
function _getFullImageSrc(src)
{
    if (window["NATIVE_EDITOR_ENJINE"])
        return src;
    
  	var start = src.substring(0, 6);
    if(0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:"))
    {
        if (0 == src.indexOf(editor.DocumentUrl))
            return src;
        return editor.DocumentUrl + "media/" + src;
    }
	else
		return src;
};
function _mapAscServerErrorToAscError(nServerError)
{
	var nRes = c_oAscError.ID.Unknown;
	switch(nServerError)
	{
		case c_oAscServerError.NoError : nRes = c_oAscError.ID.No;break;
		case c_oAscServerError.TaskQueue :
		case c_oAscServerError.TaskResult : nRes = c_oAscError.ID.Database;break;
		case c_oAscServerError.ConvertDownload : nRes = c_oAscError.ID.DownloadError;break;
		case c_oAscServerError.ConvertTimeout : nRes = c_oAscError.ID.ConvertationTimeout;break;
		case c_oAscServerError.ConvertMS_OFFCRYPTO : nRes = c_oAscError.ID.ConvertationPassword;break;
		case c_oAscServerError.ConvertUnknownFormat :
		case c_oAscServerError.ConvertReadFile :
		case c_oAscServerError.Convert : nRes = c_oAscError.ID.ConvertationError;break;
		case c_oAscServerError.UploadContentLength : nRes = c_oAscError.ID.UplImageSize;break;
		case c_oAscServerError.UploadExtension : nRes = c_oAscError.ID.UplImageExt;break;
		case c_oAscServerError.UploadCountFiles : nRes = c_oAscError.ID.UplImageFileCount;break;
		case c_oAscServerError.VKey : nRes = c_oAscError.ID.FileVKey;break;
		case c_oAscServerError.VKeyEncrypt : nRes = c_oAscError.ID.VKeyEncrypt;break;
		case c_oAscServerError.VKeyKeyExpire : nRes = c_oAscError.ID.KeyExpire;break;
		case c_oAscServerError.VKeyUserCountExceed : nRes = c_oAscError.ID.UserCountExceed;break;
		case c_oAscServerError.Storage :
		case c_oAscServerError.StorageFileNoFound :
		case c_oAscServerError.StorageRead :
		case c_oAscServerError.StorageWrite :
		case c_oAscServerError.StorageRemoveDir :
		case c_oAscServerError.StorageCreateDir :
		case c_oAscServerError.StorageGetInfo :
		case c_oAscServerError.Upload :
		case c_oAscServerError.ReadRequestStream :
		case c_oAscServerError.Unknown : nRes = c_oAscError.ID.Unknown;break;
	}
	return nRes;
}

function asc_ajax(obj){
	var url = "", type = "GET", 
		async = true, data = null, dataType = "text/xml", 
		error = null, success = null, httpRequest = null,

	init = function (obj){
	
		if ( typeof (obj.url) != 'undefined' ){
			url = obj.url;
		}
		if ( typeof (obj.type) != 'undefined' ){
			type = obj.type;
		}
		if ( typeof (obj.async) != 'undefined' ){
			async = obj.async;
		}		
		if ( typeof (obj.data) != 'undefined' ){
			data = obj.data;
		}		
		if ( typeof (obj.dataType) != 'undefined' ){
			dataType = obj.dataType;
		}		
		if ( typeof (obj.error) != 'undefined' ){
			error = obj.error;
		}		
		if ( typeof (obj.success) != 'undefined' ){
			success = obj.success;
		}

		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
			httpRequest = new XMLHttpRequest();
			if (httpRequest.overrideMimeType) {
				httpRequest.overrideMimeType(dataType);
			}
		} 
		else if (window.ActiveXObject) { // IE
			try {
				httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} 
			catch (e) {
				try {
					httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} 
				catch (e) {}
			}
		}
			
		httpRequest.onreadystatechange = function(){
			respons(this); 
		};
		send();
	},
	
	send = function(){
		httpRequest.open(type, url, async);
		if (type === "POST")
			httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpRequest.send(data);
	},
	
	respons = function(httpRequest){
		switch (httpRequest.readyState)
		{
			case 0:
				// The object has been created, but not initialized (the open method has not been called).
				break;
			case 1:
				// A request has been opened, but the send method has not been called.
				break;
			case 2:
				// The send method has been called. No data is available yet.
				break;
			case 3:
				// Some data has been received; however, neither responseText nor responseBody is available.
				break;
			case 4:
				if (httpRequest.status == 200 || httpRequest.status == 1223) {
					if (typeof success === "function")
						success(httpRequest.responseText);
				} else {
					if (typeof error === "function")
						error(httpRequest,httpRequest.statusText,httpRequest.status);
				}
				break;
		}
	};
	
	init(obj);
}

function CErrorData()
{
    this.Value = 0;
}

CErrorData.prototype.put_Value = function(v){ this.Value = v; };
CErrorData.prototype.get_Value = function() { return this.Value; };
//test

// Вставка диаграмм
asc_docs_api.prototype.asc_getChartObject = function(type, subtype)
{	
	this.isChartEditor = true;		// Для совместного редактирования


    return this.WordControl.m_oLogicDocument.Get_ChartObject(type, subtype);
}

asc_docs_api.prototype.asc_addChartDrawingObject = function(options)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        History.Create_NewPoint();
        this.WordControl.m_oLogicDocument.Add_InlineImage( null, null, null, options );
    }
}

asc_docs_api.prototype.asc_editChartDrawingObject = function(chartBinary)
{
    /**/
	
	// Находим выделенную диаграмму и накатываем бинарник
	if ( isObject(chartBinary) )
	{
		var binary = chartBinary["binary"];
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            History.Create_NewPoint();
            this.WordControl.m_oLogicDocument.Edit_Chart(binary);
        }
	}
}

asc_docs_api.prototype.asc_getChartPreviews = function(chartType, chartSubType)
{
	if ( this.chartPreviewManager.isReady() ) {
		return this.chartPreviewManager.getChartPreviews(chartType, chartSubType);
	}
}

asc_docs_api.prototype.sync_closeChartEditor = function()
{
    this.asc_fireCallback("asc_onCloseChartEditor");
}

asc_docs_api.prototype.asc_setDrawCollaborationMarks = function (bDraw)
{
    if ( bDraw !== this.isCoMarksDraw )
    {
        this.isCoMarksDraw = bDraw;
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.m_oDrawingDocument.FirePaint();
    }
}

asc_docs_api.prototype.asc_AddMath = function(Type)
{
    var loader = window.g_font_loader;
    var nIndex = loader.map_font_index["Cambria Math"];
    var fontinfo = loader.fontInfos[nIndex];
    var isasync = loader.LoadFont(fontinfo);
    if (false === isasync)
    {
        return this.asc_AddMath2(Type);
    }
    else
    {
        this.FontAsyncLoadType = 1;
        this.FontAsyncLoadParam = Type;
    }
}

asc_docs_api.prototype.asc_AddMath2 = function(Type)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();

        var bAddMenu = true;
		var MathElement = new ParaMath(bAddMenu);		
		var props = {};
		var oFName;
		switch (Type)
		{
			case 1: 	var oFraction = new CFraction();						
						MathElement.CreateFraction(oFraction, MathElement.Math.Root, props, null, null);
						oFraction.fillPlaceholders();
						break;
			case 2: 	props = {type:SKEWED_FRACTION};
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, MathElement.Math.Root, props, null, null);
						oFraction.fillPlaceholders();
						break;
			case 3: 	props = {type:LINEAR_FRACTION};
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, MathElement.Math.Root, props, null, null);
						oFraction.fillPlaceholders();
						break;
			case 4: 	var oBox = new CBox();
						MathElement.CreateElem(oBox, MathElement.Math.Root, props)
						
						var oElem = oBox.getBase();
						//здесь выставляем для oElem argPr.argSz=-1; этой обертки нет
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, oElem, props, null, null);
						oFraction.fillPlaceholders();
						break;
			case 5: 	var oFraction = new CFraction();
						var sNum = "dx";
						var sDen = "dy";
						MathElement.CreateFraction(oFraction,MathElement.Math.Root, props, sNum, sDen);
						break;
			case 6: 	var sNum = String.fromCharCode(916) + "y";
						var sDen = String.fromCharCode(916) + "x";
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, MathElement.Math.Root, props, sNum, sDen);
						break;
			case 7: 	var sNum = String.fromCharCode(8706) + "y";
						var sDen = String.fromCharCode(8706) + "x";
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, MathElement.Math.Root, props, sNum, sDen);
						break;
			case 8: 	var sNum = String.fromCharCode(948) + "y";
						var sDen = String.fromCharCode(948) + "x";
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, MathElement.Math.Root, props, sNum, sDen);
						break;
			case 9: 	var sNum = String.fromCharCode(960);
						var sDen = "2";
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, MathElement.Math.Root, props, sNum, sDen);
						break;
			case 10:	props = {type:DEGREE_SUPERSCRIPT};
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, MathElement.Math.Root, props, null, null, null);
						oDegree.fillPlaceholders();
						break;
			case 11:	props = {type:DEGREE_SUBSCRIPT};
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, MathElement.Math.Root, props, null, null, null);
						oDegree.fillPlaceholders();
						break;
			case 12:	props = {type:DEGREE_SubSup};
						var oDegree = new CDegreeSubSup();
						MathElement.CreateDegree(oDegree, MathElement.Math.Root, props, null, null, null);
						var oSub = oDegree.getLowerIterator();
						oSub.fillPlaceholders();
						var oSup = oDegree.getUpperIterator();
						oSup.fillPlaceholders();
						var oElem = oDegree.getBase();
						oElem.fillPlaceholders();
						break;
			case 13:	props = {type:DEGREE_PreSubSup};
						var oDegree = new CDegreeSubSup();
						MathElement.CreateDegree(oDegree, MathElement.Math.Root, props, null, null, null);
						var oSub = oDegree.getLowerIterator();
						oSub.fillPlaceholders();
						var oSup = oDegree.getUpperIterator();
						oSup.fillPlaceholders();
						var oElem = oDegree.getBase();
						oElem.fillPlaceholders();
						break;
			case 14:	props = {type:DEGREE_SUBSCRIPT};			
						var oDegree = new CDegree();
						MathElement.CreateElem(oDegree, MathElement.Math.Root, props)
						
						var oElem = oDegree.getBase();
						MathElement.AddText(oElem, "x");						
						var oSub = oDegree.getLowerIterator();						
						props = {type:DEGREE_SUPERSCRIPT};	
						var sBase = "y"
						var sSup = "2"						
						var oDegree1 = new CDegree();
						MathElement.CreateDegree(oDegree1, oSub, props, sBase, sSup, null);
						break;
			case 15:	props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "e";
						var sSup = "-i" + String.fromCharCode(969) + "t";						
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, MathElement.Math.Root, props, sBase, sSup, null);
						break;
			case 16:	props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "x";
						var sSup = "2";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, MathElement.Math.Root, props, sBase, sSup, null);
						break;
			case 17:	props = {type:DEGREE_PreSubSup};
						var sBase = "Y";
						var sSup = "n";
						var sSub = "1";						
						var oDegreeSubSup = new CDegreeSubSup();
						MathElement.CreateDegree(oDegreeSubSup, MathElement.Math.Root, props, sBase, sSup, sSub);
						break;
			case 18:	props = {type:SQUARE_RADICAL, degHede:true};					
						var oRadical = new CRadical();
						MathElement.CreateRadical(oRadical, MathElement.Math.Root, props, null, null);
						oRadical.fillPlaceholders();
						break;
			case 19:	props = {type:DEGREE_RADICAL};					
						var oRadical = new CRadical();
						MathElement.CreateRadical(oRadical, MathElement.Math.Root, props, null, null);
						oRadical.fillPlaceholders();
						break;
			case 20:	props = {type:DEGREE_RADICAL};
						var sDeg = "2";						
						var oRadical = new CRadical();
						MathElement.CreateRadical(oRadical, MathElement.Math.Root, props, null, sDeg);
						var oElem = oRadical.getBase();
						oElem.fillPlaceholders();
						break;
			case 21:	props = {type:DEGREE_RADICAL};
						var sDeg = "3";						
						var oRadical = new CRadical();
						MathElement.CreateRadical(oRadical, MathElement.Math.Root, props, null, sDeg);
						var oElem = oRadical.getBase();
						oElem.fillPlaceholders();
						break;
			case 22:	var oFraction = new CFraction();						
						MathElement.CreateElem(oFraction, MathElement.Math.Root, props);
						
						var oElemNum = oFraction.getNumerator();
						var sText = "-b" + String.fromCharCode(177);
						MathElement.AddText(oElemNum, sText);
						
						props = {type:DEGREE_RADICAL, degHede:true};
						var oRadical = new CRadical();
						MathElement.CreateElem(oRadical, oElemNum, props);						
						var oElem = oRadical.getBase();
						
						props = {type:DEGREE_SUPERSCRIPT};
						var oDegree = new CDegree();
						MathElement.CreateElem(oDegree, oElem, props);						
						var oDegElem = oDegree.getBase();
						MathElement.AddText(oDegElem, "b");
						var oDegSup = oDegree.getUpperIterator();
						MathElement.AddText(oDegSup, "2");
						
						MathElement.AddText(oElem, "-4ac");					
						
						var oElemDen = oFraction.getDenominator();
						MathElement.AddText(oElemDen, "2a");												
						break;
			case 23:	props = {type:SQUARE_RADICAL, degHede:true};
						var oRadical = new CRadical();
						MathElement.CreateElem(oRadical, MathElement.Math.Root, props);
						
						var oElem = oRadical.getBase();
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "a";
						var sSup = "2";
						var oDegree1 = new CDegree();
						MathElement.CreateDegree(oDegree1, oElem, props, sBase, sSup, null);
						
						MathElement.AddText(oElem, "+");
						
						props = {type:DEGREE_SUPERSCRIPT};
						sBase = "b";
						sSup = "2";
						var oDegree2 = new CDegree();
						MathElement.CreateDegree(oDegree2, oElem, props, sBase, sSup, null);						
						break;
			case 24:	props = {limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 25:	props = {limLoc:NARY_SubSup};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 26:	props = {limLoc:NARY_UndOvr};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 27:	var sVal = String.fromCharCode(8748);
						props = {limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 28:	var sVal = String.fromCharCode(8748);
						props = {limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 29:	var sVal = String.fromCharCode(8748);
						props = {limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 30:	var sVal = String.fromCharCode(8749);
						props = {limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 31:	var sVal = String.fromCharCode(8749);
						props = {limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 32:	var sVal = String.fromCharCode(8749);
						props = {limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 33:	var sVal = String.fromCharCode(8750);
						props = {limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 34:	var sVal = String.fromCharCode(8750);
						props = {limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 35:	var sVal = String.fromCharCode(8750);
						props = {limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 36:	var sVal = String.fromCharCode(8751);
						props = {limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 37:	var sVal = String.fromCharCode(8751);
						props = {limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 38:	var sVal = String.fromCharCode(8751);
						props = {limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 39:	var sVal = String.fromCharCode(8752);
						props = {limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 40:	var sVal = String.fromCharCode(8752);
						props = {limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 41:	var sVal = String.fromCharCode(8752);
						props = {limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 42:	props = {diff:1};
						var sVal = "dx";
						var oBox = new CBox();
						MathElement.CreateBox(oBox,MathElement.Math.Root,props,sVal);
						break;
			case 43:	props = {diff:1};
						var sVal = "dy";
						var oBox = new CBox();
						MathElement.CreateBox(oBox,MathElement.Math.Root,props,sVal);
						break;
			case 44:	props = {diff:1};
						var sVal = "d" + String.fromCharCode(952);
						var oBox = new CBox();
						MathElement.CreateBox(oBox,MathElement.Math.Root,props,sVal);
						break;
			case 45:	var sChar = String.fromCharCode(8721);
						props = {chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 46:	var sChar = String.fromCharCode(8721);
						props = {chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 47:	var sChar = String.fromCharCode(8721);
						props = {chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 48:	var sChar = String.fromCharCode(8721);
						props = {chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 49:	var sChar = String.fromCharCode(8721);
						props = {chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 50:	var sChar = String.fromCharCode(8719);
						props = {chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 51:	var sChar = String.fromCharCode(8719);
						props = {chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 52:	var sChar = String.fromCharCode(8719);
						props = {chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 53:	var sChar = String.fromCharCode(8719);
						props = {chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 54:	var sChar = String.fromCharCode(8719);
						props = {chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 55:	var sChar = String.fromCharCode(8720);
						props = {chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 56:	var sChar = String.fromCharCode(8720);
						props = {chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 57:	var sChar = String.fromCharCode(8720);
						props = {chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 58:	var sChar = String.fromCharCode(8720);
						props = {chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 59:	var sChar = String.fromCharCode(8720);
						props = {chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 60:	var sChar = String.fromCharCode(8899);
						props = {chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 61:	var sChar = String.fromCharCode(8899);
						props = {chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 62:	var sChar = String.fromCharCode(8899);
						props = {chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 63:	var sChar = String.fromCharCode(8899);
						props = {chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 64:	var sChar = String.fromCharCode(8899);
						props = {chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 65:	var sChar = String.fromCharCode(8898);
						props = {chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 66:	var sChar = String.fromCharCode(8898);
						props = {chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 67:	var sChar = String.fromCharCode(8898);
						props = {chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 68:	var sChar = String.fromCharCode(8898);
						props = {chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 69:	var sChar = String.fromCharCode(8898);
						props = {chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 70:	var sChar = String.fromCharCode(8897);
						props = {chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 71:	var sChar = String.fromCharCode(8897);
						props = {chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 72:	var sChar = String.fromCharCode(8897);
						props = {chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 73:	var sChar = String.fromCharCode(8897);
						props = {chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 74:	var sChar = String.fromCharCode(8897);
						props = {chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 75:	var sChar = String.fromCharCode(8896);
						props = {chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 76:	var sChar = String.fromCharCode(8896);
						props = {chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 77:	var sChar = String.fromCharCode(8896);
						props = {chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 78:	var sChar = String.fromCharCode(8896);
						props = {chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 79:	var sChar = String.fromCharCode(8896);
						props = {chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 80:	var sChar = String.fromCharCode(8721);
						props = {/*limLoc:NARY_UndOvr,*/ chr:sChar, supHide:true};
						var oNary = new CNary();
						MathElement.CreateElem(oNary,MathElement.Math.Root,props);
						var narySub = oNary.getLowerIterator();
						MathElement.AddText(narySub, "k");
						var naryBase = oNary.getBase();
						
						props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,naryBase,props);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {type:NO_BAR_FRACTION};
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, delimiterBase, props, "n", "k");
						break
			case 81:	var sChar = String.fromCharCode(8721);
						props = {chr:sChar/*, limLoc:NARY_UndOvr*/};
						var oNary = new CNary();
						MathElement.CreateNary(oNary,MathElement.Math.Root,props,null,"i=0","n");
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 82:	var sChar = String.fromCharCode(8721);
						props = {chr:sChar, /*limLoc:NARY_UndOvr,*/ supHide:true};
						var oNary = new CNary();
						MathElement.CreateElem(oNary,MathElement.Math.Root,props);
						var narySub = oNary.getLowerIterator();
						
						props = {row:2};
						var oEqArr = new CEqArray();
						MathElement.CreateElem(oEqArr, narySub, props);
						var eqarrElem0 = oEqArr.getElement(0);
						MathElement.AddText(eqarrElem0, "0≤ i ≤ m");
						var eqarrElem1 = oEqArr.getElement(1);
						MathElement.AddText(eqarrElem1, "0< j < n");

						var naryBase = oNary.getBase();
						MathElement.AddText(naryBase, "P");
						
						props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,naryBase,props);
						var delimiterBase = oDelimiter.getBase(0);
						MathElement.AddText(delimiterBase, "i,j");
						break;						
			case 83:	var sChar = String.fromCharCode(8719);
						props = {/*limLoc:NARY_UndOvr,*/ chr:sChar};
						var oNary = new CNary();
						MathElement.CreateElem(oNary, MathElement.Math.Root, props);
						var narySup = oNary.getUpperIterator();
						MathElement.AddText(narySup, "n");
						var narySub = oNary.getLowerIterator();
						MathElement.AddText(narySub, "k=1");
						var naryBase = oNary.getBase();
						
						props = {type:DEGREE_SUBSCRIPT};
						var oSSub = new CDegree();
						MathElement.CreateDegree(oSSub, naryBase, props, "A", null, "k");
						break;
			case 84:	var sChar = String.fromCharCode(8899);
						props = {chr:sChar/*, limLoc:NARY_UndOvr*/};
						var oNary = new CNary();
						MathElement.CreateElem(oNary,MathElement.Math.Root,props);
						
						var narySub = oNary.getLowerIterator();
						MathElement.AddText(narySub, "n=1");
						var narySup = oNary.getUpperIterator();
						MathElement.AddText(narySup, "m");
						var naryBase = oNary.getBase();
						
						props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,naryBase,props);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {type:DEGREE_SUBSCRIPT};
						var oSSub0 = new CDegree();
						MathElement.CreateDegree(oSSub0, delimiterBase, props, "X", null, "n"); 
						
						sChar = String.fromCharCode(8898);
						MathElement.AddText(delimiterBase, sChar);
						
						props = {type:DEGREE_SUBSCRIPT};
						var oSSub1 = new CDegree();
						MathElement.CreateDegree(oSSub1, delimiterBase, props, "Y", null, "n"); 					
						break;
			case 85:	props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 86:	props = {column:1, begChr:"[", endChr:"]"};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 87:	props = {column:1, begChr:"{", endChr:"}"};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 88:	var sBeg = String.fromCharCode(10216);
						var sEnd = String.fromCharCode(10217);
						props = {column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 89:	var sBeg = String.fromCharCode(9123);
						var sEnd = String.fromCharCode(9126);
						props = {column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 90:	var sBeg = String.fromCharCode(9121);
						var sEnd = String.fromCharCode(9124);
						props = {column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 91:	var sChr = String.fromCharCode(124);
						props = {column:1, begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 92:	var sChr = String.fromCharCode(8214);
						props = {column:1, begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 93:	var sChr = String.fromCharCode(91);
						props = {column:1, begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 94:	var sChr = String.fromCharCode(93);
						props = {column:1, begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 95:	props = {column:1, begChr:"]", endChr:"["};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 96:	var sBeg = String.fromCharCode(10214);
						var sEnd = String.fromCharCode(10215);						
						props = {column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 97:	props = {column:2};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 98:	props = {column:2, begChr:"{", endChr:"}"};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 99:	var sBeg = String.fromCharCode(10216);
						var sEnd = String.fromCharCode(10217);
						props = {column:2, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 100:	var sBeg = String.fromCharCode(10216);
						var sEnd = String.fromCharCode(10217);
						props = {column:3, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 101:	props = {column:1, endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 102:	props = {column:1, begChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 103:	props = {column:1, begChr:"[", endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 104:	props = {column:1, begChr:"", endChr:"]"};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 105:	props = {column:1, begChr:"{", endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 106:	props = {column:1, begChr:"", endChr:"}"};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 107:	var sBeg = String.fromCharCode(10216);
						props = {column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 108:	var sEnd = String.fromCharCode(10217);
						props = {column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 109:	var sBeg = String.fromCharCode(9123);
						props = {column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 110:	var sEnd = String.fromCharCode(9126);
						props = {column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 111:	var sBeg = String.fromCharCode(9121);
						props = {column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 112:	var sEnd = String.fromCharCode(9124);
						props = {column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 113:	var sBeg = String.fromCharCode(124);
						props = {column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 114:	var sEnd = String.fromCharCode(124);
						props = {column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 115:	var sBeg = String.fromCharCode(8214);
						props = {column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 116:	var sEnd = String.fromCharCode(8214);
						props = {column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 117:	var sBeg = String.fromCharCode(10214);
						props = {column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 118:	var sEnd = String.fromCharCode(10215);
						props = {column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						oDelimiter.fillPlaceholders();
						break;
			case 119:	props = {column:1, begChr:"{", endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var oElem = oDelimiter.getBase(0);
						
						props = {row:2};
						var oEqArr = new CEqArray();
						MathElement.CreateElem(oEqArr,oElem,props);
						oEqArr.fillPlaceholders();
						break;
			case 120:	props = {column:1, begChr:"{", endChr:""};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var oElem = oDelimiter.getBase(0);
						
						props = {row:3};
						var oEqArr = new CEqArray();						
						MathElement.CreateElem(oEqArr,oElem,props);
						oEqArr.fillPlaceholders();					
						break;
			case 121:	props = {type:NO_BAR_FRACTION};
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction, MathElement.Math.Root, props, null, null);
						oFraction.fillPlaceholders();
						break;
			case 122:	props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var oElem = oDelimiter.getBase(0);
						
						props = {type:NO_BAR_FRACTION};
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction,oElem,props,null,null);
						oFraction.fillPlaceholders();
						break;
			case 123:	MathElement.AddText(MathElement.Math.Root, "f");
						props = {column:1};
						var oDelimiter1 = new CDelimiter();
						MathElement.CreateElem(oDelimiter1,MathElement.Math.Root,props);
						var del1Elem = oDelimiter1.getBase(0);
						MathElement.AddText(del1Elem, "x");
						MathElement.AddText(MathElement.Math.Root, "=");
						
						props = {column:1, begChr:"{", endChr:""};
						var oDelimiter2 = new CDelimiter();
						MathElement.CreateElem(oDelimiter2,MathElement.Math.Root,props);
						var del2Elem = oDelimiter2.getBase(0);
						
						props = {row:2};
						var oEqArr = new CEqArray();
						MathElement.CreateElem(oEqArr, del2Elem, props);
						
						var eqArrElem0 = oEqArr.getElement(0);
						MathElement.AddText(eqArrElem0, "-x,&x<0");
						var eqArrElem0 = oEqArr.getElement(1);
						var sTxt = "x,&x" + String.fromCharCode(8805) + "0";
						MathElement.AddText(eqArrElem0,sTxt);
						break;
			case 124:	props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var oElem = oDelimiter.getBase(0);
						
						props = {type:NO_BAR_FRACTION};
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction,oElem,props,"n","k");
						break;
			case 125:	var sBeg = String.fromCharCode(10216);
						var sEnd = String.fromCharCode(10217);
						props = {column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var oElem = oDelimiter.getBase(0);
						
						props = {type:NO_BAR_FRACTION};
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction,oElem,props,"n","k");
						break;
			case 126:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();
						props = {sty:"p"};
						MathElement.AddText(oFName, "sin", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 127:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "cos", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 128:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "tan", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 129:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "csc", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 130:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "sec", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 131:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "cot", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 132:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "sin";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);	
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();						
						break;
			case 133:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "cos";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);	
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();						
						break;
			case 134:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "tan";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 135:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "csc";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 136:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "sec";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 137:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "cot";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 138:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "sinh", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 139:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "cosh", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 140:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "tanh", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 141:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "csch", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 142:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "sech", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 143:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "coth", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 144:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "sinh";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);	
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 145:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "cosh";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 146:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "tanh";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 147:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "csch";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 148:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "sech";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 149:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						
						props = {type:DEGREE_SUPERSCRIPT};
						var sBase = "coth";
						var sSup = "-1";
						var oDegree = new CDegree();
						MathElement.CreateDegree(oDegree, oFName, props, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 150:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "sin", props);
						
						oArg = oFunc.getArgument();
						var argText = String.fromCharCode(952);
						MathElement.AddText(oArg, argText);
						break;
			case 151:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "cos", props);
						
						oArg = oFunc.getArgument();
						MathElement.AddText(oArg, "2x");
						break;
			case 152:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "tan", props);						
						oArg = oFunc.getArgument();
						var argText = String.fromCharCode(952);
						MathElement.AddText(oArg, argText);
						MathElement.AddText(MathElement.Math.Root, "=");
						
						props = {};
						var oFraction = new CFraction();
						MathElement.CreateElem(oFraction, MathElement.Math.Root, props);
						
						var oNum = oFraction.getNumerator();						
						props = {};
						var oFuncNum = new CMathFunc();
						MathElement.CreateElem(oFuncNum,oNum,props);
						var oFNameNum = oFuncNum.getFName();
						props = {sty:"p"};
						MathElement.AddText(oFNameNum, "sin", props);						
						var oArgNum = oFuncNum.getArgument();
						MathElement.AddText(oArgNum, argText);
						
						var oDen = oFraction.getDenominator();
						props = {};
						var oFuncDen = new CMathFunc();
						MathElement.CreateElem(oFuncDen,oDen,props);
						var oFNameDen = oFuncDen.getFName();
						props = {sty:"p"};
						MathElement.AddText(oFNameDen, "cos", props);						
						var oArgDen = oFuncDen.getArgument();
						MathElement.AddText(oArgDen, argText);						
						break;
			case 153:	var sChr = String.fromCharCode(775);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 154:	var sChr = String.fromCharCode(776);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 155:	var sChr = String.fromCharCode(8411);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 156:	var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 157:	var sChr = String.fromCharCode(780);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 158:	var sChr = String.fromCharCode(769);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 159:	var sChr = String.fromCharCode(768);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 160:	var sChr = String.fromCharCode(774);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 161:	var sChr = String.fromCharCode(771);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 162:	var sChr = String.fromCharCode(773);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 163:	var sChr = String.fromCharCode(831);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 164:	var sChr = String.fromCharCode(9182);
						props = {chr:sChr, pos:VJUST_TOP, vertJc:VJUST_BOT};
						oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,MathElement.Math.Root,props);
						oGroupChr.fillPlaceholders();
						break;
			case 165:	oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,MathElement.Math.Root,props);
						oGroupChr.fillPlaceholders();
						break;
			case 166:	props = {type:LIMIT_UP};
						var oLimUpp = new CLimit();
						MathElement.CreateElem(oLimUpp,MathElement.Math.Root,props);
						var oLim = oLimUpp.getIterator();
						oLim.fillPlaceholders();
						var oElem = oLimUpp.getFName();
				
						var sChr = String.fromCharCode(9182);
						props = {chr:sChr, pos:VJUST_TOP, vertJc:VJUST_BOT};
						oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						var grElem = oGroupChr.getBase();
						grElem.fillPlaceholders();
						break;
			case 167:	props = {type:LIMIT_LOW};
						var oLimLow = new CLimit();
						MathElement.CreateElem(oLimLow,MathElement.Math.Root,props);
						var oLim = oLimLow.getIterator();
						oLim.fillPlaceholders();
						var oElem = oLimLow.getFName();
				
						oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						var grElem = oGroupChr.getBase();
						grElem.fillPlaceholders();
						break;
			case 168:	var sChr = String.fromCharCode(8406);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 169:	var sChr = String.fromCharCode(8407);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 170:	var sChr = String.fromCharCode(8417);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 171:	var sChr = String.fromCharCode(8400);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 172:	var sChr = String.fromCharCode(8401);
						props = {chr:sChr};
						var oAcc = new CAccent();
						MathElement.CreateElem(oAcc,MathElement.Math.Root,props);
						oAcc.fillPlaceholders();
						break;
			case 173:	var oBorderBox = new CBorderBox();
						MathElement.CreateElem(oBorderBox,MathElement.Math.Root,props);
						oBorderBox.fillPlaceholders();
						break;
			case 174:	var oBorderBox = new CBorderBox();
						MathElement.CreateElem(oBorderBox,MathElement.Math.Root,props);
						var oElem = oBorderBox.getBase();
						
						props = {type:DEGREE_SUPERSCRIPT};
						var oDegree0 = new CDegree();
						MathElement.CreateDegree(oDegree0, oElem, props, "a", "2", null);
						MathElement.AddText(oElem, "=");
						var oDegree1 = new CDegree();
						MathElement.CreateDegree(oDegree1, oElem, props, "b", "2", null);
						MathElement.AddText(oElem, "+");
						var oDegree2 = new CDegree();
						MathElement.CreateDegree(oDegree2, oElem, props, "c", "2", null);					
						break;
			case 175:	props = {pos:LOCATION_TOP};
						var oBar = new CBar();
						MathElement.CreateElem(oBar,MathElement.Math.Root,props);
						oBar.fillPlaceholders();
						break;
			case 176:	var oBar = new CBar();
						MathElement.CreateElem(oBar,MathElement.Math.Root,props);
						oBar.fillPlaceholders();
						break;
			case 177:	props = {pos:LOCATION_TOP};
						var oBar = new CBar();
						MathElement.CreateElem(oBar,MathElement.Math.Root,props);
						oElem = oBar.getBase();
						MathElement.AddText(oElem, "A");
						break;
			case 178:	props = {pos:LOCATION_TOP};
						var oBar = new CBar();
						MathElement.CreateElem(oBar,MathElement.Math.Root,props);
						oElem = oBar.getBase();
						MathElement.AddText(oElem, "ABC");
						break;
			case 179:	props = {pos:LOCATION_TOP};
						var oBar = new CBar();
						MathElement.CreateElem(oBar,MathElement.Math.Root,props);
						oElem = oBar.getBase();
						var sText = "x" + String.fromCharCode(8853) + "y";
						MathElement.AddText(oElem, sText);
						break;
			case 180:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);		
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						oFName = oFunc.getFName();
						
						props = {type:DEGREE_SUBSCRIPT};
						var oSSub = new CDegree();
						MathElement.CreateElem(oSSub, oFName, props);
						
						var sSubBase = oSSub.getBase();						
						props = {sty:"p"};
						MathElement.AddText(sSubBase, "log", props);
						var oSub = oSSub.getLowerIterator();
						oSub.fillPlaceholders();
						break;
			case 181:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "log", props);
						break;
			case 182:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
							
						oFName = oFunc.getFName();						
						props = {type:LIMIT_LOW};
						var oLimLow = new CLimit();
						MathElement.CreateElem(oLimLow, oFName, props);						
						
						var oElem = oLimLow.getFName();
						props = {sty:"p"};
						MathElement.AddText(oElem, "lim", props);	
						
						var oLim = oLimLow.getIterator();
						oLim.fillPlaceholders();
						break;
			case 183:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);	
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						
						oFName = oFunc.getFName();						
						props = {type:LIMIT_LOW};
						var oLimLow = new CLimit();
						MathElement.CreateElem(oLimLow, oFName, props);
						var oLim = oLimLow.getIterator();
						oLim.fillPlaceholders();
						
						var oElem = oLimLow.getFName();
						props = {sty:"p"};
						MathElement.AddText(oElem, "min", props);						
						break;
			case 184:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);	
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						
						oFName = oFunc.getFName();						
						props = {type:LIMIT_LOW};
						var oLimLow = new CLimit();
						MathElement.CreateElem(oLimLow, oFName, props);
						var oLim = oLimLow.getIterator();
						oLim.fillPlaceholders();
						
						var oElem = oLimLow.getFName();
						props = {sty:"p"};
						MathElement.AddText(oElem, "max", props);						
						break;
			case 185:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						
						oFName = oFunc.getFName();						
						props = {sty:"p"};
						MathElement.AddText(oFName, "ln", props);
						break;
			case 186:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);	
						
						oFName = oFunc.getFName();							
						props = {type:LIMIT_LOW};
						var oLimLow = new CLimit();
						MathElement.CreateElem(oLimLow, oFName, props);
						var limLowElem = oLimLow.getFName();
						props = {sty:"p"};
						MathElement.AddText(limLowElem, "lim", props);
						var limLowLim = oLimLow.getIterator();
						var sText = "n" + String.fromCharCode(8594,8734)
						MathElement.AddText(limLowLim, sText);
						
						var oElem = oFunc.getArgument();
						props = {type:DEGREE_SUPERSCRIPT};
						var oDegree = new CDegree();
						MathElement.CreateElem(oDegree, oElem, props);
						var oSup = oDegree.getUpperIterator();
						MathElement.AddText(oSup, "n");
						var degreeElem = oDegree.getBase();
						
						props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,degreeElem,props);
						var delElem = oDelimiter.getBase(0);
						MathElement.AddText(delElem,"1+");
						
						props = {};
						var oFraction = new CFraction();
						MathElement.CreateFraction(oFraction,delElem,props,"1","n");
						break;
			case 187:	var oFunc = new CMathFunc();
						MathElement.CreateElem(oFunc,MathElement.Math.Root,props);	
						
						oFName = oFunc.getFName();
						props = {type:LIMIT_LOW};
						var oLimLow = new CLimit();
						MathElement.CreateElem(oLimLow, oFName, props);
						
						var limLowElem = oLimLow.getFName();
						props = {sty:"p"};
						MathElement.AddText(limLowElem, "max", props);
						var limLowLim = oLimLow.getIterator();
						var sText = "0" + String.fromCharCode(8804) + "x" + String.fromCharCode(8804) + "1";
						MathElement.AddText(limLowLim, sText);
						
						var oElem = oFunc.getArgument();
						MathElement.AddText(oElem, "x");
						props = {type:DEGREE_SUPERSCRIPT};
						var oDegree = new CDegree();
						MathElement.CreateElem(oDegree, oElem, props);
						var degreeElem = oDegree.getBase();
						MathElement.AddText(degreeElem, "e");
						
						var oSup = oDegree.getUpperIterator();
						MathElement.AddText(oSup, "-");
						props = {type:DEGREE_SUPERSCRIPT};
						var supSup = new CDegree();
						MathElement.CreateElem(supSup, oSup, props);
						var supElem = supSup.getBase();
						MathElement.AddText(supElem, "x");
						var supSupSup = supSup.getUpperIterator();
						MathElement.AddText(supSupSup, "2");
						break;
			case 188:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						MathElement.AddText(oElem, ":=");
						break;
			case 189:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						MathElement.AddText(oElem, "==");
						break;
			case 190:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						MathElement.AddText(oElem, "+=");
						break;
			case 191:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						MathElement.AddText(oElem, "-=");
						break;
			case 192:	var sText = String.fromCharCode(8797);
						MathElement.AddText(MathElement.Math.Root, sText);
						break;
			case 193:	var sText = String.fromCharCode(8798);
						MathElement.AddText(MathElement.Math.Root, sText);
						break;
			case 194:	var sText = String.fromCharCode(8796);
						MathElement.AddText(MathElement.Math.Root, sText);
						break;
			case 195:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8592);
						props = {pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 196:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8594);
						props = {pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 197:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8592);
						props = {vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 198:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8594);
						props = {vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 199:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8656);
						props = {pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 200:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8658);
						props = {pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 201:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8656);
						props = {vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 202:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8658);
						props = {vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 203:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8596);
						props = {pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 204:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8596);
						props = {vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 205:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8660);
						props = {pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 206:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8660);
						props = {vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						oGroupChr.fillPlaceholders();
						break;
			case 207:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8594);
						props = {vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						var groupElem = oGroupChr.getBase();
						MathElement.AddText(groupElem,"yields");
						break;
			case 208:	props = {opEmu:1};
						var oBox = new CBox();
						MathElement.CreateElem(oBox,MathElement.Math.Root,props);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8594);
						props = {vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter();
						MathElement.CreateElem(oGroupChr,oElem,props);
						var groupElem = oGroupChr.getBase();
						var sText = String.fromCharCode(8710);
						MathElement.AddText(groupElem,sText);
						break;
			case 209:	props = {column:2, row:1, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						oMatrix.fillPlaceholders();
						break;		
			case 210:	props = {column:1, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						oMatrix.fillPlaceholders();
						break;	
			case 211:	props = {column:3, row:1, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						oMatrix.fillPlaceholders();
						break;
			case 212:	props = {column:1, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						oMatrix.fillPlaceholders();
						break;	
			case 213:	props = {column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						oMatrix.fillPlaceholders();
						break;
			case 214:	props = {column:3, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						oMatrix.fillPlaceholders();
						break;
			case 215:	props = {column:2, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						oMatrix.fillPlaceholders();
						break;
			case 216:	props = {column:3, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						oMatrix.fillPlaceholders();
						break;
			case 217:	var sText = String.fromCharCode(8943);
						MathElement.AddText(MathElement.Math.Root,sText);
						break;
			case 218:	var sText = String.fromCharCode(8230);
						MathElement.AddText(MathElement.Math.Root,sText);
						break;
			case 219:	var sText = String.fromCharCode(8942);
						MathElement.AddText(MathElement.Math.Root,sText);
						break;
			case 220:	var sText = String.fromCharCode(8945);
						MathElement.AddText(MathElement.Math.Root,sText);
						break;
			case 221:	props = {column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						var oElem = oMatrix.getElement(0,0);
						MathElement.AddText(oElem, "1");
						oElem = oMatrix.getElement(0,1);
						MathElement.AddText(oElem, "0");
						oElem = oMatrix.getElement(1,0);
						MathElement.AddText(oElem, "0");
						oElem = oMatrix.getElement(1,1);
						MathElement.AddText(oElem, "1");
						break;
			case 222:	props = {column:2, row:2, mcJc:"center", plcHide:1};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						var oElem = oMatrix.getElement(0,0);
						MathElement.AddText(oElem, "1");
						oElem = oMatrix.getElement(1,1);
						MathElement.AddText(oElem, "1");
						break;
			case 223:	props = {column:3, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						var oElem = oMatrix.getElement(0,0);
						MathElement.AddText(oElem, "1");
						oElem = oMatrix.getElement(0,1);
						MathElement.AddText(oElem, "0");
						oElem = oMatrix.getElement(0,2);
						MathElement.AddText(oElem, "0");
						oElem = oMatrix.getElement(1,0);
						MathElement.AddText(oElem, "0");
						oElem = oMatrix.getElement(1,1);
						MathElement.AddText(oElem, "1");
						oElem = oMatrix.getElement(1,2);
						MathElement.AddText(oElem, "0");
						oElem = oMatrix.getElement(2,0);
						MathElement.AddText(oElem, "0");
						oElem = oMatrix.getElement(2,1);
						MathElement.AddText(oElem, "0");
						oElem = oMatrix.getElement(2,2);
						MathElement.AddText(oElem, "1");
						break;
			case 224:	props = {column:3, row:3, mcJc:"center", plcHide:1};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,MathElement.Math.Root,props);
						var oElem = oMatrix.getElement(0,0);
						MathElement.AddText(oElem, "1");
						oElem = oMatrix.getElement(1,1);
						MathElement.AddText(oElem, "1");
						oElem = oMatrix.getElement(2,2);
						MathElement.AddText(oElem, "1");
						break;
			case 225:	props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,delimiterBase,props);
						oMatrix.fillPlaceholders();
						break;
			case 226:	props = {column:1,begChr:"[", endChr:"]"};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,delimiterBase,props);
						oMatrix.fillPlaceholders();
						break;
			case 227:	var sChr = String.fromCharCode(124);
						props = {column:1,begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,delimiterBase,props);
						oMatrix.fillPlaceholders();
						break;
			case 228:	var sChr = String.fromCharCode(8214);
						props = {column:1,begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,delimiterBase,props);
						oMatrix.fillPlaceholders();
						break;
			case 229:	props = {column:1};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {column:3, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,delimiterBase,props);
						
						var oElem = oMatrix.getElement(0,0);
						oElem.fillPlaceholders();
						oElem = oMatrix.getElement(0,1);
						var sText = String.fromCharCode(8943);
						MathElement.AddText(oElem, sText);
						oElem = oMatrix.getElement(0,2);
						oElem.fillPlaceholders();
						oElem = oMatrix.getElement(1,0);
						sText = String.fromCharCode(8942);
						MathElement.AddText(oElem, sText);						
						oElem = oMatrix.getElement(1,1);
						sText = String.fromCharCode(8945);
						MathElement.AddText(oElem, sText);						
						oElem = oMatrix.getElement(1,2);
						sText = String.fromCharCode(8942);
						MathElement.AddText(oElem, sText);			
						oElem = oMatrix.getElement(2,0);
						oElem.fillPlaceholders();						
						oElem = oMatrix.getElement(2,1);
						sText = String.fromCharCode(8943);						
						MathElement.AddText(oElem, sText);
						oElem = oMatrix.getElement(2,2);
						oElem.fillPlaceholders();
						
						break;
			case 230:	props = {column:1,begChr:"[", endChr:"]"};
						var oDelimiter = new CDelimiter();
						MathElement.CreateElem(oDelimiter,MathElement.Math.Root,props);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {column:3, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix();
						MathElement.CreateElem(oMatrix,delimiterBase,props);
						
						var oElem = oMatrix.getElement(0,0);
						oElem.fillPlaceholders();
						oElem = oMatrix.getElement(0,1);
						var sText = String.fromCharCode(8943);
						MathElement.AddText(oElem, sText);
						oElem = oMatrix.getElement(0,2);
						oElem.fillPlaceholders();
						oElem = oMatrix.getElement(1,0);
						sText = String.fromCharCode(8942);
						MathElement.AddText(oElem, sText);						
						oElem = oMatrix.getElement(1,1);
						sText = String.fromCharCode(8945);
						MathElement.AddText(oElem, sText);						
						oElem = oMatrix.getElement(1,2);
						sText = String.fromCharCode(8942);
						MathElement.AddText(oElem, sText);			
						oElem = oMatrix.getElement(2,0);
						oElem.fillPlaceholders();						
						oElem = oMatrix.getElement(2,1);
						sText = String.fromCharCode(8943);						
						MathElement.AddText(oElem, sText);
						oElem = oMatrix.getElement(2,2);
						oElem.fillPlaceholders();
						break;
		}
		g_oTableId.Add( MathElement, MathElement.Id );
        
        this.WordControl.m_oLogicDocument.Paragraph_Add( MathElement );
    }
}

window["asc_docs_api"] = asc_docs_api;
window["asc_docs_api"].prototype["asc_nativeOpenFile"] = function(base64File)
{
	this.DocumentUrl = "TeamlabNative";

	window.g_cAscCoAuthoringUrl = "";
	window.g_cAscSpellCheckUrl = "";
	
	var asc_user = window["Asc"].asc_CUser;
	this.User = new asc_user();
	this.User.asc_setId("TM");
	this.User.asc_setUserName("native");
	
	this.WordControl.m_bIsRuler = false;
	this.WordControl.Init();
	
	this.InitEditor();
	this.DocumentType = 2;
	this.LoadedObjectDS = Common_CopyObj(this.WordControl.m_oLogicDocument.Get_Styles().Style);
	
	g_oIdCounter.Set_Load(true);

	var openParams = {checkFileSize: this.isMobileVersion, charCount: 0, parCount: 0};
	var oBinaryFileReader = new BinaryFileReader(this.WordControl.m_oLogicDocument, openParams);
	
	if(oBinaryFileReader.Read(base64File))
	{
		g_oIdCounter.Set_Load(false);
		this.LoadedObject = 1;

		this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
	}
	else
		this.asc_fireCallback("asc_onError",c_oAscError.ID.MobileUnexpectedCharCount,c_oAscError.Level.Critical);
		
	//callback
	this.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
	var sizeMM;
	if(this.DocumentOrientation)
		sizeMM = DocumentPageSize.getSize(Page_Width, Page_Height);
	else
		sizeMM = DocumentPageSize.getSize(Page_Height, Page_Width);
	this.sync_DocSizeCallback(sizeMM.w_mm, sizeMM.h_mm);
	this.sync_PageOrientCallback(editor.get_DocumentOrientation());
}

window["asc_docs_api"].prototype["asc_nativeCalculateFile"] = function()
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    var Document = this.WordControl.m_oLogicDocument;

    if (this.isApplyChangesOnOpenEnabled)
    {
        this.isApplyChangesOnOpenEnabled = false;
        if (CollaborativeEditing.m_bUse == true)
        {
            this.isApplyChangesOnOpen = true;
            CollaborativeEditing.Apply_Changes();
            CollaborativeEditing.Release_Locks();
            return;
        }
    }    

    History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : { Pos : 0, PageNum : 0 } } );

    //Recalculate для Document
    Document.CurPos.ContentPos = 0;
    History.RecalcData_Add({Type: historyrecalctype_Drawing, All: true});
    Document.DrawingObjects.addToZIndexManagerAfterOpen();

    Document.Recalculate();
    
    this.ShowParaMarks = false;
}

window["asc_docs_api"].prototype["asc_nativeApplyChanges"] = function(changes)
{
    this.CoAuthoringApi.onSaveChanges(changes, false);
	CollaborativeEditing.Apply_OtherChanges();
}

window["asc_docs_api"].prototype["asc_nativeGetFile"] = function()
{
	var oBinaryFileWriter = new BinaryFileWriter(this.WordControl.m_oLogicDocument);
    return oBinaryFileWriter.Write();
}

window["asc_docs_api"].prototype["asc_nativeCheckPdfRenderer"] = function(_memory1, _memory2)
{
	if (true)
	{
		// pos не должен минимизироваться!!!

		_memory1.Copy           = _memory1["Copy"];
		_memory1.ClearNoAttack  = _memory1["ClearNoAttack"];
		_memory1.WriteByte      = _memory1["WriteByte"];
		_memory1.WriteBool      = _memory1["WriteBool"];
		_memory1.WriteLong      = _memory1["WriteLong"];
		_memory1.WriteDouble    = _memory1["WriteDouble"];
		_memory1.WriteString    = _memory1["WriteString"];
		_memory1.WriteString2   = _memory1["WriteString2"];
		
		_memory2.Copy           = _memory1["Copy"];
		_memory2.ClearNoAttack  = _memory1["ClearNoAttack"];
		_memory2.WriteByte      = _memory1["WriteByte"];
		_memory2.WriteBool      = _memory1["WriteBool"];
		_memory2.WriteLong      = _memory1["WriteLong"];
		_memory2.WriteDouble    = _memory1["WriteDouble"];
		_memory2.WriteString    = _memory1["WriteString"];
		_memory2.WriteString2   = _memory1["WriteString2"];
	}
	
	var _printer = new CDocumentRenderer();
	_printer.Memory				    = _memory1;
	_printer.VectorMemoryForPrint	= _memory2;
	return _printer;
}

window["asc_docs_api"].prototype["asc_nativeCalculate"] = function()
{
}

window["asc_docs_api"].prototype["asc_nativePrint"] = function(_printer, _page)
{
	var page = this.WordControl.m_oDrawingDocument.m_arrPages[_page];
    _printer.BeginPage(page.width_mm, page.height_mm);
    this.WordControl.m_oLogicDocument.DrawPage(_page, _printer);
    _printer.EndPage();
}

window["asc_docs_api"].prototype["asc_nativePrintPagesCount"] = function()
{
	return this.WordControl.m_oDrawingDocument.m_lPagesCount;
}