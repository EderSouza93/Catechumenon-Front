import { NextRequest, NextResponse } from 'next/server';
import { progressServices, type UpdateProgressPayload } from '@/services/progressServices';
import { BackendConfigError } from '@/services/api';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  try {
    const backendRes = await progressServices.getProgress(token);
    const body = await backendRes.text();
    return new NextResponse(body, {
      status: backendRes.status,
      headers: { 'Content-Type': backendRes.headers.get('Content-Type') ?? 'application/json' },
    });
  } catch (error) {
    if (error instanceof BackendConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erro ao consultar o backend.' }, { status: 502 });
  }
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  let payload: UpdateProgressPayload;
  try {
    payload = (await request.json()) as UpdateProgressPayload;
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }
  try {
    const backendRes = await progressServices.updateProgress(payload, token);
    const body = await backendRes.text();
    return new NextResponse(body, {
      status: backendRes.status,
      headers: { 'Content-Type': backendRes.headers.get('Content-Type') ?? 'application/json' },
    });
  } catch (error) {
    if (error instanceof BackendConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erro ao consultar o backend.' }, { status: 502 });
  }
}
