/**
 * 
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-08-27 10:49:15
 * @version $Id$
 */

define(['utils/appFunc', 'utils/xhr', 'VM', 'GS', 'i18n!nls/lang', 'FD'], function(appFunc, xhr, VM, GS, i18n, FD) {

	var Ctrl = {
		clear: function() {
			appFunc.localData.remove('sid');
			appFunc.localData.remove('jid');
			appFunc.localData.remove('user');
			appFunc.localData.remove('historyMeeting');
			appFunc.localData.remove('createaCtrl_VMR');
			appFunc.localData.remove('topContacts');
			appFunc.localData.remove('personalContacts');
			appFunc.localData.remove('tenantContacts');
			appFunc.localData.remove('currentMeetingId');
			appFunc.localData.remove('myContacts');
		}
	}
	return Ctrl
});