import type { RootState } from '@/store';
import { tagAdapter } from './slice';

const selectors = tagAdapter.getSelectors((state: RootState) => state.tag);

export function selectAllTagItems(state: RootState) {
  return selectors.selectAll(state);
}

export function selectTagItemById(state: RootState, id: number) {
  return selectors.selectById(state, id);
}
