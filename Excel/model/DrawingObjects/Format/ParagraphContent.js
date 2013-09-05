// Содержимое параграфа должно иметь:
//
// 1. Type    - тип
// 2. Draw    - рисуем на контексте
// 3. Measure  - измеряем
// 4. Is_RealContent - является ли данный элемент реальным элементом параграфа
//---- после использования Measure -----
// 1. Width        - ширина (для рассчетов)
// 2. Height       - высота
// 3. WidthVisible - видимая ширина
// ------- после пересчета -------------
// 1. CurPage
// 2. CurLine
// 3. CurRange

// TODO: Добавить во все элементы функции типа Is_RealContent, чтобы при добавлении
//       нового элемента не надо было бы просматривать каждый раз все функции класса
//       CParagraph.

var para_Unknown                   =     -1; //
var para_Empty                     = 0x0000; // Пустой элемент (таким элементом должен заканчиваться каждый параграф)
var para_Text                      = 0x0001; // Текст
var para_Space                     = 0x0002; // Пробелы
var para_TextPr                    = 0x0003; // Свойства текста
var para_End                       = 0x0004; // Конец параграфа
var para_NewLine                   = 0x0010; // Новая строка
var para_NewLineRendered           = 0x0011; // Рассчитанный перенос строки
var para_InlineBreak               = 0x0012; // Перенос внутри строки (для обтекания)
var para_PageBreakRendered         = 0x0013; // Рассчитанный перенос страницы
var para_Numbering                 = 0x0014; // Элемент, обозначающий нумерацию для списков
var para_Tab                       = 0x0015; // Табуляция
var para_Drawing                   = 0x0016; // Графика (картинки, автофигуры, диаграммы, графики)
var para_PageNum                   = 0x0017; // Нумерация страницы
var para_FlowObjectAnchor          = 0x0018; // Привязка для "плавающих" объектов
var para_HyperlinkStart            = 0x0019; // Начало гиперссылки
var para_HyperlinkEnd              = 0x0020; // Конец гиперссылки
var para_CollaborativeChangesStart = 0x0021; // Начало изменений другого редактора
var para_CollaborativeChangesEnd   = 0x0022; // Конец изменений другого редактора
var para_CommentStart              = 0x0023; // Начало комментария
var para_CommentEnd                = 0x0024; // Начало комментария
var para_PresentationNumbering     = 0x0025; // Элемент, обозначающий нумерацию для списков в презентациях

var break_Line = 0x01;
var break_Page = 0x02;

var nbsp_string = String.fromCharCode( 0x00A0 );
var   sp_string = String.fromCharCode( 0x0032 );

var g_aPunctuation =
[
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0
];

g_aPunctuation[0x00AB] = 1; // символ «
g_aPunctuation[0x00BB] = 1; // символ »
g_aPunctuation[0x2013] = 1; // символ –
g_aPunctuation[0x201C] = 1; // символ “
g_aPunctuation[0x201D] = 1; // символ ”
g_aPunctuation[0x2026] = 1; // символ ...

var g_aNumber = [];
g_aNumber[0x0030] = 1;
g_aNumber[0x0031] = 1;
g_aNumber[0x0032] = 1;
g_aNumber[0x0033] = 1;
g_aNumber[0x0034] = 1;
g_aNumber[0x0035] = 1;
g_aNumber[0x0036] = 1;
g_aNumber[0x0037] = 1;
g_aNumber[0x0038] = 1;
g_aNumber[0x0039] = 1;

var g_aSpecialSymbols = [];
g_aSpecialSymbols[0x00AE] = 1;


function CreateParaItem(type, value)
{
    switch(type)
    {
          case   para_Empty                    : return new ParaEmpty(value);   break;
          case   para_Text                     : return new ParaText(value);    break;
          case   para_Space                    : return new ParaSpace(value);   break;
          case   para_TextPr                   : return g_oTableId.Get_ById(value);   break;
          case   para_End                      : return new ParaEnd();   break;
          case   para_NewLine                  : return new ParaNewLine(value); break;
          case   para_NewLineRendered          : return new ParaNewLineRendered();  break;
          case   para_InlineBreak              : return new ParaInlineBreak();  break;
          case   para_PageBreakRendered        : return new ParaPageBreakRenderer(); break;
          case   para_Numbering                : return new ParaNumbering(); break;
          case   para_Tab                      : return new ParaTab(value);     break;
          case   para_Drawing                  : return new ParaDrawing();     break;
          case   para_PageNum                  : return new ParaPageNum();  break;
          case   para_FlowObjectAnchor         : return new ParaFlowObjectAnchor(); break;
          case   para_HyperlinkStart           : return new ParaHyperlinkStart(value);     break;
          case   para_HyperlinkEnd             : return new ParaHyperlinkEnd();     break;
          case   para_CollaborativeChangesStart: return new ParaCollaborativeChangesStart(value);  break;
          case   para_CollaborativeChangesEnd  : return new ParaCollaborativeChangesEnd();  break;
          case   para_CommentStart             : return new ParaCommentStart(value);     break;
          case   para_CommentEnd               : return new ParaCommentEnd(value);  break;
          case   para_PresentationNumbering    : return new ParaPresentationNumbering(); break;
    }
    return null;
}

// Класс ParaText
function ParaText(value)
{
    this.Value = value;
    this.Type  = para_Text;

    this.SpaceAfter = false;
    if ( "-" === this.Value )
        this.SpaceAfter = true;

    this.CalcValue = value;
    this.FontSlot  = fontslot_ASCII;
    this.FontKoef  = 1;

    this.Width        = 0;
    this.Height       = 0;
    this.WidthVisible = 0;
}
ParaText.prototype =
{

    getValue: function()
    {
        return this.Value;
    },

    Get_Id: function()
    {
        return this.Id;
    },
    Draw : function(X,Y,Context)
    {
        try
        {
            Context.SetFontSlot( this.FontSlot, this.FontKoef );

           /* if ( true === this.Is_NBSP() && editor.ShowParaMarks )
                Context.FillText( X, Y, String.fromCharCode( 0x00B0 ) );
            else      */
                Context.FillText( X, Y, this.CalcValue );
        }
        catch(e)
        {

        }
    },

    Measure : function(Context, TextPr)
    {
        try
        {
            this.FontKoef = TextPr.Get_FontKoef();

            var bCapitals = false;
            if ( true === TextPr.Caps || true === TextPr.SmallCaps )
            {
                this.CalcValue = this.Value.toUpperCase();
                bCapitals  = ( this.CalcValue === this.Value ? true : false );
            }
            else
            {
                this.CalcValue = this.Value;
                bCapitals  = false;
            }

            if ( true != TextPr.Caps && true === TextPr.SmallCaps && false === bCapitals )
                this.FontKoef *= smallcaps_Koef;

            var Hint = TextPr.RFonts.Hint;
            var bCS  = TextPr.CS;
            var bRTL = TextPr.RTL;
            var lcid = TextPr.Lang.EastAsia;

            this.FontSlot = g_font_detector.Get_FontClass( this.CalcValue.charCodeAt(0), Hint, lcid, bCS, bRTL );

            Context.SetFontSlot( this.FontSlot, this.FontKoef );
            var Temp = Context.Measure( this.CalcValue );

            Temp.Width = Math.max( Temp.Width + TextPr.Spacing, 0 );

            this.Width        = Temp.Width;
            this.Height       = Temp.Height;
            this.WidthVisible = Temp.Width;
        }
        catch(e)
        {
            this.CalcValue    = this.Value;
            this.Width        = 0;
            this.Height       = 0;
            this.WidthVisible = 0;
        }
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaText( this.Value );
    },

    Is_NBSP : function()
    {
        return (this.Value === nbsp_string ? true : false);
    },

    Is_Punctuation : function()
    {
        if ( 1 === this.Value.length && 1 === g_aPunctuation[this.Value.charCodeAt(0)] )
            return true;

        return false;
    },

    Is_Number : function()
    {
        if ( 1 === this.Value.length && 1 === g_aNumber[this.Value.charCodeAt(0)] )
            return true;

        return false;
    },

    Is_SpecialSymbol : function()
    {
        if ( 1 === g_aSpecialSymbols[this.Value.charCodeAt(0)] )
            return true;

        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long : Type
        // Long : Value
        // Bool : SpaceAfter

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Value );
        Writer.WriteBool( this.SpaceAfter );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value      = Reader.GetString2();
        this.SpaceAfter = Reader.GetBool();
    },

    writeToBinary: function(w)
    {
        this.Write_ToBinary(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary(r);
    }
};

