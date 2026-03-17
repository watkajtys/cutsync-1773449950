migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "review_notes",
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

  app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("review_notes");
    app.delete(collection);
  } catch (err) {
    // collection not found
  }
});