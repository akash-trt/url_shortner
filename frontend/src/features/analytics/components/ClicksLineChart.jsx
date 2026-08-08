import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function ClicksLineChart({ data }) {
  const allZero = data.every((d) => d.clicks === 0);

  return (
    <div className="h-[220px] w-full">
      {allZero ? (
        <div className="grid h-full place-items-center font-mono text-[12px] text-ink-300">
          No clicks in this window yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14130f" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#14130f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e2ddd2" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6f6b62" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#6f6b62" }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: "1px solid #e2ddd2",
                fontSize: 12.5,
                boxShadow: "3px 3px 0 0 #14130f",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 2 }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#14130f"
              strokeWidth={2}
              fill="url(#clicksFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
