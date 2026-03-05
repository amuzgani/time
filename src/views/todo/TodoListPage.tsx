import { ROUTE_PATHS } from '@/constants/route_paths';
import useTodoListController from '@/views/todo/hooks/useTodoListController';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ButtonGhostLink,
  ButtonPrimary,
  CreateBlock,
  CreateFormRow,
  CreateTitle,
  DangerTextButton,
  DateText,
  EmptyState,
  FiltersCard,
  FiltersExtra,
  FiltersSection,
  Header,
  HeaderActions,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitles,
  LinkTextButton,
  ListCard,
  ListCount,
  ListSection,
  ListToolbar,
  Page,
  PageInner,
  RowActions,
  SearchInput,
  Select,
  StatusBadge,
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummarySection,
  SummarySub,
  SummaryValue,
  TextButton,
  TextInput,
  TodoCheckboxLabel,
  TodoList,
  TodoMainCell,
  TodoRow,
  TodoTitle,
} from './TodoListPage.styles';

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

  if (isInitialLoading) {
    return (
      <Page>
        <PageInner>
          <Header>
            <HeaderTitles>
              <HeaderTitle>할 일 목록</HeaderTitle>
              <HeaderSubtitle>오늘 할 일을 한눈에 관리하세요</HeaderSubtitle>
            </HeaderTitles>
          </Header>
          <ListCard>불러오는 중입니다...</ListCard>
        </PageInner>
      </Page>
    );
  }

  if (errorMessage) {
    return (
      <Page>
        <PageInner>
          <Header>
            <HeaderTitles>
              <HeaderTitle>할 일 목록</HeaderTitle>
              <HeaderSubtitle>오늘 할 일을 한눈에 관리하세요</HeaderSubtitle>
            </HeaderTitles>
          </Header>
          <ListCard>
            <p>{errorMessage}</p>
            <ButtonPrimary type="button" onClick={onRetry}>
              다시 시도
            </ButtonPrimary>
          </ListCard>
        </PageInner>
      </Page>
    );
  }

  return (
    <Page>
      <PageInner>
        <Header>
          <HeaderTitles>
            <HeaderTitle>할 일 목록</HeaderTitle>
            <HeaderSubtitle>오늘 할 일을 한눈에 관리하세요</HeaderSubtitle>
          </HeaderTitles>
          <HeaderActions>
            <ButtonPrimary type="button">새 할 일</ButtonPrimary>
            <Link to={ROUTE_PATHS.TAG_LIST}>
              <ButtonGhostLink>태그 관리</ButtonGhostLink>
            </Link>
          </HeaderActions>
        </Header>

        <SummarySection>
          <SummaryGrid>
            <SummaryCard>
              <SummaryLabel>총 할 일</SummaryLabel>
              <SummaryValue>{totalCount}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>완료된 할 일</SummaryLabel>
              <SummaryValue>
                {completedCount}{' '}
                <SummarySub>/ {totalCount || 1}</SummarySub>
              </SummaryValue>
            </SummaryCard>
          </SummaryGrid>
        </SummarySection>

        <FiltersSection>
          <FiltersCard>
            <SearchInput
              type="search"
              placeholder="제목으로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | 'active' | 'completed')
              }
            >
              <option value="all">전체</option>
              <option value="active">진행중</option>
              <option value="completed">완료</option>
            </Select>
            <FiltersExtra>
              <TextButton
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                }}
              >
                필터 초기화
              </TextButton>
            </FiltersExtra>
          </FiltersCard>
        </FiltersSection>

        <ListSection>
          <ListCard>
            <CreateBlock>
              <CreateTitle>새 할 일 추가</CreateTitle>
              <form onSubmit={handleSubmit}>
                <CreateFormRow>
                  <TextInput
                    name="title"
                    placeholder="제목"
                    disabled={isActionLoading}
                  />
                  <TextInput
                    name="description"
                    placeholder="설명 (선택)"
                    disabled={isActionLoading}
                  />
                  <ButtonPrimary type="submit" disabled={isActionLoading}>
                    추가
                  </ButtonPrimary>
                </CreateFormRow>
              </form>
            </CreateBlock>

            <ListToolbar>
              <ListCount>{filteredItems.length}개의 결과</ListCount>
            </ListToolbar>

            {filteredItems.length === 0 ? (
              <EmptyState>
                <p>아직 등록된 할 일이 없습니다.</p>
                <ButtonPrimary type="button">첫 할 일 만들기</ButtonPrimary>
              </EmptyState>
            ) : (
              <TodoList>
                {filteredItems.map((item) => (
                  <TodoRow key={item.id}>
                    <TodoMainCell>
                      <TodoCheckboxLabel>
                        <input
                          type="checkbox"
                          checked={item.isCompleted}
                          onChange={() => {
                            void onToggleComplete(item.id);
                          }}
                          disabled={isActionLoading}
                        />
                        <TodoTitle>{item.title}</TodoTitle>
                      </TodoCheckboxLabel>
                    </TodoMainCell>
                    <StatusBadge $completed={item.isCompleted}>
                      {item.isCompleted ? '완료' : '진행중'}
                    </StatusBadge>
                    <DateText>{item.updatedAtLabel ?? item.createdAtLabel}</DateText>
                    <RowActions>
                      <Link
                        to={ROUTE_PATHS.TODO_DETAIL.replace(
                          ':todoId',
                          String(item.id),
                        )}
                      >
                        <LinkTextButton>상세</LinkTextButton>
                      </Link>
                      <DangerTextButton
                        type="button"
                        onClick={() => {
                          void onDelete(item.id);
                        }}
                        disabled={isActionLoading}
                      >
                        삭제
                      </DangerTextButton>
                    </RowActions>
                  </TodoRow>
                ))}
              </TodoList>
            )}
          </ListCard>
        </ListSection>
      </PageInner>
    </Page>
  );
}

