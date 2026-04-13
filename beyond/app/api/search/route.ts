import {NextRequest, NextResponse} from 'next/server';
import {createServerRuntimeConfig} from '@/domain/wows/runtime-config';
import {getServerDefinition} from '@/domain/wows/server';
import {createWowsApiClient} from '@/domain/wows/wows-api-client';
import {searchEntities} from '@/features/search/search-engine';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q') ?? '';
    const serverId = request.nextUrl.searchParams.get('server') ?? 'na';
    const server = getServerDefinition(serverId);
    const client = createWowsApiClient(createServerRuntimeConfig());
    const result = await searchEntities({
      client,
      query,
      server,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to complete search.';

    return NextResponse.json({message}, {status: 400});
  }
}

