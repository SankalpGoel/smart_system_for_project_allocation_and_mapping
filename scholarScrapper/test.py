import google.generativeai as genai

# Configure API key
genai.configure(api_key="AIzaSyB300izIXQLnzEKA_1PxXrQxvSFYpxMLc0")

# Initialize the model (Gemini Pro)
model = genai.GenerativeModel("gemini-2.5-flash")

# Prompt the model
response = model.generate_content("""
                                  A new framework for distributed clustering based data aggregation in WSN
                                  Rice Leaves Disease Detection Mechanism Using VGG16 Deep Learning Architecture
                                  Enhancing Security and Transparency in Video Conferencing Systems through Blockchain Integration
                                  A Machine Learning-Based Analysis of Stock Market Forecasting: A Review
                                  AI-Powered Approaches for Identifying Misinformation in Social Media Platforms
                                  Mechanism Using VGG16 Deep Learning

These are the research paper titles:\n{title_text}\n\n i want to extract the important keywords from each and every title 
that will describe the idea and domain of the title and give only the extracted keywords in python list form in response no need to give any other textr other than the extracted keywords and ignore if no generic titles are extracted.
Example response:[keyword1, keyword2, keyword3, keywords4,........keywordN]
Donot give any introductory line and no need to give title names only give the extarcted keywords as it is in the respone.""" )

# Print the response
print(response.text)
