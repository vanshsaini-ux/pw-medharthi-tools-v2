import { RoiYearPoint } from '@/tools/roiCalculator';

interface SalaryCurveChartProps {
  data: RoiYearPoint[];
}

const WIDTH = 560;
const HEIGHT = 220;
const PAD = 36;

export default function SalaryCurveChart({ data }: SalaryCurveChartProps) {
  const allValues = data.flatMap((d) => [d.withProgramInr, d.withoutProgramInr]);
  const max = Math.max(...allValues) * 1.1;
  const min = 0;

  const xFor = (year: number) => PAD + ((year - 1) / (data.length - 1)) * (WIDTH - PAD * 2);
  const yFor = (value: number) => HEIGHT - PAD - ((value - min) / (max - min)) * (HEIGHT - PAD * 2);

  const withPath = data.map((d) => `${xFor(d.year)},${yFor(d.withProgramInr)}`).join(' ');
  const withoutPath = data.map((d) => `${xFor(d.year)},${yFor(d.withoutProgramInr)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="5-year salary projection: with vs without the program">
      <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} stroke="#E7EAF0" strokeWidth="1" />
      <polyline points={withoutPath} fill="none" stroke="#9AA5BD" strokeWidth="2.5" strokeDasharray="5,4" />
      <polyline points={withPath} fill="none" stroke="#E8A33D" strokeWidth="3" />
      {data.map((d) => (
        <circle key={`with-${d.year}`} cx={xFor(d.year)} cy={yFor(d.withProgramInr)} r={4} fill="#E8A33D" />
      ))}
      {data.map((d) => (
        <text key={`label-${d.year}`} x={xFor(d.year)} y={HEIGHT - PAD + 16} textAnchor="middle" fontSize="10" fill="#152040" opacity="0.6">
          Yr {d.year}
        </text>
      ))}
      <g>
        <circle cx={WIDTH - PAD - 90} cy={14} r={4} fill="#E8A33D" />
        <text x={WIDTH - PAD - 80} y={18} fontSize="10" fill="#152040">With program</text>
        <circle cx={WIDTH - PAD - 90} cy={30} r={4} fill="#9AA5BD" />
        <text x={WIDTH - PAD - 80} y={34} fontSize="10" fill="#152040">Without</text>
      </g>
    </svg>
  );
}
