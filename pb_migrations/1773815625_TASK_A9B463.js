migrate((app) => {
  // Create ai_transcripts collection
  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1,
      }),
      new TextField({
        name: "raw_text",
      }),
      new TextField({
        name: "srt_payload",
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
      })
    ]
  });
  app.save(reviewNotes);

  // Update projects collection to match roadmap (rename name -> title, add description)
  const projects = app.findCollectionByNameOrId("pbc_484305853");
  if (projects) {
    const nameField = projects.fields.getByName("name");
    if (nameField) {
      nameField.name = "title";
    } else if (!projects.fields.getByName("title")) {
      projects.fields.add(new TextField({ name: "title" }));
    }
    
    if (!projects.fields.getByName("description")) {
      projects.fields.add(new TextField({ name: "description" }));
    }
    app.save(projects);
  }
}, (app) => {
  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    if (aiTranscripts) app.delete(aiTranscripts);
  } catch (err) {
    // ignore missing collection
  }

  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    if (aiCutSuggestions) app.delete(aiCutSuggestions);
  } catch (err) {
    // ignore missing collection
  }

  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    if (reviewNotes) app.delete(reviewNotes);
  } catch (err) {
    // ignore missing collection
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
  } catch (err) {
    // ignore missing collection
  }
});