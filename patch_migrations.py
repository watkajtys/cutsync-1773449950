import glob
import re

files = glob.glob('pb_migrations/*.js')

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Check if this file has relation to assets
    if 'collectionId: "pbc123456789013"' in content:
        # Check if the file already defines an assets collection or imports it
        # We need to prepend fetching the assets id
        
        if "const assetsId =" not in content and "app.findCollectionByNameOrId" in content:
             # Find `migrate((app) => {` and insert our id retrieval
             content = re.sub(r'(migrate\(\(app\) => \{\n)', r'\1  const assetsId = app.findCollectionByNameOrId("assets").id;\n', content)
        elif "const assetsId =" not in content and "migrate((app) => {" in content:
             content = re.sub(r'(migrate\(\(app\) => \{\n)', r'\1  const assetsId = app.findCollectionByNameOrId("assets").id;\n', content)
        
        if "assetsId" in content or "const assetsId =" in content:
            content = content.replace('"pbc123456789013"', 'assetsId')

        with open(f, 'w') as file:
            file.write(content)
            
    # And handle dao ones:
    if '"collectionId": "pbc123456789013"' in content and 'migrate((db) => {' in content:
        # This is JSON based schema
        if "const assetsId" not in content:
             content = re.sub(r'(migrate\(\(db\) => \{\n)', r'\1  const dao = new Dao(db);\n  const assetsId = dao.findCollectionByNameOrId("assets").id;\n', content)
             content = content.replace('"pbc123456789013"', 'assetsId')
             
             with open(f, 'w') as file:
                 file.write(content)

