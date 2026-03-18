migrate((app) => {
  const assetsCollectionId = "pbc_1321337024";

  const transcripts = new Collection({
    name: "ai_transcripts",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: assetsCollectionId,
        maxSelect: 1,
      }),
      new TextField({
        name: "raw_text",
      }),
      new TextField({
        name: "srt_payload",
      }),
    ],
  });
  app.save(transcripts);

  const cutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: assetsCollectionId,
        maxSelect: 1,
      }),
      new NumberField({
        name: "start_timecode",
      }),
      new NumberField({
        name: "end_timecode",
      }),
      new TextField({
        name: "cut_reason",
      }),
    ],
  });
  app.save(cutSuggestions);

  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: assetsCollectionId,
        maxSelect: 1,
      }),
      new TextField({
        name: "author",
      }),
      new NumberField({
        name: "timestamp",
      }),
      new TextField({
        name: "note_text",
      }),
      new JSONField({
        name: "canvas_data",
      }),
    ],
  });
  app.save(reviewNotes);

}, (app) => {
  try {
    const transcripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(transcripts);
  } catch (err) {}

  try {
    const cutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(cutSuggestions);
  } catch (err) {}

  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    app.delete(reviewNotes);
  } catch (err) {}
});