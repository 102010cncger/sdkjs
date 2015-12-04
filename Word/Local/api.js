"use strict";

/////////////////////////////////////////////////////////
//////////////        OPEN       ////////////////////////
/////////////////////////////////////////////////////////
asc_docs_api.prototype._OfflineAppDocumentStartLoad = function()
{
	History.UserSaveMode = true;
    window["AscDesktopEditor"]["LocalStartOpen"]();
};
asc_docs_api.prototype._OfflineAppDocumentEndLoad = function(_url, _data)
{
    if (c_oSerFormat.Signature !== _data.substring(0, c_oSerFormat.Signature.length))
	{
		this.OpenDocument(_url, _data);
	}
    else
	{
		this.OpenDocument2(_url, _data);
		this.WordControl.m_oLogicDocument.Set_FastCollaborativeEditing(false);
	}
	DesktopOfflineUpdateLocalName(this);
};
window["DesktopOfflineAppDocumentEndLoad"] = function(_url, _data)
{
    g_oDocumentUrls.documentUrl = _url;
    editor._OfflineAppDocumentEndLoad(_url, _data);
};

/////////////////////////////////////////////////////////
//////////////        CHANGES       /////////////////////
/////////////////////////////////////////////////////////
CHistory.prototype.Reset_SavedIndex = function(IsUserSave)
{
	if (true === this.Is_UserSaveMode())
	{
		if (this.Index == -1)
			return;
		this.SavedIndex = this.Index;
		if (true === IsUserSave)
		{
			this.UserSavedIndex = this.Index;
			this.ForceSave      = false;
		}
	}
	else
	{
		this.SavedIndex = this.Index;
		this.ForceSave  = false;
	}
};
CHistory.prototype.Have_Changes = function(IsUserSave)
{
	if (true === this.Is_UserSaveMode() && false !== IsUserSave)
	{
		if (-1 === this.Index && null === this.UserSavedIndex && false === this.ForceSave)
		{
			if (0 != window["AscDesktopEditor"]["LocalFileGetOpenChangesCount"]())
				return true;
			if (!window["AscDesktopEditor"]["LocalFileGetSaved"]())
				return true;
			return false;
		}

		if (this.Index != this.UserSavedIndex || true === this.ForceSave)
			return true;

		return false;
	}
	else
	{
		if (-1 === this.Index && null === this.SavedIndex && false === this.ForceSave)
			return false;

		if (this.Index != this.SavedIndex || true === this.ForceSave)
			return true;

		return false;
	}
};
	
window["DesktopOfflineAppDocumentApplyChanges"] = function(_changes)
{
	editor._coAuthoringSetChanges(_changes, new CDocumentColor( 191, 255, 199 ));
    //editor["asc_nativeApplyChanges"](_changes);
	//editor["asc_nativeCalculateFile"]();
};

/////////////////////////////////////////////////////////
////////////////        SAVE       //////////////////////
/////////////////////////////////////////////////////////
asc_docs_api.prototype.asc_Save = function (isNoUserSave)
{
    if (true !== isNoUserSave)
        this.IsUserSave = true;

    if (true === this.canSave && !this.asc_IsLongAction())
	{
		var _isNaturalSave = this.IsUserSave;
		this.canSave = false;
		this.CoAuthoringApi.askSaveChanges(OnSave_Callback);
		
		if (this.CoAuthoringApi.onUnSaveLock)
			this.CoAuthoringApi.onUnSaveLock();
		
		if (_isNaturalSave === true)
			window["DesktopOfflineAppDocumentStartSave"]();
	}
};
window["DesktopOfflineAppDocumentStartSave"] = function()
{
    editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	window["AscDesktopEditor"]["LocalFileSave"]();
};
window["DesktopOfflineAppDocumentEndSave"] = function(isCancel)
{
	editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	if (isCancel !== true)
		DesktopOfflineUpdateLocalName(editor);
};

asc_docs_api.prototype.AddImageUrl = function(url, imgProp)
{
	var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
	this.AddImageUrlAction(g_oDocumentUrls.getImageUrl(_url), imgProp);
};
asc_docs_api.prototype.AddImage = function()
{
	window["AscDesktopEditor"]["LocalFileGetImageUrlFromOpenFileDialog"]();
};
asc_docs_api.prototype.asc_addImage = function()
{
  window["AscDesktopEditor"]["LocalFileGetImageUrlFromOpenFileDialog"]();
};
asc_docs_api.prototype.asc_isOffline = function()
{
	return true;
};
asc_docs_api.prototype["AddImageUrl"] = asc_docs_api.prototype.AddImageUrl;
asc_docs_api.prototype["AddImage"] = asc_docs_api.prototype.AddImage;
asc_docs_api.prototype["asc_Save"] = asc_docs_api.prototype.asc_Save;
asc_docs_api.prototype["asc_isOffline"] = asc_docs_api.prototype.asc_isOffline;

window["DesktopOfflineAppDocumentAddImageEnd"] = function(url)
{
	if (url == "")
		return;
	var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
	editor.AddImageUrlAction(g_oDocumentUrls.getImageUrl(_url));
};