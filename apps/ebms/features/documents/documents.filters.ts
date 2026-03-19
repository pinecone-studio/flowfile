import { actionLabels, actionOrder } from './documents.constants';
import type {
  DocumentsCategoryKey,
  DocumentsPageGroup,
  DocumentsPageModel,
} from './documents.types';

function matchesSearch(group: DocumentsPageGroup, searchValue: string) {
  if (!searchValue) {
    return true;
  }

  return (
    group.employeeName.toLowerCase().includes(searchValue) ||
    group.employeeCode.toLowerCase().includes(searchValue) ||
    group.latestAction.toLowerCase().includes(searchValue) ||
    group.items.some((item) => item.title.toLowerCase().includes(searchValue))
  );
}

function buildCategoryCounts(groups: DocumentsPageGroup[]) {
  const counts = new Map<DocumentsCategoryKey, number>([['all', groups.length]]);

  for (const key of actionOrder.slice(1) as Exclude<DocumentsCategoryKey, 'all'>[]) {
    counts.set(key, groups.filter((group) => group.categoryKey === key).length);
  }

  return counts;
}

export function buildFilteredDocumentsModel(input: {
  groups: DocumentsPageGroup[];
  search: string;
  categoryKey: DocumentsCategoryKey;
}): DocumentsPageModel {
  const searchValue = input.search.trim().toLowerCase();
  const searchMatchedGroups = input.groups.filter((group) =>
    matchesSearch(group, searchValue),
  );
  const groups = searchMatchedGroups.filter(
    (group) => input.categoryKey === 'all' || group.categoryKey === input.categoryKey,
  );
  const counts = buildCategoryCounts(searchMatchedGroups);

  return {
    categories: actionOrder.map((key) => ({
      key,
      label:
        key === 'all'
          ? 'All'
          : actionLabels[key as Exclude<DocumentsCategoryKey, 'all'>],
      count: counts.get(key) ?? 0,
    })),
    groups,
    ongoingCount: groups.filter(
      (group) => !['completed', 'rejected', 'canceled'].includes(group.rawJobStatus),
    ).length,
    completedCount: groups.filter((group) => group.rawJobStatus === 'completed').length,
  };
}
