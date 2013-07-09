/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 7:30 PM
 * To change this template use File | Settings | File Templates.
 */

var STATES_ID_NULL = 0x00;
var STATES_ID_PRE_ROTATE = 0x01;
var STATES_ID_ROTATE = 0x02;
var STATES_ID_PRE_RESIZE = 0x03;
var STATES_ID_RESIZE = 0x04;
var STATES_ID_START_TRACK_NEW_SHAPE = 0x05;
var STATES_ID_BEGIN_TRACK_NEW_SHAPE = 0x06;
var STATES_ID_TRACK_NEW_SHAPE = 0x07;
var STATES_ID_PRE_MOVE = 0x08;
var STATES_ID_MOVE = 0x09;
var STATES_ID_PRE_CHANGE_ADJ = 0x10;
var STATES_ID_CHANGE_ADJ = 0x11;
var STATES_ID_GROUP = 0x12;
var STATES_ID_PRE_CHANGE_ADJ_IN_GROUP = 0x13;
var STATES_ID_CHANGE_ADJ_IN_GROUP = 0x14;
var STATES_ID_PRE_ROTATE_IN_GROUP = 0x15;
var STATES_ID_ROTATE_IN_GROUP = 0x16;
var STATES_ID_PRE_RESIZE_IN_GROUP = 0x17;
var STATES_ID_RESIZE_IN_GROUP = 0x18;
var STATES_ID_PRE_MOVE_IN_GROUP = 0x19;
var STATES_ID_MOVE_IN_GROUP = 0x20;
var STATES_ID_SPLINE_BEZIER = 0x21;
var STATES_ID_SPLINE_BEZIER33 = 0x22;
var STATES_ID_SPLINE_BEZIER2 = 0x23;
var STATES_ID_SPLINE_BEZIER3 = 0x24;
var STATES_ID_SPLINE_BEZIER4 = 0x25;
var STATES_ID_SPLINE_BEZIER5 = 0x26;
var STATES_ID_POLY_LINE_ADD = 0x27;
var STATES_ID_POLY_LINE_ADD2 = 0x28;
var STATES_ID_ADD_PPOLY_LINE2 = 0x29;
var STATES_ID_ADD_PPOLY_LINE22 = 0x30;
var STATES_ID_ADD_PPOLY_LINE23 = 0x31;
var STATES_ID_TEXT_ADD = 0x32;







var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});

