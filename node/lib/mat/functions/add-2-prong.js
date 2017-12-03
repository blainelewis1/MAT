"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_point_1 = require("../../mat/classes/contact-point");
const mat_circle_1 = require("../../mat/classes/mat-circle");
const shape_1 = require("../../geometry/classes/shape");
const point_on_shape_1 = require("../../geometry/classes/point-on-shape");
const hole_closing_2_prong_1 = require("../classes/hole-closing-2-prong");
/**
 * Adds a 2-prong contact circle to the shape.
 *
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param pos1 - First point on shape
 * @param pos2 - Second point on shape
 * @param delta The boundary piece within which the new contact point should be
 * placed
 */
function add2Prong(shape, circle, pos1, pos2, holeClosing) {
    if (holeClosing) {
        pos1.order2 = 1;
        pos2.order2 = -1;
    }
    let cp2 = new contact_point_1.default(pos2, undefined);
    let delta2 = shape_1.default.getNeighbouringPoints(shape, pos2);
    let cmp3 = delta2[0] === undefined ? undefined : contact_point_1.default.compare(delta2[0].item, cp2);
    let cmp4 = delta2[1] === undefined ? undefined : contact_point_1.default.compare(cp2, delta2[1].item);
    if (typeof window !== 'undefined' && window._debug_) {
        if (cmp3 > 0 || cmp4 > 0) {
            //console.log(`2-PRONG 2 Order is wrong 2: ${cmp3}, ${cmp4}`);
        }
    }
    if (cmp3 === 0 || cmp4 === 0) {
        // Should not really be possible with hole-closing 2-prongs.
        return undefined;
    }
    let k2 = pos2.bezierNode.loop.indx;
    let newCp2Node = shape.contactPointsPerLoop[k2].insert(cp2, delta2[0]);
    let cp1 = new contact_point_1.default(pos1, undefined);
    let delta1 = shape_1.default.getNeighbouringPoints(shape, pos1);
    let cmp1 = delta1[0] === undefined ? undefined : contact_point_1.default.compare(delta1[0].item, cp1);
    let cmp2 = delta1[1] === undefined ? undefined : contact_point_1.default.compare(cp1, delta1[1].item);
    if (typeof window !== 'undefined' && window._debug_) {
        if (cmp1 > 0 || cmp2 > 0) {
            //console.log(`2-PRONG 1 Order is wrong 2: ${cmp1}, ${cmp2}`);
        }
    }
    // If they are so close together, don't add it - there's already 1
    if (cmp1 === 0 || cmp2 === 0) {
        // Should not be possible with hole-closing 2-prongs.
        shape.contactPointsPerLoop[k2].remove(newCp2Node);
        return undefined;
    }
    let k1 = pos1.bezierNode.loop.indx;
    let newCp1Node = shape.contactPointsPerLoop[k1].insert(cp1, delta1[0]);
    let matCircle = mat_circle_1.default.create(circle, [newCp1Node, newCp2Node]);
    newCp1Node.prevOnCircle = newCp2Node;
    newCp1Node.nextOnCircle = newCp2Node;
    newCp2Node.prevOnCircle = newCp1Node;
    newCp2Node.nextOnCircle = newCp1Node;
    if (holeClosing) {
        // If hole-closing then we duplicate the 2 contact points
        // so that we can 'split the loop'.
        let posA1 = pos2;
        let posB2 = point_on_shape_1.default.copy(posA1);
        posB2.order2 = 1;
        let cpB2 = new contact_point_1.default(posB2, undefined);
        let newCpB2Node = shape.contactPointsPerLoop[k2].insert(cpB2, newCp2Node);
        let posA2 = pos1;
        let posB1 = point_on_shape_1.default.copy(posA2);
        posB1.order2 = -1;
        let cpB1 = new contact_point_1.default(posB1, undefined);
        let newCpB1Node = shape.contactPointsPerLoop[k1].insert(cpB1, newCp1Node.prev);
        mat_circle_1.default.create(circle, [newCpB1Node, newCpB2Node]);
        newCpB1Node.prevOnCircle = newCpB2Node;
        newCpB1Node.nextOnCircle = newCpB2Node;
        newCpB2Node.prevOnCircle = newCpB1Node;
        newCpB2Node.nextOnCircle = newCpB1Node;
        newCp2Node.next = newCp1Node;
        newCp1Node.prev = newCp2Node;
        newCpB1Node.next = newCpB2Node;
        newCpB2Node.prev = newCpB1Node;
        shape.holeClosers.push(new hole_closing_2_prong_1.default(k1, k2, newCp1Node, newCp2Node, newCpB1Node, newCpB2Node));
    }
    if (typeof window !== 'undefined' && window._debug_) {
        // Add points so when we alt-click shape point is logged.
        const _debug_ = window._debug_;
        prepForDebug(newCp1Node, _debug_);
        prepForDebug(newCp2Node, _debug_);
    }
    return;
}
function prepForDebug(contactPoint, _debug_) {
    //---- Prepare debug info for the ContactPoint
    let cpKey = point_on_shape_1.default.makeSimpleKey(contactPoint.item.pointOnShape.p);
    let cpHash = _debug_.generated.cpHash;
    let cpArr = _debug_.generated.cpArr;
    if (!cpHash[cpKey]) {
        cpHash[cpKey] = {
            cp: contactPoint,
            arrIndx: cpArr.length
        };
        cpArr.push(contactPoint);
    }
    let cpHashDebugObj = cpHash[cpKey];
    cpHashDebugObj.visitedPointsArr =
        cpHashDebugObj.visitedPointsArr || [];
}
exports.default = add2Prong;
