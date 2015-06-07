var Sidebar = {
  list: null,

  setup: function() {
    this.list = d3.select("#list");
  },

  display: function(start, end) {
    var crimeDummy = true;


    console.log(start);
    console.log(end);
    this.list
    .selectAll(".listItem")
    .data(['a', 'b', 'c', 'd', 'e', 'f', 'g'])
    .enter()
    .append("li")
    .attr("class", "listItem list-group-item")
    .html(function(d, i) {return [i, d].join(" ");});
  }
}

$().ready(function () {
  var sidebar = Object.create(Sidebar);
  sidebar.setup();
  missionControl.addClient(sidebar.display.bind(sidebar));
});
