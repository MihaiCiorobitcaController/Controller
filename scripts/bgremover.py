from PIL import Image
import os

def crop_transparent_boundary(image):
    image = image.convert('RGBA')
    alpha = image.split()[3]
    bbox = alpha.getbbox()
    return image.crop(bbox)

if __name__ == "__main__":
    images = os.listdir("images")
    for image in images:
        print(image)
        input_image_path = f"cars/{image}"
        input_image = Image.open(input_image_path)
        cropped_image = crop_transparent_boundary(input_image)
        output_image_path = f"cars/{image}"
        cropped_image.save(output_image_path)
