var historyitem_Unknown = 0;

var historyitem_Workbook_SheetAdd = 1;
var historyitem_Workbook_SheetRemove = 2;
var historyitem_Workbook_SheetMove = 3;
var historyitem_Workbook_SheetPositions = 4;
var historyitem_Workbook_ChangeColorScheme = 5;

var historyitem_Worksheet_RemoveCell = 1;
var historyitem_Worksheet_RemoveRows = 2;
var historyitem_Worksheet_RemoveCols = 3;
var historyitem_Worksheet_AddRows = 4;
var historyitem_Worksheet_AddCols = 5;
var historyitem_Worksheet_ShiftCellsLeft = 6;
var historyitem_Worksheet_ShiftCellsTop = 7;
var historyitem_Worksheet_ShiftCellsRight = 8;
var historyitem_Worksheet_ShiftCellsBottom = 9;
var historyitem_Worksheet_ColProp = 10;
var historyitem_Worksheet_RowProp = 11;
var historyitem_Worksheet_Sort = 12;
var historyitem_Worksheet_MoveRange = 13;
var historyitem_Worksheet_Merge = 14;
var historyitem_Worksheet_Unmerge = 15;
var historyitem_Worksheet_SetHyperlink = 16;
var historyitem_Worksheet_RemoveHyperlink = 17;
var historyitem_Worksheet_Rename = 18;
var historyitem_Worksheet_Hide = 19;
//не добавляем в историю события historyitem_Worksheet_CreateRow, CreateCol, CreateCell - потому что появляется много ошибок(например удаление строк, если снизу были данные и undo)
//они решают только одну проблему, что когда есть стиль колонки, а мы создаем ячейку, при полном undo не отменится стиль ячейки.
var historyitem_Worksheet_CreateRow = 20;
var historyitem_Worksheet_CreateCol = 21;
var historyitem_Worksheet_CreateCell = 22;
var historyitem_Worksheet_SetViewSettings = 23;
var historyitem_Worksheet_RemoveCellFormula = 24;
var historyitem_Worksheet_ChangeMerge = 25;
var historyitem_Worksheet_ChangeHyperlink = 26;

var historyitem_RowCol_Fontname = 1;
var historyitem_RowCol_Fontsize = 2;
var historyitem_RowCol_Fontcolor = 3;
var historyitem_RowCol_Bold = 4;
var historyitem_RowCol_Italic = 5;
var historyitem_RowCol_Underline = 6;
var historyitem_RowCol_Strikeout = 7;
var historyitem_RowCol_FontAlign = 8;
var historyitem_RowCol_AlignVertical = 9;
var historyitem_RowCol_AlignHorizontal = 10;
var historyitem_RowCol_Fill = 11;
var historyitem_RowCol_Border = 12;
var historyitem_RowCol_ShrinkToFit = 13;
var historyitem_RowCol_Wrap = 14;
var historyitem_RowCol_NumFormat = 15;
var historyitem_RowCol_SetFont = 16;
var historyitem_RowCol_Angle = 17;
var historyitem_RowCol_SetStyle = 18;
var historyitem_RowCol_SetCellStyle = 19;

var historyitem_Cell_Fontname = 1;
var historyitem_Cell_Fontsize = 2;
var historyitem_Cell_Fontcolor = 3;
var historyitem_Cell_Bold = 4;
var historyitem_Cell_Italic = 5;
var historyitem_Cell_Underline = 6;
var historyitem_Cell_Strikeout = 7;
var historyitem_Cell_FontAlign = 8;
var historyitem_Cell_AlignVertical = 9;
var historyitem_Cell_AlignHorizontal = 10;
var historyitem_Cell_Fill = 11;
var historyitem_Cell_Border = 12;
var historyitem_Cell_ShrinkToFit = 13;
var historyitem_Cell_Wrap = 14;
var historyitem_Cell_Numformat = 15;
var historyitem_Cell_ChangeValue = 16;
var historyitem_Cell_ChangeArrayValueFormat = 17;
var historyitem_Cell_SetStyle = 18;
var historyitem_Cell_SetFont = 19;
var historyitem_Cell_SetQuotePrefix = 20;
var historyitem_Cell_Angle = 21;
var historyitem_Cell_Style = 22;

