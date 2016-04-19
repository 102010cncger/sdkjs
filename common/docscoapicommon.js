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

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
  function(window, undefined) {
  /**
   * Класс user для совместного редактирования/просмотра документа
   * -----------------------------------------------------------------------------
   *
   * @constructor
   * @memberOf Asc
   */
  function asc_CUser(val) {
    this.id = null;					// уникальный id - пользователя
    this.idOriginal = null;	// уникальный id - пользователя
    this.userName = null;		// имя пользователя
    this.state = undefined;	// состояние (true - подключен, false - отключился)
    this.indexUser = -1;		// Индекс пользователя (фактически равно числу заходов в документ на сервере)
    this.color = null;			// цвет пользователя
    this.view = false;			// просмотр(true), редактор(false)

    this._setUser(val);
    return this;
  }

  asc_CUser.prototype._setUser = function(val) {
    if (val) {
      this.id = val['id'];
      this.idOriginal = val['idOriginal'];
      this.userName = val['username'];
      this.indexUser = val['indexUser'];
      this.color = AscCommon.getUserColorById(this.idOriginal, this.userName, false, true);
      this.view = val['view'];
    }
  };
  asc_CUser.prototype.asc_getId = function() {
    return this.id;
  };
  asc_CUser.prototype.asc_getUserName = function() {
    return this.userName;
  };
  asc_CUser.prototype.asc_getState = function() {
    return this.state;
  };
  asc_CUser.prototype.asc_getColor = function() {
    return '#' + ('000000' + this.color.toString(16)).substr(-6);
  };
  asc_CUser.prototype.asc_getView = function() {
    return this.view;
  };
  asc_CUser.prototype.setId = function(val) {
    this.id = val;
  };
  asc_CUser.prototype.setUserName = function(val) {
    this.userName = val;
  };
  asc_CUser.prototype.setState = function(val) {
    this.state = val;
  };

  var ConnectionState = {
    Reconnect: -1,	// reconnect state
    None: 0,	// not initialized
    WaitAuth: 1,	// waiting session id
    Authorized: 2,	// authorized
    ClosedCoAuth: 3,	// closed coauthoring
    ClosedAll: 4,	// closed all

    SaveChanges: 10		// save
  };

  var c_oEditorId = {
    Word:0,
    Spreadsheet:1,
    Presentation:2
  };

  /*
   * Export
   * -----------------------------------------------------------------------------
   */
  var prot;
  window['AscCommon'] = window['AscCommon'] || {};
  window["AscCommon"].asc_CUser = asc_CUser;
  prot = asc_CUser.prototype;
  prot["asc_getId"] = prot.asc_getId;
  prot["asc_getUserName"] = prot.asc_getUserName;
  prot["asc_getState"] = prot.asc_getState;
  prot["asc_getColor"] = prot.asc_getColor;
  prot["asc_getView"] = prot.asc_getView;

  window["AscCommon"].ConnectionState = ConnectionState;
  window["AscCommon"].c_oEditorId = c_oEditorId;
})(window);