// Класс ParaSpace
function ParaSpace(Count)
{
    if ( "number" != typeof(Count) )
        this.Value = 1;
    else
        this.Value = Count;

    this.Type = para_Space;
    this.FontKoef = 1;

    this.Width        = 0;
    this.Height       = 0;
    this.WidthVisible = 0;
    this.Id
}
ParaSpace.prototype =
{


    getValue: function()
    {
        return this.Value;
    },
    Draw : function(X,Y, Context)
    {
        var sString = "";
        if ( 1 == this.Value )
            sString = String.fromCharCode( 0x00B7 );
        else
        {
            for ( var Index = 0; Index < this.Value; Index++ )
            {
                sString += String.fromCharCode( 0x00B7 );
            }
        }

        try
        {
            Context.SetFontSlot( fontslot_ASCII, this.FontKoef );
            /*var OldFont;
            if ( true === this.SmallCaps )
            {
                OldFont = Context.GetFont();

                var TempFont =
                {
                    FontFamily :
                    {
                        Index : OldFont.FontFamily.Index,
                        Name  : OldFont.FontFamily.Name
                    },

                    FontSize : OldFont.FontSize * smallcaps_Koef,
                    Bold     : OldFont.Bold,
                    Italic   : OldFont.Italic
                };

                Context.SetFont( TempFont );
            }*/

            /*if ( editor.ShowParaMarks )
                Context.FillText( X, Y, sString );   */

            //if ( true === this.SmallCaps )
//                Context.SetFont(OldFont);
        }
        catch(e)
        {

        }
    },

    Measure : function(Context, TextPr)
    {
        var sString = "";
        if ( 1 == this.Value )
            sString = " ";
        else
        {
            for ( var Index = 0; Index < this.Value; Index++ )
            {
                sString += " ";
            }
        }

        try
        {
            this.FontKoef = TextPr.Get_FontKoef();

            if ( true != TextPr.Caps && true === TextPr.SmallCaps )
                this.FontKoef *= smallcaps_Koef;

            Context.SetFontSlot( fontslot_ASCII, this.FontKoef );

            var Temp = Context.Measure( sString );

            Temp.Width = Math.max( Temp.Width + TextPr.Spacing, 0 );

            this.Width        = Temp.Width;
            this.Height       = Temp.Height;
            this.WidthVisible = Temp.Width;
        }
        catch(e)
        {
            this.Width        = 0;
            this.Height       = 0;
            this.WidthVisible = 0;
        }

        //return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaSpace(this.Value);
    },

    Write_ToBinary : function(Writer)
    {
        // Long : Type
        // Long : Value

        Writer.WriteLong( this.Type );
        Writer.WriteLong( this.Value );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value = Reader.GetLong();
    },

    writeToBinary: function(w)
    {
        this.Write_ToBinary(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary(r);
    }
};

// Класс ParaTextPr
function ParaTextPr(Props)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Type   = para_TextPr;
    this.Value  = new CTextPr();
    this.Parent = null;

    this.Width        = 0;
    this.Height       = 0;
    this.WidthVisible = 0;



    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
    if(isRealObject(Props))
    {
        this.Set_Value(Props);
    }
}
ParaTextPr.prototype =
{
    getObjectType: function()
    {
        return CLASS_TYPE_TEXT_PR;
    },

    setParent: function(parent)
    {
        var oldValue = isRealObject(this.Parent)  ? this.Parent.Get_Id() : null;
        var newValue = isRealObject(parent) ? parent.Get_Id(): null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddParent, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.Parent = parent;
    },


    getValue: function()
    {
        return this.Get_Id();
    },
    Draw : function()//(X,Y,Context)
    {
        // Ничего не делаем
    },

    Measure : function()//(Context)
    {
        this.Width  = 0;
        this.Height = 0;
        this.WidthVisible = 0;
    },

    Copy : function()
    {
        var ParaTextPr_new = new ParaTextPr( );
        ParaTextPr_new.Set_Value( this.Value );
        return ParaTextPr_new;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },
//-----------------------------------------------------------------------------------
// Функции для изменения свойств
//-----------------------------------------------------------------------------------
    Apply_TextPr : function(TextPr)
    {
        if ( undefined != TextPr.Bold )
            this.Set_Bold( TextPr.Bold );

        if ( undefined != TextPr.Italic )
            this.Set_Italic( TextPr.Italic );

        if ( undefined != TextPr.Strikeout )
            this.Set_Strikeout( TextPr.Strikeout );

        if ( undefined != TextPr.Underline )
            this.Set_Underline( TextPr.Underline );

        if ( undefined != TextPr.FontFamily )
            this.Set_FontFamily( TextPr.FontFamily );

        if ( undefined != TextPr.FontSize )
            this.Set_FontSize( TextPr.FontSize );

        if ( undefined != TextPr.Color )
            this.Set_Color( TextPr.Color );

        if ( undefined != TextPr.VertAlign )
            this.Set_VertAlign( TextPr.VertAlign );

        if ( undefined != TextPr.HighLight )
            this.Set_HighLight( TextPr.HighLight );

        if ( undefined != TextPr.RStyle )
            this.Set_RStyle( TextPr.RStyle );

        if ( undefined != TextPr.Spacing )
            this.Set_Spacing( TextPr.Spacing );

        if ( undefined != TextPr.DStrikeout )
            this.Set_DStrikeout( TextPr.DStrikeout );

        if ( undefined != TextPr.Caps )
            this.Set_Caps( TextPr.Caps );

        if ( undefined != TextPr.SmallCaps )
            this.Set_SmallCaps( TextPr.SmallCaps );

        if ( undefined != TextPr.Position )
            this.Set_Position( TextPr.Position );

        if ( undefined != TextPr.RFonts )
            this.Set_RFonts( TextPr.RFonts );

        if ( undefined != TextPr.Lang )
            this.Set_Lang( TextPr.Lang );
    },

    Set_Prop : function(Prop, Value)
    {
        var OldValue = ( undefined != this.Value[Prop] ? this.Value[Prop] : undefined );
        this.Value[Prop] = Value;

        History.Add( this, { Type : historyitem_TextPr_Change, Prop : Prop, New : Value, Old : OldValue } );
    },

    Delete_Prop : function(Prop)
    {
        if ( undefined === this.Value[Prop] )
            return;

        var OldValue = this.Value[Prop];

        this.Value[Prop] = undefined;

        History.Add( this, { Type : historyitem_TextPr_Change, Prop : Prop, New : null, Old : OldValue } );
    },

    Set_Bold : function(Value)
    {
        var OldValue = ( undefined != this.Value.Bold ? this.Value.Bold : undefined );

        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Bold, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
        if ( undefined != Value )
            this.Value.Bold = Value;
        else
            this.Value.Bold = undefined;

        //History.Add( this, { Type : historyitem_TextPr_Bold, New : Value, Old : OldValue } );
    },

    Set_Italic : function(Value)
    {
        var OldValue = ( undefined != this.Value.Italic ? this.Value.Italic : undefined );

        if ( undefined != Value )
            this.Value.Italic = Value;
        else
            this.Value.Italic = undefined;

        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Italic, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
       // History.Add( this, { Type : historyitem_TextPr_Italic, New : Value, Old : OldValue } );
    },

    Set_Strikeout : function(Value)
    {
        var OldValue = ( undefined != this.Value.Strikeout ? this.Value.Strikeout : undefined );

        if ( undefined != Value )
            this.Value.Strikeout = Value;
        else
            this.Value.Strikeout = undefined;

        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Strikeout, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
        //History.Add( this, { Type : historyitem_TextPr_Strikeout, New : Value, Old : OldValue } );
    },

    Set_Underline : function(Value)
    {
        var OldValue = ( undefined != this.Value.Underline ? this.Value.Underline : undefined );

        if ( undefined != Value )
            this.Value.Underline = Value;
        else
            this.Value.Underline = undefined;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Underline, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
        //History.Add( this, { Type : historyitem_TextPr_Underline, New : Value, Old : OldValue } );
    },

    Set_FontFamily : function(Value)
    {
        var OldValue = ( undefined != this.Value.FontFamily ? this.Value.FontFamily : undefined );
        OldValue = isRealObject(this.Value.FontFamily) ? this.Value.FontFamily.Name : undefined;
        var newValue = isRealObject(Value) ? Value.Name : undefined;
        if ( undefined != Value )
            this.Value.FontFamily = Value;
        else
            this.Value.FontFamily = undefined;


     /*   History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_FontFamily, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, newValue))); */
       // History.Add( this, { Type : historyitem_TextPr_FontFamily, New : Value, Old : OldValue } );
    },

    Set_FontSize : function(Value)
    {
        var OldValue = ( undefined != this.Value.FontSize ? this.Value.FontSize : undefined );

        if ( undefined != Value )
            this.Value.FontSize = Value;
        else
            this.Value.FontSize = undefined;


        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_FontSize, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
       // History.Add( this, { Type : historyitem_TextPr_FontSize, New : Value, Old : OldValue } );
    },

    Set_Color : function(Value)
    {
        var OldValue = ( undefined != this.Value.Color ? this.Value.Color : undefined );

        var oldValue = null;
        if(isRealObject(this.Value.Color))
        {
            oldValue = this.Value.Color.r*256*256 + this.Value.Color.g*256 + this.Value.Color.b;
        }
        var newValue = null;
        if(isRealObject(Value))
        {
            newValue = Value.r*256*256 + Value.g*256 + Value.b
        }
        if ( undefined != Value )
            this.Value.Color = Value;
        else
            this.Value.Color = undefined;

        /*History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Color, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));*/
        //History.Add( this, { Type : historyitem_TextPr_Color, New : Value, Old : OldValue } );
    },

    Set_VertAlign : function(Value)
    {
        var OldValue = ( undefined != this.Value.VertAlign ? this.Value.VertAlign : undefined );

        if ( undefined != Value )
            this.Value.VertAlign = Value;
        else
            this.Value.VertAlign = undefined;

        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_VertAlign, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
        //History.Add( this, { Type : historyitem_TextPr_VertAlign, New : Value, Old : OldValue } );
    },

    Set_HighLight : function(Value)
    {
        var OldValue = ( undefined != this.Value.HighLight ? this.Value.HighLight : undefined );

        if ( undefined != Value )
            this.Value.HighLight = Value;
        else
            this.Value.HighLight = undefined;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_HighLight, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
        //History.Add( this, { Type : historyitem_TextPr_HighLight, New : Value, Old : OldValue } );
    },

    Set_RStyle : function(Value)
    {
        var OldValue = ( undefined != this.Value.RStyle ? this.Value.RStyle : undefined );

        if ( undefined != Value )
            this.Value.RStyle = Value;
        else
            this.Value.RStyle = undefined;

        History.Add( this, { Type : historyitem_TextPr_RStyle, New : Value, Old : OldValue } );
    },

    Set_Spacing : function(Value)
    {
        var OldValue = ( undefined != this.Value.Spacing ? this.Value.Spacing : undefined );

        if ( undefined != Value )
            this.Value.Spacing = Value;
        else
            this.Value.Spacing = undefined;

        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Spacing, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
        //History.Add( this, { Type : historyitem_TextPr_Spacing, New : Value, Old : OldValue } );
    },

    Set_DStrikeout : function(Value)
    {
        var OldValue = ( undefined != this.Value.DStrikeout ? this.Value.DStrikeout : undefined );

        if ( undefined != Value )
            this.Value.DStrikeout = Value;
        else
            this.Value.DStrikeout = undefined;

        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_DStrikeout, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
       // History.Add( this, { Type : historyitem_TextPr_DStrikeout, New : Value, Old : OldValue } );
    },

    Set_Caps : function(Value)
    {
        var OldValue = ( undefined != this.Value.Caps ? this.Value.Caps : undefined );

        if ( undefined != Value )
            this.Value.Caps = Value;
        else
            this.Value.Caps = undefined;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Caps, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
        //History.Add( this, { Type : historyitem_TextPr_Caps, New : Value, Old : OldValue } );
    },

    Set_SmallCaps : function(Value)
    {
        var OldValue = ( undefined != this.Value.SmallCaps ? this.Value.SmallCaps : undefined );

        if ( undefined != Value )
            this.Value.SmallCaps = Value;
        else
            this.Value.SmallCaps = undefined;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_SmallCaps, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
       // History.Add( this, { Type : historyitem_TextPr_SmallCaps, New : Value, Old : OldValue } );
    },

    Set_Position : function(Value)
    {
        var OldValue = ( undefined != this.Value.Position ? this.Value.Position : undefined );

        if ( undefined != Value )
            this.Value.Position = Value;
        else
            this.Value.Position = undefined;

        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Position, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(OldValue, Value)));
        //History.Add( this, { Type : historyitem_TextPr_Position, New : Value, Old : OldValue } );
    },

    SetThemeFont: function(value)
    {
        var oldValue = this.Value.themeFont;
        var newValue = value;
        this.Value.themeFont = value;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_ThemeFont, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
    },

    SetUniFill: function(value)
    {
        var oldValue = isRealObject(this.Value.unifill) ? this.Value.unifill.Get_Id() : null;
        var newValue =  isRealObject(value) ? value.Get_Id() : null;
        this.Value.unifill = value;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_UniFill, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
    },

    Set_Value : function(Value)
    {
        if(isRealObject(Value))
        {
            this.Set_Bold(Value.Bold);
            this.Set_Italic(Value.Italic);
            this.Set_Strikeout(Value.Strikeout);
            this.Set_Underline(Value.Underline);
            this.Set_FontFamily(Value.FontFamily);
            this.SetThemeFont(Value.themeFont);
            this.Set_Color(Value.Color);
            this.SetUniFill(isRealObject(Value.unifill) ? Value.unifill.Copy() : undefined);
            this.Set_FontSize(Value.FontSize);
            this.Set_VertAlign(Value.VertAlign);
            this.Set_HighLight(Value.HighLight);
            this.Set_Spacing(Value.Spacing);
            this.Set_DStrikeout(Value.DStrikeout);
            this.Set_Caps(Value.Caps);
            this.Set_SmallCaps(Value.SmallCaps);
            this.Set_Position(Value.Position);
            this.Set_RFonts(Value.RFonts);
        }

        /*this.Bold       = undefined; // Жирный текст
        this.Italic     = undefined; // Наклонный текст
        this.Strikeout  = undefined; // Зачеркивание
        this.Underline  = undefined;
        this.FontFamily = undefined;
        this.themeFont  = undefined;
        this.unifill    = undefined;
        this.FontSize   = undefined;
        this.Color      = undefined;
        this.VertAlign  = undefined;
        this.HighLight  = undefined; // highlight_None/Color
        this.RStyle     = undefined;
        this.Spacing    = undefined; // Дополнительное расстояние между символвами
        this.DStrikeout = undefined; // Двойное зачеркивание
        this.Caps       = undefined;
        this.SmallCaps  = undefined;
        this.Position   = undefined; // Смещение по Y

        this.RFonts     = new CRFonts();
        this.BoldCS     = undefined;
        this.ItalicCS   = undefined;
        this.FontSizeCS = undefined;
        this.CS         = undefined;
        this.RTL        = undefined;
        this.Lang       = new CLang();
        var OldValue = this.Value;
        this.Value = Value;

        History.Add(g_oUndoRedoGraphicObjects, historyitem_TextPr_Position, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(new UndoRedoOldValue, Value)));
        History.Add( this, { Type : historyitem_TextPr_Value, New : Value, Old : OldValue } ); */
    },

    Set_RFonts : function(Value)
    {
        var OldValue = this.Value;
        if ( undefined != Value )
            this.Value.RFonts = Value;
        else
            this.Value.RFonts = new CRFonts();

       // History.Add( this, { Type : historyitem_TextPr_RFonts, New : Value, Old : OldValue } );
    },

    Set_Lang : function(Value)
    {
        var OldValue = this.Value;

        var NewValue = new CLang();
        if ( undefined != Value )
            NewValue.Set_FromObject( Value );

        this.Value.Lang = NewValue;

        //History.Add( this, { Type : historyitem_TextPr_Lang, New : NewValue, Old : OldValue } );
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Type, Data)
    {

        switch ( Type )
        {
            case historyitem_TextPr_ThemeFont:
            {
                this.Value.themeFont = Data.oldValue;
                break;
            }

            case historyitem_TextPr_UniFill:
            {
                this.Value.unifill = g_oTableId.Get_ById(Data.oldValue);
                break;
            }
            case historyitem_TextPr_Change:
            {
                if ( undefined != Data.Old )
                    this.Value[Data.Prop] = Data.Old;
                else
                    this.Value[Data.Prop] = undefined;

                break;
            }

            case historyitem_TextPr_Bold:
            {
                if ( undefined != Data.oldValue )
                    this.Value.Bold = Data.oldValue;
                else
                    this.Value.Bold = undefined;

                break;
            }

            case historyitem_TextPr_Italic:
            {
                if ( undefined != Data.oldValue )
                    this.Value.Italic = Data.oldValue;
                else
                    this.Value.Italic = undefined;

                break;
            }

            case historyitem_TextPr_Strikeout:
            {
                if ( undefined != Data.oldValue )
                    this.Value.Strikeout = Data.oldValue;
                else
                    this.Value.Strikeout = undefined;

                break;
            }

            case historyitem_TextPr_Underline:
            {
                if ( undefined != Data.oldValue )
                    this.Value.Underline = Data.oldValue;
                else
                    this.Value.Underline = undefined;

                break;
            }

            case historyitem_TextPr_FontFamily:
            {
                if ( undefined != Data.oldValue )
                {
                    if(!isRealObject(this.Value.FontFamily))
                        this.Value.FontFamily = {Name: undefined, Index: -1};
                    this.Value.FontFamily.Name = Data.oldValue;
                }
                else
                    this.Value.FontFamily = undefined;

                break;
            }

            case historyitem_TextPr_FontSize:
            {
                if ( undefined != Data.oldValue )
                    this.Value.FontSize = Data.oldValue;
                else
                    this.Value.FontSize = undefined;

                break;
            }

            case historyitem_TextPr_Color:
            {
                if ( undefined != Data.oldValue )
                    this.Value.Color = Data.oldValue;
                else
                    this.Value.Color = undefined;

                break;
            }

            case historyitem_TextPr_VertAlign:
            {
                if ( undefined != Data.oldValue )
                    this.Value.VertAlign = Data.oldValue;
                else
                    this.Value.VertAlign = undefined;

                break;
            }

            case historyitem_TextPr_HighLight:
            {
                if ( undefined != Data.oldValue )
                    this.Value.HighLight = Data.oldValue;
                else
                    this.Value.HighLight = undefined;

                break;
            }

            case historyitem_TextPr_RStyle:
            {
                if ( undefined != Data.oldValue )
                    this.Value.RStyle = Data.oldValue;
                else
                    this.Value.RStyle = undefined;

                break;
            }

            case historyitem_TextPr_Spacing:
            {
                if ( undefined != Data.oldValue )
                    this.Value.Spacing = Data.oldValue;
                else
                    this.Value.Spacing = undefined;

                break;
            }
            case historyitem_TextPr_DStrikeout:
            {
                if ( undefined != Data.oldValue )
                    this.Value.DStrikeout = Data.oldValue;
                else
                    this.Value.DStrikeout = undefined;

                break;
            }
            case historyitem_TextPr_Caps:
            {
                if ( undefined != Data.oldValue )
                    this.Value.Caps = Data.oldValue;
                else
                    this.Value.Caps = undefined;

                break;
            }
            case historyitem_TextPr_SmallCaps:
            {
                if ( undefined != Data.oldValue )
                    this.Value.SmallCaps = Data.oldValue;
                else
                    this.Value.SmallCaps = undefined;

                break;
            }

            case historyitem_TextPr_Position:
            {
                if ( undefined != Data.oldValue )
                    this.Value.Position = Data.oldValue;
                else
                    this.Value.Position = undefined;

                break;
            }

            case historyitem_TextPr_Value:
            {
                this.Value = Data.Old;

                break;
            }

            case historyitem_TextPr_RFonts:
            {
                if ( undefined != Data.oldValue )
                    this.Value = Data.oldValue;
                else
                    this.Value = new CRFonts();

                break;
            }

            case historyitem_TextPr_Lang:
            {
                if ( undefined != Data.oldValue )
                    this.Value = Data.oldValue;
                else
                    this.Value = new CLang();

                break;
            }
            case historyitem_AutoShapes_AddParent:
            {
                this.Parent = g_oTableId.Get_ById(Data.oldValue);
                break;
            }
        }
    },

    Redo : function(Type, Data)
    {

        switch ( Type )
        {
            case historyitem_TextPr_ThemeFont:
            {
                this.Value.themeFont = Data.newValue;
                break;
            }

            case historyitem_TextPr_UniFill:
            {
                this.Value.unifill = g_oTableId.Get_ById(Data.newValue);
                break;
            }
            case historyitem_AutoShapes_AddParent:
            {
                this.Parent = g_oTableId.Get_ById(Data.newValue);
                break;
            }
            case historyitem_TextPr_Change:
            {
                if ( undefined != Data.New )
                    this.Value[Data.Prop] = Data.New;
                else
                    this.Value[Data.Prop] = undefined;

                break;
            }

            case historyitem_TextPr_Bold:
            {
                if ( undefined != Data.newValue )
                    this.Value.Bold = Data.newValue;
                else
                    this.Value.Bold = undefined;

                break;
            }

            case historyitem_TextPr_Italic:
            {
                if ( undefined != Data.newValue )
                    this.Value.Italic = Data.newValue;
                else
                    this.Value.Italic = undefined;

                break;
            }

            case historyitem_TextPr_Strikeout:
            {
                if ( undefined != Data.newValue )
                    this.Value.Strikeout = Data.newValue;
                else
                    this.Value.Strikeout = undefined;

                break;
            }

            case historyitem_TextPr_Underline:
            {
                if ( undefined != Data.newValue )
                    this.Value.Underline = Data.newValue;
                else
                    this.Value.Underline = undefined;

                break;
            }

            case historyitem_TextPr_FontFamily:
            {
                if ( undefined != Data.newValue )
                {
                    this.Value.FontFamily ={Name: Data.newValue, Index: -1};

                }
                else
                    this.Value.FontFamily = undefined;

                break;
            }

            case historyitem_TextPr_FontSize:
            {
                if ( undefined != Data.newValue )
                    this.Value.FontSize = Data.newValue;
                else
                    this.Value.FontSize = undefined;

                break;
            }

            case historyitem_TextPr_Color:
            {
                if ( undefined != Data.newValue )
                    this.Value.Color = Data.newValue;
                else
                    this.Value.Color = undefined;

                break;
            }

            case historyitem_TextPr_VertAlign:
            {
                if ( undefined != Data.newValue )
                    this.Value.VertAlign = Data.newValue;
                else
                    this.Value.VertAlign = undefined;

                break;
            }

            case historyitem_TextPr_HighLight:
            {
                if ( undefined != Data.newValue )
                    this.Value.HighLight = Data.newValue;
                else
                    this.Value.HighLight = undefined;

                break;
            }

            case historyitem_TextPr_RStyle:
            {
                if ( undefined != Data.newValue )
                    this.Value.RStyle = Data.newValue;
                else
                    this.Value.RStyle = undefined;

                break;
            }

            case historyitem_TextPr_Spacing:
            {
                if ( undefined != Data.newValue )
                    this.Value.Spacing = Data.newValue;
                else
                    this.Value.Spacing = undefined;

                break;
            }

            case historyitem_TextPr_DStrikeout:
            {
                if ( undefined != Data.newValue )
                    this.Value.DStrikeout = Data.newValue;
                else
                    this.Value.DStrikeout = undefined;

                break;
            }

            case historyitem_TextPr_Caps:
            {
                if ( undefined != Data.newValue )
                    this.Value.Caps = Data.newValue;
                else
                    this.Value.Caps = undefined;

                break;
            }

            case historyitem_TextPr_SmallCaps:
            {
                if ( undefined != Data.newValue )
                    this.Value.SmallCaps = Data.newValue;
                else
                    this.Value.SmallCaps = undefined;

                break;
            }

            case historyitem_TextPr_Position:
            {
                if ( undefined != Data.newValue )
                    this.Value.Position = Data.newValue;
                else
                    this.Value.Position = undefined;

                break;
            }

            case historyitem_TextPr_Value:
            {
                this.Value = Data.New;

                break;
            }

            case historyitem_TextPr_RFonts:
            {
                if ( undefined != Data.newValue )
                    this.Value = Data.newValue;
                else
                    this.Value = new CRFonts();

                break;
            }

            case historyitem_TextPr_Lang:
            {
                if ( undefined != Data.newValue )
                    this.Value = Data.newValue;
                else
                    this.Value = new CLang();

                break;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        if ( null != this.Parent )
            return this.Parent.Get_ParentObject_or_DocumentPos();
    },

    Refresh_RecalcData : function(Data)
    {
        if ( undefined !== this.Parent && null !== this.Parent )
            this.Parent.Refresh_RecalcData2();
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : Id

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_TextPr );

        // Long   : Type
        // String : Id
        // Long   : Value

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
        this.Value.Write_ToBinary( Writer );
    },

    Read_FromBinary2 : function(Reader)
    {
        this.Type = Reader.GetLong();
        this.Id   = Reader.GetString2();

        this.Value.Clear();
        this.Value.Read_FromBinary( Reader );
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_TextPr );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_TextPr_Change:
            {
                // Variable : TextPr

                var TextPr = new CTextPr();
                TextPr[Data.Prop] = Data.New;
                TextPr.Write_ToBinary( Writer );

                break;
            }

            case historyitem_TextPr_Bold:
            case historyitem_TextPr_Italic:
            case historyitem_TextPr_Strikeout:
            case historyitem_TextPr_Underline:
            {
                // Bool : IsUndefined
                // Bool : Value

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_TextPr_FontFamily:
            {
                // Bool   : IsUndefined
                // String : FontName

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteString2( Data.New.Name );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_TextPr_FontSize:
            {
                // Bool   : IsUndefined
                // Double : FontSize

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteDouble( Data.New );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_TextPr_Color:
            {
                // Bool     : IsUndefined
                // Variable : Color (CDocumentColor)

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_TextPr_VertAlign:
            {
                // Bool  : IsUndefined
                // Long  : VertAlign

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteLong(Data.New);
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_TextPr_HighLight:
            {
                // Bool  : IsUndefined
                // Если false
                //   Bool  : IsNone
                //   Если false
                //     Variable : Color (CDocumentColor)

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    if ( highlight_None != Data.New )
                    {
                        Writer.WriteBool( false );
                        Data.New.Write_ToBinary( Writer );
                    }
                    else
                        Writer.WriteBool( true );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_TextPr_RStyle:
            {
                // Bool : IsUndefined
                // Если false
                //   String : RStyle

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteString2( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_TextPr_Spacing:
            case historyitem_TextPr_Position:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Spacing

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteDouble( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_TextPr_DStrikeout:
            case historyitem_TextPr_Caps:
            case historyitem_TextPr_SmallCaps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : value

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_TextPr_Value:
            {
                // CTextPr
                Data.New.Write_ToBinary(Writer)

                break;
            }

            case historyitem_TextPr_RFonts:
            {
                // Bool : undefined ?
                // false -> CRFonts
                if ( undefined != Data.Old )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case historyitem_TextPr_Lang:
            {
                // Bool : undefined ?
                // false -> CLang
                if ( undefined != Data.Old )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );

                break;
            }
        }

        return Writer;
    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_TextPr != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_TextPr_Change:
            {
                // Variable : TextPr

                var TextPr = new CTextPr();
                TextPr.Read_FromBinary( Reader );
                this.Value.Merge( TextPr );

                break;
            }

            case historyitem_TextPr_Bold:
            {
                // Bool : IsUndefined
                // Bool : Bold

                if ( true === Reader.GetBool() )
                    this.Value.Bold = undefined;
                else
                    this.Value.Bold = Reader.GetBool();

                break;
            }

            case historyitem_TextPr_Italic:
            {
                // Bool : IsUndefined
                // Bool : Italic

                if ( true === Reader.GetBool() )
                    this.Value.Italic = undefined;
                else
                    this.Value.Italic = Reader.GetBool();

                break;
            }

            case historyitem_TextPr_Strikeout:
            {
                // Bool : IsUndefined
                // Bool : Strikeout

                if ( true === Reader.GetBool() )
                    this.Value.Strikeout = undefined;
                else
                    this.Value.Strikeout = Reader.GetBool();

                break;
            }

            case historyitem_TextPr_Underline:
            {
                // Bool   : IsUndefined?
                // Bool   : Underline

                if ( true != Reader.GetBool() )
                    this.Value.Underline = Reader.GetBool();
                else
                    this.Value.Underline = undefined;

                break;
            }

            case historyitem_TextPr_FontFamily:
            {
                // Bool   : IsUndefined
                // String : FontName

                if ( true != Reader.GetBool() )
                {
                    this.Value.FontFamily =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Value.FontFamily = undefined;

                break;
            }

            case historyitem_TextPr_FontSize:
            {
                // Bool   : IsUndefined
                // Double : FontSize

                if ( true != Reader.GetBool() )
                    this.Value.FontSize = Reader.GetDouble();
                else
                    this.Value.FontSize = undefined;

                break;
            }

            case historyitem_TextPr_Color:
            {
                // Bool     : IsUndefined
                // Variable : Color (CDocumentColor)

                if ( true != Reader.GetBool() )
                {
                    var r = Reader.GetByte();
                    var g = Reader.GetByte();
                    var b = Reader.GetByte();
                    this.Value.Color = new CDocumentColor( r, g, b );
                }
                else
                    this.Value.Color = undefined;

                break;
            }

            case historyitem_TextPr_VertAlign:
            {
                // Bool  : IsUndefined
                // Long  : VertAlign

                if ( true != Reader.GetBool() )
                    this.Value.VertAlign = Reader.GetLong();
                else
                    this.Value.VertAlign = undefined;

                break;
            }

            case historyitem_TextPr_HighLight:
            {
                // Bool  : IsUndefined
                // Если false
                //   Bool  : IsNull
                //   Если false
                //     Variable : Color (CDocumentColor)

                if ( true != Reader.GetBool() )
                {
                    if ( true != Reader.GetBool() )
                    {
                        this.Value.HighLight = new CDocumentColor(0,0,0);
                        this.Value.HighLight.Read_FromBinary(Reader);
                    }
                    else
                        this.Value.HighLight = highlight_None;
                }
                else
                    this.Value.HighLight = undefined;

                break;
            }

            case historyitem_TextPr_RStyle:
            {
                // Bool : IsUndefined
                // Если false
                //   String : RStyle

                if ( true != Reader.GetBool() )
                    this.Value.RStyle = Reader.GetString2();
                else
                    this.Value.RStyle = undefined;

                break;
            }

            case historyitem_TextPr_Spacing:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Spacing

                if ( true != Reader.GetBool() )
                    this.Value.Spacing = Reader.GetDouble();
                else
                    this.Value.Spacing = undefined;

                break;
            }

            case historyitem_TextPr_DStrikeout:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : DStrikeout

                if ( true != Reader.GetBool() )
                    this.Value.DStrikeout = Reader.GetBool();
                else
                    this.Value.DStrikeout = undefined;

                break;
            }

            case historyitem_TextPr_Caps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : Caps

                if ( true != Reader.GetBool() )
                    this.Value.Caps = Reader.GetBool();
                else
                    this.Value.Caps = undefined;

                break;
            }

            case historyitem_TextPr_SmallCaps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : SmallCaps

                if ( true != Reader.GetBool() )
                    this.Value.SmallCaps = Reader.GetBool();
                else
                    this.Value.SmallCaps = undefined;

                break;
            }

            case historyitem_TextPr_Position:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Position

                if ( true != Reader.GetBool() )
                    this.Value.Position = Reader.GetDouble();
                else
                    this.Value.Position = undefined;

                break;
            }

            case historyitem_TextPr_Value:
            {
                // CTextPr
                this.Value = new CTextPr();
                this.Value.Read_FromBinary( Reader );

                break;
            }

            case historyitem_TextPr_RFonts:
            {
                // Bool : undefined ?
                // false -> CRFonts
                if ( false === Reader.GetBool() )
                {
                    this.Value.RFonts = new CRFonts();
                    this.Value.RFonts.Read_FromBinary( Reader );
                }
                else
                    this.Value.RFonts = new CRFonts();

                break;
            }

            case historyitem_TextPr_Lang:
            {
                // Bool : undefined ?
                // false -> Lang
                if ( false === Reader.GetBool() )
                {
                    this.Value.Lang = new CLang();
                    this.Value.Lang.Read_FromBinary( Reader );
                }
                else
                    this.Value.Lang = new CLang();

                break;
            }
        }
    },

    writeToBinary: function(w)
    {
        this.Write_ToBinary2(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary2(r);
    }
};

// Класс окончание параграфа ParaEnd
function ParaEnd()
{
    this.Type = para_End;
}

ParaEnd.prototype =
{
    getValue: function()
    {
        return undefined;
    },
    Draw : function(X,Y,Context, bEndCell)
    {
       /* Context.SetFontSlot( fontslot_ASCII );
        
        if ( editor.ShowParaMarks )
        {
            if ( true === bEndCell )
                Context.FillText( X, Y, String.fromCharCode( 0x00A4 ) );
            else
                Context.FillText( X, Y, String.fromCharCode( 0x00B6 ) );
        } */
    },

    Measure : function(Context, bEndCell)
    {
        this.Width  = 0;
        this.Height = 0;

        Context.SetFontSlot( fontslot_ASCII );

        if ( true === bEndCell )
            this.WidthVisible = Context.Measure( String.fromCharCode( 0x00A4 ) ).Width;
        else
            this.WidthVisible = Context.Measure( String.fromCharCode( 0x00B6 ) ).Width;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaEnd();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    },



    writeToBinary: function(w)
    {
        this.Write_ToBinary(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary(r);
    }

};

// Класс ParaNewLine
function ParaNewLine(BreakType)
{
    this.Type = para_NewLine;
    this.BreakType = BreakType;

    this.Flags = new Object(); // специальные флаги для разных break

    if ( break_Page === this.BreakType )
        this.Flags.NewLine = true;
}

ParaNewLine.prototype =
{

    getValue: function()
    {
        return this.BreakType;
    },
    Draw : function(X,Y,Context)
    {
        if (false/* editor.ShowParaMarks*/ )
        {
            switch( this.BreakType )
            {
                case break_Line:
                {
                    Context.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                    Context.FillText( X, Y, String.fromCharCode( 0x0038/*0x21B5*/ ) );
                    break;
                }
                case break_Page:
                {
                    var PageBreak_String = "";
                    for ( var Index = 0; Index < 41; Index++ )
                    {
                        if ( 20 != Index )
                            PageBreak_String += String.fromCharCode("0x00B7");
                        else
                            PageBreak_String += "PageBreak";
                    }

                    var OldColor = Common_CopyObj( Context.m_oBrush.Color1 );
                    Context.b_color1( 0, 0 , 0, 255);

                    g_oTextMeasurer.SetFont( {FontFamily: { Name : "Arial", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                    Context.SetFont( {FontFamily: { Name : "Arial", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                    for ( var Index = 0; Index < PageBreak_String.length; Index++ )
                    {
                        Context.FillText( X, Y, PageBreak_String[Index] );
                        X += g_oTextMeasurer.Measure( PageBreak_String[Index] ).Width;
                    }

                    Context.b_color1( OldColor.R, OldColor.G, OldColor.B, OldColor.A);
                    break;
                }
            }
        }
    },

    Measure : function(Context)
    {
        switch( this.BreakType )
        {
            case break_Line:
            {
                this.Width  = 0;
                this.Height = 0;

                Context.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                var Temp = Context.Measure( String.fromCharCode( 0x0038 ) );

                // Почему-то в шрифте Wingding 3 символ 0x0038 имеет неправильную ширину
                this.WidthVisible = Temp.Width * 1.7;

                break;
            }
            case break_Page:
            {
                this.Width        = 0;
                this.Height       = 0;

                var PageBreak_String = "";
                for ( var Index = 0; Index < 41; Index++ )
                {
                    if ( 20 != Index )
                        PageBreak_String += String.fromCharCode("0x00B7");
                    else
                        PageBreak_String += "PageBreak";
                }

                var oldFont = g_oTextMeasurer.GetFont();
                g_oTextMeasurer.SetFont( {FontFamily: { Name : "Arial", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                var W = 0;
                for ( var Index = 0; Index < PageBreak_String.length; Index++ )
                    W += g_oTextMeasurer.Measure( PageBreak_String[Index] ).Width;
                g_oTextMeasurer.SetFont( oldFont );

                this.WidthVisible = W;

                break;
            }
        }
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaNewLine(this.BreakType);
    },

    // Функция проверяет особый случай, когда у нас PageBreak, после которого в параграфе ничего не идет
    Is_NewLine : function()
    {
        if ( break_Line === this.BreakType || ( break_Page === this.BreakType && true === this.Flags.NewLine ) )
            return true;

        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // Long   : BreakType
        // Optional :
        // Long   : Flags (breakPage)
        Writer.WriteLong( this.Type );
        Writer.WriteLong( this.BreakType );

        if ( break_Page === this.BreakType )
        {
            Writer.WriteBool( this.Flags.NewLine );
        }
    },

    Read_FromBinary : function(Reader)
    {
        this.BreakType = Reader.GetLong();

        if ( break_Page === this.BreakType )
            this.Flags = { NewLine : Reader.GetBool() };
    },



    writeToBinary: function(w)
    {
        this.Write_ToBinary(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary(r);
    }
};

// Класс ParaNewLineRendered
function ParaNewLineRendered()
{
    this.Type = para_NewLineRendered;
}

ParaNewLineRendered.prototype =
{
    getValue: function()
    {
        return undefined;
    },
    Draw : function()//(X,Y,Context)
    {
        // Ничего не делаем
    },

    Measure : function()//(Context)
    {
        this.Width  = 0;
        this.Height = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    },



    writeToBinary: function(w)
    {
        this.Write_ToBinary(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary(r);
    }
};

// Класс ParaInlineBreak
function ParaInlineBreak()
{
    this.Type = para_InlineBreak;
}

ParaInlineBreak.prototype =
{

    getValue: function()
    {
        return undefined;
    },
    Draw : function()
    {
        // Ничего не делаем
    },

    Measure : function()
    {
        this.Width  = 0;
        this.Height = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    },



    writeToBinary: function(w)
    {
        this.Write_ToBinary(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary(r);
    }
};

// Класс ParaPageBreakRenderer
function ParaPageBreakRenderer()
{
    this.Type = para_PageBreakRendered;
}

ParaPageBreakRenderer.prototype =
{

    getValue: function()
    {
        return undefined;
    },
    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    },



    writeToBinary: function(w)
    {
        this.Write_ToBinary(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary(r);
    }
};

// Класс ParaEmpty
function ParaEmpty(bDelete)
{
    this.Type = para_Empty;

    this.NeedToDelete = false; // Нужно ли удалить данный элемент при пересчете параграфа

    if ( "undefined" != typeof(bDelete) && null != bDelete )
        this.NeedToDelete = bDelete;
}

ParaEmpty.prototype =
{
    getValue: function()
    {
        return this.NeedToDelete;
    },
    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaEmpty(this.NeedToDelete);
    },

    Check_Delete : function()
    {
        return this.NeedToDelete;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // Bool   : NeedToDelete
        Writer.WriteLong( this.Type );
        Writer.WriteBool( this.NeedToDelete );
    },

    Read_FromBinary : function(Reader)
    {
        this.NeedToDelete = Reader.GetBool();
    },



    writeToBinary: function(w)
    {
        this.Write_ToBinary(w)
    },

    readFromBinary: function(r)
    {
        this.Read_FromBinary(r);
    }
};


// Класс ParaNumbering
function ParaNumbering()
{
    this.Type = para_Numbering;

    this.Internal =
    {
        NumInfo : undefined
    };
}

ParaNumbering.prototype =
{
    getValue: function()
    {
        return undefined;
    },
    Draw : function(X,Y,Context, Numbering, TextPr, NumPr)
    {
        Numbering.Draw( NumPr.NumId, NumPr.Lvl, X, Y, Context, this.Internal.NumInfo, TextPr );
    },

    Measure : function (Context, Numbering, NumInfo, TextPr, NumPr)
    {
        this.Internal.NumInfo = NumInfo;

        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
        this.WidthNum     = 0;
        this.WidthSuff    = 0;

        if ( undefined === Numbering )
            return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };

        var Temp = Numbering.Measure( NumPr.NumId, NumPr.Lvl, Context, NumInfo, TextPr );
        this.Width        = Temp.Width;
        this.WidthVisible = Temp.Width;
        this.WidthNum     = Temp.Width;
        this.WidthSuff    = 0;
        this.Height       = Temp.Ascent; // Это не вся высота, а только высота над BaseLine
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaNumbering();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    }
};

// TODO: Реализовать табы правые, центральные, по точке и с чертой.
var tab_Clear  = 0x00;
var tab_Left   = 0x01;
var tab_Right  = 0x02;
var tab_Center = 0x03;

var tab_Symbol = 0x0022;//0x2192;

// Класс ParaTab
function ParaTab()
{
    this.Type = para_Tab;

    this.TabType = tab_Left;
}

ParaTab.prototype =
{
    getValue: function()
    {
        return undefined;
    },
    Draw : function(X,Y,Context)
    {
        /*if ( editor.ShowParaMarks )
        {
            var X0 = this.Width / 2 - this.RealWidth / 2;

            Context.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );

            if ( X0 > 0 )
                Context.FillText2( X + X0, Y, String.fromCharCode( tab_Symbol ), 0, this.Width );
            else
                Context.FillText2( X, Y, String.fromCharCode( tab_Symbol ), this.RealWidth - this.Width, this.Width );
        }       */
    },

    Measure : function (Context)
    {
        Context.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
        this.RealWidth = Context.Measure( String.fromCharCode( tab_Symbol ) ).Width;

        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaTab();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // Long   : TabType
        Writer.WriteLong( this.Type );
        Writer.WriteLong( this.TabType );
    },

    Read_FromBinary : function(Reader)
    {
        this.TabType = Reader.GetLong();
    }
};

var drawing_Inline = 0x01;
var drawing_Anchor = 0x02;

function CAnchorPosition()
{
    // Рассчитанные координаты
    this.CalcX         = 0;
    this.CalcY         = 0;

    // Данные для Inline-объектов
    this.YOffset       = 0;

    // Данные для Flow-объектов
    this.W             = 0;
    this.H             = 0;
    this.X             = 0;
    this.Y             = 0;
    this.PageNum       = 0;
    this.LastItemW     = 0;
    this.ColumnStartX  = 0;
    this.ColumnEndX    = 0;
    this.Left_Margin   = 0;
    this.Right_Margin  = 0;
    this.Page_W        = 0;
    this.Top_Margin    = 0;
    this.Bottom_Margin = 0;
    this.Page_H        = 0;
    this.Margin_H      = 0;
    this.Margin_V      = 0;
    this.LineTop       = 0;
    this.ParagraphTop  = 0;
}

CAnchorPosition.prototype =
{
    Set : function(W, H, YOffset, X, Y, PageNum, LastItemW, ColumnStartX, ColumnEndX, Left_Margin, Right_Margin, Page_W, Top_Margin, Bottom_Margin, Page_H, MarginH, MarginV, LineTop, ParagraphTop)
    {
        this.W             = W;
        this.H             = H;

        this.YOffset       = YOffset;

        this.X             = X;
        this.Y             = Y;
        this.PageNum       = PageNum;
        this.LastItemW     = LastItemW;
        this.ColumnStartX  = ColumnStartX;
        this.ColumnEndX    = ColumnEndX;
        this.Left_Margin   = Left_Margin;
        this.Right_Margin  = Right_Margin;
        this.Page_W        = Page_W;
        this.Top_Margin    = Top_Margin;
        this.Bottom_Margin = Bottom_Margin;
        this.Page_H        = Page_H;
        this.Margin_H      = MarginH;
        this.Margin_V      = MarginV;
        this.LineTop       = LineTop;
        this.ParagraphTop  = ParagraphTop;
    },

    Calculate_X : function(bInline, RelativeFrom, bAlign, Value)
    {
        if ( true === bInline )
        {
            this.CalcX = this.X;
        }
        else
        {
            // Вычисляем координату по X
            switch(RelativeFrom)
            {
                case c_oAscRelativeFromH.Character:
                {
                    // Почему то Word при позиционировании относительно символа использует не
                    // текущуюю позицию, а позицию предыдущего элемента (именно для этого мы
                    // храним параметр LastItemW).

                    var _X = this.X - this.LastItemW;

                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = _X - this.W / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = _X;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = _X - this.W;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcX = _X + Value;

                    break;
                }

                case c_oAscRelativeFromH.Column:
                {
                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (this.ColumnEndX + this.ColumnStartX - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = this.ColumnStartX;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = this.ColumnEndX - this.W;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcX = this.ColumnStartX + Value;

                    break;
                }

                case c_oAscRelativeFromH.InsideMargin:
                case c_oAscRelativeFromH.LeftMargin:
                case c_oAscRelativeFromH.OutsideMargin:
                {
                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (this.Left_Margin - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = 0;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = this.Left_Margin - this.W;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcX = this.Left_Margin + Value;

                    break;
                }

                case c_oAscRelativeFromH.Margin:
                {
                    var X_s = this.Left_Margin;
                    var X_e = this.Page_W - this.Right_Margin;

                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (X_e + X_s - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = X_s;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = X_e - this.W;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcX = this.Margin_H + Value;

                    break;
                }

                case c_oAscRelativeFromH.Page:
                {
                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (this.Page_W - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = 0;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = this.Page_W - this.W;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcX = Value;

                    break;
                }

                case c_oAscRelativeFromH.RightMargin:
                {
                    var X_s = this.Page_W - this.Right_Margin;
                    var X_e = this.Page_W;

                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (X_e + X_s - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = X_s;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = X_e - this.W;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcX = X_s + Value;

                    break;
                }
            }
        }

        return this.CalcX;
    },

    Calculate_Y : function(bInline, RelativeFrom, bAlign, Value)
    {
        if ( true === bInline )
        {
            this.CalcY = this.Y - this.H - this.YOffset;
        }
        else
        {
            // Вычисляем координату по Y
            switch(RelativeFrom)
            {
                case c_oAscRelativeFromV.BottomMargin:
                case c_oAscRelativeFromV.InsideMargin:
                case c_oAscRelativeFromV.OutsideMargin:
                {
                    var _Y = this.Page_H - this.Bottom_Margin;

                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = this.Page_H - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = (_Y + this.Page_H - this.H) / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = _Y;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcY = _Y + Value;

                    break;
                }

                case c_oAscRelativeFromV.Line:
                {
                    var _Y = this.LineTop;

                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = _Y - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = _Y - this.H / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = _Y;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcY = _Y + Value;

                    break;
                }

                case c_oAscRelativeFromV.Margin:
                {
                    var Y_s = this.Top_Margin;
                    var Y_e = this.Page_H - this.Bottom_Margin;

                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = Y_e - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = (Y_s + Y_e - this.H) / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = Y_s;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcY = this.Margin_V + Value;

                    break;
                }

                case c_oAscRelativeFromV.Page:
                {
                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = this.Page_H - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = (this.Page_H - this.H) / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = 0;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcY = Value;

                    break;
                }

                case c_oAscRelativeFromV.Paragraph:
                {
                    // Почему то Word не дает возможности использовать прилегание
                    // относительно абзаца, только абсолютные позиции
                    var _Y = this.ParagraphTop;

                    if ( true === bAlign )
                        this.CalcY = _Y;
                    else
                        this.CalcY = _Y + Value;

                    break;
                }

                case c_oAscRelativeFromV.TopMargin:
                {
                    var Y_s = 0;
                    var Y_e = this.Top_Margin;

                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = Y_e - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = (Y_s + Y_e - this.H) / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = Y_s;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcY = Y_s + Value;

                    break;
                }
            }
        }

        return this.CalcY;
    },

    Correct_Values : function(bInline, PageLimits, AllowOverlap, UseTextWrap, OtherFlowObjects)
    {
        if ( true != bInline )
        {
            var X_min = PageLimits.X;
            var Y_min = PageLimits.Y;
            var X_max = PageLimits.XLimit;
            var Y_max = PageLimits.YLimit;

            var W = this.W;
            var H = this.H;

            var CurX = this.CalcX;
            var CurY = this.CalcY;

            var bBreak = false;
            while ( true != bBreak )
            {
                bBreak = true;
                for ( var Index = 0; Index < OtherFlowObjects.length; Index++ )
                {
                    var Drawing = OtherFlowObjects[Index];
                    if ( ( false === AllowOverlap || false === Drawing.AllowOverlap ) && true === Drawing.Use_TextWrap() && true === UseTextWrap && ( CurX <= Drawing.X + Drawing.W && CurX + W >= Drawing.X && CurY <= Drawing.Y + Drawing.H && CurY + H >= Drawing.Y ) )
                    {
                        // Если убирается справа, размещаем справа от картинки
                        if ( Drawing.X + Drawing.W < X_max - W - 0.001 )
                            CurX = Drawing.X + Drawing.W + 0.001;
                        else
                        {
                            CurX = this.CalcX;
                            CurY = Drawing.Y + Drawing.H + 0.001;
                        }

                        bBreak = false;
                    }
                }
            }

            // Автофигуры с обтеканием за/перед текстом могут лежать где угодно
            if ( true === UseTextWrap )
            {
                // Скорректируем рассчитанную позицию, так чтобы объект не выходил за заданные пределы
                if ( CurX + W > X_max )
                    CurX = X_max - W;

                if ( CurX < X_min )
                    CurX = X_min;

                // Скорректируем рассчитанную позицию, так чтобы объект не выходил за заданные пределы
                if ( CurY + H > Y_max )
                    CurY = Y_max - H;

                if ( CurY < Y_min )
                    CurY = Y_min;
            }

            this.CalcX = CurX;
            this.CalcY = CurY;
        }
    },

    // По значению CalcX получем Value
    Calculate_X_Value : function(RelativeFrom)
    {
        var Value = 0;
        switch(RelativeFrom)
        {
            case c_oAscRelativeFromH.Character:
            {
                // Почему то Word при позиционировании относительно символа использует не
                // текущуюю позицию, а позицию предыдущего элемента (именно для этого мы
                // храним параметр LastItemW).

                Value = this.CalcX - this.X + this.LastItemW;

                break;
            }

            case c_oAscRelativeFromH.Column:
            {
                Value = this.CalcX - this.ColumnStartX;

                break;
            }

            case c_oAscRelativeFromH.InsideMargin:
            case c_oAscRelativeFromH.LeftMargin:
            case c_oAscRelativeFromH.OutsideMargin:
            {
                Value = this.CalcX - this.Left_Margin;

                break;
            }

            case c_oAscRelativeFromH.Margin:
            {
                Value = this.CalcX - this.Margin_H;

                break;
            }

            case c_oAscRelativeFromH.Page:
            {
                Value = this.CalcX;

                break;
            }

            case c_oAscRelativeFromH.RightMargin:
            {
                Value = this.CalcX - this.Page_W + this.Right_Margin;

                break;
            }
        }

        return Value;
    },

    // По значению CalcY и заданному RelativeFrom получем Value
    Calculate_Y_Value : function(RelativeFrom)
    {
        var Value = 0;

        switch(RelativeFrom)
        {
            case c_oAscRelativeFromV.BottomMargin:
            case c_oAscRelativeFromV.InsideMargin:
            case c_oAscRelativeFromV.OutsideMargin:
            {
                Value = this.CalcY - this.Page_H + this.Bottom_Margin;

                break;
            }

            case c_oAscRelativeFromV.Line:
            {
                Value = this.CalcY - this.LineTop;

                break;
            }

            case c_oAscRelativeFromV.Margin:
            {
                Value = this.CalcY - this.Margin_V;

                break;
            }

            case c_oAscRelativeFromV.Page:
            {
                Value = this.CalcY;

                break;
            }

            case c_oAscRelativeFromV.Paragraph:
            {
                Value = this.CalcY - this.ParagraphTop;

                break;
            }

            case c_oAscRelativeFromV.TopMargin:
            {
                Value = this.CalcY;

                break;
            }
        }

        return Value;
    }
};

var WRAPPING_TYPE_NONE = 0x00;
var WRAPPING_TYPE_SQUARE = 0x01;
var WRAPPING_TYPE_THROUGH = 0x02;
var WRAPPING_TYPE_TIGHT = 0x03;
var WRAPPING_TYPE_TOP_AND_BOTTOM = 0x04;

//Horizontal Relative Positioning Types
var HOR_REL_POS_TYPE_CHAR = 0x00;
var HOR_REL_POS_TYPE_COLUMN = 0x01;
var HOR_REL_POS_TYPE_INSIDE_MARGIN = 0x02;
var HOR_REL_POS_TYPE_LEFT_MARGIN = 0x03;
var HOR_REL_POS_TYPE_MARGIN = 0x04;
var HOR_REL_POS_TYPE_OUTSIDE_MARGIN = 0x05;
var HOR_REL_POS_TYPE_PAGE = 0x06;
var HOR_REL_POS_TYPE_RIGHT_MARGIN = 0x07;

//Verical Relative Positioning Types
var VER_REL_POS_TYPE_BOTTOM_MARGIN = 0x00;
var VER_REL_POS_TYPE_INSIDE_MARGIN = 0x01;
var VER_REL_POS_TYPE_LINE = 0x02;
var VER_REL_POS_TYPE_MARGIN = 0x03;
var VER_REL_POS_TYPE_OUTSIDE_MARGIN = 0x04;
var VER_REL_POS_TYPE_PAGE = 0x05;
var VER_REL_POS_TYPE_PARAGRAPH = 0x06;
var VER_REL_POS_TYPE_TOP_MARGIN = 0x07;

//POSITIONING TYPES
var POSITIONING_TYPE_ALIGN = 0x00;
var POSITIONING_TYPE_OFF = 0x01;

var WRAP_HIT_TYPE_POINT = 0x00;
var WRAP_HIT_TYPE_SECTION = 0x01;

// Класс ParaDrawing
function ParaDrawing(W, H, GraphicObj, DrawingDocument, DocumentContent, Parent)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Type = para_Drawing;

    this.Lock = new CLock();
    if ( false === g_oIdCounter.m_bLoad )
    {
        this.Lock.Set_Type( locktype_Mine, false );
        CollaborativeEditing.Add_Unlock2( this );
    }

    this.DrawingType = drawing_Inline;
    this.GraphicObj  = GraphicObj;

    this.X = 0;
    this.Y = 0;
    this.W = W;
    this.H = H;
    this.PageNum = 0;
    this.YOffset = 0;

    this.DocumentContent = DocumentContent;
    this.DrawingDocument = DrawingDocument;
    this.Parent          = Parent;

    this.Focused = false;

    this.ImageTrackType = 1;

    // Расстояние до окружающего текста
    this.Distance =
    {
        T : 0,
        B : 0,
        L : 0,
        R : 0
    };

    // Расположение в таблице
    this.LayoutInCell = true;

    // Z-order
    this.RelativeHeight = undefined;

    //
    this.SimplePos =
    {
        Use : false,
        X   : 0,
        Y   : 0
    };

    // Ширина и высота
    this.Extent =
    {
        W : W,
        H : H
    };

    this.AllowOverlap = true;

    // Позиция по горизонтали
    this.PositionH =
    {
        RelativeFrom      : c_oAscRelativeFromH.Column, // Относительно чего вычисляем координаты
        Align             : false,                      // true : В поле Value лежит тип прилегания, false - в поле Value лежит точное значени
        Value             : 0                           //
    };

    // Позиция по горизонтали
    this.PositionV =
    {
        RelativeFrom      : c_oAscRelativeFromV.Paragraph, // Относительно чего вычисляем координаты
        Align             : false,                         // true : В поле Value лежит тип прилегания, false - в поле Value лежит точное значени
        Value             : 0                              //
    };

    // Данный поля используются для перемещения Flow-объекта
    this.PositionH_Old = undefined;
    this.PositionV_Old = undefined;


    this.Internal_Position = new CAnchorPosition();

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)




    //--------------------------------------------------------
    this.selectX = 0;
    this.selectY = 0;
    this.wrappingType = WRAPPING_TYPE_THROUGH;
    this.wrappingPolygon = new CWrapPolygon(this);

    this.document = editor.WordControl.m_oLogicDocument;
    this.drawingDocument = DrawingDocument;
    this.graphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
    this.mainGraphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
    this.selected = false;

    this.behindDoc = false;

    this.pageIndex = -1;//pageIndex;
    this.absOffsetX = null;
    this.absOffsetY = null;

    this.absExtX = null;
    this.absExtY = null;

    this.absRot = null;

    this.absFlipH = null;
    this.absFlipV = null;

    this.boundsOffsetX = null;
    this.boundsOffsetY = null;

    this.selectionObject = null;

    this.snapArrayX = [];
    this.snapArrayY = [];
    this.setZIndex();
//------------------------------------------------------------
    g_oTableId.Add( this, this.Id );

    this.graphicObjects.addGraphicObject(this);
}


ParaDrawing.prototype =
{

    canRotate: function()
    {
        return isRealObject(this.GraphicObj) && typeof this.GraphicObj.canRotate == "function" && this.GraphicObj.canRotate();
    },

    Get_Props : function(OtherProps)
    {
        // Сначала заполняем свойства

        var Props = new Object();
        Props.Width  = this.GraphicObj.absExtX;
        Props.Height = this.GraphicObj.absExtY;

        if ( drawing_Inline === this.DrawingType )
            Props.WrappingStyle = c_oAscWrapStyle2.Inline;
        else if ( WRAPPING_TYPE_NONE === this.wrappingType )
            Props.WrappingStyle = ( this.behindDoc === true ? c_oAscWrapStyle2.Behind : c_oAscWrapStyle2.InFront );
        else
        {
            switch ( this.wrappingType )
            {
                case WRAPPING_TYPE_SQUARE         : Props.WrappingStyle = c_oAscWrapStyle2.Square; break;
                case WRAPPING_TYPE_TIGHT          : Props.WrappingStyle = c_oAscWrapStyle2.Tight; break;
                case WRAPPING_TYPE_THROUGH        : Props.WrappingStyle = c_oAscWrapStyle2.Through; break;
                case WRAPPING_TYPE_TOP_AND_BOTTOM : Props.WrappingStyle = c_oAscWrapStyle2.TopAndBottom; break;
                default                           : Props.WrappingStyle = c_oAscWrapStyle2.Inline; break;
            }
        }

        Props.Paddings =
        {
            Left   : this.Distance.L,
            Right  : this.Distance.R,
            Top    : this.Distance.T,
            Bottom : this.Distance.B
        };

        Props.AllowOverlap = this.AllowOverlap;

        Props.Position =
        {
            X : this.X,
            Y : this.Y
        };

        Props.PositionH =
        {
            RelativeFrom : this.PositionH.RelativeFrom,
            UseAlign     : this.PositionH.Align,
            Align        : ( true === this.PositionH.Align ? this.PositionH.Value : undefined ),
            Value        : ( true === this.PositionH.Align ? 0 : this.PositionH.Value )
        };

        Props.PositionV =
        {
            RelativeFrom : this.PositionV.RelativeFrom,
            UseAlign     : this.PositionV.Align,
            Align        : ( true === this.PositionV.Align ? this.PositionV.Value : undefined ),
            Value        : ( true === this.PositionV.Align ? 0 : this.PositionV.Value )
        };

        Props.Internal_Position = this.Internal_Position;

        Props.Locked = this.Parent.Lock.Is_Locked();

        //Props.ChartProperties = isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.chart) ? this.GraphicObj.chart.serializeChart() : undefined;

        var dr_objects = editor.WordControl.m_oLogicDocument.DrawingObjects;

        /*if(isRealObject(this.GraphicObj))
        {
            if(this.GraphicObj.isShape() || (this.GraphicObj.isGroup() && this.GraphicObj.haveShapes()))
            {
                Props.ShapeProperties =
                {
                    type: this.GraphicObj.getPresetGeom(),
                    fill: this.GraphicObj.getFill(),
                    stroke: this.GraphicObj.getStroke(),
                    canChangeArrows: this.GraphicObj.canChangeArrows()
                }
            }
            else if(this.GraphicObj.isImage()|| (this.GraphicObj.isGroup() && this.GraphicObj.haveImages()))
            {
                Props.ImageUrl = this.GraphicObj.getImageUrl();
            }
        }    */


        if ( undefined != this.Parent && undefined != this.Parent.Parent && true === this.Parent.Parent.Is_DrawingShape() )
            Props.CanBeFlow = false;

        if ( null != OtherProps && undefined != OtherProps )
        {
            if(OtherProps.ShapeProperties != null)
                Props.ShapeProperties = OtherProps.ShapeProperties;

            if(OtherProps.ChartProperties != null)
                Props.ChartProperties = OtherProps.ChartProperties;

            if(OtherProps.severalCharts != null)
                Props.severalCharts = OtherProps.severalCharts;

            if(OtherProps.severalChartStyles != null)
                Props.severalChartStyles = OtherProps.severalChartStyles;

            if(OtherProps.severalChartTypes != null)
                Props.severalChartTypes = OtherProps.severalChartTypes;

            if(OtherProps.ImageUrl != null)
                Props.ImageUrl = OtherProps.ImageUrl;

            // Соединяем
            if ( undefined === OtherProps.Width || 0.001 > Math.abs( Props.Width - OtherProps.Width ) )
                Props.Width = undefined;

            if ( undefined === OtherProps.Height || 0.001 > Math.abs( Props.Height - OtherProps.Height ) )
                Props.Height = undefined;

            if ( undefined === OtherProps.WrappingStyle || Props.WrappingStyle != OtherProps.WrappingStyle )
                Props.WrappingStyle = undefined;

            if ( undefined === OtherProps.ImageUrl || Props.ImageUrl != OtherProps.ImageUrl )
                Props.ImageUrl = undefined;

            if ( undefined === OtherProps.Paddings.Left || 0.001 > Math.abs( Props.Paddings.Left - OtherProps.Paddings.Left ) )
                Props.Paddings.Left = undefined;

            if ( undefined === OtherProps.Paddings.Right || 0.001 > Math.abs( Props.Paddings.Right - OtherProps.Paddings.Right ) )
                Props.Paddings.Right = undefined;

            if ( undefined === OtherProps.Paddings.Top || 0.001 > Math.abs( Props.Paddings.Top - OtherProps.Paddings.Top ) )
                Props.Paddings.Top = undefined;

            if ( undefined === OtherProps.Paddings.Bottom || 0.001 > Math.abs( Props.Paddings.Bottom - OtherProps.Paddings.Bottom ) )
                Props.Paddings.Bottom = undefined;

            if ( undefined === OtherProps.AllowOverlap || Props.AllowOverlap != OtherProps.AllowOverlap )
                Props.AllowOverlap = undefined;

            if ( undefined === OtherProps.Position.X || 0.001 > Math.abs( Props.Position.X - OtherProps.Position.X ) )
                Props.Position.X = undefined;

            if ( undefined === OtherProps.Position.Y || 0.001 > Math.abs( Props.Position.Y - OtherProps.Position.Y ) )
                Props.Position.Y = undefined;

            if ( undefined === OtherProps.PositionH.RelativeFrom || Props.PositionH.RelativeFrom != OtherProps.PositionH.RelativeFrom )
                Props.PositionH.RelativeFrom = undefined;

            if ( undefined === OtherProps.PositionH.UseAlign || Props.PositionH.UseAlign != OtherProps.PositionH.UseAlign )
                Props.PositionH.UseAlign = undefined;

            if ( Props.PositionH.RelativeFrom === OtherProps.PositionH.RelativeFrom && Props.PositionH.UseAlign === OtherProps.PositionH.UseAlign )
            {
                if ( true != Props.PositionH.UseAlign && 0.001 > Math.abs(Props.PositionH.Value - OtherProps.PositionH.Value) )
                    Props.PositionH.Value = undefined;

                if ( true === Props.PositionH.UseAlign && Props.PositionH.Align != OtherProps.PositionH.Align )
                    Props.PositionH.Align = undefined;
            }

            if ( undefined === OtherProps.PositionV.RelativeFrom || Props.PositionV.RelativeFrom != OtherProps.PositionV.RelativeFrom )
                Props.PositionV.RelativeFrom = undefined;

            if ( undefined === OtherProps.PositionV.UseAlign || Props.PositionV.UseAlign != OtherProps.PositionV.UseAlign )
                Props.PositionV.UseAlign = undefined;

            if ( Props.PositionV.RelativeFrom === OtherProps.PositionV.RelativeFrom && Props.PositionV.UseAlign === OtherProps.PositionV.UseAlign )
            {
                if ( true != Props.PositionV.UseAlign && 0.001 > Math.abs(Props.PositionV.Value - OtherProps.PositionV.Value) )
                    Props.PositionV.Value = undefined;

                if ( true === Props.PositionV.UseAlign && Props.PositionV.Align != OtherProps.PositionV.Align )
                    Props.PositionV.Align = undefined;
            }


            if ( false === OtherProps.Locked )
                Props.Locked = false;


            if ( false === OtherProps.CanBeFlow || false === Props.CanBeFlow )
                Props.CanBeFlow = false;
            else
                Props.CanBeFlow = true;

        }

        return Props;
    },

    getXfrmExtX: function()
    {
        if(isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.spPr) && isRealObject(this.GraphicObj.spPr.xfrm))
            return this.GraphicObj.spPr.xfrm.extX;
        return 0;
    },

    getXfrmExtY: function()
    {
        if(isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.spPr) && isRealObject(this.GraphicObj.spPr.xfrm))
            return this.GraphicObj.spPr.xfrm.extY;
        return 0;
    },


    Set_Props : function(Props)
    {
        if ( undefined != Props.Width || undefined != Props.Height )
        {
            var result_width, result_height;
            var b_is_line = this.GraphicObj.checkLine();
            if(Props.Width != undefined)
                if(Props.Width >= MIN_SHAPE_SIZE || b_is_line)
                    result_width = Props.Width;
                else
                    result_width = MIN_SHAPE_SIZE;
            else
                result_width = this.GraphicObj.absExtX;

            if(Props.Height != undefined)
                if(Props.Height >= MIN_SHAPE_SIZE || b_is_line)
                    result_height = Props.Height;
                else
                    result_height = MIN_SHAPE_SIZE;
            else
                result_height = this.GraphicObj.absExtY;

            if(this.GraphicObj.isShape() || this.GraphicObj.isImage())
            {
                this.GraphicObj.setAbsoluteTransform(null, null, result_width, result_height, null, false, false);
                this.GraphicObj.setXfrm(null, null, result_width, result_height, null, null, null);
                this.GraphicObj.calculateAfterResize();
            }
            else if(this.GraphicObj.isGroup())
            {
                //this.GraphicObj.setSizes2(result_width, result_height);
            }

            var bounds = this.getBounds();
            this.Update_Size(bounds.r - bounds.l, bounds.b - bounds.t);
        }

        if(isRealObject(Props.ChartProperties))
        {
            if(this.GraphicObj.isImage() && isRealObject(this.GraphicObj.chart))
            {
                this.GraphicObj.setDiagram(Props.ChartProperties)
            }
            if(this.GraphicObj.isGroup())
                this.GraphicObj.setDiagram(Props.ChartProperties);
        }

        if(typeof Props.ImageUrl === "string" && this.GraphicObj.isImage() && !isRealObject(this.GraphicObj.chart))
        {
            this.GraphicObj.setRasterImage2(Props.ImageUrl);
        }

        if ( undefined != Props.WrappingStyle )
        {
            if ( drawing_Inline === this.DrawingType && c_oAscWrapStyle2.Inline != Props.WrappingStyle && undefined === Props.Paddings )
            {
                this.Set_Distance( 3.2,  0,  3.2, 0 );
            }

            this.Set_DrawingType( c_oAscWrapStyle2.Inline === Props.WrappingStyle ? drawing_Inline : drawing_Anchor );
            if ( c_oAscWrapStyle2.Behind === Props.WrappingStyle || c_oAscWrapStyle2.InFront === Props.WrappingStyle )
            {
                this.Set_WrappingType( WRAPPING_TYPE_NONE );
                this.Set_BehindDoc( c_oAscWrapStyle2.Behind === Props.WrappingStyle ? true : false );
            }
            else
            {
                switch ( Props.WrappingStyle )
                {
                    case c_oAscWrapStyle2.Square      : this.Set_WrappingType(WRAPPING_TYPE_SQUARE);         break;
                    case c_oAscWrapStyle2.Tight       : this.Set_WrappingType(WRAPPING_TYPE_TIGHT);          break;
                    case c_oAscWrapStyle2.Through     : this.Set_WrappingType(WRAPPING_TYPE_THROUGH);        break;
                    case c_oAscWrapStyle2.TopAndBottom: this.Set_WrappingType(WRAPPING_TYPE_TOP_AND_BOTTOM); break;
                    default                           : this.Set_WrappingType(WRAPPING_TYPE_SQUARE);         break;
                }

                this.Set_BehindDoc( false );
            }
        }

        if ( undefined != Props.Paddings )
            this.Set_Distance( Props.Paddings.Left,  Props.Paddings.Top,  Props.Paddings.Right,  Props.Paddings.Bottom );

        if ( undefined != Props.AllowOverlap )
            this.Set_AllowOverlap( Props.AllowOverlap );

        if ( undefined != Props.PositionH )
            this.Set_PositionH( Props.PositionH.RelativeFrom, Props.PositionH.UseAlign, ( true === Props.PositionH.UseAlign ? Props.PositionH.Align : Props.PositionH.Value ) );

        if ( undefined != Props.PositionV )
            this.Set_PositionV( Props.PositionV.RelativeFrom, Props.PositionV.UseAlign, ( true === Props.PositionV.UseAlign ? Props.PositionV.Align : Props.PositionV.Value ) );
    },

    Draw : function(X,Y,Context)
    {
        if ( drawing_Inline === this.DrawingType )
        {
            this.draw(Context);
        }
    },

    Measure : function(Context)
    {
        this.updateWidthHeight();
        this.Width        = this.W;
        this.Height       = this.H;
        this.WidthVisible = this.W;
    },

    Measure2 : function(Context)
    {
        this.Width        = this.W;
        this.Height       = this.H;
        this.WidthVisible = this.W;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return this.copy();

        var Drawing = new ParaDrawing(this.W, this.H, this.GraphicObj, this.DrawingDocument, null, null);
        this.GraphicObj.parent = Drawing;
        Drawing.Set_DrawingType(this.DrawingType);
        Drawing.Distance.T = this.Distance.T;
        Drawing.Distance.L = this.Distance.L;
        Drawing.Distance.B = this.Distance.B;
        Drawing.Distance.R = this.Distance.R;

        Drawing.LayoutInCell = this.LayoutInCell;

        Drawing.RelativeHeight = this.RelativeHeight;

        Drawing.SimplePos.Use = this.SimplePos.Use;
        Drawing.SimplePos.X   = this.SimplePos.X;
        Drawing.SimplePos.Y   = this.SimplePos.Y;

        Drawing.Extent.W   = this.Extent.W;
        Drawing.Extent.H   = this.Extent.H;

        Drawing.PositionH.RelativeFrom = this.PositionH.RelativeFrom;
        Drawing.PositionH.Align        = this.PositionH.Align;
        Drawing.PositionH.Value        = this.PositionH.Value;

        Drawing.PositionV.RelativeFrom = this.PositionV.RelativeFrom;
        Drawing.PositionV.Align        = this.PositionV.Align;
        Drawing.PositionV.Value        = this.PositionV.Value;

        return Drawing;
    },

    //--------------------------------------------
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Set_GraphicObject: function(graphicObject)
    {
        var data = {Type: historyitem_Drawing_SetGraphicObject};
        if(isRealObject(this.GraphicObj))
        {
            data.oldId = this.GraphicObj.Get_Id();
        }
        else
        {
            data.oldId = null;
        }
        if(isRealObject(graphicObject))
        {
            data.newId = graphicObject.Get_Id();
        }
        else
        {
            data.newId = null;
        }
        History.Add(this, data);
        if(isRealObject(this.GraphicObj))
            this.GraphicObj.setParent(null);
        this.GraphicObj = graphicObject;
        if(isRealObject(graphicObject))
            graphicObject.setParent(this);

    },

    Get_Id : function()
    {
        return this.Id;
    },

    setParagraphTabs: function(tabs)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphTabs === "function")
            this.GraphicObj.setParagraphTabs(tabs);
    },
    Update_Position : function(X, Y, PageNum, LastItemW, ColumnStartX, ColumnEndX, Left_Margin, Right_Margin, Page_W, Top_Margin, Bottom_Margin, Page_H, MarginH, MarginV, LineTop, ParagraphTop, PageLimits)
    {
        this.DocumentContent = this.Parent.Parent;

        var OtherFlowObjects = this.mainGraphicObjects.getAllFloatObjectsOnPage( PageNum, this.Parent.Parent );
        var bInline = ( drawing_Inline === this.DrawingType ? true : false );

        var W, H;
        if(this.Is_Inline())
        {
            W = this.W;
            H = this.H;
        }
        else
        {
            if(this.PositionH.Align)
                W = this.W;
            else
                W = this.getXfrmExtX();

            if(this.PositionV.Align)
                H = this.H;
            else
                H = this.getXfrmExtY();

        }

        this.Internal_Position.Set( W, H, this.YOffset, X, Y, PageNum, LastItemW, ColumnStartX, ColumnEndX, Left_Margin, Right_Margin, Page_W, Top_Margin, Bottom_Margin, Page_H, MarginH, MarginV, LineTop, ParagraphTop);
        this.Internal_Position.Calculate_X(bInline, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
        this.Internal_Position.Calculate_Y(bInline, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
        this.Internal_Position.Correct_Values(bInline, PageLimits, this.AllowOverlap, this.Use_TextWrap(), OtherFlowObjects);

        this.PageNum = PageNum;
        this.X       = this.Internal_Position.CalcX;
        this.Y       = this.Internal_Position.CalcY;

        if ( undefined != this.PositionH_Old )
        {
            // Восстанови старые значения, чтобы в историю изменений все нормально записалось
            this.PositionH.RelativeFrom = this.PositionH_Old.RelativeFrom;
            this.PositionH.Align        = this.PositionH_Old.Align;
            this.PositionH.Value        = this.PositionH_Old.Value;

            // Рассчитаем сдвиг с учетом старой привязки
            var Value = this.Internal_Position.Calculate_X_Value(this.PositionH_Old.RelativeFrom);
            this.Set_PositionH( this.PositionH_Old.RelativeFrom, false, Value );
            // На всякий случай пересчитаем заново координату
            this.X = this.Internal_Position.Calculate_X(bInline, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);

            this.PositionH_Old = undefined;
        }

        if ( undefined != this.PositionV_Old )
        {
            // Восстанови старые значения, чтобы в историю изменений все нормально записалось
            this.PositionV.RelativeFrom = this.PositionV_Old.RelativeFrom;
            this.PositionV.Align        = this.PositionV_Old.Align;
            this.PositionV.Value        = this.PositionV_Old.Value;

            // Рассчитаем сдвиг с учетом старой привязки
            var Value = this.Internal_Position.Calculate_Y_Value(this.PositionV_Old.RelativeFrom);
            this.Set_PositionV( this.PositionV_Old.RelativeFrom, false, Value );
            // На всякий случай пересчитаем заново координату
            this.Y = this.Internal_Position.Calculate_Y(bInline, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);

            this.PositionV_Old = undefined;
        }

        this.updatePosition3( this.PageNum, this.X, this.Y );
    },

    setParagraphBorders: function(val)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphBorders === "function")
            this.GraphicObj.setParagraphBorders(val);
    },
    Update_Position2: function(pageIndex, x, y)
    {
        this.graphicObjects.removeById(this.pageIndex, this.Get_Id());
        this.calculateOffset();
        if(!this.Is_Inline())
        {
            this.GraphicObj.updatePosition2(x/* + this.boundsOffsetX*/, y/* + this.boundsOffsetY*/, null, null, null, null, null, false);
        }
        else
        {
            this.calculateOffset();
            this.GraphicObj.updatePosition2(x + this.boundsOffsetX, y + this.boundsOffsetY, null, null, null, null, null, false);
        }

        if(typeof this.GraphicObj.setStartPage === "function")
            this.GraphicObj.setStartPage(pageIndex);
        this.setPageIndex(pageIndex);
        this.graphicObjects.addObjectOnPage(pageIndex, this);
        var b_history_is_on = History.Is_On();
        if(b_history_is_on)
        {
            History.TurnOff();
        }
        this.GraphicObj.calculateAfterResize();
        this.recalculateWrapPolygon();
        this.calculateSnapArrays();
        this.updateCursorTypes();
        var bounds = this.getBounds();
        this.X = bounds.l;
        this.Y = bounds.t;
        this.W = bounds.r - bounds.l;
        this.H = bounds.b - bounds.t;
        if(b_history_is_on)
        {
            History.TurnOn();
        }
    },

    updatePosition3: function(pageIndex, x, y)
    {
        this.graphicObjects.removeById(this.pageIndex, this.Get_Id());
        this.setPageIndex(pageIndex);
        if(typeof this.GraphicObj.setStartPage === "function")
            this.GraphicObj.setStartPage(pageIndex);
        this.graphicObjects.addObjectOnPage(pageIndex, this);
        var bounds = this.getBounds();
        this.W = bounds.r - bounds.l;
        this.H = bounds.b - bounds.t;
       // this.X = bounds.l;
       // this.Y = bounds.t;

        if(!(isRealObject(this.Parent) && isRealObject(this.Parent.Parent) && typeof this.Parent.Parent.Is_HdrFtr === "function" && this.Parent.Parent.Is_HdrFtr()))
        {
            if(this.selected && isRealObject(this.GraphicObj))
                this.GraphicObj.selectStartPage = pageIndex;
        }
        var off_x, off_y;
        var absX, absY;
        if(isRealObject(this.GraphicObj))
        {
            absX = this.GraphicObj.absOffsetX;
            absY = this.GraphicObj.absOffsetY;
        }
        else
        {
            absX = this.absOffsetX;
            absY = this.absOffsetY;
        }
        if(this.Is_Inline())
        {

            off_x = absX - bounds.l;
            off_y = absY - bounds.t;
            this.setAbsoluteTransform(x + off_x, y + off_y, null, null, null, null, null, false);
        }
        else
        {
            if(this.PositionH.Align)
            {
                off_x = absX - bounds.l;
            }
            else
            {
                off_x = 0;
            }
            if(this.PositionV.Align)
            {
                off_y = absY - bounds.t;
            }
            else
            {
                off_y = 0;
            }
            this.setAbsoluteTransform(x + off_x, y + off_y, null, null, null, null, null, false);
        }
        if(isRealObject(this.GraphicObj))
        {
            var off_x2 = absX - bounds.l;
            var off_y2 = absY - bounds.t;
            this.selectX = this.GraphicObj.absOffsetX - off_x2;
            this.selectY = this.GraphicObj.absOffsetY - off_y2;
        }
        if(!this.Is_Inline())
        {
            if( this.wrappingType !== WRAPPING_TYPE_NONE)
                this.recalculateWrapPolygon();
        }
        this.calculateSnapArrays();
        this.updateCursorTypes();
    },

    calculateAfterChangeTheme: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateAfterChangeTheme === "function")
        {
            this.GraphicObj.calculateAfterChangeTheme();
        }
    },

    selectionIsEmpty: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionIsEmpty === "function")
            return this.GraphicObj.selectionIsEmpty();
        return false;
    },

    recalculateDocContent: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.recalculateDocContent === "function")
            return this.GraphicObj.recalculateDocContent();
    },

    Shift : function(Dx, Dy)
    {
        this.X += Dx;
        this.Y += Dy;

        this.updatePosition3( this.PageNum, this.X, this.Y );
    },

    Update_Size : function(W,H)
    {
        History.Add( this, { Type : historyitem_Drawing_Size, New : { W : W, H : H }, Old : { W : this.W, H : this.H } } );
        this.W = W;
        this.H = H;


        this.Measure2();
    },

    Set_Url : function(Img)
    {
        History.Add( this, { Type : historyitem_Drawing_Url, New : Img, Old : this.GraphicObj.Img } );
        this.GraphicObj.Img = Img;
    },

    Set_DrawingType : function(DrawingType)
    {
        History.Add( this, { Type : historyitem_Drawing_DrawingType, New : DrawingType, Old : this.DrawingType } );
        this.DrawingType = DrawingType;
        /*if(typeof this.graphicObjects.curState.updateAnchorPos === "function")
            this.graphicObjects.curState.updateAnchorPos();      */
        this.updateWidthHeight();
    },

    Set_WrappingType : function(WrapType)
    {
        History.Add( this, { Type : historyitem_Drawing_WrappingType, New : WrapType, Old : this.wrappingType } );
        this.wrappingType = WrapType;
        this.updateWidthHeight();
    },

    Set_BehindDoc : function(BehindDoc)
    {
        History.Add( this, { Type : historyitem_Drawing_BehindDoc, New : BehindDoc, Old : this.behindDoc } );
        this.behindDoc = BehindDoc;
    },

    Set_Distance : function(L, T, R, B)
    {
        if ( null === L || undefined === L )
            L = this.Distance.L;

        if ( null === T || undefined === T )
            T = this.Distance.T;

        if ( null === R || undefined === R )
            R = this.Distance.R;

        if ( null === B || undefined === B )
            B = this.Distance.B;

        History.Add( this, { Type : historyitem_Drawing_Distance, Old : { Left : this.Distance.L, Top : this.Distance.T, Right : this.Distance.R, Bottom : this.Distance.B }, New : { Left : L, Top : T, Right : R, Bottom : B } } );
        this.Distance.L = L;
        this.Distance.R = R;
        this.Distance.T = T;
        this.Distance.B = B;
    },

    updateWidthHeight: function()
    {
        if(isRealObject(this.GraphicObj))
        {
            var bounds = this.getBounds();
            this.W = bounds.r - bounds.l;
            this.H = bounds.b - bounds.t;
        }
    },

    Set_AllowOverlap : function(AllowOverlap)
    {
        History.Add( this, { Type : historyitem_Drawing_AllowOverlap, Old : this.AllowOverlap, New : AllowOverlap } );
        this.AllowOverlap = AllowOverlap;
    },

    Set_PositionH : function(RelativeFrom, Align, Value)
    {
        History.Add( this, { Type : historyitem_Drawing_PositionH, Old : { RelativeFrom : this.PositionH.RelativeFrom, Align : this.PositionH.Align, Value : this.PositionH.Value }, New : { RelativeFrom : RelativeFrom, Align : Align, Value : Value }  } );
        this.PositionH.RelativeFrom = RelativeFrom;
        this.PositionH.Align        = Align;
        this.PositionH.Value        = Value;
    },

    Set_PositionV : function(RelativeFrom, Align, Value)
    {
        History.Add( this, { Type : historyitem_Drawing_PositionV, Old : { RelativeFrom : this.PositionV.RelativeFrom, Align : this.PositionV.Align, Value : this.PositionV.Value }, New : { RelativeFrom : RelativeFrom, Align : Align, Value : Value }  } );
        this.PositionV.RelativeFrom = RelativeFrom;
        this.PositionV.Align        = Align;
        this.PositionV.Value        = Value;
    },

    canTakeOutPage: function()
    {
        if(isRealObject(this.GraphicObj) &&  typeof this.GraphicObj.canTakeOutPage === "function")
        {
            return this.GraphicObj.canTakeOutPage();
        }
        return false;
    },

    Set_XYForAdd : function(X, Y)
    {
        this.Set_PositionH( c_oAscRelativeFromH.Column, false, 0 );
        this.Set_PositionV( c_oAscRelativeFromV.Paragraph, false, 0 );

        this.PositionH_Old =
        {
            RelativeFrom : this.PositionH.RelativeFrom,
            Align        : this.PositionH.Align,
            Value        : this.PositionH.Value
        };

        this.PositionV_Old =
        {
            RelativeFrom : this.PositionV.RelativeFrom,
            Align        : this.PositionV.Align,
            Value        : this.PositionV.Value
        };

        this.PositionH.RelativeFrom = c_oAscRelativeFromH.Page;
        this.PositionH.Align        = false;
        this.PositionH.Value        = X;

        this.PositionV.RelativeFrom = c_oAscRelativeFromV.Page;
        this.PositionV.Align        = false;
        this.PositionV.Value        = Y;
    },

    Get_DrawingType : function()
    {
        return this.DrawingType;
    },

    Is_Inline : function()
    {
        return ( drawing_Inline === this.DrawingType ? true : false );
    },

    Use_TextWrap : function()
    {
        // здесь должна быть проверка, нужно ли использовать обтекание относительно данного объекта,
        // или он просто лежит над или под текстом.
        return ( drawing_Anchor === this.DrawingType && !(this.wrappingType === WRAPPING_TYPE_NONE) );
    },

    Draw_Selection : function()
    {
        var Padding = this.DrawingDocument.GetMMPerDot( 6 );
        this.DrawingDocument.AddPageSelection( this.PageNum, this.selectX - Padding, this.selectY - Padding, this.W + 2 * Padding, this.H + 2 * Padding );
    },

    OnEnd_MoveInline : function(NearPos)
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        if ( false === LogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props, { Type : changestype_2_Element_and_Type, Element : NearPos.Paragraph, CheckType : changestype_Paragraph_Content } ) && false === editor.isViewMode)
        {
            LogicDocument.Create_NewHistoryPoint();

            var bCorrectIndex = this.Parent === NearPos.Paragraph ? true : false;
            var Index = this.Remove_FromDocument( false );

            if ( true === bCorrectIndex && Index < NearPos.ContentPos )
                NearPos.ContentPos--;

            this.Add_ToDocument( NearPos, true );
        }
        else
        {
            LogicDocument.Document_UpdateSelectionState();
        }
    },

    OnEnd_ResizeInline : function(W, H)
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        // Проверяем, залочено ли данное изображение
        if (true/* false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Image_Properties)*/ )
        {
         //   LogicDocument.Create_NewHistoryPoint();
            this.Update_Size( W, H );
            LogicDocument.Recalculate();
        }
        else
        {
            LogicDocument.Document_UpdateSelectionState();
        }
    },

    OnEnd_ChangeFlow : function(X, Y, PageNum, W, H, NearPos, bMove, bLast)
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        if ( true === bMove )
        {
            // Здесь мы должны для первого рассчета оставить привязку относительно страницы, а после рассчета
            // изменить привязку на старую, при этом пересчитав координаты так, чтобы картинка не изменила
            // своего положения.

            this.PositionH_Old =
            {
                RelativeFrom : this.PositionH.RelativeFrom,
                Align        : this.PositionH.Align,
                Value        : this.PositionH.Value
            };

            this.PositionV_Old =
            {
                RelativeFrom : this.PositionV.RelativeFrom,
                Align        : this.PositionV.Align,
                Value        : this.PositionV.Value
            };

            this.PositionH.RelativeFrom = c_oAscRelativeFromH.Page;
            this.PositionH.Align        = false;
            this.PositionH.Value        = X;

            this.PositionV.RelativeFrom = c_oAscRelativeFromV.Page;
            this.PositionV.Align        = false;
            this.PositionV.Value        = Y;

            if ( null !== NearPos )
            {
                this.Remove_FromDocument( false );
                this.Add_ToDocument( NearPos, false );
            }
        }

        this.Update_Size( W, H );

        if ( true === bLast )
            editor.WordControl.m_oLogicDocument.Recalculate();
    },

    GoTo_Text : function()
    {
        if ( undefined != this.Parent && null != this.Parent )
        {
            this.Parent.Cursor_MoveTo_Drawing( this.Id );
            this.Parent.Document_SetThisElementCurrent();
        }
    },

    Remove_FromDocument : function(bRecalculate)
    {
        var Res = this.Parent.Remove_DrawingObject( this.Id );

        if ( false != bRecalculate )
            editor.WordControl.m_oLogicDocument.Recalculate();

        return Res;
    },

    Add_ToDocument : function(NearPos, bRecalculate)
    {
        this.Parent = NearPos.Paragraph;
        NearPos.Paragraph.Internal_Content_Add( NearPos.ContentPos, this );

        if ( false != bRecalculate )
            editor.WordControl.m_oLogicDocument.Recalculate();
    },

    Add_ToDocument2 : function(Paragraph)
    {
        this.Parent = Paragraph;
        Paragraph.Internal_Content_Add( Paragraph.Internal_GetStartPos(), this );
    },

    Update_CursorType : function(X, Y, PageIndex)
    {
        this.DrawingDocument.SetCursorType( "move", new CMouseMoveData() );

        if ( null != this.Parent )
        {
            var Lock = this.Parent.Lock;
            if ( true === Lock.Is_Locked() )
            {
                var PNum = Math.max( 0, Math.min( PageIndex - this.Parent.PageNum, this.Parent.Pages.length - 1 ) );
                var _X = this.Parent.Pages[PNum].X;
                var _Y = this.Parent.Pages[PNum].Y;

                var MMData = new CMouseMoveData();
                var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( _X, _Y, this.Parent.Get_StartPage_Absolute() + ( PageIndex - this.Parent.PageNum ) );
                MMData.X_abs            = Coords.X - 5;
                MMData.Y_abs            = Coords.Y;
                MMData.Type             = c_oAscMouseMoveDataTypes.LockedObject;
                MMData.UserId           = Lock.Get_UserId();
                MMData.HaveChanges      = Lock.Have_Changes();
                MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;

                editor.sync_MouseMoveCallback( MMData );
            }
        }
    },

    Get_AnchorPos : function()
    {
        return this.Parent.Get_AnchorPos(this);
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Drawing_Size:
            {
                this.W = Data.Old.W;
                this.H = Data.Old.H;
                this.Measure2();
                break;
            }

            case historyitem_Drawing_Url:
            {
                this.GraphicObj.Img = Data.Old;
                break;
            }

            case historyitem_Drawing_DrawingType:
            {
                this.DrawingType = Data.Old;
                this.updateWidthHeight();
                break;
            }

            case historyitem_Drawing_WrappingType:
            {
                this.wrappingType = Data.Old;
                this.updateWidthHeight();
                break;
            }

            case historyitem_Drawing_Distance:
            {
                this.Distance.L = Data.Old.Left;
                this.Distance.T = Data.Old.Top;
                this.Distance.R = Data.Old.Right;
                this.Distance.B = Data.Old.Bottom;

                break;
            }

            case historyitem_Drawing_AllowOverlap:
            {
                this.AllowOverlap = Data.Old;
                break;
            }

            case historyitem_Drawing_PositionH:
            {
                this.PositionH.RelativeFrom = Data.Old.RelativeFrom;
                this.PositionH.Align        = Data.Old.Align;
                this.PositionH.Value        = Data.Old.Value;

                break;
            }

            case historyitem_Drawing_PositionV:
            {
                this.PositionV.RelativeFrom = Data.Old.RelativeFrom;
                this.PositionV.Align        = Data.Old.Align;
                this.PositionV.Value        = Data.Old.Value;

                break;
            }
            case historyitem_Drawing_AbsoluteTransform:
            {
                if(Data.oldOffsetX != undefined)
                    this.absOffsetX = Data.oldOffsetX;
                if(Data.oldOffsetY != undefined)
                    this.absOffsetY = Data.oldOffsetY;

                if(Data.oldExtX != undefined)
                    this.absExtX = Data.oldExtX;
                if(Data.oldExtY != undefined)
                    this.absExtY = Data.oldExtY;

                if(Data.oldRot != undefined)
                    this.absRot = Data.oldRot;

                if(Data.oldFlipH != undefined)
                    this.absFlipH = Data.oldFlipH;
                if(Data.oldFlipV != undefined)
                    this.absFlipV = Data.oldFlipV;
                break;
            }

            case historyitem_Drawing_BehindDoc:
            {
                this.behindDoc = Data.Old;

                break;
            }

            case historyitem_Drawing_SetZIndex:
            {
                this.RelativeHeight = Data.oldIndex;
                break;
            }

            case historyitem_Drawing_SetGraphicObject:
            {
                if(this.GraphicObj != null)
                {
                    //this.GraphicObj.parent = null;
                }
                if(Data.oldId != null)
                {
                    this.GraphicObj = g_oTableId.Get_ById(Data.oldId);
                }
                else
                {
                    this.GraphicObj = null;
                }
                if(isRealObject(this.GraphicObj))
                    this.GraphicObj.parent = this;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Drawing_Size:
            {
                this.W = Data.New.W;
                this.H = Data.New.H;
                this.Measure2();
                break;
            }

            case historyitem_Drawing_Url:
            {
                this.GraphicObj.Img = Data.New;
                break;
            }

            case historyitem_Drawing_DrawingType:
            {
                this.DrawingType = Data.New;
                this.updateWidthHeight();
                break;
            }

            case historyitem_Drawing_WrappingType:
            {
                this.wrappingType = Data.New;
                this.updateWidthHeight();
                break;
            }

            case historyitem_Drawing_Distance:
            {
                this.Distance.L = Data.New.Left;
                this.Distance.T = Data.New.Top;
                this.Distance.R = Data.New.Right;
                this.Distance.B = Data.New.Bottom;

                break;
            }

            case historyitem_Drawing_AllowOverlap :
            {
                this.AllowOverlap = Data.New;
                break;
            }

            case historyitem_Drawing_PositionH:
            {
                this.PositionH.RelativeFrom = Data.New.RelativeFrom;
                this.PositionH.Align        = Data.New.Align;
                this.PositionH.Value        = Data.New.Value;

                break;
            }

            case historyitem_Drawing_PositionV:
            {
                this.PositionV.RelativeFrom = Data.New.RelativeFrom;
                this.PositionV.Align        = Data.New.Align;
                this.PositionV.Value        = Data.New.Value;

                break;
            }

            case historyitem_Drawing_AbsoluteTransform:
            {
                if(Data.newOffsetX != undefined)
                    this.absOffsetX = Data.newOffsetX;
                if(Data.newOffsetY != undefined)
                    this.absOffsetY = Data.newOffsetY;

                if(Data.newExtX != undefined)
                    this.absExtX = Data.newExtX;
                if(Data.newExtY != undefined)
                    this.absExtY = Data.newExtY;

                if(Data.newRot != undefined)
                    this.absRot = Data.newRot;

                if(Data.newFlipH != undefined)
                    this.absFlipH = Data.newFlipH;
                if(Data.newFlipV != undefined)
                    this.absFlipV = Data.newFlipV;
                break;
            }

            case historyitem_Drawing_BehindDoc:
            {
                this.behindDoc = Data.New;

                break;
            }

            case historyitem_Drawing_SetZIndex:
            {
                this.RelativeHeight = Data.newIndex;
                break;
            }

            case historyitem_Drawing_SetGraphicObject:
            {
                if(this.GraphicObj != null)
                {
                    //this.GraphicObj.parent = null;
                }
                if(Data.newId != null)
                {
                    this.GraphicObj = g_oTableId.Get_ById(Data.newId);
                }
                else
                {
                    this.GraphicObj = null;
                }
                if(isRealObject(this.GraphicObj))
                    this.GraphicObj.parent = this;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        if(this.Parent != null)
            return this.Parent.Get_ParentObject_or_DocumentPos();
    },

    Refresh_RecalcData : function()
    {
        if ( undefined != this.Parent && null != this.Parent )
            return this.Parent.Refresh_RecalcData2();
    },
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Document_Is_SelectionLocked : function(CheckType)
    {

    },

    hyperlinkCheck: function(bCheck)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCheck === "function")
            return this.GraphicObj.hyperlinkCheck(bCheck);
        return null;
    },

    hyperlinkCanAdd: function(bCheckInHyperlink)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCanAdd === "function")
            return this.GraphicObj.hyperlinkCanAdd(bCheckInHyperlink);
        return false;
    },

    hyperlinkRemove: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCanAdd === "function")
            return this.GraphicObj.hyperlinkRemove();
        return false;
    },

    hyperlinkModify: function( HyperProps )
    {

        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkModify === "function")
            return this.GraphicObj.hyperlinkModify(HyperProps);
    },

    hyperlinkAdd: function( HyperProps )
    {

        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkAdd === "function")
            return this.GraphicObj.hyperlinkAdd(HyperProps);
    },

    documentStatistics: function(stat)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentStatistics === "function")
            this.GraphicObj.documentStatistics(stat);
    },

    documentCreateFontCharMap: function(fontMap)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentCreateFontCharMap === "function")
            this.GraphicObj.documentCreateFontCharMap(fontMap);
    },

    documentCreateFontMap: function(fontMap)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentCreateFontMap === "function")
            this.GraphicObj.documentCreateFontMap(fontMap);
    },

    tableCheckSplit: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableCheckSplit === "function")
            return this.GraphicObj.tableCheckSplit();
        return false;
    },

    tableCheckMerge: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableCheckMerge === "function")
            return this.GraphicObj.tableCheckMerge();
        return false;
    },

    tableSelect: function( Type )
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableSelect === "function")
            return this.GraphicObj.tableSelect(Type);
    },

    tableRemoveTable: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveTable === "function")
            return this.GraphicObj.tableRemoveTable();
    },

    tableSplitCell: function(Cols, Rows)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableSplitCell === "function")
            return this.GraphicObj.tableSplitCell(Cols, Rows);
    },

    tableMergeCells: function(Cols, Rows)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableMergeCells === "function")
            return this.GraphicObj.tableMergeCells(Cols, Rows);
    },

    tableRemoveCol: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveCol === "function")
            return this.GraphicObj.tableRemoveCol();
    },

    tableAddCol: function(bBefore)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableAddCol === "function")
            return this.GraphicObj.tableAddCol(bBefore);
    },

    tableRemoveRow: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveRow === "function")
            return this.GraphicObj.tableRemoveRow();
    },

    tableAddRow: function(bBefore)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableAddRow === "function")
            return this.GraphicObj.tableAddRow(bBefore);
    },

    getCurrentParagraph: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getCurrentParagraph === "function")
            return this.GraphicObj.getCurrentParagraph();
        return null;
    },
    getSelectedText: function(bClearText)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getSelectedText === "function")
            return this.GraphicObj.getSelectedText(bClearText);
        return "";
    },

    getCurPosXY: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getCurPosXY === "function")
            return this.GraphicObj.getCurPosXY();
        return {X:0, Y:0};
    },

    setParagraphKeepLines: function(Value)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphKeepLines === "function")
            return this.GraphicObj.setParagraphKeepLines(Value);
    },


    setParagraphPageBreakBefore: function(Value)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphPageBreakBefore === "function")
            return this.GraphicObj.setParagraphPageBreakBefore(Value);
    },

    isTextSelectionUse: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isTextSelectionUse === "function")
            return this.GraphicObj.isTextSelectionUse();
        return false;
    },

    paragraphFormatPaste: function( CopyTextPr, CopyParaPr, Bool )
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isTextSelectionUse === "function")
            return this.GraphicObj.paragraphFormatPaste(CopyTextPr, CopyParaPr, Bool);
    },

    getNearestPos: function(x, y, pageIndex)
    {

        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getNearestPos === "function")
            return this.GraphicObj.getNearestPos(x, y, pageIndex);
        return null;
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Drawing );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_Drawing_Size:
            {
                // Double : W
                // Double : H

                Writer.WriteDouble( Data.New.W );
                Writer.WriteDouble( Data.New.H );

                break;
            }

            case historyitem_Drawing_Url:
            {
                // String : указатель на картинку

                Writer.WriteString2( Data.New );
                break;
            }

            case historyitem_Drawing_DrawingType:
            {
                // Long : тип обтекания
                Writer.WriteLong( Data.New );
                break;
            }

            case historyitem_Drawing_WrappingType:
            {
                // Long : тип обтекания
                Writer.WriteLong( Data.New );
                break;
            }

            case historyitem_Drawing_Distance:
            {
                // Double : Left
                // Double : Top
                // Double : Right
                // Double : Bottom

                Writer.WriteDouble( Data.New.Left );
                Writer.WriteDouble( Data.New.Top );
                Writer.WriteDouble( Data.New.Right );
                Writer.WriteDouble( Data.New.Bottom );

                break;
            }

            case historyitem_Drawing_AllowOverlap:
            {
                // Bool : AllowOverlap
                Writer.WriteBool( Data.New );
                break;
            }

            case historyitem_Drawing_PositionH:
            case historyitem_Drawing_PositionV:
            {
                // Long : RelativeFrom
                // Bool : Align
                //   true  -> Long   : Value
                //   false -> Double : Value

                Writer.WriteLong( Data.New.RelativeFrom );
                Writer.WriteBool( Data.New.Align );
                if ( true === Data.New.Align )
                    Writer.WriteLong( Data.New.Value );
                else
                    Writer.WriteDouble( Data.New.Value );

                break;
            }

            case historyitem_Drawing_BehindDoc:
            {
                // Bool
                Writer.WriteBool( Data.New );

                break;
            }
            case historyitem_Drawing_AbsoluteTransform:
            {

                var bool = Data.newOffsetX != null;
                Writer.WriteBool(bool);
                if(bool)
                {
                    Writer.WriteDouble(Data.newOffsetX);
                }

                bool = Data.newOffsetY != null;
                Writer.WriteBool(bool);
                if(bool)
                {
                    Writer.WriteDouble(Data.newOffsetY);
                }


                bool = Data.newExtX != null;
                Writer.WriteBool(bool);
                if(bool)
                {
                    Writer.WriteDouble(Data.newExtX);
                }

                bool = Data.newExtY != null;
                Writer.WriteBool(bool);
                if(bool)
                {
                    Writer.WriteDouble(Data.newExtY);
                }

                bool = Data.newRot != null;
                Writer.WriteBool(bool);
                if(bool)
                {
                    Writer.WriteDouble(Data.newRot);
                }

                bool = Data.newFlipH != null;
                Writer.WriteBool(bool);
                if(bool)
                {
                    Writer.WriteBool(Data.newFlipH);
                }


                bool = Data.newFlipV != null;
                Writer.WriteBool(bool);
                if(bool)
                {
                    Writer.WriteBool(Data.newFlipV);
                }
                break;
            }

            case historyitem_Drawing_SetZIndex:
            {
                Writer.WriteLong(Data.newIndex);
                break;
            }

            case historyitem_Drawing_SetGraphicObject:
            {
                Writer.WriteBool(Data.newId != null);
                if(Data.newId != null)
                {
                    Writer.WriteString2(Data.newId);
                }
            }
        }

        return Writer;
    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Drawing != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_Drawing_Size:
            {
                // Double : W
                // Double : H

                this.W = Reader.GetDouble();
                this.H = Reader.GetDouble();
                this.Measure2();
                break;
            }

            case historyitem_Drawing_Url:
            {
                // String : указатель на картинку

                this.GraphicObj.Img = Reader.GetString2();

                break;
            }

            case historyitem_Drawing_DrawingType:
            {
                // Long : тип обтекания
                this.DrawingType = Reader.GetLong();
                this.updateWidthHeight();
                break;
            }


            case historyitem_Drawing_WrappingType:
            {
                // Long : тип обтекания
                this.wrappingType = Reader.GetLong();
                this.updateWidthHeight();
                break;
            }

            case historyitem_Drawing_Distance:
            {
                // Double : Left
                // Double : Top
                // Double : Right
                // Double : Bottom

                this.Distance.L = Reader.GetDouble();
                this.Distance.T = Reader.GetDouble();
                this.Distance.R = Reader.GetDouble();
                this.Distance.B = Reader.GetDouble();

                break;
            }

            case historyitem_Drawing_AllowOverlap:
            {
                // Bool : AllowOverlap
                this.AllowOverlap = Reader.GetBool();
                break;
            }

            case historyitem_Drawing_PositionH:
            {
                // Long : RelativeFrom
                // Bool : Align
                //   true  -> Long   : Value
                //   false -> Double : Value

                this.PositionH.RelativeFrom = Reader.GetLong();
                this.PositionH.Align        = Reader.GetBool();

                if ( true === this.PositionH.Align )
                    this.PositionH.Value = Reader.GetLong();
                else
                    this.PositionH.Value = Reader.GetDouble();

                break;
            }

            case historyitem_Drawing_PositionV:
            {
                // Long : RelativeFrom
                // Bool : Align
                //   true  -> Long   : Value
                //   false -> Double : Value

                this.PositionV.RelativeFrom = Reader.GetLong();
                this.PositionV.Align        = Reader.GetBool();

                if ( true === this.PositionV.Align )
                    this.PositionV.Value = Reader.GetLong();
                else
                    this.PositionV.Value = Reader.GetDouble();

                break;
            }

            case historyitem_Drawing_BehindDoc:
            {
                // Bool
                this.behindDoc = Reader.GetBool();

                break;
            }

            case historyitem_Drawing_AbsoluteTransform:
            {
                    var reader = Reader;
                if(reader.GetBool())
                {
                    this.absOffsetX = reader.GetDouble();
                }

                if(reader.GetBool())
                {
                    this.absOffsetY= reader.GetDouble();
                }



                if(reader.GetBool())
                {
                    this.absExtX = reader.GetDouble();
                }

                if(reader.GetBool())
                {
                    this.absExtY= reader.GetDouble();
                }


                if(reader.GetBool())
                {
                    this.absRot = reader.GetDouble();
                }

                if(reader.GetBool())
                {
                    this.absFlipH = reader.GetBool();
                }



                if(reader.GetBool())
                {
                    this.absFlipV = reader.GetBool();
                }
                break;
            }

            case historyitem_Drawing_SetZIndex:
            {
                this.RelativeHeight = Reader.GetLong();
                break;
            }

            case historyitem_Drawing_SetGraphicObject:
            {
                /*if(this.GraphicObj != null)
                    this.GraphicObj.parent = null;  */
                if(Reader.GetBool())
                {
                    this.GraphicObj = g_oTableId.Get_ById(Reader.GetString2());
                }
                else
                {
                    this.GraphicObj = null;
                }
                if(isRealObject(this.GraphicObj))
                    this.GraphicObj.parent = this;
                break;
            }
            case historyitem_CalculateAfterPaste:
            {
                if(isRealObject(this.GraphicObj))
                {
                    if(this.GraphicObj.isGroup())
                    {
                        this.GraphicObj.calculateAfterOpen3();
                    }
                    else
                    {
                        this.GraphicObj.calculateAfterOpen();
                    }
                }
                break;
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции для записи/чтения в поток
//-----------------------------------------------------------------------------------
    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : Id

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_Drawing );

        // Long   : Type
        // String : Id
        // String : ParentId
        // Byte   : DrawingType
        // Long   : W
        // Long   : H
        // Long   : Distance.T
        // Long   : Distance.B
        // Long   : Distance.L
        // Long   : Distance.R
        // String : Указатель на картинку

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
        Writer.WriteByte( this.DrawingType );
        Writer.WriteDouble( this.W );
        Writer.WriteDouble( this.H );
        Writer.WriteDouble( this.Distance.T );
        Writer.WriteDouble( this.Distance.B );
        Writer.WriteDouble( this.Distance.L );
        Writer.WriteDouble( this.Distance.R );
        //Writer.WriteString2( this.GraphicObj.Img );
    },

    Read_FromBinary2 : function(Reader)
    {
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;

        this.Type        = Reader.GetLong();
        this.Id          = Reader.GetString2();
        this.DrawingType = Reader.GetByte();
        this.W           = Reader.GetDouble();
        this.H           = Reader.GetDouble();
        this.Distance.T  = Reader.GetDouble();
        this.Distance.B  = Reader.GetDouble();
        this.Distance.L  = Reader.GetDouble();
        this.Distance.R  = Reader.GetDouble();
       // this.GraphicObj  = new GraphicPicture( Reader.GetString2() );

      //  CollaborativeEditing.Add_NewImage( this.GraphicObj.Img );
        this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        this.document = editor.WordControl.m_oLogicDocument;
        this.graphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
        this.mainGraphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
        g_oTableId.Add(this, this.Id);
    },

    Load_LinkData : function(LinkData)
    {
        this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        this.document = editor.WordControl.m_oLogicDocument;
        this.graphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
        this.mainGraphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
    },


    getPageIndex: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getPageIndex === "function")
            return this.GraphicObj.getPageIndex();
        return -1;
    },

    draw: function(graphics, pageIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.draw === "function")
        {
            graphics.SaveGrState();
            this.GraphicObj.draw(graphics, pageIndex);
            graphics.RestoreGrState();
        }
    },

    drawAdjustments: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.drawAdjustments === "function")
        {
            this.GraphicObj.drawAdjustments();
        }
    },


    getTransformMatrix: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getTransformMatrix === "function")
        {
            return this.GraphicObj.getTransformMatrix();
        }
        return null;
    },

    getOwnTransform: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getOwnTransform === "function")
        {
            return this.GraphicObj.getOwnTransform();
        }
        return null;
    },

    getExtensions: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getExtensions === "function")
        {
            return this.GraphicObj.getExtensions();
        }
        return null;
    },

    isGroup: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isGroup === "function")
            return this.GraphicObj.isGroup();
        return false;
    },

    isShapeChild: function()
    {
        if(!this.Is_Inline())
            return false;

        var cur_doc_content = this.DocumentContent;
        while(cur_doc_content.Is_TableCellContent())
        {
            cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
        }

        if(isRealObject(cur_doc_content.Parent) && typeof cur_doc_content.Parent.isShape === "function")
            return cur_doc_content.Parent.isShape();

        return false;
    },

    getParentShape: function()
    {
        if(!this.Is_Inline())
            return null;

        var cur_doc_content = this.DocumentContent;
        while(cur_doc_content.Is_TableCellContent())
        {
            cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
        }

        if(isRealObject(cur_doc_content.Parent) && typeof cur_doc_content.Parent.isShape === "function")
            return cur_doc_content.Parent;

        return null;
    },


    getArrContentDrawingObjects: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getArrContentDrawingObjects === "function")
            return this.GraphicObj.getArrContentDrawingObjects();
        return [];
    },


    getSpTree: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getSpTree === "function")
            return this.GraphicObj.getSpTree();
        return [];
    },

    setZIndex: function()
    {
        var data = {Type:historyitem_Drawing_SetZIndex, oldIndex: this.RelativeHeight};
        this.RelativeHeight = ++this.mainGraphicObjects.maximalGraphicObjectZIndex;
        data.newIndex = this.RelativeHeight;
        History.Add(this, data);
    },

    setZIndex2: function(zIndex)
    {
        var data = {Type:historyitem_Drawing_SetZIndex, oldIndex: this.RelativeHeight, newIndex: zIndex};
        this.RelativeHeight = zIndex;
        History.Add(this, data);
    },

    hitToAdj: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToAdj === "function")
        {
            return this.GraphicObj.hitToAdj(x, y);
        }
        return {hit: false, adjPolarFlag: null, adjNum: null};
    },

    hitToHandle: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToHandle === "function")
        {
            return this.GraphicObj.hitToHandle(x, y);
        }
        return {hit: false, handleRotate: false, handleNum: null};
    },

    hit: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.hit === "function")
        {
            return this.GraphicObj.hit(x, y);
        }
        return false;
    },

    hitToTextRect: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToTextRect === "function")
        {
            return this.GraphicObj.hitToTextRect(x, y);
        }
        return false;
    },

    hitToPath: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToPath === "function")
        {
            return this.GraphicObj.hitToPath(x, y);
        }
        return false;
    },

    numberToCardDirection: function(handleNumber)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.numberToCardDirection === "function")
        {
            return this.GraphicObj.numberToCardDirection(handleNumber);
        }
        return null;
    },


    cursorGetPos: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorGetPos === "function")
        {
            return this.GraphicObj.cursorGetPos();
        }
        return {X: 0, Y: 0};
    },
    cardDirectionToNumber: function(cardDirection)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cardDirectionToNumber === "function")
        {
            return this.GraphicObj.cardDirectionToNumber(cardDirection);
        }
        return null;
    },

    getAbsolutePosition: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAbsolutePosition === "function")
        {
            return this.GraphicObj.getAbsolutePosition();
        }
        return null;
    },

    getResizeCoefficients: function(handleNum, x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getResizeCoefficients === "function")
        {
            return this.GraphicObj.getResizeCoefficients(handleNum, x, y);
        }
        return {kd1: 1, kd2: 1};
    },

    getAllParagraphParaPr: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAllParagraphParaPr === "function")
        {
            return this.GraphicObj.getAllParagraphParaPr();
        }
        return null;
    },

    getAllParagraphTextPr: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAllParagraphTextPr === "function")
        {
            return this.GraphicObj.getAllParagraphTextPr();
        }
        return null;
    },

    getParagraphParaPr: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getParagraphParaPr === "function")
        {
            return this.GraphicObj.getParagraphParaPr();
        }
        return null;
    },

    getParagraphTextPr: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getParagraphTextPr === "function")
        {
            return this.GraphicObj.getParagraphTextPr();
        }
        return null;
    },

    getAngle: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAngle === "function")
            return this.GraphicObj.getAngle(x, y);
        return 0;
    },

    calculateSnapArrays: function()
    {
        this.snapArrayX.length = 0;
        this.snapArrayY.length = 0;
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateSnapArrays === "function")
            this.GraphicObj.calculateSnapArrays(this.snapArrayX, this.snapArrayY);

    },

    calculateAdjPolarRange: function(adjIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateAdjPolarRange === "function")
        {
            this.GraphicObj.calculateAdjPolarRange(adjIndex);
        }
    },

    calculateAdjXYRange: function(adjIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateAdjXYRange === "function")
        {
            this.GraphicObj.calculateAdjXYRange(adjIndex);
        }
    },

    checkAdjModify: function(adjPolarFlag, adjNum, compareShape)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.checkAdjModify === "function")
        {
            return this.GraphicObj.checkAdjModify(adjPolarFlag, adjNum, compareShape);
        }
        return false;
    },

    createTrackObjectForMove: function(majorOffsetX, majorOffsetY)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.createTrackObjectForMove === "function")
        {
            return this.GraphicObj.createTrackObjectForMove(majorOffsetX, majorOffsetY);
        }
        return null;
    },

    createTrackObjectForResize: function(handleNumber, pageIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.createTrackObjectForResize === "function")
        {
            return this.GraphicObj.createTrackObjectForResize(handleNumber, pageIndex);
        }
        return null;
    },

    createTrackObjectForRotate: function(pageIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.createTrackObjectForRotate === "function")
        {
            return this.GraphicObj.createTrackObjectForRotate(pageIndex);
        }
        return null;
    },

    recalculateCurPos: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.recalculateCurPos === "function")
        {
            this.GraphicObj.recalculateCurPos();
        }
    },

    setPageIndex: function(newPageIndex)
    {
        this.pageIndex = newPageIndex;
        this.PageNum = newPageIndex;
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setPageIndex === "function")
            this.GraphicObj.setPageIndex(newPageIndex);
    },

    setAbsoluteTransform: function(offsetX, offsetY, extX, extY, rot, flipH, flipV, bFromChild)
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
            this.absExtX = extX;
        }

        if(extY != null)
        {
            this.absExtY = extY;
        }

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

        if(!bFromChild && isRealObject(this.GraphicObj) && typeof this.GraphicObj.setAbsoluteTransform === "function")
            this.GraphicObj.setAbsoluteTransform(offsetX, offsetY, extX, extY, rot, flipH, flipV);
    },

    Get_AllParagraphs_ByNumbering : function(NumPr, ParaArray)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.Get_AllParagraphs_ByNumbering === "function" )
            this.GraphicObj.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
    },

    getCursorTypeByNum: function(num)
    {
        if(isRealObject(this.cursorTypes) && typeof this.cursorTypes[num] === "string")
        {
            return this.cursorTypes[num];
        }
        else
        {
            this.updateCursorTypes();
            return this.cursorTypes[num];
        }
        return "default";
    },

    getTableProps: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.getTableProps === "function")
            return this.GraphicObj.getTableProps();
        return null;
    },

    canGroup: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.canGroup === "function")
            return this.GraphicObj.canGroup();
        return false;
    },

    canUnGroup: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.canGroup === "function")
            return this.GraphicObj.canUnGroup();
        return false;
    },


    select: function(pageIndex)
    {
        this.selected = true;
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.select === "function")
            this.GraphicObj.select(pageIndex);

    },

    deselect: function()
    {
        this.selected = false;
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.deselect === "function")
            this.GraphicObj.deselect();
    },


    paragraphClearFormatting: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.paragraphAdd === "function")
            this.GraphicObj.paragraphClearFormatting();
    },
    paragraphAdd: function(paraItem, bRecalculate)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.paragraphAdd === "function")
            this.GraphicObj.paragraphAdd(paraItem, bRecalculate);
    },

    setParagraphShd: function(Shd)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphShd === "function")
            this.GraphicObj.setParagraphShd(Shd);
    },

    getArrayWrapPolygons: function()
    {
        if((isRealObject(this.GraphicObj) && typeof this.GraphicObj.getArrayWrapPolygons === "function"))
            return this.GraphicObj.getArrayWrapPolygons();

        return [];
    },

    getArrayWrapIntervals: function(x0,y0, x1, y1, Y0Sp, Y1Sp, LeftField, RightField, arr_intervals)
    {
        if(this.wrappingType === WRAPPING_TYPE_THROUGH || this.wrappingType === WRAPPING_TYPE_TIGHT)
        {
            y0 = Y0Sp;
            y1 = Y1Sp;
        }
        return this.wrappingPolygon.getArrayWrapIntervals(x0,y0, x1, y1, LeftField, RightField, arr_intervals);
    },


    setAllParagraphNumbering: function(numInfo)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineTable === "function")
            this.GraphicObj.setAllParagraphNumbering(numInfo);
    },

    addNewParagraph: function(bRecalculate)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addNewParagraph === "function")
            this.GraphicObj.addNewParagraph(bRecalculate);
    },

    addInlineTable: function(cols, rows)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineTable === "function")
            this.GraphicObj.addInlineTable(cols, rows);
    },

    applyTextPr: function(paraItem, bRecalculate)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.applyTextPr === "function")
            this.GraphicObj.applyTextPr(paraItem, bRecalculate);
    },

    allIncreaseDecFontSize: function(bIncrease)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecFontSize === "function")
            this.GraphicObj.allIncreaseDecFontSize(bIncrease);
    },

    setParagraphNumbering: function(NumInfo)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecFontSize === "function")
            this.GraphicObj.setParagraphNumbering(NumInfo);
    },

    allIncreaseDecIndent: function(bIncrease)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecIndent === "function")
            this.GraphicObj.allIncreaseDecIndent(bIncrease);
    },

    allSetParagraphAlign: function(align)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.allSetParagraphAlign === "function")
            this.GraphicObj.allSetParagraphAlign(align);
    },

    paragraphIncreaseDecFontSize: function(bIncrease)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphIncreaseDecFontSize === "function")
            this.GraphicObj.paragraphIncreaseDecFontSize(bIncrease);
    },

    paragraphIncreaseDecIndent: function(bIncrease)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphIncreaseDecIndent === "function")
            this.GraphicObj.paragraphIncreaseDecIndent(bIncrease);
    },

    setParagraphAlign: function(align)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphAlign === "function")
            this.GraphicObj.setParagraphAlign(align);
    },

    setParagraphSpacing: function(Spacing)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphSpacing === "function")
            this.GraphicObj.setParagraphSpacing(Spacing);
    },

    updatePosition: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.updatePosition === "function")
        {
            this.GraphicObj.updatePosition(x, y);
        }
    },

    updatePosition2: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.updatePosition === "function")
        {
            this.GraphicObj.updatePosition2(x, y);
        }
    },

    addInlineImage: function(W, H, Img, chart, bFlow)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineImage === "function")
            this.GraphicObj.addInlineImage(W, H, Img, chart, bFlow);
    },

    canAddComment: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.canAddComment === "function")
            return this.GraphicObj.canAddComment();
        return false;
    },

    addComment: function(commentData)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addComment === "function")
            return this.GraphicObj.addComment(commentData);
    },

    recalculateWrapPolygon: function()
    {
        if(this.wrappingPolygon)
        {
            if(this.wrappingPolygon.edited)
                this.wrappingPolygon.calculateRelToAbs(this.getTransformMatrix()) ;
            else
                this.wrappingPolygon.calculate();
        }
    },

    selectionSetStart: function(x, y, event, pageIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionSetStart === "function")
            this.GraphicObj.selectionSetStart(x, y, event, pageIndex);
    },


    selectionSetEnd: function(x, y, event, pageIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionSetEnd === "function")
            this.GraphicObj.selectionSetEnd(x, y, event, pageIndex);
    },

    selectionRemove: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionRemove === "function")
            this.GraphicObj.selectionRemove();
    },

    updateSelectionState: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.updateSelectionState === "function")
            this.GraphicObj.updateSelectionState();
    },

    cursorMoveLeft: function(AddToSelect, Word)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveLeft === "function")
            this.GraphicObj.cursorMoveLeft(AddToSelect, Word);
    },

    cursorMoveRight: function(AddToSelect, Word)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveRight === "function")
            this.GraphicObj.cursorMoveRight(AddToSelect, Word);
    },


    cursorMoveUp: function(AddToSelect)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveUp === "function")
            this.GraphicObj.cursorMoveUp(AddToSelect);
    },

    cursorMoveDown: function(AddToSelect)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveDown === "function")
            this.GraphicObj.cursorMoveDown(AddToSelect);
    },

    cursorMoveEndOfLine: function(AddToSelect)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveEndOfLine === "function")
            this.GraphicObj.cursorMoveEndOfLine(AddToSelect);
    },

    cursorMoveStartOfLine: function(AddToSelect)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveStartOfLine === "function")
            this.GraphicObj.cursorMoveStartOfLine(AddToSelect);
    },

    remove: function(Count, bOnlyText, bRemoveOnlySelection)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.remove === "function")
            this.GraphicObj.remove(Count, bOnlyText, bRemoveOnlySelection);
    },

    hitToWrapPolygonPoint: function(x, y)
    {
        if(this.wrappingPolygon && this.wrappingPolygon.arrPoints.length > 0)
        {
            var radius = this.drawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
            var arr_point = this.wrappingPolygon.arrPoints;
            var point_count = arr_point.length;
            var dx, dy;

            var previous_point;
            for(var i = 0; i < arr_point.length; ++i)
            {
                var cur_point = arr_point[i];
                dx = x - cur_point.x;
                dy = y - cur_point.y;
                if(Math.sqrt(dx*dx + dy*dy) < radius)
                    return {hit: true, hitType: WRAP_HIT_TYPE_POINT, pointNum: i};
            }

            cur_point = arr_point[0];
            previous_point = arr_point[arr_point.length - 1];
            var vx, vy;
            vx = cur_point.x - previous_point.x;
            vy = cur_point.y - previous_point.y;
            if(Math.abs(vx) > 0 || Math.abs(vy) > 0)
            {
                if(HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y))
                    return {hit: true, hitType: WRAP_HIT_TYPE_SECTION, pointNum1: arr_point.length - 1, pointNum2: 0};
            }

            for(var point_index = 1; point_index < point_count; ++point_index)
            {
                cur_point = arr_point[point_index];
                previous_point = arr_point[point_index - 1];

                vx = cur_point.x - previous_point.x;
                vy = cur_point.y - previous_point.y;

                if(Math.abs(vx) > 0 || Math.abs(vy) > 0)
                {
                    if(HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y))
                        return {hit: true, hitType: WRAP_HIT_TYPE_SECTION, pointNum1: point_index-1, pointNum2: point_index};
                }
            }
        }
        return {hit: false};
    },

    documentGetAllFontNames: function(AllFonts)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentGetAllFontNames === "function")
            this.GraphicObj.documentGetAllFontNames(AllFonts);
    },

    isCurrentElementParagraph: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isCurrentElementParagraph === "function")
            return this.GraphicObj.isCurrentElementParagraph();
        return false;
    },
    isCurrentElementTable: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isCurrentElementTable === "function")
            return this.GraphicObj.isCurrentElementTable();
        return false;
    },

    canChangeWrapPolygon: function()
    {
        if(this.Is_Inline() )
            return false;
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.canChangeWrapPolygon === "function")
            return this.GraphicObj.canChangeWrapPolygon();
        return false;
    },

    init: function()
    {
        this.calculateAfterOpen();
        if(this.RelativeHeight > editor.WordControl.m_oLogicDocument.DrawingObjects.maximalGraphicObjectZIndex)
            editor.WordControl.m_oLogicDocument.DrawingObjects.maximalGraphicObjectZIndex = this.RelativeHeight;
    },

    calculateAfterOpen: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.calculateAfterOpen === "function")
        {
            this.GraphicObj.calculateAfterOpen();
            this.GraphicObj.recalculate(false, true);
            var bounds = this.getBounds();
            this.W = bounds.r - bounds.l;
            this.H = bounds.b - bounds.t;
            if(isRealObject(this.wrappingPolygon) && this.wrappingPolygon.edited === true)
            {
                var kw = this.GraphicObj.absExtX/0.6;
                var kh = this.GraphicObj.absExtY/0.6;
                var rel_points = this.wrappingPolygon.relativeArrPoints;
                for(var i = 0; i < rel_points.length; ++i)
                {
                    rel_points[i].x *= kw;
                    rel_points[i].y *= kh;
                }
            }
        }
    },

    calculateOffset: function()
    {
        var bounds = this.getBounds();

        var hc = this.absExtX*0.5;
        var vc = this.absExtY*0.5;

        var transform = this.getOwnTransform();
        var xc = transform.TransformPointX(hc, vc);
        var yc = transform.TransformPointY(hc, vc);
        this.boundsOffsetX = xc - hc - bounds.l;
        this.boundsOffsetY = yc - vc - bounds.t;
    },

    getBounds: function()
    {

        if(this.GraphicObj.transform == null)
        {
            this.GraphicObj.transform = new CMatrix();
            this.GraphicObj.transform.Translate(this.absOffsetX, this.absOffsetY);
            this.GraphicObj.ownTransform = new CMatrix();
            this.GraphicObj.ownTransform.Translate(this.absOffsetX, this.absOffsetY);
        }
        var bounds_checker = new  CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        var temp_transform = this.GraphicObj.transform;
        if(this.GraphicObj instanceof  WordImage)
        {
           this.GraphicObj.transform = this.GraphicObj.ownTransform;
        }
        bounds_checker.transform3(this.GraphicObj.transform);
        bounds_checker.rect(0,0, this.GraphicObj.absExtX, this.GraphicObj.absExtY);
        this.draw(bounds_checker);
        this.GraphicObj.transform = temp_transform;

        bounds_checker.CorrectBounds();
        return {l: bounds_checker.Bounds.min_x, t: bounds_checker.Bounds.min_y, r: bounds_checker.Bounds.max_x , b: bounds_checker.Bounds.max_y};
    },

    getCenterPoint: function()
    {
        return {x: this.absOffsetX + this.absExtX*0.5, y: this.absOffsetY + 0.5*this.absExtY};
    },


    getWrapContour: function()
    {
        if(isRealObject(this.wrappingPolygon))
        {
            var kw = 0.6/this.GraphicObj.absExtX;
            var kh = 0.6/this.GraphicObj.absExtY;
            var rel_points = this.wrappingPolygon.relativeArrPoints;
            var ret = [];
            for(var i = 0; i < rel_points.length; ++i)
            {
                ret[i] = {x: rel_points[i].x *kw, y: rel_points[i].y * kh};
            }
            return ret;
        }
        return [];
    },

    getBoundsRect: function()
    {
        var g = this.GraphicObj;
        if(isRealObject(g))
        {
            var t;
            if(!isRealObject(g.ownTransform))
                t.Translate(g.absOffsetX, g.absOffsetY);
            else
                t = g.ownTransform;

            var min_x, max_x, min_y, max_y;
            min_x = t.TransformPointX(0, 0);
            max_x = min_x;
            min_y = t.TransformPointY(0, 0);
            max_y = min_y;

            var t_x, t_y;
            var arr = [{x: this.absExtX, y: 0}, {x: this.absExtX, y: this.absExtY}, {x: 0, y: this.absExtY}];
            for(var i = 0; i < 3; ++i)
            {
                var p = arr[i];
                t_x = t.TransformPointX(p.x, p.y);
                t_y = t.TransformPointY(p.x, p.y);
                if(t_x < min_x)
                    min_x = t_x;
                if(t_x > max_x)
                    max_x = t_x;
                if(t_y < min_y)
                    min_y = t_y;
                if(t_y > max_y)
                    max_y = t_y;
            }
            return {l: min_x, t: min_y, r: max_x, b: max_y};
        }
        else
        {
            return {l: 0, t: 0, r: 0, b: 0};
        }
    },

    getDrawingArrayType: function()
    {
        if(this.Is_Inline())
            return DRAWING_ARRAY_TYPE_INLINE;
        if(this.behindDoc === true && this.wrappingType === WRAPPING_TYPE_NONE)
            return DRAWING_ARRAY_TYPE_BEHIND;
        if(this.wrappingType === WRAPPING_TYPE_NONE)
            return DRAWING_ARRAY_TYPE_BEFORE;
        return DRAWING_ARRAY_TYPE_WRAPPING;
    },

    updateCursorTypes : function()
    {
        this.cursorTypes = [];
        var transform = this.getTransformMatrix();
        if(transform == null)
        {
            transform = new CMatrix();
            transform.Translate(this.absOffsetX, this.absOffsetY, MATRIX_ORDER_APPEND);
        }
        var vc = this.absExtX*0.5;
        var hc = this.absExtY*0.5;
        var xc = transform.TransformPointX(hc, vc);
        var yc = transform.TransformPointY(hc, vc);
        var xt = transform.TransformPointX(hc, 0);
        var yt = transform.TransformPointY(hc, 0);
        var vx = xt-xc;
        var vy = yc-yt;
        var angle = Math.atan2(vy, vx)+Math.PI/8;
        if(angle < 0)
        {
            angle+=2*Math.PI;
        }
        if(angle > 2*Math.PI)
        {
            angle-=2*Math.PI;
        }

        var xlt = transform.TransformPointX(0, 0);
        var ylt = transform.TransformPointY(0, 0);
        var vx_lt = xlt-xc;
        var vy_lt = yc-ylt;
        var curTypes = [];
        curTypes[0] = "n-resize";
        curTypes[1] = "ne-resize";
        curTypes[2] = "e-resize";
        curTypes[3] = "se-resize";
        curTypes[4] = "s-resize";
        curTypes[5] = "sw-resize";
        curTypes[6] = "w-resize";
        curTypes[7] = "nw-resize";
        var _index = Math.floor(angle/(Math.PI/4));
        var _index2, t;
        if(vx_lt*vy-vx*vy_lt < 0) // нумерация якорьков по часовой стрелке
        {
            for(var i = 0; i<8; ++i)
            {
                //_index2 = (i-_index+17)%8;
                t = i- _index + 17;
                _index2 =  t - ((t/8) >> 0)*8;
                this.cursorTypes[i] = curTypes[_index2];
            }
        }
        else
        {
            for(i = 0; i<8; ++i)
            {
                t = -i-_index+19;
                _index2 = t - ((t/8) >> 0)*8;//(-i-_index+19)%8;
                this.cursorTypes[i] = curTypes[_index2];
            }
        }
    },

    documentSearch: function(String, search_Common)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.documentSearch === "function")
            this.GraphicObj.documentSearch(String, search_Common)
    },


    setParagraphContextualSpacing: function(Value)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphContextualSpacing === "function")
            this.GraphicObj.setParagraphContextualSpacing(Value);
    },

    setParagraphStyle: function(style)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphStyle === "function")
            this.GraphicObj.setParagraphStyle(style);
    },
    writeToBinaryForCopyPaste: function()
    {
        var w = new CMemory();
        var start_string = "";
        if(isRealObject(this.GraphicObj))
        {
            var g_o = this.GraphicObj;
            if(g_o.isImage() && !isRealObject(g_o.chart))
                start_string = "TeamLabImage";
                //w.WriteString2("TeamLabImage");
            else if(g_o.isImage() && isRealObject(g_o.chart))
                start_string = "TeamLabChart";
            //w.WriteString2("TeamLabChart");
            else if(g_o.isShape())
                start_string = "TeamLabShape";

           // w.WriteString2("TeamLabShape");
            else if(g_o.isGroup())
                start_string = "TeamLabGroup";
                //w.WriteString2("TeamLabGroup");
        }
        w.WriteLong(this.DrawingType);
        this.GraphicObj.writeToBinaryForCopyPaste(w);
        w.WriteDouble(this.X);
        w.WriteDouble(this.Y);
        w.WriteDouble(this.W);
        w.WriteDouble(this.H);
        w.WriteDouble(this.PageNum);
        w.WriteDouble(this.YOffset);
        w.WriteBool(this.Focused);
        w.WriteDouble(this.Distance.T);
        w.WriteDouble(this.Distance.B);
        w.WriteDouble(this.Distance.L);
        w.WriteDouble(this.Distance.R);
        w.WriteBool(this.LayoutInCell);
        w.WriteDouble(this.RelativeHeight);
        w.WriteBool(this.SimplePos.Use);
        w.WriteDouble(this.SimplePos.X);
        w.WriteDouble(this.SimplePos.Y);
        w.WriteDouble(this.Extent.W);
        w.WriteDouble(this.Extent.H);
        w.WriteBool(this.AllowOverlap);
        w.WriteDouble(this.PositionH.RelativeFrom);
        w.WriteDouble(this.PositionH.Align);
        w.WriteDouble(this.PositionH.Value);
        w.WriteDouble(this.PositionV.RelativeFrom);
        w.WriteDouble(this.PositionV.Align);
        w.WriteDouble(this.PositionV.Value);
        w.WriteLong(this.wrappingType);
        w.WriteBool(this.behindDoc);
       // this.wrappingPolygon.writeToBinaryForCopyPaste(w);
        return start_string + w.pos + ";" + w.GetBase64Memory();
    },

    readFromBinaryForCopyPaste: function(r, bNoRecalc)
    {
        /*var r = CreateBinaryReader(base64, 0, base64.length);   */
        this.Set_DrawingType(r.GetLong());
        var g;
        switch(r.GetLong())
        {
            case historyitem_type_Shape:
            {

                g = new WordShape(this, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, null);
                g.readFromBinaryForCopyPaste(r, bNoRecalc);
                if(bNoRecalc !== true)
                    g.calculateAfterOpen();
                this.Set_GraphicObject(g);
                break;
            }
            case historyitem_type_GroupShapes:
            {
                g = new WordGroupShapes(this, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, null);
                g.readFromBinaryForCopyPaste(r, bNoRecalc);
                if(bNoRecalc !== true)
                    g.calculateAfterOpen3();
                this.Set_GraphicObject(g);
                break;
            }
            case historyitem_type_Image:
            {
                g = new WordImage(this, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, null);
                g.readFromBinaryForCopyPaste(r, bNoRecalc);
                if(bNoRecalc !== true)
                    g.calculateAfterOpen();
                this.Set_GraphicObject(g);
                break;
            }
        }
        if(bNoRecalc !== true)
        {
            this.X = r.GetDouble();
            this.Y = r.GetDouble();
            this.W = r.GetDouble();
            this.H = r.GetDouble();
            this.Update_Size(this.W, this.H);
            this.PageNum  = r.GetDouble();
            this.YOffset  = r.GetDouble();
            this.Focused = r.GetBool();
            var T, B, L, R;
            T = r.GetDouble();
            B = r.GetDouble();
            L = r.GetDouble();
            R = r.GetDouble();
            this.Set_Distance(L, T, R, B);

            this.LayoutInCell = r.GetBool();
            this.setZIndex2(r.GetDouble());
            this.SimplePos.Use = r.GetBool();
            this.SimplePos.X = r.GetDouble();
            this.SimplePos.Y = r.GetDouble();
            this.Extent.W = r.GetDouble();
            this.Extent.H = r.GetDouble();
            this.Set_AllowOverlap(r.GetBool());
            this.PositionH.RelativeFrom = r.GetDouble();
            this.PositionH.Align = r.GetDouble();
            this.PositionH.Value = r.GetDouble();
            this.Set_PositionH(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
            this.PositionV.RelativeFrom = r.GetDouble();
            this.PositionV.Align = r.GetDouble();
            this.PositionV.Value = r.GetDouble();
            this.Set_PositionV(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
            this.Set_WrappingType(r.GetLong());
            this.Set_BehindDoc(r.GetBool());
           // this.wrappingPolygon.readFromBinaryForCopyPaste(r);
            History.Add(this, {Type: historyitem_CalculateAfterPaste});
        }
    },

    copy: function()
    {
        var c = new ParaDrawing(this.W,  this.H, null, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        c.Set_DrawingType(this.DrawingType);
        if(isRealObject(this.GraphicObj))
        {
            var g = this.GraphicObj.copy(c);
            c.Set_GraphicObject(g);
            if(g.isGroup())
                g.calculateAfterOpen3();
            else
                g.calculateAfterOpen();
        }
        c.Update_Size(this.W, this.H);
        var d = this.Distance;
        c.Set_Distance(d.L, d.T, d.R, d.B);
        c.setZIndex();
        c.Set_AllowOverlap(this.AllowOverlap);
        c.Set_WrappingType(this.wrappingType);
        c.Set_BehindDoc(this.behindDoc);

        History.Add(c, {Type: historyitem_CalculateAfterPaste});
        return c;
    },

    OnContentReDraw: function()
    {
        if(this.Parent && this.Parent.Parent)
            this.Parent.Parent.OnContentReDraw(this.PageNum, this.PageNum);
    },

    getBase64Img: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.getBase64Img === "function")
            return this.GraphicObj.getBase64Img();
        return null;
    },

    isPointInObject: function(x, y, pageIndex)
    {
        if(this.pageIndex === pageIndex)
        {
            if(isRealObject(this.GraphicObj))
            {
                var hit = (typeof  this.GraphicObj.hit === "function") ? this.GraphicObj.hit(x, y) : false;
                var hit_to_text = (typeof  this.GraphicObj.hitToTextRect === "function") ? this.GraphicObj.hitToTextRect(x, y) : false;
                return hit || hit_to_text;
            }
        }
        return false;
    }
};

