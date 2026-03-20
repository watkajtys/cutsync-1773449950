migrate((app) => {
  const assetsCollectionId = "pbc_1321337024";

  // 1. ai_transcripts
  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });

  aiTranscripts.fields.add(new RelationField({
    name: "asset_id",
    collectionId: assetsCollectionId,
    maxSelect: 1,
  }));
  aiTranscripts.fields.add(new TextField({
    name: "raw_text",
  }));
  aiTranscripts.fields.add(new TextField({
    name: "srt_payload",
  }));

  app.save(aiTranscripts);

  // 2. ai_cut_suggestions
  const aiCutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });

  aiCutSuggestions.fields.add(new RelationField({
    name: "asset_id",
    collectionId: assetsCollectionId,
    maxSelect: 1,
  }));
  aiCutSuggestions.fields.add(new NumberField({
    name: "start_timecode",
  }));
  aiCutSuggestions.fields.add(new NumberField({
    name: "end_timecode",
  }));
  aiCutSuggestions.fields.add(new TextField({
    name: "cut_reason",
  }));

  app.save(aiCutSuggestions);

  // 3. review_notes
  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });

  reviewNotes.fields.add(new RelationField({
    name: "asset_id",
    collectionId: assetsCollectionId,
    maxSelect: 1,
  }));
  reviewNotes.fields.add(new TextField({
    name: "author",
  }));
  reviewNotes.fields.add(new NumberField({
    name: "timestamp",
  }));
  reviewNotes.fields.add(new TextField({
    name: "note_text",
  }));
  reviewNotes.fields.add(new JSONField({
    name: "canvas_data",
  }));

  app.save(reviewNotes);

}, (app) => {
  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(aiTranscripts);
  } catch (err) {
    // ignore if not found
  }

  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(aiCutSuggestions);
  } catch (err) {
    // ignore if not found
  }

  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    app.delete(reviewNotes);
  } catch (err) {
    // ignore if not found
  }
});