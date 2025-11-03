
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const images = [];

        let selectedImage = null;
        let dragging = false;
        let resizing = false;
        let resizingCorner = null;

        function drawImage(image) {
            ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
        }

        function redraw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            images.forEach(drawImage);
        }

        function hitTest(image, x, y) {
            return (
                x >= image.x &&
                x <= image.x + image.width &&
                y >= image.y &&
                y <= image.y + image.height
            );
        }

        function handleMouseDown(event) {
            const x = event.clientX - canvas.getBoundingClientRect().left;
            const y = event.clientY - canvas.getBoundingClientRect().top;

            selectedImage = null;

            for (let i = images.length - 1; i >= 0; i--) {
                const image = images[i];
                if (hitTest(image, x, y)) {
                    selectedImage = image;
                    if (x > image.x + image.width - 10 && y > image.y + image.height - 10) {
                        resizing = true;
                        resizingCorner = 'bottom-right';
                    } else {
                        dragging = true;
                    }
                    break;
                }
            }

            if (!selectedImage) {
                dragging = false;
                resizing = false;
                resizingCorner = null;
            }
        }

        function handleMouseMove(event) {
            const x = event.clientX - canvas.getBoundingClientRect().left;
            const y = event.clientY - canvas.getBoundingClientRect().top;

            if (dragging) {
                selectedImage.x = x;
                selectedImage.y = y;
                redraw();
            } else if (resizing) {
                if (resizingCorner === 'bottom-right') {
                    selectedImage.width = x - selectedImage.x;
                    selectedImage.height = y - selectedImage.y;
                    redraw();
                }
            }
        }

        function handleMouseUp() {
            dragging = false;
            resizing = false;
            resizingCorner = null;
        }

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        // Allow images to be dropped onto the canvas.
        canvas.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        canvas.addEventListener('drop', (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) {
                const image = new Image();
                image.onload = function () {
                    images.push({
                        img: image,
                        x: 10,
                        y: 10,
                        width: 200,
                        height: 150,
                    });
                    redraw();
                };
                image.src = URL.createObjectURL(file);
            }
        });

        // Resize the canvas to fit the window and redraw when the window size changes.
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            redraw();
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();