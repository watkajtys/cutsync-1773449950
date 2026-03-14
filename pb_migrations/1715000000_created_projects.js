/* eslint-disable */
migrate((db) => {
  // Provision the PocketBase database schema by creating the required projects collection
  // using the Global Data Model provided in the spec so the backend can actually accept the frontend's API calls.
  const collection = new Collection({
    "id": "pbc123456789012",
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

  return new Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("projects");
  return dao.deleteCollection(collection);
})
