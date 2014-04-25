function CLimit()
{
    this.kind = MATH_LIMIT;

    this.type = LIMIT_LOW;
    CMathBase.call(this);
}
extend(CLimit, CMathBase);
CLimit.prototype.init = function(props)
{
    if(props.type === LIMIT_UP || props.type === LIMIT_LOW)
        this.type = props.type;

    this.setDimension(2, 1);

    var oBase = new CMathContent();

    var oIter = new CMathContent();
    oIter.decreaseArgSize();

    if(this.type == LIMIT_LOW)
        this.addMCToContent(oBase, oIter);
    else if(this.type == LIMIT_UP)
        this.addMCToContent(oIter, oBase);

    /// вызов этой функции обязательно в конце
    this.WriteContentsToHistory();
}
CLimit.prototype.getAscent = function()
{
    var ascent;
    if(this.type == LIMIT_LOW)
        ascent = this.elements[0][0].size.ascent;
    else if(this.type == LIMIT_UP)
        ascent = this.elements[0][0].size.height + this.dH + this.elements[1][0].size.ascent;

    return ascent;
}
CLimit.prototype.getFName = function()
{
    var fName;
    if(this.type == LIMIT_LOW)
        fName = this.elements[0][0];
    else if(this.type == LIMIT_UP)
        fName = this.elements[1][0];

    return fName;
}
CLimit.prototype.getIterator = function()
{
    var iterator;
    if(this.type == LIMIT_LOW)
        iterator = this.elements[1][0];
    else if(this.type == LIMIT_UP)
        iterator = this.elements[0][0];

    return iterator;
}
CLimit.prototype.setDistance = function()
{
    this.dH = 0.03674768518518519*this.getCtrPrp().FontSize;
}
CLimit.prototype.getPropsForWrite = function()
{
    var props =
    {
        type:   this.type
    };

    return props;
}

function CMathFunc()
{
    this.kind = MATH_FUNCTION;
    CMathBase.call(this);
}
extend(CMathFunc, CMathBase);
CMathFunc.prototype.init = function()
{
    this.setDimension(1, 2);
    this.setContent();

    /// вызов этой функции обязательно в конце
    this.WriteContentsToHistory();
}
CMathFunc.prototype.setDistance = function()
{
    this.dW = this.getCtrPrp().FontSize/6*g_dKoef_pt_to_mm;
}
CMathFunc.prototype.getFName = function()
{
    return this.elements[0][0];
}
CMathFunc.prototype.getArgument = function()
{
    return this.elements[0][1];
}
CMathFunc.prototype.getPropsForWrite = function()
{
    var props = {};
    return props;
}


