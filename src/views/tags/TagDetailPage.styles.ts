import styled from 'styled-components';

export const Page = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
`;

export const PageInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ButtonGhost = styled.button`
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
`;

export const Card = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const SkeletonCard = styled(Card)`
  min-height: 160px;
`;

export const AlertError = styled.div`
  background-color: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
`;

export const FieldLabel = styled.span`
  font-weight: 500;
`;

export const TextInput = styled.input`
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const ColorDot = styled.span<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background-color: ${({ $color }) => $color};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PrimaryButton = styled.button`
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: #ffffff;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const OutlineDangerButton = styled.button`
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.danger};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  cursor: pointer;
`;

const S = {
  Page,
  PageInner,
  Header,
  HeaderTitles,
  HeaderTitle,
  HeaderSubtitle,
  ButtonGhost,
  Card,
  SkeletonCard,
  AlertError,
  Form,
  Field,
  FieldLabel,
  TextInput,
  PreviewRow,
  ColorDot,
  ActionsRow,
  PrimaryButton,
  OutlineDangerButton,
} as const;

export default S;
