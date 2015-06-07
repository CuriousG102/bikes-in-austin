var Sidebar = {
  list: null,

  setup: function() {
    this.list = d3.select("#list");
  },

  display: function(start, end) {
    var isCrime = true;

    var listCrimes = function(err, resp) {
      // update...
      var selection = this.list
                        .selectAll(".listItem")
                        .data(resp)
                        .html(function(d, i) {return [d['offenses'][0]['name'],
                                                      d['offense_area_command'],
                                                      moment(d['offense_time'])].join("<br>");});
      // enter...
      selection.enter()
      .append("li")
      .attr("class", "listItem list-group-item")
      .html(function(d, i) {return [d['offenses'][0]['name'],
                                    d['offense_area_command'],
                                    moment(d['offense_time'])].join("<br>");});

      // exit...
      selection.exit().remove();
    }.bind(this)
    
    if (isCrime) reqMaker.bike_crimes(start, end, listCrimes);
    else reqMaker.bike_accidents(start, end, listCrimes);
  }
}

$().ready(function () {
  var sidebar = Object.create(Sidebar);
  sidebar.setup();
  missionControl.addClient(sidebar.display.bind(sidebar));
});