function NullState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_NULL;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1)
        {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(selected_objects[0].canChangeAdjustments())
                {
                    this.drawingObjectsController.clearPreTrackObjects();
                    if(hit_to_adj.adjPolarFlag === false)
                        this.drawingObjectsController.addPreTrackObject(new XYAdjustmentTrack(selected_objects[0], hit_to_adj.adjNum));
                    else
                        this.drawingObjectsController.addPreTrackObject(new PolarAdjustmentTrack(selected_objects[0], hit_to_adj.adjNum));
                    this.drawingObjectsController.changeCurrentState(new PreChangeAdjState(this.drawingObjectsController, this.drawingObjects));
                }
                return;
            }
        }

        for(var i = selected_objects.length - 1; i > -1; --i)
        {
            var hit_to_handles = selected_objects[i].hitToHandles(x, y);
            if(hit_to_handles > -1)
            {
                if(hit_to_handles === 8)
                {
                    if(!selected_objects[i].canRotate())
                        return;

                    this.drawingObjectsController.clearPreTrackObjects();
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        if(selected_objects[j].canRotate())
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createRotateTrack());
                        }
                    }
                    this.drawingObjectsController.changeCurrentState(new PreRotateState(this.drawingObjectsController, this.drawingObjects, selected_objects[i]));
                }
                else
                {
                    if(!selected_objects[i].canResize())
                        return;
                    this.drawingObjectsController.clearPreTrackObjects();
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        if(selected_objects[j].canResize())
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createResizeTrack(card_direction));
                    }
                    this.drawingObjectsController.changeCurrentState(new PreResizeState(this.drawingObjectsController, this.drawingObjects, selected_objects[i], card_direction))
                }
                return;
            }
        }

        for(i = selected_objects.length - 1; i > -1; --i)
        {
            if(selected_objects[i].hitInBoundingRect(x, y))
            {
                if(!selected_objects[i].canMove())
                    return;
                this.drawingObjectsController.clearPreTrackObjects();
                for(var j = 0; j < selected_objects.length; ++j)
                {
                    this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                }
                this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.shiftKey, e.ctrl, selected_objects[i], true, false));
                return;
            }
        }

        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for(i = arr_drawing_objects.length-1; i > -1; --i)
        {
            var cur_drawing_base = arr_drawing_objects[i];
            if(cur_drawing_base.isGraphicObject())
            {
                var cur_drawing = cur_drawing_base.graphicObject;
                if(cur_drawing.isSimpleObject())
                {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                    {
                        this.drawingObjectsController.clearPreTrackObjects();
                        var is_selected = cur_drawing.selected;
                        if(!(e.ctrlKey || e.shiftKey) && !is_selected)
                            this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        this.drawingObjects.selectGraphicObject();
                        for(var j = 0; j < selected_objects.length; ++j)
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                        }
                        this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.shiftKey, e.ctrl, cur_drawing, is_selected, true));
                        return;
                    }
                    else if(hit_in_text_rect)
                    {
                        cur_drawing.selectionSetStart(e, x, y);
                        this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, cur_drawing));
                        if(e.ClickCount < 2)
                            cur_drawing.updateSelectionState(this.drawingObjects.drawingDocument);
                        return;
                    }
                }
                else
                {
                    var grouped_objects = cur_drawing.getArrGraphicObjects();
                    for(var j = grouped_objects.length - 1; j > -1; --j)
                    {
                        var cur_grouped_object = grouped_objects[j];
                        var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                        var hit_in_path = cur_grouped_object.hitInPath(x, y);
                        var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                        if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                        {
                            this.drawingObjectsController.clearPreTrackObjects();
                            var is_selected = cur_drawing.selected;
                            if(!(e.ctrlKey || e.shiftKey))
                                this.drawingObjectsController.resetSelection();
                            cur_drawing.select(this.drawingObjectsController);
                            this.drawingObjects.selectGraphicObject();
                            for(var j = 0; j < selected_objects.length; ++j)
                            {
                                this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                            }
                            this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.shiftKey, e.ctrl, cur_drawing, is_selected, true));
                            return;
                        }
                        else if(hit_in_text_rect)
                        {
                            //TODO
                        }
                    }
                }
            }
        }
        this.drawingObjectsController.resetSelection();
    };

    this.onMouseMove = function(e, x, y)
    {};

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {
        var b_prevent_default = false;
        switch (e.keyCode)
        {
            case 8:
            {
                b_prevent_default = true;
            }
        }
        if(b_prevent_default)
            e.preventDefault();
    };

    this.onKeyPress = function(e)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1 && selected_objects[0].isShape())
        {
            if(isRealNumber(e.charCode))
            {
               selected_objects[0].paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
               this.drawingObjects.showDrawingObjects(true);
            }
        }

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1)
        {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(selected_objects[0].canChangeAdjustments())
                {
                    return {objectId: selected_objects[0].drawingBase.id, cursorType: "crosshair"};
                }
            }
        }

        for(var i = selected_objects.length - 1; i > -1; --i)
        {
            var hit_to_handles = selected_objects[i].hitToHandles(x, y);
            if(hit_to_handles > -1)
            {
                if(hit_to_handles === 8)
                {
                    if(!selected_objects[i].canRotate())
                        return null;
                    return {objectId: selected_objects[i].drawingBase.id, cursorType: "crosshair"};
                }
                else
                {
                    if(!selected_objects[i].canResize())
                        return null;
                    this.drawingObjectsController.clearPreTrackObjects();
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        if(selected_objects[j].canResize())
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createResizeTrack(card_direction));
                    }
                    return {objectId: selected_objects[i].drawingBase.id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};
                }
            }
        }

        for(i = selected_objects.length - 1; i > -1; --i)
        {
            if(selected_objects[i].hitInBoundingRect(x, y))
            {
                if(!selected_objects[i].canMove())
                    return null;
                return {objectId: selected_objects[i].drawingBase.id, cursorType: "move"};
            }
        }

        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for(i = arr_drawing_objects.length-1; i > -1; --i)
        {
            var cur_drawing_base = arr_drawing_objects[i];
            if(cur_drawing_base.isGraphicObject())
            {
                var cur_drawing = cur_drawing_base.graphicObject;
                if(cur_drawing.isSimpleObject())
                {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                    {
                        return {objectId: cur_drawing_base.id, cursorType: "move"};
                    }
                    else if(hit_in_text_rect)
                    {
                        return {objectId: cur_drawing_base.id, cursorType: "move"};
                    }
                }
                else
                {
                    var grouped_objects = cur_drawing.getArrGraphicObjects();
                    for(var j = grouped_objects.length - 1; j > -1; --j)
                    {
                        var cur_grouped_object = grouped_objects[j];
                        var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                        var hit_in_path = cur_grouped_object.hitInPath(x, y);
                        var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                        if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                        {
                            return {objectId: cur_drawing_base.id, cursorType: "move"};
                        }
                        else if(hit_in_text_rect)
                        {
                            //TODO
                        }
                    }
                }
            }
        }
        return null;
    };
}


function TextAddState(drawingObjectsController, drawingObjects, textObject)
{
    this.id = STATES_ID_TEXT_ADD;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.textObject = textObject;
    this.nullState = new NullState(drawingObjectsController, drawingObjects);

    this.onMouseDown = function(e, x, y)
    {
        this.nullState.onMouseDown(e, x, y);
    };

    this.onMouseMove = function(e, x, y)
    {
        if(e.which > 0)
        {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };

    this.onMouseUp = function(e, x, y)
    {
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
    };

    this.onKeyDown = function(e)
    {
        var b_prevent_default = false;
        switch (e.keyCode)
        {
            case 8:
            {
                b_prevent_default = true;
            }
        }
        if(b_prevent_default)
            e.preventDefault();
    };

    this.onKeyPress = function(e)
    {
        this.textObject.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
        this.drawingObjects.showDrawingObjects(true);
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
        //this.textObject.updateSelectionState(drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return this.nullState.isPointInDrawingObjects(x, y);
    };
}

function PreRotateState(drawingObjectsController, drawingObjects, majorObject)
{
    this.id = STATES_ID_PRE_ROTATE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;

    this.onMouseDown = function(e, x, y)
    {
    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new RotateState(this.drawingObjectsController, this.drawingObjects, this.majorObject));
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();

    };

    this.onKeyDown = function(e)
    {

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.majorObject.drawingBase.id, cursorType: "crosshair"};
    };
}

function RotateState(drawingObjectsController, drawingObjects, majorObject)
{
    this.id = STATES_ID_ROTATE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;

    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        var angle = this.majorObject.getRotateAngle(x, y);
        this.drawingObjectsController.rotateTrackObjects(angle, e);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
		asc["editor"].asc_endAddShape();
    };

    this.onKeyPress = function(e)
    {
    };

    this.onKeyDown = function(e)
    {

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.majorObject.drawingBase.id, cursorType: "crosshair"};
    };
}

function PreResizeState(drawingObjectsController, drawingObjects, majorObject, cardDirection)
{
    this.id = STATES_ID_PRE_RESIZE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;

    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ResizeState(this.drawingObjectsController, this.drawingObjects, this.majorObject, this.cardDirection))
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };


    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {

        return {objectId: this.majorObject.drawingBase.id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]};
    };
}

