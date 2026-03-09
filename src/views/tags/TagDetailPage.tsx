import { ROUTE_PATHS } from '@/constants/route_paths';
import useTagDetailController from '@/views/tags/hooks/useTagDetailController';
import { useCallback, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import S from './TagDetailPage.styles';

export default function TagDetailPage(): React.ReactNode {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.tagId);
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
    onDelete,
  } = useTagDetailController({
    id,
    isEnabled: isValidId,
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    if (!item) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const color = String(formData.get('color') ?? '').trim();

    if (!name || !color) return;

    await onSave({ name, color });
  };

  const handleDelete = useCallback(async () => {
    const isDeleted = await onDelete();

    if (isDeleted) {
      navigate(ROUTE_PATHS.TAG_LIST);
    }
  }, [navigate, onDelete]);

  return (
    <S.Page>
      <S.PageInner>
        <S.Header>
          <S.HeaderTitles>
            <S.HeaderTitle>태그 상세</S.HeaderTitle>
            <S.HeaderSubtitle>태그 이름과 색상을 관리합니다</S.HeaderSubtitle>
          </S.HeaderTitles>
          <Link to={ROUTE_PATHS.TAG_LIST}>
            <S.ButtonGhost type="button">목록으로</S.ButtonGhost>
          </Link>
        </S.Header>

        {isInitialLoading ? (
          <S.SkeletonCard />
        ) : errorMessage ? (
          <S.AlertError>
            <span>{errorMessage}</span>
            <button type="button" onClick={onRetry}>
              다시 시도
            </button>
          </S.AlertError>
        ) : !item ? (
          <S.Card>
            <p>해당 태그를 찾을 수 없습니다.</p>
            <Link to={ROUTE_PATHS.TAG_LIST}>목록으로</Link>
          </S.Card>
        ) : (
          <S.Card>
            <S.Form onSubmit={handleSubmit}>
              <S.Field>
                <S.FieldLabel>이름</S.FieldLabel>
                <S.TextInput
                  name="name"
                  defaultValue={item.name}
                  disabled={isActionLoading}
                />
              </S.Field>
              <S.Field>
                <S.FieldLabel>색상</S.FieldLabel>
                <S.TextInput
                  name="color"
                  defaultValue={item.color}
                  disabled={isActionLoading}
                />
              </S.Field>

              <S.PreviewRow>
                <S.ColorDot $color={item.color} />
                <span>{item.name}</span>
              </S.PreviewRow>

              <S.ActionsRow>
                <S.PrimaryButton type="submit" disabled={isActionLoading}>
                  저장
                </S.PrimaryButton>
                <S.OutlineDangerButton
                  type="button"
                  disabled={isActionLoading}
                  onClick={handleDelete}
                >
                  삭제
                </S.OutlineDangerButton>
              </S.ActionsRow>
            </S.Form>
          </S.Card>
        )}
      </S.PageInner>
    </S.Page>
  );
}
