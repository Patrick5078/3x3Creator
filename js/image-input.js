// image-input.js - Handle image input from various sources

const ImageInput = {
    fileInput: null,
    pendingSlotIndex: null,

    init() {
        this.fileInput = document.getElementById('file-input');
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    },

    // Trigger file picker for a specific slot
    triggerFilePicker(slotIndex) {
        this.pendingSlotIndex = slotIndex;
        this.fileInput.click();
    },

    // Handle file selection from picker
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImageFile(file, this.pendingSlotIndex);
        }
        // Reset input so same file can be selected again
        this.fileInput.value = '';
    },

    // Handle drag & drop
    handleDrop(e, slotIndex) {
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.loadImageFile(files[0], slotIndex);
        }
    },

    // Handle clipboard paste
    handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    // Find first empty slot, or use slot 0
                    const emptySlotIndex = App.state.gridImages.findIndex(img => img === null);
                    const targetIndex = emptySlotIndex !== -1 ? emptySlotIndex : 0;
                    this.loadImageFile(file, targetIndex);
                }
                break;
            }
        }
    },

    // Load image file and open crop modal
    loadImageFile(file, slotIndex) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataUrl = e.target.result;
            App.state.currentSlotIndex = slotIndex;
            CropModal.open(imageDataUrl, slotIndex);
        };
        reader.onerror = () => {
            alert('Failed to load image. Please try again.');
        };
        reader.readAsDataURL(file);
    }
};