function ResizeState(drawingObjectsController, drawingObjects, majorObject, cardDirection)
{
    this.id = STATES_ID_RESIZE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.handleNum = this.majorObject.getNumByCardDirection(cardDirection);
    this.cardDirection = cardDirection;

    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, x, y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();

    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.majorObject.drawingBase.id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]};
    };
}

function StartTrackNewShapeState(drawingObjectsController, drawingObjects, presetGeom)
{
    this.id = STATES_ID_START_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;

    this.onMouseDown = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new BeginTrackNewShapeState(this.drawingObjectsController, this.drawingObjects, this.presetGeom, x, y));
    };

    this.onMouseMove = function(e, x, y)
    {
    };

    this.onMouseUp = function(e, x, y)
    {
        //TODO
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };
}

function BeginTrackNewShapeState(drawingObjectsController, drawingObjects, presetGeom, startX, startY)
{
    this.id = STATES_ID_BEGIN_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;
    this.startX = startX;
    this.startY = startY;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.addTrackObject(new NewShapeTrack(this.drawingObjects, this.presetGeom, this.startX, this.startY));
        this.drawingObjectsController.trackNewShape(e, x, y);
        this.drawingObjectsController.changeCurrentState(new TrackNewShapeState(this.drawingObjectsController, this.drawingObjects));

    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();

    };

    this.onKeyDown = function(e)
    {

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1)
        {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(selected_objects[0].canChangeAdjustments())
                {
                    return {objectId: selected_objects[0].drawingBase.id, cursorType: "crosshair"};
                }
            }
        }

        for(var i = selected_objects.length - 1; i > -1; --i)
        {
            var hit_to_handles = selected_objects[i].hitToHandles(x, y);
            if(hit_to_handles > -1)
            {
                if(hit_to_handles === 8)
                {
                    if(!selected_objects[i].canRotate())
                        return null;
                    return {objectId: selected_objects[i].drawingBase.id, cursorType: "crosshair"};
                }
                else
                {
                    if(!selected_objects[i].canResize())
                        return null;
                    this.drawingObjectsController.clearPreTrackObjects();
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        if(selected_objects[j].canResize())
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createResizeTrack(card_direction));
                    }
                    return {objectId: selected_objects[i].drawingBase.id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};
                }
            }
        }

        for(i = selected_objects.length - 1; i > -1; --i)
        {
            if(selected_objects[i].hitInBoundingRect(x, y))
            {
                if(!selected_objects[i].canMove())
                    return null;
                return {objectId: selected_objects[i].drawingBase.id, cursorType: "move"};
            }
        }

        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for(i = arr_drawing_objects.length-1; i > -1; --i)
        {
            var cur_drawing_base = arr_drawing_objects[i];
            if(cur_drawing_base.isGraphicObject())
            {
                var cur_drawing = cur_drawing_base.graphicObject;
                if(cur_drawing.isSimpleObject())
                {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                    {
                        return {objectId: cur_drawing_base.id, cursorType: "move"};
                    }
                    else if(hit_in_text_rect)
                    {
                        //TODO
                    }
                }
                else
                {
                    var grouped_objects = cur_drawing.getArrGraphicObjects();
                    for(var j = grouped_objects.length - 1; j > -1; --j)
                    {
                        var cur_grouped_object = grouped_objects[j];
                        var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                        var hit_in_path = cur_grouped_object.hitInPath(x, y);
                        var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                        if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                        {
                            return {objectId: cur_drawing_base.id, cursorType: "move"};
                        }
                        else if(hit_in_text_rect)
                        {
                            //TODO
                        }
                    }
                }
            }
        }
        return null;
    };
}

function TrackNewShapeState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.trackNewShape(e, x, y);
        this.drawingObjects.showOverlayGraphicObjects();
        this.drawingObjects.selectGraphicObject();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };
}

function PreMoveState(drawingObjectsController, drawingObjects, startX, startY, shift, ctrl, majorObject, majorObjectIsSelected, bInside)
{
    this.id = STATES_ID_PRE_MOVE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.shift = shift;
    this.ctrl = ctrl;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = majorObjectIsSelected;
    this.bInside = bInside;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        var track_objects = this.drawingObjectsController.getTrackObjects();
        var max_x, min_x, max_y, min_y;
        var cur_rect_bounds = track_objects[0].getOriginalBoundsRect();
        max_x = cur_rect_bounds.maxX;
        min_x = cur_rect_bounds.minX;
        max_y = cur_rect_bounds.maxY;
        min_y = cur_rect_bounds.minY;
        for(var i = 0; i < track_objects.length; ++i)
        {
            cur_rect_bounds = track_objects[i].getOriginalBoundsRect();
            if(max_x < cur_rect_bounds.maxX)
                max_x = cur_rect_bounds.maxX;
            if(min_x > cur_rect_bounds.minX)
                min_x = cur_rect_bounds.minX;
            if(max_y < cur_rect_bounds.maxY)
                max_y = cur_rect_bounds.maxY;
            if(min_y > cur_rect_bounds.minY)
                min_y = cur_rect_bounds.minY;
        }
        this.drawingObjectsController.changeCurrentState(new MoveState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, min_x, min_y, max_x - min_x, max_y - min_y, this.majorObject));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };

    this.onMouseUp = function(e, x, y)
    {

        this.drawingObjectsController.clearPreTrackObjects();
        if(!(this.majorObject.isGroup() && this.bInside))
        {
            if(this.shift || this.ctrl)
            {
                if(this.majorObjectIsSelected)
                    this.majorObject.deselect(this.drawingObjectsController);
            }
        }
        else
        {
            if(this.majorObjectIsSelected)
            {
                this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.majorObject));
                this.drawingObjectsController.onMouseDown(e, x, y);
                this.drawingObjectsController.onMouseUp(e, x, y);
                return;
            }
        }
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();

    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.drawingBase.id, cursorType: "move"}
    };
}

