from flask import Flask, request, jsonify
from orcid_scraper import get_orcid_titles
from scopus_scraper import get_scopus_titles
import google.generativeai as genai

# Configure Gemini API key
genai.configure(api_key="AIzaSyAg4l5REk8t3Ug5Hbtbca7_hiylXKEHYGQ")

# Initialize Gemini Pro model
model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)

@app.route("/scrape-faculty", methods=["POST"])
def scrape_faculty():
    try:
        data = request.json
        orcid = data.get("orcid", "").strip()
        scopus = data.get("scopus", "").strip()

        if not orcid and not scopus:
            return jsonify({"error": "Missing ORCID or Scopus ID"}), 400

        # Step 1: Get titles from ORCID and/or Scopus
        titles = []
        if orcid:
            titles += get_orcid_titles(orcid)
        if scopus:
            titles += get_scopus_titles(scopus)

        if not titles:
            return jsonify({"error": "No titles found from ORCID/Scopus."}), 404

        # Step 2: Prompt Gemini for keywords
        title_text = "\n".join(titles)
        prompt = f"""These are the research paper titles:\n{title_text}\n\n i want to extract the important keywords from each and every title 
        that will describe the idea and domain of the title and give only the extracted keywords in python list form in response no need to give any other textr other than the extracted keywords and ignore if no generic titles are extracted.
        Example response:[keyword1, keyword2, keyword3, keywords4,........keywordN]
        Donot give any introductory line and no need to give title names only give the extarcted keywords as it is in the respone."""

        response = model.generate_content(prompt)
        keywords = response.text.strip()

        # Step 3: Return the keywords and titles (if needed for debugging)
        return jsonify({
            "keywords": keywords,
            "titles": titles
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
