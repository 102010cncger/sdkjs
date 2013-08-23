/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/28/13
 * Time: 4:14 PM
 * To change this template use File | Settings | File Templates.
 */

function MoveShapeImageTrack(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.x = null;
    this.y = null;
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.originalObject.brush, this.originalObject.pen, this.transform);


    this.getOriginalBoundsRect = function()
    {
        return this.originalObject.getRectBounds();
    };

    this.track = function(dx, dy)
    {
        var original = this.originalObject;
        this.x = original.x + dx;
        this.y = original.y + dy;
        this.transform.Reset();
        var hc = original.extX*0.5;
        var vc = original.extY*0.5;

        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(original.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(original.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -original.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
    };

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.trackEnd = function()
    {
        this.originalObject.setXfrm(this.x, this.y, null, null, null, null, null);
    };
}

function MoveShapeImageTrackInGroup(originalObject)
{
    this.originalObject = originalObject;
    this.x = null;
    this.y = null;
    this.transform = new CMatrix();
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.originalObject.brush, this.originalObject.pen, this.transform);
    this.inv = global_MatrixTransformer.Invert(originalObject.group.transform);
    this.inv.tx = 0;
    this.inv.ty = 0;
    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.track = function(dx, dy)
    {
        var dx_t = this.inv.TransformPointX(dx, dy);
        var dy_t = this.inv.TransformPointY(dx, dy);
        this.x = this.originalObject.x + dx_t;
        this.y = this.originalObject.y + dy_t;
        this.calculateTransform();
    };

    this.getOriginalBoundsRect = function()
    {
        return this.originalObject.getRectBounds();
    };

    this.calculateTransform = function()
    {
        var t = this.transform;
        t.Reset();
        global_MatrixTransformer.TranslateAppend(t, -this.originalObject.extX*0.5, -this.originalObject.extY*0.5);
        if(this.originalObject.flipH)
        {
            global_MatrixTransformer.ScaleAppend(t, -1, 1);
        }
        if(this.originalObject.flipV)
        {
            global_MatrixTransformer.ScaleAppend(t, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(t, -this.originalObject.rot);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.originalObject.extX*0.5, this.y + this.originalObject.extY*0.5);
        global_MatrixTransformer.MultiplyAppend(t, this.originalObject.group.getTransform());
    };

    this.trackEnd = function()
    {
        var scale_scale_coefficients = this.originalObject.group.getResultScaleCoefficients();
        var xfrm = this.originalObject.group.spPr.xfrm;
        this.originalObject.setPosition(this.x/scale_scale_coefficients.cx + xfrm.chOffX, this.y/scale_scale_coefficients.cy + xfrm.chOffY);
        this.originalObject.recalculateTransform();
        this.originalObject.calculateTransformTextMatrix();
    }
}

function MoveGroupTrack(originalObject)
{
    this.x = null;
    this.y = null;
    this.originalObject = originalObject;
    this.transform = new CMatrix();

    this.overlayObjects = [];

    this.arrTransforms2 = [];
    var arr_graphic_objects = originalObject.getArrGraphicObjects();
    var group_invert_transform = originalObject.getInvertTransform();
    for(var i = 0; i < arr_graphic_objects.length; ++i)
    {
        var gr_obj_transform_copy = arr_graphic_objects[i].getTransform().CreateDublicate();
        global_MatrixTransformer.MultiplyAppend(gr_obj_transform_copy, group_invert_transform);
        this.arrTransforms2[i] = gr_obj_transform_copy;
        this.overlayObjects[i] = new OverlayObject(arr_graphic_objects[i].spPr.geometry, arr_graphic_objects[i].extX, arr_graphic_objects[i].extY,
            arr_graphic_objects[i].brush,  arr_graphic_objects[i].pen, new CMatrix());
    }


    this.getOriginalBoundsRect = function()
    {
        return this.originalObject.getRectBounds();
    };

    this.track = function(dx, dy)
    {
        var original = this.originalObject;
        this.x = original.x + dx;
        this.y = original.y + dy;
        this.transform.Reset();
        var hc = original.extX*0.5;
        var vc = original.extY*0.5;

        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(original.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(original.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -original.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);

        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            var new_transform = this.arrTransforms2[i].CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(new_transform, this.transform);
            this.overlayObjects[i].updateTransformMatrix(new_transform);
        }
    };

    this.draw = function(overlay)
    {
        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            this.overlayObjects[i].draw(overlay);
        }
    };

    this.trackEnd = function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateUndo, null, null,
            new UndoRedoDataGraphicObjects(this.originalObject.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        this.originalObject.setPosition(this.x, this.y);
        this.originalObject.recalculate();
        this.originalObject.updateDrawingBaseCoordinates();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateRedo, null, null,
            new UndoRedoDataGraphicObjects(this.originalObject.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    };
}

function MoveTitleInChart(originalObject)
{
    this.originalObject = originalObject;
    this.x = null;
    this.y = null;
    this.transform = new CMatrix();

    var pen = new CLn();
    pen.Fill = new CUniFill();
    pen.Fill.fill = new CSolidFill();
    pen.Fill.fill.color = new CUniColor();
    pen.Fill.fill.color.color = new CRGBColor();
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.originalObject.brush,/* this.originalObject.pen*/pen, this.transform);
    this.inv = global_MatrixTransformer.Invert(originalObject.chartGroup.transform);
    this.inv.tx = 0;
    this.inv.ty = 0;
    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.track = function(dx, dy)
    {
        var dx_t = this.inv.TransformPointX(dx, dy);
        var dy_t = this.inv.TransformPointY(dx, dy);
        this.x = this.originalObject.x + dx_t;
        this.y = this.originalObject.y + dy_t;

        if(this.x + this.originalObject.extX > this.originalObject.chartGroup.extX)
            this.x = this.originalObject.chartGroup.extX - this.originalObject.extX;
        if(this.x < 0)
            this.x = 0;

        if(this.y + this.originalObject.extY > this.originalObject.chartGroup.extY)
            this.y = this.originalObject.chartGroup.extY - this.originalObject.extY;
        if(this.y < 0)
            this.y = 0;

        this.calculateTransform();
    };

    this.getOriginalBoundsRect = function()
    {
        return this.originalObject.getRectBounds();
    };

    this.calculateTransform = function()
    {
        var t = this.transform;
        t.Reset();
        global_MatrixTransformer.TranslateAppend(t, -this.originalObject.extX*0.5, -this.originalObject.extY*0.5);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.originalObject.extX*0.5, this.y + this.originalObject.extY*0.5);
        global_MatrixTransformer.MultiplyAppend(t, this.originalObject.chartGroup.getTransform());
    };

    this.trackEnd = function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.originalObject.chartGroup.Id, new UndoRedoDataShapeRecalc()), null);
        this.originalObject.setPosition(this.x, this.y);
        this.originalObject.chartGroup.recalculate();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.originalObject.chartGroup.Id, new UndoRedoDataShapeRecalc()), null);
    }
}

