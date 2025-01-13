import { logger } from '@/lib/logger';
import { useState } from 'react';
import { toast } from 'sonner';

export const useClipboard = () => {
	const [clipboard, setClipboard] = useState<string | null>(null);

	const copy = async (text: string) => {
		if (!navigator.clipboard) {
			toast.error('Clipboard is not supported in this browser');
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			setClipboard(text);
			toast.success(text + ' copied to clipboard!');
		} catch (error) {
			toast.error('Could not copy to clipboard', {
				description: 'Clipboard is only supported in secure contexts (HTTPS).',
			});
			logger.error('Could not copy to clipboard', error);
		}
	};

	return { clipboard, setClipboard, copy };
};
