/**
 * interceptor.js - HTTP请求拦截框架（示例）
 * 
 * 用于拦截和分析APP的网络请求
 * 注意：此为框架代码，不含实际Hook实现
 */

const RequestInterceptor = {
    
    // 拦截配置
    config: {
        targetHost: "api.*.com",
        logLevel: "INFO",       // DEBUG | INFO | WARN | ERROR
        captureBody: true,
        captureHeaders: true,
        outputFormat: "json"    // json | text | pcap
    },

    // 初始化拦截器
    init: function() {
        console.log("[Interceptor] Initializing...");
        this._setupProxy();
        this._hookNetwork();
        console.log("[Interceptor] Ready.");
    },

    // 配置代理
    _setupProxy: function() {
        // TODO: 根据环境配置代理方式
        // 支持: 系统代理 / VPN模式 / iptables转发
        throw new Error("Implementation not included in public release");
    },

    // Hook网络层
    _hookNetwork: function() {
        // Hook点:
        // 1. OkHttp3.RealCall.execute()
        // 2. OkHttp3.RealCall.enqueue()  
        // 3. HttpURLConnection.connect()
        // 4. WebSocket.send()
        throw new Error("Implementation not included in public release");
    },

    // 请求回调
    onRequest: function(request) {
        var info = {
            method: request.method,
            url: request.url,
            timestamp: Date.now(),
            headers: this.config.captureHeaders ? request.headers : "[filtered]",
            body: this.config.captureBody ? request.body : "[filtered]"
        };
        
        this._log("REQUEST", info);
        return info;
    },

    // 响应回调
    onResponse: function(response) {
        var info = {
            statusCode: response.code,
            url: response.request.url,
            latency: response.receivedAt - response.sentAt,
            headers: response.headers,
            body: response.body
        };
        
        this._log("RESPONSE", info);
        return info;
    },

    // 日志输出
    _log: function(type, data) {
        if (this.config.outputFormat === "json") {
            console.log(JSON.stringify({type: type, data: data}, null, 2));
        } else {
            console.log("[" + type + "] " + data.url);
        }
    }
};

// 导出
module.exports = RequestInterceptor;