function MoveState(drawingObjectsController, drawingObjects, startX, startY, rectX, rectY, rectW, rectH, majorObject)
{
    this.id = STATES_ID_MOVE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.rectX = rectX;
    this.rectY = rectY;
    this.rectW = rectW;
    this.rectH = rectH;
    this.majorObject = majorObject;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        var dx = x - this.startX;
        var dy = y - this.startY;
        var check_position = this.drawingObjects.checkGraphicObjectPosition(this.rectX + dx, this.rectY + dy, this.rectW, this.rectH);
        this.drawingObjectsController.trackMoveObjects(dx + check_position.x, dy + check_position.y);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
		asc["editor"].asc_endAddShape();
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.drawingBase.id, cursorType: "move"}
    };
}


function PreChangeAdjState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_PRE_CHANGE_ADJ;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjectsController.changeCurrentState(new ChangeAdjState(this.drawingObjectsController, this.drawingObjects))
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();

    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.drawingBase.id, cursorType: "crosshair"}
    };
}

function ChangeAdjState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_CHANGE_ADJ;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();

    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.drawingBase.id, cursorType: "crosshair"}
    };
}


function GroupState(drawingObjectsController, drawingObjects, group)
{
    this.id = STATES_ID_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;

    this.onMouseDown = function(e, x, y)
    {
        var group_selected_objects = this.group.selectedObjects;
        if(group_selected_objects.length === 1)
        {
            var hit_to_adj = group_selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(group_selected_objects[0].canChangeAdjustments())
                {
                    if(hit_to_adj.adjPolarFlag === false)
                        this.drawingObjectsController.addPreTrackObject(new XYAdjustmentTrack(group_selected_objects[0], hit_to_adj.adjNum));
                    else
                        this.drawingObjectsController.addPreTrackObject(new PolarAdjustmentTrack(group_selected_objects[0], hit_to_adj.adjNum));
                    this.drawingObjectsController.changeCurrentState(new PreChangeAdjInGroupState(this.drawingObjectsController, this.drawingObjects, this.group));
                }
                return;
            }
        }
        for(var i = group_selected_objects.length - 1; i  > -1; --i)
        {
            var hit_to_handles = group_selected_objects[i].hitToHandles(x, y);
            if(hit_to_handles > -1)
            {
                if(hit_to_handles === 8)
                {
                    if(!group_selected_objects[i].canRotate())
                        return;
                    for(var j = 0; j < group_selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createRotateInGroupTrack())
                    }
                    this.drawingObjectsController.changeCurrentState(new PreRotateInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, group_selected_objects[i]));
                }
                else
                {
                    if(!group_selected_objects[i].canResize())
                        return;
                    var card_direction = group_selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    for(var j = 0; j < group_selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createResizeInGroupTrack(card_direction))
                    }
                    this.drawingObjectsController.changeCurrentState(new PreResizeInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, group_selected_objects[i], card_direction));
                }
                return;
            }
        }

        var hit_to_handles = this.group.hitToHandles(x, y);
        if(hit_to_handles > -1)
        {
            if(hit_to_handles === 8)
            {
                if(!this.group.canRotate())
                    return;
                this.group.resetSelection(this.drawingObjectsController);
                this.drawingObjectsController.addPreTrackObject(this.group.createRotateTrack());
                this.drawingObjectsController.changeCurrentState(new PreRotateState(this.drawingObjectsController, this.drawingObjects, this.group));
                return;
            }
            else
            {
                if(!this.group.canResize())
                    return;
                this.group.resetSelection(this.drawingObjectsController);
                var card_direction = this.group.getCardDirectionByNum(hit_to_handles);
                this.drawingObjectsController.addPreTrackObject(this.group.createResizeTrack(card_direction));
                this.drawingObjectsController.changeCurrentState(new PreResizeState(this.drawingObjectsController, this.drawingObjects, this.group, card_direction));
                return;
            }
        }


        for(i = group_selected_objects.length - 1; i  > -1; --i)
        {
            if(group_selected_objects[i].hitInBoundingRect(x, y))
            {
                this.drawingObjectsController.clearPreTrackObjects();
                for(var j = 0; j < group_selected_objects.length; ++j)
                {
                    this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
                }
                this.drawingObjectsController.changeCurrentState(new PreMoveInGroupState(this.drawingObjectsController, this.drawingObjects, this.group,
                    x, y, e.shiftKey, e.ctrlKey, group_selected_objects[i], true));
            }
        }

        if(this.group.hitInBoundingRect(x, y))
        {
            this.group.resetSelection();
            this.drawingObjectsController.addPreTrackObject(this.group.createMoveTrack());
            this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.shiftKey, e.ctrlKey, this.group, true, false));
            return;
        }

        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(i = drawing_bases.length - 1; i > -1; --i)
        {
            var cur_drawing_base = drawing_bases[i];
            if(cur_drawing_base.isGraphicObject())
            {
                var cur_drawing = cur_drawing_base.graphicObject;
                if(cur_drawing.isSimpleObject())
                {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                    {
                        this.group.resetSelection(this.drawingObjectsController);
                        if(!(e.ctrlKey || e.shiftKey))
                            this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        for(var j = 0; j < selected_objects.length; ++j)
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                        }
                        this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.shiftKey, e.ctrl, cur_drawing, false, true));
                        this.drawingObjects.selectGraphicObject();
                        return;
                    }
                    else if(hit_in_text_rect)
                    {
                        //TODO
                    }
                }
                else
                {
                    if(this.group === cur_drawing)
                    {
                        var arr_graphic_objects = this.group.getArrGraphicObjects();
                        for(i = arr_graphic_objects.length - 1; i > -1; --i)
                        {
                            var cur_drawing = arr_graphic_objects[i];
                            var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                            var hit_in_path = cur_drawing.hitInPath(x, y);
                            var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                            if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                            {
                                var is_selected = cur_drawing.selected;
                                if(!(e.ctrlKey || e.shiftKey) && !is_selected)
                                    this.group.resetSelection();
                                cur_drawing.select(this.drawingObjectsController);
                                this.drawingObjects.selectGraphicObject();
                                for(var j = 0; j < group_selected_objects.length; ++j)
                                {
                                    this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
                                }
                                this.drawingObjectsController.changeCurrentState(new PreMoveInGroupState(this.drawingObjectsController, this.drawingObjects,this.group,  x, y, e.shiftKey, e.ctrl, cur_drawing, is_selected));
                                this.drawingObjects.selectGraphicObject();
                                return;
                            }
                            else if(hit_in_text_rect)
                            {
                                //TODO
                            }
                        }
                    }
                    else
                    {
                        var grouped_objects = cur_drawing.getArrGraphicObjects();
                        for(var j = grouped_objects.length - 1; j > -1; --j)
                        {
                            var cur_grouped_object = grouped_objects[j];
                            var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                            var hit_in_path = cur_grouped_object.hitInPath(x, y);
                            var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                            if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                            {
                                this.group.resetSelection(this.drawingObjectsController);
                                if(!(e.ctrlKey || e.shiftKey))
                                    this.drawingObjectsController.resetSelection();
                                cur_drawing.select(this.drawingObjectsController);
                                this.drawingObjects.selectGraphicObject();
                                for(var j = 0; j < selected_objects.length; ++j)
                                {
                                    this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                                }
                                this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.shiftKey, e.ctrl, cur_drawing, false, true));
                                this.drawingObjectsController.selectGraphicObject();
                                return;
                            }
                            else if(hit_in_text_rect)
                            {
                                //TODO
                            }
                        }
                    }
                }
            }
        }

        this.group.resetSelection(this.drawingObjectsController);
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjects.selectGraphicObject();

    };

    this.onMouseMove = function(e, x, y)
    {};

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        var group_selected_objects = this.group.selectedObjects;
        if(group_selected_objects.length === 1)
        {
            var hit_to_adj = group_selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                return {objectId: this.group.drawingBase.id, cursorType: "crosshair"};
            }
        }
        for(var i = group_selected_objects.length - 1; i  > -1; --i)
        {
            var hit_to_handles = group_selected_objects[i].hitToHandles(x, y);
            if(hit_to_handles > -1)
            {
                if(hit_to_handles === 8)
                {
                    if(!group_selected_objects[i].canRotate())
                        return null;
                    return {objectId: this.group.drawingBase.id, cursorType: "crosshair"};
                }
                else
                {
                    if(!group_selected_objects[i].canResize())
                        return null;
                    var card_direction = group_selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    return {objectId: this.group.drawingBase.id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};

                }
            }
        }

        var hit_to_handles = this.group.hitToHandles(x, y);
        if(hit_to_handles > -1)
        {
            if(hit_to_handles === 8)
            {
                if(!this.group.canRotate())
                    return null;
                return {objectId: this.group.drawingBase.id, cursorType: "crosshair"};
            }
            else
            {
                var card_direction = this.group.getCardDirectionByNum(hit_to_handles);
                return {objectId: this.group.drawingBase.id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};
            }
        }


        for(i = group_selected_objects.length - 1; i  > -1; --i)
        {
            if(group_selected_objects[i].hitInBoundingRect(x, y))
            {
                this.drawingObjectsController.clearPreTrackObjects();
                for(var j = 0; j < group_selected_objects.length; ++j)
                {
                    this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
                }
                this.drawingObjectsController.changeCurrentState(new PreMoveInGroupState(this.drawingObjectsController, this.drawingObjects, this.group,
                    x, y, e.shiftKey, e.ctrlKey, group_selected_objects[i], true));
            }
        }

        if(this.group.hitInBoundingRect(x, y))
        {
            return {objectId: this.group.drawingBase.id, cursorType: "move"};
        }

        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(i = drawing_bases.length - 1; i > -1; --i)
        {
            var cur_drawing_base = drawing_bases[i];
            if(cur_drawing_base.isGraphicObject())
            {
                var cur_drawing = cur_drawing_base.graphicObject;
                if(cur_drawing.isSimpleObject())
                {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                    {
                        return {objectId: cur_drawing.drawingBase.id, cursorType: "move"};
                    }
                    else if(hit_in_text_rect)
                    {
                        //TODO
                    }
                }
                else
                {
                    if(this.group === cur_drawing)
                    {
                        var arr_graphic_objects = this.group.getArrGraphicObjects();
                        for(i = arr_graphic_objects.length - 1; i > -1; --i)
                        {
                            var cur_drawing = arr_graphic_objects[i];
                            var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                            var hit_in_path = cur_drawing.hitInPath(x, y);
                            var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                            if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                            {
                                return {objectId: this.group.drawingBase.id, cursorType: "move"};
                            }
                            else if(hit_in_text_rect)
                            {
                                //TODO
                            }
                        }
                    }
                    else
                    {
                        var grouped_objects = cur_drawing.getArrGraphicObjects();
                        for(var j = grouped_objects.length - 1; j > -1; --j)
                        {
                            var cur_grouped_object = grouped_objects[j];
                            var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                            var hit_in_path = cur_grouped_object.hitInPath(x, y);
                            var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                            if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                            {
                                return {objectId: cur_drawing.drawingBase.id, cursorType: "move"};
                            }
                            else if(hit_in_text_rect)
                            {
                                //TODO
                            }
                        }
                    }
                }
            }
        }

        return null;
    };
}


