﻿"use strict";

var c_oAscZoomType = {
	Current :0,		
	FitWidth:1,
	FitPage :2
};

var c_oAscCollaborativeMarksShowType = {
    All         : 0,
    LastChanges : 1
};

var c_oAscAsyncActionType = {
    Information : 0,
    BlockInteraction : 1
};

var c_oAscHAnchor = {
    Margin : 0x00,
    Page   : 0x01,
    Text   : 0x02,

    PageInternal : 0xFF // только для внутреннего использования
};
var c_oAscXAlign = {
    Center  : 0x00,
    Inside  : 0x01,
    Left    : 0x02,
    Outside : 0x03,
    Right   : 0x04
};

var c_oAscYAlign = {
    Bottom  : 0x00,
    Center  : 0x01,
    Inline  : 0x02,
    Inside  : 0x03,
    Outside : 0x04,
    Top     : 0x05
};

var c_oAscVAnchor = {
    Margin : 0x00,
    Page   : 0x01,
    Text   : 0x02
};

var c_oAscAsyncAction = {
	Open				: 0, // открытие документа
	Save				: 1,
	LoadDocumentFonts	: 2, // загружаем фонты документа (сразу после открытия)
    LoadDocumentImages	: 3, // загружаем картинки документа (сразу после загрузки шрифтов)
    LoadFont			: 4, // подгрузка нужного шрифта
    LoadImage			: 5, // подгрузка картинки
	DownloadAs			: 6,
	Print				: 7, // конвертация в PDF и сохранение у пользователя
	UploadImage			: 8,
    LoadTheme			: 9,
	ApplyChanges		: 10, // применение изменений от другого пользователя.
	PrepareToSave		: 11  // Подготовка к сохранению
};

var c_oAscVertAlignJc = {
    Top    : 0x00, // var vertalignjc_Top    = 0x00;
    Center : 0x01, // var vertalignjc_Center = 0x01;
    Bottom : 0x02  // var vertalignjc_Bottom = 0x02
};
//files type for Saving & DownloadAs
var c_oAscFileType = {
	INNER:	0x0081,
	PDF:	0x0201,
	PPTX:	0x0081,
	PPT:	0x0082,
	ODP:	0x0083
};

// Right = 0; Left = 1; Center = 2; Justify = 3;
var c_oAscAlignType = {
	LEFT:0,
	CENTER:1,
	RIGHT:2,
	JUSTIFY:3,
	TOP:4,
	MIDDLE:5,
	BOTTOM:6
};

// image wrap style
var c_oAscWrapStyle = {
	Inline:0,
	Flow : 1
};
	
	/*Error level & ID*/
var c_oAscError = {
	Level: {
		Critical:-1,
		NoCritical:0
	},
	ID : {
		ServerSaveComplete: 	3,
		ConvertationProgress: 	2,
		DownloadProgress: 		1,
		No: 					0,
		Unknown: 			 	-1,
		ConvertationTimeout: 	-2,
		ConvertationError: 		-3,
		DownloadError: 			-4,
		UnexpectedGuid: 		-5,
		Database: 				-6,
		FileRequest: 			-7,
		FileVKey: 				-8,
		UplImageSize: 			-9,
		UplImageExt: 			-10,
		UplImageFileCount: 		-11,
		NoSupportClipdoard:		-12,
		CoAuthoringDisconnect:	-18,
		ConvertationPassword:	-19,
		VKeyEncrypt: 			-20,
		KeyExpire: 				-21,
		UserCountExceed: 		-22,
        SplitCellMaxRows:       -23,
        SplitCellMaxCols:       -24,
        SplitCellRowsDivider:   -25
	}
};


var c_oAscTypeSelectElement = {
    Paragraph  : 0,
    Table      : 1,
    Image      : 2,
    Header     : 3,
    Hyperlink  : 4,
    SpellCheck : 5,
    Shape:6,
    Slide:7,
    Chart: 8
};
var c_oAscContextMenuTypes = {
    Main       : 0,
    Thumbnails : 1
};

var c_oAscTableBordersType = {
	LEFT:0,
	TOP:1,
	RIGHT:2,
	BOTTOM:3,
	VERTLINE:4,
	HORIZONTLINE:5,
	INSIDE:6,
	OUTSIDE:7,
	ALL:8
};


// Chart defines
var c_oAscChartType = {
    line: "Line",
    bar: "Bar",
    hbar: "HBar",
    area: "Area",
    pie: "Pie",
    scatter: "Scatter",
    stock: "Stock"
};

var c_oAscChartSubType = {
    normal: "normal",
    stacked: "stacked",
    stackedPer: "stackedPer"
};

var c_oAscChartStyle = {
    Dark: 1,
    Standart: 2,
    Accent1: 3,
    Accent2: 4,
    Accent3: 5,
    Accent4: 6,
    Accent5: 7,
    Accent6: 8
};

var FONT_THUMBNAIL_HEIGHT = (7 * 96.0 / 25.4) >> 0;

