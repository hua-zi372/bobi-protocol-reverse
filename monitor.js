/**
 * monitor.js - 实时流量监控工具
 * 
 * 监控APP网络请求的频率、延迟、错误率等指标
 * 示例代码，不含敏感逻辑
 */

const TrafficMonitor = {

    stats: {
        totalRequests: 0,
        successCount: 0,
        failCount: 0,
        avgLatency: 0,
        startTime: 0,
        endpoints: {}
    },

    start: function() {
        this.stats.startTime = Date.now();
        console.log("[Monitor] Traffic monitoring started");
        console.log("[Monitor] Press Ctrl+C to stop and show report");
    },

    // 记录请求
    record: function(url, statusCode, latency) {
        this.stats.totalRequests++;
        
        if (statusCode >= 200 && statusCode < 300) {
            this.stats.successCount++;
        } else {
            this.stats.failCount++;
        }

        // 更新平均延迟
        this.stats.avgLatency = (
            (this.stats.avgLatency * (this.stats.totalRequests - 1) + latency) 
            / this.stats.totalRequests
        );

        // 按接口统计
        var path = this._extractPath(url);
        if (!this.stats.endpoints[path]) {
            this.stats.endpoints[path] = { count: 0, avgLatency: 0, errors: 0 };
        }
        var ep = this.stats.endpoints[path];
        ep.avgLatency = (ep.avgLatency * ep.count + latency) / (ep.count + 1);
        ep.count++;
        if (statusCode >= 400) ep.errors++;
    },

    // 生成报告
    report: function() {
        var duration = (Date.now() - this.stats.startTime) / 1000;
        var rps = this.stats.totalRequests / duration;
        
        console.log("\n========== Traffic Report ==========");
        console.log("Duration:       " + duration.toFixed(1) + "s");
        console.log("Total Requests: " + this.stats.totalRequests);
        console.log("Success:        " + this.stats.successCount);
        console.log("Failed:         " + this.stats.failCount);
        console.log("Success Rate:   " + (this.stats.successCount / this.stats.totalRequests * 100).toFixed(1) + "%");
        console.log("Avg Latency:    " + this.stats.avgLatency.toFixed(0) + "ms");
        console.log("RPS:            " + rps.toFixed(1));
        console.log("\n--- Top Endpoints ---");
        
        var endpoints = this.stats.endpoints;
        var paths = Object.keys(endpoints).sort(function(a, b) {
            return endpoints[b].count - endpoints[a].count;
        });
        
        for (var i = 0; i < Math.min(paths.length, 10); i++) {
            var p = paths[i];
            var ep = endpoints[p];
            console.log(
                ep.count + "x | " + ep.avgLatency.toFixed(0) + "ms | " +
                ep.errors + " err | " + p
            );
        }
        console.log("====================================\n");
    },

    _extractPath: function(url) {
        try {
            return url.replace(/https?:\/\/[^\/]+/, "").split("?")[0];
        } catch(e) {
            return url;
        }
    }
};

module.exports = TrafficMonitor;
