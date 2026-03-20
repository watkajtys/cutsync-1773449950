migrate((app) => {
  const assetsId = app.findCollectionByNameOrId("assets").id;
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
        cascadeDelete: true
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
        cascadeDelete: true
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
        cascadeDelete: true
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

  try {
    const projects = app.findCollectionByNameOrId("pbc_484305853");
    const nameField = projects.fields.getByName("name");
    if (nameField) {
      nameField.name = "title";
    }
    if (!projects.fields.getByName("description")) {
      projects.fields.add(new TextField({
        name: "description"
      }));
    }
    app.save(projects);
  } catch (e) {
    // Collection not found, proceed without crashing
  }
}, (app) => {
  try {
    const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(aiTranscripts);
  } catch (e) {}

  try {
    const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(aiCutSuggestions);
  } catch (e) {}

  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    app.delete(reviewNotes);
  } catch (e) {}

  try {
    const projects = app.findCollectionByNameOrId("pbc_484305853");
    const titleField = projects.fields.getByName("title");
    if (titleField) {
      titleField.name = "name";
    }
    const descField = projects.fields.getByName("description");
    if (descField) {
      projects.fields.removeByName("description");
    }
    app.save(projects);
  } catch (e) {}
});