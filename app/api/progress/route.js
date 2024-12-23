import connectMongo from '@/lib/mongoose';
import Progress from '@/models/Progress';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get('candidateId');

  if (candidateId) {
    const candidateProgress = await Progress.find({ candidateId });
    return NextResponse.json(candidateProgress);
  }
  const allProgress = await Progress.find();
  return NextResponse.json(allProgress);
}

export async function POST(req) {
  await connectMongo();
  const data = await req.json();
  const newProgress = await Progress.create(data);
  return NextResponse.json({ message: 'Progress created successfully', progress: newProgress });
}

export async function GET_SCORE(req) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get('candidateId');

  if (candidateId) {
    const candidateProgress = await Progress.find({ candidateId });
    const completedTasks = candidateProgress.filter(p => p.status === 'completed').length;
    const totalTasks = candidateProgress.length;
    const score = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return NextResponse.json({ candidateId, score });
  }
  return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
}
