// app.js - Main application initialization and state management

const App = {
    // Application state
    state: {
        gridImages: new Array(9).fill(null),
        currentSlotIndex: null,
        resolution: 1800,
        lineWidth: 8
    },

    // Initialize the application
    init() {
        this.bindSettings();
        Grid.init();
        ImageInput.init();
        CropModal.init();
        Export.init();
        this.bindGlobalPaste();
        this.preventDefaultDrop();
    },

    // Bind settings controls
    bindSettings() {
        document.getElementById('resolution').addEventListener('change', (e) => {
            this.state.resolution = parseInt(e.target.value, 10);
        });

        document.getElementById('line-width').addEventListener('change', (e) => {
            this.state.lineWidth = parseInt(e.target.value, 10);
        });
    },

    // Global paste handler for clipboard images
    bindGlobalPaste() {
        document.addEventListener('paste', (e) => {
            // Don't handle if modal is open
            if (!document.getElementById('crop-modal').hidden) return;
            ImageInput.handlePaste(e);
        });
    },

    // Prevent default browser drop behavior
    preventDefaultDrop() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        document.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    },

    // Update image in a specific slot
    setSlotImage(index, imageDataUrl) {
        this.state.gridImages[index] = imageDataUrl;
        Grid.updateSlot(index, imageDataUrl);
    },

    // Remove image from a slot
    clearSlot(index) {
        this.state.gridImages[index] = null;
        Grid.clearSlot(index);
    },

    // Clear all images
    clearAll() {
        this.state.gridImages.fill(null);
        Grid.clearAll();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
