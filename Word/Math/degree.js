function CDegree(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_DEGREE;

    //this.type = DEGREE_SUPERSCRIPT;
    this.upBase = 0; // отступ сверху для основания
    this.upIter = 0; // отступ сверху для итератора
    //this.alnScr = false;  // не выровнены, итераторы идут в соответствии с наклоном буквы/мат. объекта

    this.Pr =
    {
        type:   DEGREE_SUPERSCRIPT
    };

    CMathBase.call(this);

    this.init(props);
    this.setCtrPrp(props.ctrPrp);
	g_oTableId.Add( this, this.Id );
}
extend(CDegree, CMathBase);
CDegree.prototype.init = function(props)
{
    /*if(props.alnScr === true || props.alnScr === 1)
        this.alnScr = true;
    else if(props.alnScr === false || props.alnScr === 0)
        this.alnScr = false;*/

    var oBase = new CMathContent();

    if(props.indef == 2) /// props include Base for CNary
        oBase = props.oBase;

    if(props.type === DEGREE_SUPERSCRIPT)
        this.Pr.type = DEGREE_SUPERSCRIPT;
    else if(props.type === DEGREE_SUBSCRIPT)
        this.Pr.type = DEGREE_SUBSCRIPT;

    this.setDimension(1, 2);

    var oDegree = new CMathContent();
    oDegree.decreaseArgSize();

    this.addMCToContent(oBase, oDegree);
}
/*CDegree.prototype.init_2 = function(props, oBase)
{
    if(props.type === DEGREE_SUPERSCRIPT)
        this.type = DEGREE_SUPERSCRIPT;
    else if(props.type === DEGREE_SUBSCRIPT)
        this.type = DEGREE_SUBSCRIPT;

    this.setDimension(1, 2);

    var oDegree = new CMathContent();
    oDegree.decreaseArgSize();

    this.addMCToContent(oBase, oDegree);
}*/
CDegree.prototype.recalculateSize = function(oMeasure)
{
    if(this.Pr.type === DEGREE_SUPERSCRIPT)
        this.recalculateSup(oMeasure);
    else if(this.Pr.type === DEGREE_SUBSCRIPT)
        this.recalculateSubScript(oMeasure);
}
CDegree.prototype.old__recalculateSup = function(oMeasure)
{
    var base = this.elements[0][0].size,
        iter   = this.elements[0][1].size;

    var mgCtrPrp = this.Get_CompiledCtrPrp();
    var shCenter = this.Composition.GetShiftCenter(oMeasure, mgCtrPrp);

    var height = 0,
        ascent = 0;

    var descIter = iter.height - iter.ascent;

    var upper = 0;

    if(descIter + shCenter > 2/3*base.height)
    {
        upper = iter.height - 2/3*base.height;
    }
    else
    {
        upper = iter.ascent - shCenter;
    }

    this.upper = upper;

    if(upper > 0)
    {
        height = this.upper + base.height;
        ascent = this.upper + base.ascent;
    }
    else
    {
        height = base.height;
        ascent = base.ascent;
    }

    var width = base.width + iter.width + this.dW;

    this.size = {width: width, height: height, ascent: ascent};
}
CDegree.prototype.old_recalculateSubScript = function(oMeasure)
{
    var base = this.elements[0][0].size,
        iter   = this.elements[0][1].size;

    /*var FontSize = this.Get_CompiledCtrPrp().FontSize,
     shiftCenter = 0.5*DIV_CENT*FontSize;*/

    //var ctrPrp = this.Get_CompiledCtrPrp(); // выставить потом размер шрифта для итератора

    var mgCtrPrp = this.Get_CompiledCtrPrp();
    var shCenter = this.Composition.GetShiftCenter(oMeasure, mgCtrPrp);

    var width = base.width + iter.width + this.dW;

    var low = 0;

    if(iter.ascent - shCenter > 2/3*base.height)
    {
        low = iter.height - 2/3*base.height;
    }
    else
    {
        low = iter.height - iter.ascent + shCenter;
    }

    var height = base.height + low;
    var ascent = base.ascent;

    this.upper = -(height - iter.height);

    this.size = {width: width, height: height, ascent: ascent};

}
CDegree.prototype.recalculateSup = function(oMeasure)
{
    var base = this.elements[0][0].size,
        iter   = this.elements[0][1].size;

    var mgCtrPrp = this.Get_CompiledCtrPrp();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    this.upBase = 0;
    this.upIter = 0;

    var bBaseOnlyText = this.elements[0][0].IsOnlyText();

    if(bBaseOnlyText)
    {
        //var UpBaseline =  1.786*shCenter; // baseline итератора
        var UpBaseline = 1.65*shCenter; // baseline итератора

        // iter.height - UpBaseline - iter.ascent + base.ascent  > 2/3 * base.height

        if(iter.height - UpBaseline - iter.ascent + base.ascent  > 2/3 * base.ascent)
            this.upBase = iter.height - 2/3*base.ascent;
        else if(UpBaseline + iter.ascent > base.ascent)
            this.upBase = UpBaseline + iter.ascent - base.ascent;
        else
            this.upIter = base.ascent - UpBaseline - iter.ascent;
    }
    else
    {
        this.upBase = iter.ascent - 1.2*shCenter;
        var ascBase = base.ascent - shCenter > 0.27*mgCtrPrp.FontSize ? base.ascent - shCenter : 2/3*base.ascent;
        if(iter.height - this.upBase > ascBase)
            this.upBase = iter.height - ascBase;
    }

    var height = this.upBase + base.height;
    var ascent = this.upBase + base.ascent;

    // only for supScript
    if(this.IsPlhIterator())
        this.dW = 0.008*mgCtrPrp.FontSize;
    else
        this.dW = 0.01*mgCtrPrp.FontSize;

    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;

    this.size = {width: width, height: height, ascent: ascent};
}
CDegree.prototype.recalculateSubScript = function(oMeasure)
{
    var base = this.elements[0][0].size,
        iter   = this.elements[0][1].size;

    var mgCtrPrp = this.Get_CompiledCtrPrp();
    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);

    var width = base.width + iter.width + this.dW;
    width += this.GapLeft + this.GapRight;

    var bBaseOnlyText = this.elements[0][0].IsOnlyText();

    if(bBaseOnlyText)
    {
        var DownBaseline = 0.9*shCenter;

        if(iter.ascent - DownBaseline > 3/4*base.ascent)
            this.upIter = 1/4*base.ascent;
        else
            this.upIter = base.ascent + DownBaseline - iter.ascent;

        /*if(base.ascent/2 > this.upIter)
            this.upIter = base.ascent/2;*/
    }
    else
    {
        this.upIter = base.height + 0.9*shCenter - iter.ascent;

        if(base.ascent - shCenter > this.upIter)
            this.upIter = base.height - base.ascent + shCenter;
    }

    var height = this.upIter + iter.height;
    var ascent = base.ascent;

    this.size = {width: width, height: height, ascent: ascent};
}
CDegree.prototype.old_old_setPosition = function(_pos)
{
    var pos = _pos;
    if(this.bMObjs === true)
    {
        pos = {x: pos.x, y: pos.y + this.size.center };
    }

    this.elements[0][0].setPosition({x: pos.x, y: pos.y - this.elements[0][0].size.center });
    this.elements[0][1].setPosition({x: pos.x + this.elements[0][0].size.width + this.dW, y: pos.y + this.shiftDegree - this.size.center});
}
CDegree.prototype.old_setPosition = function(pos)
{
    if(this.bMObjs === true)
        this.pos = pos;
    else
        this.pos = {x: pos.x, y: pos.y - this.size.ascent};

    var shBase = 0,
        shIter = 0;

    if(this.upper > 0)
        shBase = this.upper;
    else
        shIter = - this.upper;

    this.elements[0][0].setPosition({x: this.pos.x, y: this.pos.y + shBase});
    this.elements[0][1].setPosition({x: this.pos.x + this.elements[0][0].size.width + this.dW, y: this.pos.y + shIter});
}
CDegree.prototype.setPosition = function(pos)
{
    if(this.bMObjs === true)
        this.pos = pos;
    else
        this.pos = {x: pos.x, y: pos.y - this.size.ascent};

    var x1 = this.pos.x + this.GapLeft,
        y1 = this.pos.y + this.upBase;

    var x2 = this.pos.x + this.GapLeft + this.elements[0][0].size.width + this.dW,
        y2 = this.pos.y + this.upIter;

    this.elements[0][0].setPosition({x: x1, y: y1});
    this.elements[0][1].setPosition({x: x2, y: y2});
}
CDegree.prototype.old_findDisposition = function(mCoord)
{
    var coordX, coordY;
    var X, Y;

    var inside_flag = -1;

    var shBase = 0,
        shIter = 0;

    if(this.upper > 0)
        shBase = this.upper;
    else
        shIter = - this.upper;

    if( mCoord.x < this.elements[0][0].size.width)
    {
        if( this.elements[0][0].IsJustDraw() )
        {
            X = 0; Y = 1; // встаем во второй элемент
            coordX = 0;
            coordY = mCoord.y - shIter;

            inside_flag = 0;
        }
        else
        {
            X = 0; Y = 0; // встаем в первый элемент
            coordX =  mCoord.x;
            coordY =  mCoord.y - shBase;
        }
    }
    else if(mCoord.x < (this.elements[0][0].size.width + this.dW ))
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = 0;
        coordY = mCoord.y - shIter;
        inside_flag = 0;
    }
    else if(mCoord.x > this.size.width)
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = this.size.width;
        coordY = mCoord.y - shIter;
        inside_flag = 1;
    }
    else
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = mCoord.x - (this.elements[0][0].size.width + this.dW);
        coordY = mCoord.y - shIter;
    }

    if(coordY < 0)
    {
        coordY = 0;
        inside_flag = 2;
    }
    else if(coordY > this.elements[X][Y].size.height)
    {
        coordY = this.elements[X][Y].size.height;
        inside_flag = 2;
    }

    var mCoord = {x: coordX, y: coordY};

    return {pos: {x: X, y: Y}, mCoord: mCoord, inside_flag: inside_flag};
}
CDegree.prototype.findDisposition = function(mCoord)
{
    var coordX, coordY;
    var X, Y;

    var inside_flag = -1;

    if( mCoord.x < this.elements[0][0].size.width)
    {
        if( this.elements[0][0].IsJustDraw() )
        {
            X = 0; Y = 1; // встаем во второй элемент
            coordX = 0;
            coordY = mCoord.y - this.upIter;

            inside_flag = 0;
        }
        else
        {
            X = 0; Y = 0; // встаем в первый элемент
            coordX =  mCoord.x;
            coordY =  mCoord.y - this.upBase;
        }
    }
    else if(mCoord.x < (this.elements[0][0].size.width + this.dW ))
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = 0;
        coordY = mCoord.y - this.upIter;
        inside_flag = 0;
    }
    else if(mCoord.x > this.size.width)
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = this.size.width;
        coordY = mCoord.y - this.upIter;
        inside_flag = 1;
    }
    else
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = mCoord.x - (this.elements[0][0].size.width + this.dW);
        coordY = mCoord.y - this.upIter;
    }

    if(coordY < 0)
    {
        coordY = 0;
        inside_flag = 2;
    }
    else if(coordY > this.elements[X][Y].size.height)
    {
        coordY = this.elements[X][Y].size.height;
        inside_flag = 2;
    }

    var mCoord = {x: coordX, y: coordY};

    return {pos: {x: X, y: Y}, mCoord: mCoord, inside_flag: inside_flag};
}
CDegree.prototype.old_findDisposition = function(mCoord)
{
    var coordX, coordY;
    var X, Y;

    var inside_flag = -1;

    if( mCoord.x < this.elements[0][0].size.width)
    {
        if( this.elements[0][0].IsJustDraw() )
        {
            X = 0; Y = 1; // встаем во второй элемент
            coordX = 0;
            coordY = mCoord.y - this.shiftDegree;
            inside_flag = 0;
        }
        else
        {
            X = 0; Y = 0; // встаем в первый элемент
            coordX = mCoord.x;
            coordY =  mCoord.y - ( this.size.center - this.elements[0][0].size.center);
        }
    }
    else if(mCoord.x < (this.elements[0][0].size.width + this.dW ))
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = 0;
        coordY = mCoord.y - this.shiftDegree;
        inside_flag = 0;
    }
    else if(mCoord.x > this.size.width)
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = this.size.width;
        coordY = mCoord.y - this.shiftDegree;
        inside_flag = 1;
    }
    else
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = mCoord.x - (this.elements[0][0].size.width + this.dW);
        coordY = mCoord.y - this.shiftDegree;
    }

    if(coordY < 0)
    {
        coordY = 0;
        inside_flag = 2;
    }
    else if(coordY > this.elements[X][Y].size.height)
    {
        coordY = this.elements[X][Y].size.height;
        inside_flag = 2;
    }

    var mCoord = {x: coordX, y: coordY};

    return {pos: {x: X, y: Y}, mCoord: mCoord, inside_flag: inside_flag};
}
CDegree.prototype.getIterator = function()
{
    return this.elements[0][1];
}
CDegree.prototype.getUpperIterator = function()
{
    return this.elements[0][1];
}
CDegree.prototype.getLowerIterator = function()
{
    return this.elements[0][1];
}
CDegree.prototype.getBase = function()
{
    return this.elements[0][0];
}
/*CDegree.prototype.getPropsForWrite = function()
{
    var props = {};

    props.type = this.type;
    //props.alnScr = this.alnScr;

    return props;
}*/
CDegree.prototype.getPropsForWrite = function()
{
    return this.Pr;
}
CDegree.prototype.IsPlhIterator = function()
{
    return this.elements[0][1].IsPlaceholder();
}
CDegree.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_deg );
}
CDegree.prototype.Load_Changes = function(Reader)
{
}
CDegree.prototype.Refresh_RecalcData = function(Data)
{
}
CDegree.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_deg );
	Writer.WriteString2( this.elements[0][0].Id );
	Writer.WriteString2( this.elements[0][1].Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	Writer.WriteLong( this.Pr.type );
	
}
CDegree.prototype.Read_FromBinary2 = function( Reader )
{
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;

	var Element1 = g_oTableId.Get_ById( Reader.GetString2() );
	Element1.Parent = this;
	this.elements[0][1] = Element1;

	this.CtrPrp.Read_FromBinary(Reader);
    this.Pr.type = Reader.GetLong();
}
CDegree.prototype.Get_Id = function()
{
	return this.Id;
}