// Класс GraphicPicture
function GraphicPicture(Img)
{
    this.Img = Img;
}

GraphicPicture.prototype =
{
    Draw : function(Context, X, Y, W, H)
    {
        Context.drawImage( this.Img, X, Y, W, H );
    },

    Copy : function()
    {
        return new GraphicPicture(this.Img);
    }
};

// Класс ParaPageNum
function ParaPageNum()
{
    this.Type = para_PageNum;
}

ParaPageNum.prototype =
{
    getValue: function()
    {
        return undefined;
    },
    Draw : function(X,Y,Context, Value, Align)
    {
        // Value - реальное значение, которое должно быть отрисовано.
        // Align - прилегание параграфа, в котором лежит данный номер страницы.

        var sValue = "" + (Value + 1);

        g_oTextMeasurer.SetTextPr( Context.GetTextPr() );
        g_oTextMeasurer.SetFontSlot( fontslot_ASCII );

        var RealWidth = 0;
        for ( var Index = 0; Index < sValue.length; Index++ )
        {
            var Char = sValue.charAt(Index);
            RealWidth += g_oTextMeasurer.Measure( Char ).Width;
        }

        var _X = X;
        var _Y = Y;

        switch(Align)
        {
            case align_Left:
            {
                _X = X;
                break;
            }
            case align_Right:
            {
                _X = X + this.Width - RealWidth;
                break;
            }
            case align_Center:
            {
                _X = X + (this.Width - RealWidth) / 2;
                break;
            }
        }

        for ( var Index = 0; Index < sValue.length; Index++ )
        {
            var Char = sValue.charAt(Index);
            Context.FillText( _X, _Y, Char );
            _X += g_oTextMeasurer.Measure( Char ).Width;
        }
    },

    Measure : function (Context)
    {
        var Width = 0;
        for ( var Index = 0; Index < 10; Index++ )
        {
            var TempW = Context.Measure( "" + Index ).Width;
            if ( Width < TempW )
                Width = TempW;
        }

        // Выделяем место под 4 знака
        Width *= 4;

        this.Width        = Width;
        this.Height       = 0;
        this.WidthVisible = Width;
    },

    Document_CreateFontCharMap : function(FontCharMap)
    {
        var sValue = "1234567890";
        for ( var Index = 0; Index < sValue.length; Index++ )
        {
            var Char = sValue.charAt(Index);
            FontCharMap.AddChar( Char );
        }
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaPageNum();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    }
};


