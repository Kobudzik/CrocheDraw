export async function handleImportImage(board) {
  try {
    const image = await importImage(board.canvas.width, board.canvas.height);
    board.replaceCanvasWithOther(image);
  } catch (error) {
    console.error("Error importing image:", error);
  }
}

function importImage(width, height) {
  return new Promise((resolve, reject) => {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/*";

    inputFile.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) {
        return reject(new Error("No file selected"));
      }

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const processedImage = await processImage(fileReader.result, width, height);
          resolve(processedImage);
        } catch (error) {
          reject(error);
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsDataURL(file);
    });

    inputFile.click();
  });
}

function processImage(imageDataURL, width, height) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageDataURL;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        return reject(new Error("Failed to get canvas 2D context"));
      }

      context.drawImage(image, 0, 0, width, height);

      try {
        const imageData = context.getImageData(0, 0, width, height);
        const simplifiedImageData = simplifyColors(imageData);
        context.putImageData(simplifiedImageData, 0, 0);
        resolve(context);
      } catch (e) {
        reject(e);
      }
    };

    image.onerror = reject;
  });
}

function simplifyColors(imageData) {
  const data = imageData.data;
  const colorMap = window.colors;
  const simplifiedData = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    let minDist = Infinity;
    let closestColor = colorMap[0];

    for (const color of colorMap) {
      const dist = colorDistance([r, g, b, a], color);
      if (dist < minDist) {
        minDist = dist;
        closestColor = color;
      }
    }

    // Debugging output
    // Skip logging for black or white
    if (
      !(
        (
          (closestColor[0] === 0 && closestColor[1] === 0 && closestColor[2] === 0) || // Black
          (closestColor[0] === 255 && closestColor[1] === 255 && closestColor[2] === 255)
        ) //white
      )
    ) {
      console.log(`Original Color: [${r}, ${g}, ${b}, ${a}]`);
      console.log(`Closest Color: [${closestColor[0]}, ${closestColor[1]}, ${closestColor[2]}, ${closestColor[3]}]`);
      console.log(`Distance: ${minDist}`);
    }

    simplifiedData[i] = closestColor[0];
    simplifiedData[i + 1] = closestColor[1];
    simplifiedData[i + 2] = closestColor[2];
    simplifiedData[i + 3] = closestColor[3];
  }

  return new ImageData(simplifiedData, imageData.width, imageData.height);
}

// Calculate Euclidean distance between two colors
function colorDistance(c1, c2) {
  return Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2) + Math.pow(c1[2] - c2[2], 2) + Math.pow(c1[3] - c2[3], 2));
}
