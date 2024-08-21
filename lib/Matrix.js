function matrixMult(a, b) {
        // Get dimensions of the matrices
        const [aNumRows, aNumCols] = [a.length, a[0].length];
        const [bNumRows, bNumCols] = [b.length, b[0].length];

        // Initialize the result matrix with zeros
        const result = Array.from({ length: aNumRows }, () => Array(bNumCols).fill(0));

        // Multiply matrices
        for (let r = 0; r < aNumRows; r++) {
                for (let c = 0; c < bNumCols; c++) {
                        for (let i = 0; i < aNumCols; i++) {
                                result[r][c] += a[r][i] * b[i][c];
                        }
                }
        }

        return result;
}

// Example usage:
// console.log(matrixMult([[1,2,3],[1,2,3],[1,2,3]], [[1,0,0], [0,1,0],[0,0,1]]));
