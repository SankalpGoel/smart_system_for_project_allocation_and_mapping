from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

# Initialize Flask
app = Flask(__name__)

# Load Sentence-BERT model (compact and accurate)
model = SentenceTransformer("all-mpnet-base-v2", cache_folder="./hf_models")


# Default number of recommendations
TOP_N = 5


@app.route("/recommend-faculty", methods=["POST"])
def recommend_faculty():
    """
    Recommend top-N faculty for a given student project idea+title.
    Uses BERT sentence embeddings + cosine similarity.
    """
    try:
        data = request.get_json()

        # Extract student project (title + idea concatenated)
        student_project = data.get("student_project", "")
        faculty_list = data.get("faculty", [])

        if not student_project or not faculty_list:
            return jsonify({"error": "Missing student_project or faculty data"}), 400

        # Step 1: Encode student project embedding
        student_embedding = model.encode(student_project, convert_to_tensor=True)

        recommendations = []

        # Step 2: Encode each faculty domain expertise & compute similarity
        for fac in faculty_list:
            domain = fac.get("domainExpertise", "")
            if not domain:
                continue  # skip faculty with no domain expertise

            faculty_embedding = model.encode(domain, convert_to_tensor=True)
            similarity_score = util.cos_sim(student_embedding, faculty_embedding).item()

            recommendations.append({
                "name": fac.get("name"),
                "email": fac.get("email"),
                "domain_expertise": domain,
                "similarity_score": round(similarity_score, 4)
            })

        # Step 3: Rank by similarity (descending order)
        recommendations = sorted(recommendations, key=lambda x: x["similarity_score"], reverse=True)

        # Step 4: Select top-N
        top_recommendations = recommendations[:TOP_N]

        return jsonify({
            "student_project": student_project,
            "recommendations": top_recommendations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------- Run Locally -------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)


