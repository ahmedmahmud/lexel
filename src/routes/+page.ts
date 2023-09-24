import { invoke } from '@tauri-apps/api/tauri';
import type { PageLoad } from './$types';

export interface File {
	name: string;
	path: string;
}

export const load: PageLoad = async () => {
	const files: File[] = await invoke('get_files');
	// const image: string = await invoke('read_image', { path: 'singleframe.png' });
	// console.log('wowow ', image)
	return {
		fs: files,
	};
};
