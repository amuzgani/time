import { useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/route_paths';
import useTodoDetailController from '@/views/todo/hooks/useTodoDetailController';
import S from './TodoDetailPage.styles';

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
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!item) return;

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!title) return;

    await onSave({ title, description });
  };

  const handleToggleComplete = useCallback(() => {
    void onToggleComplete();
  }, [onToggleComplete]);

  const handleSubmitButtonClick = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  const handleDelete = useCallback(async () => {
    const isDeleted = await onDelete();

    if (isDeleted) {
      navigate(ROUTE_PATHS.TODO_LIST);
    }
  }, [navigate, onDelete]);

  return (
    <S.Page>
      <S.PageInner>
        <S.Header>
          <S.HeaderTitles>
            <S.HeaderTitle>할 일 상세</S.HeaderTitle>
            <S.HeaderSubtitle>개별 작업의 내용을 확인하고 수정하세요</S.HeaderSubtitle>
          </S.HeaderTitles>
          <Link to={ROUTE_PATHS.TODO_LIST}>
            <S.ButtonGhost type="button">목록으로</S.ButtonGhost>
          </Link>
        </S.Header>

        {isInitialLoading ? (
          <S.Layout>
            <S.SkeletonCard />
            <S.SkeletonCard />
          </S.Layout>
        ) : errorMessage ? (
          <S.AlertError>
            <span>{errorMessage}</span>
            <button type="button" onClick={onRetry}>
              다시 시도
            </button>
          </S.AlertError>
        ) : !item ? (
          <S.Card>
            <p>해당 할 일을 찾을 수 없습니다.</p>
            <Link to={ROUTE_PATHS.TODO_LIST}>목록으로</Link>
          </S.Card>
        ) : (
          <S.Layout>
            <S.Card>
              <S.DetailForm ref={formRef} onSubmit={handleSubmit}>
                <div>
                  <S.DetailTitleInput
                    name="title"
                    defaultValue={item.title}
                    disabled={isActionLoading}
                  />
                  <S.DetailStatusRow>
                    <S.StatusBadge $completed={item.isCompleted}>
                      {item.isCompleted ? '완료' : '진행중'}
                    </S.StatusBadge>
                    <S.SmallButton
                      type="button"
                      disabled={isActionLoading}
                      onClick={handleToggleComplete}
                    >
                      {item.isCompleted ? '미완료로 표시' : '완료로 표시'}
                    </S.SmallButton>
                  </S.DetailStatusRow>
                </div>

                <S.Field>
                  <S.FieldLabel>설명</S.FieldLabel>
                  <S.TextArea
                    name="description"
                    defaultValue={item.description}
                    disabled={isActionLoading}
                  />
                </S.Field>
              </S.DetailForm>
            </S.Card>

            <S.ActionsColumn>
              <S.Card>
                <h2>정보</h2>
                <S.MetaList>
                  <S.MetaRow>
                    <S.MetaTerm>생성일</S.MetaTerm>
                    <S.MetaValue>{item.createdAtLabel}</S.MetaValue>
                  </S.MetaRow>
                  <S.MetaRow>
                    <S.MetaTerm>수정일</S.MetaTerm>
                    <S.MetaValue>{item.updatedAtLabel}</S.MetaValue>
                  </S.MetaRow>
                  <S.MetaRow>
                    <S.MetaTerm>기한</S.MetaTerm>
                    <S.MetaValue>{item.dueDateLabel ?? '-'}</S.MetaValue>
                  </S.MetaRow>
                </S.MetaList>
              </S.Card>

              <S.Card>
                <S.ActionsColumn>
                  <S.PrimaryFullButton
                    type="button"
                    disabled={isActionLoading}
                    onClick={handleSubmitButtonClick}
                  >
                    저장
                  </S.PrimaryFullButton>
                  <S.OutlineDangerButton
                    type="button"
                    disabled={isActionLoading}
                    onClick={handleDelete}
                  >
                    삭제
                  </S.OutlineDangerButton>
                  <Link to={ROUTE_PATHS.TODO_LIST}>
                    <S.TextLinkButton>목록으로</S.TextLinkButton>
                  </Link>
                </S.ActionsColumn>
              </S.Card>
            </S.ActionsColumn>
          </S.Layout>
        )}
      </S.PageInner>
    </S.Page>
  );
}
