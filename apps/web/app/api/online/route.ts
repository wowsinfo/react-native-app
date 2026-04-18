import {NextRequest, NextResponse} from 'next/server';
import {createServerRuntimeConfig} from '@/domain/wows/runtime-config';
import {getServerDefinition} from '@/domain/wows/server';
import {createWowsApiClient} from '@/domain/wows/wows-api-client';

export async function GET(request: NextRequest) {
  try {
    const serverId = request.nextUrl.searchParams.get('server') ?? 'na';
    const server = getServerDefinition(serverId);
    const client = createWowsApiClient(createServerRuntimeConfig());
    const playersOnline = await client.getPlayersOnline(server);

    return NextResponse.json({
      playersOnline,
      server: server.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to fetch online count.';

    return NextResponse.json({message}, {status: 400});
  }
}

