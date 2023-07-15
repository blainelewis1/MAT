import { drawFs } from 'flo-draw';
import { ThreeProngForDebugging } from '../../three-prong-for-debugging.js';
import { Circle, scaleCircle } from '../../../circle.js';


/** @hidden */
const scaleFactor = 0.1;


/** @hidden */
function threeProng(g: SVGGElement, threeProng: ThreeProngForDebugging) {
	const circle = scaleCircle(
		threeProng.circle,
		1
	);
	const poss = threeProng.poss;
		
	const $cp1 = drawFs.dot(g, poss[0].p, 0.1*1*scaleFactor, 'blue');
	const $cp2 = drawFs.dot(g, poss[1].p, 0.1*2*scaleFactor, 'blue');
	const $cp3 = drawFs.dot(g, poss[2].p, 0.1*3*scaleFactor, 'blue');
	const $center = drawFs.dot(g, circle.center, 0.3*scaleFactor, 'blue');
	const $circle = drawFs.circle(g, circle, 'blue thin2 nofill');
		
	return [...$center, ...$cp1, ...$cp2, ...$cp3, ...$circle];
}		


export { threeProng }
