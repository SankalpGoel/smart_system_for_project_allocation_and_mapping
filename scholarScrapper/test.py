import google.generativeai as genai

# Configure API key
genai.configure(api_key="AIzaSyAg4l5REk8t3Ug5Hbtbca7_hiylXKEHYGQ")

# Initialize the model (Gemini Pro)
model = genai.GenerativeModel("gemini-2.5-flash")

# Prompt the model
response = model.generate_content("""A Comprehensive Analysis of Block Chain-Based Crypto Currency Systems for Real-World Adoption
        Unveiling the Future: A Review of Financial Fraud Detection Using Artificial Intelligence Techniques
        A Comprehensive Review on Energy Efficient Internet of Things based Wireless Sensor Network
        A Comprehensive Survey on Production of Fabric from the Organic Extract
        Enhancing Brain Tumor Diagnosis: Utilizing ResNet-101 on MRI Images for Detection
        A Review of Recent Advances in Classification and Prediction of Brain Tumor using Deep Learning
        AI based Yoga Trainer - Simplifying home yoga using mediapipe and video streamin
        Automated Face Spoofing Detection using Machine Learning: A Review
        Classification of imbalanced medical data: An empirical study of machine learning approaches
        Digital Yoga Game with Enhanced Pose Grading Model/n 
        These are the titles i want to extract the important keywords from each and every title 
        that will describe the idea and domain of the title and give the keywords in python list form in response""" )

# Print the response
print(response.text)
