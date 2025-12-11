'use client';

import type { CourseModel } from '@/types/course';
import { courseModelSchema } from '@/types/course';
import type { Semester } from '@/types/searchOptions';
import { getFromStorage, saveToStorage } from '@/utils/localStorage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as v from 'valibot';

const SPRING_TIMETABLE_STORAGE_KEY = 'spring-timetable';
const FALL_TIMETABLE_STORAGE_KEY = 'fall-timetable';

const courseModelArraySchema = v.array(courseModelSchema);

type CourseStatus =
  | {
      isInTimetable: boolean;
      hasTimeConflict: boolean;
      canAdd: true;
    }
  | {
      isInTimetable: boolean;
      hasTimeConflict: boolean;
      canAdd: false;
      reason?: 'already_added' | 'time_conflict' | 'invalid_schedule' | 'duplicate_course';
    };

type TimetableContextValue = {
  timetable: CourseModel[];
  filteredTimetable: CourseModel[]; // 選択された学期でフィルタリングされた時間割
  selectedSemester: Semester | null;
  setSelectedSemester: (semester: Semester | null) => void;
  getCourseStatus: (course: CourseModel) => CourseStatus;
  addCourseToTimetable: (course: CourseModel) => boolean; // 成功/失敗を返す
  removeCourseFromTimetable: (course: CourseModel) => boolean; // 成功/失敗を返す
};

const TimetableContext = createContext<TimetableContextValue | undefined>(undefined);

type TimetableProviderProps = {
  children: React.ReactNode;
};

export const TimetableProvider = ({ children }: TimetableProviderProps) => {
  const [springTimetable, setSpringTimetable] = useState<CourseModel[]>([]);
  const [fallTimetable, setFallTimetable] = useState<CourseModel[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

  // ローカルストレージから読み込み
  useEffect(() => {
    // 春学期の時間割データの読み込み
    const storedSpringResult = getFromStorage(SPRING_TIMETABLE_STORAGE_KEY, courseModelArraySchema);
    storedSpringResult.match(
      (parsed) => setSpringTimetable(parsed ?? []),
      (error) => {
        console.error('Failed to parse spring timetable from localStorage:', error);
      },
    );

    // 秋学期の時間割データの読み込み
    const storedFallResult = getFromStorage(FALL_TIMETABLE_STORAGE_KEY, courseModelArraySchema);
    storedFallResult.match(
      (parsed) => setFallTimetable(parsed ?? []),
      (error) => {
        console.error('Failed to parse fall timetable from localStorage:', error);
      },
    );
  }, []);

  // 全時間割（春学期 + 秋学期）
  const timetable = useMemo(
    () => [...springTimetable, ...fallTimetable],
    [springTimetable, fallTimetable],
  );

  const isValidCourseSchedule = (course: CourseModel): boolean =>
    course.day !== null && course.period !== null;

  const isCourseInTimetable = (course: CourseModel, courses: CourseModel[]): boolean =>
    courses.some((c) => c.courseId === course.courseId);

  const hasCourseTimeConflict = (course: CourseModel, courses: CourseModel[]): boolean =>
    courses.some(
      (c) => c.day === course.day && c.period === course.period && c.courseId !== course.courseId,
    );

  // 学期ごとの時間割を保存
  const saveSemesterTimetable = useCallback(
    (semester: Semester, updater: (prev: CourseModel[]) => CourseModel[]) => {
      if (semester === '春学期') {
        setSpringTimetable((prev) => {
          const newTimetable = updater(prev);
          saveToStorage(SPRING_TIMETABLE_STORAGE_KEY, newTimetable, courseModelArraySchema).match(
            () => {
              // 保存成功
            },
            (error) => {
              console.error('Failed to save spring timetable to localStorage:', error);
            },
          );
          return newTimetable;
        });
      } else if (semester === '秋学期') {
        setFallTimetable((prev) => {
          const newTimetable = updater(prev);
          saveToStorage(FALL_TIMETABLE_STORAGE_KEY, newTimetable, courseModelArraySchema).match(
            () => {
              // 保存成功
            },
            (error) => {
              console.error('Failed to save fall timetable to localStorage:', error);
            },
          );
          return newTimetable;
        });
      }
    },
    [],
  );

  const updateSelectedSemester = useCallback((semester: Semester | null) => {
    setSelectedSemester(semester);
  }, []);

  // 選択された学期でフィルタリングされた時間割
  const filteredTimetable = useMemo(
    () =>
      selectedSemester
        ? timetable.filter((course: CourseModel) => course.semester === selectedSemester)
        : timetable,
    [selectedSemester, timetable],
  );

  const addCourseToTimetable = useCallback(
    (course: CourseModel): boolean => {
      if (!isValidCourseSchedule(course)) {
        console.warn('Invalid course schedule', course);
        return false;
      }

      if (isCourseInTimetable(course, timetable)) {
        console.warn('Course is already in timetable', course);
        return false;
      }

      // 同じ学期の講義でのみ時間競合をチェック
      const sameSemesterCourses = timetable.filter(
        (c: CourseModel) => c.semester === course.semester,
      );
      if (hasCourseTimeConflict(course, sameSemesterCourses)) {
        console.warn('Time conflict detected', course);
        return false;
      }

      // 学期ごとに保存
      saveSemesterTimetable(course.semester, (prev) => [...prev, course]);
      return true;
    },
    [saveSemesterTimetable, timetable],
  );

  const removeCourseFromTimetable = useCallback(
    (course: CourseModel): boolean => {
      if (!isValidCourseSchedule(course)) {
        console.warn('Invalid course schedule', course);
        return false;
      }

      if (!isCourseInTimetable(course, timetable)) {
        console.warn('Course is not in timetable', course);
        return false;
      }

      // 学期ごとに削除
      saveSemesterTimetable(course.semester, (prev) =>
        prev.filter((c) => c.courseId !== course.courseId),
      );
      return true;
    },
    [saveSemesterTimetable, timetable],
  );

  const getCourseStatus = useCallback(
    (course: CourseModel): CourseStatus => {
      if (!isValidCourseSchedule(course)) {
        return {
          isInTimetable: false,
          hasTimeConflict: false,
          canAdd: false,
          reason: 'invalid_schedule',
        };
      }

      if (isCourseInTimetable(course, timetable)) {
        return {
          isInTimetable: true,
          hasTimeConflict: false,
          canAdd: false,
          reason: 'already_added',
        };
      }

      // 同じ学期の講義でのみ時間競合をチェック
      const sameSemesterCourses = timetable.filter(
        (c: CourseModel) => c.semester === course.semester,
      );
      if (hasCourseTimeConflict(course, sameSemesterCourses)) {
        return {
          isInTimetable: false,
          hasTimeConflict: true,
          canAdd: false,
          reason: 'time_conflict',
        };
      }

      return {
        isInTimetable: false,
        hasTimeConflict: false,
        canAdd: true,
      };
    },
    [timetable],
  );

  const value: TimetableContextValue = {
    timetable,
    filteredTimetable,
    selectedSemester,
    setSelectedSemester: updateSelectedSemester,
    getCourseStatus,
    addCourseToTimetable,
    removeCourseFromTimetable,
  };

  return <TimetableContext.Provider value={value}>{children}</TimetableContext.Provider>;
};

export const useTimetableContext = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetableContext must be used within a TimetableProvider');
  }
  return context;
};
