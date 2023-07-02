/**
 * Internal API to get an image from a blob
 *
 * @module @ignore
 */
import { useEffect, useState } from 'react';

type UseImageFromBlobOptions = {
  /**
   * The fallback image source to use if the image is not loaded yet, or if there was an error.
   */
  fallbackImageSource: string;
  /**
   * The onload callback to call when the image successfully loaded.
   */
  onload?: (image: HTMLImageElement) => void;
  /**
   * The loading state of the image.
   */
  isLoading: boolean;
  /**
   * The error state of the image.
   */
  isError: boolean;
  /**
   * The image blob.
   */
  data: Blob | undefined;
};

/**
 * A hook to return an image element from a blob.
 * While the image is loading or if there was an error it returns a fallback image.
 *
 * @returns The image element with the blob as source
 */
export function useImageFromBlob({
  isLoading,
  isError,
  data,
  fallbackImageSource,
  onload,
}: UseImageFromBlobOptions) {
  const [image, setImage] = useState(createImage(fallbackImageSource));

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }

    const blob = new Blob([data as BlobPart]);
    const objectUrl = URL.createObjectURL(blob);

    const newImage = new window.Image();
    newImage.src = objectUrl;
    newImage.onload = () => {
      onload?.(newImage);
    };
    setImage(newImage);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [data, onload, isLoading, isError]);

  return image;
}

function createImage(src: string) {
  const newImage = new window.Image();
  newImage.src = src;
  return newImage;
}