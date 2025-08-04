"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";
import ImageKit from "imagekit";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

// this interface defines the props for the FileUpload component
interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

// FileUpload component allows users to upload images or videos using ImageKit
const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null); // ref to the IKUpload component
  // useState to manage the file state and progress of the upload
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  // useState to manage the upload progress
  const [progress, setProgress] = useState(0);
  
  // Define styles based on the variant prop
  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };
  
  // onError is called when there is an error during the upload process , it logs the error and shows a toast notification
  const onError = (error: any) => {
    console.log(error);
    toast({
      title: `${type} upload failed`,
      description: `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  }; 
  // onSuccess is called when the upload is successful, it sets the file state and shows a success toast notification
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: `${type} uploaded successfully`,
      description: `${res.filePath} uploaded successfully!`,
    });
  };
  
  // onValidate is called to validate the file before uploading, it checks the file size based on the type (image or video) and shows a toast notification if the file size exceeds the limit
  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File size too large",
          description: "Please upload a file that is less than 20MB in size",
          variant: "destructive",
        });

        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File size too large",
          description: "Please upload a file that is less than 50MB in size",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      {/* // IKUpload component is used to handle the file upload process */}
      <IKUpload
        ref={ikUploadRef}
        onError={onError} // this prop is used to handle errors during the upload process
        onSuccess={onSuccess} // this prop is used to handle successful uploads
        useUniqueFileName={true} // this prop ensures that the uploaded file has a unique name
        validateFile={onValidate} // this prop is used to validate the file before uploading
        onUploadStart={() => setProgress(0)} // this prop is called when the upload starts, it resets the progress to 0
        
        //onUploadProgress is called during the upload process, it updates the progress state based on the loaded and total bytes
        onUploadProgress={({ loaded, total }) => {
          // loaded is the number of bytes loaded so far, total is the total number of bytes to be uploaded
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent); // update the progress state with the calculated percentage
        }}

        folder={folder} // this prop specifies the folder where the uploaded file will be stored in ImageKit
        accept={accept} // this prop specifies the file types that can be uploaded
        className="hidden" // this prop hides the IKUpload component from the UI, as we are using a custom button to trigger the upload
      />
      
      {/* button to trigger the file upload process */}
      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        {/*Display the upload icon and placeholder text inside button */}
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        {/* Display the placeholder text when no file is uploaded */}
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
        
        {/* Display the file path when a file is uploaded */}
        {file && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
      </button>
        
        {/* Display the progress bar when the upload is in progress */}
      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file.filePath &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}

      {file.filePath && (
        <IKImage alt={file.filePath} path={file.filePath} width={500} height={300} />
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
