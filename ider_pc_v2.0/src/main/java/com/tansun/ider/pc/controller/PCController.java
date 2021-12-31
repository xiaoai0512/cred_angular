package com.tansun.ider.pc.controller;

import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;

/**
 *
 * 代理服务接入入口
 *
 * @author pg
 * @since JDK 1.8
 */

@Controller
@ResponseBody
@CrossOrigin
public class PCController {
    private static Logger logger = LoggerFactory.getLogger(PCController.class);

    @Value("${webapp.service.creditauditService.addr}")
    private String servicecreditaudit;
    @Value("${webapp.service.unfinance.addr}")
    private String serviceUnfinanceAddr;
    @Value("${webapp.service.auth.addr}")
    private String serviceAuthAddr;
    @Value("${webapp.service.card.addr}")
    private String serviceCardAddr;
    @Value("${webapp.service.beta.addr}")
    private String parameterAddr;
    @Value("${webapp.service.unionloan.addr}")
    private String serviceLoanAddr;
    @Value("${webapp.service.cardForSomeBatch.addr}")
    private String serviceCardForSomeBatchAddr;
    @Value("${webapp.service.clea.addr}")
    private String cleaAddr;
    @Value("${webapp.service.gwcups.addr}")
    private String gwCupsAddr;
    @Value("${webapp.service.gwvisa.addr}")
    private String gwVisaAddr;
    @Value("${webapp.service.gwmc.addr}")
    private String gwMcAddr;
    @Value("${webapp.service.gwjcb.addr}")
    private String gwJcbAddr;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private HttpServletResponse response;

    @RequestMapping(value = "/creditauditService/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object creditauditService(@PathVariable("eventId") String eventId, @RequestHeader Map<String, Object> headerMap,
			@RequestBody(required = true) Map<String, Object> bodyMap) {
    	return callService(servicecreditaudit, eventId, headerMap, bodyMap);
    }

    @RequestMapping(value = "/unionloanService/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object unionloanService(@PathVariable String eventId, @RequestHeader Map<String, Object> headerMap,
                                   @RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(serviceLoanAddr, eventId, headerMap, bodyMap);
    }


    @RequestMapping(value = "/nonfinanceService/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object unfinanceService(@PathVariable("eventId") String eventId, @RequestHeader Map<String, Object> headerMap,
			@RequestBody(required = true) Map<String, Object> bodyMap) {
    	return callService(serviceUnfinanceAddr, eventId, headerMap, bodyMap);
    }

    @RequestMapping(value = "/authService/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object authService(@PathVariable("eventId") String eventId, @RequestHeader Map<String, Object> headerMap,
			@RequestBody(required = true) Map<String, Object> bodyMap) {
    	return callService(serviceAuthAddr, eventId, headerMap, bodyMap);
    }

    @RequestMapping(value = "/cardService/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object cardService(@PathVariable("eventId") String eventId, @RequestHeader Map<String, Object> headerMap,
			@RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(serviceCardAddr, eventId, headerMap, bodyMap);
    }

    @RequestMapping(value = "/cardForSomeBatch/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object cardForSomeBatch(@PathVariable("eventId") String eventId, @RequestHeader Map<String, Object> headerMap,
			@RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(serviceCardForSomeBatchAddr, eventId, headerMap, bodyMap);
    }

    @RequestMapping(value = "/betaService/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object betaService(@PathVariable("eventId") String eventId, @RequestHeader Map<String, Object> headerMap,
			@RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(parameterAddr, eventId, headerMap, bodyMap);
    }
    @RequestMapping(value = "/clearService/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object clearService(@PathVariable("eventId") String eventId, @RequestHeader Map<String, Object> headerMap,
            @RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(cleaAddr, eventId, headerMap, bodyMap);
    }
    @RequestMapping(value = "/gwCups/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object gwCupsService(@PathVariable String eventId, @RequestHeader Map<String, Object> headerMap,
            @RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(gwCupsAddr, eventId, headerMap, bodyMap);
    }
    @RequestMapping(value = "/gwVisa/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object gwVisaService(@PathVariable String eventId, @RequestHeader Map<String, Object> headerMap,
            @RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(gwVisaAddr, eventId, headerMap, bodyMap);
    }
    @RequestMapping(value = "/gwMc/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object gwMcService(@PathVariable String eventId, @RequestHeader Map<String, Object> headerMap,
            @RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(gwMcAddr, eventId, headerMap, bodyMap);
    }
    @RequestMapping(value = "/gwJcb/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object gwJcbService(@PathVariable String eventId, @RequestHeader Map<String, Object> headerMap,
            @RequestBody(required = true) Map<String, Object> bodyMap) {
        return callService(gwJcbAddr, eventId, headerMap, bodyMap);
    }
    /**
     *
     * @方法名称 			rvlDbtTxnSplmtEntrgService
     * @方法描述 			<pre>循环借记交易补录,做分发</pre>
     * @作者 				chenyinliao@tansun.com.cn
     * @创建时间 			2018年6月6日  下午4:56:52
     *
     * @param eventId
     * @param headerMap
     * @param bodyMap
     * @return
     */
    @RequestMapping(value = "/rvlDbtTxnSplmtEntrgService/{eventId:.+}", method = RequestMethod.POST, produces = "application/json;charset=utf-8;")
    public Object rvlDbtTxnSplmtEntrgService(@PathVariable("eventId") String eventId, @RequestHeader Map<String, Object> headerMap,
			@RequestBody(required = true) Map<String, Object> bodyMap) {
    	String ecommEventId = (String) bodyMap.get("ecommEventId");														//事件ID

        return callService(serviceCardAddr, ecommEventId, headerMap, bodyMap);
    }


    // 请求后端服务
    private Object callService(String serviceAddr, String eventId, Map<String, Object> headerMap,
    		Map<String, Object> bodyMap) {
        if (logger.isDebugEnabled()){
            logger.debug("Request Data [{}]=>{}", serviceAddr + eventId, JSON.toJSONString(bodyMap));
        }
    	HttpHeaders headers = new HttpHeaders();
    	for (Enumeration<String> e = request.getHeaderNames(); e.hasMoreElements();) {
    		String key = e.nextElement();
    		String value = request.getHeader(key);
    		headers.add(key, value);
    	}
    	HttpEntity<Map<String, Object>> request = new HttpEntity<>(bodyMap, headers);
    	ResponseEntity<Object> responseEntity = restTemplate.postForEntity(serviceAddr + eventId, request,
    			Object.class);
    	Object object = responseEntity.getBody();
//    	HttpHeaders headResp = responseEntity.getHeaders();
//    	Set<Map.Entry<String, List<String>>> setHead = headResp.entrySet();
//    	for (Entry<String, List<String>> entry : setHead) {
//    		response.setHeader(entry.getKey(), entry.getValue().get(0));
//    	}
        if (logger.isDebugEnabled()) {
            logger.debug("Response Data [{}]=>{}", serviceAddr + eventId, JSON.toJSONString(object));
        }
    	return object;
    }
}
