import mongoose from 'mongoose';

// Allows http/https protocols with localhost, IP, or domain names and optional port/path
const urlRegex = /^(https?:\/\/)(localhost|127\.0\.0\.1|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|[a-zA-Z0-9-]+)(:[0-9]{1,5})?(\/.*)?$/i;

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    targetUrl: {
      type: String,
      required: [true, 'Target application URL is required'],
      trim: true,
      validate: {
        validator: (v) => urlRegex.test(v),
        message: 'Please provide a valid HTTP or HTTPS URL (e.g. http://localhost:4000 or https://example.com)',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'archived'],
        message: '{VALUE} is not a valid project status',
      },
      default: 'active',
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
      index: true,
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

// Query indexes
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ owner: 1, status: 1 });

export const Project = mongoose.model('Project', projectSchema);

export default Project;