// Класс ParaFlowObjectAnchor
function ParaFlowObjectAnchor(FlowObject)
{
    this.Type = para_FlowObjectAnchor;

    this.FlowObject = FlowObject;
}

ParaFlowObjectAnchor.prototype =
{
    Draw : function(X,Y,Context, Value, Align)
    {
    },

    Measure : function (Context)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        //return { Width : 0, Height : 0, WidthVisible : 0 };
    },

    Is_RealContent : function()
    {
        return false;
    },

    Set_FlowObject : function(Object)
    {
        this.FlowObject = Object;
    },

    Get_FlowObject : function()
    {
        return this.FlowObject;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    }
};

// Класс начало гиперссылки
function ParaHyperlinkStart()
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Type = para_HyperlinkStart;

    this.Value = "";

    this.Visited = false;
    this.ToolTip = null;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

ParaHyperlinkStart.prototype =
{
    getValue: function()
    {
        return this.Value;
    },
    Get_Id : function()
    {
        return this.Id;
    },

    Draw : function(X, Y, Context)
    {

    },

    Measure : function(Context)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        var Hyper = new ParaHyperlinkStart();
        Hyper.Value   = this.Value;
        Hyper.Visited = this.Visited;
        Hyper.ToolTip = this.ToolTip;
        return Hyper;
    },

    Set_Visited : function(Value)
    {
        this.Visited = Value;
    },

    Get_Visited : function()
    {
        return this.Visited;
    },

    Set_ToolTip : function(ToolTip)
    {
        History.Add( this, { Type : historyitem_Hyperlink_ToolTip, New : ToolTip, Old : this.ToolTip } );
        this.ToolTip = ToolTip;
    },

    Get_ToolTip : function()
    {
        if ( null === this.ToolTip )
        {
            if ( "string" === typeof(this.Value) )
                return this.Value;
            else
                return "";
        }
        else
            return this.ToolTip;
    },

    Get_Value : function()
    {
        return this.Value;
    },

    Set_Value : function(Value)
    {
        History.Add( this, { Type : historyitem_Hyperlink_Value, New : Value, Old : this.Value } );
        this.Value = Value;
    },

    Copy : function()
    {
        var Hyperlink_new = new ParaHyperlinkStart();

        Hyperlink_new.Value   = this.Value;
        Hyperlink_new.Visited = this.Visited;
        Hyperlink_new.ToolTip = this.ToolTip;

        return Hyperlink_new;
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;
        switch(Type)
        {
            case historyitem_Hyperlink_Value :
            {
                this.Value = Data.Old;
                break;
            }

            case historyitem_Hyperlink_ToolTip :
            {
                this.ToolTip = Data.Old;
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;
        switch(Type)
        {
            case historyitem_Hyperlink_Value :
            {
                this.Value = Data.New;
                break;
            }

            case historyitem_Hyperlink_ToolTip :
            {
                this.ToolTip = Data.New;
                break;
            }
        }
    },

    Refresh_RecalcData : function()
    {
    },

//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Hyperlink );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch(Type)
        {
            case historyitem_Hyperlink_Value :
            {
                // String : Value
                Writer.WriteString2( Data.New );
                break;
            }

            case historyitem_Hyperlink_ToolTip :
            {
                // String : ToolTip
                Writer.WriteString2( Data.New );

                break;
            }
        }
    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Hyperlink != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_Hyperlink_Value:
            {
                // String : Value
                this.Value = Reader.GetString2();
                break;
            }

            case historyitem_Hyperlink_ToolTip :
            {
                // String : ToolTip
                this.ToolTip = Reader.GetString2();

                if ( "" === this.ToolTip )
                    this.ToolTip = null;

                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_Hyperlink );

        // Long   : Type
        // String : Id
        // String : Value
        // String : ToolTip

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
        Writer.WriteString2( this.Value );
        Writer.WriteString2( this.ToolTip );
    },

    Read_FromBinary2 : function(Reader)
    {
        // Long   : Type
        // String : Id
        // String : Value
        // String : ToolTip

        this.Type    = Reader.GetLong();
        this.Id      = Reader.GetString2();
        this.Value   = Reader.GetString2();
        this.ToolTip = Reader.GetString2();

        if ( "" === this.ToolTip )
            this.ToolTip = null;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : Id

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
    }
};

