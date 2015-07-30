"use strict";

function OverlayObject(geometry, extX, extY, brush, pen, transform )
    //({check_bounds: function(){},brush: this.originalShape.brush, pen: this.originalShape.pen, ext:{cx:this.originalShape.absExtX, cy:this.originalShape.absExtY}, geometry: this.geometry, TransformMatrix: this.originalShape.transform})
{
    this.geometry = geometry;
    this.ext = {};
    this.ext.cx = extX;
    this.ext.cy = extY;
    this.extX = extX;
    this.extY = extY;

    var _brush, _pen;
    if((!brush || !brush.fill || brush.fill.type === FILL_TYPE_NOFILL) &&
        (!pen || !pen.Fill || !pen.Fill || !pen.Fill.fill || pen.Fill.fill.type === FILL_TYPE_NOFILL || pen.w === 0))
    {
        var penBrush = CreatePenBrushForChartTrack();
        _brush = penBrush.brush;
        _pen = penBrush.pen;
    }
    else
    {
        _brush = brush;
        _pen = pen;
    }

    this.brush = _brush;
    this.pen = _pen;
    this.TransformMatrix = transform;
    this.shapeDrawer = new CShapeDrawer();

    this.updateTransform = function(extX, extY, transform)
    {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.extX = extX;
        this.extY = extY;
        this.transform = transform;
    };

    this.updateExtents = function(extX, extY)
    {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.extX = extX;
        this.extY = extY;
        this.geometry && this.geometry.Recalculate(extX, extY);
    };

    this.updateTransformMatrix = function(transform)
    {
        this.TransformMatrix = transform;
    };


    this.draw = function(overlay, transform)
    {
        var oldTransform = this.TransformMatrix;
        if(transform)
        {
            this.updateTransformMatrix(transform);
        }
        if(this.checkDrawGeometry())
        {
            overlay.SaveGrState();
            overlay.SetIntegerGrid(false);
            overlay.transform3(this.TransformMatrix, false);
            this.shapeDrawer.fromShape2(this, overlay, this.geometry);
            this.shapeDrawer.draw(this.geometry);
            overlay.RestoreGrState();
        }
        else
        {
            if (window["NATIVE_EDITOR_ENJINE"] === true)
            {
                var _shape = new CShape();
				_shape.extX = this.ext.cx;
				_shape.extY = this.ext.cy;
				
				_shape.brush = CreateSolidFillRGBA(255, 255, 255, 128);
				_shape.pen = new CLn();
				_shape.pen.Fill = CreateSolidFillRGBA(0, 0, 0, 160);
				_shape.pen.w = 18000;
				
				overlay.SaveGrState();
	            overlay.SetIntegerGrid(false);
	            overlay.transform3(this.TransformMatrix, false);
	            this.shapeDrawer.fromShape2(_shape, overlay, null);
	            this.shapeDrawer.draw(null);
	            overlay.RestoreGrState();
            }
            else
            {
                overlay.SaveGrState();
                overlay.SetIntegerGrid(false);
                overlay.transform3(this.TransformMatrix);
                overlay._s();
                overlay._m(0, 0);
                overlay._l(this.ext.cx, 0);
                overlay._l(this.ext.cx, this.ext.cy);
                overlay._l(0, this.ext.cy);
                overlay._z();
                overlay.p_color(0,0,0,160);
                overlay.p_width(500);
                overlay.ds();
                overlay.b_color1(255,255,255,128);
                overlay.df();
                overlay._e();
                overlay.RestoreGrState();
				
				if (overlay.m_oOverlay)
					overlay.m_oOverlay.ClearAll = true;
            }
        }
        if(transform)
        {
            this.updateTransformMatrix(oldTransform);
        }
    };

    this.checkDrawGeometry = function()
    {
        return this.geometry &&
            ( (this.pen && this.pen.Fill && this.pen.Fill.fill
                && this.pen.Fill.fill.type != FILL_TYPE_NOFILL && this.pen.Fill.fill.type != FILL_TYPE_NONE)
                || (this.brush && this.brush.fill && this.brush.fill
                && this.brush.fill.type != FILL_TYPE_NOFILL && this.brush.fill.type != FILL_TYPE_NONE) )
    }


    this.check_bounds = function(boundsChecker)
    {
        if(this.geometry)
        {
            this.geometry.check_bounds(boundsChecker);
        }
        else
        {
            boundsChecker._s();
            boundsChecker._m(0, 0);
            boundsChecker._l(this.ext.cx, 0);
            boundsChecker._l(this.ext.cx, this.ext.cy);
            boundsChecker._l(0, this.ext.cy);
            boundsChecker._z();
            boundsChecker._e();
        }
    }
}

