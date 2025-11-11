import requests

payload = { 'api_key': '764d2e7884c7520bf1e5c03ca60504a2', 'url': 'https://en.wikipedia.org' }
r = requests.get('https://api.scraperapi.com/', params=payload)
print(r.text)
