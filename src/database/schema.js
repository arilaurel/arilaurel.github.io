import mongoose from 'mongoose';

// Article Schema
const articleSchema = mongoose.Schema({
  journal: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
  },
});

// Extra info page
const extraSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
  },
});

const Article = mongoose.model('writing', articleSchema);
const Extra = mongoose.model('extra', extraSchema);
export {Article, Extra};
