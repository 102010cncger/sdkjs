// когда перейдем на автофигуры - нужно убрать этот класс нафик
var g_fontManagerExcel = new CFontManager();
g_fontManagerExcel.Initialize(true);

var oldPpi = undefined,
	cvt = undefined;

function getCvtRatio(fromUnits, toUnits, ppi) {
	if (ppi !== oldPpi || oldPpi === undefined) {
		var _ppi  = 1 / ppi,
		    _72   = 1 / 72,
		    _25_4 = 1 / 25.4;
		cvt = [
			     /*    px          pt       in        mm    */
			/*px*/[         1,   72*_ppi,   _ppi,  25.4*_ppi ],
			/*pt*/[   ppi*_72,         1,    _72,   25.4*_72 ],
			/*in*/[       ppi,        72,      1,       25.4 ],
			/*mm*/[ ppi*_25_4,  72*_25_4,  _25_4,          1 ]
		];
		oldPpi = ppi;
	}
	return cvt[fromUnits][toUnits];
}

function CDrawingContextWord()
{
    this.Graphics = null;
	
    this.scaleFactor = 1;
    this.font = new FontProperties("Arial", 11);
}

function TextMetrics(width, height, lineHeight, baseline, descender, fontSize, centerline, widthBB) {
	if ( !(this instanceof TextMetrics) ) {
		return new TextMetrics(width, height, lineHeight, baseline, descender, fontSize, centerline, widthBB);
	}

	this.width      = width !== undefined ? width : 0;
	this.height     = height !== undefined ? height : 0;
	this.lineHeight = lineHeight !== undefined ? lineHeight : 0;
	this.baseline   = baseline !== undefined ? baseline : 0;
	this.descender  = descender !== undefined ? descender : 0;
	this.fontSize   = fontSize !== undefined ? fontSize : 0;
	this.centerline = centerline !== undefined ? centerline : 0;
	this.widthBB    = widthBB !== undefined ? widthBB : 0;

	return this;
}


