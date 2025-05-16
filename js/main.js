// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const imageUpload = document.getElementById("image-upload");
  const uploadedImage = document.getElementById("uploaded-image");
  const uploadedImageContainer = document.getElementById(
    "uploaded-image-container"
  );
  const uploadedImageBorder = document.getElementById("uploaded-image-border");
  const froggerTemplate = document.getElementById("frogger-template");
  const pfpContainer = document.querySelector(".pfp-container");
  const scaleSlider = document.getElementById("scale-slider");
  const rotateSlider = document.getElementById("rotate-slider");
  const rotationDisplay = document.getElementById("rotation-display");
  const downloadButton = document.getElementById("download-button");

  let currentScale = 1;
  let currentRotation = 0;
  let currentX = 0;
  let currentY = 0;
  let isDragging = false;
  let startX, startY;
  let originalImageWidth, originalImageHeight;
  let maxScale = 1; // Giới hạn scale tối đa

  // Độ dày border từ CSS
  const borderWidthPx = 10; // Thay đổi từ 32px sang 10px theo CSS

  if (
    !imageUpload ||
    !uploadedImage ||
    !uploadedImageBorder ||
    !scaleSlider ||
    !rotateSlider ||
    !rotationDisplay ||
    !downloadButton ||
    !pfpContainer ||
    !froggerTemplate ||
    !uploadedImageContainer
  ) {
    console.error(
      "One or more DOM elements were not found. Please check your IDs."
    );
    return;
  }

  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImage.src = e.target.result;
        uploadedImage.classList.remove("hidden");
        downloadButton.disabled = false;

        uploadedImage.onload = () => {
          originalImageWidth = uploadedImage.naturalWidth;
          originalImageHeight = uploadedImage.naturalHeight;

          // Lấy kích thước của container
          const containerWidth = pfpContainer.offsetWidth;
          const containerHeight = pfpContainer.offsetHeight;

          // Tính toán tỷ lệ scale tối đa để ảnh không vượt quá kích thước của template
          const scaleX = containerWidth / originalImageWidth;
          const scaleY = containerHeight / originalImageHeight;
          maxScale = Math.min(scaleX, scaleY);

          // Giới hạn scale slider
          scaleSlider.max = maxScale * 1.5; // Cho phép scale lớn hơn một chút so với max để người dùng có thể điều chỉnh

          // Đặt scale ban đầu để ảnh vừa với container
          currentScale = Math.min(1, maxScale * 0.8); // 80% của maxScale để có margin
          scaleSlider.value = currentScale;

          // Đặt kích thước rõ ràng cho ảnh
          uploadedImage.style.width = originalImageWidth + "px";
          uploadedImage.style.height = originalImageHeight + "px";

          // Kích thước của uploadedImageBorder
          const borderElementWidth = originalImageWidth + 2 * borderWidthPx;
          const borderElementHeight = originalImageHeight + 2 * borderWidthPx;

          uploadedImageBorder.style.width = borderElementWidth + "px";
          uploadedImageBorder.style.height = borderElementHeight + "px";

          // Căn giữa cả ảnh và viền trong container
          uploadedImageBorder.style.left = `${
            (containerWidth - borderElementWidth) / 2
          }px`;
          uploadedImageBorder.style.top = `${
            (containerHeight - borderElementHeight) / 2
          }px`;

          // Hiển thị viền
          uploadedImageBorder.classList.remove("hidden");

          resetTransformations();
        };
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
      uploadedImage.src = "#";
      uploadedImage.classList.add("hidden");
      uploadedImageBorder.classList.add("hidden");
      downloadButton.disabled = true;
      resetTransformations();
    }
  });

  function updateRotationDisplay() {
    const displayAngle = ((currentRotation % 360) + 360) % 360;
    let displayText = `${displayAngle}°`;
    const turns = Math.floor(currentRotation / 360);
    if (turns !== 0) {
      displayText = `${displayAngle}° (${turns > 0 ? "+" : ""}${turns} turn${
        Math.abs(turns) > 1 ? "s" : ""
      })`;
    }
    rotationDisplay.textContent = displayText;
  }

  function resetTransformations() {
    currentScale = Math.min(1, maxScale * 0.8); // Đảm bảo scale ban đầu không vượt quá giới hạn
    currentRotation = 0;
    currentX = 0;
    currentY = 0;
    scaleSlider.value = currentScale;
    rotateSlider.value = 0;
    updateRotationDisplay();
    applyTransformations();
  }

  scaleSlider.addEventListener("input", () => {
    currentScale = parseFloat(scaleSlider.value);
    // Giới hạn scale không vượt quá maxScale
    if (currentScale > maxScale * 1.5) {
      currentScale = maxScale * 1.5;
      scaleSlider.value = currentScale;
    }
    applyTransformations();
  });

  rotateSlider.addEventListener("input", () => {
    currentRotation = parseInt(rotateSlider.value);
    updateRotationDisplay();
    applyTransformations();
  });

  function applyTransformations() {
    const transformOrigin = "center center";
    const transformValue = `translate(${currentX}px, ${currentY}px) scale(${currentScale}) rotate(${currentRotation}deg)`;

    if (uploadedImage.src && uploadedImage.src !== "#") {
      uploadedImage.style.transformOrigin = transformOrigin;
      uploadedImage.style.transform = transformValue;

      uploadedImageBorder.style.transformOrigin = transformOrigin;
      uploadedImageBorder.style.transform = transformValue;
      uploadedImageBorder.classList.remove("hidden");
    } else {
      // Reset transform cho cả ảnh và border nếu không có ảnh hợp lệ
      uploadedImage.style.transform = "none";
      uploadedImageBorder.style.transform = "none";
      uploadedImageBorder.classList.add("hidden");
    }
  }

  uploadedImage.addEventListener("mousedown", (e) => {
    if (!uploadedImage.src || uploadedImage.src === "#") return;
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    uploadedImage.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      applyTransformations();
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      uploadedImage.style.cursor = "grab";
    }
  });

  // Xử lý trường hợp chuột kéo ra ngoài cửa sổ trình duyệt
  document.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      uploadedImage.style.cursor = "grab";
    }
  });

  downloadButton.addEventListener("click", () => {
    if (
      !uploadedImage.src ||
      uploadedImage.src === "#" ||
      !originalImageWidth ||
      !originalImageHeight
    ) {
      alert("Please upload an image first.");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const containerWidth = pfpContainer.offsetWidth;
    const containerHeight = pfpContainer.offsetHeight;
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Tâm của pfpContainer, cũng là tâm xoay/scale cho ảnh
    const pfpCenterX = canvas.width / 2;
    const pfpCenterY = canvas.height / 2;

    ctx.save();
    // 1. Di chuyển context đến tâm đã bao gồm cả currentX, currentY (phần dịch chuyển do kéo)
    ctx.translate(pfpCenterX + currentX, pfpCenterY + currentY);
    // 2. Xoay quanh điểm này
    ctx.rotate((currentRotation * Math.PI) / 180);
    // 3. Scale quanh điểm này
    ctx.scale(currentScale, currentScale);
    // 4. Vẽ ảnh. Tâm của ảnh (originalImageWidth/2, originalImageHeight/2)
    //    phải được đặt tại (0,0) của context đã transform.
    //    Do đó, drawImage tại (-originalImageWidth/2, -originalImageHeight/2).
    ctx.drawImage(
      uploadedImage,
      -originalImageWidth / 2,
      -originalImageHeight / 2,
      originalImageWidth,
      originalImageHeight
    );
    ctx.restore();

    // Vẽ template frogger lên trên cùng
    if (froggerTemplate.complete && froggerTemplate.naturalWidth !== 0) {
      ctx.drawImage(froggerTemplate, 0, 0, canvas.width, canvas.height);
      triggerDownload(canvas);
    } else {
      // Xử lý trường hợp template chưa load (ví dụ, nếu src được set động)
      const tempFroggerImage = new Image();
      tempFroggerImage.crossOrigin = "anonymous"; // Nếu template từ domain khác
      tempFroggerImage.onload = () => {
        ctx.drawImage(tempFroggerImage, 0, 0, canvas.width, canvas.height);
        triggerDownload(canvas);
      };
      tempFroggerImage.onerror = () => {
        console.error(
          "Frogger template image could not be loaded for canvas drawing."
        );
        alert("Error drawing template. Download may be incomplete.");
        // Vẫn thử download phần ảnh đã vẽ được
        triggerDownload(canvas);
      };
      tempFroggerImage.src = froggerTemplate.src;
      // Không gọi triggerDownload ở đây nữa vì nó sẽ được gọi trong onload/onerror
    }
  });

  function triggerDownload(canvas) {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "frogger_pfp.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  updateRotationDisplay(); // Khởi tạo hiển thị xoay ban đầu
});
