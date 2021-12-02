const margin = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Creates sources <svg> element and inner g (for margins)
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

/////////////////////////
const projection = d3.geoAlbersUsa();
const path = d3.geoPath(projection);
const color = d3.scaleSequential(d3.interpolateBlues);

d3.json("https://cdn.jsdelivr.net/npm/us-atlas/states-10m.json").then((us) => {
  const states = topojson.feature(us, us.objects.states).features;
  const nation = topojson.feature(us, us.objects.nation).features[0];

  // scale to fit bounds
  projection.fitSize([width, height], nation);

  const data = states.map((feature) => ({
    feature: feature,
    name: feature.properties.name,
    value: Math.random(), // random value
  }));

  const paths = svg
    .selectAll("path")
    .data(data)
    .join((enter) => {
      const p = enter.append("path");
      p.on("mouseenter", function () {
        // move the SVG element after all other elements to be on the top
        d3.select(this).raise();
      });
      p.append("title");
      return p;
    })
    .attr("d", (d) => path(d.feature))
    .style("fill", (d) => color(d.value));
  paths.select("title").text((d) => d.name);
});
