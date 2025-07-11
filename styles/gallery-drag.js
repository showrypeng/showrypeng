// Gallery Drag and Drop Functionality with Size Controls
class GalleryDragDrop {
    constructor() {
        this.gallery = document.getElementById('galleryGrid');
        this.draggedItem = null;
        this.placeholder = null;
        this.sizes = ['small', 'medium', 'large'];
        this.init();
    }

    init() {
        if (!this.gallery) return;

        // Add event listeners to gallery container
        this.gallery.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.gallery.addEventListener('dragend', this.handleDragEnd.bind(this));
        this.gallery.addEventListener('dragover', this.handleDragOver.bind(this));
        this.gallery.addEventListener('dragenter', this.handleDragEnter.bind(this));
        this.gallery.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.gallery.addEventListener('drop', this.handleDrop.bind(this));

        // Add size control listeners
        this.gallery.addEventListener('click', this.handleSizeButtonClick.bind(this));
        this.gallery.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        this.gallery.addEventListener('contextmenu', this.handleRightClick.bind(this));

        // Create placeholder element
        this.createPlaceholder();

        // Add cursor styles and initial setup
        this.setupStyles();

        // Initialize size controls
        this.initializeSizeControls();
    }

    createPlaceholder() {
        this.placeholder = document.createElement('div');
        this.placeholder.className = 'gallery-item placeholder';
        this.placeholder.innerHTML = '<div class="placeholder-content">Drop here</div>';
    }

