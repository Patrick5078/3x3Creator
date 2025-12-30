// crop-modal.js - Image cropping modal using Cropper.js

const CropModal = {
    modal: null,
    cropImage: null,
    cropper: null,
    currentSlotIndex: null,
    originalImageUrl: null,

    init() {
        this.modal = document.getElementById('crop-modal');
        this.cropImage = document.getElementById('crop-image');

        // Bind modal controls
        document.getElementById('crop-cancel').addEventListener('click', () => this.close());
        document.getElementById('crop-reset').addEventListener('click', () => this.reset());
        document.getElementById('crop-confirm').addEventListener('click', () => this.confirm());

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.hidden) {
                this.close();
            }
        });
    },

    // Open modal with image
    open(imageDataUrl, slotIndex) {
        this.currentSlotIndex = slotIndex;
        this.originalImageUrl = imageDataUrl;
        this.cropImage.src = imageDataUrl;
        this.modal.hidden = false;
        document.body.style.overflow = 'hidden';

        // Initialize Cropper.js after image loads
        this.cropImage.onload = () => {
            this.initCropper();
        };
    },

    // Initialize Cropper.js instance
    initCropper() {
        // Destroy existing cropper if any
        if (this.cropper) {
            this.cropper.destroy();
        }

        this.cropper = new Cropper(this.cropImage, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 1,
            cropBoxResizable: true,
            cropBoxMovable: true,
            guides: true,
            center: true,
            highlight: true,
            background: true,
            responsive: true,
            restore: false,
            minContainerWidth: 200,
            minContainerHeight: 200,
        });
    },

    // Reset crop to initial state
    reset() {
        if (this.cropper) {
            this.cropper.reset();
        }
    },

    // Confirm crop and apply to slot
    confirm() {
        if (!this.cropper) return;

        // Get cropped canvas with good resolution
        const croppedCanvas = this.cropper.getCroppedCanvas({
            width: 600,
            height: 600,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        if (croppedCanvas) {
            const croppedDataUrl = croppedCanvas.toDataURL('image/png');
            App.setSlotImage(this.currentSlotIndex, croppedDataUrl);
        }

        this.close();
    },

    // Close modal
    close() {
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
        this.modal.hidden = true;
        this.cropImage.src = '';
        this.originalImageUrl = null;
        document.body.style.overflow = '';
    }
};
