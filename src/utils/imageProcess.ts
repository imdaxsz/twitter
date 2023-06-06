import { dataURItoFile } from "./common";

type HandleCompressImageFun = (compressImage: (imageFile: File) => Promise<File | undefined>, newFile: string | null, setNewImage: React.Dispatch<React.SetStateAction<string | null>>) => void;

export const handleCompressImage: HandleCompressImageFun = async (compressImage, newFile, setNewImage) => {
  let imageFile: File;
  let compressedImage;
  if (newFile) {
    imageFile = dataURItoFile(newFile);
    compressedImage = await compressImage(imageFile);
  }

  if (!compressedImage) return;
  const reader = new FileReader();
  reader.readAsDataURL(compressedImage); //data_url
  reader.onloadend = (finishedEvent) => {
    // console.log(finishedEvent);
    if (finishedEvent.target && typeof finishedEvent.target.result == "string") {
      setNewImage(finishedEvent.target.result);
    }
  };
};