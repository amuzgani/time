import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/route_paths';
import useTodoDetailController from '@/views/todo/hooks/useTodoDetailController';
import {
  ActionsColumn,
  AlertError,
  Card,
  DetailForm,
  DetailStatusRow,
  DetailTitleInput,
  Field,
  FieldLabel,
  Header,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitles,
  Layout,
  MetaList,
  MetaRow,
  MetaTerm,
  MetaValue,
  OutlineDangerButton,
  Page,
  PageInner,
  PrimaryFullButton,
  SkeletonCard,
  SmallButton,
  StatusBadge,
  TextArea,
  TextLinkButton,
  ButtonGhost,
} from './TodoDetailPage.styles';

export default function TodoDetailPage(): React.ReactNode {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.todoId);
  const isValidId = Number.isInteger(id) && id > 0;

  useEffect(() => {
    if (!isValidId) {
      navigate(ROUTE_PATHS.NOT_FOUND, { replace: true });
    }
  }, [isValidId, navigate]);

  const {
    item,
    isInitialLoading,
    isActionLoading,
    errorMessage,
    onRetry,
    onSave,
    onToggleComplete,
    onDelete,
  } = useTodoDetailController({
    id,
    isEnabled: isValidId,
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!item) return;

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!title) return;

    await onSave({ title, description });
  };

  return (
    <Page>
      <PageInner>
        <Header>
          <HeaderTitles>
            <HeaderTitle>할 일 상세</HeaderTitle>
            <HeaderSubtitle>개별 작업의 내용을 확인하고 수정하세요</HeaderSubtitle>
          </HeaderTitles>
          <Link to={ROUTE_PATHS.TODO_LIST}>
            <ButtonGhost type="button">목록으로</ButtonGhost>
          </Link>
        </Header>

        {isInitialLoading ? (
          <Layout>
            <SkeletonCard />
            <SkeletonCard />
          </Layout>
        ) : errorMessage ? (
          <AlertError>
            <span>{errorMessage}</span>
            <button type="button" onClick={onRetry}>
              다시 시도
            </button>
          </AlertError>
        ) : !item ? (
          <Card>
            <p>해당 할 일을 찾을 수 없습니다.</p>
            <Link to={ROUTE_PATHS.TODO_LIST}>목록으로</Link>
          </Card>
        ) : (
          <Layout>
            <Card>
              <DetailForm onSubmit={handleSubmit}>
                <div>
                  <DetailTitleInput
                    name="title"
                    defaultValue={item.title}
                    disabled={isActionLoading}
                  />
                  <DetailStatusRow>
                    <StatusBadge $completed={item.isCompleted}>
                      {item.isCompleted ? '완료' : '진행중'}
                    </StatusBadge>
                    <SmallButton
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => {
                        void onToggleComplete();
                      }}
                    >
                      {item.isCompleted ? '미완료로 표시' : '완료로 표시'}
                    </SmallButton>
                  </DetailStatusRow>
                </div>

                <Field>
                  <FieldLabel>설명</FieldLabel>
                  <TextArea
                    name="description"
                    defaultValue={item.description}
                    disabled={isActionLoading}
                  />
                </Field>
              </DetailForm>
            </Card>

            <ActionsColumn>
              <Card>
                <h2>정보</h2>
                <MetaList>
                  <MetaRow>
                    <MetaTerm>생성일</MetaTerm>
                    <MetaValue>{item.createdAtLabel}</MetaValue>
                  </MetaRow>
                  <MetaRow>
                    <MetaTerm>수정일</MetaTerm>
                    <MetaValue>{item.updatedAtLabel}</MetaValue>
                  </MetaRow>
                  <MetaRow>
                    <MetaTerm>기한</MetaTerm>
                    <MetaValue>{item.dueDateLabel ?? '-'}</MetaValue>
                  </MetaRow>
                </MetaList>
              </Card>

              <Card>
                <ActionsColumn>
                  <PrimaryFullButton
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => {
                      const form =
                        document.querySelector<HTMLFormElement>('form');
                      form?.requestSubmit();
                    }}
                  >
                    저장
                  </PrimaryFullButton>
                  <OutlineDangerButton
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => {
                      void onDelete();
                    }}
                  >
                    삭제
                  </OutlineDangerButton>
                  <Link to={ROUTE_PATHS.TODO_LIST}>
                    <TextLinkButton>목록으로</TextLinkButton>
                  </Link>
                </ActionsColumn>
              </Card>
            </ActionsColumn>
          </Layout>
        )}
      </PageInner>
    </Page>
  );
}