function ObjectToDraw(brush, pen, extX, extY, geometry, transform, x, y)
{
    this.brush = brush;
    this.pen = pen;
    this.extX = extX;
    this.extY = extY;
    this.transform = transform;
    this.TransformMatrix = transform;
    this.geometry = geometry;
    this.parentShape = null;
    /*������� �������*/
    this.x = x;
    this.y = y;
}
ObjectToDraw.prototype =
{
    check_bounds: function(boundsChecker)
    {
        if(this.geometry)
        {
            this.geometry.check_bounds(boundsChecker);
        }
        else
        {
            boundsChecker._s();
            boundsChecker._m(0, 0);
            boundsChecker._l(this.extX, 0);
            boundsChecker._l(this.extX, this.extY);
            boundsChecker._l(0, this.extY);
            boundsChecker._z();
            boundsChecker._e();
        }
    },

    resetBrushPen: function(brush, pen, x, y)
    {
        this.brush = brush;
        this.pen = pen;

        if(isRealNumber(x) && isRealNumber(y))
        {
            this.x = x;
            this.y = y;
        }
    },

    Recalculate: function(oTheme, oColorMap, dWidth, dHeight, oShape)
    {
       // if(isRealNumber(this.x) && isRealNumber(this.y))
       // {
       //     if(Math.abs(dWidth - this.extX) > MOVE_DELTA || Math.abs(dHeight - this.extY))
       //     {
       //         this.x*=dWidth/this.extX;
       //         this.y*=dHeight/this.extY;
       //     }
       // }
        if(this.brush)
        {
            this.brush.check(oTheme, oColorMap);
        }
        if(this.pen && this.pen.Fill)
        {
            this.pen.Fill.check(oTheme, oColorMap);
        }
        if(this.geometry)
        {
            this.geometry.Recalculate(dWidth, dHeight);
        }
        this.parentShape = oShape;
    },

    draw: function(graphics, bNoParentShapeTransform, oTransformMatrix, oTheme, oColorMap)
    {
        var oTransform;
        if(oTransformMatrix)
        {
            oTransform = oTransformMatrix;
        }
        else
        {
            if(this.parentShape && !(bNoParentShapeTransform === true))
            {
                oTransform = this.parentShape.transformText;
            }
            else
            {
                oTransform = this.TransformMatrix;
            }
        }
        if(oTheme && oColorMap)
        {
            if(this.brush)
            {
                this.brush.check(oTheme, oColorMap);
            }
            if(this.pen && this.pen.Fill)
            {
                this.pen.Fill.check(oTheme, oColorMap);
            }
        }
        graphics.SaveGrState();
        graphics.SetIntegerGrid(false);
        graphics.transform3(oTransform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.geometry);
        if(graphics.IsSlideBoundsCheckerType)
        {
            shape_drawer.bIsNoFillAttack = false;
        }
        shape_drawer.draw(this.geometry);
        graphics.RestoreGrState();
    },

    createDuplicate: function()
    {
    }
};
function RotateTrackShapeImage(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.overlayObject = new OverlayObject(originalObject.spPr.geometry, originalObject.extX, originalObject.extY, originalObject.brush, originalObject.pen, this.transform);

    this.angle = originalObject.rot;
    var full_flip_h = this.originalObject.getFullFlipH();
    var full_flip_v = this.originalObject.getFullFlipV();
    this.signum = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v ? 1 : -1;
    this.draw = function(overlay, transform)
    {
        if(isRealNumber(this.originalObject.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalObject.selectStartPage);
        }
        this.overlayObject.draw(overlay, transform);
    };

    this.track = function(angle, e)
    {
        var new_rot = angle + this.originalObject.rot;
        while(new_rot < 0)
            new_rot += 2*Math.PI;
        while(new_rot >= 2*Math.PI)
            new_rot -= 2*Math.PI;

        if(new_rot < MIN_ANGLE || new_rot > 2*Math.PI - MIN_ANGLE)
            new_rot = 0;

        if(Math.abs(new_rot-Math.PI*0.5) < MIN_ANGLE)
            new_rot = Math.PI*0.5;

        if(Math.abs(new_rot-Math.PI) < MIN_ANGLE)
            new_rot = Math.PI;

        if(Math.abs(new_rot-1.5*Math.PI) < MIN_ANGLE)
            new_rot = 1.5*Math.PI;

        if(e.ShiftKey)
            new_rot = (Math.PI/12)*Math.floor(12*new_rot/(Math.PI));
        this.angle = new_rot;

        var hc, vc;
        hc = this.originalObject.extX*0.5;
        vc = this.originalObject.extY*0.5;
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.originalObject.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.originalObject.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.angle);
        global_MatrixTransformer.TranslateAppend(this.transform, this.originalObject.x + hc, this.originalObject.y + vc);
        if(this.originalObject.group)
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.originalObject.group.transform);
        }
        if(this.originalObject.parent && this.originalObject.parent.isShapeChild)
        {
            var parent_shape = this.originalObject.parent.isShapeChild(true);
            if(parent_shape)
            {
                global_MatrixTransformer.MultiplyAppend(this.transform, parent_shape.transformText);
            }

        }
    };

    this.trackEnd = function()
    {
        CheckSpPrXfrm(this.originalObject);
        this.originalObject.spPr.xfrm.setRot(this.angle);
    };

    this.getBounds = function()
    {
        var boundsChecker = new  CSlideBoundsChecker();
        var tr = this.transform;
        var parent_shape = this.originalObject && this.originalObject.parent && this.originalObject.parent.isShapeChild && this.originalObject.parent.isShapeChild(true);
        if(parent_shape)
        {
            tr = tr.CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(tr, parent_shape.invertTransformText);
        }
        this.draw(boundsChecker, parent_shape ? tr : null);
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0,0));
        arr_p_y.push(tr.TransformPointY(0,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,0));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,this.originalObject.extY));
        arr_p_x.push(tr.TransformPointX(0,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(0,this.originalObject.extY));

        arr_p_x.push(boundsChecker.Bounds.min_x);
        arr_p_x.push(boundsChecker.Bounds.max_x);
        arr_p_y.push(boundsChecker.Bounds.min_y);
        arr_p_y.push(boundsChecker.Bounds.max_y);

        boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
        boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
        boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
        boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);

        boundsChecker.Bounds.posX = this.originalObject.x;
        boundsChecker.Bounds.posY = this.originalObject.y;
        boundsChecker.Bounds.extX = this.originalObject.extX;
        boundsChecker.Bounds.extY = this.originalObject.extY;
        return boundsChecker.Bounds;
    }
}

