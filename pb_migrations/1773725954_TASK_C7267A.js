migrate((app) => {
  const assetsId = app.findCollectionByNameOrId("assets").id;
  // Update 'projects' collection to match roadmap schema
  const projects = app.findCollectionByNameOrId("pbc_484305853");
  const nameField = projects.fields.getByName("name");
  if (nameField) {
    nameField.name = "title";
  }
  if (!projects.fields.getByName("description")) {
    projects.fields.add(new TextField({ name: "description" }));
  }
  app.save(projects);

  // Create 'ai_transcripts' collection
  const aiTranscripts = new Collection({
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
        collectionId: assetsId,
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
  app.save(aiTranscripts);

  // Create 'ai_cut_suggestions' collection
  const aiCutSuggestions = new Collection({
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
        collectionId: assetsId,
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
  app.save(aiCutSuggestions);

  // Create 'review_notes' collection
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
        collectionId: assetsId,
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
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    app.delete(reviewNotes);
  } catch (e) {}

  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(aiCutSuggestions);
  } catch (e) {}

  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(aiTranscripts);
  } catch (e) {}

  try {
    const projects = app.findCollectionByNameOrId("pbc_484305853");
    const titleField = projects.fields.getByName("title");
    if (titleField) {
      titleField.name = "name";
    }
    projects.fields.removeByName("description");
    app.save(projects);
  } catch (e) {}
});