// Класс конец гиперссылки
function ParaHyperlinkEnd()
{
    this.Type = para_HyperlinkEnd;
}

ParaHyperlinkEnd.prototype =
{
    getValue: function()
    {
        return undefined;
    },
    Draw : function(X, Y, Context)
    {

    },

    Measure : function(Context)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaHyperlinkEnd();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    }
};

// Класс ParaCollaborativeChangesStart
function ParaCollaborativeChangesStart()
{
    this.Type = para_CollaborativeChangesStart;
}

ParaCollaborativeChangesStart.prototype =
{
    getValue: function()
    {
        return undefined;
    },
    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

    },

    Is_RealContent : function()
    {
        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    }
};

// Класс ParaCollaborativeChangesEnd
function ParaCollaborativeChangesEnd()
{
    this.Type = para_CollaborativeChangesEnd;
}

ParaCollaborativeChangesEnd.prototype =
{
    getValue: function()
    {
        return undefined;
    },

    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    }
};

// Класс ParaCommentStart
function ParaCommentStart(Id)
{
    this.Type = para_CommentStart;
    this.Id   = Id;
}

ParaCommentStart.prototype =
{
    getValue: function()
    {
        return this.Id;
    },
    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaCommentStart(this.Id);
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
    },

    Read_FromBinary : function(Reader)
    {
        this.Id = Reader.GetString2();
    }
};

