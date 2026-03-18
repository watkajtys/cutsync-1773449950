migrate((app) => {
  // Update 'projects' collection
  const projects = app.findCollectionByNameOrId("pbc_484305853");
  const nameField = projects.fields.getByName("name");
  if (nameField) {
    nameField.name = "title";
  }
  projects.fields.add(new TextField({
    name: "description"
  }));
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
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new TextField({ name: "raw_text" }),
      new TextField({ name: "srt_payload" })
    ]
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
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new NumberField({ name: "start_timecode" }),
      new NumberField({ name: "end_timecode" }),
      new TextField({ name: "cut_reason" })
    ]
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
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new TextField({ name: "author" }),
      new NumberField({ name: "timestamp" }),
      new TextField({ name: "note_text" }),
      new Field({ type: "json", name: "canvas_data" })
    ]
  });
  app.save(reviewNotes);

}, (app) => {
  const collectionsToDelete = ["review_notes", "ai_cut_suggestions", "ai_transcripts"];
  for (const name of collectionsToDelete) {
    try {
      const col = app.findCollectionByNameOrId(name);
      if (col) {
        app.delete(col);
      }
    } catch (e) {
      // ignore missing collections during rollback
    }
  }

  try {
    const projects = app.findCollectionByNameOrId("pbc_484305853");
    if (projects) {
      const titleField = projects.fields.getByName("title");
      if (titleField) {
        titleField.name = "name";
      }
      projects.fields.removeByName("description");
      app.save(projects);
    }
  } catch (e) {
    // ignore missing fields/collection during rollback
  }
});