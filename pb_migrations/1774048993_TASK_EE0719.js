migrate((app) => {
  // Update projects collection
  const projects = app.findCollectionByNameOrId("projects");
  const nameField = projects.fields.getByName("name");
  if (nameField) {
    nameField.name = "title";
  }
  if (!projects.fields.getByName("description")) {
    projects.fields.add(new TextField({ name: "description" }));
  }
  app.save(projects);

  // Create ai_transcripts collection
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
    collectionId: "pbc_1321337024",
    maxSelect: 1,
  }));
  aiTranscripts.fields.add(new TextField({ name: "raw_text" }));
  aiTranscripts.fields.add(new TextField({ name: "srt_payload" }));
  app.save(aiTranscripts);

  // Create ai_cut_suggestions collection
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
    collectionId: "pbc_1321337024",
    maxSelect: 1,
  }));
  aiCutSuggestions.fields.add(new NumberField({ name: "start_timecode" }));
  aiCutSuggestions.fields.add(new NumberField({ name: "end_timecode" }));
  aiCutSuggestions.fields.add(new TextField({ name: "cut_reason" }));
  app.save(aiCutSuggestions);

  // Create review_notes collection
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
    collectionId: "pbc_1321337024",
    maxSelect: 1,
  }));
  reviewNotes.fields.add(new TextField({ name: "author" }));
  reviewNotes.fields.add(new NumberField({ name: "timestamp" }));
  reviewNotes.fields.add(new TextField({ name: "note_text" }));
  reviewNotes.fields.add(new JSONField({ name: "canvas_data" }));
  app.save(reviewNotes);

}, (app) => {
  // Revert projects collection
  const projects = app.findCollectionByNameOrId("projects");
  if (projects) {
    const titleField = projects.fields.getByName("title");
    if (titleField) {
      titleField.name = "name";
    }
    const descField = projects.fields.getByName("description");
    if (descField) {
      projects.fields.removeByName("description");
    }
    app.save(projects);
  }

  // Delete review_notes collection
  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    if (reviewNotes) {
      app.delete(reviewNotes);
    }
  } catch (e) {}

  // Delete ai_cut_suggestions collection
  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    if (aiCutSuggestions) {
      app.delete(aiCutSuggestions);
    }
  } catch (e) {}

  // Delete ai_transcripts collection
  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    if (aiTranscripts) {
      app.delete(aiTranscripts);
    }
  } catch (e) {}
});