// Chart
var historyitem_Chart_Type = 1;
var historyitem_Chart_SubType = 2;
var historyitem_Chart_Style = 3;

var historyitem_Chart_IsShowValue = 10;
var historyitem_Chart_IsShowBorder = 11;

var historyitem_Chart_RangeInterval = 20;
var historyitem_Chart_RangeRowColumns = 21;

var historyitem_Chart_HeaderTitle = 30;
var historyitem_Chart_HeaderSubTitle = 31;
var historyitem_Chart_IsDefaultHeaderTitle = 32;

var historyitem_Chart_xAxisTitle = 40;
var historyitem_Chart_xAxisIsDefaultTitle = 41;
var historyitem_Chart_xAxisIsShow = 42;
var historyitem_Chart_xAxisIsGrid = 43;

var historyitem_Chart_yAxisTitle = 50;
var historyitem_Chart_yAxisIsDefaultTitle = 51;
var historyitem_Chart_yAxisIsShow = 52;
var historyitem_Chart_yAxisIsGrid = 53;

var historyitem_Chart_LegendPosition = 60;
var historyitem_Chart_LegendIsShow = 61;
var historyitem_Chart_LegendIsOverlay = 62;

// AutoShapes
var historyitem_AutoShapes_Offset = 1;
var historyitem_AutoShapes_Extents = 2;
var historyitem_AutoShapes_Child_Offset = 3;
var historyitem_AutoShapes_Child_Extents = 4;
var historyitem_AutoShapes_Rotate = 5;
var historyitem_AutoShapes_Flips = 6;
var historyitem_AutoShapes_SetGuideValue = 7;
var historyitem_AutoShapes_RecalculateTransformUndo = 8;
var historyitem_AutoShapes_RecalculateTransformRedo = 9;
var historyitem_AutoShapes_Add_Adjustment = 10;
var historyitem_AutoShapes_Add_Guide = 11;
var historyitem_AutoShapes_Add_Cnx = 12;
var historyitem_AutoShapes_Add_Handle_XY = 13;
var historyitem_AutoShapes_Add_Handle_Polar = 14;
var historyitem_AutoShapes_Add_Path_Command = 15;
var historyitem_AutoShapes_Add_Path = 16;
var historyitem_AutoShapes_Add_GeometryRect = 17;
var historyitem_AutoShapes_Add_PathMoveTo = 18;
var historyitem_AutoShapes_Add_PathLineTo = 19;
var historyitem_AutoShapes_Add_PathArcTo = 20;
var historyitem_AutoShapes_Add_PathQuadBezTo = 21;
var historyitem_AutoShapes_Add_PathCubicBezTo = 22;
var historyitem_AutoShapes_Add_PathClose = 23;
var historyitem_AutoShapes_RecalculateGeometry_Undo = 24;
var historyitem_AutoShapes_RecalculateGeometry_Redo = 25;
var historyitem_AutoShapes_Add_To_Drawing_Objects = 26;
var historyitem_AutoShapes_Layout_Set_X_Mode = 27;
var historyitem_AutoShapes_Layout_Set_Y_Mode = 28;
var historyitem_AutoShapes_Layout_Set_X = 29;
var historyitem_AutoShapes_Layout_Set_Y = 30;
var historyitem_AutoShapes_SetDrawingObjects = 31;
var historyitem_AutoShapes_SetGroup = 32;
var historyitem_AutoShapes_SetPresetGeometry = 33;
var historyitem_AutoShapes_SetDefaultStyle = 34;
var historyitem_AutoShapes_RecalculateAfterInit = 35;
var historyitem_AutoShapes_SetXfrm = 36;
var historyitem_AutoShapes_AddTextBody = 37;
var historyitem_AutoShapes_AddDocContent = 38;
var historyitem_AutoShapes_AddDrawingDocument = 39;
var historyitem_AutoShapes_AddParent = 40;
var historyitem_AutoShapes_AddParagraph = 41;
var historyitem_AutoShapes_SetShape = 42;
var historyitem_AutoShapes_SetTextPr = 43;
var historyitem_AutoShapes_SetDefaultTextRectStyle = 44;
var historyitem_AutoShapes_SetFill = 45;
var historyitem_AutoShapes_SetFType = 46;
var historyitem_AutoShapes_SetFgColor = 47;
var historyitem_AutoShapes_SetBgColor = 48;
var historyitem_AutoShapes_SetUniFill = 49;
var historyitem_AutoShapes_SetUniLine = 50;
var historyitem_AutoShapes_SetLineWidth = 51;
var historyitem_AutoShapes_RecalculateAfterParagraphAddRedo = 52;
var historyitem_AutoShapes_RecalculateAfterParagraphAddUndo = 53;
var historyitem_AutoShapes_SetTransparent = 54;
var historyitem_AutoShapes_RecalculateBrushRedo = 55;
var historyitem_AutoShapes_RecalculateBrushUndo = 56;
var historyitem_AutoShapes_AddToSpTree = 57;
var historyitem_AutoShapes_DeleteDrawingBase = 58;
var historyitem_AutoShapes_VerticalAlign = 59;
var historyitem_AutoShapes_Vert = 60;
var historyitem_AutoShapes_GroupRecalculateUndo = 61;
var historyitem_AutoShapes_GroupRecalculateRedo = 62;
var historyitem_AutoShapes_AddColorMod = 63;
var historyitem_AutoShapes_RemoveFromSpTree = 64;
var historyitem_AutoShapes_SwapGraphicObjects = 65;
var historyitem_AutoShapes_TopInset = 66;
var historyitem_AutoShapes_RightInset = 67;
var historyitem_AutoShapes_LeftInset = 68;
var historyitem_AutoShapes_BottomInset = 69;
var historyitem_AutoShapes_Set_AutoShapeStyle = 70;
var historyitem_AutoShapes_Set_ImageBlipFill = 71;
var historyitem_AutoShapes_Set_AscChart  = 72;
var historyitem_AutoShapes_Set_PathStroke  = 73;
var historyitem_AutoShapes_Set_PathFill  = 74;
var historyitem_AutoShapes_Set_PathWH  = 75;
var historyitem_AutoShapes_SetTailEnd = 76;
var historyitem_AutoShapes_SetHeadEnd = 77;
var historyitem_AutoShapes_AddTitle = 78;
var historyitem_AutoShapes_AddXAxis = 79;
var historyitem_AutoShapes_AddYAxis = 80;
var historyitem_AutoShapes_AddChartGroup = 81;
var historyitem_AutoShapes_SetChartTitleLayout = 82;
var historyitem_AutoShapes_SetChartOverlay = 83;
var historyitem_AutoShapes_InitChart = 84;
var historyitem_AutoShapes_SetChartTitleType = 85;
var historyitem_AutoShapes_OnContentRecalculateUndo = 86;
var historyitem_AutoShapes_OnContentRecalculateRedo = 87;
var historyitem_AutoShapes_GeometryAddPreset = 88;
var historyitem_AutoShapes_AddToGroupSpTreeToPos = 89;
var historyitem_AutoShapes_GroupRecalculateArrGraphicObjectsUndo = 90;
var historyitem_AutoShapes_GroupRecalculateArrGraphicObjectsRedo = 91;
var historyitem_AutoShapes_RecalculateAfterInit2Chart = 92;
var historyitem_AutoShapes_GroupRecalculateAfterLoad = 93;




















































