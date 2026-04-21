import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "../components/layout/AppShell";
import {
  fetchAlertCount,
  fetchAlerts,
  fetchAvgTemperature,
  fetchAvgVibration,
  fetchSensorReadings,
} from "../features/dashboard/api";
import { useQuery } from "@tanstack/react-query";

const PIE_COLORS = ["#ef4444", "#f59e0b", "#06b6d4", "#22c55e"];

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getAlertTone(alertType: string) {
  if (alertType.includes("TEMPERATURE")) {
    return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300";
  }

  if (alertType.includes("VIBRATION")) {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
  }

  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300";
}

function getReadingStatus(
  temperature: number,
  vibration: number
): { label: string; classes: string } {
  if (temperature > 85 || vibration > 3) {
    return {
      label: "Critical",
      classes:
        "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    };
  }

  if (temperature > 78 || vibration > 2.5) {
    return {
      label: "Warning",
      classes:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    };
  }

  return {
    label: "Normal",
    classes:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  };
}

export default function DashboardPage() {
  const {
    data: readings = [],
    isLoading: readingsLoading,
  } = useQuery({
    queryKey: ["sensor-readings"],
    queryFn: fetchSensorReadings,
    refetchInterval: 3000,
  });

  const {
    data: alerts = [],
    isLoading: alertsLoading,
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
    refetchInterval: 3000,
  });

  const { data: avgTemperature = [] } = useQuery({
    queryKey: ["avg-temperature"],
    queryFn: fetchAvgTemperature,
    refetchInterval: 5000,
  });

  const { data: avgVibration = [] } = useQuery({
    queryKey: ["avg-vibration"],
    queryFn: fetchAvgVibration,
    refetchInterval: 5000,
  });

  const { data: alertCount = [] } = useQuery({
    queryKey: ["alert-count"],
    queryFn: fetchAlertCount,
    refetchInterval: 5000,
  });

  const latestReadings = [...readings].slice(0, 8);

  const totalMachines = new Set(readings.map((item) => item.device_id)).size;

  const avgTemperatureValue =
    readings.length > 0
      ? (
          readings.reduce((sum, item) => sum + item.temperature, 0) /
          readings.length
        ).toFixed(1)
      : "0.0";

  const avgVibrationValue =
    readings.length > 0
      ? (
          readings.reduce((sum, item) => sum + item.vibration, 0) /
          readings.length
        ).toFixed(2)
      : "0.00";

  const activeAlertsValue = alerts.length;

  const chartData = [...readings]
    .slice()
    .reverse()
    .slice(-12)
    .map((item) => ({
      time: formatTime(item.timestamp),
      temperature: item.temperature,
      vibration: item.vibration,
    }));

  const pieData = alertCount.map((item) => ({
    name: item.alert_type,
    value: item.count,
  }));

  const kpis = [
    {
      label: "Total Machines",
      value: String(totalMachines),
      tone: "from-cyan-500/10 to-cyan-500/0",
    },
    {
      label: "Avg Temperature",
      value: `${avgTemperatureValue}°C`,
      tone: "from-sky-500/10 to-sky-500/0",
    },
    {
      label: "Avg Vibration",
      value: `${avgVibrationValue} mm/s`,
      tone: "from-violet-500/10 to-violet-500/0",
    },
    {
      label: "Active Alerts",
      value: String(activeAlertsValue),
      tone: "from-rose-500/10 to-rose-500/0",
    },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle="Real-time industrial monitoring overview"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <div
              key={item.label}
              className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${item.tone} bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900`}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="mt-3 text-4xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Live Sensor Trends</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Auto refresh: 3s
              </span>
            </div>

            <div className="h-80 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="vibration"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Recent Alerts</h3>
              <span className="text-sm text-cyan-500 dark:text-cyan-400">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {alertsLoading ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Loading alerts...
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  No alerts yet.
                </div>
              ) : (
                alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-2xl border px-4 py-3 text-sm ${getAlertTone(
                      alert.alert_type
                    )}`}
                  >
                    <p className="font-semibold">{alert.alert_type}</p>
                    <p className="mt-1 opacity-90">
                      {alert.device_id} · {alert.zone}
                    </p>
                    <p className="mt-1 text-xs opacity-80">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Avg Temperature by Machine</h3>
            </div>

            <div className="h-72 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={avgTemperature}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device_id" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avg_temperature"
                    stroke="#06b6d4"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Avg Vibration by Zone</h3>
            </div>

            <div className="h-72 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={avgVibration}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avg_vibration"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Alert Distribution</h3>
            </div>

            <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Live Sensor Readings</h3>
            <span className="text-sm text-cyan-500 dark:text-cyan-400">
              Auto refresh active
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Temperature</th>
                  <th className="px-4 py-3">Vibration</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {readingsLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-slate-500 dark:text-slate-400"
                    >
                      Loading readings...
                    </td>
                  </tr>
                ) : latestReadings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-slate-500 dark:text-slate-400"
                    >
                      No readings available.
                    </td>
                  </tr>
                ) : (
                  latestReadings.map((row) => {
                    const status = getReadingStatus(
                      row.temperature,
                      row.vibration
                    );

                    return (
                      <tr
                        key={row.id}
                        className="border-t border-slate-200 dark:border-slate-800"
                      >
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                          {row.device_id}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                          {row.zone}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                          {row.temperature}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                          {row.vibration}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                          {formatTime(row.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${status.classes}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}