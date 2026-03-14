/* eslint-disable */
migrate((db) => {
  const snapshot = [
    {
      "id": "pbc123456789012",
      "created": "2024-01-01 00:00:00.000Z",
      "updated": "2024-01-01 00:00:00.000Z",
      "name": "projects",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "proj_title",
          "name": "title",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": { "min": null, "max": null, "pattern": "" }
        },
        {
          "system": false,
          "id": "proj_desc",
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
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
