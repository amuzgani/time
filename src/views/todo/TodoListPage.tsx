import { ROUTE_PATHS } from '@/constants/route_paths';
import useTodoListController from '@/views/todo/hooks/useTodoListController';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import S from './TodoListPage.styles';

export default function TodoListPage(): React.ReactNode {
  const {
    items,
    isInitialLoading,
    isActionLoading,
    errorMessage,
    onRetry,
    onCreate,
    onToggleComplete,
    onDelete,
  } = useTodoListController();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search || item.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'completed'
            ? item.isCompleted
            : !item.isCompleted;

      return matchSearch && matchStatus;
    });
  }, [items, search, statusFilter]);

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.isCompleted).length;

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setSearch(event.target.value);
    },
    [],
  );

  const handleStatusFilterChange: React.ChangeEventHandler<HTMLSelectElement> =
    useCallback((event) => {
      setStatusFilter(event.target.value as 'all' | 'active' | 'completed');
    }, []);

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!title) return;

    const success = await onCreate({ title, description: description || undefined });

    if (success) {
      event.currentTarget.reset();
    }
  };

  const toggleHandlers = useMemo(() => {
    const handlers = new Map<number, () => void>();

    for (const item of filteredItems) {
      handlers.set(item.id, () => {
        void onToggleComplete(item.id);
      });
    }

    return handlers;
  }, [filteredItems, onToggleComplete]);

  const deleteHandlers = useMemo(() => {
    const handlers = new Map<number, () => void>();

    for (const item of filteredItems) {
      handlers.set(item.id, () => {
        void onDelete(item.id);
      });
    }

    return handlers;
  }, [filteredItems, onDelete]);

  if (isInitialLoading) {
    return (
      <S.Page>
        <S.PageInner>
          <S.Header>
            <S.HeaderTitles>
              <S.HeaderTitle>할 일 목록</S.HeaderTitle>
              <S.HeaderSubtitle>오늘 할 일을 한눈에 관리하세요</S.HeaderSubtitle>
            </S.HeaderTitles>
          </S.Header>
          <S.ListCard>불러오는 중입니다...</S.ListCard>
        </S.PageInner>
      </S.Page>
    );
  }

  if (errorMessage) {
    return (
      <S.Page>
        <S.PageInner>
          <S.Header>
            <S.HeaderTitles>
              <S.HeaderTitle>할 일 목록</S.HeaderTitle>
              <S.HeaderSubtitle>오늘 할 일을 한눈에 관리하세요</S.HeaderSubtitle>
            </S.HeaderTitles>
          </S.Header>
          <S.ListCard>
            <p>{errorMessage}</p>
            <S.ButtonPrimary type="button" onClick={onRetry}>
              다시 시도
            </S.ButtonPrimary>
          </S.ListCard>
        </S.PageInner>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.PageInner>
        <S.Header>
          <S.HeaderTitles>
            <S.HeaderTitle>할 일 목록</S.HeaderTitle>
            <S.HeaderSubtitle>오늘 할 일을 한눈에 관리하세요</S.HeaderSubtitle>
          </S.HeaderTitles>
          <S.HeaderActions>
            <S.ButtonPrimary type="button">새 할 일</S.ButtonPrimary>
            <Link to={ROUTE_PATHS.TAG_LIST}>
              <S.ButtonGhostLink>태그 관리</S.ButtonGhostLink>
            </Link>
          </S.HeaderActions>
        </S.Header>

        <S.SummarySection>
          <S.SummaryGrid>
            <S.SummaryCard>
              <S.SummaryLabel>총 할 일</S.SummaryLabel>
              <S.SummaryValue>{totalCount}</S.SummaryValue>
            </S.SummaryCard>
            <S.SummaryCard>
              <S.SummaryLabel>완료된 할 일</S.SummaryLabel>
              <S.SummaryValue>
                {completedCount}{' '}
                <S.SummarySub>/ {totalCount || 1}</S.SummarySub>
              </S.SummaryValue>
            </S.SummaryCard>
          </S.SummaryGrid>
        </S.SummarySection>

        <S.FiltersSection>
          <S.FiltersCard>
            <S.SearchInput
              type="search"
              placeholder="제목으로 검색"
              value={search}
              onChange={handleSearchChange}
            />
            <S.Select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="all">전체</option>
              <option value="active">진행중</option>
              <option value="completed">완료</option>
            </S.Select>
            <S.FiltersExtra>
              <S.TextButton type="button" onClick={handleResetFilters}>
                필터 초기화
              </S.TextButton>
            </S.FiltersExtra>
          </S.FiltersCard>
        </S.FiltersSection>

        <S.ListSection>
          <S.ListCard>
            <S.CreateBlock>
              <S.CreateTitle>새 할 일 추가</S.CreateTitle>
              <form onSubmit={handleSubmit}>
                <S.CreateFormRow>
                  <S.TextInput
                    name="title"
                    placeholder="제목"
                    disabled={isActionLoading}
                  />
                  <S.TextInput
                    name="description"
                    placeholder="설명 (선택)"
                    disabled={isActionLoading}
                  />
                  <S.ButtonPrimary type="submit" disabled={isActionLoading}>
                    추가
                  </S.ButtonPrimary>
                </S.CreateFormRow>
              </form>
            </S.CreateBlock>

            <S.ListToolbar>
              <S.ListCount>{filteredItems.length}개의 결과</S.ListCount>
            </S.ListToolbar>

            {filteredItems.length === 0 ? (
              <S.EmptyState>
                <p>아직 등록된 할 일이 없습니다.</p>
                <S.ButtonPrimary type="button">첫 할 일 만들기</S.ButtonPrimary>
              </S.EmptyState>
            ) : (
              <S.TodoList>
                {filteredItems.map((item) => (
                  <S.TodoRow key={item.id}>
                    <S.TodoMainCell>
                      <S.TodoCheckboxLabel>
                        <input
                          type="checkbox"
                          checked={item.isCompleted}
                          onChange={toggleHandlers.get(item.id)}
                          disabled={isActionLoading}
                        />
                        <S.TodoTitle>{item.title}</S.TodoTitle>
                      </S.TodoCheckboxLabel>
                    </S.TodoMainCell>
                    <S.StatusBadge $completed={item.isCompleted}>
                      {item.isCompleted ? '완료' : '진행중'}
                    </S.StatusBadge>
                    <S.DateText>{item.updatedAtLabel ?? item.createdAtLabel}</S.DateText>
                    <S.RowActions>
                      <Link
                        to={ROUTE_PATHS.TODO_DETAIL.replace(
                          ':todoId',
                          String(item.id),
                        )}
                      >
                        <S.LinkTextButton>상세</S.LinkTextButton>
                      </Link>
                      <S.DangerTextButton
                        type="button"
                        onClick={deleteHandlers.get(item.id)}
                        disabled={isActionLoading}
                      >
                        삭제
                      </S.DangerTextButton>
                    </S.RowActions>
                  </S.TodoRow>
                ))}
              </S.TodoList>
            )}
          </S.ListCard>
        </S.ListSection>
      </S.PageInner>
    </S.Page>
  );
}
