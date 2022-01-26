import dynamic from "next/dynamic"
import Link from "next/link"
import { isLessonCompleted } from "../../utils/machineUtils"
import { Course } from "common"

const ProgressLine = dynamic(() => import("../Progress/ProgressLine"), {
  ssr: false,
})

const CompletedLesson = dynamic(() => import("../Progress/CompletedLesson"), {
  ssr: false,
})

const IncompleteLesson = dynamic(() => import("../Progress/IncompleteLesson"), {
  ssr: false,
})

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

type Props = {
  course: string
  content: Course
  progressService: object
}

export default function HomeProgress({
  course,
  content,
  progressService,
}: Props) {
  return (
    <nav aria-label="Progress" className="mt-12" data-test="course-progress">
      <ol className="overflow-hidden">
        {content?.lessons.map((lesson, index) => (
          <li
            data-test={`lesson-${index}`}
            key={lesson.title}
            className={classNames(
              index !== content?.lessons.length - 1 ? "pb-10" : "",
              "relative"
            )}
          >
            {/* Solid Line that connects the checkmarks */}
            <ProgressLine
              index={index}
              lessons={content.lessons}
              isCompleted={isLessonCompleted(
                progressService,
                `${course}/${lesson.slug}`
              )}
            />

            <div className="group relative flex items-start">
              {isLessonCompleted(
                progressService,
                `${course}/${lesson.slug}`
              ) && <CompletedLesson index={index} />}

              {!isLessonCompleted(
                progressService,
                `${course}/${lesson.slug}`
              ) && <IncompleteLesson index={index} />}

              {/* Lesson Title */}
              <span className="ml-4 flex min-w-0 flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  <Link href={`/${course}/${lesson.slug}`}>
                    <a data-test={`lesson-progress-link-${index}`}>
                      {lesson.title}
                    </a>
                  </Link>
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
