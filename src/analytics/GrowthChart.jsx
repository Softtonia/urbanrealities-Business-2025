import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel'; // Corrected line
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';

export default function GrowthChart() {
  const [seriesNb, setSeriesNb] = React.useState(2);
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const handleItemNbChange = (event, newValue) => {
    setItemNb(newValue);
  };

  const handleSeriesNbChange = (event, newValue) => {
    setSeriesNb(newValue);
  };

  const series = [
    {
      label: '258 Active',
      data: [
        2423, 2210, 764, 1879, 1478, 1373, 1891, 2171, 620, 1269, 724, 1707, 1188,
        1879, 626, 1635, 2177, 516, 1793, 1598,
      ],
      color: '#FB6A18', // Set the background color for series 1
    },
    {
      label: '258 Closed',
      data: [
        2362, 2254, 1962, 1336, 586, 1069, 2194, 1629, 2173, 2031, 1757, 862, 2446,
        910, 2430, 2300, 805, 1835, 1684, 2197,
      ],
      color: '#F5AA7F', // Set the background color for series 1

    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <BarChart
        height={300}
        series={series
          .slice(0, seriesNb)
          .map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
        skipAnimation={skipAnimation}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={skipAnimation}
            onChange={(event) => setSkipAnimation(event.target.checked)}
          />
        }
        label="Skip Animation"
        labelPlacement="end"
      />
      <Typography id="input-item-number" gutterBottom>
        Number of items
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={20}
        aria-labelledby="input-item-number"
      />
      <Typography id="input-series-number" gutterBottom>
        Number of series
      </Typography>
      <Slider
        value={seriesNb}
        onChange={handleSeriesNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={2}
        aria-labelledby="input-series-number"
      />
    </Box>
  );
}
