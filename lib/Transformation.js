/* 
 * This function translates the object to the new coordinates by pt units
 */
function translate(points, pt) {
	for (let p of points) {
			let pointMatrix = [
					[p.x],
					[p.y],
					[1]
			];
			let translationMatrix = [
					[1, 0, pt.x],
					[0, 1, pt.y],
					[0, 0, 1]
			];
			let result = matrixMult(translationMatrix, pointMatrix);

			p.x = result[0][0];
			p.y = result[1][0];
	}
	return points;
}

// Example usage:
// console.log(translate([{"x": 1, "y":1}], {"x": 1, "y":5}));

/* 
* This function scales the object with sx along the x-axis and sy along the y-axis with a fixed point pf 
*/
function scale(points, sx, sy, pf) {
	for (let p of points) {
			let pointMatrix = [
					[p.x],
					[p.y],
					[1]
			];
			let scalingMatrix = [
					[sx, 0, 0],
					[0, sy, 0],
					[0, 0, 1]
			];

			let translateToOriginMatrix = [
					[1, 0, -pf.x],
					[0, 1, -pf.y],
					[0, 0, 1]
			];

			let translateBackMatrix = [
					[1, 0, pf.x],
					[0, 1, pf.y],
					[0, 0, 1]
			];

			let result = matrixMult(translateToOriginMatrix, pointMatrix);
			result = matrixMult(scalingMatrix, result);
			result = matrixMult(translateBackMatrix, result);

			p.x = result[0][0];
			p.y = result[1][0];
	}
	return points;
}

// Example usage:
// console.log(scale([{"x": 0, "y": 3},{"x": 3, "y": 3},{"x": 3, "y": 0},{"x": 0, "y": 0}], 2, 3, {"x": 0, "y": 0}));

/* 
* This function rotates the object by a given angle with respect to a fixed point pf 
*/
function rotate(points, angle, pf) {
	angle = angle * (Math.PI / 180.0); // Convert angle to radians
	for (let p of points) {
			let pointMatrix = [
					[p.x],
					[p.y],
					[1]
			];
			let rotationMatrix = [
					[Math.cos(angle), -Math.sin(angle), 0],
					[Math.sin(angle), Math.cos(angle), 0],
					[0, 0, 1]
			];

			let translateToOriginMatrix = [
					[1, 0, -pf.x],
					[0, 1, -pf.y],
					[0, 0, 1]
			];

			let translateBackMatrix = [
					[1, 0, pf.x],
					[0, 1, pf.y],
					[0, 0, 1]
			];

			let result = matrixMult(translateToOriginMatrix, pointMatrix);
			result = matrixMult(rotationMatrix, result);
			result = matrixMult(translateBackMatrix, result);

			p.x = result[0][0];
			p.y = result[1][0];
	}
	return points;
}

// Example usage:
// console.log(rotate([{"x": 20, "y": 20},{"x": 80, "y": 20},{"x": 50, "y": 50}], 90, {"x": 50, "y": 30}));

/* 
* This function multiplies two matrices and returns the result
*/
function matrixMult(a, b) {
	let result = new Array(a.length).fill(0).map(row => new Array(b[0].length).fill(0));

	for (let i = 0; i < a.length; i++) {
			for (let j = 0; j < b[0].length; j++) {
					for (let k = 0; k < a[0].length; k++) {
							result[i][j] += a[i][k] * b[k][j];
					}
			}
	}
	return result;
}
