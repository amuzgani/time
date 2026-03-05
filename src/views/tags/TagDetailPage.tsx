import { ROUTE_PATHS } from "@/constants/route_paths";
import useTagDetailController from "@/views/tags/hooks/useTagDetailController";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ActionsRow,
  AlertError,
  ButtonGhost,
  Card,
  ColorDot,
  Field,
  FieldLabel,
  Form,
  Header,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitles,
  OutlineDangerButton,
  Page,
  PageInner,
  PreviewRow,
  PrimaryButton,
  SkeletonCard,
  TextInput,
} from "./TagDetailPage.styles";

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
    const name = String(formData.get("name") ?? "").trim();
    const color = String(formData.get("color") ?? "").trim();

    if (!name || !color) return;

    await onSave({ name, color });
  };

  return (
    <Page>
      <PageInner>
        <Header>
          <HeaderTitles>
            <HeaderTitle>태그 상세</HeaderTitle>
            <HeaderSubtitle>태그 이름과 색상을 관리합니다</HeaderSubtitle>
          </HeaderTitles>
          <Link to={ROUTE_PATHS.TAG_LIST}>
            <ButtonGhost type="button">목록으로</ButtonGhost>
          </Link>
        </Header>

        {isInitialLoading ? (
          <SkeletonCard />
        ) : errorMessage ? (
          <AlertError>
            <span>{errorMessage}</span>
            <button type="button" onClick={onRetry}>
              다시 시도
            </button>
          </AlertError>
        ) : !item ? (
          <Card>
            <p>해당 태그를 찾을 수 없습니다.</p>
            <Link to={ROUTE_PATHS.TAG_LIST}>목록으로</Link>
          </Card>
        ) : (
          <Card>
            <Form onSubmit={handleSubmit}>
              <Field>
                <FieldLabel>이름</FieldLabel>
                <TextInput
                  name="name"
                  defaultValue={item.name}
                  disabled={isActionLoading}
                />
              </Field>
              <Field>
                <FieldLabel>색상</FieldLabel>
                <TextInput
                  name="color"
                  defaultValue={item.color}
                  disabled={isActionLoading}
                />
              </Field>

              <PreviewRow>
                <ColorDot $color={item.color} />
                <span>{item.name}</span>
              </PreviewRow>

              <ActionsRow>
                <PrimaryButton type="submit" disabled={isActionLoading}>
                  저장
                </PrimaryButton>
                <OutlineDangerButton
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => {
                    void onDelete();
                  }}
                >
                  삭제
                </OutlineDangerButton>
              </ActionsRow>
            </Form>
          </Card>
        )}
      </PageInner>
    </Page>
  );
}
