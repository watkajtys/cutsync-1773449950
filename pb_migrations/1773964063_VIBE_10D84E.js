migrate((app) => {
  // 1. Update 'projects' collection: Industry standard copy (name -> title) and add description
  const projects = app.findCollectionByNameOrId("projects");
  const nameField = projects.fields.getByName("name");
  if (nameField) {
    nameField.name = "title";
  }
  projects.fields.add(new TextField({
    name: "description"
  }));
  app.save(projects);

  // 2. Create 'ai_transcripts' collection
  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base",
  });
  aiTranscripts.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024", // assets
    maxSelect: 1,
  }));
  aiTranscripts.fields.add(new TextField({
    name: "raw_text"
  }));
  aiTranscripts.fields.add(new TextField({
    name: "srt_payload"
  }));
  app.save(aiTranscripts);

  // 3. Create 'ai_cut_suggestions' collection
  const aiCutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
  });
  aiCutSuggestions.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024", // assets
    maxSelect: 1,
  }));
  aiCutSuggestions.fields.add(new NumberField({
    name: "start_timecode"
  }));
  aiCutSuggestions.fields.add(new NumberField({
    name: "end_timecode"
  }));
  aiCutSuggestions.fields.add(new TextField({
    name: "cut_reason"
  }));
  app.save(aiCutSuggestions);

  // 4. Create 'review_notes' collection
  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
  });
  reviewNotes.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024", // assets
    maxSelect: 1,
  }));
  reviewNotes.fields.add(new TextField({
    name: "author"
  }));
  reviewNotes.fields.add(new NumberField({
    name: "timestamp"
  }));
  reviewNotes.fields.add(new TextField({
    name: "note_text"
  }));
  reviewNotes.fields.add(new JSONField({
    name: "canvas_data"
  }));
  app.save(reviewNotes);

}, (app) => {
  // Rollback 'review_notes'
  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    app.delete(reviewNotes);
  } catch (err) {
    console.error(err);
  }

  // Rollback 'ai_cut_suggestions'
  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(aiCutSuggestions);
  } catch (err) {
    console.error(err);
  }

  // Rollback 'ai_transcripts'
  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(aiTranscripts);
  } catch (err) {
    console.error(err);
  }

  // Rollback 'projects'
  try {
    const projects = app.findCollectionByNameOrId("projects");
    const titleField = projects.fields.getByName("title");
    if (titleField) {
      titleField.name = "name";
    }
    projects.fields.removeByName("description");
    app.save(projects);
  } catch (err) {
    console.error(err);
  }
});