var historyitem_Comment_Add = 1;
var historyitem_Comment_Remove = 2;
var historyitem_Comment_Change = 3;

var historyitem_AutoFilter_Add		= 1;
var historyitem_AutoFilter_Sort		= 2;
var historyitem_AutoFilter_Empty	= 3;
var historyitem_AutoFilter_ApplyDF	= 4;
var historyitem_AutoFilter_ApplyMF	= 5;
var historyitem_AutoFilter_Move     = 6;


// Типы изменений в классе CDocumentContent
var historyitem_DocumentContent_AddItem     = 1; // Добавляем элемент в документ
var historyitem_DocumentContent_RemoveItem  = 2; // Удаляем элемент из документа

// Типы изменений в классе ParaTextPr
var historyitem_TextPr_Change     =  1; // Изменяем настройку
var historyitem_TextPr_Bold       =  2; // Изменяем жирность
var historyitem_TextPr_Italic     =  3; // Изменяем наклонность
var historyitem_TextPr_Strikeout  =  4; // Изменяем зачеркивание текста
var historyitem_TextPr_Underline  =  5; // Изменяем подчеркивание текста
var historyitem_TextPr_FontFamily =  6; // Изменяем имя шрифта
var historyitem_TextPr_FontSize   =  7; // Изменяем размер шрифта
var historyitem_TextPr_Color      =  8; // Изменяем цвет текста
var historyitem_TextPr_VertAlign  =  9; // Изменяем вертикальное прилегание
var historyitem_TextPr_HighLight  = 10; // Изменяем выделение текста
var historyitem_TextPr_RStyle     = 11; // Изменяем стиль текста
var historyitem_TextPr_Spacing    = 12; // Изменяем расстояние между символами
var historyitem_TextPr_DStrikeout = 13; // Изменяем двойное зачеркивание
var historyitem_TextPr_Caps       = 14; // Изменяем все буквы на прописные
var historyitem_TextPr_SmallCaps  = 15; // Изменяем все буквы на малые прописные
var historyitem_TextPr_Position   = 16; // Изменяем вертикальное положение
var historyitem_TextPr_Value      = 17; // Изменяем целиком все настройки
var historyitem_TextPr_RFonts     = 18; // Изменяем настройки шрифтов
var historyitem_TextPr_Lang       = 19; // Изменяем настройку языка
var historyitem_TextPr_ThemeFont  = 20; // Изменяем настройку языка
var historyitem_TextPr_UniFill    = 21; // Изменяем настройку языка



