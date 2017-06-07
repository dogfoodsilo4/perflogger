/*
 * PerfLogger
 * Copyright 2017 dogfoodsilo4
 */

"use strict";
var fs = require("fs");
var PerfLogger = (function()
{
    function PerfLogger(logFile)
    {
        this._logFile = logFile;
    }

    PerfLogger.prototype.GetLogArray = function()
    {
        return this._logArray;
    };

    PerfLogger.prototype.Start = function()
    {
        this._logArray = [];
        this.Log("Start Logging", null);
    };

    PerfLogger.prototype.Log = function(description)
    {
        var logItem = [];
        logItem.push(description);
        logItem.push(new Date().getTime()); // Return the number of milliseconds since 1970/01/01
        logItem.push(process.memoryUsage().rss);
        logItem.push(process.memoryUsage().heapTotal);
        logItem.push(process.memoryUsage().heapUsed);
        this._logArray.push(logItem);
    };

    PerfLogger.prototype.End = function(cb)
    {
        this.Log("End Logging");

        this.UpdateRunningTotals(() =>
        {
            this.WriteLogToFile(cb);
        });
    };

    PerfLogger.prototype.WriteLogToFile = function(cb)
    {
        var _this = this;
        var file = fs.createWriteStream(this._logFile);
        file.on('error', function(err)
        {
            /* log and continue on error */
            console.log("ERROR, Unable to write to log file: " + _this._logFile);
            console.log(err.toString());
        });

        this.BuildHeader(file);

        Object.keys(this._logArray).forEach(function(index)
        {
            file.write(index + "," + _this._logArray[index] + "\n");
        });

        this.BuildSummary(file);

        setTimeout(() =>
        {
            file.end();
            return cb();
        }, 100);
    };

    PerfLogger.prototype.UpdateRunningTotals = function(cb)
    {
        var timeElapsed = 0;
        var memUsage = 0;
        var memTotal = 0;

        for (var i = 0; i < this._logArray.length; i++)
        {
            var lastLog;
            var thisLog = this._logArray[i];

            if (i !== 0)
            {
                lastLog = this._logArray[i - 1];
                timeElapsed = thisLog[1] - lastLog[1]; // Output as ms
                memUsage = (thisLog[4] - lastLog[4]) * 0.000001; // output as MB
                memTotal += memUsage;
            }

            thisLog.push(timeElapsed);
            thisLog.push(memUsage);
            thisLog.push(memTotal);
        }

        return cb();
    }

    PerfLogger.prototype.BuildHeader = function(file)
    {
        file.write("Index,Description,TimeStamp,RSetSize,HeapTotal,HeapUsed,TimeElapsed,MemUsage,MemTotal\n");
    };

    PerfLogger.prototype.BuildSummary = function(file)
    {
        var len = this._logArray.length;
        var firstLog = this._logArray[0];
        var lastLog = this._logArray[len - 1];

        var totalTime = (lastLog[1] - firstLog[1]) / 1000;
        var totalMem = (lastLog[4] - firstLog[4]) * 0.000001;
        file.write("\n");
        file.write(",Totals,,,,," + totalTime + "s," + totalMem + "MB\n");
    };

    return PerfLogger;
}());

module.exports = PerfLogger;
