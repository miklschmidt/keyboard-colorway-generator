import { env } from '@/env';
import { Logger } from 'tslog';

export const logger = new Logger({
	type: 'pretty',
	minLevel: env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? 5 : 0,
});
