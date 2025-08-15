from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

@app.route("/recommend-faculty", methods=["POST"])
def recommend_faculty():
    data = request.get_json()
    student_domain = data["student_domain"]
    faculty_list = data["faculty"]  

   
    faculty_domains = [f["domainExpertise"] for f in faculty_list]

  
    corpus = [student_domain] + faculty_domains


    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(corpus)


    sim_scores = cosine_similarity(vectors[0:1], vectors[1:])[0]


    ranked_faculty = sorted(
        zip(faculty_list, sim_scores),
        key=lambda x: x[1],
        reverse=True
    )[:3]

    return jsonify({
        "student_domain": student_domain,
        "recommendations": [
            {
                "name": fac["name"],
                "email": fac["email"],
                "score": round(score, 3)
            } for fac, score in ranked_faculty
        ]
    })

if __name__ == "__main__":
    app.run(port=5001)
