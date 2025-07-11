// Free-form Gallery Designer with Alignment Guides
class FreeformGallery {
    constructor() {
        this.canvas = document.getElementById('galleryCanvas');
        if (!this.canvas) {
            console.error('Gallery canvas not found!');
            return;
        }
        this.items = [];
        this.init();
    }

    init() {
        this.setupStyles();
        
        // Find existing items in the HTML and create them, or use a default set
        const existingItems = this.canvas.querySelectorAll('.gallery-item-free');
        if (existingItems.length > 0) {
             existingItems.forEach(item => {
                this.items.push(item);
             });
        } else {
            // Default images if canvas is empty
            const defaultImages = [
                'assets/jpn_snow_scene.jpeg', 'assets/tw_white_house.jpeg', 
                'assets/jpn_train_color.jpeg', 'assets/phil_cat_overlook.jpeg', 'assets/raindrops_macro.jpeg', 
                'assets/tw_hualien_film.jpeg', 'assets/mt_fuji_view.jpeg', 'assets/jpn_park_bw.jpeg',
                'assets/jpn_birds_bw.jpeg', 'assets/shoes_artistic.jpeg', 'assets/jpn_train_bw.jpeg',
                'assets/phil_seascape.jpeg'
            ];
            defaultImages.forEach(src => {
                const item = this.createItem(src);
                this.canvas.appendChild(item);
                this.items.push(item);
            });
        }
        
        // Wait until all images have loaded before laying out
        let loadedCount = 0;
        const tryLayout = () => {
            loadedCount++;
            if (loadedCount === this.items.length) {
                const canvasWidth = Math.max(1200, this.canvas.offsetWidth);
                const canvasHeight = Math.max(1000, this.canvas.offsetHeight);
                this.applyCleanLayout(this.items, canvasWidth, canvasHeight);
            }
        };

        this.items.forEach(item => {
            const img = item.querySelector('img');
            if (img.complete && img.naturalWidth) {
                tryLayout();
            } else {
                img.addEventListener('load', () => {
                    console.log(`Image loaded: ${img.src}`);
                    tryLayout();
                });
                img.addEventListener('error', (e) => {
                    console.error(`Failed to load image: ${img.src}`, e);
                    tryLayout(); // still count to avoid hang
                });
            }
        });

        // Fallback timeout in case some images never trigger load/error events
        setTimeout(() => {
            if (loadedCount < this.items.length) {
                console.warn(`Timeout: Only ${loadedCount}/${this.items.length} images loaded, proceeding with layout anyway`);
                const canvasWidth = Math.max(1200, this.canvas.offsetWidth);
                const canvasHeight = Math.max(1000, this.canvas.offsetHeight);
                this.applyCleanLayout(this.items, canvasWidth, canvasHeight);
            }
        }, 5000); // 5 second timeout
    }

