/* eslint-disable */
migrate((db) => {
  const dao = new Dao(db);

  // 1. Create 'projects' collection
  const projectsCollection = new Collection({
    "id": "pbc123456789001",
    "created": "2024-01-01 00:00:00.000Z",
    "updated": "2024-01-01 00:00:00.000Z",
    "name": "projects",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldtitle",
        "name": "title",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false,
        "id": "flddescr",
        "name": "description",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "pattern": "" }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });
  dao.saveCollection(projectsCollection);

}, (db) => {
  const dao = new Dao(db);
  
  const collectionsToRemove = [
    "projects"
  ];

  for (const name of collectionsToRemove) {
    try {
      const collection = dao.findCollectionByNameOrId(name);
      if (collection) {
        dao.deleteCollection(collection);
      }
    } catch (err) {
      // Collection might not exist, ignore
    }
  }
})
