const filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  filterSlider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  saveImgBtn = document.querySelector(".save-img");
  saveImgBtn1 = document.querySelector(".save-img1");
const imageZoomSlider = document.getElementById('image-zoom');

let brightness = "100",
  saturation = "100",
  inversion = "0",
  grayscale = "0",
  contrast = "100",
  zoom = 1;
let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

  const loadImage = () => {
    // Check if an image is already loaded or handle image loading differently
    // Load an initial image or adjust the logic according to your requirement
    // For example:
    // const initialImageSrc = 'path_to_initial_image.jpg';
    // previewImg.src = initialImageSrc;

    // Reset filters and enable the editing interface
    resetFilter();
    document.querySelector(".container").classList.remove("disable");
};

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal * zoom}, ${flipVertical * zoom})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) contrast(${contrast}%)`;
};

filterOptions.forEach(option => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;

    } else if (option.id === "contrast") {
      filterSlider.max = "200";
      filterSlider.value = contrast;
      filterValue.innerText = `${contrast}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else if (selectedFilter.id === "contrast") {
    contrast = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

rotateOptions.forEach(option => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else if (option.id === "zoom-in") {
      zoom += 0.1;
    } else if (option.id === "zoom-out" && zoom > 0.1) {
      zoom -= 0.1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";
  contrast = "100";
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  zoom = 1;
  filterOptions[0].click();
  applyFilter();
};

const saveImageAndRedirect = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    // Apply filters and transformations to the canvas
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) contrast(${contrast}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // Get the image data as a base64-encoded URL
    const imageData = canvas.toDataURL();

    // Save the image data to localStorage
    localStorage.setItem('editedImageData', imageData);

    // Redirect to another HTML page
    window.location.href = '/calcul';
};

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) contrast(${contrast}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

const updateZoom = () => {
  zoom = parseFloat(imageZoomSlider.value);
  applyFilter();
};


filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImageAndRedirect);
saveImgBtn1.addEventListener("click", saveImage);
imageZoomSlider.addEventListener('input', updateZoom);

// Initial filter application
applyFilter();