function CIterators()
{
	this.Id = g_oIdCounter.Get_NewId();
    this.lUp = 0;   // центр основания
    this.lD = 0;    // высота - центр основания
    this.upper = 0; // смещение сверху для позиции основания
    CMathBase.call(this);
	g_oTableId.Add( this, this.Id );
}
extend(CIterators, CMathBase);
CIterators.prototype.init = function()
{
    this.setDimension(2, 1);
    this.setContent();
}
CIterators.prototype.old_old_setDistanceIters = function(oMeasure)
{
    var upIter  = this.elements[0][0].size,
        lowIter = this.elements[1][0].size;

    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var shCenter = this.Composition.GetShiftCenter(oMeasure, mgCtrPrp);

    var upDesc = upIter.height - upIter.ascent + shCenter,
        lowAsc = 1.2*(lowIter.ascent - shCenter);

    var up = 0;
    var down = 0;
    if(this.lUp  > upDesc)
    {
        up = this.lUp - upDesc;
        this.upper = upIter.height - upDesc;
    }
    else
    {
        up = 0;
        this.upper = upIter.height - this.lUp;
    }

    if( this.lD > lowAsc )
        down = this.lD - lowAsc;

    var minGap = 1.1*shCenter;

    if( up + down < minGap)
    {
        this.dH = minGap;
    }
    else
    {
        this.dH = up + down;
    }
}
CIterators.prototype.old_setDistanceIters = function(oMeasure)
{
    var upIter  = this.elements[0][0].size,
        lowIter = this.elements[1][0].size;

    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var shCenter = this.Composition.GetShiftCenter(oMeasure, mgCtrPrp);

    var upDesc = upIter.height - upIter.ascent + shCenter,
        lowAsc = 1.2*(lowIter.ascent - shCenter);

    var up = 0;
    var down = 0;
    if(this.lUp  > upDesc)
    {
        up = this.lUp - upDesc;
        this.upper = upIter.height - upDesc;
    }
    else
    {
        up = 0;
        this.upper = upIter.height - this.lUp;
    }


    if( this.lD > lowAsc )
        down = this.lD - lowAsc;

    var minGap = 0.78*shCenter;

    if( up + down < minGap)
    {
        this.dH = minGap;
    }
    else
    {
        this.dH = up + down;
    }
}
CIterators.prototype._setDistanceIters = function(oMeasure)
{
    var upIter  = this.elements[0][0].size,
        lowIter = this.elements[1][0].size;

    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var shCenter = this.Composition.GetShiftCenter(oMeasure, mgCtrPrp);

    var upDesc = upIter.height - upIter.ascent + 1.1*shCenter,
        lowAsc = 1.2*(lowIter.ascent - shCenter);

    var minGap = 0.78*shCenter;

    var gapUpper = upIter.height - 1.668*shCenter;
        gapLower = lowIter.height - 1.668*shCenter;

    this.dH = 0.78*shCenter;

    if(gapUpper > 0)
    {
        this.upper = gapUpper;
    }
    else
        this.upper = 0;
}
CIterators.prototype.getUpperIterator = function()
{
    return this.elements[0][0];
}
CIterators.prototype.getLowerIterator = function()
{
    return this.elements[1][0];
}
CIterators.prototype.Get_CompiledCtrPrp = function()
{
    return this.Parent.Get_CompiledCtrPrp();
}
CIterators.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_iterators );
}
CIterators.prototype.Load_Changes = function(Reader)
{
}
CIterators.prototype.Refresh_RecalcData = function(Data)
{
}
CIterators.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_iterators );
	Writer.WriteString2( this.elements[0][0].Id );
	Writer.WriteString2( this.elements[1][0].Id );
}
CIterators.prototype.Read_FromBinary2 = function( Reader )
{
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;

	var Element1 = g_oTableId.Get_ById( Reader.GetString2() );
	Element1.Parent = this;
	this.elements[1][0] = Element1;

}
CIterators.prototype.Get_Id = function()
{
	return this.Id;
}

