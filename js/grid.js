// grid.js - Grid component for 3x3 slot management

const Grid = {
    container: null,
    slots: [],

    init() {
        this.container = document.getElementById('grid');
        this.createSlots();
    },

    // Create 9 grid slots
    createSlots() {
        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.className = 'grid-slot';
            slot.dataset.index = i;

            slot.innerHTML = `
                <div class="slot-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                </div>
                <div class="slot-controls" hidden>
                    <button class="remove-btn" title="Remove image">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                        </svg>
                    </button>
                </div>
            `;

            this.bindSlotEvents(slot, i);
            this.container.appendChild(slot);
            this.slots.push(slot);
        }
    },

    // Bind events to a slot
    bindSlotEvents(slot, index) {
        // Click to add image (if empty)
        slot.addEventListener('click', (e) => {
            if (!slot.classList.contains('has-image')) {
                ImageInput.triggerFilePicker(index);
            }
        });

        // Remove button
        const removeBtn = slot.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                App.clearSlot(index);
            });
        }

        // Drag & drop events
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', (e) => {
            // Only remove if actually leaving the slot
            if (!slot.contains(e.relatedTarget)) {
                slot.classList.remove('drag-over');
            }
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            ImageInput.handleDrop(e, index);
        });
    },

    // Update slot with cropped image
    updateSlot(index, imageDataUrl) {
        const slot = this.slots[index];
        slot.classList.add('has-image');

        // Hide placeholder
        const placeholder = slot.querySelector('.slot-placeholder');
        if (placeholder) placeholder.hidden = true;

        // Show controls
        const controls = slot.querySelector('.slot-controls');
        if (controls) controls.hidden = false;

        // Add or update image
        let img = slot.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            slot.insertBefore(img, slot.firstChild);
        }
        img.src = imageDataUrl;
        img.alt = `Grid image ${index + 1}`;
    },

    // Clear a single slot
    clearSlot(index) {
        const slot = this.slots[index];
        slot.classList.remove('has-image');

        const img = slot.querySelector('img');
        if (img) img.remove();

        const placeholder = slot.querySelector('.slot-placeholder');
        if (placeholder) placeholder.hidden = false;

        const controls = slot.querySelector('.slot-controls');
        if (controls) controls.hidden = true;
    },

    // Clear all slots
    clearAll() {
        for (let i = 0; i < 9; i++) {
            this.clearSlot(i);
        }
    }
};
