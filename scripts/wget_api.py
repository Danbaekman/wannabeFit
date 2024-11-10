import http.client

conn = http.client.HTTPSConnection("exercisedb.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "f1e4d47c0amsh077d3b2100355bap118e3fjsn6875748d01f4",
    'x-rapidapi-host': "exercisedb.p.rapidapi.com"
}

conn.request("GET", "/exercises?limit=10&offset=0", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))