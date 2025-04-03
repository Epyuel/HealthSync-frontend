"use client"
import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetStatInfoQuery } from "@/redux/api/adminApi"
import type { TooltipProps } from "recharts"

const getMonthName = (monthNum: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[monthNum - 1]
}

export default function DashGraph() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())

  const years = ["2021", "2022", "2023", "2024", "2025"]

  const { data, isLoading } = useGetStatInfoQuery(
    { year: Number(selectedYear) },
    { refetchOnMountOrArgChange: true },
  )

  const backendData = data?.data


  // Process the data for the chart
  const chartData = backendData
    ? backendData.map((item: { month: number; patients: any; doctors: any }) => ({
        month: getMonthName(item.month),
        patients: item.patients,
        doctors: item.doctors,
      }))
    : []

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-md text-sm border border-gray-200">
          <p className="font-medium mb-1">{payload[0]?.payload.month}</p>
          <p className="text-emerald-600 flex items-center">
            <span className="w-3 h-3 inline-block bg-emerald-500 rounded-full mr-2"></span>
            Patients: {payload[0]?.value}
          </p>
          <p className="text-violet-600 flex items-center">
            <span className="w-3 h-3 inline-block bg-violet-500 rounded-full mr-2"></span>
            Doctors: {payload[1]?.value}
          </p>
        </div>
      )
    }
    return null
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  return (
    <div className="w-full p-6 shadow-lg rounded-lg bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-lg font-semibold mb-2 sm:mb-0">Patient & Doctor Engagement in {selectedYear}</h2>
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="mb-4 w-[120px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2.5"></div>
            <div className="h-64 w-full bg-gray-100 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="doctors"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

