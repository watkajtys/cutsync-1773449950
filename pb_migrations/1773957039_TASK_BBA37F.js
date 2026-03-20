migrate((app) => {
  const assetsId = app.findCollectionByNameOrId("assets").id;
  // Update "projects" collection to match roadmap (rename name -> title, add description)
  const projects = app.findCollectionByNameOrId("projects");
  const nameField = projects.fields.getByName("name");
  
  if (nameField) {
    nameField.name = "title";
  } else if (!projects.fields.getByName("title")) {
    projects.fields.add(new core.TextField({ name: "title" }));
  }
  
  if (!projects.fields.getByName("description")) {
    projects.fields.add(new core.TextField({ name: "description" }));
  }
  
  app.save(projects);

  // Create "ai_transcripts" collection
  const aiTranscripts = new core.Collection({
    name: "ai_transcripts",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });
  aiTranscripts.fields.add(new core.RelationField({
    name: "asset_id",
    collectionId: assetsId,
    maxSelect: 1
  }));
  aiTranscripts.fields.add(new core.TextField({ name: "raw_text" }));
  aiTranscripts.fields.add(new core.TextField({ name: "srt_payload" }));
  app.save(aiTranscripts);

  // Create "ai_cut_suggestions" collection
  const aiCutSuggestions = new core.Collection({
    name: "ai_cut_suggestions",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });
  aiCutSuggestions.fields.add(new core.RelationField({
    name: "asset_id",
    collectionId: assetsId,
    maxSelect: 1
  }));
  aiCutSuggestions.fields.add(new core.NumberField({ name: "start_timecode" }));
  aiCutSuggestions.fields.add(new core.NumberField({ name: "end_timecode" }));
  aiCutSuggestions.fields.add(new core.TextField({ name: "cut_reason" }));
  app.save(aiCutSuggestions);

  // Create "review_notes" collection
  const reviewNotes = new core.Collection({
    name: "review_notes",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });
  reviewNotes.fields.add(new core.RelationField({
    name: "asset_id",
    collectionId: assetsId,
    maxSelect: 1
  }));
  reviewNotes.fields.add(new core.TextField({ name: "author" }));
  reviewNotes.fields.add(new core.NumberField({ name: "timestamp" }));
  reviewNotes.fields.add(new core.TextField({ name: "note_text" }));
  reviewNotes.fields.add(new core.JSONField({ name: "canvas_data" }));
  app.save(reviewNotes);

}, (app) => {
  // Rollback review_notes
  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    app.delete(reviewNotes);
  } catch (err) { /* silent */ }

  // Rollback ai_cut_suggestions
  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(aiCutSuggestions);
  } catch (err) { /* silent */ }

  // Rollback ai_transcripts
  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(aiTranscripts);
  } catch (err) { /* silent */ }

  // Rollback projects schema changes
  try {
    const projects = app.findCollectionByNameOrId("projects");
    const titleField = projects.fields.getByName("title");
    
    if (titleField) {
      titleField.name = "name";
    }
    
    projects.fields.removeByName("description");
    app.save(projects);
  } catch (err) { /* silent */ }
});