'use strict';
define(function(require) {
	require('tansun-dependent') ;
	
	Tansun.directive('jfPermission',function($q,$injector,$compile){
		var jfRest = $injector.get('jfRest');
		var resource = Tansun.resource.permission.split('.');
		var permissionResource = jfRest.request(resource[0],resource[1],{}) ;
		return {
			restrict: 'A',
			priority: 1,
			link: function(scope, element, attrs){
				var jfPermission = attrs.jfPermission || '';
				
				$q.when(permissionResource).then(function(data){
					var result = data.data ;
					
					var permitted = [] ;
					var permission = [] ;
		    		if(angular.isArray(result)){
		    			permitted = result ;
		    			permission = result ;
		    		}else if(angular.isObject(result)){
		    			permitted = result.permitted ;
		    			permission = result.permission ;
		    		}else{
		    			return ;
		    		}
		    		if(permission && permission.length <= 0){
		    			return ;
		    		}
		    		if(permission.indexOf(jfPermission) == -1){
		    			return ;
		    		}
		    		if(permitted && permitted.indexOf(jfPermission) > -1){
		    			return ;
		    		}
		    		
		    		element.remove();
		    	}) ;
				
				$q.when(Tansun.permission).then() ;
			}
		}
	}) ;
	
	Tansun.directive('jfCfca',function($q,$injector,$compile,jfLayer,jfGlobal){
		return {
			restrict: 'A',
			priority: 1,
			link: function(scope, element, attrs){
				var $scope = scope.$new(false) ;
	        	$scope.cfca = scope.$eval(attrs.jfCfca) || {};
                var eDiv = document.createElement("div");
                if (navigator.appName.indexOf("Internet") >= 0 || navigator.appVersion.indexOf("Trident") >= 0) {
                	var url=jfGlobal.ctx+"/js/libs/cfca/";
                    if (window.navigator.cpuClass == "x86") {
                        eDiv.innerHTML = "<object id=\"CryptoAgent\" codebase="+url+"CryptoKit.Paperless.x86.cab classid=\"clsid:B64B695B-348D-400D-8D58-9AAB1DA5851A\" ></object>";
                    }
                    else {
                        eDiv.innerHTML = "<object id=\"CryptoAgent\" codebase="+url+"\"CryptoKit.Paperless.x64.cab\" classid=\"clsid:8BF7E683-630E-4B59-9E61-C996B671EBDF\" ></object>";
                    }
                }
                else {
                    eDiv.innerHTML = "<embed id=\"CryptoAgent\" type="+url+"\"application/npCryptoKit.Paperless.x86\" style=\"height: 0px; width: 0px\">";
                }
                document.body.appendChild(eDiv);
	            scope.CryptoAgent =document.getElementById("CryptoAgent");
	            $scope.signResult={};
				element.on('click',function(){
	                var subjectDNFilter = $("#SubjectDNFilter").val();
	                var issuerDNFilter =$("#IssuerDNFilter").val(); 
	                var serialNumFilter = $("#SerialNumFilter").val();
	                var cspName =$("#CSPNameFilter").val(); 
	                try {
		                var  bSelectCertResult = scope.CryptoAgent.SelectCertificate(subjectDNFilter, issuerDNFilter, serialNumFilter, cspName);
		                // bSelectCertResult执行结果为true时成功，false
		                if (bSelectCertResult) {
		                	//返回证书签名结果
		                	$scope.signResult.CertContent=scope.CryptoAgent.GetSignCertInfo("CertContent");
		                	//证书主题
		                	$scope.signResult.SubjectDN=scope.CryptoAgent.GetSignCertInfo("SubjectDN");
		                	//颁发者主题
		                	$scope.signResult.SubjectCN=scope.CryptoAgent.GetSignCertInfo("SubjectCN");
		                	//序列号
		                	$scope.signResult.SerialNumber=scope.CryptoAgent.GetSignCertInfo("SerialNumber");
		                	$scope.signResult.CSPName=scope.CryptoAgent.GetSignCertInfo("CSPName");
		                	//证书类型
		                	$scope.signResult.CertType=scope.CryptoAgent.GetSignCertInfo("CertType");
		                	$scope.signResult.Issuer=scope.CryptoAgent.GetSignCertInfo("Issuer");
		                	//签名认证
		                	if($scope.cfca.sign==true){
		                		var  signature = scope.CryptoAgent.SignMsgPKCS7($scope.signResult.CertContent, "SHA-1", true);
		                         if (!signature) {
		                             var errorDesc = scope.CryptoAgent.GetLastErrorDesc();
		                             jfLayer.alert(errorDesc);
		                             return;
		                         }
		                		$scope.signResult.CertContent
		                	}
		                }else{
		                	var errorDesc = scope.CryptoAgent.GetLastErrorDesc();
		                	jfLayer.alert(errorDesc);
		                    return;
		                }
		                if($scope.cfca.callback){
		                	$scope.cfca.callback($scope.signResult);
		                }
	                } catch (e) {
	                    var errorDesc = scope.CryptoAgent.GetLastErrorDesc();
	                    jfLayer.alert(errorDesc);

	                }
				});
			}
		}
	}) ;
});