function RotateTrackGroup(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();

    this.overlayObjects = [];


    this.arrTransforms = [];
    this.arrTransforms2 = [];
    var arr_graphic_objects = originalObject.getArrGraphicObjects();
    var group_invert_transform = originalObject.getInvertTransform();
    for(var i = 0; i < arr_graphic_objects.length; ++i)
    {
        var gr_obj_transform_copy = arr_graphic_objects[i].getTransformMatrix().CreateDublicate();
        global_MatrixTransformer.MultiplyAppend(gr_obj_transform_copy, group_invert_transform);
        this.arrTransforms2[i] = gr_obj_transform_copy;
        this.overlayObjects[i] = new OverlayObject(arr_graphic_objects[i].spPr.geometry, arr_graphic_objects[i].extX, arr_graphic_objects[i].extY,
            arr_graphic_objects[i].brush,  arr_graphic_objects[i].pen, new CMatrix());
    }


    this.angle = originalObject.rot;

    this.draw = function(overlay)
    {
        if(isRealNumber(this.originalObject.selectStartPage) && overlay.SetCurrentPage)
        {
            overlay.SetCurrentPage(this.originalObject.selectStartPage);
        }
        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            this.overlayObjects[i].draw(overlay);
        }
    };

    this.getBounds = function()
    {
        var boundsChecker = new  CSlideBoundsChecker();
        this.draw(boundsChecker);
        var tr = this.transform;
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0,0));
        arr_p_y.push(tr.TransformPointY(0,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,0));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,0));
        arr_p_x.push(tr.TransformPointX(this.originalObject.extX,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(this.originalObject.extX,this.originalObject.extY));
        arr_p_x.push(tr.TransformPointX(0,this.originalObject.extY));
        arr_p_y.push(tr.TransformPointY(0,this.originalObject.extY));

        arr_p_x.push(boundsChecker.Bounds.min_x);
        arr_p_x.push(boundsChecker.Bounds.max_x);
        arr_p_y.push(boundsChecker.Bounds.min_y);
        arr_p_y.push(boundsChecker.Bounds.max_y);

        boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
        boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
        boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
        boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);
        boundsChecker.Bounds.posX = this.originalObject.x;
        boundsChecker.Bounds.posY = this.originalObject.y;
        boundsChecker.Bounds.extX = this.originalObject.extX;
        boundsChecker.Bounds.extY = this.originalObject.extY;
        return boundsChecker.Bounds;
    };

    this.track = function(angle, e)
    {
        var new_rot = angle + this.originalObject.rot;
        while(new_rot < 0)
            new_rot += 2*Math.PI;
        while(new_rot >= 2*Math.PI)
            new_rot -= 2*Math.PI;

        if(new_rot < MIN_ANGLE || new_rot > 2*Math.PI - MIN_ANGLE)
            new_rot = 0;

        if(Math.abs(new_rot-Math.PI*0.5) < MIN_ANGLE)
            new_rot = Math.PI*0.5;

        if(Math.abs(new_rot-Math.PI) < MIN_ANGLE)
            new_rot = Math.PI;

        if(Math.abs(new_rot-1.5*Math.PI) < MIN_ANGLE)
            new_rot = 1.5*Math.PI;

        if(e.ShiftKey)
            new_rot = (Math.PI/12)*Math.floor(12*new_rot/(Math.PI));
        this.angle = new_rot;

        var hc, vc;
        hc = this.originalObject.extX*0.5;
        vc = this.originalObject.extY*0.5;
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.originalObject.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.originalObject.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.angle);
        global_MatrixTransformer.TranslateAppend(this.transform, this.originalObject.x + hc, this.originalObject.y + vc);
        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            var new_transform = this.arrTransforms2[i].CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(new_transform, this.transform);
            this.overlayObjects[i].updateTransformMatrix(new_transform);
        }
    };

    this.trackEnd = function()
    {
        CheckSpPrXfrm(this.originalObject);
        this.originalObject.spPr.xfrm.setRot(this.angle);
    }
}