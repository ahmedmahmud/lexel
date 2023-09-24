import { invoke } from '@tauri-apps/api/tauri';
import type { PageLoad } from './$types';

export interface File {
	name: string;
	path: string;
}

// export const load: PageLoad = async ({ params }) => {
// 	const files: File[] = await invoke('get_files');
// 	return {
// 		fs: files
// 	};
// };
