interface Outlier {
    row: number;
    col: number;
    value: string;
}

export interface AlignmentResult {
    outliers: Outlier[];
    alignedGrid: (number | null)[][];
}

export function findAlignedGridAndOutliers(areaContent: string): AlignmentResult {
    // Parse the file into a 2D grid
    const grid = areaContent
        .split('\n')
        .map(line => line.split('\t'));

    const rows = grid.length;
    if (rows === 0) return { outliers: [], alignedGrid: [] };
    const cols = grid[0].length;

    // Track non-empty cells and counts
    const nonEmptyCells: { row: number, col: number }[] = [];
    const colCounts: number[] = new Array(cols).fill(0);
    const rowCounts: number[] = new Array(rows).fill(0);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j]?.trim()) {
                nonEmptyCells.push({ row: i, col: j });
                rowCounts[i]++;
                colCounts[j]++;
            }
        }
    }

    if (nonEmptyCells.length === 0) {
        return { outliers: [], alignedGrid: Array(rows).fill(null).map(() => Array(cols).fill(null)) };
    }

    // Calculate median counts (for typical alignment)
    const median = (arr: number[]) => {
        const filtered = arr.filter(count => count > 0); // Ignore empty rows/columns
        if (filtered.length === 0) return 0;
        const sorted = [...filtered].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const typicalRowCount = median(rowCounts);
    const typicalColCount = median(colCounts);

    // Define thresholds (adjust as needed)
    const rowThreshold = typicalRowCount * 0.5;
    const colThreshold = typicalColCount * 0.5;

    // Identify aligned rows and columns (those passing thresholds)
    const isAlignedRow = (row: number) => rowCounts[row] >= rowThreshold;
    const isAlignedCol = (col: number) => colCounts[col] >= colThreshold;

    // Build the aligned grid (null for outliers or empty cells)
    const alignedGrid: (number | null)[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null));

    const outliers: Outlier[] = [];

    for (const { row, col } of nonEmptyCells) {
        if (isAlignedRow(row) && isAlignedCol(col)) {
            alignedGrid[row][col] = Number(grid[row][col]); // Keep aligned values
        } else {
            outliers.push({ row, col, value: grid[row][col] }); // Track outliers
        }
    }

    return { outliers, alignedGrid };
}