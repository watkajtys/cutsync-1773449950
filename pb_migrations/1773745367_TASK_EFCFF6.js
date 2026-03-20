migrate((app) => {
  const assetsId = app.findCollectionByNameOrId("assets").id;
  const projectsCol = app.findCollectionByNameOrId("pbc_484305853");
  if (projectsCol) {
    const nameField = projectsCol.fields.getByName("name");
    if (nameField) {
      nameField.name = "title";
    }
    if (!projectsCol.fields.getByName("description")) {
      projectsCol.fields.add(new TextField({ name: "description" }));
    }
    app.save(projectsCol);
  }

  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base",
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

  const aiCutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
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

  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
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
  const collectionsToDrop = ["review_notes", "ai_cut_suggestions", "ai_transcripts"];
  for (const name of collectionsToDrop) {
    try {
      const col = app.findCollectionByNameOrId(name);
      app.delete(col);
    } catch (e) {
      // ignore silently if it doesn't exist
    }
  }

  try {
    const projectsCol = app.findCollectionByNameOrId("pbc_484305853");
    if (projectsCol) {
      const titleField = projectsCol.fields.getByName("title");
      if (titleField) {
        titleField.name = "name";
      }
      const descField = projectsCol.fields.getByName("description");
      if (descField) {
        projectsCol.fields.removeByName("description");
      }
      app.save(projectsCol);
    }
  } catch (e) {
    // ignore silently
  }
});