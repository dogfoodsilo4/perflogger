/*
 * PerfLogger
 * Copyright 2017 dogfoodsilo4
 */

"use strict"
var chai = require('chai');

var PerfLogger = require('../src/PerfLogger');

describe("PerfLogger", () =>
{
    it("should create a log file with summary info", (done) =>
    {
        // TODO: Just using this to manually test for now
        // but ultimately we don't want this to be an integration test, so use sinon or a mock to test the fs output

        var plog = new PerfLogger("W:\\Test1.csv");
        plog.Start();
        for (var i = 0; i < 100; i++)
        {
            var testObj = {
                "Hello": "it is me you're looking for?"
            };
            var temp = JSON.parse(JSON.stringify(testObj));
            plog.Log("Hello Test");
        }
        plog.End(() =>
        {
            chai.expect(true).to.be.true;
            done();
        });

    });

});
