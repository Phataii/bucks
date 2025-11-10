import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';
import { NotFoundException } from './service-exceptions';

// 🧩 Function overloads
export async function findUser(
  identifier: string,
  throwError?: true
): Promise<IUser>;

export async function findUser(
  identifier: string,
  throwError?: false
): Promise<IUser | null>;

export async function findUser(
  identifier: string,
  throwError = true
): Promise<IUser | null> {
  // Validate input
  if (!identifier?.trim()) {
    throw new NotFoundException('Identifier is required');
  }

  // Build query
  const query = buildQuery(identifier.trim());
  if (!query) {
    if (throwError) throw new NotFoundException('Invalid payload');
    return null;
  }

  // Find user
  const user = await User.findOne(query).lean<IUser>();
  if (!user && throwError) {
    throw new NotFoundException('User not found');
  }

  return user;
}

function buildQuery(identifier: string): Record<string, any> | null {
  const patterns = [
    { test: (id: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id), field: 'email', transform: (id: string) => id.toLowerCase() },
    { test: (id: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id), field: 'username', transform: (id: string) => id.toLowerCase() },
    { test: (id: string) => mongoose.Types.ObjectId.isValid(id), field: '_id', transform: (id: string) => id },
  ];

  const match = patterns.find(({ test }) => test(identifier));
  return match ? { [match.field]: match.transform(identifier) } : null;
}