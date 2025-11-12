import { Schema, model, Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  userId?: Types.ObjectId;             // who performed the action (optional for system events)
  action: string;                      // short action name (e.g. "USER_LOGIN", "ACCOUNT_UPDATED")
  entity?: string;                     // what resource was affected (e.g. "User", "Transaction")
  entityId?: Types.ObjectId | string;  // specific ID of affected resource
  description?: string;                // human-readable explanation
  ipAddress?: string;                  // for traceability
  userAgent?: string;                  // device/browser info
  status: "success" | "failed";        // outcome of the action
  metadata?: Record<string, any>;      // flexible field for context (e.g. payloads, response data)
  createdAt: Date;                     // auto-set
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, index: true },
    entity: { type: String },
    entityId: { type: Schema.Types.Mixed },
    description: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    status: { type: String, enum: ["success", "failed"], required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Useful indexes
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, status: 1 });
auditLogSchema.index({ entity: 1, entityId: 1 });

const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);
export default AuditLog;
