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

  // 2. Create 'assets' collection
  const assetsCollection = new Collection({
    "id": "pbc123456789002",
    "created": "2024-01-01 00:00:00.000Z",
    "updated": "2024-01-01 00:00:00.000Z",
    "name": "assets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldproji",
        "name": "project_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc123456789001",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fldfile1",
        "name": "file",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 524288000,
          "mimeTypes": ["video/mp4", "video/webm"],
          "thumbs": [],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "fldatype",
        "name": "asset_type",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": ["source_clip", "review_edit"]
        }
      },
      {
        "system": false,
        "id": "fldpstat",
        "name": "processing_status",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": ["pending", "extracting_audio", "analyzing", "ready", "error"]
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
  dao.saveCollection(assetsCollection);

  // 3. Create 'ai_transcripts' collection
  const aiTranscriptsCollection = new Collection({
    "id": "pbc123456789003",
    "created": "2024-01-01 00:00:00.000Z",
    "updated": "2024-01-01 00:00:00.000Z",
    "name": "ai_transcripts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldassei",
        "name": "asset_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc123456789002",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fldrawte",
        "name": "raw_text",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false,
        "id": "fldsrtpa",
        "name": "srt_payload",
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
  dao.saveCollection(aiTranscriptsCollection);

  // 4. Create 'ai_cut_suggestions' collection
  const aiCutSuggestionsCollection = new Collection({
    "id": "pbc123456789004",
    "created": "2024-01-01 00:00:00.000Z",
    "updated": "2024-01-01 00:00:00.000Z",
    "name": "ai_cut_suggestions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldasse2",
        "name": "asset_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc123456789002",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fldsttim",
        "name": "start_timecode",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false,
        "id": "fldedtim",
        "name": "end_timecode",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false,
        "id": "fldcutre",
        "name": "cut_reason",
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
  dao.saveCollection(aiCutSuggestionsCollection);

  // 5. Create 'review_notes' collection
  const reviewNotesCollection = new Collection({
    "id": "pbc123456789005",
    "created": "2024-01-01 00:00:00.000Z",
    "updated": "2024-01-01 00:00:00.000Z",
    "name": "review_notes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldasse3",
        "name": "asset_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc123456789002",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fldautho",
        "name": "author",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false,
        "id": "fldtimes",
        "name": "timestamp",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false,
        "id": "fldnotet",
        "name": "note_text",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false,
        "id": "fldcanva",
        "name": "canvas_data",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": { "maxSize": 2000000 }
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
  dao.saveCollection(reviewNotesCollection);

}, (db) => {
  const dao = new Dao(db);
  
  const collectionsToRemove = [
    "review_notes",
    "ai_cut_suggestions",
    "ai_transcripts",
    "assets",
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
