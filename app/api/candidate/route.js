import connectMongo from '@/lib/mongoose';
import Candidate from '@/models/Candidate';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongo();
  const candidates = await Candidate.find().populate('assignedProjects');
  return NextResponse.json(candidates);
}

export async function POST(req) {
  await connectMongo();
  const data = await req.json();
  const newCandidate = await Candidate.create(data);
  return NextResponse.json({ message: 'Candidate created successfully', candidate: newCandidate });
}

export async function PATCH(req) {
  await connectMongo();
  const { id, projectId } = await req.json();
  const candidate = await Candidate.findById(id);
  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  }
  candidate.assignedProjects.push(projectId);
  await candidate.save();
  return NextResponse.json({ message: 'Project assigned successfully', candidate });
}
