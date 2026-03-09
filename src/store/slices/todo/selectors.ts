import type { RootState } from '@/store';
import { todoAdapter } from './slice';

const selectors = todoAdapter.getSelectors((state: RootState) => state.todo);

export function selectAllTodoItems(state: RootState) {
  return selectors.selectAll(state);
}

export function selectTodoItemById(state: RootState, id: number) {
  return selectors.selectById(state, id);
}
