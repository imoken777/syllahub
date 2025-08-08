'use client';

import type { CourseModel } from '@/types/course';
import type { Semester } from '@/types/searchOptions';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const SPRING_TIMETABLE_STORAGE_KEY = 'spring-timetable';
const FALL_TIMETABLE_STORAGE_KEY = 'fall-timetable';
const SELECTED_SEMESTER_STORAGE_KEY = 'selected-semester';

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
  syncWithSearchFilter: (searchSemester: Semester | undefined) => void; // 検索フィルタとの連携用
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ローカルストレージから読み込み
  useEffect(() => {
    if (!isClient) return;

    // 旧形式のデータ移行処理
    const oldTimetableData = localStorage.getItem('my-timetable');
    if (oldTimetableData) {
      try {
        const parsed: CourseModel[] = JSON.parse(oldTimetableData);
        const springCourses = parsed.filter((c) => c.semester === '春学期');
        const fallCourses = parsed.filter((c) => c.semester === '秋学期');

        if (springCourses.length > 0) {
          setSpringTimetable(springCourses);
          localStorage.setItem(SPRING_TIMETABLE_STORAGE_KEY, JSON.stringify(springCourses));
        }
        if (fallCourses.length > 0) {
          setFallTimetable(fallCourses);
          localStorage.setItem(FALL_TIMETABLE_STORAGE_KEY, JSON.stringify(fallCourses));
        }

        // 移行完了後、旧データを削除
        localStorage.removeItem('my-timetable');
      } catch (e) {
        console.error('Failed to migrate old timetable data:', e);
      }
    }

    // 春学期の時間割データの読み込み
    const storedSpring = localStorage.getItem(SPRING_TIMETABLE_STORAGE_KEY);
    if (storedSpring) {
      try {
        const parsed: CourseModel[] = JSON.parse(storedSpring);
        setSpringTimetable(parsed);
      } catch (e) {
        console.error('Failed to parse spring timetable from localStorage:', e);
      }
    }

    // 秋学期の時間割データの読み込み
    const storedFall = localStorage.getItem(FALL_TIMETABLE_STORAGE_KEY);
    if (storedFall) {
      try {
        const parsed: CourseModel[] = JSON.parse(storedFall);
        setFallTimetable(parsed);
      } catch (e) {
        console.error('Failed to parse fall timetable from localStorage:', e);
      }
    }

    // 選択された学期の読み込み
    const storedSemester = localStorage.getItem(SELECTED_SEMESTER_STORAGE_KEY);
    if (storedSemester) {
      try {
        const parsed = JSON.parse(storedSemester);
        setSelectedSemester(parsed);
      } catch (e) {
        console.error('Failed to parse selected semester from localStorage:', e);
      }
    }
  }, [isClient]);

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
      if (!isClient) return;

      if (semester === '春学期') {
        setSpringTimetable((prev) => {
          const newTimetable = updater(prev);
          localStorage.setItem(SPRING_TIMETABLE_STORAGE_KEY, JSON.stringify(newTimetable));
          return newTimetable;
        });
      } else if (semester === '秋学期') {
        setFallTimetable((prev) => {
          const newTimetable = updater(prev);
          localStorage.setItem(FALL_TIMETABLE_STORAGE_KEY, JSON.stringify(newTimetable));
          return newTimetable;
        });
      }
    },
    [isClient],
  );

  // 選択された学期を更新してローカルストレージに保存
  const updateSelectedSemester = useCallback(
    (semester: Semester | null) => {
      if (!isClient) return;
      setSelectedSemester(semester);
      if (semester) {
        localStorage.setItem(SELECTED_SEMESTER_STORAGE_KEY, JSON.stringify(semester));
      } else {
        localStorage.removeItem(SELECTED_SEMESTER_STORAGE_KEY);
      }
    },
    [isClient],
  );

  // 選択された学期でフィルタリングされた時間割
  const filteredTimetable = useMemo(
    () =>
      selectedSemester
        ? timetable.filter((course: CourseModel) => course.semester === selectedSemester)
        : timetable,
    [selectedSemester, timetable],
  );

  // 検索フィルタとの連携機能
  const syncWithSearchFilter = useCallback(
    (searchSemester: Semester | undefined) => {
      // 検索フィルタで学期が選択された場合は、時間割の表示もその学期に合わせる
      if (searchSemester && searchSemester !== selectedSemester) {
        updateSelectedSemester(searchSemester);
      }
    },
    [selectedSemester, updateSelectedSemester],
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
    syncWithSearchFilter,
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
