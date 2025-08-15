import requests

def get_orcid_titles(orcid_id):
    url = f"https://pub.orcid.org/v3.0/{orcid_id}/works"
    headers = {"Accept": "application/json"}

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return []

    data = response.json()
    titles = []

    for work in data.get("group", []):
        try:
            title = work["work-summary"][0]["title"]["title"]["value"]
            titles.append(title)
        except:
            continue

    return titles[:10]
