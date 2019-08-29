import { Loop } from "../../../loop/loop";
import { ILoopTree } from "./i-loop-tree";
/**
 * @hidden
 * @param root
 * @param loop
 */
declare function getTightestContainingLoop(root: ILoopTree, loop: Loop): ILoopTree;
export { getTightestContainingLoop };
