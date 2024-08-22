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
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;

      const context = tempCanvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);
      resolve(context);
    };

    image.onerror = reject;
  });
}