    setupStyles() {
        // Add custom styles for drag and drop and size controls
        if (!document.getElementById('drag-drop-styles')) {
            const style = document.createElement('style');
            style.id = 'drag-drop-styles';
            style.textContent = `
                .gallery-item {
                    position: relative;
                    overflow: hidden;
                }

                .gallery-item[draggable="true"] {
                    cursor: grab;
                    transition: all 0.3s ease;
                }

                .gallery-item[draggable="true"]:hover {
                    transform: scale(1.02);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                .gallery-item[draggable="true"]:hover .size-controls {
                    opacity: 1;
                    transform: translateY(0);
                }

                .gallery-item.dragging {
                    opacity: 0.5;
                    transform: rotate(5deg) scale(1.05);
                    cursor: grabbing;
                    z-index: 1000;
                    transition: none;
                }

                .gallery-item.placeholder {
                    background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                                linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                                linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                                linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                    border: 2px dashed #ccc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    transition: all 0.3s ease;
                }

                .gallery-item.placeholder.drag-over {
                    border-color: #007bff;
                    background-color: rgba(0, 123, 255, 0.1);
                    transform: scale(1.02);
                }

                .placeholder-content {
                    color: #666;
                    font-weight: 600;
                    text-align: center;
                    pointer-events: none;
                }

                /* Size Controls */
                .size-controls {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    gap: 4px;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    z-index: 10;
                }

                .size-btn {
                    width: 28px;
                    height: 28px;
                    border: 2px solid rgba(255, 255, 255, 0.8);
                    background: rgba(0, 0, 0, 0.6);
                    color: white;
                    border-radius: 50%;
                    font-size: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(4px);
                }

                .size-btn:hover {
                    background: rgba(0, 123, 255, 0.8);
                    border-color: white;
                    transform: scale(1.1);
                }

                .size-btn.active {
                    background: #007bff;
                    border-color: white;
                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
                }

                /* Size transition animations */
                .gallery-item.size-changing {
                    transform: scale(1.1);
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    z-index: 100;
                }

                .drag-info {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    text-align: center;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .drag-info p {
                    margin: 0;
                    font-size: 0.95rem;
                }

                .gallery-grid.drag-active {
                    background-color: rgba(0, 123, 255, 0.05);
                    border-radius: 10px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }

                /* Prevent image dragging interference */
                .gallery-item img {
                    pointer-events: none;
                    user-select: none;
                    -webkit-user-drag: none;
                }

                /* Context menu styles */
                .context-menu {
                    position: fixed;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    padding: 8px 0;
                    z-index: 10000;
                    min-width: 150px;
                }

                .context-menu-item {
                    padding: 8px 16px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .context-menu-item:hover {
                    background-color: #f5f5f5;
                }

                .context-menu-item.active {
                    background-color: #007bff;
                    color: white;
                }

                /* Mobile touch support */
                @media (max-width: 768px) {
                    .gallery-item[draggable="true"]:active {
                        transform: scale(1.05);
                        opacity: 0.8;
                    }

                    .size-controls {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .size-btn {
                        width: 32px;
                        height: 32px;
                        font-size: 14px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initializeSizeControls() {
        // Set initial active states for size buttons
        const items = this.gallery.querySelectorAll('.gallery-item:not(.placeholder)');
        items.forEach(item => {
            this.updateSizeButtonStates(item);
        });
    }

    updateSizeButtonStates(item) {
        const currentSize = item.dataset.size;
        const buttons = item.querySelectorAll('.size-btn');
        
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === currentSize);
        });
    }

    handleSizeButtonClick(e) {
        if (!e.target.classList.contains('size-btn')) return;
        
        e.preventDefault();
        e.stopPropagation();

        const button = e.target;
        const newSize = button.dataset.size;
        const item = button.closest('.gallery-item');
        
        this.changeItemSize(item, newSize);
    }

    handleDoubleClick(e) {
        const item = e.target.closest('.gallery-item');
        if (!item || item.classList.contains('placeholder')) return;

        e.preventDefault();
        
        // Cycle to next size
        const currentSize = item.dataset.size;
        const currentIndex = this.sizes.indexOf(currentSize);
        const nextIndex = (currentIndex + 1) % this.sizes.length;
        const nextSize = this.sizes[nextIndex];
        
        this.changeItemSize(item, nextSize);
    }

    handleRightClick(e) {
        const item = e.target.closest('.gallery-item');
        if (!item || item.classList.contains('placeholder')) return;

        e.preventDefault();
        
        this.showContextMenu(e, item);
    }

    changeItemSize(item, newSize) {
        const oldSize = item.dataset.size;
        if (oldSize === newSize) return;

        // Add animation class
        item.classList.add('size-changing');
        
        // Update size after brief delay for animation
        setTimeout(() => {
            item.className = `gallery-item ${newSize}`;
            item.dataset.size = newSize;
            
            this.updateSizeButtonStates(item);
            
            // Remove animation class
            setTimeout(() => {
                item.classList.remove('size-changing');
            }, 400);
            
        }, 100);

        // Show feedback
        this.showSizeChangeFeedback(oldSize, newSize);
        
        // Save arrangement
        this.saveArrangement();
    }

    showContextMenu(e, item) {
        // Remove existing context menu
        this.removeContextMenu();

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';

        const currentSize = item.dataset.size;

        this.sizes.forEach(size => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            if (size === currentSize) {
                menuItem.classList.add('active');
            }
            
            const sizeIcon = size === 'small' ? '🔸' : size === 'medium' ? '🔶' : '🔷';
            menuItem.innerHTML = `${sizeIcon} ${size.charAt(0).toUpperCase() + size.slice(1)}`;
            
            menuItem.addEventListener('click', () => {
                this.changeItemSize(item, size);
                this.removeContextMenu();
            });
            
            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        // Remove menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', this.removeContextMenu.bind(this), { once: true });
        }, 100);
    }

    removeContextMenu() {
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    showSizeChangeFeedback(oldSize, newSize) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #17a2b8;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
            transform: translateX(300px);
            transition: transform 0.3s ease;
        `;
        message.textContent = `📏 Changed from ${oldSize} to ${newSize}`;
        document.body.appendChild(message);

        // Animate in
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            message.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 2000);
    }

