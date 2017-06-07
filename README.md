# PerfLogger
Easy Performance Logging for node

A performance logging tool that provides file logging with timestamp and memory usage statistics.
On calling End() a csv file of logged items will be generated.

Usage:

```js
var plog = new PerfLogger("C:/somelog.csv");
plog.Start();
plog.Log("Some Message");
plog.End();
```

Output:

```csv
Index,Description,TimeStamp,RSetSize,HeapTotal,HeapUsed,TimeElapsed,MemUsage,MemTotal
0,Start Logging,84624946,541478912,412057088,403542056,0,0,0
1,Some Message,84625017,544735232,414104320,405716616,71,2.17456,2.17456
2,End Logging,84625019,544735234,414104322,405716618,2,0.000022,2.174582

Totals, 0.073s, 2.174582MB
```

Note. Garbage collection may affect the memory usage results.
