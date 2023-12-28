from django.shortcuts import render
from django.http import HttpResponse 
import pydicom
import os
import io
from PIL import Image
import base64

def home(request): 
    return render(request, 'index.html') 

def viewer(request): 
    return render(request, 'index1.html') 

def calcul(request): 
    return render(request, 'calcul.html') 


import numpy as np

def normalize_image(image_array):
    # Normalize the image pixel values to fit in 8-bit range (0-255)
    min_val = np.min(image_array)
    max_val = np.max(image_array)
    normalized_array = ((image_array - min_val) / (max_val - min_val)) * 255
    return normalized_array.astype('uint8')

def convert_dicom_to_jpeg(request):
    if request.method == 'POST' and request.FILES.get('dicom_file'):
        dicom_file = request.FILES['dicom_file']
        
        # Save the uploaded DICOM file temporarily
        with open('temp.dcm', 'wb+') as destination:
            for chunk in dicom_file.chunks():
                destination.write(chunk)

        # Read the DICOM file using pydicom
        dicom_data = pydicom.dcmread('temp.dcm')

        # Check if DICOM file contains pixel data
        if 'PixelData' in dicom_data:
            # Get pixel array from DICOM data
            dicom_image = dicom_data.pixel_array

            # Normalize the pixel values to fit in 8-bit range
            normalized_image = normalize_image(dicom_image)

            # Create an image from the normalized pixel array
            image = Image.fromarray(normalized_image)

            # Convert the image to a JPEG byte stream
            img_byte_array = io.BytesIO()
            image.save(img_byte_array, format='JPEG')
            img_byte_array.seek(0)

            # Encode the JPEG byte stream in base64
            img_base64 = base64.b64encode(img_byte_array.getvalue()).decode()

            # Render the HTML with the embedded image
            context = {'image_data': img_base64}
            return render(request, 'index1.html', context)

            
        else:
            return HttpResponse("DICOM file does not contain pixel data.")
    
    return render(request, 'conver.html')
