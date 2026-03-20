migrate((app) => {
  const assetsId = app.findCollectionByNameOrId("assets").id;
  const reviewNotes = new Collection({
    id: "pbc_review_notes",
    name: "review_notes",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: assetsId,
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
    const reviewNotes = app.findCollectionByNameOrId("pbc_review_notes");
    app.delete(reviewNotes);
  } catch (err) {
    // silently ignore if not found
  }
});