var THEME_THUMBNAIL_WIDTH = 180;
var THEME_THUMBNAIL_HEIGHT = 135;
var LAYOUT_THUMBNAIL_WIDTH = 180;
var LAYOUT_THUMBNAIL_HEIGHT = 135;

var c_oAscStyleImage = {
    Default :0,
    Document:1
};

var c_oAscLineDrawingRule = {
    Left   : 0,
    Center : 1,
    Right  : 2,
    Top    : 0,
    Bottom : 2
};

var align_Right   = 0;
var align_Left    = 1;
var align_Center  = 2;
var align_Justify = 3;

var vertalign_Baseline    = 0;
var vertalign_SuperScript = 1;
var vertalign_SubScript   = 2;
var hdrftr_Header = 0x01;
var hdrftr_Footer = 0x02;

var hdrftr_Default = 0x01;
var hdrftr_Even    = 0x02;
var hdrftr_First   = 0x03;

var c_oAscTableSelectionType = {
    Cell   : 0,
    Row    : 1,
    Column : 2,
    Table  : 3
};

var linerule_AtLeast = 0;
var linerule_Auto    = 1;
var linerule_Exact   = 2;

var shd_Clear = 0;
var shd_Nil   = 1;

var c_oAscColor = {
    COLOR_TYPE_SRGB   : 1,
    COLOR_TYPE_PRST   : 2,
    COLOR_TYPE_SCHEME : 3
};

var c_oAscFill = {
    FILL_TYPE_BLIP   : 1,
    FILL_TYPE_NOFILL : 2,
    FILL_TYPE_SOLID	 : 3,
    FILL_TYPE_PATT   : 4,
    FILL_TYPE_GRAD   : 5
};

var c_oAscFillGradType  = {
    GRAD_LINEAR : 1,
    GRAD_PATH   : 2
};

var c_oAscFillBlipType = {
    STRETCH : 1,
    TILE    : 2
};

var c_oAscStrokeType = {
    STROKE_NONE: 0,
    STROKE_COLOR: 1
};

var c_oAscAlignShapeType = {
    ALIGN_LEFT: 0,
    ALIGN_RIGHT: 1,
    ALIGN_TOP : 2,
    ALIGN_BOTTOM : 3,
    ALIGN_CENTER : 4,
    ALIGN_MIDDLE: 5
};


var c_oAscVerticalTextAlign = {
    TEXT_ALIGN_BOTTOM : 0,// (Text Anchor Enum ( Bottom ))
    TEXT_ALIGN_CTR : 1,// (Text Anchor Enum ( Center ))
    TEXT_ALIGN_DIST : 2,// (Text Anchor Enum ( Distributed ))
    TEXT_ALIGN_JUST : 3,// (Text Anchor Enum ( Justified ))
    TEXT_ALIGN_TOP : 4// Top
};

var c_oAscLineJoinType = {
    Round : 1,
    Bevel : 2,
    Miter : 3
};

var c_oAscLineCapType = {
    Flat : 0,
    Round : 1,
    Square : 2
};

var c_oAscLineBeginType = {
    None: 0,
    Arrow: 1,
    Diamond: 2,
    Oval: 3,
    Stealth: 4,
    Triangle: 5
};

var c_oAscLineBeginSize = {
    small_small : 0,
    small_mid : 1,
    small_large : 2,
    mid_small : 3,
    mid_mid : 4,
    mid_large : 5,
    large_small : 6,
    large_mid : 7,
    large_large : 8
};

var c_oAscMouseMoveDataTypes = {
    Common       : 0,
    Hyperlink    : 1,
    LockedObject : 2
};

var c_oAscSlideTransitionTypes = {
    None    : 0,
    Fade    : 1,
    Push    : 2,
    Wipe    : 3,
    Split   : 4,
    UnCover : 5,
    Cover   : 6,
    Clock   : 7,
    Zoom    : 8
};

var c_oAscSlideTransitionParams = {
    Fade_Smoothly       : 0,
    Fade_Through_Black  : 1,

    Param_Left          : 0,
    Param_Top           : 1,
    Param_Right         : 2,
    Param_Bottom        : 3,
    Param_TopLeft       : 4,
    Param_TopRight      : 5,
    Param_BottomLeft    : 6,
    Param_BottomRight   : 7,

    Split_VerticalIn    : 8,
    Split_VerticalOut   : 9,
    Split_HorizontalIn  : 10,
    Split_HorizontalOut : 11,

    Clock_Clockwise         : 0,
    Clock_Counterclockwise  : 1,
    Clock_Wedge             : 2,

    Zoom_In             : 0,
    Zoom_Out            : 1,
    Zoom_AndRotate      : 2
};

var c_oAscLockTypeElemPresentation = {
    Object		: 1,
    Slide		: 2,
    Presentation: 3
};

var TABLE_STYLE_WIDTH_PIX   = 70;
var TABLE_STYLE_HEIGHT_PIX  = 50;