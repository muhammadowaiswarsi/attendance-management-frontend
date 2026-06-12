import { formatHolidayDateShort } from '../../utils/holidays'

const UpcomingHolidays = ({ holidays = [] }) => {
  if (holidays.length === 0) {
    return (
      <div className="upcoming-holidays upcoming-holidays--empty">
        <div className="upcoming-holidays__header">
          <h3>Upcoming Holidays</h3>
        </div>
        <p>No upcoming holidays scheduled.</p>
      </div>
    )
  }

  return (
    <section className="upcoming-holidays">
      <div className="upcoming-holidays__header">
        <h3>Upcoming Holidays</h3>
        <span className="upcoming-holidays__count">{holidays.length} scheduled</span>
      </div>

      <div className="upcoming-holidays__grid">
        {holidays.map((holiday) => {
          const parts = formatHolidayDateShort(holiday.date)
          return (
            <article key={holiday.id} className="upcoming-holiday-card">
              <div className="upcoming-holiday-card__date">
                <span className="upcoming-holiday-card__day">{parts.day}</span>
                <span className="upcoming-holiday-card__month">{parts.month}</span>
                <span className="upcoming-holiday-card__weekday">{parts.weekday}</span>
              </div>
              <div className="upcoming-holiday-card__body">
                <h4>{holiday.name}</h4>
                <p>{holiday.description || 'Official company holiday'}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default UpcomingHolidays