function PreMoveInGroupState(drawingObjectsController, drawingObjects, group, startX, startY, shiftKey, ctrlKey, majorObject,  majorObjectIsSelected)
{
    this.id = STATES_ID_PRE_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    this.shiftKey = shiftKey;
    this.ctrlKey = ctrlKey;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = majorObjectIsSelected;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        var track_objects = this.drawingObjectsController.getTrackObjects();
        var max_x, min_x, max_y, min_y;
        var cur_rect_bounds = track_objects[0].getOriginalBoundsRect();
        max_x = cur_rect_bounds.maxX;
        min_x = cur_rect_bounds.minX;
        max_y = cur_rect_bounds.maxY;
        min_y = cur_rect_bounds.minY;
        for(var i = 0; i < track_objects.length; ++i)
        {
            cur_rect_bounds = track_objects[i].getOriginalBoundsRect();
            if(max_x < cur_rect_bounds.maxX)
                max_x = cur_rect_bounds.maxX;
            if(min_x > cur_rect_bounds.minX)
                min_x = cur_rect_bounds.minX;
            if(max_y < cur_rect_bounds.maxY)
                max_y = cur_rect_bounds.maxY;
            if(min_y > cur_rect_bounds.minY)
                min_y = cur_rect_bounds.minY;
        }
        this.drawingObjectsController.changeCurrentState(new MoveInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.startX, this.startY, min_x, min_y, max_x - min_x, max_y - min_y))
        this.drawingObjectsController.onMouseMove(e, x, y);
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        if(this.shift || this.ctrl)
        {
            if(this.majorObjectIsSelected)
                this.majorObject.deselect(this.drawingObjectsController);
        }
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.drawingBase.id, cursorType: "move"};
    };
}

