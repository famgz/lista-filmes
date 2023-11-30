from famgz_utils import json_

raw = json_('films-data-full.json')

chunk = {}
c = 0
for slug, data in raw.items():
    if c>=1000:
        break
    chunk[slug] = data
    c+=1

json_('films-data.json', chunk, indent=2)
