import { useMemo, useState } from 'react'
import { getHolidays } from '../../api/holidays'
import HolidayTable from '../../components/holidays/HolidayTable'
import UpcomingHolidays from '../../components/holidays/UpcomingHolidays'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import useCachedResource from '../../hooks/useCachedResource'
import { getUpcomingHolidays, getYearOptions, sortHolidaysByDate } from '../../utils/holidays'
import { CACHE_KEYS } from '../../utils/pageCache'

const EmployeeHolidays = () => {
  const { showToast } = useToast()
  const yearOptions = getYearOptions()
  const [year, setYear] = useState(String(new Date().getFullYear()))

  const { data: holidays = [], loading } = useCachedResource(
    CACHE_KEYS.holidays(year),
    async () => {
      try {
        const data = await getHolidays(Number(year))
        return sortHolidaysByDate(data)
      } catch {
        showToast('Failed to load holidays', 'error')
        throw new Error('Failed to load holidays')
      }
    }
  )

  const upcomingHolidays = useMemo(() => getUpcomingHolidays(holidays), [holidays])

  return (
    <div className="holidays-page">
      <PageHeader
        title="Holidays"
        subtitle="View upcoming company holidays and official days off"
      />

      <UpcomingHolidays holidays={upcomingHolidays} />

      <div className="employees-panel">
        <div className="holiday-filters">
          <label htmlFor="employee-holiday-year" className="holiday-filters__label">
            Year
          </label>
          <select
            id="employee-holiday-year"
            className="attendance-filters__select holiday-filters__select"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            {yearOptions.map((optionYear) => (
              <option key={optionYear} value={optionYear}>
                {optionYear}
              </option>
            ))}
          </select>
        </div>

        <HolidayTable holidays={holidays} loading={loading} readOnly />
      </div>
    </div>
  )
}

export default EmployeeHolidays
