requireFile('./ghrequest.js');
/*
 * This software stands under the Apache 2 License
 */
describe("utils", function () {

    it("should decode the polyline", function () {
        var list = decodePath("_p~iF~ps|U", false);
        expect(list).toEqual([[-120.2, 38.5]]);

        list = decodePath("_p~iF~ps|U_ulLnnqC_mqNvxq`@", false);
        expect(list).toEqual([[-120.2, 38.5], [-120.95, 40.7], [-126.45300000000002, 43.252]]);
    });

    it("should decode the 3D polyline", function () {
        var list = decodePath("_p~iF~ps|Uo}@", true);
        expect(list).toEqual([[-120.2, 38.5, 10]]);

        list = decodePath("_p~iF~ps|Uo}@_ulLnnqC_anF_mqNvxq`@?", true);
        expect(list).toEqual([[-120.2, 38.5, 10], [-120.95, 40.7, 1234], [-126.45300000000002, 43.252, 1234]]);
    });

    it("ghrequest should init correctly from params", function () {
        var ghRequest = new GHRequest("http://test.de");
        var params = {};
        params.do_zoom = true;
        ghRequest.init(params);
        expect(ghRequest.do_zoom).toEqual(params.do_zoom);

        params.do_zoom = false;
        ghRequest.init(params);
        expect(ghRequest.do_zoom).toEqual(params.do_zoom);
    });

    it("input should accept 0 and no addresses", function () {
        var input = new GHInput("12,0");
        expect(input.toString()).toEqual("12,0");
        var input = new GHInput("bluo,0");
        expect(input.toString()).toEqual(undefined);
        expect(input.lat).toEqual(undefined);
        expect(input.lng).toEqual(undefined);
        var input = new GHInput("bluo");
        expect(input.toString()).toEqual(undefined);
        var input = new GHInput("");
        expect(input.toString()).toEqual(undefined);
    });

    it("GHInput should set to unresolved if new input string", function () {
        var input = new GHInput("12.44, 68.44");
        expect(input.isResolved()).toEqual(true);
        input.set("blup");
        expect(input.isResolved()).toEqual(false);
    });

    it("point should be parsable", function () {
        expect(new GHInput("12.44, 68.44").lat).toEqual(12.44);
        expect(new GHInput("12.44, 68.44").lng).toEqual(68.44);
        expect(new GHInput("12.44,68.44").lat).toEqual(12.44);
        expect(new GHInput("12.44,68.44").lng).toEqual(68.44);
        expect(new GHInput("london").lon).toEqual(undefined);
    });

    it("features should work", function () {
        var ghRequest = new GHRequest("http://test.de?vehicle=car");
        var params = {};
        params.elevation = true;
        ghRequest.features = {"car": {}};
        ghRequest.init(params);
        expect(ghRequest.api_params.elevation).toEqual(false);

        // overwrite
        ghRequest.features = {"car": {elevation: true}};
        ghRequest.init(params);
        expect(ghRequest.api_params.elevation).toEqual(true);

        var params = {};
        ghRequest.features = {"car": {elevation: true}};
        ghRequest.init(params);
        expect(ghRequest.api_params.elevation).toEqual(true);

        var params = {};
        params.elevation = false;
        ghRequest.features = {"car": {elevation: true}};
        ghRequest.init(params);
        expect(ghRequest.api_params.elevation).toEqual(false);

        var params = {};
        params.elevation = true;
        ghRequest.features = {"car": {elevation: false}};
        ghRequest.init(params);
        expect(ghRequest.api_params.elevation).toEqual(false);

        ghRequest = new GHRequest("http://test.de");
        var params = {point: [[4, 3], [2, 3]], test: "x", test_array: [1, 2]};
        ghRequest.init(params);

        // skip point, layer etc
        expect(ghRequest.api_params.point).toEqual(undefined);

        // include all other parameters
        expect(ghRequest.api_params.test).toEqual("x");
        expect(ghRequest.api_params.test_array).toEqual([1, 2]);
    });
});
