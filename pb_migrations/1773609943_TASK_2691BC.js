migrate((app) => {
  const reviewNotes = new Collection({
    id: "reviewnotes0001",
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
      })
    ]
  });
  app.save(reviewNotes);

  const aiTranscripts = new Collection({
    id: "aitranscript001",
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
      })
    ]
  });
  app.save(aiTranscripts);

  const aiCutSuggestions = new Collection({
    id: "aicutsuggest001",
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
      })
    ]
  });
  app.save(aiCutSuggestions);
}, (app) => {
  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    if (reviewNotes) app.delete(reviewNotes);
  } catch (err) {}
  
  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    if (aiTranscripts) app.delete(aiTranscripts);
  } catch (err) {}
  
  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    if (aiCutSuggestions) app.delete(aiCutSuggestions);
  } catch (err) {}
});