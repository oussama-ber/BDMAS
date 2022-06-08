import React, { useRef, useState, useEffect } from "react";
//MUI
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
// ICONS
import SvgIcon from "@mui/material/SvgIcon";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import "../FormElements/ImageUpload.css";
const UploadImageButton = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState(props.image);
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
      // props.getImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
      props.getImage(pickedFile);
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    // props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      {/* <div className={`image-upload ${props.center && "center"}`}> */}
      {/* <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div> */}
      <ButtonBase
        type="button"
        onClick={pickImageHandler}
        variant="contained"
        component="span"
      >
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}{" "}
          {!previewUrl && (
            <SvgIcon fontSize="large" color="info">
              <AddPhotoAlternateIcon className="fit" fontSize="large" />
            </SvgIcon>
          )}
        </div>
      </ButtonBase>
      {/* </div> */}
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};
export default UploadImageButton;