    setupStyles() {
        if (!document.getElementById('freeform-styles')) {
            const style = document.createElement('style');
            style.id = 'freeform-styles';
            style.textContent = `
                /* Canvas background - keep minimal */
                .gallery-canvas {
                    position: relative;
                    background: none; /* Removed background */
                    border: none; /* Removed border */
                    border-radius: 0;
                    min-height: 1000px;
                    width: 100%;
                    overflow: hidden;
                    margin: 20px 0;
                }

                .gallery-canvas.show-grid {
                    background-image: 
                        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }

                .gallery-item-free {
                    position: absolute;
                    cursor: default; /* Changed from move to default */
                    border: none; /* Removed border */
                    border-radius: 0;
                    overflow: hidden;
                    transition: none; /* Removed transition */
                    background: none; /* Removed background */
                    box-shadow: none; /* Removed shadow */
                }

                .gallery-item-free img {
                    width: 100%;
                    height: 100%;
                    max-width: 350px; /* Limit image width */
                    max-height: 250px; /* Limit image height */
                    object-fit: cover;
                    display: block;
                    pointer-events: none;
                }

                /* Toolbar */
                .gallery-toolbar {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .toolbar-btn {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .toolbar-btn:hover {
                    background: #f8f9fa;
                    border-color: #007bff;
                }

                .toolbar-btn.active {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                }

                /* Selection Info */
                .selection-info {
                    position: absolute;
                    bottom: -40px;
                    left: 0;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 1002;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .gallery-item-free.selected .selection-info {
                    opacity: 1;
                }

                /* Distance Indicators */
                .distance-indicator {
                    position: absolute;
                    background: rgba(0,123,255,0.1);
                    border: 1px dashed #007bff;
                    pointer-events: none;
                    z-index: 998;
                    font-size: 11px;
                    color: #007bff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .gallery-toolbar {
                        flex-wrap: wrap;
                    }
                    
                    .toolbar-btn {
                        font-size: 12px;
                        padding: 6px 12px;
                    }
                    
                    .resize-handle {
                        width: 12px;
                        height: 12px;
                    }
                    
                    .resize-handle.nw { top: -6px; left: -6px; }
                    .resize-handle.ne { top: -6px; right: -6px; }
                    .resize-handle.sw { bottom: -6px; left: -6px; }
                    .resize-handle.se { bottom: -6px; right: -6px; }
                    .resize-handle.n { top: -6px; }
                    .resize-handle.s { bottom: -6px; }
                    .resize-handle.e { right: -6px; }
                    .resize-handle.w { left: -6px; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupEventListeners() {
        // No event listeners needed for a static gallery
    }

    applyCleanLayout(items, canvasWidth, canvasHeight) {
        const margin = 20; // gap between items and rows
        this.smartOrientationLayout(items, margin, canvasWidth);
        this.updateCanvasSize();
    }

    smartOrientationLayout(items, margin, canvasWidth) {
        // Shuffle items for creativity, but handle phil_seascape specially
        let allItems = [...items];
        let seascapeItem = null;
        let otherItems = [];
        
        // Separate phil_seascape from other items
        allItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.src.includes('phil_seascape')) {
                seascapeItem = item;
            } else {
                otherItems.push(item);
            }
        });
        
        // Shuffle other items
        otherItems = otherItems.sort(() => Math.random() - 0.5);
        
        let currentY = margin;
        
        // Randomly decide where to place the seascape (beginning, middle, or end)
        const seascapePosition = Math.floor(Math.random() * 3); // 0=beginning, 1=middle, 2=end
        const totalOtherRows = Math.ceil(otherItems.length / 2.5); // Estimate number of rows for other items
        const middleRow = Math.floor(totalOtherRows / 2);
        
        let currentRow = 0;
        let i = 0;
        
        while (i < otherItems.length || seascapeItem) {
            // Check if it's time to place the seascape
            let placeSeascapeNow = false;
            if (seascapeItem) {
                if (seascapePosition === 0 && currentRow === 0) {
                    placeSeascapeNow = true; // Place at beginning
                } else if (seascapePosition === 1 && currentRow === middleRow) {
                    placeSeascapeNow = true; // Place in middle
                } else if (seascapePosition === 2 && i >= otherItems.length) {
                    placeSeascapeNow = true; // Place at end
                }
            }
            
            if (placeSeascapeNow) {
                // Place seascape taking full width
                currentY = this.layoutFullWidthRow([seascapeItem], currentY, margin, canvasWidth);
                seascapeItem = null; // Mark as placed
            } else {
                // Place 2-3 other items
                const remaining = otherItems.length - i;
                if (remaining <= 0) break;
                
                let itemsInRow;
                if (remaining === 1) {
                    itemsInRow = 1;
                } else if (remaining === 2) {
                    itemsInRow = 2;
                } else {
                    itemsInRow = Math.random() < 0.6 ? 3 : 2;
                }
                
                const rowItems = otherItems.slice(i, i + itemsInRow);
                currentY = this.layoutEqualRow(rowItems, currentY, margin, canvasWidth);
                i += itemsInRow;
            }
            
            currentRow++;
        }
        
        // If seascape wasn't placed yet (edge case), place it at the end
        if (seascapeItem) {
            currentY = this.layoutFullWidthRow([seascapeItem], currentY, margin, canvasWidth);
        }
        
        // Update canvas height
        this.canvas.style.height = `${currentY + margin}px`;
    }
    
    layoutEqualRow(rowItems, startY, margin, canvasWidth) {
        // Layout items equally in a row
        const availableWidth = canvasWidth - margin * (rowItems.length + 1);
        const itemWidth = availableWidth / rowItems.length;
        
        let maxHeight = 0;
        let currentX = margin;
        
        // First pass: calculate dimensions and find max height
        const itemData = rowItems.map(item => {
            const size = this.getOriginalImageSize(item);
            const scaleFactor = itemWidth / size.width;
            const newWidth = itemWidth;
            const newHeight = size.height * scaleFactor;
            maxHeight = Math.max(maxHeight, newHeight);
            
            return { item, newWidth, newHeight };
        });
        
        // Second pass: apply positions with slight height adjustment for alignment
        itemData.forEach(({ item, newWidth, newHeight }) => {
            // Very slight height adjustment (max 3% difference) for better alignment
            const heightDiff = maxHeight - newHeight;
            const adjustedHeight = heightDiff < newHeight * 0.03 ? maxHeight : newHeight;
            
            item.style.width = `${newWidth}px`;
            item.style.height = `${adjustedHeight}px`;
            item.style.left = `${currentX}px`;
            item.style.top = `${startY}px`;
            
            currentX += newWidth + margin;
        });
        
        return startY + maxHeight + margin;
    }

    layoutFullWidthRow(rowItems, startY, margin, canvasWidth) {
        // Layout a single item taking full width
        const item = rowItems[0];
        const size = this.getOriginalImageSize(item);
        const availableWidth = canvasWidth - margin * 2;
        
        const scaleFactor = availableWidth / size.width;
        const newWidth = availableWidth;
        const newHeight = size.height * scaleFactor;
        
        item.style.width = `${newWidth}px`;
        item.style.height = `${newHeight}px`;
        item.style.left = `${margin}px`;
        item.style.top = `${startY}px`;
        
        return startY + newHeight + margin;
    }

    createGrid() {
        this.canvas.classList.toggle('show-grid', this.showGrid);
    }

    updateCanvasSize() {
        // Auto-expand canvas based on content
        const items = this.canvas.querySelectorAll('.gallery-item-free');
        let maxRight = 1000, maxBottom = 1000;
        
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            const right = rect.right - canvasRect.left + 50;
            const bottom = rect.bottom - canvasRect.top + 50;
            maxRight = Math.max(maxRight, right);
            maxBottom = Math.max(maxBottom, bottom);
        });
        
        this.canvas.style.minHeight = maxBottom + 'px';
    }

    // All mouse/touch event handlers and selection methods removed - images are now static

    // Drag functionality removed - images are now static

    // All drag methods removed - images are now static

    // All resize methods removed - images are now static

    // All snapping, guides, and selection UI methods removed - images are now static

    // Only the grid variation layout is kept for a clean, organized look.
    // All other layout functions (scattered, magazine, etc.) are removed.
    gridVariationLayout(items, margin, width, height) {
        // Aligned grid layout with better space utilization
        const cols = 4;
        const cellWidth = (width - margin) / cols; // Reduced margin usage
        const rows = Math.ceil(items.length / cols);
        const rowHeights = [];

        // First pass: determine max height for each row to align them properly
        for (let r = 0; r < rows; r++) {
            let currentMaxHeight = 0;
            for (let c = 0; c < cols; c++) {
                const index = r * cols + c;
                if (index < items.length) {
                    const size = this.getOriginalImageSize(items[index]);
                    if (size.height > currentMaxHeight) {
                        currentMaxHeight = size.height;
                    }
                }
            }
            rowHeights[r] = currentMaxHeight + 20; // Reduced vertical spacing from 40 to 20
        }

        const rowTops = [margin / 2]; // Reduced top margin
        for(let i = 0; i < rowHeights.length - 1; i++){
            rowTops.push(rowTops[i] + rowHeights[i]);
        }

        items.forEach((item, index) => {
            const size = this.getOriginalImageSize(item);
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            // Center the item within its cell
            const left = (margin / 2) + col * cellWidth + (cellWidth - size.width) / 2;
            const top = rowTops[row] + (rowHeights[row] - 20 - size.height) / 2;

            const position = { left: Math.max(margin / 2, left), top: Math.max(margin / 2, top) };

            item.style.left = position.left + 'px';
            item.style.top = position.top + 'px';
            item.style.width = size.width + 'px';
            item.style.height = size.height + 'px';
        });
    }

    masonryLayout(items, margin, canvasWidth) {
        // This function is now replaced by smartOrientationLayout
        // Keeping it for reference but not used
    }

    // All other layout functions have been removed.

    getOriginalImageSize(item) {
        const img = item.querySelector('img');
        if (!img) return { width: 160, height: 120 };
        
        // Create a temporary image to get original dimensions
        const tempImg = new Image();
        tempImg.src = img.src;
        
        // If image is already loaded, use natural dimensions
        if (tempImg.complete) {
            const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
            // Scale to a smaller reasonable size while maintaining aspect ratio
            const baseWidth = 160 + Math.random() * 100; // Reduced to 160-260px width
            return {
                width: Math.round(baseWidth),
                height: Math.round(baseWidth / aspectRatio)
            };
        }
        
        // Fallback: use current dimensions or estimate
        const currentWidth = item.offsetWidth || 160;
        const currentHeight = item.offsetHeight || 120;
        const aspectRatio = currentWidth / currentHeight;
        
        const baseWidth = 160 + Math.random() * 100; // Reduced to 160-260px width
        return {
            width: Math.round(baseWidth),
            height: Math.round(baseWidth / aspectRatio)
        };
    }

    // The checkCollision and findNonOverlappingPosition functions are kept
    // as they are used by the remaining layout function.
    checkCollision(rect1, rect2, minSpacing = 10) {
        // AABB collision detection with minimum spacing
        return !(rect1.left > rect2.left + rect2.width + minSpacing ||
                rect1.left + rect1.width < rect2.left - minSpacing ||
                rect1.top > rect2.top + rect2.height + minSpacing ||
                rect1.top + rect1.height < rect2.top - minSpacing);
    }

    findNonOverlappingPosition(existingItems, width, height, margin, canvasWidth, canvasHeight, maxAttempts = 100) {
        // Improved positioning with better space utilization
        const minSpacing = 10; // Reduced from 25 to 10 for better space utilization
        const sortedItems = existingItems.sort((a, b) => a.left - b.left);
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const position = {
                left: margin + Math.random() * (canvasWidth - width - margin * 2),
                top: margin + Math.random() * (canvasHeight - height - margin * 2)
            };
            
            let hasCollision = false;
            for (const item of sortedItems) {
                if (this.checkCollision(position, { width, height }, item, minSpacing)) {
                    hasCollision = true;
                    break;
                }
            }
            
            if (!hasCollision) {
                return position;
            }
        }
        
        // If no non-overlapping position found, use spiral distribution
        return this.generateSpiralPositions(existingItems.length, canvasWidth, canvasHeight, margin)[0] || 
               { left: margin, top: margin };
    }

    generateSpiralPositions(count, canvasWidth, canvasHeight, margin) {
        // This function is kept as a fallback for positioning.
        const positions = [];
        if (count === 0) return positions;
        
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const cellWidth = (canvasWidth - margin * 2) / cols;
        const cellHeight = (canvasHeight - margin * 2) / rows;
        
        for (let i = 0; i < count; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = margin + col * cellWidth + cellWidth / 2;
            const y = margin + row * cellHeight + cellHeight / 2;
            positions.push({ x, y });
        }
        
        return positions;
    }

    createItem(src, left = 0, top = 0, width = 180, height = 135) { /* Reduced from 200x150 to 180x135 */
        const item = document.createElement('div');
        item.className = 'gallery-item-free';
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Gallery image';
        img.draggable = false;
        img.loading = 'lazy'; // Add lazy loading for better performance
        
        item.appendChild(img);
        
        return item;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new FreeformGallery();
    
    // Make it globally accessible for debugging
    window.gallery = gallery;
}); 