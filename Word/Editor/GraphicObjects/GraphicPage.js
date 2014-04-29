var DRAWING_ARRAY_TYPE_INLINE = 0x00;
var DRAWING_ARRAY_TYPE_BEHIND = 0x01;
var DRAWING_ARRAY_TYPE_WRAPPING = 0x02;
var DRAWING_ARRAY_TYPE_BEFORE = 0x03;

function CGraphicPage(pageIndex, graphicObjects)
{
    this.pageIndex = pageIndex;
    this.graphicObjects = graphicObjects;
    this.drawingDocument = editor.WordControl.m_oDrawingDocument;

    this.arrGraphicObjects = [];

    this.selectionInfo =
    {
        selectionArray: []
    };
    //массивы для отрисовки

    this.objectsMap = {};

    this.inlineObjects = [];
    this.behindDocObjects = [];
    this.wrappingObjects = [];
    this.beforeTextObjects = [];
    this.flowTables = [];


    this.hdrFtrPage = null;
    this.wrapManager = null;
    if(graphicObjects)
    {
        this.hdrFtrPage =  new CGraphicPage(pageIndex, null);
        this.wrapManager = new CWrapManager(this);
    }
}

CGraphicPage.prototype =
{
    addFloatTable: function(table)
    {
        for(var i = 0; i < this.flowTables.length; ++i)
        {
            if(this.flowTables[i] === table)
                return;
        }
        this.flowTables.push(table);
    },
    CheckRange: function(X0, Y0, X1, Y1, Y0sp, Y1Ssp, LeftField, RightField, HdrFtrRanges, docContent)
    {
        return this.wrapManager.checkRanges(X0, Y0, X1, Y1, Y0sp, Y1Ssp, LeftField, RightField, HdrFtrRanges, docContent);
    },

    removeFloatTableById: function(id)
    {
        for(var index = 0; index < this.flowTables.length; ++index)
        {
            if(this.flowTables[index].Id === id)
            {
                this.flowTables.splice(index, 1);
                return;
            }
        }
    },

    documentStatistics: function(Statistics)
    {
        var cur_array = this.inlineObjects.concat(this.behindDocObjects).concat(this.wrappingObjects).concat(this.beforeTextObjects);
        for(var i = 0; i < cur_array.length; ++i)
        {
            if(cur_array[i].documentStatistics)
                cur_array[i].documentStatistics(Statistics);
        }

    },



    getTableByXY: function(x, y, documentContent)
    {
        for(var index = this.flowTables.length -1; index > -1; --index)
        {
            if(this.flowTables[index].IsPointIn(x, y) && this.flowTables[index].Table.Parent === documentContent)
                return this.flowTables[index];
        }
        return null;
    },

    getObjectById: function(id, type)
    {
        if(!isNaN(type) && typeof type === "number")
        {
            var drawing_array;
            switch (type)
            {
                case DRAWING_ARRAY_TYPE_BEFORE:
                {
                    drawing_array = this.beforeTextObjects;
                    break;
                }
                case DRAWING_ARRAY_TYPE_BEHIND:
                {
                    drawing_array = this.behindDocObjects;
                    break;
                }
                case DRAWING_ARRAY_TYPE_INLINE:
                {
                    drawing_array = this.inlineObjects;
                    break;
                }
                case DRAWING_ARRAY_TYPE_WRAPPING:
                {
                    drawing_array = this.wrappingObjects;
                    break;
                }
            }
            if(Array.isArray(drawing_array))
            {
                for(var index = 0; index < drawing_array.length; ++index)
                    if(drawing_array[index].Get_Id() === id)
                        return drawing_array[index];
            }
        }
        else
        {
            drawing_array = this.beforeTextObjects;
            for(index = 0; index < drawing_array.length; ++index)
                if(drawing_array[index].Get_Id() === id)
                    return drawing_array[index];

            drawing_array = this.behindDocObjects;
            for(index = 0; index < drawing_array.length; ++index)
                if(drawing_array[index].Get_Id() === id)
                    return drawing_array[index];

            drawing_array = this.inlineObjects;
            for(index = 0; index < drawing_array.length; ++index)
                if(drawing_array[index].Get_Id() === id)
                    return drawing_array[index];

            drawing_array = this.wrappingObjects;
            for(index = 0; index < drawing_array.length; ++index)
                if(drawing_array[index].Get_Id() === id)
                    return drawing_array[index];
        }
        return null;
    },

    delObjectById: function(id, type)
    {
        if(!isNaN(type) && typeof type === "number")
        {
            var drawing_array;
            switch (type)
            {
                case DRAWING_ARRAY_TYPE_BEFORE:
                {
                    drawing_array = this.beforeTextObjects;
                    break;
                }
                case DRAWING_ARRAY_TYPE_BEHIND:
                {
                    drawing_array = this.behindDocObjects;
                    break;
                }
                case DRAWING_ARRAY_TYPE_INLINE:
                {
                    drawing_array = this.inlineObjects;
                    break;
                }
                case DRAWING_ARRAY_TYPE_WRAPPING:
                {
                    drawing_array = this.wrappingObjects;
                    break;
                }
            }
            if(Array.isArray(drawing_array))
            {
                for(var index = 0; index < drawing_array.length; ++index)
                    if(drawing_array[index].parent.Get_Id() === id)
                        return drawing_array.splice(index, 1);
            }
        }
        else
        {
            drawing_array = this.beforeTextObjects;
            for(index = 0; index < drawing_array.length; ++index)
                if(drawing_array[index].parent.Get_Id() === id)
                    return drawing_array.splice(index, 1);

            drawing_array = this.behindDocObjects;
            for(index = 0; index < drawing_array.length; ++index)
                if(drawing_array[index].parent.Get_Id() === id)
                    return drawing_array.splice(index, 1);

            drawing_array = this.inlineObjects;
            for(index = 0; index < drawing_array.length; ++index)
                if(drawing_array[index].parent.Get_Id() === id)
                    return drawing_array.splice(index, 1);

            drawing_array = this.wrappingObjects;
            for(index = 0; index < drawing_array.length; ++index)
                if(drawing_array[index].parent.Get_Id() === id)
                    return drawing_array.splice(index, 1);
        }
        return null;
    },

    resetDrawingArrays: function(docContent)
    {
        function findInArrayAndRemove(drawingArray, docContent, document)
        {
            if(docContent === document)
            {
                drawingArray.length = 0;
                return;
            }
            var b_is_top_doc = docContent.Is_TopDocument();
            for(var i = drawingArray.length-1; i > -1; --i)
            {
                if(!drawingArray[i].parent || drawingArray[i].parent.DocumentContent === docContent
                    || (b_is_top_doc && drawingArray[i].parent.DocumentContent.Is_TopDocument(true) === docContent))
                    drawingArray.splice(i, 1);
            }
        }
        function findTableInArrayAndRemove(drawingArray, docContent, document)
        {
            if(!docContent === document)
            {
                drawingArray.length = 0;
                return;
            }
            for(var i = drawingArray.length-1; i >-1; --i)
            {
                if(drawingArray[i].Table.Parent === docContent)
                    drawingArray.splice(i, 1);
            }
        }

        function findInArrayAndRemoveFromDrawingPage(drawingPage, docContent, document)
        {
            if(!drawingPage)
                return;
            if(Array.isArray(drawingPage.inlineObjects))
            {
                findInArrayAndRemove(drawingPage.inlineObjects, docContent, document);
                findInArrayAndRemove(drawingPage.behindDocObjects, docContent, document);
                findInArrayAndRemove(drawingPage.wrappingObjects, docContent, document);
                findInArrayAndRemove(drawingPage.beforeTextObjects, docContent, document);
                findTableInArrayAndRemove(drawingPage.flowTables, docContent, document);
            }
            else if(Array.isArray(drawingPage.inlineArray))
            {
                findInArrayAndRemove(drawingPage.inlineArray, docContent, document);
                findInArrayAndRemove(drawingPage.behindDocArray, docContent, document);
                findInArrayAndRemove(drawingPage.wrappingArray, docContent, document);
                findInArrayAndRemove(drawingPage.beforeTextArray, docContent, document);
                findTableInArrayAndRemove(drawingPage.floatTables, docContent, document);
            }
        }

        if(!isRealObject(docContent))
            docContent = this.graphicObjects.document;

        findInArrayAndRemoveFromDrawingPage(this, docContent, editor.WordControl.m_oLogicDocument);
    },

    draw: function(graphics)
    {
        for(var _object_index = 0; _object_index < this.inlineObjects.length; ++_object_index)
            this.inlineObjects[_object_index].draw(graphics);

        for(_object_index = 0; _object_index < this.wrappingObjects.length; ++_object_index)
            this.wrappingObjects[_object_index].draw(graphics);

        for(_object_index = 0; _object_index < this.beforeTextObjects.length; ++_object_index)
            this.beforeTextObjects[_object_index].draw(graphics);
        for(_object_index = 0; _object_index < this.behindDocObjects.length; ++_object_index)
            this.behindDocObjects[_object_index].draw(graphics);
    },

    drawSelect: function()
    {
        var _graphic_objects = this.selectionInfo.selectionArray;
        var _object_index;
        var _objects_count = _graphic_objects.length;
        var _graphic_object;
        for(_object_index = 0; _object_index < _objects_count; ++_object_index)
        {
            _graphic_object = _graphic_objects[_object_index].graphicObject;
            var _transform = _graphic_object.getTransformMatrix();
            if(_transform === null)
                _transform = new CMatrix();

            var _extensions = _graphic_object.getExtensions();
            if(_extensions === null)
                _extensions = {extX: 0, extY: 0};


            this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE , _transform, 0, 0, _extensions.extX, _extensions.extY, /*shape.geometry ? shape.geometry.preset == "line"  : false*/false);
        }
    },

    selectionCheck: function(x, y)
    {

    },

    documentSearch: function(String, search_Common)
    {
        var search_array = [];
        search_array= search_array.concat(this.behindDocObjects);
        search_array= search_array.concat(this.wrappingObjects);
        search_array= search_array.concat(this.inlineObjects);
        search_array= search_array.concat(this.beforeTextObjects);

        for(var i = 0; i < search_array.length; ++i)
        {
            if(search_array[i].documentSearch)
                search_array[i].documentSearch(String, search_Common);
        }

    },

    addGraphicObject: function(graphicObject)
    {
        switch (graphicObject.getDrawingArrayType())
        {
            case DRAWING_ARRAY_TYPE_INLINE:
            {
                this.inlineObjects.push(graphicObject);
                break;
            }
            case DRAWING_ARRAY_TYPE_BEHIND:
            {
                this.behindDocObjects.push(graphicObject);
                this.behindDocObjects.sort(ComparisonByZIndexSimpleParent);
                break;
            }
            case DRAWING_ARRAY_TYPE_WRAPPING:
            {
                this.wrappingObjects.push(graphicObject);
                this.wrappingObjects.sort(ComparisonByZIndexSimpleParent);
                break;
            }
            case DRAWING_ARRAY_TYPE_BEFORE:
            {
                this.beforeTextObjects.push(graphicObject);
                this.beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
                break;
            }
        }
    },

    sortDrawingArrays: function()
    {
        this.behindDocObjects.sort(ComparisonByZIndexSimpleParent);
        this.wrappingObjects.sort(ComparisonByZIndexSimpleParent);
        this.beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
    },

    drawBehindDoc: function(graphics)
    {
        for(var _object_index = 0; _object_index < this.behindDocObjects.length; ++_object_index)
            this.behindDocObjects[_object_index].draw(graphics);

        graphics.SetIntegerGrid(true);
    },

    drawWrappingObjects: function(graphics)
    {
        for(var _object_index = 0; _object_index < this.wrappingObjects.length; ++_object_index)
            this.wrappingObjects[_object_index].draw(graphics);

        graphics.SetIntegerGrid(true);
    },


    drawBeforeObjects: function(graphics)
    {
        for(var _object_index = 0; _object_index < this.beforeTextObjects.length; ++_object_index)
            this.beforeTextObjects[_object_index].draw(graphics);

        graphics.SetIntegerGrid(true);
    },

    drawInlineObjects: function(graphics)
    {
        for(var _object_index = 0; _object_index < this.inlineObjects.length; ++_object_index)
            this.inlineObjects[_object_index].draw(graphics);

        graphics.SetIntegerGrid(true);
    }
};


function ComparisonByZIndex(grObj1, grObj2)
{
    if(grObj1 !== null && grObj2 !== null
        && typeof grObj1 === "object" && typeof grObj2 === "object" )
    {
        if(typeof grObj1.RelativeHeight === "number" && typeof grObj2.RelativeHeight === "number")
            return grObj1.RelativeHeight - grObj2.RelativeHeight;
    }
    return 0;
}