CDrawingContextWord.prototype =
{
    initFromGraphics : function(graphics)
    {
        this.Graphics = graphics;
    },

    initFromContext : function(ctx, width_px, height_px, width_mm, height_mm)
    {
        if (undefined === width_mm || undefined === height_mm)
        {
            width_mm = width_px * g_dKoef_pix_to_mm;
            height_mm = height_px * g_dKoef_pix_to_mm;
        }

        this.Graphics = new CGraphics();
        this.Graphics.init(ctx, width_px, height_px, width_mm, height_mm);

        this.Graphics.m_oFontManager = g_fontManagerExcel;
        this.Graphics.transform(1,0,0,1,0,0);
    },

    setCanvas : function(canvas)
    {
        var c = canvas !== undefined ? canvas : null;
        if (c === null) {return;}
        var ctx = c.getContext("2d");

        this.initFromContext(ctx, c.width, c.height);
    },

    setFontManager : function(oManager)
    {
        this.Graphics.m_oFontManager = oManager;
    },

    setFont : function(font, angle)
    {
        var italic, bold, fontStyle, r;

        if (font.FontFamily.Index === undefined ||
            font.FontFamily.Index === null ||
            font.FontFamily.Index === -1) {
            font.FontFamily.Index = window.g_map_font_index[font.FontFamily.Name];
        }

        italic = true === font.Italic;
        bold   = true === font.Bold;

        this.font.copyFrom(font);

        fontStyle = FontStyle.FontStyleRegular;
        if ( !italic && bold )
            fontStyle = FontStyle.FontStyleBold;
        else if ( italic && !bold )
            fontStyle = FontStyle.FontStyleItalic;
        else if ( italic && bold )
            fontStyle = FontStyle.FontStyleBoldItalic;

        var fm = this.Graphics.m_oFontManager;

        if (angle && 0 != angle)
        {
            r = window.g_font_infos[ font.FontFamily.Index ].LoadFont(
                window.g_font_loader, fm, font.FontSize, fontStyle, this.Graphics.m_dDpiX, this.Graphics.m_dDpiY, this.Graphics.m_oTransform);

        }
        else
        {
            r = window.g_font_infos[ font.FontFamily.Index ].LoadFont(
                window.g_font_loader, fm, font.FontSize, fontStyle, this.Graphics.m_dDpiX, this.Graphics.m_dDpiY);
        }

        if (r === false) {
            throw "Can not use " + font.FontFamily.Name + " font. (Check whether font file is loaded)";
        }

        return this;
    },

    measureText : function(text, units)
    {
        var fm = this.Graphics.m_oFontManager;
        var r  = getCvtRatio(0/*px*/, units >= 0 && units <=3 ? units : 1, this.Graphics.m_dDpiX);
        for (var tmp, w = 0, w2 = 0, i = 0; i < text.length; ++i) {
            tmp = fm.MeasureChar( text.charCodeAt(i) );
            w += tmp.fAdvanceX;
        }
        w2 = w - tmp.fAdvanceX + tmp.oBBox.fMaxX - tmp.oBBox.fMinX + 1;
        return this._calcTextMetrics(w * r, w2 * r, fm, r);
    },

    fillText : function(text, x, y, maxWidth, charWidths, angle)
    {
        //коэффициэнт нужно высчитывать!
		var kF =  0.3527;
		this.Graphics.t(text, x*kF, y*kF);
    },
	
	transform : function(sx,shy,shx,sy,tx,ty)
    {
		this.Graphics.transform(sx,shy,shx,sy,tx,ty);
    },
	
    getHeightText : function()
    {
        var fm = this.Graphics.m_oFontManager;
        var UnitsPerEm = fm.m_lUnits_Per_Em;
        var Height     = fm.m_lLineHeight;
        var setUpSize  = this.font.FontSize;
        return Height * setUpSize / UnitsPerEm;
    },

    _calcTextMetrics: function (w, wBB, fm, r) {
        var factor = this.font.FontSize * r / fm.m_lUnits_Per_Em,
            l = fm.m_lLineHeight * factor,
            b = fm.m_lAscender * factor,
            d = Math.abs(fm.m_lDescender * factor);
        return new TextMetrics(w, b + d, l, b, d, this.font.FontSize, 0, wBB);
    },

	/**
	 * @param {RgbColor || ThemeColor || CColor} val
	 * @returns {CDrawingContextWord}
	 */
	setFillStyle: function (val) {
		var _r = val.getR();
		var _g = val.getG();
		var _b = val.getB();
		var _a = val.getA();
        this.Graphics.b_color1(_r, _g, _b, (_a * 255 + 0.5) >> 0);
        return this;
    }

};
function FontProperties(family, size, bold, italic, underline, strikeout) {
	if ( !(this instanceof FontProperties) ) {
		return new FontProperties(family, size, bold, italic, underline, strikeout);
	}

	this.FontFamily = {Name: family, Index: -1, Angle : 0};
	this.FontSize   = size;
	this.Bold       = !!bold;
	this.Italic     = !!italic;
	this.Underline  = underline;
	this.Strikeout  = strikeout;

	return this;
}

FontProperties.prototype = {

	/** @type FontProperties */
	constructor: FontProperties,

	/**
	 * Assigns font preperties from another object
	 * @param {FontProperties} font
	 */
	copyFrom: function (font) {
		this.FontFamily.Name  = font.FontFamily.Name;
		this.FontFamily.Index = font.FontFamily.Index;
		this.FontSize  = font.FontSize;
		this.Bold      = font.Bold;
		this.Italic    = font.Italic;
		this.Underline = font.Underline;
		this.Strikeout = font.Strikeout;
	},

	/** @return {FontProperties} */
	clone: function () {
		return new FontProperties(this.FontFamily.Name, this.FontSize,
				this.Bold, this.Italic, this.Underline, this.Strikeout);
	},

	isEqual: function (font) {
		return font !== undefined &&
		       this.FontFamily.Name.toLowerCase() === font.FontFamily.Name.toLowerCase() &&
		       this.FontSize === font.FontSize &&
		       this.Bold === font.Bold &&
		       this.Italic === font.Italic;
	}
};

function CMatrix()
{
    this.sx     = 1.0;
    this.shx    = 0.0;
    this.shy    = 0.0;
    this.sy     = 1.0;
    this.tx     = 0.0;
    this.ty     = 0.0;
}

