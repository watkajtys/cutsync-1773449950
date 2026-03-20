migrate((app) => {
  // Update projects collection
  const projects = app.findCollectionByNameOrId("projects");
  
  const nameField = projects.fields.getByName("name");
  if (nameField) {
    nameField.name = "title";
  }
  
  projects.fields.add(new TextField({
    name: "description",
    required: false
  }));
  
  app.save(projects);

  // Create ai_transcripts collection
  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new TextField({
        name: "raw_text"
      }),
      new TextField({
        name: "srt_payload"
      })
    ]
  });
  app.save(aiTranscripts);

  // Create ai_cut_suggestions collection
  const aiCutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new NumberField({
        name: "start_timecode"
      }),
      new NumberField({
        name: "end_timecode"
      }),
      new TextField({
        name: "cut_reason"
      })
    ]
  });
  app.save(aiCutSuggestions);

  // Create review_notes collection
  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new TextField({
        name: "author"
      }),
      new NumberField({
        name: "timestamp"
      }),
      new TextField({
        name: "note_text"
      }),
      new JSONField({
        name: "canvas_data"
      })
    ]
  });
  app.save(reviewNotes);
}, (app) => {
  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    app.delete(reviewNotes);
  } catch (err) {}

  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(aiCutSuggestions);
  } catch (err) {}

  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(aiTranscripts);
  } catch (err) {}

  try {
    const projects = app.findCollectionByNameOrId("projects");
    const descField = projects.fields.getByName("description");
    if (descField) {
      projects.fields.removeByName("description");
    }
    const titleField = projects.fields.getByName("title");
    if (titleField) {
      titleField.name = "name";
    }
    app.save(projects);
  } catch (err) {}
});