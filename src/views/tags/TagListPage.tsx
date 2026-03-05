import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/route_paths';
import useTagListController from '@/views/tags/hooks/useTagListController';
import {
  ButtonGhostLink,
  ButtonPrimary,
  Card,
  ColorDot,
  CreateFormRow,
  DangerTextButton,
  EmptyState,
  Header,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitles,
  List,
  ListHeader,
  ListRow,
  Page,
  PageInner,
  RowActions,
  TagInfo,
  TagName,
  TextInput,
  LinkTextButton,
} from './TagListPage.styles';

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

  if (isInitialLoading) {
    return (
      <Page>
        <PageInner>
          <Header>
            <HeaderTitles>
              <HeaderTitle>태그 관리</HeaderTitle>
              <HeaderSubtitle>할 일에 사용할 태그를 구성하세요</HeaderSubtitle>
            </HeaderTitles>
          </Header>
          <Card>불러오는 중입니다...</Card>
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
              <HeaderTitle>태그 관리</HeaderTitle>
              <HeaderSubtitle>할 일에 사용할 태그를 구성하세요</HeaderSubtitle>
            </HeaderTitles>
          </Header>
          <Card>
            <p>{errorMessage}</p>
            <ButtonPrimary type="button" onClick={onRetry}>
              다시 시도
            </ButtonPrimary>
          </Card>
        </PageInner>
      </Page>
    );
  }

  return (
    <Page>
      <PageInner>
        <Header>
          <HeaderTitles>
            <HeaderTitle>태그 관리</HeaderTitle>
            <HeaderSubtitle>할 일에 사용할 태그를 구성하세요</HeaderSubtitle>
          </HeaderTitles>
          <Link to={ROUTE_PATHS.TODO_LIST}>
            <ButtonGhostLink>할 일 목록</ButtonGhostLink>
          </Link>
        </Header>

        <Card>
          <div>
            <h2>새 태그 추가</h2>
            <form onSubmit={handleSubmit}>
              <CreateFormRow>
                <TextInput
                  name="name"
                  placeholder="태그 이름"
                  disabled={isActionLoading}
                />
                <TextInput
                  name="color"
                  placeholder="#색상코드"
                  disabled={isActionLoading}
                />
                <ButtonPrimary type="submit" disabled={isActionLoading}>
                  추가
                </ButtonPrimary>
              </CreateFormRow>
            </form>
          </div>

          <div>
            <ListHeader>
              <span>{items.length}개의 태그</span>
            </ListHeader>
            {items.length === 0 ? (
              <EmptyState>
                <p>등록된 태그가 없습니다.</p>
              </EmptyState>
            ) : (
              <List>
                {items.map((item) => (
                  <ListRow key={item.id}>
                    <TagInfo>
                      <ColorDot $color={item.color} />
                      <TagName>{item.name}</TagName>
                    </TagInfo>
                    <RowActions>
                      <Link
                        to={ROUTE_PATHS.TAG_DETAIL.replace(':tagId', String(item.id))}
                      >
                        <LinkTextButton>상세</LinkTextButton>
                      </Link>
                    </RowActions>
                    <RowActions>
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
                  </ListRow>
                ))}
              </List>
            )}
          </div>
        </Card>
      </PageInner>
    </Page>
  );
}

