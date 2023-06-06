import { useRef, useState, useEffect } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { VscClose } from "react-icons/vsc";
import md from "styles/modal.module.css";

interface PropsType {
  onCrop: (image: string) => void;
  aspectRatio: number;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageCropper = ({ aspectRatio, onCrop, modal, setModal }: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (inputRef.current && modal) inputRef.current.click();
  }, []);

  const onCancelClick = () => {
    setImage(null);
    setModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;

    if (!files) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
    e.target.value = "";
  };

  const getCropData = () => {
    if (cropperRef.current && typeof cropperRef.current.cropper !== "undefined") {
      onCrop(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
      setImage(null);
      setModal(false);
    }
  };

  return (
    <>
      {modal &&
        <div>
          <input
            type="file"
            ref={inputRef}
            style={{
              display: "none",
            }}
            onChange={handleFileChange}
          ></input>
          {image && (
            <div className="container crop-container">
              <div className="backdrop" />
              <div className={md.modal}>
                <div className={`${md.top} flex`}>
                  <div className={md.icon} onClick={onCancelClick}>
                    <VscClose className={md.svg} />
                  </div>
                  <span>미디어 수정</span>
                  <button className="btn xs black" onClick={getCropData}>
                    저장
                  </button>
                </div>
                <div className="content-wrapper ">
                  <div className="content crop-content">
                    <Cropper ref={cropperRef} aspectRatio={aspectRatio} src={image} viewMode={1} width={800} height={500} background={false} responsive autoCropArea={1} checkOrientation={false} guides />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </>
  );
};

export default ImageCropper;
