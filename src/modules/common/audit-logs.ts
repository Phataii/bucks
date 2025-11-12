// import AuditLog, { IAuditLog } from "../../models/audit-logs";
// import { Request } from "express";

// export default class AuditService {
//   /**
//    * Log an action in the audit trail.
//    * @param params object with all relevant log details
//    */
//   static async log({
//     userId,
//     action,
//     entity,
//     entityId,
//     description,
//     status = "success",
//     metadata = {},
//     req,
//   }: {
//     userId?: string;
//     action: string;
//     entity?: string;
//     entityId?: string;
//     description?: string;
//     status?: "success" | "failed";
//     metadata?: Record<string, any>;
//     req?: Request;
//   }): Promise<IAuditLog | void> {
//     try {
//       const log = await AuditLog.create({
//         userId,
//         action,
//         entity,
//         entityId,
//         description,
//         status,
//         metadata,
//         ipAddress: req?.ip || undefined,
//         userAgent: req?.headers["user-agent"] || undefined,
//       });

//       return log;
//     } catch (error) {
//       console.error("[AuditService] Failed to create audit log:", error);
//     }
//   }

//   /**
//    * Retrieve logs by filters (for admin dashboards, monitoring, etc.)
//    */
//   static async getLogs(filter: {
//     userId?: string;
//     action?: string;
//     status?: "success" | "failed";
//     entity?: string;
//   }): Promise<IAuditLog[]> {
//     const query: any = {};

//     if (filter.userId) query.userId = filter.userId;
//     if (filter.action) query.action = filter.action;
//     if (filter.status) query.status = filter.status;
//     if (filter.entity) query.entity = filter.entity;

//     // return AuditLog.find(query).sort({ createdAt: -1 }).limit(200).lean();
//   }
// }
