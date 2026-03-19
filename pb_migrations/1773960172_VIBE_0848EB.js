migrate((app) => {
  const collection = new Collection({
    name: "review_notes",
    type: "base",
  });

  collection.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024",
    maxSelect: 1,
  }));

  collection.fields.add(new TextField({
    name: "author",
  }));

  collection.fields.add(new NumberField({
    name: "timestamp",
  }));

  collection.fields.add(new TextField({
    name: "note_text",
  }));

  collection.fields.add(new JSONField({
    name: "canvas_data",
  }));

  app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("review_notes");
    app.delete(collection);
  } catch (err) {
    // collection not found or already deleted
  }
});