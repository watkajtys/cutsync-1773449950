migrate((app) => {
  const aiTranscripts = new Collection({
    name: "ai_transcripts",
    type: "base"
  });
  
  aiTranscripts.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024",
    maxSelect: 1
  }));
  
  aiTranscripts.fields.add(new TextField({
    name: "raw_text"
  }));
  
  aiTranscripts.fields.add(new TextField({
    name: "srt_payload"
  }));
  
  app.save(aiTranscripts);

  const aiCutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base"
  });
  
  aiCutSuggestions.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024",
    maxSelect: 1
  }));
  
  aiCutSuggestions.fields.add(new NumberField({
    name: "start_timecode"
  }));
  
  aiCutSuggestions.fields.add(new NumberField({
    name: "end_timecode"
  }));
  
  aiCutSuggestions.fields.add(new TextField({
    name: "cut_reason"
  }));
  
  app.save(aiCutSuggestions);

  const reviewNotes = new Collection({
    name: "review_notes",
    type: "base"
  });
  
  reviewNotes.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024",
    maxSelect: 1
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
  const reviewNotes = app.findCollectionByNameOrId("review_notes");
  if (reviewNotes) {
    app.delete(reviewNotes);
  }

  const aiCutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
  if (aiCutSuggestions) {
    app.delete(aiCutSuggestions);
  }

  const aiTranscripts = app.findCollectionByNameOrId("ai_transcripts");
  if (aiTranscripts) {
    app.delete(aiTranscripts);
  }
});