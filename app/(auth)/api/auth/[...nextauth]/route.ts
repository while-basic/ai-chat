import { auth } from '@/app/(auth)/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const response = await auth();
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const response = await auth();
  return NextResponse.json(response);
}
