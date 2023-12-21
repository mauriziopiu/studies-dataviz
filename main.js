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

let module_data = await d3.json('data/modules.json', (d) => console.log(d));

// Canvas Config
let width = 1920 / 2;
let height = 1080 / 2;

// Module Config
let module_width = 80;
let size_per_ects = 15;
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

	for (let sem = 0; sem <= 8; sem++) {
		let semester_data = data.filter((d) => d.semester_nr == sem);
		// console.log(`semester_data (semester ${sem}):`);
		console.log(semester_data);

		dataviz
			.append('g')
			.attr('class', `semester sem${sem}`)
			.attr('width', module_width)
			.attr('height', height)
			.attr('x', () => (sem + 1) * module_width);

		let semesterSelection = dataviz
			.select(`g.sem${sem}`)
			.selectAll('.module')
			.data(semester_data);

		// update
		semesterSelection
			.attr('width', module_width)
			.attr('height', (d) => ectsRamp(d.ects_module))
			.attr('x', (d) => d.semester_nr * module_width)
			.attr('y', (d, i) => {
				let y = 0;
				for (let module = 0; module < i; module++) {
					y += ectsRamp(semester_data[module].ects_module);
				}
				return y;
			})
			.attr('rx', 5)
			.attr('ry', 5)
			.style('fill', 'green');

		// enter
		semesterSelection
			.enter()
			.append('rect')
			.attr('class', 'module')
			.attr('width', module_width)
			.attr('height', (d) => ectsRamp(d.ects_module))
			.attr('x', (d) => d.semester_nr * module_width)
			.attr('y', (d, i) => {
				let y = 0;
				for (let module = 0; module < i; module++) {
					y += ectsRamp(semester_data[module].ects_module);
				}
				return y;
			})
			.attr('rx', 5)
			.attr('ry', 5)
			.style('fill', 'green');

		semesterSelection.exit().remove();

		dataviz.data(semester_data).enter().append();
	}
}

update(module_data);
