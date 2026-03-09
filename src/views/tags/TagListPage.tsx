import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/route_paths';
import useTagListController from '@/views/tags/hooks/useTagListController';
import { useMemo } from 'react';
import S from './TagListPage.styles';

export default function TagListPage(): React.ReactNode {
  const {
    items,
    isInitialLoading,
    isActionLoading,
    errorMessage,
    onRetry,
    onCreate,
    onDelete,
  } = useTagListController();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const color = String(formData.get('color') ?? '').trim();

    if (!name || !color) return;

    const success = await onCreate({ name, color });

    if (success) {
      event.currentTarget.reset();
    }
  };

  const deleteHandlers = useMemo(() => {
    const handlers = new Map<number, () => void>();

    for (const item of items) {
      handlers.set(item.id, () => {
        void onDelete(item.id);
      });
    }

    return handlers;
  }, [items, onDelete]);

  if (isInitialLoading) {
    return (
      <S.Page>
        <S.PageInner>
          <S.Header>
            <S.HeaderTitles>
              <S.HeaderTitle>태그 관리</S.HeaderTitle>
              <S.HeaderSubtitle>할 일에 사용할 태그를 구성하세요</S.HeaderSubtitle>
            </S.HeaderTitles>
          </S.Header>
          <S.Card>불러오는 중입니다...</S.Card>
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
              <S.HeaderTitle>태그 관리</S.HeaderTitle>
              <S.HeaderSubtitle>할 일에 사용할 태그를 구성하세요</S.HeaderSubtitle>
            </S.HeaderTitles>
          </S.Header>
          <S.Card>
            <p>{errorMessage}</p>
            <S.ButtonPrimary type="button" onClick={onRetry}>
              다시 시도
            </S.ButtonPrimary>
          </S.Card>
        </S.PageInner>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.PageInner>
        <S.Header>
          <S.HeaderTitles>
            <S.HeaderTitle>태그 관리</S.HeaderTitle>
            <S.HeaderSubtitle>할 일에 사용할 태그를 구성하세요</S.HeaderSubtitle>
          </S.HeaderTitles>
          <Link to={ROUTE_PATHS.TODO_LIST}>
            <S.ButtonGhostLink>할 일 목록</S.ButtonGhostLink>
          </Link>
        </S.Header>

        <S.Card>
          <div>
            <h2>새 태그 추가</h2>
            <form onSubmit={handleSubmit}>
              <S.CreateFormRow>
                <S.TextInput
                  name="name"
                  placeholder="태그 이름"
                  disabled={isActionLoading}
                />
                <S.TextInput
                  name="color"
                  placeholder="#색상코드"
                  disabled={isActionLoading}
                />
                <S.ButtonPrimary type="submit" disabled={isActionLoading}>
                  추가
                </S.ButtonPrimary>
              </S.CreateFormRow>
            </form>
          </div>

          <div>
            <S.ListHeader>
              <span>{items.length}개의 태그</span>
            </S.ListHeader>
            {items.length === 0 ? (
              <S.EmptyState>
                <p>등록된 태그가 없습니다.</p>
              </S.EmptyState>
            ) : (
              <S.List>
                {items.map((item) => (
                  <S.ListRow key={item.id}>
                    <S.TagInfo>
                      <S.ColorDot $color={item.color} />
                      <S.TagName>{item.name}</S.TagName>
                    </S.TagInfo>
                    <S.RowActions>
                      <Link
                        to={ROUTE_PATHS.TAG_DETAIL.replace(':tagId', String(item.id))}
                      >
                        <S.LinkTextButton>상세</S.LinkTextButton>
                      </Link>
                    </S.RowActions>
                    <S.RowActions>
                      <S.DangerTextButton
                        type="button"
                        onClick={deleteHandlers.get(item.id)}
                        disabled={isActionLoading}
                      >
                        삭제
                      </S.DangerTextButton>
                    </S.RowActions>
                  </S.ListRow>
                ))}
              </S.List>
            )}
          </div>
        </S.Card>
      </S.PageInner>
    </S.Page>
  );
}
