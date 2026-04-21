from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sentence_transformers import SentenceTransformer

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load the same model as recommend.py for consistency
model = SentenceTransformer("all-mpnet-base-v2", cache_folder="./hf_models")

print("🚀 Clustering service starting...")
print("📦 Loading Sentence-BERT model: all-mpnet-base-v2")


class StudentClusterer:
    def __init__(self, min_group_size=2, max_group_size=3):
        self.min_group_size = min_group_size
        self.max_group_size = max_group_size
    
    def get_embeddings(self, texts):
        """Convert text to embeddings using Sentence-BERT"""
        embeddings = model.encode(texts, convert_to_tensor=False)
        return embeddings
    
    def determine_optimal_clusters(self, embeddings, n_students):
        """Calculate optimal number of clusters"""
        # Aim for groups of 3, but flexible
        ideal_clusters = max(1, n_students // self.max_group_size)
        
        # Ensure we don't create too many clusters
        min_clusters = max(1, n_students // self.max_group_size)
        max_clusters = min(n_students // self.min_group_size, n_students)
        
        # Try different cluster counts and find best silhouette score
        if max_clusters > min_clusters and len(embeddings) > 3:
            best_score = -1
            best_n = ideal_clusters
            
            for n in range(min_clusters, min(max_clusters + 1, 10)):
                try:
                    kmeans = KMeans(n_clusters=n, random_state=42, n_init=10)
                    labels = kmeans.fit_predict(embeddings)
                    score = silhouette_score(embeddings, labels)
                    
                    if score > best_score:
                        best_score = score
                        best_n = n
                except:
                    continue
            
            return best_n
        else:
            return ideal_clusters
    
    def cluster_students(self, student_data):
        """
        Main clustering function
        student_data: List of dicts with keys: id, name, projectTitle, projectDomain
        """
        if len(student_data) < self.min_group_size:
            print(f"⚠️  Not enough students for clustering (got {len(student_data)})")
            return self._create_single_group(student_data)
        
        # Extract text for embedding (combine title + domain)
        texts = [
            f"{s['projectTitle']} {s['projectDomain']}" 
            for s in student_data
        ]
        
        print(f"📊 Clustering {len(student_data)} students...")
        
        # Get embeddings
        embeddings = self.get_embeddings(texts)
        
        # Determine optimal clusters
        n_clusters = self.determine_optimal_clusters(embeddings, len(student_data))
        print(f"🎯 Optimal number of clusters: {n_clusters}")
        
        # Perform clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(embeddings)
        
        # Form groups with size constraints
        groups = self._form_groups_with_constraints(student_data, cluster_labels)
        
        return groups
    
    def _form_groups_with_constraints(self, student_data, cluster_labels):
        """Form groups ensuring size constraints"""
        groups = []
        
        # Group students by cluster
        clusters = {}
        for student, label in zip(student_data, cluster_labels):
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(student)
        
        # Split clusters into valid groups
        for cluster_id, students in clusters.items():
            while len(students) > 0:
                # Take max_group_size students
                group_size = min(self.max_group_size, len(students))
                
                # If remaining students would be less than min_size, adjust
                if len(students) - group_size < self.min_group_size and len(students) - group_size > 0:
                    group_size = len(students) - self.min_group_size
                
                group = students[:group_size]
                
                # Extract primary domain (most common)
                domains = [s['projectDomain'] for s in group]
                primary_domain = max(set(domains), key=domains.count) if domains else "General"
                
                groups.append({
                    'groupId': len(groups) + 1,
                    'students': group,
                    'size': len(group),
                    'clusterId': int(cluster_id),
                    'projectDomain': primary_domain
                })
                
                students = students[group_size:]
        
        print(f"✅ Created {len(groups)} groups")
        return groups
    
    def _create_single_group(self, student_data):
        """Create a single group when clustering isn't possible"""
        if not student_data:
            return []
        
        return [{
            'groupId': 1,
            'students': student_data,
            'size': len(student_data),
            'clusterId': 0,
            'projectDomain': student_data[0].get('projectDomain', 'General')
        }]


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'service': 'clustering',
        'model': 'all-mpnet-base-v2'
    }), 200


@app.route('/cluster', methods=['POST'])
def cluster_students():
    """
    Expected JSON format:
    {
        "students": [
            {
                "id": 1,
                "name": "John Doe",
                "projectTitle": "AI-based recommendation system",
                "projectDomain": "Machine Learning"
            },
            ...
        ],
        "minGroupSize": 2,  # optional
        "maxGroupSize": 3   # optional
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'students' not in data:
            return jsonify({'error': 'Missing students data'}), 400
        
        students = data['students']
        
        if not students:
            return jsonify({'error': 'Empty students list'}), 400
        
        print(f"\n{'='*50}")
        print(f"📥 Received clustering request for {len(students)} students")
        
        # Get group size constraints
        min_size = data.get('minGroupSize', 2)
        max_size = data.get('maxGroupSize', 3)
        
        print(f"⚙️  Group size constraints: {min_size}-{max_size}")
        
        # Perform clustering
        clusterer = StudentClusterer(min_group_size=min_size, max_group_size=max_size)
        groups = clusterer.cluster_students(students)
        
        response = {
            'success': True,
            'totalStudents': len(students),
            'totalGroups': len(groups),
            'groups': groups
        }
        
        print(f"✅ Successfully clustered into {len(groups)} groups")
        print(f"{'='*50}\n")
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"❌ Clustering error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/recommend-groups', methods=['POST'])
def recommend_group_mentor():
    """
    Recommend best mentor for each group based on group's project domain
    Expected JSON:
    {
        "groups": [...],  # Groups from /cluster endpoint
        "faculty": [...]  # Available faculty with domains
    }
    """
    try:
        data = request.get_json()
        groups = data.get('groups', [])
        faculty = data.get('faculty', [])
        
        if not groups or not faculty:
            return jsonify({'error': 'Missing groups or faculty data'}), 400
        
        print(f"\n📊 Recommending mentors for {len(groups)} groups")
        
        recommendations = []
        
        for group in groups:
            # Get group's project domain
            group_domain = group.get('projectDomain', '')
            group_texts = [s['projectTitle'] for s in group['students']]
            group_text = f"{group_domain} {' '.join(group_texts)}"
            
            # Get embeddings
            group_embedding = model.encode(group_text, convert_to_tensor=False)
            
            # Score each faculty
            faculty_scores = []
            for fac in faculty:
                # Check if faculty has available slots
                if fac.get('availableSlots', 0) <= 0:
                    continue
                
                fac_text = f"{fac.get('domainExpertise', '')} {fac.get('keywords', '')}"
                fac_embedding = model.encode(fac_text, convert_to_tensor=False)
                
                # Cosine similarity
                similarity = np.dot(group_embedding, fac_embedding) / (
                    np.linalg.norm(group_embedding) * np.linalg.norm(fac_embedding)
                )
                
                faculty_scores.append({
                    'facultyId': fac['id'],
                    'facultyName': fac['name'],
                    'similarityScore': float(similarity),
                    'availableSlots': fac.get('availableSlots', 0)
                })
            
            # Sort by similarity
            faculty_scores.sort(key=lambda x: x['similarityScore'], reverse=True)
            
            recommendations.append({
                'groupId': group['groupId'],
                'recommendedFaculty': faculty_scores[:5]  # Top 5
            })
        
        print(f"✅ Generated recommendations for {len(recommendations)} groups\n")
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        }), 200
        
    except Exception as e:
        print(f"❌ Recommendation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🎯 CLUSTERING SERVICE")
    print("="*60)
    print("📍 Running on: http://localhost:5002")
    print("🔗 Endpoints:")
    print("   • GET  /health           - Health check")
    print("   • POST /cluster          - Cluster students into groups")
    print("   • POST /recommend-groups - Recommend mentors for groups")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5002, debug=True)