from flask import render_template, jsonify, Flask, request, make_response
import io
# from flask_cors import CORS
import numpy as np
from PIL import Image
from keras import models
from openai import OpenAI
from keras.optimizers import Adam 

app = Flask(__name__)
CORS(app)
# Define skin classes for prediction results
SKIN_CLASSES = {
    0: 'None',
    1: 'Basal Cell Carcinoma',
    2: 'Benign Keratosis',
    3: 'None',
    4: 'Melanoma',
    5: 'Melanocytic Nevi',
    6: 'None'
}

# Function to return recommended medicine based on predicted disease
def findMedicine(pred: int) -> str:
    medicines = {
        0: "",
        1: "Aldara",
        2: "Prescription Hydrogen Peroxide",
        3: "",
        4: "fluorouracil (5-FU):",
        5: "Ipilimumab (Yervoy)",
        6: ""
    }
    return medicines.get(pred, "Unknown medicine")

# Load the Keras model once at startup
model = models.load_model('model.h5', compile=False)
model.compile(optimizer=Adam(learning_rate=0.000625), loss='categorical_crossentropy', metrics=['accuracy'])

@app.route('/detect', methods=['POST'])
def detect():
    json_response = {}
    print(request.files)
    if request.method == 'POST':
        try:
            if 'file' not in request.files:
                return make_response(jsonify({'error': 'No file part in the request', 'code': 'FILE', 'message': 'File is not valid or missing'}), 400)

            file = request.files['file']

            # Load and preprocess the image
            imagePil = Image.open(io.BytesIO(file.read()))
            print(f"Original image size: {imagePil.size}")  # Print original size
            
            if imagePil.mode != 'RGB':
                imagePil = imagePil.convert('RGB')  # Convert to RGB if necessary

            img = imagePil.resize((224, 224))
            img = np.array(img) / 255.0
            print(f"Image shape after resizing: {img.shape}")  # Print shape after resizing
            
            img = img.reshape((1, 224, 224, 3))  # Reshape to match model input

            # Make a prediction
            prediction = model.predict(img)
            pred = np.argmax(prediction)
            disease = SKIN_CLASSES.get(pred, "Unknown")
            accuracy = round(prediction[0][pred] * 100, 2)
            medicine = findMedicine(pred)

            json_response = {
                "detected": bool(pred != 2),  # Convert numpy.bool_ to Python bool
                "disease": disease,
                "accuracy": accuracy if disease != 'None' else 0,
                "medicine": medicine if  medicine else 'None',
                "img_path": file.filename,
            }
            print(json_response)
            return make_response(jsonify(json_response), 200)

        except Exception as e:
            app.logger.error(f"Error processing file: {e}")
            return make_response(jsonify({'error': str(e)}), 500)

    return make_response(jsonify({'error': 'Invalid request method'}), 400)


from flask import request, jsonify, make_response

@app.route('/chatBotData', methods=['POST'])
def chatBotData():
    try:
        data = request.get_json()
        user_message = data.get("message", "")

        if not user_message:
            return make_response(jsonify({"error": "User message is required"}), 400)

        # Initialize OpenAI client
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=""
            
        )

        # Generate chat completion
        completion = client.chat.completions.create(
            model="nvidia/llama-3.1-nemotron-70b-instruct",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5,
            top_p=0.7,
            max_tokens=1024,
            stream=True
        )

        # Collect the response text from the stream
        response_text = ""
        for chunk in completion:
            if chunk.choices[0].delta.content is not None:
                response_text += chunk.choices[0].delta.content

        # Return the response text as JSON
        return jsonify({"response": response_text}), 200

    except Exception as e:
        app.logger.error(f"Error in chatBotData: {e}")
        return make_response(jsonify({"error": str(e)}), 500)

if __name__ == "__main__":
    app.run(debug=True, port=5000)