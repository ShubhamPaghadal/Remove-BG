import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis
} from 'recharts';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

function formatXAxisDate(tickItem) {
	return dayjs(tickItem).format('D MMM');
}

export function StatsChart({ stats }) {
	return (
		<CharWrapper>
			<ResponsiveContainer height={350} width="100%">
				<LineChart data={stats}>
					<XAxis
						axisLine={false}
						dataKey="date"
						tickFormatter={formatXAxisDate}
						tickLine={false}
						tickMargin={8}
					/>
					<YAxis
						allowDecimals={false}
						axisLine={false}
						tickLine={false}
						tickMargin={16}
					/>
					<CartesianGrid stroke="#E8E8E8" />
					<Line
						dataKey="credits"
						dot={{
							fill: '#A182F3',
							r: 4,
							stroke: 'rgba(161, 130, 243, 0.20)',
							strokeWidth: 8
						}}
						stroke="#A182F3"
					/>
				</LineChart>
			</ResponsiveContainer>
		</CharWrapper>
	);
}

const CharWrapper = styled('div')(({ theme }) => ({
	'& .recharts-cartesian-grid-vertical line': {
		stroke: theme.palette.text.disabled
	}
}));
