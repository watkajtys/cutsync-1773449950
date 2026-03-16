/* eslint-disable */
migrate((app) => {
  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  reviewNotes.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024",
    maxSelect: 1,
    cascadeDelete: true
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
  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    if (reviewNotes) {
      app.delete(reviewNotes);
    }
  } catch (err) {
    // silently ignore if already deleted
  }
});