migrate((app) => {
  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new Field({
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        system: true,
        autogeneratePattern: "[a-z0-9]{15}"
      }),
      new Field({
        name: "asset_id",
        type: "relation",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new Field({
        name: "raw_text",
        type: "text"
      }),
      new Field({
        name: "srt_payload",
        type: "text"
      }),
      new Field({
        name: "created",
        type: "autodate",
        onCreate: true,
        onUpdate: false,
        system: true
      }),
      new Field({
        name: "updated",
        type: "autodate",
        onCreate: true,
        onUpdate: true,
        system: true
      })
    ]
  });
  app.save(aiTranscripts);

  const aiCutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new Field({
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        system: true,
        autogeneratePattern: "[a-z0-9]{15}"
      }),
      new Field({
        name: "asset_id",
        type: "relation",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new Field({
        name: "start_timecode",
        type: "number"
      }),
      new Field({
        name: "end_timecode",
        type: "number"
      }),
      new Field({
        name: "cut_reason",
        type: "text"
      }),
      new Field({
        name: "created",
        type: "autodate",
        onCreate: true,
        onUpdate: false,
        system: true
      }),
      new Field({
        name: "updated",
        type: "autodate",
        onCreate: true,
        onUpdate: true,
        system: true
      })
    ]
  });
  app.save(aiCutSuggestions);

  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new Field({
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        system: true,
        autogeneratePattern: "[a-z0-9]{15}"
      }),
      new Field({
        name: "asset_id",
        type: "relation",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new Field({
        name: "author",
        type: "text"
      }),
      new Field({
        name: "timestamp",
        type: "number"
      }),
      new Field({
        name: "note_text",
        type: "text"
      }),
      new Field({
        name: "canvas_data",
        type: "json"
      }),
      new Field({
        name: "created",
        type: "autodate",
        onCreate: true,
        onUpdate: false,
        system: true
      }),
      new Field({
        name: "updated",
        type: "autodate",
        onCreate: true,
        onUpdate: true,
        system: true
      })
    ]
  });
  app.save(reviewNotes);

}, (app) => {
  const collectionNames = ["review_notes", "ai_cut_suggestions", "ai_transcripts"];
  
  for (const name of collectionNames) {
    try {
      const collection = app.findCollectionByNameOrId(name);
      if (collection) {
        app.delete(collection);
      }
    } catch (e) {
      // Ignored if collection does not exist
    }
  }
});