function MoveTrackChart(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.x = null;
    this.y = null;
    var geometry = CreateGeometry("rect");
    geometry.Init(this.originalObject.extX, this.originalObject.extY);
    geometry.Recalculate(this.originalObject.extX, this.originalObject.extY);
    var brush = new CUniFill();
    brush.fill = new CSolidFill();
    brush.fill.color = new CUniColor();
    brush.fill.color.RGBA = {R:255, G:255, B:255, A:255};
    brush.fill.color.color = new CRGBColor();
    brush.fill.color.color.RGBA = {R:255, G:255, B:255, A:255};
    var pen = new CLn();
    pen.Fill = new CUniFill();
    pen.Fill.fill = new CSolidFill();
    pen.Fill.fill.color = new CUniColor();
    pen.Fill.fill.color.color = new CRGBColor();

    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, brush, pen, this.transform);


    this.getOriginalBoundsRect = function()
    {
        return this.originalObject.getRectBounds();
    };

    this.track = function(dx, dy)
    {
        var original = this.originalObject;
        this.x = original.x + dx;
        this.y = original.y + dy;
        this.transform.Reset();
        var hc = original.extX*0.5;
        var vc = original.extY*0.5;

        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
    };

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.trackEnd = function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.originalObject.Id, new UndoRedoDataShapeRecalc()), null);
        this.originalObject.x = this.x;
        this.originalObject.y = this.y;
        this.originalObject.updateDrawingBaseCoordinates();
        this.originalObject.setPosition(this.x, this.y);

        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.originalObject.Id, new UndoRedoDataShapeRecalc()), null);
        this.originalObject.recalculateTransform();
        this.originalObject.calculateTransformTextMatrix();
    };
}