// Типы изменений в классе Paragraph
var historyitem_Paragraph_AddItem                   =  1; // Добавляем элемент в параграф
var historyitem_Paragraph_RemoveItem                =  2; // Удаляем элемент из параграфа
var historyitem_Paragraph_Numbering                 =  3; // Добавляем/Убираем/Изменяем нумерацию у параграфа
var historyitem_Paragraph_Align                     =  4; // Изменяем прилегание параграфа
var historyitem_Paragraph_Ind_First                 =  5; // Изменяем отспут первой строки
var historyitem_Paragraph_Ind_Right                 =  6; // Изменяем правый отступ
var historyitem_Paragraph_Ind_Left                  =  7; // Изменяем левый отступ
var historyitem_Paragraph_ContextualSpacing         =  8; // Изменяем свойство contextualSpacing
var historyitem_Paragraph_KeepLines                 =  9; // Изменяем свойство KeepLines
var historyitem_Paragraph_KeepNext                  = 10; // Изменяем свойство KeepNext
var historyitem_Paragraph_PageBreakBefore           = 11; // Изменяем свойство PageBreakBefore
var historyitem_Paragraph_Spacing_Line              = 12; // Изменяем свойство Spacing.Line
var historyitem_Paragraph_Spacing_LineRule          = 13; // Изменяем свойство Spacing.LineRule
var historyitem_Paragraph_Spacing_Before            = 14; // Изменяем свойство Spacing.Before
var historyitem_Paragraph_Spacing_After             = 15; // Изменяем свойство Spacing.After
var historyitem_Paragraph_Spacing_AfterAutoSpacing  = 16; // Изменяем свойство Spacing.AfterAutoSpacing
var historyitem_Paragraph_Spacing_BeforeAutoSpacing = 17; // Изменяем свойство Spacing.BeforeAutoSpacing
var historyitem_Paragraph_Shd_Value                 = 18; // Изменяем свойство Shd.Value
var historyitem_Paragraph_Shd_Color                 = 19; // Изменяем свойство Shd.Color
var historyitem_Paragraph_WidowControl              = 20; // Изменяем свойство WidowControl
var historyitem_Paragraph_Tabs                      = 21; // Изменяем табы у параграфа
var historyitem_Paragraph_PStyle                    = 22; // Изменяем стиль параграфа
var historyitem_Paragraph_DocNext                   = 23; // Изменяем указатель на следующий объект
var historyitem_Paragraph_DocPrev                   = 24; // Изменяем указатель на предыдущий объект
var historyitem_Paragraph_Parent                    = 25; // Изменяем указатель на родительский объект
var historyitem_Paragraph_Borders_Between           = 26; // Изменяем промежуточную границу
var historyitem_Paragraph_Borders_Bottom            = 27; // Изменяем верхнюю границу
var historyitem_Paragraph_Borders_Left              = 28; // Изменяем левую границу
var historyitem_Paragraph_Borders_Right             = 29; // Изменяем правую границу
var historyitem_Paragraph_Borders_Top               = 30; // Изменяем нижнюю границу
var historyitem_Paragraph_Pr                        = 31; // Изменяем свойства полностью
var historyitem_Paragraph_PresentationPr_Bullet     = 32; // Изменяем свойства нумерации у параграфа в презентации
var historyitem_Paragraph_PresentationPr_Level      = 33; // Изменяем уровень параграфа в презентациях
var historyitem_Paragraph_Recalculate_Text_Pr       = 34; // Изменяем уровень параграфа в презентациях


