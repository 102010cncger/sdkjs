/*
 *
 * (c) Copyright Ascensio System Limited 2010-2016
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7  3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7  3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/
"use strict";

/////////////////////////////////////////////////////////
//////////////        OPEN       ////////////////////////
/////////////////////////////////////////////////////////
asc_docs_api.prototype._OfflineAppDocumentStartLoad = function()
{
	this.asc_registerCallback('asc_onDocumentContentReady', function(){
		DesktopOfflineUpdateLocalName(editor);
	});
	
	History.UserSaveMode = true;
    window["AscDesktopEditor"]["LocalStartOpen"]();
};
asc_docs_api.prototype._OfflineAppDocumentEndLoad = function(_url, _data)
{
	g_oIdCounter.m_sUserId = window["AscDesktopEditor"]["CheckUserId"]();
	if (_data == "")
	{
		this.sendEvent("asc_onError", c_oAscError.ID.ConvertationError, c_oAscError.Level.Critical);
		return;
	}
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
	if (g_oDocumentUrls.documentUrl.indexOf("file:") != 0)
	{
		if (g_oDocumentUrls.documentUrl.indexOf("/") != 0)
			g_oDocumentUrls.documentUrl = "/" + g_oDocumentUrls.documentUrl;
		g_oDocumentUrls.documentUrl = "file://" + g_oDocumentUrls.documentUrl;
	}
	
    editor._OfflineAppDocumentEndLoad(_url, _data);
};

asc_docs_api.prototype.asc_setAdvancedOptions = function(idOption, option) 
{
	window["AscDesktopEditor"]["SetAdvancedOptions"]("" + option.asc_getCodePage());
};
asc_docs_api.prototype["asc_setAdvancedOptions"] = asc_docs_api.prototype.asc_setAdvancedOptions;

window["asc_initAdvancedOptions"] = function()
{	
	editor._onNeedParams(undefined);
};

/////////////////////////////////////////////////////////
//////////////        CHANGES       /////////////////////
/////////////////////////////////////////////////////////
CHistory.prototype.Reset_SavedIndex = function(IsUserSave)
{
	if (true === this.Is_UserSaveMode())
	{
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
CHistory.prototype.Have_Changes = function(IsNotUserSave, IsNoSavedNoModifyed)
{
	if (true === this.Is_UserSaveMode() && true !== IsNotUserSave)
	{
		if (-1 === this.Index && null === this.UserSavedIndex && false === this.ForceSave)
		{
			if (window["AscDesktopEditor"])
			{
				if (0 != window["AscDesktopEditor"]["LocalFileGetOpenChangesCount"]())
					return true;
				if (!window["AscDesktopEditor"]["LocalFileGetSaved"]() && IsNoSavedNoModifyed !== true)
					return true;
			}
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
asc_docs_api.prototype.SetDocumentModified = function(bValue)
{
    this.isDocumentModify = bValue;
    this.asc_fireCallback("asc_onDocumentModifiedChanged");

    if (undefined !== window["AscDesktopEditor"])
    {
        window["AscDesktopEditor"]["onDocumentModifiedChanged"](History ? History.Have_Changes(undefined, true) : bValue);
    }
};

asc_docs_api.prototype.asc_Save = function (isNoUserSave, isSaveAs)
{
    if (true !== isNoUserSave)
        this.IsUserSave = true;
	
	if (this.IsUserSave)
	{
		this.LastUserSavedIndex = History.UserSavedIndex;
	}

    if (true === this.canSave && !this.isLongAction())
	{
		var _isNaturalSave = this.IsUserSave;
		this.canSave = false;
		
		if (this.WordControl.m_oLogicDocument != null)
		{
			this.CoAuthoringApi.askSaveChanges(OnSave_Callback);
			
			if (this.CoAuthoringApi.onUnSaveLock)
				this.CoAuthoringApi.onUnSaveLock();
		}
		else
		{
			this.canSave = true;
		}
		
		if (_isNaturalSave === true)
			window["DesktopOfflineAppDocumentStartSave"](isSaveAs);
	}
};
window["DesktopOfflineAppDocumentStartSave"] = function(isSaveAs)
{
    editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	
	var _param = "";
	if (isSaveAs === true)
		_param += "saveas=true;";
	if (AscBrowser.isRetina)
		_param += "retina=true;";
	
	window["AscDesktopEditor"]["LocalFileSave"](_param);
};
window["DesktopOfflineAppDocumentEndSave"] = function(error)
{
	editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	if (error == 0)
		DesktopOfflineUpdateLocalName(editor);
	else
		History.UserSavedIndex = editor.LastUserSavedIndex;
	
	editor.UpdateInterfaceState();
	editor.LastUserSavedIndex = undefined;
	
	if (2 == error)
		editor.sendEvent("asc_onError", c_oAscError.ID.ConvertationError, c_oAscError.Level.NoCritical);
};
asc_docs_api.prototype.asc_DownloadAs = function(typeFile, bIsDownloadEvent) 
{
	this.asc_Save(false, true);
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

asc_docs_api.prototype["asc_addImage"] = asc_docs_api.prototype.asc_addImage;
asc_docs_api.prototype["AddImageUrl"] = asc_docs_api.prototype.AddImageUrl;
asc_docs_api.prototype["AddImage"] = asc_docs_api.prototype.AddImage;
asc_docs_api.prototype["asc_Save"] = asc_docs_api.prototype.asc_Save;
asc_docs_api.prototype["asc_DownloadAs"] = asc_docs_api.prototype.asc_DownloadAs;
asc_docs_api.prototype["asc_isOffline"] = asc_docs_api.prototype.asc_isOffline;
asc_docs_api.prototype["SetDocumentModified"] = asc_docs_api.prototype.SetDocumentModified;

window["DesktopOfflineAppDocumentAddImageEnd"] = function(url)
{
	if (url == "")
		return;
	var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](url);
	editor.AddImageUrlAction(g_oDocumentUrls.getImageUrl(_url));
};

window["on_editor_native_message"] = function(sCommand, sParam)
{
	if (!window.editor)
		return;
	
	if (sCommand == "save")
		editor.asc_Save();
	else if (sCommand == "saveAs")
		editor.asc_Save(false, true);
	else if (sCommand == "print")
		editor.asc_Print();
};