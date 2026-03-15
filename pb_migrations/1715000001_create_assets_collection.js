/* eslint-disable */
migrate((db) => {
  const collection = new Collection({
    "id": "pbc123456789013",
    "created": "2024-01-01 00:00:00.000Z",
    "updated": "2024-01-01 00:00:00.000Z",
    "name": "assets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldprjct",
        "name": "project_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc123456789012",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fldfilev",
        "name": "file",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [
            "video/mp4",
            "video/webm"
          ],
          "thumbs": [],
          "maxSelect": 1,
          "maxSize": 524288000,
          "protected": false
        }
      },
      {
        "system": false,
        "id": "fldtypea",
        "name": "asset_type",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "source_clip",
            "review_edit"
          ]
        }
      },
      {
        "system": false,
        "id": "fldsttus",
        "name": "processing_status",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "pending",
            "extracting_audio",
            "analyzing",
            "ready",
            "error"
          ]
        }
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
  const collection = dao.findCollectionByNameOrId("pbc123456789013");

  return dao.deleteCollection(collection);
})
