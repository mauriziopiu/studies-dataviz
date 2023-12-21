import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

/*
type module = {
    ects_achieved: number
    ects_module: number
    ects_planned: number
    grade: string
    grade_equiv: number
    lecturer: string
    module_code: string
    module_group: string
    module_name: string
    semester_nr: number
    semester_type: string
    status: string
}
*/

let data = await d3.json('data/modules.json', (d) => console.log(d));
//let data = [2, 4, 6, 4, 4, 6, 2, 4];
//let dataviz = d3.select('#data-viz');

let width = 1920 / 3;
let height = 1080 / 3;

let module_width = 20;
let size_per_ects = 20;
let ectsPixelrange = (data) => [
  d3.min(data, (d) => d.ects_module) * size_per_ects,
  d3.max(data, (d) => d.ects_module) * size_per_ects,
];

function update(data) {
  let ectsRamp = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.ects_module),
      d3.max(data, (d) => d.ects_module),
    ])
    .range(ectsPixelrange(data));

  let dataviz = d3
    .select('#data-viz')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'lightblue')
    .on('click', () => {
      console.log('click registered - reloading');
    });

  let selection = dataviz
    .selectAll('.module')
    .data(data)
    .attr('width', module_width)
    .attr('height', (d) => ectsRamp(d.ects_module))
    .attr('x', (d, i) => i * module_width);

  selection
    .enter()
    .append('rect')
    .attr('class', 'module')
    .attr('width', module_width)
    .attr('height', (d) => ectsRamp(d.ects_module))
    .attr('x', (d, i) => i * module_width)
    .attr('y', (d) => height - ectsRamp(d.ects_module));

  selection.exit().remove();

  dataviz.data(data).enter().append();
}

update(data);
