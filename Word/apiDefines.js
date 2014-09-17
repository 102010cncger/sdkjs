"use strict";

var c_oAscZoomType = {
	Current :0,		
	FitWidth:1,
	FitPage :2
};

var c_oAscAsyncActionType = {
    Information : 0,
    BlockInteraction : 1
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
	ApplyChanges		: 9  // применение изменений от другого пользователя.
};
//files type for Saving & DownloadAs
var c_oAscFileType = {
	INNER: 		0x0041,
	DOCX: 		0x0041,
	DOC: 		0x0042,
	ODT: 		0x0043,
	RTF: 		0x0044,
	TXT: 		0x0045,
	HTML_ZIP: 	0x0803,
	MHT: 		0x0047,
	PDF: 		0x0201,
	EPUB: 		0x0048,
	FB2: 		0x0049,
	MOBI: 		0x004a,
	DOCY: 		0x1001
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

var c_oAscWrapStyle2 = {
    Inline       : 0,
    Square       : 1,
    Tight        : 2,
    Through      : 3,
    TopAndBottom : 4,
    Behind       : 5,
    InFront      : 6
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
        SplitCellMaxRows:       -13,
        SplitCellMaxCols:       -14,
        SplitCellRowsDivider:   -15,
        StockChartError:        -16,

		CoAuthoringDisconnect:	-18,
		ConvertationPassword:	-19,

		VKeyEncrypt:			-20,
		KeyExpire:				-21,
		UserCountExceed:		-22,
		MobileUnexpectedCharCount: -23
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
var FONT_THUMBNAIL_HEIGHT = parseInt(7 * 96.0 / 25.4);

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

// Chart defines
var c_oAscChartType = {
    line: "Line",
    bar: "Bar",
    hbar: "HBar",
    area: "Area",
    pie: "Pie",
    scatter: "Scatter",
    stock: "Stock",
    doughnut: "Doughnut"
};

var c_oAscChartSubType = {
    normal: "normal",
    stacked: "stacked",
    stackedPer: "stackedPer"
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

var c_oAscContextMenuTypes = {
    Common       : 0, // Обычное контекстное меню
    ChangeHdrFtr : 1  // Специальное контестное меню для попадания в колонтитул
};

var c_oAscMouseMoveDataTypes = {
    Common       : 0,
    Hyperlink    : 1,
    LockedObject : 2
};

var c_oAscMouseMoveLockedObjectType = {
    Common : 0,
    Header : 1,
    Footer : 2
};

var c_oAscCollaborativeMarksShowType = {
    None        : -1,
    All         :  0,
    LastChanges :  1
};

var c_oAscAlignH = {
    Center  : 0x00,
    Inside  : 0x01,
    Left    : 0x02,
    Outside : 0x03,
    Right   : 0x04
};

var c_oAscChangeLevel = {
    BringToFront : 0x00,
    BringForward : 0x01,
    SendToBack   : 0x02,
    BringBackward: 0x03
};

var c_oAscAlignV = {
    Bottom  : 0x00,
    Center  : 0x01,
    Inside  : 0x02,
    Outside : 0x03,
    Top     : 0x04
};

var c_oAscVertAlignJc = {
    Top    : 0x00, // var vertalignjc_Top    = 0x00;
    Center : 0x01, // var vertalignjc_Center = 0x01;
    Bottom : 0x02  // var vertalignjc_Bottom = 0x02
};

var c_oAscTableLayout = {
    AutoFit : 0x00,
    Fixed   : 0x01
};

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

var TABLE_STYLE_WIDTH_PIX   = 70;
var TABLE_STYLE_HEIGHT_PIX  = 50;

var c_oAscDropCap =
{
    None   : 0,
    Drop   : 1,
    Margin : 2
};

var c_oAscSectionBreakType = 
{
    NextPage   : 0x00,
    OddPage    : 0x01,
    EvenPage   : 0x02,
    Continuous : 0x03,
    Column     : 0x04
};

window["flat_desine"] = false;