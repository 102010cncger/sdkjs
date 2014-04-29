/**
 * User: Ilja.Kirillov
 * Date: 25.10.11
 * Time: 13:56
 */

var flowobject_Image     = 0x01;
var flowobject_Table     = 0x02;
var flowobject_Paragraph = 0x03;

// Сортируем объекты {X0, X1} по X0
function Sort_Ranges_X0(A,B)
{
    if ( !A.X0 || !B.X0  )
        return 0;

    if( A.X0 < B.X0 )
        return -1;
    else if( A.X0 > B.X0 )
        return 1;

    return 0;
}

// Сравниваем, вложено ли множество первых отрезков во второе
// (множество отрезков здесь - это дизъюнктное объединение отрезков)
function FlowObjects_CheckInjection(Range1, Range2)
{
    for ( var Index = 0; Index < Range1.length; Index++ )
    {
        var R1 = Range1[Index];
        var bInject = false;
        for ( var Index2 = 0; Index2 < Range2.length; Index2++ )
        {
            var R2 = Range2[Index2];

            if ( R1.X0 >= R2.X0 && R1.X0 <= R2.X1 && R1.X1 >= R2.X0 && R1.X1 <= R2.X1 )
                bInject = true;
        }

        if ( !bInject )
            return false;
    }

    return true;
}

// Сравниваем, совпали ли множества отрезков
function FlowObjects_CompareRanges(Range1, Range2)
{
    if ( Range1.length < Range2.length )
        return -1;
    else if ( Range1.length > Range2.length )
        return -1;

    for ( var Index = 0; Index < Range1.length; Index++ )
    {
        if ( Math.abs( Range1[Index].X0 - Range2[Index].X0 ) > 0.001 || Math.abs( Range1[Index].X1 - Range2[Index].X1 ) )
            return -1;
    }

    return 0;
}

function CFlowTable(Table, PageIndex)
{
    this.Table          = Table;
    this.Id             = Table.Get_Id();
    this.PageNum        = Table.PageNum;
    this.PageController = PageIndex - this.PageNum;
    this.Distance       = Table.Distance;

    var Bounds = Table.Get_PageBounds(this.PageController);
    this.X = Bounds.Left;
    this.Y = Bounds.Top;
    this.W = Bounds.Right  - Bounds.Left;
    this.H = Bounds.Bottom - Bounds.Top;

    this.WrappingType = WRAPPING_TYPE_SQUARE;
};

CFlowTable.prototype =
{

    Get_Type : function()
    {
        return flowobject_Table;
    },

    IsPointIn : function(X,Y)
    {
        if ( X <= this.X + this.W && X >= this.X && Y >= this.Y && Y <= this.Y + this.H )
            return true;

        return false;
    },

    Update_CursorType : function(X, Y, PageIndex)
    {

    },

    getArrayWrapIntervals: function(x0,y0, x1, y1, Y0Sp, Y1Sp, LeftField, RightField, ret)
    {
        if(this.WrappingType === WRAPPING_TYPE_THROUGH || this.WrappingType === WRAPPING_TYPE_TIGHT)
        {
            y0 = Y0Sp;
            y1 = Y1Sp;
        }
        var top = this.Y - this.Distance.T;
        var bottom = this.Y + this.H + this.Distance.B;
        if(y1 < top || y0 > bottom)
            return ret;

        var b_check = false, X0, X1, Y1;
        switch(this.WrappingType)
        {
            case WRAPPING_TYPE_NONE:
            {
                return ret;
            }
            case WRAPPING_TYPE_SQUARE:
            case WRAPPING_TYPE_THROUGH:
            case WRAPPING_TYPE_TIGHT:
            {
                X0 = this.X - this.Distance.L;
                X1 = this.X + this.W + this.Distance.R;
                Y1 = bottom;
                b_check = true;
                break;
            }
            case WRAPPING_TYPE_TOP_AND_BOTTOM:
            {
                X0 = x0;
                X1 = x1;
                Y1 = bottom;
                break;
            }
        }
        if(b_check)
        {
            var dx = this.WrappingType === WRAPPING_TYPE_SQUARE ? 6.35 : 3.175 ;
            if(X0  < LeftField + dx)
            {
                X0 = x0 ;
            }
            if(X1 > RightField - dx)
            {
                X1 = x1;
            }
        }
        ret.push({X0: X0, X1: X1, Y1: Y1, typeLeft: this.WrappingType, typeRight: this.WrappingType});
        return ret;
    }

};

function CFlowParagraph(Paragraph, X, Y, W, H, Dx, Dy, StartIndex, FlowCount, Wrap)
{
    this.Table     = Paragraph;
    this.Paragraph = Paragraph;
    this.Id        = Paragraph.Get_Id();

    this.PageNum   = Paragraph.PageNum + Paragraph.Pages.length - 1;
    this.PageController = 0;

    this.StartIndex = StartIndex;
    this.FlowCount  = FlowCount;

    this.Distance =
    {
        T : Dy,
        B : Dy,
        L : Dx,
        R : Dx
    };

    this.X = X;
    this.Y = Y;
    this.W = W;
    this.H = H;
    
    this.WrappingType = WRAPPING_TYPE_SQUARE;
    
    switch (Wrap)
    {
        case undefined:
        case wrap_Around:
        case wrap_Auto:      this.WrappingType = WRAPPING_TYPE_SQUARE;         break;        
        case wrap_None:      this.WrappingType = WRAPPING_TYPE_NONE;           break;
        case wrap_NotBeside: this.WrappingType = WRAPPING_TYPE_TOP_AND_BOTTOM; break;
        case wrap_Through:   this.WrappingType = WRAPPING_TYPE_THROUGH;        break;
        case wrap_Tight:     this.WrappingType = WRAPPING_TYPE_TIGHT;          break;
    }
}

CFlowParagraph.prototype =
{
    Get_Type : function()
    {
        return flowobject_Paragraph;
    },

    IsPointIn : function(X,Y)
    {
        if ( X <= this.X + this.W && X >= this.X && Y >= this.Y && Y <= this.Y + this.H )
            return true;

        return false;
    },

    Update_CursorType : function(X, Y, PageIndex)
    {

    }
};