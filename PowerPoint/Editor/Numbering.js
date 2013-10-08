/**
 * User: Ilja.Kirillov
 * Date: 07.11.11
 * Time: 14:49
 */

var numbering_numfmt_None        = 0x0000;
var numbering_numfmt_Bullet      = 0x1001;
var numbering_numfmt_Decimal     = 0x2002;
var numbering_numfmt_LowerRoman  = 0x2003;
var numbering_numfmt_UpperRoman  = 0x2004;
var numbering_numfmt_LowerLetter = 0x2005;
var numbering_numfmt_UpperLetter = 0x2006;

var numbering_lvltext_Text = 1;
var numbering_lvltext_Num  = 2;

var numbering_suff_Tab     = 1;
var numbering_suff_Space   = 2;
var numbering_suff_Nothing = 3;



// Преобразовываем число в буквенную строку :
//  1 -> a
//  2 -> b
//   ...
// 26 -> z
// 27 -> aa
//   ...
// 52 -> zz
// 53 -> aaa
//   ...
function Numbering_Number_To_Alpha(Num, bLowerCase)
{
    var _Num = Num - 1;
    var Count = (_Num - _Num % 26) / 26;
    var Ost   = _Num % 26;

    var T = "";

    var Letter;
    if ( true === bLowerCase )
        Letter = String.fromCharCode( Ost + 97 );
    else
        Letter = String.fromCharCode( Ost + 65 );

    for ( var Index2 = 0; Index2 < Count + 1; Index2++ )
        T += Letter;

    return T;
}

// Преобразовываем число в обычную строку :
function Numbering_Number_To_String(Num)
{
    return "" + Num;
}

