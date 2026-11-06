import mongoose from 'mongoose';

// Subdocument schema capturing Gherkin semantics with clause-bound And associations
const parsedScenarioSchema = new mongoose.Schema(
  {
    scenarioId: { type: String, required: true },
    title: { type: String, default: '' },
    given: { type: String, default: null },
    givenAnd: { type: [String], default: [] },
    when: { type: String, default: null },
    whenAnd: { type: [String], default: [] },
    then: { type: String, default: null },
    thenAnd: { type: [String], default: [] },
    raw: { type: String, required: true },
    parsingStatus: {
      type: String,
      enum: ['parsed', 'partial', 'unrecognized'],
      default: 'unrecognized',
    },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      index: true,
    },
    acceptanceCriteria: {
      type: String,
      default: '',
    },
    parsedCriteria: {
      type: [parsedScenarioSchema],
      default: [],
    },
    severity: {
      type: String,
      enum: {
        values: ['critical', 'high', 'medium', 'low'],
        message: '{VALUE} is not a valid severity level',
      },
      default: 'medium',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['high', 'medium', 'low'],
        message: '{VALUE} is not a valid priority level',
      },
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: '{VALUE} is not a valid ticket status',
      },
      default: 'open',
      index: true,
    },
    expectedResult: {
      type: String,
      trim: true,
      maxlength: [2000, 'Expected result cannot exceed 2000 characters'],
      default: '',
    },
    actualResult: {
      type: String,
      trim: true,
      maxlength: [2000, 'Actual result cannot exceed 2000 characters'],
      default: '',
    },
    reproductionSteps: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for query performance & filtering
ticketSchema.index({ project: 1, createdAt: -1 });
ticketSchema.index({ project: 1, status: 1 });
ticketSchema.index({ project: 1, severity: 1 });
ticketSchema.index({ project: 1, priority: 1 });
ticketSchema.index({ title: 'text', description: 'text' });

export const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
