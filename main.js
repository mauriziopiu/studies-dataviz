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
    module_full_name: string
    module_shorthand
    semester_nr: number
    semester_type: string
    status: string
}
*/

let colors = {
	darkorange: '#D95204',
	mediumorange: '#F2911B',
	brightorange: '#F2C288',
	blue: '#325573',
	brown: '#59252E',
	white: '#FEF8EB',
	black: '#13160F',
};

let moduleColors = {
	a: '#009900',
	b: '#cc0000',
	c: '#6600ff',
	d1: '#0066ff',
	d2: '#cc6600',
	h: '#993366',
};

let colorMap = (module_group) => {
	if (module_group == 'A') return moduleColors.a; // Basic Modules
	if (module_group == 'B') return moduleColors.b; // Project & Training, Language
	if (module_group == 'C') return moduleColors.c; // Specialisation Modules
	if (module_group == 'D1') return moduleColors.d1; // Technical Elective Module
	if (module_group == 'D2') return moduleColors.d2; // Blockweeks & General Elective Module
	if (module_group == 'H') return moduleColors.h; // Optional Elective Module
	return colors.black;
};

let module_data = await d3.json('data/modules.json', (d) => console.log(d));

// Canvas Config
let width = 1920 / 1.5;
let height = 1080 / 1.5;

// Data Viz Config
let x_shift = 30;
let y_shift = 50;
let baseline_height = 10;

// Module Config
let module_width = 130;
let size_per_ects = 15;
let padding = 5;
let ectsPixelrange = (data) => [
	d3.min(data, (d) => d.ects_module) * size_per_ects,
	d3.max(data, (d) => d.ects_module) * size_per_ects,
];
let characters = 15;

function update(data) {
	let ectsRamp = d3
		.scaleLinear()
		.domain([
			d3.min(data, (d) => d.ects_module),
			d3.max(data, (d) => d.ects_module),
		])
		.range(ectsPixelrange(data));

	let svg = d3
		.select('#data-viz')
		.attr('width', width)
		.attr('height', height)
		.on('click', () => {
			console.log('click registered - reloading');
		});

	let dataviz = svg
		.append('g')
		.attr('class', 'dataviz')
		.attr('transform', `translate(${x_shift},${y_shift})`);

	for (let sem = 0; sem <= 8; sem++) {
		let semester_data = data.filter((d) => d.semester_nr == sem);
		// console.log(`semester_data (semester ${sem}):`);
		// console.log(semester_data);

		dataviz
			.append('g')
			.attr('class', `semester sem${sem}`)
			.attr('width', module_width)
			.attr('height', height)
			.attr('x', () => (sem + 1) * module_width + sem * padding);

		// Semester Label
		dataviz
			.select(`g.sem${sem}`)
			.append('text')
			.attr('class', 'semester-label')
			.attr('x', (d) => sem * module_width + sem * padding)
			.style('margin-bottom', '1rem')
			.text(`Semester ${sem}`);

		let semesterSelection = dataviz
			.select(`g.sem${sem}`)
			.selectAll('.module')
			.data(semester_data);

		// UPDATE RECT
		semesterSelection
			.attr('width', module_width)
			.attr('height', (d) => ectsRamp(d.ects_module))
			.attr('x', (d) => sem * module_width + sem * padding)
			.attr('y', (d, i) => {
				let y = 0;
				for (let module = 0; module < i; module++) {
					y += ectsRamp(semester_data[module].ects_module);
				}
				return y + baseline_height;
			})
			.attr('rx', 5)
			.attr('ry', 5)
			.style('fill', (d) => colorMap(d.module_group))
			.style('stroke', colors.black);

		// UPDATE TEXT
		semesterSelection
			.select('text.module-name')
			.text((d) => d.module_name)
			.attr('width', module_width)
			.attr('x', (d) => sem * (module_width + padding) + 2)
			.attr('y', (d, i) => {
				let y = 0;
				for (let module = 0; module < i; module++) {
					y += ectsRamp(semester_data[module].ects_module);
				}
				return y + size_per_ects + baseline_height;
			})
			.style('fill', colors.white);

		// ENTER RECT
		semesterSelection
			.enter()
			.append('rect')
			.attr('class', 'module')
			.attr('width', module_width)
			.attr('height', (d) => ectsRamp(d.ects_module))
			.attr('x', (d) => sem * module_width + sem * padding)
			.attr('y', (d, i) => {
				let y = 0;
				for (let module = 0; module < i; module++) {
					y += ectsRamp(semester_data[module].ects_module);
				}
				return y + i * padding + baseline_height;
			})
			.attr('rx', 5)
			.attr('ry', 5)
			.style('fill', (d) => colorMap(d.module_group))
			.style('stroke', colors.black)
			.append('text')
			.html((d) => d.module_name);

		// ENTER TEXT
		semesterSelection
			.enter()
			.append('text')
			.attr('class', 'module-name')
			.text((d) => d.module_name)
			.attr('width', module_width)
			.attr('x', (d) => sem * (module_width + padding) + 2)
			.attr('y', (d, i) => {
				let y = 0;
				for (let module = 0; module < i; module++) {
					y += ectsRamp(semester_data[module].ects_module);
				}
				return y + size_per_ects + i * padding + baseline_height;
			})
			.style('fill', colors.white);

		semesterSelection.exit().remove();

		dataviz.data(semester_data).enter().append();
	}
}

update(module_data);