// Преобразовываем число в римскую систему исчисления :
//    1 -> i
//    4 -> iv
//    5 -> v
//    9 -> ix
//   10 -> x
//   40 -> xl
//   50 -> l
//   90 -> xc
//  100 -> c
//  400 -> cd
//  500 -> d
//  900 -> cm
// 1000 -> m
function Numbering_Number_To_Roman(Num, bLowerCase)
{
    // Переводим число Num в римскую систему исчисления
    var Rims;

    if ( true === bLowerCase )
        Rims = [  'm', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
    else
        Rims = [  'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

    var Vals = [ 1000,  900, 500,  400, 100,   90,  50,   40,  10,    9,   5,    4,   1,   0];

    var T = "";
    var Index2 = 0;
    while ( Num > 0 )
    {
        while ( Vals[Index2] <= Num )
        {
            T   += Rims[Index2];
            Num -= Vals[Index2];
        }

        Index2++;

        if ( Index2 >= Rims.length )
            break;
    }

    return T;
}

function LvlText_Read_FromBinary(Reader)
{
    var ElementType = Reader.GetLong();
    var Element = null;

    if ( numbering_lvltext_Num === ElementType )
        Element = new CLvlText_Num();
    else if ( numbering_lvltext_Text === ElementType )
        Element = new CLvlText_Text();

    Element.Read_FromBinary(Reader);

    return Element;
}

function CLvlText_Text(Val)
{
    if ( "string" == typeof(Val) )
        this.Value = Val;
    else
        this.Value = "";

    this.Type = numbering_lvltext_Text;
}

CLvlText_Text.prototype =
{
    Copy : function()
    {
        var Obj = new CLvlText_Text( this.Value );
        return Obj;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : numbering_lvltext_Text
        // String : Value

        Writer.WriteLong( numbering_lvltext_Text );
        Writer.WriteString2( this.Value );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value = Reader.GetString2();
    }

};

function CLvlText_Num(Lvl)
{
    if ( "number" == typeof(Lvl) )
        this.Value = Lvl;
    else
        this.Value = 0;

    this.Type = numbering_lvltext_Num;
}

CLvlText_Num.prototype =
{
    Copy : function()
    {
        var Obj = new CLvlText_Num( this.Value );
        return Obj;
    },

    Write_ToBinary : function(Writer)
    {
        // Long : numbering_lvltext_Text
        // Long : Value

        Writer.WriteLong( numbering_lvltext_Num );
        Writer.WriteLong( this.Value );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value = Reader.GetLong();
    }
};

function CAbstractNum(Type)
{
    this.Id = g_oIdCounter.Get_NewId();

    if ( "undefined" == typeof(Type) )
        Type = numbering_numfmt_Bullet;

    this.Lock = new CLock();
    if ( false === g_oIdCounter.m_bLoad )
    {
        this.Lock.Set_Type( locktype_Mine, false );
        CollaborativeEditing.Add_Unlock2( this );
    }


    this.Lvl = new Array();
    for ( var Index = 0; Index < 9; Index++ )
    {
        this.Lvl[Index] = new Object();
        var Lvl = this.Lvl[Index];

        Lvl.Start   = 1;
        Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
        Lvl.Suff    = numbering_suff_Tab;

        var Left      =  36 * (Index + 1) * g_dKoef_pt_to_mm;
        var FirstLine = -18 * g_dKoef_pt_to_mm;

        Lvl.Jc     = align_Left;
        Lvl.Format = numbering_numfmt_Bullet;

        Lvl.LvlText = new Array();

        Lvl.ParaPr = new Object();
        Lvl.ParaPr.Ind =
        {
            Left      : Left,
            FirstLine : FirstLine
        };

        var TextPr = new Object();
        if ( 0 == Index % 3 )
        {
            TextPr.FontFamily = { Name : "Symbol", Index : -1 };
            Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00B7 ) ) );
        }
        else if ( 1 == Index % 3 )
        {
            TextPr.FontFamily = { Name : "Courier New", Index : -1 };
            Lvl.LvlText.push( new CLvlText_Text( "o" ) );
        }
        else
        {
            TextPr.FontFamily = { Name : "Wingdings", Index : -1 };
            Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00A7 ) ) );
        }

        Lvl.TextPr = TextPr;
    }

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CAbstractNum.prototype =
{
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },

    // Копируем информацию из другой нумерации
    Copy : function(AbstractNum)
    {
        for ( var Index = 0; Index < 9; Index++ )
        {
            this.Lvl[Index] = this.Internal_CopyLvl( AbstractNum.Lvl[Index] );
        }
    },

    // Определяем многоуровненый список по умолчанию
    Create_Default_Numbered : function()
    {
        for ( var Index = 0; Index < 9; Index++ )
        {
            var Lvl_old = this.Internal_CopyLvl( this.Lvl[Index] );

            this.Lvl[Index] = new Object();
            var Lvl = this.Lvl[Index];

            Lvl.Start   = 1;
            Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
            Lvl.Suff    = numbering_suff_Tab;

            var Left      =  36 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;

            if ( 0 == Index % 3 )
            {
                Lvl.Jc     = align_Left;
                Lvl.Format = numbering_numfmt_Decimal;
            }
            else if ( 1 == Index % 3 )
            {
                Lvl.Jc     = align_Left;
                Lvl.Format = numbering_numfmt_LowerLetter;
            }
            else
            {
                Lvl.Jc     = align_Right;
                Lvl.Format = numbering_numfmt_LowerRoman;
                FirstLine  = -9 * g_dKoef_pt_to_mm;
            }

            Lvl.LvlText = new Array();
            Lvl.LvlText.push( new CLvlText_Num( Index ) );
            Lvl.LvlText.push( new CLvlText_Text( "." ) );

            Lvl.ParaPr = new Object();
            Lvl.ParaPr.Ind =
            {
                Left      : Left,
                FirstLine : FirstLine
            };

            var TextPr = new Object();
            TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

            Lvl.TextPr = TextPr;

            var Lvl_new = this.Internal_CopyLvl( Lvl );
            History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : Index, Old : Lvl_old, New : Lvl_new } );
        }
    },

    Create_Default_Multilevel_1 : function()
    {
        for ( var Index = 0; Index < 9; Index++ )
        {
            var Lvl_old = this.Internal_CopyLvl( this.Lvl[Index] );

            this.Lvl[Index] = new Object();
            var Lvl = this.Lvl[Index];

            Lvl.Start   = 1;
            Lvl.Restart = -1;
            Lvl.Suff    = numbering_suff_Tab;

            var Left      =  18 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;

            Lvl.Jc     = align_Left;

            if ( 0 == Index % 3 )
            {
                Lvl.Format = numbering_numfmt_Decimal;
            }
            else if ( 1 == Index % 3 )
            {
                Lvl.Format = numbering_numfmt_LowerLetter;
            }
            else
            {
                Lvl.Format = numbering_numfmt_LowerRoman;
            }

            Lvl.LvlText = new Array();
            Lvl.LvlText.push( new CLvlText_Num( Index ) );
            Lvl.LvlText.push( new CLvlText_Text( ")" ) );

            Lvl.ParaPr = new Object();
            Lvl.ParaPr.Ind =
            {
                Left      : Left,
                FirstLine : FirstLine
            };

            var TextPr = new Object();
            TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

            Lvl.TextPr = TextPr;

            var Lvl_new = this.Internal_CopyLvl( Lvl );
            History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : Index, Old : Lvl_old, New : Lvl_new } );
        }
    },

    Create_Default_Multilevel_2 : function()
    {
        for ( var Index = 0; Index < 9; Index++ )
        {
            var Lvl_old = this.Internal_CopyLvl( this.Lvl[Index] );

            this.Lvl[Index] = new Object();
            var Lvl = this.Lvl[Index];

            Lvl.Start   = 1;
            Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
            Lvl.Suff    = numbering_suff_Tab;

            var Left      =  0;
            var FirstLine =  0;

            switch ( Index )
            {
                case 0 :
                    Left      =  18 * g_dKoef_pt_to_mm;
                    FirstLine = -18 * g_dKoef_pt_to_mm;
                    break;
                case 1 :
                    Left      =  39.6 * g_dKoef_pt_to_mm;
                    FirstLine = -21.6 * g_dKoef_pt_to_mm;
                    break;
                case 2 :
                    Left      =  61.2 * g_dKoef_pt_to_mm;
                    FirstLine = -25.2 * g_dKoef_pt_to_mm;
                    break;
                case 3 :
                    Left      =  86.4 * g_dKoef_pt_to_mm;
                    FirstLine = -32.4 * g_dKoef_pt_to_mm;
                    break;
                case 4 :
                    Left      =  111.6 * g_dKoef_pt_to_mm;
                    FirstLine = -39.6  * g_dKoef_pt_to_mm;
                    break;
                case 5 :
                    Left      =  136.8 * g_dKoef_pt_to_mm;
                    FirstLine = -46.8  * g_dKoef_pt_to_mm;
                    break;
                case 6 :
                    Left      =  162 * g_dKoef_pt_to_mm;
                    FirstLine = -54  * g_dKoef_pt_to_mm;
                    break;
                case 7 :
                    Left      =  187.2 * g_dKoef_pt_to_mm;
                    FirstLine =  -61.2 * g_dKoef_pt_to_mm;
                    break;
                case 8 :
                    Left      =  216 * g_dKoef_pt_to_mm;
                    FirstLine = -72  * g_dKoef_pt_to_mm;
                    break;
            }

            Lvl.Jc     = align_Left;
            Lvl.Format = numbering_numfmt_Decimal;

            Lvl.LvlText = new Array();
            for ( var Index2 = 0; Index2 <= Index; Index2++ )
            {
                Lvl.LvlText.push( new CLvlText_Num( Index2 ) );
                Lvl.LvlText.push( new CLvlText_Text( "." ) );
            }

            Lvl.ParaPr = new Object();
            Lvl.ParaPr.Ind =
            {
                Left      : Left,
                FirstLine : FirstLine
            };

            var TextPr = new Object();
            TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

            Lvl.TextPr = TextPr;

            var Lvl_new = this.Internal_CopyLvl( Lvl );
            History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : Index, Old : Lvl_old, New : Lvl_new } );
        }
    },

    Create_Default_Multilevel_3 : function()
    {
        for ( var Index = 0; Index < 9; Index++ )
        {
            var Lvl_old = this.Internal_CopyLvl( this.Lvl[Index] );

            this.Lvl[Index] = new Object();
            var Lvl = this.Lvl[Index];

            Lvl.Start   = 1;
            Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
            Lvl.Suff    = numbering_suff_Tab;

            var Left      =  18 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;
            Lvl.Format = numbering_numfmt_Bullet;
            Lvl.Jc     = align_Left;

            if ( 0 == Index % 3 )
            {
                Lvl.Jc     = align_Left;
            }
            else if ( 1 == Index % 3 )
            {
                Lvl.Jc     = align_Left;
                Lvl.Format = numbering_numfmt_LowerLetter;
            }
            else
            {
                Lvl.Jc     = align_Right;
                Lvl.Format = numbering_numfmt_LowerRoman;
                FirstLine  = -9 * g_dKoef_pt_to_mm;
            }

            Lvl.LvlText = new Array();
            switch( Index )
            {
                case 0:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x0076 ) ) );
                    break;
                case 1:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00D8 ) ) );
                    break;
                case 2:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00A7 ) ) );
                    break;
                case 3:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00B7 ) ) );
                    break;
                case 4:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00A8 ) ) );
                    break;
                case 5:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00D8 ) ) );
                    break;
                case 6:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00A7 ) ) );
                    break;
                case 7:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00B7 ) ) );
                    break;
                case 8:
                    Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00A8 ) ) );
                    break;
            }

            Lvl.ParaPr = new Object();
            Lvl.ParaPr.Ind =
            {
                Left      : Left,
                FirstLine : FirstLine
            };

            var TextPr = new Object();
            if ( 3 === Index || 4 === Index || 7 === Index || 8 === Index )
                TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };
            else
                TextPr.FontFamily = { Name : "Wingdings", Index : -1 };

            Lvl.TextPr = TextPr;

            var Lvl_new = this.Internal_CopyLvl( Lvl );
            History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : Index, Old : Lvl_old, New : Lvl_new } );
        }
    },

    Create_Default_Bullet : function()
    {
        for ( var Index = 0; Index < 9; Index++ )
        {
            var Lvl_old = this.Internal_CopyLvl( this.Lvl[Index] );

            this.Lvl[Index] = new Object();
            var Lvl = this.Lvl[Index];

            Lvl.Start   = 1;
            Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
            Lvl.Suff    = numbering_suff_Tab;

            var Left      =  36 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;

            Lvl.Jc     = align_Left;
            Lvl.Format = numbering_numfmt_Bullet;

            Lvl.LvlText = new Array();

            Lvl.ParaPr = new Object();
            Lvl.ParaPr.Ind =
            {
                Left      : Left,
                FirstLine : FirstLine
            };

            var TextPr = new Object();
            if ( 0 == Index % 3 )
            {
                TextPr.FontFamily = { Name : "Symbol", Index : -1 };
                Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00B7 ) ) );
            }
            else if ( 1 == Index % 3 )
            {
                TextPr.FontFamily = { Name : "Courier New", Index : -1 };
                Lvl.LvlText.push( new CLvlText_Text( "o" ) );
            }
            else
            {
                TextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                Lvl.LvlText.push( new CLvlText_Text( String.fromCharCode( 0x00A7 ) ) );
            }

            Lvl.TextPr = TextPr;

            var Lvl_new = this.Internal_CopyLvl( Lvl );
            History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : Index, Old : Lvl_old, New : Lvl_new } );
        }
    },

    Set_Lvl_Bullet : function(iLvl, LvlText, TextPr)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Format = numbering_numfmt_Bullet;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Text( LvlText ) );
        Lvl.TextPr = TextPr;

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // 1) right
    Set_Lvl_Numbered_1 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Right;
        Lvl.Format = numbering_numfmt_Decimal;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( ")" ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // 1. right
    Set_Lvl_Numbered_2 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Right;
        Lvl.Format = numbering_numfmt_Decimal;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( "." ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // 1. left
    Set_Lvl_Numbered_3 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_Decimal;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( "." ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // 1) left
    Set_Lvl_Numbered_4 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_Decimal;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( ")" ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // I. right
    Set_Lvl_Numbered_5 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Right;
        Lvl.Format = numbering_numfmt_UpperRoman;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( "." ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // A. left
    Set_Lvl_Numbered_6 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_UpperLetter;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( "." ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // a) left
    Set_Lvl_Numbered_7 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_LowerLetter;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( ")" ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // a. left
    Set_Lvl_Numbered_8 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_LowerLetter;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( "." ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // i. left
    Set_Lvl_Numbered_9 : function(iLvl)
    {
        if ( "number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9 )
            return;

        var Lvl = this.Lvl[iLvl];

        var Lvl_old = this.Internal_CopyLvl( Lvl );

        Lvl.Jc = align_Right;
        Lvl.Format = numbering_numfmt_LowerRoman;
        Lvl.LvlText = new Array();
        Lvl.LvlText.push( new CLvlText_Num( iLvl ) );
        Lvl.LvlText.push( new CLvlText_Text( "." ) );
        Lvl.TextPr.FontFamily = { Name : "Times New Roman", Index : -1 };

        var Lvl_new = this.Internal_CopyLvl( Lvl );
        History.Add( this, { Type : historyitem_AbstractNum_LvlChange, Index : iLvl, Old : Lvl_old, New : Lvl_new } );
    },

    // X, Y, Context - параметры для рисование
    // Lvl - уровень, с которого мы берем текст и настройки для текста
    // NumInfo - информация о номере данного элемента в списке (массив из Lvl элементов)
    // NumTextPr - рассчитанные настройки для символов нумерации (уже с учетом настроек текущего уровня)
    Draw : function(X,Y, Context, Lvl, NumInfo, NumTextPr)
    {
        var Text = this.Lvl[Lvl].LvlText;

        var OldFont = Context.GetFont();
        var OldFont2 = g_oTextMeasurer.GetFont();

        Context.SetFont( NumTextPr );
        g_oTextMeasurer.SetFont( NumTextPr );

        for ( var Index = 0; Index < Text.length; Index++ )
        {
            switch( Text[Index].Type )
            {
                case numbering_lvltext_Text:
                {
                    Context.FillText( X, Y, Text[Index].Value );
                    X += g_oTextMeasurer.Measure( Text[Index].Value ).Width;

                    break;
                }
                case numbering_lvltext_Num:
                {
                    var CurLvl = Text[Index].Value;
                    switch( this.Lvl[CurLvl].Format )
                    {
                        case numbering_numfmt_Bullet:
                        {
                            break;
                        }

                        case numbering_numfmt_Decimal:
                        {
                            if ( CurLvl < NumInfo.length )
                            {
                                var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
                                for ( var Index2 = 0; Index2 < T.length; Index2++ )
                                {
                                    var Char = T.charAt(Index2);
                                    Context.FillText( X, Y, Char );
                                    X += g_oTextMeasurer.Measure( Char ).Width;
                                }
                            }
                            break;
                        }

                        case numbering_numfmt_LowerLetter:
                        case numbering_numfmt_UpperLetter:
                        {
                            if ( CurLvl < NumInfo.length )
                            {
                                // Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
                                var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

                                var Count = (Num - Num % 26) / 26;
                                var Ost   = Num % 26;

                                var T = "";

                                var Letter;
                                if ( numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format )
                                    Letter = String.fromCharCode( Ost + 97 );
                                else
                                    Letter = String.fromCharCode( Ost + 65 );

                                for ( var Index2 = 0; Index2 < Count + 1; Index2++ )
                                    T += Letter;

                                for ( var Index2 = 0; Index2 < T.length; Index2++ )
                                {
                                    var Char = T.charAt(Index2);
                                    Context.FillText( X, Y, Char );
                                    X += g_oTextMeasurer.Measure( Char ).Width;
                                }
                            }
                            break;
                        }

                        case numbering_numfmt_LowerRoman:
                        case numbering_numfmt_UpperRoman:
                        {
                            if ( CurLvl < NumInfo.length )
                            {
                                var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

                                // Переводим число Num в римскую систему исчисления
                                var Rims;

                                if ( numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format )
                                    Rims = [  'm', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
                                else
                                    Rims = [  'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

                                var Vals = [ 1000,  900, 500,  400, 100,   90,  50,   40,  10,    9,   5,    4,   1,   0];

                                var T = "";
                                var Index2 = 0;
                                while ( Num > 0 )
                                {
                                    while ( Vals[Index2] <= Num )
                                    {
                                        T   += Rims[Index2];
                                        Num -= Vals[Index2];
                                    }

                                    Index2++;

                                    if ( Index2 >= Rims.length )
                                        break;
                                }

                                for ( var Index2 = 0; Index2 < T.length; Index2++ )
                                {
                                    var Char = T.charAt(Index2);
                                    Context.FillText( X, Y, Char );
                                    X += g_oTextMeasurer.Measure( T.charAt(Index2) ).Width;
                                }
                            }
                            break;
                        }
                    }

                    break;
                }
            }
        }

        Context.SetFont( OldFont );
        g_oTextMeasurer.SetFont( OldFont2 );
    },

    Measure : function(Context, Lvl, NumInfo, NumTextPr)
    {
        var X = 0;
        var Text = this.Lvl[Lvl].LvlText;

        var OldFont = Context.GetFont();

        Context.SetFont( NumTextPr );
        var Ascent = Context.GetAscender();

        for ( var Index = 0; Index < Text.length; Index++ )
        {
            switch( Text[Index].Type )
            {
                case numbering_lvltext_Text:
                {
                    X += Context.Measure( Text[Index].Value ).Width;

                    break;
                }
                case numbering_lvltext_Num:
                {
                    var CurLvl = Text[Index].Value;
                    switch( this.Lvl[CurLvl].Format )
                    {
                        case numbering_numfmt_Bullet:
                        {
                            break;
                        }

                        case numbering_numfmt_Decimal:
                        {
                            if ( CurLvl < NumInfo.length )
                            {
                                var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
                                for ( var Index2 = 0; Index2 < T.length; Index2++ )
                                {
                                    var Char = T.charAt(Index2);
                                    X += Context.Measure( Char ).Width;
                                }
                            }
                            break;
                        }

                        case numbering_numfmt_LowerLetter:
                        case numbering_numfmt_UpperLetter:
                        {
                            if ( CurLvl < NumInfo.length )
                            {
                                // Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
                                var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

                                var Count = (Num - Num % 26) / 26;
                                var Ost   = Num % 26;

                                var T = "";

                                var Letter;
                                if ( numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format )
                                    Letter = String.fromCharCode( Ost + 97 );
                                else
                                    Letter = String.fromCharCode( Ost + 65 );

                                for ( var Index2 = 0; Index2 < Count + 1; Index2++ )
                                    T += Letter;

                                for ( var Index2 = 0; Index2 < T.length; Index2++ )
                                {
                                    var Char = T.charAt(Index2);
                                    X += Context.Measure( Char ).Width;
                                }
                            }
                            break;
                        }

                        case numbering_numfmt_LowerRoman:
                        case numbering_numfmt_UpperRoman:
                        {
                            if ( CurLvl < NumInfo.length )
                            {
                                var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

                                // Переводим число Num в римскую систему исчисления
                                var Rims;

                                if ( numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format )
                                    Rims = [  'm', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
                                else
                                    Rims = [  'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

                                var Vals = [ 1000,  900, 500,  400, 100,   90,  50,   40,  10,    9,   5,    4,   1,   0];

                                var T = "";
                                var Index2 = 0;
                                while ( Num > 0 )
                                {
                                    while ( Vals[Index2] <= Num )
                                    {
                                        T   += Rims[Index2];
                                        Num -= Vals[Index2];
                                    }

                                    Index2++;

                                    if ( Index2 >= Rims.length )
                                        break;
                                }

                                for ( var Index2 = 0; Index2 < T.length; Index2++ )
                                {
                                    var Char = T.charAt(Index2);
                                    X += Context.Measure( T.charAt(Index2) ).Width;
                                }
                            }
                            break;
                        }
                    }

                    break;
                }
            }
        }

        Context.SetFont( OldFont );
        return { Width : X, Ascent : Ascent };
    },

    DocumentStatistics : function(Lvl, Stats)
    {
        var Text = this.Lvl[Lvl].LvlText;

        var bWord = false;
        for ( var Index = 0; Index < Text.length; Index++ )
        {
            var bSymbol  = false;
            var bSpace   = false;
            var bNewWord = false;

            if ( numbering_lvltext_Text === Text[Index].Type && ( sp_string === Text[Index].Value || nbsp_string === Text[Index].Value ) )
            {
                bWord   = false;
                bSymbol = true;
                bSpace  = true;
            }
            else
            {
                if ( false === bWord )
                    bNewWord = true;

                bWord   = true;
                bSymbol = true;
                bSpace  = false;
            }

            if ( true === bSymbol )
                Stats.Add_Symbol( bSpace );

            if ( true === bNewWord )
                Stats.Add_Word();
        }

        if ( numbering_suff_Tab === this.Lvl[Lvl].Suff || numbering_suff_Space === this.Lvl[Lvl].Suff )
            Stats.Add_Symbol( true );
    },

    // Применяем новые тектовые настройки к данной нумерации на заданном уровне
    Apply_TextPr : function(Lvl, TextPr)
    {
        var CurTextPr = this.Lvl[Lvl].TextPr;

        var TextPr_old = Styles_Copy_TextPr( CurTextPr );
        Common_CopyObj2( CurTextPr, TextPr );
        var TextPr_new = Styles_Copy_TextPr( CurTextPr );

        History.Add( this, { Type : historyitem_AbstractNum_TextPrChange, Index : Lvl, Old : TextPr_old, New : TextPr_new } );
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------

    // Копируем информацию о заданном уровне
    Internal_CopyLvl : function(Lvl)
    {
        var Lvl_new = new Object();

        Lvl_new.Start   = Lvl.Start;
        Lvl_new.Restart = Lvl.Restart;
        Lvl_new.Suff    = Lvl.Suff;

        Lvl_new.Jc      = Lvl.Jc;
        Lvl_new.Format  = Lvl.Format;

        Lvl_new.LvlText = new Array();
        for ( var Index = 0; Index < Lvl.LvlText.length; Index++ )
        {
            var Item = Lvl.LvlText[Index];
            Lvl_new.LvlText.push( Item.Copy() );
        }
        Lvl_new.TextPr = Styles_Copy_TextPr( Lvl.TextPr );
        Lvl_new.ParaPr = Styles_Copy_ParaPr( Lvl.ParaPr );

        return Lvl_new;
    },

    Internal_SetLvl : function(iLvl, Lvl_new)
    {
        var Lvl = this.Lvl[iLvl];

        Lvl.Jc      = Lvl_new.Jc;
        Lvl.Format  = Lvl_new.Format;
        Lvl.LvlText = Lvl_new.LvlText;
        Lvl.TextPr  = Lvl_new.TextPr;
        Lvl.ParaPr  = Lvl_new.ParaPr;
    },

    Write_Lvl_ToBinary : function(Lvl, Writer)
    {
        // Long               : Jc
        // Long               : Format
        // Variable           : TextPr
        // Variable           : ParaPr
        // Long               : количество элементов в LvlText
        // Array of variables : массив LvlText

        Writer.WriteLong( Lvl.Jc );
        Writer.WriteLong( Lvl.Format );

        Styles_Write_TextPr_ToBinary(Lvl.TextPr, Writer);
        Styles_Write_ParaPr_ToBinary(Writer, Lvl.ParaPr);

        var Count = Lvl.LvlText.length;
        Writer.WriteLong( Count );

        for ( var Index = 0; Index < Count; Index++ )
            Lvl.LvlText[Index].Write_ToBinary( Writer );
    },

    Read_Lvl_FromBinary : function(Lvl, Reader)
    {
        // Long               : Jc
        // Long               : Format
        // Variable           : TextPr
        // Variable           : ParaPr
        // Long               : количество элементов в LvlText
        // Array of variables : массив LvlText

        Lvl.Jc     = Reader.GetLong();
        Lvl.Format = Reader.GetLong();

        Lvl.TextPr = new Object();
        Styles_Read_TextPr_FromBinary(Lvl.TextPr, Reader);
        Styles_Read_ParaPr_FromBinary(Reader, Lvl.ParaPr);

        var Count = Reader.GetLong();
        Lvl.LvlText = new Array();
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = LvlText_Read_FromBinary(Reader);
            Lvl.LvlText.push(Element);
        }
    },

    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_AbstractNum_LvlChange:
            {
                this.Internal_SetLvl( Data.Index, Data.Old );
                break;
            }

            case historyitem_AbstractNum_TextPrChange:
            {
                this.Lvl[Data.Index].TextPr = Data.Old;
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_AbstractNum_LvlChange:
            {
                this.Internal_SetLvl( Data.Index, Data.New );
                break;
            }

            case historyitem_AbstractNum_TextPrChange:
            {
                this.Lvl[Data.Index].TextPr = Data.New;
                break;
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    Document_Is_SelectionLocked : function(CheckType)
    {
        switch ( CheckType )
        {
            case changestype_Paragraph_Content:
            case changestype_Paragraph_Properties:
            {
                this.Lock.Check( this.Get_Id() );
                break;
            }
            case changestype_Document_Content:
            case changestype_Document_Content_Add:
            case changestype_Image_Properties:
            case changestype_Remove:
            {
                CollaborativeEditing.Add_CheckLock(true);
                break;
            }
        }
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_AbstractNum );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_AbstractNum_LvlChange:
            {
                // Long     : iLvl
                // Variable : Lvl

                Writer.WriteLong(Data.Index);
                this.Write_Lvl_ToBinary( Data.New, Writer );

                break;
            }

            case historyitem_AbstractNum_TextPrChange:
            {
                // Long     : iLvl
                // Vairable : TextPr

                Writer.WriteLong(Data.Index);
                Styles_Write_TextPr_ToBinary(Data.New, Writer);

                break;
            }
        }

        return Writer;
    },

    Save_Changes2 : function(Data, Writer)
    {
        return false;
    },

    Load_Changes : function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_AbstractNum != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_AbstractNum_LvlChange:
            {
                // Long     : iLvl
                // Variable : Lvl

                var iLvl = Reader.GetLong();
                this.Read_Lvl_FromBinary( this.Lvl[iLvl], Reader );

                break;
            }

            case historyitem_AbstractNum_TextPrChange:
            {
                // Long     : iLvl
                // Vairable : TextPr

                var iLvl = Reader.GetLong();
                this.Lvl[iLvl].TextPr = new Object();
                Styles_Read_TextPr_FromBinary(this.Lvl[iLvl].TextPr, Reader);

                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_AbstractNum );

        // String          : Id
        // Variable[9 Lvl] : 9 уровней

        Writer.WriteString2( this.Id );
        for ( var Index = 0; Index < 9; Index++ )
            this.Write_Lvl_ToBinary(this.Lvl[Index], Writer );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String          : Id
        // Variable[9 Lvl] : 9 уровней

        this.Id = Reader.GetString2();

        for ( var Index = 0; Index < 9; Index++ )
            this.Read_Lvl_FromBinary( this.Lvl[Index], Reader );

        // Добавим данный список в нумерацию
        var Numbering = editor.WordControl.m_oLogicDocument.Get_Numbering();
        Numbering.AbstractNum[this.Id] = this;
    },

    Load_LinkData : function(LinkData)
    {

    }
};

function CNumbering()
{
    this.AbstractNum = new Array();
    this.Num         = new Array();
}

CNumbering.prototype =
{

    Create_AbstractNum : function(Type)
    {
        // TODO: переделать работу с ID
        var AbstractNum = new CAbstractNum(Type);
        var Id = AbstractNum.Get_Id();
        this.AbstractNum[Id] = AbstractNum;

        return Id;
    },

    Get_AbstractNum : function(Id)
    {
        return this.AbstractNum[Id];
    },

    Get_ParaPr : function(NumId, Lvl)
    {
        var AbstractId = this.AbstractNum[NumId];
        return AbstractId.Lvl[Lvl].ParaPr;
    },

    Get_Format : function(NumId, Lvl)
    {
        var AbstractId = this.AbstractNum[NumId];
        return AbstractId.Lvl[Lvl].Format;
    },

    // Проверяем по типам Numbered и Bullet
    Check_Format : function(NumId, Lvl, Type)
    {
        var Format = this.Get_Format( NumId, Lvl );

        if ( ( 0x1000 & Format && 0x1000 & Type ) || ( 0x2000 & Format && 0x2000 & Type ) )
            return true;

        return false;
    },

    Draw : function(NumId, Lvl, X, Y, Context, NumInfo, TextPr)
    {
        var AbstractId = this.AbstractNum[NumId];
        return AbstractId.Draw(X,Y, Context, Lvl, NumInfo, TextPr);
    },

    Measure : function(NumId, Lvl, Context, NumInfo, TextPr)
    {
        var AbstractId = this.AbstractNum[NumId];
        return AbstractId.Measure( Context, Lvl, NumInfo, TextPr );
    }
};







var numbering_presentationnumfrmt_None          =     0;
var numbering_presentationnumfrmt_Char          =     1;
var numbering_presentationnumfrmt_ArabicPeriod  =   100;  // 1., 2., 3., ...
var numbering_presentationnumfrmt_ArabicParenR  =   101;  // 1), 2), 3), ...
var numbering_presentationnumfrmt_RomanUcPeriod =   102;  // I., II., III., ...
var numbering_presentationnumfrmt_AlphaUcPeriod =   103;  // A., B., C., ...
var numbering_presentationnumfrmt_AlphaLcParenR =   104;  // a), b), c), ...
var numbering_presentationnumfrmt_AlphaLcPeriod =   105;  // a., b., c.,
var numbering_presentationnumfrmt_RomanLcPeriod =   106;  // i., ii., iii., ...
var numbering_presentationnumfrmt_AlphaUcParenR =   107;  // A), B), C), ...


var g_NumberingArr = [];
g_NumberingArr[0] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[1] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[2] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[3] = numbering_presentationnumfrmt_AlphaUcParenR;
g_NumberingArr[4] = numbering_presentationnumfrmt_AlphaUcParenR;
g_NumberingArr[5] = numbering_presentationnumfrmt_AlphaUcPeriod;
g_NumberingArr[6] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[7] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[8] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[9] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[10] = numbering_presentationnumfrmt_ArabicParenR;
g_NumberingArr[11] = numbering_presentationnumfrmt_ArabicParenR;
g_NumberingArr[12] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[13] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[14] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[15] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[16] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[17] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[18] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[19] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[20] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[21] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[22] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[23] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[24] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[25] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[26] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[27] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[28] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[29] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[30] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[31] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[32] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[33] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[34] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[35] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[36] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[37] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[38] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[39] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[40] = numbering_presentationnumfrmt_AlphaLcPeriod;

// Класс для работы с нумерацией в презентациях
function CPresentationBullet()
{
    this.m_nType    = numbering_presentationnumfrmt_None;  // Тип
    this.m_nStartAt = null;                                // Стартовое значение для нумерованных списков
    this.m_sChar    = null;                                // Значение для символьных списков

    this.m_oColor   = { r : 0, g : 0, b : 0 };             // Цвет
    this.m_bColorTx = true;                                // Использовать ли цвет первого рана в параграфе

    this.m_sFont    = "Arial";                             // Шрифт
    this.m_bFontTx  = true;                                // Использовать ли шрифт первого рана в параграфе

    this.m_dSize    = 1;                                   // Размер шрифта, в пунктах или в процентах (зависит от флага m_bSizePct)
    this.m_bSizeTx  = false;                               // Использовать ли размер шрифта первого рана в параграфе
    this.m_bSizePct = true;                                // Задан ли размер шрифта в процентах

    this.m_oTextPr = null;
    this.m_nNum    = null;
    this.m_sString = null;

    this.Get_Type = function()
    {
        return this.m_nType;
    };

    this.Get_StartAt = function()
    {
        return this.m_nStartAt;
    };

    this.Measure = function(Context, FirstTextPr, Num)
    {
        var dFontSize = FirstTextPr.FontSize;
        if ( false === this.m_bSizeTx )
        {
            if ( true === this.m_bSizePct )
                dFontSize *= this.m_dSize;
            else
                dFontSize = this.m_dSize;
        }

        var sFontName = ( true === this.m_bFontTx ? FirstTextPr.FontFamily.Name : this.m_sFont );

        this.m_oTextPr =
        {
            FontFamily :
            {
                Name  : sFontName,
                Index : -1
            },

            FontSize : dFontSize,
            Bold     : ( this.m_nType >= numbering_presentationnumfrmt_ArabicPeriod ? FirstTextPr.Bold   : false ),
            Italic   : ( this.m_nType >= numbering_presentationnumfrmt_ArabicPeriod ? FirstTextPr.Italic : false )
        };

        this.m_nNum = Num + this.m_nStartAt - 1;

        var X = 0;

        var OldFont = Context.GetFont();
        Context.SetFont( this.m_oTextPr );

        var sT = "";

        switch ( this.m_nType )
        {
            case numbering_presentationnumfrmt_Char:
            {
                if ( null != this.m_sChar )
                    sT = this.m_sChar;

                break;
            }

            case numbering_presentationnumfrmt_AlphaLcParenR:
            {
                sT = Numbering_Number_To_Alpha( this.m_nNum, true ) + ")";
                break;
            }

            case numbering_presentationnumfrmt_AlphaLcPeriod:
            {
                sT = Numbering_Number_To_Alpha( this.m_nNum, true ) + ".";
                break;
            }

            case numbering_presentationnumfrmt_AlphaUcParenR:
            {
                sT = Numbering_Number_To_Alpha( this.m_nNum, false ) + ")";
                break;
            }

            case numbering_presentationnumfrmt_AlphaUcPeriod:
            {
                sT = Numbering_Number_To_Alpha( this.m_nNum, false ) + ".";
                break;
            }

            case numbering_presentationnumfrmt_ArabicParenR:
            {
                sT += Numbering_Number_To_String(this.m_nNum) + ")";
                break;
            }

            case numbering_presentationnumfrmt_ArabicPeriod:
            {
                sT += Numbering_Number_To_String(this.m_nNum) + ".";
                break;
            }

            case numbering_presentationnumfrmt_RomanLcPeriod:
            {
                sT += Numbering_Number_To_Roman(this.m_nNum, true) + ".";
                break;
            }

            case numbering_presentationnumfrmt_RomanUcPeriod:
            {
                sT += Numbering_Number_To_Roman(this.m_nNum, false) + ".";
                break;
            }
        }

        this.m_sString = sT;

        for ( var Index2 = 0; Index2 < sT.length; Index2++ )
        {
            var Char = sT.charAt(Index2);
            X += Context.Measure( Char ).Width;
        }

        Context.SetFont( OldFont );
        this.measuredWidth = X;
        return { Width : X };
    };

    this.Copy = function()
    {
        var Bullet = new CPresentationBullet();

        Bullet.m_nType    = this.m_nType;
        Bullet.m_nStartAt = this.m_nStartAt;
        Bullet.m_sChar    = this.m_sChar;

        Bullet.m_oColor.r = this.m_oColor.r;
        Bullet.m_oColor.g = this.m_oColor.g;
        Bullet.m_oColor.b = this.m_oColor.b;
        Bullet.m_bColorTx = this.m_bColorTx;

        Bullet.m_sFont    = this.m_sFont;
        Bullet.m_bFontTx  = this.m_bFontTx;

        Bullet.m_dSize    = this.m_dSize;
        Bullet.m_bSizeTx  = this.m_bSizeTx;
        Bullet.m_bSizePct = this.m_bSizePct;

        return Bullet;
    };

    this.Draw = function(X, Y, Context, FirstTextPr, Heigth)
    {
        if(Context.IsNoSupportTextDraw !== true)
        {
            if ( null === this.m_oTextPr || null === this.m_nNum )
                return;

            var oColor = { r : this.m_oColor.r, g : this.m_oColor.g, b : this.m_oColor.b };
            if ( true === this.m_bColorTx )
            {
                oColor.r = FirstTextPr.Color.r;
                oColor.g = FirstTextPr.Color.g;
                oColor.b = FirstTextPr.Color.b;
            }

            var old_b_color = {r: Context.m_oBrush.Color1.R, g: Context.m_oBrush.Color1.G, b: Context.m_oBrush.Color1.B};
            var old_pen_color = {r: Context.m_oPen.Color.R, g: Context.m_oPen.Color.G, b: Context.m_oPen.Color.B};
            Context.p_color( oColor.r, oColor.g, oColor.b, 255 );
            Context.b_color1( oColor.r, oColor.g, oColor.b, 255 );

            var OldFont  = Context.GetFont();
            var OldFont2 = g_oTextMeasurer.GetFont();

            Context.SetFont( this.m_oTextPr );
            g_oTextMeasurer.SetFont( this.m_oTextPr );

            var sT = this.m_sString;

            for ( var Index2 = 0; Index2 < sT.length; Index2++ )
            {
                var Char = sT.charAt(Index2);
                Context.FillText( X, Y, Char );
                X += g_oTextMeasurer.Measure( Char ).Width;
            }

            Context.SetFont( OldFont );
            g_oTextMeasurer.SetFont( OldFont2 );
            Context.p_color( old_pen_color.r, old_pen_color.g, old_pen_color.b, 255 );
            Context.b_color1( old_b_color.r, old_b_color.g, old_b_color.b, 255 );
        }
        else
        {
            Context.rect(X, Y, this.measuredWidth, Heigth);
        }
    };

    this.Write_ToBinary = function(Writer)
    {
        // Long   : m_nType
        // Long   : m_nStartAt (-1 == null)
        // String : m_sChar  ("" == null)
        // Byte   : m_oColor.r
        // Byte   : m_oColor.g
        // Byte   : m_oColor.b
        // Bool   : m_bColorTx
        // String : m_sFont
        // Bool   : m_bFont
        // Double : m_dSize
        // Bool   : m_bSizeTx
        // Bool   : m_bSizePct

        Writer.WriteLong( this.m_nType );
        Writer.WriteLong( ( null != this.m_nStartAt ? this.m_nStartAt : -1 ) );
        Writer.WriteString2( ( null != this.m_sChar ? this.m_sChar : "" ) );
        Writer.WriteByte( this.m_oColor.r );
        Writer.WriteByte( this.m_oColor.g );
        Writer.WriteByte( this.m_oColor.b );
        Writer.WriteBool( this.m_bColorTx );
        Writer.WriteString2( this.m_sFont );
        Writer.WriteBool( this.m_bFontTx );
        Writer.WriteDouble( this.m_dSize );
        Writer.WriteBool( this.m_bSizeTx );
        Writer.WriteBool( this.m_bSizePct );
    };

    this.Read_FromBinary = function(Reader)
    {
        // Long   : m_nType
        // Long   : m_nStartAt (-1 == null)
        // String : m_sChar  ("" == null)
        // Byte   : m_oColor.r
        // Byte   : m_oColor.g
        // Byte   : m_oColor.b
        // Bool   : m_bColorTx
        // String : m_sFont
        // Bool   : m_bFont
        // Double : m_dSize
        // Bool   : m_bSizeTx
        // Bool   : m_bSizePct

        this.m_nType    = Reader.GetLong();
        this.m_nStartAt = Reader.GetLong();
        if ( -1 === this.m_nStartAt )
            this.m_nStartAt = null;

        this.m_sChar = Reader.GetString2();
        if ( "" === this.m_sChar )
            this.m_sChar = null;

        this.m_oColor.r = Reader.GetByte();
        this.m_oColor.g = Reader.GetByte();
        this.m_oColor.b = Reader.GetByte();
        this.m_bColorTx = Reader.GetBool();
        this.m_sFont    = Reader.GetString2();
        this.m_bFontTx  = Reader.GetBool();
        this.m_dSize    = Reader.GetDouble();
        this.m_bSizeTx  = Reader.GetBool();
        this.m_bSizePct = Reader.GetBool();
    };
};