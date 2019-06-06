window.basePath = '../../';
window.pageConfig = {
	"token" : $("meta[name='_csrf']").attr("content"),	//token头验证
	"ajaxUrl" : {	//页面所有的ajax请求url
		"activeUserNumber" : activeUserNumber,
		"activeFlower": activeUserNumber,
		"allRateKqi" : allRateKqi,
		"alertInformation": alertInformation,
		"importantKqi": importantKqi,
		"importantaffectedUserNum" : importantaffectedUserNum,
		"importantaffectedWorkOrder" : importantaffectedWorkOrder,
		"allNetAlertInformation": allNetAlertInformation,
		"keySceneSceneUserNum": sceneUserNum,
		"keySceneChildSceneUserNum": childSceneUserNum,
		"netElementTop3UserNum": top3UserNum,
		"keySceneSpUserNum": spUserNum,
		"keySceneProtocalUserNum": protocalUserNum,
		"alarmNum": alarmNum
	},
	"imgUrl" : {
		
	}
}