function CDegreeSubSup(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_DEGREESubSup;

    this.gapBase = 0;

    this.Pr =
    {
        type:       DEGREE_SubSup,
        alnScr:     false
    };

    //this.type = DEGREE_SubSup;
    //this.alnScr = false;    // не выровнены, итераторы идут в соответствии с наклоном буквы/мат. объекта

    CMathBase.call(this);

    this.init(props);
    this.setCtrPrp(props.ctrPrp);
	g_oTableId.Add( this, this.Id );
}
extend(CDegreeSubSup, CMathBase);
CDegreeSubSup.prototype.init = function(props)
{
    if(props.alnScr === true || props.alnScr === 1)
        this.Pr.alnScr = true;
    else if(props.alnScr === false || props.alnScr === 0)
        this.Pr.alnScr = false;

    var oBase = new CMathContent();

    if(props.indef == 2) /// props include Base for CNary
        oBase = props.oBase;

    if(props.type === DEGREE_SubSup || props.type === DEGREE_PreSubSup)
        this.Pr.type = props.type;

    this.setDimension(1, 2);

    var oIters = new CIterators();
    oIters.init();
    oIters.decreaseArgSize();


    oIters.lUp = 0;
    oIters.lD = 0;

    if(this.Pr.type == DEGREE_SubSup)
    {
        oIters.alignHor(-1, 0);
        this.addMCToContent(oBase, oIters);
    }
    else if(this.Pr.type == DEGREE_PreSubSup)
    {
        oIters.alignHor(-1, 1);
        this.addMCToContent(oIters, oBase);
    }

    /// вызов этой функции обязательно в конце
    //this.WriteContentsToHistory();
}
/*CDegreeSubSup.prototype.init_2 = function(props, oBase)
{
    if(props.type === DEGREE_SubSup)
        this.type = DEGREE_SubSup;
    else if(props.type === DEGREE_PreSubSup)
        this.type = DEGREE_PreSubSup;

    this.setDimension(1, 2);

    var oIters = new CIterators();
    oIters.init();
    oIters.decreaseArgSize();


    oIters.lUp = 0;
    oIters.lD = 0;

    if(this.type == DEGREE_SubSup)
    {
        oIters.alignHor(-1, 0);
        this.addMCToContent(oBase, oIters);
    }
    else if(this.type == DEGREE_PreSubSup)
    {
        oIters.alignHor(-1, 1);
        this.addMCToContent(oIters, oBase);
    }

    /// вызов этой функции обязательно в конце
    this.WriteContentsToHistory();
}*/
CDegreeSubSup.prototype.old_old_recalculateSize = function(oMeasure)
{
    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var shCenter = this.Composition.GetShiftCenter(oMeasure, mgCtrPrp);
    shCenter *= 1.2;

    var width = 0, height = 0,
        ascent = 0;

    var iters, base;

    if(this.Pr.type == DEGREE_SubSup)
    {
        iters = this.elements[0][1];
        base  = this.elements[0][0];
    }
    else if(this.Pr.type == DEGREE_PreSubSup)
    {
        iters = this.elements[0][0];
        base  = this.elements[0][1];
    }

    iters.lUp = base.size.ascent - shCenter; // center of base
    iters.lD  = base.size.height - iters.lUp; // height - center of base
    iters.setDistanceIters(oMeasure);
    iters.recalculateSize();


    var smallAsc = mgCtrPrp.FontSize*0.23;

    if(base.ascent < smallAsc)
        this.dW = 0;
    else
        this.dW = 0.2*shCenter;

    width  = iters.size.width + base.size.width + this.dW;
    height = iters.size.height;

    ascent = iters.upper + base.size.ascent;

    this.size = {width: width, height: height, ascent: ascent};
}
CDegreeSubSup.prototype.old_recalculateSize = function(oMeasure)
{
    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var shCenter = this.Composition.GetShiftCenter(oMeasure, mgCtrPrp);
    shCenter *= 1.2;

    var width = 0, height = 0,
        ascent = 0;

    var iters, base;

    if(this.Pr.type == DEGREE_SubSup)
    {
        iters = this.elements[0][1];
        base  = this.elements[0][0];
    }
    else if(this.Pr.type == DEGREE_PreSubSup)
    {
        iters = this.elements[0][0];
        base  = this.elements[0][1];
    }

    // distance for iterators

    var iterUp = iters.elements[0][0].size,
        iterDown = iters.elements[1][0].size;

    var lUp    = base.size.ascent - shCenter; // center of base
    var lDown  = base.size.height - lUp; // height - center of base

    var ctrPrpIter = iters.Get_CompiledCtrPrp();
    var shIter = this.Composition.GetShiftCenter(oMeasure, ctrPrpIter); //смещение

    //var upDesc = iterUp.height - iterUp.ascent + 1.2*shIter, // смещенный descent верхнего итератора
    //    downAsc = iterDown.ascent + 0.6*shIter; // смещенный ascent нижнего оператора

    var upDesc = iterUp.height - shIter,
        downAsc = iterDown.height - shIter;

    var up = 0,     // расстояние от центра основания до верхнего итератора
        down = 0;   // расстояние от центра основания до нижнего итератора

    if(lUp  > upDesc)
    {
        up = lUp - upDesc;
        this.gapBase = iterUp.height - upDesc;
    }
    else
    {
        up = 0;
        this.gapBase = iterUp.height - lUp;
    }

    if( lDown > downAsc )
        down = lDown - downAsc;

    var minGap =  0.78*shIter;

    if( up + down < minGap)
        iters.dH = minGap;
    else
        iters.dH = up + down;

    iters.recalculateSize();


    /*var smallAsc = mgCtrPrp.FontSize*0.23;

    if(base.ascent < smallAsc)
        this.dW = 0;
    else
        this.dW = 0.2*shCenter;*/

    width  = iters.size.width + base.size.width + this.dW;
    height = iters.size.height;

    ascent = base.size.ascent + this.gapBase;

    this.size = {width: width, height: height, ascent: ascent};
}
CDegreeSubSup.prototype._recalculateSize = function(oMeasure)
{
    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var shCenter = this.Composition.GetShiftCenter(oMeasure, mgCtrPrp);
    shCenter *= 1.4;

    var width = 0, height = 0,
        ascent = 0;

    var iters, base;

    if(this.Pr.type == DEGREE_SubSup)
    {
        iters = this.elements[0][1];
        base  = this.elements[0][0];
    }
    else if(this.Pr.type == DEGREE_PreSubSup)
    {
        iters = this.elements[0][0];
        base  = this.elements[0][1];
    }

    // distance for iterators

    var iterUp = iters.elements[0][0].size,
        iterDown = iters.elements[1][0].size;

    var lUp    = base.size.ascent - shCenter; // center of base
    var lDown  = base.size.height - lUp; // height - center of base

    var ctrPrpIter = iters.Get_CompiledCtrPrp();
    var shIter = this.Composition.GetShiftCenter(oMeasure, ctrPrpIter); //смещение

    //var upDesc = iterUp.height - iterUp.ascent + 1.2*shIter, // смещенный descent верхнего итератора
    //    downAsc = iterDown.ascent + 0.6*shIter; // смещенный ascent нижнего оператора



    var up = 0,     // расстояние от центра основания до верхнего итератора
        down = 0;   // расстояние от центра основания до нижнего итератора

    var minGap =  0.7*shIter;

    /*if(base.size.height > upDesc + downAsc + minGap)
    {
        iters.dH = base.size.height - upDesc - downAsc;
        this.gapBase = iterUp.height - upDesc;
    }
    else
    {
        iters.dH = minGap;
        this.gapBase = iterUp.height - (lUp - minGap/2);
    }*/

    if(base.IsPlaceholder())
    {
        iters.dH = minGap;
        this.gapBase = iterUp.height - (lUp - minGap/2);
    }
    else
    {
        var upDesc = iterUp.height - 0.5*shIter,
            downAsc = iterDown.height - shIter;

        if(base.size.ascent > upDesc + downAsc + minGap )
        {
            iters.dH = base.size.height - upDesc - downAsc;
            this.gapBase = iterUp.height - upDesc;
        }
        else
        {
            iters.dH = minGap;
            this.gapBase = iterUp.height - (lUp - minGap/2);
        }
    }


    /*if(lUp  > upDesc)
    {
        up = lUp - upDesc;
        this.gapBase = iterUp.height - upDesc;
    }
    else
    {
        up = 0;
        this.gapBase = iterUp.height - lUp;
    }

    if( lDown > downAsc )
        down = lDown - downAsc;*/


    /*if( up + down < minGap)
        iters.dH = minGap;
    else
        iters.dH = up + down;*/

    iters.recalculateSize();

    /*var smallAsc = mgCtrPrp.FontSize*0.23;

     if(base.ascent < smallAsc)
     this.dW = 0;
     else
     this.dW = 0.2*shCenter;*/

    width  = iters.size.width + base.size.width + this.dW;
    height = iters.size.height;

    ascent = base.size.ascent + this.gapBase;

    this.size = {width: width, height: height, ascent: ascent};
}
CDegreeSubSup.prototype.recalculateSize = function(oMeasure)
{
    var mgCtrPrp = this.Get_CompiledCtrPrp();

    var shCenter = this.ParaMath.GetShiftCenter(oMeasure, mgCtrPrp);
    shCenter *= 1.4;

    var iters, base;

    if(this.Pr.type == DEGREE_SubSup)
    {
        iters = this.elements[0][1];
        base  = this.elements[0][0];
    }
    else if(this.Pr.type == DEGREE_PreSubSup)
    {
        iters = this.elements[0][0];
        base  = this.elements[0][1];
    }

    // distance for iterators

    var iterUp = iters.elements[0][0].size,
        iterDown = iters.elements[1][0].size;

    var lUp    = base.size.ascent - shCenter; // center of base
    var lDown  = base.size.height - lUp; // height - center of base

    var ctrPrpIter = iters.Get_CompiledCtrPrp();
    var shIter = this.ParaMath.GetShiftCenter(oMeasure, ctrPrpIter); //смещение

    var minGap =  0.7*shIter;

    var upDesc = 0,
        downAsc = 0;

    if(base.IsOnlyText())
    {
        upDesc = 1.5*shIter;
        downAsc = 1.2*shIter;
    }
    else
    {
        upDesc = iterUp.height - iterUp.ascent + shIter;
        downAsc = iterDown.ascent - shIter;
    }

    var up = lUp > upDesc ? lUp - upDesc : 0,     // расстояние от центра основания до верхнего итератора
        down = lDown > downAsc ? lDown - downAsc : 0;   // расстояние от центра основания до нижнего итератора


    if(up + down > minGap)
    {
        this.gapBase = iterUp.height + up - lUp;
        iters.dH = up + down;
    }
    else
    {
        iters.dH = minGap;
        this.gapBase = iterUp.height - lUp + minGap/2;
    }

    iters.recalculateSize(oMeasure);

    var width  = iters.size.width + base.size.width + this.dW;
    var height = iters.size.height;

    var ascent = base.size.ascent + this.gapBase;

    this.size = {width: width, height: height, ascent: ascent};

}
CDegreeSubSup.prototype.old_setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.ascent};

    if(this.Pr.type == DEGREE_SubSup)
    {
        var iters = this.elements[0][1],
            base  = this.elements[0][0];

        var posBase  = {x: this.pos.x, y: this.pos.y + iters.upper},
            posIters = {x: this.pos.x + base.size.width, y: this.pos.y};
        base.setPosition(posBase);
        iters.setPosition(posIters);
    }

}
CDegreeSubSup.prototype.old_align = function(x, y)
{
    var _x = 0, _y = 0;

    if(this.Pr.type == DEGREE_SubSup)
    {
        if(x == 0 && y == 0)
            _y = this.elements[0][1].upper;
    }
    else
    {
        if(x == 0 && y == 1)
            _y = this.elements[0][0].upper;
    }

    return {x: _x, y: _y};
}
CDegreeSubSup.prototype.align = function(x, y)
{
    var _x = 0, _y = 0;

    if(this.Pr.type == DEGREE_SubSup)
    {
        if(x == 0 && y == 0)
            _y = this.gapBase;
    }
    else
    {
        if(x == 0 && y == 1)
            _y = this.gapBase;
    }

    return {x: _x, y: _y};
}
CDegreeSubSup.prototype.getBase = function()
{
    var base;

    if(this.Pr.type == DEGREE_SubSup)
        base = this.elements[0][0];
    else if(this.Pr.type == DEGREE_PreSubSup)
        base = this.elements[0][1];

    return base;
}
CDegreeSubSup.prototype.getUpperIterator = function()
{
    var iter;

    if(this.Pr.type == DEGREE_SubSup)
        iter = this.elements[0][1].getUpperIterator();
    else if(this.Pr.type == DEGREE_PreSubSup)
        iter = this.elements[0][0].getUpperIterator();

    return iter;
}
CDegreeSubSup.prototype.getLowerIterator = function()
{
    var iter;

    if(this.Pr.type == DEGREE_SubSup)
        iter = this.elements[0][1].getLowerIterator();
    else if(this.Pr.type == DEGREE_PreSubSup)
        iter = this.elements[0][0].getLowerIterator();

    return iter;
}
CDegreeSubSup.prototype.getPropsForWrite = function()
{
    /*var props = {};

    props.type = this.type;
    props.alnScr = this.alnScr;

    return props;*/

    return this.Pr;
}
CDegreeSubSup.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_deg_subsup );
}
CDegreeSubSup.prototype.Load_Changes = function(Reader)
{
}
CDegreeSubSup.prototype.Refresh_RecalcData = function(Data)
{
}
CDegreeSubSup.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_deg_subsup );
	Writer.WriteString2( this.elements[0][0].Id );
	Writer.WriteString2( this.elements[0][1].Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	Writer.WriteLong( this.Pr.type );
	if ( this.Pr.type == DEGREE_SubSup )
	{
		var StartPos = Writer.GetCurPosition();
		Writer.Skip(4);
		var Flags = 0;
		if ( undefined != this.alnScr )
		{
			Writer.WriteBool( this.alnScr );
			Flags |= 1;
		}
		var EndPos = Writer.GetCurPosition();
		Writer.Seek( StartPos );
		Writer.WriteLong( Flags );
		Writer.Seek( EndPos );		
	}
}
CDegreeSubSup.prototype.Read_FromBinary2 = function( Reader )
{
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;

	var Element1 = g_oTableId.Get_ById( Reader.GetString2() );
	Element1.Parent = this;
	this.elements[0][1] = Element1;
	
	this.CtrPrp.Read_FromBinary(Reader);
    this.Pr.type = Reader.GetLong();
	if ( this.Pr.type == DEGREE_SubSup )
	{
		var Flags = Reader.GetLong();
		if ( Flags & 1 )
			this.alnScr = Writer.GetBool();	
	}
}
CDegreeSubSup.prototype.Get_Id = function()
{
	return this.Id;
}

//выяcнить: почему и с этой ф-ией и без нее работает всё ok...
//всё ok, т.к. в контенте 2 элемента, и их center сравниваем
/*CDegreeSubSup.prototype.getCenter = function()
{
    var center = 0;
    if(this.type == 0)
        center = this.elements[0][1].size.center;
    else
        center = this.elements[0][0].size.center;

    return center;
}*/