CMatrix.prototype =
{
    Reset : function(){
        this.sx     = 1.0;
        this.shx    = 0.0;
        this.shy    = 0.0;
        this.sy     = 1.0;
        this.tx     = 0.0;
        this.ty     = 0.0;
    },
    // ���������
    Multiply : function(matrix,order){
        if (MATRIX_ORDER_PREPEND == order)
        {
            var m = new CMatrix();
            m.sx     = matrix.sx;
            m.shx    = matrix.shx;
            m.shy    = matrix.shy;
            m.sy     = matrix.sy;
            m.tx     = matrix.tx;
            m.ty     = matrix.ty;
            m.Multiply(this, MATRIX_ORDER_APPEND);
            this.sx     = m.sx;
            this.shx    = m.shx;
            this.shy    = m.shy;
            this.sy     = m.sy;
            this.tx     = m.tx;
            this.ty     = m.ty;
        }
        else
        {
            var t0 = this.sx  * matrix.sx + this.shy * matrix.shx;
            var t2 = this.shx * matrix.sx + this.sy  * matrix.shx;
            var t4 = this.tx  * matrix.sx + this.ty  * matrix.shx + matrix.tx;
            this.shy = this.sx * matrix.shy + this.shy * matrix.sy;
            this.sy  = this.shx * matrix.shy + this.sy * matrix.sy;
            this.ty  = this.tx  * matrix.shy + this.ty * matrix.sy + matrix.ty;
            this.sx  = t0;
            this.shx = t2;
            this.tx  = t4;
        }
        return this;
    },
    // � ������ ������� ������ ���������� (��� �������� �����������)
    Translate : function(x,y,order){
        var m = new CMatrix();
        m.tx  = x;
        m.ty  = y;
        this.Multiply(m,order);
    },
    Scale : function(x,y,order){
        var m = new CMatrix();
        m.sx  = x;
        m.sy  = y;
        this.Multiply(m,order);
    },
    Rotate : function(a,order){
        var m = new CMatrix();
        var rad = deg2rad(a);
        m.sx  = Math.cos(rad);
        m.shx = Math.sin(rad);
        m.shy = -Math.sin(rad);
        m.sy  = Math.cos(rad);
        this.Multiply(m,order);
    },
    RotateAt : function(a,x,y,order){
        this.Translate(-x,-y,order);
        this.Rotate(a,order);
        this.Translate(x,y,order);
    },
    // determinant
    Determinant : function(){
        return this.sx * this.sy - this.shy * this.shx;
    },
    // invert
    Invert : function(){
        var det = this.Determinant();
        if (0.0001 > Math.abs(det))
            return;
        var d = 1 / det;

        var t0 = this.sy * d;
        this.sy =  this.sx * d;
        this.shy = -this.shy * d;
        this.shx = -this.shx * d;

        var t4 = -this.tx * t0  - this.ty * this.shx;
        this.ty = -this.tx * this.shy - this.ty * this.sy;

        this.sx = t0;
        this.tx = t4;
        return this;
    },
    // transform point
    TransformPointX : function(x,y){
        return x * this.sx  + y * this.shx + this.tx;
    },
    TransformPointY : function(x,y){
        return x * this.shy + y * this.sy  + this.ty;
    },
    // calculate rotate angle
    GetRotation : function(){
        var x1 = 0.0;
        var y1 = 0.0;
        var x2 = 1.0;
        var y2 = 0.0;
        this.TransformPoint(x1, y1);
        this.TransformPoint(x2, y2);
        var a = Math.atan2(y2-y1,x2-x1);
        return rad2deg(a);
    },
    // ������� ���������
    CreateDublicate : function(){
        var m = new CMatrix();
        m.sx     = this.sx;
        m.shx    = this.shx;
        m.shy    = this.shy;
        m.sy     = this.sy;
        m.tx     = this.tx;
        m.ty     = this.ty;
        return m;
    },

    IsIdentity : function()
    {
        if (this.sx == 1.0 &&
            this.shx == 0.0 &&
            this.shy == 0.0 &&
            this.sy == 1.0 &&
            this.tx == 0.0 &&
            this.ty == 0.0)
        {
            return true;
        }
        return false;
    },
    IsIdentity2 : function()
    {
        if (this.sx == 1.0 &&
            this.shx == 0.0 &&
            this.shy == 0.0 &&
            this.sy == 1.0)
        {
            return true;
        }
        return false;
    }
};