// Класс ParaCommentEnd
function ParaCommentEnd(Id)
{
    this.Type = para_CommentEnd;
    this.Id   = Id;
}

ParaCommentEnd.prototype =
{
    getValue: function()
    {
        return this.Id;
    },
    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaCommentEnd(this.Id);
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
    },

    Read_FromBinary : function(Reader)
    {
        this.Id = Reader.GetString2();
    }
};

// Класс ParaPresentationNumbering
function ParaPresentationNumbering()
{
    this.Type = para_PresentationNumbering;

    // Эти данные заполняются во время пересчета, перед вызовом Measure
    this.Bullet    = null;
    this.BulletNum = null;
}

ParaPresentationNumbering.prototype =
{
    Draw : function(X, Y, Context, FirstTextPr)
    {
        this.Bullet.Draw( X, Y, Context, FirstTextPr );
    },

    Measure : function (Context, FirstTextPr)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        var Temp = this.Bullet.Measure( Context, FirstTextPr, this.BulletNum );

        this.Width        = Temp.Width;
        this.WidthVisible = Temp.Width;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaPresentationNumbering();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    }
};

function ParagraphContent_Read_FromBinary(Reader)
{
    var ElementType = Reader.GetLong();

    var Element = null;
    switch ( ElementType )
    {
        case para_TextPr            :
        case para_Drawing           :
        case para_HyperlinkStart    :
        {
            var ElementId = Reader.GetString2();
            Element = g_oTableId.Get_ById( ElementId );
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
        Element.Read_FromBinary(Reader);

    return Element;
}


function ParagraphContent_Read_FromBinary2(Reader)
{
    var ElementType = Reader.GetLong();

    var Element = null;
    switch ( ElementType )
    {
        case para_TextPr            :
        case para_Drawing           :
        case para_HyperlinkStart    :
        {
            var ElementId = Reader.GetString2();
            Element = g_oTableId.Get_ById( ElementId );
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
        Element.readFromBinary(Reader);

    return Element;
}


