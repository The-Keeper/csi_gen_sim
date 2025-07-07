interface Outlier {
	row: number;
	col: number;
	value: string;
}

export interface AlignmentResult {
	outliers: Outlier[];
	alignedGrid: (number | null)[][];
}

export function findAlignedGridAndOutliers(
	areaContent: string,
): AlignmentResult {
	// Parse the file into a 2D grid
	const grid = areaContent.split("\n").map((line) => line.split("\t"));

	const rows = grid.length;
	if (rows === 0) return { outliers: [], alignedGrid: [] };
	const cols = grid[0].length;

	// Track non-empty cells and counts
	const nonEmptyCells: { row: number; col: number }[] = [];
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
		return { outliers: [], alignedGrid: [] };
	}

	// Calculate median counts (for typical alignment)
	const median = (arr: number[]) => {
		const filtered = arr.filter((count) => count > 0);
		if (filtered.length === 0) return 0;
		const sorted = [...filtered].sort((a, b) => a - b);
		const mid = Math.floor(sorted.length / 2);
		return sorted.length % 2 !== 0
			? sorted[mid]
			: (sorted[mid - 1] + sorted[mid]) / 2;
	};

	const typicalRowCount = median(rowCounts);
	const typicalColCount = median(colCounts);

	// Define thresholds (adjust as needed)
	const rowThreshold = typicalRowCount * 0.5;
	const colThreshold = typicalColCount * 0.5;

	// Identify aligned rows and columns
	const isAlignedRow = (row: number) => rowCounts[row] >= rowThreshold;
	const isAlignedCol = (col: number) => colCounts[col] >= colThreshold;

	// Get indices of aligned rows/columns
	const alignedRows = Array.from({ length: rows }, (_, i) => i).filter((i) =>
		isAlignedRow(i),
	);
	const alignedCols = Array.from({ length: cols }, (_, j) => j).filter((j) =>
		isAlignedCol(j),
	);

	// Build the aligned grid (skip empty rows/columns, keep nulls for gaps)
	const alignedGrid: (number | null)[][] = alignedRows.map((row) => {
		return alignedCols.map((col) => {
			return Number(grid[row][col]?.trim()) || null;
		});
	});

	// Find outliers (cells not in aligned rows/columns)
	const outliers: Outlier[] = nonEmptyCells
		.filter(({ row, col }) => !isAlignedRow(row) || !isAlignedCol(col))
		.map(({ row, col }) => ({
			row,
			col,
			value: grid[row][col],
		}));

	return { outliers, alignedGrid };
}
