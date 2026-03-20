migrate((app) => {
  const assetsId = app.findCollectionByNameOrId("assets").id;
  // Update 'projects' collection
  const projects = app.findCollectionByNameOrId("projects");
  const nameField = projects.fields.getByName("name");
  if (nameField) {
    nameField.name = "title";
  }
  projects.fields.add(new TextField({ name: "description" }));
  app.save(projects);

  // Create 'ai_transcripts'
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
        maxSelect: 1
      }),
      new TextField({ name: "raw_text" }),
      new TextField({ name: "srt_payload" })
    ]
  });
  app.save(aiTranscripts);

  // Create 'ai_cut_suggestions'
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
        maxSelect: 1
      }),
      new NumberField({ name: "start_timecode" }),
      new NumberField({ name: "end_timecode" }),
      new TextField({ name: "cut_reason" })
    ]
  });
  app.save(aiCutSuggestions);

  // Create 'review_notes'
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
        maxSelect: 1
      }),
      new TextField({ name: "author" }),
      new NumberField({ name: "timestamp" }),
      new TextField({ name: "note_text" }),
      new JSONField({ name: "canvas_data" })
    ]
  });
  app.save(reviewNotes);

}, (app) => {
  // Rollback 'review_notes'
  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    app.delete(reviewNotes);
  } catch (err) {}

  // Rollback 'ai_cut_suggestions'
  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(aiCutSuggestions);
  } catch (err) {}

  // Rollback 'ai_transcripts'
  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(aiTranscripts);
  } catch (err) {}

  // Rollback 'projects'
  try {
    const projects = app.findCollectionByNameOrId("projects");
    const titleField = projects.fields.getByName("title");
    if (titleField) {
      titleField.name = "name";
    }
    projects.fields.removeByName("description");
    app.save(projects);
  } catch (err) {}
})