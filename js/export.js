// export.js - Canvas-based export functionality

const Export = {
    init() {
        document.getElementById('export-png').addEventListener('click', () => this.exportImage('png'));
        document.getElementById('export-jpg').addEventListener('click', () => this.exportImage('jpg'));
        document.getElementById('clear-all').addEventListener('click', () => this.confirmClearAll());
    },

    // Export the grid as an image
    async exportImage(format) {
        const { resolution, lineWidth, gridImages } = App.state;

        // Check if any images exist
        const hasImages = gridImages.some(img => img !== null);
        if (!hasImages) {
            alert('Please add at least one image to the grid before exporting.');
            return;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate dimensions
        // We want: lineWidth on edges and between cells
        // Total = lineWidth + cell + lineWidth + cell + lineWidth + cell + lineWidth
        // Total = 4*lineWidth + 3*cellSize
        const totalLineWidth = lineWidth * 4;
        const cellSize = Math.floor((resolution - totalLineWidth) / 3);
        const actualSize = (cellSize * 3) + totalLineWidth;

        canvas.width = actualSize;
        canvas.height = actualSize;

        // Fill background with black (creates separator lines)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, actualSize, actualSize);

        // Load and draw each cell
        const drawPromises = [];

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const index = row * 3 + col;
                const imageDataUrl = gridImages[index];

                // Calculate cell position
                const x = lineWidth + col * (cellSize + lineWidth);
                const y = lineWidth + row * (cellSize + lineWidth);

                if (imageDataUrl) {
                    // Load and draw image
                    const promise = this.loadImage(imageDataUrl).then(img => {
                        ctx.drawImage(img, x, y, cellSize, cellSize);
                    }).catch(() => {
                        // Fill with dark gray on error
                        ctx.fillStyle = '#2a2a2a';
                        ctx.fillRect(x, y, cellSize, cellSize);
                    });
                    drawPromises.push(promise);
                } else {
                    // Fill empty cells with dark gray
                    ctx.fillStyle = '#2a2a2a';
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
            }
        }

        // Wait for all images to load and draw
        await Promise.all(drawPromises);

        // Export based on format
        let mimeType, quality, filename;

        if (format === 'png') {
            mimeType = 'image/png';
            quality = undefined;
            filename = '3x3-grid.png';
        } else {
            mimeType = 'image/jpeg';
            quality = 0.95;
            filename = '3x3-grid.jpg';
        }

        // Use toBlob for better memory efficiency
        canvas.toBlob((blob) => {
            if (blob) {
                this.downloadBlob(blob, filename);
            }
        }, mimeType, quality);
    },

    // Load image from data URL
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    // Download blob as file
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Confirm before clearing all
    confirmClearAll() {
        const hasImages = App.state.gridImages.some(img => img !== null);
        if (!hasImages) return;

        if (confirm('Clear all images from the grid?')) {
            App.clearAll();
        }
    }
};
