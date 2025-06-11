"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, Users, Calendar, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSessionUser } from "@/components/context/Session"
import type { DoctorModel } from "../models/doctor"
import { useGetDoctorVisitPerformanceQuery } from "@/redux/api/doctorApi"

const DoctorVisitDashboard = () => {
  const { user }: { user?: DoctorModel } = useSessionUser()
  const doctor_id = user?._id || ""

  const { data: apiData, isLoading, error } = useGetDoctorVisitPerformanceQuery({ doctor_id })
  console.log("API Data:", apiData)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  if (error || !apiData?.success) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-medium">Unable to load visit data. Please try again later.</p>
      </div>
    )
  }

  const { totalCount, thisMonthCount, lastMonthCount, percentageChange } = apiData.data

  const chartData = [
    { name: "Last Month", visits: lastMonthCount, fill: "url(#tealGradient)" },
    { name: "This Month", visits: thisMonthCount, fill: "url(#tealGradient)" },
  ]

  const isPositiveGrowth = percentageChange >= 0
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Visits Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"> 
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide opacity-90">
              <Users className="h-5 w-5" aria-hidden="true" />
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold tracking-tight">{totalCount.toLocaleString()}</div>
            <p className="text-xs opacity-80 mt-1">All-time patient visits</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>

        {/* This Month Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide opacity-90">
              <Calendar className="h-5 w-5" aria-hidden="true" />
              {currentMonth}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold tracking-tight">{thisMonthCount.toLocaleString()}</div>
            <p className="text-xs opacity-80 mt-1">Current month visits</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>

        {/* Growth Rate Card */}
        <Card
          className={`relative overflow-hidden text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300 ${
            isPositiveGrowth
              ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
              : "bg-gradient-to-br from-red-500 to-red-600"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide opacity-90">
              <Activity className="h-5 w-5" aria-hidden="true" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {isPositiveGrowth ? (
                <TrendingUp className="h-7 w-7" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-7 w-7" aria-hidden="true" />
              )}
              <span className="text-4xl font-extrabold tracking-tight">{Math.abs(percentageChange).toFixed(1)}%</span>
            </div>
            <p className="text-xs opacity-80 mt-1">Compared to last month</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className=" bg-white/90 backdrop-blur-md rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 tracking-tight">
              Monthly Visit Comparison
            </CardTitle>
            <Badge
              variant={isPositiveGrowth ? "default" : "destructive"}
              className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium"
            >
              {isPositiveGrowth ? (
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-4 w-4" aria-hidden="true" />
              )}
              {Math.abs(percentageChange).toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: "#4b5563", fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: "#4b5563", fontWeight: 500 }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    padding: "10px",
                    fontSize: "14px",
                    color: "#1f2937",
                  }}
                  formatter={(value: number) => [value.toLocaleString(), "Visits"]}
                  labelStyle={{ fontWeight: 600, color: "#1f2937" }}
                />
                <Bar
                  dataKey="visits"
                  radius={[6, 6, 0, 0]}
                  className="drop-shadow-sm"
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DoctorVisitDashboard