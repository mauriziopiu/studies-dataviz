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

let data = d3.json('data/data.json', (d) => console.log(d));
//let dataviz = d3.select('#data-viz');

let width = 1920 / 3;
let height = 1080 / 3;

let module_width = 20;

console.log('data');
console.log(data);

function update() {
  let dataviz = d3
    .select('#data-viz')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'lightblue')
    .on('click', () => {
      console.log('click registered - reloading');
      update();
    });

  let selection = dataviz
    .selectAll('.module')
    .data(data)
    .attr('width', module_width)
    .attr('height', (d) => d.ects_module);

  selection
    .enter()
    .append('rect')
    .attr('class', 'module')
    .attr('width', module_width)
    .attr('height', (d) => d.ects_module);

  selection.exit().remove();

  dataviz.data(data).enter().append();
}

update(data);
