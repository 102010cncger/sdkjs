"use strict";

// Класс Документ
//
// Логическая часть:
//     Content : Массив объектов (параграфы, таблицы, картинки, графика и т.д.)
//     SectPr  : Настройки секци (размеры, поля)
//               PgSz : размеры страницы
//                     W, H, Orient
//               PgMar: отступы страницы
//                      Top, Left, Right, Bottom, Header, Footer
//
// Графическая часть:

// TODO: Сейчас Paragraph.Recalculate_FastWholePAragraph работает только на добавлении текста, надо переделать
//       алгоритм определения изменений, чтобы данная функция работала и при других изменениях.

var Page_Width     = 210;
var Page_Height    = 297;

var X_Left_Margin   = 30;  // 3   cm
var X_Right_Margin  = 15;  // 1.5 cm
var Y_Bottom_Margin = 20;  // 2   cm
var Y_Top_Margin    = 20;  // 2   cm

var Y_Default_Header = 12.5; // 1.25 cm расстояние от верха страницы до верха верхнего колонтитула
var Y_Default_Footer = 12.5; // 1.25 cm расстояние от низа страницы до низа нижнего колонтитула

var X_Left_Field   = X_Left_Margin;
var X_Right_Field  = Page_Width  - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
var Y_Top_Field    = Y_Top_Margin;

var docpostype_Content        = 0x00;
var docpostype_FlowObjects    = 0x01;
var docpostype_HdrFtr         = 0x02;
var docpostype_DrawingObjects = 0x03;

var selectionflag_Common        = 0x000;
var selectionflag_Numbering     = 0x001;
var selectionflag_DrawingObject = 0x002;

var orientation_Portrait  = 0x00;
var orientation_Landscape = 0x01;

var search_Common              = 0x0000; // Поиск в простом тексте

var search_Header              = 0x0100; // Поиск в верхнем колонтитуле
var search_Footer              = 0x0200; // Поиск в нижнем колонтитуле

var search_HdrFtr_All          = 0x0001; // Поиск в колонтитуле, который находится на всех страницах
var search_HdrFtr_All_no_First = 0x0002; // Поиск в колонтитуле, который находится на всех страницах, кроме первой
var search_HdrFtr_First        = 0x0003; // Поиск в колонтитуле, который находится только на первой страниц
var search_HdrFtr_Even         = 0x0004; // Поиск в колонтитуле, который находится только на четных страницах
var search_HdrFtr_Odd          = 0x0005; // Поиск в колонтитуле, который находится только на нечетных страницах, включая первую
var search_HdrFtr_Odd_no_First = 0x0006; // Поиск в колонтитуле, который находится только на нечетных страницах, кроме первой

// Типы которые возвращают классы CParagraph и CTable после пересчета страницы
var recalcresult_NextElement = 0x00; // Пересчитываем следующий элемент
var recalcresult_PrevPage    = 0x01; // Пересчитываем заново предыдущую страницу
var recalcresult_CurPage     = 0x02; // Пересчитываем заново текущую страницу
var recalcresult_NextPage    = 0x03; // Пересчитываем следующую страницу
var recalcresult_NextLine    = 0x04; // Пересчитываем следующую строку
var recalcresult_CurLine     = 0x05; // Пересчитываем текущую строку
var recalcresult_CurPagePara = 0x06; // Специальный случай, когда мы встретили картинку в начале параграфа

// Типы которые возвращают классы CDocument и CDocumentContent после пересчета страницы
var recalcresult2_End      = 0x00; // Документ рассчитан до конца
var recalcresult2_NextPage = 0x01; // Рассчет нужно продолжить

var StartTime;

function CSelectedElement(Element, SelectedAll)
{
    this.Element     = Element;
    this.SelectedAll = SelectedAll;
}

function CSelectedContent()
{
    this.Elements = [];
    
    this.DrawingObjects = [];
    this.Comments       = [];
    
    this.HaveShape   = false;
    this.MoveDrawing = false; // Только для переноса автофигур
}

CSelectedContent.prototype =
{
    Reset : function()
    {
        this.Elements = [];

        this.DrawingObjects = [];
        this.Comments       = [];
        
        this.HaveShape = false;
    },

    Add : function(Element)
    {
        this.Elements.push( Element );
    },
    
    Set_MoveDrawing : function(Value)
    {
        this.MoveDrawing = Value;
    },
    
    On_EndCollectElements : function(LogicDocument)
    {
        // Теперь пройдемся по всем найденным элементам и выясним есть ли автофигуры и комментарии
        var Count = this.Elements.length;

        for (var Pos = 0; Pos < Count; Pos++)
        {
            var Element = this.Elements[Pos].Element;
            Element.Get_AllDrawingObjects(this.DrawingObjects);
            Element.Get_AllComments(this.Comments);
        }

        // Относительно картинок нас интересует только наличие автофигур с текстом.
        Count = this.DrawingObjects.length;
        for (var Pos = 0; Pos < Count; Pos++)
        {
            var DrawingObj = this.DrawingObjects[Pos];
            var ShapeType = DrawingObj.GraphicObj.getObjectType();

            if ( historyitem_type_Shape === ShapeType || historyitem_type_GroupShape === ShapeType )
            {
                this.HaveShape = true;
                break;
            }
        }
        
        // Если у комментария присутствует только начало или конец, тогда такой комментарий мы удяляем отсюда
        var Comments = {};
        Count = this.Comments.length;
        for (var Pos = 0; Pos < Count; Pos++)
        {
            var Element = this.Comments[Pos];
            
            var Id = Element.Comment.CommentId;
            if ( undefined === Comments[Id] )
                Comments[Id] = {};
            
            if ( true === Element.Comment.Start )
                Comments[Id].Start = Element.Paragraph; 
            else
                Comments[Id].End   = Element.Paragraph;
        }
        
        // Пробегаемся по найденным комментариям и удаляем те, у которых нет начала или конца
        var NewComments = [];
        for (var Id in Comments)
        {
            var Element = Comments[Id];
            
            var Para = null;
            if ( undefined === Element.Start && undefined !== Element.End )
                Para = Element.End;
            else if ( undefined !== Element.Start && undefined === Element.End )
                Para = Element.Start;
            else if ( undefined !== Element.Start && undefined !== Element.End )
                NewComments.push(Id);
            
            if (null !== Para)
            {
                var OldVal = Para.DeleteCommentOnRemove;
                Para.DeleteCommentOnRemove = false;
                Para.Remove_CommentMarks(Id);
                Para.DeleteCommentOnRemove = OldVal;
            }
        }
        
        // Новые комментарии мы дублируем и добавляем в список комментариев
        Count = NewComments.length;
        var Count2 = this.Comments.length;
        var DocumentComments = LogicDocument.Comments;        
        for (var Pos = 0; Pos < Count; Pos++)
        {
            var Id = NewComments[Pos];
            var OldComment = DocumentComments.Get_ById(Id)
            
            if (null !== OldComment)
            {
                var NewComment = OldComment.Copy();
                DocumentComments.Add( NewComment );
                editor.sync_AddComment( NewComment.Get_Id(), NewComment.Data );
                
                // поправим Id в самих элементах ParaComment
                for (var Pos2 = 0; Pos2 < Count2; Pos2++)
                {
                    var Element = this.Comments[Pos2].Comment;
                    if (Id === Element.CommentId)
                    {
                        Element.Set_CommentId(NewComment.Get_Id());
                    }
                }
            }
        }
    }
};

function CDocumentRecalculateState()
{
    this.Id         = null;

    this.PageIndex  = 0;
    this.Start      = true;
    this.StartIndex = 0;
    this.StartPage  = 0;
    
    this.NewSection   = false;
    this.MainStartPos = -1;
}

function Document_Recalculate_Page()
{
    var LogicDocument = editor.WordControl.m_oLogicDocument;
    LogicDocument.Recalculate_Page();
}

function CDocumentPage()
{
    this.Width   = 0;
    this.Height  = 0;
    this.Margins =
    {
        Left   : 0,
        Right  : 0,
        Top    : 0,
        Bottom : 0
    };

    this.Bounds = new CDocumentBounds(0,0,0,0);
    this.Pos    = 0;
    this.EndPos = 0;

    this.X      = 0;
    this.Y      = 0;
    this.XLimit = 0;
    this.YLimit = 0;

    this.EndSectionParas = [];
}

CDocumentPage.prototype =
{
    Update_Limits : function(Limits)
    {
        this.X      = Limits.X;
        this.XLimit = Limits.XLimit;
        this.Y      = Limits.Y;
        this.YLimit = Limits.YLimit;
    },

    Shift : function(Dx, Dy)
    {
        this.X      += Dx;
        this.XLimit += Dx;
        this.Y      += Dy;
        this.YLimit += Dy;

        this.Bounds.Shift( Dx, Dy );
    },

    Check_EndSectionPara : function(Element)
    {
        var Count = this.EndSectionParas.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            if ( Element === this.EndSectionParas[Index] )
                return true;
        }

        return false;
    },
    
    Copy : function()
    {
        var NewPage = new CDocumentPage();

        NewPage.Width  = this.Width;
        NewPage.Height = this.Height;

        NewPage.Margins.Left   = this.Margins.Left;
        NewPage.Margins.Right  = this.Margins.Right;
        NewPage.Margins.Top    = this.Margins.Top;
        NewPage.Margins.Bottom = this.Margins.Bottom;

        NewPage.Bounds.Left   = this.Bounds.Left;
        NewPage.Bounds.Right  = this.Bounds.Right;
        NewPage.Bounds.Top    = this.Bounds.Top;
        NewPage.Bounds.Bottom = this.Bounds.Bottom;        
        
        NewPage.Pos    = this.Pos;
        NewPage.EndPos = this.EndPos;

        NewPage.X      = this.X;
        NewPage.Y      = this.Y;
        NewPage.XLimit = this.XLimit;
        NewPage.YLimit = this.YLimit;
        
        return NewPage;
    }
};

function CStatistics(LogicDocument)
{
    this.LogicDocument = LogicDocument;

    this.Id = null;

    this.StartPos = 0;
    this.CurPage  = 0;

    this.Pages           = 0;
    this.Words           = 0;
    this.Paragraphs      = 0;
    this.SymbolsWOSpaces = 0;
    this.SymbolsWhSpaces = 0;
}

CStatistics.prototype =
{
//-----------------------------------------------------------------------------------
// Функции для запуска и остановки сбора статистики
//-----------------------------------------------------------------------------------
    Start : function()
    {
        this.StartPos = 0;
        this.CurPage  = 0;

        this.Pages           = 0;
        this.Words           = 0;
        this.Paragraphs      = 0;
        this.SymbolsWOSpaces = 0;
        this.SymbolsWhSpaces = 0;

        this.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Statistics_OnPage()}, 1);
        this.Send();
    },

    Next : function(StartPos, CurPage)
    {
        clearTimeout( this.Id );

        this.StartPos = StartPos;
        this.CurPage  = CurPage;

        this.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Statistics_OnPage()}, 1);
        this.Send();
    },

    Stop : function()
    {
        if ( null != this.Id )
        {
            this.Send();
            clearTimeout( this.Id );
            this.Id = null;

            editor.sync_GetDocInfoEndCallback();
        }
    },

    Send : function()
    {
        var Stats =
        {
            PageCount      : this.Pages,
            WordsCount     : this.Words,
            ParagraphCount : this.Paragraphs,
            SymbolsCount   : this.SymbolsWOSpaces,
            SymbolsWSCount : this.SymbolsWhSpaces
        };

        editor.sync_DocInfoCallback( Stats );
    },
//-----------------------------------------------------------------------------------
// Функции для пополнения статистики
//-----------------------------------------------------------------------------------
    Add_Paragraph : function (Count)
    {
        if ( "undefined" != typeof( Count ) )
            this.Paragraphs += Count;
        else
            this.Paragraphs++;
    },

    Add_Word : function(Count)
    {
        if ( "undefined" != typeof( Count ) )
            this.Words += Count;
        else
            this.Words++;
    },

    Add_Page : function(Count)
    {
        if ( "undefined" != typeof( Count ) )
            this.Pages += Count;
        else
            this.Pages++;
    },

    Add_Symbol : function(bSpace)
    {
        this.SymbolsWhSpaces++;
        if ( true != bSpace )
            this.SymbolsWOSpaces++;
    }
};

function CDocumentRecalcInfo()
{
    this.FlowObject                = null;   // Текущий float-объект, который мы пересчитываем
    this.FlowObjectPageBreakBefore = false;  // Нужно ли перед float-объектом поставить pagebreak
    this.FlowObjectPage            = 0;      // Количество обработанных страниц
    this.FlowObjectElementsCount   = 0;      // Количество элементов подряд идущих в рамке (только для рамок)
    this.RecalcResult              = recalcresult_NextElement;

    this.WidowControlParagraph     = null;   // Параграф, который мы пересчитываем из-за висячих строк
    this.WidowControlLine          = -1;     // Номер строки, перед которой надо поставить разрыв страницы
    this.WidowControlReset         = false;  //

    this.KeepNextParagraph         = null;    // Параграф, который надо пересчитать из-за того, что следующий начался с новой страницы

    this.FrameRecalc               = false;  // Пересчитываем ли рамку
}

CDocumentRecalcInfo.prototype =
{
    Reset : function()
    {
        this.FlowObject                = null;
        this.FlowObjectPageBreakBefore = false;
        this.FlowObjectPage            = 0;
        this.FlowObjectElementsCount   = 0;
        this.RecalcResult              = recalcresult_NextElement;

        this.WidowControlParagraph     = null;
        this.WidowControlLine          = -1;
        this.WidowControlReset         = false;

        this.KeepNextParagraph         = null;
    },

    // Проверяем, можно ли начать пересчет какого-либо элемента
    Can_RecalcObject : function()
    {
        if ( null === this.FlowObject && null === this.WidowControlParagraph && null === this.KeepNextParagraph )
            return true;

        return false;
    },

    Set_FlowObject : function(Object, RelPage, RecalcResult, ElementsCount)
    {
        this.FlowObject              = Object;
        this.FlowObjectPage          = RelPage;
        this.FlowObjectElementsCount = ElementsCount;
        this.RecalcResult            = RecalcResult;
    },

    Check_FlowObject : function(FlowObject)
    {
        if ( FlowObject === this.FlowObject )
            return true;

        return false;
    },

    Set_PageBreakBefore : function(Value)
    {
        this.FlowObjectPageBreakBefore = Value;
    },

    Is_PageBreakBefore : function()
    {
        return this.FlowObjectPageBreakBefore;
    },

    Set_WidowControl : function(Paragraph, Line)
    {
        this.WidowControlParagraph = Paragraph;
        this.WidowControlLine      = Line;
    },

    Check_WidowControl : function(Paragraph, Line)
    {
        if ( Paragraph === this.WidowControlParagraph && Line === this.WidowControlLine )
            return true;

        return false;
    },

    Set_KeepNext : function(Paragraph)
    {
        this.KeepNextParagraph = Paragraph;
    },

    Check_KeepNext : function(Paragraph)
    {
        if ( Paragraph === this.KeepNextParagraph )
            return true;

        return false;
    },

    Reset_WidowControl : function()
    {
        this.WidowControlReset = true;
    },


    Set_FrameRecalc  : function(Value)
    {
        this.FrameRecalc = Value;
    }
};

function CDocument(DrawingDocument)
{
    this.History   = History;
    History.Document = this;

    // Создаем глобальные объекты, необходимые для совместного редактирования
    this.IdCounter = g_oIdCounter;
    this.TableId = g_oTableId;
    this.CollaborativeEditing = null;
    if (typeof CollaborativeEditing !== "undefined")
        this.CollaborativeEditing = CollaborativeEditing;
    //------------------------------------------------------------------------

    this.Id = g_oIdCounter.Get_NewId();

    this.StartPage = 0; // Для совместимости с CDocumentContent
    this.CurPage   = 0;

    this.StyleCounter = 0;
    this.NumInfoCounter = 0;

    // Сначала настраиваем размеры страницы и поля
    this.SectPr = new CSectionPr(this);
    this.SectionsInfo = new CDocumentSectionsInfo();

    this.Content = [];
    this.Content[0] = new Paragraph( DrawingDocument, this, 0, 0, 0, 0, 0 );
    this.Content[0].Set_DocumentNext( null );
    this.Content[0].Set_DocumentPrev( null );

    this.ContentLastChangePos = 0;

    this.CurPos  =
    {
        X          : 0,
        Y          : 0,
        ContentPos : 0, // в зависимости, от параметра Type: позиция в Document.Content
        RealX      : 0, // позиция курсора, без учета расположения букв
        RealY      : 0, // это актуально для клавиш вверх и вниз
        Type       : docpostype_Content
    };

    this.Selection =
    {
        Start    : false,
        Use      : false,
        StartPos : 0,
        EndPos   : 0,
        Flag     : selectionflag_Common,
        Data     : null,
        UpdateOnRecalc : false,
        DragDrop : { Flag : 0, Data : null }  // 0 - не drag-n-drop, и мы его проверяем, 1 - drag-n-drop, -1 - не проверять drag-n-drop 
    };

    // Здесь мы храним инфрмацию, связанную с разбивкой на страницы и самими страницами
    this.Pages = [];

    this.RecalcInfo = new CDocumentRecalcInfo();

    this.RecalcId   = 0; // Номер пересчета
    this.FullRecalc = new CDocumentRecalculateState();
    
    this.TurnOffRecalc          = false;
    this.TurnOffInterfaceEvents = false;

    this.Numbering = new CNumbering();
    this.Styles    = new CStyles();

    this.DrawingDocument = DrawingDocument;

    this.NeedUpdateTarget = false;

    this.ReindexStartPos = -1;

    // Класс для работы с колонтитулами
    this.HdrFtr = new CHeaderFooterController(this, this.DrawingDocument);

    // Класс для работы с поиском
    this.SearchInfo =
    {
        Id       : null,
        StartPos : 0,
        CurPage  : 0,
        String   : null
    };

    // Позция каретки
    this.TargetPos =
    {
        X       : 0,
        Y       : 0,
        PageNum : 0
    };

    this.CopyTextPr = null; // TextPr для копирования по образцу
    this.CopyParaPr = null; // ParaPr для копирования по образцу

    // Класс для работы со статискикой документа
    this.Statistics = new CStatistics( this );

    this.HighlightColor = null;

    this.Comments = new CComments();

    this.Lock = new CLock();

    this.m_oContentChanges = new CContentChanges(); // список изменений(добавление/удаление элементов)

    // Массив укзателей на все инлайновые графические объекты
    this.DrawingObjects = null;

    if (typeof CGraphicObjects !== "undefined")
        this.DrawingObjects = new CGraphicObjects(this, this.DrawingDocument, editor);
    this.theme          = GenerateDefaultTheme(this);
    this.clrSchemeMap   = GenerateDefaultColorMap();

    // Класс для работы с поиском и заменой в документе
    this.SearchEngine = null;
    if (typeof CDocumentSearch !== "undefined")
        this.SearchEngine = new CDocumentSearch();

    // Параграфы, в которых есть ошибки в орфографии (объект с ключом - Id параграфа)
    this.Spelling = new CDocumentSpelling();

    // Дополнительные настройки
    this.UseTextShd = true; // Использовать ли заливку текста

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

var selected_None              = -1;
var selected_DrawingObject     = 0;
var selected_DrawingObjectText = 1;

function CSelectedElementsInfo()
{
    this.m_bTable          = false; // Находится курсор или выделение целиком в какой-нибудь таблице
    this.m_bMixedSelection = false; // Попадает ли в выделение одновременно несколько элементов
    this.m_nDrawing        = selected_None;
    this.m_pParagraph      = null;  // Параграф, в котором находится выделение
    this.m_oMath           = null;  // Формула, в которой находится выделение

    this.Reset = function()
    {
        this.m_bSelection      = false;
        this.m_bTable          = false;
        this.m_bMixedSelection = false;
        this.m_nDrawing        = -1;
    };

    this.Set_Paragraph = function(Para)
    {
        this.m_pParagraph = Para;
    };

    this.Set_Math = function(Math)
    {
        this.m_oMath = Math;
    };

    this.Get_Paragraph = function()
    {
        return this.m_pParagraph;
    };

    this.Get_Math = function()
    {
        return this.m_oMath;
    };

    this.Set_Table = function()
    {
        this.m_bTable = true;
    };

    this.Set_Drawing = function(nDrawing)
    {
        this.m_nDrawing = nDrawing;
    };

    this.Is_DrawingObjSelected = function()
    {
        return ( this.m_nDrawing === selected_DrawingObject ? true : false );
    };

    this.Set_MixedSelection = function()
    {
        this.m_bMixedSelection = true;
    };

    this.Is_InTable = function()
    {
        return this.m_bTable;
    };

    this.Is_MixedSelection = function()
    {
        return this.m_bMixedSelection;
    };
}

CDocument.prototype =
{
    // Проводим начальные действия, исходя из Документа
    Init : function()
    {

    },

    Get_Id : function()
    {
        return this.Id;
    },

    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    On_EndLoad : function()
    {
        // Обновляем информацию о секциях
        this.Update_SectionsInfo();
        
        // Проверяем последний параграф на наличие секции 
        this.Check_SectionLastParagraph();
        
        // Заполняем массив с ZIndex для всех автофигур документа
        if(null != this.DrawingObjects)
            this.DrawingObjects.addToZIndexManagerAfterOpen();
                
        // Перемещаем курсор в начало документа
        this.Cursor_MoveToStartPos( false );
    },
    
    Add_TestDocument : function()
    {
        this.Content = [];
        var Text = ["Comparison view helps you track down memory leaks, by displaying which objects have been correctly cleaned up by the garbage collector. Generally used to record and compare two (or more) memory snapshots of before and after an operation. The idea is that inspecting the delta in freed memory and reference count lets you confirm the presence and cause of a memory leak.", "Containment view provides a better view of object structure, helping us analyse objects referenced in the global namespace (i.e. window) to find out what is keeping them around. It lets you analyse closures and dive into your objects at a low level.", "Dominators view helps confirm that no unexpected references to objects are still hanging around (i.e that they are well contained) and that deletion/garbage collection is actually working."];        
        var ParasCount = 50;
        var RunsCount = Text.length;
        for (var ParaIndex = 0; ParaIndex < ParasCount; ParaIndex++)
        {
            var Para = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
            //var Run = new ParaRun(Para);
            for (var RunIndex = 0; RunIndex < RunsCount; RunIndex++)
            {
                
                var String = Text[RunIndex];
                var StringLen = String.length;
                for (var TextIndex = 0; TextIndex < StringLen; TextIndex++)
                {
                    var Run = new ParaRun(Para);
                    var TextElement = String[TextIndex];
                    
                    var Element = (TextElement !== " " ? new ParaText(TextElement) : new ParaSpace() );
                    Run.Add_ToContent(TextIndex, Element, false);
                    Para.Add_ToContent(0, Run);
                }
                
                
            }
            //Para.Add_ToContent(0, Run);
            this.Internal_Content_Add(this.Content.length, Para);
        }

        var RecalculateData =
        {
            Inline : { Pos : 0, PageNum : 0 },
            Flow   : [],
            HdrFtr : [],
            Drawings: {
                All: true,
                Map:{}
            }
        };
        this.Recalculate(false, false, RecalculateData);
    },

    LoadEmptyDocument : function()
    {
        this.DrawingDocument.TargetStart();
        this.Recalculate();

        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },

    Set_CurrentElement : function(Index, bUpdateStates)
    {
        var OldDocPosType = this.CurPos.Type;

        var ContentPos = Math.max( 0, Math.min( this.Content.length - 1, Index ) );

        this.CurPos.Type = docpostype_Content;
        this.CurPos.ContentPos = Math.max( 0, Math.min( this.Content.length - 1, Index ) );

        if ( true === this.Content[ContentPos].Is_SelectionUse() )
        {
            this.Selection.Use      = true;
            this.Selection.StartPos = ContentPos;
            this.Selection.EndPos   = ContentPos;
        }
        else
            this.Selection_Remove();

        if ( false != bUpdateStates )
        {
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
            this.Document_UpdateSelectionState();
        }

        if ( docpostype_HdrFtr === OldDocPosType )
        {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
    },

    Is_ThisElementCurrent : function()
    {
        return true;
    },

    Update_ConentIndexing : function()
    {
        if (-1 !== this.ReindexStartPos)
        {
            for (var Index = this.ReindexStartPos, Count = this.Content.length; Index < Count; Index++)
            {
                this.Content[Index].Index = Index;
            }

            this.ReindexStartPos = -1;
        }
    },

    protected_ReindexContent : function(StartPos)
    {
        if (-1 === this.ReindexStartPos || this.ReindexStartPos > StartPos)
            this.ReindexStartPos = StartPos;
    },

    Get_PageContentStartPos : function (PageIndex, ElementIndex)
    {
        if (undefined === ElementIndex && undefined !== this.Pages[PageIndex])
            ElementIndex = this.Pages[PageIndex].Pos;
        
        var SectPr = this.SectionsInfo.Get_SectPr(ElementIndex).SectPr;

        var Y      = SectPr.PageMargins.Top;
        var YLimit = SectPr.PageSize.H - SectPr.PageMargins.Bottom;
        var X      = SectPr.PageMargins.Left;
        var XLimit = SectPr.PageSize.W - SectPr.PageMargins.Right;

        var HdrFtrLine = this.HdrFtr.Get_HdrFtrLines( PageIndex );

        var YHeader = HdrFtrLine.Top;
        if ( null !== YHeader && YHeader > Y )
            Y = YHeader;

        var YFooter = HdrFtrLine.Bottom;
        if ( null !== YFooter && YFooter < YLimit )
            YLimit = YFooter;

        return { X : X, Y : Y, XLimit : XLimit, YLimit : YLimit };
    },

    Get_PageLimits : function(PageIndex)
    {
        var Index = ( undefined !== this.Pages[PageIndex] ? this.Pages[PageIndex].Pos : 0 );
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;

        var W = SectPr.Get_PageWidth();
        var H = SectPr.Get_PageHeight();
        
        return { X : 0, Y : 0, XLimit : W, YLimit : H };
    },

    Get_PageFields : function(PageIndex)
    {
        var Index = ( undefined !== this.Pages[PageIndex] ? this.Pages[PageIndex].Pos : 0 );
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;

        var Y      = SectPr.PageMargins.Top;
        var YLimit = SectPr.PageSize.H - SectPr.PageMargins.Bottom;
        var X      = SectPr.PageMargins.Left;
        var XLimit = SectPr.PageSize.W - SectPr.PageMargins.Right;
        
        return { X : X, Y : Y, XLimit : XLimit, YLimit : YLimit };
    },

    Get_Theme : function()
    {
        return this.theme;
    },

    Get_ColorMap: function()
    {
        return this.clrSchemeMap;
    },

    /**
     * Данная функция предназначена для отключения пересчета. Это может быть полезно, т.к. редактор всегда запускает пересчет после каждого действия.
     *
     */
    TurnOff_Recalculate : function()
    {
        this.TurnOffRecalc = true;
    },

    /**
     * Включаем пересчет, если он был отключен
     *
     * @param {bool} bRecalculate Запускать ли пересчет
     */
    TurnOn_Recalculate : function(bRecalculate)
    {
        this.TurnOffRecalc = false;

        if (bRecalculate)
            this.Recalculate();
    },

    // Пересчет содержимого Документа
    Recalculate : function(bOneParagraph, bRecalcContentLast, _RecalcData)
    {
        StartTime = new Date().getTime();

        if ( true === this.TurnOffRecalc )
            return;

        // Останавливаем поиск
        if ( false != this.SearchEngine.ClearOnRecalc )
        {
            var bOldSearch = ( this.SearchEngine.Count > 0 ? true : false );

            this.SearchEngine.Clear();

            if ( true === bOldSearch )
            {
                editor.sync_SearchEndCallback();

                this.DrawingDocument.ClearCachePages();
                this.DrawingDocument.FirePaint();
            }
        }

        // Обновляем позицию курсора
        this.NeedUpdateTarget = true;

        // Увеличиваем номер пересчета
        this.RecalcId++;

        // Если задан параметр _RecalcData, тогда мы не можем ориентироваться на историю
        if ( undefined === _RecalcData )
        {
            // Проверяем можно ли сделать быстрый пересчет
            var SimpleChanges = History.Is_SimpleChanges();
            if ( 1 === SimpleChanges.length )
            {
                var Run  = SimpleChanges[0].Class;
                var Para = Run.Paragraph;

                var Res  = Para.Recalculate_FastRange( SimpleChanges );
                if ( -1 !== Res )
                {
                    // Если изменения произошли на последней странице параграфа, и за данным параграфом следовал
                    // пустой параграф с новой секцией, тогда его тоже надо пересчитать.
                    if ( Res === Para.Get_StartPage_Absolute() + Para.Pages.length - 1 )
                    {
                        var NextElement = Para.Get_DocumentNext();
                        if (null !== NextElement && true === this.Pages[Res].Check_EndSectionPara(NextElement))
                        {
                            var LastVisibleBounds = Para.Get_LastRangeVisibleBounds();

                            var ___X = LastVisibleBounds.X + LastVisibleBounds.W;
                            var ___Y = LastVisibleBounds.Y;

                            // Делаем предел по X минимум 10 мм, чтобы всегда было видно элемент разрыва секции
                            NextElement.Reset(___X, ___Y, Math.max(___X + 10, NextElement.XLimit), 10000, Res);
                            NextElement.Recalculate_Page(Res);
                        }
                    }

                    // Перерисуем страницу, на которой произошли изменения
                    this.DrawingDocument.OnRecalculatePage( Res, this.Pages[Res] );
                    this.DrawingDocument.OnEndRecalculate( false, true );

                    History.Reset_RecalcIndex();

                    return;
                }
            }

            // TODO: Тут надо вставить заглушку, что если у нас в долгом пересчете находится страница <= PageIndex + 1,
            //       по отношению к данной, тогда не надо делать быстрый пересчет.
            if (SimpleChanges.length >= 1)
            {
                var Run  = SimpleChanges[0].Class;
                var Para = Run.Paragraph;

                var FastPages = Para.Recalculate_FastWholeParagraph();
                var FastPagesCount = FastPages.length;

                if (FastPagesCount > 0)
                {
                    // Если изменения произошли на последней странице параграфа, и за данным параграфом следовал
                    // пустой параграф с новой секцией, тогда его тоже надо пересчитать.
                    var NextElement = Para.Get_DocumentNext();
                    var LastFastPage = FastPages[FastPagesCount - 1];
                    if (null !== NextElement && true === this.Pages[LastFastPage].Check_EndSectionPara(NextElement))
                    {
                        var LastVisibleBounds = Para.Get_LastRangeVisibleBounds();

                        var ___X = LastVisibleBounds.X + LastVisibleBounds.W;
                        var ___Y = LastVisibleBounds.Y;

                        // Делаем предел по X минимум 10 мм, чтобы всегда было видно элемент разрыва секции
                        NextElement.Reset(___X, ___Y, Math.max(___X + 10, NextElement.XLimit), 10000, LastFastPage);
                        NextElement.Recalculate_Page(LastFastPage);
                    }

                    for (var Index = 0; Index < FastPagesCount; Index++)
                    {
                        var PageIndex = FastPages[Index];
                        this.DrawingDocument.OnRecalculatePage(PageIndex, this.Pages[PageIndex]);
                    }

                    this.DrawingDocument.OnEndRecalculate( false, true );
                    History.Reset_RecalcIndex();
                    return;
                }
            }
        }

        //console.log( "Long Recalc " );

        // Очищаем данные пересчета
        this.RecalcInfo.Reset();

        var ChangeIndex = 0;
        var MainChange = false;  

        // Получаем данные об произошедших изменениях
        var RecalcData = ( undefined === _RecalcData ? History.Get_RecalcData() : _RecalcData );

        History.Reset_RecalcIndex();

        this.DrawingObjects.recalculate_(RecalcData.Drawings);
        this.DrawingObjects.recalculateText_(RecalcData.Drawings);

        // 1. Пересчитываем все автофигуры, которые нужно пересчитать. Изменения в них ни на что не влияют.
        for ( var GraphIndex = 0; GraphIndex < RecalcData.Flow.length; GraphIndex++ )
        {
            RecalcData.Flow[GraphIndex].recalculateDocContent();
        }

        // 2. Просмотрим все колонтитулы, которые подверглись изменениям. Найдем стартовую страницу, с которой надо
        //    запустить пересчет.

        var SectPrIndex = -1;
        for ( var HdrFtrIndex = 0; HdrFtrIndex < RecalcData.HdrFtr.length; HdrFtrIndex++ )
        {
            var HdrFtr = RecalcData.HdrFtr[HdrFtrIndex];            
            var FindIndex = this.SectionsInfo.Find_ByHdrFtr( HdrFtr );
            
            if ( -1 === FindIndex )
                continue;
            
            // Колонтитул может быть записан в данной секции, но в ней не использоваться. Нам нужно начинать пересчет
            // с места использования данного колонтитула.
            
            var SectPr = this.SectionsInfo.Get_SectPr2( FindIndex).SectPr;
            var HdrFtrInfo = SectPr.Get_HdrFtrInfo( HdrFtr );
            
            if ( null !== HdrFtrInfo )
            {
                var bHeader = HdrFtrInfo.Header;
                var bFirst  = HdrFtrInfo.First;
                var bEven   = HdrFtrInfo.Even;
                
                var CheckSectIndex = -1;

                if ( true === bFirst )
                {
                    var CurSectIndex = FindIndex;
                    var SectCount = this.SectionsInfo.Elements.length;

                    while ( CurSectIndex < SectCount )
                    {
                        var CurSectPr = this.SectionsInfo.Get_SectPr2(CurSectIndex).SectPr;

                        if ( FindIndex === CurSectIndex || null === CurSectPr.Get_HdrFtr( bHeader, bFirst, bEven ) )
                        {
                            if ( true === CurSectPr.Get_TitlePage() )
                            {
                                CheckSectIndex = CurSectIndex;
                                break;
                            }

                        }
                        else
                        {
                            // Если мы попали сюда, значит данный колонтитул нигде не используется
                            break;
                        }

                        CurSectIndex++;
                    }
                }
                else if ( true === bEven )
                {
                    if ( true === EvenAndOddHeaders )
                        CheckSectIndex = FindIndex;
                }
                else
                {
                    CheckSectIndex = FindIndex;
                }
                
                if ( -1 !== CheckSectIndex && ( -1 === SectPrIndex || CheckSectIndex < SectPrIndex ) )
                    SectPrIndex = CheckSectIndex;
            }
        }
        
        if ( -1 === RecalcData.Inline.Pos && -1 === SectPrIndex )
        {
            // Никаких изменений не было ни с самим документом, ни секциями
            ChangeIndex = -1;
            RecalcData.Inline.PageNum = 0;
        }
        else if ( -1 === RecalcData.Inline.Pos )
        {
            // Были изменения только внутри секций
            MainChange = false;
            
            // Выставляем начало изменений на начало секции
            ChangeIndex = ( 0 === SectPrIndex ? 0 : this.SectionsInfo.Get_SectPr2( SectPrIndex - 1).Index + 1 );
            RecalcData.Inline.PageNum = 0;
        }
        else if ( -1 === SectPrIndex )
        {
            // Изменения произошли только внутри основоного документа
            MainChange = true;

            ChangeIndex = RecalcData.Inline.Pos;            
        }
        else
        {
            // Изменения произошли и внутри документа, и внутри секций. Смотрим на более ранюю точку начала изменений
            // для секций и основоной части документа.
            MainChange = true;

            ChangeIndex = RecalcData.Inline.Pos;

            var ChangeIndex2 = ( 0 === SectPrIndex ? 0 : this.SectionsInfo.Get_SectPr2( SectPrIndex - 1).Index + 1 );
            
            if ( ChangeIndex2 <= ChangeIndex )
            {
                ChangeIndex = ChangeIndex2;
                RecalcData.Inline.PageNum = 0;
            }
        }

        if ( ChangeIndex < 0 )
        {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
            return;
        }
        else if ( ChangeIndex >= this.Content.length )
            ChangeIndex = this.Content.length - 1;

        // Найдем начальную страницу, с которой мы начнем пересчет
        var StartPage  = 0;
        var StartIndex = 0;

        var ChangedElement = this.Content[ChangeIndex];
        if ( ChangedElement.Pages.length > 0 && -1 !== ChangedElement.Index && ChangedElement.Get_StartPage_Absolute() < RecalcData.Inline.PageNum - 1 )
        {
            StartIndex = ChangeIndex;
            StartPage  = RecalcData.Inline.PageNum - 1;
        }
        else
        {
            var PagesCount = this.Pages.length;
            for ( var PageIndex = 0; PageIndex < PagesCount; PageIndex++ )
            {
                if ( ChangeIndex > this.Pages[PageIndex].Pos )
                {
                    StartPage  = PageIndex;
                    StartIndex = this.Pages[PageIndex].Pos;
                }
                else
                    break;
            }

            if ( ChangeIndex === StartIndex && StartPage < RecalcData.Inline.PageNum )
                StartPage = RecalcData.Inline.PageNum - 1;
        }

        // Если у нас уже начался долгий пересчет, тогда мы его останавливаем, и запускаем новый с текущими параметрами.
        // Здесь возможен случай, когда мы долгий пересчет основной части документа останавливаем из-за пересчета 
        // колонтитулов, в этом случае параметр MainContentPos не меняется, и мы будем пересчитывать только колонтитулы
        // либо до страницы, на которой они приводят к изменению основную часть документа, либо до страницы, где 
        // остановился предыдущий пересчет.
        
        if ( null != this.FullRecalc.Id )
        {
            clearTimeout( this.FullRecalc.Id );
            this.FullRecalc.Id = null;
            this.DrawingDocument.OnEndRecalculate( false );

            if ( this.FullRecalc.StartIndex < StartIndex )
            {
                StartIndex = this.FullRecalc.StartIndex;
                StartPage  = this.FullRecalc.PageIndex;
            }
        }        

        // Определим, является ли данная страница первой в новой секции
        var bNewSection = ( 0 === StartPage ? true : false );
        if ( 0 !== StartPage )
        {
            var PrevStartIndex = this.Pages[StartPage - 1].Pos;
            var CurSectInfo  = this.SectionsInfo.Get_SectPr( StartIndex );
            var PrevSectInfo = this.SectionsInfo.Get_SectPr( PrevStartIndex );
            
            if ( PrevSectInfo !== CurSectInfo && (section_type_Continuous !== CurSectInfo.SectPr.Get_Type() || true !== CurSectInfo.SectPr.Compare_PageSize( PrevSectInfo.SectPr ) ) ) 
                bNewSection = true;
        }
        

        this.FullRecalc.PageIndex    = StartPage;
        this.FullRecalc.Start        = true;
        this.FullRecalc.StartIndex   = StartIndex;
        this.FullRecalc.StartPage    = StartPage;
        this.FullRecalc.NewSection   = bNewSection;
        
        // Если у нас произошли какие-либо изменения с основной частью документа, тогда начинаем его пересчитывать сразу,
        // а если изменения касались только секций, тогда пересчитываем основную часть документа только с того места, где
        // остановился предыдущий пересчет, либо с того места, где изменения секций приводят к пересчету документа.
        if ( true === MainChange )  
            this.FullRecalc.MainStartPos = StartIndex;

        this.DrawingDocument.OnStartRecalculate( StartPage );
        this.Recalculate_Page();
    },

    // bStart - флаг, который говорит, о том рассчитываем мы эту страницу первый раз или нет (за один общий пересчет)
    Recalculate_Page : function()
    {
        var PageIndex        = this.FullRecalc.PageIndex;
        var bStart           = this.FullRecalc.Start;
        var StartIndex       = this.FullRecalc.StartIndex;
        var bStartNewSection = this.FullRecalc.NewSection;

        var SectElement = this.SectionsInfo.Get_SectPr( StartIndex );
        
        var OldPage = ( undefined !== this.Pages[PageIndex] ? this.Pages[PageIndex] : null );
        
        if ( true === bStart )
        {
            this.Pages[PageIndex] = new CDocumentPage();
            this.Pages[PageIndex].Pos = StartIndex;

            if ( true === this.HdrFtr.Recalculate(PageIndex) )
                this.FullRecalc.MainStartPos = StartIndex;

            var SectPr = this.SectionsInfo.Get_SectPr(StartIndex).SectPr;

            this.Pages[PageIndex].Width          = SectPr.PageSize.W;
            this.Pages[PageIndex].Height         = SectPr.PageSize.H;
            this.Pages[PageIndex].Margins.Left   = SectPr.PageMargins.Left;
            this.Pages[PageIndex].Margins.Top    = SectPr.PageMargins.Top;
            this.Pages[PageIndex].Margins.Right  = SectPr.PageSize.W - SectPr.PageMargins.Right;
            this.Pages[PageIndex].Margins.Bottom = SectPr.PageSize.H - SectPr.PageMargins.Bottom;
        }

        var Count = this.Content.length;

        // Проверяем нужно ли пересчитывать основную часть документа на данной странице
        var MainStartPos = this.FullRecalc.MainStartPos;                
        if ( null !== OldPage && ( -1 === MainStartPos || MainStartPos > StartIndex ) )
        {
            if ( OldPage.EndPos >= Count - 1 && PageIndex - this.Content[Count - 1].Get_StartPage_Absolute() >= this.Content[Count - 1].Pages.length - 1 )
            {
                //console.log( "HdrFtr Recalc " + PageIndex );
                
                this.Pages[PageIndex] = OldPage;
                this.DrawingDocument.OnRecalculatePage( PageIndex, this.Pages[PageIndex] );

                this.Internal_CheckCurPage();
                this.DrawingDocument.OnEndRecalculate( true );
                this.DrawingObjects.onEndRecalculateDocument( this.Pages.length );

                if ( true === this.Selection.UpdateOnRecalc )
                {
                    this.Selection.UpdateOnRecalc = false;
                    this.DrawingDocument.OnSelectEnd();
                }

                this.FullRecalc.Id = null;
                this.FullRecalc.MainStartPos = -1;
                
                return;
            }
            else if ( undefined !== this.Pages[PageIndex + 1] )
            {
                //console.log( "HdrFtr Recalc " + PageIndex );
                
                // Переходим к следующей странице
                this.Pages[PageIndex] = OldPage;
                this.DrawingDocument.OnRecalculatePage( PageIndex, this.Pages[PageIndex] );

                this.FullRecalc.PageIndex  = PageIndex + 1;
                this.FullRecalc.Start      = true;
                this.FullRecalc.StartIndex = this.Pages[PageIndex + 1].Pos;
                this.FullRecalc.NewSection = false;

                var CurSectInfo  = this.SectionsInfo.Get_SectPr( this.Pages[PageIndex + 1].Pos );
                var PrevSectInfo = this.SectionsInfo.Get_SectPr( this.Pages[PageIndex].EndPos );

                if ( PrevSectInfo !== CurSectInfo )
                    this.FullRecalc.NewSection = true;

                if (window["NATIVE_EDITOR_ENJINE_SYNC_RECALC"] === true)
                {
                    if ( PageIndex + 1 > this.FullRecalc.StartPage + 2 )
                    {
                        if (window["native"]["WC_CheckSuspendRecalculate"]())
                            return;
                    }

                    this.Recalculate_Page();
                    return;
                }

                if ( PageIndex + 1 > this.FullRecalc.StartPage + 2 )
                {
                    this.FullRecalc.Id = setTimeout( Document_Recalculate_Page, 20 );
                }
                else
                    this.Recalculate_Page();

                return;
            }            
        }
        else
        {
            if ( true === bStart )
            {
                this.Pages.length = PageIndex + 1;

                this.DrawingObjects.createGraphicPage(PageIndex);
                this.DrawingObjects.resetDrawingArrays(PageIndex, this);
            }
        }                

        //console.log( "Regular Recalc " + PageIndex );

        var StartPos = this.Get_PageContentStartPos(PageIndex, StartIndex);
        
        var X      = StartPos.X;
        var StartY = StartPos.Y;
        var Y      = StartY;
        var YLimit = StartPos.YLimit;
        var XLimit = StartPos.XLimit;

        var Page = this.Pages[PageIndex];

        this.Pages[PageIndex].X      = X;
        this.Pages[PageIndex].XLimit = XLimit;
        this.Pages[PageIndex].Y      = Y;
        this.Pages[PageIndex].YLimit = YLimit;

        var bReDraw     = true;
        var bContinue   = false;
        var _PageIndex  = PageIndex;
        var _StartIndex = StartIndex;
        var _bStart     = false;
        var _bStartNewSection = false;

        var Index;
        for ( Index = StartIndex; Index < Count; Index++ )
        {
            // Пересчитываем элемент документа
            var Element = this.Content[Index];

            Element.TurnOff_RecalcEvent();

            var RecalcResult = recalcresult_NextElement;
            var bFlow = false;
            if ( type_Table === Element.GetType() && true != Element.Is_Inline() )
            {
                bFlow = true;
                if ( true === this.RecalcInfo.Can_RecalcObject() )
                {
                    if ( ( 0 === Index && 0 === PageIndex ) || Index != StartIndex || ( Index === StartIndex && true === bStartNewSection ) )
                    {
                        Element.Set_DocumentIndex( Index );
                        Element.Reset( X, Y, XLimit, YLimit, PageIndex );
                    }

                    var TempRecalcResult = Element.Recalculate_Page( PageIndex );
                    this.RecalcInfo.Set_FlowObject( Element, 0, TempRecalcResult, -1 );

                    var FlowTable = new CFlowTable( Element, PageIndex );
                    this.DrawingObjects.addFloatTable( FlowTable );

                    if ( 0 === FlowTable.PageController )
                        RecalcResult = recalcresult_CurPage;
                    else
                    {
                        RecalcResult = TempRecalcResult;
                        this.RecalcInfo.Reset();
                    }
                }
                else if ( true === this.RecalcInfo.Check_FlowObject(Element) )
                {
                    // Если у нас текущая страница совпадает с той, которая указана в таблице, тогда пересчитываем дальше
                    if ( Element.PageNum > PageIndex || ( this.RecalcInfo.FlowObjectPage <= 0 && Element.PageNum < PageIndex ) )
                    {
                        this.DrawingObjects.removeFloatTableById(PageIndex - 1, Element.Get_Id());
                        this.RecalcInfo.Set_PageBreakBefore(true);
                        RecalcResult = recalcresult_PrevPage;
                    }
                    else if ( Element.PageNum === PageIndex )
                    {
                        if ( true === this.RecalcInfo.Is_PageBreakBefore() )
                        {
                            // Добавляем начало таблицы в конец страницы так, чтобы не убралось ничего
                            Element.Set_DocumentIndex( Index );
                            Element.Reset( X, Page.Height, XLimit, Page.Height, PageIndex );
                            Element.Recalculate_Page( PageIndex );

                            this.RecalcInfo.FlowObjectPage++;
                            RecalcResult = recalcresult_NextPage;
                        }
                        else
                        {
                            if ( ( 0 === Index && 0 === PageIndex ) || Index != StartIndex )
                            {
                                Element.Set_DocumentIndex( Index );
                                Element.Reset( X, Y, XLimit, YLimit, PageIndex );
                            }

                            RecalcResult = Element.Recalculate_Page( PageIndex );
                            if ( (( 0 === Index && 0 === PageIndex ) || Index != StartIndex) && true != Element.Is_ContentOnFirstPage()  )
                            {
                                this.DrawingObjects.removeFloatTableById(PageIndex, Element.Get_Id());
                                this.RecalcInfo.Set_PageBreakBefore(true);
                                RecalcResult = recalcresult_CurPage;
                            }
                            else
                            {
                                this.RecalcInfo.FlowObjectPage++;

                                if ( recalcresult_NextElement === RecalcResult )
                                    this.RecalcInfo.Reset();
                            }
                        }
                    }
                    else
                    {
                        RecalcResult = Element.Recalculate_Page( PageIndex );
                        this.DrawingObjects.addFloatTable( new CFlowTable( Element, PageIndex ) );

                        if ( recalcresult_NextElement === RecalcResult )
                            this.RecalcInfo.Reset();
                    }
                }
                else
                {
                    // Пропускаем
                    RecalcResult = recalcresult_NextElement;
                }
            }
            else if ( type_Paragraph === Element.GetType() && true != Element.Is_Inline() )
            {
                bFlow = true;

                if ( true === this.RecalcInfo.Can_RecalcObject() )
                {
                    var FramePr = Element.Get_FramePr();

                    // Рассчитаем количество подряд идущих параграфов с одинаковыми FramePr
                    var FlowCount = 1;
                    for ( var TempIndex = Index + 1; TempIndex < Count; TempIndex++ )
                    {
                        var TempElement = this.Content[TempIndex];
                        if ( type_Paragraph === TempElement.GetType() && true != TempElement.Is_Inline() )
                        {
                            var TempFramePr = TempElement.Get_FramePr();
                            if ( true === FramePr.Compare( TempFramePr ) )
                                FlowCount++;
                            else
                                break;
                        }
                        else
                            break;
                    }

                    var Page_W = Page.Width;
                    var Page_H = Page.Height;

                    var Page_Field_L = Page.Margins.Left;
                    var Page_Field_R = Page.Margins.Right;
                    var Page_Field_T = Page.Margins.Top;
                    var Page_Field_B = Page.Margins.Bottom;

                    //--------------------------------------------------------------------------------------------------
                    // 1. Рассчитаем размер рамки
                    //--------------------------------------------------------------------------------------------------
                    var FrameH = 0;
                    var FrameW = -1;

                    var Frame_XLimit = FramePr.Get_W();
                    var Frame_YLimit = FramePr.Get_H();

                    if ( undefined === Frame_XLimit )
                        Frame_XLimit = Page_Field_R - Page_Field_L;

                    if ( undefined === Frame_YLimit )
                        Frame_YLimit = Page_H;
                    
                    for ( var TempIndex = Index; TempIndex < Index + FlowCount; TempIndex++ )
                    {
                        var TempElement = this.Content[TempIndex];
                        // Получим параметры расположения рамки
                        TempElement.Set_DocumentIndex( TempIndex );

                        if ( Index != TempIndex || ( true != this.RecalcInfo.FrameRecalc &&  ( ( 0 === Index && 0 === PageIndex ) || Index != StartIndex || ( Index === StartIndex && true === bStartNewSection ) ) ) )
                            TempElement.Reset( 0, FrameH, Frame_XLimit, Frame_YLimit, PageIndex );

                        RecalcResult = TempElement.Recalculate_Page( PageIndex );
                        
                        if ( recalcresult_NextElement !== RecalcResult )
                            break;                        

                        FrameH = TempElement.Get_PageBounds( PageIndex - TempElement.Get_StartPage_Absolute()).Bottom;
                    }

                    if ( -1 === FrameW && 1 === FlowCount && 1 === Element.Lines.length && undefined === FramePr.Get_W() )
                    {
                        FrameW = Element.Lines[0].Ranges[0].W;
                        var ParaPr = Element.Get_CompiledPr2(false).ParaPr;
                        FrameW += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;

                        // Если прилегание в данном случае не к левой стороне, тогда пересчитываем параграф,
                        // с учетом того, что ширина буквицы должна быть FrameW
                        if ( align_Left != ParaPr.Jc )
                        {
                            TempElement.Reset( 0, 0, FrameW, Frame_YLimit, PageIndex );
                            TempElement.Recalculate_Page( PageIndex );
                            FrameH = TempElement.Get_PageBounds( PageIndex - TempElement.Get_StartPage_Absolute()).Bottom;
                        }
                    }
                    else if ( -1 === FrameW )
                        FrameW = Frame_XLimit;

                    var FrameHRule = ( undefined === FramePr.HRule ? heightrule_Auto : FramePr.HRule );
                    switch ( FrameHRule )
                    {
                        case heightrule_Auto : break;
                        case heightrule_AtLeast :
                        {
                            if ( FrameH < FramePr.H )
                                FrameH = FramePr.H;

                            break;
                        }

                        case heightrule_Exact:
                        {
                            FrameH = FramePr.H;
                            break;
                        }
                    }

                    //--------------------------------------------------------------------------------------------------
                    // 2. Рассчитаем положение рамки
                    //--------------------------------------------------------------------------------------------------

                    // Теперь зная размеры рамки можем рассчитать ее позицию
                    var FrameHAnchor = ( FramePr.HAnchor === undefined ? c_oAscHAnchor.Margin : FramePr.HAnchor );
                    var FrameVAnchor = ( FramePr.VAnchor === undefined ? c_oAscVAnchor.Text : FramePr.VAnchor );

                    // Рассчитаем положение по горизонтали
                    var FrameX = 0;
                    if ( undefined != FramePr.XAlign || undefined === FramePr.X )
                    {
                        var XAlign = c_oAscXAlign.Left;
                        if ( undefined != FramePr.XAlign )
                            XAlign = FramePr.XAlign;

                        switch ( FrameHAnchor )
                        {
                            case c_oAscHAnchor.Page   :
                            {
                                switch ( XAlign )
                                {
                                    case c_oAscXAlign.Inside  :
                                    case c_oAscXAlign.Outside :
                                    case c_oAscXAlign.Left    : FrameX = Page_Field_L - FrameW; break;
                                    case c_oAscXAlign.Right   : FrameX = Page_Field_R; break;
                                    case c_oAscXAlign.Center  : FrameX = (Page_W - FrameW) / 2; break;
                                }

                                break;
                            }
                            case c_oAscHAnchor.Text   :
                            case c_oAscHAnchor.Margin :
                            {
                                switch ( XAlign )
                                {
                                    case c_oAscXAlign.Inside  :
                                    case c_oAscXAlign.Outside :
                                    case c_oAscXAlign.Left    : FrameX = Page_Field_L; break;
                                    case c_oAscXAlign.Right   : FrameX = Page_Field_R - FrameW; break;
                                    case c_oAscXAlign.Center  : FrameX = (Page_Field_R + Page_Field_L - FrameW) / 2; break;
                                }

                                break;
                            }
                        }

                    }
                    else
                    {
                        switch ( FrameHAnchor )
                        {
                            case c_oAscHAnchor.Page   : FrameX = FramePr.X; break;
                            case c_oAscHAnchor.Text   :
                            case c_oAscHAnchor.Margin : FrameX = Page_Field_L + FramePr.X; break;
                        }
                    }

                    if ( FrameW + FrameX > Page_W )
                        FrameX = Page_W - FrameW;

                    if ( FrameX < 0 )
                        FrameX = 0;

                    // Рассчитаем положение по вертикали
                    var FrameY = 0;
                    if ( undefined != FramePr.YAlign )
                    {
                        var YAlign = FramePr.YAlign;
                        // Случай c_oAscYAlign.Inline не обрабатывается, потому что такие параграфы считаются Inline

                        switch ( FrameVAnchor )
                        {
                            case c_oAscVAnchor.Page   :
                            {
                                switch ( YAlign )
                                {
                                    case c_oAscYAlign.Inside  :
                                    case c_oAscYAlign.Outside :
                                    case c_oAscYAlign.Top     : FrameY = 0; break;
                                    case c_oAscYAlign.Bottom  : FrameY = Page_H - FrameH; break;
                                    case c_oAscYAlign.Center  : FrameY = (Page_H - FrameH) / 2; break;
                                }

                                break;
                            }
                            case c_oAscVAnchor.Text   :
                            {
                                FrameY = Y;
                                break;
                            }
                            case c_oAscVAnchor.Margin :
                            {
                                switch ( YAlign )
                                {
                                    case c_oAscYAlign.Inside  :
                                    case c_oAscYAlign.Outside :
                                    case c_oAscYAlign.Top     : FrameY = Page_Field_T; break;
                                    case c_oAscYAlign.Bottom  : FrameY = Page_Field_B - FrameH; break;
                                    case c_oAscYAlign.Center  : FrameY = (Page_Field_B + Page_Field_T - FrameH) / 2; break;
                                }

                                break;
                            }
                        }
                    }
                    else
                    {
                        var FramePrY = 0;
                        if ( undefined != FramePr.Y )
                            FramePrY = FramePr.Y;

                        switch ( FrameVAnchor )
                        {
                            case c_oAscVAnchor.Page   : FrameY = FramePrY; break;
                            case c_oAscVAnchor.Text   : FrameY = FramePrY + Y; break;
                            case c_oAscVAnchor.Margin : FrameY = FramePrY + Page_Field_T; break;
                        }
                    }

                    if ( FrameH + FrameY > Page_H )
                        FrameY = Page_H - FrameH;

                    // TODO: Пересмотреть, почему эти погрешности возникают
                    // Избавляемся от погрешности
                    FrameY += 0.001;
                    FrameH -= 0.002;

                    if ( FrameY < 0 )
                        FrameY = 0;

                    var FrameBounds = this.Content[Index].Get_FrameBounds(FrameX, FrameY, FrameW, FrameH);
                    var FrameX2 = FrameBounds.X, FrameY2 = FrameBounds.Y, FrameW2 = FrameBounds.W, FrameH2 = FrameBounds.H;

                    if ( recalcresult_NextElement !== RecalcResult )
                    {
                        // Ничего не делаем здесь, пересчитываем текущую страницу заново, либо предыдущую
                        
                        if ( recalcresult_PrevPage === RecalcResult )
                            this.RecalcInfo.Set_FrameRecalc(false);
                        
                        // TODO: Если мы заново пересчитываем текущую страницу, проверить надо ли обнулять параметр RecalcInfo.FrameRecalc
                    }
                    else if ( (FrameY2 + FrameH2 > YLimit || Y > YLimit - 0.001 ) && Index != StartIndex )
                    {
                        this.RecalcInfo.Set_FrameRecalc(true);
                        this.Content[Index].Start_FromNewPage();
                        RecalcResult = recalcresult_NextPage;
                    }
                    else
                    {
                        this.RecalcInfo.Set_FrameRecalc(false);
                        for ( var TempIndex = Index; TempIndex < Index + FlowCount; TempIndex++ )
                        {
                            var TempElement = this.Content[TempIndex];
                            TempElement.Shift( TempElement.Pages.length - 1, FrameX, FrameY );
                            TempElement.Set_CalculatedFrame( FrameX, FrameY, FrameW, FrameH, FrameX2, FrameY2, FrameW2, FrameH2, PageIndex );
                        }

                        var FrameDx = ( undefined === FramePr.HSpace ? 0 : FramePr.HSpace );
                        var FrameDy = ( undefined === FramePr.VSpace ? 0 : FramePr.VSpace );

                        this.DrawingObjects.addFloatTable( new CFlowParagraph( Element, FrameX2, FrameY2, FrameW2, FrameH2, FrameDx, FrameDy, Index, FlowCount, FramePr.Wrap ) );

                        Index += FlowCount - 1;

                        if ( FrameY >= Y )
                            RecalcResult = recalcresult_NextElement;
                        else
                        {
                            this.RecalcInfo.Set_FlowObject(Element, PageIndex, recalcresult_NextElement, FlowCount);
                            RecalcResult = recalcresult_CurPage;
                        }
                    }
                }
                else if ( true === this.RecalcInfo.Check_FlowObject(Element) && true === this.RecalcInfo.Is_PageBreakBefore() )
                {
                    this.RecalcInfo.Reset();
                    this.RecalcInfo.Set_FrameRecalc(true);                    
                    this.Content[Index].Start_FromNewPage();
                    RecalcResult = recalcresult_NextPage;                    
                }
                else if ( true === this.RecalcInfo.Check_FlowObject(Element) )
                {
                    // Проверяем номер страницы
                    if ( this.RecalcInfo.FlowObjectPage !== PageIndex )
                    {
                        // Номер страницы не такой же (должен быть +1), значит нам надо заново персесчитать предыдущую страницу
                        // с условием, что данная рамка начнется с новой страницы
                        this.RecalcInfo.Set_PageBreakBefore( true );
                        this.DrawingObjects.removeFloatTableById( this.RecalcInfo.FlowObjectPage, Element.Get_Id() );
                        RecalcResult = recalcresult_PrevPage;                        
                    }
                    else
                    {
                        // Все нормально рассчиталось
                        Index += this.RecalcInfo.FlowObjectElementsCount - 1;
                        this.RecalcInfo.Reset();
                        RecalcResult = recalcresult_NextElement;
                    }
                }
                else
                {
                    // Пропускаем
                    RecalcResult = recalcresult_NextElement;
                }
            }
            else
            {
                if ( ( 0 === Index && 0 === PageIndex ) || Index != StartIndex || ( Index === StartIndex && true === bStartNewSection ) )
                {
                    Element.Set_DocumentIndex( Index );
                    Element.Reset( X, Y, XLimit, YLimit, PageIndex );
                }

                // Делаем как в Word: Обработаем особый случай, когда на данном параграфе заканчивается секция, и он
                // пустой. В такой ситуации этот параграф не добавляет смещения по Y, и сам приписывается в конец
                // предыдущего элемента. Второй подряд идущий такой же параграф обсчитывается по обычному.

                var SectInfoElement = this.SectionsInfo.Get_SectPr(Index);
                var PrevElement = this.Content[Index - 1]; // может быть undefined, но в следующем условии сразу стоит проверка на Index > 0
                if ( Index > 0 && ( Index !== StartIndex || true !== bStartNewSection ) && Index === SectInfoElement.Index && true === Element.IsEmpty() && ( type_Paragraph !== PrevElement.GetType() || undefined === PrevElement.Get_SectionPr() ) )
                {
                    RecalcResult = recalcresult_NextElement;
                    var LastVisibleBounds = PrevElement.Get_LastRangeVisibleBounds();

                    var ___X = LastVisibleBounds.X + LastVisibleBounds.W;
                    var ___Y = LastVisibleBounds.Y;

                    // Чтобы у нас знак разрыва секции рисовался красиво и где надо делаем небольшую хитрость:
                    // перед пересчетом данного параграфа меняем в нем в скомпилированных настройках прилегание и 
                    // отступы, а после пересчета помечаем, что настройки нужно скомпилировать заново.
                    var CompiledPr = Element.Get_CompiledPr2(false).ParaPr;
                    CompiledPr.Jc = align_Left;
                    CompiledPr.Ind.FirstLine = 0;   
                    CompiledPr.Ind.Left      = 0;
                    CompiledPr.Ind.Right     = 0;

                    // Делаем предел по X минимум 10 мм, чтобы всегда было видно элемент разрыва секции
                    Element.Reset( ___X, ___Y, Math.max( ___X + 10, LastVisibleBounds.XLimit ), 10000, PageIndex );
                    Element.Recalculate_Page( PageIndex );
                    
                    Element.Recalc_CompiledPr();
                    
                    // Меняем насильно размер строки и страницы данного параграфа, чтобы у него границы попадания и
                    // селект были ровно такие же как и у последней строки предыдущего элемента.
                    Element.Pages[0].Y      = ___Y;
                    Element.Lines[0].Top    = 0;
                    Element.Lines[0].Y      = LastVisibleBounds.BaseLine;
                    Element.Lines[0].Bottom = LastVisibleBounds.H;
                    Element.Pages[0].Bounds.Top    = ___Y;
                    Element.Pages[0].Bounds.Bottom = ___Y + LastVisibleBounds.H;

                    // Добавим в список особых параграфов
                    this.Pages[PageIndex].EndSectionParas.push( Element );

                    // Выставляем этот флаг, чтобы у нас не менялось значение по Y
                    bFlow = true;
                }
                else
                    RecalcResult = Element.Recalculate_Page( PageIndex );
            }

            Element.TurnOn_RecalcEvent();

            if ( recalcresult_CurPage === RecalcResult )
            {
                bReDraw     = false;
                bContinue   = true;
                _PageIndex  = PageIndex;
                _StartIndex = StartIndex;
                _bStart     = false;
                break;
            }
            else if ( recalcresult_NextElement === RecalcResult )
            {
                if ( Index < Count - 1 )
                {
                    var CurSectInfo  = this.SectionsInfo.Get_SectPr( Index );
                    var NextSectInfo = this.SectionsInfo.Get_SectPr( Index + 1 );
                    if ( CurSectInfo !== NextSectInfo )
                    {
                        if ( section_type_Continuous === NextSectInfo.SectPr.Get_Type() && true === CurSectInfo.SectPr.Compare_PageSize( NextSectInfo.SectPr ) )
                        {
                            // Новая секция начинается на данной странице. Нам надо получить новые поля данной секции, но
                            // на данной странице мы будет использовать только новые горизонтальные поля, а поля по вертикали
                            // используем от предыдущей секции.

                            var NewStartPos = this.Get_PageContentStartPos( PageIndex, Index + 1 );

                            Y = Y + 0.001; // на всякий случай
                            X      = NewStartPos.X;
                            XLimit = NewStartPos.XLimit;
                        }
                        else
                        {
                            this.Pages[PageIndex].EndPos = Index;

                            bContinue         = true;
                            _PageIndex        = PageIndex + 1;
                            _StartIndex       = Index + 1;
                            _bStart           = true;
                            _bStartNewSection = true;
                            break;
                        }
                    }
                }
            }
            else if ( recalcresult_NextPage === RecalcResult )
            {
                this.Pages[PageIndex].EndPos = Index;

                bContinue   = true;
                _PageIndex  = PageIndex + 1;
                _StartIndex = Index;
                _bStart     = true;
                break;
            }
            else if ( recalcresult_PrevPage === RecalcResult )
            {
                bReDraw     = false;
                bContinue   = true;
                _PageIndex  =  Math.max( PageIndex - 1, 0 );
                _StartIndex = this.Pages[_PageIndex].Pos;
                _bStart     = false;
                break;
            }

            if ( true != bFlow )
            {
                var Bounds = Element.Get_PageBounds( PageIndex - Element.Get_StartPage_Absolute() );
                Y = Bounds.Bottom;
            }

            if ( docpostype_Content == this.CurPos.Type && Index >= this.ContentLastChangePos && Index == this.CurPos.ContentPos )
            {
                if ( type_Paragraph === Element.GetType() )
                    this.CurPage = Element.PageNum + Element.CurPos.PagesPos;
                else
                    this.CurPage = Element.PageNum; // TODO: переделать
            }
        }

        if ( Index >= Count )
        {
            // До перерисовки селекта должны выставить
            this.Pages[PageIndex].EndPos = Count - 1;

            //console.log("LastRecalc: " + ((new Date().getTime() - StartTime) / 1000) );
        }

        if ( true === bReDraw )
        {
            this.DrawingDocument.OnRecalculatePage( PageIndex, this.Pages[PageIndex] );
        }

        if ( Index >= Count )
        {
            this.Internal_CheckCurPage();
            this.DrawingDocument.OnEndRecalculate( true );

            this.DrawingObjects.onEndRecalculateDocument( this.Pages.length );

            if ( true === this.Selection.UpdateOnRecalc )
            {
                this.Selection.UpdateOnRecalc = false;
                this.DrawingDocument.OnSelectEnd();
            }
            
            this.FullRecalc.Id = null;
            this.FullRecalc.MainStartPos = -1;
        }

        if ( true === bContinue )
        {
            this.FullRecalc.PageIndex    = _PageIndex;
            this.FullRecalc.Start        = _bStart;
            this.FullRecalc.StartIndex   = _StartIndex;
            this.FullRecalc.NewSection   = _bStartNewSection;
            this.FullRecalc.MainStartPos = _StartIndex;
            
            if (window["NATIVE_EDITOR_ENJINE_SYNC_RECALC"] === true)
            {
                if ( _PageIndex > this.FullRecalc.StartPage + 2 )
                {
					if (window["native"]["WC_CheckSuspendRecalculate"]())
						return;                    
                }

                this.Recalculate_Page();
                return;
            }
			
            if ( _PageIndex > this.FullRecalc.StartPage + 2 )
            {
                this.FullRecalc.Id = setTimeout( Document_Recalculate_Page, 20 );
            }
            else
                this.Recalculate_Page();

        }
    },

    Reset_RecalculateCache : function()
    {
        this.SectionsInfo.Reset_HdrFtrRecalculateCache();

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Reset_RecalculateCache();
        }
    },

    Stop_Recalculate : function()
    {
        if ( null != this.FullRecalc.Id )
        {
            clearTimeout( this.FullRecalc.Id );
            this.FullRecalc.Id = null;
        }

        this.DrawingDocument.OnStartRecalculate( 0 );
    },

    OnContentRecalculate : function(bNeedRecalc, PageNum, DocumentIndex)
    {
        if ( false === bNeedRecalc )
        {
            var Element = this.Content[DocumentIndex];
            // Просто перерисуем все страницы, на которых находится данный элеменет
            for ( var PageNum = Element.PageNum; PageNum < Element.PageNum + Element.Pages.length; PageNum++ )
            {
                this.DrawingDocument.OnRecalculatePage( PageNum, this.Pages[PageNum] );
            }

            this.DrawingDocument.OnEndRecalculate(false, true);

            this.Document_UpdateRulersState();
        }
        else
        {
            this.ContentLastChangePos = DocumentIndex;
            this.Recalculate( false, false );
        }
    },

    Recalculate_AllTables : function()
    {
        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( type_Table === Item.GetType() )
                Item.Recalculate_AllTables();
        }
    },

    OnContentReDraw : function(StartPage, EndPage)
    {
        this.ReDraw( StartPage, EndPage );
    },

    CheckTargetUpdate : function()
    {
        // Проверим можно ли вообще пересчитывать текущее положение.
        var bFlag = true;

        if (this.DrawingDocument.UpdateTargetFromPaint === true)
        {
            if (true === this.DrawingDocument.UpdateTargetCheck)
                this.NeedUpdateTarget = this.DrawingDocument.UpdateTargetCheck;
            this.DrawingDocument.UpdateTargetCheck = false;
        }

        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( null != this.FullRecalc.Id && this.FullRecalc.StartIndex <= this.CurPos.ContentPos )
                bFlag = false;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            // в автофигурах всегда можно проверять текущую позицию
        }
        else if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            // в колонтитуле всегда можно проверять текущую позицию
        }

        if ( true === this.NeedUpdateTarget && true === bFlag && false === this.Selection_Is_TableBorderMove() )
        {
            // Обновляем курсор сначала, чтобы обновить текущую страницу
            this.RecalculateCurPos();
            this.NeedUpdateTarget = false;
        }
    },

    RecalculateCurPos : function()
    {
        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;

        if ( docpostype_Content === this.CurPos.Type )
        {
            var Pos = ( true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag ? this.Selection.EndPos : this.CurPos.ContentPos ); 
            if ( Pos >= 0 && undefined !== this.Content[Pos].RecalculateCurPos && ( null === this.FullRecalc.Id || this.FullRecalc.StartIndex > Pos ) )
            {
                this.Internal_CheckCurPage();
                this.Content[Pos].RecalculateCurPos();
            }
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.recalculateCurPos();
        }
        else if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.RecalculateCurPos();
        }

        // TODO: Здесь добавлено обновление линейки, чтобы обновлялись границы рамки при наборе текста, а также чтобы
        //       обновлялись поля колонтитулов при наборе текста.
        this.Document_UpdateRulersState();
    },

    Internal_CheckCurPage : function()
    {
        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;

        if (docpostype_HdrFtr === this.CurPos.Type)
        {
            var CurHdrFtr = this.HdrFtr.CurHdrFtr;
            if (null !== CurHdrFtr && -1 !== CurHdrFtr.RecalcInfo.CurPage)
                this.CurPage = CurHdrFtr.RecalcInfo.CurPage;
        }
        if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
            if ( null != ParaDrawing )
                this.CurPage = ParaDrawing.PageNum;
        }
        else
        {
            var Pos = ( true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag ? this.Selection.EndPos : this.CurPos.ContentPos );
            if ( Pos >= 0 && ( null === this.FullRecalc.Id || this.FullRecalc.StartIndex > Pos ) )
            {
                this.CurPage = this.Content[Pos].Get_CurrentPage_Absolute();
            }
        }
    },

    Set_TargetPos : function(X, Y, PageNum)
    {
        this.TargetPos.X       = X;
        this.TargetPos.Y       = Y;
        this.TargetPos.PageNum = PageNum;
    },

    // Вызываем перерисовку нужных страниц
    ReDraw : function(StartPage, EndPage)
    {
        if ( "undefined" === typeof(StartPage) )
            StartPage = 0;
        if ( "undefined" === typeof(EndPage) )
            EndPage = this.DrawingDocument.m_lCountCalculatePages;

        for ( var CurPage = StartPage; CurPage <= EndPage; CurPage++ )
            this.DrawingDocument.OnRepaintPage( CurPage );
    },

    DrawPage : function(nPageIndex, pGraphics)
    {
        this.Draw( nPageIndex, pGraphics);
    },

    // Отрисовка содержимого Документа
    Draw : function(nPageIndex, pGraphics)
    {
        this.Comments.Reset_Drawing( nPageIndex );

        // Определим секцию
        var Page_StartPos = this.Pages[nPageIndex].Pos;
        var SectPr        = this.SectionsInfo.Get_SectPr(Page_StartPos).SectPr;        

        if ( docpostype_HdrFtr !== this.CurPos.Type )
            pGraphics.Start_GlobalAlpha();

        // Рисуем границы вокруг страницы (если границы надо рисовать под текстом)
        if ( section_borders_ZOrderBack === SectPr.Get_Borders_ZOrder() )
            this.Draw_Borders(pGraphics, SectPr);

        this.HdrFtr.Draw( nPageIndex, pGraphics );

        // Рисуем содержимое документа на данной странице
        if ( docpostype_HdrFtr === this.CurPos.Type )
            pGraphics.put_GlobalAlpha(true, 0.4);
        else
            pGraphics.End_GlobalAlpha();

        this.DrawingObjects.drawBehindDoc( nPageIndex, pGraphics );
        this.DrawingObjects.drawWrappingObjects( nPageIndex, pGraphics );

        var Page_StartPos = this.Pages[nPageIndex].Pos;
        var Page_EndPos   = this.Pages[nPageIndex].EndPos;
        for ( var Index = Page_StartPos; Index <= Page_EndPos; Index++ )
        {
            this.Content[Index].Draw(nPageIndex, pGraphics);
        }
        
        this.DrawingObjects.drawBeforeObjects( nPageIndex, pGraphics );

        // Рисуем границы вокруг страницы (если границы надо рисовать перед текстом)
        if ( section_borders_ZOrderFront === SectPr.Get_Borders_ZOrder() )
            this.Draw_Borders(pGraphics, SectPr);

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            pGraphics.put_GlobalAlpha(false, 1.0);

            // Рисуем колонтитулы            
            var SectIndex = this.SectionsInfo.Get_Index(Page_StartPos);
            var SectCount = this.SectionsInfo.Get_Count();

            var SectIndex = ( 1 === SectCount ? -1 : SectIndex );

            var Header = this.HdrFtr.Pages[nPageIndex].Header;
            var Footer = this.HdrFtr.Pages[nPageIndex].Footer;

            var RepH = ( null === Header || null !== SectPr.Get_HdrFtrInfo(Header) ? false : true );
            var RepF = ( null === Footer || null !== SectPr.Get_HdrFtrInfo(Footer) ? false : true );
            
            var HeaderInfo = undefined;
            if ( null !== Header && undefined !== Header.RecalcInfo.NeedRecalc[nPageIndex] )
            {
                var bFirst = Header.RecalcInfo.NeedRecalc[nPageIndex].bFirst;
                var bEven  = Header.RecalcInfo.NeedRecalc[nPageIndex].bEven;

                var HeaderSectPr = Header.RecalcInfo.SectPr[nPageIndex];
                
                if ( undefined !== HeaderSectPr )
                    bFirst = ( true === bFirst && true === HeaderSectPr.Get_TitlePage() ? true : false );
                
                HeaderInfo = { bFirst : bFirst, bEven : bEven };
            }

            var FooterInfo = undefined;
            if ( null !== Footer && undefined !== Footer.RecalcInfo.NeedRecalc[nPageIndex] )
            {
                var bFirst = Footer.RecalcInfo.NeedRecalc[nPageIndex].bFirst;
                var bEven  = Footer.RecalcInfo.NeedRecalc[nPageIndex].bEven;

                var FooterSectPr = Footer.RecalcInfo.SectPr[nPageIndex];

                if ( undefined !== FooterSectPr )
                    bFirst = ( true === bFirst && true === FooterSectPr.Get_TitlePage() ? true : false );

                FooterInfo = { bFirst : bFirst, bEven : bEven };
            }
            
            pGraphics.DrawHeaderEdit( this.Pages[nPageIndex].Y,      this.HdrFtr.Lock.Get_Type(), SectIndex, RepH, HeaderInfo );
            pGraphics.DrawFooterEdit( this.Pages[nPageIndex].YLimit, this.HdrFtr.Lock.Get_Type(), SectIndex, RepF, FooterInfo );
        }
    },

    Draw_Borders : function(Graphics, SectPr)
    {
        var Orient  = SectPr.Get_Orientation();
        var Offset  = SectPr.Get_Borders_OffsetFrom();

        var LBorder = SectPr.Get_Borders_Left();
        var TBorder = SectPr.Get_Borders_Top();
        var RBorder = SectPr.Get_Borders_Right();
        var BBorder = SectPr.Get_Borders_Bottom();

        var W = SectPr.Get_PageWidth();
        var H = SectPr.Get_PageHeight();

        // Порядок отрисовки границ всегда одинаковый вне зависимости от цветы и толщины: сначала вертикальные,
        // потом горизонтальные поверх вертикальных

        if (section_borders_OffsetFromPage === Offset)
        {
            // Рисуем левую границу
            if (border_None !== LBorder.Value)
            {
                var X  = LBorder.Space + LBorder.Size / 2;
                var Y0 = ( border_None !== TBorder.Value ? TBorder.Space + TBorder.Size / 2 : 0 );
                var Y1 = ( border_None !== BBorder.Value ? H - BBorder.Space - BBorder.Size / 2 : H );

                Graphics.p_color(LBorder.Color.r, LBorder.Color.g, LBorder.Color.b, 255);
                Graphics.drawVerLine(c_oAscLineDrawingRule.Center, X, Y0, Y1, LBorder.Size);
            }

            // Рисуем правую границу
            if (border_None !== RBorder.Value)
            {
                var X  = W - RBorder.Space - RBorder.Size / 2;
                var Y0 = ( border_None !== TBorder.Value ? TBorder.Space + TBorder.Size / 2 : 0 );
                var Y1 = ( border_None !== BBorder.Value ? H - BBorder.Space - BBorder.Size / 2 : H );

                Graphics.p_color(RBorder.Color.r, RBorder.Color.g, RBorder.Color.b, 255);
                Graphics.drawVerLine(c_oAscLineDrawingRule.Center, X, Y0, Y1, RBorder.Size);
            }

            // Рисуем верхнюю границу
            if (border_None !== TBorder.Value)
            {
                var Y  = TBorder.Space;
                var X0 = ( border_None !== LBorder.Value ? LBorder.Space + LBorder.Size / 2 : 0 );
                var X1 = ( border_None !== RBorder.Value ? W - RBorder.Space - RBorder.Size / 2 : W );

                Graphics.p_color(TBorder.Color.r, TBorder.Color.g, TBorder.Color.b, 255);
                Graphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y, X0, X1, TBorder.Size, ( border_None !== LBorder.Value ? -LBorder.Size / 2 : 0 ), ( border_None !== RBorder.Value ? RBorder.Size / 2 : 0 ));
            }

            // Рисуем нижнюю границу
            if (border_None !== BBorder.Value)
            {
                var Y  = H - BBorder.Space;
                var X0 = ( border_None !== LBorder.Value ? LBorder.Space + LBorder.Size / 2 : 0 );
                var X1 = ( border_None !== RBorder.Value ? W - RBorder.Space - RBorder.Size / 2 : W );

                Graphics.p_color(BBorder.Color.r, BBorder.Color.g, BBorder.Color.b, 255);
                Graphics.drawHorLineExt(c_oAscLineDrawingRule.Bottom, Y, X0, X1, BBorder.Size, ( border_None !== LBorder.Value ? -LBorder.Size / 2 : 0 ), ( border_None !== RBorder.Value ? RBorder.Size / 2 : 0 ));
            }
        }
        else
        {
            var _X0 = SectPr.Get_PageMargin_Left();
            var _X1 = W - SectPr.Get_PageMargin_Right();
            var _Y0 = SectPr.Get_PageMargin_Top();
            var _Y1 = H - SectPr.Get_PageMargin_Bottom();

            // Рисуем левую границу
            if (border_None !== LBorder.Value)
            {
                var X  = _X0 - LBorder.Space;
                var Y0 = ( border_None !== TBorder.Value ? _Y0 - TBorder.Space - TBorder.Size / 2 : _Y0 );
                var Y1 = ( border_None !== BBorder.Value ? _Y1 + BBorder.Space + BBorder.Size / 2 : _Y1 );

                Graphics.p_color(LBorder.Color.r, LBorder.Color.g, LBorder.Color.b, 255);
                Graphics.drawVerLine(c_oAscLineDrawingRule.Right, X, Y0, Y1, LBorder.Size);
            }

            // Рисуем правую границу
            if (border_None !== RBorder.Value)
            {
                var X  = _X1 + RBorder.Space;
                var Y0 = ( border_None !== TBorder.Value ? _Y0 - TBorder.Space - TBorder.Size / 2 : _Y0 );
                var Y1 = ( border_None !== BBorder.Value ? _Y1 + BBorder.Space + BBorder.Size / 2 : _Y1 );

                Graphics.p_color(RBorder.Color.r, RBorder.Color.g, RBorder.Color.b, 255);
                Graphics.drawVerLine(c_oAscLineDrawingRule.Left, X, Y0, Y1, RBorder.Size);
            }

            // Рисуем верхнюю границу
            if (border_None !== TBorder.Value)
            {
                var Y  = _Y0 - TBorder.Space;
                var X0 = ( border_None !== LBorder.Value ? _X0 - LBorder.Space : _X0 );
                var X1 = ( border_None !== RBorder.Value ? _X1 + RBorder.Space : _X1 );

                Graphics.p_color(TBorder.Color.r, TBorder.Color.g, TBorder.Color.b, 255);
                Graphics.drawHorLineExt(c_oAscLineDrawingRule.Bottom, Y, X0, X1, TBorder.Size, ( border_None !== LBorder.Value ? -LBorder.Size : 0 ), ( border_None !== RBorder.Value ? RBorder.Size : 0 ));
            }

            // Рисуем нижнюю границу
            if (border_None !== BBorder.Value)
            {
                var Y  = _Y1 + BBorder.Space;
                var X0 = ( border_None !== LBorder.Value ? _X0 - LBorder.Space : _X0 );
                var X1 = ( border_None !== RBorder.Value ? _X1 + RBorder.Space : _X1 );

                Graphics.p_color(BBorder.Color.r, BBorder.Color.g, BBorder.Color.b, 255);
                Graphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y, X0, X1, BBorder.Size, ( border_None !== LBorder.Value ? -LBorder.Size : 0 ), ( border_None !== RBorder.Value ? RBorder.Size : 0 ));
            }
        }

        // TODO: Реализовать:
        //       1. ArtBorders
        //       2. Различные типы обычных границ. Причем, если пересакающиеся границы имеют одинаковый тип и размер,
        //          тогда надо специально отрисовывать места соединения данных линий.

    },

    Add_NewParagraph : function(bRecalculate)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Add_NewParagraph(bRecalculate);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.addNewParagraph(bRecalculate);
        }
        else // if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            // Сначала удаляем заселекченую часть
            if ( true === this.Selection.Use )
            {
                this.Remove( 1, true );
            }

            // Добавляем новый параграф
            var Item = this.Content[this.CurPos.ContentPos];

            // Если мы внутри параграфа, тогда:
            // 1. Если мы в середине параграфа, разделяем данный параграф на 2.
            //    При этом полностью копируем все настройки из исходного параграфа.
            // 2. Если мы в конце данного параграфа, тогда добавляем новый пустой параграф.
            //    Стиль у него проставляем такой какой указан у текущего в Style.Next.
            //    Если при этом у нового параграфа стиль будет такой же как и у старого,
            //    в том числе если стиля нет у обоих, тогда копируем еще все прямые настройки.
            //    (Т.е. если стили разные, а у исходный параграф был параграфом со списком, тогда
            //    новый параграф будет без списка).
            if ( type_Paragraph == Item.GetType() )
            {
                // Если текущий параграф пустой и с нумерацией, тогда удаляем нумерацию и отступы левый и первой строки
                if ( undefined != Item.Numbering_Get() && true === Item.IsEmpty() )
                {
                    Item.Numbering_Remove();
                    Item.Set_Ind( { FirstLine : undefined, Left : undefined, Right : Item.Pr.Ind.Right }, true );
                }
                else
                {
                    // Создаем новый параграф
                    var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );

                    // Проверим позицию в текущем параграфе
                    if ( true === Item.Cursor_IsEnd() )
                    {
                        var StyleId = Item.Style_Get();
                        var NextId  = undefined;

                        if ( undefined != StyleId )
                        {
                            NextId = this.Styles.Get_Next( StyleId );

                            if ( null === NextId )
                                NextId = StyleId;
                        }


                        if ( StyleId === NextId )
                        {
                            // Продолжаем (в плане настроек) новый параграф
                            Item.Continue( NewParagraph );
                        }
                        else
                        {
                            // Простое добавление стиля, без дополнительных действий
                            if ( NextId === this.Styles.Get_Default_Paragraph() )
                                NewParagraph.Style_Remove();
                            else
                                NewParagraph.Style_Add_Open( NextId );
                        }

                        var SectPr = Item.Get_SectionPr();
                        if ( undefined !== SectPr )
                        {
                            Item.Set_SectionPr( undefined );
                            NewParagraph.Set_SectionPr( SectPr );
                        }
                    }
                    else
                        Item.Split( NewParagraph );

                    this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewParagraph );

                    this.CurPos.ContentPos++;

                    // Отмечаем, что последний измененный элемент - предыдущий параграф
                    this.ContentLastChangePos = this.CurPos.ContentPos - 1;

                }

                if ( false != bRecalculate )
                {
                    this.Recalculate();

                    this.Document_UpdateInterfaceState();
                    //this.Document_UpdateRulersState()
                    this.Document_UpdateSelectionState();
                }
            }
            else if ( type_Table == Item.GetType() )
            {
                // Если мы находимся в начале первого параграфа первой ячейки, и
                // данная таблица - первый элемент, тогда добавляем параграф до таблицы.

                if (  0 === this.CurPos.ContentPos && Item.Cursor_IsStart(true) )
                {
                    // Создаем новый параграф
                    var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );
                    this.Internal_Content_Add( 0, NewParagraph );

                    this.ContentLastChangePos = 0;
                    this.CurPos.ContentPos = 0;

                    if ( false != bRecalculate )
                    {
                        this.Recalculate();
                        this.Document_UpdateInterfaceState();
                        //this.Document_UpdateRulersState()
                        this.Document_UpdateSelectionState();
                    }
                }
                else
                    Item.Add_NewParagraph(bRecalculate);
            }
        }
    },

    // Расширяем документ до точки (X,Y) с помощью новых параграфов
    // Y0 - низ последнего параграфа, YLimit - предел страницы
    Extend_ToPos : function(X, Y)
    {
        var LastPara = this.Content[this.Content.length - 1];
        var LastPara2 = LastPara;

        this.Create_NewHistoryPoint();
        this.History.Set_Additional_ExtendDocumentToPos();

        while ( true )
        {
            var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );
            var NewRun = new ParaRun( NewParagraph, false );

            var StyleId = LastPara.Style_Get();
            var NextId  = undefined;

            if ( undefined != StyleId )
            {
                NextId = this.Styles.Get_Next( StyleId );

                if ( null === NextId || undefined === NextId )
                    NextId = StyleId;
            }

            // Простое добавление стиля, без дополнительных действий
            if ( NextId === this.Styles.Get_Default_Paragraph() || NextId === this.Styles.Get_Default_ParaList() )
                NewParagraph.Style_Remove();
            else
                NewParagraph.Style_Add_Open( NextId );

            if ( undefined != LastPara.TextPr.Value.FontSize || undefined !== LastPara.TextPr.Value.RFonts.Ascii )
            {
                var TextPr = new CTextPr();
                TextPr.FontSize   = LastPara.TextPr.Value.FontSize;
                TextPr.FontSizeCS = LastPara.TextPr.Value.FontSize;
                TextPr.RFonts     = LastPara.TextPr.Value.RFonts.Copy();
                NewParagraph.Select_All();
                NewParagraph.Apply_TextPr( TextPr );
            }

            LastPara.Set_DocumentNext( NewParagraph );

            NewParagraph.Set_DocumentPrev( LastPara );
            NewParagraph.Set_DocumentIndex( LastPara.Index + 1 );

            var CurPage = LastPara.Pages.length - 1;
            var X0      = LastPara.Pages[CurPage].X;
            var Y0      = LastPara.Pages[CurPage].Bounds.Bottom;
            var XLimit  = LastPara.Pages[CurPage].XLimit;
            var YLimit  = LastPara.Pages[CurPage].YLimit;
            var PageNum = LastPara.PageNum;

            NewParagraph.Reset( X0, Y0, XLimit, YLimit, PageNum );
            var RecalcResult = NewParagraph.Recalculate_Page( PageNum );

            if ( recalcresult_NextElement != RecalcResult )
            {
                LastPara.Next = null;
                break;
            }

            this.Internal_Content_Add( this.Content.length, NewParagraph );

            if ( NewParagraph.Pages[0].Bounds.Bottom > Y )
                break;

            LastPara = NewParagraph;
        }

        LastPara = this.Content[this.Content.length - 1];

        if ( LastPara != LastPara2 || false === this.Document_Is_SelectionLocked( changestype_None, { Type : changestype_2_Element_and_Type, Element : LastPara, CheckType : changestype_Paragraph_Content } ) )
        {
            // Теперь нам нужно вставить таб по X
            LastPara.Extend_ToPos(X);
        }

        LastPara.Cursor_MoveToEndPos();
        LastPara.Document_SetThisElementCurrent(true);

        this.Recalculate();
    },

    GroupGraphicObjects: function()
    {
        if(this.CanGroup())
        {
            this.DrawingObjects.groupSelectedObjects();
        }
    },

    UnGroupGraphicObjects: function()
    {
        if(this.CanUnGroup())
        {
            this.DrawingObjects.unGroupSelectedObjects();
        }
    },

    StartChangeWrapPolygon: function()
    {
       this.DrawingObjects.startChangeWrapPolygon();
    },

    CanChangeWrapPolygon: function()
    {
        return this.DrawingObjects.canChangeWrapPolygon();
    },

    CanGroup: function()
    {
        return this.DrawingObjects.canGroup();
    },

    CanUnGroup: function()
    {
        return this.DrawingObjects.canUnGroup();
    },

    Add_InlineImage : function(W, H, Img, Chart, bFlow)
    {
        if ( undefined === bFlow )
            bFlow = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Add_InlineImage(W, H, Img, Chart, bFlow);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.addInlineImage( W, H, Img, Chart, bFlow );
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true == this.Selection.Use )
                this.Remove( 1, true );

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                var Drawing;
                if(!isRealObject(Chart))
                {
                    Drawing = new ParaDrawing( W, H, null, this.DrawingDocument, this, null);
                    var Image = this.DrawingObjects.createImage(Img, 0, 0, W, H);
                    Image.setParent(Drawing);
                    Drawing.Set_GraphicObject(Image);
                }
                else
                {
                    Drawing = new ParaDrawing( W, H, null, this.DrawingDocument, this, null);
                    var Image = this.DrawingObjects.getChartSpace2(Chart,null);
                    Image.setParent(Drawing);
                    Drawing.Set_GraphicObject(Image);
                    Drawing.Update_Size( Image.spPr.xfrm.extX, Image.spPr.xfrm.extY );
                }
                if ( true === bFlow )
                {
                    Drawing.Set_DrawingType( drawing_Anchor );
                    Drawing.Set_WrappingType( WRAPPING_TYPE_SQUARE );
                    Drawing.Set_BehindDoc( false );
                    Drawing.Set_Distance( 3.2, 0, 3.2, 0 );
                    Drawing.Set_PositionH(c_oAscRelativeFromH.Column, false, 0);
                    Drawing.Set_PositionV(c_oAscRelativeFromV.Paragraph, false, 0);
                }
                this.Paragraph_Add( Drawing );
                this.Select_DrawingObject( Drawing.Get_Id() );
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Add_InlineImage( W, H, Img, Chart, bFlow );
            }
        }
    },

    Edit_Chart : function(Chart)
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Edit_Chart(Chart);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.editChart( Chart );
        }
    },

    Get_ChartObject: function(type)
    {
        return this.DrawingObjects.getChartObject(type);
    },

    Add_InlineTable : function(Cols, Rows)
    {
        if ( Cols <= 0 || Rows <= 0 )
            return;
        
        // Добавляем таблицу в колонтитул
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Add_InlineTable( Cols, Rows );
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.addInlineTable( Cols, Rows );
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            // Сначала удаляем заселекченую часть
            if ( true === this.Selection.Use )
            {
                this.Remove( 1, true );
            }

            // Добавляем таблицу
            var Item = this.Content[this.CurPos.ContentPos];

            // Если мы внутри параграфа, тогда разрываем его и на месте разрыва добавляем таблицу.
            // А если мы внутри таблицы, тогда добавляем таблицу внутрь текущей таблицы.
            switch ( Item.GetType() )
            {
                case type_Paragraph:
                {
                    var PageFields = this.Get_PageFields( this.CurPage );
                    
                    // Создаем новую таблицу
                    var W = ( PageFields.XLimit - PageFields.X  + 2 * 1.9);
                    var Grid = [];

                    W = Math.max( W, Cols * 2 * 1.9 );

                    for ( var Index = 0; Index < Cols; Index++ )
                        Grid[Index] = W / Cols;

                    var NewTable = new CTable(this.DrawingDocument, this, true, 0, 0, 0, 0, 0, Rows, Cols, Grid );
                    NewTable.Set_ParagraphPrOnAdd( Item );

                    // Проверим позицию в текущем параграфе
                    if (true === Item.Cursor_IsEnd() && undefined === Item.Get_SectionPr())
                    {
                        // Выставляем курсор в начало таблицы
                        NewTable.Cursor_MoveToStartPos();
                        this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewTable );

                        this.CurPos.ContentPos++;

                        // Отмечаем, что последний измененный элемент - предыдущий параграф
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;

                        this.Recalculate();

                        this.Interface_Update_ParaPr();
                        this.Interface_Update_TextPr();
                        this.Interface_Update_TablePr();
                    }
                    else
                    {
                        // Создаем новый параграф
                        var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );
                        Item.Split( NewParagraph );

                        // Добавляем новый параграф
                        this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewParagraph );

                        // Выставляем курсор в начало таблицы
                        NewTable.Cursor_MoveToStartPos();
                        this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewTable );

                        this.CurPos.ContentPos++;

                        // Отмечаем, что последний измененный элемент - предыдущий параграф
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;

                        this.Recalculate();

                        this.Interface_Update_ParaPr();
                        this.Interface_Update_TextPr();
                        this.Interface_Update_TablePr();
                    }

                    break;
                }

                case type_Table:
                {
                    Item.Add_InlineTable( Cols, Rows );
                    break;
                }
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Add_DropCap : function(bInText)
    {
        // Определим параграф, к которому мы будем добавлять буквицу
        var Pos = -1;

        if ( false === this.Selection.Use && type_Paragraph === this.Content[this.CurPos.ContentPos].GetType() )
            Pos = this.CurPos.ContentPos;
        else if ( true === this.Selection.Use && this.Selection.StartPos <= this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.StartPos].GetType() )
            Pos = this.Selection.StartPos;
        else if ( true === this.Selection.Use && this.Selection.StartPos > this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.EndPos].GetType() )
            Pos = this.Selection.EndPos;

        if ( -1 === Pos )
            return;

        var OldParagraph = this.Content[Pos];

        if ( OldParagraph.Lines.length <= 0 )
            return;

        if ( false === this.Document_Is_SelectionLocked( changestype_None, { Type : changestype_2_Element_and_Type, Element : OldParagraph, CheckType : changestype_Paragraph_Content } ) )
        {
            this.Create_NewHistoryPoint();

            var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );

            var TextPr = OldParagraph.Split_DropCap( NewParagraph );
            var Before = OldParagraph.Get_CompiledPr().ParaPr.Spacing.Before;
            var LineH  = OldParagraph.Lines[0].Bottom - OldParagraph.Lines[0].Top - Before;
            var LineTA = OldParagraph.Lines[0].Metrics.TextAscent2;
            var LineTD = OldParagraph.Lines[0].Metrics.TextDescent + OldParagraph.Lines[0].Metrics.LineGap;

            var FramePr = new CFramePr();
            FramePr.Init_Default_DropCap( bInText );
            NewParagraph.Set_FrameParaPr( OldParagraph );
            NewParagraph.Set_FramePr2( FramePr );
            NewParagraph.Update_DropCapByLines( TextPr, NewParagraph.Pr.FramePr.Lines, LineH, LineTA, LineTD, Before );

            this.Internal_Content_Add( Pos, NewParagraph );
            NewParagraph.Cursor_MoveToEndPos();

            this.Selection_Remove();
            this.CurPos.ContentPos = Pos;
            this.CurPos.Type       = docpostype_Content;

            this.Recalculate();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Remove_DropCap : function(bDropCap)
    {
        var Pos = -1;

        if ( false === this.Selection.Use && type_Paragraph === this.Content[this.CurPos.ContentPos].GetType() )
            Pos = this.CurPos.ContentPos;
        else if ( true === this.Selection.Use && this.Selection.StartPos <= this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.StartPos].GetType() )
            Pos = this.Selection.StartPos;
        else if ( true === this.Selection.Use && this.Selection.StartPos > this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.EndPos].GetType() )
            Pos = this.Selection.EndPos;

        if ( -1 === Pos )
            return;

        var Para = this.Content[Pos];
        var FramePr = Para.Get_FramePr();

        // Возможно буквицой является предыдущий параграф
        if ( undefined === FramePr && true === bDropCap )
        {
            var Prev = Para.Get_DocumentPrev();
            if ( null != Prev && type_Paragraph === Prev.GetType() )
            {
                var PrevFramePr = Prev.Get_FramePr();
                if ( undefined != PrevFramePr && undefined != PrevFramePr.DropCap )
                {
                    Para = Prev;
                    FramePr = PrevFramePr;
                }
                else
                    return;
            }
            else
                return;
        }

        if ( undefined === FramePr )
            return;

        var FrameParas = Para.Internal_Get_FrameParagraphs();

        if ( false === bDropCap )
        {
            if ( false === this.Document_Is_SelectionLocked( changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : FrameParas, CheckType : changestype_Paragraph_Content } ) )
            {
                this.Create_NewHistoryPoint();
                var Count = FrameParas.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    FrameParas[Index].Set_FramePr(undefined, true);
                }

                this.Recalculate();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
            }
        }
        else
        {
            // Сначала найдем параграф, к которому относится буквица
            var Next = Para.Get_DocumentNext();
            var Last = Para;
            while ( null != Next )
            {
                if ( type_Paragraph != Next.GetType() || undefined === Next.Get_FramePr() || true != FramePr.Compare( Next.Get_FramePr() ) )
                    break;

                Last = Next;
                Next = Next.Get_DocumentNext();
            }

            if ( null != Next && type_Paragraph === Next.GetType() )
            {
                FrameParas.push(Next);
                if ( false === this.Document_Is_SelectionLocked( changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : FrameParas, CheckType : changestype_Paragraph_Content } ) )
                {
                    this.Create_NewHistoryPoint();

                    // Удалим ненужный элемент
                    FrameParas.splice( FrameParas.length - 1, 1 );

                    // Передвинем курсор в начало следующего параграфа, и рассчитаем текстовые настройки и расстояния между строк
                    Next.Cursor_MoveToStartPos();
                    var Spacing = Next.Get_CompiledPr2(false).ParaPr.Spacing.Copy();
                    var TextPr  = Next.Get_FirstRunPr();                   

                    var Count = FrameParas.length;
                    for ( var Index = 0; Index < Count; Index++ )
                    {
                        var FramePara = FrameParas[Index];
                        FramePara.Set_FramePr( undefined, true );
                        FramePara.Set_Spacing( Spacing, true );
                        FramePara.Select_All();
                        FramePara.Clear_TextFormatting();
                        FramePara.Apply_TextPr(TextPr, undefined);
                    }


                    Next.CopyPr( Last );
                    Last.Concat( Next );

                    this.Internal_Content_Remove(Next.Index, 1);

                    Last.Cursor_MoveToStartPos();
                    Last.Document_SetThisElementCurrent(true);

                    this.Recalculate();
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateRulersState();
                }
            }
            else
            {
                if ( false === this.Document_Is_SelectionLocked( changestype_None, { Type : changestype_2_ElementsArray_and_Type, Elements : FrameParas, CheckType : changestype_Paragraph_Content } ) )
                {
                    this.Create_NewHistoryPoint();
                    var Count = FrameParas.length;
                    for ( var Index = 0; Index < Count; Index++ )
                    {
                        FrameParas[Index].Set_FramePr(undefined, true);
                    }

                    this.Recalculate();
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateRulersState();
                }
            }
        }
    },

    Check_FramePrLastParagraph : function()
    {
        var Count = this.Content.length;
        if ( Count <= 0 )
            return;

        var Element = this.Content[Count - 1];
        if ( type_Paragraph === Element.GetType() && undefined !== Element.Get_FramePr() )
        {
            Element.Set_FramePr( undefined, true );
        }
    },

    CheckRange : function(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum)
    {
        var HdrFtrRanges = this.HdrFtr.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum);
        return this.DrawingObjects.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum, HdrFtrRanges, null);
    },

    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            // Не даем вставлять разрыв страницы в колонтитул
            if ( para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType )
                return;

            var bRetValue = this.HdrFtr.Paragraph_Add(ParaItem, bRecalculate);
            this.Document_UpdateSelectionState();
            this.Document_UpdateUndoRedoState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            // Не даем вставлять разрыв страницы в автофигуру
            if ( para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType )
                return;

            var bRetValue = this.DrawingObjects.paragraphAdd(ParaItem, bRecalculate);
            this.Document_UpdateSelectionState();
            this.Document_UpdateUndoRedoState();
            return bRetValue;
        }
        else //if ( docpostype === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                var Type = ParaItem.Get_Type();
                switch ( Type )
                {
                    case para_NewLine:
                    case para_Text:
                    case para_Space:
                    case para_Tab:
                    case para_PageNum:
                    {
                        // Если у нас что-то заселекчено и мы вводим текст или пробел
                        // и т.д., тогда сначала удаляем весь селект.
                        this.Remove( 1, true, false, true );
                        break;
                    }
                    case para_TextPr:
                    {
                        switch( this.Selection.Flag )
                        {
                            case selectionflag_Common:
                            {
                                // Текстовые настройки применяем ко всем параграфам, попавшим
                                // в селект.
                                var StartPos = this.Selection.StartPos;
                                var EndPos   = this.Selection.EndPos;
                                if ( EndPos < StartPos )
                                {
                                    var Temp = StartPos;
                                    StartPos = EndPos;
                                    EndPos   = Temp;
                                }

                                for ( var Index = StartPos; Index <= EndPos; Index++ )
                                {
                                    this.Content[Index].Add( ParaItem.Copy() );
                                }

                                if ( false != bRecalculate )
                                {
                                    // Если в TextPr только HighLight, тогда не надо ничего пересчитывать, только перерисовываем
                                    if ( true === ParaItem.Value.Check_NeedRecalc() )
                                    {
                                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                                        // попавшего в селект.
                                        this.ContentLastChangePos = StartPos;
                                        this.Recalculate();
                                    }
                                    else
                                    {
                                        // Просто перерисовываем нужные страницы
                                        var StartPage = this.Content[StartPos].Get_StartPage_Absolute();
                                        var EndPage   = this.Content[EndPos].Get_StartPage_Absolute() + this.Content[EndPos].Pages.length - 1;
                                        this.ReDraw( StartPage, EndPage );
                                    }
                                }

                                break;
                            }
                            case selectionflag_Numbering:
                            {
                                // Текстовые настройки применяем к конкретной нумерации
                                if ( null == this.Selection.Data || this.Selection.Data.length <= 0 )
                                    break;

                                if ( undefined != ParaItem.Value.FontFamily )
                                {
                                    var FName  = ParaItem.Value.FontFamily.Name;
                                    var FIndex = ParaItem.Value.FontFamily.Index;

                                    ParaItem.Value.RFonts = new CRFonts();
                                    ParaItem.Value.RFonts.Ascii    = { Name : FName, Index : FIndex };
                                    ParaItem.Value.RFonts.EastAsia = { Name : FName, Index : FIndex };
                                    ParaItem.Value.RFonts.HAnsi    = { Name : FName, Index : FIndex };
                                    ParaItem.Value.RFonts.CS       = { Name : FName, Index : FIndex };
                                }

                                var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                                var AbstrNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                                AbstrNum.Apply_TextPr( NumPr.Lvl, ParaItem.Value );

                                if ( false != bRecalculate )
                                {
                                    // Нам нужно пересчитать все изменения, начиная с первого элемента,
                                    // попавшего в селект.
                                    this.ContentLastChangePos = this.Selection.Data[0];
                                    this.Recalculate();
                                }

                                break;
                            }
                        }

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateUndoRedoState();

                        return;
                    }
                }
            }

            var Item = this.Content[this.CurPos.ContentPos];
            var ItemType = Item.GetType();

            if ( para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType )
            {
                if ( type_Paragraph === ItemType )
                {
                    if ( true === Item.Cursor_IsStart() )
                    {
                        this.Add_NewParagraph();
                        this.Content[this.CurPos.ContentPos - 1].Cursor_MoveToStartPos();
                        this.Content[this.CurPos.ContentPos - 1].Add( ParaItem );
                        this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                        // Нам нужно пересчитать все изменения, начиная с текущего элемента
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                    }
                    else
                    {
                        this.Add_NewParagraph();
                        this.Add_NewParagraph();
                        this.Content[this.CurPos.ContentPos - 1].Cursor_MoveToStartPos();
                        this.Content[this.CurPos.ContentPos - 1].Add( ParaItem );
                        this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                        // Нам нужно пересчитать все изменения, начиная с текущего элемента
                        this.ContentLastChangePos = this.CurPos.ContentPos - 2;
                    }

                    if ( false != bRecalculate )
                    {
                        this.Recalculate();

                        Item.CurPos.RealX = Item.CurPos.X;
                        Item.CurPos.RealY = Item.CurPos.Y;
                    }
                }
                else
                {
                    // TODO: PageBreak в таблице не ставим
                    return;
                }
            }
            else
            {
                Item.Add( ParaItem );

                if ( false != bRecalculate && type_Paragraph == Item.GetType() )
                {
                    if ( para_TextPr === ParaItem.Type && false === ParaItem.Value.Check_NeedRecalc() )
                    {
                        // Просто перерисовываем нужные страницы
                        var StartPage = Item.Get_StartPage_Absolute();
                        var EndPage   = StartPage + Item.Pages.length - 1;
                        this.ReDraw( StartPage, EndPage );
                    }
                    else
                    {
                        // Нам нужно пересчитать все изменения, начиная с текущего элемента
                        this.Recalculate(true);
                    }

                    Item.RecalculateCurPos();
                    Item.CurPos.RealX = Item.CurPos.X;
                    Item.CurPos.RealY = Item.CurPos.Y;
                }

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }

            // Специальная заглушка для функции TextBox_Put
            if ( true != this.TurnOffRecalc )
                this.Document_UpdateUndoRedoState();
        }
    },

    Paragraph_ClearFormatting : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Paragraph_ClearFormatting();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.paragraphClearFormatting();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( selectionflag_Common === this.Selection.Flag )
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos  = this.Selection.EndPos;
                    if ( StartPos > EndPos )
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }

                    for ( var Index = StartPos; Index <= EndPos; Index++ )
                    {
                        var Item = this.Content[Index];
                        if ( type_Table === Item.GetType() )
                            Item.Paragraph_ClearFormatting();
                        else if ( type_Paragraph === Item.GetType() )
                        {
                            Item.Clear_Formatting();
                            Item.Clear_TextFormatting();
                        }
                    }

                    // Нам нужно пересчитать все изменения, начиная с первого элемента,
                    // попавшего в селект.
                    this.ContentLastChangePos = StartPos;

                    this.Recalculate();

                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Table === Item.GetType() )
                    Item.Paragraph_ClearFormatting();
                else if ( type_Paragraph === Item.GetType() )
                {
                    Item.Clear_Formatting();
                    Item.Clear_TextFormatting();

                    // Нам нужно пересчитать все изменения, начиная с текущего элемента
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate();
                }

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
    {
        if ( undefined === bRemoveOnlySelection )
            bRemoveOnlySelection = false;

        if ( undefined === bOnTextAdd )
            bOnTextAdd = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var Res = this.HdrFtr.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);

            if ( null !== this.HdrFtr.CurHdtr && docpostype_DrawingObjects !== this.HdrFtr.CurHdrFtr.Content.CurPos.Type )
            {
                this.Selection_Remove();
                this.Selection.Use = false;
            }

            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
            return Res;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var Res = this.DrawingObjects.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
            return Res;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            this.Remove_NumberingSelection();

            // Если в документе что-то заселекчено, тогда удаляем селект
            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }
                
                // Проверим, пустой ли селект в конечном элементе (для случая, когда конечный элемент параграф, и в нем 
                // не заселекчен знак конца параграфа)
                if ( StartPos !== EndPos && true === this.Content[EndPos].Selection_IsEmpty(true) )
                    EndPos--;

                // Убираем селект
                this.Selection_Clear();
                this.Selection.Use = false;
                this.Selection.StartPos = 0;
                this.Selection.EndPos   = 0;

                this.DrawingDocument.TargetStart();

                if ( StartPos != EndPos )
                {
                    var StartType = this.Content[StartPos].GetType();
                    var EndType   = this.Content[EndPos].GetType();

                    var bStartEmpty, bEndEmpty;

                    // Если удаление идет по добавлению текста и выделение заканчивается таблицей,
                    // тогда мы просто сбрасываем выделение.
                    if ( true === bOnTextAdd && type_Table == EndType )
                    {
                        this.CurPos.ContentPos = StartPos;
                        return this.Cursor_MoveLeft(false, false);
                    }

                    if ( type_Paragraph == StartType )
                    {
                        // Удаляем выделенную часть параграфа
                        this.Content[StartPos].Remove( 1, true );
                        bStartEmpty = this.Content[StartPos].IsEmpty()
                    }
                    else if ( type_Table == StartType )
                    {
                        // Нам нужно удалить все выделенные строки в таблице
                        bStartEmpty = !(this.Content[StartPos].Row_Remove2());
                    }

                    if ( type_Paragraph == EndType )
                    {
                        // Удаляем выделенную часть параграфа
                        this.Content[EndPos].Remove( 1, true );

                        bEndEmpty = this.Content[EndPos].IsEmpty()
                    }
                    else if ( type_Table == EndType )
                    {
                        // Нам нужно удалить все выделенные строки в таблице
                        bEndEmpty = !(this.Content[EndPos].Row_Remove2());
                    }

                    if ( true != bStartEmpty && true != bEndEmpty )
                    {
                        // Удаляем весь промежуточный контент
                        this.Internal_Content_Remove( StartPos + 1, EndPos - StartPos - 1 );
                        this.CurPos.ContentPos = StartPos;

                        if ( type_Paragraph == StartType && type_Paragraph == EndType && true === bOnTextAdd )
                        {
                            // Встаем в конец параграфа и удаляем 1 элемент (чтобы соединить параграфы)
                            this.Content[StartPos].Cursor_MoveToEndPos(false, false);
                            this.Remove( 1, true );
                        }
                        else
                        {
                            this.CurPos.ContentPos = StartPos + 1;
                            this.Content[StartPos + 1].Cursor_MoveToStartPos();
                        }
                    }
                    else if ( true != bStartEmpty )
                    {
                        if ( true === bOnTextAdd && type_Table == StartType )
                        {
                            // Удаляем весь промежуточный контент, но последний параграф не удаляем
                            this.Internal_Content_Remove( StartPos + 1, EndPos - StartPos - 1 );

                            // Встаем в начало параграфа
                            this.CurPos.ContentPos = StartPos + 1;
                            this.Content[StartPos + 1].Cursor_MoveToStartPos();
                        }
                        else
                        {
                            // Удаляем весь промежуточный контент и последний параграф
                            this.Internal_Content_Remove( StartPos + 1, EndPos - StartPos );

                            if ( type_Paragraph == StartType )
                            {
                                // Встаем в конец параграфа
                                this.CurPos.ContentPos = StartPos;
                                this.Content[StartPos].Cursor_MoveToEndPos( false, false );
                            }
                            else if ( type_Table == StartType )
                            {
                                // У нас обязательно есть элемент после таблицы (либо снова таблица, либо параграф)
                                // Встаем в начало следующего элемента.
                                this.CurPos.ContentPos = StartPos + 1;
                                this.Content[StartPos + 1].Cursor_MoveToStartPos();
                            }
                        }
                    }
                    else if ( true != bEndEmpty )
                    {
                        // Удаляем весь промежуточный контент и начальный параграф
                        this.Internal_Content_Remove( StartPos, EndPos - StartPos );

                        // Встаем в начало параграфа
                        this.CurPos.ContentPos = StartPos;
                        this.Content[StartPos].Cursor_MoveToStartPos();
                    }
                    else
                    {
                        if ( true === bOnTextAdd )
                        {
                            // Удаляем весь промежуточный контент, начальный параграф, а конечный не удаляем
                            this.Internal_Content_Remove( StartPos, EndPos - StartPos );
                            this.CurPos.ContentPos = StartPos;
                            this.Content[StartPos].Cursor_MoveToStartPos();
                        }
                        else
                        {
                            // Удаляем весь промежуточный контент, начальный и конечный параграфы
                            // При таком удалении надо убедиться, что в документе останется хотя бы один элемент
                            if ( 0 === StartPos && (EndPos - StartPos + 1) >= this.Content.length )
                            {
                                var NewPara = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );
                                this.Internal_Content_Add( 0, NewPara );
                                this.Internal_Content_Remove( 1, this.Content.length - 1 );
                            }
                            else
                            {
                                this.Internal_Content_Remove( StartPos, EndPos - StartPos + 1 );                                    
                            }

                            // Выставляем текущую позицию
                            if ( StartPos >= this.Content.length )
                            {
                                // Документ не должен заканчиваться таблицей, поэтому здесь проверку не делаем
                                this.CurPos.ContentPos = this.Content.length - 1;
                                this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos( false, false );
                            }
                            else
                            {
                                this.CurPos.ContentPos = StartPos;
                                this.Content[StartPos].Cursor_MoveToStartPos();
                            }
                        }
                    }
                }
                else
                {
                    this.CurPos.ContentPos = StartPos;

                    if ( Count < 0 && type_Table === this.Content[StartPos].GetType() && table_Selection_Cell === this.Content[StartPos].Selection.Type && true != bOnTextAdd )
                    {
                        return this.Table_RemoveRow();
                    }
                    else if ( false === this.Content[StartPos].Remove( Count, true, bRemoveOnlySelection, bOnTextAdd ) )
                    {
                        // При добавлении текста, параграф не объединяется
                        if ( true != bOnTextAdd )
                        {
                            // В ворде параграфы объединяются только когда у них все настройки совпадают.
                            // (почему то при изменении и обратном изменении настроек параграфы перестают объединятся)
                            // Пока у нас параграфы будут объединяться всегда и настройки будут браться из первого
                            // параграфа, кроме случая, когда первый параграф полностью удаляется.

                            if ( true === this.Content[StartPos].IsEmpty() && this.Content.length > 1 )
                            {
                                this.Internal_Content_Remove( StartPos, 1 );

                                // Выставляем текущую позицию
                                if ( StartPos >= this.Content.length )
                                {
                                    // Документ не должен заканчиваться таблицей, поэтому здесь проверку не делаем
                                    this.CurPos.ContentPos = this.Content.length - 1;
                                    this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos( false, false );
                                }
                                else
                                {
                                    this.CurPos.ContentPos = StartPos;
                                    this.Content[StartPos].Cursor_MoveToStartPos();
                                }

                                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                                this.ContentLastChangePos = this.CurPos.ContentPos;
                                this.Recalculate();

                                this.Document_UpdateInterfaceState();
                                this.Document_UpdateRulersState();
                                return;
                            }
                            else if ( this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType() )
                            {
                                // Соединяем текущий и предыдущий параграфы
                                this.Content[StartPos].Concat( this.Content[StartPos + 1] );
                                this.Internal_Content_Remove( StartPos + 1, 1 );

                                this.Interface_Update_ParaPr();
                            }
                            else if ( this.Content.length === 1 && true === this.Content[0].IsEmpty() && Count > 0 )
                            {
                                var NewPara = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );
                                this.Internal_Content_Add( 0, NewPara );
                                this.Internal_Content_Remove( 1, this.Content.length - 1 );
                            }
                        }
                    }
                }

                // В текущей позиции this.CurPos.ContentPos может оказаться, либо оставшийся параграф,
                // после удаления (если параграфы удалялись не целиком), либо следующий за ним, либо
                // перед ним. В любом случае, ничего не испортится если мы у текущего параграфа удалим
                // селект.
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            }
            else
            {
                if ( true === bRemoveOnlySelection || true === bOnTextAdd )
                    return;

                if ( type_Paragraph == this.Content[this.CurPos.ContentPos].GetType() )
                {
                    var bNumbering = ( undefined != this.Content[this.CurPos.ContentPos].Numbering_Get() ? true : false );
                    if ( false === this.Content[this.CurPos.ContentPos].Remove( Count, bOnlyText ) )
                    {
                        if ( Count < 0 )
                        {
                            if ( this.CurPos.ContentPos > 0 && type_Paragraph == this.Content[this.CurPos.ContentPos - 1].GetType() )
                            {
                                var CurrFramePr = this.Content[this.CurPos.ContentPos].Get_FramePr();
                                var PrevFramePr = this.Content[this.CurPos.ContentPos - 1].Get_FramePr();

                                if ( (undefined === CurrFramePr && undefined === PrevFramePr) || ( undefined !== CurrFramePr && undefined !== PrevFramePr && true === CurrFramePr.Compare( PrevFramePr ) ) )
                                {
                                    if ( true === this.Content[this.CurPos.ContentPos - 1].IsEmpty() )
                                    {
                                        // Просто удаляем предыдущий параграф
                                        this.Internal_Content_Remove( this.CurPos.ContentPos - 1, 1 );
                                        this.CurPos.ContentPos--;
                                        this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                                    }
                                    else
                                    {
                                        // Соединяем текущий и предыдущий параграфы
                                        var Prev = this.Content[this.CurPos.ContentPos - 1];

                                        // Смещаемся в конец до объединения параграфов, чтобы курсор стоял в месте 
                                        // соединения.
                                        Prev.Cursor_MoveToEndPos();

                                        // Запоминаем новую позицию курсора, после совмещения параграфов
                                        Prev.Concat( this.Content[this.CurPos.ContentPos] );
                                        this.Internal_Content_Remove( this.CurPos.ContentPos, 1 );
                                        this.CurPos.ContentPos--;
                                    }
                                }
                            }
                        }
                        else if ( Count > 0 )
                        {
                            if ( this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType() )
                            {
                                var CurrFramePr = this.Content[this.CurPos.ContentPos].Get_FramePr();
                                var NextFramePr = this.Content[this.CurPos.ContentPos + 1].Get_FramePr();

                                if ( (undefined === CurrFramePr && undefined === NextFramePr) || ( undefined !== CurrFramePr && undefined !== NextFramePr && true === CurrFramePr.Compare( NextFramePr ) ) )
                                {
                                    if ( true === this.Content[this.CurPos.ContentPos].IsEmpty() )
                                    {
                                        // Просто удаляем текущий параграф
                                        this.Internal_Content_Remove( this.CurPos.ContentPos, 1 );
                                        this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                                    }
                                    else
                                    {
                                        // Соединяем текущий и следующий параграфы
                                        var Cur = this.Content[this.CurPos.ContentPos];
                                        Cur.Concat( this.Content[this.CurPos.ContentPos + 1] );
                                        this.Internal_Content_Remove( this.CurPos.ContentPos + 1, 1 );
                                    }
                                }
                            }
                            else if ( true == this.Content[this.CurPos.ContentPos].IsEmpty() && this.CurPos.ContentPos == this.Content.length - 1 && this.CurPos.ContentPos != 0 && type_Table != this.Content[this.CurPos.ContentPos - 1].GetType() )
                            {
                                // Если данный параграф пустой, последний, не единственный и идущий перед
                                // ним элемент не таблица, удаляем его
                                this.Internal_Content_Remove( this.CurPos.ContentPos, 1 );
                                this.CurPos.ContentPos--;
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с текущего элемента
                        this.ContentLastChangePos = this.CurPos.ContentPos;
                        this.Recalculate();
                    }
                    else
                    {
                        if ( true === bNumbering && undefined == this.Content[this.CurPos.ContentPos].Numbering_Get() )
                        {
                            // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                            this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                            this.Recalculate();

                        }
                        else
                        {
                            // Нам нужно пересчитать все изменения, начиная с текущего элемента
                            this.ContentLastChangePos = this.CurPos.ContentPos;
                            this.Recalculate(true);
                        }
                    }

                    var Item = this.Content[this.CurPos.ContentPos];
                    if ( type_Paragraph == Item.GetType() )
                    {
                        Item.CurPos.RealX = Item.CurPos.X;
                        Item.CurPos.RealY = Item.CurPos.Y;
                    }
                }
                else if ( type_Table == this.Content[this.CurPos.ContentPos].GetType() )
                {
                    // Remove сам вызывет команду Recalculate
                    this.Content[this.CurPos.ContentPos].Remove( Count, bOnlyText );
                }
            }

            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Cursor_GetPos : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_GetPos();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.cursorGetPos();
        }
        else if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( selectionflag_Common === this.Selection.Flag )
                {
                    return this.Content[this.Selection.EndPos].Cursor_GetPos();
                }

                return { X: 0, Y : 0 };
            }
            else
            {
                return this.Content[this.CurPos.ContentPos].Cursor_GetPos();
            }
        }
    },

    Cursor_MoveToStartPos : function(AddToSelect)
    {
        if ( true === AddToSelect )
        {
            if ( docpostype_HdrFtr === this.CurPos.Type )
            {
                this.HdrFtr.Cursor_MoveToStartPos( true );
            }
            else if ( docpostype_DrawingObjects === this.CurPos.Type )
            {
                // TODO: Пока ничего не делаем, в дальнейшем надо будет делать в зависимости от селекта внутри
                //       автофигуры: если селект текста внутри, то делать для текста внутри, а если выделена
                //       сама автофигура, тогда мы перемещаем курсор влево от нее в контенте параграфа и выделяем все до конца
            }
            else if ( docpostype_Content === this.CurPos.Type )
            {
                var StartPos = ( true === this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos )
                var EndPos   = 0;

                this.Selection.Start    = false;
                this.Selection.Use      = true;
                this.Selection.StartPos = StartPos;
                this.Selection.EndPos   = EndPos;
                this.Selection.Flag     = selectionflag_Common;

                this.CurPos.ContentPos = 0;
                this.CurPos.Type       = docpostype_Content;

                for ( var Index = StartPos - 1; Index >= EndPos; Index-- )
                {
                    var Item = this.Content[Index];
                    Item.Selection.Use = true;
                    var ItemType = Item.GetType();

                    if ( type_Paragraph === ItemType )
                    {
                        Item.Select_All( -1 );
                    }
                    else //if ( type_Table === ItemType )
                    {
                        var Row  = Item.Content.length - 1;
                        var Cell = Item.Content[Row].Get_CellsCount() - 1;
                        var Pos0  = { Row: 0, Cell : 0 };
                        var Pos1  = { Row: Row, Cell : Cell };

                        Item.Selection.EndPos.Pos   = Pos0;
                        Item.Selection.StartPos.Pos = Pos1;
                        Item.Internal_Selection_UpdateCells();
                    }
                }

                this.Content[StartPos].Cursor_MoveToStartPos(true);
            }
        }
        else
        {
            if ( docpostype_HdrFtr === this.CurPos.Type )
            {
                this.HdrFtr.Cursor_MoveToStartPos( false );
            }
            else
            {
                this.Selection_Remove();

                this.Selection.Start    = false;
                this.Selection.Use      = false;
                this.Selection.StartPos = 0;
                this.Selection.EndPos   = 0;
                this.Selection.Flag     = selectionflag_Common;

                this.CurPos.ContentPos = 0;
                this.CurPos.Type       = docpostype_Content;
                this.Content[0].Cursor_MoveToStartPos(false);
            }
        }
    },

    Cursor_MoveToEndPos : function(AddToSelect)
    {
        if ( true === AddToSelect )
        {
            if ( docpostype_HdrFtr === this.CurPos.Type )
            {
                this.HdrFtr.Cursor_MoveToEndPos( true );
            }
            else if ( docpostype_DrawingObjects === this.CurPos.Type )
            {
                // TODO: Пока ничего не делаем, в дальнейшем надо будет делать в зависимости от селекта внутри
                //       автофигуры: если селект текста внутри, то делать для текста внутри, а если выделена
                //       сама автофигура, тогда мы перемещаем курсор влево от нее в контенте параграфа и выделяем все до конца
            }
            else if ( docpostype_Content === this.CurPos.Type )
            {
                var StartPos = ( true === this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos )
                var EndPos   = this.Content.length - 1;

                this.Selection.Start    = false;
                this.Selection.Use      = true;
                this.Selection.StartPos = StartPos;
                this.Selection.EndPos   = EndPos;
                this.Selection.Flag     = selectionflag_Common;

                this.CurPos.ContentPos = this.Content.length - 1;
                this.CurPos.Type       = docpostype_Content;

                for ( var Index = StartPos + 1; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    Item.Selection.Use = true;
                    var ItemType = Item.GetType();

                    if ( type_Paragraph === ItemType )
                    {
                        Item.Select_All( 1 );
                    }
                    else //if ( type_Table === ItemType )
                    {
                        var Row  = Item.Content.length - 1;
                        var Cell = Item.Content[Row].Get_CellsCount() - 1;
                        var Pos0  = { Row: 0, Cell : 0 };
                        var Pos1  = { Row: Row, Cell : Cell };

                        Item.Selection.StartPos.Pos = Pos0;
                        Item.Selection.EndPos.Pos   = Pos1;
                        Item.Internal_Selection_UpdateCells();
                    }
                }

                this.Content[StartPos].Cursor_MoveToEndPos(true, false);
            }
        }
        else
        {
            if ( docpostype_HdrFtr === this.CurPos.Type )
            {
                this.HdrFtr.Cursor_MoveToEndPos( false );
            }
            else
            {
                this.Selection_Remove();

                this.Selection.Start    = false;
                this.Selection.Use      = false;
                this.Selection.StartPos = 0;
                this.Selection.EndPos   = 0;
                this.Selection.Flag     = selectionflag_Common;

                this.CurPos.ContentPos = this.Content.length - 1;
                this.CurPos.Type       = docpostype_Content;
                this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos(false);
            }
        }
    },

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        if ( "undefined" === typeof(Word) || null === Word )
            Word = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var RetValue = this.HdrFtr.Cursor_MoveLeft(AddToSelect, Word);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var RetValue = this.DrawingObjects.cursorMoveLeft(AddToSelect, Word);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            this.Remove_NumberingSelection();
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    // Добавляем к селекту
                    if ( false === this.Content[this.Selection.EndPos].Cursor_MoveLeft( 1, true, Word ) )
                    {
                        // Нужно перейти в конец предыдущего элемента
                        if ( 0 != this.Selection.EndPos )
                        {
                            this.Selection.EndPos--;
                            this.CurPos.ContentPos = this.Selection.EndPos;

                            var Item = this.Content[this.Selection.EndPos];

                            if ( type_Paragraph == Item.GetType()  )
                            {
                                Item.Cursor_MoveToEndPos( false, true );
                                Item.Cursor_MoveLeft( 1, true, Word );
                            }
                            else if ( type_Table == Item.GetType() )
                            {
                                if ( false === Item.Is_SelectionUse() )
                                {
                                    var LastRow = Item.Content[Item.Content.length - 1];

                                    // Нам нужно выделить последний ряд таблицы
                                    Item.Selection.Use  = true;
                                    Item.Selection.Type = table_Selection_Cell;
                                    Item.Selection.StartPos.Pos = { Row : LastRow.Index, Cell : LastRow.Get_CellsCount() - 1 };
                                    Item.Selection.EndPos.Pos   = { Row : LastRow.Index, Cell : 0 };
                                    Item.CurCell = LastRow.Get_Cell( 0 );
                                    Item.Selection.Data = [];

                                    for ( var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++ )
                                    {
                                        Item.Selection.Data.push( { Cell : CellIndex, Row : LastRow.Index } );
                                    }
                                }
                                else
                                    Item.Cursor_MoveLeft( 1, true, Word );
                            }
                        }
                    }

                    // Проверяем не обнулился ли селект в последнем элементе. Такое могло быть, если была
                    // заселекчена одна буква в последнем параграфе, а мы убрали селект последним действием.
                    if ( this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Is_SelectionUse() )
                    {
                        // Такая ситуация возможна только при прямом селекте (сверху вниз), поэтому вычитаем
                        this.Selection.EndPos--;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                }
                else
                {
                    // Нам нужно переместить курсор в левый край селекта, и отменить весь селект
                    var Start = this.Selection.StartPos;
                    if ( Start > this.Selection.EndPos )
                        Start = this.Selection.EndPos;

                    this.CurPos.ContentPos = Start;
                    this.Content[this.CurPos.ContentPos].Cursor_MoveLeft( 1, false, Word );

                    this.Selection_Remove();
                }
            }
            else
            {
                if ( true === AddToSelect )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos   = this.CurPos.ContentPos;

                    if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft( 1, true, Word ) )
                    {
                        // Нужно перейти в конец предыдущего элемент
                        if ( 0 != this.CurPos.ContentPos )
                        {
                            this.CurPos.ContentPos--;
                            var Item = this.Content[this.CurPos.ContentPos];
                            this.Selection.EndPos = this.CurPos.ContentPos;

                            if ( type_Paragraph == Item.GetType()  )
                            {
                                Item.Cursor_MoveToEndPos( false, true );
                                Item.Cursor_MoveLeft( 1, true, Word );
                            }
                            else if ( type_Table == Item.GetType() )
                            {
                                if ( false === Item.Is_SelectionUse() )
                                {
                                    var LastRow = Item.Content[Item.Content.length - 1];

                                    // Нам нужно выделить последний ряд таблицы
                                    Item.Selection.Use  = true;
                                    Item.Selection.Type = table_Selection_Cell;
                                    Item.Selection.StartPos.Pos = { Row : LastRow.Index, Cell : LastRow.Get_CellsCount() - 1 };
                                    Item.Selection.EndPos.Pos   = { Row : LastRow.Index, Cell : 0 };
                                    Item.CurCell = LastRow.Get_Cell( 0 );
                                    Item.Selection.Data = [];

                                    for ( var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++ )
                                    {
                                        Item.Selection.Data.push( { Cell : CellIndex, Row : LastRow.Index } );
                                    }
                                }
                                else
                                    Item.Cursor_MoveLeft( 1, true, Word );
                            }
                        }
                    }

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                }
                else
                {
                    if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft( 1, false, Word ) )
                    {
                        // Нужно перейти в конец предыдущего элемент
                        if ( 0 != this.CurPos.ContentPos )
                        {
                            this.CurPos.ContentPos--;
                            this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
                        }
                    }
                }
            }

            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Cursor_MoveRight : function(AddToSelect, Word, FromPaste)
    {
        if ( "undefined" === typeof(Word) || null === Word )
            Word = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var RetValue = this.HdrFtr.Cursor_MoveRight(AddToSelect, Word);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var RetValue = this.DrawingObjects.cursorMoveRight(AddToSelect, Word);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            this.Remove_NumberingSelection();
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    // Добавляем к селекту
                    if ( false === this.Content[this.Selection.EndPos].Cursor_MoveRight( 1, true, Word ) )
                    {
                        // Нужно перейти в начало следующего элемента
                        if ( this.Content.length - 1 != this.Selection.EndPos )
                        {
                            this.Selection.EndPos++;
                            this.CurPos.ContentPos = this.Selection.EndPos;

                            var Item = this.Content[this.Selection.EndPos];
                            if ( type_Paragraph === Item.GetType() )
                            {
                                if ( false === Item.Is_SelectionUse() )
                                {
                                    var StartPos = Item.Internal_GetStartPos();
                                    Item.CurPos.ContentPos  = StartPos;
                                    Item.Selection.Use      = true;
                                    Item.Selection.StartPos = StartPos;
                                    Item.Selection.EndPos   = StartPos;
                                }

                                Item.Cursor_MoveRight( 1, true, Word );
                            }
                            else if ( type_Table === Item.GetType() )
                            {
                                if ( false === Item.Is_SelectionUse() )
                                {
                                    var FirstRow = Item.Content[0];

                                    // Нам нужно выделить первый ряд таблицы
                                    Item.Selection.Use  = true;
                                    Item.Selection.Type = table_Selection_Cell;
                                    Item.Selection.StartPos.Pos = { Row : 0, Cell : 0 };
                                    Item.Selection.EndPos.Pos   = { Row : 0, Cell : FirstRow.Get_CellsCount() - 1 };
                                    Item.CurCell = FirstRow.Get_Cell( FirstRow.Get_CellsCount() - 1 );
                                    Item.Selection.Data = [];

                                    for ( var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++ )
                                    {
                                        Item.Selection.Data.push( { Cell : CellIndex, Row : 0 } );
                                    }
                                }
                                else
                                    Item.Cursor_MoveRight( 1, true, Word );
                            }
                        }
                    }

                    // Проверяем не обнулился ли селект в последнем параграфе. Такое могло быть, если была
                    // заселекчена одна буква в последнем параграфе, а мы убрали селект последним действием.
                    if ( this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Is_SelectionUse() )
                    {
                        // Такая ситуация возможна только при обратном селекте (снизу вверх), поэтому вычитаем
                        this.Selection.EndPos++;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                }
                else
                {
                    // Нам нужно переместить курсор в правый край селекта, и отменить весь селект
                    var End = this.Selection.EndPos;
                    if ( End < this.Selection.StartPos )
                        End = this.Selection.StartPos;

                    this.CurPos.ContentPos = End;

                    if (true === FromPaste && type_Table === this.Content[this.CurPos.ContentPos].Get_Type() && true === this.Content[this.CurPos.ContentPos].Selection_IsToEnd() && this.Content.length - 1 !== this.CurPos.ContentPos)
                    {
                        this.CurPos.ContentPos = End + 1;
                        this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos(false);
                    }
                    else
                    {
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, false, Word, FromPaste))
                        {
                            if (this.Content.length - 1 === this.CurPos.ContentPos)
                            {
                                var Item = this.Content[this.CurPos.ContentPos];
                                Item.Cursor_MoveToEndPos(false);
                            }
                        }
                    }

                    this.Selection_Remove();
                }
            }
            else
            {
                if ( true === AddToSelect )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos   = this.CurPos.ContentPos;

                    if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight( 1, true, Word ) )
                    {
                        // Нужно перейти в конец предыдущего элемента
                        if ( this.Content.length - 1 != this.CurPos.ContentPos )
                        {
                            this.CurPos.ContentPos++;
                            var Item = this.Content[this.CurPos.ContentPos];
                            this.Selection.EndPos = this.CurPos.ContentPos;

                            if ( type_Paragraph === Item.GetType() )
                            {
                                if ( false === Item.Is_SelectionUse() )
                                {
                                    var StartPos = Item.Internal_GetStartPos();
                                    Item.CurPos.ContentPos  = StartPos;
                                    Item.Selection.Use      = true;
                                    Item.Selection.StartPos = StartPos;
                                    Item.Selection.EndPos   = StartPos;
                                }

                                Item.Cursor_MoveRight( 1, true, Word );
                            }
                            else if ( type_Table === Item.GetType() )
                            {
                                if ( false === Item.Is_SelectionUse() )
                                {
                                    var FirstRow = Item.Content[0];

                                    // Нам нужно выделить первый ряд таблицы
                                    Item.Selection.Use  = true;
                                    Item.Selection.Type = table_Selection_Cell;
                                    Item.Selection.StartPos.Pos = { Row : 0, Cell : 0 };
                                    Item.Selection.EndPos.Pos   = { Row : 0, Cell : FirstRow.Get_CellsCount() - 1 };
                                    Item.CurCell = FirstRow.Get_Cell( FirstRow.Get_CellsCount() - 1 );
                                    Item.Selection.Data = [];

                                    for ( var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++ )
                                    {
                                        Item.Selection.Data.push( { Cell : CellIndex, Row : 0 } );
                                    }
                                }
                                else
                                    Item.Cursor_MoveRight( 1, true, Word );
                            }
                        }
                    }

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                }
                else
                {
                    if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight( 1, false, Word ) )
                    {
                        // Нужно перейти в начало следующего элемента
                        if ( this.Content.length - 1 != this.CurPos.ContentPos )
                        {
                            this.CurPos.ContentPos++;
                            this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                        }
                    }
                }
            }

            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var RetValue = this.HdrFtr.Cursor_MoveUp(AddToSelect);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var RetValue = this.DrawingObjects.cursorMoveUp(AddToSelect);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            this.Remove_NumberingSelection();
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    // Добавляем к селекту
                    var Item = this.Content[this.Selection.EndPos];
                    if ( false === Item.Cursor_MoveUp( 1, true ) && 0 != this.Selection.EndPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.Selection.EndPos--;
                        Item = this.Content[this.Selection.EndPos];
                        Item.Cursor_MoveUp_To_LastRow( this.CurPos.RealX, this.CurPos.RealY, true );
                    }

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                        this.Selection.Use = false;

                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
                else
                {
                    // Мы должны переместиться на строку выше, чем начало селекта
                    var Start = this.Selection.StartPos;
                    if ( Start > this.Selection.EndPos )
                        Start = this.Selection.EndPos;

                    this.CurPos.ContentPos = Start;

                    var Item = this.Content[this.CurPos.ContentPos];
                    if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveUp( 1, false ) && 0 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow( this.CurPos.RealX, this.CurPos.RealY, false );
                    }

                    this.Selection_Remove();
                }
            }
            else
            {
                if ( true === AddToSelect )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos   = this.CurPos.ContentPos;

                    var Item = this.Content[this.CurPos.ContentPos];
                    if ( false === Item.Cursor_MoveUp( 1, true ) && 0 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow( this.CurPos.RealX, this.CurPos.RealY, true );
                        this.Selection.EndPos = this.CurPos.ContentPos;
                    }

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                        this.Selection.Use = false;

                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
                else
                {
                    var Item = this.Content[this.CurPos.ContentPos];
                    if ( false === Item.Cursor_MoveUp( 1, false ) && 0 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow( this.CurPos.RealX, this.CurPos.RealY, false );
                    }
                }
            }

            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var RetValue = this.HdrFtr.Cursor_MoveDown(AddToSelect);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var RetValue = this.DrawingObjects.cursorMoveDown(AddToSelect);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            this.Remove_NumberingSelection();
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    // Добавляем к селекту
                    var Item = this.Content[this.Selection.EndPos];
                    if ( false === Item.Cursor_MoveDown( 1, true ) && this.Content.length - 1 != this.Selection.EndPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.Selection.EndPos++;
                        Item = this.Content[this.Selection.EndPos];
                        Item.Cursor_MoveDown_To_FirstRow( this.CurPos.RealX, this.CurPos.RealY, true );
                    }

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                        this.Selection.Use = false;

                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
                else
                {
                    // Мы должны переместиться на строку ниже, чем конец селекта
                    var End = this.Selection.EndPos;
                    if ( End < this.Selection.StartPos )
                        End = this.Selection.StartPos;

                    this.CurPos.ContentPos = End;

                    var Item = this.Content[this.CurPos.ContentPos];

                    if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveDown( 1, false ) && this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow( this.CurPos.RealX, this.CurPos.RealY, false );
                    }

                    this.Selection_Remove();
                }
            }
            else
            {
                if ( true === AddToSelect )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos   = this.CurPos.ContentPos;

                    var Item = this.Content[this.CurPos.ContentPos];
                    if ( false === Item.Cursor_MoveDown( 1, true ) && this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow( this.CurPos.RealX, this.CurPos.RealY, true );
                        this.Selection.EndPos = this.CurPos.ContentPos;
                    }

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                        this.Selection.Use = false;

                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
                else
                {
                    var Item = this.Content[this.CurPos.ContentPos];

                    if ( false === Item.Cursor_MoveDown( 1, AddToSelect ) && this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow( this.CurPos.RealX, this.CurPos.RealY, false );
                    }
                }
            }

            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var RetValue = this.HdrFtr.Cursor_MoveEndOfLine(AddToSelect);
            this.Document_UpdateInterfaceState();
            return RetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var RetValue = this.DrawingObjects.cursorMoveEndOfLine(AddToSelect);
            this.Document_UpdateInterfaceState();
            return RetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            this.Remove_NumberingSelection();
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    var Item = this.Content[this.Selection.EndPos];
                    Item.Cursor_MoveEndOfLine(AddToSelect);

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                }
                else
                {
                    var Pos = ( this.Selection.EndPos >= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos );
                    this.CurPos.ContentPos = Pos;

                    var Item = this.Content[Pos];
                    Item.Cursor_MoveEndOfLine(AddToSelect);

                    this.Selection_Remove();
                }
            }
            else
            {
                if ( true === AddToSelect )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos   = this.CurPos.ContentPos;

                    var Item = this.Content[this.CurPos.ContentPos];
                    Item.Cursor_MoveEndOfLine(AddToSelect);

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                }
                else
                {
                    var Item = this.Content[this.CurPos.ContentPos];
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                }
            }

            this.Document_UpdateInterfaceState();
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var RetValue = this.HdrFtr.Cursor_MoveStartOfLine(AddToSelect);
            this.Document_UpdateInterfaceState();
            return RetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var RetValue = this.DrawingObjects.cursorMoveStartOfLine(AddToSelect);
            this.Document_UpdateInterfaceState();
            return RetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            this.Remove_NumberingSelection();
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    var Item = this.Content[this.Selection.EndPos];
                    Item.Cursor_MoveStartOfLine(AddToSelect);

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                    {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                }
                else
                {
                    var Pos = ( this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );
                    this.CurPos.ContentPos = Pos;

                    var Item = this.Content[Pos];
                    Item.Cursor_MoveStartOfLine(AddToSelect);

                    this.Selection_Remove();
                }
            }
            else
            {
                if ( true === AddToSelect )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos   = this.CurPos.ContentPos;

                    var Item = this.Content[this.CurPos.ContentPos];
                    Item.Cursor_MoveStartOfLine(AddToSelect);

                    // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                    if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                    {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                }
                else
                {
                    var Item = this.Content[this.CurPos.ContentPos];
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                }
            }

            this.Document_UpdateInterfaceState();
        }
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_MoveAt(X, Y, this.CurPage, AddToSelect);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.cursorMoveAt( X, Y, AddToSelect );
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            this.Remove_NumberingSelection();
            if ( true === this.Selection.Use )
            {
                if ( true === AddToSelect )
                {
                    this.Selection_SetEnd( X, Y, true );
                }
                else
                {
                    this.Selection_Remove();

                    var ContentPos = this.Internal_GetContentPosByXY(X,Y);
                    this.CurPos.ContentPos = ContentPos;
                    this.Content[ContentPos].Cursor_MoveAt(X,Y, false, false, this.CurPage);

                    this.Document_UpdateInterfaceState();
                }
            }
            else
            {
                if ( true === AddToSelect )
                {
                    this.Selection.Use = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Content[this.CurPos.ContentPos].Selection.Use = true;
                    this.Content[this.CurPos.ContentPos].Selection.StartPos = this.Content[this.CurPos.ContentPos].CurPos.ContentPos;

                    this.Selection_SetEnd( X, Y, true );
                }
                else
                {
                    var ContentPos = this.Internal_GetContentPosByXY(X,Y);
                    this.CurPos.ContentPos = ContentPos;
                    this.Content[ContentPos].Cursor_MoveAt(X,Y, false, false, this.CurPage);

                    this.Document_UpdateInterfaceState();
                }
            }
        }
    },

    Cursor_MoveToCell : function(bNext)
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Cursor_MoveToCell( bNext );
        }
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            this.DrawingObjects.cursorMoveToCell( bNext );
        }
        else //if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType() )
                    this.Content[this.Selection.StartPos].Cursor_MoveToCell(bNext);
            }
            else
            {
                if ( type_Table === this.Content[this.CurPos.ContentPos].GetType() )
                    this.Content[this.CurPos.ContentPos].Cursor_MoveToCell(bNext);
            }
        }
    },

    Set_ParagraphAlign : function(Align)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Set_ParagraphAlign(Align);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            if ( true != this.DrawingObjects.isSelectedText() )
            {
                var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                if ( null != ParaDrawing )
                {
                    var Paragraph = ParaDrawing.Parent;
                    Paragraph.Set_Align(Align);
                }
            }
            else
            {
                this.DrawingObjects.setParagraphAlign(Align);
            }
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( type_Paragraph == Item.GetType() )
                        Item.Set_Align( Align, true );
                    else if ( type_Table == Item.GetType() )
                    {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphAlign( Align );
                        Item.TurnOn_RecalcEvent();
                    }
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Set_Align( Align, true );
                }
                else if ( type_Table == Item.GetType() )
                {
                    Item.Set_ParagraphAlign( Align );
                }
            }

        }

        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphSpacing(Spacing);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphSpacing(Spacing);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( type_Paragraph == Item.GetType() )
                        Item.Set_Spacing( Spacing, false );
                    else if ( type_Table == Item.GetType() )
                    {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphSpacing( Spacing );
                        Item.TurnOn_RecalcEvent();
                    }
                }
                // Нам нужно пересчитать все изменения, начиная с первого элемента,
                // попавшего в селект.
                this.ContentLastChangePos = StartPos - 1;

                this.Recalculate();

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Set_Spacing( Spacing, false );

                // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos - 1;

                this.Recalculate();
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Set_ParagraphSpacing( Spacing );
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphTabs : function(Tabs)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphTabs(Tabs);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            editor.Update_ParaTab( Default_Tab_Stop, Tabs );
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphTabs(Tabs);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            editor.Update_ParaTab( Default_Tab_Stop, Tabs );
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( type_Paragraph == Item.GetType() )
                        Item.Set_Tabs( Tabs );
                    else if ( type_Table == Item.GetType() )
                    {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphTabs( Tabs );
                        Item.TurnOn_RecalcEvent();
                    }
                }

                // Нам нужно пересчитать все изменения, начиная с первого элемента,
                // попавшего в селект.
                this.ContentLastChangePos = StartPos;

                this.Recalculate();

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();

                editor.Update_ParaTab( Default_Tab_Stop, Tabs );

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Set_Tabs( Tabs );

                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate( true );

                editor.Update_ParaTab( Default_Tab_Stop, Tabs );
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Set_ParagraphTabs( Tabs );
                editor.Update_ParaTab( Default_Tab_Stop, Tabs );
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphIndent : function(Ind)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphIndent(Ind);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphIndent(Ind);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( type_Paragraph == Item.GetType() )
                    {
                        var NumPr = null;
                        if ( "number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != ( NumPr = Item.Numbering_Get() ) )
                        {
                            if ( Ind.ChangeLevel > 0 )
                                Item.Numbering_Add( NumPr.NumId, Math.min( 8, NumPr.Lvl + 1 ) );
                            else
                                Item.Numbering_Add( NumPr.NumId, Math.max( 0, NumPr.Lvl - 1 ) );
                        }
                        else
                        {
                            Item.Set_Ind( Ind, false );
                        }
                    }
                    else if ( type_Table == Item.GetType() )
                    {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphIndent( Ind );
                        Item.TurnOn_RecalcEvent();
                    }
                }

                // Нам нужно пересчитать все изменения, начиная с первого элемента,
                // попавшего в селект.
                this.ContentLastChangePos = StartPos;

                this.Recalculate();

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                var NumPr = null;
                if ( "number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != ( NumPr = Item.Numbering_Get() ) )
                {
                    if ( Ind.ChangeLevel > 0 )
                        Item.Numbering_Add( NumPr.NumId, Math.min( 8, NumPr.Lvl + 1 ) );
                    else
                        Item.Numbering_Add( NumPr.NumId, Math.max( 0, NumPr.Lvl - 1 ) );
                }
                else
                {
                    Item.Set_Ind( Ind, false );
                }

                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate();
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Set_ParagraphIndent( Ind );
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphNumbering(NumInfo);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphNumbering(NumInfo);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag )
            {
                if ( this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType() )
                {
                    this.Content[this.Selection.StartPos].Set_ParagraphNumbering( NumInfo );
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return true;
                }

                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                if ( NumInfo.SubType < 0 )
                {
                    // Убираем список из всех параграфов попавших в селект
                    for ( var Index = StartPos; Index <= EndPos; Index++ )
                    {
                        if ( type_Paragraph == this.Content[Index].GetType() )
                            this.Content[Index].Numbering_Remove();
                        else if ( type_Table == this.Content[Index].GetType() )
                        {
                            this.Content[Index].TurnOff_RecalcEvent();
                            this.Content[Index].Set_ParagraphNumbering( NumInfo );
                            this.Content[Index].TurnOn_RecalcEvent();
                        }
                    }
                }
                else
                {
                    switch( NumInfo.Type )
                    {
                        case 0: // Bullet
                        {
                            if ( 0 === NumInfo.SubType )
                            {
                                // Если мы просто нажимаем добавить маркированный список, тогда мы пытаемся
                                // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                                // есть список, и этот список маркированный)

                                // Проверяем предыдущий элемент
                                var Prev = this.Content[StartPos - 1];
                                var NumId  = null;
                                var NumLvl = 0;

                                if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                                {
                                    var PrevNumPr = Prev.Numbering_Get();
                                    if ( undefined != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet ) )
                                    {
                                        NumId  = PrevNumPr.NumId;
                                        NumLvl = PrevNumPr.Lvl;
                                    }
                                }

                                // Предыдущий параграф не содержит списка, либо список не того формата
                                // создаем новую нумерацию (стандартную маркированный список)
                                if ( null === NumId )
                                {
                                    NumId  = this.Numbering.Create_AbstractNum();
                                    NumLvl = 0;

                                    this.Numbering.Get_AbstractNum( NumId ).Create_Default_Bullet();
                                }

                                // Параграфы, которые не содержали списка у них уровень выставляем NumLvl,
                                // а у тех которые содержали, мы уровень не меняем
                                for ( var Index = StartPos; Index <= EndPos; Index++ )
                                {
                                    var OldNumPr = null;

                                    if ( type_Paragraph === this.Content[Index].GetType() )
                                    {
                                        if ( undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                            this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                        else
                                            this.Content[Index].Numbering_Add( NumId, NumLvl );
                                    }
                                    else if ( type_Table == this.Content[Index].GetType() )
                                    {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }
                            else
                            {
                                // Для начала пробежимся по отмеченным параграфам и узнаем, есть ли
                                // среди них параграфы со списками разных уровней.
                                var bDiffLvl = false;
                                var bDiffId  = false;
                                var PrevLvl = null;
                                var PrevId  = null;
                                for ( var Index = StartPos; Index <= EndPos; Index++ )
                                {
                                    var NumPr = null;
                                    if ( type_Paragraph === this.Content[Index].GetType() && undefined != ( NumPr = this.Content[Index].Numbering_Get() ) )
                                    {
                                        if ( null === PrevLvl )
                                            PrevLvl = NumPr.Lvl;

                                        if ( null === PrevId )
                                            PrevId  = NumPr.NumId;

                                        if ( PrevId != NumPr.NumId )
                                            bDiffId = true;

                                        if ( PrevLvl != NumPr.Lvl )
                                        {
                                            bDiffLvl = true;
                                            break;
                                        }
                                    }
                                    else if ( (type_Paragraph === this.Content[Index].GetType() && undefined === NumPr) || type_Table === this.Content[Index].GetType() )
                                    {
                                        bDiffLvl = true;
                                        break;
                                    }
                                }

                                // 1. Если у нас есть параграфы со списками разных уровней, тогда мы
                                //    делаем стандартный маркированный список, у которого первый(нулевой)
                                //    уровень изменен на тот который задан через NumInfo.SubType
                                // 2. Если все параграфы содержат списки одного уровня.
                                //    2.1 Если у всех списков одинаковый Id, тогда мы создаем
                                //        копию текущего списка и меняем в нем текущий уровень
                                //        на тот, который задан через NumInfo.SubType
                                //    2.2 Если у списков разные Id, тогда мы создаем стандартный
                                //        маркированный список с измененным уровнем (равным текущему),
                                //        на тот, который прописан в NumInfo.Subtype

                                var LvlText   = "";
                                var LvlTextPr = new CTextPr();
                                LvlTextPr.RFonts.Set_All( "Times New Roman", -1 );

                                switch ( NumInfo.SubType )
                                {
                                    case 1:
                                    {
                                        LvlText = String.fromCharCode( 0x00B7 );
                                        LvlTextPr.RFonts.Set_All( "Symbol", -1 );
                                        break;
                                    }
                                    case 2:
                                    {
                                        LvlText = "o";
                                        LvlTextPr.RFonts.Set_All( "Courier New", -1 );
                                        break;
                                    }
                                    case 3:
                                    {
                                        LvlText = String.fromCharCode( 0x00A7 );
                                        LvlTextPr.RFonts.Set_All( "Wingdings", -1 );
                                        break;
                                    }
                                    case 4:
                                    {
                                        LvlText = String.fromCharCode( 0x0076 );
                                        LvlTextPr.RFonts.Set_All( "Wingdings", -1 );
                                        break;
                                    }
                                    case 5:
                                    {
                                        LvlText = String.fromCharCode( 0x00D8 );
                                        LvlTextPr.RFonts.Set_All( "Wingdings", -1 );
                                        break;
                                    }
                                    case 6:
                                    {
                                        LvlText = String.fromCharCode( 0x00FC );
                                        LvlTextPr.RFonts.Set_All( "Wingdings", -1 );
                                        break;
                                    }
                                    case 7:
                                    {
                                        LvlText = String.fromCharCode( 0x00A8 );
                                        LvlTextPr.RFonts.Set_All( "Symbol", -1 );
                                        break;
                                    }
                                }

                                var NumId = null;
                                if ( true === bDiffLvl )
                                {
                                    NumId  = this.Numbering.Create_AbstractNum();
                                    var AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                    AbstractNum.Create_Default_Bullet();
                                    AbstractNum.Set_Lvl_Bullet( 0, LvlText, LvlTextPr );
                                }
                                else if ( true === bDiffId || true != this.Numbering.Check_Format( PrevId, PrevLvl, numbering_numfmt_Bullet )  )
                                {
                                    NumId  = this.Numbering.Create_AbstractNum();
                                    var AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                    AbstractNum.Create_Default_Bullet();
                                    AbstractNum.Set_Lvl_Bullet( PrevLvl, LvlText, LvlTextPr );
                                }
                                else
                                {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    var OldAbstractNum = this.Numbering.Get_AbstractNum( PrevId );
                                    var NewAbstractNum = this.Numbering.Get_AbstractNum( NumId );

                                    NewAbstractNum.Copy( OldAbstractNum );
                                    NewAbstractNum.Set_Lvl_Bullet( PrevLvl, LvlText, LvlTextPr );
                                }

                                // Параграфы, которые не содержали списка у них уровень выставляем 0,
                                // а у тех которые содержали, мы уровень не меняем
                                for ( var Index = StartPos; Index <= EndPos; Index++ )
                                {
                                    var OldNumPr = null;
                                    if ( type_Paragraph === this.Content[Index].GetType() )
                                    {
                                        if ( undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                            this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                        else
                                            this.Content[Index].Numbering_Add( NumId, 0 );
                                    }
                                    else if ( type_Table == this.Content[Index].GetType() )
                                    {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }
                            break;
                        }
                        case 1: // Numbered
                        {
                            if ( 0 === NumInfo.SubType )
                            {
                                // Если мы просто нажимаем добавить нумерованный список, тогда мы пытаемся
                                // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                                // есть список, и этот список нумерованный)

                                // Проверяем предыдущий элемент
                                var Prev = this.Content[StartPos - 1];
                                var NumId  = null;
                                var NumLvl = 0;

                                if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                                {
                                    var PrevNumPr = Prev.Numbering_Get();
                                    if ( undefined != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal ) )
                                    {
                                        NumId  = PrevNumPr.NumId;
                                        NumLvl = PrevNumPr.Lvl;
                                    }
                                }

                                // Предыдущий параграф не содержит списка, либо список не того формата
                                // создаем новую нумерацию (стандартную маркированный список)
                                if ( null === NumId )
                                {
                                    NumId  = this.Numbering.Create_AbstractNum();
                                    NumLvl = 0;

                                    this.Numbering.Get_AbstractNum( NumId ).Create_Default_Numbered();
                                }

                                // Параграфы, которые не содержали списка у них уровень выставляем NumLvl,
                                // а у тех которые содержали, мы уровень не меняем
                                for ( var Index = StartPos; Index <= EndPos; Index++ )
                                {
                                    var OldNumPr = null;

                                    if ( type_Paragraph === this.Content[Index].GetType() )
                                    {
                                        if ( undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                            this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                        else
                                            this.Content[Index].Numbering_Add( NumId, NumLvl );
                                    }
                                    else if ( type_Table === this.Content[Index].GetType() )
                                    {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }
                            else
                            {
                                // Для начала пробежимся по отмеченным параграфам и узнаем, есть ли
                                // среди них параграфы со списками разных уровней.
                                var bDiffLvl = false;
                                var bDiffId  = false;
                                var PrevLvl = null;
                                var PrevId  = null;
                                for ( var Index = StartPos; Index <= EndPos; Index++ )
                                {
                                    var NumPr = undefined;
                                    if ( type_Paragraph === this.Content[Index].GetType() && undefined != ( NumPr = this.Content[Index].Numbering_Get() ) )
                                    {
                                        if ( null === PrevLvl )
                                            PrevLvl = NumPr.Lvl;

                                        if ( null === PrevId )
                                            PrevId  = NumPr.NumId;

                                        if ( PrevId != NumPr.NumId )
                                            bDiffId = true;

                                        if ( PrevLvl != NumPr.Lvl )
                                        {
                                            bDiffLvl = true;
                                            break;
                                        }
                                    }
                                    else if ( ( type_Paragraph === this.Content[Index].GetType() && undefined === NumPr ) || type_Table === this.Content[Index].GetType() )
                                    {
                                        bDiffLvl = true;
                                        break;
                                    }
                                }

                                // 1. Если у нас есть параграфы со списками разных уровней, тогда мы
                                //    делаем стандартный нумерованный список, у которого первый(нулевой)
                                //    уровень изменен на тот который задан через NumInfo.SubType
                                // 2. Если все параграфы содержат списки одного уровня.
                                //    2.1 Если у всех списков одинаковый Id, тогда мы создаем
                                //        копию текущего списка и меняем в нем текущий уровень
                                //        на тот, который задан через NumInfo.SubType
                                //    2.2 Если у списков разные Id, тогда мы создаем стандартный
                                //        нумерованный список с измененным уровнем (равным текущему),
                                //        на тот, который прописан в NumInfo.Subtype

                                var AbstractNum = null;
                                var ChangeLvl   = 0;

                                var NumId = null;
                                if ( true === bDiffLvl )
                                {
                                    NumId  = this.Numbering.Create_AbstractNum();
                                    AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                    AbstractNum.Create_Default_Numbered();
                                    ChangeLvl = 0;
                                }
                                else if ( true === bDiffId || true != this.Numbering.Check_Format( PrevId, PrevLvl, numbering_numfmt_Decimal ) )
                                {
                                    NumId  = this.Numbering.Create_AbstractNum();
                                    AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                    AbstractNum.Create_Default_Numbered();
                                    ChangeLvl = PrevLvl;
                                }
                                else
                                {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    var OldAbstractNum = this.Numbering.Get_AbstractNum( PrevId );
                                    AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                    AbstractNum.Copy( OldAbstractNum );
                                    ChangeLvl = PrevLvl;
                                }

                                switch ( NumInfo.SubType )
                                {
                                    case 1:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_2( ChangeLvl );
                                        break;
                                    }
                                    case 2:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_1( ChangeLvl );
                                        break;
                                    }
                                    case 3:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_5( ChangeLvl );
                                        break;
                                    }
                                    case 4:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_6( ChangeLvl );
                                        break;
                                    }
                                    case 5:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_7( ChangeLvl );
                                        break;
                                    }
                                    case 6:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_8( ChangeLvl );
                                        break;
                                    }
                                    case 7:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_9( ChangeLvl );
                                        break;
                                    }
                                }

                                // Параграфы, которые не содержали списка у них уровень выставляем 0,
                                // а у тех которые содержали, мы уровень не меняем
                                for ( var Index = StartPos; Index <= EndPos; Index++ )
                                {
                                    var OldNumPr = null;

                                    if ( type_Paragraph === this.Content[Index].GetType() )
                                    {
                                        if ( undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                            this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                        else
                                            this.Content[Index].Numbering_Add( NumId, 0 );
                                    }
                                    else if ( type_Table === this.Content[Index].GetType() )
                                    {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }

                            break;
                        }

                        case 2: // Multilevel
                        {
                            // Создаем новый многоуровневый список, соответствующий NumInfo.SubType
                            var NumId = this.Numbering.Create_AbstractNum();
                            var AbstractNum = this.Numbering.Get_AbstractNum( NumId );

                            switch ( NumInfo.SubType )
                            {
                                case 1:
                                {
                                    AbstractNum.Create_Default_Multilevel_1();
                                    break;
                                }
                                case 2:
                                {
                                    AbstractNum.Create_Default_Multilevel_2();
                                    break;
                                }
                                case 3:
                                {
                                    AbstractNum.Create_Default_Multilevel_3();
                                    break;
                                }
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем 0,
                            // а у тех которые содержали, мы уровень не меняем
                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                var OldNumPr = null;
                                if ( type_Paragraph === this.Content[Index].GetType() )
                                {
                                    if ( undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                        this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                    else
                                        this.Content[Index].Numbering_Add( NumId, 0 );
                                }
                                else if ( type_Table === this.Content[Index].GetType() )
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }

                            break;
                        }
                    }
                }

                // Нам нужно пересчитать все изменения, начиная с элемента, предшевствующего
                // первому попавшему в селект.
                this.ContentLastChangePos = StartPos - 1;
                this.Recalculate();

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                var FirstChange = 0;

                if ( NumInfo.SubType < 0 )
                {
                    // Убираем список у параграфа
                    Item.Numbering_Remove();

                    if ( selectionflag_Numbering === this.Selection.Flag )
                        Item.Document_SetThisElementCurrent(true);
                }
                else
                {
                    if ( selectionflag_Numbering === this.Selection.Flag && 0 === NumInfo.SubType )
                        NumInfo.SubType = 1;

                    switch( NumInfo.Type )
                    {
                        case 0: // Bullet
                        {
                            if ( 0 === NumInfo.SubType )
                            {
                                var NumPr = Item.Numbering_Get();
                                if ( undefined != ( NumPr = Item.Numbering_Get() ) )
                                {
                                    var AbstractNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                                    if ( false === this.Numbering.Check_Format( NumPr.NumId, NumPr.Lvl, numbering_numfmt_Bullet ) )
                                    {
                                        AbstractNum.Create_Default_Bullet();

                                        // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                        // нем записана

                                        // Нам нужно пересчитать все изменения, начиная с первого
                                        // элемента, использующего данную нумерацию
                                        FirstChange = 0;
                                        var bFirstChange = false;
                                        for ( var Index = 0; Index < this.Content.length; Index++ )
                                        {
                                            if ( true === this.Content[Index].Numbering_IsUse( NumPr.NumId, NumPr.Lvl ) )
                                            {
                                                if ( false === bFirstChange )
                                                {
                                                    FirstChange = Index;
                                                    bFirstChange = true;
                                                }
                                                this.Content[Index].Recalc_CompileParaPr();
                                            }
                                        }
                                    }
                                }
                                else
                                {

                                    // Если мы просто нажимаем добавить маркированный список, тогда мы пытаемся
                                    // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                                    // есть список, и этот список маркированный)

                                    // Проверяем предыдущий элемент
                                    var Prev = this.Content[this.CurPos.ContentPos - 1];
                                    var NumId  = undefined;
                                    var NumLvl = 0;

                                    if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                                    {
                                        var PrevNumPr = Prev.Numbering_Get();
                                        if ( undefined != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet ) )
                                        {
                                            NumId  = PrevNumPr.NumId;
                                            NumLvl = PrevNumPr.Lvl;
                                        }
                                    }

                                    // Предыдущий параграф не содержит списка, либо список не того формата
                                    // создаем новую нумерацию (стандартную маркированный список)
                                    if ( undefined === NumId )
                                    {
                                        NumId  = this.Numbering.Create_AbstractNum();
                                        NumLvl = 0;

                                        this.Numbering.Get_AbstractNum( NumId ).Create_Default_Bullet();
                                    }


                                    if ( type_Paragraph === Item.GetType() )
                                    {
                                        var OldNumPr = Item.Numbering_Get();
                                        if (undefined != OldNumPr)
                                            Item.Numbering_Add( NumId, OldNumPr.Lvl );
                                        else
                                            Item.Numbering_Add( NumId, NumLvl );
                                    }
                                    else
                                        Item.Numbering_Add( NumId, NumLvl );

                                    // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                    FirstChange = this.CurPos.ContentPos - 1;
                                }
                            }
                            else
                            {
                                // 1. Если данный параграф не содержит списка, тогда мы создаем новый
                                //    список, и добавляем его к данному параграфу
                                // 2. Если данный параграф содержит список, тогда мы у данного списка
                                //    изменяем уровень(соответствующий данному параграфу) на тот,
                                //    который определен в NumInfo.Subtype

                                var LvlText   = "";
                                var LvlTextPr = new CTextPr();
                                LvlTextPr.RFonts.Set_All( "Times New Roman", -1 );

                                switch ( NumInfo.SubType )
                                {
                                    case 1:
                                    {
                                        LvlText = String.fromCharCode( 0x00B7 );
                                        LvlTextPr.RFonts.Set_All( "Symbol", -1 );
                                        break;
                                    }
                                    case 2:
                                    {
                                        LvlText = "o";
                                        LvlTextPr.RFonts.Set_All( "Courier New", -1 );
                                        break;
                                    }
                                    case 3:
                                    {
                                        LvlText = String.fromCharCode( 0x00A7 );
                                        LvlTextPr.RFonts.Set_All( "Wingdings", -1 );
                                        break;
                                    }
                                    case 4:
                                    {
                                        LvlText = String.fromCharCode( 0x0076 );
                                        LvlTextPr.RFonts.Set_All( "Wingdings", -1 );
                                        break;
                                    }
                                    case 5:
                                    {
                                        LvlText = String.fromCharCode( 0x00D8 );
                                        LvlTextPr.RFonts.Set_All( "Wingdings", -1 );
                                        break;
                                    }
                                    case 6:
                                    {
                                        LvlText = String.fromCharCode( 0x00FC );
                                        LvlTextPr.RFonts.Set_All( "Wingdings", -1 );
                                        break;
                                    }
                                    case 7:
                                    {
                                        LvlText = String.fromCharCode( 0x00A8 );
                                        LvlTextPr.RFonts.Set_All( "Symbol", -1 );
                                        break;
                                    }
                                }


                                var NumPr = null;
                                if ( undefined != ( NumPr = Item.Numbering_Get() ) )
                                {
                                    var AbstractNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                                    AbstractNum.Set_Lvl_Bullet( NumPr.Lvl, LvlText, LvlTextPr );

                                    // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                    // нем записана

                                    // Нам нужно пересчитать все изменения, начиная с первого
                                    // элемента, использующего данную нумерацию
                                    FirstChange = 0;
                                    var bFirstChange = false;
                                    for ( var Index = 0; Index < this.Content.length; Index++ )
                                    {
                                        if ( true === this.Content[Index].Numbering_IsUse( NumPr.NumId, NumPr.Lvl ) )
                                        {
                                            if ( false === bFirstChange )
                                            {
                                                FirstChange = Index;
                                                bFirstChange = true;
                                            }
                                            this.Content[Index].Recalc_CompileParaPr();
                                        }
                                    }
                                }
                                else
                                {
                                    var NumId = this.Numbering.Create_AbstractNum();
                                    var AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                    AbstractNum.Create_Default_Bullet();
                                    AbstractNum.Set_Lvl_Bullet( 0, LvlText, LvlTextPr );

                                    Item.Numbering_Add( NumId, 0 );

                                    // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                    FirstChange = this.CurPos.ContentPos - 1;
                                }
                            }

                            break;
                        }
                        case 1: // Numbered
                        {
                            if ( 0 === NumInfo.SubType )
                            {
                                var NumPr = Item.Numbering_Get();
                                if ( undefined != ( NumPr = Item.Numbering_Get() ) )
                                {
                                    var AbstractNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                                    if ( false === this.Numbering.Check_Format( NumPr.NumId, NumPr.Lvl, numbering_numfmt_Decimal ) )
                                    {
                                        AbstractNum.Create_Default_Numbered();

                                        // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                        // нем записана

                                        // Нам нужно пересчитать все изменения, начиная с первого
                                        // элемента, использующего данную нумерацию
                                        FirstChange = 0;
                                        var bFirstChange = false;
                                        for ( var Index = 0; Index < this.Content.length; Index++ )
                                        {
                                            if ( true === this.Content[Index].Numbering_IsUse( NumPr.NumId, NumPr.Lvl ) )
                                            {
                                                if ( false === bFirstChange )
                                                {
                                                    FirstChange = Index;
                                                    bFirstChange = true;
                                                }
                                                this.Content[Index].Recalc_CompileParaPr();
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    // Если мы просто нажимаем добавить нумерованный список, тогда мы пытаемся
                                    // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                                    // есть список, и этот список нумерованный)

                                    // Проверяем предыдущий элемент
                                    var Prev = this.Content[this.CurPos.ContentPos - 1];
                                    var NumId  = undefined;
                                    var NumLvl = 0;

                                    if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                                    {
                                        var PrevNumPr = Prev.Numbering_Get();
                                        if ( undefined != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal ) )
                                        {
                                            NumId  = PrevNumPr.NumId;
                                            NumLvl = PrevNumPr.Lvl;
                                        }
                                    }

                                    // Предыдущий параграф не содержит списка, либо список не того формата
                                    // создаем новую нумерацию (стандартную маркированный список)
                                    if ( undefined === NumId )
                                    {
                                        NumId  = this.Numbering.Create_AbstractNum();
                                        NumLvl = 0;

                                        this.Numbering.Get_AbstractNum( NumId ).Create_Default_Numbered();
                                    }


                                    if ( type_Paragraph === Item.GetType() )
                                    {
                                        var OldNumPr = Item.Numbering_Get();
                                        if( undefined != ( OldNumPr ) )
                                            Item.Numbering_Add( NumId, OldNumPr.Lvl );
                                        else
                                            Item.Numbering_Add( NumId, NumLvl );
                                    }
                                    else
                                        Item.Numbering_Add( NumId, NumLvl );

                                    // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                    FirstChange = this.CurPos.ContentPos - 1;
                                }
                            }
                            else
                            {
                                // 1. Если данный параграф не содержит списка, тогда мы создаем новый
                                //    список, и добавляем его к данному параграфу
                                // 2. Если данный параграф содержит список, тогда мы у данного списка
                                //    изменяем уровень(соответствующий данному параграфу) на тот,
                                //    который определен в NumInfo.Subtype

                                var NumPr = null;
                                var AbstractNum = null;
                                var ChangeLvl = 0;
                                if ( undefined != ( NumPr = Item.Numbering_Get() ) )
                                {
                                    AbstractNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                                    ChangeLvl = NumPr.Lvl;
                                }
                                else
                                {
                                    var NumId = this.Numbering.Create_AbstractNum();
                                    AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                    AbstractNum.Create_Default_Numbered();
                                    ChangeLvl = 0;
                                }

                                switch ( NumInfo.SubType )
                                {
                                    case 1:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_2( ChangeLvl );
                                        break;
                                    }
                                    case 2:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_1( ChangeLvl );
                                        break;
                                    }
                                    case 3:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_5( ChangeLvl );
                                        break;
                                    }
                                    case 4:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_6( ChangeLvl );
                                        break;
                                    }
                                    case 5:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_7( ChangeLvl );
                                        break;
                                    }
                                    case 6:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_8( ChangeLvl );
                                        break;
                                    }
                                    case 7:
                                    {
                                        AbstractNum.Set_Lvl_Numbered_9( ChangeLvl );
                                        break;
                                    }
                                }


                                if ( null != NumPr )
                                {
                                    // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                    // нем записана.

                                    // Нам нужно пересчитать все изменения, начиная с первого
                                    // элемента, использующего данную нумерацию
                                    FirstChange = 0;
                                    var bFirstChange = false;
                                    for ( var Index = 0; Index < this.Content.length; Index++ )
                                    {
                                        if ( true === this.Content[Index].Numbering_IsUse( NumPr.NumId, NumPr.Lvl ) )
                                        {
                                            if ( false === bFirstChange )
                                            {
                                                FirstChange = Index;
                                                bFirstChange = true;
                                            }
                                            this.Content[Index].Recalc_CompileParaPr();
                                        }
                                    }
                                }
                                else
                                {
                                    Item.Numbering_Add( NumId, 0 );

                                    // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                    FirstChange = this.CurPos.ContentPos - 1;
                                }
                            }

                            break;
                        }

                        case 2: // Multilevel
                        {
                            // 1. Если у параграфа нет списка, тогда создаем новый список,
                            //    и добавляем его к параграфу.
                            // 2. Если у параграфа есть список, тогда изменяем этот многоуровневый
                            //    список на заданный через NumInfo.SubType.

                            var NumId = null;
                            var NumPr = Item.Numbering_Get();
                            var AbstractNum = null;
                            if ( undefined != NumPr )
                            {
                                AbstractNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                            }
                            else
                            {
                                NumId = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                            }

                            switch ( NumInfo.SubType )
                            {
                                case 1:
                                {
                                    AbstractNum.Create_Default_Multilevel_1();
                                    break;
                                }
                                case 2:
                                {
                                    AbstractNum.Create_Default_Multilevel_2();
                                    break;
                                }
                                case 3:
                                {
                                    AbstractNum.Create_Default_Multilevel_3();
                                    break;
                                }
                            }

                            if ( null != NumPr )
                            {
                                // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                // нем записана.

                                // Нам нужно пересчитать все изменения, начиная с первого
                                // элемента, использующего данную нумерацию
                                FirstChange = 0;
                                var bFirstChange = false;
                                for ( var Index = 0; Index < this.Content.length; Index++ )
                                {
                                    if ( true === this.Content[Index].Numbering_IsUse( NumPr.NumId ) )
                                    {
                                        if ( false === bFirstChange )
                                        {
                                            FirstChange = Index;
                                            bFirstChange = true;
                                        }
                                        this.Content[Index].Recalc_CompileParaPr();
                                    }
                                }
                            }
                            else
                            {
                                Item.Numbering_Add( NumId, 0 );

                                // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                FirstChange = this.CurPos.ContentPos - 1;
                            }

                            break;
                        }
                    }

                }

                this.ContentLastChangePos = FirstChange;
                this.Recalculate();
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Set_ParagraphNumbering( NumInfo );
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphShd : function(Shd)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Set_ParagraphShd(Shd);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.setParagraphShd(Shd);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        
                        if (true === this.UseTextShd && StartPos === EndPos && type_Paragraph === this.Content[StartPos].GetType() && false === this.Content[StartPos].Selection_CheckParaEnd() )
                        {
                            this.Paragraph_Add( new ParaTextPr( { Shd : Shd } ) );                            
                            this.Recalculate();
                        }
                        else
                        {
                            if ( EndPos < StartPos )
                            {
                                var Temp = StartPos;
                                StartPos = EndPos;
                                EndPos   = Temp;
                            }

                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                // При изменении цвета фона параграфа, не надо ничего пересчитывать
                                var Item = this.Content[Index];
                                if ( type_Paragraph == Item.GetType() )
                                    Item.Set_Shd( Shd );
                                else if ( type_Table == Item.GetType() )
                                {
                                    Item.TurnOff_RecalcEvent();
                                    Item.Set_ParagraphShd( Shd );
                                    Item.TurnOn_RecalcEvent();
                                }
                            }

                            // Нам надо определить какие страницы мы должны перерисовать
                            var PageStart = -1;
                            var PageEnd   = -1;
                            for ( var Index = 0; Index < this.Pages.length - 1; Index++ )
                            {
                                if ( PageStart == -1 && StartPos <= this.Pages[Index + 1].Pos )
                                    PageStart = Index;

                                if ( PageEnd == -1 && EndPos < this.Pages[Index + 1].Pos )
                                    PageEnd = Index;
                            }

                            if ( -1 === PageStart )
                                PageStart = this.Pages.length - 1;
                            if ( -1 === PageEnd )
                                PageEnd = this.Pages.length - 1;

                            for ( var Index = PageStart; Index <= PageEnd; Index++ )
                                this.DrawingDocument.OnRecalculatePage( Index, this.Pages[Index] );

                            this.DrawingDocument.OnEndRecalculate(false, true);
                        }

                        break;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                // При изменении цвета фона параграфа, не надо ничего пересчитывать
                Item.Set_Shd( Shd );

                // Ищем страницы, на которых произошли изменения
                // Нам надо определить какие страницы мы должны перерисовать
                var PageStart = -1;
                var PageEnd   = -1;
                for ( var Index = 0; Index < this.Pages.length - 1; Index++ )
                {
                    if ( PageStart == -1 && this.CurPos.ContentPos <= this.Pages[Index + 1].Pos )
                        PageStart = Index;

                    if ( PageEnd == -1 && this.CurPos.ContentPos < this.Pages[Index + 1].Pos )
                        PageEnd = Index;
                }

                if ( -1 === PageStart )
                    PageStart = this.Pages.length - 1;
                if ( -1 === PageEnd )
                    PageEnd = this.Pages.length - 1;

                for ( var Index = PageStart; Index <= PageEnd; Index++ )
                    this.DrawingDocument.OnRecalculatePage( Index, this.Pages[Index] );

                this.DrawingDocument.OnEndRecalculate(false, true);
            }
            else if ( type_Table == Item.GetType() )
                Item.Set_ParagraphShd( Shd );

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphStyle : function(Name)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphStyle(Name);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphStyle(Name);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var StyleId = this.Styles.Get_StyleIdByName( Name );

            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                if ( selectionflag_Numbering === this.Selection.Flag )
                {
                    this.Document_UpdateInterfaceState();
                    return false;
                }

                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( type_Paragraph == Item.GetType() )
                    {
                        Item.Style_Add( StyleId );
                    }
                    else if ( type_Table == Item.GetType() )
                    {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphStyle( Name );
                        Item.TurnOn_RecalcEvent();
                    }
                }

                // Нам нужно пересчитать все изменения, начиная с элемента, предшевствующего первому
                // попавшему в селект.
                this.ContentLastChangePos = Math.max( StartPos - 1, 0 );
                this.Recalculate();

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Style_Add( StyleId );

                // Нам нужно пересчитать все изменения, начиная с предыдушего элемента
                this.ContentLastChangePos = Math.max( this.CurPos.ContentPos - 1, 0 );
                this.Recalculate();
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphStyle( Name );
                Item.TurnOn_RecalcEvent();

                // Нам нужно пересчитать все изменения, начиная с предыдушего элемента
                this.ContentLastChangePos = Math.max( this.CurPos.ContentPos - 1, 0 );
                this.Recalculate();
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphContextualSpacing : function(Value)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphContextualSpacing(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphContextualSpacing(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            // При изменении цвета фона параграфа, не надо ничего пересчитывать
                            var Item = this.Content[Index];
                            if ( type_Paragraph == Item.GetType() )
                                Item.Set_ContextualSpacing( Value );
                            else if ( type_Table == Item.GetType() )
                            {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphContextualSpacing( Value );
                                Item.TurnOn_RecalcEvent();
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                        // попавшего в селект.
                        this.ContentLastChangePos = StartPos;

                        this.Recalculate();

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();

                        return;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Set_ContextualSpacing( Value );

                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate( true );
            }
            else if ( type_Table == Item.GetType() )
                Item.Set_ParagraphContextualSpacing( Value );

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphPageBreakBefore : function(Value)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphPageBreakBefore(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphPageBreakBefore(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {

            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            // При изменении цвета фона параграфа, не надо ничего пересчитывать
                            var Item = this.Content[Index];
                            if ( type_Paragraph == Item.GetType() )
                                Item.Set_PageBreakBefore( Value );
                            else if ( type_Table == Item.GetType() )
                            {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphPageBreakBefore( Value );
                                Item.TurnOn_RecalcEvent();
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                        // попавшего в селект.
                        this.ContentLastChangePos = StartPos;

                        this.Recalculate();

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();

                        return;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Set_PageBreakBefore( Value );

                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate( true );
            }
            else if ( type_Table == Item.GetType() )
                Item.Set_ParagraphPageBreakBefore( Value );

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphKeepLines : function(Value)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphKeepLines(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphKeepLines(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            // При изменении цвета фона параграфа, не надо ничего пересчитывать
                            var Item = this.Content[Index];

                            if ( type_Paragraph == Item.GetType() )
                                Item.Set_KeepLines( Value );
                            else if ( type_Table == Item.GetType() )
                            {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphKeepLines( Value );
                                Item.TurnOn_RecalcEvent();
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                        // попавшего в селект.
                        this.ContentLastChangePos = StartPos;

                        this.Recalculate();

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();

                        return;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Set_KeepLines( Value );

                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate( true );
            }
            else if ( type_Table == Item.GetType() )
                Item.Set_ParagraphKeepLines( Value );

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphKeepNext : function(Value)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphKeepNext(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphKeepNext(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            // При изменении цвета фона параграфа, не надо ничего пересчитывать
                            var Item = this.Content[Index];

                            if ( type_Paragraph == Item.GetType() )
                                Item.Set_KeepNext( Value );
                            else if ( type_Table == Item.GetType() )
                            {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphKeepNext( Value );
                                Item.TurnOn_RecalcEvent();
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                        // попавшего в селект.
                        this.ContentLastChangePos = StartPos;

                        this.Recalculate();

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();

                        return;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Set_KeepNext( Value );

                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate( true );
            }
            else if ( type_Table == Item.GetType() )
                Item.Set_ParagraphKeepNext( Value );

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphWidowControl : function(Value)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphWidowControl(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphWidowControl(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            // При изменении цвета фона параграфа, не надо ничего пересчитывать
                            var Item = this.Content[Index];

                            if ( type_Paragraph == Item.GetType() )
                                Item.Set_WidowControl( Value );
                            else if ( type_Table == Item.GetType() )
                            {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphWidowControl( Value );
                                Item.TurnOn_RecalcEvent();
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                        // попавшего в селект.
                        this.ContentLastChangePos = StartPos;

                        this.Recalculate();

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();

                        return;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Set_WidowControl( Value );

                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate( true );
            }
            else if ( type_Table == Item.GetType() )
                Item.Set_ParagraphWidowControl( Value );

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphBorders : function(Borders)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Set_ParagraphBorders(Borders);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.setParagraphBorders(Borders);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            // При изменении цвета фона параграфа, не надо ничего пересчитывать
                            var Item = this.Content[Index];

                            if ( type_Paragraph == Item.GetType() )
                                Item.Set_Borders( Borders );
                            else if ( type_Table == Item.GetType() )
                            {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphBorders( Borders );
                                Item.TurnOn_RecalcEvent();
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                        // попавшего в селект.
                        this.ContentLastChangePos = StartPos;

                        this.Recalculate();

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();

                        return;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                // Мы должны выставить границу для всех параграфов, входящих в текущую группу параграфов
                // с одинаковыми границами

                var StartPos = Item.Index;
                var EndPos   = Item.Index;
                var CurBrd = Item.Get_CompiledPr().ParaPr.Brd;

                while ( true != CurBrd.First )
                {
                    StartPos--;
                    if ( StartPos < 0 )
                    {
                        StartPos = 0;
                        break;
                    }

                    var TempItem = this.Content[StartPos];
                    if ( type_Paragraph != TempItem.GetType() )
                    {
                        StartPos++;
                        break;
                    }

                    CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
                }

                CurBrd = Item.Get_CompiledPr().ParaPr.Brd;
                while ( true != CurBrd.Last )
                {
                    EndPos++;
                    if ( EndPos >= this.Content.length )
                    {
                        EndPos = this.Content.length - 1;
                        break;
                    }

                    var TempItem = this.Content[EndPos];
                    if ( type_Paragraph != TempItem.GetType() )
                    {
                        EndPos--;
                        break;
                    }

                    CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
                }

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                    this.Content[Index].Set_Borders( Borders );

                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = StartPos - 1;

                this.Recalculate();
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Set_ParagraphBorders( Borders );
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_ParagraphFramePr : function(FramePr, bDelete)
    {
        if ( docpostype_HdrFtr === this.CurPos.Type || docpostype_DrawingObjects === this.CurPos.Type )
        {
            // Никуда, кроме обычного параграфа в верхнем классе CDocument, добавить рамку нельзя
            return;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( selectionflag_Numbering === this.Selection.Flag )
                    return;

                // Проверим, если у нас все выделенные элементы - параграфы, с одинаковыми настройками
                // FramePr, тогда мы можем применить новую настройку FramePr

                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;

                if ( StartPos > EndPos )
                {
                    StartPos = this.Selection.EndPos;
                    EndPos   = this.Selection.StartPos;
                }

                var Element = this.Content[StartPos];

                if ( type_Paragraph != Element.GetType() || undefined === Element.Get_FramePr() )
                    return;

                var FramePr = Element.Get_FramePr();
                for ( var Pos = StartPos + 1; Pos < EndPos; Pos++ )
                {
                    var TempElement = this.Content[Pos];

                    if ( type_Paragraph != TempElement.GetType() || undefined === TempElement.Get_FramePr() || true != FramePr.Compare( TempElement.Get_FramePr() ) )
                        return;
                }

                // Раз дошли до сюда, значит можно у всех выделенных параграфов менять настройку рамки
                var FrameParas = this.Content[StartPos].Internal_Get_FrameParagraphs();
                var FrameCount = FrameParas.length;
                for ( var Pos = 0; Pos < FrameCount; Pos++ )
                {
                    FrameParas[Pos].Set_FramePr(FramePr, bDelete);
                }
            }
            else
            {
                var Element = this.Content[this.CurPos.ContentPos];

                if ( type_Paragraph != Element.GetType() )
                    return;

                // Возможно, предыдущий элемент является буквицей
                if ( undefined === Element.Get_FramePr()  )
                {
                    var PrevElement = Element.Get_DocumentPrev();

                    if ( type_Paragraph != PrevElement.GetType() || undefined === PrevElement.Get_FramePr() || undefined === PrevElement.Get_FramePr().DropCap )
                        return;

                    Element = PrevElement;
                }


                var FrameParas = Element.Internal_Get_FrameParagraphs();
                var FrameCount = FrameParas.length;
                for ( var Pos = 0; Pos < FrameCount; Pos++ )
                {
                    FrameParas[Pos].Set_FramePr(FramePr, bDelete);
                }

            }
        }

        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },

    Paragraph_IncDecFontSize : function(bIncrease)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Paragraph_IncDecFontSize(bIncrease);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var bRetValue = this.DrawingObjects.paragraphIncDecFontSize(bIncrease);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            // При изменении цвета фона параграфа, не надо ничего пересчитывать
                            var Item = this.Content[Index];

                            if ( type_Paragraph == Item.GetType() )
                                Item.IncDec_FontSize( bIncrease );
                            else if ( type_Table == Item.GetType() )
                            {
                                Item.TurnOff_RecalcEvent();
                                Item.Paragraph_IncDecFontSize( bIncrease );
                                Item.TurnOn_RecalcEvent();
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                        // попавшего в селект.
                        this.ContentLastChangePos = StartPos;

                        this.Recalculate();

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();

                        return;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                if ( true === Item.IncDec_FontSize( bIncrease ) )
                {
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate();
                }
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Paragraph_IncDecFontSize( bIncrease );
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Paragraph_IncDecIndent : function(bIncrease)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Paragraph_IncDecIndent(bIncrease);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            if ( true != this.DrawingObjects.isSelectedText() )
            {
                var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                if ( null != ParaDrawing )
                {
                    var Paragraph = ParaDrawing.Parent;
                    Paragraph.IncDec_Indent(bIncrease);
                    this.Recalculate();
                }
            }
            else
            {
                this.DrawingObjects.paragraphIncDecIndent(bIncrease);
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            // При изменении цвета фона параграфа, не надо ничего пересчитывать
                            var Item = this.Content[Index];

                            if ( type_Paragraph == Item.GetType() )
                                Item.IncDec_Indent( bIncrease );
                            else if ( type_Table == Item.GetType() )
                            {
                                Item.TurnOff_RecalcEvent();
                                Item.Paragraph_IncDecIndent( bIncrease );
                                Item.TurnOn_RecalcEvent();
                            }
                        }

                        // Нам нужно пересчитать все изменения, начиная с первого элемента,
                        // попавшего в селект.
                        this.ContentLastChangePos = StartPos;

                        this.Recalculate();

                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();

                        return;
                    }
                    case  selectionflag_Numbering:
                    {
                        break;
                    }
                }

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.IncDec_Indent( bIncrease );
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Paragraph_IncDecIndent( bIncrease );
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Paragraph_SetHighlight : function(IsColor, r, g, b)
    {
        if ( true === this.Is_TextSelectionUse() )
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();

                if (false === IsColor)
                    this.Paragraph_Add( new ParaTextPr( { HighLight : highlight_None  } ) );
                else
                    this.Paragraph_Add( new ParaTextPr( { HighLight : new CDocumentColor( r, g, b )  } ) );

                editor.sync_MarkerFormatCallback( false );
            }
        }
        else
        {
            if ( false === IsColor )
                this.HighlightColor = highlight_None;
            else
                this.HighlightColor = new CDocumentColor( r, g, b );
        }
    },

    Set_ImageProps : function(Props)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Set_ImageProps(Props);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.setProps( Props );
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            this.Interface_Update_TablePr();
            if ( true == this.Selection.Use )
                this.Content[this.Selection.StartPos].Set_ImageProps(Props);
            else
                this.Content[this.CurPos.ContentPos].Set_ImageProps(Props);
        }

        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },

    ShapeApply: function(shapeProps)
    {
        this.DrawingObjects.shapeApply(shapeProps);
    },

    Select_Drawings : function(DrawingArray, TargetContent)
    {
        if(DrawingArray.length === 1 && DrawingArray[0].Is_Inline())
            return;
        this.DrawingObjects.resetSelection();
        var hdr_ftr = TargetContent.Is_HdrFtr(true);
        if(hdr_ftr)
        {
            hdr_ftr.Content.CurPos.Type = docpostype_DrawingObjects;
            hdr_ftr.Set_CurrentElement(false);
        }
        else
        {
            this.CurPos.Type = docpostype_DrawingObjects;
        }
        for(var i = 0; i < DrawingArray.length; ++i)
        {
            this.DrawingObjects.selectObject(DrawingArray[i].GraphicObj, 0);
        }
    },

    Set_TableProps : function(Props)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Set_TableProps(Props);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.setTableProps(Props);
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var Pos = -1;
            if ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() )
                Pos = this.Selection.StartPos;
            else if ( false === this.Selection.Use && type_Table === this.Content[this.CurPos.ContentPos].GetType() )
                Pos = this.CurPos.ContentPos;

            if ( -1 != Pos )
            {
                var Table = this.Content[Pos];
                Table.Set_Props(Props);
            }
        }

        this.Recalculate();

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateSelectionState();
    },

    Get_Paragraph_ParaPr : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_ParaPr();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getParagraphParaPr();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var Result_ParaPr = new CParaPr();
            if ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                var StartPr, Pr;
                if ( type_Paragraph == this.Content[StartPos].GetType() )
                {
                    StartPr   = this.Content[StartPos].Get_CompiledPr2(false).ParaPr;
                    Pr        = StartPr.Copy();
                    Pr.Locked = this.Content[StartPos].Lock.Is_Locked();
                }
                else if ( type_Table == this.Content[StartPos].GetType() )
                {
                    StartPr   = this.Content[StartPos].Get_Paragraph_ParaPr();
                    Pr        = StartPr.Copy();
                    Pr.Locked = StartPr.Locked;
                }

                for ( var Index = StartPos + 1; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];

                    var TempPr;
                    if ( type_Paragraph == Item.GetType() )
                    {
                        TempPr         = Item.Get_CompiledPr2(false).ParaPr;
                        TempPr.Locked  = Item.Lock.Is_Locked();
                    }
                    else if ( type_Table == Item.GetType() )
                    {
                        TempPr = Item.Get_Paragraph_ParaPr();
                    }

                    Pr = Pr.Compare(TempPr);
                }

                if ( undefined === Pr.Ind.Left )
                    Pr.Ind.Left = StartPr.Ind.Left;

                if ( undefined === Pr.Ind.Right )
                    Pr.Ind.Right = StartPr.Ind.Right;

                if ( undefined === Pr.Ind.FirstLine )
                    Pr.Ind.FirstLine = StartPr.Ind.FirstLine;

                Result_ParaPr             = Pr;
                Result_ParaPr.CanAddTable = ( true === Pr.Locked ? false : true );

                // Если мы находимся в рамке, тогда дополняем ее свойства настройками границы и настройкой текста (если это буквица)
                if ( undefined != Result_ParaPr.FramePr && type_Paragraph === this.Content[StartPos].GetType() )
                    this.Content[StartPos].Supplement_FramePr( Result_ParaPr.FramePr );
                else if ( StartPos === EndPos && StartPos > 0 && type_Paragraph === this.Content[StartPos - 1].GetType()  )
                {
                    var PrevFrame = this.Content[StartPos - 1].Get_FramePr();
                    if ( undefined != PrevFrame && undefined != PrevFrame.DropCap )
                    {
                        Result_ParaPr.FramePr = PrevFrame.Copy();
                        this.Content[StartPos - 1].Supplement_FramePr( Result_ParaPr.FramePr );
                    }
                }

            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    var ParaPr = Item.Get_CompiledPr2(false).ParaPr;
                    var Locked = Item.Lock.Is_Locked();

                    Result_ParaPr             = ParaPr.Copy();
                    Result_ParaPr.Locked      = Locked;
                    Result_ParaPr.CanAddTable = ( ( true === Locked ) ? ( ( true === Item.Cursor_IsEnd() ) ? true : false ) : true );

                    // Если мы находимся в рамке, тогда дополняем ее свойства настройками границы и настройкой текста (если это буквица)
                    if ( undefined != Result_ParaPr.FramePr )
                        Item.Supplement_FramePr( Result_ParaPr.FramePr );
                    else if ( this.CurPos.ContentPos > 0 && type_Paragraph === this.Content[this.CurPos.ContentPos - 1].GetType()  )
                    {
                        var PrevFrame = this.Content[this.CurPos.ContentPos - 1].Get_FramePr();
                        if ( undefined != PrevFrame && undefined != PrevFrame.DropCap )
                        {
                            Result_ParaPr.FramePr = PrevFrame.Copy();
                            this.Content[this.CurPos.ContentPos - 1].Supplement_FramePr( Result_ParaPr.FramePr );
                        }
                    }

                }
                else if ( type_Table == Item.GetType() )
                {
                    Result_ParaPr = Item.Get_Paragraph_ParaPr();
                }
            }
            if(Result_ParaPr.Shd && Result_ParaPr.Shd.Unifill)
            {
                Result_ParaPr.Shd.Unifill.check(this.theme, this.Get_ColorMap());
            }
            return Result_ParaPr;
        }
    },

    Get_Paragraph_TextPr : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_TextPr();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getParagraphTextPr();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var Result_TextPr = null;
            if ( true === this.Selection.Use )
            {
                var VisTextPr;
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( EndPos < StartPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        VisTextPr = this.Content[StartPos].Get_Paragraph_TextPr();

                        for ( var Index = StartPos + 1; Index <= EndPos; Index++ )
                        {
                            var CurPr = this.Content[Index].Get_Paragraph_TextPr();
                            VisTextPr = VisTextPr.Compare( CurPr );
                        }

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        // Текстовые настройки применяем к конкретной нумерации
                        if ( null == this.Selection.Data || this.Selection.Data.length <= 0 )
                            break;

                        var CurPara = this.Content[this.Selection.Data[0]];
                        for ( var Index = 0; Index < this.Selection.Data.length; Index++ )
                        {
                            if ( this.CurPos.ContentPos === this.Selection.Data[Index] )
                                CurPara = this.Content[this.Selection.Data[Index]];
                        }

                        VisTextPr = CurPara.Internal_Get_NumberingTextPr();

                        break;
                    }
                }

                Result_TextPr = VisTextPr;
            }
            else
            {
                Result_TextPr = this.Content[this.CurPos.ContentPos].Get_Paragraph_TextPr();
            }
            
            return Result_TextPr;
        }
    },

    Get_Paragraph_TextPr_Copy : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_TextPr_Copy();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getParagraphTextPrCopy();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var Result_TextPr = null;

            if ( true === this.Selection.Use )
            {
                var VisTextPr;
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        if ( this.Selection.EndPos < StartPos )
                            StartPos = this.Selection.EndPos;

                        var Item = this.Content[StartPos];
                        VisTextPr = Item.Get_Paragraph_TextPr_Copy();

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        // Текстовые настройки применяем к конкретной нумерации
                        if ( null == this.Selection.Data || this.Selection.Data.length <= 0 )
                            break;

                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        VisTextPr = this.Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].TextPr;

                        break;
                    }
                }

                Result_TextPr = VisTextPr;
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
            }

            return Result_TextPr;
        }
    },

    Get_Paragraph_ParaPr_Copy : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_ParaPr_Copy();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getParagraphParaPrCopy();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var Result_ParaPr = null;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        if ( this.Selection.EndPos < StartPos )
                            StartPos = this.Selection.EndPos;

                        var Item = this.Content[StartPos];
                        Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        // Текстовые настройки применяем к конкретной нумерации
                        if ( null == this.Selection.Data || this.Selection.Data.length <= 0 )
                            break;

                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        Result_ParaPr = this.Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].ParaPr;

                        break;
                    }
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();
            }

            return Result_ParaPr;
        }
    },

    Get_AllParagraphs_ByNumbering : function(NumPr)
    {
        var ParaArray = [];

        this.SectionsInfo.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }

        return ParaArray;
    },


    Get_PageSizesByDrawingObjects : function()
    {
        return this.DrawingObjects.getPageSizesByDrawingObjects();
    },

    Set_DocumentMargin : function(MarPr)
    {
        // TODO: Document.Set_DocumentOrientation Сделать в зависимости от выделения

        var CurPos = this.CurPos.ContentPos;
        var SectPr = this.SectionsInfo.Get_SectPr( CurPos).SectPr;

        var L = MarPr.Left;
        var T = MarPr.Top;
        var R = ( undefined === MarPr.Right ? undefined : SectPr.Get_PageWidth() - MarPr.Right );
        var B = ( undefined === MarPr.Bottom ? undefined : SectPr.Get_PageHeight() - MarPr.Bottom );

        SectPr.Set_PageMargins( L, T, R, B );

        this.ContentLastChangePos = 0;
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Set_DocumentPageSize : function(W, H, bNoRecalc)
    {
        // TODO: Document.Set_DocumentOrientation Сделать в зависимости от выделения

        var CurPos = this.CurPos.ContentPos;
        var SectPr = this.SectionsInfo.Get_SectPr( CurPos).SectPr;

        SectPr.Set_PageSize( W, H );

        if( true != bNoRecalc )
        {
            this.ContentLastChangePos = 0;
            this.Recalculate();

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Get_DocumentPageSize : function()
    {
        // TODO: Document.Get_DocumentOrientation Сделать в зависимости от выделения

        var CurPos = this.CurPos.ContentPos;
        var SectionInfoElement = this.SectionsInfo.Get_SectPr(CurPos);

        if ( undefined === SectionInfoElement )
            return true;

        var SectPr = SectionInfoElement.SectPr;

        return { W : SectPr.Get_PageWidth(), H : SectPr.Get_PageHeight() };
    },

    Set_DocumentOrientation : function(Orientation, bNoRecalc)
    {
        // TODO: Document.Set_DocumentOrientation Сделать в зависимости от выделения

        var CurPos = this.CurPos.ContentPos;
        var SectPr = this.SectionsInfo.Get_SectPr(CurPos).SectPr;

        SectPr.Set_Orientation( Orientation, true );

        if( true != bNoRecalc )
        {
            this.Recalculate();

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Get_DocumentOrientation : function()
    {
        // TODO: Document.Get_DocumentOrientation Сделать в зависимости от выделения

        var CurPos = this.CurPos.ContentPos;
        var SectionInfoElement = this.SectionsInfo.Get_SectPr(CurPos);

        if ( undefined === SectionInfoElement )
            return true;

        var SectPr = SectionInfoElement.SectPr;

        return ( SectPr.Get_Orientation() === orientation_Portrait ? true : false );
    },

    Set_DocumentDefaultTab : function(DTab)
    {
        this.History.Add( this, { Type : historyitem_Document_DefaultTab, Old : Default_Tab_Stop, New : DTab } );
        Default_Tab_Stop = DTab;
    },
    
    Set_DocumentEvenAndOddHeaders : function(Value)
    {
        if ( Value !== EvenAndOddHeaders )
        {
            this.History.Add( this, { Type : historyitem_Document_EvenAndOddHeaders, Old : EvenAndOddHeaders, New : Value } );
            EvenAndOddHeaders = Value;
        }
    },

    // Обновляем данные в интерфейсе о свойствах параграфа
    Interface_Update_ParaPr : function()
    {
        var ParaPr = this.Get_Paragraph_ParaPr();

        if ( null != ParaPr )
        {
            // Проверим, можно ли добавить буквицу
            ParaPr.CanAddDropCap = false;

            if ( docpostype_Content === this.CurPos.Type )
            {
                var Para = null;
                if ( false === this.Selection.Use && type_Paragraph === this.Content[this.CurPos.ContentPos].GetType() )
                    Para = this.Content[this.CurPos.ContentPos];
                else if ( true === this.Selection.Use && this.Selection.StartPos <= this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.StartPos].GetType() )
                    Para = this.Content[this.Selection.StartPos];
                else if ( true === this.Selection.Use && this.Selection.StartPos > this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.EndPos].GetType() )
                    Para = this.Content[this.Selection.EndPos];

                if ( null != Para && undefined === Para.Get_FramePr() )
                {
                    var Prev = Para.Get_DocumentPrev();
                    if ( (null === Prev || type_Paragraph != Prev.GetType() || undefined === Prev.Get_FramePr() || undefined === Prev.Get_FramePr().DropCap) && true === Para.Can_AddDropCap() )
                        ParaPr.CanAddDropCap = true;
                }
            }

            var oSelectedInfo = this.Get_SelectedElementsInfo();
            var Math = oSelectedInfo.Get_Math();
            if (null !== Math)
                ParaPr.CanAddImage = false;
            else
                ParaPr.CanAddImage = true;

            if ( undefined != ParaPr.Tabs )
                editor.Update_ParaTab( Default_Tab_Stop, ParaPr.Tabs );

            if(ParaPr.Shd && ParaPr.Shd.Unifill)
            {
                ParaPr.Shd.Unifill.check(this.theme, this.Get_ColorMap());
            }
            editor.UpdateParagraphProp( ParaPr );
        }
    },

    // Обновляем данные в интерфейсе о свойствах текста
    Interface_Update_TextPr : function()
    {
        var TextPr = this.Get_Paragraph_TextPr();

        if ( null != TextPr )
        {
            var theme = this.Get_Theme();
            if(theme && theme.themeElements && theme.themeElements.fontScheme)
            {
                if(TextPr.FontFamily)
                {
                    TextPr.FontFamily.Name =  theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
                }
                if(TextPr.RFonts)
                {
                    if(TextPr.RFonts.Ascii)
                        TextPr.RFonts.Ascii.Name     = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
                    if(TextPr.RFonts.EastAsia)
                        TextPr.RFonts.EastAsia.Name  = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
                    if(TextPr.RFonts.HAnsi)
                        TextPr.RFonts.HAnsi.Name     = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
                    if(TextPr.RFonts.CS)
                        TextPr.RFonts.CS.Name        = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
                }
            }
            if(TextPr.Unifill)
            {
                var RGBAColor = TextPr.Unifill.getRGBAColor();
                TextPr.Color = new CDocumentColor(RGBAColor.R, RGBAColor.G, RGBAColor.B, false);
            }
            if(TextPr.Shd && TextPr.Shd.Unifill)
            {
                TextPr.Shd.Unifill.check(this.theme, this.Get_ColorMap());
            }
            editor.UpdateTextPr(TextPr);
        }
    },

    // Обновляем данные в интерфейсе о свойствах графики (картинки, автофигуры)
    Interface_Update_DrawingPr : function(Flag)
    {
       // if(!(this.DrawingObjects.curState.id === STATES_ID_TEXT_ADD || this.DrawingObjects.curState.id === STATES_ID_TEXT_ADD_IN_GROUP))
        {
            var DrawingPr = this.DrawingObjects.Get_Props();

            if ( true === Flag )
                return DrawingPr;
            else
            {

                for(var i = 0; i < DrawingPr.length; ++i)
                    editor.sync_ImgPropCallback( DrawingPr[i] );
            }
        }
        if(Flag)
            return null;
    },

    // Обновляем данные в интерфейсе о свойствах таблицы
    Interface_Update_TablePr : function(Flag)
    {
        var TablePr = null;
        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            if ( true == this.Selection.Use )
                TablePr = this.Content[this.Selection.StartPos].Get_Props();
            else
                TablePr = this.Content[this.CurPos.ContentPos].Get_Props();
        }
        TablePr.CanBeFlow = true;

        if ( true === Flag )
            return TablePr;
        else if ( null != TablePr )
            editor.sync_TblPropCallback( TablePr );
    },

    // Обновляем данные в интерфейсе о свойствах колонотитулов
    Interface_Update_HdrFtrPr : function()
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            editor.sync_HeadersAndFootersPropCallback( this.HdrFtr.Get_Props() );
        }
    },

    Internal_GetContentPosByXY : function(X,Y, PageNum)
    {
        if ( "undefined" === typeof(PageNum) )
            PageNum = this.CurPage;

        // Сначала проверим Flow-таблицы
        var FlowTable = this.DrawingObjects.getTableByXY( X, Y, PageNum, this );
        if ( null != FlowTable )
        {
            if ( flowobject_Table === FlowTable.Get_Type() )
                return FlowTable.Table.Index;
            else
            {
                var Frame = FlowTable;

                var StartPos  = Frame.StartIndex;
                var FlowCount = Frame.FlowCount;

                for ( var Pos = StartPos; Pos < StartPos + FlowCount; Pos++ )
                {
                    var Item = this.Content[Pos];

                    if ( Y < Item.Pages[0].Bounds.Bottom )
                        return Pos;
                }

                return StartPos + FlowCount - 1;
            }
        }

        // Теперь проверим пустые параграфы с окончанием секций
        var SectCount = this.Pages[PageNum].EndSectionParas.length;
        for ( var Index = 0; Index < SectCount; Index++ )
        {
            var Item = this.Pages[PageNum].EndSectionParas[Index];
            var Bounds = Item.Pages[0].Bounds;

            if ( Y < Bounds.Bottom && Y > Bounds.Top && X > Bounds.Left && X < Bounds.Right )
                return Item.Index;
        }

        var StartPos = this.Pages[PageNum].Pos;
        var EndPos   = Math.min( this.Pages[PageNum].EndPos, this.Content.length - 1 );

        // Сохраним позиции всех Inline элементов на данной странице
        var InlineElements = [];
        for ( var Index = StartPos; Index <= EndPos; Index++ )
        {
            var Item = this.Content[Index];
            
            var PrevItem = Item.Get_DocumentPrev();
            var bEmptySectPara = ( type_Paragraph === Item.GetType() && undefined !== Item.Get_SectionPr() && true === Item.IsEmpty() && null !== PrevItem && ( type_Table === PrevItem.GetType() || undefined === PrevItem.Get_SectionPr() ) ) ? true : false;
            
            if ( false != Item.Is_Inline() && ( type_Table === Item.GetType() || false === bEmptySectPara ) )
                InlineElements.push( Index );
        }

        var Count = InlineElements.length;
        if ( Count <= 0 )
            return StartPos;

        for ( var Pos = 0; Pos < Count - 1; Pos++ )
        {
            var Item = this.Content[InlineElements[Pos + 1]];

            if ( Y < Item.Pages[0].Bounds.Top )
                return InlineElements[Pos];

            if ( Item.Pages.length > 1 )
            {
                if ( ( type_Paragraph === Item.GetType() && Item.Pages[0].FirstLine != Item.Pages[1].FirstLine ) || ( type_Table === Item.GetType() && true === Item.RowsInfo[0].FirstPage ) )
                    return InlineElements[Pos + 1];

                return InlineElements[Pos];
            }

            if ( Pos === Count - 2 )
            {
                // Такое возможно, если страница заканчивается Flow-таблицей
                return InlineElements[Count - 1];
            }
        }

        return InlineElements[0];
    },

    // Убираем селект
    Selection_Remove : function()
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Selection_Remove();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
            if(ParaDrawing)
            {
                ParaDrawing.GoTo_Text(undefined, false);
            }
            return this.DrawingObjects.resetSelection();
        }
        else if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var Start = this.Selection.StartPos;
                        var End   = this.Selection.EndPos;


                        if ( Start > End )
                        {
                            var Temp = Start;
                            Start = End;
                            End = Temp;
                        }

                        Start = Math.max( 0, Start );
                        End   = Math.min( this.Content.length - 1, End );

                        for ( var Index = Start; Index <= End; Index++ )
                        {
                            this.Content[Index].Selection_Remove();
                        }

                        this.Selection.Use   = false;
                        this.Selection.Start = false;

                        this.Selection.StartPos = 0;
                        this.Selection.EndPos   = 0;

                        // Убираем селект и возвращаем курсор
                        this.DrawingDocument.SelectEnabled(false);
                        this.DrawingDocument.TargetStart();
                        this.DrawingDocument.TargetShow();

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        if ( null == this.Selection.Data )
                            break;

                        for ( var Index = 0; Index < this.Selection.Data.length; Index++ )
                        {
                            this.Content[this.Selection.Data[Index]].Selection_Remove();
                        }

                        this.Selection.Use   = false;
                        this.Selection.Start = false;
                        this.Selection.Flag  = selectionflag_Common;

                        // Убираем селект и возвращаем курсор
                        this.DrawingDocument.SelectEnabled(false);
                        this.DrawingDocument.TargetStart();
                        this.DrawingDocument.TargetShow();

                        break;
                    }
                }
            }
        }
    },

    Selection_IsEmpty : function(bCheckHidden)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Selection_IsEmpty(bCheckHidden);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return false;
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                // Выделение нумерации
                if ( selectionflag_Numbering == this.Selection.Flag )
                    return false;
                // Обрабатываем движение границы у таблиц
                else if ( true === this.Selection_Is_TableBorderMove() )
                    return false;
                else
                {
                    if ( this.Selection.StartPos === this.Selection.EndPos )
                        return this.Content[this.Selection.StartPos].Selection_IsEmpty(bCheckHidden);
                    else
                        return false;
                }
            }

            return true;
        }
    },

    Selection_Draw_Page : function(Page_abs)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Selection_Draw_Page(Page_abs);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.drawSelectionPage(Page_abs);
        }
        else
        {
            var Pos_start = this.Pages[Page_abs].Pos;
            var Pos_end   = this.Pages[Page_abs].EndPos;

            if ( true === this.Selection.Use )
            {
                switch( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var Start = this.Selection.StartPos;
                        var End   = this.Selection.EndPos;

                        if ( Start > End )
                        {
                            Start = this.Selection.EndPos;
                            End   = this.Selection.StartPos;
                        }

                        var Start = Math.max( Start, Pos_start );
                        var End   = Math.min( End,   Pos_end   );

                        for ( var Index = Start; Index <= End; Index++ )
                        {
                            this.Content[Index].Selection_Draw_Page(Page_abs);
                        }

                        if ( Page_abs >= 2 && End < this.Pages[Page_abs - 2].EndPos )
                        {
                            this.Selection.UpdateOnRecalc = false;
                            this.DrawingDocument.OnSelectEnd();
                        }

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        if ( null == this.Selection.Data )
                            break;

                        var Count = this.Selection.Data.length;
                        for ( var Index = 0; Index < Count; Index++ )
                        {
                            if ( this.Selection.Data[Index] <= Pos_end && this.Selection.Data[Index] >= Pos_start )
                                this.Content[this.Selection.Data[Index]].Selection_Draw_Page(Page_abs);
                        }

                        if ( Page_abs >= 2 && this.Selection.Data[this.Selection.Data.length - 1] < this.Pages[Page_abs - 2].EndPos )
                        {
                            this.Selection.UpdateOnRecalc = false;
                            this.DrawingDocument.OnSelectEnd();
                        }

                        break;
                    }
                }
            }
        }
    },

    Get_SelectionBounds : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.CurHdrFtr.Content.Get_SelectionBounds();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return null;//this.DrawingObjects.Get_SelectionBounds();
        }
        else
        {
            if (true === this.Selection.Use && selectionflag_Common === this.Selection.Flag)
            {
                var Start = this.Selection.StartPos;
                var End   = this.Selection.EndPos;

                if ( Start > End )
                {
                    Start = this.Selection.EndPos;
                    End   = this.Selection.StartPos;
                }

                if (Start === End)
                    return this.Content[Start].Get_SelectionBounds();
                else
                {
                    var Result = {};
                    Result.Start = this.Content[Start].Get_SelectionBounds().Start;
                    Result.End   = this.Content[End].Get_SelectionBounds().End;

                    return Result;
                }
            }
        }

        return null;
    },

    Selection_Clear : function()
    {
        if ( true === this.Selection.Use )
        {
            switch( this.Selection.Flag )
            {
                case selectionflag_Common:
                {

                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;

                    if ( Start > End )
                    {
                        var Temp = Start;
                        Start = End;
                        End = Temp;
                    }

                    for ( var Index = Start; Index <= End; Index++ )
                    {
                        this.Content[Index].Selection_Clear();
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    if ( null == this.Selection.Data )
                        break;

                    for ( var Index = 0; Index < this.Selection.Data.length; Index++ )
                    {
                        this.Content[this.Selection.Data[Index]].Selection_Clear();
                    }

                    break;
                }
            }
        }

        this.DrawingDocument.SelectClear();
    },

    Selection_SetStart : function(X,Y, MouseEvent)
    {
        var bInText      = (null === this.Is_InText(X, Y, this.CurPage)      ? false : true);
        var bTableBorder = (null === this.Is_TableBorder(X, Y, this.CurPage) ? false : true);
        var nInDrawing   = this.DrawingObjects.isPointInDrawingObjects( X, Y, this.CurPage, this );
        var bFlowTable   = (null === this.DrawingObjects.getTableByXY( X, Y, this.CurPage, this ) ? false : true);

        // Сначала посмотрим, попалили мы в текстовый селект (но при этом не в границу таблицы и не более чем одинарным кликом)
        if ( -1 !== this.Selection.DragDrop.Flag && MouseEvent.ClickCount <= 1 && false === bTableBorder  &&
            ( nInDrawing < 0 || ( nInDrawing === DRAWING_ARRAY_TYPE_BEHIND && true === bInText ) || ( nInDrawing > -1 && ( docpostype_DrawingObjects === this.CurPos.Type || ( docpostype_HdrFtr === this.CurPos.Type && docpostype_DrawingObjects === this.HdrFtr.CurHdrFtr.Content.CurPos.Type ) ) && true === this.DrawingObjects.isSelectedText() && null !== this.DrawingObjects.getMajorParaDrawing() &&  this.DrawingObjects.getGraphicInfoUnderCursor(this.CurPage, X, Y).cursorType === "text" ) ) &&
            true === this.Selection_Check( X, Y, this.CurPage, undefined ) )
        {
            // Здесь мы сразу не начинаем перемещение текста. Его мы начинаем, курсор хотя бы немного изменит свою позицию,
            // это проверяется на MouseMove.
            // TODO: В ворде кроме изменения положения мыши, также запускается таймер для стартования drag-n-drop по времени,
            //       его можно здесь вставить.
            
            this.Selection.DragDrop.Flag = 1;
            this.Selection.DragDrop.Data = { X : X, Y : Y };            
            return;
        }

        var bCheckHdrFtr = true;

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            bCheckHdrFtr = false;
            this.Selection.Start = true;
            this.Selection.Use   = true;
            if ( false != this.HdrFtr.Selection_SetStart( X, Y, this.CurPage, MouseEvent, false ) )
                return;

            this.Selection.Start = false;
            this.Selection.Use   = false;
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
            this.DrawingDocument.EndTrackTable( null, true );
        }

        var PageMetrics = this.Get_PageContentStartPos( this.CurPage, this.Pages[this.CurPage].Pos );

        // Проверяем, не попали ли мы в колонтитул (если мы попадаем в Flow-объект, то попадание в колонтитул не проверяем)
        if ( true != bFlowTable && nInDrawing < 0 && true === bCheckHdrFtr && MouseEvent.ClickCount >= 2 && ( Y <= PageMetrics.Y || Y > PageMetrics.YLimit ) )
        {
            // Если был селект, тогда убираем его
            if ( true === this.Selection.Use )
                this.Selection_Remove();

            this.CurPos.Type = docpostype_HdrFtr;

            // Переходим к работе с колонтитулами
            MouseEvent.ClickCount = 1;
            this.HdrFtr.Selection_SetStart( X, Y, this.CurPage, MouseEvent, true );
            this.Interface_Update_HdrFtrPr();
            
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
            this.DrawingDocument.EndTrackTable( null, true );
        }
        else if ( nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || ( false === bTableBorder && false === bInText && nInDrawing >= 0 ) )
        {
            if ( docpostype_DrawingObjects != this.CurPos.Type )
                this.Selection_Remove();

            // Прячем курсор
            this.DrawingDocument.TargetEnd();
            this.DrawingDocument.SetCurrentPage( this.CurPage );

            this.Selection.Use   = true;
            this.Selection.Start = true;
            this.Selection.Flag  = selectionflag_Common;
            this.CurPos.Type     = docpostype_DrawingObjects;
            this.DrawingObjects.OnMouseDown(MouseEvent, X, Y, this.CurPage);
        }
        else
        {
            var bOldSelectionIsCommon = true;

            if ( docpostype_DrawingObjects === this.CurPos.Type && true != this.Is_InDrawing( X, Y, this.CurPage ) )
            {
                this.DrawingObjects.resetSelection();
                bOldSelectionIsCommon = false;
            }

            var ContentPos = this.Internal_GetContentPosByXY(X,Y);

            if ( docpostype_Content != this.CurPos.Type )
            {
                this.CurPos.Type = docpostype_Content;
                this.CurPos.ContentPos = ContentPos;
                bOldSelectionIsCommon = false;
            }

            var SelectionUse_old = this.Selection.Use;
            var Item = this.Content[ContentPos];

            var bTableBorder = false;
            if ( type_Table == Item.GetType() )
                bTableBorder = ( null === Item.Is_TableBorder( X, Y, this.CurPage ) ? false : true );

            // Убираем селект, кроме случаев либо текущего параграфа, либо при движении границ внутри таблицы
            if ( !(true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon) )
            {
                if ( (selectionflag_Common != this.Selection.Flag) || ( true === this.Selection.Use && MouseEvent.ClickCount <= 1 && true != bTableBorder )  )
                    this.Selection_Remove();
            }

            this.Selection.Use      = true;
            this.Selection.Start    = true;
            this.Selection.Flag     = selectionflag_Common;

            if ( true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon )
            {
                this.Selection_SetEnd( X, Y, {Type : g_mouse_event_type_up, ClickCount : 1} );
                this.Selection.Use      = true;
                this.Selection.Start    = true;
                this.Selection.EndPos   = ContentPos;
                this.Selection.Data     = null;
            }
            else
            {
                Item.Selection_SetStart( X, Y, this.CurPage, MouseEvent, bTableBorder );
                Item.Selection_SetEnd( X, Y, this.CurPage, {Type : g_mouse_event_type_move, ClickCount : 1}, bTableBorder );

                if ( !(type_Table == Item.GetType() && true == bTableBorder) )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = ContentPos;
                    this.Selection.EndPos   = ContentPos;
                    this.Selection.Data     = null;

                    this.CurPos.ContentPos  = ContentPos;

                    if ( type_Paragraph === Item.GetType() && true === MouseEvent.CtrlKey )
                    {
                        var Hyperlink = Item.Check_Hyperlink( X, Y, this.CurPage );
                        if ( null != Hyperlink )
                        {
                            this.Selection.Data =
                            {
                                Hyperlink : true,
                                Value     : Hyperlink
                            };
                        }
                    }
                }
                else
                {
                    this.Selection.Data =
                    {
                        TableBorder : true,
                        Pos         : ContentPos,
                        Selection   : SelectionUse_old
                    };
                }
            }
        }
    },

    // Данная функция может использоваться как при движении, так и при окончательном выставлении селекта.
    // Если bEnd = true, тогда это конец селекта.
    Selection_SetEnd : function(X, Y, MouseEvent)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Selection_SetEnd(  X, Y, this.CurPage, MouseEvent );
            if ( g_mouse_event_type_up == MouseEvent.Type )
            {
                if ( true != this.DrawingObjects.isPolylineAddition() )
                    this.Selection.Start = false;
                else
                    this.Selection.Start = true;
            }

            return;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            if ( g_mouse_event_type_up == MouseEvent.Type )
            {
                this.DrawingObjects.OnMouseUp( MouseEvent, X, Y, this.CurPage );

                if ( true != this.DrawingObjects.isPolylineAddition() )
                {
                    this.Selection.Start = false;
                    this.Selection.Use   = true;
                }
                else
                {
                    this.Selection.Start = true;
                    this.Selection.Use   = true;
                }
            }
            else
            {
                this.DrawingObjects.OnMouseMove( MouseEvent, X, Y, this.CurPage );
            }
            return;
        }

        // Обрабатываем движение границы у таблиц
        if ( true === this.Selection_Is_TableBorderMove() )
        {
            var Item = this.Content[this.Selection.Data.Pos];
            Item.Selection_SetEnd( X, Y, this.CurPage, MouseEvent, true );

            if ( g_mouse_event_type_up == MouseEvent.Type )
            {
                this.Selection.Start = false;

                if ( true != this.Selection.Data.Selection )
                {
                    this.Selection.Use = false;
                }

                this.Selection.Data  = null;
            }

            return;
        }

        if ( false === this.Selection.Use )
            return;

        var ContentPos = this.Internal_GetContentPosByXY(X,Y);

        var OldPos = this.CurPos.ContentPos;
        var OldInnerPos = null;
        if ( type_Paragraph === this.Content[OldPos].GetType() )
            OldInnerPos = this.Content[OldPos].CurPos.ContentPos;
        else //if ( type_Table === this.Content[OldPos].GetType() )
            OldInnerPos = this.Content[OldPos].CurCell;

        this.CurPos.ContentPos = ContentPos;
        var OldEndPos = this.Selection.EndPos;
        this.Selection.EndPos = ContentPos;

        // Удалим отметки о старом селекте
        if ( OldEndPos < this.Selection.StartPos && OldEndPos < this.Selection.EndPos )
        {
            var TempLimit = Math.min( this.Selection.StartPos, this.Selection.EndPos );
            for ( var Index = OldEndPos; Index < TempLimit; Index++ )
            {
                this.Content[Index].Selection.Use   = false;
                this.Content[Index].Selection.Start = false;
            }
        }
        else if ( OldEndPos > this.Selection.StartPos && OldEndPos > this.Selection.EndPos )
        {
            var TempLimit = Math.max( this.Selection.StartPos, this.Selection.EndPos );
            for ( var Index = TempLimit + 1; Index <= OldEndPos; Index++ )
            {
                this.Content[Index].Selection.Use   = false;
                this.Content[Index].Selection.Start = false;
            }
        }

        // Направление селекта: 1 - прямое, -1 - обратное, 0 - отмечен 1 элемент документа
        var Direction = ( ContentPos > this.Selection.StartPos ? 1 : ( ContentPos < this.Selection.StartPos ? -1 : 0 )  );

        if ( g_mouse_event_type_up == MouseEvent.Type )
        {
            // Останаливаем селект в глобальном классе. Кроме этого мы должны остановить селект в
            // стартовом элементе селекта.
            this.Selection.Start = false;

            // Если 0 === Direction, в функции Selection_SetEnd все что нужно обработается
            if ( 0 != Direction )
                this.Content[this.Selection.StartPos].Selection_Stop(X, Y, this.CurPage, MouseEvent);
        }

        var Start, End;
        if ( 0 == Direction )
        {
            var Item = this.Content[this.Selection.StartPos];
            var ItemType = Item.GetType();
            Item.Selection_SetEnd( X, Y, this.CurPage, MouseEvent );

            if ( false === Item.Selection.Use )
            {
                this.Selection.Use = false;

                if ( null != this.Selection.Data && true === this.Selection.Data.Hyperlink )
                {
                    editor.sync_HyperlinkClickCallback( this.Selection.Data.Value.Get_Value() );
                    this.Selection.Data.Value.Set_Visited( true );

                    for ( var PageIdx = Item.Get_StartPage_Absolute(); PageIdx < Item.Get_StartPage_Absolute() + Item.Pages.length; PageIdx++ )
                        this.DrawingDocument.OnRecalculatePage( PageIdx, this.Pages[PageIdx] );

                    this.DrawingDocument.OnEndRecalculate(false, true);
                }
            }
            else
            {
                this.Selection.Use = true;
            }

            return;
        }
        else if ( Direction > 0 )
        {
            Start = this.Selection.StartPos;
            End   = this.Selection.EndPos;
        }
        else
        {
            End   = this.Selection.StartPos;
            Start = this.Selection.EndPos;
        }

        // TODO: Разрулить пустой селект
        // Чтобы не было эффекта, когда ничего не поселекчено, а при удалении соединяются параграфы

        for ( var Index = Start; Index <= End; Index++ )
        {
            var Item = this.Content[Index];
            Item.Selection.Use = true;
            var ItemType = Item.GetType();

            switch ( Index )
            {
                case Start:

                    if ( type_Paragraph === ItemType )
                    {
                        Item.Selection_SetBegEnd( ( Direction > 0 ? false : true ), false );
                    }
                    else //if ( type_Table === ItemType )
                    {
                        var Row  = Item.Content.length - 1;
                        var Cell = Item.Content[Row].Get_CellsCount() - 1;
                        var Pos  = { Row: Row, Cell : Cell };

                        if ( Direction > 0 )
                            Item.Selection.EndPos.Pos   = Pos;
                        else
                            Item.Selection.StartPos.Pos = Pos;

                        Item.Internal_Selection_UpdateCells();
                    }

                    break;

                case End:

                    if ( type_Paragraph === ItemType )
                    {
                        Item.Selection_SetBegEnd( ( Direction > 0 ? true : false ), true );
                    }
                    else //if ( type_Table === ItemType )
                    {
                        var Pos  = { Row: 0, Cell : 0 };

                        if ( Direction > 0 )
                            Item.Selection.StartPos.Pos = Pos;
                        else
                            Item.Selection.EndPos.Pos   = Pos;

                        Item.Internal_Selection_UpdateCells();
                    }

                    break;

                default:

                    if ( type_Paragraph === ItemType )
                    {
                        Item.Select_All( Direction );
                    }
                    else //if ( type_Table === ItemType )
                    {
                        var Row  = Item.Content.length - 1;
                        var Cell = Item.Content[Row].Get_CellsCount() - 1;
                        var Pos0  = { Row: 0, Cell : 0 };
                        var Pos1  = { Row: Row, Cell : Cell };

                        if ( Direction > 0 )
                        {
                            Item.Selection.StartPos.Pos = Pos0;
                            Item.Selection.EndPos.Pos   = Pos1;
                        }
                        else
                        {
                            Item.Selection.EndPos.Pos   = Pos0;
                            Item.Selection.StartPos.Pos = Pos1;
                        }

                        Item.Internal_Selection_UpdateCells();
                    }

                    break;
            }
        }

        this.Content[ContentPos].Selection_SetEnd( X, Y, this.CurPage, MouseEvent );

        // Проверяем, чтобы у нас в селект не попали элементы, в которых не выделено ничего
        if ( true === this.Content[End].Selection_IsEmpty() )
        {
            this.Content[End].Selection_Remove();
            End--;
        }

        if ( Start != End && true === this.Content[Start].Selection_IsEmpty() )
        {
            this.Content[Start].Selection_Remove();
            Start++;
        }

        if ( Direction > 0 )
        {
            this.Selection.StartPos = Start;
            this.Selection.EndPos   = End;
        }
        else
        {
            this.Selection.StartPos = End;
            this.Selection.EndPos   = Start;
        }
    },

    // Данный запрос может прийти из внутреннего элемента(параграф, таблица), чтобы узнать
    // происходил ли выделение в пределах одного элеменета.
    Selection_Is_OneElement : function()
    {
        if ( true === this.Selection.Use && this.CurPos.Type === docpostype_Content && this.Selection.Flag === selectionflag_Common && this.Selection.StartPos === this.Selection.EndPos )
            return 0;

        return (this.Selection.StartPos < this.Selection.EndPos ? 1 : -1);
    },

    Selection_Is_TableBorderMove : function()
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Selection_Is_TableBorderMove();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.selectionIsTableBorder();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType() )
                return true;
        }

        return false;
    },

    // Проверяем попали ли мы в селект
    Selection_Check : function(X, Y, Page_Abs, NearPos)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Selection_Check( X, Y, Page_Abs, NearPos );
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.selectionCheck( X, Y, Page_Abs, NearPos );
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var Start = this.Selection.StartPos;
                        var End   = this.Selection.EndPos;

                        if ( Start > End )
                        {
                            Start = this.Selection.EndPos;
                            End   = this.Selection.StartPos;
                        }

                        if ( undefined !== NearPos )
                        {
                            for ( var Index = Start; Index <= End; Index++ )
                            {
                                if ( true === this.Content[Index].Selection_Check( 0, 0, 0, NearPos ) )
                                    return true;
                            }

                            return false;
                        }
                        else
                        {
                            var ContentPos = this.Internal_GetContentPosByXY( X, Y, Page_Abs, NearPos );
                            if ( ContentPos > Start && ContentPos < End )
                                return true;
                            else if ( ContentPos < Start || ContentPos > End )
                                return false;
                            else
                                return this.Content[ContentPos].Selection_Check( X, Y, Page_Abs, undefined );

                            return false;
                        }
                    }
                    case selectionflag_Numbering : return false;
                }

                return false;
            }

            return false;
        }
    },

    // Селектим весь параграф
    Select_All : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Select_All();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type && true === this.DrawingObjects.isSelectedText() )
        {
            this.DrawingObjects.selectAll();
        }
        else
        {
            if ( true === this.Selection.Use )
                this.Selection_Remove();

            this.DrawingDocument.SelectEnabled(true);
            this.DrawingDocument.TargetEnd();

            this.CurPos.Type = docpostype_Content;

            this.Selection.Use      = true;
            this.Selection.Start    = false;
            this.Selection.Flag     = selectionflag_Common;

            this.Selection.StartPos = 0;
            this.Selection.EndPos   = this.Content.length - 1;

            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                this.Content[Index].Select_All();
            }
        }

        // TODO: Пока делаем Start = true, чтобы при Ctrl+A не происходил переход к концу селекта, надо будет
        //       сделать по нормальному
        this.Selection.Start = true;
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Selection.Start = false;

        // Отдельно обрабатываем это событие, потому что внутри него идет проверка на this.Selection.Start !== true
        this.Document_UpdateCopyCutState();
    },

    On_DragTextEnd : function(NearPos, bCopy)
    {       
        // Сначала нам надо проверить попадаем ли мы обратно в выделенный текст, если да, тогда ничего не делаем,
        // а если нет, тогда удаляем выделенный текст и вставляем его в заданное место.

        if ( true === this.Selection_Check( 0, 0, 0, NearPos ) )
        {
            this.Selection_Remove();

            // Нам надо снять селект и поставить курсор в то место, где была ближайшая позиция
            var Paragraph = NearPos.Paragraph;
            Paragraph.Cursor_MoveToNearPos( NearPos );
            Paragraph.Document_SetThisElementCurrent(false);

            if ( true === this.Comments.Is_Use() )
            {
                this.Select_Comment( null, false );
                editor.sync_HideComment();
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
        else
        {
            // Создаем сразу точку в истории, т.к. при выполнении функции Get_SelectedContent нам надо, чтобы данная
            // точка уже набивалась изменениями. Если из-за совместного редактирования действие сделать невозможно будет,
            // тогда последнюю точку удаляем.
            History.Create_NewPoint();

            NearPos.Paragraph.Check_NearestPos( NearPos );

            // Получим копию выделенной части документа, которую надо перенести в новое место, одновременно с этим
            // удаляем эту выделенную часть (если надо).

            var DocContent = this.Get_SelectedContent();

            var Para = NearPos.Paragraph;
            
            // Автофигуры не вставляем в другие автофигуры
            if ( true === Para.Parent.Is_DrawingShape() && true === DocContent.HaveShape )
            {
                History.Remove_LastPoint();
                return;
            }

            // В формулу вставляем только формулу
            var ParaNearPos = NearPos.Paragraph.Get_ParaNearestPos(NearPos);
            if (null === ParaNearPos || ParaNearPos.Classes.length < 2)
            {
                History.Remove_LastPoint();
                return;
            }

            var LastClass = ParaNearPos.Classes[ParaNearPos.Classes.length - 1];
            if (para_Math_Run === LastClass.Type)
            {
                // Проверяем, что вставляемый контент тоже формула
                var Element = DocContent.Elements[0].Element;
                var MathRun = LastClass;
                if (1 !== DocContent.Elements.length || type_Paragraph !== Element.Get_Type() || 2 !== Element.Content.length || para_Math !== Element.Content[0].Type || null === MathRun.Parent)
                {
                    History.Remove_LastPoint();
                    return;
                }

                // Если надо удаляем выделенную часть (пересчет отключаем на время удаления)
                if ( true !== bCopy )
                {
                    this.TurnOff_Recalculate();
                    this.TurnOff_InterfaceEvents();
                    this.Remove(1, false, false, false);
                    this.TurnOn_Recalculate(false);
                    this.TurnOn_InterfaceEvents(false);
                }

                this.Selection_Remove();

                var NewMathRun     = MathRun.Split(ParaNearPos.NearPos.ContentPos, ParaNearPos.Classes.length - 1);
                var MathContent    = ParaNearPos.Classes[ParaNearPos.Classes.length - 2];
                var MathContentPos = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 2];

                MathContent.Add_ToContent(MathContentPos + 1, NewMathRun);
                MathContent.Insert_MathContent(Element.Content[0].Root, MathContentPos + 1, true);

                this.Recalculate();

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();

                return;
            }
            else if (para_Run !== LastClass.Type)
            {
                History.Remove_LastPoint();
                return;
            }


            // Если мы копируем, тогда не надо проверять выделенные параграфы, а если переносим, тогда проверяем 
            var CheckChangesType = (true !== bCopy ? changestype_Document_Content : changestype_None);
            if ( false === this.Document_Is_SelectionLocked( CheckChangesType, { Type : changestype_2_ElementsArray_and_Type, Elements : [Para], CheckType : changestype_Paragraph_Content } ) )
            {
                // Если надо удаляем выделенную часть (пересчет отключаем на время удаления)
                if ( true !== bCopy )
                {
                    this.TurnOff_Recalculate();
                    this.TurnOff_InterfaceEvents();
                    this.Remove(1, false, false, false);
                    this.TurnOn_Recalculate(false);
                    this.TurnOn_InterfaceEvents(false);
                }

                this.Selection_Remove();

                // Выделение выставляется внутри функции Insert_Content
                if ( undefined != Para.Parent  )
                {
                    Para.Parent.Insert_Content( DocContent, NearPos );

                    this.Recalculate();

                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateRulersState();
                }
            }
            else
                History.Remove_LastPoint();
        }
    },

    Get_SelectedContent : function()
    {
        var SelectedContent = new CSelectedContent();
        
        // Заполняем выделенный контент
        if ( docpostype_HdrFtr === this.CurPos.Type )
            this.HdrFtr.Get_SelectedContent(SelectedContent);
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            this.DrawingObjects.Get_SelectedContent(SelectedContent);
        else
        {
            if ( true !== this.Selection.Use || this.Selection.Flag !== selectionflag_Common )
                return;

            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( StartPos > EndPos )
            {
                StartPos = this.Selection.EndPos;
                EndPos   = this.Selection.StartPos;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                this.Content[Index].Get_SelectedContent( SelectedContent );
            }
        }
        
        SelectedContent.On_EndCollectElements(this);               
        
        return SelectedContent;
    },

    Insert_Content : function(SelectedContent, NearPos)
    {
        var NearContentPos = NearPos.ContentPos;

        var Elements = SelectedContent.Elements;

        var ElementsCount = Elements.length;
        if ( ElementsCount <= 0 )
            return;

        var Para = NearPos.Paragraph;
        // Сначала найдем номер элемента, начиная с которого мы будем производить вставку
        var DstIndex = -1;
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            if ( this.Content[Index] === Para )
            {
                DstIndex = Index;
                break;
            }
        }

        if ( -1 === DstIndex )
            return;

        var FirstElement = SelectedContent.Elements[0];
        if ( 1 === ElementsCount && true !== FirstElement.SelectedAll && type_Paragraph === FirstElement.Element.GetType() && true !== FirstElement.Element.Is_Empty() )
        {
            // Нам нужно в заданный параграф вставить выделенный текст
            var NewPara = FirstElement.Element;
            var NewElementsCount = NewPara.Content.length - 1; // Последний ран с para_End не добавляем
            
            var ParaNearPos = Para.Get_ParaNearestPos( NearPos );
            if ( null === ParaNearPos || ParaNearPos.Classes.length < 2 )
                return;

            var LastClass = ParaNearPos.Classes[ParaNearPos.Classes.length - 1];
            if ( para_Run !== LastClass.Type )
                return;

            var NewElement = LastClass.Split( ParaNearPos.NearPos.ContentPos, ParaNearPos.Classes.length - 1 );
            var PrevClass = ParaNearPos.Classes[ParaNearPos.Classes.length - 2];
            var PrevPos   = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 2];

            PrevClass.Add_ToContent( PrevPos + 1, NewElement );

            // TODO: Заглушка для переноса автофигур и картинок. Когда разрулим ситуацию так, чтобы когда у нас 
            //       в текста была выделена автофигура выделение шло для автофигур, тогда здесь можно будет убрать.
            var bNeedSelect = (true === SelectedContent.MoveDrawing ? false : true);

            for ( var Index = 0; Index < NewElementsCount; Index++ )
            {
                var Item = NewPara.Content[Index];
                PrevClass.Add_ToContent( PrevPos + 1 + Index, Item );

                if ( true === bNeedSelect )
                    Item.Select_All();
            }
            
            if ( true === bNeedSelect )
            {
                PrevClass.Selection.Use = true;
                PrevClass.Selection.StartPos = PrevPos + 1;
                PrevClass.Selection.EndPos   = PrevPos + 1 + NewElementsCount - 1;

                for ( var Index = 0; Index < ParaNearPos.Classes.length - 2; Index++ )
                {
                    var Class    = ParaNearPos.Classes[Index];
                    var ClassPos = ParaNearPos.NearPos.ContentPos.Data[Index];

                    Class.Selection.Use      = true;
                    Class.Selection.StartPos = ClassPos;
                    Class.Selection.EndPos   = ClassPos;
                }

                this.Selection.Use      = true;
                this.Selection.StartPos = DstIndex;
                this.Selection.EndPos   = DstIndex;
            }

            if ( PrevClass.Correct_Content )
            {
                PrevClass.Correct_Content();
            }
        }
        else
        {
            var bConcatS = ( type_Table === Elements[0].Element.GetType() ? false : true );
            var bConcatE = ( type_Table === Elements[ElementsCount - 1].Element.GetType() || true === Elements[ElementsCount - 1].SelectedAll ? false : true );
            var ParaS = Para;
            var ParaE = Para;
            var ParaEIndex = DstIndex;
            
            // Нам надо разделить наш параграф в заданной позиции, если позиция в
            // начале или конце параграфа, тогда делить не надо
            Para.Cursor_MoveToNearPos( NearPos );
            Para.Selection_Remove();

            if ( true === Para.Cursor_IsEnd() )
            {
                bConcatE = false;

                if ( 1 === ElementsCount && type_Paragraph === FirstElement.Element.GetType() && ( true === FirstElement.Element.Is_Empty() || true == FirstElement.SelectedAll ) )
                {
                    bConcatS = false;

                    if (type_Paragraph !== this.Content[DstIndex].Get_Type() || true !== this.Content[DstIndex].Is_Empty())
                        DstIndex++;
                }
            }
            else if ( true === Para.Cursor_IsStart() )
            {
                bConcatS = false;
            }
            else
            {
                // Создаем новый параграф
                var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );
                Para.Split( NewParagraph );
                this.Internal_Content_Add( DstIndex + 1, NewParagraph );

                ParaE = NewParagraph;
                ParaEIndex = DstIndex + 1;
            }

            var StartIndex = 0;
            if ( true === bConcatS )
            {
                // Если мы присоединяем новый параграф, то и копируем все настройки параграфа (так делает Word)
                ParaS.Concat( Elements[0].Element );
                ParaS.Set_Pr( Elements[0].Element.Pr );

                StartIndex++;
                
                var TempPara = Elements[0].Element;

                // Вызываем так, чтобы выделить все внутренние элементы
                TempPara.Select_All();

                ParaS.Selection.Use      = true;
                ParaS.Selection.StartPos = ParaS.Content.length - TempPara.Content.length;
                ParaS.Selection.EndPos   = ParaS.Content.length - 1;
            }

            var EndIndex = ElementsCount - 1;
            if ( true === bConcatE && StartIndex < EndIndex )
            {
                var _ParaE = Elements[ElementsCount - 1].Element;

                var TempCount = _ParaE.Content.length - 1;


                _ParaE.Select_All();
                _ParaE.Concat( ParaE );
                _ParaE.Set_Pr( ParaE.Pr );

                this.Internal_Content_Add( ParaEIndex, _ParaE );
                this.Internal_Content_Remove( ParaEIndex + 1, 1 );

                _ParaE.Selection.Use      = true;
                _ParaE.Selection.StartPos = 0;
                _ParaE.Selection.EndPos   = TempCount;

                EndIndex--;
            }


            for ( var Index = StartIndex; Index <= EndIndex; Index++ )
            {
                this.Internal_Content_Add( DstIndex + Index, Elements[Index].Element );
                this.Content[DstIndex + Index].Select_All();
            }

            this.Selection.Use      = true;
            this.Selection.StartPos = DstIndex;
            this.Selection.EndPos   = DstIndex + ElementsCount - 1;
        }

        if ( docpostype_DrawingObjects !== this.CurPos.Type )
            this.CurPos.Type = docpostype_Content;
    },

    Document_SelectNumbering : function(NumPr)
    {
        this.Selection_Remove();

        this.Selection.Use  = true;
        this.Selection.Flag = selectionflag_Numbering;
        this.Selection.Data = [];

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];
            var ItemNumPr = null;
            if ( type_Paragraph == Item.GetType() && undefined != ( ItemNumPr = Item.Numbering_Get() ) && ItemNumPr.NumId == NumPr.NumId && ItemNumPr.Lvl == NumPr.Lvl )
            {
                this.Selection.Data.push( Index );
                Item.Selection_SelectNumbering();
            }
        }

        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();

        this.Document_UpdateSelectionState();
    },

    // Если сейчас у нас заселекчена нумерация, тогда убираем селект
    Remove_NumberingSelection : function()
    {
        if ( true === this.Selection.Use && selectionflag_Numbering == this.Selection.Flag )
            this.Selection_Remove();
    },

    Update_CursorType : function( X, Y, PageIndex, MouseEvent )
    {
        editor.sync_MouseMoveStartCallback();

        // Ничего не делаем
        if ( true === this.DrawingDocument.IsCursorInTableCur( X, Y, PageIndex ) )
        {
            this.DrawingDocument.SetCursorType( "default", new CMouseMoveData() );
            editor.sync_MouseMoveEndCallback();
            return;
        }

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Update_CursorType( X, Y, PageIndex );
        }
        else
        {
            var bInText      = (null === this.Is_InText(X, Y, this.CurPage)      ? false : true);
            var bTableBorder = (null === this.Is_TableBorder(X, Y, this.CurPage) ? false : true);

            // Ничего не делаем
            if ( true === this.DrawingObjects.updateCursorType(PageIndex, X, Y, MouseEvent, ( true === bInText || true === bTableBorder ? true : false )) )
            {
                editor.sync_MouseMoveEndCallback();
                return;
            }

            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageIndex );
            var Item = this.Content[ContentPos];
            Item.Update_CursorType( X, Y, PageIndex );
        }

        editor.sync_MouseMoveEndCallback();
    },

    // Проверяем попадем ли мы в границу таблицы (null - не попали, а если попали возвращается указатель на таблицу)
    Is_TableBorder : function( X, Y, PageIndex )
    {
        if ( PageIndex >= this.Pages.length || PageIndex < 0 )
            return null;

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Is_TableBorder( X, Y, PageIndex );
        }
        else if ( -1 != this.DrawingObjects.isPointInDrawingObjects( X,Y, PageIndex, this ) )
        {
            return null;
        }
        else
        {
            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageIndex );
            var Item = this.Content[ContentPos];

            if ( type_Table == Item.GetType() )
                return Item.Is_TableBorder( X, Y, PageIndex );
            else
                return null;
        }

        return null;
    },

    // Проверяем, попали ли мы четко в текст (не лежащий в автофигуре)
    Is_InText : function(X, Y, PageIndex)
    {
        if ( PageIndex >= this.Pages.length || PageIndex < 0 )
            return null;

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Is_InText( X, Y, PageIndex );
        }
        else
        {
            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageIndex );
            var Item = this.Content[ContentPos];
            return Item.Is_InText( X, Y, PageIndex );
        }
    },

    // Проверяем, попали ли мы в автофигуру данного DocumentContent
    Is_InDrawing : function(X, Y, PageIndex)
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Is_InDrawing( X, Y, PageIndex );
        }
        else if ( -1 != this.DrawingObjects.isPointInDrawingObjects( X, Y, this.CurPage, this ) )
            return true;
        else
        {
            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageIndex );
            var Item = this.Content[ContentPos];
            if ( type_Table == Item.GetType() )
                return Item.Is_InDrawing( X, Y, PageIndex );

            return false;
        }
    },

    Is_UseInDocument : function(Id)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            if ( Id === this.Content[Index].Get_Id() )
                return true;
        }

        return false;
    },

    OnKeyDown : function(e)
    {
        // Если мы только что расширяли документ двойным щелчком, то сохраняем это действие
        if ( true === this.History.Is_ExtendDocumentToPos() )
            this.History.Clear_Additional();

        // Сбрасываем текущий элемент в поиске
        if ( this.SearchEngine.Count > 0 )
            this.SearchEngine.Reset_Current();

        var bUpdateSelection = true;
        var bRetValue = false;

        if ( e.KeyCode == 8 && false === editor.isViewMode ) // BackSpace
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Remove) )
            {
                this.Create_NewHistoryPoint();
                this.Remove( -1, true );
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 9 && false === editor.isViewMode ) // Tab
        {
            var SelectedInfo = this.Get_SelectedElementsInfo();

            if ( true === SelectedInfo.Is_InTable() && true != e.CtrlKey )
            {
                this.Cursor_MoveToCell( true === e.ShiftKey ? false : true );
            }
            else if ( true === SelectedInfo.Is_DrawingObjSelected() && true != e.CtrlKey )
            {
                this.DrawingObjects.selectNextObject( ( e.ShiftKey === true ? -1 : 1 ) );
            }
            else
            {
                if ( true === SelectedInfo.Is_MixedSelection() )
                {
                    if ( true === e.ShiftKey )
                        editor.DecreaseIndent();
                    else
                        editor.IncreaseIndent();
                }
                else
                {
                    var Paragraph = SelectedInfo.Get_Paragraph();
                    var ParaPr    = Paragraph.Get_CompiledPr2(false).ParaPr;
                    if ( null != Paragraph && ( true === Paragraph.Cursor_IsStart() || true === Paragraph.Selection_IsFromStart() ) && ( undefined != Paragraph.Numbering_Get() || ( true != Paragraph.IsEmpty() && ParaPr.Tabs.Tabs.length <= 0 ) ) )
                    {
                        if ( false === this.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Element_and_Type, Element : Paragraph, CheckType : changestype_Paragraph_Properties } ) )
                        {
                            this.Create_NewHistoryPoint();
                            Paragraph.Add_Tab(e.ShiftKey);
                            this.Recalculate();

                            this.Document_UpdateInterfaceState();
                            this.Document_UpdateSelectionState();
                        }
                    }
                    else if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                    {
                        this.Create_NewHistoryPoint();
                        this.Paragraph_Add( new ParaTab() );
                    }
                }
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 13 ) // Enter
        {
            var Hyperlink = this.Hyperlink_Check(false);
            if ( null != Hyperlink && false === e.ShiftKey )
            {
                editor.sync_HyperlinkClickCallback( Hyperlink.Get_Value() )
                Hyperlink.Set_Visited(true);

                // TODO: Пока сделаем так, потом надо будет переделать
                this.DrawingDocument.ClearCachePages();
                this.DrawingDocument.FirePaint();
            }
            else
            {
                if (false === editor.isViewMode)
                {
                    var CheckType = ( e.ShiftKey || e.CtrlKey ? changestype_Paragraph_Content : changestype_Document_Content_Add );
                    if (false === this.Document_Is_SelectionLocked(CheckType))
                    {
                        this.Create_NewHistoryPoint();

                        var oSelectedInfo = this.Get_SelectedElementsInfo();
                        var oMath = oSelectedInfo.Get_Math();
                        if (null !== oMath && oMath.Is_InInnerContent())
                        {
                            oMath.Handle_AddNewLine();
                        }
                        else
                        {
                            if (e.ShiftKey)
                            {
                                this.Paragraph_Add(new ParaNewLine(break_Line));
                            }
                            else if (e.CtrlKey)
                            {
                                this.Paragraph_Add(new ParaNewLine(break_Page));
                            }
                            else
                            {
                                this.Add_NewParagraph();
                            }
                        }
                    }
                }
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 27 ) // Esc
        {
            // 1. Если у нас сейчас происходит выделение маркером, тогда его отменяем
            // 2. Если у нас сейчас происходит форматирование по образцу, тогда его отменяем
            // 3. Если у нас выделена автофигура (в колонтитуле или документе), тогда снимаем выделение с нее
            // 4. Если мы просто находимся в колонтитуле (автофигура не выделена) выходим из колонтитула
            if ( true === editor.isMarkerFormat )
            {
                editor.sync_MarkerFormatCallback( false );
                this.Update_CursorType( this.CurPos.RealX, this.CurPos.RealY, this.CurPage, new CMouseEventHandler() );
            }
            else if ( c_oAscFormatPainterState.kOff !== editor.isPaintFormat )
            {
                editor.sync_PaintFormatCallback( c_oAscFormatPainterState.kOff );
                this.Update_CursorType( this.CurPos.RealX, this.CurPos.RealY, this.CurPage, new CMouseEventHandler() );
            }
            else if ( docpostype_DrawingObjects === this.CurPos.Type || (docpostype_HdrFtr === this.CurPos.Type && null != this.HdrFtr.CurHdrFtr && docpostype_DrawingObjects === this.HdrFtr.CurHdrFtr.Content.CurPos.Type ) )
            {
                this.DrawingObjects.resetSelection2();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
            }
            else if ( docpostype_HdrFtr == this.CurPos.Type )
            {
                this.Document_End_HdrFtrEditing();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 32 && false === editor.isViewMode ) // Space
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();

                // Если мы находимся в формуле, тогда пытаемся выполнить автозамену

                var oSelectedInfo = this.Get_SelectedElementsInfo();
                var oMath = oSelectedInfo.Get_Math();

                if (null !== oMath && true === oMath.Make_AutoCorrect())
                {
                    // Ничего тут не делаем. Все делается в автозамене
                }
                else
                {
                    if (true === e.ShiftKey && true === e.CtrlKey)
                    {
                        this.DrawingDocument.TargetStart();
                        this.DrawingDocument.TargetShow();

                        this.Paragraph_Add(new ParaText(String.fromCharCode(0x00A0)));
                    }
                    else if (true === e.CtrlKey)
                    {
                        this.Paragraph_ClearFormatting();
                    }
                    else
                    {
                        this.DrawingDocument.TargetStart();
                        this.DrawingDocument.TargetShow();

                        this.Paragraph_Add(new ParaSpace());
                    }
                }
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 33 ) // PgUp
        {
            // TODO: Реализовать Ctrl + Shift + PgUp / Ctrl + PgUp / Shift + PgUp

            if ( true === e.AltKey )
            {
                var MouseEvent = new CMouseEventHandler();

                MouseEvent.ClickCount = 1;
                MouseEvent.Type = g_mouse_event_type_down;

                this.CurPage--;

                if ( this.CurPage < 0 )
                    this.CurPage = 0;

                this.Selection_SetStart( 0, 0, MouseEvent );

                MouseEvent.Type = g_mouse_event_type_up;
                this.Selection_SetEnd( 0, 0, MouseEvent );
            }
            else
            {
                if (docpostype_HdrFtr === this.CurPos.Type)
                {
                    if ( true === this.HdrFtr.GoTo_PrevHdrFtr() )
                    {
                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();
                    }
                }
                else
                {

                    var TempXY = this.Cursor_GetPos();

                    var X = TempXY.X;
                    var Y = TempXY.Y;

                    var Dy = this.DrawingDocument.GetVisibleMMHeight();
                    if ( Y - Dy < 0 )
                    {
                        this.CurPage--;
                        var PageH = this.Get_PageLimits( this.CurPage).YLimit;

                        Dy -= Y;
                        Y = PageH;
                        while ( Dy > PageH )
                        {
                            Dy -= PageH;
                            this.CurPage--;
                        }

                        if ( this.CurPage < 0 )
                        {
                            this.CurPage = 0;
                            Dy = PageH - this.Content[0].Pages[this.Content[0].Pages.length - 1].Bounds.Top;
                        }
                    }

                    // TODO: переделать данную проверку
                    if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                        this.CurPage = this.DrawingDocument.m_lPagesCount;

                    var StartX = X;
                    var StartY = Y;
                    var CurY   = Y;

                    while ( Math.abs(StartY - Y) < 0.001 )
                    {
                        var bBreak = false;
                        CurY -= Dy;

                        if ( CurY < 0 )
                        {
                            this.CurPage--;
                            var PageH = this.Get_PageLimits( this.CurPage).YLimit;
                            CurY = PageH;

                            // Эта проверка нужна для выполнения PgUp в начале документа
                            if ( this.CurPage < 0 )
                            {
                                this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                                CurY = 0;
                            }

                            // Поскольку мы перешли на другую страницу, то можно из цикла выходить
                            bBreak = true;
                        }

                        this.Cursor_MoveAt( StartX, CurY, false );
                        this.CurPos.RealX = StartX;
                        this.CurPos.RealY = CurY;

                        TempXY = this.Cursor_GetPos();
                        X = TempXY.X;
                        Y = TempXY.Y;

                        if ( true === bBreak )
                            break;
                    }
                }
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 34 ) // PgDn
        {
            // TODO: Реализовать Ctrl + Shift + PgDn / Ctrl + PgDn / Shift + PgDn

            if ( true === e.AltKey )
            {
                var MouseEvent = new CMouseEventHandler();

                MouseEvent.ClickCount = 1;
                MouseEvent.Type = g_mouse_event_type_down;

                this.CurPage++;

                // TODO: переделать данную проверку
                if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    this.CurPage = this.DrawingDocument.m_lPagesCount - 1;

                this.Selection_SetStart( 0, 0, MouseEvent );

                MouseEvent.Type = g_mouse_event_type_up;
                this.Selection_SetEnd( 0, 0, MouseEvent );
            }
            else
            {
                if (docpostype_HdrFtr === this.CurPos.Type)
                {
                    if ( true === this.HdrFtr.GoTo_NextHdrFtr() )
                    {
                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();
                    }
                }
                else
                {
                    if ( this.Pages.length > 0 )
                    {
                        var TempXY = this.Cursor_GetPos();

                        var X = TempXY.X;
                        var Y = TempXY.Y;

                        var Dy = this.DrawingDocument.GetVisibleMMHeight();
                        if ( Y + Dy > this.Get_PageLimits(this.CurPage).YLimit )
                        {
                            this.CurPage++;
                            var PageH = this.Get_PageLimits(this.CurPage).YLimit;
                            Dy -= PageH - Y;
                            Y = 0;
                            while ( Dy > PageH )
                            {
                                Dy -= PageH;
                                this.CurPage++;
                            }

                            if ( this.CurPage >= this.Pages.length )
                            {
                                this.CurPage = this.Pages.length - 1;
                                var LastElement = this.Content[this.Pages[this.CurPage].EndPos];
                                Dy = LastElement.Pages[LastElement.Pages.length - 1].Bounds.Bottom;
                            }
                        }

                        if ( this.CurPage >= this.Pages.length )
                            this.CurPage = this.Pages.length - 1;

                        var StartX = X;
                        var StartY = Y;
                        var CurY   = Y;

                        while ( Math.abs(StartY - Y) < 0.001 )
                        {
                            var bBreak = false;
                            CurY += Dy;

                            var PageH = this.Get_PageLimits(this.CurPage).YLimit;
                            if ( CurY > PageH )
                            {
                                this.CurPage++;
                                CurY = 0;

                                // Эта проверка нужна для выполнения PgDn в конце документа
                                if ( this.CurPage >= this.Pages.length )
                                {
                                    this.CurPage = this.Pages.length - 1;
                                    var LastElement = this.Content[this.Pages[this.CurPage].EndPos];
                                    CurY = LastElement.Pages[LastElement.Pages.length - 1].Bounds.Bottom;
                                }

                                // Поскольку мы перешли на другую страницу, то можно из цикла выходить
                                bBreak = true;
                            }

                            this.Cursor_MoveAt( StartX, CurY, false );
                            this.CurPos.RealX = StartX;
                            this.CurPos.RealY = CurY;

                            TempXY = this.Cursor_GetPos();
                            X = TempXY.X;
                            Y = TempXY.Y;

                            if ( true === bBreak )
                                break;
                        }
                    }
                }
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 35 ) // клавиша End
        {
            if ( true === e.CtrlKey ) // Ctrl + End - переход в конец документа
            {
                this.Cursor_MoveToEndPos( true === e.ShiftKey );
            }
            else // Переходим в конец строки
            {
                this.Cursor_MoveEndOfLine( true === e.ShiftKey );
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 36 ) // клавиша Home
        {
            if ( true === e.CtrlKey ) // Ctrl + Home - переход в начало документа
            {
                this.Cursor_MoveToStartPos( true === e.ShiftKey );
            }
            else // Переходим в начало строки
            {
                this.Cursor_MoveStartOfLine( true === e.ShiftKey );
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 37 ) // Left Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveLeft( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 38 ) // Top Arrow
        {
            // TODO: Реализовать Ctrl + Up/ Ctrl + Shift + Up
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveUp( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 39 ) // Right Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveRight( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 40 ) // Bottom Arrow
        {
            // TODO: Реализовать Ctrl + Down/ Ctrl + Shift + Down
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveDown( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 45 ) // Insert
        {
            if ( true === e.CtrlKey ) // Ctrl + Insert (аналогично Ctrl + C)
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                //не возвращаем true чтобы не было preventDefault
            }
            else if ( true === e.ShiftKey && false === editor.isViewMode ) // Shift + Insert (аналогично Ctrl + V)
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    if (!window.GlobalPasteFlag)
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                        {
                            this.Create_NewHistoryPoint();

                            window.GlobalPasteFlag = true;
                            editor.waitSave = true;
                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                            //не возвращаем true чтобы не было preventDefault
                        }
                        else
                        {
                            if (0 === window.GlobalPasteFlagCounter)
                            {
                                this.Create_NewHistoryPoint();

                                SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                editor.waitSave = true;
                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                //не возвращаем true чтобы не было preventDefault
                            }
                        }
                    }
                }
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 46 && false === editor.isViewMode ) // Delete
        {
            if ( true != e.ShiftKey )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Delete) )
                {
                    this.Create_NewHistoryPoint();
                    this.Remove( 1, true );
                }
                bRetValue = true;
            }
            else // Shift + Delete (аналогично Ctrl + X)
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
                }
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 49 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num1 - применяем стиль Heading1
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 1" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 50 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num2 - применяем стиль Heading2
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 2" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 51 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num3 - применяем стиль Heading3
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 3" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 65 && true === e.CtrlKey ) // Ctrl + A - выделяем все
        {
            this.Select_All();
            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 66 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + B - делаем текст жирным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Bold : TextPr.Bold === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 67 && true === e.CtrlKey ) // Ctrl + C + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + C - копирование форматирования текста
            {
                this.Document_Format_Copy();
                bRetValue = true;
            }
            else // Ctrl + C - copy
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 69 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + E + ...
        {
            if ( true !== e.AltKey ) // Ctrl + E - переключение прилегания параграфа между center и left
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                    {
                        this.Create_NewHistoryPoint();
                        this.Set_ParagraphAlign( ParaPr.Jc === align_Center ? align_Left : align_Center );
                        this.Document_UpdateInterfaceState();
                    }
                    bRetValue = true;
                }
            }
            else // Ctrl + Alt + E - добавляем знак евро €
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();

                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.TargetShow();
                    this.Paragraph_Add(new ParaText("€"));
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 73 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + I - делаем текст наклонным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Italic : TextPr.Italic === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 74 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + J переключение прилегания параграфа между justify и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Justify ? align_Left : align_Justify );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 75 && false === editor.isViewMode && true === e.CtrlKey && false === e.ShiftKey ) // Ctrl + K - добавление гиперссылки
        {
            if ( true === this.Hyperlink_CanAdd(false) )
                editor.sync_DialogAddHyperlink();

            bRetValue = true;
        }
        else if ( e.KeyCode == 76 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + L + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + L - добавляем список к данному параграфу
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphNumbering( { Type : 0, SubType : 1 } );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
            else // Ctrl + L - переключение прилегания параграфа между left и justify
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                    {
                        this.Create_NewHistoryPoint();
                        this.Set_ParagraphAlign( ParaPr.Jc === align_Left ? align_Justify : align_Left );
                        this.Document_UpdateInterfaceState();
                    }
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 77 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + M + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + M - уменьшаем левый отступ
                editor.DecreaseIndent();
            else // Ctrl + M - увеличиваем левый отступ
                editor.IncreaseIndent();
            
            bRetValue = true;
        }
        else if ( e.KeyCode == 80 && true === e.CtrlKey ) // Ctrl + P + ...
        {
            if ( true === e.ShiftKey && false === editor.isViewMode ) // Ctrl + Shift + P - добавляем номер страницы в текущую позицию
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaPageNum() );
                }
                bRetValue = true;
            }
            else // Ctrl + P - print
            {
                this.DrawingDocument.m_oWordControl.m_oApi.asc_Print();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 82 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + R - переключение прилегания параграфа между right и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Right ? align_Left : align_Right );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 83 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + S - save
        {
            this.DrawingDocument.m_oWordControl.m_oApi.asc_Save();
            bRetValue = true;
        }
        else if ( e.KeyCode == 85 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + U - делаем текст подчеркнутым
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Underline : TextPr.Underline === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 86 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + V - paste
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                if ( true === e.ShiftKey ) // Ctrl + Shift + V - вставляем по образцу
                {
                    this.Create_NewHistoryPoint();
                    this.Document_Format_Paste();
                    bRetValue = true;
                }
                else // Ctrl + V - paste
                {
                    if (!window.GlobalPasteFlag)
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                        {
                            this.Create_NewHistoryPoint();

                            window.GlobalPasteFlag = true;
                            editor.waitSave = true;
                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                            //не возвращаем true чтобы не было preventDefault
                        }
                        else
                        {
                            if (0 === window.GlobalPasteFlagCounter)
                            {
                                this.Create_NewHistoryPoint();

                                SafariIntervalFocus();
                                window.GlobalPasteFlag = true;
                                editor.waitSave = true;
                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                //не возвращаем true чтобы не было preventDefault
                            }
                        }
                    }
                    else
                    {
                        if (!window.USER_AGENT_SAFARI_MACOS)
                            bRetValue = true;
                    }
                }
            }
        }
		else if ( e.KeyCode == 88 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + X - cut
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
            }
            //не возвращаем true чтобы не было preventDefault
        }
        else if ( e.KeyCode == 89 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Y - Redo
        {
            this.Document_Redo();
            bRetValue = true;
        }
        else if ( e.KeyCode == 90 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Z - Undo
        {
            this.Document_Undo();
            bRetValue = true;
        }
        else if ( e.KeyCode == 93 || 57351 == e.KeyCode /*в Opera такой код*/ ) // контекстное меню
        {
            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum );
            var X_abs = ConvertedPos.X;
            var Y_abs = ConvertedPos.Y;

            editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );

            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 121 && true === e.ShiftKey ) // Shift + F10 - контекстное меню
        {
            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum );
            var X_abs = ConvertedPos.X;
            var Y_abs = ConvertedPos.Y;

            editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );

            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 144 ) // Num Lock
        {
            // Ничего не делаем
            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 145 ) // Scroll Lock
        {
            // Ничего не делаем
            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 187 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Shift + +, Ctrl + = - superscript/subscript
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    if ( true === e.ShiftKey )
                        this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                    else
                        this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 188 && true === e.CtrlKey ) // Ctrl + ,
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 189 && false === editor.isViewMode ) // Клавиша Num-
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();

                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();

                var Item = null;
                if ( true === e.CtrlKey && true === e.ShiftKey )
                {
                    Item = new ParaText(String.fromCharCode(0x2013));
                    Item.Set_SpaceAfter(false);
                }
                else if ( true === e.ShiftKey )
                    Item = new ParaText("_");
                else
                    Item = new ParaText("-");

                this.Paragraph_Add( Item );
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 190 && true === e.CtrlKey ) // Ctrl + .
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 219 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + [
        {
            editor.FontSizeOut();
            this.Document_UpdateInterfaceState();
        }
        else if ( e.KeyCode == 221 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + ]
        {
            editor.FontSizeIn();
            this.Document_UpdateInterfaceState();
        }

        if ( true == bRetValue && true === bUpdateSelection )
            this.Document_UpdateSelectionState();
        
        return bRetValue;
    },

    OnKeyPress : function(e)
    {
        if ( true === editor.isViewMode )
            return false;

        //Ctrl и Atl только для команд, word не водит текста с зажатыми Ctrl или Atl
        //команды полностью обрабатываются в keypress
        if (e.CtrlKey || (e.AltKey && !AscBrowser.isMacOs))
            return false;

        var Code;
        if (null != e.Which)
            Code = e.Which;
        else if (e.KeyCode)
            Code = e.KeyCode;
        else
            Code = 0;//special char

        var bRetValue = false;

        if ( Code > 0x20 )
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();

                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();
                this.Paragraph_Add(new ParaText(String.fromCharCode(Code)));
            }
            bRetValue = true;
        }

        if ( true == bRetValue )
            this.Document_UpdateSelectionState();

        return bRetValue;
    },

    OnMouseDown : function(e, X, Y, PageIndex)
    {
        if ( PageIndex < 0 )
            return;
        
        // Сбрасываем проверку Drag-n-Drop
        this.Selection.DragDrop.Flag = 0;
        this.Selection.DragDrop.Data = null;

        // Сбрасываем текущий элемент в поиске
        if ( this.SearchEngine.Count > 0 )
            this.SearchEngine.Reset_Current();

        // Обработка правой кнопки мыши происходит на событии MouseUp
        if ( g_mouse_button_right === e.Button )
            return;

        // Если мы только что расширяли документ двойным щелчком, то отменяем это действие
        if ( true === this.History.Is_ExtendDocumentToPos() )
            this.Document_Undo();

        // Если мы двигаем границу таблицы, тогда создаем новую точку для отката.
        var Table = this.Is_TableBorder( X, Y, PageIndex );
        if ( null != Table )
        {
            if ( true === editor.isViewMode || true === this.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Element_and_Type, Element : Table, CheckType : changestype_Table_Properties } ) )
                return;

            this.Create_NewHistoryPoint();
        }

        var OldCurPage = this.CurPage;
        this.CurPage = PageIndex;

        if ( true === editor.isStartAddShape && (docpostype_HdrFtr !== this.CurPos.Type || null !== this.HdrFtr.CurHdrFtr) )
        {
            if (docpostype_HdrFtr !== this.CurPos.Type)
            {
                this.CurPos.Type     = docpostype_DrawingObjects;
                this.Selection.Use   = true;
                this.Selection.Start = true;
            }
            else
            {
                this.Selection.Use   = true;
                this.Selection.Start = true;
                
                var CurHdrFtr = this.HdrFtr.CurHdrFtr;
                var DocContent = CurHdrFtr.Content;
                
                DocContent.CurPos.Type     = docpostype_DrawingObjects;
                DocContent.Selection.Use   = true;
                DocContent.Selection.Start = true;                                
            }

            if ( true != this.DrawingObjects.isPolylineAddition() )
                this.DrawingObjects.startAddShape( editor.addShapePreset );
            
            this.DrawingObjects.OnMouseDown(e, X, Y, this.CurPage);
        }
        else
        {
            if ( true === e.ShiftKey &&
                ( (docpostype_DrawingObjects !== this.CurPos.Type && !(docpostype_HdrFtr === this.CurPos.Type && this.HdrFtr.CurHdrFtr && this.HdrFtr.CurHdrFtr.Content.CurPos.Type === docpostype_DrawingObjects))
                    || true === this.DrawingObjects.checkTextObject(X, Y, PageIndex) ) )
            {
                if ( true === this.Is_SelectionUse() )
                {
                    this.Selection.Start = false;
                    this.Selection_SetEnd( X, Y, e );
                    this.Document_UpdateSelectionState();

                    return;
                }
                else
                {
                    var CurPara = this.Get_CurrentParagraph();

                    if ( null !== CurPara )
                    {
                        var MouseEvent = new CMouseEventHandler();

                        MouseEvent.ClickCount = 1;
                        MouseEvent.Type = g_mouse_event_type_down;

                        var OldX = CurPara.CurPos.X;
                        var OldY = CurPara.CurPos.Y;


                        var DrawMatrix = CurPara.Get_ParentTextTransform();
                        if (DrawMatrix)
                        {
                            var _OldX = DrawMatrix.TransformPointX(OldX, OldY);
                            var _OldY = DrawMatrix.TransformPointY(OldX, OldY);

                            OldX = _OldX;
                            OldY = _OldY;
                        }

                        this.CurPage = CurPara.Get_StartPage_Absolute() + CurPara.CurPos.PagesPos;
                        this.Selection_SetStart( OldX, OldY, MouseEvent );

                        this.CurPage = PageIndex;
                        this.Selection_SetEnd( X, Y, e );

                        return;
                    }
                }
            }

            this.Selection_SetStart( X, Y, e );

            if ( e.ClickCount <= 1 )
            {
                this.RecalculateCurPos();
                this.Document_UpdateSelectionState();
            }
        }
    },

    OnMouseUp : function(e, X, Y, PageIndex)
    {
        if ( PageIndex < 0 )
            return;

        if ( 1 === this.Selection.DragDrop.Flag )
        {
            this.Selection.DragDrop.Flag = -1;
            this.Selection_SetStart( this.Selection.DragDrop.Data.X, this.Selection.DragDrop.Data.Y, e );
            this.Selection.DragDrop.Flag = 0;
            this.Selection.DragDrop.Data = null;
        }

        // Если мы нажимали правую кнопку мыши, тогда нам надо сделать
        if ( g_mouse_button_right === e.Button )
        {
            if ( true === this.Selection.Start )
                return;

            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( X, Y, PageIndex );
            var X_abs = ConvertedPos.X;
            var Y_abs = ConvertedPos.Y;

            // Проверим попадание в значок таблицы, если в него попадаем, тогда выделяем таблицу
            if ( true === this.DrawingDocument.IsCursorInTableCur( X, Y, PageIndex ) )
            {
                var Table = this.DrawingDocument.TableOutlineDr.TableOutline.Table;
                Table.Select_All();
                Table.Document_SetThisElementCurrent(false);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );
                return;
            }

            // Сначала проверим попадание в Flow-таблицы и автофигуры
            var pFlowTable = this.DrawingObjects.getTableByXY( X, Y, PageIndex, this );
            var nInDrawing = this.DrawingObjects.isPointInDrawingObjects( X, Y, PageIndex, this );

            if ( docpostype_HdrFtr != this.CurPos.Type && -1 === nInDrawing && null === pFlowTable )
            {
                var PageMetrics = this.Get_PageContentStartPos( this.CurPage, this.Pages[this.CurPage].Pos );
                // Проверяем, не попали ли мы в колонтитул
                if ( Y <= PageMetrics.Y )
                {
                    editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.ChangeHdrFtr, X_abs : X_abs, Y_abs : Y_abs , Header : true, PageNum : PageIndex } );
                    return;
                }
                else if ( Y > PageMetrics.YLimit )
                {
                    editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.ChangeHdrFtr, X_abs : X_abs, Y_abs : Y_abs , Header : false, PageNum : PageIndex } );
                    return;
                }
            }

            // Проверяем попалили мы в селект
            if ( false === this.Selection_Check( X, Y, PageIndex, undefined ) )
            {
                this.CurPage = PageIndex;

                var MouseEvent_new =
                {
                    // TODO : Если в MouseEvent будет использоваться что-то кроме ClickCount, Type и CtrlKey, добавить здесь
                    ClickCount : 1,
                    Type       : g_mouse_event_type_down,
                    CtrlKey    : false,
                    Button     : g_mouse_button_right
                };
                this.Selection_SetStart( X, Y, MouseEvent_new );

                MouseEvent_new.Type = g_mouse_event_type_up;
                this.Selection_SetEnd( X, Y, MouseEvent_new );

                this.Document_UpdateSelectionState();
                this.Document_UpdateRulersState();
                this.Document_UpdateInterfaceState();
            }

            editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );

            return;
        }
        else if ( g_mouse_button_left === e.Button )
        {
            if ( true === this.Comments.Is_Use() )
            {
                var Type = ( docpostype_HdrFtr === this.CurPos.Type ? comment_type_HdrFtr : comment_type_Common );
                // Проверяем не попали ли мы в комментарий
                var Comment = this.Comments.Get_ByXY( PageIndex, X, Y, Type );
                if ( null != Comment )
                {
                    var Comment_PageNum = Comment.m_oStartInfo.PageNum;
                    var Comment_Y       = Comment.m_oStartInfo.Y;
                    var Comment_X       = this.Get_PageLimits(PageIndex).XLimit;                    
                    var Para            = g_oTableId.Get_ById( Comment.StartId );

                    var TextTransform = Para.Get_ParentTextTransform();
                    if (TextTransform)
                    {
                        Comment_Y = TextTransform.TransformPointY( Comment.m_oStartInfo.X, Comment.m_oStartInfo.Y );
                    }
                    
                    var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( Comment_X, Comment_Y, Comment_PageNum );
                    this.Select_Comment( Comment.Get_Id(), false );
                    editor.sync_ShowComment( Comment.Get_Id(), Coords.X, Coords.Y );
                }
                else
                {
                    this.Select_Comment( null, false );
                    editor.sync_HideComment();
                }
            }
        }

        if ( true === this.Selection.Start )
        {
            this.CurPage = PageIndex;
            this.Selection.Start = false;
            this.Selection_SetEnd( X, Y, e );
            this.Document_UpdateSelectionState();

            if ( c_oAscFormatPainterState.kOff !== editor.isPaintFormat )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Document_Format_Paste();
                }
                
                if ( c_oAscFormatPainterState.kOn === editor.isPaintFormat )
                    editor.sync_PaintFormatCallback( c_oAscFormatPainterState.kOff );
            }

            if ( true === editor.isMarkerFormat && true === this.Is_TextSelectionUse() )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    var ParaItem = null;
                    if ( this.HighlightColor != highlight_None )
                    {
                        var TextPr = this.Get_Paragraph_TextPr();
                        if ( "undefined" === typeof( TextPr.HighLight ) || null === TextPr.HighLight || highlight_None === TextPr.HighLight ||
                            this.HighlightColor.r != TextPr.HighLight.r || this.HighlightColor.g != TextPr.HighLight.g || this.HighlightColor.b != TextPr.HighLight.b )
                            ParaItem = new ParaTextPr( { HighLight : this.HighlightColor } );
                        else
                            ParaItem = new ParaTextPr( { HighLight : highlight_None } );
                    }
                    else
                        ParaItem = new ParaTextPr( { HighLight : this.HighlightColor } );

                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( ParaItem );
                    this.Cursor_MoveAt(X, Y, false);
                    this.Document_UpdateSelectionState();

                    editor.sync_MarkerFormatCallback( true );
                }
            }
        }
    },

    OnMouseMove : function(e, X, Y, PageIndex)
    {
        if ( PageIndex < 0 )
            return;

        this.Update_CursorType( X, Y, PageIndex, e );

        if ( 1 === this.Selection.DragDrop.Flag )
        {
            // Если курсор не изменил позицию, тогда ничего не делаем, а если изменил, тогда стартуем Drag-n-Drop
            if ( Math.abs( this.Selection.DragDrop.Data.X - X ) > 0.001 || Math.abs( this.Selection.DragDrop.Data.Y - Y ) > 0.001 )
            {
                this.Selection.DragDrop.Flag = 0;
                this.Selection.DragDrop.Data = null;

                // Вызываем стандартное событие mouseMove, чтобы сбросить раличные подсказки, если они были
                editor.sync_MouseMoveStartCallback();
                editor.sync_MouseMoveCallback(new CMouseMoveData());
                editor.sync_MouseMoveEndCallback();

                this.DrawingDocument.StartTrackText();                
            }

            return;
        }
        
        if ( true === this.Selection.Use && true === this.Selection.Start )
        {
            this.CurPage = PageIndex;
            this.Selection_SetEnd( X, Y, e );
            this.Document_UpdateSelectionState();
        }
    },

    Get_Numbering : function()
    {
        return this.Numbering;
    },

    Internal_GetNumInfo : function(ParaId, NumPr)
    {
        this.NumInfoCounter++;
        var NumInfo = new Array(NumPr.Lvl + 1);
        for ( var Index = 0; Index < NumInfo.length; Index++ )
            NumInfo[Index] = 0;

        // Этот параметр контролирует уровень, начиная с которого делаем рестарт для текущего уровня
        var Restart = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        var AbstractNum = null;
        if ( "undefined" != typeof(this.Numbering) && null != ( AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId) ) )
        {
            for ( var LvlIndex = 0; LvlIndex < 9; LvlIndex++ )
                Restart[LvlIndex] = AbstractNum.Lvl[LvlIndex].Restart;
        }

        var PrevLvl = -1;
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];

            var ItemNumPr = null;
            if ( type_Paragraph == Item.GetType() && undefined != ( ItemNumPr = Item.Numbering_Get() ) && ItemNumPr.NumId == NumPr.NumId && ( undefined === Item.Get_SectionPr() || true !== Item.IsEmpty() ) )
            {
                // Делаем рестарты, если они нужны
                if ( -1 != PrevLvl && PrevLvl < ItemNumPr.Lvl )
                {
                    for ( var Index2 = PrevLvl + 1; Index2 < 9; Index2++ )
                    {
                        if ( 0 != Restart[Index2] && ( -1 == Restart[Index2] || PrevLvl <= (Restart[Index2] - 1 ) ) )
                            NumInfo[Index2] = 0;
                    }
                }

                if ( "undefined" == typeof(NumInfo[ItemNumPr.Lvl]) )
                    NumInfo[ItemNumPr.Lvl] = 0;
                else
                    NumInfo[ItemNumPr.Lvl]++;

                for ( var Index2 = ItemNumPr.Lvl - 1; Index2 >= 0; Index2-- )
                {
                    if ( "undefined" == typeof(NumInfo[Index2]) || 0 == NumInfo[Index2] )
                        NumInfo[Index2] = 1;
                }

                PrevLvl = ItemNumPr.Lvl;
            }

            if ( ParaId == Item.GetId() )
                break;
        }

        return NumInfo;
    },

    Get_Styles : function()
    {
        return this.Styles;
    },

    Get_TableStyleForPara : function()
    {
        return null;
    },


    Get_ShapeStyleForPara: function()
    {
        return null;
    },

    Get_TextBackGroundColor : function()
    {
        return undefined;
    },

    Content_GetPrev : function(Id)
    {
        var Index = this.Internal_Content_Find( Id );
        if ( Index > 0 )
        {
            return this.Content[Index - 1];
        }

        return null;
    },

    Content_GetNext : function(Id)
    {
        var Index = this.Internal_Content_Find( Id );
        if ( -1 != Index && Index < this.Content.length - 1 )
        {
            return this.Content[Index + 1];
        }

        return null;
    },

    Internal_Content_Find : function(Id)
    {
        return 0;

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            if ( this.Content[Index].GetId() === Id )
                return Index;
        }

        return -1;
    },

    Select_DrawingObject : function(Id)
    {
        this.Selection_Remove();

        // Прячем курсор
        this.DrawingDocument.TargetEnd();
        this.DrawingDocument.SetCurrentPage( this.CurPage );

        this.Selection.Start = false;
        this.Selection.Use   = true;
        this.CurPos.Type = docpostype_DrawingObjects;
        this.DrawingObjects.selectById( Id, this.CurPage );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },

    // Получем ближайшую возможную позицию курсора
    Get_NearestPos : function(PageNum, X, Y, bAnchor, Drawing)
    {
        if ( undefined === bAnchor )
            bAnchor = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_NearestPos( PageNum, X, Y, bAnchor, Drawing );

        var bInText      = (null === this.Is_InText(X, Y, PageNum)      ? false : true);
        var nInDrawing   = this.DrawingObjects.isPointInDrawingObjects( X, Y, PageNum, this );

        if ( true != bAnchor )
        {
            // Проверяем попадание в графические объекты
            var NearestPos = this.DrawingObjects.getNearestPos( X, Y, PageNum, Drawing);
            if ( ( nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || ( false === bInText && nInDrawing >= 0 ) ) && null != NearestPos )
                return NearestPos;
        }

        var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageNum);

        // Делаем логику как в ворде
        if ( true === bAnchor && ContentPos > 0 && PageNum > 0 && ContentPos === this.Pages[PageNum].Pos && ContentPos === this.Pages[PageNum - 1].EndPos && this.Pages[PageNum].EndPos > this.Pages[PageNum].Pos && type_Paragraph === this.Content[ContentPos].GetType() && true === this.Content[ContentPos].Is_ContentOnFirstPage() )
            ContentPos++;

        return this.Content[ContentPos].Get_NearestPos( PageNum, X, Y, bAnchor, Drawing );
    },

    Internal_Content_Add : function(Position, NewObject)
    {
        // Position = this.Content.length  допускается
        if ( Position < 0 || Position > this.Content.length )
            return;

        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position];

        if ( "undefined" == typeof(PrevObj) )
            PrevObj = null;

        if ( "undefined" == typeof(NextObj) )
            NextObj = null;

        this.History.Add( this, { Type : historyitem_Document_AddItem, Pos : Position, Item : NewObject } );
        this.Content.splice( Position, 0, NewObject );
        NewObject.Set_Parent( this );
        NewObject.Set_DocumentNext( NextObj );
        NewObject.Set_DocumentPrev( PrevObj );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NewObject );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( NewObject );

        // Обновим информацию о секциях
        this.SectionsInfo.Update_OnAdd( Position, [ NewObject ] );

        // Проверим последний параграф
        this.Check_SectionLastParagraph();

        // Проверим, что последний элемент не таблица
        if ( type_Table == this.Content[this.Content.length - 1].GetType() )
            this.Internal_Content_Add(this.Content.length, new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 ) );

        // Запоминаем, что нам нужно произвести переиндексацию элементов
        this.protected_ReindexContent(Position);
    },

    Internal_Content_Remove : function(Position, Count)
    {
        var ChangePos = -1;

        if ( Position < 0 || Position >= this.Content.length || Count <= 0 )
            return -1;

        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position + Count];

        if ( "undefined" == typeof(PrevObj) )
            PrevObj = null;

        if ( "undefined" == typeof(NextObj) )
            NextObj = null;

        for ( var Index = 0; Index < Count; Index++ )
        {            
            this.Content[Position + Index].PreDelete();
        }

        this.History.Add( this, { Type : historyitem_Document_RemoveItem, Pos : Position, Items : this.Content.slice( Position, Position + Count ) } );
        this.Content.splice( Position, Count );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NextObj );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( PrevObj );

        // Проверим, что последний элемент не таблица
        if ( type_Table == this.Content[this.Content.length - 1].GetType() )
            this.Internal_Content_Add(this.Content.length, new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 ) );

        // Обновим информацию о секциях
        this.SectionsInfo.Update_OnRemove( Position, Count );

        // Проверим последний параграф
        this.Check_SectionLastParagraph();
        
        // Проверим не является ли рамкой последний параграф
        this.Check_FramePrLastParagraph();

        // Запоминаем, что нам нужно произвести переиндексацию элементов
        this.protected_ReindexContent(Position);

        return ChangePos;
    },

    Clear_ContentChanges : function()
    {
        this.m_oContentChanges.Clear();
    },

    Add_ContentChanges : function(Changes)
    {
        this.m_oContentChanges.Add( Changes );
    },

    Refresh_ContentChanges : function()
    {
        this.m_oContentChanges.Refresh();
    },

    // AlignV = 0 - Верх, = 1 - низ
    // AlignH  стандартные значения align_Left, align_Center, align_Right
    Document_AddPageNum : function(AlignV, AlignH)
    {
        if ( AlignV >= 0 )
        {
            var PageIndex = this.CurPage;
            if ( docpostype_HdrFtr === this.CurPos.Type )
                PageIndex = this.HdrFtr.Get_CurPage();

            if ( PageIndex < 0 )
                PageIndex = this.CurPage;

            this.Create_HdrFtrWidthPageNum( PageIndex, AlignV, AlignH );
        }
        else
        {
            this.Paragraph_Add( new ParaPageNum() );
        }

        this.Document_UpdateInterfaceState();
    },
    
    Document_SetHdrFtrFirstPage : function(Value)
    {
        var CurHdrFtr = this.HdrFtr.CurHdrFtr;
        
        if ( null === CurHdrFtr || -1 === CurHdrFtr.RecalcInfo.CurPage )
            return;
        
        var CurPage = CurHdrFtr.RecalcInfo.CurPage;
        var Index = this.Pages[CurPage].Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        
        SectPr.Set_TitlePage(Value);
        
        if ( true === Value )
        {
            // Если мы добавляем разные колонтитулы для первой страницы, а этих колонтитулов нет, тогда создаем их
            var FirstSectPr = this.SectionsInfo.Get_SectPr2(0).SectPr;
            var FirstHeader = FirstSectPr.Get_Header_First();
            var FirstFooter = FirstSectPr.Get_Footer_First();

            if (null === FirstHeader)
            {
                var Header = new CHeaderFooter( this.HdrFtr, this, this.DrawingDocument, hdrftr_Header );
                FirstSectPr.Set_Header_First( Header );
                
                this.HdrFtr.CurHdrFtr = Header;
            }
            else
                this.HdrFtr.CurHdrFtr = FirstHeader;

            if (null === FirstFooter)
            {
                var Footer = new CHeaderFooter( this.HdrFtr, this, this.DrawingDocument, hdrftr_Footer );
                FirstSectPr.Set_Footer_First( Footer );
            }
        }

        this.HdrFtr.CurHdrFtr.Content.Cursor_MoveToStartPos();
        
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    
    Document_SetHdrFtrEvenAndOddHeaders : function(Value)
    {
        this.Set_DocumentEvenAndOddHeaders( Value );
        
        if ( true === Value )
        {
            // Если мы добавляем разные колонтитулы для четных и нечетных страниц, а этих колонтитулов нет, тогда
            // создаем их в самой первой секции            
            var FirstSectPr = this.SectionsInfo.Get_SectPr2(0).SectPr;
            if ( null === FirstSectPr.Get_Header_Even() )
            {
                var Header = new CHeaderFooter( this.HdrFtr, this, this.DrawingDocument, hdrftr_Header );
                FirstSectPr.Set_Header_Even( Header );
            }
            
            if ( null === FirstSectPr.Get_Footer_Even() )
            {
                var Footer = new CHeaderFooter( this.HdrFtr, this, this.DrawingDocument, hdrftr_Footer );
                FirstSectPr.Set_Footer_Even( Footer );
            }

            this.HdrFtr.CurHdrFtr = FirstSectPr.Get_Header_Default();
        }
        else
        {
            var FirstSectPr = this.SectionsInfo.Get_SectPr2(0).SectPr;
            this.HdrFtr.CurHdrFtr = FirstSectPr.Get_Header_Default();
        }


        this.Recalculate();

        if ( null !== this.HdrFtr.CurHdrFtr )
            this.HdrFtr.CurHdrFtr.Content.Cursor_MoveToStartPos();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();        
    },

    Document_SetHdrFtrDistance : function(Value)
    {
        var CurHdrFtr = this.HdrFtr.CurHdrFtr;
        
        if ( null === CurHdrFtr )
            return;

        var CurPage = CurHdrFtr.RecalcInfo.CurPage;
        if ( -1 === CurPage )
            return;
        
        var Index = this.Pages[CurPage].Pos;        
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        
        if ( hdrftr_Header === CurHdrFtr.Type )
            SectPr.Set_PageMargins_Header( Value );
        else
            SectPr.Set_PageMargins_Footer( Value );
                
        this.Recalculate();
        
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },

    Document_SetHdrFtrBounds : function(Y0, Y1)
    {
        var CurHdrFtr = this.HdrFtr.CurHdrFtr;

        if ( null === CurHdrFtr )
            return;
        
        var CurPage = CurHdrFtr.RecalcInfo.CurPage;
        if ( -1 === CurPage )
            return;
        
        var Index = this.Pages[CurPage].Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        var Bounds = CurHdrFtr.Get_Bounds();
        
        if ( hdrftr_Header === CurHdrFtr.Type )
        {
            if ( null !== Y0 )
                SectPr.Set_PageMargins_Header( Y0 );
            
            if ( null !== Y1 )
                SectPr.Set_PageMargins( undefined, Y1, undefined, undefined );
        }
        else
        {
            if ( null !== Y0 )
            {
                var H = Bounds.Bottom - Bounds.Top;
                var _Y1 = Y0 + H;

                SectPr.Set_PageMargins_Footer( SectPr.Get_PageHeight() - _Y1 );
            }
        }
        
        this.Recalculate();
                
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },
    
    Document_SetHdrFtrLink : function(bLinkToPrevious)
    {
        var CurHdrFtr = this.HdrFtr.CurHdrFtr;
        if ( docpostype_HdrFtr !== this.CurPos.Type || null === CurHdrFtr || -1 === CurHdrFtr.RecalcInfo.CurPage )
            return;

        var PageIndex = CurHdrFtr.RecalcInfo.CurPage;
        
        var Index  = this.Pages[PageIndex].Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        
        // У самой первой секции не может быть повторяющихся колонтитулов, поэтому не делаем ничего
        if ( SectPr === this.SectionsInfo.Get_SectPr2(0).SectPr )
            return;

        // Определим тип колонтитула, в котором мы находимся
        var SectionPageInfo = this.Get_SectionPageNumInfo( PageIndex );

        var bFirst  = ( true === SectionPageInfo.bFirst && true === SectPr.Get_TitlePage() ? true : false );
        var bEven   = ( true === SectionPageInfo.bEven  && true === EvenAndOddHeaders      ? true : false );
        var bHeader = ( hdrftr_Header === CurHdrFtr.Type ? true : false );

        var _CurHdrFtr = SectPr.Get_HdrFtr( bHeader, bFirst, bEven );
        
        if ( true === bLinkToPrevious )
        {
            // Если нам надо повторять колонтитул, а он уже изначально повторяющийся, тогда не делаем ничего
            if ( null === _CurHdrFtr )
                return;

            // Очистим селект
            _CurHdrFtr.Selection_Remove();
            
            // Просто удаляем запись о данном колонтитуле в секции
            SectPr.Set_HdrFtr( bHeader, bFirst, bEven, null );
            
            var HdrFtr = this.Get_SectionHdrFtr( PageIndex, bFirst, bEven );
            
            // Заглушка. Вообще такого не должно быть, чтобы был колонтитул не в первой секции, и не было в первой,
            // но, на всякий случай, обработаем такую ситуацию.
            if ( true === bHeader )
            {
                if ( null === HdrFtr.Header )
                    CurHdrFtr = this.Create_SectionHdrFtr( hdrftr_Header, PageIndex );
                else
                    CurHdrFtr = HdrFtr.Header;
            }
            else
            {
                if ( null === HdrFtr.Footer )
                    CurHdrFtr = this.Create_SectionHdrFtr( hdrftr_Footer, PageIndex );
                else
                    CurHdrFtr = HdrFtr.Footer;
            }


            this.HdrFtr.CurHdrFtr = CurHdrFtr;
            this.HdrFtr.CurHdrFtr.Cursor_MoveToStartPos(false);
        }
        else
        {
            // Если данный колонтитул уже не повторяющийся, тогда ничего не делаем
            if ( null !== _CurHdrFtr )
                return;
            
            var NewHdrFtr = CurHdrFtr.Copy();
            SectPr.Set_HdrFtr( bHeader, bFirst, bEven, NewHdrFtr );
            this.HdrFtr.CurHdrFtr = NewHdrFtr;
            this.HdrFtr.CurHdrFtr.Cursor_MoveToStartPos(false);
        }
                
        this.Recalculate();
        
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Document_Format_Copy : function()
    {
        this.CopyTextPr = this.Get_Paragraph_TextPr_Copy();
        this.CopyParaPr = this.Get_Paragraph_ParaPr_Copy();
    },

    Document_End_HdrFtrEditing : function()
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var CurHdrFtr = this.HdrFtr.CurHdrFtr;
            if ( null == CurHdrFtr )
                return;

            CurHdrFtr.Selection_Remove();

            this.CurPos.Type = docpostype_Content;

            if ( hdrftr_Header == CurHdrFtr.Type )
                this.Cursor_MoveAt( 0, 0, false );
            else
                this.Cursor_MoveAt( 0, 100000, false ); // TODO: Переделать здесь по нормальному

            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();

            this.Document_UpdateRulersState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
        }
    },

    Document_Format_Paste : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            this.HdrFtr.Paragraph_Format_Paste( this.CopyTextPr, this.CopyParaPr, false );
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
            this.DrawingObjects.paragraphFormatPaste( this.CopyTextPr, this.CopyParaPr, false );
        else //if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Numbering    : return;
                    case selectionflag_Common:
                    {
                        var Start = this.Selection.StartPos;
                        var End   = this.Selection.EndPos;
                        if ( Start > End )
                        {
                            Start = this.Selection.EndPos;
                            End   = this.Selection.StartPos;
                        }

                        for ( var Pos = Start; Pos <= End; Pos++ )
                        {
                            this.Content[Pos].Paragraph_Format_Paste( this.CopyTextPr, this.CopyParaPr, ( Start === End ? false : true ) );
                        }

                        this.ContentLastChangePos = Math.max( Start - 1, 0 );
                        this.Recalculate();

                        break;
                    }
                }
            }
            else
            {
                this.Content[this.CurPos.ContentPos].Paragraph_Format_Paste( this.CopyTextPr, this.CopyParaPr, true );
                this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                this.Recalculate();
            }
        }

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },

    Is_TableCellContent : function()
    {
        return false;
    },

    Is_TopDocument : function(bReturnTopDocument)
    {
        if ( true === bReturnTopDocument )
            return this;

        return true;
    },

    Is_InTable : function(bReturnTopTable)
    {
        if ( true === bReturnTopTable )
            return null;

        return false;
    },

    Is_DrawingShape : function()
    {
        return false;
    },

    Is_HdrFtr : function(bReturnHdrFtr)
    {
        if ( true === bReturnHdrFtr )
            return null;

        return false;
    },

    Is_SelectionUse : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Is_SelectionUse();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.isSelectionUse();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
                return true;

            return false;
        }
    },

    Is_TextSelectionUse : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Is_TextSelectionUse();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.isTextSelectionUse();
        else //if ( docpostype_Content === this.CurPos.Type )
            return this.Selection.Use;
    },

    Get_CurPosXY : function()
    {
        var TempXY;
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            TempXY = this.HdrFtr.Get_CurPosXY();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            TempXY = this.DrawingObjects.getCurPosXY();
        else // if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( selectionflag_Numbering === this.Selection.Flag )
                    TempXY = { X : 0, Y : 0 };
                else // if ( selectionflag_Common === this.Selection.Flag )
                    TempXY = this.Content[this.Selection.EndPos].Get_CurPosXY();
            }
            else
                TempXY = this.Content[this.CurPos.ContentPos].Get_CurPosXY();
        }

        this.Internal_CheckCurPage();

        return { X : TempXY.X, Y : TempXY.Y, PageNum : this.CurPage };
    },

    // Возвращаем выделенный текст, если в выделении не более 1 параграфа, и там нет картинок, нумерации страниц и т.д.
    Get_SelectedText : function(bClearText)
    {
        if ( "undefined" === typeof(bClearText) )
            bClearText = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_SelectedText(bClearText);
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getSelectedText(bClearText);
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag ) || false === this.Selection.Use ) )
        {
            if ( true === bClearText && this.Selection.StartPos === this.Selection.EndPos )
            {
                var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
                return this.Content[Pos].Get_SelectedText(true);
            }
            else if ( false === bClearText )
            {
                var StartPos = ( true == this.Selection.Use ? Math.min( this.Selection.StartPos, this.Selection.EndPos ) : this.CurPos.ContentPos );
                var EndPos   = ( true == this.Selection.Use ? Math.max( this.Selection.StartPos, this.Selection.EndPos ) : this.CurPos.ContentPos );

                var ResultText = "";

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    ResultText += this.Content[Index].Get_SelectedText(false);
                }

                return ResultText;
            }
        }

        return null;
    },

    // Получаем текущий параграф
    Get_CurrentParagraph : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Get_CurrentParagraph();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getCurrentParagraph();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
                return null;

            if ( this.CurPos.ContentPos < 0 )
                return null;

            if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
            {
                if ( true == this.Selection.Use )
                    return this.Content[this.Selection.StartPos].Get_CurrentParagraph();
                else
                    return this.Content[this.CurPos.ContentPos].Get_CurrentParagraph();
            }
            else if ( type_Paragraph == this.Content[this.CurPos.ContentPos].GetType() )
                return this.Content[this.CurPos.ContentPos];

            return null;
        }
    },

    Get_SelectedElementsInfo : function()
    {
        var Info = new CSelectedElementsInfo();

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Get_SelectedElementsInfo( Info );
        }
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            this.DrawingObjects.getSelectedElementsInfo( Info );
        }
        else if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( selectionflag_Numbering === this.Selection.Flag )
                {
                    // Текстовые настройки применяем к конкретной нумерации
                    if ( !(null == this.Selection.Data || this.Selection.Data.length <= 0) )
                    {
                        var CurPara = this.Content[this.Selection.Data[0]];
                        for ( var Index = 0; Index < this.Selection.Data.length; Index++ )
                        {
                            if ( this.CurPos.ContentPos === this.Selection.Data[Index] )
                                CurPara = this.Content[this.Selection.Data[Index]];
                        }

                        CurPara.Get_SelectedElementsInfo(Info);
                    }
                }
                else
                {
                    if ( this.Selection.StartPos != this.Selection.EndPos )
                        Info.Set_MixedSelection();
                    else
                    {
                        this.Content[this.Selection.StartPos].Get_SelectedElementsInfo(Info);
                    }
                }
            }
            else
            {
                this.Content[this.CurPos.ContentPos].Get_SelectedElementsInfo(Info);
            }
        }

        return Info;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
    Table_AddRow : function(bBefore)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_AddRow(bBefore);
            this.Recalculate();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableAddRow(bBefore);
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Row_Add( bBefore );

            if ( false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse() )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = Pos;
                this.Selection.EndPos   = Pos;
            }

            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_AddCol : function(bBefore)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_AddCol(bBefore);
            this.Recalculate();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableAddCol(bBefore);
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Col_Add( bBefore );

            if ( false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse() )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = Pos;
                this.Selection.EndPos   = Pos;
            }

            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_RemoveRow : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_RemoveRow();
            this.Recalculate();
        }
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            this.DrawingObjects.tableRemoveRow();
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            if ( false === this.Content[Pos].Row_Remove() )
                this.Table_RemoveTable();
            else
            {
                this.ContentLastChangePos = Pos;
                this.Recalculate();
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_RemoveCol : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_RemoveCol();
            this.Recalculate();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableRemoveCol();
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            if ( false === this.Content[Pos].Col_Remove() )
                this.Table_RemoveTable();
            else
            {
                this.ContentLastChangePos = Pos;
                this.Recalculate();
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_MergeCells : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_MergeCells();
            this.Recalculate();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableMergeCells();
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Cell_Merge();
            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_SplitCell : function( Cols, Rows )
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_SplitCell(Cols, Rows);
            this.Recalculate();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableSplitCell(Cols, Rows);
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Cell_Split(Rows, Cols);
            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_RemoveTable : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_RemoveTable();
            this.Recalculate();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.tableRemoveTable();
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            var Table = this.Content[Pos];
            if ( true === Table.Is_InnerTable() )
                Table.Remove_InnerTable();
            else
            {
                this.Selection_Remove();
                Table.PreDelete();
                this.Internal_Content_Remove( Pos, 1 );

                if ( Pos >= this.Content.length - 1 )
                    Pos--;

                if ( Pos < 0 )
                    Pos = 0;

                this.CurPos.Type = docpostype_Content;
                this.CurPos.ContentPos = Pos;
                this.Content[Pos].Cursor_MoveToStartPos();

                this.ContentLastChangePos = Pos;
                this.Recalculate();
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Table_Select : function(Type)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_Select(Type);
        }
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            this.DrawingObjects.tableSelect( Type );
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Table_Select(Type);
            if ( false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse() )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = Pos;
                this.Selection.EndPos   = Pos;
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        //this.Document_UpdateRulersState();
    },

    Table_CheckMerge : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Table_CheckMerge();
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            return this.DrawingObjects.tableCheckMerge();
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            return this.Content[Pos].Check_Merge();
        }

        return false;
    },

    Table_CheckSplit : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Table_CheckSplit();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.tableCheckSplit();
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            return this.Content[Pos].Check_Split();
        }

        return false;
    },

    Check_TableCoincidence : function(Table)
    {
        return false;
    },
//-----------------------------------------------------------------------------------
// Дополнительные функции
//-----------------------------------------------------------------------------------
    Document_CreateFontMap : function()
    {
        var StartTime = new Date().getTime();
        
        var FontMap = {};
        this.SectionsInfo.Document_CreateFontMap(FontMap);

        var CurPage = 0;
        this.DrawingObjects.documentCreateFontMap( CurPage, FontMap );

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Document_CreateFontMap(FontMap);

            if ( Element.Pages.length > 1 )
            {
                for ( var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++ )
                    this.DrawingObjects.documentCreateFontMap( ++CurPage, FontMap );
            }
        }
        checkThemeFonts(FontMap, this.theme.themeElements.fontScheme);
        return FontMap;
    },

    Document_CreateFontCharMap : function(FontCharMap)
    {
        this.SectionsInfo.Document_CreateFontCharMap( FontCharMap );
        this.DrawingObjects.documentCreateFontCharMap( FontCharMap );

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Document_CreateFontCharMap( FontCharMap );
        }
    },

    Document_Get_AllFontNames : function()
    {
        var AllFonts = {};

        this.SectionsInfo.Document_Get_AllFontNames( AllFonts );
        this.Numbering.Document_Get_AllFontNames( AllFonts );
        this.Styles.Document_Get_AllFontNames( AllFonts );
        this.theme.Document_Get_AllFontNames( AllFonts );

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Document_Get_AllFontNames( AllFonts );
        }
        checkThemeFonts(AllFonts, this.theme.themeElements.fontScheme);
        return AllFonts;
    },

    // Обновляем текущее состояние (определяем где мы находимся, картинка/параграф/таблица/колонтитул)
    Document_UpdateInterfaceState : function()
    {
        if (true === this.TurnOffInterfaceEvents)
            return;

        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;
        
        // Удаляем весь список
        editor.sync_BeginCatchSelectedElements();

        // Уберем из интерфейса записи о том где мы находимся (параграф, таблица, картинка или колонтитул)
        editor.ClearPropObjCallback();

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.Interface_Update_HdrFtrPr();
            this.HdrFtr.Document_UpdateInterfaceState();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var drawin_objects = this.DrawingObjects;
            if(drawin_objects.selection.textSelection
                || drawin_objects.selection.groupSelection && drawin_objects.selection.groupSelection.selection.textSelection
                || drawin_objects.selection.chartSelection && drawin_objects.selection.chartSelection.selection.textSelection)
            {
                this.Interface_Update_DrawingPr();
                this.DrawingObjects.documentUpdateInterfaceState();
            }
            else
            {
                this.DrawingObjects.documentUpdateInterfaceState();
                this.Interface_Update_DrawingPr();
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            this.Interface_Update_TablePr();
            if ( true == this.Selection.Use )
                this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
            else
                this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
        }
        else
        {
            this.Interface_Update_ParaPr();
            this.Interface_Update_TextPr();

            // Если у нас в выделении находится 1 параграф, или курсор находится в параграфе
            if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Paragraph == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Paragraph == this.Content[this.CurPos.ContentPos].GetType() ) ) )
            {
                if ( true == this.Selection.Use )
                    this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
                else
                    this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
            }
        }

        // Сообщаем, что список составлен
        editor.sync_EndCatchSelectedElements();

        this.Document_UpdateUndoRedoState();
        this.Document_UpdateCanAddHyperlinkState();
        this.Document_UpdateSectionPr();
    },
    // Обновляем линейки
    Document_UpdateRulersState : function()
    {
        if (true === this.TurnOffInterfaceEvents)
            return;

        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Document_UpdateRulersState(this.CurPage);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            // Вызываем данную функцию, чтобы убрать рамку буквицы
            this.DrawingDocument.Set_RulerState_Paragraph( null );
            return this.DrawingObjects.documentUpdateRulersState();
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( this.Selection.StartPos == this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType() )
                    this.Content[this.Selection.StartPos].Document_UpdateRulersState(this.CurPage);
                else
                {
                    var StartPos = ( this.Selection.EndPos <= this.Selection.StartPos ? this.Selection.EndPos   : this.Selection.StartPos );
                    var EndPos   = ( this.Selection.EndPos <= this.Selection.StartPos ? this.Selection.StartPos : this.Selection.EndPos );

                    var FramePr = undefined;

                    for ( var Pos = StartPos; Pos <= EndPos; Pos++ )
                    {
                        var Element = this.Content[Pos];
                        if ( type_Paragraph != Element.GetType() )
                        {
                            FramePr = undefined;
                            break;
                        }
                        else
                        {
                            var TempFramePr = Element.Get_FramePr();
                            if ( undefined === FramePr )
                            {
                                if ( undefined === TempFramePr )
                                    break;

                                FramePr = TempFramePr;
                            }
                            else if ( undefined === TempFramePr || false === FramePr.Compare(TempFramePr) )
                            {
                                FramePr = undefined;
                                break;
                            }
                        }
                    }

                    if ( undefined === FramePr )
                        this.Document_UpdateRulersStateBySection();
                    else
                        this.Content[StartPos].Document_UpdateRulersState();
                }
            }
            else
            {
                this.Internal_CheckCurPage();

                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Table === Item.GetType() )
                    Item.Document_UpdateRulersState(this.CurPage);
                else
                    Item.Document_UpdateRulersState();
            }
        }
    },
    Document_UpdateRulersStateBySection : function()
    {
        // В данной функции мы уже точно знаем, что нам секцию нужно выбирать исходя из текущего параграфа
        var CurPos = ( this.Selection.Use === true ? this.Selection.EndPos : this.CurPos.ContentPos );

        var SectPr = this.SectionsInfo.Get_SectPr(CurPos).SectPr;

        var L = SectPr.Get_PageMargin_Left();
        var T = SectPr.Get_PageMargin_Top();
        var R = SectPr.Get_PageWidth() - SectPr.Get_PageMargin_Right();
        var B = SectPr.Get_PageHeight() - SectPr.Get_PageMargin_Bottom();

        this.DrawingDocument.Set_RulerState_Paragraph( { L : L, T : T, R : R, B : B }, true );
    },
    // Обновляем линейки
    Document_UpdateSelectionState : function()
    {
        if (true === this.TurnOffInterfaceEvents)
            return;

        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;

        this.DrawingDocument.UpdateTargetTransform(null);
        
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Document_UpdateSelectionState();
            this.private_UpdateTracks(this.Is_SelectionUse(), this.Selection_IsEmpty());
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.documentUpdateSelectionState();
            this.private_UpdateTracks(this.Is_SelectionUse(), this.Selection_IsEmpty());
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                // Выделение нумерации
                if ( selectionflag_Numbering == this.Selection.Flag )
                {
                    this.DrawingDocument.TargetEnd();
                    this.DrawingDocument.SelectEnabled(true);
                    this.DrawingDocument.SelectShow();
                }
                // Обрабатываем движение границы у таблиц
                else if ( true === this.Selection_Is_TableBorderMove() )
                {
                    // Убираем курсор, если он был
                    this.DrawingDocument.TargetEnd();
                    this.DrawingDocument.SetCurrentPage( this.CurPage );
                }
                else
                {
                    if ( false === this.Selection_IsEmpty() )
                    {
                        if ( true !== this.Selection.Start )
                        {
                            this.Internal_CheckCurPage();
                            this.RecalculateCurPos();
                        }
                        this.private_UpdateTracks(true, false);

                        this.DrawingDocument.TargetEnd();
                        this.DrawingDocument.SelectEnabled(true);
                        this.DrawingDocument.SelectShow();
                    }
                    else
                    {
                        if ( true !== this.Selection.Start )
                        {
                            this.Selection_Remove();
                        }
                        
                        this.Internal_CheckCurPage();
                        this.RecalculateCurPos();
                        this.private_UpdateTracks(true, true);

                        this.DrawingDocument.SelectEnabled(false);
                        this.DrawingDocument.TargetStart();
                        this.DrawingDocument.TargetShow();
                    }
                }
            }
            else
            {
                this.Selection_Remove();
                this.Internal_CheckCurPage();
                this.RecalculateCurPos();
                this.private_UpdateTracks(false, false);

                this.DrawingDocument.SelectEnabled(false);
                this.DrawingDocument.TargetShow();
            }
        }
        
        // Обновим состояние кнопок Copy/Cut
        this.Document_UpdateCopyCutState();
    },

    private_UpdateTracks : function(bSelection, bEmptySelection)
    {
        // Обновляем трэк формул
        var oSelectedInfo = this.Get_SelectedElementsInfo();
        var Math = oSelectedInfo.Get_Math();
        if (null !== Math)
        {
            var Bounds = Math.Get_Bounds();
            this.DrawingDocument.Update_MathTrack(true, (false === bSelection || true === bEmptySelection ? true : false), Math, Bounds.X, Bounds.Y, Bounds.W, Bounds.H, Bounds.Page);
        }
        else
            this.DrawingDocument.Update_MathTrack(false);
    },

    Document_UpdateUndoRedoState : function()
    {
        if (true === this.TurnOffInterfaceEvents)
            return;

        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;
       
        // TODO: Возможно стоит перенсти эту проверку в класс CHistory и присылать
        //       данные события при изменении значения History.Index

        // Проверяем состояние Undo/Redo
        editor.sync_CanUndoCallback( this.History.Can_Undo() );
        editor.sync_CanRedoCallback( this.History.Can_Redo() );

        if ( true === History.Have_Changes() )
        {
            editor.isDocumentModify = true;

            // дублирование евента. когда будет undo-redo - тогда
            // эти евенты начнут отличаться
            editor.asc_fireCallback("asc_onDocumentModifiedChanged");
			editor._onUpdateDocumentCanSave();
        }
        else
        {
            editor.SetUnchangedDocument();
        }
    },
    
    Document_UpdateCopyCutState : function()
    {
        if (true === this.TurnOffInterfaceEvents)
            return;

        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;

        // Во время работы селекта не обновляем состояние
        if ( true === this.Selection.Start )
            return;

        editor.sync_CanCopyCutCallback(this.Can_CopyCut());
    },

    Document_UpdateCanAddHyperlinkState : function()
    {
        if (true === this.TurnOffInterfaceEvents)
            return;

        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;

        // Проверяем можно ли добавить гиперссылку
        editor.sync_CanAddHyperlinkCallback( this.Hyperlink_CanAdd(false) );
    },

    Document_UpdateSectionPr : function()
    {
        if (true === this.TurnOffInterfaceEvents)
            return;

        if ( true === CollaborativeEditing.m_bGlobalLockSelection )
            return;

        // Обновляем ориентацию страницы
        editor.sync_PageOrientCallback( this.Get_DocumentOrientation() );

        // Обновляем размер страницы
        var PageSize = this.Get_DocumentPageSize();
        editor.sync_DocSizeCallback( PageSize.W, PageSize.H );
    },

    /**
     * Отключаем отсылку сообщений в интерфейс.
     */
    TurnOff_InterfaceEvents : function()
    {
        this.TurnOffInterfaceEvents = true;
    },

    /**
     * Включаем отсылку сообщений в интерфейс.
     *
     * @param {bool} bUpdate Обновлять ли интерфейс
     */
    TurnOn_InterfaceEvents : function(bUpdate)
    {
        this.TurnOffInterfaceEvents = false;

        if (true === bUpdate)
        {
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            this.Document_UpdateRulersState();
        }
    },

    Can_CopyCut : function()
    {
        var bCanCopyCut = false;

        var LogicDocument  = null;
        var DrawingObjects = null;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var CurHdrFtr = this.HdrFtr.CurHdrFtr;
            if ( null !== CurHdrFtr )
            {
                if ( docpostype_DrawingObjects === CurHdrFtr.Content.CurPos.Type )
                    DrawingObjects = this.DrawingObjects;
                else
                    LogicDocument = CurHdrFtr.Content;
            }
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            DrawingObjects = this.DrawingObjects;
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            LogicDocument = this;
        }

        if ( null !== DrawingObjects )
        {
            if ( true === DrawingObjects.isSelectedText() )
                LogicDocument = DrawingObjects.getTargetDocContent();
            else
                bCanCopyCut = true;
        }

        if ( null !== LogicDocument )
            bCanCopyCut = LogicDocument.Is_SelectionUse();

        return bCanCopyCut;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//-----------------------------------------------------------------------------------
    Get_StartPage_Absolute : function()
    {
        return 0;
    },

    Get_StartPage_Relative : function()
    {
        return 0;
    },

    Set_CurPage : function(PageNum)
    {
        this.CurPage = Math.min( this.Pages.length - 1, Math.max( 0, PageNum ) );
    },

    Get_CurPage : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_CurPage();

        return this.CurPage;
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Create_NewHistoryPoint : function()
    {
        this.History.Create_NewPoint();
    },

    Document_Undo : function()
    {
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return;

        this.DrawingDocument.EndTrackTable( null, true );
        this.DrawingObjects.TurnOffCheckChartSelection();

        this.History.Undo();
        this.DrawingObjects.TurnOnCheckChartSelection();
        this.Recalculate( false, false, this.History.RecalculateData );

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Document_Redo : function()
    {
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return;

        this.DrawingDocument.EndTrackTable( null, true );
        this.DrawingObjects.TurnOffCheckChartSelection();

        this.History.Redo();
        this.DrawingObjects.TurnOnCheckChartSelection();
        this.Recalculate( false, false, this.History.RecalculateData );

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Get_SelectionState : function()
    {
        var DocState = {};
        DocState.CurPos =
        {
            X          : this.CurPos.X,
            Y          : this.CurPos.Y,
            ContentPos : this.CurPos.ContentPos,
            RealX      : this.CurPos.RealX,
            RealY      : this.CurPos.RealY,
            Type       : this.CurPos.Type
        };

        DocState.Selection =
        {

            Start    : this.Selection.Start,
            Use      : this.Selection.Use,
            StartPos : this.Selection.StartPos,
            EndPos   : this.Selection.EndPos,
            Flag     : this.Selection.Flag,
            Data     : this.Selection.Data
        };

        DocState.CurPage    = this.CurPage;
        DocState.CurComment = this.Comments.Get_CurrentId();

        var State = null;
        if ( true === editor.isStartAddShape && docpostype_DrawingObjects === this.CurPos.Type )
        {
            DocState.CurPos.Type     = docpostype_Content;
            DocState.Selection.Start = false;
            DocState.Selection.Use   = false;

            this.Content[DocState.CurPos.ContentPos].Selection_Remove();
            State = this.Content[this.CurPos.ContentPos].Get_SelectionState();
        }
        else
        {
            // Работаем с колонтитулом
            if ( docpostype_HdrFtr === this.CurPos.Type )
                State = this.HdrFtr.Get_SelectionState();
            else if ( docpostype_DrawingObjects == this.CurPos.Type )
                State = this.DrawingObjects.getSelectionState();
            else //if ( docpostype_Content === this.CurPos.Type )
            {
                if ( true === this.Selection.Use )
                {
                    // Выделение нумерации
                    if ( selectionflag_Numbering == this.Selection.Flag )
                        State = [];
                    else
                    {
                        var StartPos = this.Selection.StartPos;
                        var EndPos   = this.Selection.EndPos;
                        if ( StartPos > EndPos )
                        {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos   = Temp;
                        }

                        State = [];

                        var TempState = [];
                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            TempState.push( this.Content[Index].Get_SelectionState() );
                        }

                        State.push( TempState );
                    }
                }
                else
                    State = this.Content[this.CurPos.ContentPos].Get_SelectionState();
            }
        }

        State.push( DocState );

        return State;
    },

    Set_SelectionState : function(State)
    {
        if ( docpostype_DrawingObjects === this.CurPos.Type )
            this.DrawingObjects.resetSelection();

        if ( State.length <= 0 )
            return;

        var DocState = State[State.length - 1];

        this.CurPos.X          = DocState.CurPos.X;
        this.CurPos.Y          = DocState.CurPos.Y;
        this.CurPos.ContentPos = DocState.CurPos.ContentPos;
        this.CurPos.RealX      = DocState.CurPos.RealX;
        this.CurPos.RealY      = DocState.CurPos.RealY;
        this.CurPos.Type       = DocState.CurPos.Type;
        
        this.Selection.Start    = DocState.Selection.Start;
        this.Selection.Use      = DocState.Selection.Use;
        this.Selection.StartPos = DocState.Selection.StartPos;
        this.Selection.EndPos   = DocState.Selection.EndPos;
        this.Selection.Flag     = DocState.Selection.Flag;
        this.Selection.Data     = DocState.Selection.Data;
        
        this.Selection.DragDrop.Flag = 0;
        this.Selection.DragDrop.Data = null;

        this.CurPage = DocState.CurPage;
        this.Comments.Set_Current(DocState.CurComment);

        var StateIndex = State.length - 2;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            this.HdrFtr.Set_SelectionState( State, StateIndex );
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            this.DrawingObjects.setSelectionState( State, StateIndex );
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                // Выделение нумерации
                if ( selectionflag_Numbering == this.Selection.Flag )
                {
                    // Ничего не делаем
                }
                else
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if ( StartPos > EndPos )
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    var CurState = State[StateIndex];
                    for ( var Index = StartPos; Index <= EndPos; Index++ )
                    {
                        this.Content[Index].Set_SelectionState( CurState[Index - StartPos], CurState[Index - StartPos].length - 1 );
                    }
                }
            }
            else
                this.Content[this.CurPos.ContentPos].Set_SelectionState( State, StateIndex );
        }
    },

    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case  historyitem_Document_AddItem:
            {
                this.Content.splice( Data.Pos, 1 );

                // Обновим информацию о секциях
                this.SectionsInfo.Update_OnRemove( Data.Pos, 1 );

                break;
            }

            case historyitem_Document_RemoveItem:
            {
                var Pos = Data.Pos;

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                // Обновим информацию о секциях
                this.SectionsInfo.Update_OnAdd( Data.Pos, Data.Items );

                break;
            }

            case historyitem_Document_DefaultTab:
            {
                Default_Tab_Stop = Data.Old;

                break;
            }
                
            case historyitem_Document_EvenAndOddHeaders:
            {
                EvenAndOddHeaders = Data.Old;
                break;
            }
                
            case historyitem_Document_DefaultLanguage:
            {
                this.Styles.Default.TextPr.Lang.Val = Data.Old;
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case  historyitem_Document_AddItem:
            {
                var Pos = Data.Pos;
                this.Content.splice( Pos, 0, Data.Item );

                // Обновим информацию о секциях
                this.SectionsInfo.Update_OnAdd( Data.Pos, [ Data.Item ] );

                break;
            }

            case historyitem_Document_RemoveItem:
            {
                this.Content.splice( Data.Pos, Data.Items.length );

                // Обновим информацию о секциях
                this.SectionsInfo.Update_OnRemove( Data.Pos, Data.Items.length );

                break;
            }

            case historyitem_Document_DefaultTab:
            {
                Default_Tab_Stop = Data.New;

                break;
            }

            case historyitem_Document_EvenAndOddHeaders:
            {
                EvenAndOddHeaders = Data.New;
                break;
            }

            case historyitem_Document_DefaultLanguage:
            {
                this.Styles.Default.TextPr.Lang.Val = Data.New;
                break;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function(Index)
    {
        return { Type : historyrecalctype_Inline, Data : Index };
    },

    Refresh_RecalcData : function(Data)
    {
        var ChangePos = -1;
        var bNeedRecalcHdrFtr = false;

        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Document_AddItem:
            case historyitem_Document_RemoveItem:
            {
                ChangePos = Data.Pos;
                break;
            }

            case historyitem_Document_DefaultTab:
            case historyitem_Document_EvenAndOddHeaders:
            {
                ChangePos = 0;
                break;
            }
        }

        if ( -1 != ChangePos )
            this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : { Pos : ChangePos, PageNum : 0 } } );
    },

    Refresh_RecalcData2 : function(Index, Page_rel)
    {
        this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : { Pos : Index, PageNum : Page_rel } } );
    },
//-----------------------------------------------------------------------------------
// Функции для работы со статистикой
//-----------------------------------------------------------------------------------
    Statistics_Start : function()
    {
        this.Statistics.Start();
        this.Statistics.Add_Page();
    },

    Statistics_OnPage : function()
    {
        var Count = this.Content.length;
        var CurPage = this.Statistics.CurPage;

        var bFlowObjChecked = false;

        var Index = 0;
        for ( Index = this.Statistics.StartPos; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.DocumentStatistics( this.Statistics );

            if ( false === bFlowObjChecked )
            {
                this.DrawingObjects.documentStatistics( CurPage, this.Statistics );
                bFlowObjChecked = true;
            }

            var bNewPage = false;
            if ( Element.Pages.length > 1 )
            {
                for ( var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++ )
                    this.DrawingObjects.documentStatistics( CurPage + TempIndex, this.Statistics );

                CurPage += Element.Pages.length - 1;
                this.Statistics.Add_Page( Element.Pages.length - 1 );
                bNewPage = true;
            }

            if ( bNewPage )
            {
                this.Statistics.Next( Index + 1, CurPage );
                break;
            }
        }

        if ( Index >= Count )
        {
            this.Statistics_Stop();
        }
    },

    Statistics_Stop : function()
    {
        this.Statistics.Stop();
    },
//-----------------------------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------------------------
    Hyperlink_Add : function(HyperProps)
    {
        // Проверку, возможно ли добавить гиперссылку, должны были вызвать до этой функции
        if ( null != HyperProps.Text && "" != HyperProps.Text && true === this.Is_SelectionUse() )
            this.Remove();

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Hyperlink_Add( HyperProps );
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.hyperlinkAdd( HyperProps );
        }
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            this.Content[Pos].Hyperlink_Add( HyperProps );

            this.ContentLastChangePos = Pos;
            this.Recalculate(true);
        }

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },

    Hyperlink_Modify : function(HyperProps)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Hyperlink_Modify( HyperProps );
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.hyperlinkModify( HyperProps );
        }
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            if ( true === this.Content[Pos].Hyperlink_Modify( HyperProps ) )
            {
                this.ContentLastChangePos = Pos;
                this.Recalculate(true);
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Hyperlink_Remove : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Hyperlink_Remove();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.hyperlinkRemove();
        }
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            this.Content[Pos].Hyperlink_Remove();
        }
       
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },

    Hyperlink_CanAdd : function(bCheckInHyperlink)
    {
        // Проверим можно ли добавлять гиперссылку
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Hyperlink_CanAdd(bCheckInHyperlink);
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.hyperlinkCanAdd(bCheckInHyperlink);
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch( this.Selection.Flag )
                {
                    case selectionflag_Numbering:     return false;
                    case selectionflag_Common:
                    {
                        if ( this.Selection.StartPos != this.Selection.EndPos )
                            return false;

                        return this.Content[this.Selection.StartPos].Hyperlink_CanAdd(bCheckInHyperlink);
                    }
                }
            }
            else
                return this.Content[this.CurPos.ContentPos].Hyperlink_CanAdd(bCheckInHyperlink);
        }

        return false;
    },

    // Проверяем, находимся ли мы в гиперссылке сейчас
    Hyperlink_Check : function(bCheckEnd)
    {
        if ( "undefined" === typeof(bCheckEnd) )
            bCheckEnd = true;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Hyperlink_Check(bCheckEnd);
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.hyperlinkCheck(bCheckEnd);
        else //if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Numbering: return null;
                    case selectionflag_Common:
                    {
                        if ( this.Selection.StartPos != this.Selection.EndPos )
                            return null;

                        return this.Content[this.Selection.StartPos].Hyperlink_Check(bCheckEnd);
                    }
                }
            }
            else
                return this.Content[this.CurPos.ContentPos].Hyperlink_Check(bCheckEnd);
        }

        return null;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------

    Document_Is_SelectionLocked : function(CheckType, AdditionalData)
    {
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return true;

        CollaborativeEditing.OnStart_CheckLock();

        if ( changestype_None != CheckType )
        {
            if ( changestype_Document_SectPr === CheckType )
            {
                this.Lock.Check( this.Get_Id() );
            }
            else if(changestype_ColorScheme === CheckType )
            {
                this.DrawingObjects.Lock.Check( this.DrawingObjects.Get_Id());
            }
            else
            {
                if ( docpostype_HdrFtr === this.CurPos.Type )
                {
                    this.HdrFtr.Document_Is_SelectionLocked(CheckType);
                }
                else if ( docpostype_DrawingObjects == this.CurPos.Type )
                {
                    this.DrawingObjects.documentIsSelectionLocked(CheckType);
                }
                else if ( docpostype_Content == this.CurPos.Type )
                {
                    switch ( this.Selection.Flag )
                    {
                        case selectionflag_Common :
                        {
                            if ( true === this.Selection.Use )
                            {
                                var StartPos = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.EndPos : this.Selection.StartPos );
                                var EndPos   = ( this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );

                                if ( StartPos != EndPos && changestype_Delete === CheckType )
                                    CheckType = changestype_Remove;

                                for ( var Index = StartPos; Index <= EndPos; Index++ )
                                    this.Content[Index].Document_Is_SelectionLocked(CheckType);
                            }
                            else
                            {
                                var CurElement = this.Content[this.CurPos.ContentPos];

                                if ( changestype_Document_Content_Add === CheckType && type_Paragraph === CurElement.GetType() && true === CurElement.Cursor_IsEnd() )
                                    CollaborativeEditing.Add_CheckLock(false);
                                else
                                    this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);
                            }

                            break;
                        }
                        case selectionflag_Numbering:
                        {
                            var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                            if ( null != NumPr )
                            {
                                var AbstrNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                                AbstrNum.Document_Is_SelectionLocked(CheckType);
                            }
                            break;
                        }
                    }
                }
            }
        }

        if ( "undefined" != typeof(AdditionalData) && null != AdditionalData )
        {
            if ( changestype_2_InlineObjectMove === AdditionalData.Type )
            {
                var PageNum = AdditionalData.PageNum;
                var X       = AdditionalData.X;
                var Y       = AdditionalData.Y;

                var NearestPara = this.Get_NearestPos(PageNum, X, Y).Paragraph;
                NearestPara.Document_Is_SelectionLocked(changestype_Document_Content);
            }
            else if ( changestype_2_HdrFtr === AdditionalData.Type )
            {
                this.HdrFtr.Document_Is_SelectionLocked(changestype_HdrFtr);
            }
            else if ( changestype_2_Comment === AdditionalData.Type )
            {
                this.Comments.Document_Is_SelectionLocked( AdditionalData.Id );
            }
            else if ( changestype_2_Element_and_Type === AdditionalData.Type )
            {
                AdditionalData.Element.Document_Is_SelectionLocked( AdditionalData.CheckType, false );
            }
            else if ( changestype_2_ElementsArray_and_Type === AdditionalData.Type )
            {
                var Count = AdditionalData.Elements.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    AdditionalData.Elements[Index].Document_Is_SelectionLocked( AdditionalData.CheckType, false );
                }
            }
        }

        var bResult = CollaborativeEditing.OnEnd_CheckLock();

        if ( true === bResult )
        {
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            //this.Document_UpdateRulersState();
        }

        return bResult;
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Document );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case  historyitem_Document_AddItem:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long   : Позиция
                //    String : Id элемента
                //  }

                var bArray = Data.UseArray;
                var Count  = 1;

                Writer.WriteLong( Count );

                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( true === bArray )
                        Writer.WriteLong( Data.PosArray[Index] );
                    else
                        Writer.WriteLong( Data.Pos + Index );

                    Writer.WriteString2( Data.Item.Get_Id() );
                }

                break;
            }

            case historyitem_Document_RemoveItem:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var bArray = Data.UseArray;
                var Count  = Data.Items.length;

                var StartPos = Writer.GetCurPosition();
                Writer.Skip(4);
                var RealCount = Count;

                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( true === bArray )
                    {
                        if ( false === Data.PosArray[Index] )
                            RealCount--;
                        else
                            Writer.WriteLong( Data.PosArray[Index] );
                    }
                    else
                        Writer.WriteLong( Data.Pos );
                }

                var EndPos = Writer.GetCurPosition();
                Writer.Seek( StartPos );
                Writer.WriteLong( RealCount );
                Writer.Seek( EndPos );

                break;
            }

            case historyitem_Document_DefaultTab:
            {
                // Double : Default Tab

                Writer.WriteDouble( Data.New );

                break;
            }

            case historyitem_Document_EvenAndOddHeaders:
            {
                // Bool : EvenAndOddHeaders
                Writer.WriteBool( Data.New );
                break;
            }

            case historyitem_Document_DefaultLanguage:
            {
                // Long : LanguageId
                Writer.WriteLong( Data.New );
                break;
            }                
        }

        return Writer;
    },

    Save_Changes2 : function(Data, Writer)
    {
        var bRetValue = false;
        var Type = Data.Type;
        switch ( Type )
        {
            case  historyitem_Document_AddItem:
            {
                break;
            }

            case historyitem_Document_RemoveItem:
            {
                break;
            }
        }

        return bRetValue;
    },

    Load_Changes : function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Document != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case  historyitem_Document_AddItem:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long   : Позиция
                //    String : Id элемента
                //  }

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos     = this.m_oContentChanges.Check( contentchanges_Add, Reader.GetLong() );
                    var Element = g_oTableId.Get_ById( Reader.GetString2() );

                    if ( null != Element )
                    {
                        if ( Pos > 0 )
                        {
                            this.Content[Pos - 1].Next = Element;
                            Element.Prev = this.Content[Pos - 1];
                        }
                        else
                            Element.Prev = null;

                        if ( Pos <= this.Content.length - 1 )
                        {
                            this.Content[Pos].Prev = Element;
                            Element.Next = this.Content[Pos];
                        }
                        else
                            Element.Next = null;
                        
                        Element.Parent = this;

                        this.Content.splice( Pos, 0, Element );

                        // Обновим информацию о секциях
                        this.SectionsInfo.Update_OnAdd( Pos, [ Element ] );
                    }
                }

                break;
            }

            case historyitem_Document_RemoveItem:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos = this.m_oContentChanges.Check( contentchanges_Remove, Reader.GetLong() );

                    // действие совпало, не делаем его
                    if ( false === Pos )
                        continue;

                    this.Content.splice( Pos, 1 );

                    if ( Pos > 0 )
                    {
                        if ( Pos <= this.Content.length - 1 )
                        {
                            this.Content[Pos - 1].Next = this.Content[Pos];
                            this.Content[Pos].Prev     = this.Content[Pos - 1];
                        }
                        else
                        {
                            this.Content[Pos - 1].Next = null;
                        }
                    }
                    else if ( Pos <= this.Content.length - 1 )
                    {
                        this.Content[Pos].Prev = null;
                    }

                    // Обновим информацию о секциях
                    this.SectionsInfo.Update_OnRemove( Pos, 1 );
                }

                break;
            }

            case historyitem_Document_DefaultTab:
            {
                // Double : Default Tab

                Default_Tab_Stop = Reader.GetDouble();

                break;
            }

            case historyitem_Document_EvenAndOddHeaders:
            {
                // Bool : EvenAndOddHeaders
                
                EvenAndOddHeaders = Reader.GetBool();

                break;
            }

            case historyitem_Document_DefaultLanguage:
            {
                // Long : LanguageId
                this.Styles.Default.TextPr.Lang.Val = Reader.GetLong();

                // Нужно заново запустить проверку орфографии
                this.Restart_CheckSpelling();

                break;
            }
        }

        return true;
    },

    Get_SelectionState2 : function()
    {
        this.Selection_Remove()

        // Сохраняем Id ближайшего элемента в текущем классе

        var State = new CDocumentSelectionState();
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            State.Type = docpostype_HdrFtr;

            if ( null != this.HdrFtr.CurHdrFtr )
                State.Id = this.HdrFtr.CurHdrFtr.Get_Id();
            else
                State.Id = null;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            // TODO: запрашиваем параграф текущего выделенного элемента
            var X       = 0;
            var Y       = 0;
            var PageNum = this.CurPage;

            var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageNum);

            State.Type = docpostype_Content;
            State.Id   = this.Content[ContentPos].Get_Id();
        }
        else // if ( docpostype_Content === this.CurPos.Type )
        {
            State.Id   = this.Get_Id();
            State.Type = docpostype_Content;

            var Element = this.Content[this.CurPos.ContentPos]
            State.Data = Element.Get_SelectionState2();
        }

        return State;
    },

    Set_SelectionState2 : function(State)
    {
        this.Selection_Remove();

        var Id = State.Id;
        if ( docpostype_HdrFtr === State.Type )
        {
            this.CurPos.Type = docpostype_HdrFtr;

            if ( null === Id || true != this.HdrFtr.Set_CurHdrFtr_ById(Id) )
            {
                this.CurPos.Type       = docpostype_Content;
                this.CurPos.ContentPos = 0;

                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
            }
        }
        else // if ( docpostype_Content === State.Type )
        {
            var ElementId = State.Data.Id;

            var CurId = ElementId;

            var bFlag = false;

            var Pos = 0;

            // Найдем элемент с Id = CurId
            var Count = this.Content.length;
            for ( Pos = 0; Pos < Count; Pos++ )
            {
                if ( this.Content[Pos].Get_Id() == CurId )
                {
                    bFlag = true;
                    break;
                }
            }

            if ( true !== bFlag )
            {
                var TempElement = g_oTableId.Get_ById(CurId);
                Pos = ( null != TempElement ? TempElement.Index : 0 );                
                Pos = Math.max( 0, Math.min( Pos, this.Content.length - 1 ) );
            }

            this.Selection.Start    = false;
            this.Selection.Use      = false;
            this.Selection.StartPos = Pos;
            this.Selection.EndPos   = Pos;
            this.Selection.Flag     = selectionflag_Common;

            this.CurPos.Type       = docpostype_Content;
            this.CurPos.ContentPos = Pos;

            if ( true !== bFlag )
                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
            else
            {
                this.Content[this.CurPos.ContentPos].Set_SelectionState2( State.Data );
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
    Add_Comment : function(CommentData)
    {
        if ( true != this.CanAdd_Comment() )
        {
            CommentData.Set_QuoteText(null);
            var Comment = new CComment( this.Comments, CommentData );
            this.Comments.Add( Comment );

            // Обновляем информацию для Undo/Redo
            this.Document_UpdateInterfaceState();
        }
        else
        {
            var QuotedText = this.Get_SelectedText(false);
            if ( null === QuotedText )
                QuotedText = "";
            CommentData.Set_QuoteText( QuotedText );

            var Comment = new CComment( this.Comments, CommentData );
            this.Comments.Add( Comment );

            if ( docpostype_HdrFtr === this.CurPos.Type )
            {
                this.HdrFtr.Add_Comment( Comment );
            }
            else if ( docpostype_DrawingObjects === this.CurPos.Type )
            {
                if ( true != this.DrawingObjects.isSelectedText() )
                {
                    var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                    if ( null != ParaDrawing )
                    {
                        var Paragraph = ParaDrawing.Parent;
                        Paragraph.Add_Comment2(Comment, ParaDrawing.Get_Id());
                    }
                }
                else
                {
                    this.DrawingObjects.addComment( Comment );
                }
            }
            else // if ( docpostype_Content === this.CurPos.Type )
            {
                if ( selectionflag_Numbering === this.Selection.Flag )
                    return;

                if ( true === this.Selection.Use )
                {
                    var StartPos, EndPos;
                    if ( this.Selection.StartPos < this.Selection.EndPos )
                    {
                        StartPos = this.Selection.StartPos;
                        EndPos   = this.Selection.EndPos;
                    }
                    else
                    {
                        StartPos = this.Selection.EndPos;
                        EndPos   = this.Selection.StartPos;
                    }

                    if ( StartPos === EndPos )
                    {
                        this.Content[StartPos].Add_Comment( Comment, true, true );
                    }
                    else
                    {
                        this.Content[StartPos].Add_Comment( Comment, true, false );
                        this.Content[EndPos].Add_Comment( Comment, false, true );
                    }
                }
                else
                {
                    this.Content[this.CurPos.ContentPos].Add_Comment( Comment, true, true );
                }
            }

            // TODO: Продумать, как избавиться от пересчета
            this.Recalculate();
            this.Document_UpdateInterfaceState();
        }

        return Comment;
    },

    Change_Comment : function(Id, CommentData)
    {
        this.Comments.Set_CommentData( Id, CommentData );
        this.Document_UpdateInterfaceState();
    },

    Remove_Comment : function(Id, bSendEvent, bRecalculate)
    {
        if ( null === Id )
            return;

        if ( true === this.Comments.Remove_ById( Id ) )
        {
            if ( true === bRecalculate )
            {
                // TODO: Продумать как избавиться от пересчета при удалении комментария
                this.Recalculate();
            }

            if ( true === bSendEvent )
                editor.sync_RemoveComment( Id );

            this.Document_UpdateInterfaceState();
        }
    },

    CanAdd_Comment : function()
    {
        if (true !== this.Comments.Is_Use())
            return false;

        // Проверим можно ли добавлять гиперссылку
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.CanAdd_Comment();
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            if ( true != this.DrawingObjects.isSelectedText() )
                return true;
            else
                return this.DrawingObjects.canAddComment();
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            switch( this.Selection.Flag )
            {
                case selectionflag_Numbering:     return false;
                case selectionflag_Common:
                {
                    if ( true === this.Selection.Use && this.Selection.StartPos != this.Selection.EndPos )
                        return true;
                    else
                    {
                        var Pos = ( this.Selection.Use === true ? this.Selection.StartPos : this.CurPos.ContentPos );
                        var Element = this.Content[Pos];
                        return Element.CanAdd_Comment();
                    }
                }
            }
        }

        return false;
    },

    Select_Comment : function(Id, ScrollToComment)
    {
        var OldId = this.Comments.Get_CurrentId();
        this.Comments.Set_Current( Id );

        var Comment = this.Comments.Get_ById( Id );
        if ( null != Comment )
        {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y       = Comment.m_oStartInfo.Y;
            var Comment_X       = Comment.m_oStartInfo.X;
            
            if ( true === ScrollToComment )
                this.DrawingDocument.m_oWordControl.ScrollToPosition( Comment_X, Comment_Y, Comment_PageNum );
        }

        if ( OldId != Id )
        {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
    },

    Show_Comment : function(Id)
    {
        var Comment = this.Comments.Get_ById( Id );
        if ( null != Comment && null != Comment.StartId && null != Comment.EndId )
        {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y       = Comment.m_oStartInfo.Y;
            var Comment_X       = this.Get_PageLimits(Comment_PageNum).XLimit;

            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( Comment_X, Comment_Y, Comment_PageNum );
            editor.sync_ShowComment( Comment.Get_Id(), Coords.X, Coords.Y );
        }
        else
        {
            editor.sync_HideComment();
        }
    },

    Show_Comments : function()
    {
        this.Comments.Set_Use(true);
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },

    Hide_Comments : function()
    {
        this.Comments.Set_Use(false);
        this.Comments.Set_Current(null);
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },

    Get_PrevElementEndInfo : function(CurElement)
    {
        var PrevElement = CurElement.Get_DocumentPrev();

        if ( null !== PrevElement && undefined !== PrevElement )
        {
            return PrevElement.Get_EndInfo();
        }
        else
            return null;
    },
    
    Get_SelectionAnchorPos : function()
    {
        var Result;
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            Result = this.HdrFtr.Get_SelectionAnchorPos();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
            Result =
            {
                X0   : ParaDrawing.GraphicObj.x,
                Y    : ParaDrawing.GraphicObj.y,
                X1   : ParaDrawing.GraphicObj.x + ParaDrawing.GraphicObj.extX,
                Page : ParaDrawing.PageNum
            };
        }
        else
        {
            var Pos = ( true === this.Selection.Use ? ( this.Selection.StartPos < this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos )  : this.CurPos.ContentPos );
            Result = this.Content[Pos].Get_SelectionAnchorPos();
        }

        var PageLimit = this.Get_PageLimits(Result.Page);
        Result.X0 = PageLimit.X;
        Result.X1 = PageLimit.XLimit;

        var Coords0 = this.DrawingDocument.ConvertCoordsToCursorWR( Result.X0, Result.Y, Result.Page );
        var Coords1 = this.DrawingDocument.ConvertCoordsToCursorWR( Result.X1, Result.Y, Result.Page );

        return { X0 : Coords0.X, X1 : Coords1.X, Y : Coords0.Y };
    },
//-----------------------------------------------------------------------------------
// Функции для работы с textbox
//-----------------------------------------------------------------------------------
    TextBox_Put : function(sText, rFonts)
    {
        if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            this.Create_NewHistoryPoint();
            
            if ( undefined === rFonts )
            {
                // Отключаем пересчет, включим перед последним добавлением. Поскольку,
                // у нас все добавляется в 1 параграф, так можно делать.
                this.TurnOffRecalc = true;

                var Count = sText.length;
                var e = global_keyboardEvent;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( Index === Count - 1 )
                        this.TurnOffRecalc = false;

                    var _char = sText.charAt(Index);
                    if (" " == _char)
                        this.Paragraph_Add(new ParaSpace());
                    else
                        this.Paragraph_Add(new ParaText(_char));
                }

                // На случай, если Count = 0
                this.TurnOffRecalc = false;
            }
            else
            {
                var Para = this.Get_CurrentParagraph();
                if ( null === Para )
                    return;
                
                var RunPr = Para.Get_TextPr();
                if ( null === RunPr || undefined === RunPr )
                    RunPr = new CTextPr();
                
                RunPr.RFonts = rFonts;
                
                var Run = new ParaRun( Para );
                Run.Set_Pr( RunPr );

                var Count = sText.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var _char = sText.charAt(Index);
                    if (" " == _char)
                        Run.Add_ToContent( Index, new ParaSpace(), false );
                    else
                        Run.Add_ToContent( Index, new ParaText(_char), false );
                }

                Para.Add( Run );
                
                this.Recalculate();
            }
        }
    },
//-----------------------------------------------------------------------------------
// события вьюера
//-----------------------------------------------------------------------------------
    Viewer_OnChangePosition : function()
    {
        var Comment = this.Comments.Get_Current();
        if ( null != Comment )
        {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y       = Comment.m_oStartInfo.Y;
            var Comment_X       = this.Get_PageLimits(Comment_PageNum).XLimit;
            var Para            = g_oTableId.Get_ById( Comment.StartId );

            if ( null !== Para)
            {
                var TextTransform = Para.Get_ParentTextTransform();
                if(TextTransform)
                {
                    Comment_Y = TextTransform.TransformPointY( Comment.m_oStartInfo.X, Comment.m_oStartInfo.Y );
                }
            }

            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( Comment_X, Comment_Y, Comment_PageNum );
            editor.sync_UpdateCommentPosition( Comment.Get_Id(), Coords.X, Coords.Y );
        }
    },
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с секциями
//----------------------------------------------------------------------------------------------------------------------
    Update_SectionsInfo : function()
    {
        this.SectionsInfo.Clear();

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            if ( type_Paragraph === Element.GetType() && undefined !== Element.Get_SectionPr() )
                this.SectionsInfo.Add( Element.Get_SectionPr(), Index );
        }

        this.SectionsInfo.Add( this.SectPr, Count );
    },
    
    Check_SectionLastParagraph : function()
    {
        var Count = this.Content.length;
        if ( Count <= 0 )
            return;
        
        var Element = this.Content[Count - 1];
        if ( type_Paragraph === Element.GetType() && undefined !== Element.Get_SectionPr() )
            this.Internal_Content_Add(Count, new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 ) );
    },
    
    Add_SectionBreak : function(SectionBreakType)
    {
        var Element = null;
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            // В колонтитуле нельзя добавить разрыв страницы
            return false;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            // В автофигуре нельзя добавить разрыв страницы
            return false;
        }
        else
        {
            if ( true === this.Selection.Use )
            {
                // Если у нас есть селект, тогда ставим курсор в начало селекта
                this.Cursor_MoveLeft(false, false);
            }

            var Element = this.Content[this.CurPos.ContentPos];

            var CurSectPr = this.SectionsInfo.Get_SectPr(this.CurPos.ContentPos).SectPr;

            if ( type_Paragraph === Element.GetType() )
            {
                // Если мы стоим в параграфе, тогда делим данный параграф на 2 в текущей точке(даже если мы стоим в начале
                // или в конце параграфа) и к первому параграфу приписываем конец секкции.

                var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );

                Element.Split( NewParagraph );

                this.CurPos.ContentPos++;
                NewParagraph.Cursor_MoveToStartPos(false);

                this.Internal_Content_Add( this.CurPos.ContentPos, NewParagraph );

                // Заметим, что после функции Split, у параграфа Element не может быть окончания секции, т.к. если она 
                // была в нем изначально, тогда после функции Split, окончание секции перенеслось в новый параграф. 
            }
            else
            {
                // Если мы стоим в таблице, тогда делим данную таблицу на 2 по текущему ряду(текущий ряд попадает во
                // вторую таблицу). Вставляем между таблицами параграф, и к этому параграфу приписываем окончание
                // секции. Если мы стоим в первой строке таблицы, таблицу делить не надо, достаточно добавить новый 
                // параграф перед ней.

                var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, 0, 0 );
                var NewTable = Element.Split_Table();

                if ( null === NewTable )
                {
                    this.Internal_Content_Add( this.CurPos.ContentPos, NewParagraph );
                    this.CurPos.ContentPos++;
                }
                else
                {
                    this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewParagraph );
                    this.Internal_Content_Add( this.CurPos.ContentPos + 2, NewTable );
                    this.CurPos.ContentPos += 2;
                }

                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos( false );

                Element = NewParagraph;
            }

            var SectPr = new CSectionPr(this);

            // В данном месте мы ставим разрыв секции. Чтобы до текущего места ничего не изменилось, мы у новой
            // для новой секции копируем все настройки из старой, а в старую секцию выставляем приходящий тип
            // разрыва секций. Заметим, что поскольку мы делаем все так, чтобы до текущей страницы ничего не 
            // изменилось, надо сохранить эту информацию для пересчета, для этого мы помечаем все следующие изменения
            // как не влияющие на пересчет.

            History.MinorChanges = true;

            SectPr.Copy( CurSectPr );
            CurSectPr.Set_Type( SectionBreakType );
            CurSectPr.Set_PageNum_Start( -1 );
            CurSectPr.Clear_AllHdrFtr();

            History.MinorChanges = false;

            Element.Set_SectionPr(SectPr);
            Element.Refresh_RecalcData2(0, 0);

            this.Recalculate();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();

            return true;
        }
        
        return false;
    },
    
    Get_SectionFirstPage : function(SectIndex, Page_abs)
    {       
        if ( SectIndex <= 0 )
            return 0;
        
        var StartIndex = this.SectionsInfo.Get_SectPr2(SectIndex - 1).Index;
        
        // Ищем номер страницы, на которой закончилась предыдущая секция
        var CurPage = Page_abs;
        for (; CurPage > 0; CurPage--)
        {
            if ( this.Pages[CurPage].EndPos >= StartIndex && this.Pages[CurPage].Pos <= StartIndex )
                break;
        }
        
        return CurPage + 1;
    },

    
    Get_SectionPageNumInfo : function(Page_abs)
    {
        var PageNumInfo = this.Get_SectionPageNumInfo2( Page_abs );
        
        var FP = PageNumInfo.FirstPage;
        var CP = PageNumInfo.CurPage;

        // Первая страница учитывается, только если параграф, идущий сразу за разрывом секции, начинается с новой страницы
        var bCheckFP = true;
        var SectIndex = PageNumInfo.SectIndex;
        if ( SectIndex > 0 )
        {
            var CurSectInfo  = this.SectionsInfo.Get_SectPr2( SectIndex );
            var PrevSectInfo = this.SectionsInfo.Get_SectPr2( SectIndex - 1 );
            
            if ( CurSectInfo !== PrevSectInfo && section_type_Continuous === CurSectInfo.SectPr.Get_Type() && true === CurSectInfo.SectPr.Compare_PageSize( PrevSectInfo.SectPr ) )
            {
                var ElementIndex = PrevSectInfo.Index;
                if ( ElementIndex < this.Content.length - 1 && true !== this.Content[ElementIndex + 1].Is_StartFromNewPage() )
                    bCheckFP = false;
            }            
        }
            
        
        var bFirst = ( FP === CP && true === bCheckFP ? true : false );
        var bEven  = ( 0 === CP % 2 ? true : false ); // Четность/нечетность проверяется по текущему номеру страницы в секции, с учетом нумерации в секциях
                
        return new CSectionPageNumInfo( FP, CP, bFirst, bEven, Page_abs );
    },
    
    Get_SectionPageNumInfo2 : function(Page_abs)
    {
        var StartIndex = 0;
        
        // Такое может случится при первом рассчете документа, и когда мы находимся в автофигуре
        if ( undefined !== this.Pages[Page_abs] )        
            StartIndex = this.Pages[Page_abs].Pos;        
        
        var SectIndex  = this.SectionsInfo.Get_Index(StartIndex);
        var StartSectIndex = SectIndex;

        if ( 0 === SectIndex )
        {
            var PageNumStart = this.SectionsInfo.Get_SectPr2(0).SectPr.Get_PageNum_Start();
            var BT           = this.SectionsInfo.Get_SectPr2(0).SectPr.Get_Type();

            // Нумерация начинается с 1, если начальное значение не задано. Заметим, что в Word нумерация может начинаться и 
            // со значения 0, а все отрицательные значения воспринимаются как продолжение нумерации с предыдущей секции.
            if ( PageNumStart < 0 )
                PageNumStart = 1;

            if ( (section_type_OddPage === BT && 0 === PageNumStart % 2) || (section_type_EvenPage === BT && 1 === PageNumStart % 2) )
                PageNumStart++;

            return { FirstPage : PageNumStart, CurPage : Page_abs + PageNumStart, SectIndex : StartSectIndex };
        }

        var SectionFirstPage = this.Get_SectionFirstPage( SectIndex, Page_abs );

        var FirstPage    = SectionFirstPage;
        var PageNumStart = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr.Get_PageNum_Start();
        var BreakType    = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr.Get_Type();
        
        var StartInfo = [];
        StartInfo.push( { FirstPage : FirstPage, BreakType : BreakType } );

        while ( PageNumStart < 0 && SectIndex > 0 )
        {
            SectIndex--;

            FirstPage    = this.Get_SectionFirstPage( SectIndex, Page_abs );
            PageNumStart = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr.Get_PageNum_Start();
            BreakType    = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr.Get_Type();

            StartInfo.splice( 0, 0, { FirstPage : FirstPage, BreakType : BreakType } );
        }

        // Нумерация начинается с 1, если начальное значение не задано. Заметим, что в Word нумерация может начинаться и 
        // со значения 0, а все отрицательные значения воспринимаются как продолжение нумерации с предыдущей секции.
        if ( PageNumStart < 0 )
            PageNumStart = 1;
        
        var InfoIndex = 0;
        var InfoCount = StartInfo.length;
        
        var FP = StartInfo[0].FirstPage;
        var BT = StartInfo[0].BreakType;
        var PrevFP = StartInfo[0].FirstPage;
        
        while ( InfoIndex < InfoCount )
        {
            FP = StartInfo[InfoIndex].FirstPage;
            BT = StartInfo[InfoIndex].BreakType;
            
            PageNumStart += FP - PrevFP;
            PrevFP = FP;
            
            if ( (section_type_OddPage === BT && 0 === PageNumStart % 2) || (section_type_EvenPage === BT && 1 === PageNumStart % 2) )
                PageNumStart++;      
            
            InfoIndex++;
        }
        
        if ( FP > Page_abs )
            Page_abs = FP;
        
        var _FP = PageNumStart;
        var _CP = PageNumStart + Page_abs - FP;       

        return { FirstPage : _FP, CurPage : _CP, SectIndex : StartSectIndex };
    },
    
    Get_SectionHdrFtr : function(Page_abs, _bFirst, _bEven)
    {       
        var StartIndex = this.Pages[Page_abs].Pos;
        var SectIndex  = this.SectionsInfo.Get_Index(StartIndex);
        var CurSectPr  = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr;

        var bEven  = ( true === _bEven  && true === EvenAndOddHeaders   ? true : false );
        var bFirst = ( true === _bFirst && true === CurSectPr.TitlePage ? true : false );

        var CurSectIndex = SectIndex;
        
        // Ищем верхний и нижний колонтитулы. Если они не находятся в текущей секции, тогда ищем в предыдущей.        
        var Header = null, Footer = null;
        while ( CurSectIndex >= 0 )
        {
            var SectPr = this.SectionsInfo.Get_SectPr2(CurSectIndex).SectPr;
            
            if ( null === Header )
            {
                if ( true === bFirst )
                    Header = SectPr.Get_Header_First();
                else if ( true === bEven )
                    Header = SectPr.Get_Header_Even();
                else
                    Header = SectPr.Get_Header_Default();
            }

            if ( null === Footer )
            {
                if ( true === bFirst )
                    Footer = SectPr.Get_Footer_First();
                else if ( true === bEven )
                    Footer = SectPr.Get_Footer_Even();
                else
                    Footer = SectPr.Get_Footer_Default();
            }

            if ( null !== Header && null !== Footer )
                break;     
            
            CurSectIndex--;
        }
                
        return { Header : Header, Footer : Footer, SectPr : CurSectPr };
    },
    
    Create_SectionHdrFtr : function(Type, PageIndex)
    {
        // Данная функция используется, когда у нас нет колонтитула вообще. Это значит, что его нет ни в 1 секции. Следовательно,
        // создаем колонтитул в первой секции, а в остальных он будет повторяться. По текущей секции нам надо будет
        // определить какой конкретно колонтитул мы собираемся создать.

        var SectionPageInfo = this.Get_SectionPageNumInfo( PageIndex );

        var _bFirst = SectionPageInfo.bFirst;
        var _bEven  = SectionPageInfo.bEven;

        var StartIndex = this.Pages[PageIndex].Pos;
        var SectIndex  = this.SectionsInfo.Get_Index(StartIndex);
        var CurSectPr  = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr;
                
        var bEven  = ( true === _bEven  && true === EvenAndOddHeaders   ? true : false );
        var bFirst = ( true === _bFirst && true === CurSectPr.TitlePage ? true : false );
        
        var SectPr = this.SectionsInfo.Get_SectPr2(0).SectPr;       
        var HdrFtr = new CHeaderFooter( this.HdrFtr, this, this.DrawingDocument, Type );

        if ( hdrftr_Header === Type )
        {
            if ( true === bFirst )
                SectPr.Set_Header_First( HdrFtr );
            else if ( true === bEven )
                SectPr.Set_Header_Even( HdrFtr );
            else
                SectPr.Set_Header_Default( HdrFtr );
        }
        else
        {
            if ( true === bFirst )
                SectPr.Set_Footer_First( HdrFtr );
            else if ( true === bEven )
                SectPr.Set_Footer_Even( HdrFtr );
            else
                SectPr.Set_Footer_Default( HdrFtr );
        } 
        
        return HdrFtr;
    },
    
    On_SectionChange : function(_SectPr)
    {
        var Index = this.SectionsInfo.Find( _SectPr );
        if ( -1 === Index )
            return;
        
        var SectPr = null;       
        var HeaderF = null, HeaderD = null, HeaderE = null, FooterF = null, FooterD = null, FooterE = null;
        
        while ( Index >= 0 )
        {
            SectPr = this.SectionsInfo.Get_SectPr2(Index).SectPr;
            
            if ( null === HeaderF )
                HeaderF = SectPr.Get_Header_First();

            if ( null === HeaderD )
                HeaderD = SectPr.Get_Header_Default();

            if ( null === HeaderE )
                HeaderE = SectPr.Get_Header_Even();

            if ( null === FooterF )
                FooterF = SectPr.Get_Footer_First();

            if ( null === FooterD )
                FooterD = SectPr.Get_Footer_Default();

            if ( null === FooterE )
                FooterE = SectPr.Get_Footer_Even();

            Index--;
        }
        
        if ( null !== HeaderF )
            HeaderF.Refresh_RecalcData_BySection( _SectPr );

        if ( null !== HeaderD )
            HeaderD.Refresh_RecalcData_BySection( _SectPr );

        if ( null !== HeaderE )
            HeaderE.Refresh_RecalcData_BySection( _SectPr );

        if ( null !== FooterF )
            FooterF.Refresh_RecalcData_BySection( _SectPr );

        if ( null !== FooterD )
            FooterD.Refresh_RecalcData_BySection( _SectPr );

        if ( null !== FooterE )
            FooterE.Refresh_RecalcData_BySection( _SectPr );                
    },
    
    Create_HdrFtrWidthPageNum : function(PageIndex, AlignV, AlignH)
    {
        // Определим четность страницы и является ли она первой в данной секции. Заметим, что четность страницы 
        // отсчитывается от начала текущей секции и не зависит от настроек нумерации страниц для данной секции.
        var SectionPageInfo = this.Get_SectionPageNumInfo( PageIndex );

        var bFirst = SectionPageInfo.bFirst;
        var bEven  = SectionPageInfo.bEven;

        // Запросим нужный нам колонтитул 
        var HdrFtr = this.Get_SectionHdrFtr( PageIndex, bFirst, bEven );   
        
        switch ( AlignV )
        {
            case hdrftr_Header :
            {
                var Header = HdrFtr.Header;

                if ( null === Header)
                    Header = this.Create_SectionHdrFtr( hdrftr_Header, PageIndex );

                Header.AddPageNum( AlignH );
                
                break;
            }
                
            case hdrftr_Footer :
            {
                var Footer = HdrFtr.Footer;

                if ( null === Footer)
                    Footer = this.Create_SectionHdrFtr( hdrftr_Footer, PageIndex );

                Footer.AddPageNum( AlignH );

                break;
            }
        }
        
        this.Recalculate();
    },

    /**
     * Определяем использовать ли заливку текста в особых случаях, когда вызывается заливка параграфа.
     * @param bUse
     */
    Set_UseTextShd : function(bUse)
    {
        this.UseTextShd = bUse;
    }
};

//-----------------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------------
function CDocumentSelectionState()
{
    this.Id        = null;
    this.Type      = docpostype_Content;
    this.Data      = {}; // Объект с текущей позицией
}

function CDocumentSectionsInfo()
{
    this.Elements = [];
}

CDocumentSectionsInfo.prototype =
{
    Add : function( SectPr, Index )
    {
        this.Elements.push( new CDocumentSectionsInfoElement( SectPr, Index ) );
    },
    
    Get_SectionsCount : function()
    {
        return this.Elements.length;
    },

    Clear : function()
    {
        this.Elements.length = 0;
    },
    
    Find_ByHdrFtr : function(HdrFtr)
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var SectPr = this.Elements[Index].SectPr;
            
            if ( HdrFtr === SectPr.Get_Header_First() || HdrFtr === SectPr.Get_Header_Default() || HdrFtr === SectPr.Get_Header_Even() ||
                 HdrFtr === SectPr.Get_Footer_First() || HdrFtr === SectPr.Get_Footer_Default() || HdrFtr === SectPr.Get_Footer_Even() )
                    return Index;            
        }
        
        return -1;
    },
    
    Reset_HdrFtrRecalculateCache : function()
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var SectPr = this.Elements[Index].SectPr;
            
            if ( null != SectPr.HeaderFirst )
                SectPr.HeaderFirst.Reset_RecalculateCache();

            if ( null != SectPr.HeaderDefault )
                SectPr.HeaderDefault.Reset_RecalculateCache();

            if ( null != SectPr.HeaderEven )
                SectPr.HeaderEven.Reset_RecalculateCache();
            
            if ( null != SectPr.FooterFirst )
                SectPr.FooterFirst.Reset_RecalculateCache();

            if ( null != SectPr.FooterDefault )
                SectPr.FooterDefault.Reset_RecalculateCache();

            if ( null != SectPr.FooterEven )
                SectPr.FooterEven.Reset_RecalculateCache();
        }
    },

    Get_AllParagraphs_ByNumbering : function(NumPr, ParaArray)
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var SectPr = this.Elements[Index].SectPr;

            if ( null != SectPr.HeaderFirst )
                SectPr.HeaderFirst.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

            if ( null != SectPr.HeaderDefault )
                SectPr.HeaderDefault.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

            if ( null != SectPr.HeaderEven )
                SectPr.HeaderEven.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

            if ( null != SectPr.FooterFirst )
                SectPr.FooterFirst.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

            if ( null != SectPr.FooterDefault )
                SectPr.FooterDefault.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

            if ( null != SectPr.FooterEven )
                SectPr.FooterEven.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
    },

    Document_CreateFontMap : function(FontMap)
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var SectPr = this.Elements[Index].SectPr;

            if ( null != SectPr.HeaderFirst )
                SectPr.HeaderFirst.Document_CreateFontMap(FontMap);

            if ( null != SectPr.HeaderDefault )
                SectPr.HeaderDefault.Document_CreateFontMap(FontMap);

            if ( null != SectPr.HeaderEven )
                SectPr.HeaderEven.Document_CreateFontMap(FontMap);

            if ( null != SectPr.FooterFirst )
                SectPr.FooterFirst.Document_CreateFontMap(FontMap);

            if ( null != SectPr.FooterDefault )
                SectPr.FooterDefault.Document_CreateFontMap(FontMap);

            if ( null != SectPr.FooterEven )
                SectPr.FooterEven.Document_CreateFontMap(FontMap);
        }
    },

    Document_CreateFontCharMap : function(FontCharMap)
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var SectPr = this.Elements[Index].SectPr;

            if ( null != SectPr.HeaderFirst )
                SectPr.HeaderFirst.Document_CreateFontCharMap(FontCharMap);

            if ( null != SectPr.HeaderDefault )
                SectPr.HeaderDefault.Document_CreateFontCharMap(FontCharMap);

            if ( null != SectPr.HeaderEven )
                SectPr.HeaderEven.Document_CreateFontCharMap(FontCharMap);

            if ( null != SectPr.FooterFirst )
                SectPr.FooterFirst.Document_CreateFontCharMap(FontCharMap);

            if ( null != SectPr.FooterDefault )
                SectPr.FooterDefault.Document_CreateFontCharMap(FontCharMap);

            if ( null != SectPr.FooterEven )
                SectPr.FooterEven.Document_CreateFontCharMap(FontCharMap);
        }
    },

    Document_Get_AllFontNames : function ( AllFonts )
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var SectPr = this.Elements[Index].SectPr;

            if ( null != SectPr.HeaderFirst )
                SectPr.HeaderFirst.Document_Get_AllFontNames(AllFonts);

            if ( null != SectPr.HeaderDefault )
                SectPr.HeaderDefault.Document_Get_AllFontNames(AllFonts);

            if ( null != SectPr.HeaderEven )
                SectPr.HeaderEven.Document_Get_AllFontNames(AllFonts);

            if ( null != SectPr.FooterFirst )
                SectPr.FooterFirst.Document_Get_AllFontNames(AllFonts);

            if ( null != SectPr.FooterDefault )
                SectPr.FooterDefault.Document_Get_AllFontNames(AllFonts);

            if ( null != SectPr.FooterEven )
                SectPr.FooterEven.Document_Get_AllFontNames(AllFonts);
        }
    },

    Get_Index : function(Index)
    {
        var Count = this.Elements.length;

        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            if ( Index <= this.Elements[Pos].Index )
                return Pos;
        }

        // Последний элемент здесь это всегда конечная секция документа
        return (Count - 1);
    },
    
    Get_Count : function()
    {
        return this.Elements.length;
    },

    Get_SectPr : function(Index)
    {
        var Count = this.Elements.length;

        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            if ( Index <= this.Elements[Pos].Index )
                return this.Elements[Pos];
        }

        // Последний элемент здесь это всегда конечная секция документа
        return this.Elements[Count - 1];
    },
    
    Get_SectPr2 : function(Index)
    {
        return this.Elements[Index];
    },

    Find : function(SectPr)
    {
        var Count = this.Elements.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Elements[Index];
            if ( Element.SectPr === SectPr )
                return Index;
        }

        return -1;
    },

    Update_OnAdd : function(Pos, Items)
    {
        var Count = Items.length;
        var Len = this.Elements.length;

        // Сначала обновим старые метки
        for (var Index = 0; Index < Len; Index++)
        {
            if ( this.Elements[Index].Index >= Pos )
                this.Elements[Index].Index += Count;
        }

        // Если среди новых элементов были параграфы с настройками секции, тогда добавим их здесь
        for (var Index = 0; Index < Count; Index++ )
        {
            var Item = Items[Index];
            var SectPr = ( type_Paragraph === Item.GetType() ? Item.Get_SectionPr() : undefined );

            if ( undefined !== SectPr )
            {
                var TempPos = 0;
                for ( ; TempPos < Len; TempPos++ )
                {
                    if ( Pos + Index <= this.Elements[TempPos].Index )
                        break;
                }

                this.Elements.splice( TempPos, 0, new CDocumentSectionsInfoElement( SectPr, Pos + Index ) );
                Len++;
            }
        }
    },

    Update_OnRemove : function(Pos, Count)
    {
        var Len = this.Elements.length;

        for (var Index = 0; Index < Len; Index++)
        {
            var CurPos = this.Elements[Index].Index;

            if ( CurPos >= Pos && CurPos < Pos + Count )
            {
                this.Elements.splice( Index, 1 );
                Len--;
                Index--;
            }
            else if ( CurPos >= Pos + Count )
                this.Elements[Index].Index -= Count;
        }
    }
};

function CDocumentSectionsInfoElement(SectPr, Index)
{
    this.SectPr = SectPr;
    this.Index  = Index;
}
