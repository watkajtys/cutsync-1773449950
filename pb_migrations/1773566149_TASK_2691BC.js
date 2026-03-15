migrate((app) => {
  // 1. Update existing "projects" collection to match roadmap
  const projects = app.findCollectionByNameOrId("projects");
  if (projects) {
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
  }

  // 2. Create "ai_transcripts" collection
  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new Field({
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        system: true,
        autogeneratePattern: "[a-z0-9]{15}"
      }),
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024", // 'assets' collection ID
        maxSelect: 1
      }),
      new TextField({
        name: "raw_text"
      }),
      new TextField({
        name: "srt_payload"
      }),
      new AutodateField({
        name: "created",
        onCreate: true,
        onUpdate: false,
        system: true
      }),
      new AutodateField({
        name: "updated",
        onCreate: true,
        onUpdate: true,
        system: true
      })
    ]
  });
  app.save(aiTranscripts);

  // 3. Create "ai_cut_suggestions" collection
  const aiCutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new Field({
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        system: true,
        autogeneratePattern: "[a-z0-9]{15}"
      }),
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024", // 'assets' collection ID
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
      }),
      new AutodateField({
        name: "created",
        onCreate: true,
        onUpdate: false,
        system: true
      }),
      new AutodateField({
        name: "updated",
        onCreate: true,
        onUpdate: true,
        system: true
      })
    ]
  });
  app.save(aiCutSuggestions);

  // 4. Create "review_notes" collection
  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      new Field({
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        system: true,
        autogeneratePattern: "[a-z0-9]{15}"
      }),
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024", // 'assets' collection ID
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
      }),
      new AutodateField({
        name: "created",
        onCreate: true,
        onUpdate: false,
        system: true
      }),
      new AutodateField({
        name: "updated",
        onCreate: true,
        onUpdate: true,
        system: true
      })
    ]
  });
  app.save(reviewNotes);
}, (app) => {
  // Rollback review_notes
  const reviewNotes = app.findCollectionByNameOrId("review_notes");
  if (reviewNotes) {
    app.delete(reviewNotes);
  }

  // Rollback ai_cut_suggestions
  const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
  if (aiCutSuggestions) {
    app.delete(aiCutSuggestions);
  }

  // Rollback ai_transcripts
  const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
  if (aiTranscripts) {
    app.delete(aiTranscripts);
  }

  // Rollback projects collection changes
  const projects = app.findCollectionByNameOrId("projects");
  if (projects) {
    const titleField = projects.fields.getByName("title");
    if (titleField) {
      titleField.name = "name";
    }
    
    if (projects.fields.getByName("description")) {
      projects.fields.removeByName("description");
    }
    app.save(projects);
  }
});