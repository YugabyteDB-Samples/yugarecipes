import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

LLM_ECOSYSTEM=os.getenv('LLM_ECOSYSTEM')
LLM_EMBEDDING_MODEL = os.getenv('LLM_EMBEDDING_MODEL')
LLM_MULTIMODAL_MODEL=os.getenv('LLM_MULTIMODAL_MODEL')


if LLM_ECOSYSTEM == 'ollama':
    import ollama
else:
    from openai import OpenAI
    client = OpenAI()

import base64
from io import BytesIO

# from IPython.display import HTML, display
from PIL import Image


def convert_to_base64(pil_image):
    """
    Convert PIL images to Base64 encoded strings

    :param pil_image: PIL image
    :return: Re-sized Base64 string
    """

    buffered = BytesIO()
    pil_image.save(buffered, format="JPEG")  # Change the format if needed
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

def b64_encode_image(file_path): 
    pil_image = Image.open(file_path)
    image_b64 = convert_to_base64(pil_image)

    return image_b64

# Function to generate a description from an image file
def describe_image(file_path):
    image_b64 = b64_encode_image(file_path)
    custom_prompt = """You are an expert in identifying Indian cuisines. 
    Describe the most likely ingredients in the food pictured, taking into account the colors identified. 
    Only provide ingredients and adjectives to describe the food, including a guess as to the name of the dish. 
    Output this as a single paragraph of 2-3 sentences."""

    if(LLM_ECOSYSTEM == 'ollama'):
        response = ollama.generate(model=LLM_MULTIMODAL_MODEL, prompt=custom_prompt, images=[image_b64])
        return response['response']
    elif(LLM_ECOSYSTEM == 'openai'):     
        response = client.chat.completions.create(messages=[
            {"role": "system", "content": custom_prompt},
            {"role": "user", "content": [
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"},
            }]}
        ], model=LLM_MULTIMODAL_MODEL)

        return response.choices[0].message.content

# Function to generate embeddings for a given text
i = 0
def generate_embedding(text, print_count=None):
    if print_count == True:
        global i
        i+=1
        print(f"generating embedding: {i}")

    if LLM_ECOSYSTEM == 'ollama':
        embedding = ollama.embeddings(model=LLM_EMBEDDING_MODEL, prompt=text)
        return embedding['embedding']
    elif LLM_ECOSYSTEM == 'openai':
        response = client.embeddings.create(model=LLM_EMBEDDING_MODEL, input=text)
        embedding = response.data[0].embedding
        return embedding
    else:
        return "No Model Provided"
