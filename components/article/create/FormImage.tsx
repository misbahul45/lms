'use client';
import React, {  useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { deleteImage, uploadImage } from '@/actions/web.action';
import { CloudUploadIcon, ImageUpIcon, LoaderIcon, Trash2Icon } from 'lucide-react';
import { sleep } from '@/lib/utils';
import Loader from '@/components/Loaders/Loader';
import { Button } from '@/components/ui/button';
import { Image as TypeImage } from '@/types/web.types';
import WEB_VALIDATION from '@/validations/web.validation';



interface FormImageProps {
  image: TypeImage | null,
  setImage: React.Dispatch<React.SetStateAction<TypeImage>>;
}


const FormImage = ({ image, setImage }: FormImageProps) => {
  const [loading, setLoading] = useState({
    type: '',
    status: false
  });


  const handleRemoveImage = async () => {
    try {
      setLoading({ type: 'remove', status: true });
      await sleep();
      if (image?.fileId) await deleteImage(image.fileId);
      setImage({
        url: '',
        fileId: ''
      });
      toast.success("Image removed successfully!");
    } catch (error) {
      toast.error((error as Error).message);
    }
    setLoading({ type: '', status: false });
  };

  const handleUploadImage = async (file: File) => {
    try {
      setLoading({ type: 'upload', status: true });
      const res = await uploadImage(file);
      if (res?.url) {
        toast.success("Image uploaded successfully!");
        const imageURL=WEB_VALIDATION.URL.safeParse({url:res.url})
        if(imageURL.success){
          setImage(res);
        }
      } else {
        toast.error("Image upload failed.");
      }
    } catch (error) {
      if(error){
        toast.error("Image upload failed. Please try again.");
      }
    }
    setLoading({ type: '', status: false });
  };

  return (
      <Card className="border-none">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative border-4 border-gray-300 w-full max-w-xl mx-auto md:min-h-72 h-56 rounded-lg shadow-md">
              {image?.url ? (
                <Image
                  src={image.url}
                  alt="User Avatar"
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full md:h-72 h-56 flex items-center rounded-lg justify-center bg-gray-100 text-gray-500">
                    <ImageUpIcon className="md:size-20 size-12" />
                </div>
              )}
            </div>

            {image?.url ? (
              <Button
                variant="destructive"
                className="flex items-center space-x-2"
                onClick={handleRemoveImage}
                type="button"
                disabled={loading.status}
              >
                {loading.status && loading.type === 'remove' ? (
                  <Loader />
                ) : (
                  <>
                    <Trash2Icon className="h-5 w-5" />
                    <span>Remove Image</span>
                  </>
                )}
              </Button>
            ) : (
              <div>
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-primary transition"
                >
                  {loading.status && loading.type === 'upload' ? (
                    <LoaderIcon className="h-10 w-10 text-primary animate-spin" />
                  ) : (
                    <>
                      <CloudUploadIcon className="h-10 w-10 mb-2" />
                      <span className="text-sm font-medium">Upload Image Cover</span>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleUploadImage(e.target.files[0]);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
  );
};

export default FormImage;