function MoveInGroupState(drawingObjectsController, drawingObjects, group, startX, startY, rectX, rectY, rectW, rectH)
{
    this.id = STATES_ID_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    this.rectX = rectX;
    this.rectY = rectY;
    this.rectW = rectW;
    this.rectH = rectH;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        var dx = x - this.startX;
        var dy = y - this.startY;
        var check_position = this.drawingObjects.checkGraphicObjectPosition(this.rectX + dx, this.rectY + dy, this.rectW, this.rectH);
        this.drawingObjectsController.trackMoveObjects(dx + check_position.x, dy + check_position.y);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.group.normalize();
        this.group.updateCoordinatesAfterInternalResize();
        this.group.recalculateTransform();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.showDrawingObjects(true);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));


    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.drawingBase.id, cursorType: "move"};
    };
}

function PreChangeAdjInGroupState(drawingObjectsController, drawingObjects, group)
{
    this.id = STATES_ID_PRE_CHANGE_ADJ_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjectsController.changeCurrentState(new ChangeAdjInGroupState(this.drawingObjectsController, this.drawingObjects, this.group))
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.drawingBase.id, cursorType: "crosshair"};
    };
}

function ChangeAdjInGroupState(drawingObjectsController, drawingObjects, group)
{
    this.id = STATES_ID_CHANGE_ADJ_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.drawingBase.id, cursorType: "crosshair"};
    };
}

function PreRotateInGroupState(drawingObjectsController, drawingObjects, group, majorObject)
{
    this.id = STATES_ID_PRE_ROTATE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new RotateInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.majorObject))
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.drawingBase.id, cursorType: "crosshair"};
    };
}

function RotateInGroupState(drawingObjectsController, drawingObjects, group, majorObject)
{
    this.id = STATES_ID_ROTATE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        var angle = this.majorObject.getRotateAngle(x, y);
        this.drawingObjectsController.rotateTrackObjects(angle, e);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.group.normalize();
        this.group.updateCoordinatesAfterInternalResize();
        this.group.recalculateTransform();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.drawingBase.id, cursorType: "crosshair"};
    };
}


function PreResizeInGroupState(drawingObjectsController, drawingObjects, group, majorObject, cardDirection)
{
    this.id = STATES_ID_PRE_RESIZE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ResizeInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.majorObject, this.majorObject.getNumByCardDirection(this.cardDirection), this.cardDirection))
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.drawingBase.id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]};
    };
}

function ResizeInGroupState(drawingObjectsController, drawingObjects, group, majorObject, handleNum, cardDirection)
{
    this.id = STATES_ID_RESIZE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.handleNum = handleNum;
    this.cardDirection = cardDirection;
    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, x, y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.group.normalize();
        this.group.updateCoordinatesAfterInternalResize();
        this.group.recalculateTransform();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.onKeyDown = function(e)
    {};

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.drawingBase.id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]};
    };
}

function SplineBezierState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_SPLINE_BEZIER;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function(e, x, y)
    {
        this.drawingObjectsController.clearTrackObjects();
        var spline = new Spline(this.drawingObjects);
        this.drawingObjectsController.addTrackObject(spline);
        spline.addPathCommand(new SplineCommandMoveTo(x, y));
        this.drawingObjectsController.changeCurrentState(new SplineBezierState33(this.drawingObjectsController, this.drawingObjects, x, y, spline));
        this.drawingObjectsController.resetSelection();
        this.drawingObjects.selectGraphicObject();
    };

    this.onMouseMove = function(e, x, y)
    {
    };

    this.onMouseUp = function(e, X, Y, pageIndex)
    {

        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();

    };

    this.onKeyDown = function(e)
    {

    };


    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}


