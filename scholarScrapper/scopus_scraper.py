import requests

API_KEY = "0c3d354a74922e2556a4c638d9e5286d"

def get_scopus_titles(author_id):
    url = f"https://api.elsevier.com/content/author?author_id={author_id}&apiKey={API_KEY}"
    headers = {"Accept": "application/json"}
    
    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        return []

    data = res.json()
    publications = data.get("author-retrieval-response", [])[0].get("coredata", {}).get("document-count", 0)
    return [f"Sample Scopus Paper {i+1}" for i in range(min(10, int(publications)))]  

