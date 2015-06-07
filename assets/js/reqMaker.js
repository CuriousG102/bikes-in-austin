var RequestMaker = {
    _API_URL: null,
    crime_list : function(startDate, endDate, offense, category, district, callback) {
        this._crime_query(false, null, false, false, false, startDate, endDate, offense, category, district, callback);
    },
    crime_count : function(startDate, endDate, offense, category, district, callback) {
        this._crime_query(true, null, false, false, false, startDate, endDate, offense, category, district, callback);
    },
    offense_list : function(callback) {
        this._query_list(this._API_URL + "offense/", {}, callback);
    },
    category_list : function(callback) {
        this._query_list(this._API_URL + "category/", {}, callback);
    },
    crime_count_increment : function(increment, startDate, endDate, offense, category, district, callback) {
        this._crime_query(true, increment, false, false, false, startDate, endDate, offense, category, district, callback);
    },
    district_count : function(startDate, endDate, offense, category, callback) {
        this._crime_query(true, null, true, false, false, startDate, endDate, offense, category, null, callback);
    },
    crime_count_area : function(startDate, endDate, offense, category, callback) {
        this._crime_query(true, null, false, true, false, startDate, endDate, offense, category, null, callback);
    },
    crime_report_delay : function(startDate, endDate, offense, category, district, callback) {
        this._crime_query(true, null, false, false, true, startDate, endDate, offense, category, district, callback);
    },
    bike_crimes : function(startDate, endDate, callback) {
        var bike_crime_offense_codes = [54, 342, 302];
        this.bike_crimes_helper(startDate, endDate, bike_crime_offense_codes, callback, [], []);
    },

    bike_accidents: function(startDate, endDate, callback) {
        var bike_accident_offense_codes = [591, 360];
        this.bike_crimes_helper(startDate, endDate, bike_accident_offense_codes, callback, [], []);
    },

    bike_crimes_helper: function(startDate, endDate, offense_codes, clientCallback, resp, accumArray) {
        accumArray = accumArray.concat(resp); // add the response we have so far

        if (offense_codes.length === 0) {clientCallback(null, accumArray); return;} // base case
        var offense_code = offense_codes.pop(); // get the next offense code to get

        var callback = function(startDate, endDate, offense_codes, clientCallback, accumArray, error, resp) {
            this.bike_crimes_helper(startDate, endDate, offense_codes, clientCallback, resp, accumArray);
        }.bind(this, startDate, endDate, offense_codes, clientCallback, accumArray)

        this.crime_list(startDate, endDate, offense_code, null, null, callback);
    },

    _crime_query : function (isCount, increment, isDistrictCount, isAreaCount, isDelayReport, startDate, endDate, offense, category, district, callback) {
        // as I added public facing helper functions, this function slowly
        // became a monster. I think it is a prime candidate for refactoring
        var queryDict = {}; 
        if (startDate) {
            var startDateString = this._date_string(startDate);
            queryDict['offenseStartRange'] = startDateString;
        }
        if (endDate) {
            var endDateString = this._date_string(endDate);
            queryDict['offenseEndRange'] = endDateString;
        }
        if (offense) {
            queryDict['offense'] = offense;
        }
        if (category) {
            queryDict['category'] = category;
        }
        if (isCount) {
            if (isDelayReport)
                this._query_detail(this._API_URL + "timeToReport/", queryDict, callback);
            else if (isAreaCount) 
                this._query_detail(this._API_URL + "countArea/", queryDict, callback);
            else if (!increment && !isDistrictCount)
                this._query_detail(this._API_URL + "count/", queryDict, callback);
            else if (!isDistrictCount) {
                queryDict['increment'] = increment;
                this._query_detail(this._API_URL + "countincrement/", queryDict, callback);
            } else {
                this._query_detail(this._API_URL + "district/", queryDict, callback);
            }
        } else {
            this._query_list(this._API_URL + "crime/", queryDict, callback);
        }
    },
    _date_string : function(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd = date.getDate().toString();
        return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
    },
    _query_list: function (url, queryDict, callback) {
        var queryURL = this._encodeQueryData(url, queryDict);
        this._query_list_helper(queryURL, [], callback, {});
    },
    _query_list_helper: function(url, accumArray, callback, resp) {
        if (Object.keys(resp).length === 0) {
            this._query(url, function (accumArray, callback, error, response) {
                this._query_list_helper("doesntMatter", accumArray, callback, response);
            }.bind(this, accumArray, callback));
        } else {
            for (var i = 0; i < resp['results'].length; i++)
                accumArray.push(resp['results'][i]);
            // accumArray.push.apply(resp['results']);
            if (resp['next']) {
                this._query(resp['next'], function (accumArray, callback, error, response) {
                    this._query_list_helper("doesntMatter", accumArray, callback, response);
                }.bind(this, accumArray, callback));
            }
            else {
                callback(null, accumArray);
            }
        }
    },
    _query_detail: function (url, queryDict, callback) {
        queryURL = this._encodeQueryData(url, queryDict);
        this._query(queryURL, callback);
    },
    _query: function (url, callback) {
        d3.json(url, callback);
    },
    _encodeQueryData: function (url, data) {
        // http://stackoverflow.com/questions/111529/create-query-parameters-in-javascript
        if (Object.keys(data).length != 0) {
            var ret = [];
            for (var d in data)
              ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
            return url + "?" + ret.join("&");
        }

        return url;
    }
}

var reqMaker = Object.create(RequestMaker);