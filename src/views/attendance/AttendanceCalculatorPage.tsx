import useAttendanceCalculatorController from '@/views/attendance/hooks/useAttendanceCalculatorController';
import { useCallback } from 'react';
import S from './AttendanceCalculatorPage.styles';

export default function AttendanceCalculatorPage(): React.ReactNode {
  const {
    annualLeaveInput,
    halfDayInput,
    quarterHalfDayInput,
    onAnnualLeaveInputChange,
    onHalfDayInputChange,
    onQuarterHalfDayInputChange,
    summary,
  } = useAttendanceCalculatorController();

  const handleAnnualChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onAnnualLeaveInputChange(event.target.value);
    },
    [onAnnualLeaveInputChange],
  );

  const handleHalfChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onHalfDayInputChange(event.target.value);
    },
    [onHalfDayInputChange],
  );

  const handleQuarterHalfChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        onQuarterHalfDayInputChange(event.target.value);
      },
      [onQuarterHalfDayInputChange],
    );

  return (
    <S.Page>
      <S.PageInner>
        <S.Header>
          <S.HeaderTitle>근태 시간 계산</S.HeaderTitle>
          <S.HeaderSubtitle>
            연차·반차·반반차 개수를 입력하면 근무시간 합계를 계산합니다.
          </S.HeaderSubtitle>
        </S.Header>

        <S.Card>
          <S.CardTitle>잔여 휴가 입력</S.CardTitle>

          <S.FieldRow>
            <S.FieldLabel htmlFor="annual-leave">연차 개수</S.FieldLabel>
            <S.FieldHint>1일당 9시간</S.FieldHint>
            <S.NumberInput
              id="annual-leave"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="0"
              value={annualLeaveInput}
              onChange={handleAnnualChange}
            />
          </S.FieldRow>

          <S.FieldRow>
            <S.FieldLabel htmlFor="half-day">반차 개수</S.FieldLabel>
            <S.FieldHint>1회당 4시간</S.FieldHint>
            <S.NumberInput
              id="half-day"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="0"
              value={halfDayInput}
              onChange={handleHalfChange}
            />
          </S.FieldRow>

          <S.FieldRow>
            <S.FieldLabel htmlFor="quarter-half-day">반반차 개수</S.FieldLabel>
            <S.FieldHint>1회당 2시간</S.FieldHint>
            <S.NumberInput
              id="quarter-half-day"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="0"
              value={quarterHalfDayInput}
              onChange={handleQuarterHalfChange}
            />
          </S.FieldRow>

          <S.TotalSection>
            <div>
              <S.TotalLabel>총 근무시간 (합계)</S.TotalLabel>
              <S.TotalValue>{summary.totalHoursLabel}</S.TotalValue>
            </div>
            <S.BreakdownList>
              <S.BreakdownItem>
                <span>연차 구간 ({summary.annualLeaveCount}일 × 9시간)</span>
                <span>{summary.annualLeaveHours}시간</span>
              </S.BreakdownItem>
              <S.BreakdownItem>
                <span>반차 구간 ({summary.halfDayCount}회 × 4시간)</span>
                <span>{summary.halfDayHours}시간</span>
              </S.BreakdownItem>
              <S.BreakdownItem>
                <span>반반차 구간 ({summary.quarterHalfDayCount}회 × 2시간)</span>
                <span>{summary.quarterHalfDayHours}시간</span>
              </S.BreakdownItem>
            </S.BreakdownList>
          </S.TotalSection>
        </S.Card>
      </S.PageInner>
    </S.Page>
  );
}
