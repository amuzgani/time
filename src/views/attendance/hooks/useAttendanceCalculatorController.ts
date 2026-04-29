import { useMemo, useState, useCallback } from 'react';
import AttendanceSummaryViewModel, {
  createAttendanceSummaryViewModel,
} from '@/view_models/attendance/AttendanceSummaryViewModel';

function parseNonNegativeCount(value: string): number {
  const trimmed = value.trim();

  if (trimmed === '') {
    return 0;
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

export interface UseAttendanceCalculatorControllerReturn {
  readonly annualLeaveInput: string;
  readonly halfDayInput: string;
  readonly quarterHalfDayInput: string;
  readonly onAnnualLeaveInputChange: (value: string) => void;
  readonly onHalfDayInputChange: (value: string) => void;
  readonly onQuarterHalfDayInputChange: (value: string) => void;
  readonly summary: AttendanceSummaryViewModel;
}

export default function useAttendanceCalculatorController(): UseAttendanceCalculatorControllerReturn {
  const [annualLeaveInput, setAnnualLeaveInput] = useState('');
  const [halfDayInput, setHalfDayInput] = useState('');
  const [quarterHalfDayInput, setQuarterHalfDayInput] = useState('');

  const summary = useMemo((): AttendanceSummaryViewModel => {
    const annualLeaveCount = parseNonNegativeCount(annualLeaveInput);
    const halfDayCount = parseNonNegativeCount(halfDayInput);
    const quarterHalfDayCount = parseNonNegativeCount(quarterHalfDayInput);

    return createAttendanceSummaryViewModel({
      annualLeaveCount,
      halfDayCount,
      quarterHalfDayCount,
    });
  }, [annualLeaveInput, halfDayInput, quarterHalfDayInput]);

  const onAnnualLeaveInputChange = useCallback((value: string): void => {
    setAnnualLeaveInput(value);
  }, []);

  const onHalfDayInputChange = useCallback((value: string): void => {
    setHalfDayInput(value);
  }, []);

  const onQuarterHalfDayInputChange = useCallback((value: string): void => {
    setQuarterHalfDayInput(value);
  }, []);

  return {
    annualLeaveInput,
    halfDayInput,
    quarterHalfDayInput,
    onAnnualLeaveInputChange,
    onHalfDayInputChange,
    onQuarterHalfDayInputChange,
    summary,
  };
}