// Типы изменений в классе CTableId
var historyitem_TableId_Add   = 1; // Добавили новую ссылку в глобальную таблицу
var historyitem_TableId_Reset = 2; // Изменили Id ссылки


function CHistory(workbook)
{
	this.workbook = workbook;
    this.Index    = -1;
	this.SavePoint = null;
    this.Points   = [];
	this.CurPoint = null;
	this.IsModify = false;
    this.TurnOffHistory = 0;
	this.Transaction = 0;
}
CHistory.prototype =
{
    Clear : function()
    {
        this.Index         = -1;
		this.SavePoint = null;
        this.Points.length = 0;
		this.CurPoint = null;
		this.IsModify = false;
		this.TurnOffHistory = 0;
		this.Transaction = 0;
		this._sendCanUndoRedo();
    },
    Can_Undo : function()
    {
        if ( (null != this.CurPoint && this.CurPoint.Items.length > 0) || this.Index >= 0 )
            return true;

        return false;
    },

    Can_Redo : function()
    {
        if ( (null == this.CurPoint || 0 == this.CurPoint.Items.length) && this.Points.length > 0 && this.Index < this.Points.length - 1 )
            return true;

        return false;
    },

    Undo : function()
    {
        // Проверяем можно ли сделать Undo
        if ( true != this.Can_Undo() )
            return null;
		var bIsOn = false;

        if ( this.Index === this.Points.length - 1 )
            this.LastState = this.workbook.handlers.trigger("getSelectionState");

		this._checkCurPoint();

		var Point = this.Points[this.Index--];
		
		if(this.Is_On())
		{
			bIsOn = true;
			this.TurnOff();
		}
		/* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
		lockDraw(this.workbook);
		
		this.workbook.handlers.trigger("lockDraw");
		this.workbook.bUndoChanges = true;

		var isReInit = false;
		var isRedrawAll = true;
		var oCurWorksheet = this.workbook.getWorksheet(this.workbook.getActive());
		if(null != Point.nLastSheetId && Point.nLastSheetId != oCurWorksheet.getId())
			this.workbook.handlers.trigger("showWorksheet", Point.nLastSheetId);
        // Откатываем все действия в обратном порядке (относительно их выполенения)
        for ( var Index = Point.Items.length - 1; Index >= 0; Index-- )
        {
            var Item = Point.Items[Index];
            Item.Class.Undo( Item.Type, Item.Data, Item.SheetId );
			if (g_oUndoRedoWorksheet === Item.Class && historyitem_Worksheet_SetViewSettings === Item.Type)
				isReInit = true;
			if (g_oUndoRedoGraphicObjects === Item.Class)
				isRedrawAll = false;
        }
		gUndoInsDelCellsFlag = true;
		for(var i in Point.UpdateRigions)
			this.workbook.handlers.trigger("cleanCellCache", i, Point.UpdateRigions[i]);
		if(null != Point.SelectRange)
			this.workbook.handlers.trigger("setSelection", Point.SelectRange.clone(), /*validRange*/false);
		if ( Point.SelectionState != null )
			this.workbook.handlers.trigger("setSelectionState", Point.SelectionState);


		this._sendCanUndoRedo();

		this.workbook.bUndoChanges = false;
		if (isReInit)
			this.workbook.handlers.trigger("reInit");
		if (isRedrawAll)
			this.workbook.handlers.trigger("drawWS");
		else
			this.workbook.handlers.trigger("showDrawingObjects", true);
		if(isRealObject(this.lastDrawingObjects))
        {
            this.lastDrawingObjects.sendGraphicObjectProps();
            this.lastDrawingObjects = null;
        }
		/* возвращаем отрисовку. и перерисовываем ячейки с предварительным пересчетом */
		buildRecalc(this.workbook);
		unLockDraw(this.workbook);
		if(bIsOn)
			this.TurnOn();
    },
	RedoPrepare : function (oRedoObjectParam) {
		if (this.Is_On()) {
			oRedoObjectParam.bIsOn = true;
			this.TurnOff();
		}
		/* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
        lockDraw(this.workbook);
		
		this.workbook.handlers.trigger("lockDraw");
		this.workbook.bRedoChanges = true;
	},
	RedoAdd : function(oRedoObjectParam, Class, Type, sheetid, range, Data, LocalChange)
	{
		//todo сделать что-нибудь с Is_On
		var bNeedOff = false;
		if(false == this.Is_On())
		{
			this.TurnOn();
			bNeedOff = true;
		}
		this.Add(Class, Type, sheetid, range, Data, LocalChange);
		if(bNeedOff)
			this.TurnOff();
		Class.Redo( Type, Data, sheetid );
		if (g_oUndoRedoWorksheet === Class && historyitem_Worksheet_SetViewSettings === Type)
			oRedoObjectParam.bIsReInit = true;
	},
	RedoExecute : function(Point, oRedoObjectParam)
	{
		// Выполняем все действия в прямом порядке
        for ( var Index = 0; Index < Point.Items.length; Index++ )
        {
            var Item = Point.Items[Index];
            Item.Class.Redo( Item.Type, Item.Data, Item.SheetId );
			if (g_oUndoRedoWorksheet === Item.Class && historyitem_Worksheet_SetViewSettings === Item.Type)
				oRedoObjectParam.bIsReInit = true;
        }
        // Восстанавливаем состояние на следующую точку
        var State = null;
        if ( this.Index === this.Points.length - 1 )
            State = this.LastState;
        else
            State = this.Points[this.Index + 1].SelectionState;

		if ( isRealObject(State) )
			this.workbook.handlers.trigger("setSelectionState", State);
        if(isRealObject(this.lastDrawingObjects))
        {
            this.lastDrawingObjects.sendGraphicObjectProps();
            this.lastDrawingObjects = null;
        }
	},
	RedoEnd : function(Point, oRedoObjectParam)
	{
		if(null == Point)
		{
			this._checkCurPoint();
			Point = this.Points[this.Index];
		}
		if(null == Point)
			return;
		var oSelectRange = null;
		if(null != Point.SelectRangeRedo)
			oSelectRange = Point.SelectRangeRedo;
		else if(null != Point.SelectRange)
			oSelectRange = Point.SelectRange;
		for(var i in Point.UpdateRigions)
			this.workbook.handlers.trigger("cleanCellCache", i, Point.UpdateRigions[i]);
		if(null != oSelectRange)
			this.workbook.handlers.trigger("setSelection", oSelectRange.clone());
		//if (Point.SelectionState != null)
		//	this.workbook.handlers.trigger("setSelectionState", Point.SelectionState);
		
		this._sendCanUndoRedo();

		this.workbook.bRedoChanges = false;
		if (oRedoObjectParam.bIsReInit)
			this.workbook.handlers.trigger("reInit");
		this.workbook.handlers.trigger("drawWS");
		
		/* возвращаем отрисовку. и перерисовываем ячейки с предварительным пересчетом */
		buildRecalc(this.workbook);
		unLockDraw(this.workbook);
		if(oRedoObjectParam.bIsOn)
			this.TurnOn();
	},
    Redo : function()
	{
		// Проверяем можно ли сделать Redo
        if ( true != this.Can_Redo() )
            return null;

		var oRedoObjectParam = new Asc.RedoObjectParam();
		this.RedoPrepare(oRedoObjectParam);
		
		this.CurPoint = null;
        var Point = this.Points[++this.Index];
		
		var oCurWorksheet = this.workbook.getWorksheet(this.workbook.getActive());
		if(null != Point.nLastSheetId && Point.nLastSheetId != oCurWorksheet.getId())
			this.workbook.handlers.trigger("showWorksheet", Point.nLastSheetId);
		this.RedoExecute(Point, oRedoObjectParam);
		
		this.RedoEnd(Point, oRedoObjectParam);
	},
    Create_NewPoint : function()
    {
		if ( 0 !== this.TurnOffHistory || 0 !== this.Transaction )
            return;
		this._checkCurPoint();
        var Items = [];
		var UpdateRigions = new Object();
        var Time  = new Date().getTime();
		var oSelectRange = this.workbook.handlers.trigger("getSelection");
		this.CurPoint = {
            Items : Items, // Массив изменений, начиная с текущего момента
			UpdateRigions : UpdateRigions,
			nLastSheetId : null,
			SelectRange : oSelectRange,
			SelectRangeRedo : oSelectRange,
            Time  : Time,   // Текущее время
			SelectionState : this.workbook.handlers.trigger("getSelectionState")
        };
    },
	
    // Регистрируем новое изменение:
    // Class - объект, в котором оно произошло
    // Data  - сами изменения
    Add : function(Class, Type, sheetid, range, Data, LocalChange)
    {
        if ( 0 !== this.TurnOffHistory )
            return;

        if ( null == this.CurPoint )
            return;
		var oCurPoint = this.CurPoint;
        var Item =
        {
            Class : Class,
			Type  : Type,
			SheetId : sheetid,
			Range : null,
            Data  : Data,
			LocalChange : false
        };
		if(null != range)
			Item.Range = range.clone();
		if(null != LocalChange)
			Item.LocalChange = LocalChange;
		
        oCurPoint.Items.push( Item );
		if(null != range)
		{
			var updateRange = oCurPoint.UpdateRigions[sheetid];
			if(null != updateRange)
				updateRange.union2(range);
			else
				updateRange = range.clone();
			oCurPoint.UpdateRigions[sheetid] = updateRange;
		}
		oCurPoint.nLastSheetId = sheetid;
		if(1 == oCurPoint.Items.length)
			this._sendCanUndoRedo();
    },

	_sendCanUndoRedo : function()
	{
		this.workbook.handlers.trigger("setCanUndo", this.Can_Undo());
		this.workbook.handlers.trigger("setCanRedo", this.Can_Redo());
		if(this.IsModify != this.Is_Modified())
		{
			this.IsModify = !this.IsModify;
			this.workbook.handlers.trigger("setDocumentModified", this.IsModify);
		}
	},
	_checkCurPoint : function()
	{
		if(null != this.CurPoint && this.CurPoint.Items.length > 0)
		{
			// Создаем новую точку
			this.Points[++this.Index] = this.CurPoint;
			// Удаляем ненужные точки
			this.Points.length = this.Index + 1;
			this.CurPoint = null;
		}
	},
	SetSelection : function(range)
    {
        if ( 0 !== this.TurnOffHistory )
            return;

        if ( null == this.CurPoint )
            return;
        this.CurPoint.SelectRange = range;
    },
	SetSelectionRedo : function(range)
    {
        if ( 0 !== this.TurnOffHistory )
            return;

        if ( null == this.CurPoint )
            return;
        this.CurPoint.SelectRangeRedo = range;
    },
	GetSelection : function(range)
    {
		var oRes = null;
		if(null != this.CurPoint)
			oRes = this.CurPoint.SelectRange;
        return oRes;
    },
	GetSelectionRedo : function(range)
    {
		var oRes = null;
		if(null != this.CurPoint)
			oRes = this.CurPoint.SelectRangeRedo;
        return oRes;
    },
    TurnOff : function()
    {
        this.TurnOffHistory++;
    },

    TurnOn : function()
    {
        this.TurnOffHistory--;
		if(this.TurnOffHistory < 0)
			this.TurnOffHistory = 0;
    },
	
    StartTransaction : function()
    {
        this.Transaction++;
    },

    EndTransaction : function()
    {
        this.Transaction--;
		if(this.Transaction < 0)
			this.Transaction = 0;
    },

    Is_On : function()
    {
        return ( 0 === this.TurnOffHistory ? true : false ) ;
    },
	Save : function()
	{
		if(null != this.CurPoint && this.CurPoint.Items.length > 0)
			this.SavePoint = this.CurPoint;
		else if(this.Index >= 0 && this.Index < this.Points.length)
			this.SavePoint = this.Points[this.Index];
		if(true == this.IsModify)
		{
			this.IsModify = !this.IsModify;
			this.workbook.handlers.trigger("setDocumentModified", this.IsModify);
		}
	},
	Is_Modified : function()
    {
		if(null != this.CurPoint && this.CurPoint.Items.length > 0)
		{
			if(null != this.SavePoint)
				return this.CurPoint != this.SavePoint;
			else
				return true;
		}
		else if(this.Index >= 0 && this.Index < this.Points.length)
		{
			if(null != this.SavePoint)
				return this.Points[this.Index] != this.SavePoint;
			else
				return true;
		}
		else if(null != this.SavePoint)
			return true;
		return false;
    },
	GetSerializeArray : function()
	{
		var aRes = [];
		for(var i = 0; i <= this.Index; ++i)
		{
			var point = this.Points[i];
			for(var j = 0, length2 = point.Items.length; j < length2; ++j)
			{
				var elem = point.Items[j];
				if(true != elem.LocalChange)
					aRes.push(new UndoRedoItemSerializable(elem.Class, elem.Type, elem.SheetId, elem.Range, elem.Data));
			}
		}
		if(null != this.CurPoint)
		{
			for(var j = 0, length2 = this.CurPoint.Items.length; j < length2; ++j)
			{
				var elem = this.CurPoint.Items[j];
				if(true != elem.LocalChange)
					aRes.push(new UndoRedoItemSerializable(elem.Class, elem.Type, elem.SheetId, elem.Range, elem.Data));
			}
		}
		return aRes;
	},
	//функция, которая перемещает последнее действие на первую позицию(в текущей точке)
	ChangeActionsEndToStart : function()
	{
		if(null != this.CurPoint && this.CurPoint.Items.length > 0)
		{
			var endAction = this.CurPoint.Items.pop();
			this.CurPoint.Items.unshift(endAction);
		}
	}
};