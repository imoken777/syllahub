import type { APIType } from '@/app/api/[...route]/route';
import { hc } from 'hono/client';

const baseUrl = new URL('https://sillahub.pages.dev/');
export const apiClient = hc<APIType>(baseUrl.href);
