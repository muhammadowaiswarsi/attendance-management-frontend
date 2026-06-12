import { useCallback, useEffect, useMemo, useState } from 'react'
import { getHolidays } from '../../api/holidays'
import HolidayTable from '../../components/holidays/HolidayTable'
import UpcomingHolidays from '../../components/holidays/UpcomingHolidays'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { getUpcomingHolidays, getYearOptions, sortHolidaysByDate } from '../../utils/holidays'

const EmployeeHolidays = () => {
  const { showToast } = useToast()
  const yearOptions = getYearOptions()

  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(String(new Date().getFullYear()))

  const loadHolidays = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getHolidays(Number(year))
      setHolidays(sortHolidaysByDate(data))
    } catch {
      showToast('Failed to load holidays', 'error')
    } finally {
      setLoading(false)
    }
  }, [year, showToast])

  useEffect(() => {
    loadHolidays()
  }, [loadHolidays])

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