    // Enhanced drag functionality
    handleDragStart(e) {
        if (!e.target.classList.contains('gallery-item')) return;

        this.draggedItem = e.target;
        e.target.classList.add('dragging');
        this.gallery.classList.add('drag-active');

        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        e.dataTransfer.setData('text/plain', ''); // For iOS compatibility

        // Create drag image (optional - browser will use element itself)
        const dragImage = e.target.cloneNode(true);
        dragImage.style.transform = 'rotate(5deg)';
        e.dataTransfer.setDragImage(dragImage, 0, 0);

        setTimeout(() => {
            if (this.draggedItem) {
                this.draggedItem.style.display = 'none';
            }
        }, 0);
    }

    handleDragEnd(e) {
        if (!e.target.classList.contains('gallery-item')) return;

        e.target.classList.remove('dragging');
        this.gallery.classList.remove('drag-active');
        
        // Show the item again
        if (this.draggedItem) {
            this.draggedItem.style.display = '';
        }

        // Remove any placeholders
        this.removePlaceholder();
        
        this.draggedItem = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const afterElement = this.getDragAfterElement(this.gallery, e.clientY, e.clientX);
        const draggedElement = this.draggedItem;

        if (!draggedElement) return;

        // Remove existing placeholder
        this.removePlaceholder();

        // Set placeholder size to match dragged item
        if (draggedElement.dataset.size) {
            this.placeholder.className = `gallery-item placeholder ${draggedElement.dataset.size}`;
        }

        if (afterElement == null) {
            this.gallery.appendChild(this.placeholder);
        } else {
            this.gallery.insertBefore(this.placeholder, afterElement);
        }
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.target === this.placeholder) {
            this.placeholder.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        if (e.target === this.placeholder) {
            this.placeholder.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedItem || !this.placeholder.parentNode) return;

        // Insert the dragged element before the placeholder
        this.gallery.insertBefore(this.draggedItem, this.placeholder);
        
        // Remove placeholder
        this.removePlaceholder();

        // Show success feedback
        this.showSuccessFeedback();

        // Save the new arrangement (optional - could save to localStorage)
        this.saveArrangement();
    }

    getDragAfterElement(container, y, x) {
        const draggableElements = [...container.querySelectorAll('.gallery-item:not(.dragging):not(.placeholder)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            
            // Calculate distance from cursor to center of element
            const centerY = box.top + box.height / 2;
            const centerX = box.left + box.width / 2;
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            
            if (distance < closest.distance) {
                return { distance: distance, element: child };
            } else {
                return closest;
            }
        }, { distance: Number.POSITIVE_INFINITY }).element;
    }

    removePlaceholder() {
        if (this.placeholder && this.placeholder.parentNode) {
            this.placeholder.parentNode.removeChild(this.placeholder);
            this.placeholder.classList.remove('drag-over');
        }
    }

    showSuccessFeedback() {
        // Create temporary success message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            transform: translateX(300px);
            transition: transform 0.3s ease;
        `;
        message.textContent = '✓ Gallery rearranged!';
        document.body.appendChild(message);

        // Animate in
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            message.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 2000);
    }

    saveArrangement() {
        // Optional: Save current arrangement to localStorage
        try {
            const items = [...this.gallery.querySelectorAll('.gallery-item:not(.placeholder)')];
            const arrangement = items.map(item => {
                const img = item.querySelector('img');
                return {
                    src: img ? img.src : '',
                    alt: img ? img.alt : '',
                    size: item.dataset.size || 'medium'
                };
            });
            localStorage.setItem('galleryArrangement', JSON.stringify(arrangement));
        } catch (e) {
            console.log('Could not save arrangement to localStorage');
        }
    }

    loadArrangement() {
        // Optional: Load saved arrangement from localStorage
        try {
            const saved = localStorage.getItem('galleryArrangement');
            if (saved) {
                const arrangement = JSON.parse(saved);
                // Implementation would reconstruct the gallery from saved data
                // This is optional functionality
            }
        } catch (e) {
            console.log('Could not load arrangement from localStorage');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryDragDrop();
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    // Simple touch drag implementation could be added here
    // For now, we rely on mobile browsers' built-in drag support
} 