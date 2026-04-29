import { AttendanceLeaveHoursPerUnit } from '@/constants/attendance_leave_hours';
import BaseViewModel from '@/view_models/BaseViewModel';

/** 연차/반차/반반차 개수 입력(표현 계층용, Entity 없음) */
export interface AttendanceLeaveCountsInput {
  readonly annualLeaveCount: number;
  readonly halfDayCount: number;
  readonly quarterHalfDayCount: number;
}

interface AttendanceSummaryViewModelProps {
  readonly annualLeaveCount: number;
  readonly halfDayCount: number;
  readonly quarterHalfDayCount: number;
  readonly annualLeaveHours: number;
  readonly halfDayHours: number;
  readonly quarterHalfDayHours: number;
  readonly totalHours: number;
  readonly totalHoursLabel: string;
}

export default class AttendanceSummaryViewModel extends BaseViewModel {
  readonly annualLeaveCount: number;
  readonly halfDayCount: number;
  readonly quarterHalfDayCount: number;
  readonly annualLeaveHours: number;
  readonly halfDayHours: number;
  readonly quarterHalfDayHours: number;
  readonly totalHours: number;
  readonly totalHoursLabel: string;

  constructor(props: AttendanceSummaryViewModelProps) {
    super();

    this.annualLeaveCount = props.annualLeaveCount;
    this.halfDayCount = props.halfDayCount;
    this.quarterHalfDayCount = props.quarterHalfDayCount;
    this.annualLeaveHours = props.annualLeaveHours;
    this.halfDayHours = props.halfDayHours;
    this.quarterHalfDayHours = props.quarterHalfDayHours;
    this.totalHours = props.totalHours;
    this.totalHoursLabel = props.totalHoursLabel;
  }
}

export function createAttendanceSummaryViewModel(
  input: AttendanceLeaveCountsInput,
): AttendanceSummaryViewModel {
  const annualLeaveHours = input.annualLeaveCount * AttendanceLeaveHoursPerUnit.ANNUAL;
  const halfDayHours =
    input.halfDayCount * AttendanceLeaveHoursPerUnit.HALF_DAY;
  const quarterHalfDayHours =
    input.quarterHalfDayCount * AttendanceLeaveHoursPerUnit.QUARTER_HALF_DAY;
  const totalHours = annualLeaveHours + halfDayHours + quarterHalfDayHours;

  return new AttendanceSummaryViewModel({
    annualLeaveCount: input.annualLeaveCount,
    halfDayCount: input.halfDayCount,
    quarterHalfDayCount: input.quarterHalfDayCount,
    annualLeaveHours,
    halfDayHours,
    quarterHalfDayHours,
    totalHours,
    totalHoursLabel: `${totalHours}시간`,
  });
}