function SplineBezierState33(drawingObjectsController, drawingObjects, startX, startY, spline)
{

    this.id = STATES_ID_SPLINE_BEZIER33;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;
    this.onMouseDown = function(e, x, y)
    {
    };

    this.onMouseMove = function(e, x, y)
    {
        if(this.startX === x && this.startY === y)
            return;
        this.spline.addPathCommand(new SplineCommandLineTo(x, y));
        this.drawingObjectsController.changeCurrentState(new SplineBezierState2(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, this.spline));
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function SplineBezierState2(drawingObjectsController, drawingObjects, startX, startY, spline)
{
    this.id = STATES_ID_SPLINE_BEZIER2;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;
    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount >= 2)
        {
            this.spline.createShape(null, this.drawingObjects);
            asc["editor"].asc_endAddShape();

            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.selectGraphicObject();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            asc["editor"].asc_endAddShape();

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        this.spline.path[1].changeLastPoint(x, y);
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new SplineBezierState3(this.drawingObjectsController, this.drawingObjects, x, y, this.spline));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function SplineBezierState3(drawingObjectsController, drawingObjects, startX, startY, spline)
{
    this.id = STATES_ID_SPLINE_BEZIER3;

    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.spline = spline;

    this.startX = startX;
    this.startY = startY;
    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount >= 2)
        {
            this.spline.createShape(this.drawingObjects);
            asc["editor"].asc_endAddShape();

            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.selectGraphicObject();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            asc["editor"].asc_endAddShape();

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(x === this.startX && y === this.startY)
        {
            return;
        }

        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        var spline = this.spline;
        x0 = spline.path[0].x;
        y0 = spline.path[0].y;
        x3 = spline.path[1].x;
        y3 = spline.path[1].y;
        x6 = x;
        y6 = y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;

        x2 = x3 - vx;
        y2 = y3 - vy;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x1 = (x0 + x2)*0.5;
        y1 = (y0 + y2)*0.5;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;


        spline.path.length = 1;
        spline.path.push(new SplineCommandBezier(x1, y1, x2, y2, x3, y3));
        spline.path.push(new SplineCommandBezier(x4, y4, x5, y5, x6, y6));
        this.drawingObjects.showOverlayGraphicObjects();
        this.drawingObjectsController.changeCurrentState(new SplineBezierState4(this.drawingObjectsController, this.drawingObjects, this.spline));
    };

    this.onMouseUp = function(e, x, y)
    {
       /* if(e.ClickCount >= 2)
        {
            this.spline.createShape(this.drawingObjects);
            asc["editor"].asc_endAddShape();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        }  */
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function SplineBezierState4(drawingObjectsController, drawingObjects, spline)
{
    this.id = STATES_ID_SPLINE_BEZIER4;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.spline = spline;
    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount >= 2)
        {
            this.spline.createShape(this.drawingObjects);
            asc["editor"].asc_endAddShape();

            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.selectGraphicObject();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            asc["editor"].asc_endAddShape();

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        var spline = this.spline;
        var lastCommand = spline.path[spline.path.length-1];
        var preLastCommand = spline.path[spline.path.length-2];
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        if(spline.path[spline.path.length-3].id == 0)
        {
            x0 = spline.path[spline.path.length-3].x;
            y0 = spline.path[spline.path.length-3].y;
        }
        else
        {
            x0 = spline.path[spline.path.length-3].x3;
            y0 = spline.path[spline.path.length-3].y3;
        }

        x3 = preLastCommand.x3;
        y3 = preLastCommand.y3;

        x6 = x;
        y6 = y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;

        x2 = x3 - vx;
        y2 = y3 - vy;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;

        if(spline.path[spline.path.length-3].id == 0)
        {
            preLastCommand.x1 = (x0 + x2)*0.5;
            preLastCommand.y1 = (y0 + y2)*0.5;
        }

        preLastCommand.x2 = x2;
        preLastCommand.y2 = y2;
        preLastCommand.x3 = x3;
        preLastCommand.y3 = y3;

        lastCommand.x1 = x4;
        lastCommand.y1 = y4;
        lastCommand.x2 = x5;
        lastCommand.y2 = y5;
        lastCommand.x3 = x6;
        lastCommand.y3 = y6;

        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        //if(e.ClickCount < 2 )
        {
            this.drawingObjectsController.changeCurrentState(new SplineBezierState5(this.drawingObjectsController, this.drawingObjects, x, y, this.spline));
        }
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function SplineBezierState5(drawingObjectsController, drawingObjects, startX, startY, spline)
{
    this.id = STATES_ID_SPLINE_BEZIER5;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;

    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount >= 2)
        {
            this.spline.createShape(this.drawingObjects);
            asc["editor"].asc_endAddShape();
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.selectGraphicObject();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            asc["editor"].asc_endAddShape();

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(x === this.startX && y === this.startY)
        {
            return;
        }
        var spline = this.spline;
        var lastCommand = spline.path[spline.path.length-1];
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;

        if(spline.path[spline.path.length-2].id == 0)
        {
            x0 = spline.path[spline.path.length-2].x;
            y0 = spline.path[spline.path.length-2].y;
        }
        else
        {
            x0 = spline.path[spline.path.length-2].x3;
            y0 = spline.path[spline.path.length-2].y3;
        }

        x3 = lastCommand.x3;
        y3 = lastCommand.y3;



        x6 = x;
        y6 = y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;


        x2 = x3 - vx;
        y2 = y3 - vy;

        x1 = (x2+x1)*0.5;
        y1 = (y2+y1)*0.5;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;

        if(spline.path[spline.path.length-2].id == 0)
        {
            lastCommand.x1 = x1;
            lastCommand.y1 = y1;
        }
        lastCommand.x2 = x2;
        lastCommand.y2 = y2;


        spline.path.push(new SplineCommandBezier(x4, y4, x5, y5, x6, y6));
        this.drawingObjects.showOverlayGraphicObjects();
        this.drawingObjectsController.changeCurrentState(new SplineBezierState4(this.drawingObjectsController, this.drawingObjects, this.spline));
    };

    this.onMouseUp = function(e, x, y)
    {
      /*  if(e.ClickCount >= 2)
        {
            this.spline.createShape(this.drawingObjects);
            asc["editor"].asc_endAddShape();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        }  */
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

//Состояния прия работе с полилиниями
function PolyLineAddState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_POLY_LINE_ADD;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function(e, x, y)
    {
        var polyline = new PolyLine(this.drawingObjects);
        polyline.arrPoint.push({x : x, y: y});
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.addTrackObject(polyline);
        this.drawingObjects.showOverlayGraphicObjects();

        var _min_distance = this.drawingObjects.convertMetric(1, 0, 3);
        this.drawingObjectsController.changeCurrentState(new PolyLineAddState2(this.drawingObjectsController, this.drawingObjects, _min_distance, polyline));
    };

    this.onMouseMove = function(e, x, y)
    {

    };
    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();

    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}


function PolyLineAddState2(drawingObjectsController, drawingObjects, minDistance, polyline)
{
    this.id = STATES_ID_POLY_LINE_ADD2;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.minDistance = minDistance;
    this.polyline = polyline;

    this.onMouseDown = function(e, x, y)
    {
    };
    this.onMouseMove = function(e, x, y)
    {
        var _last_point = this.polyline.arrPoint[this.polyline.arrPoint.length - 1];

        var dx = x - _last_point.x;
        var dy = y - _last_point.y;

        if(Math.sqrt(dx*dx + dy*dy) >= this.minDistance)
        {
            this.polyline.arrPoint.push({x : x, y : y});
            this.drawingObjects.showOverlayGraphicObjects();
        }
    };
    this.onMouseUp = function(e, x, y)
    {
        if(this.polyline.arrPoint.length > 1)
        {
            this.polyline.createShape();
        }

        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc["editor"].asc_endAddShape();


    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}



function AddPolyLine2State(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_ADD_PPOLY_LINE2;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function(e, x, y)
    {
        this.drawingObjectsController.resetSelection();
        this.drawingObjects.selectGraphicObject();

        var polyline = new PolyLine(this.drawingObjects);
        polyline.arrPoint.push({x : x, y: y});
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.addTrackObject(polyline);
        this.drawingObjectsController.changeCurrentState(new AddPolyLine2State2(this.drawingObjectsController, this.drawingObjects, x, y, polyline));
    };

    this.onMouseMove = function(AutoShapes, e, X, Y)
    {};

    this.onMouseUp = function(AutoShapes, e, X, Y)
    {
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}


function AddPolyLine2State2(drawingObjectsController, drawingObjects, x, y, polyline)
{
    this.id = STATES_ID_ADD_PPOLY_LINE22;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.X = x;
    this.Y = y;
    this.polyline = polyline;

    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount > 1)
        {
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            asc["editor"].asc_endAddShape();

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(this.X !== x || this.Y !== y)
        {
            this.polyline.arrPoint.push({x : x, y: y});
            this.drawingObjectsController.changeCurrentState(new AddPolyLine2State3(this.drawingObjectsController, this.drawingObjects, this.polyline));
        }
    };

    this.onMouseUp = function(e, x, y)
    {
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function AddPolyLine2State3(drawingObjectsController, drawingObjects, polyline)
{
    this.id = STATES_ID_ADD_PPOLY_LINE23;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.minDistance = this.drawingObjects.convertMetric(1, 0, 3);
    this.polyline = polyline;
    this.onMouseDown = function(e, x, y)
    {
        this.polyline.arrPoint.push({x: x, y: y});
        if(e.ClickCount > 1)
        {
            this.polyline.createShape();
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.selectGraphicObject();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            asc["editor"].asc_endAddShape();

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(e.which === 0)
        {
            this.polyline.arrPoint[this.polyline.arrPoint.length - 1] = {x: x, y: y};
        }
        else
        {
            var _last_point = this.polyline.arrPoint[this.polyline.arrPoint.length - 1];
            var dx = x - _last_point.x;
            var dy = y - _last_point.y;

            if(Math.sqrt(dx*dx + dy*dy) >= this.minDistance)
            {
                this.polyline.arrPoint.push({x: x, y: y});
            }
        }
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        /*if(e.ClickCount > 1)
        {

            var lt = this.graphicObjects.polyline.getLeftTopPoint();
            var near_pos =  this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if(false === editor.isViewMode && near_pos != null &&
                false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {Type : changestype_2_Element_and_Type , Element : near_pos.Paragraph, CheckType : changestype_Paragraph_Content} ))
            {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.polyline.createShape(this.graphicObjects.document);
                this.graphicObjects.arrTrackObjects.length = 0;
                //   this.graphicObjects.resetSelection();
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.recalculateWrapPolygon();
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
            this.graphicObjects.polyline = null;
        } */
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {

    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}


function DrawDefaultSelection(drawingObjectsController, drawingDocument)
{
    var selected_objects = drawingObjectsController.selectedObjects;
    for(var i = 0; i < selected_objects.length; ++i)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, selected_objects[i].getTransform(), 0, 0, selected_objects[i].extX, selected_objects[i].extY, false/*, selected_objects[i].canRotate()TODO*/);
    }
    if(selected_objects.length === 1)
    {
        selected_objects[0].drawAdjustments(drawingDocument);
    }
}

function DrawGroupSelection(group, drawingDocument)
{
    drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, group.getTransform(), 0, 0, group.extX, group.extY, false/*, selected_objects[i].canRotate()TODO*/);
    var group_selected_objects = group.selectedObjects;
    for(var i = 0; i < group_selected_objects.length; ++i)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, group_selected_objects[i].getTransform(), 0, 0, group_selected_objects[i].extX, group_selected_objects[i].extY, false/*, selected_objects[i].canRotate()TODO*/)
    }
    if(group_selected_objects.length === 1)
    {
        group_selected_objects[0].drawAdjustments(drawingDocument);
    }
}






