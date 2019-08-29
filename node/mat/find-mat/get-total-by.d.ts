import { Curve } from '../../curve';
import { Loop } from '../../loop/loop';
/**
 * @hidden
 * Helper function.
 * @hidden
 * @param f
 */
declare function getTotalBy(f: (curve: Curve) => number): (loop: Loop) => number;
export { getTotalBy };
