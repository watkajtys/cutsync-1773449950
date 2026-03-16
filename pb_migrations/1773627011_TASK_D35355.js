/* eslint-disable */
migrate((app) => {
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
}, (app) => {
  try {
    const reviewNotes = app.findCollectionByNameOrId("review_notes");
    if (reviewNotes) {
      app.delete(reviewNotes);
    }
  } catch (err) {
    // ignore
  }
});