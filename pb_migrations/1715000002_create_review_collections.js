/* eslint-disable */
migrate((db) => {
  const aiTranscripts = new Collection({
    "id": "ait123456789012",
    "name": "ai_transcripts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldaset0",
        "name": "asset_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc123456789013",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fldrawtx",
        "name": "raw_text",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "fldsrtpa",
        "name": "srt_payload",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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

  const aiCutSuggestions = new Collection({
    "id": "aic123456789012",
    "name": "ai_cut_suggestions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldaset1",
        "name": "asset_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc123456789013",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fldstart",
        "name": "start_timecode",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "fldendtc",
        "name": "end_timecode",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "fldreasn",
        "name": "cut_reason",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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

  const reviewNotes = new Collection({
    "id": "rvn123456789012",
    "name": "review_notes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fldaset2",
        "name": "asset_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc123456789013",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fldauthr",
        "name": "author",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "fldtimst",
        "name": "timestamp",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "fldnotex",
        "name": "note_text",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "fldcanvs",
        "name": "canvas_data",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
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

  const dao = new Dao(db);
  dao.saveCollection(aiTranscripts);
  dao.saveCollection(aiCutSuggestions);
  dao.saveCollection(reviewNotes);
}, (db) => {
  const dao = new Dao(db);
  try {
    const ai_transcripts = dao.findCollectionByNameOrId("ait123456789012");
    dao.deleteCollection(ai_transcripts);
  } catch (e) {}
  try {
    const ai_cut_suggestions = dao.findCollectionByNameOrId("aic123456789012");
    dao.deleteCollection(ai_cut_suggestions);
  } catch (e) {}
  try {
    const review_notes = dao.findCollectionByNameOrId("rvn123456789012");
    dao.deleteCollection(review_notes);
  } catch (e) {}
});
