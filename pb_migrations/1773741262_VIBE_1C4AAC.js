migrate((app) => {
  const assetsCollectionId = "pbc_1321337024";

  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: assetsCollectionId,
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

  const aiCutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: assetsCollectionId,
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

  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: assetsCollectionId,
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
    app.delete(app.findCollectionByNameOrId("review_notes"));
  } catch (err) {}

  try {
    app.delete(app.findCollectionByNameOrId("ai_cut_suggestions"));
  } catch (err) {}

  try {
    app.delete(app.findCollectionByNameOrId("ai_transcripts"));
  } catch (err) {}
});